'use client';

import { initials } from '@/lib/format';
import type { PresenceUser } from '@collabflow/types';

const MAX_VISIBLE_AVATARS = 6;

export function PresenceStrip({ users, connected }: { users: PresenceUser[]; connected: boolean }) {
  const visibleUsers = users.slice(0, MAX_VISIBLE_AVATARS);
  const overflowCount = users.length - visibleUsers.length;

  return (
    <div className="presence" title={connected ? 'WebSocket connected' : 'WebSocket disconnected'}>
      <span className={`status-dot ${connected ? 'live' : ''}`} />
      {visibleUsers.map((user) => (
        <span className="avatar" key={user.userId} style={{ backgroundColor: user.color }} title={user.name}>
          {initials(user.name)}
        </span>
      ))}
      {overflowCount > 0 && (
        <span className="avatar" style={{ backgroundColor: 'var(--muted)' }} title={`${overflowCount} more online`}>
          +{overflowCount}
        </span>
      )}
      <span className="subtle">{users.length} online</span>
    </div>
  );
}
