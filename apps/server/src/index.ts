import Fastify from 'fastify';
import cors from '@fastify/cors';
import websocket from '@fastify/websocket';
import { config } from './config.js';
import { authRoutes } from './routes/auth.js';
import { boardRoutes } from './routes/boards.js';
import { documentRoutes } from './routes/documents.js';
import { handleWebSocket } from './websocket/handler.js';

const app = Fastify({
  logger: {
    level: config.isDev ? 'info' : 'warn',
  },
});

await app.register(cors, {
  origin: config.corsOrigin === '*' ? true : config.corsOrigin.split(',').map((origin) => origin.trim()),
  credentials: true,
});

await app.register(websocket);
await app.register(authRoutes);
await app.register(boardRoutes);
await app.register(documentRoutes);

app.get('/health', async () => ({
  status: 'ok',
  service: 'collabflow-server',
  timestamp: new Date().toISOString(),
}));

app.get('/ws', { websocket: true }, (socket, request) => {
  handleWebSocket(socket, request);
});

const shutdown = async (signal: string) => {
  app.log.info({ signal }, 'shutting down');
  await app.close();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

try {
  await app.listen({ port: config.port, host: config.host });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
