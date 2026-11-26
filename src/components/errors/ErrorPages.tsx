import { useState, useEffect, useMemo } from 'react';
import {
  ShieldAlert,
  ServerCrash,
  Wrench,
  Search,
  ArrowLeft,
  RefreshCw,
  Copy,
  Check,
  Home,
  Compass,
  Clock,
  Lock,
  Activity,
  Terminal,
  Send,
} from 'lucide-react';
import { showToast, showSuccess } from '../../lib/swal';

export const ERROR_ROUTES = new Set([
  'error-503',
  'error-403',
  'error-404',
  'error-500',
]);

interface ErrorPageProps {
  onNavigate: (menuId: string) => void;
}

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

const ERROR_NAV_ITEMS = [
  { id: 'error-404', label: '404 Not Found' },
  { id: 'error-403', label: '403 Forbidden' },
  { id: 'error-500', label: '500 Server Error' },
  { id: 'error-503', label: '503 Maintenance' },
];

const QUICK_ROUTES = [
  { id: 'general-dashboard', label: 'General Dashboard' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'chartjs', label: 'ChartJS' },
  { id: 'datatables', label: 'DataTables' },
  { id: 'vector-map', label: 'Vector Map' },
  { id: 'weather-icon', label: 'Weather Icon' },
  { id: 'buttons', label: 'Buttons' },
  { id: 'login', label: 'Login Page' },
];

function ErrorTopNav({
  activeId,
  onNavigate,
}: {
  activeId: string;
  onNavigate: (id: string) => void;
}) {
  return (
    <div className="w-full px-4 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-3">
      <button
        type="button"
        onClick={() => onNavigate('general-dashboard')}
        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs cursor-pointer transition-all ${GRAD.light}`}
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Kembali ke Dashboard</span>
      </button>

      <div className="flex flex-wrap items-center gap-1.5 bg-white border border-slate-200/90 rounded-2xl p-1 shadow-xs">
        {ERROR_NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavigate(item.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
              activeId === item.id ? `${GRAD.primaryStatic} shadow-xs` : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 404 NOT FOUND
// ============================================================================
export function Error404View({ onNavigate }: ErrorPageProps) {
  const [query, setQuery] = useState('');

  const filteredRoutes = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return QUICK_ROUTES;
    return QUICK_ROUTES.filter(
      (r) => r.label.toLowerCase().includes(q) || r.id.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="min-h-screen bg-[#f4f6f9] flex flex-col justify-between">
      <ErrorTopNav activeId="error-404" onNavigate={onNavigate} />

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl bg-white rounded-2xl border border-slate-200/90 shadow-sm p-8 sm:p-10 text-center space-y-6">
          <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center shadow-md ${GRAD.primaryStatic}`}>
            <Compass className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide ${GRAD.info}`}>
              HTTP 404 &bull; Route Not Found
            </span>
            <div className="text-7xl sm:text-8xl font-extrabold tracking-tight bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] bg-clip-text text-transparent leading-none">
              404
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Halaman Tidak Ditemukan
            </h1>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Halaman yang Anda cari mungkin telah dipindahkan, dihapus, atau alamat URL tidak tersedia di Velora UI.
            </p>
          </div>

          {/* Search Jump Input */}
          <div className="max-w-md mx-auto space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari modul Velora UI (mis. chartjs, calendar, login)..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
              />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {filteredRoutes.map((route) => (
                <button
                  key={route.id}
                  type="button"
                  onClick={() => onNavigate(route.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold cursor-pointer transition-all ${GRAD.light}`}
                >
                  {route.label}
                </button>
              ))}
              {filteredRoutes.length === 0 && (
                <span className="text-xs text-slate-500">Tidak ada rute modul yang cocok.</span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('general-dashboard')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-xs cursor-pointer ${GRAD.primary}`}
            >
              <Home className="w-4 h-4" />
              <span>Kembali ke Dashboard</span>
            </button>
            <button
              type="button"
              onClick={() => window.history.back()}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer ${GRAD.light}`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Halaman Sebelumnya</span>
            </button>
          </div>
        </div>
      </div>

      <footer className="py-4 text-center text-xs text-slate-500">
        Copyright &copy; 2026 &bull; Velora UI Standalone Error Pages
      </footer>
    </div>
  );
}

