import { useState, useRef, useEffect } from 'react';
import {
  CheckCircle2,
  Info,
  AlertTriangle,
  XCircle,
  Bell,
  X,
  Send,
  Layers,
  RotateCcw,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';
import { showToast as swalToast } from '../../lib/swal';

type ToastType = 'success' | 'info' | 'warning' | 'error' | 'dark';
type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';
type ToastStyleVariant = 'executive' | 'gradient';

interface ActiveToast {
  id: string;
  title: string;
  message: string;
  type: ToastType;
  position: ToastPosition;
  variant: ToastStyleVariant;
  duration: number; // 0 = sticky
  showProgress: boolean;
  showClose: boolean;
  actionLabel?: string;
  createdAt: string;
}

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

const TYPE_STYLES: Record<
  ToastType,
  {
    label: string;
    grad: string;
    accentBorder: string;
    iconColor: string;
    barColor: string;
    icon: typeof CheckCircle2;
  }
> = {
  success: {
    label: 'Success',
    grad: GRAD.success,
    accentBorder: 'border-l-4 border-l-emerald-500',
    iconColor: 'text-emerald-600',
    barColor: 'bg-emerald-500',
    icon: CheckCircle2,
  },
  info: {
    label: 'Info',
    grad: GRAD.info,
    accentBorder: 'border-l-4 border-l-sky-500',
    iconColor: 'text-sky-600',
    barColor: 'bg-sky-500',
    icon: Info,
  },
  warning: {
    label: 'Warning',
    grad: GRAD.warning,
    accentBorder: 'border-l-4 border-l-amber-500',
    iconColor: 'text-amber-600',
    barColor: 'bg-amber-500',
    icon: AlertTriangle,
  },
  error: {
    label: 'Error',
    grad: GRAD.danger,
    accentBorder: 'border-l-4 border-l-rose-500',
    iconColor: 'text-rose-600',
    barColor: 'bg-rose-500',
    icon: XCircle,
  },
  dark: {
    label: 'Dark',
    grad: GRAD.dark,
    accentBorder: 'border-l-4 border-l-slate-900',
    iconColor: 'text-slate-800',
    barColor: 'bg-slate-800',
    icon: Bell,
  },
};

const POSITIONS: { id: ToastPosition; label: string; containerClass: string }[] = [
  { id: 'top-left', label: 'Top Left', containerClass: 'top-5 left-5 items-start' },
  { id: 'top-center', label: 'Top Center', containerClass: 'top-5 left-1/2 -translate-x-1/2 items-center' },
  { id: 'top-right', label: 'Top Right', containerClass: 'top-5 right-5 items-end' },
  { id: 'bottom-left', label: 'Bottom Left', containerClass: 'bottom-5 left-5 items-start' },
  { id: 'bottom-center', label: 'Bottom Center', containerClass: 'bottom-5 left-1/2 -translate-x-1/2 items-center' },
  { id: 'bottom-right', label: 'Bottom Right', containerClass: 'bottom-5 right-5 items-end' },
];

export function ToastrView() {
  const [toasts, setToasts] = useState<ActiveToast[]>([]);
  const [history, setHistory] = useState<ActiveToast[]>([]);

  // Playground config
  const [position, setPosition] = useState<ToastPosition>('top-right');
  const [variant, setVariant] = useState<ToastStyleVariant>('executive');
  const [pgType, setPgType] = useState<ToastType>('success');
  const [pgTitle, setPgTitle] = useState('Perubahan Disimpan');
  const [pgMessage, setPgMessage] = useState('Konfigurasi notifikasi Toastr berhasil diperbarui ke sistem.');
  const [pgDuration, setPgDuration] = useState<number>(3500);
  const [pgProgress, setPgProgress] = useState(true);
  const [pgCloseBtn, setPgCloseBtn] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);

  const timersRef = useRef<Record<string, number>>({});

  useEffect(() => {
    const tMap = timersRef.current;
    return () => {
      Object.values(tMap).forEach((t) => window.clearTimeout(t));
    };
  }, []);

  const dismissToast = (id: string) => {
    if (timersRef.current[id]) {
      window.clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const spawnToast = (opts: {
    title: string;
    message: string;
    type: ToastType;
    pos?: ToastPosition;
    styleVariant?: ToastStyleVariant;
    duration?: number;
    showProgress?: boolean;
    showClose?: boolean;
    actionLabel?: string;
  }) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(
      2,
      '0'
    )}:${String(now.getSeconds()).padStart(2, '0')}`;

    const duration = opts.duration !== undefined ? opts.duration : pgDuration;
    const item: ActiveToast = {
      id,
      title: opts.title,
      message: opts.message,
      type: opts.type,
      position: opts.pos || position,
      variant: opts.styleVariant || variant,
      duration,
      showProgress: opts.showProgress !== undefined ? opts.showProgress : pgProgress,
      showClose: opts.showClose !== undefined ? opts.showClose : pgCloseBtn,
      actionLabel: opts.actionLabel,
      createdAt: timeStr,
    };

    setToasts((prev) => [...prev, item]);
    setHistory((prev) => [item, ...prev].slice(0, 8));

    if (duration > 0) {
      timersRef.current[id] = window.setTimeout(() => {
        dismissToast(id);
      }, duration);
    }
  };

  const clearAllToasts = () => {
    Object.keys(timersRef.current).forEach((id) => {
      window.clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    });
    setToasts([]);
  };

  const fireBurstStack = () => {
    const burst: { type: ToastType; title: string; msg: string }[] = [
      { type: 'info', title: 'Sinkronisasi Dimulai', msg: 'Menghubungkan ke server replika...' },
      { type: 'warning', title: 'Latensi Meningkat', msg: 'Node ap-southeast-3 merespons 120ms.' },
      { type: 'success', title: 'Sinkronisasi Selesai', msg: 'Seluruh 14 tabel telah ter-update.' },
    ];
    burst.forEach((b, idx) => {
      window.setTimeout(() => {
        spawnToast({ title: b.title, message: b.msg, type: b.type });
      }, idx * 220);
    });
  };

  const snippet = `showToastr({
  type: '${pgType}',
  title: '${pgTitle}',
  message: '${pgMessage}',
  position: '${position}',
  variant: '${variant}',
  duration: ${pgDuration},
  progressBar: ${pgProgress},
});`;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Sub-header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full mt-2 shrink-0" />
          <div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Toastr Notifications</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Notifikasi toast bertumpuk real-time dengan 6 posisi sudut, gaya Executive &amp; Gradient Solid, tombol aksi Undo, serta custom playground.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={clearAllToasts}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer ${GRAD.light}`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Bersihkan Toast Aktif ({toasts.length})</span>
        </button>
      </div>

      {/* Row 1: Types + 6-Position Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-[#175cd3]">1. Variasi Tipe &amp; Gaya Toastr</h3>
              <p className="text-xs text-slate-500 mt-0.5">Pilih gaya tampilan lalu klik tombol untuk memicu notifikasi.</p>
            </div>
            <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-0.5">
              {(['executive', 'gradient'] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setVariant(v)}
                  className={`px-2.5 py-1 text-[11px] font-semibold capitalize rounded-lg cursor-pointer ${
                    variant === v ? `${GRAD.primaryStatic} shadow-xs` : 'text-slate-600'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() =>
                spawnToast({
                  title: 'Berhasil Diterbitkan!',
                  message: 'Artikel baru Anda sudah tayang di halaman utama.',
                  type: 'success',
                })
              }
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold shadow-xs cursor-pointer ${GRAD.success}`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Success
            </button>
            <button
              type="button"
              onClick={() =>
                spawnToast({
                  title: 'Informasi Sistem',
                  message: 'Terdapat 3 pembaruan konfigurasi yang siap direview.',
                  type: 'info',
                })
              }
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold shadow-xs cursor-pointer ${GRAD.info}`}
            >
              <Info className="w-3.5 h-3.5" /> Info
            </button>
            <button
              type="button"
              onClick={() =>
                spawnToast({
                  title: 'Perhatian Kuota',
                  message: 'Penggunaan API harian sudah mencapai 85% batas.',
                  type: 'warning',
                })
              }
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold shadow-xs cursor-pointer ${GRAD.warning}`}
            >
              <AlertTriangle className="w-3.5 h-3.5" /> Warning
            </button>
            <button
              type="button"
              onClick={() =>
                spawnToast({
                  title: 'Koneksi Gagal!',
                  message: 'Tidak dapat terhubung ke endpoint webhook pembayaran.',
                  type: 'error',
                })
              }
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold shadow-xs cursor-pointer ${GRAD.danger}`}
            >
              <XCircle className="w-3.5 h-3.5" /> Error
            </button>
            <button
              type="button"
              onClick={() =>
                spawnToast({
                  title: 'Mode Gelap Eksekutif',
                  message: 'Notifikasi kontras tinggi dengan aksen dark slate.',
                  type: 'dark',
                })
              }
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold shadow-xs cursor-pointer ${GRAD.dark}`}
            >
              <Bell className="w-3.5 h-3.5" /> Dark
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() =>
                spawnToast({
                  title: 'Item Dipindahkan ke Arsip',
                  message: 'Laporan-Q3.pdf berhasil diarsipkan.',
                  type: 'dark',
                  duration: 5000,
                  actionLabel: 'Undo',
                })
              }
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold shadow-xs cursor-pointer ${GRAD.primary}`}
            >
              <Sparkles className="w-3.5 h-3.5" /> Action Undo Toast
            </button>
            <button
              type="button"
              onClick={fireBurstStack}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold shadow-xs cursor-pointer ${GRAD.info}`}
            >
              <Layers className="w-3.5 h-3.5" /> Burst 3 Stacked Toasts
            </button>
          </div>
        </div>

        {/* 6 Positions Selector */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-[#175cd3]">2. Posisi Penempatan (6 Sudut Layar)</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Klik salah satu posisi untuk memindahkan posisi aktif dan langsung memunculkan preview toast.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {POSITIONS.map((p) => {
              const active = position === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setPosition(p.id);
                    spawnToast({
                      title: `Posisi: ${p.label}`,
                      message: `Toast tampil pada sudut ${p.label}.`,
                      type: 'info',
                      pos: p.id,
                    });
                  }}
                  className={`py-3 px-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                    active ? `${GRAD.primary} shadow-xs` : GRAD.light
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 2: Custom Builder & History / Snippet */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-[#175cd3]">3. Custom Toastr Playground</h3>
              <p className="text-xs text-slate-500 mt-0.5">Sesuaikan isi pesan, durasi, gaya, dan tombol tutup.</p>
            </div>
            <button
              type="button"
              onClick={() =>
                spawnToast({
                  title: pgTitle || 'Notifikasi',
                  message: pgMessage || 'Pesan notifikasi.',
                  type: pgType,
                })
              }
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold shadow-xs cursor-pointer ${GRAD.primary}`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Fire Custom Toast</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Judul</label>
              <input
                type="text"
                value={pgTitle}
                onChange={(e) => setPgTitle(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#175cd3]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tipe</label>
              <select
                value={pgType}
                onChange={(e) => setPgType(e.target.value as ToastType)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:border-[#175cd3] cursor-pointer"
              >
                <option value="success">Success</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Pesan</label>
            <input
              type="text"
              value={pgMessage}
              onChange={(e) => setPgMessage(e.target.value)}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#175cd3]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Durasi</label>
              <select
                value={pgDuration}
                onChange={(e) => setPgDuration(Number(e.target.value))}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold bg-white cursor-pointer"
              >
                <option value={2000}>2000 ms (Cepat)</option>
                <option value={3500}>3500 ms (Standar)</option>
                <option value={5000}>5000 ms (Lama)</option>
                <option value={0}>Sticky (Manual Close)</option>
              </select>
            </div>

            <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer pt-4">
              <input type="checkbox" checked={pgProgress} onChange={(e) => setPgProgress(e.target.checked)} />
              <span>Progress Bar</span>
            </label>

            <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer pt-4">
              <input type="checkbox" checked={pgCloseBtn} onChange={(e) => setPgCloseBtn(e.target.checked)} />
              <span>Close Button</span>
            </label>
          </div>
        </div>

        {/* History Log & Generated Code */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#175cd3]">4. Riwayat Toast &amp; Snippet Kode</h3>
            <button
              type="button"
              onClick={async () => {
                await navigator.clipboard.writeText(snippet);
                setCopiedCode(true);
                swalToast('Snippet Toastr disalin!', 'success');
                window.setTimeout(() => setCopiedCode(false), 1400);
              }}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer ${GRAD.primary}`}
            >
              {copiedCode ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              <span>Copy Snippet</span>
            </button>
          </div>

          <pre className="code-editor-mono bg-[#0f172a] text-slate-100 p-3.5 rounded-xl text-xs leading-5 overflow-x-auto m-0">
            {snippet}
          </pre>

          <div className="space-y-2 max-h-40 overflow-y-auto">
            {history.length === 0 ? (
              <div className="text-xs text-slate-400 text-center py-3">
                Belum ada riwayat notifikasi — klik tombol di atas untuk memicu Toastr.
              </div>
            ) : (
              history.map((h) => {
                const meta = TYPE_STYLES[h.type];
                return (
                  <div
                    key={h.id}
                    className="px-3 py-2 rounded-xl border border-slate-100 flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${meta.grad}`}>
                        {meta.label}
                      </span>
                      <span className="font-semibold text-slate-800 truncate">{h.title}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 shrink-0">{h.createdAt}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* FLOATING STACKED TOAST PORTALS BY POSITION */}
      {/* ===================================================================== */}
      {POSITIONS.map((posGroup) => {
        const items = toasts.filter((t) => t.position === posGroup.id);
        if (items.length === 0) return null;

        return (
          <div
            key={posGroup.id}
            className={`fixed z-50 flex flex-col gap-2.5 w-80 max-w-[calc(100vw-2rem)] pointer-events-none ${posGroup.containerClass}`}
          >
            {items.map((toast) => {
              const meta = TYPE_STYLES[toast.type];
              const Icon = meta.icon;
              const isGradient = toast.variant === 'gradient';

              return (
                <div
                  key={toast.id}
                  className={`pointer-events-auto w-full rounded-2xl shadow-xl overflow-hidden animate-in fade-in duration-200 ${
                    isGradient
                      ? `${meta.grad} border border-white/15`
                      : `bg-white text-slate-800 border border-slate-200/90 ${meta.accentBorder}`
                  }`}
                >
                  <div className="p-3.5 flex items-start gap-3">
                    <Icon
                      className={`w-5 h-5 shrink-0 mt-0.5 ${
                        isGradient ? 'text-white' : meta.iconColor
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-bold leading-snug">{toast.title}</p>
                        {toast.showClose && (
                          <button
                            type="button"
                            onClick={() => dismissToast(toast.id)}
                            className={`p-0.5 rounded cursor-pointer ${
                              isGradient ? 'text-white/80 hover:text-white' : 'text-slate-400 hover:text-slate-700'
                            }`}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <p
                        className={`text-[11px] mt-0.5 leading-relaxed ${
                          isGradient ? 'text-white/90' : 'text-slate-600'
                        }`}
                      >
                        {toast.message}
                      </p>

                      {toast.actionLabel && (
                        <button
                          type="button"
                          onClick={() => {
                            dismissToast(toast.id);
                            swalToast('Aksi dibatalkan (Undo)!', 'info');
                          }}
                          className={`mt-2 px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer ${
                            isGradient
                              ? 'bg-white/20 hover:bg-white/30 text-white'
                              : `${GRAD.primary}`
                          }`}
                        >
                          {toast.actionLabel}
                        </button>
                      )}
                    </div>
                  </div>

                  {toast.showProgress && toast.duration > 0 && (
                    <div className={`h-1 w-full ${isGradient ? 'bg-white/20' : 'bg-slate-100'}`}>
                      <div
                        className={`h-full ${isGradient ? 'bg-white/80' : meta.barColor} animate-pulse`}
                        style={{ width: '100%' }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
