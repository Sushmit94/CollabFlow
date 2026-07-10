import type { FastifyInstance } from 'fastify';
import { loginSchema, registerSchema } from '@collabflow/shared';
import { authService } from '../services/auth.service.js';

export async function authRoutes(fastify: FastifyInstance) {
  // POST /api/auth/register
  fastify.post('/api/auth/register', async (request, reply) => {
    try {
      const body = registerSchema.parse(request.body);
      const result = await authService.register(body.name, body.email, body.password);
      return reply.status(201).send({ success: true, data: result });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      return reply.status(400).send({ success: false, error: message });
    }
  });

  // POST /api/auth/login
  fastify.post('/api/auth/login', async (request, reply) => {
    try {
      const body = loginSchema.parse(request.body);
      const result = await authService.login(body.email, body.password);
      return reply.send({ success: true, data: result });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Login failed';
      return reply.status(401).send({ success: false, error: message });
    }
  });

  // GET /api/auth/me
  fastify.get('/api/auth/me', async (request, reply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return reply.status(401).send({ success: false, error: 'Unauthorized' });
    }

    const token = authHeader.slice(7);
    const user = authService.getUserFromToken(token);
    if (!user) {
      return reply.status(401).send({ success: false, error: 'Invalid token' });
    }

    return reply.send({ success: true, data: user });
  });
}
