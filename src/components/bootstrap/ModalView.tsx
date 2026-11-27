import React, { useEffect, useRef, useState } from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  ArrowRight,
  Bell,
  Briefcase,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Command,
  Compass,
  Cookie,
  Copy,
  CreditCard,
  Crown,
  Download,
  Eye,
  EyeOff,
  FileSpreadsheet,
  FileText,
  History,
  Image as ImageIcon,
  KeyRound,
  Layers,
  Link2,
  ListChecks,
  Lock,
  Mail,
  MapPin,
  Package,
  PanelRight,
  Paperclip,
  Phone,
  Plus,
  QrCode,
  Receipt,
  RefreshCw,
  Search,
  Send,
  Share2,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Star,
  Trash2,
  UploadCloud,
  UserCheck,
  Users,
  Wallet,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { showToast } from '../../lib/swal';
import { formatThousandDot, GRAD, type ModalId, ModalShell } from './modalShared';
import { ExtendedModals } from './ExtendedModals';

type AppCategory = 'all' | 'forms' | 'payment' | 'security' | 'workspace' | 'utility';

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
  { id: 'all', label: 'Semua UI (30)' },
  { id: 'forms', label: 'Forms & Multi-Input' },
  { id: 'payment', label: 'Payment & Commerce' },
  { id: 'workspace', label: 'Profile & Team' },
  { id: 'security', label: 'Auth & Privacy' },
  { id: 'utility', label: 'Productivity & Media' },
];

