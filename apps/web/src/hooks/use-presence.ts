'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { PresenceUser, WSMessage } from '@collabflow/types';
import { WS_EVENTS } from '@collabflow/shared';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:4000';

type UsePresenceOptions = {
  roomId: string;
  userId: string;
  name: string;
};

export function usePresence({ roomId, userId, name }: UsePresenceOptions) {
  const socketRef = useRef<WebSocket | null>(null);
  const [users, setUsers] = useState<PresenceUser[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!roomId || !userId) return;

    const socket = new WebSocket(`${WS_URL.replace(/\/$/, '')}/ws`);
    socketRef.current = socket;

    socket.onopen = () => {
      setConnected(true);
      send({ type: WS_EVENTS.JOIN_ROOM, roomId, userId, payload: { name }, timestamp: Date.now() });
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data) as WSMessage;
      if (message.type === WS_EVENTS.PRESENCE_SYNC) {
        setUsers(message.payload as PresenceUser[]);
      }
      if (message.type === WS_EVENTS.PRESENCE_UPDATE) {
        const nextUser = message.payload as PresenceUser;
        setUsers((current) => [...current.filter((user) => user.userId !== nextUser.userId), nextUser]);
      }
      if (message.type === WS_EVENTS.LEAVE_ROOM) {
        setUsers((current) => current.filter((user) => user.userId !== message.userId));
      }
    };

    socket.onclose = () => setConnected(false);
    socket.onerror = () => setConnected(false);

    return () => socket.close();
  }, [name, roomId, userId]);

  const send = (message: WSMessage) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    }
  };

  return useMemo(() => ({ users, connected, send }), [users, connected]);
}
