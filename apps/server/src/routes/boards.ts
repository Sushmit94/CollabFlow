import type { FastifyInstance } from 'fastify';
import { createTaskSchema, updateTaskSchema, moveTaskSchema } from '@collabflow/shared';
import { boardService } from '../services/board.service.js';

export async function boardRoutes(fastify: FastifyInstance) {
  // GET /api/boards?workspaceId=xxx
  fastify.get('/api/boards', async (request, reply) => {
    const { workspaceId } = request.query as { workspaceId?: string };
    const wid = workspaceId || 'workspace-1';
    const boards = boardService.getAll(wid);
    return reply.send({ success: true, data: boards });
  });

  // GET /api/boards/:id
  fastify.get('/api/boards/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const board = boardService.getById(id);
    if (!board) {
      return reply.status(404).send({ success: false, error: 'Board not found' });
    }
    return reply.send({ success: true, data: board });
  });

  // POST /api/tasks
  fastify.post('/api/tasks', async (request, reply) => {
    try {
      const body = createTaskSchema.parse(request.body);
      const task = boardService.createTask(body);
      return reply.status(201).send({ success: true, data: task });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to create task';
      return reply.status(400).send({ success: false, error: message });
    }
  });

  // PATCH /api/tasks/:id
  fastify.patch('/api/tasks/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const body = updateTaskSchema.parse(request.body);
      const task = boardService.updateTask(id, body);
      if (!task) {
        return reply.status(404).send({ success: false, error: 'Task not found' });
      }
      return reply.send({ success: true, data: task });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update task';
      return reply.status(400).send({ success: false, error: message });
    }
  });

  // POST /api/tasks/move
  fastify.post('/api/tasks/move', async (request, reply) => {
    try {
      const body = moveTaskSchema.parse(request.body);
      const task = boardService.moveTask(body);
      if (!task) {
        return reply.status(404).send({ success: false, error: 'Task not found' });
      }
      return reply.send({ success: true, data: task });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to move task';
      return reply.status(400).send({ success: false, error: message });
    }
  });

  // DELETE /api/tasks/:id
  fastify.delete('/api/tasks/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const deleted = boardService.deleteTask(id);
    if (!deleted) {
      return reply.status(404).send({ success: false, error: 'Task not found' });
    }
    return reply.send({ success: true, message: 'Task deleted' });
  });
}
