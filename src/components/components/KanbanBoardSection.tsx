import React, { useState, useMemo } from 'react';
import {
  GripVertical,
  Plus,
  RotateCcw,
  Calendar,
  MessageSquare,
  CheckSquare,
  Trash2,
  X,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { showToast } from '../../lib/swal';

const GRAD = {
  primary: 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white',
  primaryStatic: 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white',
  secondary: 'bg-gradient-to-r from-[#cbd5e1] to-[#94a3b8] hover:from-[#94a3b8] hover:to-[#64748b] text-white',
  info: 'bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] hover:from-[#0284c7] hover:to-[#0369a1] text-white',
  warning: 'bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:from-[#ea580c] hover:to-[#b45309] text-white',
  danger: 'bg-gradient-to-r from-[#ef4444] to-[#b91c1c] hover:from-[#dc2626] hover:to-[#991b1b] text-white',
  success: 'bg-gradient-to-r from-[#22c55e] to-[#15803d] hover:from-[#16a34a] hover:to-[#166534] text-white',
  light: 'bg-gradient-to-r from-[#f8fafc] to-[#e2e8f0] text-slate-800 border border-slate-200/80',
  dark: 'bg-gradient-to-r from-[#1e293b] to-[#020617] hover:from-[#0f172a] hover:to-[#000000] text-white',
};

type ColumnId = 'backlog' | 'in-progress' | 'review' | 'done';
type PriorityType = 'High' | 'Medium' | 'Low';

interface KanbanTask {
  id: string;
  column: ColumnId;
  title: string;
  desc: string;
  category: string;
  priority: PriorityType;
  assignee: string;
  initials: string;
  due: string;
  comments: number;
  subtasksDone: number;
  subtasksTotal: number;
}

const COLUMNS: { id: ColumnId; label: string; dotColor: string; badgeGrad: string; accentTop: string }[] = [
  {
    id: 'backlog',
    label: 'Backlog',
    dotColor: 'bg-slate-500',
    badgeGrad: GRAD.dark,
    accentTop: 'from-[#1e293b] to-[#020617]',
  },
  {
    id: 'in-progress',
    label: 'In Progress',
    dotColor: 'bg-[#175cd3]',
    badgeGrad: GRAD.primaryStatic,
    accentTop: 'from-[#175cd3] to-[#0f3ba0]',
  },
  {
    id: 'review',
    label: 'In Review',
    dotColor: 'bg-amber-500',
    badgeGrad: GRAD.warning,
    accentTop: 'from-[#f59e0b] to-[#d97706]',
  },
  {
    id: 'done',
    label: 'Done',
    dotColor: 'bg-emerald-500',
    badgeGrad: GRAD.success,
    accentTop: 'from-[#22c55e] to-[#15803d]',
  },
];

const INITIAL_TASKS: KanbanTask[] = [
  {
    id: 'KAN-101',
    column: 'backlog',
    title: 'Audit Aksesibilitas Warna Tombol Secondary',
    desc: 'Pastikan kontras teks pada seluruh varian gradient memenuhi rasio AA.',
    category: 'Design Ops',
    priority: 'Medium',
    assignee: 'Siti Rahma',
    initials: 'SR',
    due: '29 Nov',
    comments: 3,
    subtasksDone: 1,
    subtasksTotal: 4,
  },
  {
    id: 'KAN-102',
    column: 'backlog',
    title: 'Tambahkan Ekspor PDF Faktur Tagihan',
    desc: 'Optimalkan tata letak cetak A4 pada halaman Utilities Invoice.',
    category: 'Utilities',
    priority: 'Low',
    assignee: 'Bima Pratama',
    initials: 'BP',
    due: '02 Des',
    comments: 1,
    subtasksDone: 0,
    subtasksTotal: 3,
  },
  {
    id: 'KAN-103',
    column: 'in-progress',
    title: 'Integrasi CRUD Data Rombel & Filter Popover',
    desc: 'Tambahkan tambah/ubah/hapus kelas dengan seleksi baris massal.',
    category: 'Components',
    priority: 'High',
    assignee: 'Fahmi Ibrahim',
    initials: 'FI',
    due: '26 Nov',
    comments: 6,
    subtasksDone: 3,
    subtasksTotal: 4,
  },
  {
    id: 'KAN-104',
    column: 'in-progress',
    title: 'Sinkronisasi Peta Vektor 34 Provinsi',
    desc: 'Lengkapi penanda lokasi cabang Nusantara dan tooltip latensi.',
    category: 'Modules',
    priority: 'High',
    assignee: 'Rizky Hidayat',
    initials: 'RH',
    due: '28 Nov',
    comments: 4,
    subtasksDone: 2,
    subtasksTotal: 3,
  },
  {
    id: 'KAN-105',
    column: 'review',
    title: 'Halaman Auth Standalone Split Layout',
    desc: 'Uji transisi rute Login 2, Register, Forgot Password, dan Reset.',
    category: 'Auth',
    priority: 'Medium',
    assignee: 'Nadia Kusuma',
    initials: 'NK',
    due: '27 Nov',
    comments: 5,
    subtasksDone: 3,
    subtasksTotal: 3,
  },
  {
    id: 'KAN-106',
    column: 'done',
    title: 'Komponen SweetAlert2 & Live Toastr Engine',
    desc: 'Lolos build Vite & TypeScript dengan 0 oxlint warnings.',
    category: 'Modules',
    priority: 'Low',
    assignee: 'Fahmi Ibrahim',
    initials: 'FI',
    due: '26 Nov',
    comments: 8,
    subtasksDone: 5,
    subtasksTotal: 5,
  },
];

export function KanbanBoardSection() {
  const [tasks, setTasks] = useState<KanbanTask[]>(INITIAL_TASKS);
  const [priorityFilter, setPriorityFilter] = useState<'All' | PriorityType>('All');
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<ColumnId | null>(null);
  const [dragOverTaskId, setDragOverTaskId] = useState<string | null>(null);

  // Quick Add Inline State
  const [addingInCol, setAddingInCol] = useState<ColumnId | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<PriorityType>('Medium');
  const [newCategory, setNewCategory] = useState('Components');

  const visibleTasks = useMemo(() => {
    if (priorityFilter === 'All') return tasks;
    return tasks.filter((t) => t.priority === priorityFilter);
  }, [tasks, priorityFilter]);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setDragOverCol(null);
    setDragOverTaskId(null);
  };

  const moveTask = (taskId: string, targetCol: ColumnId, beforeTaskId?: string | null) => {
    setTasks((prev) => {
      const moving = prev.find((t) => t.id === taskId);
      if (!moving) return prev;
      const without = prev.filter((t) => t.id !== taskId);
      const updatedTask: KanbanTask = { ...moving, column: targetCol };

      if (beforeTaskId) {
        const idx = without.findIndex((t) => t.id === beforeTaskId);
        if (idx !== -1) {
          const next = [...without];
          next.splice(idx, 0, updatedTask);
          return next;
        }
      }
      return [...without, updatedTask];
    });
  };

  const handleDropOnColumn = (e: React.DragEvent, targetCol: ColumnId) => {
    e.preventDefault();
    e.stopPropagation();
    const id = draggedTaskId || e.dataTransfer.getData('text/plain');
    if (!id) return;

    const moving = tasks.find((t) => t.id === id);
    if (moving && moving.column !== targetCol) {
      const colLabel = COLUMNS.find((c) => c.id === targetCol)?.label ?? targetCol;
      showToast(`"${moving.title}" dipindahkan ke ${colLabel}`, 'success');
    }
    moveTask(id, targetCol, dragOverTaskId);
    handleDragEnd();
  };

  const handleDropOnCard = (e: React.DragEvent, targetCol: ColumnId, targetTaskId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const id = draggedTaskId || e.dataTransfer.getData('text/plain');
    if (!id || id === targetTaskId) {
      handleDragEnd();
      return;
    }
    const moving = tasks.find((t) => t.id === id);
    if (moving && moving.column !== targetCol) {
      const colLabel = COLUMNS.find((c) => c.id === targetCol)?.label ?? targetCol;
      showToast(`"${moving.title}" dipindahkan ke ${colLabel}`, 'success');
    }
    moveTask(id, targetCol, targetTaskId);
    handleDragEnd();
  };

  const stepColumn = (task: KanbanTask, direction: -1 | 1) => {
    const idx = COLUMNS.findIndex((c) => c.id === task.column);
    const nextIdx = idx + direction;
    if (nextIdx < 0 || nextIdx >= COLUMNS.length) return;
    const nextCol = COLUMNS[nextIdx];
    moveTask(task.id, nextCol.id);
    showToast(`Dipindahkan ke ${nextCol.label}`, 'info');
  };

  const handleCreateTask = (e: React.FormEvent, colId: ColumnId) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast('Judul kartu Kanban wajib diisi.', 'warning');
      return;
    }
    const created: KanbanTask = {
      id: `KAN-${107 + tasks.length}`,
      column: colId,
      title: newTitle.trim(),
      desc: 'Kartu tugas baru ditambahkan langsung ke papan Kanban.',
      category: newCategory,
      priority: newPriority,
      assignee: 'Fahmi Ibrahim',
      initials: 'FI',
      due: 'Hari Ini',
      comments: 0,
      subtasksDone: 0,
      subtasksTotal: 2,
    };
    setTasks((prev) => [created, ...prev]);
    setNewTitle('');
    setAddingInCol(null);
    showToast(`Kartu baru ditambahkan ke ${COLUMNS.find((c) => c.id === colId)?.label}.`, 'success');
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    showToast('Kartu Kanban dihapus.', 'info');
  };

  const resetBoard = () => {
    setTasks(INITIAL_TASKS);
    setPriorityFilter('All');
    setAddingInCol(null);
    showToast('Papan Kanban dikembalikan ke urutan awal.', 'info');
  };

  const priorityBadge = (p: PriorityType) =>
    p === 'High' ? GRAD.danger : p === 'Medium' ? GRAD.warning : GRAD.info;

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-8 h-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full inline-block" />
            <h3 className="text-base sm:text-lg font-bold text-slate-800">
              Kanban Board (Drag &amp; Drop Cards)
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Seret dan jatuhkan kartu antar kolom (*Backlog*, *In Progress*, *In Review*, *Done*) atau atur ulang urutannya langsung.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1">
            {(['All', 'High', 'Medium', 'Low'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriorityFilter(p)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  priorityFilter === p ? `${GRAD.primary} shadow-xs` : GRAD.light
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={resetBoard}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${GRAD.light}`}
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Board
          </button>
        </div>
      </div>

      {/* 4-Column Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-start">
        {COLUMNS.map((col, colIdx) => {
          const colTasks = visibleTasks.filter((t) => t.column === col.id);
          const isOverCol = dragOverCol === col.id;

          return (
            <div
              key={col.id}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                if (dragOverCol !== col.id) setDragOverCol(col.id);
              }}
              onDragLeave={() => {
                if (dragOverCol === col.id) setDragOverCol(null);
              }}
              onDrop={(e) => handleDropOnColumn(e, col.id)}
              className={`bg-white rounded-2xl border transition-all duration-150 flex flex-col min-h-[340px] ${
                isOverCol
                  ? 'border-[#175cd3] ring-2 ring-[#175cd3]/20 shadow-md'
                  : 'border-slate-200/90 shadow-xs'
              }`}
            >
              {/* Thin gradient column top bar */}
              <div className={`h-1.5 w-full rounded-t-2xl bg-gradient-to-r ${col.accentTop}`} />

              {/* Column Header */}
              <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${col.dotColor}`} />
                  <h4 className="text-sm font-bold text-slate-900">{col.label}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${col.badgeGrad}`}>
                    {colTasks.length}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setAddingInCol(addingInCol === col.id ? null : col.id)}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer ${GRAD.light}`}
                  title={`Tambah tugas di ${col.label}`}
                >
                  {addingInCol === col.id ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Quick Inline Add Task Form */}
              {addingInCol === col.id && (
                <form
                  onSubmit={(e) => handleCreateTask(e, col.id)}
                  className="p-3 border-b border-slate-100 space-y-2.5 bg-white"
                >
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Judul kartu tugas..."
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#175cd3]"
                    autoFocus
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value as PriorityType)}
                      className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-[11px] font-semibold text-slate-700 focus:outline-none focus:border-[#175cd3]"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-[11px] font-semibold text-slate-700 focus:outline-none focus:border-[#175cd3]"
                    >
                      <option value="Components">Components</option>
                      <option value="Modules">Modules</option>
                      <option value="Design Ops">Design Ops</option>
                      <option value="Auth">Auth</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className={`w-full py-1.5 rounded-xl text-xs font-semibold shadow-xs cursor-pointer ${GRAD.primary}`}
                  >
                    Simpan Kartu
                  </button>
                </form>
              )}

              {/* Column Cards Stack */}
              <div className="p-3 space-y-3 flex-1">
                {colTasks.map((task) => {
                  const isDragging = draggedTaskId === task.id;
                  const isOverCard = dragOverTaskId === task.id && draggedTaskId !== task.id;
                  return (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onDragEnd={handleDragEnd}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (dragOverCol !== col.id) setDragOverCol(col.id);
                        if (dragOverTaskId !== task.id) setDragOverTaskId(task.id);
                      }}
                      onDrop={(e) => handleDropOnCard(e, col.id, task.id)}
                      className={`group bg-white rounded-xl border p-3.5 space-y-2.5 cursor-grab active:cursor-grabbing transition-all select-none ${
                        isDragging
                          ? 'opacity-40 scale-[0.97] border-dashed border-[#175cd3]'
                          : isOverCard
                            ? 'border-[#175cd3] ring-2 ring-[#175cd3]/20 -translate-y-0.5 shadow-sm'
                            : 'border-slate-200/90 hover:border-[#175cd3]/60 hover:shadow-xs'
                      }`}
                    >
                      {/* Card Top Row: Priority + Category + Grip */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${priorityBadge(task.priority)}`}>
                            {task.priority}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold">
                            {task.category}
                          </span>
                        </div>
                        <GripVertical className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 shrink-0" />
                      </div>

                      {/* Card Title & Description */}
                      <div>
                        <h5 className="text-xs font-bold text-slate-900 leading-snug">{task.title}</h5>
                        <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                          {task.desc}
                        </p>
                      </div>

                      {/* Card Footer Meta + Quick Move Controls */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div
                            title={task.assignee}
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-2xs ${GRAD.primaryStatic}`}
                          >
                            {task.initials}
                          </div>
                          <span className="inline-flex items-center gap-1 text-[10px] text-slate-500">
                            <CheckSquare className="w-3 h-3" />
                            {task.subtasksDone}/{task.subtasksTotal}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] text-slate-500">
                            <MessageSquare className="w-3 h-3" />
                            {task.comments}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] text-slate-500">
                            <Calendar className="w-3 h-3" />
                            {task.due}
                          </span>
                        </div>

                        <div className="flex items-center gap-0.5">
                          {colIdx > 0 && (
                            <button
                              type="button"
                              onClick={() => stepColumn(task, -1)}
                              className="p-1 text-slate-400 hover:text-[#175cd3] rounded cursor-pointer"
                              title="Geser ke kiri"
                            >
                              <ArrowLeft className="w-3 h-3" />
                            </button>
                          )}
                          {colIdx < COLUMNS.length - 1 && (
                            <button
                              type="button"
                              onClick={() => stepColumn(task, 1)}
                              className="p-1 text-slate-400 hover:text-[#175cd3] rounded cursor-pointer"
                              title="Geser ke kanan"
                            >
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => deleteTask(task.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                            title="Hapus kartu"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {colTasks.length === 0 && (
                  <div className="h-32 rounded-xl border border-dashed border-slate-200 flex items-center justify-center text-center px-4 text-xs text-slate-500">
                    Jatuhkan kartu di sini atau klik + untuk menambah tugas baru.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
