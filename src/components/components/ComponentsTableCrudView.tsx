import React, { useState, useMemo, useEffect } from 'react';
import {
  Plus,
  GraduationCap,
  Users,
  Sparkles,
  Radio,
  Search,
  Eye,
  Edit3,
  Trash2,
  ArrowUpDown,
  Download,
  RotateCcw,
  X,
  Save,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { showToast, showSuccess, confirmDialog } from '../../lib/swal';

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

type TingkatType = 'X' | 'XI' | 'XII';
type StatusCbtType = 'Siap Ujian' | 'Sesi Aktif' | 'Selesai';
type SortField = 'kode' | 'nama' | 'siswa';
type SortDir = 'asc' | 'desc';

export interface RombelRecord {
  id: number;
  kode: string;
  nama: string;
  tingkat: TingkatType;
  jurusan: string;
  wali: string;
  siswa: number;
  kapasitas: number;
  lab: string;
  status: StatusCbtType;
}

const STORAGE_KEY = 'velora_crud_rombel_v1';

const DEFAULT_RECORDS: RombelRecord[] = [
  { id: 1, kode: 'X-RPL-1', nama: 'Sepuluh RPL 1', tingkat: 'X', jurusan: 'Rekayasa Perangkat Lunak', wali: 'Budi Santoso, S.Kom', siswa: 36, kapasitas: 36, lab: 'Lab CBT 1', status: 'Siap Ujian' },
  { id: 2, kode: 'X-RPL-2', nama: 'Sepuluh RPL 2', tingkat: 'X', jurusan: 'Rekayasa Perangkat Lunak', wali: 'Agus Setiawan, S.Kom', siswa: 36, kapasitas: 36, lab: 'Lab CBT 1', status: 'Siap Ujian' },
  { id: 3, kode: 'X-TKJ-1', nama: 'Sepuluh TKJ 1', tingkat: 'X', jurusan: 'Teknik Komputer Jaringan', wali: 'Rina Astuti, S.Pd', siswa: 35, kapasitas: 36, lab: 'Lab CBT 2', status: 'Siap Ujian' },
  { id: 4, kode: 'X-TKJ-2', nama: 'Sepuluh TKJ 2', tingkat: 'X', jurusan: 'Teknik Komputer Jaringan', wali: 'Eko Prasetyo, S.T', siswa: 35, kapasitas: 36, lab: 'Lab CBT 2', status: 'Siap Ujian' },
  { id: 5, kode: 'X-DKV-1', nama: 'Sepuluh DKV 1', tingkat: 'X', jurusan: 'Desain Komunikasi Visual', wali: 'Maya Indah, S.Ds', siswa: 34, kapasitas: 36, lab: 'Lab Multimedia', status: 'Siap Ujian' },
  { id: 6, kode: 'X-AKL-1', nama: 'Sepuluh AKL 1', tingkat: 'X', jurusan: 'Akuntansi Keuangan', wali: 'Sri Wahyuni, S.E', siswa: 36, kapasitas: 36, lab: 'Lab CBT 3', status: 'Siap Ujian' },
  { id: 7, kode: 'XI-MIPA-1', nama: 'Sebelas MIPA 1', tingkat: 'XI', jurusan: 'MIPA Unggulan', wali: 'Ahmad Fauzi, M.Pd', siswa: 34, kapasitas: 36, lab: 'Lab CBT 4', status: 'Sesi Aktif' },
  { id: 8, kode: 'XI-MIPA-2', nama: 'Sebelas MIPA 2', tingkat: 'XI', jurusan: 'MIPA Reguler', wali: 'Nurul Hidayati, M.Si', siswa: 35, kapasitas: 36, lab: 'Lab CBT 4', status: 'Sesi Aktif' },
  { id: 9, kode: 'XI-IPS-1', nama: 'Sebelas IPS 1', tingkat: 'XI', jurusan: 'Ilmu Pengetahuan Sosial', wali: 'Siti Rahma, S.Pd', siswa: 32, kapasitas: 36, lab: 'Lab CBT 5', status: 'Siap Ujian' },
  { id: 10, kode: 'XI-IPS-2', nama: 'Sebelas IPS 2', tingkat: 'XI', jurusan: 'Ilmu Pengetahuan Sosial', wali: 'Bambang Irawan, M.Pd', siswa: 33, kapasitas: 36, lab: 'Lab CBT 5', status: 'Siap Ujian' },
  { id: 11, kode: 'XI-RPL-1', nama: 'Sebelas RPL 1', tingkat: 'XI', jurusan: 'Rekayasa Perangkat Lunak', wali: 'Fahmi Nugroho, S.Kom', siswa: 36, kapasitas: 36, lab: 'Lab CBT 1', status: 'Siap Ujian' },
  { id: 12, kode: 'XI-TKJ-1', nama: 'Sebelas TKJ 1', tingkat: 'XI', jurusan: 'Teknik Komputer Jaringan', wali: 'Aris Munandar, S.T', siswa: 34, kapasitas: 36, lab: 'Lab CBT 2', status: 'Siap Ujian' },
  { id: 13, kode: 'XII-MIPA-1', nama: 'Duabelas MIPA 1', tingkat: 'XII', jurusan: 'MIPA 1', wali: 'Dian Permata, S.Si', siswa: 36, kapasitas: 36, lab: 'Lab CBT 6', status: 'Selesai' },
  { id: 14, kode: 'XII-MIPA-2', nama: 'Duabelas MIPA 2', tingkat: 'XII', jurusan: 'MIPA 2', wali: 'Drs. Hendro Wibowo', siswa: 35, kapasitas: 36, lab: 'Lab CBT 6', status: 'Selesai' },
  { id: 15, kode: 'XII-IPS-1', nama: 'Duabelas IPS 1', tingkat: 'XII', jurusan: 'IPS 1', wali: 'Yuni Astuti, M.Pd', siswa: 33, kapasitas: 36, lab: 'Lab CBT 5', status: 'Selesai' },
  { id: 16, kode: 'XII-RPL-1', nama: 'Duabelas RPL 1', tingkat: 'XII', jurusan: 'Rekayasa Perangkat Lunak', wali: 'Hendra Gunawan, S.Kom', siswa: 35, kapasitas: 36, lab: 'Lab CBT 1', status: 'Siap Ujian' },
  { id: 17, kode: 'XII-RPL-2', nama: 'Duabelas RPL 2', tingkat: 'XII', jurusan: 'Rekayasa Perangkat Lunak', wali: 'Dimas Pratama, M.Kom', siswa: 34, kapasitas: 36, lab: 'Lab CBT 3', status: 'Siap Ujian' },
  { id: 18, kode: 'XII-TKJ-1', nama: 'Duabelas TKJ 1', tingkat: 'XII', jurusan: 'Teknik Komputer Jaringan', wali: 'Bayu Wicaksono, S.T', siswa: 36, kapasitas: 36, lab: 'Lab CBT 2', status: 'Siap Ujian' },
];

interface RombelFormState {
  kode: string;
  nama: string;
  tingkat: TingkatType;
  jurusan: string;
  wali: string;
  siswa: string;
  kapasitas: string;
  lab: string;
  status: StatusCbtType;
}

const EMPTY_FORM: RombelFormState = {
  kode: '',
  nama: '',
  tingkat: 'X',
  jurusan: 'Rekayasa Perangkat Lunak',
  wali: '',
  siswa: '36',
  kapasitas: '36',
  lab: 'Lab CBT 1',
  status: 'Siap Ujian',
};

function loadInitialRecords(): RombelRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as RombelRecord[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return DEFAULT_RECORDS;
}

export function ComponentsTableCrudView() {
  const [records, setRecords] = useState<RombelRecord[]>(loadInitialRecords);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTingkat, setSelectedTingkat] = useState<'Semua' | TingkatType>('Semua');
  const [selectedStatus, setSelectedStatus] = useState<'Semua' | StatusCbtType>('Semua');
  const [sortField, setSortField] = useState<SortField>('kode');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Modal state
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formState, setFormState] = useState<RombelFormState>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof RombelFormState, string>>>({});
  const [detailRecord, setDetailRecord] = useState<RombelRecord | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch {}
  }, [records]);

  // Dynamic KPIs
  const totalSiswa = useMemo(() => records.reduce((s, r) => s + r.siswa, 0), [records]);
  const avgSiswa = records.length ? Math.round(totalSiswa / records.length) : 0;
  const readyCount = useMemo(
    () => records.filter((r) => r.status === 'Siap Ujian' || r.status === 'Sesi Aktif').length,
    [records]
  );

  // Filtered + Sorted Data
  const filteredAndSorted = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    const list = records.filter((c) => {
      const matchSearch =
        !q ||
        c.kode.toLowerCase().includes(q) ||
        c.nama.toLowerCase().includes(q) ||
        c.wali.toLowerCase().includes(q) ||
        c.jurusan.toLowerCase().includes(q) ||
        c.lab.toLowerCase().includes(q);
      const matchTingkat = selectedTingkat === 'Semua' || c.tingkat === selectedTingkat;
      const matchStatus = selectedStatus === 'Semua' || c.status === selectedStatus;
      return matchSearch && matchTingkat && matchStatus;
    });

    return [...list].sort((a, b) => {
      let cmp = 0;
      if (sortField === 'siswa') {
        cmp = a.siswa - b.siswa;
      } else {
        cmp = a[sortField].localeCompare(b[sortField]);
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [records, searchTerm, selectedTingkat, selectedStatus, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSorted.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedRows = filteredAndSorted.slice((safePage - 1) * pageSize, safePage * pageSize);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const toggleRow = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleAllVisible = () => {
    const visibleIds = paginatedRows.map((r) => r.id);
    const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  // Open Create Modal
  const openCreateModal = () => {
    setEditingId(null);
    setFormState(EMPTY_FORM);
    setFormErrors({});
    setFormModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (row: RombelRecord) => {
    setEditingId(row.id);
    setFormState({
      kode: row.kode,
      nama: row.nama,
      tingkat: row.tingkat,
      jurusan: row.jurusan,
      wali: row.wali,
      siswa: String(row.siswa),
      kapasitas: String(row.kapasitas),
      lab: row.lab,
      status: row.status,
    });
    setFormErrors({});
    setFormModalOpen(true);
  };

  // Validate & Submit Create/Update
  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Partial<Record<keyof RombelFormState, string>> = {};
    if (!formState.kode.trim()) errs.kode = 'Kode rombel wajib diisi';
    if (!formState.nama.trim()) errs.nama = 'Nama kelas wajib diisi';
    if (!formState.jurusan.trim()) errs.jurusan = 'Jurusan wajib diisi';
    if (!formState.wali.trim()) errs.wali = 'Nama wali kelas wajib diisi';

    const numSiswa = Number(formState.siswa);
    const numKap = Number(formState.kapasitas);
    if (!Number.isFinite(numSiswa) || numSiswa < 1 || numSiswa > 60) {
      errs.siswa = 'Jumlah siswa harus antara 1 - 60';
    }
    if (!Number.isFinite(numKap) || numKap < numSiswa) {
      errs.kapasitas = 'Kapasitas tidak boleh lebih kecil dari jumlah siswa';
    }

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    if (editingId !== null) {
      setRecords((prev) =>
        prev.map((r) =>
          r.id === editingId
            ? {
                ...r,
                kode: formState.kode.trim().toUpperCase(),
                nama: formState.nama.trim(),
                tingkat: formState.tingkat,
                jurusan: formState.jurusan.trim(),
                wali: formState.wali.trim(),
                siswa: numSiswa,
                kapasitas: numKap,
                lab: formState.lab,
                status: formState.status,
              }
            : r
        )
      );
      setFormModalOpen(false);
      await showSuccess('Data Diperbarui!', `Rombel ${formState.kode.toUpperCase()} berhasil diperbarui.`);
    } else {
      const nextId = records.reduce((max, r) => Math.max(max, r.id), 0) + 1;
      const newRow: RombelRecord = {
        id: nextId,
        kode: formState.kode.trim().toUpperCase(),
        nama: formState.nama.trim(),
        tingkat: formState.tingkat,
        jurusan: formState.jurusan.trim(),
        wali: formState.wali.trim(),
        siswa: numSiswa,
        kapasitas: numKap,
        lab: formState.lab,
        status: formState.status,
      };
      setRecords((prev) => [newRow, ...prev]);
      setCurrentPage(1);
      setFormModalOpen(false);
      await showSuccess('Rombel Ditambahkan!', `${newRow.kode} (${newRow.nama}) masuk ke daftar tabel.`);
    }
  };

  // Single Delete
  const handleDeleteRow = async (row: RombelRecord) => {
    const ok = await confirmDialog({
      title: `Hapus ${row.kode}?`,
      text: `Data kelas "${row.nama}" (${row.siswa} siswa) akan dihapus permanen dari tabel.`,
      confirmButtonText: 'Ya, Hapus Data',
      cancelButtonText: 'Batal',
      isDangerous: true,
      icon: 'warning',
    });
    if (!ok) return;
    setRecords((prev) => prev.filter((r) => r.id !== row.id));
    setSelectedIds((prev) => prev.filter((id) => id !== row.id));
    if (detailRecord?.id === row.id) setDetailRecord(null);
    showToast(`Rombel ${row.kode} berhasil dihapus.`, 'success');
  };

  // Bulk Actions
  const handleBulkStatus = (nextStatus: StatusCbtType) => {
    setRecords((prev) =>
      prev.map((r) => (selectedIds.includes(r.id) ? { ...r, status: nextStatus } : r))
    );
    showToast(`${selectedIds.length} rombel diubah menjadi "${nextStatus}".`, 'success');
    setSelectedIds([]);
  };

  const handleBulkDelete = async () => {
    const ok = await confirmDialog({
      title: `Hapus ${selectedIds.length} Rombel Terpilih?`,
      text: 'Seluruh data kelas yang dicentang akan dihapus dari tabel.',
      confirmButtonText: 'Ya, Hapus Semua',
      cancelButtonText: 'Batal',
      isDangerous: true,
      icon: 'warning',
    });
    if (!ok) return;
    setRecords((prev) => prev.filter((r) => !selectedIds.includes(r.id)));
    showToast(`${selectedIds.length} data rombel dihapus.`, 'success');
    setSelectedIds([]);
  };

  // Export CSV
  const handleExportCsv = () => {
    const headers = ['No', 'Kode Rombel', 'Nama Kelas', 'Tingkat', 'Jurusan', 'Wali Kelas', 'Siswa', 'Kapasitas', 'Ruang Lab', 'Status'];
    const csvRows = [
      headers.join(','),
      ...filteredAndSorted.map((r, i) =>
        [
          i + 1,
          `"${r.kode}"`,
          `"${r.nama}"`,
          `"Kelas ${r.tingkat}"`,
          `"${r.jurusan}"`,
          `"${r.wali}"`,
          r.siswa,
          r.kapasitas,
          `"${r.lab}"`,
          `"${r.status}"`,
        ].join(',')
      ),
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'data-kelas-rombel.csv';
    link.click();
    URL.revokeObjectURL(url);
    showToast(`Berhasil mengekspor ${filteredAndSorted.length} data ke CSV.`, 'success');
  };

  // Reset Sample Data
  const handleResetSample = async () => {
    const ok = await confirmDialog({
      title: 'Reset Data Awal?',
      text: 'Mengembalikan daftar kelas & rombel ke 18 data bawaan awal.',
      confirmButtonText: 'Reset Data',
      cancelButtonText: 'Batal',
      icon: 'question',
    });
    if (!ok) return;
    setRecords(DEFAULT_RECORDS);
    setSelectedIds([]);
    setCurrentPage(1);
    showToast('Data tabel dikembalikan ke kondisi awal.', 'info');
  };

  const statusBadgeClass = (s: StatusCbtType) =>
    s === 'Siap Ujian' ? GRAD.success : s === 'Sesi Aktif' ? GRAD.info : GRAD.secondary;

  return (
    <div className="space-y-6">
      {/* Top Section Header + Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full mt-2 shrink-0" />
          <div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Data Kelas &amp; Rombel</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Manajemen CRUD lengkap rombongan belajar, kapasitas ruang CBT, alokasi wali kelas, serta aksi massal.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleResetSample}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer ${GRAD.light}`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Data</span>
          </button>
          <button
            type="button"
            onClick={handleExportCsv}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs cursor-pointer ${GRAD.info}`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor CSV</span>
          </button>
          <button
            type="button"
            onClick={openCreateModal}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold shadow-xs cursor-pointer ${GRAD.primary}`}
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Rombel Baru</span>
          </button>
        </div>
      </div>

      {/* Live Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Total Rombel</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{records.length} Kelas</p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">3 Tingkatan (X, XI, XII)</p>
          </div>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs ${GRAD.primaryStatic}`}>
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Total Siswa Aktif</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{totalSiswa.toLocaleString()} Siswa</p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">100% Terdaftar CBT</p>
          </div>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs ${GRAD.success}`}>
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Rata-rata per Kelas</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{avgSiswa} Siswa</p>
            <p className="text-[11px] text-slate-600 font-semibold mt-1">Kapasitas Ideal</p>
          </div>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs ${GRAD.warning}`}>
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Siap &amp; Sesi Aktif</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{readyCount} Kelas</p>
            <p className="text-[11px] text-[#175cd3] font-semibold mt-1">6 Lab CBT Tersedia</p>
          </div>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs ${GRAD.info}`}>
            <Radio className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main CRUD Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col xl:flex-row xl:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span>Tampilkan</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#175cd3]"
              >
                {[5, 10, 25, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <span>data</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value as 'Semua' | StatusCbtType);
                  setCurrentPage(1);
                }}
                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#175cd3]"
              >
                <option value="Semua">Semua Status</option>
                <option value="Siap Ujian">Siap Ujian</option>
                <option value="Sesi Aktif">Sesi Aktif</option>
                <option value="Selesai">Selesai</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Cari kode, kelas, wali, lab..."
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#175cd3]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1">
              {(['Semua', 'X', 'XI', 'XII'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setSelectedTingkat(t);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                    selectedTingkat === t ? `${GRAD.primary} shadow-xs` : GRAD.light
                  }`}
                >
                  {t === 'Semua' ? 'Semua' : `Kelas ${t}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bulk Selection Action Strip */}
        {selectedIds.length > 0 && (
          <div className="px-5 py-3 bg-blue-50/40 border-b border-blue-100 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-bold text-slate-800">
              {selectedIds.length} rombel dipilih
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleBulkStatus('Siap Ujian')}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold cursor-pointer ${GRAD.success}`}
              >
                Set Siap Ujian
              </button>
              <button
                type="button"
                onClick={() => handleBulkStatus('Sesi Aktif')}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold cursor-pointer ${GRAD.info}`}
              >
                Set Sesi Aktif
              </button>
              <button
                type="button"
                onClick={() => handleBulkStatus('Selesai')}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold cursor-pointer ${GRAD.light}`}
              >
                Set Selesai
              </button>
              <button
                type="button"
                onClick={handleBulkDelete}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-semibold cursor-pointer ${GRAD.danger}`}
              >
                <Trash2 className="w-3 h-3" /> Hapus Terpilih
              </button>
            </div>
          </div>
        )}

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-600 bg-slate-50/60">
                <th className="py-3.5 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={paginatedRows.length > 0 && paginatedRows.every((r) => selectedIds.includes(r.id))}
                    onChange={toggleAllVisible}
                    className="w-4 h-4 rounded accent-[#175cd3] cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-3 w-12">No</th>
                <th className="py-3.5 px-4">
                  <button
                    type="button"
                    onClick={() => handleSort('kode')}
                    className="inline-flex items-center gap-1 font-bold uppercase cursor-pointer hover:text-[#175cd3]"
                  >
                    <span>Kode Rombel</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3.5 px-4">
                  <button
                    type="button"
                    onClick={() => handleSort('nama')}
                    className="inline-flex items-center gap-1 font-bold uppercase cursor-pointer hover:text-[#175cd3]"
                  >
                    <span>Nama Kelas</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3.5 px-3">Tingkat</th>
                <th className="py-3.5 px-4">Jurusan &amp; Ruang Lab</th>
                <th className="py-3.5 px-4">Wali Kelas</th>
                <th className="py-3.5 px-4">
                  <button
                    type="button"
                    onClick={() => handleSort('siswa')}
                    className="inline-flex items-center gap-1 font-bold uppercase cursor-pointer hover:text-[#175cd3]"
                  >
                    <span>Siswa</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3.5 px-3 text-center">Status CBT</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {paginatedRows.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-10 text-center text-slate-500">
                    Tidak ada data kelas yang sesuai. Klik <strong>Tambah Rombel Baru</strong> untuk membuat data baru.
                  </td>
                </tr>
              ) : (
                paginatedRows.map((row, idx) => {
                  const pct = Math.min(100, Math.round((row.siswa / row.kapasitas) * 100));
                  const checked = selectedIds.includes(row.id);
                  return (
                    <tr
                      key={row.id}
                      className={`transition-colors ${checked ? 'bg-blue-50/35' : 'hover:bg-slate-50/70'}`}
                    >
                      <td className="py-3.5 px-4">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleRow(row.id)}
                          className="w-4 h-4 rounded accent-[#175cd3] cursor-pointer"
                        />
                      </td>
                      <td className="py-3.5 px-3 font-mono text-slate-400">
                        {(safePage - 1) * pageSize + idx + 1}
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => setDetailRecord(row)}
                          className="font-mono font-bold text-[#175cd3] hover:underline cursor-pointer"
                        >
                          {row.kode}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">{row.nama}</td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-semibold ${GRAD.light}`}>
                          Kelas {row.tingkat}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{row.jurusan}</div>
                        <div className="text-[11px] text-slate-500">{row.lab}</div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-800">{row.wali}</td>
                      <td className="py-3.5 px-4 min-w-[110px]">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="font-bold text-slate-900">
                            {row.siswa}/{row.kapasitas}
                          </span>
                          <span className="text-slate-500">{pct}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div className={`h-full rounded-full ${GRAD.primaryStatic}`} style={{ width: `${pct}%` }} />
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${statusBadgeClass(row.status)}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setDetailRecord(row)}
                            className={`p-1.5 rounded-lg cursor-pointer ${GRAD.light}`}
                            title="Lihat Detail"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditModal(row)}
                            className={`p-1.5 rounded-lg cursor-pointer ${GRAD.warning}`}
                            title="Edit Data"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteRow(row)}
                            className={`p-1.5 rounded-lg cursor-pointer ${GRAD.danger}`}
                            title="Hapus Data"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-5 py-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            Menampilkan{' '}
            <strong>
              {filteredAndSorted.length === 0 ? 0 : (safePage - 1) * pageSize + 1}
            </strong>{' '}
            sampai <strong>{Math.min(safePage * pageSize, filteredAndSorted.length)}</strong> dari{' '}
            <strong>{filteredAndSorted.length}</strong> data
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${GRAD.light}`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Sebelumnya</span>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-xl text-xs font-semibold cursor-pointer ${
                  safePage === page ? `${GRAD.primaryStatic} shadow-xs` : GRAD.light
                }`}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${GRAD.light}`}
            >
              <span>Selanjutnya</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {formModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingId !== null ? 'Edit Data Kelas & Rombel' : 'Tambah Rombel Baru'}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Lengkapi informasi rombongan belajar dan alokasi laboratorium CBT.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFormModalOpen(false)}
                className={`p-1.5 rounded-xl cursor-pointer ${GRAD.light}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700" htmlFor="crud-kode">
                    Kode Rombel
                  </label>
                  <input
                    id="crud-kode"
                    type="text"
                    placeholder="cth. X-RPL-3"
                    value={formState.kode}
                    onChange={(e) => setFormState((s) => ({ ...s, kode: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
                  />
                  {formErrors.kode && <span className="text-[11px] text-red-600">{formErrors.kode}</span>}
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700" htmlFor="crud-nama">
                    Nama Kelas
                  </label>
                  <input
                    id="crud-nama"
                    type="text"
                    placeholder="cth. Sepuluh RPL 3"
                    value={formState.nama}
                    onChange={(e) => setFormState((s) => ({ ...s, nama: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
                  />
                  {formErrors.nama && <span className="text-[11px] text-red-600">{formErrors.nama}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700" htmlFor="crud-tingkat">
                    Tingkat
                  </label>
                  <select
                    id="crud-tingkat"
                    value={formState.tingkat}
                    onChange={(e) => setFormState((s) => ({ ...s, tingkat: e.target.value as TingkatType }))}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
                  >
                    <option value="X">Kelas X</option>
                    <option value="XI">Kelas XI</option>
                    <option value="XII">Kelas XII</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700" htmlFor="crud-status">
                    Status CBT
                  </label>
                  <select
                    id="crud-status"
                    value={formState.status}
                    onChange={(e) => setFormState((s) => ({ ...s, status: e.target.value as StatusCbtType }))}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
                  >
                    <option value="Siap Ujian">Siap Ujian</option>
                    <option value="Sesi Aktif">Sesi Aktif</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700" htmlFor="crud-jurusan">
                    Jurusan / Konsentrasi
                  </label>
                  <input
                    id="crud-jurusan"
                    type="text"
                    value={formState.jurusan}
                    onChange={(e) => setFormState((s) => ({ ...s, jurusan: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
                  />
                  {formErrors.jurusan && <span className="text-[11px] text-red-600">{formErrors.jurusan}</span>}
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700" htmlFor="crud-wali">
                    Wali Kelas
                  </label>
                  <input
                    id="crud-wali"
                    type="text"
                    placeholder="cth. Hendra Gunawan, S.Kom"
                    value={formState.wali}
                    onChange={(e) => setFormState((s) => ({ ...s, wali: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
                  />
                  {formErrors.wali && <span className="text-[11px] text-red-600">{formErrors.wali}</span>}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700" htmlFor="crud-siswa">
                    Jumlah Siswa
                  </label>
                  <input
                    id="crud-siswa"
                    type="number"
                    min={1}
                    max={60}
                    value={formState.siswa}
                    onChange={(e) => setFormState((s) => ({ ...s, siswa: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
                  />
                  {formErrors.siswa && <span className="text-[11px] text-red-600">{formErrors.siswa}</span>}
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700" htmlFor="crud-kap">
                    Kapasitas
                  </label>
                  <input
                    id="crud-kap"
                    type="number"
                    min={1}
                    max={60}
                    value={formState.kapasitas}
                    onChange={(e) => setFormState((s) => ({ ...s, kapasitas: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
                  />
                  {formErrors.kapasitas && <span className="text-[11px] text-red-600">{formErrors.kapasitas}</span>}
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700" htmlFor="crud-lab">
                    Ruang Lab
                  </label>
                  <select
                    id="crud-lab"
                    value={formState.lab}
                    onChange={(e) => setFormState((s) => ({ ...s, lab: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
                  >
                    <option value="Lab CBT 1">Lab CBT 1</option>
                    <option value="Lab CBT 2">Lab CBT 2</option>
                    <option value="Lab CBT 3">Lab CBT 3</option>
                    <option value="Lab CBT 4">Lab CBT 4</option>
                    <option value="Lab CBT 5">Lab CBT 5</option>
                    <option value="Lab CBT 6">Lab CBT 6</option>
                    <option value="Lab Multimedia">Lab Multimedia</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setFormModalOpen(false)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer ${GRAD.light}`}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold shadow-xs cursor-pointer ${GRAD.primary}`}
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingId !== null ? 'Simpan Perubahan' : 'Simpan Rombel'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {detailRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${GRAD.primaryStatic}`}>
                  {detailRecord.kode}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${statusBadgeClass(detailRecord.status)}`}>
                  {detailRecord.status}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setDetailRecord(null)}
                className={`p-1.5 rounded-xl cursor-pointer ${GRAD.light}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{detailRecord.nama}</h3>
                <p className="text-slate-600 mt-0.5">{detailRecord.jurusan}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border border-slate-200/80">
                  <div className="text-slate-500">Wali Kelas</div>
                  <div className="font-bold text-slate-900 mt-0.5">{detailRecord.wali}</div>
                </div>
                <div className="p-3 rounded-xl border border-slate-200/80">
                  <div className="text-slate-500">Ruang Laboratorium</div>
                  <div className="font-bold text-slate-900 mt-0.5">{detailRecord.lab}</div>
                </div>
                <div className="p-3 rounded-xl border border-slate-200/80">
                  <div className="text-slate-500">Tingkat</div>
                  <div className="font-bold text-slate-900 mt-0.5">Kelas {detailRecord.tingkat}</div>
                </div>
                <div className="p-3 rounded-xl border border-slate-200/80">
                  <div className="text-slate-500">Okupansi Siswa</div>
                  <div className="font-bold text-[#175cd3] mt-0.5">
                    {detailRecord.siswa} / {detailRecord.kapasitas} Siswa
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200/80 flex items-center gap-2 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Sinkronisasi peserta ujian CBT untuk rombel ini aktif.</span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const target = detailRecord;
                    setDetailRecord(null);
                    openEditModal(target);
                  }}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold cursor-pointer ${GRAD.warning}`}
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit Rombel Ini
                </button>
                <button
                  type="button"
                  onClick={() => setDetailRecord(null)}
                  className={`px-4 py-2 rounded-xl font-semibold cursor-pointer ${GRAD.primary}`}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
