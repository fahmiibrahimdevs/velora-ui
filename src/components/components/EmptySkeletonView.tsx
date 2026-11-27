import { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FolderOpen,
  Inbox,
  Lock,
  Plus,
  RefreshCw,
  SearchX,
  Sparkles,
  UploadCloud,
  WifiOff,
} from 'lucide-react';
import { showToast } from '../../lib/swal';
import { FeatureSectionHeader } from '../features/FeatureSectionHeader';

const GRAD = {
  primary:
    'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white',
  primaryStatic: 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white',
  info:
    'bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] hover:from-[#0284c7] hover:to-[#0369a1] text-white',
  warning:
    'bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:from-[#ea580c] hover:to-[#b45309] text-white',
  danger:
    'bg-gradient-to-r from-[#ef4444] to-[#b91c1c] hover:from-[#dc2626] hover:to-[#991b1b] text-white',
  success:
    'bg-gradient-to-r from-[#22c55e] to-[#15803d] hover:from-[#16a34a] hover:to-[#166534] text-white',
  light:
    'bg-gradient-to-r from-[#f8fafc] to-[#e2e8f0] hover:from-[#e2e8f0] hover:to-[#cbd5e1] text-slate-800 border border-slate-200/80',
  dark:
    'bg-gradient-to-r from-[#1e293b] to-[#020617] hover:from-[#0f172a] hover:to-[#000000] text-white',
} as const;

