import type { ApiResponse, AuthPayload, Board, CreateTaskInput, Document, Task, TaskStatus, UpdateDocumentInput, UpdateTaskInput } from '@collabflow/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    cache: 'no-store',
  });
  const body = (await res.json()) as ApiResponse<T>;
  if (!res.ok || !body.success) {
    throw new Error(body.error || body.message || 'Request failed');
  }
  return body.data as T;
}

export const api = {
  login(email: string, password: string) {
    return request<AuthPayload>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  documents(workspaceId = 'workspace-1') {
    return request<Document[]>(`/api/documents?workspaceId=${encodeURIComponent(workspaceId)}`);
  },
  document(id: string) {
    return request<Document>(`/api/documents/${id}`);
  },
  createDocument(title: string, workspaceId = 'workspace-1') {
    return request<Document>('/api/documents', {
      method: 'POST',
      body: JSON.stringify({ title, workspaceId }),
    });
  },
  updateDocument(id: string, input: UpdateDocumentInput) {
    return request<Document>(`/api/documents/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  },
  boards(workspaceId = 'workspace-1') {
    return request<Board[]>(`/api/boards?workspaceId=${encodeURIComponent(workspaceId)}`);
  },
  createTask(input: CreateTaskInput) {
    return request<Task>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },
  updateTask(id: string, input: UpdateTaskInput) {
    return request<Task>(`/api/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  },
  moveTask(taskId: string, newStatus: TaskStatus, newOrder: number) {
    return request<Task>('/api/tasks/move', {
      method: 'POST',
      body: JSON.stringify({ taskId, newStatus, newOrder }),
    });
  },
};
