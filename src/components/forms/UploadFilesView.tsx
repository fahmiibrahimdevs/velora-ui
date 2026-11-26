import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  UploadCloud,
  Upload,
  FileText,
  FileImage,
  FileArchive,
  File,
  CheckCircle2,
  AlertCircle,
  Trash2,
  X,
  Eye,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Camera,
  FolderOpen,
  HardDrive,
  Loader2,
  Download,
  Plus,
} from 'lucide-react';
import { showToast } from '../../lib/swal';

type FileCategory = 'image' | 'pdf' | 'archive' | 'doc' | 'other';
type UploadStatus = 'queued' | 'uploading' | 'paused' | 'completed' | 'error';

interface UploadItem {
  id: string;
  name: string;
  size: number;
  category: FileCategory;
  ext: string;
  progress: number;
  status: UploadStatus;
  speedMbps: string;
  uploadedAt: string;
  previewUrl?: string;
  errorMsg?: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function detectCategory(fileName: string): { category: FileCategory; ext: string } {
  const ext = fileName.split('.').pop()?.toLowerCase() || 'file';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) {
    return { category: 'image', ext };
  }
  if (ext === 'pdf') return { category: 'pdf', ext };
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return { category: 'archive', ext };
  if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'csv', 'txt'].includes(ext)) {
    return { category: 'doc', ext };
  }
  return { category: 'other', ext };
}

function nowTimeLabel(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')} WIB`;
}

function renderFileBadge(category: FileCategory) {
  switch (category) {
    case 'image':
      return {
        bg: 'bg-sky-50 text-sky-600 border-sky-200/70',
        icon: FileImage,
      };
    case 'pdf':
      return {
        bg: 'bg-rose-50 text-rose-600 border-rose-200/70',
        icon: FileText,
      };
    case 'archive':
      return {
        bg: 'bg-amber-50 text-amber-600 border-amber-200/70',
        icon: FileArchive,
      };
    case 'doc':
      return {
        bg: 'bg-blue-50 text-[#175cd3] border-blue-200/70',
        icon: FileText,
      };
    default:
      return {
        bg: 'bg-slate-100 text-slate-600 border-slate-200',
        icon: File,
      };
  }
}

