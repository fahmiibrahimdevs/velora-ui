import React, { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  Clock,
  Command,
  Copy,
  CreditCard,
  Crown,
  Download,
  Eye,
  EyeOff,
  FileSpreadsheet,
  FileText,
  KeyRound,
  Link2,
  Lock,
  Mail,
  PanelRight,
  Plus,
  QrCode,
  RefreshCw,
  Search,
  Send,
  Share2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Trash2,
  UploadCloud,
  Users,
  X,
} from 'lucide-react';
import { showToast } from '../../lib/swal';

// =====================================================================
// VELORA UI GRADIENT TOKENS (aligned with ButtonsView)
// =====================================================================
const GRAD = {
  primary:
    'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white',
  primaryStatic: 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white',
  secondary:
    'bg-gradient-to-r from-[#cbd5e1] to-[#94a3b8] hover:from-[#94a3b8] hover:to-[#64748b] text-white',
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

type ModalId =
  | 'payment-success'
  | 'payment-checkout'
  | 'upgrade-plan'
  | 'otp-verify'
  | 'change-password'
  | 'invite-team'
  | 'share-access'
  | 'command-palette'
  | 'upload-dropzone'
  | 'export-filter'
  | 'drawer-detail'
  | 'feedback-rating'
  | 'demo'
  | 'center'
  | 'confirm'
  | 'bootstrap'
  | 'buttons'
  | 'footer-bg'
  | 'login'
  | 'footer-extra';

type AppCategory = 'all' | 'payment' | 'security' | 'workspace' | 'utility';

interface AppModalCardItem {
  id: ModalId;
  category: Exclude<AppCategory, 'all'>;
  title: string;
  desc: string;
  badge: string;
  badgeGrad: string;
  iconGrad: string;
  icon: React.ComponentType<{ className?: string }>;
  ctaLabel: string;
}

const CATEGORY_TABS: { id: AppCategory; label: string }[] = [
  { id: 'all', label: 'Semua UI (12)' },
  { id: 'payment', label: 'Payment & Billing' },
  { id: 'security', label: 'Auth & Security' },
  { id: 'workspace', label: 'Team & Sharing' },
  { id: 'utility', label: 'Productivity & Data' },
];

const APP_MODAL_CARDS: AppModalCardItem[] = [
  {
    id: 'payment-success',
    category: 'payment',
    title: 'Payment Successful Receipt',
    desc: 'Struk transaksi modern setelah checkout sukses lengkap dengan nominal, Transaction ID, metode bayar, dan unduh kwitansi.',
    badge: 'Receipt UI',
    badgeGrad: GRAD.success,
    iconGrad: GRAD.success,
    icon: CheckCircle2,
    ctaLabel: 'Lihat Struk Bayar',
  },
  {
    id: 'payment-checkout',
    category: 'payment',
    title: 'Multi-Method Checkout',
    desc: 'Modal pembayaran interaktif (Kartu Kredit, QRIS, Virtual Account) dengan kode promo & simulasi bayar langsung ke struk.',
    badge: 'Interactive Flow',
    badgeGrad: GRAD.primaryStatic,
    iconGrad: GRAD.primaryStatic,
    icon: CreditCard,
    ctaLabel: 'Buka Checkout',
  },
  {
    id: 'upgrade-plan',
    category: 'payment',
    title: 'Upgrade Paket Langganan',
    desc: 'Perbandingan paket SaaS (Pro vs Enterprise) dengan toggle tagihan Bulanan / Tahunan hemat 20%.',
    badge: 'Pricing Modal',
    badgeGrad: GRAD.warning,
    iconGrad: GRAD.warning,
    icon: Crown,
    ctaLabel: 'Pilih Paket',
  },
  {
    id: 'otp-verify',
    category: 'security',
    title: 'Verifikasi OTP & 2FA',
    desc: 'Input kode OTP 6 digit terpisah dengan auto-focus kotak berikutnya, timer kirim ulang, dan verifikasi instan.',
    badge: '2FA Security',
    badgeGrad: GRAD.info,
    iconGrad: GRAD.info,
    icon: ShieldCheck,
    ctaLabel: 'Coba Verifikasi OTP',
  },
  {
    id: 'change-password',
    category: 'security',
    title: 'Ganti Password & Strength Meter',
    desc: 'Pembaruan kata sandi aman dengan toggle lihat karakter, indikator kekuatan password real-time, dan validasi cocok.',
    badge: 'Account Security',
    badgeGrad: GRAD.dark,
    iconGrad: GRAD.dark,
    icon: KeyRound,
    ctaLabel: 'Ubah Password',
  },
  {
    id: 'invite-team',
    category: 'workspace',
    title: 'Undang Anggota Tim',
    desc: 'Tambah kolaborator via email, tetapkan role akses (Admin, Editor, Viewer), dan kelola daftar undangan aktif.',
    badge: 'Collaboration',
    badgeGrad: GRAD.primaryStatic,
    iconGrad: GRAD.primaryStatic,
    icon: Users,
    ctaLabel: 'Undang Tim',
  },
  {
    id: 'share-access',
    category: 'workspace',
    title: 'Share Link & Kontrol Akses',
    desc: 'Dialog berbagi dokumen atau workspace dengan salin tautan cepat, visibilitas link, dan daftar hak akses user.',
    badge: 'Access Control',
    badgeGrad: GRAD.info,
    iconGrad: GRAD.info,
    icon: Share2,
    ctaLabel: 'Bagikan Dokumen',
  },
  {
    id: 'command-palette',
    category: 'utility',
    title: 'Command Palette (⌘K)',
    desc: 'Pencarian cepat ala Spotlight / Linear untuk melompat ke halaman aplikasi atau menjalankan aksi dengan instan.',
    badge: 'Quick Search',
    badgeGrad: GRAD.dark,
    iconGrad: GRAD.dark,
    icon: Command,
    ctaLabel: 'Buka Palette',
  },
  {
    id: 'upload-dropzone',
    category: 'utility',
    title: 'Upload File & Antrean Dokumen',
    desc: 'Dropzone unggah berkas dengan pemilihan file nyata, status ukuran, progress bar animasi, dan hapus item.',
    badge: 'File Uploader',
    badgeGrad: GRAD.primaryStatic,
    iconGrad: GRAD.primaryStatic,
    icon: UploadCloud,
    ctaLabel: 'Unggah Berkas',
  },
  {
    id: 'export-filter',
    category: 'utility',
    title: 'Export Data & Filter Kolom',
    desc: 'Konfigurasi ekspor laporan ERP (XLSX, PDF, CSV) beserta rentang tanggal dan checklist kolom terpilih.',
    badge: 'Report Export',
    badgeGrad: GRAD.success,
    iconGrad: GRAD.success,
    icon: SlidersHorizontal,
    ctaLabel: 'Konfigurasi Export',
  },
  {
    id: 'drawer-detail',
    category: 'utility',
    title: 'Slide-Over Detail Drawer',
    desc: 'Panel geser dari sisi kanan layar untuk melihat detail transaksi, timeline aktivitas, dan status persetujuan.',
    badge: 'Right Drawer',
    badgeGrad: GRAD.info,
    iconGrad: GRAD.info,
    icon: PanelRight,
    ctaLabel: 'Buka Drawer',
  },
  {
    id: 'feedback-rating',
    category: 'utility',
    title: 'Rating & Feedback Pengguna',
    desc: 'Modal survei kepuasan (CSAT) dengan rating bintang interaktif, tag kategori masukan, dan kotak komentar.',
    badge: 'User Survey',
    badgeGrad: GRAD.warning,
    iconGrad: GRAD.warning,
    icon: Star,
    ctaLabel: 'Beri Penilaian',
  },
];

interface ModalShellProps {
  onClose: () => void;
  maxWidth?: string;
  align?: 'center' | 'top';
  children: React.ReactNode;
}

function ModalShell({
  onClose,
  maxWidth = 'max-w-lg',
  align = 'center',
  children,
}: ModalShellProps) {
  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-2xs flex justify-center p-4 overflow-y-auto animate-in fade-in duration-200 ${
        align === 'top' ? 'items-start pt-14 sm:pt-20' : 'items-center'
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-2xl ${maxWidth} w-full overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 my-auto`}
      >
        {children}
      </div>
    </div>
  );
}

const COMMAND_ITEMS = [
  { label: 'Buka Kanban Board', hint: 'Features • Workflow', hash: '#/kanban', tag: 'Navigasi' },
  { label: 'Lihat Tagihan & Invoice', hint: 'Utilities • Finance', hash: '#/invoice', tag: 'Keuangan' },
  { label: 'Kelola DataTables', hint: 'Modules • Tabel Data', hash: '#/datatables', tag: 'Data' },
  { label: 'Pengaturan Akun & Profil', hint: 'Features • Settings', hash: '#/settings', tag: 'Sistem' },
  { label: 'Buat Artikel Baru', hint: 'Features • Content', hash: '#/post-create', tag: 'Aksi' },
];

const EXPORT_COLUMNS = ['ID Transaksi', 'Nama Pelanggan', 'Metode Bayar', 'Total Nominal', 'Status', 'Tanggal'];

export function ModalView() {
  const [activeModal, setActiveModal] = useState<ModalId | null>(null);
  const [activeCategory, setActiveCategory] = useState<AppCategory>('all');

  // Classic login/footer state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginRemember, setLoginRemember] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  // Payment Checkout & Receipt state
  const [payMethod, setPayMethod] = useState<'card' | 'qris' | 'va'>('card');
  const [cardHolder, setCardHolder] = useState('Fahmi Ibrahim');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 1234');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [paidAmount, setPaidAmount] = useState('$128.00');
  const [paidTxId, setPaidTxId] = useState('TXN-94021-X');
  const [paidMethodLabel, setPaidMethodLabel] = useState('•••• 1234');

  // Upgrade Plan state
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'enterprise'>('pro');

  // OTP state
  const [otpDigits, setOtpDigits] = useState<string[]>(['4', '8', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(45);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Password state
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);

  // Invite team state
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'Admin' | 'Editor' | 'Viewer'>('Editor');
  const [teamMembers, setTeamMembers] = useState<
    { name: string; email: string; role: 'Admin' | 'Editor' | 'Viewer' }[]
  >([
    { name: 'Nadia Kusuma', email: 'nadia@velora.id', role: 'Admin' },
    { name: 'Bima Pratama', email: 'bima@velora.id', role: 'Editor' },
  ]);

  // Share access state
  const [shareScope, setShareScope] = useState<'restricted' | 'team' | 'public'>('team');

  // Command palette state
  const [cmdQuery, setCmdQuery] = useState('');

  // Upload dropzone state
  const [uploadFiles, setUploadFiles] = useState([
    { id: 'u1', name: 'Laporan-Payroll-Nov.xlsx', size: '1.8 MB', progress: 100 },
    { id: 'u2', name: 'Faktur-Pajak-2026.pdf', size: '640 KB', progress: 72 },
  ]);

  // Export state
  const [exportFormat, setExportFormat] = useState<'xlsx' | 'pdf' | 'csv'>('xlsx');
  const [exportRange, setExportRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [selectedCols, setSelectedCols] = useState<string[]>(EXPORT_COLUMNS);

  // Feedback state
  const [ratingStars, setRatingStars] = useState(5);
  const [feedbackTags, setFeedbackTags] = useState<string[]>(['Desain UI']);
  const [feedbackNote, setFeedbackNote] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (activeModal !== 'otp-verify' || otpTimer <= 0) return;
    const timer = window.setInterval(() => {
      setOtpTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [activeModal, otpTimer]);

  const closeModal = () => setActiveModal(null);

  const visibleAppCards =
    activeCategory === 'all'
      ? APP_MODAL_CARDS
      : APP_MODAL_CARDS.filter((item) => item.category === activeCategory);

  const passwordStrength = (() => {
    if (!newPass) return { pct: 0, label: 'Belum diisi', bar: 'bg-slate-200' };
    let score = 0;
    if (newPass.length >= 8) score += 1;
    if (/[A-Z]/.test(newPass)) score += 1;
    if (/[0-9]/.test(newPass)) score += 1;
    if (/[^A-Za-z0-9]/.test(newPass)) score += 1;
    if (score <= 1) return { pct: 25, label: 'Lemah', bar: 'bg-rose-500' };
    if (score === 2) return { pct: 55, label: 'Cukup', bar: 'bg-amber-500' };
    if (score === 3) return { pct: 80, label: 'Kuat', bar: 'bg-sky-500' };
    return { pct: 100, label: 'Sangat Kuat', bar: 'bg-emerald-500' };
  })();

  const checkoutTotal = promoApplied ? '$102.40' : '$128.00';

  const handleOtpChange = (index: number, value: string) => {
    const clean = value.replace(/\D/g, '').slice(-1);
    const next = [...otpDigits];
    next[index] = clean;
    setOtpDigits(next);
    if (clean && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleAddInvite = (e: React.FormEvent) => {
    e.preventDefault();
    const email = inviteEmail.trim();
    if (!email) return;
    const localName = email.split('@')[0].replace(/[._-]/g, ' ');
    const displayName = localName.replace(/\b\w/g, (c) => c.toUpperCase());
    setTeamMembers((prev) => [{ name: displayName, email, role: inviteRole }, ...prev]);
    setInviteEmail('');
    showToast(`Undangan dikirim ke ${email} sebagai ${inviteRole}`, 'success');
  };

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const added = Array.from(files).map((f, idx) => ({
      id: `up-${Date.now()}-${idx}`,
      name: f.name,
      size: `${Math.max(12, Math.round(f.size / 1024))} KB`,
      progress: 100,
    }));
    setUploadFiles((prev) => [...added, ...prev]);
    showToast(`${added.length} file ditambahkan ke antrean!`, 'success');
    e.target.value = '';
  };

  const filteredCommands = COMMAND_ITEMS.filter(
    (c) =>
      c.label.toLowerCase().includes(cmdQuery.toLowerCase()) ||
      c.hint.toLowerCase().includes(cmdQuery.toLowerCase()),
  );

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-8 h-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full inline-block" />
          <h2 className="text-base sm:text-lg font-bold text-slate-900">Modal Showcase & Application UI</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600">
          Kumpulan modal modern siap pakai untuk kebutuhan aplikasi (Payment Receipt, Checkout, 2FA OTP, Command Palette, Drawer) serta contoh standar Bootstrap Modal.
        </p>
      </div>

      {/* ======================================================== */}
      {/* SECTION 1: APPLICATION UI MODAL GALLERY */}
      {/* ======================================================== */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Application UI Modals
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Klik salah satu kartu di bawah untuk mencoba alur dan interaksi modal secara langsung.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORY_TABS.map((tab) => {
              const active = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    active ? `${GRAD.primary} shadow-xs` : GRAD.light
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {visibleAppCards.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-slate-300/90 transition-all duration-200 p-5 flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-xs shrink-0 ${item.iconGrad}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-tight ${item.badgeGrad}`}
                    >
                      {item.badge}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed mt-1">{item.desc}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-medium text-slate-500">Interactive Dialog</span>
                  <button
                    type="button"
                    onClick={() => setActiveModal(item.id)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer ${GRAD.primary}`}
                  >
                    <span>{item.ctaLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 2: CLASSIC BOOTSTRAP & STISLA MODALS */}
      {/* ======================================================== */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Classic Bootstrap &amp; Stisla Modals
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Varian dialog dasar Bootstrap untuk konfirmasi, posisi tengah/atas, dan footer kustom.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* COLUMN 1 */}
          <div className="space-y-6">
            {/* 1. Modal Template */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h4 className="text-base font-bold text-[#1351b8]">Modal Template</h4>
              </div>
              <div className="p-6">
                <div className="rounded-xl border border-slate-200/90 shadow-sm overflow-hidden bg-white max-w-md">
                  <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
                    <h5 className="text-sm font-bold text-slate-800">Modal Template</h5>
                    <button
                      type="button"
                      onClick={() => showToast('Modal template preview close icon', 'info')}
                      className="text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-5">
                    <p className="text-xs sm:text-sm text-slate-600 font-normal">
                      Modal body text goes here.
                    </p>
                  </div>
                  <div className="px-5 py-3 bg-white border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => showToast('Perubahan disimpan!', 'success')}
                      className={`px-4 py-2 text-xs font-semibold rounded-lg shadow-xs transition-all active:scale-95 cursor-pointer ${GRAD.primary}`}
                    >
                      Save changes
                    </button>
                    <button
                      type="button"
                      onClick={() => showToast('Modal ditutup', 'info')}
                      className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all active:scale-95 cursor-pointer ${GRAD.light}`}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Modal Confirm */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h4 className="text-base font-bold text-[#1351b8]">Modal Confirm</h4>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Ganti dialog konfirmasi bawaan browser dengan modal konfirmasi destruktif yang modern.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveModal('confirm')}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg shadow-xs transition-all active:scale-95 cursor-pointer ${GRAD.danger}`}
                >
                  Delete
                </button>
              </div>
            </div>

            {/* 3. The Bootstrap Way */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h4 className="text-base font-bold text-[#1351b8]">The Bootstrap Way</h4>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Dialog informatif standar dengan banner tips keyboard Escape dan backdrop click.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveModal('bootstrap')}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg shadow-xs transition-all active:scale-95 cursor-pointer ${GRAD.primary}`}
                >
                  Aw, yeah!
                </button>
              </div>
            </div>
          </div>

          {/* COLUMN 2 */}
          <div className="space-y-6">
            {/* 4. Modal Demo */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h4 className="text-base font-bold text-[#1351b8]">Modal Demo (Top Aligned)</h4>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Posisi modal rata atas (top-aligned) sesuai perilaku default Bootstrap dialog.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveModal('demo')}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg shadow-xs transition-all active:scale-95 cursor-pointer ${GRAD.primary}`}
                >
                  Launch Modal
                </button>
              </div>
            </div>

            {/* 5. Modal Center */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h4 className="text-base font-bold text-[#1351b8]">Modal Center</h4>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Posisi modal tepat di tengah viewport secara vertikal dan horizontal.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveModal('center')}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg shadow-xs transition-all active:scale-95 cursor-pointer ${GRAD.primary}`}
                >
                  Launch Modal
                </button>
              </div>
            </div>

            {/* 6. The Others */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h4 className="text-base font-bold text-[#1351b8]">The Others</h4>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Variasi tombol aksi footer, background footer gelap, form login cepat, dan opsi footer checkbox.
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveModal('buttons')}
                    className={`px-3.5 py-2 text-xs font-semibold rounded-lg shadow-xs transition-all active:scale-95 cursor-pointer ${GRAD.primary}`}
                  >
                    Buttons
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveModal('footer-bg')}
                    className={`px-3.5 py-2 text-xs font-semibold rounded-lg shadow-xs transition-all active:scale-95 cursor-pointer ${GRAD.primary}`}
                  >
                    Footer Background
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveModal('login')}
                    className={`px-3.5 py-2 text-xs font-semibold rounded-lg shadow-xs transition-all active:scale-95 cursor-pointer ${GRAD.primary}`}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveModal('footer-extra')}
                    className={`px-3.5 py-2 text-xs font-semibold rounded-lg shadow-xs transition-all active:scale-95 cursor-pointer ${GRAD.primary}`}
                  >
                    Something in the Footer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* APPLICATION UI MODAL DIALOGS */}
      {/* ======================================================== */}

      {/* A1. PAYMENT SUCCESSFUL RECEIPT MODAL (Inspired by User Upload) */}
      {activeModal === 'payment-success' && (
        <ModalShell onClose={closeModal} maxWidth="max-w-sm">
          <div className="relative p-6 sm:p-7 text-center">
            <button
              type="button"
              onClick={closeModal}
              aria-label="Tutup modal"
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Green halo & gradient checkmark */}
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md ${GRAD.success}`}>
                <Check className="w-6 h-6 stroke-[2.75]" />
              </div>
            </div>

            <h3 className="text-lg font-bold text-slate-900">Payment Successful</h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Your transaction was completed.
            </p>

            <div className="my-5 text-3xl font-extrabold tracking-tight text-slate-900">
              {paidAmount}
            </div>

            {/* Clean Receipt Breakdown */}
            <div className="border-t border-slate-100 pt-4 pb-5 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Transaction ID</span>
                <span className="font-semibold text-slate-900">{paidTxId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Date</span>
                <span className="font-medium text-slate-800">26 Nov 2026</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Payment Method</span>
                <span className="font-semibold text-slate-900 inline-flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-[#175cd3]" />
                  {paidMethodLabel}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Status</span>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${GRAD.success}`}>
                  Paid
                </span>
              </div>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={closeModal}
                className={`w-full py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all active:scale-98 cursor-pointer ${GRAD.primary}`}
              >
                Done
              </button>
              <button
                type="button"
                onClick={() => showToast(`Kwitansi ${paidTxId}.pdf sedang diunduh...`, 'info')}
                className={`w-full py-2.5 rounded-xl text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-all active:scale-98 cursor-pointer ${GRAD.light}`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Receipt</span>
              </button>
            </div>
          </div>
        </ModalShell>
      )}

      {/* A2. MULTI-METHOD PAYMENT CHECKOUT MODAL */}
      {activeModal === 'payment-checkout' && (
        <ModalShell onClose={closeModal} maxWidth="max-w-lg">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${GRAD.primaryStatic}`}>
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900">Checkout Pembayaran</h4>
                <p className="text-[11px] text-slate-500">Velora Pro Workspace • INV-2026-881</p>
              </div>
            </div>
            <button
              type="button"
              onClick={closeModal}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setPaidAmount(checkoutTotal);
              setPaidTxId(`TXN-${Math.floor(10000 + Math.random() * 89999)}-X`);
              setPaidMethodLabel(
                payMethod === 'card'
                  ? `•••• ${cardNumber.slice(-4) || '1234'}`
                  : payMethod === 'qris'
                    ? 'QRIS Instant'
                    : 'BCA Virtual Account',
              );
              setActiveModal('payment-success');
            }}
            className="p-6 space-y-4"
          >
            {/* Method Switcher */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'card' as const, label: 'Kartu Kredit', icon: CreditCard },
                { id: 'qris' as const, label: 'QRIS', icon: QrCode },
                { id: 'va' as const, label: 'Virtual Account', icon: Building2 },
              ].map((m) => {
                const MIcon = m.icon;
                const active = payMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPayMethod(m.id)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      active ? `${GRAD.primary} shadow-xs` : GRAD.light
                    }`}
                  >
                    <MIcon className="w-3.5 h-3.5" />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>

            {payMethod === 'card' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Nama Pemegang Kartu</label>
                  <input
                    type="text"
                    required
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm text-slate-800 border border-slate-200 rounded-xl outline-none focus:border-[#175cd3] focus:ring-2 focus:ring-[#175cd3]/15"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Nomor Kartu</label>
                  <div className="flex items-center border border-slate-200 rounded-xl px-3 py-2 focus-within:border-[#175cd3] focus-within:ring-2 focus-within:ring-[#175cd3]/15">
                    <CreditCard className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full text-xs sm:text-sm text-slate-800 outline-none font-mono"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Masa Berlaku</label>
                    <input
                      type="text"
                      defaultValue="09/29"
                      className="w-full px-3 py-2 text-xs sm:text-sm text-slate-800 border border-slate-200 rounded-xl outline-none focus:border-[#175cd3]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">CVC</label>
                    <input
                      type="password"
                      defaultValue="842"
                      maxLength={4}
                      className="w-full px-3 py-2 text-xs sm:text-sm text-slate-800 border border-slate-200 rounded-xl outline-none focus:border-[#175cd3]"
                    />
                  </div>
                </div>
              </div>
            )}

            {payMethod === 'qris' && (
              <div className="p-4 rounded-xl border border-slate-200 flex items-center gap-4 bg-white">
                <div className="w-20 h-20 rounded-xl border border-slate-200 flex items-center justify-center shrink-0">
                  <QrCode className="w-12 h-12 text-slate-800" />
                </div>
                <div className="space-y-1 text-xs">
                  <p className="font-bold text-slate-900">Scan QRIS Instan</p>
                  <p className="text-slate-600 leading-relaxed">
                    Mendukung BCA Mobile, Mandiri Livin, GoPay, OVO, Dana, dan ShopeePay. Verifikasi otomatis dalam hitungan detik.
                  </p>
                </div>
              </div>
            )}

            {payMethod === 'va' && (
              <div className="p-4 rounded-xl border border-slate-200 space-y-2 bg-white text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Bank Tujuan</span>
                  <span className="font-semibold text-slate-900">BCA Virtual Account</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Nomor VA</span>
                  <button
                    type="button"
                    onClick={() => showToast('Nomor VA 88010 8521 4490 disalin!', 'info')}
                    className="font-mono font-bold text-[#175cd3] inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>88010 8521 4490</span>
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            {/* Promo Code Row */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Kode promo (coba: VELORA20)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 px-3 py-2 text-xs text-slate-800 border border-slate-200 rounded-xl outline-none focus:border-[#175cd3]"
              />
              <button
                type="button"
                onClick={() => {
                  setPromoApplied(true);
                  showToast('Diskon 20% berhasil diterapkan!', 'success');
                }}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl cursor-pointer ${GRAD.light}`}
              >
                Terapkan
              </button>
            </div>

            {/* Order Total Box */}
            <div className="border-t border-slate-100 pt-3 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal Paket</span>
                <span>$128.00</span>
              </div>
              {promoApplied && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Promo Diskon (20%)</span>
                  <span>-$25.60</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-1">
                <span>Total Tagihan</span>
                <span>{checkoutTotal}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={closeModal}
                className={`px-4 py-2 text-xs font-semibold rounded-xl cursor-pointer ${GRAD.light}`}
              >
                Batal
              </button>
              <button
                type="submit"
                className={`px-5 py-2 text-xs font-semibold rounded-xl shadow-xs inline-flex items-center gap-1.5 cursor-pointer ${GRAD.success}`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Bayar {checkoutTotal}</span>
              </button>
            </div>
          </form>
        </ModalShell>
      )}

      {/* A3. UPGRADE PLAN PRICING MODAL */}
      {activeModal === 'upgrade-plan' && (
        <ModalShell onClose={closeModal} maxWidth="max-w-2xl">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-500" />
              <h4 className="text-base font-bold text-slate-900">Upgrade Paket Workspace</h4>
            </div>
            <button
              type="button"
              onClick={closeModal}
              className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Billing Switch */}
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  billingCycle === 'monthly' ? GRAD.primary : GRAD.light
                }`}
              >
                Tagihan Bulanan
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer ${
                  billingCycle === 'yearly' ? GRAD.primary : GRAD.light
                }`}
              >
                <span>Tahunan</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${GRAD.success}`}>-20%</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  id: 'pro' as const,
                  name: 'Pro Business',
                  price: billingCycle === 'yearly' ? '$29' : '$36',
                  desc: 'Untuk tim berkembang dengan modul ERP & approval lengkap.',
                  perks: ['Hingga 25 Anggota Tim', 'Kanban & Automation Unlimited', 'Export Laporan PDF & XLSX'],
                },
                {
                  id: 'enterprise' as const,
                  name: 'Enterprise Suite',
                  price: billingCycle === 'yearly' ? '$79' : '$99',
                  desc: 'Skala korporat dengan SSO, Audit Log, dan SLA khusus.',
                  perks: ['Anggota Tim Unlimited', 'Custom Role & Matrix Izin', 'Dedicated Account Support 24/7'],
                },
              ].map((plan) => {
                const chosen = selectedPlan === plan.id;
                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`rounded-2xl border p-5 cursor-pointer transition-all ${
                      chosen
                        ? 'border-[#175cd3] ring-2 ring-[#175cd3]/15 shadow-sm bg-white'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-sm font-bold text-slate-900">{plan.name}</h5>
                      {chosen && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${GRAD.primaryStatic}`}>
                          Dipilih
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-1 my-2">
                      <span className="text-2xl font-extrabold text-slate-900">{plan.price}</span>
                      <span className="text-xs text-slate-500">/bulan</span>
                    </div>
                    <p className="text-xs text-slate-600 mb-3">{plan.desc}</p>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {plan.perks.map((perk) => (
                        <li key={perk} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-end gap-2 bg-white">
            <button
              type="button"
              onClick={closeModal}
              className={`px-4 py-2 text-xs font-semibold rounded-xl cursor-pointer ${GRAD.light}`}
            >
              Nanti Saja
            </button>
            <button
              type="button"
              onClick={() => {
                setPaidAmount(
                  selectedPlan === 'pro'
                    ? billingCycle === 'yearly'
                      ? '$348.00'
                      : '$36.00'
                    : billingCycle === 'yearly'
                      ? '$948.00'
                      : '$99.00',
                );
                setPaidTxId(`SUB-${Math.floor(10000 + Math.random() * 89999)}-V`);
                setPaidMethodLabel('Auto-Debit Visa •••• 1234');
                setActiveModal('payment-success');
              }}
              className={`px-5 py-2 text-xs font-semibold rounded-xl shadow-xs cursor-pointer ${GRAD.primary}`}
            >
              Lanjut ke Pembayaran
            </button>
          </div>
        </ModalShell>
      )}

      {/* A4. OTP / 2FA VERIFICATION MODAL */}
      {activeModal === 'otp-verify' && (
        <ModalShell onClose={closeModal} maxWidth="max-w-md">
          <div className="p-6 sm:p-7 text-center space-y-4">
            <div className={`w-13 h-13 mx-auto rounded-2xl flex items-center justify-center shadow-sm ${GRAD.info}`}>
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">Verifikasi Dua Langkah (OTP)</h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Masukkan 6 digit kode verifikasi yang dikirim ke <span className="font-semibold text-slate-800">fa***@velora.id</span>.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 py-2">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    otpRefs.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className="w-10 h-11 sm:w-11 sm:h-12 text-center text-base font-bold text-slate-900 border border-slate-200 rounded-xl outline-none focus:border-[#175cd3] focus:ring-2 focus:ring-[#175cd3]/20 transition-all"
                />
              ))}
            </div>

            <div className="text-xs text-slate-600">
              {otpTimer > 0 ? (
                <span>
                  Kirim ulang kode dalam <span className="font-semibold text-[#175cd3]">{otpTimer}d</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setOtpTimer(45);
                    showToast('Kode OTP baru telah dikirim!', 'info');
                  }}
                  className="text-[#175cd3] font-semibold inline-flex items-center gap-1 cursor-pointer hover:underline"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Kirim Ulang Kode</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={closeModal}
                className={`flex-1 py-2.5 text-xs font-semibold rounded-xl cursor-pointer ${GRAD.light}`}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  const code = otpDigits.join('');
                  if (code.length < 6) {
                    showToast('Mohon lengkapi seluruh 6 digit OTP', 'warning');
                    return;
                  }
                  showToast(`Kode OTP ${code} berhasil diverifikasi!`, 'success');
                  closeModal();
                }}
                className={`flex-1 py-2.5 text-xs font-semibold rounded-xl shadow-xs cursor-pointer ${GRAD.primary}`}
              >
                Verifikasi Sekarang
              </button>
            </div>
          </div>
        </ModalShell>
      )}

      {/* A5. CHANGE PASSWORD & STRENGTH METER */}
      {activeModal === 'change-password' && (
        <ModalShell onClose={closeModal} maxWidth="max-w-md">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[#175cd3]" />
              <h4 className="text-base font-bold text-slate-900">Ubah Kata Sandi</h4>
            </div>
            <button type="button" onClick={closeModal} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (newPass !== confirmPass) {
                showToast('Konfirmasi password tidak cocok!', 'warning');
                return;
              }
              showToast('Kata sandi akun berhasil diperbarui!', 'success');
              setOldPass('');
              setNewPass('');
              setConfirmPass('');
              closeModal();
            }}
            className="p-6 space-y-4"
          >
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Password Saat Ini</label>
              <input
                type={showPass ? 'text' : 'password'}
                required
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl outline-none focus:border-[#175cd3]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-700">Password Baru</label>
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="text-[11px] font-medium text-[#175cd3] inline-flex items-center gap-1 cursor-pointer"
                >
                  {showPass ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showPass ? 'Sembunyikan' : 'Tampilkan'}</span>
                </button>
              </div>
              <input
                type={showPass ? 'text' : 'password'}
                required
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="Minimal 8 karakter kombinasi"
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl outline-none focus:border-[#175cd3]"
              />
              <div className="mt-2 space-y-1">
                <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${passwordStrength.bar}`}
                    style={{ width: `${passwordStrength.pct}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-600">
                  Kekuatan: <span className="font-semibold text-slate-800">{passwordStrength.label}</span>
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Konfirmasi Password Baru</label>
              <input
                type={showPass ? 'text' : 'password'}
                required
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="Ulangi password baru"
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl outline-none focus:border-[#175cd3]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button type="button" onClick={closeModal} className={`px-4 py-2 text-xs font-semibold rounded-xl cursor-pointer ${GRAD.light}`}>
                Batal
              </button>
              <button type="submit" className={`px-4 py-2 text-xs font-semibold rounded-xl cursor-pointer ${GRAD.primary}`}>
                Simpan Password
              </button>
            </div>
          </form>
        </ModalShell>
      )}

      {/* A6. INVITE TEAM MEMBERS MODAL */}
      {activeModal === 'invite-team' && (
        <ModalShell onClose={closeModal} maxWidth="max-w-lg">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#175cd3]" />
              <h4 className="text-base font-bold text-slate-900">Undang Anggota Tim</h4>
            </div>
            <button type="button" onClick={closeModal} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            <form onSubmit={handleAddInvite} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="nama@perusahaan.co.id"
                className="flex-1 px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl outline-none focus:border-[#175cd3]"
              />
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as 'Admin' | 'Editor' | 'Viewer')}
                className="px-3 py-2 text-xs font-medium text-slate-800 border border-slate-200 rounded-xl bg-white outline-none"
              >
                <option value="Admin">Admin</option>
                <option value="Editor">Editor</option>
                <option value="Viewer">Viewer</option>
              </select>
              <button type="submit" className={`px-4 py-2 text-xs font-semibold rounded-xl inline-flex items-center justify-center gap-1 cursor-pointer ${GRAD.primary}`}>
                <Send className="w-3.5 h-3.5" />
                <span>Undang</span>
              </button>
            </form>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-700">Anggota &amp; Undangan Aktif ({teamMembers.length})</p>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {teamMembers.map((m) => (
                  <div key={m.email} className="px-4 py-3 flex items-center justify-between gap-3 bg-white">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${GRAD.primaryStatic}`}>
                        {m.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-900 truncate">{m.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{m.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${m.role === 'Admin' ? GRAD.warning : GRAD.info}`}>
                        {m.role}
                      </span>
                      <button
                        type="button"
                        onClick={() => setTeamMembers((prev) => prev.filter((item) => item.email !== m.email))}
                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                        title="Hapus anggota"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="px-6 py-3.5 border-t border-slate-100 flex justify-end">
            <button type="button" onClick={closeModal} className={`px-4 py-2 text-xs font-semibold rounded-xl cursor-pointer ${GRAD.light}`}>
              Selesai
            </button>
          </div>
        </ModalShell>
      )}

      {/* A7. SHARE LINK & ACCESS PERMISSIONS MODAL */}
      {activeModal === 'share-access' && (
        <ModalShell onClose={closeModal} maxWidth="max-w-md">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-[#0284c7]" />
              <h4 className="text-base font-bold text-slate-900">Bagikan Proyek</h4>
            </div>
            <button type="button" onClick={closeModal} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Tautan Berbagi</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2 text-xs text-slate-700 border border-slate-200 rounded-xl flex items-center gap-2 overflow-hidden">
                  <Link2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate font-mono">https://velora.ui/workspace/q4-roadmap</span>
                </div>
                <button
                  type="button"
                  onClick={() => showToast('Link workspace disalin ke clipboard!', 'success')}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-xl inline-flex items-center gap-1 cursor-pointer ${GRAD.primary}`}
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700">Siapa yang dapat mengakses</label>
              {[
                { id: 'restricted' as const, title: 'Terbatas', sub: 'Hanya pengguna yang diundang secara manual' },
                { id: 'team' as const, title: 'Seluruh Tim Velora', sub: 'Semua anggota workspace dapat melihat' },
                { id: 'public' as const, title: 'Publik (Read-Only)', sub: 'Siapa saja dengan tautan dapat membaca' },
              ].map((opt) => (
                <label
                  key={opt.id}
                  onClick={() => setShareScope(opt.id)}
                  className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                    shareScope === opt.id ? 'border-[#175cd3] ring-1 ring-[#175cd3]/20' : 'border-slate-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="shareScope"
                    checked={shareScope === opt.id}
                    onChange={() => setShareScope(opt.id)}
                    className="mt-0.5 text-[#175cd3]"
                  />
                  <div>
                    <p className="text-xs font-semibold text-slate-900">{opt.title}</p>
                    <p className="text-[11px] text-slate-600">{opt.sub}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="px-6 py-3.5 border-t border-slate-100 flex justify-end gap-2">
            <button type="button" onClick={closeModal} className={`px-4 py-2 text-xs font-semibold rounded-xl cursor-pointer ${GRAD.light}`}>
              Tutup
            </button>
            <button
              type="button"
              onClick={() => {
                showToast('Pengaturan akses dibagikan disimpan!', 'success');
                closeModal();
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-xl cursor-pointer ${GRAD.info}`}
            >
              Simpan Akses
            </button>
          </div>
        </ModalShell>
      )}

      {/* A8. COMMAND PALETTE MODAL */}
      {activeModal === 'command-palette' && (
        <ModalShell onClose={closeModal} maxWidth="max-w-lg" align="top">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2.5">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              autoFocus
              value={cmdQuery}
              onChange={(e) => setCmdQuery(e.target.value)}
              placeholder="Ketik perintah atau halaman (mis. Kanban, Invoice, DataTables)..."
              className="flex-1 text-xs sm:text-sm text-slate-900 outline-none"
            />
            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600">
              ESC
            </span>
          </div>

          <div className="p-2 max-h-72 overflow-y-auto divide-y divide-slate-50">
            {filteredCommands.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">Tidak ada perintah yang cocok.</p>
            ) : (
              filteredCommands.map((cmd) => (
                <button
                  key={cmd.label}
                  type="button"
                  onClick={() => {
                    window.location.hash = cmd.hash;
                    showToast(`Membuka ${cmd.label}`, 'info');
                    closeModal();
                  }}
                  className="w-full px-3 py-2.5 rounded-xl hover:bg-slate-100/80 flex items-center justify-between gap-3 text-left transition-colors cursor-pointer"
                >
                  <div>
                    <p className="text-xs font-semibold text-slate-900">{cmd.label}</p>
                    <p className="text-[11px] text-slate-500">{cmd.hint}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${GRAD.primaryStatic}`}>
                    {cmd.tag}
                  </span>
                </button>
              ))
            )}
          </div>
        </ModalShell>
      )}

      {/* A9. FILE UPLOAD & DROPZONE MODAL */}
      {activeModal === 'upload-dropzone' && (
        <ModalShell onClose={closeModal} maxWidth="max-w-lg">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-[#175cd3]" />
              <h4 className="text-base font-bold text-slate-900">Unggah Dokumen</h4>
            </div>
            <button type="button" onClick={closeModal} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <label className="border-2 border-dashed border-slate-200 hover:border-[#175cd3] rounded-2xl p-6 text-center block cursor-pointer transition-colors">
              <input type="file" multiple className="hidden" onChange={handleFilePick} />
              <div className={`w-11 h-11 mx-auto rounded-xl flex items-center justify-center mb-2.5 ${GRAD.primaryStatic}`}>
                <Plus className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-900">
                Klik untuk memilih file dari perangkat
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Mendukung PDF, XLSX, DOCX, PNG hingga 25 MB per file
              </p>
            </label>

            <div className="space-y-2.5">
              {uploadFiles.map((file) => (
                <div key={file.id} className="p-3 rounded-xl border border-slate-200 space-y-1.5 bg-white">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-[#175cd3] shrink-0" />
                      <span className="font-semibold text-slate-900 truncate">{file.name}</span>
                      <span className="text-slate-500 shrink-0">({file.size})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setUploadFiles((prev) => prev.filter((f) => f.id !== file.id))}
                      className="text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${file.progress === 100 ? GRAD.success : GRAD.primaryStatic}`}
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-6 py-3.5 border-t border-slate-100 flex justify-end gap-2">
            <button type="button" onClick={closeModal} className={`px-4 py-2 text-xs font-semibold rounded-xl cursor-pointer ${GRAD.light}`}>
              Batal
            </button>
            <button
              type="button"
              onClick={() => {
                showToast(`${uploadFiles.length} dokumen berhasil diunggah!`, 'success');
                closeModal();
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-xl cursor-pointer ${GRAD.primary}`}
            >
              Simpan Lampiran
            </button>
          </div>
        </ModalShell>
      )}

      {/* A10. EXPORT DATA & FILTER MODAL */}
      {activeModal === 'export-filter' && (
        <ModalShell onClose={closeModal} maxWidth="max-w-md">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <h4 className="text-base font-bold text-slate-900">Export Laporan Data</h4>
            </div>
            <button type="button" onClick={closeModal} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Format Berkas</label>
              <div className="grid grid-cols-3 gap-2">
                {(['xlsx', 'pdf', 'csv'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setExportFormat(fmt)}
                    className={`py-2 rounded-xl text-xs font-semibold uppercase cursor-pointer ${
                      exportFormat === fmt ? GRAD.success : GRAD.light
                    }`}
                  >
                    .{fmt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Rentang Periode</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: '7d' as const, label: '7 Hari' },
                  { id: '30d' as const, label: '30 Hari' },
                  { id: '90d' as const, label: 'Kuartal' },
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setExportRange(r.id)}
                    className={`py-2 rounded-xl text-xs font-semibold cursor-pointer ${
                      exportRange === r.id ? GRAD.primary : GRAD.light
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-700">Kolom Disertakan</label>
                <button
                  type="button"
                  onClick={() => setSelectedCols(selectedCols.length === EXPORT_COLUMNS.length ? [] : EXPORT_COLUMNS)}
                  className="text-[11px] font-semibold text-[#175cd3] cursor-pointer"
                >
                  {selectedCols.length === EXPORT_COLUMNS.length ? 'Hapus Semua' : 'Pilih Semua'}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {EXPORT_COLUMNS.map((col) => {
                  const checked = selectedCols.includes(col);
                  return (
                    <label key={col} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          setSelectedCols((prev) =>
                            checked ? prev.filter((c) => c !== col) : [...prev, col],
                          )
                        }
                        className="rounded-sm text-[#175cd3]"
                      />
                      <span>{col}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="px-6 py-3.5 border-t border-slate-100 flex justify-end gap-2">
            <button type="button" onClick={closeModal} className={`px-4 py-2 text-xs font-semibold rounded-xl cursor-pointer ${GRAD.light}`}>
              Batal
            </button>
            <button
              type="button"
              onClick={() => {
                showToast(`Mengunduh laporan.${exportFormat} (${selectedCols.length} kolom)...`, 'success');
                closeModal();
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 cursor-pointer ${GRAD.success}`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Sekarang</span>
            </button>
          </div>
        </ModalShell>
      )}

      {/* A11. SLIDE-OVER RIGHT DETAIL DRAWER */}
      {activeModal === 'drawer-detail' && (
        <div
          onClick={closeModal}
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-2xs flex justify-end animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white h-full max-w-md w-full shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200"
          >
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${GRAD.primaryStatic}`}>
                    ORD-9024
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${GRAD.success}`}>
                    Selesai
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 mt-1">Detail Transaksi Enterprise</h4>
              </div>
              <button type="button" onClick={closeModal} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto space-y-5 text-xs">
              <div className="p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Pelanggan</span>
                  <span className="font-semibold text-slate-900">PT Nusantara Digital</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nilai Kontrak</span>
                  <span className="font-bold text-slate-900">$1,280.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Penanggung Jawab</span>
                  <span className="font-medium text-slate-800">Fahmi Ibrahim</span>
                </div>
              </div>

              <div className="space-y-3">
                <p className="font-bold text-slate-900">Riwayat Aktivitas</p>
                {[
                  { time: 'Hari ini, 14:20', title: 'Pembayaran diterima via Visa •••• 1234', badge: GRAD.success },
                  { time: 'Hari ini, 11:05', title: 'Invoice resmi diterbitkan ke email finance', badge: GRAD.info },
                  { time: 'Kemarin, 16:40', title: 'Penawaran paket disetujui oleh Direktur', badge: GRAD.primaryStatic },
                ].map((act) => (
                  <div key={act.time} className="flex items-start gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${act.badge}`} />
                    <div>
                      <p className="font-semibold text-slate-900">{act.title}</p>
                      <p className="text-[11px] text-slate-500 inline-flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {act.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveModal('payment-success')}
                className={`px-4 py-2 text-xs font-semibold rounded-xl cursor-pointer ${GRAD.primary}`}
              >
                Lihat Struk
              </button>
              <button type="button" onClick={closeModal} className={`px-4 py-2 text-xs font-semibold rounded-xl cursor-pointer ${GRAD.light}`}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* A12. FEEDBACK & RATING MODAL */}
      {activeModal === 'feedback-rating' && (
        <ModalShell onClose={closeModal} maxWidth="max-w-md">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h4 className="text-base font-bold text-slate-900">Bagaimana Pengalaman Anda?</h4>
            <button type="button" onClick={closeModal} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-center justify-center gap-2 py-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRatingStars(star)}
                  className="p-1.5 rounded-xl hover:bg-amber-50 transition-transform active:scale-90 cursor-pointer"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= ratingStars ? 'text-amber-500 fill-amber-400' : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Aspek yang Dinilai</label>
              <div className="flex flex-wrap gap-2">
                {['Desain UI', 'Kecepatan', 'Fitur Baru', 'Kemudahan'].map((tag) => {
                  const selected = feedbackTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() =>
                        setFeedbackTags((prev) =>
                          selected ? prev.filter((t) => t !== tag) : [...prev, tag],
                        )
                      }
                      className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer ${
                        selected ? GRAD.warning : GRAD.light
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Catatan Masukan</label>
              <textarea
                rows={3}
                value={feedbackNote}
                onChange={(e) => setFeedbackNote(e.target.value)}
                placeholder="Ceritakan apa yang bisa kami tingkatkan..."
                className="w-full px-3 py-2 text-xs sm:text-sm text-slate-800 border border-slate-200 rounded-xl outline-none focus:border-[#175cd3]"
              />
            </div>
          </div>

          <div className="px-6 py-3.5 border-t border-slate-100 flex justify-end gap-2">
            <button type="button" onClick={closeModal} className={`px-4 py-2 text-xs font-semibold rounded-xl cursor-pointer ${GRAD.light}`}>
              Batal
            </button>
            <button
              type="button"
              onClick={() => {
                showToast(`Terima kasih atas rating ${ratingStars}/5 bintang!`, 'success');
                setFeedbackNote('');
                closeModal();
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-xl cursor-pointer ${GRAD.primary}`}
            >
              Kirim Feedback
            </button>
          </div>
        </ModalShell>
      )}

      {/* ======================================================== */}
      {/* CLASSIC BOOTSTRAP & STISLA MODALS */}
      {/* ======================================================== */}

      {activeModal === 'demo' && (
        <ModalShell onClose={closeModal} align="top">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h4 className="text-base font-bold text-slate-800">Modal Title</h4>
            <button type="button" onClick={closeModal} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-6">
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Modal body text goes here. Posisi modal ini berada di bagian atas layar (top-aligned) sesuai standar Bootstrap modal demo.
            </p>
          </div>
          <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                showToast('Perubahan berhasil disimpan!', 'success');
                closeModal();
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-lg shadow-xs cursor-pointer ${GRAD.primary}`}
            >
              Save changes
            </button>
            <button type="button" onClick={closeModal} className={`px-4 py-2 text-xs font-semibold rounded-lg cursor-pointer ${GRAD.light}`}>
              Close
            </button>
          </div>
        </ModalShell>
      )}

      {activeModal === 'center' && (
        <ModalShell onClose={closeModal}>
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h4 className="text-base font-bold text-slate-800">Modal Title</h4>
            <button type="button" onClick={closeModal} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-6">
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Modal body text goes here. Posisi modal ini secara presisi berada di tengah layar secara vertikal dan horizontal.
            </p>
          </div>
          <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                showToast('Perubahan berhasil disimpan!', 'success');
                closeModal();
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-lg shadow-xs cursor-pointer ${GRAD.primary}`}
            >
              Save changes
            </button>
            <button type="button" onClick={closeModal} className={`px-4 py-2 text-xs font-semibold rounded-lg cursor-pointer ${GRAD.light}`}>
              Close
            </button>
          </div>
        </ModalShell>
      )}

      {activeModal === 'confirm' && (
        <ModalShell onClose={closeModal} maxWidth="max-w-md">
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-base font-bold text-slate-800">Konfirmasi Penghapusan</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Apakah Anda yakin ingin menghapus data ini? Tindakan ini bersifat permanen dan tidak dapat dibatalkan.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  showToast('Data berhasil dihapus!', 'warning');
                  closeModal();
                }}
                className={`px-5 py-2.5 text-xs font-semibold rounded-lg shadow-xs cursor-pointer ${GRAD.danger}`}
              >
                Ya, Hapus Data
              </button>
              <button type="button" onClick={closeModal} className={`px-5 py-2.5 text-xs font-semibold rounded-lg cursor-pointer ${GRAD.light}`}>
                Batal
              </button>
            </div>
          </div>
        </ModalShell>
      )}

      {activeModal === 'bootstrap' && (
        <ModalShell onClose={closeModal}>
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#1351b8]" />
              <h4 className="text-base font-bold text-slate-800">Aw, yeah! Bootstrap Modal</h4>
            </div>
            <button type="button" onClick={closeModal} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-6 space-y-3">
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Modal ini dipicu dengan pola dialog standar &amp; terintegrasi dengan animasi Tailwind CSS serta React state.
            </p>
            <div className="p-4 rounded-xl border border-blue-200/80 text-xs text-[#1351b8] leading-relaxed font-medium">
              Tips: Tekan tombol <b>Escape</b> pada keyboard atau klik area backdrop di luar dialog untuk menutup modal secara instan.
            </div>
          </div>
          <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-end gap-2">
            <button type="button" onClick={closeModal} className={`px-5 py-2 text-xs font-semibold rounded-lg shadow-xs cursor-pointer ${GRAD.primary}`}>
              Keren, Mengerti!
            </button>
          </div>
        </ModalShell>
      )}

      {activeModal === 'buttons' && (
        <ModalShell onClose={closeModal}>
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h4 className="text-base font-bold text-slate-800">Multiple Action Buttons</h4>
            <button type="button" onClick={closeModal} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-6">
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Modal ini mendemonstrasikan berbagai varian tombol tindakan di footer modal dengan gradien warna dasar yang konsisten.
            </p>
          </div>
          <div className="px-6 py-3.5 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                showToast('Aksi Danger diklik', 'warning');
                closeModal();
              }}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg shadow-xs cursor-pointer ${GRAD.danger}`}
            >
              Danger
            </button>
            <button
              type="button"
              onClick={() => {
                showToast('Aksi Success diklik', 'success');
                closeModal();
              }}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg shadow-xs cursor-pointer ${GRAD.success}`}
            >
              Success
            </button>
            <button
              type="button"
              onClick={() => {
                showToast('Aksi Info diklik', 'info');
                closeModal();
              }}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg shadow-xs cursor-pointer ${GRAD.info}`}
            >
              Info
            </button>
            <button type="button" onClick={closeModal} className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg cursor-pointer ${GRAD.light}`}>
              Close
            </button>
          </div>
        </ModalShell>
      )}

      {activeModal === 'footer-bg' && (
        <ModalShell onClose={closeModal}>
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h4 className="text-base font-bold text-slate-800">Footer Background Variant</h4>
            <button type="button" onClick={closeModal} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-6">
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Modal ini menampilkan kustomisasi footer dengan warna latar belakang gelap yang kontras dan elegan.
            </p>
          </div>
          <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
            <span className="text-xs text-slate-300 font-medium">Dark Footer Styling</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  showToast('Tersimpan di Dark Footer!', 'success');
                  closeModal();
                }}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg shadow-xs cursor-pointer ${GRAD.primary}`}
              >
                Save
              </button>
              <button type="button" onClick={closeModal} className={`px-4 py-1.5 text-xs font-semibold rounded-lg cursor-pointer ${GRAD.dark}`}>
                Cancel
              </button>
            </div>
          </div>
        </ModalShell>
      )}

      {activeModal === 'login' && (
        <ModalShell onClose={closeModal} maxWidth="max-w-md">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h4 className="text-base font-bold text-slate-800">Login to Account</h4>
            <button type="button" onClick={closeModal} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              showToast(`Login berhasil sebagai ${loginEmail || 'pengguna'}!`, 'success');
              closeModal();
            }}
            className="p-6 space-y-4"
          >
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Email Address</label>
              <div className="flex rounded-lg border border-slate-200 overflow-hidden focus-within:border-[#1351b8] focus-within:ring-2 focus-within:ring-[#1351b8]/15">
                <div className="px-3 py-2 border-r border-slate-200 flex items-center justify-center text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm text-slate-800 outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Password</label>
              <div className="flex rounded-lg border border-slate-200 overflow-hidden focus-within:border-[#1351b8] focus-within:ring-2 focus-within:ring-[#1351b8]/15">
                <div className="px-3 py-2 border-r border-slate-200 flex items-center justify-center text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm text-slate-800 outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600">
                <input
                  type="checkbox"
                  checked={loginRemember}
                  onChange={(e) => setLoginRemember(e.target.checked)}
                  className="w-4 h-4 text-[#1351b8] rounded-sm border-slate-300"
                />
                <span>Remember Me</span>
              </label>
              <a
                href="#forgot"
                onClick={(e) => {
                  e.preventDefault();
                  showToast('Navigasi reset password', 'info');
                }}
                className="text-[#1351b8] hover:underline font-semibold"
              >
                Forgot Password?
              </a>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className={`w-full py-2.5 text-xs sm:text-sm font-semibold rounded-lg shadow-xs cursor-pointer ${GRAD.primary}`}
              >
                Sign In
              </button>
            </div>
          </form>
        </ModalShell>
      )}

      {activeModal === 'footer-extra' && (
        <ModalShell onClose={closeModal}>
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h4 className="text-base font-bold text-slate-800">Something in the Footer</h4>
            <button type="button" onClick={closeModal} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-6">
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Modal ini menampilkan elemen tambahan di bagian kiri footer (seperti checkbox persetujuan atau opsi &quot;Jangan tampilkan lagi&quot;).
            </p>
          </div>
          <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-between gap-3">
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-600">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="w-4 h-4 text-[#1351b8] rounded-sm border-slate-300"
              />
              <span>Jangan tampilkan lagi</span>
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  showToast('Pilihan disimpan!', 'success');
                  closeModal();
                }}
                className={`px-4 py-2 text-xs font-semibold rounded-lg shadow-xs cursor-pointer ${GRAD.primary}`}
              >
                Save changes
              </button>
              <button type="button" onClick={closeModal} className={`px-4 py-2 text-xs font-semibold rounded-lg cursor-pointer ${GRAD.light}`}>
                Close
              </button>
            </div>
          </div>
        </ModalShell>
      )}
    </div>
  );
}
