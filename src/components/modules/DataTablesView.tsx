import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Check,
  Minus,
  Trash2,
  Edit3,
  Download,
  SlidersHorizontal,
  Plus,
  Loader2,
  RefreshCw,
  X,
  Copy,
  Layers,
} from 'lucide-react';
import { showToast, showSuccess } from '../../lib/swal';

// ============================================================================
// DATASETS & TYPES
// ============================================================================

interface EmployeeRow {
  id: number;
  name: string;
  position: string;
  office: string;
  age: number;
  startDate: string;
  salary: number;
  status: 'Active' | 'Onboarding' | 'On Leave';
}

const INITIAL_EMPLOYEES: EmployeeRow[] = [
  { id: 1, name: 'Fahmi Ibrahim', position: 'Lead Frontend Architect', office: 'Bandung', age: 27, startDate: '2022-03-14', salary: 28500000, status: 'Active' },
  { id: 2, name: 'Nadia Kusuma', position: 'Product Designer', office: 'Jakarta', age: 25, startDate: '2023-07-02', salary: 19500000, status: 'Active' },
  { id: 3, name: 'Rizky Pratama', position: 'Backend Engineer', office: 'Surabaya', age: 29, startDate: '2021-11-18', salary: 24000000, status: 'Active' },
  { id: 4, name: 'Siti Rahmawati', position: 'QA Automation Lead', office: 'Yogyakarta', age: 26, startDate: '2024-01-09', salary: 18000000, status: 'Onboarding' },
  { id: 5, name: 'Bagas Saputra', position: 'DevOps & Cloud SRE', office: 'Jakarta', age: 31, startDate: '2020-05-22', salary: 29500000, status: 'Active' },
  { id: 6, name: 'Aulia Putri', position: 'Data Analyst', office: 'Bandung', age: 24, startDate: '2024-04-15', salary: 16500000, status: 'On Leave' },
  { id: 7, name: 'Dimas Wijaya', position: 'Mobile Engineer', office: 'Malang', age: 28, startDate: '2022-09-01', salary: 22000000, status: 'Active' },
  { id: 8, name: 'Citra Lestari', position: 'UI/UX Researcher', office: 'Jakarta', age: 27, startDate: '2023-02-11', salary: 18800000, status: 'Active' },
  { id: 9, name: 'Hendra Gunawan', position: 'Security Specialist', office: 'Semarang', age: 33, startDate: '2019-08-19', salary: 31000000, status: 'Active' },
  { id: 10, name: 'Tari Amanda', position: 'Scrum Master', office: 'Bandung', age: 30, startDate: '2021-06-25', salary: 23500000, status: 'On Leave' },
  { id: 11, name: 'Yoga Permana', position: 'Fullstack Developer', office: 'Bali', age: 26, startDate: '2023-10-03', salary: 21000000, status: 'Onboarding' },
  { id: 12, name: 'Maya Salsabila', position: 'Technical Writer', office: 'Jakarta', age: 25, startDate: '2024-02-20', salary: 15200000, status: 'Active' },
  { id: 13, name: 'Arif Hidayat', position: 'System Architect', office: 'Surabaya', age: 35, startDate: '2018-12-01', salary: 36000000, status: 'Active' },
  { id: 14, name: 'Dewi Anggraini', position: 'HR Tech Specialist', office: 'Bandung', age: 28, startDate: '2022-01-17', salary: 17400000, status: 'Active' },
];

interface TaskRow {
  id: string;
  task: string;
  department: 'Engineering' | 'Product' | 'Marketing' | 'Finance';
  assignee: string;
  progress: number;
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
  status: 'Completed' | 'In Progress' | 'Pending' | 'Blocked';
}

const INITIAL_TASKS: TaskRow[] = [
  { id: 'TSK-101', task: 'Migrasi Design System Gradient Buttons', department: 'Product', assignee: 'Nadia Kusuma', progress: 100, priority: 'High', dueDate: '2026-11-26', status: 'Completed' },
  { id: 'TSK-102', task: 'Optimasi Query Redis & Pagination API', department: 'Engineering', assignee: 'Rizky Pratama', progress: 78, priority: 'High', dueDate: '2026-11-28', status: 'In Progress' },
  { id: 'TSK-103', task: 'Kampanye Peluncuran Velora v2.5', department: 'Marketing', assignee: 'Citra Lestari', progress: 45, priority: 'Medium', dueDate: '2026-12-03', status: 'In Progress' },
  { id: 'TSK-104', task: 'Rekonsiliasi Invoice Q4 & Pajak', department: 'Finance', assignee: 'Aulia Putri', progress: 20, priority: 'High', dueDate: '2026-12-05', status: 'Pending' },
  { id: 'TSK-105', task: 'Audit Akses IAM & SSL Wildcard', department: 'Engineering', assignee: 'Hendra Gunawan', progress: 15, priority: 'High', dueDate: '2026-11-29', status: 'Blocked' },
  { id: 'TSK-106', task: 'Usability Testing Modul Upload Files', department: 'Product', assignee: 'Siti Rahmawati', progress: 100, priority: 'Low', dueDate: '2026-11-25', status: 'Completed' },
  { id: 'TSK-107', task: 'Integrasi Webhook Pembayaran QRIS', department: 'Engineering', assignee: 'Dimas Wijaya', progress: 62, priority: 'Medium', dueDate: '2026-12-01', status: 'In Progress' },
  { id: 'TSK-108', task: 'Penyusunan Laporan Anggaran 2027', department: 'Finance', assignee: 'Dewi Anggraini', progress: 10, priority: 'Low', dueDate: '2026-12-12', status: 'Pending' },
];

interface FeedTransaction {
  id: string;
  customer: string;
  email: string;
  category: 'Subscription' | 'Invoice' | 'Refund';
  amount: number;
  date: string;
  status: 'Paid' | 'Processing' | 'Refunded';
}

