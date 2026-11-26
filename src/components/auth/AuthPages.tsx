import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ShieldCheck,
  KeyRound,
  CheckCircle2,
  Check,
  Sparkles,
  ArrowRight,
  Send,
  RefreshCw,
  LogIn,
  UserPlus,
  Globe,
} from 'lucide-react';
import { showToast, showSuccess } from '../../lib/swal';

export const AUTH_ROUTES = new Set([
  'login',
  'login-2',
  'register',
  'forgot-password',
  'reset-password',
]);

interface AuthPageProps {
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

const AUTH_NAV_ITEMS = [
  { id: 'login', label: 'Login' },
  { id: 'login-2', label: 'Login 2 (Split)' },
  { id: 'register', label: 'Register' },
  { id: 'forgot-password', label: 'Forgot Password' },
  { id: 'reset-password', label: 'Reset Password' },
];

const GoogleMark = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.7-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8Z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.2 0 6-1.1 8-3l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.2 0-5.9-2.1-6.8-5H1.2v3.1C3.2 21.3 7.3 24 12 24Z"
    />
    <path
      fill="#FBBC05"
      d="M5.2 14.2c-.2-.7-.4-1.5-.4-2.2s.1-1.5.4-2.2V6.7H1.2C.4 8.3 0 10.1 0 12s.4 3.7 1.2 5.3l4-3.1Z"
    />
    <path
      fill="#EA4335"
      d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4C18 1.2 15.2 0 12 0 7.3 0 3.2 2.7 1.2 6.7l4 3.1c.9-2.9 3.6-5 6.8-5Z"
    />
  </svg>
);

const GitHubMark = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0" aria-hidden="true">
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.17c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.69 1.25 3.34.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18.92-.26 1.9-.38 2.88-.39.98.01 1.96.13 2.88.39 2.2-1.49 3.16-1.18 3.16-1.18.63 1.59.24 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.26 5.67.42.36.79 1.07.79 2.15v3.19c0 .31.21.68.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z" />
  </svg>
);

function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (!password) {
    return { score: 0, label: 'Belum diisi', badgeGrad: GRAD.secondary, barGrad: GRAD.secondary };
  }
  if (score <= 1) {
    return { score: 1, label: 'Lemah', badgeGrad: GRAD.danger, barGrad: GRAD.danger };
  }
  if (score === 2) {
    return { score: 2, label: 'Sedang', badgeGrad: GRAD.warning, barGrad: GRAD.warning };
  }
  if (score === 3) {
    return { score: 3, label: 'Bagus', badgeGrad: GRAD.info, barGrad: GRAD.info };
  }
  return { score: 4, label: 'Sangat Kuat', badgeGrad: GRAD.success, barGrad: GRAD.success };
}

function AuthTopNav({
  activeId,
  onNavigate,
}: {
  activeId: string;
  onNavigate: (id: string) => void;
}) {
  return (
    <div className="w-full px-4 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-3 relative z-20">
      <button
        type="button"
        onClick={() => onNavigate('general-dashboard')}
        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs cursor-pointer transition-all ${GRAD.light}`}
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Kembali ke Dashboard</span>
      </button>

      <div className="flex flex-wrap items-center gap-1.5 bg-white/90 backdrop-blur-xs border border-slate-200/90 rounded-2xl p-1 shadow-xs">
        {AUTH_NAV_ITEMS.map((item) => (
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

function AuthBrandHeader({
  title,
  subtitle,
  icon,
  badgeGrad = GRAD.primaryStatic,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  badgeGrad?: string;
}) {
  return (
    <div className="text-center space-y-2.5">
      <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center shadow-md ${badgeGrad}`}>
        {icon}
      </div>
      <div>
        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#175cd3]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Velora UI Auth</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">{title}</h1>
        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{subtitle}</p>
      </div>
    </div>
  );
}

