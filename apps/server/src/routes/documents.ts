import type { FastifyInstance } from 'fastify';
import { createDocumentSchema, updateDocumentSchema } from '@collabflow/shared';
import { documentService } from '../services/document.service.js';

export async function documentRoutes(fastify: FastifyInstance) {
  // GET /api/documents?workspaceId=xxx
  fastify.get('/api/documents', async (request, reply) => {
    const { workspaceId } = request.query as { workspaceId?: string };
    const wid = workspaceId || 'workspace-1';
    const docs = documentService.getAll(wid);
    return reply.send({ success: true, data: docs });
  });

  // GET /api/documents/:id
  fastify.get('/api/documents/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const doc = documentService.getById(id);
    if (!doc) {
      return reply.status(404).send({ success: false, error: 'Document not found' });
    }
    return reply.send({ success: true, data: doc });
  });

  // POST /api/documents
  fastify.post('/api/documents', async (request, reply) => {
    try {
      const body = createDocumentSchema.parse(request.body);
      const doc = documentService.create(body, 'demo-user-1');
      return reply.status(201).send({ success: true, data: doc });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to create document';
      return reply.status(400).send({ success: false, error: message });
    }
  });

  // PATCH /api/documents/:id
  fastify.patch('/api/documents/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const body = updateDocumentSchema.parse(request.body);
      const doc = documentService.update(id, body);
      if (!doc) {
        return reply.status(404).send({ success: false, error: 'Document not found' });
      }
      return reply.send({ success: true, data: doc });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update document';
      return reply.status(400).send({ success: false, error: message });
    }
  });

  // DELETE /api/documents/:id
  fastify.delete('/api/documents/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const deleted = documentService.delete(id);
    if (!deleted) {
      return reply.status(404).send({ success: false, error: 'Document not found' });
    }
    return reply.send({ success: true, message: 'Document deleted' });
  });
}