const APP_MODAL_CARDS: AppModalCardItem[] = [
  {
    id: 'multi-input-form',
    category: 'forms',
    title: 'Complete Multi-Input Form & Upload',
    desc: 'Form lengkap berisi input text, email, number, date, color, range slider, password, select, radio, toggle, single file, dan multiple file dengan UX progress bar + delete.',
    badge: 'Full Form UX',
    badgeGrad: GRAD.primaryStatic,
    iconGrad: GRAD.primaryStatic,
    icon: Layers,
    ctaLabel: 'Buka Form Lengkap',
  },
  {
    id: 'profile-detail',
    category: 'workspace',
    title: 'Detail Profile User & Karyawan',
    desc: 'Kartu profil cepat dengan cover header, status online, statistik performa, kontak salin cepat, dan aksi pesan.',
    badge: 'Profile Card',
    badgeGrad: GRAD.info,
    iconGrad: GRAD.info,
    icon: UserCheck,
    ctaLabel: 'Lihat Profil',
  },
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
    id: 'product-quickview',
    category: 'payment',
    title: 'Quick View Produk (E-Commerce)',
    desc: 'Pratinjau produk interaktif dengan pilih warna, edisi, pengatur jumlah stok, dan tombol tambah ke keranjang.',
    badge: 'Commerce UI',
    badgeGrad: GRAD.info,
    iconGrad: GRAD.info,
    icon: ShoppingBag,
    ctaLabel: 'Lihat Produk',
  },
  {
    id: 'shipping-address',
    category: 'payment',
    title: 'Pilih & Tambah Alamat Kirim',
    desc: 'Pilih daftar alamat tersimpan (Rumah / Kantor) atau tambah alamat pengiriman baru langsung di dalam modal.',
    badge: 'Address Book',
    badgeGrad: GRAD.dark,
    iconGrad: GRAD.dark,
    icon: MapPin,
    ctaLabel: 'Atur Alamat',
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
    id: 'cookie-consent',
    category: 'security',
    title: 'Preferensi Privasi & Cookie',
    desc: 'Dialog persetujuan privasi dengan switch kontrol granular (Esensial, Analitik, Personalisasi).',
    badge: 'Privacy Consent',
    badgeGrad: GRAD.warning,
    iconGrad: GRAD.warning,
    icon: Cookie,
    ctaLabel: 'Atur Privasi',
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
    id: 'event-rsvp',
    category: 'workspace',
    title: 'Detail Jadwal Meeting & RSVP',
    desc: 'Rincian jadwal rapat lengkap dengan tautan meeting salin cepat, daftar peserta, agenda, dan status RSVP.',
    badge: 'Calendar Event',
    badgeGrad: GRAD.success,
    iconGrad: GRAD.success,
    icon: Calendar,
    ctaLabel: 'Buka Jadwal',
  },
  {
    id: 'onboarding-tour',
    category: 'utility',
    title: "What's New & Onboarding Stepper",
    desc: 'Modal pengumuman rilis fitur atau welcome tour 3 langkah lengkap dengan indikator progress dan navigasi.',
    badge: 'Product Tour',
    badgeGrad: GRAD.primaryStatic,
    iconGrad: GRAD.primaryStatic,
    icon: Compass,
    ctaLabel: 'Mulai Tour',
  },
  {
    id: 'notification-inbox',
    category: 'utility',
    title: 'Pusat Notifikasi (Inbox)',
    desc: 'Pratinjau pesan dan aktivitas terbaru dengan tab filter belum dibaca serta aksi tandai semua dibaca.',
    badge: 'Notifications',
    badgeGrad: GRAD.warning,
    iconGrad: GRAD.warning,
    icon: Bell,
    ctaLabel: 'Buka Notifikasi',
  },
  {
    id: 'media-lightbox',
    category: 'utility',
    title: 'Preview Dokumen & Lightbox',
    desc: 'Modal penampil visual & aset dengan kontrol zoom in/out, informasi resolusi berkas, dan tombol unduh.',
    badge: 'Media Preview',
    badgeGrad: GRAD.dark,
    iconGrad: GRAD.dark,
    icon: ImageIcon,
    ctaLabel: 'Preview Media',
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
  {
    id: 'danger-zone-confirm',
    category: 'security',
    title: 'Danger Zone (Type-to-Confirm)',
    desc: 'Konfirmasi penghapusan kritikal ala GitHub/Vercel yang mewajibkan pengetikan frase keamanan sebelum tombol aktif.',
    badge: 'Safety Gate',
    badgeGrad: GRAD.danger,
    iconGrad: GRAD.danger,
    icon: AlertOctagon,
    ctaLabel: 'Coba Danger Zone',
  },
  {
    id: 'session-timeout',
    category: 'security',
    title: 'Session Timeout & Re-Auth',
    desc: 'Dialog peringatan sesi login hampir habis dengan hitung mundur live, input PIN cepat, dan perpanjang sesi.',
    badge: 'Session Guard',
    badgeGrad: GRAD.warning,
    iconGrad: GRAD.warning,
    icon: Clock,
    ctaLabel: 'Simulasi Timeout',
  },
  {
    id: 'api-key-create',
    category: 'security',
    title: 'Create API Key & Access Token',
    desc: 'Pembuatan secret token server-to-server dengan pilihan scope akses dan tampilan token sekali lihat (copy-once).',
    badge: 'Developer API',
    badgeGrad: GRAD.dark,
    iconGrad: GRAD.dark,
    icon: KeyRound,
    ctaLabel: 'Generate API Key',
  },
  {
    id: 'invoice-detail',
    category: 'payment',
    title: 'Invoice Detail & Print Preview',
    desc: 'Pratinjau faktur korporat lengkap dengan rincian item, hitung PPN 11%, badge status lunas, dan tombol cetak.',
    badge: 'Billing Invoice',
    badgeGrad: GRAD.primaryStatic,
    iconGrad: GRAD.primaryStatic,
    icon: Receipt,
    ctaLabel: 'Lihat Invoice',
  },
  {
    id: 'topup-wallet',
    category: 'payment',
    title: 'Top-Up Saldo & Nominal Cepat',
    desc: 'Pilih chip nominal instan atau input Rp custom berformat titik, metode QRIS/VA, dan kalkulasi biaya admin.',
    badge: 'Wallet Top-Up',
    badgeGrad: GRAD.success,
    iconGrad: GRAD.success,
    icon: Wallet,
    ctaLabel: 'Isi Saldo',
  },
  {
    id: 'approval-request',
    category: 'workspace',
    title: 'Approval Pengajuan (Approve / Reject)',
    desc: 'Modal persetujuan HR/Finance untuk reimbursement atau kasbon dengan input alasan wajib saat menolak pengajuan.',
    badge: 'HRM Approval',
    badgeGrad: GRAD.info,
    iconGrad: GRAD.info,
    icon: ClipboardCheck,
    ctaLabel: 'Review Pengajuan',
  },
  {
    id: 'wizard-stepper',
    category: 'forms',
    title: 'Multi-Step Form Wizard (3 Tahap)',
    desc: 'Form bertahap terstruktur dengan header stepper bernomor, anggaran format Rp titik, hingga ringkasan konfirmasi.',
    badge: 'Wizard Flow',
    badgeGrad: GRAD.primaryStatic,
    iconGrad: GRAD.primaryStatic,
    icon: ListChecks,
    ctaLabel: 'Mulai Wizard',
  },
  {
    id: 'csv-import',
    category: 'forms',
    title: 'Import Excel / CSV & Validasi',
    desc: 'Unggah spreadsheet lalu tampilkan pratinjau tabel baris valid vs error validasi sebelum data diproses.',
    badge: 'Bulk Importer',
    badgeGrad: GRAD.info,
    iconGrad: GRAD.info,
    icon: FileSpreadsheet,
    ctaLabel: 'Buka Importer',
  },
  {
    id: 'audit-trail',
    category: 'utility',
    title: 'Audit Trail & History Diff',
    desc: 'Riwayat perubahan data lengkap dengan perbandingan Before → After, kategori log, dan alamat IP aktor.',
    badge: 'Activity Log',
    badgeGrad: GRAD.dark,
    iconGrad: GRAD.dark,
    icon: History,
    ctaLabel: 'Lihat Audit Log',
  },
];

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

  // Product quick view state
  const [productColor, setProductColor] = useState<'Midnight Black' | 'Ocean Blue' | 'Silver Mist'>('Ocean Blue');
  const [productEdition, setProductEdition] = useState<'Standard' | 'Pro LTE'>('Pro LTE');
  const [productQty, setProductQty] = useState(1);

  // Event RSVP state
  const [rsvpStatus, setRsvpStatus] = useState<'hadir' | 'mungkin' | 'tidak'>('hadir');

  // Shipping address state
  const [addresses, setAddresses] = useState([
    {
      id: 'addr-1',
      label: 'Rumah Utama',
      recipient: 'Fahmi Ibrahim',
      phone: '+62 812-3456-7890',
      city: 'Jakarta Selatan',
      street: 'Jl. Kemang Raya No. 48B, Mampang Prapatan',
      isPrimary: true,
    },
    {
      id: 'addr-2',
      label: 'Kantor SCBD',
      recipient: 'Fahmi Ibrahim',
      phone: '+62 812-9988-7766',
      city: 'Jakarta Pusat',
      street: 'Treasury Tower Lt. 19, Jl. Jend. Sudirman Kav 52-53',
      isPrimary: false,
    },
  ]);
  const [selectedAddrId, setSelectedAddrId] = useState('addr-1');
  const [showNewAddrForm, setShowNewAddrForm] = useState(false);
  const [newAddrLabel, setNewAddrLabel] = useState('');
  const [newAddrRecipient, setNewAddrRecipient] = useState('');
  const [newAddrPhone, setNewAddrPhone] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('');
  const [newAddrStreet, setNewAddrStreet] = useState('');

  // Onboarding tour state
  const [tourStep, setTourStep] = useState(0);

  // Notification inbox state
  const [notifTab, setNotifTab] = useState<'all' | 'unread'>('all');
  const [notifications, setNotifications] = useState([
    {
      id: 'n1',
      title: 'Pembayaran #TXN-94021-X berhasil diterima',
      desc: 'Langganan Velora Pro Enterprise aktif hingga Nov 2027.',
      time: '2 menit lalu',
      unread: true,
      badgeGrad: GRAD.success,
    },
    {
      id: 'n2',
      title: 'Nadia Kusuma menandai Anda di KAN-105',
      desc: 'Review desain auth split layout siap dicek pada kolom In Review.',
      time: '28 menit lalu',
      unread: true,
      badgeGrad: GRAD.primaryStatic,
    },
    {
      id: 'n3',
      title: 'Laporan Payroll November selesai digenerate',
      desc: 'Dokumen siap diunduh melalui modul Utilities > Invoice.',
      time: '3 jam lalu',
      unread: false,
      badgeGrad: GRAD.info,
    },
  ]);

  // Lightbox zoom state
  const [lightboxZoom, setLightboxZoom] = useState(100);

  // Cookie preferences state
  const [cookieAnalytics, setCookieAnalytics] = useState(true);
  const [cookiePersonalization, setCookiePersonalization] = useState(false);

  // Complete Multi-Input & File Upload Form Modal state
  const [formFullName, setFormFullName] = useState('Fahmi Ibrahim');
  const [formEmail, setFormEmail] = useState('fahmi@velora.id');
  const [formPhone, setFormPhone] = useState('+62 812-7700-1122');
  const [formBudget, setFormBudget] = useState('15000000');
  const [formDate, setFormDate] = useState('2026-12-15');
  const [formPassword, setFormPassword] = useState('Velora@2026');
  const [showFormPass, setShowFormPass] = useState(false);
  const [formDivision, setFormDivision] = useState('Engineering & Product');
  const [formPriority, setFormPriority] = useState<'normal' | 'urgent'>('normal');
  const [formAccent, setFormAccent] = useState('#175cd3');
  const [formScale, setFormScale] = useState(75);
  const [formPublicAccess, setFormPublicAccess] = useState(true);
  const [formAgreeTerms, setFormAgreeTerms] = useState(true);
  const [formNotes, setFormNotes] = useState(
    'Integrasi form modal lengkap dengan validasi tipe input dan manajemen unggahan multi-berkas.',
  );
  const [singleFormFile, setSingleFormFile] = useState<{ name: string; size: string } | null>({
    name: 'Proposal-Q4-Velora.pdf',
    size: '1.2 MB',
  });
  const [multiFormFiles, setMultiFormFiles] = useState<
    { id: string; name: string; size: string; progress: number; status: 'uploading' | 'done' }[]
  >([
    { id: 'mf-1', name: 'Kontrak-Vendor-2026.pdf', size: '2.4 MB', progress: 100, status: 'done' },
    { id: 'mf-2', name: 'Mockup-Dashboard-v3.png', size: '840 KB', progress: 48, status: 'uploading' },
  ]);

  useEffect(() => {
    const hasUploading = multiFormFiles.some((f) => f.status === 'uploading' && f.progress < 100);
    if (!hasUploading) return;
    const interval = window.setInterval(() => {
      setMultiFormFiles((prev) =>
        prev.map((file) => {
          if (file.status !== 'uploading') return file;
          const nextProg = Math.min(100, file.progress + Math.floor(12 + Math.random() * 18));
          return {
            ...file,
            progress: nextProg,
            status: nextProg >= 100 ? 'done' : 'uploading',
          };
        }),
      );
    }, 240);
    return () => window.clearInterval(interval);
  }, [multiFormFiles]);

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

  const enqueueMultiFormFiles = (items: { name: string; size: string }[]) => {
    const newEntries = items.map((item, idx) => ({
      id: `mf-${Date.now()}-${idx}`,
      name: item.name,
      size: item.size,
      progress: 8,
      status: 'uploading' as const,
    }));
    setMultiFormFiles((prev) => [...newEntries, ...prev]);
  };

  const handleMultiFormInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    enqueueMultiFormFiles(
      Array.from(files).map((f) => ({
        name: f.name,
        size: `${Math.max(12, Math.round(f.size / 1024))} KB`,
      })),
    );
    e.target.value = '';
  };

  const handleSimulateMultiUpload = () => {
    const samples = [
      { name: `Lampiran-Audit-${Math.floor(10 + Math.random() * 89)}.xlsx`, size: '1.1 MB' },
      { name: `Bukti-Transfer-${Math.floor(100 + Math.random() * 899)}.png`, size: '420 KB' },
    ];
    enqueueMultiFormFiles([samples[Math.floor(Math.random() * samples.length)]]);
  };

  const unreadNotifCount = notifications.filter((n) => n.unread).length;
  const visibleNotifications =
    notifTab === 'unread' ? notifications.filter((n) => n.unread) : notifications;

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

      {/* A13. COMPLETE MULTI-INPUT & FILE UPLOAD FORM MODAL */}
      {activeModal === 'multi-input-form' && (
        <ModalShell onClose={closeModal} maxWidth="max-w-2xl">
          <div className="max-h-[88vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${GRAD.primaryStatic}`}>
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">Complete Multi-Input Form Modal</h4>
                  <p className="text-[11px] text-slate-500">
                    Showcase lengkap input text, password, select, date, range, color, toggle, single file &amp; multi-file progress.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              id="velora-multi-input-form"
              onSubmit={(e) => {
                e.preventDefault();
                showToast(
                  `Form "${formFullName}" tersimpan (${multiFormFiles.length} file terlampir)!`,
                  'success',
                );
                closeModal();
              }}
              className="p-6 overflow-y-auto space-y-5 flex-1 [scrollbar-width:thin] [scrollbar-color:#cbd5e1_transparent]"
            >
              {/* Basic Inputs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Nama Lengkap (Text)
                  </label>
                  <input
                    type="text"
                    required
                    value={formFullName}
                    onChange={(e) => setFormFullName(e.target.value)}
                    placeholder="Masukkan nama lengkap"
                    className="w-full px-3 py-2 text-xs sm:text-sm text-slate-800 border border-slate-200 rounded-xl outline-none focus:border-[#175cd3] focus:ring-2 focus:ring-[#175cd3]/15"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Email Kerja (Email)
                  </label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="nama@perusahaan.id"
                    className="w-full px-3 py-2 text-xs sm:text-sm text-slate-800 border border-slate-200 rounded-xl outline-none focus:border-[#175cd3] focus:ring-2 focus:ring-[#175cd3]/15"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Nomor Telepon (Tel)
                  </label>
                  <input
                    type="tel"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm text-slate-800 border border-slate-200 rounded-xl outline-none focus:border-[#175cd3]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Estimasi Anggaran (Nominal Rupiah)
                  </label>
                  <div className="flex rounded-xl border border-slate-200 overflow-hidden focus-within:border-[#175cd3] focus-within:ring-2 focus-within:ring-[#175cd3]/15 transition-all bg-white">
                    <div className="px-3.5 py-2 bg-slate-50/80 border-r border-slate-200 flex items-center justify-center text-xs sm:text-sm font-semibold text-slate-600 select-none">
                      Rp
                    </div>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={formatThousandDot(formBudget)}
                      onChange={(e) => setFormBudget(e.target.value.replace(/\D/g, ''))}
                      placeholder="0"
                      className="w-full px-3 py-2 text-xs sm:text-sm text-slate-800 outline-none tabular-nums"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Tanggal Deadline (Date)
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm text-slate-800 border border-slate-200 rounded-xl outline-none focus:border-[#175cd3]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Password Akses (Password)
                  </label>
                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden focus-within:border-[#175cd3]">
                    <input
                      type={showFormPass ? 'text' : 'password'}
                      required
                      value={formPassword}
                      onChange={(e) => setFormPassword(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm text-slate-800 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowFormPass((v) => !v)}
                      className="px-3 text-slate-500 hover:text-[#175cd3] cursor-pointer"
                    >
                      {showFormPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Select, Color Picker, Range Slider */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Divisi (Select)</label>
                  <select
                    value={formDivision}
                    onChange={(e) => setFormDivision(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm text-slate-800 border border-slate-200 rounded-xl bg-white outline-none focus:border-[#175cd3]"
                  >
                    <option>Engineering &amp; Product</option>
                    <option>Finance &amp; Accounting</option>
                    <option>Human Capital</option>
                    <option>Operations &amp; Supply</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Warna Label (Color)
                  </label>
                  <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-2.5 py-1.5">
                    <input
                      type="color"
                      value={formAccent}
                      onChange={(e) => setFormAccent(e.target.value)}
                      className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent p-0"
                    />
                    <span className="text-xs font-mono text-slate-700 uppercase">{formAccent}</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-slate-700">Bobot Prioritas (Range)</label>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${GRAD.primaryStatic}`}>
                      {formScale}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={formScale}
                    onChange={(e) => setFormScale(Number(e.target.value))}
                    className="w-full accent-[#175cd3] cursor-pointer"
                  />
                </div>
              </div>

              {/* Radio & Switch */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Tingkat Urgensi (Radio)
                  </label>
                  <div className="flex items-center gap-4">
                    {[
                      { id: 'normal' as const, label: 'Reguler' },
                      { id: 'urgent' as const, label: 'Prioritas Tinggi' },
                    ].map((opt) => (
                      <label key={opt.id} className="inline-flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                        <input
                          type="radio"
                          name="formPriority"
                          checked={formPriority === opt.id}
                          onChange={() => setFormPriority(opt.id)}
                          className="text-[#175cd3]"
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200">
                  <div>
                    <p className="text-xs font-semibold text-slate-900">Tampilkan ke Tim</p>
                    <p className="text-[11px] text-slate-500">Toggle status publikasi dokumen</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormPublicAccess((v) => !v)}
                    className={`w-10 h-5.5 rounded-full transition-colors p-0.5 cursor-pointer ${
                      formPublicAccess ? 'bg-[#175cd3]' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`block w-4.5 h-4.5 rounded-full bg-white shadow transition-transform ${
                        formPublicAccess ? 'translate-x-4.5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Single File Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-700">
                  Dokumen Utama (Single File Input)
                </label>
                {singleFormFile ? (
                  <div className="px-3.5 py-2.5 rounded-xl border border-slate-200 flex items-center justify-between gap-3 bg-white">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${GRAD.info}`}>
                        <Paperclip className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-900 truncate">{singleFormFile.name}</p>
                        <p className="text-[11px] text-slate-500">{singleFormFile.size}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <label className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg cursor-pointer ${GRAD.light}`}>
                        Ganti
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) {
                              setSingleFormFile({
                                name: f.name,
                                size: `${Math.max(10, Math.round(f.size / 1024))} KB`,
                              });
                            }
                            e.target.value = '';
                          }}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setSingleFormFile(null)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                        title="Hapus file"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="block px-4 py-3 rounded-xl border border-dashed border-slate-300 hover:border-[#175cd3] text-center text-xs text-slate-600 cursor-pointer">
                    <span>Klik untuk pilih 1 file dokumen utama</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          setSingleFormFile({
                            name: f.name,
                            size: `${Math.max(10, Math.round(f.size / 1024))} KB`,
                          });
                        }
                        e.target.value = '';
                      }}
                    />
                  </label>
                )}
              </div>

              {/* Multiple File Input with Live Progress & Delete */}
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="text-xs font-medium text-slate-700">
                    Lampiran Pendukung (Multiple File • Progress &amp; Delete)
                  </label>
                  <button
                    type="button"
                    onClick={handleSimulateMultiUpload}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg inline-flex items-center gap-1 cursor-pointer ${GRAD.info}`}
                  >
                    <Plus className="w-3 h-3" />
                    <span>Simulasikan Upload File</span>
                  </button>
                </div>

                <label className="border-2 border-dashed border-slate-200 hover:border-[#175cd3] rounded-xl p-4 text-center block cursor-pointer transition-colors">
                  <input type="file" multiple className="hidden" onChange={handleMultiFormInput} />
                  <UploadCloud className="w-5 h-5 text-[#175cd3] mx-auto mb-1" />
                  <p className="text-xs font-semibold text-slate-800">
                    Pilih satu atau banyak file sekaligus (multiple)
                  </p>
                  <p className="text-[11px] text-slate-500">
                    File yang dipilih otomatis berjalan progres unggahnya dan dapat dihapus kapan saja
                  </p>
                </label>

                {multiFormFiles.length > 0 && (
                  <div className="space-y-2">
                    {multiFormFiles.map((file) => (
                      <div key={file.id} className="p-3 rounded-xl border border-slate-200 bg-white space-y-1.5">
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText
                              className={`w-4 h-4 shrink-0 ${
                                file.status === 'done' ? 'text-emerald-600' : 'text-[#175cd3]'
                              }`}
                            />
                            <span className="font-semibold text-slate-900 truncate">{file.name}</span>
                            <span className="text-slate-500 shrink-0">({file.size})</span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                file.status === 'done' ? GRAD.success : GRAD.primaryStatic
                              }`}
                            >
                              {file.status === 'done' ? 'Selesai 100%' : `Mengunggah ${file.progress}%`}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setMultiFormFiles((prev) => prev.filter((item) => item.id !== file.id))
                              }
                              className="p-1 text-slate-400 hover:text-rose-600 rounded-md cursor-pointer"
                              title="Hapus file ini"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-200 ${
                              file.status === 'done' ? GRAD.success : GRAD.primaryStatic
                            }`}
                            style={{ width: `${file.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Textarea & Agreement Checkbox */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Catatan Tambahan (Textarea)
                </label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm text-slate-800 border border-slate-200 rounded-xl outline-none focus:border-[#175cd3]"
                />
              </div>

              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formAgreeTerms}
                  onChange={(e) => setFormAgreeTerms(e.target.checked)}
                  className="rounded-sm text-[#175cd3]"
                />
                <span>Saya menyatakan seluruh data dan berkas yang diunggah sudah valid</span>
              </label>
            </form>

            <div className="px-6 py-3.5 border-t border-slate-100 shrink-0 flex items-center justify-between gap-2 bg-white">
              <button
                type="button"
                onClick={() => {
                  setFormFullName('');
                  setFormEmail('');
                  setMultiFormFiles([]);
                  setSingleFormFile(null);
                  showToast('Isian form direset', 'info');
                }}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl cursor-pointer ${GRAD.light}`}
              >
                Reset
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl cursor-pointer ${GRAD.light}`}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  form="velora-multi-input-form"
                  className={`px-5 py-2 text-xs font-semibold rounded-xl shadow-xs cursor-pointer ${GRAD.primary}`}
                >
                  Simpan Form
                </button>
              </div>
            </div>
          </div>
        </ModalShell>
      )}

      {/* A14. DETAIL PROFILE USER & KARYAWAN MODAL */}
      {activeModal === 'profile-detail' && (
        <ModalShell onClose={closeModal} maxWidth="max-w-md">
          <div className="relative">
            <div className={`h-24 w-full ${GRAD.primaryStatic}`} />
            <button
              type="button"
              onClick={closeModal}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/25 hover:bg-black/40 text-white flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="px-6 pb-6">
              <div className="-mt-10 flex items-end justify-between gap-3 mb-3">
                <div className="relative">
                  <div
                    className={`w-20 h-20 rounded-2xl border-4 border-white shadow-md flex items-center justify-center text-xl font-bold ${GRAD.info}`}
                  >
                    NK
                  </div>
                  <span
                    className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white"
                    title="Online"
                  />
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold inline-flex items-center gap-1 ${GRAD.success}`}>
                  <CheckCircle2 className="w-3 h-3" />
                  Verified Lead
                </span>
              </div>

              <div>
                <h4 className="text-lg font-bold text-slate-900">Nadia Kusuma</h4>
                <p className="text-xs font-medium text-slate-600 inline-flex items-center gap-1.5 mt-0.5">
                  <Briefcase className="w-3.5 h-3.5 text-[#175cd3]" />
                  Senior UI/UX Lead • Product Design
                </p>
                <p className="text-xs text-slate-600 leading-relaxed mt-2">
                  Memimpin sistem desain Velora UI serta riset pengalaman pengguna modul ERP, HRIS, dan Checkout Flow.
                </p>
              </div>

              {/* Mini Stats */}
              <div className="grid grid-cols-3 gap-2.5 my-4">
                {[
                  { label: 'Proyek', val: '34' },
                  { label: 'Task Selesai', val: '148' },
                  { label: 'Rating Tim', val: '4.9 ★' },
                ].map((stat) => (
                  <div key={stat.label} className="p-2.5 rounded-xl border border-slate-200 text-center">
                    <p className="text-sm font-bold text-slate-900">{stat.val}</p>
                    <p className="text-[11px] text-slate-500">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Contact Rows */}
              <div className="space-y-2 text-xs border-t border-slate-100 pt-3.5 pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 inline-flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    nadia@velora.id
                  </span>
                  <button
                    type="button"
                    onClick={() => showToast('Email nadia@velora.id disalin!', 'info')}
                    className="text-[#175cd3] font-semibold hover:underline cursor-pointer"
                  >
                    Salin
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 inline-flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    +62 812-3456-7890
                  </span>
                  <span className="text-slate-500">Jakarta Selatan</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    showToast('Membuka obrolan dengan Nadia Kusuma...', 'info');
                    closeModal();
                  }}
                  className={`flex-1 py-2.5 text-xs font-semibold rounded-xl shadow-xs inline-flex items-center justify-center gap-1.5 cursor-pointer ${GRAD.primary}`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Pesan</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    window.location.hash = '#/profile';
                    closeModal();
                  }}
                  className={`flex-1 py-2.5 text-xs font-semibold rounded-xl cursor-pointer ${GRAD.light}`}
                >
                  Profil Lengkap
                </button>
              </div>
            </div>
          </div>
        </ModalShell>
      )}

      {/* A15. PRODUCT QUICK VIEW (E-COMMERCE) MODAL */}
      {activeModal === 'product-quickview' && (
        <ModalShell onClose={closeModal} maxWidth="max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-6 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col justify-between bg-white">
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${GRAD.warning}`}>
                  Hemat 20%
                </span>
                <span className="text-[11px] font-mono text-slate-500">SKU: VLR-WATCH-09</span>
              </div>

              <div className="my-6 py-8 rounded-2xl border border-slate-100 flex flex-col items-center justify-center gap-2">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-md ${GRAD.primaryStatic}`}>
                  <Package className="w-10 h-10" />
                </div>
                <span className="text-[11px] font-medium text-slate-500">{productColor} • {productEdition}</span>
              </div>

              <p className="text-[11px] text-slate-500">Garansi resmi 24 bulan &amp; bebas ongkir seluruh Indonesia.</p>
            </div>

            <div className="p-6 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-base font-bold text-slate-900">Velora Chrono Smart ERP Band</h4>
                  <button type="button" onClick={closeModal} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-600">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                  <span className="font-semibold text-slate-900">4.8</span>
                  <span>(124 ulasan) • Stok 18 unit</span>
                </div>

                <div className="flex items-baseline gap-2 mt-3">
                  <span className="text-2xl font-extrabold text-slate-900">$149.00</span>
                  <span className="text-xs text-slate-400 line-through">$189.00</span>
                </div>

                <div className="space-y-3 mt-4">
                  <div>
                    <p className="text-xs font-medium text-slate-700 mb-1.5">Warna</p>
                    <div className="flex flex-wrap gap-2">
                      {(['Ocean Blue', 'Midnight Black', 'Silver Mist'] as const).map((clr) => (
                        <button
                          key={clr}
                          type="button"
                          onClick={() => setProductColor(clr)}
                          className={`px-3 py-1 rounded-lg text-[11px] font-semibold cursor-pointer ${
                            productColor === clr ? GRAD.primary : GRAD.light
                          }`}
                        >
                          {clr}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-1">
                    <div>
                      <p className="text-xs font-medium text-slate-700 mb-1">Edisi</p>
                      <div className="flex gap-1.5">
                        {(['Standard', 'Pro LTE'] as const).map((ed) => (
                          <button
                            key={ed}
                            type="button"
                            onClick={() => setProductEdition(ed)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer ${
                              productEdition === ed ? GRAD.info : GRAD.light
                            }`}
                          >
                            {ed}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-slate-700 mb-1">Jumlah</p>
                      <div className="inline-flex items-center border border-slate-200 rounded-lg overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setProductQty((q) => Math.max(1, q - 1))}
                          className="px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-xs font-semibold text-slate-900">{productQty}</span>
                        <button
                          type="button"
                          onClick={() => setProductQty((q) => Math.min(18, q + 1))}
                          className="px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    showToast(
                      `${productQty}× Velora Band (${productColor}) masuk keranjang!`,
                      'success',
                    );
                    closeModal();
                  }}
                  className={`flex-1 py-2.5 text-xs font-semibold rounded-xl cursor-pointer ${GRAD.light}`}
                >
                  + Keranjang
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPaidAmount(`$${(149 * productQty).toFixed(2)}`);
                    setActiveModal('payment-checkout');
                  }}
                  className={`flex-1 py-2.5 text-xs font-semibold rounded-xl shadow-xs cursor-pointer ${GRAD.primary}`}
                >
                  Beli Langsung
                </button>
              </div>
            </div>
          </div>
        </ModalShell>
      )}

      {/* A16. DETAIL JADWAL MEETING & RSVP MODAL */}
      {activeModal === 'event-rsvp' && (
        <ModalShell onClose={closeModal} maxWidth="max-w-md">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`px-2.5 py-1 rounded-xl text-center leading-tight ${GRAD.success}`}>
                <span className="block text-[10px] uppercase">Nov</span>
                <span className="text-sm font-bold">27</span>
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900">
                  Sprint Review &amp; Architecture Sync
                </h4>
                <p className="text-[11px] text-slate-500">10:00 – 11:30 WIB • Google Meet</p>
              </div>
            </div>
            <button type="button" onClick={closeModal} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-4 text-xs">
            <div className="p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-2">
              <span className="font-mono text-slate-700 truncate">https://meet.google.com/vlr-sync-26</span>
              <button
                type="button"
                onClick={() => showToast('Link meeting disalin!', 'success')}
                className={`px-3 py-1 rounded-lg text-[11px] font-semibold shrink-0 cursor-pointer ${GRAD.primary}`}
              >
                Salin Link
              </button>
            </div>

            <div>
              <p className="font-semibold text-slate-800 mb-1.5">Peserta (6 Diundang)</p>
              <div className="flex items-center gap-1.5">
                {['FI', 'NK', 'BP', 'RH', 'SR'].map((ini) => (
                  <span
                    key={ini}
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${GRAD.primaryStatic}`}
                  >
                    {ini}
                  </span>
                ))}
                <span className="px-2 py-1 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                  +1 lagi
                </span>
              </div>
            </div>

            <div>
              <p className="font-semibold text-slate-800 mb-1.5">Agenda Singkat</p>
              <ul className="list-disc pl-4 space-y-1 text-slate-600">
                <li>Demo Modal Gallery &amp; Checkout Receipt flow</li>
                <li>Evaluasi performa scroll kolom Kanban Board</li>
                <li>Penentuan prioritas sprint pekan depan</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-slate-800 mb-1.5">Konfirmasi Kehadiran Anda</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'hadir' as const, label: 'Hadir', grad: GRAD.success },
                  { id: 'mungkin' as const, label: 'Mungkin', grad: GRAD.warning },
                  { id: 'tidak' as const, label: 'Tidak Bisa', grad: GRAD.danger },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setRsvpStatus(opt.id);
                      showToast(`Status RSVP diubah menjadi: ${opt.label}`, 'success');
                    }}
                    className={`py-2 rounded-xl text-xs font-semibold cursor-pointer ${
                      rsvpStatus === opt.id ? opt.grad : GRAD.light
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="px-6 py-3.5 border-t border-slate-100 flex justify-end">
            <button type="button" onClick={closeModal} className={`px-4 py-2 text-xs font-semibold rounded-xl cursor-pointer ${GRAD.light}`}>
              Tutup
            </button>
          </div>
        </ModalShell>
      )}

      {/* A17. SHIPPING ADDRESS BOOK & ADD FORM MODAL */}
      {activeModal === 'shipping-address' && (
        <ModalShell onClose={closeModal} maxWidth="max-w-lg">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#175cd3]" />
              <h4 className="text-base font-bold text-slate-900">Alamat Pengiriman</h4>
            </div>
            <button type="button" onClick={closeModal} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="space-y-2.5">
              {addresses.map((addr) => {
                const selected = selectedAddrId === addr.id;
                return (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddrId(addr.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selected ? 'border-[#175cd3] ring-2 ring-[#175cd3]/15' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{addr.label}</span>
                        {addr.isPrimary && (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${GRAD.primaryStatic}`}>
                            Utama
                          </span>
                        )}
                      </div>
                      {selected && <CheckCircle2 className="w-4 h-4 text-[#175cd3]" />}
                    </div>
                    <p className="text-xs font-semibold text-slate-800">
                      {addr.recipient} • {addr.phone}
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {addr.street}, {addr.city}
                    </p>
                  </div>
                );
              })}
            </div>

            {showNewAddrForm ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const nextId = `addr-${Date.now()}`;
                  setAddresses((prev) => [
                    ...prev,
                    {
                      id: nextId,
                      label: newAddrLabel || 'Alamat Baru',
                      recipient: newAddrRecipient,
                      phone: newAddrPhone,
                      city: newAddrCity,
                      street: newAddrStreet,
                      isPrimary: false,
                    },
                  ]);
                  setSelectedAddrId(nextId);
                  setShowNewAddrForm(false);
                  setNewAddrLabel('');
                  setNewAddrRecipient('');
                  setNewAddrPhone('');
                  setNewAddrCity('');
                  setNewAddrStreet('');
                  showToast('Alamat baru berhasil ditambahkan!', 'success');
                }}
                className="p-4 rounded-xl border border-slate-200 space-y-3"
              >
                <p className="text-xs font-bold text-slate-900">Tambah Alamat Baru</p>
                <div className="grid grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    required
                    placeholder="Label (mis. Gudang)"
                    value={newAddrLabel}
                    onChange={(e) => setNewAddrLabel(e.target.value)}
                    className="px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-[#175cd3]"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Kota / Kabupaten"
                    value={newAddrCity}
                    onChange={(e) => setNewAddrCity(e.target.value)}
                    className="px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-[#175cd3]"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Nama Penerima"
                    value={newAddrRecipient}
                    onChange={(e) => setNewAddrRecipient(e.target.value)}
                    className="px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-[#175cd3]"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="No. Telepon"
                    value={newAddrPhone}
                    onChange={(e) => setNewAddrPhone(e.target.value)}
                    className="px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-[#175cd3]"
                  />
                </div>
                <textarea
                  rows={2}
                  required
                  placeholder="Alamat lengkap (Jalan, RT/RW, Kode Pos)"
                  value={newAddrStreet}
                  onChange={(e) => setNewAddrStreet(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-[#175cd3]"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowNewAddrForm(false)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer ${GRAD.light}`}
                  >
                    Batal
                  </button>
                  <button type="submit" className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer ${GRAD.primary}`}>
                    Simpan Alamat
                  </button>
                </div>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setShowNewAddrForm(true)}
                className={`w-full py-2.5 text-xs font-semibold rounded-xl inline-flex items-center justify-center gap-1.5 cursor-pointer ${GRAD.light}`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Alamat Pengiriman Baru</span>
              </button>
            )}
          </div>

          <div className="px-6 py-3.5 border-t border-slate-100 flex justify-end gap-2">
            <button type="button" onClick={closeModal} className={`px-4 py-2 text-xs font-semibold rounded-xl cursor-pointer ${GRAD.light}`}>
              Tutup
            </button>
            <button
              type="button"
              onClick={() => {
                const chosen = addresses.find((a) => a.id === selectedAddrId);
                showToast(`Alamat "${chosen?.label}" dipilih untuk pengiriman!`, 'success');
                closeModal();
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-xl cursor-pointer ${GRAD.primary}`}
            >
              Gunakan Alamat Ini
            </button>
          </div>
        </ModalShell>
      )}

      {/* A18. WHAT'S NEW / ONBOARDING TOUR MODAL */}
      {activeModal === 'onboarding-tour' && (
        <ModalShell onClose={closeModal} maxWidth="max-w-md">
          {(() => {
            const steps = [
              {
                badge: 'Pembaruan v2.4 • Langkah 1/3',
                title: 'Selamat Datang di Velora Workspace',
                desc: 'Kelola alur kerja Kanban, persetujuan invoice, dan analitik tim dari satu dashboard terintegrasi.',
                grad: GRAD.primaryStatic,
              },
              {
                badge: 'Produktivitas • Langkah 2/3',
                title: '21+ Modal UI Siap Pakai',
                desc: 'Tersedia modal Payment Checkout, Struk Transaksi, Form Multi-Input dengan Progress Upload, hingga Command Palette.',
                grad: GRAD.info,
              },
              {
                badge: 'Keamanan • Langkah 3/3',
                title: 'Kontrol Akses & 2FA Terjaga',
                desc: 'Aktifkan verifikasi OTP dua langkah dan kelola role tiap anggota tim hanya dalam beberapa klik.',
                grad: GRAD.success,
              },
            ];
            const current = steps[tourStep];
            return (
              <div>
                <div className={`p-7 text-white relative ${current.grad}`}>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-black/20 hover:bg-black/35 flex items-center justify-center cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/20 mb-3">
                    {current.badge}
                  </span>
                  <h4 className="text-lg font-bold leading-snug">{current.title}</h4>
                </div>

                <div className="p-6 space-y-5">
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{current.desc}</p>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5">
                      {steps.map((_, idx) => (
                        <span
                          key={idx}
                          className={`h-2 rounded-full transition-all ${
                            idx === tourStep ? 'w-6 bg-[#175cd3]' : 'w-2 bg-slate-200'
                          }`}
                        />
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      {tourStep > 0 && (
                        <button
                          type="button"
                          onClick={() => setTourStep((s) => s - 1)}
                          className={`px-3.5 py-2 text-xs font-semibold rounded-xl cursor-pointer ${GRAD.light}`}
                        >
                          Sebelumnya
                        </button>
                      )}
                      {tourStep < steps.length - 1 ? (
                        <button
                          type="button"
                          onClick={() => setTourStep((s) => s + 1)}
                          className={`px-4 py-2 text-xs font-semibold rounded-xl cursor-pointer ${GRAD.primary}`}
                        >
                          Lanjut
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            showToast('Onboarding selesai! Selamat menjelajah Velora UI.', 'success');
                            setTourStep(0);
                            closeModal();
                          }}
                          className={`px-4 py-2 text-xs font-semibold rounded-xl cursor-pointer ${GRAD.success}`}
                        >
                          Mulai Sekarang
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </ModalShell>
      )}

      {/* A19. NOTIFICATION INBOX MODAL */}
      {activeModal === 'notification-inbox' && (
        <ModalShell onClose={closeModal} maxWidth="max-w-md">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#175cd3]" />
              <h4 className="text-base font-bold text-slate-900">Pusat Notifikasi</h4>
              {unreadNotifCount > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${GRAD.danger}`}>
                  {unreadNotifCount} Baru
                </span>
              )}
            </div>
            <button type="button" onClick={closeModal} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="px-6 pt-3 flex items-center justify-between gap-2">
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setNotifTab('all')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                  notifTab === 'all' ? GRAD.primary : GRAD.light
                }`}
              >
                Semua
              </button>
              <button
                type="button"
                onClick={() => setNotifTab('unread')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                  notifTab === 'unread' ? GRAD.primary : GRAD.light
                }`}
              >
                Belum Dibaca ({unreadNotifCount})
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
                showToast('Semua notifikasi ditandai sudah dibaca', 'info');
              }}
              className="text-[11px] font-semibold text-[#175cd3] hover:underline cursor-pointer"
            >
              Tandai Semua Dibaca
            </button>
          </div>

          <div className="p-4 space-y-2 max-h-80 overflow-y-auto">
            {visibleNotifications.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-8">Semua notifikasi sudah dibaca.</p>
            ) : (
              visibleNotifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() =>
                    setNotifications((prev) =>
                      prev.map((item) => (item.id === n.id ? { ...item, unread: false } : item)),
                    )
                  }
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    n.unread ? 'border-[#175cd3]/30 shadow-xs' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <span className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${n.badgeGrad}`} />
                      <div>
                        <p className="text-xs font-bold text-slate-900">{n.title}</p>
                        <p className="text-xs text-slate-600 mt-0.5">{n.desc}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                      </div>
                    </div>
                    {n.unread && <span className="w-2 h-2 rounded-full bg-[#175cd3] shrink-0 mt-1" />}
                  </div>
                </div>
              ))
            )}
          </div>
        </ModalShell>
      )}

      {/* A20. MEDIA LIGHTBOX / DOCUMENT PREVIEW MODAL */}
      {activeModal === 'media-lightbox' && (
        <ModalShell onClose={closeModal} maxWidth="max-w-2xl">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h4 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                UI-System-Blueprint-v2.png
              </h4>
              <p className="text-[11px] text-slate-500">1920 × 1080 px • 2.4 MB • Zoom {lightboxZoom}%</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setLightboxZoom((z) => Math.max(60, z - 20))}
                className={`p-2 rounded-lg cursor-pointer ${GRAD.light}`}
                title="Perkecil"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setLightboxZoom((z) => Math.min(140, z + 20))}
                className={`p-2 rounded-lg cursor-pointer ${GRAD.light}`}
                title="Perbesar"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => showToast('File UI-System-Blueprint-v2.png diunduh!', 'success')}
                className={`px-3 py-2 text-xs font-semibold rounded-lg inline-flex items-center gap-1 cursor-pointer ${GRAD.primary}`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh</span>
              </button>
              <button type="button" onClick={closeModal} className="text-slate-400 hover:text-slate-700 p-1.5 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-6 bg-slate-950 flex items-center justify-center overflow-auto min-h-[280px]">
            <div
              style={{ transform: `scale(${lightboxZoom / 100})` }}
              className="transition-transform duration-200 bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${GRAD.primaryStatic}`}>
                  Velora Design Tokens
                </span>
                <span className="text-[11px] font-mono text-slate-500">v2.4.0</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <div className={`h-14 rounded-xl ${GRAD.primaryStatic}`} />
                <div className={`h-14 rounded-xl ${GRAD.success}`} />
                <div className={`h-14 rounded-xl ${GRAD.warning}`} />
                <div className={`h-14 rounded-xl ${GRAD.danger}`} />
              </div>
              <div className="space-y-1.5">
                <div className="h-3 w-3/4 rounded bg-slate-200" />
                <div className="h-2.5 w-1/2 rounded bg-slate-100" />
              </div>
            </div>
          </div>
        </ModalShell>
      )}

      {/* A21. COOKIE & PRIVACY CONSENT MODAL */}
      {activeModal === 'cookie-consent' && (
        <ModalShell onClose={closeModal} maxWidth="max-w-md">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cookie className="w-4 h-4 text-amber-600" />
              <h4 className="text-base font-bold text-slate-900">Preferensi Privasi &amp; Cookie</h4>
            </div>
            <button type="button" onClick={closeModal} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-3 text-xs">
            <p className="text-slate-600 leading-relaxed">
              Kami menggunakan cookie untuk menjaga sesi login tetap aman serta memahami bagaimana Anda memakai aplikasi.
            </p>

            <div className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
              <div>
                <p className="font-bold text-slate-900">Cookie Esensial</p>
                <p className="text-[11px] text-slate-500">Wajib aktif untuk keamanan &amp; autentikasi sesi</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${GRAD.success}`}>
                Selalu Aktif
              </span>
            </div>

            {[
              {
                title: 'Analitik & Performa',
                sub: 'Membantu mengukur kecepatan halaman dan error log',
                checked: cookieAnalytics,
                toggle: () => setCookieAnalytics((v) => !v),
              },
              {
                title: 'Personalisasi UI',
                sub: 'Menyimpan tata letak sidebar dan preferensi tabel Anda',
                checked: cookiePersonalization,
                toggle: () => setCookiePersonalization((v) => !v),
              },
            ].map((item) => (
              <div key={item.title} className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-slate-900">{item.title}</p>
                  <p className="text-[11px] text-slate-500">{item.sub}</p>
                </div>
                <button
                  type="button"
                  onClick={item.toggle}
                  className={`w-10 h-5.5 rounded-full transition-colors p-0.5 shrink-0 cursor-pointer ${
                    item.checked ? 'bg-[#175cd3]' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`block w-4.5 h-4.5 rounded-full bg-white shadow transition-transform ${
                      item.checked ? 'translate-x-4.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>

          <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => {
                setCookieAnalytics(false);
                setCookiePersonalization(false);
                showToast('Hanya cookie esensial yang aktif', 'info');
                closeModal();
              }}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl cursor-pointer ${GRAD.light}`}
            >
              Hanya Esensial
            </button>
            <button
              type="button"
              onClick={() => {
                setCookieAnalytics(true);
                setCookiePersonalization(true);
                showToast('Semua preferensi cookie disimpan!', 'success');
                closeModal();
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-xl cursor-pointer ${GRAD.primary}`}
            >
              Terima Semua
            </button>
          </div>
        </ModalShell>
      )}

      {/* ======================================================== */}
      {/* EXTENDED ENTERPRISE & APP MODALS (9 UI) */}
      {/* ======================================================== */}
      <ExtendedModals activeModal={activeModal} onClose={closeModal} />

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