export function EmptySkeletonView() {
  const [activeTab, setActiveTab] = useState<'all' | 'empty' | 'skeleton'>('all');
  const [isLoadingSim, setIsLoadingSim] = useState(true);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <FeatureSectionHeader
          title="Empty States & Skeleton Loaders"
          description="Koleksi pola UI saat data belum tersedia, pencarian nihil, akses ditolak, serta shimmer loading state siap pakai."
        />

        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          {[
            { id: 'all' as const, label: 'Semua Pola' },
            { id: 'empty' as const, label: 'Empty States (6)' },
            { id: 'skeleton' as const, label: 'Skeleton Loaders (4)' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer ${
                activeTab === tab.id ? GRAD.primary : GRAD.light
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1: EMPTY STATES */}
      {(activeTab === 'all' || activeTab === 'empty') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              1. Variasi Empty States
            </h3>
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${GRAD.primaryStatic}`}>
              Zero-Data UX
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {/* Empty 1: Belum Ada Transaksi */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col items-center text-center justify-between gap-4">
              <div className="space-y-3 flex flex-col items-center">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${GRAD.primaryStatic}`}>
                  <Inbox className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900">Belum Ada Pengajuan</h4>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-xs">
                    Daftar reimbursement maupun kasbon periode ini masih kosong. Mulai ajukan permintaan baru.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => showToast('Membuka form pengajuan baru...', 'info')}
                className={`px-4 py-2 text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 cursor-pointer ${GRAD.primary}`}
              >
                <Plus className="w-3.5 h-3.5" />
                Buat Pengajuan
              </button>
            </div>

            {/* Empty 2: Hasil Pencarian Nihil */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col items-center text-center justify-between gap-4">
              <div className="space-y-3 flex flex-col items-center">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${GRAD.info}`}>
                  <SearchX className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900">Pencarian Tidak Ditemukan</h4>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-xs">
                    Tidak ada data yang cocok dengan kata kunci &quot;Payroll Q5&quot;. Coba periksa ejaan atau atur ulang filter.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => showToast('Semua filter pencarian direset!', 'success')}
                className={`px-4 py-2 text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 cursor-pointer ${GRAD.light}`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset Filter
              </button>
            </div>

            {/* Empty 3: Folder / Upload Kosong */}
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-6 shadow-xs flex flex-col items-center text-center justify-between gap-4">
              <div className="space-y-3 flex flex-col items-center">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${GRAD.success}`}>
                  <FolderOpen className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900">Folder Dokumen Masih Kosong</h4>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-xs">
                    Tarik dan lepaskan berkas PDF, Excel, atau gambar ke area ini untuk mengunggah ke workspace.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => showToast('Dialog pilih berkas siap digunakan!', 'info')}
                className={`px-4 py-2 text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 cursor-pointer ${GRAD.success}`}
              >
                <UploadCloud className="w-3.5 h-3.5" />
                Unggah Berkas
              </button>
            </div>

            {/* Empty 4: Akses Terbatas */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col items-center text-center justify-between gap-4">
              <div className="space-y-3 flex flex-col items-center">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${GRAD.warning}`}>
                  <Lock className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900">Akses Modul Dibatasi</h4>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-xs">
                    Halaman laporan audit hanya tersedia untuk role Finance Lead &amp; Super Admin.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => showToast('Permintaan izin dikirim ke Administrator.', 'success')}
                className={`px-4 py-2 text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 cursor-pointer ${GRAD.warning}`}
              >
                Minta Izin Akses
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Empty 5: Koneksi / Sync Gagal */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col items-center text-center justify-between gap-4">
              <div className="space-y-3 flex flex-col items-center">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${GRAD.danger}`}>
                  <WifiOff className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900">Gagal Memuat Data Server</h4>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-xs">
                    Koneksi ke API Gateway terputus sementara. Periksa jaringan Anda lalu coba muat ulang.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => showToast('Menghubungkan ulang ke server...', 'info')}
                className={`px-4 py-2 text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 cursor-pointer ${GRAD.danger}`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Muat Ulang
              </button>
            </div>

            {/* Empty 6: Inbox Zero / Semua Tugas Selesai */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col items-center text-center justify-between gap-4">
              <div className="space-y-3 flex flex-col items-center">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${GRAD.dark}`}>
                  <Sparkles className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900">Semua Tugas Sudah Beres!</h4>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-xs">
                    Tidak ada antrean approval atau tiket tertunda hari ini. Kerja bagus untuk seluruh tim.
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-[11px] font-semibold inline-flex items-center gap-1 ${GRAD.success}`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                Inbox Zero
              </span>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: SKELETON LOADERS WITH LIVE TOGGLE */}
      {(activeTab === 'all' || activeTab === 'skeleton') && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                2. Shimmer Skeleton Loaders
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Klik tombol di kanan untuk melihat transisi antara kondisi Loading (Skeleton) dan Data Siap.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsLoadingSim((prev) => !prev)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer ${
                isLoadingSim ? GRAD.primary : GRAD.success
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingSim ? 'animate-spin' : ''}`} />
              {isLoadingSim ? 'Mode: Loading Skeleton (Klik untuk Tampilkan Data)' : 'Mode: Data Terisi (Klik untuk Simulasi Skeleton)'}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Skeleton 1: KPI Cards */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900">KPI Cards Skeleton</h4>
                <span className="text-[11px] font-medium text-slate-600">Dashboard Metrics</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Pendapatan Bulan Ini', val: 'Rp 148.500.000', badge: '+18.4%' },
                  { label: 'Pengguna Aktif', val: '2.840 User', badge: '+9.2%' },
                ].map((kpi) =>
                  isLoadingSim ? (
                    <div key={kpi.label} className="p-4 rounded-xl border border-slate-200 space-y-2.5 animate-pulse">
                      <div className="flex items-center justify-between">
                        <div className="h-3 w-24 rounded bg-slate-200" />
                        <div className="h-5 w-10 rounded-full bg-slate-200" />
                      </div>
                      <div className="h-6 w-32 rounded bg-slate-200" />
                      <div className="h-2.5 w-20 rounded bg-slate-100" />
                    </div>
                  ) : (
                    <div key={kpi.label} className="p-4 rounded-xl border border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-slate-600">{kpi.label}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${GRAD.success}`}>
                          {kpi.badge}
                        </span>
                      </div>
                      <p className="text-base font-bold text-slate-900">{kpi.val}</p>
                      <p className="text-[11px] text-slate-600">Dibanding bulan lalu</p>
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* Skeleton 2: Profile Header */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900">Profile &amp; Contact Card Skeleton</h4>
                <span className="text-[11px] font-medium text-slate-600">User Card</span>
              </div>
              {isLoadingSim ? (
                <div className="p-4 rounded-xl border border-slate-200 flex items-center gap-4 animate-pulse">
                  <div className="w-14 h-14 rounded-2xl bg-slate-200 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-40 rounded bg-slate-200" />
                    <div className="h-3 w-56 rounded bg-slate-100" />
                    <div className="flex gap-2 pt-1">
                      <div className="h-6 w-20 rounded-lg bg-slate-200" />
                      <div className="h-6 w-20 rounded-lg bg-slate-100" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-slate-200 flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-base font-bold shrink-0 ${GRAD.primaryStatic}`}>
                    NK
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-sm font-bold text-slate-900">Nadia Kusuma</p>
                    <p className="text-xs text-slate-600 truncate">Product Design Lead • nadia@velora.id</p>
                    <div className="flex gap-2 pt-1">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${GRAD.info}`}>
                        Design Ops
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${GRAD.success}`}>
                        Online
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Skeleton 3: Data Table Rows */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4 lg:col-span-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900">Data Table Rows Skeleton</h4>
                <span className="text-[11px] font-medium text-slate-600">Table / List View</span>
              </div>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="grid grid-cols-4 gap-3 px-4 py-2.5 border-b border-slate-200 text-[11px] font-semibold text-slate-700">
                  <span>Karyawan</span>
                  <span>Divisi</span>
                  <span>Status</span>
                  <span className="text-right">Nominal</span>
                </div>
                {[
                  { name: 'Fahmi Ibrahim', div: 'Engineering', status: 'Disetujui', amount: 'Rp 2.500.000' },
                  { name: 'Raka Pratama', div: 'Sales Enterprise', status: 'Menunggu', amount: 'Rp 3.850.000' },
                  { name: 'Sinta Wijaya', div: 'Finance & Tax', status: 'Disetujui', amount: 'Rp 1.450.000' },
                ].map((row) =>
                  isLoadingSim ? (
                    <div key={row.name} className="grid grid-cols-4 gap-3 px-4 py-3 border-b last:border-b-0 border-slate-100 items-center animate-pulse">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-200 shrink-0" />
                        <div className="h-3.5 w-24 rounded bg-slate-200" />
                      </div>
                      <div className="h-3 w-20 rounded bg-slate-100" />
                      <div className="h-5 w-16 rounded-full bg-slate-200" />
                      <div className="h-3.5 w-20 rounded bg-slate-200 ml-auto" />
                    </div>
                  ) : (
                    <div key={row.name} className="grid grid-cols-4 gap-3 px-4 py-3 border-b last:border-b-0 border-slate-100 items-center text-xs">
                      <span className="font-semibold text-slate-900">{row.name}</span>
                      <span className="text-slate-600">{row.div}</span>
                      <div>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                            row.status === 'Disetujui' ? GRAD.success : GRAD.warning
                          }`}
                        >
                          {row.status}
                        </span>
                      </div>
                      <span className="font-semibold text-slate-900 text-right">{row.amount}</span>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alert note */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex items-center gap-3 text-xs text-slate-700">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
        <span>
          Tips UX: Gunakan Skeleton Loader saat latency API &gt; 300ms agar layout halaman tidak bergeser (*Cumulative Layout Shift*), lalu tampilkan Empty State hanya setelah respons array data dipastikan kosong.
        </span>
      </div>
    </div>
  );
}
