// ─── User ───────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthPayload {
  token: string;
  user: User;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

// ─── Workspace ──────────────────────────────────────────
export interface Workspace {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Document ───────────────────────────────────────────
export interface Document {
  id: string;
  title: string;
  content: string;
  workspaceId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDocumentInput {
  title: string;
  workspaceId: string;
}

export interface UpdateDocumentInput {
  title?: string;
  content?: string;
}

// ─── Board & Tasks ──────────────────────────────────────
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  assignee?: User;
  boardId: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Board {
  id: string;
  name: string;
  workspaceId: string;
  columns: Column[];
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  boardId: string;
  assigneeId?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  order?: number;
  assigneeId?: string;
}

export interface MoveTaskInput {
  taskId: string;
  newStatus: TaskStatus;
  newOrder: number;
}

// ─── Presence ───────────────────────────────────────────
export interface CursorPosition {
  x: number;
  y: number;
  // For document editors: character offset
  anchor?: number;
  head?: number;
}

export interface PresenceUser {
  userId: string;
  name: string;
  avatarUrl?: string;
  color: string;
  cursor?: CursorPosition;
  isTyping: boolean;
  lastSeen: number;
  page?: string;
}

export interface PresenceState {
  users: Map<string, PresenceUser>;
}

// ─── WebSocket Messages ─────────────────────────────────
export type WSMessageType =
  | 'join_room'
  | 'leave_room'
  | 'cursor_move'
  | 'typing_start'
  | 'typing_stop'
  | 'presence_update'
  | 'presence_sync'
  | 'doc_update'
  | 'task_move'
  | 'task_create'
  | 'task_update'
  | 'task_delete'
  | 'error';

export interface WSMessage<T = unknown> {
  type: WSMessageType;
  roomId: string;
  userId: string;
  payload: T;
  timestamp: number;
}

// ─── API Response ───────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
