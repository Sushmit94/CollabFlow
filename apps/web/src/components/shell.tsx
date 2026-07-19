'use client';

import Link from 'next/link';
import { FileText, KanbanSquare, LayoutDashboard, Workflow } from 'lucide-react';

export function Shell({ children, active = 'dashboard' }: { children: React.ReactNode; active?: 'dashboard' | 'documents' | 'board' }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link href="/app" className="brand">
          <span className="brand-mark"><Workflow size={18} /></span>
          <span>CollabFlow</span>
        </Link>
        <nav className="nav-stack" aria-label="Workspace">
          <Link className={`nav-item ${active === 'dashboard' ? 'active' : ''}`} href="/app">
            <LayoutDashboard size={18} /><span>Dashboard</span>
          </Link>
          <Link className={`nav-item ${active === 'documents' ? 'active' : ''}`} href="/app#documents">
            <FileText size={18} /><span>Documents</span>
          </Link>
          <Link className={`nav-item ${active === 'board' ? 'active' : ''}`} href="/app#board">
            <KanbanSquare size={18} /><span>Board</span>
          </Link>
        </nav>
        <div className="sidebar-footer">
          Demo user: alex@collabflow.dev<br />Password: password123
        </div>
      </aside>
      <main className="main">{children}</main>
    </div>
  );
}
