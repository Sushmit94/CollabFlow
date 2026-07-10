'use client';

import { Plus, RefreshCw } from 'lucide-react';
import type { Board, Task, TaskPriority, TaskStatus } from '@collabflow/types';
import { PRIORITY_CONFIG } from '@collabflow/utils';
import { useState } from 'react';

export function KanbanBoard({ boards, onMove, onCreate, onRefresh }: { boards: Board[]; onMove: (taskId: string, status: TaskStatus, order: number) => void; onCreate: (title: string, description: string, status: TaskStatus, priority: TaskPriority) => void; onRefresh: () => void }) {
  const board = boards[0];
  const [draftColumn, setDraftColumn] = useState<TaskStatus | null>(null);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');

  const submit = () => {
    if (!title.trim() || !draftColumn) return;
    onCreate(title.trim(), '', draftColumn, priority);
    setTitle('');
    setPriority('medium');
    setDraftColumn(null);
  };

  return (
    <section id="board" className="panel">
      <div className="panel-header">
        <div>
          <div className="panel-title">{board?.name || 'Sprint Board'}</div>
          <div className="meta">Drag tasks across columns for live updates</div>
        </div>
        <button className="icon-button" type="button" onClick={onRefresh} title="Refresh board"><RefreshCw size={17} /></button>
      </div>
      {!board && <div className="empty">No board found.</div>}
      {board && (
        <div className="board" role="list">
          {board.columns.map((column) => (
            <div
              className="column"
              key={column.id}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                const taskId = event.dataTransfer.getData('text/task-id');
                if (taskId) onMove(taskId, column.id, column.tasks.length);
              }}
            >
              <div className="column-header">
                <span>{column.title}</span>
                <span className="pill">{column.tasks.length}</span>
              </div>
              <div className="task-list">
                {column.tasks.map((task, index) => (
                  <TaskCard key={task.id} task={task} index={index} onMove={onMove} />
                ))}
                {draftColumn === column.id ? (
                  <div className="task-card">
                    <div className="form-row">
                      <input className="input" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Task title" autoFocus />
                      <select className="select" value={priority} onChange={(event) => setPriority(event.target.value as TaskPriority)}>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                      <button className="primary-button" type="button" onClick={submit}>Create task</button>
                    </div>
                  </div>
                ) : (
                  <button className="secondary-button" type="button" onClick={() => setDraftColumn(column.id)}><Plus size={16} />Task</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function TaskCard({ task, index, onMove }: { task: Task; index: number; onMove: (taskId: string, status: TaskStatus, order: number) => void }) {
  const priority = PRIORITY_CONFIG[task.priority];

  return (
    <article
      className="task-card"
      draggable
      onDragStart={(event) => event.dataTransfer.setData('text/task-id', task.id)}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        const taskId = event.dataTransfer.getData('text/task-id');
        if (taskId && taskId !== task.id) onMove(taskId, task.status, index);
      }}
    >
      <div className="task-title">{task.title}</div>
      {task.description && <div className="task-description">{task.description}</div>}
      <div className="toolbar" style={{ marginTop: 10 }}>
        <span className={`pill ${task.priority}`}>{priority.label}</span>
      </div>
    </article>
  );
}
