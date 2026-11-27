import React, { useState } from 'react';
import {
  Clock,
  Copy,
  Download,
  FileArchive,
  FileSpreadsheet,
  FileText,
  Folder,
  FolderOpen,
  HardDrive,
  Image as ImageIcon,
  LayoutGrid,
  List,
  Pencil,
  Search,
  Share2,
  Star,
  Trash2,
  UploadCloud,
} from 'lucide-react';
import { showToast } from '../../lib/swal';

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
} as const;

type FileKind = 'pdf' | 'xlsx' | 'img' | 'zip';

interface DriveFileItem {
  id: string;
  name: string;
  folder: string;
  kind: FileKind;
  size: string;
  updatedAt: string;
  owner: string;
  starred: boolean;
  shared: boolean;
  trashed?: boolean;
}

const FOLDERS = [
  { id: 'Keuangan & Pajak', items: 14, size: '18.4 GB', grad: GRAD.primaryStatic },
  { id: 'Desain Aset UI', items: 29, size: '24.1 GB', grad: GRAD.info },
  { id: 'Kontrak & Legal', items: 9, size: '6.2 GB', grad: GRAD.warning },
  { id: 'Arsip Backup 2026', items: 6, size: '19.7 GB', grad: GRAD.success },
];

const INITIAL_FILES: DriveFileItem[] = [
  {
    id: 'f1',
    name: 'Laporan-Keuangan-Q4-2026.pdf',
    folder: 'Keuangan & Pajak',
    kind: 'pdf',
    size: '3.4 MB',
    updatedAt: 'Hari ini, 09:30',
    owner: 'Sinta Wijaya',
    starred: true,
    shared: true,
  },
  {
    id: 'f2',
    name: 'Rekap-Kasbon-Karyawan-Nov.xlsx',
    folder: 'Keuangan & Pajak',
    kind: 'xlsx',
    size: '1.8 MB',
    updatedAt: 'Kemarin, 16:15',
    owner: 'Fahmi Ibrahim',
    starred: false,
    shared: true,
  },
  {
    id: 'f3',
    name: 'Velora-Design-Tokens-v2.png',
    folder: 'Desain Aset UI',
    kind: 'img',
    size: '4.2 MB',
    updatedAt: '25 Nov 2026',
    owner: 'Nadia Kusuma',
    starred: true,
    shared: false,
  },
  {
    id: 'f4',
    name: 'Perjanjian-Vendor-Cloud-2026.pdf',
    folder: 'Kontrak & Legal',
    kind: 'pdf',
    size: '2.1 MB',
    updatedAt: '22 Nov 2026',
    owner: 'Bima Pratama',
    starred: false,
    shared: true,
  },
  {
    id: 'f5',
    name: 'Database-Snapshot-Production.zip',
    folder: 'Arsip Backup 2026',
    kind: 'zip',
    size: '148 MB',
    updatedAt: '20 Nov 2026',
    owner: 'System Cron',
    starred: false,
    shared: false,
  },
  {
    id: 'f6',
    name: 'Mockup-Checkout-Mobile.png',
    folder: 'Desain Aset UI',
    kind: 'img',
    size: '2.9 MB',
    updatedAt: '18 Nov 2026',
    owner: 'Nadia Kusuma',
    starred: false,
    shared: true,
  },
];

function KindBadge({ kind }: { kind: FileKind }) {
  if (kind === 'pdf') {
    return (
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${GRAD.danger}`}>
        <FileText className="w-5 h-5" />
      </div>
    );
  }
  if (kind === 'xlsx') {
    return (
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${GRAD.success}`}>
        <FileSpreadsheet className="w-5 h-5" />
      </div>
    );
  }
  if (kind === 'img') {
    return (
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${GRAD.info}`}>
        <ImageIcon className="w-5 h-5" />
      </div>
    );
  }
  return (
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${GRAD.warning}`}>
      <FileArchive className="w-5 h-5" />
    </div>
  );
}

