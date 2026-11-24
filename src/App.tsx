import React, { useState, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { AdminLayout } from './components/layout/AdminLayout';
import { StatCards } from './components/dashboard/StatCards';
import { RecentExamsTable } from './components/dashboard/RecentExamsTable';
import { useDashboardData } from './hooks/useDashboardData';
import { showToast, showSuccess } from './lib/swal';
import {
  FileCode2,
  FileSpreadsheet,
  CheckCircle2,
  Sparkles,
  Users,
  GraduationCap,
  BookOpen,
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  Radio,
  Award,
  Lightbulb,
  RotateCcw,
} from 'lucide-react';
import { TablePagination, ShowEntriesSelector } from './components/common/TablePagination';

type AlertType =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark';

interface AlertItemDef {
  key: AlertType;
  title: string;
  name: string;
  gradient: string;
  flat: string;
  isLight?: boolean;
}

const alertDefinitions: AlertItemDef[] = [
  {
    key: 'primary',
    title: 'Primary',
    name: 'primary',
    gradient: 'bg-gradient-to-r from-[#175cd3] via-[#1450be] to-[#0f3ba0] text-white shadow-xs',
    flat: 'bg-[#1958ca] text-white',
  },
  {
    key: 'secondary',
    title: 'Secondary',
    name: 'secondary',
    gradient: 'bg-gradient-to-r from-[#cbd5e1] via-[#b8c2cc] to-[#94a3b8] text-white shadow-xs',
    flat: 'bg-[#cdd3d8] text-white',
  },
  {
    key: 'success',
    title: 'Success',
    name: 'success',
    gradient: 'bg-gradient-to-r from-[#22c55e] via-[#16a34a] to-[#15803d] text-white shadow-xs',
    flat: 'bg-[#47c363] text-white',
  },
  {
    key: 'danger',
    title: 'Danger',
    name: 'danger',
    gradient: 'bg-gradient-to-r from-[#ef4444] via-[#dc2626] to-[#b91c1c] text-white shadow-xs',
    flat: 'bg-[#fc544b] text-white',
  },
  {
    key: 'warning',
    title: 'Warning',
    name: 'warning',
    gradient: 'bg-gradient-to-r from-[#f59e0b] via-[#ea580c] to-[#d97706] text-white shadow-xs',
    flat: 'bg-[#ffa426] text-white',
  },
  {
    key: 'info',
    title: 'Info',
    name: 'info',
    gradient: 'bg-gradient-to-r from-[#0ea5e9] via-[#0284c7] to-[#0369a1] text-white shadow-xs',
    flat: 'bg-[#3abaf4] text-white',
  },
  {
    key: 'light',
    title: 'Light',
    name: 'light',
    gradient: 'bg-gradient-to-r from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] text-slate-800 border border-slate-200/80 shadow-xs',
    flat: 'bg-[#e3eaef] text-slate-800 border border-slate-200/50',
    isLight: true,
  },
  {
    key: 'dark',
    title: 'Dark',
    name: 'dark',
    gradient: 'bg-gradient-to-r from-[#1e293b] via-[#0f172a] to-[#020617] text-white shadow-xs',
    flat: 'bg-[#191d21] text-white',
  },
];

// Dedicated Alerts Showcase with Modern Gradient styling
function AlertView() {
  const [dismissedKeys, setDismissedKeys] = useState<string[]>([]);

  const handleDismiss = (key: string) => {
    setDismissedKeys((prev) => [...prev, key]);
    showToast(`Alert ${key} berhasil ditutup`, 'info');
  };

  const handleResetDismissed = () => {
    setDismissedKeys([]);
    showToast('Semua alert dismissable dikembalikan', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Section Header with Blue Pill Accent */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-8 h-2.5 bg-[#1351b8] rounded-full inline-block" />
          <h2 className="text-base sm:text-lg font-bold text-slate-800">Alerts</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500">
          Provide contextual feedback messages for typical user actions with the handful of available and flexible alert messages.
        </p>
      </div>

      {/* 2-Column Responsive Grid matching ShizueFI Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Default & Icon */}
        <div className="space-y-6">
          {/* Card 1: Default Alerts */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#1351b8] tracking-tight">Default</h3>
            </div>
            <div className="p-6 space-y-3.5">
              {alertDefinitions.map((item) => (
                <div
                  key={item.key}
                  className={`px-4.5 py-3.5 rounded-lg text-sm font-medium transition-all duration-200 ${item.gradient}`}
                >
                  This is a {item.name} alert.
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Icon Alerts */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#1351b8] tracking-tight">Icon</h3>
            </div>
            <div className="p-6 space-y-3.5">
              {alertDefinitions.map((item) => (
                <div
                  key={item.key}
                  className={`px-4.5 py-3.5 rounded-lg text-sm flex items-center gap-3.5 transition-all duration-200 ${item.gradient}`}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-white/15 backdrop-blur-xs">
                    <Lightbulb className="w-4.5 h-4.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-sm tracking-tight mb-0.5">{item.title}</div>
                    <div className="text-xs sm:text-sm leading-relaxed opacity-95">
                      This is a {item.name} alert.
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Title & Dismissable */}
        <div className="space-y-6">
          {/* Card 3: Title Alerts */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#1351b8] tracking-tight">Title</h3>
            </div>
            <div className="p-6 space-y-3.5">
              {alertDefinitions.map((item) => (
                <div
                  key={item.key}
                  className={`px-4.5 py-3.5 rounded-lg text-sm transition-all duration-200 ${item.gradient}`}
                >
                  <div className="font-bold text-sm tracking-tight mb-0.5">{item.title}</div>
                  <div className="text-xs sm:text-sm leading-relaxed opacity-95">
                    This is a {item.name} alert.
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: Dismissable Alerts */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-[#1351b8] tracking-tight">Dismissable</h3>
              {dismissedKeys.length > 0 && (
                <button
                  onClick={handleResetDismissed}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1351b8] hover:text-[#0c2869] transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset ({dismissedKeys.length})
                </button>
              )}
            </div>
            <div className="p-6 space-y-3.5">
              {alertDefinitions
                .filter((item) => !dismissedKeys.includes(item.key))
                .map((item) => (
                  <div
                    key={item.key}
                    className={`px-4.5 py-3.5 rounded-lg text-sm flex items-center justify-between gap-3 transition-all duration-200 ${item.gradient}`}
                  >
                    <div className="text-xs sm:text-sm font-medium">
                      This is a {item.name} alert.
                    </div>
                    <button
                      onClick={() => handleDismiss(item.key)}
                      className={`w-7 h-7 flex items-center justify-center rounded-md text-lg leading-none font-bold transition-colors ${
                        item.isLight
                          ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-300/40'
                          : 'text-white/80 hover:text-white hover:bg-black/15'
                      }`}
                      aria-label={`Tutup alert ${item.name}`}
                    >
                      &times;
                    </button>
                  </div>
                ))}

              {dismissedKeys.length === alertDefinitions.length && (
                <div className="text-center py-8 space-y-2">
                  <p className="text-sm text-slate-500 font-medium">
                    Semua alert dismissable telah ditutup.
                  </p>
                  <button
                    onClick={handleResetDismissed}
                    className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg bg-[#1351b8] text-white hover:bg-[#0c2869] transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Tampilkan Kembali Semua Alert
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dedicated Cards Showcase matching user's reference screenshot
function CardsView() {
  return (
    <div className="space-y-8">
      {/* Section 1: Cards */}
      <div className="space-y-4">
        {/* Section Header with Blue Pill Accent */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-8 h-2.5 bg-[#1351b8] rounded-full inline-block" />
            <h2 className="text-base sm:text-lg font-bold text-slate-800">Cards</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Bootstrap's cards provide a flexible and extensible content container with multiple variants and options.
          </p>
        </div>

        {/* 2-Column Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Basic with Footer */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div className="p-6">
              <h3 className="text-base font-bold text-[#1351b8] mb-4">Card Title</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                This is some text within a card body.
              </p>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 text-xs text-slate-500">
              Footer Card
            </div>
          </div>

          {/* Card 2: Links */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-6">
            <h3 className="text-base font-bold text-[#1351b8] mb-4">Card Title</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
              Some quick example text to build on the card title and make up the bulk of the card's content.
            </p>
            <div className="flex items-center gap-4 text-xs font-semibold text-[#1351b8]">
              <a href="#card-link" className="hover:underline">
                Card link
              </a>
              <a href="#another-link" className="hover:underline">
                Another link
              </a>
            </div>
          </div>

          {/* Card 3: Action Button */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-6 flex flex-col justify-between min-h-[160px]">
            <div>
              <h3 className="text-base font-bold text-[#1351b8] mb-4">Card Action Button</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                This is some text within a card body.
              </p>
            </div>
            <div className="flex justify-end pt-4">
              <button
                onClick={() => showToast('Form submitted successfully!', 'success')}
                className="px-5 py-2 bg-[#1351b8] hover:bg-[#0f449e] text-white text-xs font-semibold rounded-md transition-all shadow-xs"
              >
                Submit
              </button>
            </div>
          </div>

          {/* Card 4: Footer bg-whitesmoke */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div className="p-6">
              <h3 className="text-base font-bold text-[#1351b8] mb-4">Footer bg-whitesmoke</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                This is some text within a card body.
              </p>
            </div>
            <div className="px-6 py-4 bg-slate-50/90 border-t border-slate-200/80 rounded-b-xl text-xs text-slate-500">
              Footer Card
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Card Variants */}
      <div className="space-y-4 pt-2">
        {/* Section Header with Blue Pill Accent */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-8 h-2.5 bg-[#1351b8] rounded-full inline-block" />
            <h2 className="text-base sm:text-lg font-bold text-slate-800">Card Variants</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Basically, the Bootstrap card can be given a color variant.
          </p>
        </div>

        {/* 4-Column Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Variant 1: Primary */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs border-t-4 border-t-[#1351b8] p-5">
            <h3 className="text-sm font-bold text-[#1351b8] mb-3">Card Header</h3>
            <p className="text-xs text-slate-500 font-mono">Card .card-primary</p>
          </div>

          {/* Variant 2: Secondary */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs border-t-4 border-t-slate-400 p-5">
            <h3 className="text-sm font-bold text-slate-600 mb-3">Card Header</h3>
            <p className="text-xs text-slate-500 font-mono">Card .card-secondary</p>
          </div>

          {/* Variant 3: Danger */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs border-t-4 border-t-rose-500 p-5">
            <h3 className="text-sm font-bold text-rose-600 mb-3">Card Header</h3>
            <p className="text-xs text-slate-500 font-mono">Card .card-danger</p>
          </div>

          {/* Variant 4: Warning */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs border-t-4 border-t-amber-400 p-5">
            <h3 className="text-sm font-bold text-amber-600 mb-3">Card Header</h3>
            <p className="text-xs text-slate-500 font-mono">Card .card-warning</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardView() {
  const { data, isLoading } = useDashboardData();

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[350px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#1351b8] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Memuat data Velora UI...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Banner / Welcome Callout */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#0c2869] via-[#103a94] to-[#164ebd] rounded-2xl p-6 text-white shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/15 text-amber-300 backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5" />
              Sistem CBT & LMS Terintegrasi
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Selamat Datang di Portal Admin Velora UI
            </h2>
            <p className="text-xs sm:text-sm text-blue-100/90 font-normal leading-relaxed">
              Pantau jalannya ujian berbasis komputer, bank soal pilihan ganda, dan rekapitulasi nilai
              secara real-time melalui panel navigasi terpadu.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-shrink-0">
            <button
              onClick={() => showToast('Semua layanan CBT & LMS siap digunakan!', 'success')}
              className="px-4 py-2 bg-white text-[#0c2869] font-bold text-xs rounded-xl shadow-xs hover:bg-blue-50 transition-all focus:outline-none"
            >
              Cek Status Server
            </button>
            <button
              onClick={() =>
                showSuccess(
                  'Panduan Singkat',
                  'Gunakan menu sidebar sebelah kiri untuk navigasi ke Bank Soal, Jadwal Ujian, atau Monitoring Hasil.'
                )
              }
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium text-xs rounded-xl transition-all border border-white/20"
            >
              Panduan Singkat
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Metric Stat Cards */}
      <StatCards stats={data.stats} />

      {/* Main Monitoring Table */}
      <RecentExamsTable exams={data.recentExams} />
    </div>
  );
}

function BlankPageView() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-12 shadow-xs min-h-[420px] flex flex-col justify-center items-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#1351b8] flex items-center justify-center mb-4 shadow-inner">
        <FileCode2 className="w-8 h-8" strokeWidth={2} />
      </div>
      <h3 className="text-lg font-bold text-slate-800">Halaman Kosong Siap Pakai</h3>
      <p className="text-sm text-slate-500 max-w-md mx-auto mt-2 mb-6 leading-relaxed">
        Template blank page ini siap Anda gunakan sebagai kanvas untuk membuat form input baru, tabel data, ataupun halaman statistik CBT kustom.
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={() => showToast('Memulai komponen baru di Blank Page...', 'success')}
          className="px-5 py-2.5 bg-[#1351b8] hover:bg-[#0f449e] text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
        >
          Mulai Tambah Komponen
        </button>
      </div>
    </div>
  );
}

// Dedicated Kelas & Rombel View
function KelasView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTingkat, setSelectedTingkat] = useState('Semua');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const classes = [
    { id: 1, kode: 'X-RPL-1', nama: 'Sepuluh RPL 1', tingkat: 'X', jurusan: 'Rekayasa Perangkat Lunak', wali: 'Budi Santoso, S.Kom', siswa: 36, status: 'Siap Ujian' },
    { id: 2, kode: 'X-RPL-2', nama: 'Sepuluh RPL 2', tingkat: 'X', jurusan: 'Rekayasa Perangkat Lunak', wali: 'Agus Setiawan, S.Kom', siswa: 36, status: 'Siap Ujian' },
    { id: 3, kode: 'X-TKJ-1', nama: 'Sepuluh TKJ 1', tingkat: 'X', jurusan: 'Teknik Komputer Jaringan', wali: 'Rina Astuti, S.Pd', siswa: 35, status: 'Siap Ujian' },
    { id: 4, kode: 'X-TKJ-2', nama: 'Sepuluh TKJ 2', tingkat: 'X', jurusan: 'Teknik Komputer Jaringan', wali: 'Eko Prasetyo, S.T', siswa: 35, status: 'Siap Ujian' },
    { id: 5, kode: 'X-DKV-1', nama: 'Sepuluh DKV 1', tingkat: 'X', jurusan: 'Desain Komunikasi Visual', wali: 'Maya Indah, S.Ds', siswa: 34, status: 'Siap Ujian' },
    { id: 6, kode: 'X-AKL-1', nama: 'Sepuluh AKL 1', tingkat: 'X', jurusan: 'Akuntansi Keuangan', wali: 'Sri Wahyuni, S.E', siswa: 36, status: 'Siap Ujian' },
    { id: 7, kode: 'XI-MIPA-1', nama: 'Sebelas MIPA 1', tingkat: 'XI', jurusan: 'MIPA Unggulan', wali: 'Ahmad Fauzi, M.Pd', siswa: 34, status: 'Sesi Aktif' },
    { id: 8, kode: 'XI-MIPA-2', nama: 'Sebelas MIPA 2', tingkat: 'XI', jurusan: 'MIPA Reguler', wali: 'Nurul Hidayati, M.Si', siswa: 35, status: 'Sesi Aktif' },
    { id: 9, kode: 'XI-IPS-1', nama: 'Sebelas IPS 1', tingkat: 'XI', jurusan: 'Ilmu Pengetahuan Sosial', wali: 'Siti Rahma, S.Pd', siswa: 32, status: 'Siap Ujian' },
    { id: 10, kode: 'XI-IPS-2', nama: 'Sebelas IPS 2', tingkat: 'XI', jurusan: 'Ilmu Pengetahuan Sosial', wali: 'Bambang Irawan, M.Pd', siswa: 33, status: 'Siap Ujian' },
    { id: 11, kode: 'XI-RPL-1', nama: 'Sebelas RPL 1', tingkat: 'XI', jurusan: 'Rekayasa Perangkat Lunak', wali: 'Fahmi Nugroho, S.Kom', siswa: 36, status: 'Siap Ujian' },
    { id: 12, kode: 'XI-TKJ-1', nama: 'Sebelas TKJ 1', tingkat: 'XI', jurusan: 'Teknik Komputer Jaringan', wali: 'Aris Munandar, S.T', siswa: 34, status: 'Siap Ujian' },
    { id: 13, kode: 'XII-MIPA-1', nama: 'Duabelas MIPA 1', tingkat: 'XII', jurusan: 'MIPA 1', wali: 'Dian Permata, S.Si', siswa: 36, status: 'Selesai' },
    { id: 14, kode: 'XII-MIPA-2', nama: 'Duabelas MIPA 2', tingkat: 'XII', jurusan: 'MIPA 2', wali: 'Drs. Hendro Wibowo', siswa: 35, status: 'Selesai' },
    { id: 15, kode: 'XII-IPS-1', nama: 'Duabelas IPS 1', tingkat: 'XII', jurusan: 'IPS 1', wali: 'Yuni Astuti, M.Pd', siswa: 33, status: 'Selesai' },
    { id: 16, kode: 'XII-RPL-1', nama: 'Duabelas RPL 1', tingkat: 'XII', jurusan: 'Rekayasa Perangkat Lunak', wali: 'Hendra Gunawan, S.Kom', siswa: 35, status: 'Siap Ujian' },
    { id: 17, kode: 'XII-RPL-2', nama: 'Duabelas RPL 2', tingkat: 'XII', jurusan: 'Rekayasa Perangkat Lunak', wali: 'Dimas Pratama, M.Kom', siswa: 34, status: 'Siap Ujian' },
    { id: 18, kode: 'XII-TKJ-1', nama: 'Duabelas TKJ 1', tingkat: 'XII', jurusan: 'Teknik Komputer Jaringan', wali: 'Bayu Wicaksono, S.T', siswa: 36, status: 'Siap Ujian' },
  ];

  const filtered = classes.filter((c) => {
    const matchSearch =
      c.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.kode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.wali.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.jurusan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTingkat = selectedTingkat === 'Semua' || c.tingkat === selectedTingkat;
    return matchSearch && matchTingkat;
  });

  // Calculate paginated slice
  const paginatedClasses = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleFilterTingkat = (tingkat: string) => {
    setSelectedTingkat(tingkat);
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handleAddClass = () => {
    showToast('Formulir tambah kelas & rombel dibuka.', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-8 h-2.5 bg-[#1351b8] rounded-full inline-block" />
            <h2 className="text-base sm:text-lg font-bold text-slate-800">Data Kelas &amp; Rombel</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Kelola data rombongan belajar, alokasi wali kelas, dan pembagian peserta ujian CBT per tingkatan.
          </p>
        </div>
        <button
          onClick={handleAddClass}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1351b8] hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Tambah Rombel Baru
        </button>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Total Rombel</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{classes.length} Kelas</p>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">3 Tingkatan (X, XI, XII)</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1351b8] flex items-center justify-center font-bold">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Total Siswa Aktif</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">629 Siswa</p>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">100% Terdaftar CBT</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Rata-rata per Kelas</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">35 Siswa</p>
            <p className="text-[11px] text-slate-500 font-medium mt-1">Standar Kemdikbud</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Ruang CBT Siap</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">6 Laboratorium</p>
            <p className="text-[11px] text-blue-600 font-medium mt-1">Kapasitas 600 Klien</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Radio className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Table Filter Bar: Show Entries on Left, Search + Filters on Right */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Show Entries Dropdown */}
          <div className="flex items-center gap-3">
            <ShowEntriesSelector
              pageSize={pageSize}
              onPageSizeChange={handlePageSizeChange}
              options={[5, 10, 25, 50]}
            />
          </div>

          {/* Search Input & Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative w-full sm:w-64 md:w-72">
              <input
                type="text"
                placeholder="Cari kode, nama rombel, atau wali..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full bg-slate-50 text-slate-800 placeholder-slate-400 text-xs sm:text-sm pl-9 pr-4 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1351b8]"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2" />
            </div>

            {/* Tingkat Filter Buttons */}
            <div className="flex items-center gap-1">
              {['Semua', 'X', 'XI', 'XII'].map((t) => (
                <button
                  key={t}
                  onClick={() => handleFilterTingkat(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    selectedTingkat === t
                      ? 'bg-[#1351b8] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t === 'Semua' ? 'Semua' : `Kelas ${t}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200/80 text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">No</th>
                <th className="py-3 px-4">Kode Rombel</th>
                <th className="py-3 px-4">Nama Kelas</th>
                <th className="py-3 px-4">Tingkat</th>
                <th className="py-3 px-4">Jurusan / Konsentrasi</th>
                <th className="py-3 px-4">Wali Kelas</th>
                <th className="py-3 px-4 text-center">Jumlah Siswa</th>
                <th className="py-3 px-4 text-center">Status CBT</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paginatedClasses.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    Tidak ada rombel yang cocok dengan kriteria pencarian "{searchTerm}".
                  </td>
                </tr>
              ) : (
                paginatedClasses.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      {(currentPage - 1) * pageSize + idx + 1}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-[#1351b8]">
                      {item.kode}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">{item.nama}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-[11px] font-semibold">
                        Kelas {item.tingkat}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{item.jurusan}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">{item.wali}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2.5 py-1 bg-blue-50 text-[#1351b8] rounded-full text-xs font-semibold">
                        {item.siswa} Siswa
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          item.status === 'Sesi Aktif'
                            ? 'bg-blue-100 text-blue-800 animate-pulse'
                            : item.status === 'Selesai'
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => showToast(`Detail rombel: ${item.nama}`, 'info')}
                          className="p-1.5 text-slate-400 hover:text-[#1351b8] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Detail Kelas"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => showToast(`Edit kelas: ${item.nama}`, 'info')}
                          className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Rombel"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => showToast(`Hapus rombel: ${item.nama}`, 'warning')}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Rombel"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Dynamic Pagination Bar */}
        <TablePagination
          currentPage={currentPage}
          totalEntries={filtered.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  );
}

// Dedicated Mata Pelajaran View
function MataPelajaranView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKelompok, setSelectedKelompok] = useState('Semua');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const subjects = [
    { id: 1, kode: 'MTK-01', nama: 'Matematika Wajib', kelompok: 'Kelompok A (Wajib)', tingkat: 'X, XI, XII', koordinator: 'Budi Santoso, S.Kom', bankSoal: 320, status: 'Aktif' },
    { id: 2, kode: 'BIN-01', nama: 'Bahasa Indonesia', kelompok: 'Kelompok A (Wajib)', tingkat: 'X, XI, XII', koordinator: 'Siti Rahma, S.Pd', bankSoal: 280, status: 'Aktif' },
    { id: 3, kode: 'BIG-01', nama: 'Bahasa Inggris', kelompok: 'Kelompok A (Wajib)', tingkat: 'X, XI, XII', koordinator: 'Dian Permata, S.Si', bankSoal: 250, status: 'Aktif' },
    { id: 4, kode: 'FIS-02', nama: 'Fisika Peminatan', kelompok: 'Kelompok C (Peminatan)', tingkat: 'XI, XII', koordinator: 'Ahmad Fauzi, M.Pd', bankSoal: 190, status: 'Aktif' },
    { id: 5, kode: 'KIM-01', nama: 'Kimia Peminatan', kelompok: 'Kelompok C (Peminatan)', tingkat: 'XI, XII', koordinator: 'Nurul Hidayati, M.Si', bankSoal: 180, status: 'Aktif' },
    { id: 6, kode: 'BIO-01', nama: 'Biologi Peminatan', kelompok: 'Kelompok C (Peminatan)', tingkat: 'XI, XII', koordinator: 'Drs. Hendro Wibowo', bankSoal: 210, status: 'Aktif' },
    { id: 7, kode: 'SEJ-01', nama: 'Sejarah Indonesia', kelompok: 'Kelompok A (Wajib)', tingkat: 'X, XI, XII', koordinator: 'Yuni Astuti, M.Pd', bankSoal: 170, status: 'Aktif' },
    { id: 8, kode: 'EKO-01', nama: 'Ekonomi Peminatan', kelompok: 'Kelompok C (Peminatan)', tingkat: 'XI, XII', koordinator: 'Sri Wahyuni, S.E', bankSoal: 195, status: 'Aktif' },
    { id: 9, kode: 'GEO-01', nama: 'Geografi Peminatan', kelompok: 'Kelompok C (Peminatan)', tingkat: 'XI, XII', koordinator: 'Bambang Irawan, M.Pd', bankSoal: 160, status: 'Aktif' },
    { id: 10, kode: 'SOS-01', nama: 'Sosiologi Peminatan', kelompok: 'Kelompok C (Peminatan)', tingkat: 'XI, XII', koordinator: 'Maya Indah, S.Ds', bankSoal: 150, status: 'Aktif' },
    { id: 11, kode: 'RPL-03', nama: 'Pemrograman Web & Mobile', kelompok: 'Kejuruan RPL', tingkat: 'XI, XII', koordinator: 'Hendra Gunawan, S.Kom', bankSoal: 210, status: 'Aktif' },
    { id: 12, kode: 'RPL-04', nama: 'Basis Data Relasional', kelompok: 'Kejuruan RPL', tingkat: 'XI, XII', koordinator: 'Fahmi Nugroho, S.Kom', bankSoal: 185, status: 'Aktif' },
    { id: 13, kode: 'TKJ-02', nama: 'Administrasi Sistem Jaringan', kelompok: 'Kejuruan TKJ', tingkat: 'XI, XII', koordinator: 'Aris Munandar, S.T', bankSoal: 220, status: 'Aktif' },
    { id: 14, kode: 'TKJ-03', nama: 'Keamanan Jaringan & Cloud', kelompok: 'Kejuruan TKJ', tingkat: 'XII', koordinator: 'Bayu Wicaksono, S.T', bankSoal: 175, status: 'Aktif' },
    { id: 15, kode: 'PAI-01', nama: 'Pendidikan Agama & Budi Pekerti', kelompok: 'Kelompok A (Wajib)', tingkat: 'X, XI, XII', koordinator: 'Ust. Syarif Hidayat, M.Ag', bankSoal: 180, status: 'Aktif' },
    { id: 16, kode: 'PJK-01', nama: 'Pendidikan Jasmani & Olahraga', kelompok: 'Kelompok B (Umum)', tingkat: 'X, XI', koordinator: 'Dimas Pratama, S.Pd', bankSoal: 140, status: 'Aktif' },
  ];

  const filtered = subjects.filter((s) => {
    const matchSearch =
      s.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.kode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.koordinator.toLowerCase().includes(searchTerm.toLowerCase());
    const matchKelompok = selectedKelompok === 'Semua' || s.kelompok.includes(selectedKelompok);
    return matchSearch && matchKelompok;
  });

  const paginatedSubjects = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleFilterKelompok = (kelompok: string) => {
    setSelectedKelompok(kelompok);
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handleAddSubject = () => {
    showToast('Formulir tambah mata pelajaran dibuka.', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-8 h-2.5 bg-[#1351b8] rounded-full inline-block" />
            <h2 className="text-base sm:text-lg font-bold text-slate-800">Mata Pelajaran &amp; Kurikulum</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Daftar kurikulum mata pelajaran terintegrasi bank butir soal CBT dan silabus LMS.
          </p>
        </div>
        <button
          onClick={handleAddSubject}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1351b8] hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Tambah Mapel Baru
        </button>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Total Mata Pelajaran</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{subjects.length} Mapel</p>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">Kurikulum Merdeka &amp; K13</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1351b8] flex items-center justify-center font-bold">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Mapel Diujikan CBT</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">16 Mapel</p>
            <p className="text-[11px] text-blue-600 font-medium mt-1">Siap Pelaksanaan PTS/PAS</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Total Butir Bank Soal</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">3.045 Butir</p>
            <p className="text-[11px] text-amber-600 font-medium mt-1">PG &amp; Kompleks Terverifikasi</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Guru Koordinator</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">38 Pengampu</p>
            <p className="text-[11px] text-purple-600 font-medium mt-1">Hak Pembuat Soal Aktif</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Table Filter Bar: Show Entries on Left, Search + Filters on Right */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Show Entries Dropdown */}
          <div className="flex items-center gap-3">
            <ShowEntriesSelector
              pageSize={pageSize}
              onPageSizeChange={handlePageSizeChange}
              options={[5, 10, 25, 50]}
            />
          </div>

          {/* Search Input & Kelompok Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative w-full sm:w-64 md:w-72">
              <input
                type="text"
                placeholder="Cari kode mapel, nama, atau guru..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full bg-slate-50 text-slate-800 placeholder-slate-400 text-xs sm:text-sm pl-9 pr-4 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1351b8]"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2" />
            </div>

            {/* Kelompok Filter Buttons */}
            <div className="flex items-center gap-1 flex-wrap">
              {['Semua', 'Wajib', 'Peminatan', 'Kejuruan'].map((k) => (
                <button
                  key={k}
                  onClick={() => handleFilterKelompok(k)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    selectedKelompok === k
                      ? 'bg-[#1351b8] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {k === 'Semua' ? 'Semua' : k}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200/80 text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">No</th>
                <th className="py-3 px-4">Kode</th>
                <th className="py-3 px-4">Nama Mata Pelajaran</th>
                <th className="py-3 px-4">Kelompok</th>
                <th className="py-3 px-4">Alokasi Tingkat</th>
                <th className="py-3 px-4">Guru Koordinator</th>
                <th className="py-3 px-4 text-center">Bank Soal</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paginatedSubjects.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    Tidak ada mata pelajaran yang cocok dengan kriteria pencarian "{searchTerm}".
                  </td>
                </tr>
              ) : (
                paginatedSubjects.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      {(currentPage - 1) * pageSize + idx + 1}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-[#1351b8]">
                      {item.kode}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">{item.nama}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-[11px] font-semibold">
                        {item.kelompok}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{item.tingkat}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">{item.koordinator}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2.5 py-1 bg-blue-50 text-[#1351b8] rounded-full text-xs font-semibold">
                        {item.bankSoal} Butir
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => showToast(`Lihat bank butir: ${item.nama}`, 'info')}
                          className="p-1.5 text-slate-400 hover:text-[#1351b8] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Lihat Bank Soal"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => showToast(`Edit mata pelajaran: ${item.nama}`, 'info')}
                          className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Mapel"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => showToast(`Hapus mapel: ${item.nama}`, 'warning')}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Mapel"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Dynamic Pagination Bar */}
        <TablePagination
          currentPage={currentPage}
          totalEntries={filtered.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  );
}

function PlaceholderView({ title, icon: Icon, desc }: { title: string; icon: React.ElementType; desc: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center shadow-xs">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 text-[#1351b8] flex items-center justify-center mb-4 shadow-inner">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-slate-800">{title}</h3>
      <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-6 leading-relaxed">
        {desc}
      </p>
      <button
        onClick={() => showToast(`Modul ${title} siap dikonfigurasi.`, 'info')}
        className="px-4 py-2 bg-[#1351b8] hover:bg-[#0f449e] text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
      >
        Konfigurasi Modul Ini
      </button>
    </div>
  );
}

// Helper to get initial active menu from URL hash (e.g. #/alert) or localStorage
const getInitialMenu = (): string => {
  if (typeof window !== 'undefined') {
    const hash = window.location.hash.replace(/^#\/?/, '').trim();
    if (hash) {
      return hash;
    }
    try {
      const saved = localStorage.getItem('velora_active_menu');
      if (saved) return saved;
    } catch {}
  }
  return 'general-dashboard';
};

export function App() {
  const [activeMenu, setActiveMenu] = useState<string>(getInitialMenu);

  const handleSelectMenu = (id: string) => {
    setActiveMenu(id);
    if (typeof window !== 'undefined') {
      window.location.hash = `#/${id}`;
      try {
        localStorage.setItem('velora_active_menu', id);
      } catch {}
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '').trim();
      if (hash && hash !== activeMenu) {
        setActiveMenu(hash);
        try {
          localStorage.setItem('velora_active_menu', hash);
        } catch {}
      }
    };

    window.addEventListener('hashchange', handleHashChange);

    // Initial sync of URL hash
    if (typeof window !== 'undefined') {
      const currentHash = window.location.hash.replace(/^#\/?/, '').trim();
      if (!currentHash) {
        window.history.replaceState(null, '', `#/${activeMenu}`);
      }
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [activeMenu]);

  const pageMeta: Record<string, { title: string; breadcrumbs: string[] }> = {
    'general-dashboard': {
      title: 'General Dashboard',
      breadcrumbs: ['Velora UI', 'Dashboard', 'General Dashboard'],
    },
    'ecommerce-dashboard': {
      title: 'Ecommerce Dashboard',
      breadcrumbs: ['Velora UI', 'Dashboard', 'Ecommerce Dashboard'],
    },
    dashboard: {
      title: 'General Dashboard',
      breadcrumbs: ['Velora UI', 'Dashboard'],
    },
    'blank-page': {
      title: 'Blank Page',
      breadcrumbs: ['Velora UI', 'Starter', 'Blank Page'],
    },
    alert: {
      title: 'Alert Showcase',
      breadcrumbs: ['Velora UI', 'Bootstrap', 'Alert'],
    },
    badge: {
      title: 'Badge Showcase',
      breadcrumbs: ['Velora UI', 'Bootstrap', 'Badge'],
    },
    breadcrumb: {
      title: 'Breadcrumb Showcase',
      breadcrumbs: ['Velora UI', 'Bootstrap', 'Breadcrumb'],
    },
    buttons: {
      title: 'Buttons Showcase',
      breadcrumbs: ['Velora UI', 'Bootstrap', 'Buttons'],
    },
    card: {
      title: 'Card Showcase',
      breadcrumbs: ['Velora UI', 'Bootstrap', 'Card'],
    },
    form: {
      title: 'Form Elements',
      breadcrumbs: ['Velora UI', 'Bootstrap', 'Form'],
    },
    modal: {
      title: 'Modal & Dialog',
      breadcrumbs: ['Velora UI', 'Bootstrap', 'Modal'],
    },
    pagination: {
      title: 'Pagination & Data Table',
      breadcrumbs: ['Velora UI', 'Bootstrap', 'Pagination'],
    },
    table: {
      title: 'Data Table Showcase',
      breadcrumbs: ['Velora UI', 'Bootstrap', 'Table'],
    },
    datatables: {
      title: 'DataTables Module',
      breadcrumbs: ['Velora UI', 'Modules', 'DataTables'],
    },
    credits: {
      title: 'Credits & Attribution',
      breadcrumbs: ['Velora UI', 'Credits'],
    },
  };

  const formatSlug = (slug: string) =>
    slug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

  const currentMeta = pageMeta[activeMenu] || {
    title: formatSlug(activeMenu),
    breadcrumbs: ['Velora UI', 'Pages', formatSlug(activeMenu)],
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'general-dashboard':
      case 'ecommerce-dashboard':
      case 'dashboard':
        return <DashboardView />;
      case 'pagination':
      case 'table':
      case 'datatables':
      case 'components-table':
        return <KelasView />;
      case 'advanced-form':
      case 'forms':
        return <MataPelajaranView />;
      case 'card':
        return <CardsView />;
      case 'alert':
        return <AlertView />;
      case 'blank-page':
        return <BlankPageView />;
      case 'credits':
        return (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-sm max-w-3xl space-y-4">
            <h3 className="text-xl font-bold text-slate-800">Credits & Attribution</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Velora UI is built with love, inspired by the legendary Stisla admin dashboard theme and modernized using React 19, Tailwind CSS v4, Vite, and Lucide React.
            </p>
            <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-4 text-xs font-medium text-slate-500">
              <span>Author: <b>Fahmi Ibrahim</b></span>
              <span>•</span>
              <span>License: <b>MIT License</b></span>
              <span>•</span>
              <a href="https://github.com/fahmiibrahimdevs/velora-ui" target="_blank" rel="noreferrer" className="text-[#1351b8] hover:underline font-semibold">GitHub Repository</a>
            </div>
          </div>
        );
      default:
        return (
          <PlaceholderView
            title={currentMeta.title}
            icon={CheckCircle2}
            desc="Halaman modul siap untuk pengembangan fitur selanjutnya."
          />
        );
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AdminLayout
        activeMenu={activeMenu}
        onSelectMenu={handleSelectMenu}
        pageTitle={currentMeta.title}
        breadcrumbs={currentMeta.breadcrumbs}
      >
        {renderContent()}
      </AdminLayout>
    </QueryClientProvider>
  );
}

export default App;