// ============================================================================
// 403 FORBIDDEN
// ============================================================================
export function Error403View({ onNavigate }: ErrorPageProps) {
  const [requested, setRequested] = useState(false);

  const handleRequestAccess = async () => {
    setRequested(true);
    await showSuccess(
      'Permintaan Akses Terkirim',
      'Administrator Workspace akan meninjau permintaan hak akses Anda.'
    );
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9] flex flex-col justify-between">
      <ErrorTopNav activeId="error-403" onNavigate={onNavigate} />

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-xl bg-white rounded-2xl border border-slate-200/90 shadow-sm p-8 sm:p-10 text-center space-y-6">
          <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center shadow-md ${GRAD.warning}`}>
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide ${GRAD.warning}`}>
              HTTP 403 &bull; Access Restricted
            </span>
            <div className="text-7xl sm:text-8xl font-extrabold tracking-tight bg-gradient-to-r from-[#f59e0b] to-[#d97706] bg-clip-text text-transparent leading-none">
              403
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Akses Ditolak (Forbidden)
            </h1>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Anda tidak memiliki izin peran (RBAC) yang memadai untuk membuka resource atau halaman konfigurasi ini.
            </p>
          </div>

          {/* Permission Diagnostic Card */}
          <div className="max-w-md mx-auto rounded-2xl border border-slate-200/80 bg-white p-4 grid grid-cols-2 gap-3 text-left">
            <div>
              <div className="text-[11px] text-slate-500">Peran Saat Ini</div>
              <div className="text-xs font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>Staff Viewer</span>
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-500">Izin Dibutuhkan</div>
              <div className="text-xs font-bold text-[#175cd3] mt-0.5">Super Admin / Security</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <button
              type="button"
              onClick={handleRequestAccess}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-xs cursor-pointer ${
                requested ? GRAD.success : GRAD.warning
              }`}
            >
              {requested ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
              <span>{requested ? 'Permintaan Terkirim' : 'Ajukan Akses Admin'}</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer ${GRAD.light}`}
            >
              <span>Ganti Akun Login</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('general-dashboard')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-xs cursor-pointer ${GRAD.primary}`}
            >
              <Home className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
          </div>
        </div>
      </div>

      <footer className="py-4 text-center text-xs text-slate-500">
        Copyright &copy; 2026 &bull; Velora UI Standalone Error Pages
      </footer>
    </div>
  );
}

// ============================================================================
// 500 INTERNAL SERVER ERROR
// ============================================================================
export function Error500View({ onNavigate }: ErrorPageProps) {
  const incidentId = 'ERR-VLR-50084-JKT';
  const [copied, setCopied] = useState(false);

  const copyIncident = () => {
    navigator.clipboard.writeText(incidentId);
    setCopied(true);
    showToast('Incident ID disalin ke clipboard.', 'info');
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9] flex flex-col justify-between">
      <ErrorTopNav activeId="error-500" onNavigate={onNavigate} />

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-xl bg-white rounded-2xl border border-slate-200/90 shadow-sm p-8 sm:p-10 text-center space-y-6">
          <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center shadow-md ${GRAD.danger}`}>
            <ServerCrash className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide ${GRAD.danger}`}>
              HTTP 500 &bull; Internal Server Error
            </span>
            <div className="text-7xl sm:text-8xl font-extrabold tracking-tight bg-gradient-to-r from-[#ef4444] to-[#b91c1c] bg-clip-text text-transparent leading-none">
              500
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Terjadi Gangguan pada Server
            </h1>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Permintaan Anda gagal diproses karena pengecualian tak terduga pada layanan backend. Tim teknis telah menerima laporan otomatis.
            </p>
          </div>

          {/* Technical Trace Box */}
          <div className="max-w-lg mx-auto text-left rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-4 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                <Terminal className="w-3.5 h-3.5 text-red-600" />
                <span>Incident Reference:</span>
                <code className="text-[#175cd3]">{incidentId}</code>
              </div>
              <button
                type="button"
                onClick={copyIncident}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer ${GRAD.light}`}
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Disalin' : 'Salin ID'}</span>
              </button>
            </div>
            <pre className="bg-slate-950 text-slate-200 p-4 text-[11px] font-mono overflow-x-auto leading-relaxed">
{`[GatewayException] Upstream timeout after 5000ms
  at ApiGateway.dispatch (/srv/velora/core/router.ts:142)
  Cluster: ap-southeast-1a  |  Status: Auto-Recovering`}
            </pre>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => showToast('Memeriksa ulang koneksi layanan API... Normal!', 'success')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-xs cursor-pointer ${GRAD.danger}`}
            >
              <RefreshCw className="w-4 h-4" />
              <span>Coba Muat Ulang</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('general-dashboard')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-xs cursor-pointer ${GRAD.primary}`}
            >
              <Home className="w-4 h-4" />
              <span>Kembali ke Dashboard</span>
            </button>
          </div>
        </div>
      </div>

      <footer className="py-4 text-center text-xs text-slate-500">
        Copyright &copy; 2026 &bull; Velora UI Standalone Error Pages
      </footer>
    </div>
  );
}