const INITIAL_FEED: FeedTransaction[] = [
  { id: 'TRX-9012', customer: 'PT Nusantara Digital', email: 'billing@nusantara.co.id', category: 'Subscription', amount: 4500000, date: '26 Nov 2026, 14:20', status: 'Paid' },
  { id: 'TRX-9011', customer: 'Studio Kreasi Bandung', email: 'finance@studiokreasi.id', category: 'Invoice', amount: 2750000, date: '26 Nov 2026, 13:45', status: 'Paid' },
  { id: 'TRX-9010', customer: 'Bintang Tech Lab', email: 'ops@bintanglab.io', category: 'Subscription', amount: 1850000, date: '26 Nov 2026, 12:10', status: 'Processing' },
  { id: 'TRX-9009', customer: 'CV Karya Mandiri', email: 'admin@karyamandiri.com', category: 'Refund', amount: 950000, date: '26 Nov 2026, 11:05', status: 'Refunded' },
  { id: 'TRX-9008', customer: 'Awan Cloud Indonesia', email: 'ap@awancloud.id', category: 'Invoice', amount: 6200000, date: '25 Nov 2026, 17:30', status: 'Paid' },
  { id: 'TRX-9007', customer: 'Velora Enterprise Corp', email: 'corp@velora.id', category: 'Subscription', amount: 8900000, date: '25 Nov 2026, 16:12', status: 'Paid' },
  { id: 'TRX-9006', customer: 'Sinar Edukasi Global', email: 'pay@sinaredu.ac.id', category: 'Invoice', amount: 3100000, date: '25 Nov 2026, 15:02', status: 'Processing' },
  { id: 'TRX-9005', customer: 'Delta Logistic Systems', email: 'acc@deltalog.co.id', category: 'Subscription', amount: 4200000, date: '25 Nov 2026, 10:48', status: 'Paid' },
  { id: 'TRX-9004', customer: 'Garuda Fintech', email: 'settlement@garudafin.id', category: 'Refund', amount: 1400000, date: '24 Nov 2026, 18:19', status: 'Refunded' },
  { id: 'TRX-9003', customer: 'Kopi Senja Franchise', email: 'owner@kopisenja.id', category: 'Subscription', amount: 1250000, date: '24 Nov 2026, 14:55', status: 'Paid' },
  { id: 'TRX-9002', customer: 'Merdeka Retail Group', email: 'vendor@merdekaretail.com', category: 'Invoice', amount: 5400000, date: '24 Nov 2026, 09:30', status: 'Paid' },
  { id: 'TRX-9001', customer: 'Orion Software House', email: 'hello@orionsoft.dev', category: 'Subscription', amount: 2300000, date: '23 Nov 2026, 16:40', status: 'Paid' },
];

interface ExpandableVendor {
  id: string;
  name: string;
  pic: string;
  tier: 'Enterprise' | 'Growth' | 'Starter';
  status: 'Verified' | 'Review';
  apiKey: string;
  address: string;
  lastAudit: string;
  notes: string;
}

const INITIAL_VENDORS: ExpandableVendor[] = [
  {
    id: 'VND-01',
    name: 'PT Teknologi Cakrawala',
    pic: 'Budi Santoso',
    tier: 'Enterprise',
    status: 'Verified',
    apiKey: 'vlr_live_98a2f4d9e10c7b31',
    address: 'Jl. Asia Afrika No. 112, Bandung',
    lastAudit: '20 Nov 2026',
    notes: 'SLA 99.99% aktif hingga Desember 2027 dengan dedicated support channel.',
  },
  {
    id: 'VND-02',
    name: 'Kreatif Digital Solusi',
    pic: 'Rina Marlina',
    tier: 'Growth',
    status: 'Verified',
    apiKey: 'vlr_live_41c8b2e77f902d12',
    address: 'Jl. Sudirman Kav. 52, Jakarta Selatan',
    lastAudit: '18 Nov 2026',
    notes: 'Integrasi webhook pembayaran berjalan stabil tanpa error.',
  },
  {
    id: 'VND-03',
    name: 'Andalas Data Center',
    pic: 'Fajar Nugroho',
    tier: 'Starter',
    status: 'Review',
    apiKey: 'vlr_test_77d1a0b39e551f08',
    address: 'Jl. Diponegoro No. 45, Surabaya',
    lastAudit: '25 Nov 2026',
    notes: 'Menunggu verifikasi dokumen NPWP dan penandatanganan addendum.',
  },
];

interface LedgerEntry {
  id: string;
  desc: string;
  client: string;
  subtotal: number;
  tax: number;
  quarter: 'Q3' | 'Q4';
}

const INITIAL_LEDGER: LedgerEntry[] = [
  { id: 'INV-2601', desc: 'Lisensi Tahunan Velora Cloud', client: 'PT Nusantara Digital', subtotal: 12000000, tax: 1320000, quarter: 'Q4' },
  { id: 'INV-2602', desc: 'Pengembangan Modul Custom HRIS', client: 'Merdeka Retail Group', subtotal: 24500000, tax: 2695000, quarter: 'Q4' },
  { id: 'INV-2603', desc: 'Audit Keamanan & Load Testing', client: 'Garuda Fintech', subtotal: 9500000, tax: 1045000, quarter: 'Q3' },
  { id: 'INV-2604', desc: 'Dedicated Cluster Hosting (6 Bln)', client: 'Awan Cloud Indonesia', subtotal: 18000000, tax: 1980000, quarter: 'Q4' },
];

