import type { Document, CreateDocumentInput, UpdateDocumentInput } from '@collabflow/types';
import { generateId } from '@collabflow/utils';

// ─── In-Memory Document Store ───────────────────────────
const documents = new Map<string, Document>();

// Seed demo documents
const demoWorkspaceId = 'workspace-1';

documents.set('doc-1', {
  id: 'doc-1',
  title: 'Welcome to CollabFlow',
  content: JSON.stringify({
    type: 'doc',
    content: [
      {
        type: 'heading',
        attrs: { level: 1 },
        content: [{ type: 'text', text: 'Welcome to CollabFlow 👋' }],
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'This is a real-time collaborative document editor. Start typing to see changes sync across all connected clients instantly.',
          },
        ],
      },
      {
        type: 'heading',
        attrs: { level: 2 },
        content: [{ type: 'text', text: 'Features' }],
      },
      {
        type: 'bulletList',
        content: [
          { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Real-time collaboration with Yjs CRDTs' }] }] },
          { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Conflict-free document merging' }] }] },
          { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Live cursor and presence tracking' }] }] },
          { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Optimistic UI with rollback' }] }] },
        ],
      },
    ],
  }),
  workspaceId: demoWorkspaceId,
  createdBy: 'demo-user-1',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

documents.set('doc-2', {
  id: 'doc-2',
  title: 'Project Roadmap Q3 2026',
  content: JSON.stringify({
    type: 'doc',
    content: [
      { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Q3 2026 Roadmap' }] },
      { type: 'paragraph', content: [{ type: 'text', text: 'Our key objectives for the quarter.' }] },
    ],
  }),
  workspaceId: demoWorkspaceId,
  createdBy: 'demo-user-1',
  createdAt: new Date(Date.now() - 86400000).toISOString(),
  updatedAt: new Date(Date.now() - 3600000).toISOString(),
});

documents.set('doc-3', {
  id: 'doc-3',
  title: 'API Design Notes',
  content: JSON.stringify({
    type: 'doc',
    content: [
      { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'API Design Notes' }] },
      { type: 'paragraph', content: [{ type: 'text', text: 'REST endpoints and WebSocket protocol design decisions.' }] },
    ],
  }),
  workspaceId: demoWorkspaceId,
  createdBy: 'demo-user-1',
  createdAt: new Date(Date.now() - 172800000).toISOString(),
  updatedAt: new Date(Date.now() - 7200000).toISOString(),
});

export const documentService = {
  getAll(workspaceId: string): Document[] {
    return Array.from(documents.values()).filter((d) => d.workspaceId === workspaceId);
  },

  getById(id: string): Document | null {
    return documents.get(id) || null;
  },

  create(input: CreateDocumentInput, userId: string): Document {
    const id = generateId();
    const now = new Date().toISOString();
    const doc: Document = {
      id,
      title: input.title,
      content: '',
      workspaceId: input.workspaceId,
      createdBy: userId,
      createdAt: now,
      updatedAt: now,
    };
    documents.set(id, doc);
    return doc;
  },

  update(id: string, input: UpdateDocumentInput): Document | null {
    const doc = documents.get(id);
    if (!doc) return null;

    const updated: Document = {
      ...doc,
      ...(input.title !== undefined && { title: input.title }),
      ...(input.content !== undefined && { content: input.content }),
      updatedAt: new Date().toISOString(),
    };
    documents.set(id, updated);
    return updated;
  },

  delete(id: string): boolean {
    return documents.delete(id);
  },
};
