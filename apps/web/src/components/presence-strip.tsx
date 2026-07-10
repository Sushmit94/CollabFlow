'use client';

import { initials } from '@/lib/format';
import type { PresenceUser } from '@collabflow/types';

export function PresenceStrip({ users, connected }: { users: PresenceUser[]; connected: boolean }) {
  return (
    <div className="presence" title={connected ? 'WebSocket connected' : 'WebSocket disconnected'}>
      <span className={`status-dot ${connected ? 'live' : ''}`} />
      {users.slice(0, 6).map((user) => (
        <span className="avatar" key={user.userId} style={{ backgroundColor: user.color }} title={user.name}>
          {initials(user.name)}
        </span>
      ))}
      <span className="subtle">{users.length} online</span>
    </div>
  );
}
