'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { use, useEffect, useState } from 'react';
import type { Document } from '@collabflow/types';
import { WS_EVENTS } from '@collabflow/shared';
import { Shell } from '@/components/shell';
import { DocumentEditor } from '@/components/document-editor';
import { usePresence } from '@/hooks/use-presence';
import { api } from '@/lib/api';

export default function DocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [document, setDocument] = useState<Document | null>(null);
  const [error, setError] = useState<string | null>(null);
  const user = { id: 'demo-user-1', name: 'Alex Morgan' };
  const { users, connected, send } = usePresence({ roomId: id, userId: user.id, name: user.name });

  useEffect(() => {
    api.document(id).then(setDocument).catch((err) => setError(err instanceof Error ? err.message : 'Document not found'));
  }, [id]);

  return (
    <Shell active="documents">
      <div className="topbar">
        <Link href="/" className="secondary-button"><ArrowLeft size={17} />Workspace</Link>
      </div>
      {error && <div className="panel" style={{ padding: 18, color: 'var(--red)' }}>{error}</div>}
      {!document && !error && <div className="panel" style={{ padding: 18 }}>Loading document...</div>}
      {document && (
        <DocumentEditor
          document={document}
          presence={users}
          connected={connected}
          onTyping={() => send({ type: WS_EVENTS.TYPING_START, roomId: id, userId: user.id, payload: { name: user.name }, timestamp: Date.now() })}
          onSave={async (input) => {
            const updated = await api.updateDocument(id, input);
            setDocument(updated);
            send({ type: WS_EVENTS.DOC_UPDATE, roomId: id, userId: user.id, payload: updated, timestamp: Date.now() });
          }}
        />
      )}
    </Shell>
  );
}
