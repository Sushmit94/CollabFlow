import type { Board, Task, Column, CreateTaskInput, UpdateTaskInput, MoveTaskInput } from '@collabflow/types';
import { COLUMN_TITLES } from '@collabflow/shared';
import { generateId } from '@collabflow/utils';

// ─── In-Memory Store ────────────────────────────────────
const boards = new Map<string, Omit<Board, 'columns'>>();
const tasks = new Map<string, Task>();

const demoWorkspaceId = 'workspace-1';

// Seed demo board
boards.set('board-1', {
  id: 'board-1',
  name: 'Sprint Board',
  workspaceId: demoWorkspaceId,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// Seed demo tasks
const seedTasks: Omit<Task, 'assignee'>[] = [
  { id: 't-1', title: 'Set up CI/CD pipeline', description: 'Configure GitHub Actions for automated testing and deployment', status: 'done', priority: 'high', boardId: 'board-1', order: 0, assigneeId: 'demo-user-1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 't-2', title: 'Implement WebSocket authentication', description: 'Add JWT token verification to WebSocket handshake', status: 'done', priority: 'high', boardId: 'board-1', order: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 't-3', title: 'Build Kanban board UI', description: 'Create drag-and-drop Kanban board with column management', status: 'review', priority: 'medium', boardId: 'board-1', order: 0, assigneeId: 'demo-user-1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 't-4', title: 'Add presence cursors', description: 'Show live cursor positions for all connected users', status: 'in_progress', priority: 'high', boardId: 'board-1', order: 0, assigneeId: 'demo-user-1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 't-5', title: 'Implement Yjs CRDT sync', description: 'Integrate Yjs for conflict-free real-time document editing', status: 'in_progress', priority: 'urgent', boardId: 'board-1', order: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 't-6', title: 'Design landing page', description: 'Create a stunning landing page with hero section and feature showcase', status: 'todo', priority: 'medium', boardId: 'board-1', order: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 't-7', title: 'Redis Pub/Sub integration', description: 'Set up Redis for cross-instance message broadcasting', status: 'todo', priority: 'high', boardId: 'board-1', order: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 't-8', title: 'Offline sync support', description: 'Handle offline edits and reconcile when connection restored', status: 'backlog', priority: 'low', boardId: 'board-1', order: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 't-9', title: 'E2E encryption', description: 'Encrypt document content end-to-end', status: 'backlog', priority: 'low', boardId: 'board-1', order: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 't-10', title: 'Mobile responsive layout', description: 'Ensure all views work on mobile and tablet', status: 'backlog', priority: 'medium', boardId: 'board-1', order: 2, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

seedTasks.forEach((t) => tasks.set(t.id, t as Task));

function buildColumns(boardId: string): Column[] {
  const statuses = ['backlog', 'todo', 'in_progress', 'review', 'done'] as const;
  return statuses.map((status) => ({
    id: status,
    title: COLUMN_TITLES[status],
    tasks: Array.from(tasks.values())
      .filter((t) => t.boardId === boardId && t.status === status)
      .sort((a, b) => a.order - b.order),
  }));
}

export const boardService = {
  getAll(workspaceId: string): Board[] {
    return Array.from(boards.values())
      .filter((b) => b.workspaceId === workspaceId)
      .map((b) => ({ ...b, columns: buildColumns(b.id) }));
  },

  getById(id: string): Board | null {
    const board = boards.get(id);
    if (!board) return null;
    return { ...board, columns: buildColumns(id) };
  },

  createTask(input: CreateTaskInput): Task {
    const id = generateId();
    const now = new Date().toISOString();
    // Get max order in the column
    const columnTasks = Array.from(tasks.values()).filter(
      (t) => t.boardId === input.boardId && t.status === input.status
    );
    const maxOrder = columnTasks.reduce((max, t) => Math.max(max, t.order), -1);

    const task: Task = {
      id,
      title: input.title,
      description: input.description,
      status: input.status,
      priority: input.priority,
      boardId: input.boardId,
      assigneeId: input.assigneeId,
      order: maxOrder + 1,
      createdAt: now,
      updatedAt: now,
    };
    tasks.set(id, task);
    return task;
  },

  updateTask(id: string, input: UpdateTaskInput): Task | null {
    const task = tasks.get(id);
    if (!task) return null;

    const updated: Task = {
      ...task,
      ...input,
      updatedAt: new Date().toISOString(),
    };
    tasks.set(id, updated);
    return updated;
  },

  moveTask(input: MoveTaskInput): Task | null {
    const task = tasks.get(input.taskId);
    if (!task) return null;

    // Reorder tasks in old column
    const oldColumnTasks = Array.from(tasks.values())
      .filter((t) => t.boardId === task.boardId && t.status === task.status && t.id !== task.id)
      .sort((a, b) => a.order - b.order);
    oldColumnTasks.forEach((t, i) => {
      t.order = i;
      tasks.set(t.id, t);
    });

    // Insert into new column at specified order
    const newColumnTasks = Array.from(tasks.values())
      .filter((t) => t.boardId === task.boardId && t.status === input.newStatus && t.id !== task.id)
      .sort((a, b) => a.order - b.order);

    // Shift tasks at and after the insertion point
    newColumnTasks.forEach((t, i) => {
      if (i >= input.newOrder) {
        t.order = i + 1;
        tasks.set(t.id, t);
      }
    });

    // Update the moved task
    task.status = input.newStatus;
    task.order = input.newOrder;
    task.updatedAt = new Date().toISOString();
    tasks.set(task.id, task);

    return task;
  },

  deleteTask(id: string): boolean {
    return tasks.delete(id);
  },
};