// ============================================================================
// 1. LOGIN (CLASSIC CENTERED EXECUTIVE CARD)
// ============================================================================
export function LoginView({ onNavigate }: AuthPageProps) {
  const [email, setEmail] = useState('admin@velora-ui.dev');
  const [password, setPassword] = useState('Velora@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Mohon masukkan alamat email yang valid.');
      return;
    }
    if (password.length < 6) {
      setError('Kata sandi minimal 6 karakter.');
      return;
    }
    setError('');
    await showSuccess('Login Berhasil!', `Selamat datang kembali, ${email}`);
    onNavigate('general-dashboard');
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9] flex flex-col justify-between">
      <AuthTopNav activeId="login" onNavigate={onNavigate} />

      <div className="flex-1 flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-md space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
            <AuthBrandHeader
              title="Masuk ke Akun Anda"
              subtitle="Gunakan email dan kata sandi untuk mengakses ruang kerja admin Velora UI."
              icon={<LogIn className="w-7 h-7" />}
            />

            {error && (
              <div className="p-3 rounded-xl border border-red-200 bg-red-50 text-xs font-semibold text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700" htmlFor="login-email">
                  Alamat Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@perusahaan.com"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-700" htmlFor="login-password">
                    Kata Sandi
                  </label>
                  <button
                    type="button"
                    onClick={() => onNavigate('forgot-password')}
                    className="text-xs font-semibold text-[#175cd3] hover:underline cursor-pointer"
                  >
                    Lupa Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi"
                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                    aria-label="Toggle password"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#175cd3] cursor-pointer"
                />
                <span>Ingat sesi login selama 30 hari</span>
              </label>

              <button
                type="submit"
                className={`w-full py-2.5 rounded-xl text-sm font-semibold shadow-xs cursor-pointer transition-all flex items-center justify-center gap-2 ${GRAD.primary}`}
              >
                <span>Masuk Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase">
                <span className="bg-white px-3 text-slate-500 font-semibold">Atau masuk dengan</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => showToast('Autentikasi Google OAuth (Demo) berhasil.', 'info')}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer ${GRAD.light}`}
              >
                <GoogleMark />
                <span>Google</span>
              </button>
              <button
                type="button"
                onClick={() => showToast('Autentikasi GitHub OAuth (Demo) berhasil.', 'info')}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer ${GRAD.dark}`}
              >
                <GitHubMark />
                <span>GitHub</span>
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-slate-600">
            Belum memiliki akun?{' '}
            <button
              type="button"
              onClick={() => onNavigate('register')}
              className="font-semibold text-[#175cd3] hover:underline cursor-pointer"
            >
              Daftar Akun Baru
            </button>
          </p>
        </div>
      </div>

      <footer className="py-4 text-center text-xs text-slate-500">
        Copyright &copy; 2026 &bull; Velora UI Standalone Auth
      </footer>
    </div>
  );
}