// ============================================================================
// GRADIENT TOKENS (Matching ButtonsView standard)
// ============================================================================
const GRAD = {
  primary: 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white',
  primaryStatic: 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white',
  secondary: 'bg-gradient-to-r from-[#cbd5e1] to-[#94a3b8] hover:from-[#94a3b8] hover:to-[#64748b] text-white',
  info: 'bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] hover:from-[#0284c7] hover:to-[#0369a1] text-white',
  infoStatic: 'bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] text-white',
  warning: 'bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:from-[#ea580c] hover:to-[#b45309] text-white',
  warningStatic: 'bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white',
  danger: 'bg-gradient-to-r from-[#ef4444] to-[#b91c1c] hover:from-[#dc2626] hover:to-[#991b1b] text-white',
  dangerStatic: 'bg-gradient-to-r from-[#ef4444] to-[#b91c1c] text-white',
  success: 'bg-gradient-to-r from-[#22c55e] to-[#15803d] hover:from-[#16a34a] hover:to-[#166534] text-white',
  successStatic: 'bg-gradient-to-r from-[#22c55e] to-[#15803d] text-white',
  light: 'bg-gradient-to-r from-[#f8fafc] to-[#e2e8f0] text-slate-800 border border-slate-200/80',
  dark: 'bg-gradient-to-r from-[#1e293b] to-[#020617] hover:from-[#0f172a] hover:to-[#000000] text-white',
};

function formatRupiah(num: number): string {
  return 'Rp ' + num.toLocaleString('id-ID');
}

// ============================================================================
// MAIN DATATABLES VIEW
// ============================================================================