export function UploadFilesView() {
  // =========================================================================
  // 1. SINGLE FILE UPLOAD STATE
  // =========================================================================
  const [singleFile, setSingleFile] = useState<UploadItem | null>(null);
  const [singleDragging, setSingleDragging] = useState(false);
  const singleInputRef = useRef<HTMLInputElement>(null);
  const singleTimerRef = useRef<number | null>(null);

  // =========================================================================
  // 2. COMPACT FORM & AVATAR UPLOAD STATE
  // =========================================================================
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarProgress, setAvatarProgress] = useState<number>(0);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [inlineDoc, setInlineDoc] = useState<{ name: string; size: number; progress: number; done: boolean } | null>(null);
  const inlineDocInputRef = useRef<HTMLInputElement>(null);

  // =========================================================================
  // 3. MULTIPLE FILE UPLOAD & QUEUE STATE
  // =========================================================================
  const [multiFiles, setMultiFiles] = useState<UploadItem[]>([
    {
      id: 'init-1',
      name: 'Proposal-Arsitektur-Velora-2026.pdf',
      size: 2640000,
      category: 'pdf',
      ext: 'pdf',
      progress: 100,
      status: 'completed',
      speedMbps: '3.2 MB/s',
      uploadedAt: '09:45 WIB',
    },
    {
      id: 'init-2',
      name: 'Banner-Kampanye-Q4.png',
      size: 1480000,
      category: 'image',
      ext: 'png',
      progress: 100,
      status: 'completed',
      speedMbps: '2.8 MB/s',
      uploadedAt: '09:50 WIB',
      previewUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    },
  ]);
  const [multiDragging, setMultiDragging] = useState(false);
  const [maxSizeMB, setMaxSizeMB] = useState<number>(25);
  const [acceptFilter, setAcceptFilter] = useState<'all' | 'image' | 'doc'>('all');
  const [autoStart, setAutoStart] = useState(true);
  const [previewModalItem, setPreviewModalItem] = useState<UploadItem | null>(null);

  const multiInputRef = useRef<HTMLInputElement>(null);
  const multiTimersRef = useRef<Record<string, number>>({});

  // Cleanup all intervals on unmount
  useEffect(() => {
    const timers = multiTimersRef.current;
    return () => {
      if (singleTimerRef.current) window.clearInterval(singleTimerRef.current);
      Object.values(timers).forEach((t) => window.clearInterval(t));
    };
  }, []);

  // =========================================================================
  // SINGLE FILE UPLOAD ENGINE
  // =========================================================================
  const startSingleUploadSimulation = useCallback((item: UploadItem) => {
    if (singleTimerRef.current) {
      window.clearInterval(singleTimerRef.current);
      singleTimerRef.current = null;
    }

    setSingleFile({ ...item, progress: 8, status: 'uploading' });

    singleTimerRef.current = window.setInterval(() => {
      setSingleFile((curr) => {
        if (!curr || curr.id !== item.id || curr.status !== 'uploading') return curr;
        const step = Math.floor(Math.random() * 16) + 10;
        const next = Math.min(100, curr.progress + step);
        if (next >= 100) {
          if (singleTimerRef.current) {
            window.clearInterval(singleTimerRef.current);
            singleTimerRef.current = null;
          }
          showToast(`File "${curr.name}" selesai diunggah!`, 'success');
          return { ...curr, progress: 100, status: 'completed', uploadedAt: nowTimeLabel() };
        }
        return {
          ...curr,
          progress: next,
          speedMbps: `${(1.8 + Math.random() * 2.4).toFixed(1)} MB/s`,
        };
      });
    }, 170);
  }, []);

  const handleSelectSingleFile = (file: File) => {
    if (file.size > maxSizeMB * 1024 * 1024) {
      showToast(`Ukuran file "${file.name}" melebihi batas ${maxSizeMB} MB.`, 'warning');
      return;
    }
    const { category, ext } = detectCategory(file.name);
    const previewUrl = category === 'image' ? URL.createObjectURL(file) : undefined;
    const item: UploadItem = {
      id: `single-${Date.now()}`,
      name: file.name,
      size: file.size,
      category,
      ext,
      progress: 0,
      status: 'uploading',
      speedMbps: '2.4 MB/s',
      uploadedAt: nowTimeLabel(),
      previewUrl,
    };
    startSingleUploadSimulation(item);
  };

  const handleDeleteSingleFile = () => {
    if (singleTimerRef.current) {
      window.clearInterval(singleTimerRef.current);
      singleTimerRef.current = null;
    }
    if (singleFile?.previewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(singleFile.previewUrl);
    }
    setSingleFile(null);
    if (singleInputRef.current) singleInputRef.current.value = '';
    showToast('File tunggal dihapus.', 'info');
  };

  // =========================================================================
  // AVATAR & INLINE DOC HANDLERS
  // =========================================================================
  const handleAvatarPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Avatar harus berupa file gambar.', 'warning');
      return;
    }
    const url = URL.createObjectURL(file);
    setAvatarUrl(url);
    setAvatarUploading(true);
    setAvatarProgress(15);

    const timer = window.setInterval(() => {
      setAvatarProgress((prev) => {
        const next = Math.min(100, prev + 22);
        if (next >= 100) {
          window.clearInterval(timer);
          setAvatarUploading(false);
          showToast('Foto profil berhasil diperbarui!', 'success');
        }
        return next;
      });
    }, 140);
  };

  const handleInlineDocPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setInlineDoc({ name: file.name, size: file.size, progress: 12, done: false });

    const timer = window.setInterval(() => {
      setInlineDoc((curr) => {
        if (!curr) {
          window.clearInterval(timer);
          return null;
        }
        const next = Math.min(100, curr.progress + 20);
        if (next >= 100) {
          window.clearInterval(timer);
          return { ...curr, progress: 100, done: true };
        }
        return { ...curr, progress: next };
      });
    }, 150);
  };

  // =========================================================================
  // MULTIPLE FILE UPLOAD ENGINE
  // =========================================================================
  const startMultiItemUpload = useCallback((id: string, simulateFail = false) => {
    if (multiTimersRef.current[id]) {
      window.clearInterval(multiTimersRef.current[id]);
    }

    setMultiFiles((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'uploading', errorMsg: undefined } : item
      )
    );

    const intervalId = window.setInterval(() => {
      setMultiFiles((prev) =>
        prev.map((item) => {
          if (item.id !== id || item.status !== 'uploading') return item;

          const step = Math.floor(Math.random() * 15) + 8;
          const next = Math.min(100, item.progress + step);

          if (simulateFail && next >= 55) {
            window.clearInterval(multiTimersRef.current[id]);
            delete multiTimersRef.current[id];
            return {
              ...item,
              progress: 55,
              status: 'error',
              errorMsg: 'Koneksi terputus saat mengunggah. Klik Retry.',
            };
          }

          if (next >= 100) {
            window.clearInterval(multiTimersRef.current[id]);
            delete multiTimersRef.current[id];
            return {
              ...item,
              progress: 100,
              status: 'completed',
              uploadedAt: nowTimeLabel(),
            };
          }

          return {
            ...item,
            progress: next,
            speedMbps: `${(1.5 + Math.random() * 3.1).toFixed(1)} MB/s`,
          };
        })
      );
    }, 180);

    multiTimersRef.current[id] = intervalId;
  }, []);

  const queueFiles = (fileList: FileList | File[]) => {
    const arr = Array.from(fileList);
    if (arr.length === 0) return;

    const maxBytes = maxSizeMB * 1024 * 1024;
    const validItems: UploadItem[] = [];

    arr.forEach((f, idx) => {
      const { category, ext } = detectCategory(f.name);
      if (f.size > maxBytes) {
        showToast(`"${f.name}" melebihi batas ${maxSizeMB} MB.`, 'warning');
        return;
      }
      if (acceptFilter === 'image' && category !== 'image') {
        showToast(`"${f.name}" ditolak — filter hanya menerima Gambar.`, 'warning');
        return;
      }
      if (acceptFilter === 'doc' && !['pdf', 'doc'].includes(category)) {
        showToast(`"${f.name}" ditolak — filter hanya menerima Dokumen.`, 'warning');
        return;
      }

      validItems.push({
        id: `m-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
        name: f.name,
        size: f.size,
        category,
        ext,
        progress: autoStart ? 5 : 0,
        status: autoStart ? 'uploading' : 'queued',
        speedMbps: `${(2.0 + Math.random() * 1.5).toFixed(1)} MB/s`,
        uploadedAt: nowTimeLabel(),
        previewUrl: category === 'image' ? URL.createObjectURL(f) : undefined,
      });
    });

    if (validItems.length === 0) return;

    setMultiFiles((prev) => [...validItems, ...prev]);

    if (autoStart) {
      validItems.forEach((it) => startMultiItemUpload(it.id));
      showToast(`Mengunggah ${validItems.length} berkas...`, 'info');
    } else {
      showToast(`${validItems.length} berkas masuk antrean siap upload.`, 'info');
    }
  };

  const handleSimulateBatch = (withErrorExample = false) => {
    const demoSamples: { name: string; size: number; previewUrl?: string; fail?: boolean }[] = [
      {
        name: `Laporan-Penjualan-${Math.floor(Math.random() * 90 + 10)}.pdf`,
        size: 3250000,
      },
      {
        name: `Mockup-Mobile-App-${Math.floor(Math.random() * 90 + 10)}.png`,
        size: 1940000,
        previewUrl:
          'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=600&q=80',
        fail: withErrorExample,
      },
      {
        name: `Backup-Assets-v${Math.floor(Math.random() * 9 + 1)}.zip`,
        size: 6420000,
      },
    ];

    const created: UploadItem[] = demoSamples.map((s, idx) => {
      const { category, ext } = detectCategory(s.name);
      return {
        id: `demo-${Date.now()}-${idx}`,
        name: s.name,
        size: s.size,
        category,
        ext,
        progress: autoStart ? 6 : 0,
        status: autoStart ? 'uploading' : 'queued',
        speedMbps: `${(2.1 + Math.random() * 2.0).toFixed(1)} MB/s`,
        uploadedAt: nowTimeLabel(),
        previewUrl: s.previewUrl,
      };
    });

    setMultiFiles((prev) => [...created, ...prev]);
    if (autoStart) {
      created.forEach((it, idx) => startMultiItemUpload(it.id, Boolean(demoSamples[idx].fail)));
    }
  };

  const handlePauseResume = (item: UploadItem) => {
    if (item.status === 'uploading') {
      if (multiTimersRef.current[item.id]) {
        window.clearInterval(multiTimersRef.current[item.id]);
        delete multiTimersRef.current[item.id];
      }
      setMultiFiles((prev) =>
        prev.map((f) => (f.id === item.id ? { ...f, status: 'paused' } : f))
      );
    } else if (item.status === 'paused' || item.status === 'queued') {
      startMultiItemUpload(item.id);
    }
  };

  const handleDeleteMultiFile = (id: string) => {
    if (multiTimersRef.current[id]) {
      window.clearInterval(multiTimersRef.current[id]);
      delete multiTimersRef.current[id];
    }
    const target = multiFiles.find((f) => f.id === id);
    if (target?.previewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(target.previewUrl);
    }
    setMultiFiles((prev) => prev.filter((f) => f.id !== id));
    showToast('File dihapus dari daftar.', 'info');
  };

  const handleClearAllMulti = () => {
    Object.keys(multiTimersRef.current).forEach((id) => {
      window.clearInterval(multiTimersRef.current[id]);
      delete multiTimersRef.current[id];
    });
    multiFiles.forEach((f) => {
      if (f.previewUrl?.startsWith('blob:')) URL.revokeObjectURL(f.previewUrl);
    });
    setMultiFiles([]);
    showToast('Semua daftar file dikosongkan.', 'info');
  };

  // Batch Progress Calculations
  const totalCount = multiFiles.length;
  const completedCount = multiFiles.filter((f) => f.status === 'completed').length;
  const uploadingCount = multiFiles.filter((f) => f.status === 'uploading').length;
  const pendingCount = multiFiles.filter((f) => f.status === 'queued' || f.status === 'paused').length;
  const totalSize = multiFiles.reduce((sum, f) => sum + f.size, 0);
  const overallProgress =
    totalCount === 0
      ? 0
      : Math.round(multiFiles.reduce((sum, f) => sum + f.progress, 0) / totalCount);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ========================================================================= */}
      {/* SUB-HEADER BANNER */}
      {/* ========================================================================= */}
      <div className="flex items-start gap-3">
        <div className="w-8 h-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full mt-2 shrink-0" />
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Upload Files</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Pengalaman unggah file tunggal (single) dan banyak berkas (multiple) dengan drag-and-drop, animasi progress real-time, pause/retry, pratinjau media, dan manajemen hapus berkas.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2-COLUMN MAIN WORKSPACE */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ======================================================================= */}
        {/* LEFT COLUMN (5 cols): SINGLE UPLOAD + COMPACT FORM CONTROLS */}
        {/* ======================================================================= */}
        <div className="lg:col-span-5 space-y-6">
          {/* --------------------------------------------------------------------- */}
          {/* CARD 1: SINGLE FILE UPLOAD */}
          {/* --------------------------------------------------------------------- */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-base font-bold text-[#175cd3] tracking-tight">
                  Single File Upload
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Unggah 1 berkas utama dengan animasi progress &amp; opsi ganti/hapus.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  startSingleUploadSimulation({
                    id: `single-demo-${Date.now()}`,
                    name: 'Kontrak-Kerja-Digital-2026.pdf',
                    size: 1850000,
                    category: 'pdf',
                    ext: 'pdf',
                    progress: 0,
                    status: 'uploading',
                    speedMbps: '2.6 MB/s',
                    uploadedAt: nowTimeLabel(),
                  })
                }
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-[#175cd3] text-[11px] font-semibold rounded-lg cursor-pointer transition-colors"
              >
                <Sparkles className="w-3 h-3" />
                Simulasi Upload
              </button>
            </div>

            {/* Dropzone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setSingleDragging(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setSingleDragging(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setSingleDragging(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleSelectSingleFile(e.dataTransfer.files[0]);
                }
              }}
              onClick={() => singleInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                singleDragging
                  ? 'border-[#175cd3] bg-blue-50/70 scale-[1.01]'
                  : 'border-slate-200 hover:border-[#175cd3]/70 hover:bg-slate-50/60'
              }`}
            >
              <div
                className={`w-12 h-12 mx-auto rounded-2xl flex items-center justify-center mb-3 transition-transform ${
                  singleDragging
                    ? 'bg-[#175cd3] text-white scale-110'
                    : 'bg-blue-50 text-[#175cd3]'
                }`}
              >
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-800">
                {singleDragging ? 'Lepaskan file di sini...' : 'Tarik 1 file ke sini atau klik untuk memilih'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Mendukung PDF, Gambar, Dokumen, atau ZIP (Maks {maxSizeMB} MB)
              </p>
              <input
                ref={singleInputRef}
                type="file"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleSelectSingleFile(e.target.files[0]);
                  }
                }}
                className="sr-only"
              />
            </div>

            {/* Active Single File Card with Progress Animation */}
            {singleFile && (
              <div className="mt-4 p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3 animate-in fade-in duration-200">
                <div className="flex items-start gap-3">
                  {/* Thumbnail or Icon */}
                  {singleFile.previewUrl ? (
                    <img
                      src={singleFile.previewUrl}
                      alt={singleFile.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                  ) : (
                    (() => {
                      const badge = renderFileBadge(singleFile.category);
                      const Icon = badge.icon;
                      return (
                        <div
                          className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${badge.bg}`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                      );
                    })()
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">{singleFile.name}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {formatBytes(singleFile.size)} •{' '}
                          <span className="uppercase">{singleFile.ext}</span>
                          {singleFile.status === 'uploading' && (
                            <span className="text-[#175cd3] font-semibold">
                              {' '}
                              • {singleFile.speedMbps}
                            </span>
                          )}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {singleFile.status === 'completed' && (
                          <button
                            type="button"
                            onClick={() => setPreviewModalItem(singleFile)}
                            title="Pratinjau File"
                            className="p-1.5 text-slate-500 hover:text-[#175cd3] hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={handleDeleteSingleFile}
                          title="Hapus File"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-2.5 space-y-1">
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${singleFile.progress}%` }}
                          className={`h-full rounded-full transition-all duration-200 ${
                            singleFile.status === 'completed'
                              ? 'bg-emerald-500'
                              : 'bg-[#175cd3] upload-progress-animated'
                          }`}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span
                          className={`font-semibold flex items-center gap-1 ${
                            singleFile.status === 'completed'
                              ? 'text-emerald-600'
                              : 'text-[#175cd3]'
                          }`}
                        >
                          {singleFile.status === 'completed' ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Selesai diunggah ({singleFile.uploadedAt})
                            </>
                          ) : (
                            <>
                              <Loader2 className="w-3 h-3 animate-spin" />
                              Mengunggah...
                            </>
                          )}
                        </span>
                        <span className="font-bold text-slate-700">{singleFile.progress}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* CARD 2: COMPACT FORM & AVATAR UPLOAD */}
          {/* --------------------------------------------------------------------- */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-5">
            <div>
              <h3 className="text-base font-bold text-[#175cd3] tracking-tight">
                Form Control &amp; Avatar Upload
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Varian ringkas untuk foto profil serta input file inline di dalam formulir.
              </p>
            </div>

            {/* Avatar Uploader */}
            <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-200/80 bg-white">
              <div className="relative shrink-0">
                <div
                  onClick={() => avatarInputRef.current?.click()}
                  className="w-16 h-16 rounded-full bg-blue-50 border-2 border-slate-200 overflow-hidden flex items-center justify-center cursor-pointer group relative"
                >
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-6 h-6 text-[#175cd3]" />
                  )}
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Upload className="w-4 h-4" />
                  </div>
                </div>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarPick}
                  className="sr-only"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-800">Foto Profil Pengguna</div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  PNG, JPG atau WebP (disarankan rasio 1:1).
                </p>

                {avatarUploading && (
                  <div className="mt-2 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${avatarProgress}%` }}
                      className="h-full bg-[#175cd3] upload-progress-animated transition-all duration-150"
                    />
                  </div>
                )}

                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    className="px-2.5 py-1 bg-[#175cd3] hover:bg-[#1450be] text-white text-[11px] font-semibold rounded-lg cursor-pointer transition-colors"
                  >
                    {avatarUrl ? 'Ganti Foto' : 'Pilih Foto'}
                  </button>
                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        if (avatarUrl.startsWith('blob:')) URL.revokeObjectURL(avatarUrl);
                        setAvatarUrl(null);
                        setAvatarProgress(0);
                        if (avatarInputRef.current) avatarInputRef.current.value = '';
                      }}
                      className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 text-[11px] font-semibold rounded-lg cursor-pointer transition-colors"
                    >
                      Hapus
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Classic Inline Form File Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Lampiran Dokumen (Compact Input)
              </label>
              <div className="flex items-center rounded-xl border border-slate-200 overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => inlineDocInputRef.current?.click()}
                  className="px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 border-r border-slate-200 text-xs font-semibold text-slate-700 shrink-0 cursor-pointer transition-colors flex items-center gap-1.5"
                >
                  <FolderOpen className="w-3.5 h-3.5 text-[#175cd3]" />
                  <span>Browse</span>
                </button>
                <div className="flex-1 px-3.5 py-2.5 text-xs text-slate-600 truncate">
                  {inlineDoc ? (
                    <span className="font-medium text-slate-800">
                      {inlineDoc.name} ({formatBytes(inlineDoc.size)})
                    </span>
                  ) : (
                    'Belum ada file dipilih...'
                  )}
                </div>
                {inlineDoc && (
                  <button
                    type="button"
                    onClick={() => {
                      setInlineDoc(null);
                      if (inlineDocInputRef.current) inlineDocInputRef.current.value = '';
                    }}
                    className="px-3 py-2.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                    title="Hapus pilihan"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <input
                ref={inlineDocInputRef}
                type="file"
                onChange={handleInlineDocPick}
                className="sr-only"
              />
              {inlineDoc && (
                <div className="mt-2 space-y-1">
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${inlineDoc.progress}%` }}
                      className={`h-full transition-all duration-150 ${
                        inlineDoc.done
                          ? 'bg-emerald-500'
                          : 'bg-[#175cd3] upload-progress-animated'
                      }`}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{inlineDoc.done ? 'Siap dikirim' : 'Mengunggah lampiran...'}</span>
                    <span className="font-semibold text-slate-700">{inlineDoc.progress}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* RIGHT COLUMN (7 cols): MULTIPLE FILE UPLOAD & INTERACTIVE QUEUE */}
        {/* ======================================================================= */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-5">
          {/* Card Header */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-[#175cd3] tracking-tight">
                Multiple File Upload &amp; Queue Manager
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Unggah banyak file sekaligus dengan kontrol pause/resume, retry error, pratinjau, dan hapus.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleSimulateBatch(false)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#175cd3] text-xs font-semibold rounded-xl cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Simulasi 3 File</span>
              </button>
              <button
                type="button"
                onClick={() => handleSimulateBatch(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-semibold rounded-xl cursor-pointer transition-colors"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Tes Error &amp; Retry</span>
              </button>
            </div>
          </div>

          {/* Filter & Upload Rules Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-slate-200/80 bg-white text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-slate-700">Filter:</span>
              {(
                [
                  { id: 'all', label: 'Semua' },
                  { id: 'image', label: 'Gambar' },
                  { id: 'doc', label: 'Dokumen' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setAcceptFilter(tab.id)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                    acceptFilter === tab.id
                      ? 'bg-[#175cd3] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-600 font-medium">Maks:</span>
                <select
                  value={maxSizeMB}
                  onChange={(e) => setMaxSizeMB(Number(e.target.value))}
                  className="px-2 py-1 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 bg-white focus:outline-none cursor-pointer"
                >
                  <option value={5}>5 MB</option>
                  <option value={10}>10 MB</option>
                  <option value={25}>25 MB</option>
                </select>
              </div>

              <label
                onClick={() => setAutoStart(!autoStart)}
                className="flex items-center gap-2 cursor-pointer select-none"
              >
                <div
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                    autoStart ? 'bg-[#175cd3]' : 'bg-slate-200'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white shadow-xs transform transition-transform ${
                      autoStart ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </div>
                <span className="text-slate-700 font-medium">Auto Upload</span>
              </label>
            </div>
          </div>

          {/* Multi-File Dropzone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setMultiDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setMultiDragging(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setMultiDragging(false);
              if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                queueFiles(e.dataTransfer.files);
              }
            }}
            onClick={() => multiInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-7 text-center cursor-pointer transition-all ${
              multiDragging
                ? 'border-[#175cd3] bg-blue-50/70 scale-[1.01]'
                : 'border-slate-200 hover:border-[#175cd3]/70 hover:bg-slate-50/50'
            }`}
          >
            <div
              className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-3 transition-transform ${
                multiDragging ? 'bg-[#175cd3] text-white scale-110' : 'bg-blue-50 text-[#175cd3]'
              }`}
            >
              <UploadCloud className="w-7 h-7" />
            </div>
            <p className="text-sm font-bold text-slate-800">
              {multiDragging
                ? 'Lepaskan seluruh file untuk mulai mengunggah'
                : 'Drop banyak file di sini, atau klik untuk memilih'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Anda dapat memilih beberapa berkas sekaligus • Maks {maxSizeMB} MB per berkas
            </p>
            <input
              ref={multiInputRef}
              type="file"
              multiple
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  queueFiles(e.target.files);
                  e.target.value = '';
                }
              }}
              className="sr-only"
            />
          </div>

          {/* Combined Batch Progress Summary */}
          {totalCount > 0 && (
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-slate-700 font-semibold">
                  <HardDrive className="w-4 h-4 text-[#175cd3]" />
                  <span>
                    {completedCount}/{totalCount} berkas selesai
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-500 font-normal">Total {formatBytes(totalSize)}</span>
                </div>

                <div className="flex items-center gap-2">
                  {pendingCount > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        multiFiles
                          .filter((f) => f.status === 'queued' || f.status === 'paused')
                          .forEach((f) => startMultiItemUpload(f.id));
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#175cd3] hover:bg-[#1450be] text-white text-[11px] font-semibold rounded-lg cursor-pointer"
                    >
                      <Play className="w-3 h-3" />
                      <span>Upload Antrean ({pendingCount})</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleClearAllMulti}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 text-[11px] font-semibold rounded-lg cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Hapus Semua</span>
                  </button>
                </div>
              </div>

              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  style={{ width: `${overallProgress}%` }}
                  className={`h-full rounded-full transition-all duration-200 ${
                    uploadingCount > 0
                      ? 'bg-[#175cd3] upload-progress-animated'
                      : completedCount === totalCount
                      ? 'bg-emerald-500'
                      : 'bg-amber-500'
                  }`}
                />
              </div>
            </div>
          )}

          {/* File List */}
          <div className="space-y-3 max-h-[440px] overflow-y-auto pr-0.5">
            {multiFiles.length === 0 ? (
              <div className="py-10 text-center border border-slate-100 rounded-2xl">
                <p className="text-sm font-semibold text-slate-700">Daftar file masih kosong</p>
                <p className="text-xs text-slate-500 mt-1">
                  Tarik berkas ke area di atas atau klik &ldquo;Simulasi 3 File&rdquo; untuk melihat animasi unggahan.
                </p>
              </div>
            ) : (
              multiFiles.map((item) => {
                const badge = renderFileBadge(item.category);
                const Icon = badge.icon;

                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-xl border transition-all bg-white ${
                      item.status === 'error'
                        ? 'border-rose-300 bg-rose-50/20'
                        : item.status === 'uploading'
                        ? 'border-blue-200 shadow-xs'
                        : 'border-slate-200/90 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Thumbnail / File Type Icon */}
                      {item.previewUrl ? (
                        <img
                          src={item.previewUrl}
                          alt={item.name}
                          onClick={() => setPreviewModalItem(item)}
                          className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0 cursor-pointer hover:opacity-90"
                        />
                      ) : (
                        <div
                          className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${badge.bg}`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-800 truncate">{item.name}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {formatBytes(item.size)} •{' '}
                              <span className="uppercase">{item.ext}</span>
                              {item.status === 'uploading' && (
                                <span className="text-[#175cd3] font-semibold">
                                  {' '}
                                  • {item.speedMbps}
                                </span>
                              )}
                              {item.status === 'completed' && ` • ${item.uploadedAt}`}
                            </p>
                          </div>

                          {/* Item Controls: Pause/Play, Retry, Preview, Delete */}
                          <div className="flex items-center gap-1 shrink-0">
                            {(item.status === 'uploading' ||
                              item.status === 'paused' ||
                              item.status === 'queued') && (
                              <button
                                type="button"
                                onClick={() => handlePauseResume(item)}
                                title={item.status === 'uploading' ? 'Jeda' : 'Lanjutkan'}
                                className="p-1.5 text-slate-500 hover:text-[#175cd3] hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
                              >
                                {item.status === 'uploading' ? (
                                  <Pause className="w-3.5 h-3.5" />
                                ) : (
                                  <Play className="w-3.5 h-3.5" />
                                )}
                              </button>
                            )}

                            {item.status === 'error' && (
                              <button
                                type="button"
                                onClick={() => startMultiItemUpload(item.id, false)}
                                title="Coba Lagi"
                                className="inline-flex items-center gap-1 px-2 py-1 bg-rose-100 hover:bg-rose-200 text-rose-700 text-[11px] font-semibold rounded-lg cursor-pointer transition-colors"
                              >
                                <RotateCcw className="w-3 h-3" />
                                <span>Retry</span>
                              </button>
                            )}

                            {item.status === 'completed' && (
                              <button
                                type="button"
                                onClick={() => setPreviewModalItem(item)}
                                title="Lihat Detail / Pratinjau"
                                className="p-1.5 text-slate-500 hover:text-[#175cd3] hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleDeleteMultiFile(item.id)}
                              title="Hapus File"
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Item Progress Bar */}
                        <div className="mt-2 space-y-1">
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              style={{ width: `${item.progress}%` }}
                              className={`h-full rounded-full transition-all duration-200 ${
                                item.status === 'completed'
                                  ? 'bg-emerald-500'
                                  : item.status === 'error'
                                  ? 'bg-rose-500'
                                  : item.status === 'paused' || item.status === 'queued'
                                  ? 'bg-amber-400'
                                  : 'bg-[#175cd3] upload-progress-animated'
                              }`}
                            />
                          </div>

                          <div className="flex items-center justify-between text-[11px]">
                            <span
                              className={`font-medium ${
                                item.status === 'completed'
                                  ? 'text-emerald-600'
                                  : item.status === 'error'
                                  ? 'text-rose-600'
                                  : item.status === 'paused'
                                  ? 'text-amber-600'
                                  : item.status === 'queued'
                                  ? 'text-slate-500'
                                  : 'text-[#175cd3]'
                              }`}
                            >
                              {item.status === 'completed' && 'Selesai diunggah'}
                              {item.status === 'uploading' && 'Sedang mengunggah...'}
                              {item.status === 'paused' && 'Dijeda oleh pengguna'}
                              {item.status === 'queued' && 'Menunggu dalam antrean'}
                              {item.status === 'error' && (item.errorMsg || 'Gagal mengunggah')}
                            </span>
                            <span className="font-bold text-slate-700">{item.progress}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: FILE PREVIEW & METADATA */}
      {/* ========================================================================= */}
      {previewModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#175cd3] text-[11px] font-semibold uppercase">
                  {previewModalItem.ext}
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-1.5 break-all">
                  {previewModalItem.name}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setPreviewModalItem(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {previewModalItem.previewUrl ? (
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                <img
                  src={previewModalItem.previewUrl}
                  alt={previewModalItem.name}
                  className="w-full max-h-64 object-contain mx-auto"
                />
              </div>
            ) : (
              <div className="p-8 rounded-xl border border-slate-200 flex flex-col items-center justify-center text-center">
                <FileText className="w-10 h-10 text-[#175cd3] mb-2" />
                <p className="text-xs font-semibold text-slate-700">{previewModalItem.name}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Ukuran: {formatBytes(previewModalItem.size)} • Diunggah pukul {previewModalItem.uploadedAt}
                </p>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  showToast(`Mengunduh "${previewModalItem.name}"...`, 'info');
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
              <button
                type="button"
                onClick={() => setPreviewModalItem(null)}
                className="px-4 py-2 bg-[#175cd3] hover:bg-[#1450be] text-white text-xs font-semibold rounded-xl cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