// ============================================================================
// 2. LOGIN 2 (FULL-VIEWPORT SPLIT SCREEN)
// ============================================================================
export function LoginSplitView({ onNavigate }: AuthPageProps) {
  const [email, setEmail] = useState('fahmi@velora-ui.dev');
  const [password, setPassword] = useState('Admin#2026');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast('Lengkapi email dan password terlebih dahulu.', 'warning');
      return;
    }
    await showSuccess('Login Split-Screen Berhasil', `Dialihkan ke Dashboard sebagai ${email}`);
    onNavigate('general-dashboard');
  };

  return (
    <div className="min-h-screen bg-white grid grid-cols-1 lg:grid-cols-12">
      {/* Left Form Panel */}
      <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-10 bg-white">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base shadow-xs ${GRAD.primaryStatic}`}>
              V
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">Velora UI</div>
              <div className="text-[11px] text-slate-500">Enterprise Console</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('general-dashboard')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${GRAD.light}`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
        </div>

        <div className="max-w-sm w-full mx-auto my-8 space-y-6">
          <div>
            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${GRAD.info}`}>
              Login 2 • Split Layout
            </span>
            <h1 className="text-2xl font-bold text-slate-900 mt-2">Selamat Datang Kembali</h1>
            <p className="text-xs text-slate-600 mt-1">
              Masuk untuk mengelola analitik, pengguna, dan seluruh modul dashboard Anda.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700" htmlFor="login2-email">
                Email Kerja
              </label>
              <input
                id="login2-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700" htmlFor="login2-pass">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => onNavigate('forgot-password')}
                  className="text-xs font-semibold text-[#175cd3] hover:underline cursor-pointer"
                >
                  Lupa password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="login2-pass"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-3.5 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-2.5 rounded-xl text-sm font-semibold shadow-xs cursor-pointer transition-all flex items-center justify-center gap-2 ${GRAD.primary}`}
            >
              <span>Masuk ke Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 pt-2">
            <span>Belum punya akun?</span>
            <button
              type="button"
              onClick={() => onNavigate('register')}
              className="font-semibold text-[#175cd3] hover:underline cursor-pointer"
            >
              Buat Akun Sekarang →
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 border-t border-slate-100 pt-4">
          <span>&copy; 2026 Velora UI</span>
          <div className="flex flex-wrap gap-1">
            {AUTH_NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`px-2 py-1 rounded-lg font-semibold cursor-pointer ${
                  item.id === 'login-2' ? GRAD.primaryStatic : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {item.label.replace(' (Split)', '')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Scenic Visual Hero Panel */}
      <div className="lg:col-span-7 relative overflow-hidden bg-gradient-to-br from-[#175cd3] via-[#0f3ba0] to-[#020617] text-white p-8 sm:p-12 flex flex-col justify-between min-h-[360px]">
        {/* Decorative Atmospheric Grid & Glow */}
        <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" aria-hidden="true">
          <defs>
            <pattern id="auth-grid" width="36" height="36" patternUnits="userSpaceOnUse">
              <path d="M 36 0 L 0 0 0 36" fill="none" stroke="white" strokeWidth="0.7" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#auth-grid)" />
        </svg>
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-sky-400/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-28 left-10 w-80 h-80 rounded-full bg-blue-300/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between gap-4">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold backdrop-blur-xs">
            <Globe className="w-3.5 h-3.5 text-sky-300" />
            <span>Indonesia & Global Multi-Region Ready</span>
          </span>
          <span className="text-xs text-white/75 font-mono">v2.5 LTS</span>
        </div>

        <div className="relative z-10 my-auto py-8 max-w-lg space-y-5">
          <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
            Kelola Seluruh Operasional Bisnis dalam Satu Dashboard Presisi.
          </h2>
          <p className="text-sm text-white/80 leading-relaxed">
            Dilengkapi analitik real-time, keamanan sesi berlapis, dan antarmuka modern yang dirancang untuk kecepatan tim operasional.
          </p>

          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="rounded-2xl bg-white/10 border border-white/15 p-3.5 backdrop-blur-xs">
              <div className="text-xl font-bold">99.98%</div>
              <div className="text-[11px] text-white/75 mt-0.5">System Uptime</div>
            </div>
            <div className="rounded-2xl bg-white/10 border border-white/15 p-3.5 backdrop-blur-xs">
              <div className="text-xl font-bold">256-bit</div>
              <div className="text-[11px] text-white/75 mt-0.5">TLS Encryption</div>
            </div>
            <div className="rounded-2xl bg-white/10 border border-white/15 p-3.5 backdrop-blur-xs">
              <div className="text-xl font-bold">40+</div>
              <div className="text-[11px] text-white/75 mt-0.5">UI Modules</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs text-white/75 border-t border-white/15 pt-4">
          <span>Velora Design System &bull; Jakarta, Indonesia</span>
          <span>Standalone Auth View</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 3. REGISTER (MULTI-COLUMN CARD + LIVE PASSWORD STRENGTH)
// ============================================================================
export function RegisterView({ onNavigate }: AuthPageProps) {
  const [firstName, setFirstName] = useState('Fahmi');
  const [lastName, setLastName] = useState('Ibrahim');
  const [email, setEmail] = useState('fahmi@velora-ui.dev');
  const [password, setPassword] = useState('Velora#2026');
  const [confirmPassword, setConfirmPassword] = useState('Velora#2026');
  const [country, setCountry] = useState('Indonesia');
  const [city, setCity] = useState('Jakarta Selatan');
  const [agreed, setAgreed] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !email.trim()) {
      showToast('Mohon lengkapi nama dan alamat email.', 'warning');
      return;
    }
    if (password.length < 8) {
      showToast('Kata sandi minimal 8 karakter.', 'error');
      return;
    }
    if (password !== confirmPassword) {
      showToast('Konfirmasi kata sandi tidak cocok.', 'error');
      return;
    }
    if (!agreed) {
      showToast('Anda harus menyetujui syarat & ketentuan.', 'warning');
      return;
    }
    await showSuccess('Pendaftaran Berhasil!', `Akun atas nama ${firstName} ${lastName} siap digunakan.`);
    onNavigate('login');
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9] flex flex-col justify-between">
      <AuthTopNav activeId="register" onNavigate={onNavigate} />

      <div className="flex-1 flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-xl space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
            <AuthBrandHeader
              title="Buat Akun Baru"
              subtitle="Lengkapi formulir di bawah ini untuk memulai workspace Velora UI Anda."
              icon={<UserPlus className="w-7 h-7" />}
              badgeGrad={GRAD.info}
            />

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700" htmlFor="reg-first">
                    Nama Depan
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="reg-first"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700" htmlFor="reg-last">
                    Nama Belakang
                  </label>
                  <input
                    id="reg-last"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700" htmlFor="reg-email">
                  Alamat Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="reg-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700" htmlFor="reg-pass">
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="reg-pass"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700" htmlFor="reg-confirm">
                    Konfirmasi Sandi
                  </label>
                  <input
                    id="reg-confirm"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
                  />
                </div>
              </div>

              {/* Password Strength Indicator */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">Kekuatan Kata Sandi</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${strength.badgeGrad}`}>
                    {strength.label}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`h-1.5 rounded-full transition-all ${
                        strength.score >= step ? strength.barGrad : 'bg-slate-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700" htmlFor="reg-country">
                    Negara
                  </label>
                  <select
                    id="reg-country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
                  >
                    <option value="Indonesia">Indonesia</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Malaysia">Malaysia</option>
                    <option value="Japan">Japan</option>
                    <option value="United States">United States</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700" htmlFor="reg-city">
                    Kota Domisili
                  </label>
                  <input
                    id="reg-city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
                  />
                </div>
              </div>

              <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded accent-[#175cd3] cursor-pointer"
                />
                <span>
                  Saya menyetujui <span className="font-semibold text-[#175cd3]">Syarat & Ketentuan</span> serta{' '}
                  <span className="font-semibold text-[#175cd3]">Kebijakan Privasi</span> Velora UI.
                </span>
              </label>

              <button
                type="submit"
                className={`w-full py-2.5 rounded-xl text-sm font-semibold shadow-xs cursor-pointer transition-all flex items-center justify-center gap-2 ${GRAD.primary}`}
              >
                <span>Daftar & Buat Akun</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-slate-600">
            Sudah memiliki akun?{' '}
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="font-semibold text-[#175cd3] hover:underline cursor-pointer"
            >
              Masuk di sini
            </button>
          </p>
        </div>
      </div>

      <footer className="py-4 text-center text-xs text-slate-500">
        Copyright &copy; 2026 &bull; Velora UI Standalone Auth
      </footer>
    </div>
  );
}

// ============================================================================
// 4. FORGOT PASSWORD
// ============================================================================
export function ForgotPasswordView({ onNavigate }: AuthPageProps) {
  const [email, setEmail] = useState('admin@velora-ui.dev');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      showToast('Masukkan alamat email terdaftar yang valid.', 'warning');
      return;
    }
    setSent(true);
    showToast(`Tautan reset dikirim ke ${email}`, 'success');
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9] flex flex-col justify-between">
      <AuthTopNav activeId="forgot-password" onNavigate={onNavigate} />

      <div className="flex-1 flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-md space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
            <AuthBrandHeader
              title={sent ? 'Tautan Reset Terkirim' : 'Lupa Kata Sandi?'}
              subtitle={
                sent
                  ? 'Periksa kotak masuk atau folder spam Anda untuk melanjutkan pengaturan ulang sandi.'
                  : 'Masukkan alamat email terdaftar dan kami akan mengirimkan tautan untuk mereset kata sandi Anda.'
              }
              icon={sent ? <CheckCircle2 className="w-7 h-7" /> : <KeyRound className="w-7 h-7" />}
              badgeGrad={sent ? GRAD.success : GRAD.warning}
            />

            {!sent ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700" htmlFor="forgot-email">
                    Email Terdaftar
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="forgot-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@perusahaan.com"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className={`w-full py-2.5 rounded-xl text-sm font-semibold shadow-xs cursor-pointer transition-all flex items-center justify-center gap-2 ${GRAD.primary}`}
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Tautan Pemulihan</span>
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-emerald-200 bg-white text-center space-y-1">
                  <div className="text-xs text-slate-600">Tautan aktif dikirim ke:</div>
                  <div className="text-sm font-bold text-slate-900">{email}</div>
                  <div className="text-[11px] text-slate-500">Berlaku selama 15 menit</div>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate('reset-password')}
                  className={`w-full py-2.5 rounded-xl text-sm font-semibold shadow-xs cursor-pointer transition-all flex items-center justify-center gap-2 ${GRAD.primary}`}
                >
                  <span>Simulasikan Buka Link Reset</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSent(false);
                    showToast('Silakan kirim ulang jika belum menerima email.', 'info');
                  }}
                  className={`w-full py-2.5 rounded-xl text-xs font-semibold cursor-pointer flex items-center justify-center gap-1.5 ${GRAD.light}`}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Kirim Ulang ke Email Lain</span>
                </button>
              </div>
            )}
          </div>

          <p className="text-center text-xs text-slate-600">
            Ingat kata sandi Anda?{' '}
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="font-semibold text-[#175cd3] hover:underline cursor-pointer"
            >
              Kembali ke Login
            </button>
          </p>
        </div>
      </div>

      <footer className="py-4 text-center text-xs text-slate-500">
        Copyright &copy; 2026 &bull; Velora UI Standalone Auth
      </footer>
    </div>
  );
}

// ============================================================================
// 5. RESET PASSWORD
// ============================================================================
export function ResetPasswordView({ onNavigate }: AuthPageProps) {
  const [email] = useState('admin@velora-ui.dev');
  const [newPassword, setNewPassword] = useState('NewVelora@2026');
  const [confirmPassword, setConfirmPassword] = useState('NewVelora@2026');
  const [showPass, setShowPass] = useState(false);

  const rules = useMemo(
    () => [
      { label: 'Minimal 8 karakter', ok: newPassword.length >= 8 },
      { label: 'Huruf besar & kecil', ok: /[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword) },
      { label: 'Mengandung minimal 1 angka', ok: /\d/.test(newPassword) },
      {
        label: 'Cocok dengan konfirmasi password',
        ok: Boolean(newPassword) && newPassword === confirmPassword,
      },
    ],
    [newPassword, confirmPassword]
  );

  const strength = useMemo(() => getPasswordStrength(newPassword), [newPassword]);
  const allValid = rules.every((r) => r.ok);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allValid) {
      showToast('Pastikan seluruh kriteria kata sandi baru terpenuhi.', 'warning');
      return;
    }
    await showSuccess('Kata Sandi Diperbarui!', 'Silakan masuk menggunakan kata sandi baru Anda.');
    onNavigate('login');
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9] flex flex-col justify-between">
      <AuthTopNav activeId="reset-password" onNavigate={onNavigate} />

      <div className="flex-1 flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-md space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
            <AuthBrandHeader
              title="Atur Ulang Kata Sandi"
              subtitle="Buat kata sandi baru yang kuat untuk menjaga keamanan akun administrator Anda."
              icon={<ShieldCheck className="w-7 h-7" />}
              badgeGrad={GRAD.info}
            />

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700" htmlFor="reset-email">
                  Akun Terverifikasi
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="reset-email"
                    type="email"
                    value={email}
                    readOnly
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700" htmlFor="reset-pass">
                  Kata Sandi Baru
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="reset-pass"
                    type={showPass ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700" htmlFor="reset-confirm">
                  Konfirmasi Kata Sandi Baru
                </label>
                <input
                  id="reset-confirm"
                  type={showPass ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
                />
              </div>

              {/* Strength Bar + Live Checklist */}
              <div className="p-3.5 rounded-xl border border-slate-200/80 bg-white space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Keamanan Sandi</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${strength.badgeGrad}`}>
                    {strength.label}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[1, 2, 3, 4].map((s) => (
                    <div
                      key={s}
                      className={`h-1.5 rounded-full transition-all ${
                        strength.score >= s ? strength.barGrad : 'bg-slate-100'
                      }`}
                    />
                  ))}
                </div>
                <div className="grid grid-cols-1 gap-1.5 pt-1">
                  {rules.map((r) => (
                    <div key={r.label} className="flex items-center gap-2 text-[11px]">
                      <span
                        className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                          r.ok ? GRAD.success : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        <Check className="w-2.5 h-2.5" />
                      </span>
                      <span className={r.ok ? 'text-slate-800 font-semibold' : 'text-slate-500'}>{r.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-2.5 rounded-xl text-sm font-semibold shadow-xs cursor-pointer transition-all flex items-center justify-center gap-2 ${GRAD.primary}`}
              >
                <span>Simpan Kata Sandi Baru</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-slate-600">
            Ingin membatalkan?{' '}
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="font-semibold text-[#175cd3] hover:underline cursor-pointer"
            >
              Kembali ke Login
            </button>
          </p>
        </div>
      </div>

      <footer className="py-4 text-center text-xs text-slate-500">
        Copyright &copy; 2026 &bull; Velora UI Standalone Auth
      </footer>
    </div>
  );
}