export function FileManagerView() {
  const [files, setFiles] = useState<DriveFileItem[]>(INITIAL_FILES);
  const [selectedId, setSelectedId] = useState<string>('f1');
  const [activeNav, setActiveNav] = useState<'all' | 'starred' | 'shared' | 'trash'>('all');
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [query, setQuery] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [draftName, setDraftName] = useState('');

  const filteredFiles = files.filter((f) => {
    if (activeNav === 'trash') {
      if (!f.trashed) return false;
    } else if (f.trashed) {
      return false;
    }
    if (activeNav === 'starred' && !f.starred) return false;
    if (activeNav === 'shared' && !f.shared) return false;
    if (activeFolder && f.folder !== activeFolder) return false;
    if (query.trim() && !f.name.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const selectedFile = files.find((f) => f.id === selectedId) ?? filteredFiles[0] ?? null;

  const handleUploadPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files;
    if (!picked || picked.length === 0) return;
    const added: DriveFileItem[] = Array.from(picked).map((f, idx) => {
      const lower = f.name.toLowerCase();
      const kind: FileKind = lower.endsWith('.xlsx') || lower.endsWith('.csv')
        ? 'xlsx'
        : lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg')
          ? 'img'
          : lower.endsWith('.zip')
            ? 'zip'
            : 'pdf';
      return {
        id: `up-${Date.now()}-${idx}`,
        name: f.name,
        folder: activeFolder ?? 'Keuangan & Pajak',
        kind,
        size: `${Math.max(18, Math.round(f.size / 1024))} KB`,
        updatedAt: 'Baru saja',
        owner: 'Fahmi Ibrahim',
        starred: false,
        shared: false,
      };
    });
    setFiles((prev) => [...added, ...prev]);
    setSelectedId(added[0].id);
    showToast(`${added.length} berkas berhasil diunggah ke explorer!`, 'success');
    e.target.value = '';
  };

  const toggleStar = (id: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, starred: !f.starred } : f)),
    );
  };

  const saveRename = () => {
    if (!selectedFile || !draftName.trim()) {
      setEditingName(false);
      return;
    }
    setFiles((prev) =>
      prev.map((f) => (f.id === selectedFile.id ? { ...f, name: draftName.trim() } : f)),
    );
    setEditingName(false);
    showToast('Nama berkas diperbarui!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-8 h-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full inline-block" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              File Manager &amp; Cloud Explorer
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            Manajemen dokumen workspace lengkap dengan folder direktori, pencarian instan, rename file, dan panel inspektor.
          </p>
        </div>

        <label className={`px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs inline-flex items-center gap-2 cursor-pointer shrink-0 ${GRAD.primary}`}>
          <UploadCloud className="w-4 h-4" />
          Unggah Berkas Baru
          <input type="file" multiple onChange={handleUploadPick} className="hidden" />
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Navigation & Storage Quota */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-1.5">
            {[
              { id: 'all' as const, label: 'Semua Berkas', icon: HardDrive, count: files.filter((f) => !f.trashed).length },
              { id: 'starred' as const, label: 'Berbintang', icon: Star, count: files.filter((f) => f.starred && !f.trashed).length },
              { id: 'shared' as const, label: 'Dibagikan Tim', icon: Share2, count: files.filter((f) => f.shared && !f.trashed).length },
              { id: 'trash' as const, label: 'Kotak Sampah', icon: Trash2, count: files.filter((f) => f.trashed).length },
            ].map((nav) => {
              const Icon = nav.icon;
              const active = activeNav === nav.id && !activeFolder;
              return (
                <button
                  key={nav.id}
                  type="button"
                  onClick={() => {
                    setActiveNav(nav.id);
                    setActiveFolder(null);
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between cursor-pointer transition-all ${
                    active ? GRAD.primary : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    {nav.label}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'}`}>
                    {nav.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">Kuota Penyimpanan</span>
              <span className="font-semibold text-[#175cd3]">68%</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden flex">
              <div className="h-full bg-[#175cd3]" style={{ width: '32%' }} title="Dokumen" />
              <div className="h-full bg-[#0ea5e9]" style={{ width: '24%' }} title="Gambar" />
              <div className="h-full bg-[#22c55e]" style={{ width: '12%' }} title="Arsip" />
            </div>
            <p className="text-[11px] text-slate-600">
              <strong className="text-slate-900">68.4 GB</strong> terpakai dari total <strong className="text-slate-900">100 GB</strong>
            </p>
            <div className="grid grid-cols-3 gap-1.5 text-[10px] text-slate-700 pt-1">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#175cd3]" /> PDF</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#0ea5e9]" /> Media</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#22c55e]" /> Lainnya</span>
            </div>
          </div>
        </div>

        {/* Center: Folders + File List/Grid */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-4">
            {/* Breadcrumb & Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveFolder(null)}
                  className="font-semibold text-[#175cd3] hover:underline cursor-pointer"
                >
                  Velora Drive
                </button>
                {activeFolder && (
                  <>
                    <span className="text-slate-400">/</span>
                    <span className="font-semibold text-slate-900">{activeFolder}</span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 focus-within:border-[#1351b8]">
                  <Search className="w-3.5 h-3.5 text-slate-500" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Cari berkas..."
                    className="w-28 sm:w-36 text-xs text-slate-900 outline-none"
                  />
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg cursor-pointer ${viewMode === 'grid' ? GRAD.primary : GRAD.light}`}
                    title="Grid View"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg cursor-pointer ${viewMode === 'list' ? GRAD.primary : GRAD.light}`}
                    title="List View"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Folders Row */}
            {!activeFolder && activeNav === 'all' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {FOLDERS.map((fold) => (
                  <button
                    key={fold.id}
                    type="button"
                    onClick={() => setActiveFolder(fold.id)}
                    className="p-3 rounded-xl border border-slate-200 hover:border-[#175cd3] text-left space-y-2 transition-all cursor-pointer bg-white"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${fold.grad}`}>
                      <Folder className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-900 truncate">{fold.id}</p>
                      <p className="text-[10px] text-slate-600">{fold.items} item • {fold.size}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Files Display */}
            {filteredFiles.length === 0 ? (
              <div className="py-10 text-center space-y-2">
                <FolderOpen className="w-10 h-10 text-slate-400 mx-auto" />
                <p className="text-xs font-semibold text-slate-800">Tidak ada berkas di tampilan ini</p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredFiles.map((file) => {
                  const selected = selectedFile?.id === file.id;
                  return (
                    <div
                      key={file.id}
                      onClick={() => {
                        setSelectedId(file.id);
                        setEditingName(false);
                      }}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-2.5 ${
                        selected
                          ? 'border-[#175cd3] ring-2 ring-[#175cd3]/15'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <KindBadge kind={file.kind} />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-900 truncate">{file.name}</p>
                          <p className="text-[11px] text-slate-600 mt-0.5">{file.size} • {file.updatedAt}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStar(file.id);
                        }}
                        className="p-1 text-slate-400 hover:text-amber-500 cursor-pointer shrink-0"
                      >
                        <Star className={`w-4 h-4 ${file.starred ? 'fill-amber-400 text-amber-500' : ''}`} />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="border border-slate-200 rounded-xl divide-y divide-slate-100">
                {filteredFiles.map((file) => {
                  const selected = selectedFile?.id === file.id;
                  return (
                    <div
                      key={file.id}
                      onClick={() => {
                        setSelectedId(file.id);
                        setEditingName(false);
                      }}
                      className={`px-3.5 py-2.5 flex items-center justify-between gap-3 cursor-pointer text-xs ${
                        selected ? 'bg-blue-50/40' : 'hover:bg-slate-50/70'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <KindBadge kind={file.kind} />
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate">{file.name}</p>
                          <p className="text-[11px] text-slate-600">{file.folder} • {file.owner}</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-medium text-slate-700 shrink-0">{file.size}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Inspector Panel */}
        <div className="lg:col-span-3">
          {selectedFile ? (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">Detail Berkas</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${GRAD.light}`}>
                  {selectedFile.kind}
                </span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 flex flex-col items-center text-center gap-2.5">
                <KindBadge kind={selectedFile.kind} />
                {editingName ? (
                  <div className="w-full space-y-2">
                    <input
                      type="text"
                      value={draftName}
                      onChange={(e) => setDraftName(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#175cd3] text-xs text-slate-900 outline-none"
                    />
                    <div className="flex gap-1.5 justify-center">
                      <button
                        type="button"
                        onClick={saveRename}
                        className={`px-3 py-1 rounded-lg text-[11px] font-semibold cursor-pointer ${GRAD.primary}`}
                      >
                        Simpan
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingName(false)}
                        className={`px-3 py-1 rounded-lg text-[11px] font-semibold cursor-pointer ${GRAD.light}`}
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 max-w-full">
                    <p className="font-semibold text-slate-900 break-all">{selectedFile.name}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setDraftName(selectedFile.name);
                        setEditingName(true);
                      }}
                      className="p-1 text-slate-500 hover:text-[#175cd3] cursor-pointer shrink-0"
                      title="Ganti nama"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-2 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-600">Lokasi Folder</span>
                  <span className="font-medium text-slate-900">{selectedFile.folder}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Ukuran</span>
                  <span className="font-medium text-slate-900">{selectedFile.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Pemilik</span>
                  <span className="font-medium text-slate-900">{selectedFile.owner}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 flex items-center gap-1"><Clock className="w-3 h-3" /> Diubah</span>
                  <span className="font-medium text-slate-900">{selectedFile.updatedAt}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => showToast(`Mengunduh ${selectedFile.name}...`, 'success')}
                  className={`w-full py-2 rounded-xl font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer ${GRAD.primary}`}
                >
                  <Download className="w-3.5 h-3.5" />
                  Unduh Berkas
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => showToast('Tautan berbagi disalin!', 'info')}
                    className={`py-2 rounded-xl font-semibold inline-flex items-center justify-center gap-1 cursor-pointer ${GRAD.light}`}
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Salin Link
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFiles((prev) =>
                        prev.map((f) =>
                          f.id === selectedFile.id ? { ...f, trashed: !f.trashed } : f,
                        ),
                      );
                      showToast(
                        selectedFile.trashed ? 'Berkas dipulihkan!' : 'Berkas dipindahkan ke Sampah',
                        'warning',
                      );
                    }}
                    className={`py-2 rounded-xl font-semibold inline-flex items-center justify-center gap-1 cursor-pointer ${GRAD.danger}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {selectedFile.trashed ? 'Pulihkan' : 'Hapus'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 text-center text-xs text-slate-600">
              Pilih berkas untuk melihat rinciannya.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
