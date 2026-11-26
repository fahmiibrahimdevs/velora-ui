import React, { useState, useMemo, useEffect } from 'react';
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
  Search,
  Edit3,
  Eye,
  Send,
  Check,
  Save,
  Filter,
} from 'lucide-react';
import { showToast, showSuccess, confirmDialog } from '../../lib/swal';
import { FeatureSectionHeader } from './FeatureSectionHeader';

const GRAD = {
  primary: 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white',
  primaryStatic: 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white',
  info: 'bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] hover:from-[#0284c7] hover:to-[#0369a1] text-white',
  warning: 'bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:from-[#ea580c] hover:to-[#b45309] text-white',
  danger: 'bg-gradient-to-r from-[#ef4444] to-[#b91c1c] hover:from-[#dc2626] hover:to-[#991b1b] text-white',
  success: 'bg-gradient-to-r from-[#22c55e] to-[#15803d] hover:from-[#16a34a] hover:to-[#166534] text-white',
  light: 'bg-gradient-to-r from-[#f8fafc] to-[#e2e8f0] text-slate-800 border border-slate-200/80',
  dark: 'bg-gradient-to-r from-[#1e293b] to-[#020617] hover:from-[#0f172a] hover:to-[#000000] text-white',
};

type ColumnId = 'backlog' | 'in-progress' | 'review' | 'done';
type PriorityType = 'High' | 'Medium' | 'Low';

interface SubtaskItem {
  id: string;
  title: string;
  done: boolean;
}

interface CommentItem {
  id: string;
  author: string;
  initials: string;
  time: string;
  text: string;
}

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
  subtasks: SubtaskItem[];
  comments: CommentItem[];
}

const STORAGE_KEY = 'velora_kanban_tasks_v2';

const TEAM_MEMBERS = [
  { name: 'Fahmi Ibrahim', initials: 'FI' },
  { name: 'Nadia Kusuma', initials: 'NK' },
  { name: 'Bima Pratama', initials: 'BP' },
  { name: 'Rizky Hidayat', initials: 'RH' },
  { name: 'Siti Rahma', initials: 'SR' },
];

