'use client';

import { create } from 'zustand';
import type { AuthPayload, Board, Document, Task, TaskStatus } from '@collabflow/types';
import { api } from '@/lib/api';

type WorkspaceState = {
  auth: AuthPayload | null;
  documents: Document[];
  boards: Board[];
  loading: boolean;
  error: string | null;
  login: () => Promise<void>;
  loadWorkspace: () => Promise<void>;
  createDocument: (title: string) => Promise<Document>;
  updateDocument: (id: string, input: Partial<Pick<Document, 'title' | 'content'>>) => Promise<Document>;
  createTask: (title: string, description: string, status: TaskStatus, priority: Task['priority']) => Promise<void>;
  moveTask: (taskId: string, status: TaskStatus, order: number) => Promise<void>;
};

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  auth: null,
  documents: [],
  boards: [],
  loading: false,
  error: null,
  async login() {
    const auth = await api.login('alex@collabflow.dev', 'password123');
    set({ auth });
  },
  async loadWorkspace() {
    set({ loading: true, error: null });
    try {
      const [documents, boards] = await Promise.all([api.documents(), api.boards()]);
      set({ documents, boards, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to load workspace', loading: false });
    }
  },
  async createDocument(title) {
    const doc = await api.createDocument(title);
    set({ documents: [doc, ...get().documents] });
    return doc;
  },
  async updateDocument(id, input) {
    const updated = await api.updateDocument(id, input);
    set({ documents: get().documents.map((doc) => (doc.id === id ? updated : doc)) });
    return updated;
  },
  async createTask(title, description, status, priority) {
    const board = get().boards[0];
    if (!board) return;
    await api.createTask({ title, description, status, priority, boardId: board.id });
    const boards = await api.boards();
    set({ boards });
  },
  async moveTask(taskId, status, order) {
    const previous = get().boards;
    set({ boards: moveTaskLocally(previous, taskId, status, order) });
    try {
      await api.moveTask(taskId, status, order);
      const boards = await api.boards();
      set({ boards });
    } catch (error) {
      set({ boards: previous, error: error instanceof Error ? error.message : 'Failed to move task' });
    }
  },
}));

function moveTaskLocally(boards: Board[], taskId: string, status: TaskStatus, order: number): Board[] {
  return boards.map((board) => {
    let moved: Task | undefined;
    const columns = board.columns.map((column) => {
      const tasks = column.tasks.filter((task) => {
        if (task.id === taskId) {
          moved = { ...task, status };
          return false;
        }
        return true;
      });
      return { ...column, tasks };
    });

    if (!moved) return board;

    return {
      ...board,
      columns: columns.map((column) => {
        if (column.id !== status) return column;
        const tasks = [...column.tasks];
        tasks.splice(Math.min(order, tasks.length), 0, moved);
        return { ...column, tasks: tasks.map((task, index) => ({ ...task, order: index })) };
      }),
    };
  });
}
