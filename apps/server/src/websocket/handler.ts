import type { WebSocket } from 'ws';
import { WS_EVENTS } from '@collabflow/shared';
import type { WSMessage, PresenceUser } from '@collabflow/types';
import { getPresenceColor } from '@collabflow/utils';

// ─── Room Management ────────────────────────────────────
interface ConnectedClient {
  ws: WebSocket;
  userId: string;
  name: string;
  roomId: string;
  presence: PresenceUser;
}

const rooms = new Map<string, Map<string, ConnectedClient>>();

function broadcastToRoom(roomId: string, message: WSMessage, excludeUserId?: string) {
  const room = rooms.get(roomId);
  if (!room) return;

  const payload = JSON.stringify(message);
  for (const [userId, client] of room) {
    if (userId !== excludeUserId && client.ws.readyState === 1) {
      client.ws.send(payload);
    }
  }
}

function getPresenceList(roomId: string): PresenceUser[] {
  const room = rooms.get(roomId);
  if (!room) return [];
  return Array.from(room.values()).map((c) => c.presence);
}

export function handleWebSocket(ws: WebSocket, request: { url?: string }) {
  let currentClient: ConnectedClient | null = null;

  ws.on('message', (rawData) => {
    try {
      const message: WSMessage = JSON.parse(rawData.toString());

      switch (message.type) {
        case WS_EVENTS.JOIN_ROOM: {
          const { roomId, userId } = message;
          const name = (message.payload as { name?: string })?.name || 'Anonymous';

          // Create room if it doesn't exist
          if (!rooms.has(roomId)) {
            rooms.set(roomId, new Map());
          }

          const presence: PresenceUser = {
            userId,
            name,
            color: getPresenceColor(userId),
            isTyping: false,
            lastSeen: Date.now(),
            page: roomId,
          };

          currentClient = { ws, userId, name, roomId, presence };
          rooms.get(roomId)!.set(userId, currentClient);

          // Send current presence state to the new user
          const syncMessage: WSMessage<PresenceUser[]> = {
            type: 'presence_sync',
            roomId,
            userId: 'server',
            payload: getPresenceList(roomId),
            timestamp: Date.now(),
          };
          ws.send(JSON.stringify(syncMessage));

          // Broadcast join to others
          broadcastToRoom(roomId, {
            type: 'presence_update',
            roomId,
            userId,
            payload: presence,
            timestamp: Date.now(),
          }, userId);

          console.log(`[WS] ${name} joined room ${roomId} (${rooms.get(roomId)!.size} users)`);
          break;
        }

        case WS_EVENTS.CURSOR_MOVE: {
          if (!currentClient) return;
          currentClient.presence.cursor = message.payload as PresenceUser['cursor'];
          currentClient.presence.lastSeen = Date.now();

          broadcastToRoom(currentClient.roomId, {
            type: 'cursor_move',
            roomId: currentClient.roomId,
            userId: currentClient.userId,
            payload: message.payload,
            timestamp: Date.now(),
          }, currentClient.userId);
          break;
        }

        case WS_EVENTS.TYPING_START: {
          if (!currentClient) return;
          currentClient.presence.isTyping = true;
          broadcastToRoom(currentClient.roomId, {
            type: 'typing_start',
            roomId: currentClient.roomId,
            userId: currentClient.userId,
            payload: { name: currentClient.name },
            timestamp: Date.now(),
          }, currentClient.userId);
          break;
        }

        case WS_EVENTS.TYPING_STOP: {
          if (!currentClient) return;
          currentClient.presence.isTyping = false;
          broadcastToRoom(currentClient.roomId, {
            type: 'typing_stop',
            roomId: currentClient.roomId,
            userId: currentClient.userId,
            payload: { name: currentClient.name },
            timestamp: Date.now(),
          }, currentClient.userId);
          break;
        }

        case WS_EVENTS.DOC_UPDATE: {
          if (!currentClient) return;
          // Broadcast document update to all others in the room
          broadcastToRoom(currentClient.roomId, message, currentClient.userId);
          break;
        }

        case WS_EVENTS.TASK_MOVE:
        case WS_EVENTS.TASK_CREATE:
        case WS_EVENTS.TASK_UPDATE:
        case WS_EVENTS.TASK_DELETE: {
          if (!currentClient) return;
          broadcastToRoom(currentClient.roomId, message, currentClient.userId);
          break;
        }

        default:
          console.log(`[WS] Unknown message type: ${message.type}`);
      }
    } catch (error) {
      console.error('[WS] Error processing message:', error);
    }
  });

  ws.on('close', () => {
    if (currentClient) {
      const { roomId, userId, name } = currentClient;
      const room = rooms.get(roomId);
      if (room) {
        room.delete(userId);

        // Broadcast leave
        broadcastToRoom(roomId, {
          type: 'leave_room',
          roomId,
          userId,
          payload: { name },
          timestamp: Date.now(),
        });

        // Clean up empty rooms
        if (room.size === 0) {
          rooms.delete(roomId);
        }

        console.log(`[WS] ${name} left room ${roomId} (${room.size} users remaining)`);
      }
    }
  });

  ws.on('error', (error) => {
    console.error('[WS] Connection error:', error);
  });
}