const CATEGORIES = ['Features', 'Components', 'Modules', 'Design Ops', 'Auth', 'Utilities'];

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
    desc: 'Pastikan kontras teks pada seluruh varian gradient memenuhi rasio AA untuk keterbacaan optimal.',
    category: 'Design Ops',
    priority: 'Medium',
    assignee: 'Siti Rahma',
    initials: 'SR',
    due: '2026-11-29',
    subtasks: [
      { id: 's1', title: 'Cek kontras tombol Light & Secondary', done: true },
      { id: 's2', title: 'Validasi focus ring pada mode keyboard', done: false },
      { id: 's3', title: 'Perbarui dokumentasi style token', done: false },
    ],
    comments: [
      { id: 'c1', author: 'Fahmi Ibrahim', initials: 'FI', time: '2 jam lalu', text: 'Fokus utamanya di kartu putih agar teks deskripsi tetap tajam.' },
    ],
  },
  {
    id: 'KAN-102',
    column: 'backlog',
    title: 'Tambahkan Ekspor PDF Faktur Tagihan',
    desc: 'Optimalkan tata letak cetak A4 pada halaman Utilities Invoice agar bebas terpotong margin.',
    category: 'Utilities',
    priority: 'Low',
    assignee: 'Bima Pratama',
    initials: 'BP',
    due: '2026-12-02',
    subtasks: [
      { id: 's4', title: 'Atur media query @media print', done: false },
      { id: 's5', title: 'Tambahkan footer tanda tangan resmi', done: false },
    ],
    comments: [],
  },
  {
    id: 'KAN-103',
    column: 'in-progress',
    title: 'Integrasi CRUD Data Rombel & Filter Popover',
    desc: 'Tambahkan tambah/ubah/hapus kelas dengan seleksi baris massal, filter popover, serta ekspor CSV.',
    category: 'Components',
    priority: 'High',
    assignee: 'Fahmi Ibrahim',
    initials: 'FI',
    due: '2026-11-26',
    subtasks: [
      { id: 's6', title: 'Modal tambah & edit tervalidasi', done: true },
      { id: 's7', title: 'Dropdown filter popover multi-kriteria', done: true },
      { id: 's8', title: 'Simpan state ke localStorage', done: false },
    ],
    comments: [
      { id: 'c2', author: 'Nadia Kusuma', initials: 'NK', time: '1 jam lalu', text: 'Tampilan tabel compact-nya sudah sangat pas dan rapi.' },
    ],
  },
  {
    id: 'KAN-104',
    column: 'in-progress',
    title: 'Sinkronisasi Peta Vektor 34 Provinsi',
    desc: 'Lengkapi penanda lokasi cabang Nusantara dan tooltip latensi interaktif tanpa CDN eksternal.',
    category: 'Modules',
    priority: 'High',
    assignee: 'Rizky Hidayat',
    initials: 'RH',
    due: '2026-11-28',
    subtasks: [
      { id: 's9', title: 'Verifikasi koordinat centroid 34 provinsi', done: true },
      { id: 's10', title: 'Tambahkan animasi koneksi cabang', done: true },
    ],
    comments: [],
  },
  {
    id: 'KAN-105',
    column: 'review',
    title: 'Halaman Auth Standalone Split Layout',
    desc: 'Uji transisi rute Login 2, Register, Forgot Password, dan Reset Password tanpa pembungkus admin.',
    category: 'Auth',
    priority: 'Medium',
    assignee: 'Nadia Kusuma',
    initials: 'NK',
    due: '2026-11-27',
    subtasks: [
      { id: 's11', title: 'Validasi strength meter password', done: true },
      { id: 's12', title: 'Pastikan tombol kembali ke dashboard aktif', done: true },
    ],
    comments: [
      { id: 'c3', author: 'Bima Pratama', initials: 'BP', time: 'Kemarin', text: 'Semua 5 layar auth sudah ditest di mobile dan desktop.' },
    ],
  },
  {
    id: 'KAN-106',
    column: 'done',
    title: 'Komponen SweetAlert2 & Live Toastr Engine',
    desc: 'Lolos build Vite & TypeScript dengan 0 oxlint warnings di seluruh variasi dialog.',
    category: 'Modules',
    priority: 'Low',
    assignee: 'Fahmi Ibrahim',
    initials: 'FI',
    due: '2026-11-26',
    subtasks: [
      { id: 's13', title: 'Implementasi 6 sudut toast stack', done: true },
      { id: 's14', title: 'Playground kode interaktif', done: true },
    ],
    comments: [],
  },
];

interface TaskFormState {
  title: string;
  desc: string;
  column: ColumnId;
  priority: PriorityType;
  category: string;
  assignee: string;
  due: string;
  subtasks: SubtaskItem[];
}

