import type { JSONContent } from '@tiptap/react';

const EMPTY_DOC: JSONContent = { type: 'doc', content: [{ type: 'paragraph' }] };

export function docContentFromDocument(content: string): JSONContent {
  if (!content) return EMPTY_DOC;

  try {
    return JSON.parse(content) as JSONContent;
  } catch {
    // Legacy/plain-text content predating the rich-text editor.
    return { type: 'doc', content: [{ type: 'paragraph', content: content ? [{ type: 'text', text: content }] : [] }] };
  }
}

export function initials(name: string): string {
  return name.split(' ').map((part) => part[0]).join('').toUpperCase().slice(0, 2) || 'CF';
}
