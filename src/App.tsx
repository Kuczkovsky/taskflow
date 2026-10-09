import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  Activity, ArrowDownUp, CalendarDays, Check, CheckCircle2, Circle,
  Clock3, LayoutDashboard, ListTodo, Pencil, Plus, Search,
  Sparkles, Target, Trash2, X,
} from 'lucide-react';

type Priority = 'high' | 'medium' | 'low';
type Filter = 'all' | 'active' | 'completed';
type Task = {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  completed: boolean;
  createdAt: number;
  dueDate: string;
};
type FormData = Pick<Task, 'title' | 'description' | 'priority' | 'dueDate'>;
const STORAGE_KEY = 'taskflow.tasks.v1';
const emptyForm: FormData = { title: '', description: '', priority: 'medium', dueDate: '' };
const priorityRank: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

const demo: Task[] = [
  { id: 'demo-1', title: 'Design the dashboard layout', description: 'Create a clean dark UI with responsive cards.', priority: 'high', completed: true, createdAt: Date.now()-86400000*3, dueDate: '' },
  { id: 'demo-2', title: 'Build reusable React components', description: 'Keep the project simple and maintainable.', priority: 'high', completed: false, createdAt: Date.now()-86400000*2, dueDate: '' },
  { id: 'demo-3', title: 'Add local storage persistence', description: 'Save tasks automatically in the browser.', priority: 'medium', completed: false, createdAt: Date.now()-86400000, dueDate: '' },
  { id: 'demo-4', title: 'Write documentation', description: 'Explain setup, features and future improvements.', priority: 'low', completed: false, createdAt: Date.now(), dueDate: '' },
];
function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return demo;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return demo;
    return parsed.filter((t): t is Task =>
      typeof t === 'object' && t !== null && typeof t.id === 'string' &&
      typeof t.title === 'string' && typeof t.description === 'string' &&
      ['high','medium','low'].includes(t.priority) &&
      typeof t.completed === 'boolean' && typeof t.createdAt === 'number' &&
      typeof t.dueDate === 'string'
    );
  } catch { return demo; }
}
function App() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'priority'>('newest');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormData>(emptyForm);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); }, [tasks]);

  const completed = tasks.filter(t => t.completed).length;
  const remaining = tasks.length - completed;
  const percent = tasks.length ? Math.round(completed / tasks.length * 100) : 0;
  const visibleTasks = useMemo(() => tasks
    .filter(t => filter === 'all' || (filter === 'completed' ? t.completed : !t.completed))
    .filter(t => (t.title + ' ' + t.description).toLowerCase().includes(query.trim().toLowerCase()))
    .sort((a, b) => sortBy === 'priority'
      ? priorityRank[a.priority] - priorityRank[b.priority] || b.createdAt - a.createdAt
      : b.createdAt - a.createdAt), [tasks, filter, query, sortBy]);

  const openNew = () => { setEditingId(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (task: Task) => {
    setEditingId(task.id);
    setForm({ title: task.title, description: task.description, priority: task.priority, dueDate: task.dueDate });
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditingId(null); };
  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = form.title.trim();
    if (!title) return;
    if (editingId) {
      setTasks(prev => prev.map(t => t.id === editingId ? { ...t, ...form, title } : t));
    } else {
      setTasks(prev => [{ id: crypto.randomUUID(), ...form, title, completed: false, createdAt: Date.now() }, ...prev]);
    }
    closeForm();
  };
  const toggle = (id: string) => setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  const remove = (id: string) => { if (window.confirm('Delete this task?')) setTasks(prev => prev.filter(t => t.id !== id)); };
  const today = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date());

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-icon"><Check size={20} strokeWidth={3}/></div><span>task<span className="brand-accent">flow</span><span className="brand-dot">.</span></span></div>
        <div className="nav-heading">WORKSPACE</div>
        <div className="nav-item selected"><LayoutDashboard size={18}/> Overview <span className="nav-mark"/></div>
        <button className="nav-item" onClick={() => { setFilter('all'); document.getElementById('task-list')?.scrollIntoView({ behavior: 'smooth' }); }}><ListTodo size={18}/> My tasks</button>
        <div className="sidebar-bottom"><span className="avatar">TF</span><div><strong>My workspace</strong><small>Personal account</small></div><span className="online-dot"/></div>
      </aside>
      <main className="main">
        <header className="topbar"><span className="breadcrumb">Workspace <span>/</span> <b>Overview</b></span><span className="top-tag"><span className="online-dot"/> All systems operational</span></header>
        <div className="content">
          <div className="eyebrow"><Sparkles size={14}/> YOUR PRODUCTIVITY SPACE</div>
          <div className="heading-row"><div><h1>Good to see you <span className="wave">✦</span></h1><p className="subtitle">Here's what's happening with your tasks today.</p></div><div className="date-label"><CalendarDays size={16}/>{today}</div></div>
          <div className="stats">
            <div className="stat-card"><div className="stat-top"><span>Total tasks</span><span className="stat-icon purple"><ListTodo size={19}/></span></div><div className="stat-value">{tasks.length.toString().padStart(2,'0')}</div><div className="stat-sub"><span className="stat-line purple-text">●</span> Across your workspace</div></div>
            <div className="stat-card"><div className="stat-top"><span>In progress</span><span className="stat-icon orange"><Clock3 size={19}/></span></div><div className="stat-value">{remaining.toString().padStart(2,'0')}</div><div className="stat-sub"><span className="stat-line orange-text">●</span> Waiting to be completed</div></div>
            <div className="stat-card"><div className="stat-top"><span>Completed</span><span className="stat-icon green"><CheckCircle2 size={19}/></span></div><div className="stat-value">{completed.toString().padStart(2,'0')}</div><div className="stat-sub"><span className="stat-line green-text">●</span> Keep up the momentum</div></div>
          </div>
          <div className="progress-panel"><div className="progress-left"><div className="progress-icon"><Target size={20}/></div><div><strong>You're making progress!</strong><p>{completed} of {tasks.length} tasks completed. {remaining ? 'Keep going, you got this.' : 'Everything is done. Great job!'}</p></div></div><div className="progress-right"><span>{percent}%</span><div className="progress-track"><div className="progress-fill" style={{width: `${percent}%`}}/></div></div></div>
          <section className="task-section" id="task-list"><div className="section-heading"><div><h2>Your tasks <span className="count">{tasks.length}</span></h2><p>Stay organized and get things done.</p></div><button className="primary-btn" onClick={openNew}><Plus size={18}/> New task</button></div>
            <div className="task-panel"><div className="toolbar"><div className="tabs">{(['all','active','completed'] as Filter[]).map(f => <button key={f} onClick={() => setFilter(f)} className={filter === f ? 'tab active' : 'tab'}>{f === 'all' ? 'All tasks' : f === 'active' ? 'In progress' : 'Completed'}</button>)}</div><div className="toolbar-right"><label className="search"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} aria-label="Search tasks" placeholder="Search tasks..."/></label><button className="sort-btn" title="Toggle task ordering" onClick={() => setSortBy(prev => prev === 'newest' ? 'priority' : 'newest')}><ArrowDownUp size={16}/><span>{sortBy === 'newest' ? 'Newest' : 'Priority'}</span></button></div></div>
              <div className="task-list">{visibleTasks.length ? visibleTasks.map(task => <div className={'task-row'+(task.completed ? ' is-complete' : '')} key={task.id}>
                <button className="checkbox-btn" aria-label={task.completed ? 'Mark incomplete' : 'Complete task'} onClick={()=>toggle(task.id)}>{task.completed ? <CheckCircle2 size={22}/> : <Circle size={22}/>}</button>
                <div className="task-info"><div className="task-title">{task.title}</div>{task.description && <p>{task.description}</p>}<div className="task-meta"><span className={'priority '+task.priority}><span className="priority-dot"/>{task.priority} priority</span>{task.dueDate && <span className="due"><CalendarDays size={12}/>{new Date(task.dueDate+'T00:00:00').toLocaleDateString('en', {month:'short',day:'numeric',year:'numeric'})}</span>}</div></div>
                <div className="task-actions"><button title="Edit task" aria-label="Edit task" onClick={()=>openEdit(task)}><Pencil size={16}/></button><button title="Delete task" aria-label="Delete task" onClick={()=>remove(task.id)}><Trash2 size={16}/></button></div>
              </div>) : <div className="empty"><Activity size={30}/><strong>No tasks found</strong><p>{query ? 'Try a different search term.' : filter !== 'all' ? 'Try another filter or add a new task.' : 'Create your first task to get started.'}</p></div>}</div>
              <div className="panel-footer"><span>Showing {visibleTasks.length} of {tasks.length} tasks</span><span><span className="footer-dot"/> Changes saved locally</span></div>
            </div>
          </section>
          <footer className="footer">TaskFlow <span>·</span> Plan. Focus. Ship. <span className="footer-right">Made with React + TypeScript</span></footer>
        </div>
      </main>
      {showForm && <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)closeForm()}}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-header"><div><span className="eyebrow">TASK DETAILS</span><h2 id="modal-title">{editingId ? 'Edit task' : 'Create new task'}</h2></div><button className="close-btn" aria-label="Close" onClick={closeForm}><X size={20}/></button></div><form onSubmit={save}><label>Task title <span>*</span><input required autoFocus maxLength={100} value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="What needs to be done?"/></label><label>Description<textarea maxLength={500} rows={3} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Add some context (optional)"/></label><div className="form-grid"><label>Priority<select value={form.priority} onChange={e=>setForm({...form,priority:e.target.value as Priority})}><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select></label><label>Due date<input type="date" value={form.dueDate} onChange={e=>setForm({...form,dueDate:e.target.value})}/></label></div><div className="modal-actions"><button type="button" className="secondary-btn" onClick={closeForm}>Cancel</button><button type="submit" className="primary-btn"><Check size={17}/>{editingId ? 'Save changes' : 'Create task'}</button></div></form></div></div>}
    </div>
  );
}
export default App;
