import bcrypt from 'bcryptjs';
import { createHmac } from 'node:crypto';
import { config } from '../config.js';
import type { User, AuthPayload } from '@collabflow/types';
import { generateId } from '@collabflow/utils';

// â”€â”€â”€ In-Memory User Store (Prisma replacement for demo) â”€
interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

const users = new Map<string, StoredUser>();

// Seed a demo user
const demoPasswordHash = bcrypt.hashSync('password123', 10);
users.set('demo-user-1', {
  id: 'demo-user-1',
  name: 'Alex Morgan',
  email: 'alex@collabflow.dev',
  passwordHash: demoPasswordHash,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// Simple JWT implementation (replaced by @fastify/jwt in production)
function base64url(str: string): string {
  return Buffer.from(str).toString('base64url');
}

function createToken(payload: object): string {
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64url(JSON.stringify({ ...payload, iat: Date.now() }));
  const signature = base64url(
    createHmac('sha256', config.jwtSecret)
      .update(`${header}.${body}`)
      .digest('base64url')
  );
  return `${header}.${body}.${signature}`;
}

function verifyToken(token: string): Record<string, unknown> | null {
  try {
    const [header, body, signature] = token.split('.');
    const expectedSig = base64url(
      require('crypto')
        .createHmac('sha256', config.jwtSecret)
        .update(`${header}.${body}`)
        .digest('base64url')
    );
    if (signature !== expectedSig) return null;
    return JSON.parse(Buffer.from(body, 'base64url').toString());
  } catch {
    return null;
  }
}

function toPublicUser(user: StoredUser): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export const authService = {
  async register(name: string, email: string, password: string): Promise<AuthPayload> {
    // Check if user already exists
    for (const user of users.values()) {
      if (user.email === email) {
        throw new Error('Email already registered');
      }
    }

    const id = generateId();
    const passwordHash = await bcrypt.hash(password, 10);
    const now = new Date().toISOString();

    const newUser: StoredUser = {
      id,
      name,
      email,
      passwordHash,
      createdAt: now,
      updatedAt: now,
    };

    users.set(id, newUser);

    const token = createToken({ userId: id, email });
    return { token, user: toPublicUser(newUser) };
  },

  async login(email: string, password: string): Promise<AuthPayload> {
    let foundUser: StoredUser | undefined;
    for (const user of users.values()) {
      if (user.email === email) {
        foundUser = user;
        break;
      }
    }

    if (!foundUser) {
      throw new Error('Invalid credentials');
    }

    const valid = await bcrypt.compare(password, foundUser.passwordHash);
    if (!valid) {
      throw new Error('Invalid credentials');
    }

    const token = createToken({ userId: foundUser.id, email });
    return { token, user: toPublicUser(foundUser) };
  },

  getUserFromToken(token: string): User | null {
    const payload = verifyToken(token);
    if (!payload || !payload.userId) return null;

    const user = users.get(payload.userId as string);
    if (!user) return null;

    return toPublicUser(user);
  },

  getUserById(id: string): User | null {
    const user = users.get(id);
    return user ? toPublicUser(user) : null;
  },
};

