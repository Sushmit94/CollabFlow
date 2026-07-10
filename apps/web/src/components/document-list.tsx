'use client';

import Link from 'next/link';
import { FilePlus, RefreshCw } from 'lucide-react';
import type { Document } from '@collabflow/types';
import { formatRelativeTime } from '@collabflow/utils';

export function DocumentList({ documents, onCreate, onRefresh }: { documents: Document[]; onCreate: () => void; onRefresh: () => void }) {
  return (
    <section id="documents" className="panel">
      <div className="panel-header">
        <div>
          <div className="panel-title">Documents</div>
          <div className="meta">Shared notes and specs</div>
        </div>
        <div className="toolbar">
          <button className="icon-button" type="button" onClick={onRefresh} title="Refresh documents"><RefreshCw size={17} /></button>
          <button className="primary-button" type="button" onClick={onCreate}><FilePlus size={17} />New</button>
        </div>
      </div>
      <div className="document-list">
        {documents.map((doc) => (
          <Link href={`/documents/${doc.id}`} className="document-row" key={doc.id}>
            <span>
              <span className="document-name">{doc.title}</span>
              <span className="meta">Updated {formatRelativeTime(doc.updatedAt)}</span>
            </span>
            <span className="pill">Open</span>
          </Link>
        ))}
        {documents.length === 0 && <div className="empty">No documents yet.</div>}
      </div>
    </section>
  );
}
