'use client';

import { useEffect } from 'react';
import { Activity, CheckCircle2, FilePlus2, Users } from 'lucide-react';
import { Shell } from '@/components/shell';
import { DocumentList } from '@/components/document-list';
import { KanbanBoard } from '@/components/kanban-board';
import { PresenceStrip } from '@/components/presence-strip';
import { usePresence } from '@/hooks/use-presence';
import { useWorkspaceStore } from '@/stores/workspace-store';

export default function WorkspacePage() {
  const { auth, documents, boards, loading, error, login, loadWorkspace, createDocument, createTask, moveTask } = useWorkspaceStore();
  const { users, connected } = usePresence({ roomId: 'workspace-1', userId: auth?.user.id || 'guest', name: auth?.user.name || 'Guest' });

  useEffect(() => {
    login().then(loadWorkspace).catch(() => loadWorkspace());
  }, [login, loadWorkspace]);

  const createDoc = async () => {
    const doc = await createDocument(`Untitled document ${documents.length + 1}`);
    window.location.href = `/documents/${doc.id}`;
  };

  return (
    <Shell active="dashboard">
      <div className="topbar">
        <div>
          <div className="kicker">Workspace</div>
          <h1>Ship documents and sprint work together.</h1>
          <p className="subtle">Live docs, Kanban movement, and presence awareness in one collaborative surface.</p>
        </div>
        <PresenceStrip users={users} connected={connected} />
      </div>

      <div className="toolbar" style={{ marginBottom: 18 }}>
        <Stat icon={<FilePlus2 size={18} />} label="Documents" value={documents.length} />
        <Stat icon={<Activity size={18} />} label="Tasks" value={boards[0]?.columns.reduce((count, column) => count + column.tasks.length, 0) || 0} />
        <Stat icon={<Users size={18} />} label="Online" value={users.length} />
        <Stat icon={<CheckCircle2 size={18} />} label="Status" value={connected ? 'Live' : 'Offline'} />
      </div>

      {error && <div className="panel" style={{ padding: 14, marginBottom: 18, color: 'var(--red)' }}>{error}</div>}
      {loading && <div className="panel" style={{ padding: 14, marginBottom: 18 }}>Loading workspace...</div>}

      <div className="grid">
        <DocumentList documents={documents} onCreate={createDoc} onRefresh={loadWorkspace} />
        <KanbanBoard boards={boards} onMove={moveTask} onCreate={createTask} onRefresh={loadWorkspace} />
      </div>
    </Shell>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="panel" style={{ padding: '12px 14px', minWidth: 142, boxShadow: 'none' }}>
      <div className="toolbar" style={{ justifyContent: 'space-between' }}>
        <span className="subtle">{label}</span>
        {icon}
      </div>
      <div style={{ fontSize: 24, fontWeight: 850, marginTop: 6 }}>{value}</div>
    </div>
  );
}
