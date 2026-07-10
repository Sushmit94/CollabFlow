// Redis client with in-memory fallback for development
// When Redis is not available, events are handled locally (single-instance mode)

import { config } from '../config.js';

type MessageHandler = (channel: string, message: string) => void;

interface PubSubClient {
  publish(channel: string, message: string): void;
  subscribe(channel: string, handler: MessageHandler): void;
  unsubscribe(channel: string): void;
}

// ─── In-Memory Pub/Sub (development fallback) ──────────
class InMemoryPubSub implements PubSubClient {
  private handlers = new Map<string, Set<MessageHandler>>();

  publish(channel: string, message: string) {
    const channelHandlers = this.handlers.get(channel);
    if (channelHandlers) {
      for (const handler of channelHandlers) {
        // Simulate async delivery
        setTimeout(() => handler(channel, message), 0);
      }
    }
  }

  subscribe(channel: string, handler: MessageHandler) {
    if (!this.handlers.has(channel)) {
      this.handlers.set(channel, new Set());
    }
    this.handlers.get(channel)!.add(handler);
  }

  unsubscribe(channel: string) {
    this.handlers.delete(channel);
  }
}

// ─── Redis Pub/Sub (production) ─────────────────────────
let pubsub: PubSubClient;

try {
  if (config.redisUrl) {
    // Dynamic import to avoid errors when ioredis isn't configured
    const Redis = (await import('ioredis')).default;
    const publisher = new Redis(config.redisUrl);
    const subscriber = new Redis(config.redisUrl);
    const handlers = new Map<string, MessageHandler>();

    subscriber.on('message', (channel: string, message: string) => {
      const handler = handlers.get(channel);
      if (handler) handler(channel, message);
    });

    pubsub = {
      publish(channel: string, message: string) {
        publisher.publish(channel, message);
      },
      subscribe(channel: string, handler: MessageHandler) {
        handlers.set(channel, handler);
        subscriber.subscribe(channel);
      },
      unsubscribe(channel: string) {
        handlers.delete(channel);
        subscriber.unsubscribe(channel);
      },
    };

    console.log('[Redis] Connected to Redis Pub/Sub');
  } else {
    throw new Error('No Redis URL');
  }
} catch {
  pubsub = new InMemoryPubSub();
  console.log('[Redis] Using in-memory Pub/Sub (development mode)');
}

export { pubsub };