function loadTasks(): KanbanTask[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as KanbanTask[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return INITIAL_TASKS;
}

function formatDueDate(iso: string): string {
  if (!iso) return 'Tanpa Batas';
  const parts = iso.split('-');
  if (parts.length !== 3) return iso;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const m = Number(parts[1]) - 1;
  return `${parts[2]} ${months[m] ?? parts[1]}`;
}

export function KanbanView() {
  const [tasks, setTasks] = useState<KanbanTask[]>(loadTasks);
  const [priorityFilter, setPriorityFilter] = useState<'All' | PriorityType>('All');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('All');
  const [search, setSearch] = useState('');

  // Drag & Drop State
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<ColumnId | null>(null);
  const [dragOverTaskId, setDragOverTaskId] = useState<string | null>(null);

  // Full Create / Edit Modal State
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState<TaskFormState>({
    title: '',
    desc: '',
    column: 'backlog',
    priority: 'Medium',
    category: 'Features',
    assignee: 'Fahmi Ibrahim',
    due: '2026-11-30',
    subtasks: [],
  });
  const [newSubtaskText, setNewSubtaskText] = useState('');
  const [formError, setFormError] = useState('');

  // Detail Modal State
  const [detailTaskId, setDetailTaskId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {}
  }, [tasks]);

  const visibleTasks = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tasks.filter((t) => {
      const matchPriority = priorityFilter === 'All' || t.priority === priorityFilter;
      const matchAssignee = assigneeFilter === 'All' || t.assignee === assigneeFilter;
      const matchSearch =
        !q ||
        t.id.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.assignee.toLowerCase().includes(q) ||
        t.desc.toLowerCase().includes(q);
      return matchPriority && matchAssignee && matchSearch;
    });
  }, [tasks, priorityFilter, assigneeFilter, search]);

  const doneCount = useMemo(() => tasks.filter((t) => t.column === 'done').length, [tasks]);
  const sprintPct = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;

  const detailTask = useMemo(
    () => tasks.find((t) => t.id === detailTaskId) ?? null,
    [tasks, detailTaskId]
  );

  // Drag & Drop handlers
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

  // Create / Edit Modal Handlers
  const openCreateModal = (col: ColumnId = 'backlog') => {
    setEditingId(null);
    setFormState({
      title: '',
      desc: '',
      column: col,
      priority: 'Medium',
      category: 'Features',
      assignee: TEAM_MEMBERS[0].name,
      due: '2026-11-30',
      subtasks: [],
    });
    setNewSubtaskText('');
    setFormError('');
    setFormOpen(true);
  };

  const openEditModal = (task: KanbanTask) => {
    setEditingId(task.id);
    setFormState({
      title: task.title,
      desc: task.desc,
      column: task.column,
      priority: task.priority,
      category: task.category,
      assignee: task.assignee,
      due: task.due,
      subtasks: task.subtasks.map((s) => ({ ...s })),
    });
    setNewSubtaskText('');
    setFormError('');
    setFormOpen(true);
  };

  const addSubtaskToForm = () => {
    if (!newSubtaskText.trim()) return;
    setFormState((prev) => ({
      ...prev,
      subtasks: [
        ...prev.subtasks,
        { id: `sub-${Date.now()}-${prev.subtasks.length}`, title: newSubtaskText.trim(), done: false },
      ],
    }));
    setNewSubtaskText('');
  };

  const handleSaveTaskForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.title.trim()) {
      setFormError('Judul tugas wajib diisi.');
      return;
    }

    const member = TEAM_MEMBERS.find((m) => m.name === formState.assignee) ?? TEAM_MEMBERS[0];

    if (editingId) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingId
            ? {
                ...t,
                title: formState.title.trim(),
                desc: formState.desc.trim() || 'Tidak ada deskripsi tambahan.',
                column: formState.column,
                priority: formState.priority,
                category: formState.category,
                assignee: member.name,
                initials: member.initials,
                due: formState.due,
                subtasks: formState.subtasks,
              }
            : t
        )
      );
      setFormOpen(false);
      await showSuccess('Tugas Diperbarui!', `${editingId} berhasil disimpan.`);
    } else {
      const nextNum =
        tasks.reduce((max, t) => {
          const n = Number(t.id.replace('KAN-', ''));
          return Number.isFinite(n) ? Math.max(max, n) : max;
        }, 100) + 1;
      const newTask: KanbanTask = {
        id: `KAN-${nextNum}`,
        column: formState.column,
        title: formState.title.trim(),
        desc: formState.desc.trim() || 'Tugas baru dijadwalkan di papan sprint.',
        category: formState.category,
        priority: formState.priority,
        assignee: member.name,
        initials: member.initials,
        due: formState.due,
        subtasks: formState.subtasks,
        comments: [],
      };
      setTasks((prev) => [newTask, ...prev]);
      setFormOpen(false);
      await showSuccess('Tugas Ditambahkan!', `${newTask.id} dibuat di kolom ${COLUMNS.find((c) => c.id === newTask.column)?.label}.`);
    }
  };

  const handleDeleteTask = async (task: KanbanTask) => {
    const ok = await confirmDialog({
      title: `Hapus ${task.id}?`,
      text: `Kartu "${task.title}" akan dihapus permanen dari papan Kanban.`,
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
      isDangerous: true,
      icon: 'warning',
    });
    if (!ok) return;
    setTasks((prev) => prev.filter((t) => t.id !== task.id));
    if (detailTaskId === task.id) setDetailTaskId(null);
    showToast(`Kartu ${task.id} dihapus.`, 'success');
  };

  // Detail Modal Actions (Live Subtask Toggle & Add Comment)
  const toggleSubtaskInBoard = (taskId: string, subId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              subtasks: t.subtasks.map((s) => (s.id === subId ? { ...s, done: !s.done } : s)),
            }
          : t
      )
    );
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!detailTask || !commentInput.trim()) return;
    const newComment: CommentItem = {
      id: `cmt-${Date.now()}`,
      author: 'Fahmi Ibrahim',
      initials: 'FI',
      time: 'Baru saja',
      text: commentInput.trim(),
    };
    setTasks((prev) =>
      prev.map((t) =>
        t.id === detailTask.id ? { ...t, comments: [...t.comments, newComment] } : t
      )
    );
    setCommentInput('');
    showToast('Komentar ditambahkan.', 'success');
  };

  const resetBoard = async () => {
    const ok = await confirmDialog({
      title: 'Reset Papan Kanban?',
      text: 'Mengembalikan semua kolom, tugas, dan subtask ke kondisi awal bawaan.',
      confirmButtonText: 'Reset Board',
      cancelButtonText: 'Batal',
      icon: 'question',
    });
    if (!ok) return;
    setTasks(INITIAL_TASKS);
    setPriorityFilter('All');
    setAssigneeFilter('All');
    setSearch('');
    setDetailTaskId(null);
    showToast('Papan Kanban dikembalikan ke kondisi awal.', 'info');
  };

  const priorityBadge = (p: PriorityType) =>
    p === 'High' ? GRAD.danger : p === 'Medium' ? GRAD.warning : GRAD.info;

  return (
    <div className="space-y-6">
      {/* Top Header + Main Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <FeatureSectionHeader
          title="Kanban"
          description="Manajemen sprint lengkap: Drag & drop kartu, modal tambah & edit tugas, checklist subtask, komentar langsung, serta filter pelaksana."
        />

        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          <div className="px-3 py-1.5 rounded-xl bg-white border border-slate-200/90 text-xs font-semibold text-slate-700 flex items-center gap-2 shadow-2xs">
            <span>Progres Selesai:</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${GRAD.success}`}>
              {doneCount}/{tasks.length} ({sprintPct}%)
            </span>
          </div>

          <button
            type="button"
            onClick={resetBoard}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer ${GRAD.light}`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Board</span>
          </button>

          <button
            type="button"
            onClick={() => openCreateModal('backlog')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold shadow-xs cursor-pointer ${GRAD.primary}`}
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Tugas</span>
          </button>
        </div>
      </div>

      {/* Cardless Filter & Search Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
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
                {p === 'All' ? 'Semua Prioritas' : p}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#175cd3] cursor-pointer"
            >
              <option value="All">Semua Pelaksana</option>
              {TEAM_MEMBERS.map((m) => (
                <option key={m.name} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari ID, judul, kategori, pelaksana..."
            className="w-full pl-8.5 pr-7 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#175cd3]"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          )}
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
              className={`bg-white rounded-2xl border transition-all duration-150 flex flex-col min-h-[420px] ${
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
                  onClick={() => openCreateModal(col.id)}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer ${GRAD.light}`}
                  title={`Tambah tugas di ${col.label}`}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Column Cards Stack */}
              <div className="p-3 space-y-3 flex-1">
                {colTasks.map((task) => {
                  const isDragging = draggedTaskId === task.id;
                  const isOverCard = dragOverTaskId === task.id && draggedTaskId !== task.id;
                  const doneSubs = task.subtasks.filter((s) => s.done).length;
                  const totalSubs = task.subtasks.length;
                  const subPct = totalSubs > 0 ? Math.round((doneSubs / totalSubs) * 100) : 0;

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
                      onClick={() => setDetailTaskId(task.id)}
                      className={`group bg-white rounded-xl border p-3.5 space-y-2.5 cursor-grab active:cursor-grabbing transition-all select-none ${
                        isDragging
                          ? 'opacity-40 scale-[0.97] border-dashed border-[#175cd3]'
                          : isOverCard
                            ? 'border-[#175cd3] ring-2 ring-[#175cd3]/20 -translate-y-0.5 shadow-sm'
                            : 'border-slate-200/90 hover:border-[#175cd3]/60 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${priorityBadge(task.priority)}`}>
                            {task.priority}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold">
                            {task.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-mono text-slate-400">{task.id}</span>
                          <GripVertical className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 shrink-0" />
                        </div>
                      </div>

                      <div>
                        <h5 className="text-xs font-bold text-slate-900 leading-snug group-hover:text-[#175cd3] transition-colors">
                          {task.title}
                        </h5>
                        <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                          {task.desc}
                        </p>
                      </div>

                      {/* Mini Subtask Progress Bar if Subtasks Exist */}
                      {totalSubs > 0 && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[10px] text-slate-500">
                            <span className="inline-flex items-center gap-1 font-medium">
                              <CheckSquare className="w-3 h-3 text-[#175cd3]" />
                              {doneSubs}/{totalSubs} Subtask
                            </span>
                            <span className="font-semibold text-slate-700">{subPct}%</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                subPct === 100 ? GRAD.success : GRAD.primaryStatic
                              }`}
                              style={{ width: `${subPct}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <div
                        className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            title={task.assignee}
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-2xs ${GRAD.primaryStatic}`}
                          >
                            {task.initials}
                          </div>
                          <span className="inline-flex items-center gap-1 text-[10px] text-slate-500">
                            <MessageSquare className="w-3 h-3" />
                            {task.comments.length}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] text-slate-500">
                            <Calendar className="w-3 h-3" />
                            {formatDueDate(task.due)}
                          </span>
                        </div>

                        <div className="flex items-center gap-0.5">
                          <button
                            type="button"
                            onClick={() => setDetailTaskId(task.id)}
                            className="p-1 text-slate-400 hover:text-[#175cd3] rounded cursor-pointer"
                            title="Detail & Komentar"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditModal(task)}
                            className="p-1 text-slate-400 hover:text-amber-600 rounded cursor-pointer"
                            title="Edit Tugas"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
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
                            onClick={() => handleDeleteTask(task)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                            title="Hapus Tugas"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {colTasks.length === 0 && (
                  <div className="h-36 rounded-xl border border-dashed border-slate-200 flex items-center justify-center text-center px-4 text-xs text-slate-500">
                    Jatuhkan kartu di sini atau klik + untuk menambah tugas baru.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ================================================================ */}
      {/* FULL CREATE / EDIT TASK MODAL                                    */}
      {/* ================================================================ */}
      {formOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden max-h-[92vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingId ? `Edit Tugas (${editingId})` : 'Tambah Tugas Kanban Baru'}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Lengkapi rincian tugas, pelaksana, prioritas, tenggat waktu, dan daftar subtask.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className={`p-1.5 rounded-xl cursor-pointer ${GRAD.light}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTaskForm} className="p-6 space-y-4 overflow-y-auto">
              {formError && (
                <div className="p-3 rounded-xl border border-red-200 bg-red-50 text-xs font-semibold text-red-700">
                  {formError}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700" htmlFor="kan-title">
                  Judul Tugas
                </label>
                <input
                  id="kan-title"
                  type="text"
                  value={formState.title}
                  onChange={(e) => setFormState((s) => ({ ...s, title: e.target.value }))}
                  placeholder="cth. Optimasi Caching API Laporan Keuangan"
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700" htmlFor="kan-desc">
                  Deskripsi Tugas
                </label>
                <textarea
                  id="kan-desc"
                  rows={3}
                  value={formState.desc}
                  onChange={(e) => setFormState((s) => ({ ...s, desc: e.target.value }))}
                  placeholder="Jelaskan ruang lingkup, kriteria selesai, atau catatan teknis..."
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700" htmlFor="kan-col">
                    Kolom Tahapan
                  </label>
                  <select
                    id="kan-col"
                    value={formState.column}
                    onChange={(e) => setFormState((s) => ({ ...s, column: e.target.value as ColumnId }))}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
                  >
                    {COLUMNS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700" htmlFor="kan-prio">
                    Prioritas
                  </label>
                  <select
                    id="kan-prio"
                    value={formState.priority}
                    onChange={(e) => setFormState((s) => ({ ...s, priority: e.target.value as PriorityType }))}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700" htmlFor="kan-cat">
                    Kategori
                  </label>
                  <select
                    id="kan-cat"
                    value={formState.category}
                    onChange={(e) => setFormState((s) => ({ ...s, category: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700" htmlFor="kan-pic">
                    Pelaksana
                  </label>
                  <select
                    id="kan-pic"
                    value={formState.assignee}
                    onChange={(e) => setFormState((s) => ({ ...s, assignee: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
                  >
                    {TEAM_MEMBERS.map((m) => (
                      <option key={m.name} value={m.name}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700" htmlFor="kan-due">
                    Tenggat Waktu
                  </label>
                  <input
                    id="kan-due"
                    type="date"
                    value={formState.due}
                    onChange={(e) => setFormState((s) => ({ ...s, due: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
                  />
                </div>
              </div>

              {/* Dynamic Subtasks Builder */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="block text-xs font-semibold text-slate-700">Checklist Subtask</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSubtaskText}
                    onChange={(e) => setNewSubtaskText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSubtaskToForm();
                      }
                    }}
                    placeholder="Tambah poin subtask lalu tekan Enter..."
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#175cd3]"
                  />
                  <button
                    type="button"
                    onClick={addSubtaskToForm}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${GRAD.info}`}
                  >
                    + Tambah
                  </button>
                </div>

                <div className="space-y-1.5">
                  {formState.subtasks.map((sub) => (
                    <div
                      key={sub.id}
                      className="px-3 py-2 rounded-xl border border-slate-200/80 flex items-center justify-between gap-2 text-xs"
                    >
                      <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0">
                        <input
                          type="checkbox"
                          checked={sub.done}
                          onChange={() =>
                            setFormState((s) => ({
                              ...s,
                              subtasks: s.subtasks.map((item) =>
                                item.id === sub.id ? { ...item, done: !item.done } : item
                              ),
                            }))
                          }
                          className="w-4 h-4 accent-[#175cd3] cursor-pointer"
                        />
                        <span className={sub.done ? 'line-through text-slate-400 truncate' : 'text-slate-800 truncate'}>
                          {sub.title}
                        </span>
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setFormState((s) => ({
                            ...s,
                            subtasks: s.subtasks.filter((item) => item.id !== sub.id),
                          }))
                        }
                        className="text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer ${GRAD.light}`}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold shadow-xs cursor-pointer ${GRAD.primary}`}
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingId ? 'Simpan Perubahan' : 'Buat Tugas'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* DETAIL INSPECTOR, SUBTASK CHECKLIST & LIVE COMMENTS MODAL        */}
      {/* ================================================================ */}
      {detailTask && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden max-h-[92vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${GRAD.primaryStatic}`}>
                  {detailTask.id}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${priorityBadge(detailTask.priority)}`}>
                  {detailTask.priority} Priority
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold">
                  {detailTask.category}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setDetailTaskId(null)}
                className={`p-1.5 rounded-xl cursor-pointer ${GRAD.light}`}
                aria-label="Tutup detail tugas"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto">
              {/* Pelaksana & Tenggat Bar Above Title */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 ${GRAD.primaryStatic}`}>
                    {detailTask.initials}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500">Pelaksana:</span>
                    <span className="font-bold text-slate-900">{detailTask.assignee}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-slate-700">
                  <Calendar className="w-3.5 h-3.5 text-[#175cd3]" />
                  <span className="text-slate-500">Tenggat:</span>
                  <span className="font-bold text-slate-900">{formatDueDate(detailTask.due)}</span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">{detailTask.title}</h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{detailTask.desc}</p>
              </div>

              {/* Clickable Stage Stepper */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3 border-y border-slate-100 text-xs">
                <span className="text-[11px] font-semibold text-slate-500">Status Tahapan:</span>
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-1.5">
                  {COLUMNS.map((col) => {
                    const active = detailTask.column === col.id;
                    return (
                      <button
                        key={col.id}
                        type="button"
                        onClick={() => {
                          if (active) return;
                          moveTask(detailTask.id, col.id);
                          showToast(`Dipindahkan ke ${col.label}`, 'success');
                        }}
                        className={`px-3 py-1 rounded-full text-[11px] font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                          active ? `${col.badgeGrad} shadow-xs` : GRAD.light
                        }`}
                      >
                        {!active && <span className={`w-1.5 h-1.5 rounded-full ${col.dotColor}`} />}
                        <span>{col.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Interactive Subtasks Checklist */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">
                    Checklist Subtask ({detailTask.subtasks.filter((s) => s.done).length}/{detailTask.subtasks.length})
                  </span>
                </div>
                {detailTask.subtasks.length === 0 ? (
                  <p className="text-xs text-slate-500">Belum ada subtask. Klik tombol Edit untuk menambahkan checklist.</p>
                ) : (
                  <div className="space-y-1.5">
                    {detailTask.subtasks.map((sub) => (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => toggleSubtaskInBoard(detailTask.id, sub.id)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/80 hover:border-[#175cd3]/50 flex items-center gap-2.5 text-left text-xs cursor-pointer transition-all"
                      >
                        <span
                          className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                            sub.done ? GRAD.success : 'border border-slate-300 bg-white'
                          }`}
                        >
                          {sub.done && <Check className="w-3 h-3" />}
                        </span>
                        <span className={sub.done ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}>
                          {sub.title}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Live Comments Thread */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-900">
                  Diskusi &amp; Komentar ({detailTask.comments.length})
                </h4>

                <div className="space-y-2">
                  {detailTask.comments.map((cmt) => (
                    <div key={cmt.id} className="p-3 rounded-xl border border-slate-200/80 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{cmt.author}</span>
                        <span className="text-[11px] text-slate-500">{cmt.time}</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{cmt.text}</p>
                    </div>
                  ))}
                  {detailTask.comments.length === 0 && (
                    <p className="text-xs text-slate-500">Belum ada komentar. Mulai diskusi tim di bawah ini.</p>
                  )}
                </div>

                <form onSubmit={handleAddComment} className="flex gap-2">
                  <input
                    type="text"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Tulis catatan atau pembaruan progres..."
                    className="flex-1 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#175cd3]"
                  />
                  <button
                    type="submit"
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold shadow-xs cursor-pointer ${GRAD.primary}`}
                  >
                    <Send className="w-3.5 h-3.5" /> Kirim
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