export function DataTablesView() {
  // -------------------------------------------------------------------------
  // TABLE 1: BASIC DATATABLES (Show Entries, Sort, Search, Pagination)
  // -------------------------------------------------------------------------
  const [empSearch, setEmpSearch] = useState('');
  const [empEntries, setEmpEntries] = useState<number>(5);
  const [empPage, setEmpPage] = useState<number>(1);
  const [empSortKey, setEmpSortKey] = useState<keyof EmployeeRow>('name');
  const [empSortDir, setEmpSortDir] = useState<'asc' | 'desc'>('asc');

  const filteredEmployees = useMemo(() => {
    const q = empSearch.toLowerCase().trim();
    const list = INITIAL_EMPLOYEES.filter(
      (r) =>
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.position.toLowerCase().includes(q) ||
        r.office.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q)
    );
    return [...list].sort((a, b) => {
      const av = a[empSortKey];
      const bv = b[empSortKey];
      const cmp =
        typeof av === 'number' && typeof bv === 'number'
          ? av - bv
          : String(av).localeCompare(String(bv));
      return empSortDir === 'asc' ? cmp : -cmp;
    });
  }, [empSearch, empSortKey, empSortDir]);

  const empTotalPages = Math.max(1, Math.ceil(filteredEmployees.length / empEntries));
  const safeEmpPage = Math.min(empPage, empTotalPages);
  const pagedEmployees = filteredEmployees.slice(
    (safeEmpPage - 1) * empEntries,
    safeEmpPage * empEntries
  );

  const toggleSort = (key: keyof EmployeeRow) => {
    if (empSortKey === key) {
      setEmpSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setEmpSortKey(key);
      setEmpSortDir('asc');
    }
    setEmpPage(1);
  };

  // -------------------------------------------------------------------------
  // TABLE 2: CHECKBOX SELECTION, MULTI-FILTER, COLUMN VISIBILITY & BULK ACTION
  // -------------------------------------------------------------------------
  const [tasks, setTasks] = useState<TaskRow[]>(INITIAL_TASKS);
  const [taskSearch, setTaskSearch] = useState('');
  const [taskDeptFilter, setTaskDeptFilter] = useState<string>('All');
  const [taskStatusFilter, setTaskStatusFilter] = useState<string>('All');
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>(['TSK-102']);
  const [colDropdownOpen, setColDropdownOpen] = useState(false);
  const [visibleCols, setVisibleCols] = useState({
    department: true,
    assignee: true,
    progress: true,
    priority: true,
    dueDate: true,
    status: true,
  });

  const filteredTasks = useMemo(() => {
    const q = taskSearch.toLowerCase().trim();
    return tasks.filter((t) => {
      if (taskDeptFilter !== 'All' && t.department !== taskDeptFilter) return false;
      if (taskStatusFilter !== 'All' && t.status !== taskStatusFilter) return false;
      if (!q) return true;
      return (
        t.id.toLowerCase().includes(q) ||
        t.task.toLowerCase().includes(q) ||
        t.assignee.toLowerCase().includes(q)
      );
    });
  }, [tasks, taskSearch, taskDeptFilter, taskStatusFilter]);

  const allFilteredSelected =
    filteredTasks.length > 0 && filteredTasks.every((t) => selectedTaskIds.includes(t.id));
  const someFilteredSelected =
    filteredTasks.some((t) => selectedTaskIds.includes(t.id)) && !allFilteredSelected;

  const toggleSelectAllTasks = () => {
    if (allFilteredSelected) {
      const filteredSet = new Set(filteredTasks.map((t) => t.id));
      setSelectedTaskIds((prev) => prev.filter((id) => !filteredSet.has(id)));
    } else {
      const merged = new Set([...selectedTaskIds, ...filteredTasks.map((t) => t.id)]);
      setSelectedTaskIds(Array.from(merged));
    }
  };

  const toggleOneTask = (id: string) => {
    setSelectedTaskIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkComplete = () => {
    setTasks((prev) =>
      prev.map((t) =>
        selectedTaskIds.includes(t.id) ? { ...t, status: 'Completed', progress: 100 } : t
      )
    );
    showSuccess('Status Diperbarui!', `${selectedTaskIds.length} tugas ditandai sebagai Completed.`);
    setSelectedTaskIds([]);
  };

  const handleBulkDeleteTasks = () => {
    const count = selectedTaskIds.length;
    setTasks((prev) => prev.filter((t) => !selectedTaskIds.includes(t.id)));
    setSelectedTaskIds([]);
    showToast(`${count} item dihapus dari tabel.`, 'info');
  };

  const handleExportSelectedCsv = () => {
    const picked = tasks.filter((t) => selectedTaskIds.includes(t.id));
    const header = 'ID,Task,Department,Assignee,Progress,Priority,DueDate,Status';
    const rows = picked.map(
      (r) =>
        `"${r.id}","${r.task}","${r.department}","${r.assignee}",${r.progress}%,"${r.priority}","${r.dueDate}","${r.status}"`
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'selected-tasks-export.csv';
    a.click();
    URL.revokeObjectURL(url);
    showToast(`${picked.length} baris diekspor ke CSV.`, 'success');
  };

  // -------------------------------------------------------------------------
  // TABLE 3: LOAD MORE FEED TABLE & DENSITY SWITCHER
  // -------------------------------------------------------------------------
  const [feedCategory, setFeedCategory] = useState<'All' | 'Subscription' | 'Invoice' | 'Refund'>('All');
  const [feedLimit, setFeedLimit] = useState<number>(4);
  const [feedLoading, setFeedLoading] = useState<boolean>(false);
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');

  const filteredFeed = useMemo(() => {
    if (feedCategory === 'All') return INITIAL_FEED;
    return INITIAL_FEED.filter((f) => f.category === feedCategory);
  }, [feedCategory]);

  const visibleFeed = filteredFeed.slice(0, feedLimit);
  const hasMoreFeed = feedLimit < filteredFeed.length;

  const handleLoadMore = () => {
    setFeedLoading(true);
    window.setTimeout(() => {
      setFeedLimit((prev) => Math.min(filteredFeed.length, prev + 4));
      setFeedLoading(false);
    }, 350);
  };

  // -------------------------------------------------------------------------
  // TABLE 4: EXPANDABLE ACCORDION ROWS + INLINE EDITING
  // -------------------------------------------------------------------------
  const [vendors, setVendors] = useState<ExpandableVendor[]>(INITIAL_VENDORS);
  const [expandedIds, setExpandedIds] = useState<string[]>(['VND-01']);
  const [editingVendorId, setEditingVendorId] = useState<string | null>(null);
  const [vendorDraft, setVendorDraft] = useState<{
    name: string;
    pic: string;
    tier: ExpandableVendor['tier'];
    status: ExpandableVendor['status'];
  }>({ name: '', pic: '', tier: 'Growth', status: 'Verified' });

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const startInlineEdit = (v: ExpandableVendor) => {
    setEditingVendorId(v.id);
    setVendorDraft({ name: v.name, pic: v.pic, tier: v.tier, status: v.status });
  };

  const saveInlineEdit = (id: string) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...vendorDraft } : v))
    );
    setEditingVendorId(null);
    showToast('Perubahan baris berhasil disimpan.', 'success');
  };

  // -------------------------------------------------------------------------
  // TABLE 5: FINANCIAL LEDGER WITH STICKY COLUMN, SUMMARY FOOTER & ADD ROW
  // -------------------------------------------------------------------------
  const [ledger, setLedger] = useState<LedgerEntry[]>(INITIAL_LEDGER);
  const [ledgerQuarter, setLedgerQuarter] = useState<'All' | 'Q3' | 'Q4'>('All');
  const [addRowOpen, setAddRowOpen] = useState(false);
  const [newLedger, setNewLedger] = useState({ desc: '', client: '', subtotal: '5000000', quarter: 'Q4' as 'Q3' | 'Q4' });

  const filteredLedger = useMemo(() => {
    if (ledgerQuarter === 'All') return ledger;
    return ledger.filter((l) => l.quarter === ledgerQuarter);
  }, [ledger, ledgerQuarter]);

  const totalSubtotal = filteredLedger.reduce((s, r) => s + r.subtotal, 0);
  const totalTax = filteredLedger.reduce((s, r) => s + r.tax, 0);
  const grandTotal = totalSubtotal + totalTax;

  const handleCopyMarkdownTable = async () => {
    const header = '| ID | Deskripsi | Klien | Subtotal | PPN 11% | Total |\n|---|---|---|---|---|---|';
    const lines = filteredLedger.map(
      (r) =>
        `| ${r.id} | ${r.desc} | ${r.client} | ${formatRupiah(r.subtotal)} | ${formatRupiah(
          r.tax
        )} | ${formatRupiah(r.subtotal + r.tax)} |`
    );
    try {
      await navigator.clipboard.writeText([header, ...lines].join('\n'));
      showToast('Tabel disalin sebagai format Markdown!', 'success');
    } catch {
      showToast('Gagal menyalin tabel.', 'error');
    }
  };

  const handleAddLedgerRow = (e: React.FormEvent) => {
    e.preventDefault();
    const sub = Math.max(0, Number(newLedger.subtotal) || 0);
    if (!newLedger.desc.trim() || !newLedger.client.trim() || sub <= 0) {
      showToast('Lengkapi deskripsi, klien, dan nominal subtotal.', 'warning');
      return;
    }
    const tax = Math.round(sub * 0.11);
    const created: LedgerEntry = {
      id: `INV-${2605 + ledger.length}`,
      desc: newLedger.desc.trim(),
      client: newLedger.client.trim(),
      subtotal: sub,
      tax,
      quarter: newLedger.quarter,
    };
    setLedger((prev) => [created, ...prev]);
    setNewLedger({ desc: '', client: '', subtotal: '5000000', quarter: 'Q4' });
    setAddRowOpen(false);
    showSuccess('Baris Ditambahkan!', `${created.id} masuk ke daftar ledger.`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ========================================================================= */}
      {/* SUB-HEADER BANNER */}
      {/* ========================================================================= */}
      <div className="flex items-start gap-3">
        <div className="w-8 h-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full mt-2 shrink-0" />
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">DataTables Showcase</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            5 variasi tabel interaktif modern: Show Entries &amp; Sorting, Multi-Checkbox &amp; Bulk Action, Load More Feed, Expandable Inline-Edit Rows, dan Ledger Sticky Footer.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TABLE 1: BASIC DATATABLES (Show Entries, Sort, Live Search, Pagination) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-[#175cd3] tracking-tight">
              1. Basic DataTables — Show Entries, Multi-Sort &amp; Pagination
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Klik header kolom untuk mengurutkan (Asc/Desc), atur jumlah entri per halaman, atau cari cepat.
            </p>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${GRAD.primaryStatic}`}>
            {filteredEmployees.length} Karyawan
          </span>
        </div>

        {/* Top Controls: Show Entries + Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span>Show</span>
            <select
              value={empEntries}
              onChange={(e) => {
                setEmpEntries(Number(e.target.value));
                setEmpPage(1);
              }}
              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#175cd3] cursor-pointer"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>
            <span>entries</span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={empSearch}
              onChange={(e) => {
                setEmpSearch(e.target.value);
                setEmpPage(1);
              }}
              placeholder="Cari nama, jabatan, kota..."
              className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#175cd3]"
            />
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto border border-slate-200/80 rounded-xl">
          <table className="w-full text-left border-collapse min-w-[720px]">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                {(
                  [
                    { key: 'name', label: 'Nama' },
                    { key: 'position', label: 'Jabatan' },
                    { key: 'office', label: 'Kantor' },
                    { key: 'age', label: 'Usia' },
                    { key: 'startDate', label: 'Tgl Gabung' },
                    { key: 'salary', label: 'Gaji / Bln' },
                    { key: 'status', label: 'Status' },
                  ] as { key: keyof EmployeeRow; label: string }[]
                ).map((col) => {
                  const active = empSortKey === col.key;
                  return (
                    <th
                      key={col.key}
                      onClick={() => toggleSort(col.key)}
                      className="py-3 px-4 cursor-pointer select-none hover:text-[#175cd3] transition-colors"
                    >
                      <span className="inline-flex items-center gap-1.5">
                        {col.label}
                        {active ? (
                          empSortDir === 'asc' ? (
                            <ArrowUp className="w-3.5 h-3.5 text-[#175cd3]" />
                          ) : (
                            <ArrowDown className="w-3.5 h-3.5 text-[#175cd3]" />
                          )
                        ) : (
                          <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        )}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {pagedEmployees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    Tidak ada data yang cocok dengan pencarian &ldquo;{empSearch}&rdquo;.
                  </td>
                </tr>
              ) : (
                pagedEmployees.map((row) => {
                  const badgeGrad =
                    row.status === 'Active'
                      ? GRAD.successStatic
                      : row.status === 'Onboarding'
                      ? GRAD.infoStatic
                      : GRAD.warningStatic;
                  return (
                    <tr key={row.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-800">{row.name}</td>
                      <td className="py-3 px-4 text-slate-600">{row.position}</td>
                      <td className="py-3 px-4 text-slate-600">{row.office}</td>
                      <td className="py-3 px-4 text-slate-600">{row.age} th</td>
                      <td className="py-3 px-4 text-slate-600">{row.startDate}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {formatRupiah(row.salary)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${badgeGrad}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom Info + Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 pt-1">
          <span>
            Showing{' '}
            <strong className="text-slate-800">
              {filteredEmployees.length === 0 ? 0 : (safeEmpPage - 1) * empEntries + 1}
            </strong>{' '}
            to{' '}
            <strong className="text-slate-800">
              {Math.min(safeEmpPage * empEntries, filteredEmployees.length)}
            </strong>{' '}
            of <strong className="text-slate-800">{filteredEmployees.length}</strong> entries
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={safeEmpPage <= 1}
              onClick={() => setEmpPage((p) => Math.max(1, p - 1))}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-45 ${GRAD.light}`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Prev</span>
            </button>

            {Array.from({ length: empTotalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => setEmpPage(pageNum)}
                className={`w-8 h-8 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  pageNum === safeEmpPage
                    ? `${GRAD.primary} shadow-xs`
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              type="button"
              disabled={safeEmpPage >= empTotalPages}
              onClick={() => setEmpPage((p) => Math.min(empTotalPages, p + 1))}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-45 ${GRAD.light}`}
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TABLE 2: CHECKBOX SELECTION, MULTI-FILTER, COLUMN TOGGLE & BULK ACTIONS */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-[#175cd3] tracking-tight">
              2. Checkbox Table, Multi-Filter &amp; Column Visibility
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Centang beberapa baris untuk memunculkan aksi massal (Mark Completed, Export CSV, atau Hapus Terpilih).
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Column Visibility Popover */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setColDropdownOpen(!colDropdownOpen)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${GRAD.light}`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#175cd3]" />
                <span>Kolom</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {colDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-xl shadow-xl p-2.5 z-30 space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-500 px-1 pb-1 border-b border-slate-100">
                    Tampilkan Kolom
                  </div>
                  {(
                    [
                      { key: 'department', label: 'Department' },
                      { key: 'assignee', label: 'Assignee' },
                      { key: 'progress', label: 'Progress' },
                      { key: 'priority', label: 'Priority' },
                      { key: 'dueDate', label: 'Due Date' },
                      { key: 'status', label: 'Status' },
                    ] as const
                  ).map((col) => {
                    const checked = visibleCols[col.key];
                    return (
                      <label
                        key={col.key}
                        onClick={() =>
                          setVisibleCols((prev) => ({ ...prev, [col.key]: !prev[col.key] }))
                        }
                        className="flex items-center gap-2 px-1.5 py-1 rounded-lg hover:bg-slate-50 cursor-pointer text-xs text-slate-700"
                      >
                        <span
                          className={`w-4 h-4 rounded flex items-center justify-center ${
                            checked ? GRAD.primaryStatic : 'border border-slate-300 bg-white'
                          }`}
                        >
                          {checked && <Check className="w-3 h-3" />}
                        </span>
                        <span>{col.label}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {tasks.length < INITIAL_TASKS.length && (
              <button
                type="button"
                onClick={() => {
                  setTasks(INITIAL_TASKS);
                  setSelectedTaskIds([]);
                  showToast('Data tugas dipulihkan.', 'info');
                }}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${GRAD.info}`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Data</span>
              </button>
            )}
          </div>
        </div>

        {/* Multi-Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={taskSearch}
              onChange={(e) => setTaskSearch(e.target.value)}
              placeholder="Cari ID, nama tugas, PIC..."
              className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#175cd3]"
            />
          </div>

          <select
            value={taskDeptFilter}
            onChange={(e) => setTaskDeptFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-[#175cd3] cursor-pointer"
          >
            <option value="All">Semua Departemen</option>
            <option value="Engineering">Engineering</option>
            <option value="Product">Product</option>
            <option value="Marketing">Marketing</option>
            <option value="Finance">Finance</option>
          </select>

          <select
            value={taskStatusFilter}
            onChange={(e) => setTaskStatusFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-[#175cd3] cursor-pointer"
          >
            <option value="All">Semua Status</option>
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
            <option value="Pending">Pending</option>
            <option value="Blocked">Blocked</option>
          </select>
        </div>

        {/* Contextual Bulk Action Bar */}
        {selectedTaskIds.length > 0 && (
          <div className="p-3 rounded-xl border border-blue-200 bg-blue-50/50 flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-150">
            <span className="text-xs font-bold text-[#175cd3]">
              {selectedTaskIds.length} baris dipilih
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleBulkComplete}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer shadow-xs ${GRAD.success}`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>Tandai Selesai</span>
              </button>
              <button
                type="button"
                onClick={handleExportSelectedCsv}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer shadow-xs ${GRAD.info}`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
              <button
                type="button"
                onClick={handleBulkDeleteTasks}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer shadow-xs ${GRAD.danger}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Terpilih</span>
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto border border-slate-200/80 rounded-xl">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                <th className="py-3 px-4 w-10">
                  <button
                    type="button"
                    onClick={toggleSelectAllTasks}
                    className={`w-4.5 h-4.5 rounded flex items-center justify-center cursor-pointer transition-all ${
                      allFilteredSelected || someFilteredSelected
                        ? GRAD.primaryStatic
                        : 'border border-slate-300 bg-white'
                    }`}
                  >
                    {allFilteredSelected && <Check className="w-3 h-3" />}
                    {someFilteredSelected && <Minus className="w-3 h-3" />}
                  </button>
                </th>
                <th className="py-3 px-3">Task</th>
                {visibleCols.department && <th className="py-3 px-3">Dept</th>}
                {visibleCols.assignee && <th className="py-3 px-3">Assignee</th>}
                {visibleCols.progress && <th className="py-3 px-3 w-36">Progress</th>}
                {visibleCols.priority && <th className="py-3 px-3">Priority</th>}
                {visibleCols.dueDate && <th className="py-3 px-3">Due Date</th>}
                {visibleCols.status && <th className="py-3 px-3">Status</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    Tidak ada tugas ditemukan.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((t) => {
                  const checked = selectedTaskIds.includes(t.id);
                  const priorityGrad =
                    t.priority === 'High'
                      ? GRAD.dangerStatic
                      : t.priority === 'Medium'
                      ? GRAD.warningStatic
                      : GRAD.secondary;
                  const statusGrad =
                    t.status === 'Completed'
                      ? GRAD.successStatic
                      : t.status === 'In Progress'
                      ? GRAD.primaryStatic
                      : t.status === 'Pending'
                      ? GRAD.warningStatic
                      : GRAD.dangerStatic;

                  return (
                    <tr
                      key={t.id}
                      onClick={() => toggleOneTask(t.id)}
                      className={`cursor-pointer transition-colors ${
                        checked ? 'bg-blue-50/50' : 'hover:bg-slate-50/70'
                      }`}
                    >
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => toggleOneTask(t.id)}
                          className={`w-4.5 h-4.5 rounded flex items-center justify-center cursor-pointer transition-all ${
                            checked ? GRAD.primaryStatic : 'border border-slate-300 bg-white'
                          }`}
                        >
                          {checked && <Check className="w-3 h-3" />}
                        </button>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800">{t.task}</div>
                        <div className="text-[11px] text-slate-400">{t.id}</div>
                      </td>
                      {visibleCols.department && (
                        <td className="py-3 px-3 text-slate-600">{t.department}</td>
                      )}
                      {visibleCols.assignee && (
                        <td className="py-3 px-3 font-medium text-slate-700">{t.assignee}</td>
                      )}
                      {visibleCols.progress && (
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                style={{ width: `${t.progress}%` }}
                                className={`h-full rounded-full ${
                                  t.progress === 100 ? GRAD.successStatic : GRAD.primaryStatic
                                }`}
                              />
                            </div>
                            <span className="text-[11px] font-semibold text-slate-700 w-8 text-right">
                              {t.progress}%
                            </span>
                          </div>
                        </td>
                      )}
                      {visibleCols.priority && (
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${priorityGrad}`}>
                            {t.priority}
                          </span>
                        </td>
                      )}
                      {visibleCols.dueDate && (
                        <td className="py-3 px-3 text-slate-600">{t.dueDate}</td>
                      )}
                      {visibleCols.status && (
                        <td className="py-3 px-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${statusGrad}`}>
                            {t.status}
                          </span>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW: TABLE 3 (LOAD MORE FEED) & TABLE 4 (EXPANDABLE + INLINE EDIT) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        {/* TABLE 3: LOAD MORE FEED TABLE */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-[#175cd3] tracking-tight">
                3. Load More Feed Table &amp; Row Density
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Muat data bertahap tanpa pindah halaman, dilengkapi pengatur kepadatan baris.
              </p>
            </div>

            <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-0.5">
              {(['comfortable', 'compact'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setDensity(mode)}
                  className={`px-2.5 py-1 text-[11px] font-semibold capitalize rounded-lg cursor-pointer transition-all ${
                    density === mode ? `${GRAD.primaryStatic} shadow-xs` : 'text-slate-600'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-1.5">
            {(['All', 'Subscription', 'Invoice', 'Refund'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setFeedCategory(cat);
                  setFeedLimit(4);
                }}
                className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                  feedCategory === cat ? `${GRAD.primary} shadow-xs` : GRAD.light
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto border border-slate-200/80 rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  <th className={density === 'compact' ? 'py-2 px-3' : 'py-3 px-4'}>Pelanggan</th>
                  <th className={density === 'compact' ? 'py-2 px-3' : 'py-3 px-4'}>Kategori</th>
                  <th className={density === 'compact' ? 'py-2 px-3' : 'py-3 px-4'}>Nominal</th>
                  <th className={density === 'compact' ? 'py-2 px-3' : 'py-3 px-4'}>Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {visibleFeed.map((item) => {
                  const statusGrad =
                    item.status === 'Paid'
                      ? GRAD.successStatic
                      : item.status === 'Processing'
                      ? GRAD.infoStatic
                      : GRAD.dangerStatic;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className={density === 'compact' ? 'py-2 px-3' : 'py-3 px-4'}>
                        <div className="font-semibold text-slate-800">{item.customer}</div>
                        <div className="text-[11px] text-slate-400">
                          {item.id} • {item.date}
                        </div>
                      </td>
                      <td className={density === 'compact' ? 'py-2 px-3 text-slate-600' : 'py-3 px-4 text-slate-600'}>
                        {item.category}
                      </td>
                      <td className={density === 'compact' ? 'py-2 px-3 font-bold text-slate-800' : 'py-3 px-4 font-bold text-slate-800'}>
                        {formatRupiah(item.amount)}
                      </td>
                      <td className={density === 'compact' ? 'py-2 px-3' : 'py-3 px-4'}>
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${statusGrad}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Load More Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <span className="text-xs text-slate-500">
              Menampilkan <strong className="text-slate-800">{visibleFeed.length}</strong> dari{' '}
              <strong className="text-slate-800">{filteredFeed.length}</strong> transaksi
            </span>

            <div className="flex items-center gap-2">
              {feedLimit > 4 && (
                <button
                  type="button"
                  onClick={() => setFeedLimit(4)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${GRAD.light}`}
                >
                  Ringkas (4)
                </button>
              )}
              {hasMoreFeed && (
                <button
                  type="button"
                  disabled={feedLoading}
                  onClick={handleLoadMore}
                  className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold shadow-xs cursor-pointer transition-all active:scale-95 disabled:opacity-60 ${GRAD.primary}`}
                >
                  {feedLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Layers className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {feedLoading
                      ? 'Memuat...'
                      : `Load More (+${Math.min(4, filteredFeed.length - visibleFeed.length)})`}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* TABLE 4: EXPANDABLE ACCORDION ROWS & INLINE EDIT */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-[#175cd3] tracking-tight">
              4. Expandable Accordion &amp; Inline Edit Table
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Klik panah untuk melihat detail API key &amp; audit, atau klik Edit untuk menyunting langsung di baris.
            </p>
          </div>

          <div className="overflow-x-auto border border-slate-200/80 rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  <th className="py-3 px-3 w-8" />
                  <th className="py-3 px-3">Partner</th>
                  <th className="py-3 px-3">Tier</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {vendors.map((v) => {
                  const isExpanded = expandedIds.includes(v.id);
                  const isEditing = editingVendorId === v.id;
                  const tierGrad =
                    v.tier === 'Enterprise'
                      ? GRAD.primaryStatic
                      : v.tier === 'Growth'
                      ? GRAD.infoStatic
                      : GRAD.secondary;
                  const statusGrad = v.status === 'Verified' ? GRAD.successStatic : GRAD.warningStatic;

                  return (
                    <React.Fragment key={v.id}>
                      <tr className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-3">
                          <button
                            type="button"
                            onClick={() => toggleExpand(v.id)}
                            className="p-1 text-slate-500 hover:text-[#175cd3] hover:bg-blue-50 rounded-lg cursor-pointer"
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </button>
                        </td>

                        <td className="py-3 px-3">
                          {isEditing ? (
                            <div className="space-y-1">
                              <input
                                type="text"
                                value={vendorDraft.name}
                                onChange={(e) =>
                                  setVendorDraft((p) => ({ ...p, name: e.target.value }))
                                }
                                className="w-full px-2 py-1 border border-[#175cd3] rounded-lg text-xs"
                              />
                              <input
                                type="text"
                                value={vendorDraft.pic}
                                onChange={(e) =>
                                  setVendorDraft((p) => ({ ...p, pic: e.target.value }))
                                }
                                className="w-full px-2 py-1 border border-slate-200 rounded-lg text-[11px]"
                              />
                            </div>
                          ) : (
                            <>
                              <div className="font-semibold text-slate-800">{v.name}</div>
                              <div className="text-[11px] text-slate-400">
                                PIC: {v.pic} • {v.id}
                              </div>
                            </>
                          )}
                        </td>

                        <td className="py-3 px-3">
                          {isEditing ? (
                            <select
                              value={vendorDraft.tier}
                              onChange={(e) =>
                                setVendorDraft((p) => ({
                                  ...p,
                                  tier: e.target.value as ExpandableVendor['tier'],
                                }))
                              }
                              className="px-2 py-1 border border-slate-200 rounded-lg text-xs bg-white"
                            >
                              <option value="Enterprise">Enterprise</option>
                              <option value="Growth">Growth</option>
                              <option value="Starter">Starter</option>
                            </select>
                          ) : (
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${tierGrad}`}>
                              {v.tier}
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-3">
                          {isEditing ? (
                            <select
                              value={vendorDraft.status}
                              onChange={(e) =>
                                setVendorDraft((p) => ({
                                  ...p,
                                  status: e.target.value as ExpandableVendor['status'],
                                }))
                              }
                              className="px-2 py-1 border border-slate-200 rounded-lg text-xs bg-white"
                            >
                              <option value="Verified">Verified</option>
                              <option value="Review">Review</option>
                            </select>
                          ) : (
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${statusGrad}`}>
                              {v.status}
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-3 text-right">
                          {isEditing ? (
                            <div className="inline-flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => saveInlineEdit(v.id)}
                                className={`p-1.5 rounded-lg cursor-pointer ${GRAD.success}`}
                                title="Simpan"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingVendorId(null)}
                                className={`p-1.5 rounded-lg cursor-pointer ${GRAD.danger}`}
                                title="Batal"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => startInlineEdit(v)}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer ${GRAD.primary}`}
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                          )}
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr className="bg-blue-50/25">
                          <td colSpan={5} className="px-4 py-3 text-xs">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3 rounded-xl border border-slate-200/80">
                              <div>
                                <div className="text-[11px] text-slate-400 font-semibold">API Key</div>
                                <div className="font-mono text-slate-800 mt-0.5">{v.apiKey}</div>
                              </div>
                              <div>
                                <div className="text-[11px] text-slate-400 font-semibold">Audit Terakhir</div>
                                <div className="text-slate-700 mt-0.5">{v.lastAudit}</div>
                              </div>
                              <div className="sm:col-span-2">
                                <div className="text-[11px] text-slate-400 font-semibold">Alamat &amp; Catatan</div>
                                <div className="text-slate-700 mt-0.5">
                                  {v.address} — {v.notes}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TABLE 5: STICKY-HEADER FINANCIAL LEDGER WITH SUMMARY FOOTER & ADD ROW */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-[#175cd3] tracking-tight">
              5. Financial Ledger — Sticky Column, Summary Footer &amp; Quick Add
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Kalkulasi otomatis total subtotal, PPN 11%, Grand Total, salin format Markdown, dan tambah baris baru.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-0.5">
              {(['All', 'Q3', 'Q4'] as const).map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setLedgerQuarter(q)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg cursor-pointer transition-all ${
                    ledgerQuarter === q ? `${GRAD.primaryStatic} shadow-xs` : 'text-slate-600'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleCopyMarkdownTable}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${GRAD.info}`}
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Markdown</span>
            </button>

            <button
              type="button"
              onClick={() => setAddRowOpen(true)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer shadow-xs ${GRAD.primary}`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Baris</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto max-h-72 border border-slate-200/80 rounded-xl">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200">
              <tr className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                <th className="py-3 px-4 sticky left-0 bg-slate-50 z-20 border-r border-slate-200/70">
                  Invoice ID
                </th>
                <th className="py-3 px-4">Deskripsi Layanan</th>
                <th className="py-3 px-4">Klien</th>
                <th className="py-3 px-4">Kuartal</th>
                <th className="py-3 px-4 text-right">Subtotal</th>
                <th className="py-3 px-4 text-right">PPN (11%)</th>
                <th className="py-3 px-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs bg-white">
              {filteredLedger.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-bold text-[#175cd3] sticky left-0 bg-white border-r border-slate-100">
                    {entry.id}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800">{entry.desc}</td>
                  <td className="py-3 px-4 text-slate-600">{entry.client}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${GRAD.dark}`}>
                      {entry.quarter}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-slate-700">{formatRupiah(entry.subtotal)}</td>
                  <td className="py-3 px-4 text-right text-slate-600">{formatRupiah(entry.tax)}</td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900">
                    {formatRupiah(entry.subtotal + entry.tax)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="sticky bottom-0 bg-slate-50 border-t-2 border-slate-200 text-xs font-bold text-slate-900">
              <tr>
                <td colSpan={4} className="py-3 px-4 text-right uppercase tracking-wider text-slate-600">
                  Total Ringkasan ({filteredLedger.length} Invoice)
                </td>
                <td className="py-3 px-4 text-right">{formatRupiah(totalSubtotal)}</td>
                <td className="py-3 px-4 text-right text-slate-700">{formatRupiah(totalTax)}</td>
                <td className="py-3 px-4 text-right text-[#175cd3]">{formatRupiah(grandTotal)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: ADD LEDGER ROW */}
      {/* ========================================================================= */}
      {addRowOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <form
            onSubmit={handleAddLedgerRow}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-slate-900">Tambah Entri Ledger Baru</h4>
              <button
                type="button"
                onClick={() => setAddRowOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Deskripsi Layanan
                </label>
                <input
                  type="text"
                  autoFocus
                  value={newLedger.desc}
                  onChange={(e) => setNewLedger((p) => ({ ...p, desc: e.target.value }))}
                  placeholder="cth: Maintenance Server Enterprise"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#175cd3]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Klien</label>
                <input
                  type="text"
                  value={newLedger.client}
                  onChange={(e) => setNewLedger((p) => ({ ...p, client: e.target.value }))}
                  placeholder="cth: PT Maju Bersama"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#175cd3]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Subtotal (Rp)
                  </label>
                  <input
                    type="number"
                    value={newLedger.subtotal}
                    onChange={(e) => setNewLedger((p) => ({ ...p, subtotal: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#175cd3]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kuartal</label>
                  <select
                    value={newLedger.quarter}
                    onChange={(e) =>
                      setNewLedger((p) => ({ ...p, quarter: e.target.value as 'Q3' | 'Q4' }))
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:border-[#175cd3]"
                  >
                    <option value="Q3">Q3</option>
                    <option value="Q4">Q4</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setAddRowOpen(false)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer ${GRAD.light}`}
              >
                Batal
              </button>
              <button
                type="submit"
                className={`px-4 py-2 rounded-xl text-xs font-semibold shadow-xs cursor-pointer ${GRAD.primary}`}
              >
                Simpan Entri
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