// ============================================================================
// 503 SERVICE UNAVAILABLE / MAINTENANCE
// ============================================================================
export function Error503View({ onNavigate }: ErrorPageProps) {
  const [secondsLeft, setSecondsLeft] = useState(45);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return undefined;
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? 45 : prev - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [paused]);

  const progressPct = 78;

  return (
    <div className="min-h-screen bg-[#f4f6f9] flex flex-col justify-between">
      <ErrorTopNav activeId="error-503" onNavigate={onNavigate} />

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-xl bg-white rounded-2xl border border-slate-200/90 shadow-sm p-8 sm:p-10 text-center space-y-6">
          <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center shadow-md ${GRAD.info}`}>
            <Wrench className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide ${GRAD.info}`}>
              HTTP 503 &bull; Scheduled Maintenance
            </span>
            <div className="text-7xl sm:text-8xl font-extrabold tracking-tight bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] bg-clip-text text-transparent leading-none">
              503
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Layanan Sedang dalam Pemeliharaan
            </h1>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Kami sedang melakukan peningkatan basis data dan sinkronisasi node untuk performa yang lebih cepat. Mohon tunggu sebentar.
            </p>
          </div>

          {/* Maintenance Progress + Auto Retry */}
          <div className="max-w-md mx-auto rounded-2xl border border-slate-200/80 bg-white p-5 space-y-4 text-left">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#0284c7]" /> Progres Pemeliharaan
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${GRAD.info}`}>{progressPct}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div className={`h-full rounded-full ${GRAD.info}`} style={{ width: `${progressPct}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
              <div className="p-2 rounded-xl border border-slate-200/80">
                <div className="font-semibold text-emerald-600">DB Schema</div>
                <div className="text-slate-600 mt-0.5">Selesai</div>
              </div>
              <div className="p-2 rounded-xl border border-slate-200/80">
                <div className="font-semibold text-[#0284c7]">Cache Sync</div>
                <div className="text-slate-600 mt-0.5">Berjalan</div>
              </div>
              <div className="p-2 rounded-xl border border-slate-200/80">
                <div className="font-semibold text-slate-700">Edge Warmup</div>
                <div className="text-slate-500 mt-0.5">Antrean</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-600 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                Pemeriksaan otomatis dalam <strong className="text-slate-900">{secondsLeft}s</strong>
              </span>
              <button
                type="button"
                onClick={() => setPaused((v) => !v)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer ${GRAD.light}`}
              >
                {paused ? 'Lanjutkan' : 'Jeda Timer'}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => {
                setSecondsLeft(45);
                showToast('Status sistem: Pemeliharaan hampir selesai (78%).', 'info');
              }}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-xs cursor-pointer ${GRAD.info}`}
            >
              <RefreshCw className="w-4 h-4" />
              <span>Cek Status Sekarang</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('general-dashboard')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-xs cursor-pointer ${GRAD.primary}`}
            >
              <Home className="w-4 h-4" />
              <span>Kembali ke Dashboard</span>
            </button>
          </div>
        </div>
      </div>

      <footer className="py-4 text-center text-xs text-slate-500">
        Copyright &copy; 2026 &bull; Velora UI Standalone Error Pages
      </footer>
    </div>
  );
}
