'use client';

import { Save } from 'lucide-react';
import type { Document, PresenceUser } from '@collabflow/types';
import { plainTextFromDocument } from '@/lib/format';
import { PresenceStrip } from './presence-strip';
import { useEffect, useState } from 'react';

export function DocumentEditor({ document, presence, connected, onSave, onTyping }: { document: Document; presence: PresenceUser[]; connected: boolean; onSave: (input: { title: string; content: string }) => Promise<void>; onTyping: () => void }) {
  const [title, setTitle] = useState(document.title);
  const [content, setContent] = useState(plainTextFromDocument(document.content));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTitle(document.title);
    setContent(plainTextFromDocument(document.content));
  }, [document]);

  const save = async () => {
    setSaving(true);
    await onSave({ title, content });
    setSaving(false);
  };

  return (
    <section className="editor-wrap">
      <div className="topbar">
        <PresenceStrip users={presence} connected={connected} />
        <button className="primary-button" type="button" onClick={save} disabled={saving}>
          <Save size={17} />{saving ? 'Saving' : 'Save'}
        </button>
      </div>
      <input className="title-input" value={title} onChange={(event) => setTitle(event.target.value)} aria-label="Document title" />
      <textarea
        className="editor"
        value={content}
        onChange={(event) => {
          setContent(event.target.value);
          onTyping();
        }}
        aria-label="Document content"
      />
    </section>
  );
}
