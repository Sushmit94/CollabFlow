'use client';

import { Save } from 'lucide-react';
import type { Document, PresenceUser } from '@collabflow/types';
import { EditorContent, useEditor } from '@tiptap/react';
import Placeholder from '@tiptap/extension-placeholder';
import StarterKit from '@tiptap/starter-kit';
import { docContentFromDocument } from '@/lib/format';
import { EditorToolbar } from './editor-toolbar';
import { PresenceStrip } from './presence-strip';
import { useEffect, useState } from 'react';

export function DocumentEditor({ document, presence, connected, onSave, onTyping }: { document: Document; presence: PresenceUser[]; connected: boolean; onSave: (input: { title: string; content: string }) => Promise<void>; onTyping: () => void }) {
  const [title, setTitle] = useState(document.title);
  const [saving, setSaving] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Start writing…' }),
    ],
    content: docContentFromDocument(document.content),
    immediatelyRender: false,
    editorProps: {
      attributes: { class: 'editor tiptap-content', 'aria-label': 'Document content' },
    },
    onUpdate: () => onTyping(),
  });

  useEffect(() => {
    setTitle(document.title);
    editor?.commands.setContent(docContentFromDocument(document.content));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [document.id]);

  const save = async () => {
    if (!editor) return;
    setSaving(true);
    await onSave({ title, content: JSON.stringify(editor.getJSON()) });
    setSaving(false);
  };

  return (
    <section className="editor-wrap">
      <div className="topbar">
        <PresenceStrip users={presence} connected={connected} />
        <button className="primary-button" type="button" onClick={save} disabled={saving || !editor}>
          <Save size={17} />{saving ? 'Saving' : 'Save'}
        </button>
      </div>
      <input className="title-input" value={title} onChange={(event) => setTitle(event.target.value)} aria-label="Document title" />
      {editor && <EditorToolbar editor={editor} />}
      <EditorContent editor={editor} />
    </section>
  );
}
