import { useEffect, useState } from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Copy,
  Download,
  FileCheck2,
  FileSpreadsheet,
  History,
  KeyRound,
  Paperclip,
  Printer,
  Receipt,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  UploadCloud,
  Wallet,
  X,
  XCircle,
} from 'lucide-react';
import { showToast } from '../../lib/swal';
import { formatThousandDot, GRAD, type ModalId, ModalShell } from './modalShared';

interface ExtendedModalsProps {
  activeModal: ModalId | null;
  onClose: () => void;
}

const API_SCOPES = [
  { id: 'read:employees', label: 'read:employees', desc: 'Baca direktori & status karyawan' },
  { id: 'write:payroll', label: 'write:payroll', desc: 'Proses slip gaji & approval kasbon' },
  { id: 'export:reports', label: 'export:reports', desc: 'Unduh laporan keuangan & CSV' },
  { id: 'webhooks:manage', label: 'webhooks:manage', desc: 'Kelola endpoint webhook realtime' },
];

const INVOICE_ITEMS = [
  { item: 'Lisensi Velora ERP Enterprise (25 User)', qty: '12 Bln', price: 12000000 },
  { item: 'Modul Integrasi Payroll & Bank VA', qty: '1 Paket', price: 2400000 },
  { item: 'Priority SLA Support 24/7', qty: '1 Tahun', price: 1500000 },
];

const SAMPLE_IMPORT_ROWS = [
  { row: 2, name: 'Raka Pratama', email: 'raka@velora.id', nik: 'EMP-2026-041', valid: true, note: 'Siap diimpor' },
  { row: 3, name: 'Sinta Wijaya', email: 'sinta@velora.id', nik: 'EMP-2026-042', valid: true, note: 'Siap diimpor' },
  { row: 4, name: 'Doni Kusuma', email: 'doni.kusuma[at]velora', nik: 'EMP-2026-043', valid: false, note: 'Format email tidak valid' },
  { row: 5, name: 'Ayu Lestari', email: 'ayu@velora.id', nik: 'EMP-2026-044', valid: true, note: 'Siap diimpor' },
  { row: 6, name: 'Budi Santoso', email: 'budi@velora.id', nik: 'EMP-2025-019', valid: false, note: 'NIK sudah terdaftar' },
];

const AUDIT_LOGS = [
  {
    id: 'log-1',
    type: 'data' as const,
    actor: 'Fahmi Ibrahim',
    role: 'Super Admin',
    action: 'Memperbarui plafon kasbon divisi Engineering',
    time: '27 Nov 2026, 09:04 WIB',
    ip: '103.48.21.9 • Chrome macOS',
    field: 'Plafon Maksimal Kasbon',
    beforeVal: 'Rp 5.000.000',
    afterVal: 'Rp 10.000.000',
  },
  {
    id: 'log-2',
    type: 'security' as const,
    actor: 'Nadia Kusuma',
    role: 'Security Lead',
    action: 'Mengaktifkan aturan wajib 2FA untuk role Finance',
    time: '27 Nov 2026, 08:15 WIB',
    ip: '182.10.44.112 • Safari iOS',
    field: 'Kebijakan Autentikasi',
    beforeVal: 'Opsional',
    afterVal: 'Wajib OTP / Passkey',
  },
  {
    id: 'log-3',
    type: 'data' as const,
    actor: 'Bima Pratama',
    role: 'HR Manager',
    action: 'Mengubah role kolaborator workspace',
    time: '26 Nov 2026, 17:42 WIB',
    ip: '103.48.21.9 • Firefox Linux',
    field: 'Hak Akses — Raka Pratama',
    beforeVal: 'Viewer',
    afterVal: 'Editor (Approval)',
  },
];

export function ExtendedModals({ activeModal, onClose }: ExtendedModalsProps) {
  // 1. Danger Zone Confirm
  const [dangerInput, setDangerInput] = useState('');
  const dangerPhrase = 'HAPUS-WORKSPACE';
  const dangerMatch = dangerInput.trim() === dangerPhrase;

  // 2. Session Timeout
  const [sessionSeconds, setSessionSeconds] = useState(118);
  const [reauthPin, setReauthPin] = useState('');

  useEffect(() => {
    if (activeModal !== 'session-timeout') return;
    setSessionSeconds(118);
  }, [activeModal]);

  useEffect(() => {
    if (activeModal !== 'session-timeout' || sessionSeconds <= 0) return;
    const timer = window.setInterval(() => {
      setSessionSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [activeModal, sessionSeconds]);

  // 3. Create API Key
  const [apiName, setApiName] = useState('Payroll ERP Production Sync');
  const [apiExpiry, setApiExpiry] = useState('90 Hari');
  const [apiScopes, setApiScopes] = useState<string[]>(['read:employees', 'export:reports']);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);

  // 4. Invoice Detail
  const [invoicePaidStatus, setInvoicePaidStatus] = useState<'paid' | 'pending'>('paid');

  // 5. Top-Up Wallet
  const [walletBalance, setWalletBalance] = useState(2450000);
  const [topupAmount, setTopupAmount] = useState('250000');
  const [topupChannel, setTopupChannel] = useState<'qris' | 'bca' | 'mandiri'>('qris');

  // 6. Approval Request
  const [approvalStatus, setApprovalStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [approvalNote, setApprovalNote] = useState('');

  // 7. Multi-Step Form Wizard
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);
  const [wizName, setWizName] = useState('Implementasi Modul Absensi QR');
  const [wizCategory, setWizCategory] = useState('ERP & HR System');
  const [wizBudget, setWizBudget] = useState('12500000');
  const [wizDeadline, setWizDeadline] = useState('2026-12-30');
  const [wizPriority, setWizPriority] = useState<'Standard' | 'High Priority'>('High Priority');
  const [wizVisibility, setWizVisibility] = useState<'internal' | 'public'>('internal');
  const [wizNotifyEmail, setWizNotifyEmail] = useState(true);

  // 8. CSV Import
  const [importFileName, setImportFileName] = useState('Data-Karyawan-Batch-Nov2026.xlsx');
  const [skipInvalidRows, setSkipInvalidRows] = useState(true);

  // 9. Audit Trail
  const [auditFilter, setAuditFilter] = useState<'all' | 'data' | 'security'>('all');

  const formatMmSs = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const toggleScope = (scopeId: string) => {
    setApiScopes((prev) =>
      prev.includes(scopeId) ? prev.filter((item) => item !== scopeId) : [...prev, scopeId],
    );
  };

  const parsedTopup = Number(topupAmount.replace(/\D/g, '') || 0);
  const topupAdminFee = topupChannel === 'qris' ? 0 : 2500;
  const topupTotal = parsedTopup > 0 ? parsedTopup + topupAdminFee : 0;

  const invoiceSubtotal = INVOICE_ITEMS.reduce((acc, item) => acc + item.price, 0);
  const invoiceTax = Math.round(invoiceSubtotal * 0.11);
  const invoiceTotal = invoiceSubtotal + invoiceTax;

  const visibleAuditLogs =
    auditFilter === 'all' ? AUDIT_LOGS : AUDIT_LOGS.filter((item) => item.type === auditFilter);

  const validImportCount = SAMPLE_IMPORT_ROWS.filter((r) => r.valid).length;
  const errorImportCount = SAMPLE_IMPORT_ROWS.filter((r) => !r.valid).length;

  return (
    <>
      {/* 1. DANGER ZONE TYPE-TO-CONFIRM */}
      {activeModal === 'danger-zone-confirm' && (
        <ModalShell onClose={onClose} maxWidth="max-w-md">
          <div className="p-6 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-xs shrink-0 bg-gradient-to-r from-[#ef4444] to-[#b91c1c] text-white">
                  <AlertOctagon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">Hapus Workspace Permanen</h4>
                  <p className="text-xs text-slate-600">Tindakan destruktif &amp; tidak dapat dibatalkan</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/70 space-y-1.5 text-xs text-slate-700">
              <p className="font-semibold text-rose-800 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                Data yang akan ikut terhapus selamanya:
              </p>
              <ul className="list-disc pl-5 space-y-0.5 text-slate-700">
                <li>48 Proyek aktif &amp; seluruh lampiran dokumen</li>
                <li>1.240 Riwayat transaksi serta log audit</li>
                <li>14 API Keys produksi &amp; integrasi webhook</li>
              </ul>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-medium text-slate-700">
                  Ketik <code className="px-1.5 py-0.5 rounded bg-slate-100 font-bold text-rose-700">{dangerPhrase}</code> untuk konfirmasi
                </label>
                <button
                  type="button"
                  onClick={() => setDangerInput(dangerPhrase)}
                  className="text-[#1351b8] hover:underline font-semibold cursor-pointer"
                >
                  Isi otomatis
                </button>
              </div>
              <input
                type="text"
                value={dangerInput}
                onChange={(e) => setDangerInput(e.target.value)}
                placeholder={dangerPhrase}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 text-slate-900 font-mono focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15 outline-none"
              />
            </div>

            <div className="pt-1 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setDangerInput('');
                  onClose();
                }}
                className={`px-4 py-2 text-xs font-semibold rounded-xl cursor-pointer ${GRAD.light}`}
              >
                Batalkan
              </button>
              <button
                type="button"
                disabled={!dangerMatch}
                onClick={() => {
                  showToast('Workspace berhasil dijadwalkan untuk penghapusan permanen.', 'warning');
                  setDangerInput('');
                  onClose();
                }}
                className={`px-4 py-2 text-xs font-semibold rounded-xl shadow-xs inline-flex items-center gap-1.5 transition-all ${
                  dangerMatch
                    ? `${GRAD.danger} cursor-pointer`
                    : 'bg-gradient-to-r from-[#cbd5e1] to-[#94a3b8] text-white opacity-60 cursor-not-allowed'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                Hapus Permanen
              </button>
            </div>
          </div>
        </ModalShell>
      )}

      {/* 2. SESSION TIMEOUT & RE-AUTH */}
      {activeModal === 'session-timeout' && (
        <ModalShell onClose={onClose} maxWidth="max-w-md">
          <div className="p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-xs ${GRAD.warning}`}>
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">Sesi Hampir Berakhir</h4>
                  <p className="text-xs text-slate-600">Tidak ada aktivitas terdeteksi di dashboard</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-xl border border-amber-200 bg-white text-center space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-700">
                Otomatis keluar dalam
              </p>
              <p className="text-3xl font-extrabold font-mono text-slate-900 tabular-nums">
                {formatMmSs(sessionSeconds)}
              </p>
              <p className="text-xs text-slate-600">
                Untuk menjaga keamanan data payroll, konfirmasi PIN atau perpanjang sesi Anda.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">
                PIN Keamanan Cepat (Opsional untuk demo)
              </label>
              <input
                type="password"
                maxLength={6}
                value={reauthPin}
                onChange={(e) => setReauthPin(e.target.value)}
                placeholder="Masukkan 6 digit PIN Anda"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 text-slate-900 tracking-widest focus:border-[#1351b8] focus:ring-2 focus:ring-[#1351b8]/15 outline-none"
              />
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  showToast('Anda telah keluar dari sesi.', 'info');
                  onClose();
                }}
                className={`px-4 py-2.5 text-xs font-semibold rounded-xl cursor-pointer ${GRAD.light}`}
              >
                Keluar Sekarang
              </button>
              <button
                type="button"
                onClick={() => {
                  setSessionSeconds(118);
                  setReauthPin('');
                  showToast('Sesi login diperpanjang +30 menit!', 'success');
                  onClose();
                }}
                className={`px-5 py-2.5 text-xs font-semibold rounded-xl shadow-xs inline-flex items-center gap-1.5 cursor-pointer ${GRAD.primary}`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Perpanjang Sesi (+30m)
              </button>
            </div>
          </div>
        </ModalShell>
      )}

      {/* 3. CREATE API KEY / ACCESS TOKEN */}
      {activeModal === 'api-key-create' && (
        <ModalShell onClose={onClose} maxWidth="max-w-lg">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-xs ${GRAD.dark}`}>
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900">Buat API Key Baru</h4>
                <p className="text-[11px] text-slate-600">Autentikasi server-to-server &amp; webhook ERP</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {!generatedToken ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setGeneratedToken('vlr_live_9f8a42c7e1b094d38201fa7c88d2');
                showToast('API Key baru berhasil dibuat!', 'success');
              }}
              className="p-6 space-y-4 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-medium text-slate-700">Nama Token</label>
                  <input
                    type="text"
                    required
                    value={apiName}
                    onChange={(e) => setApiName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:border-[#1351b8] outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-medium text-slate-700">Masa Berlaku</label>
                  <select
                    value={apiExpiry}
                    onChange={(e) => setApiExpiry(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-900 bg-white focus:border-[#1351b8] outline-none"
                  >
                    <option value="30 Hari">30 Hari</option>
                    <option value="90 Hari">90 Hari</option>
                    <option value="1 Tahun">1 Tahun</option>
                    <option value="Tanpa Kedaluwarsa">Tanpa Kedaluwarsa</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-medium text-slate-700 block">Hak Akses (Scopes)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {API_SCOPES.map((scope) => {
                    const checked = apiScopes.includes(scope.id);
                    return (
                      <label
                        key={scope.id}
                        className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                          checked ? 'border-[#175cd3] bg-blue-50/40' : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleScope(scope.id)}
                          className="mt-0.5 w-4 h-4 rounded-sm text-[#175cd3]"
                        />
                        <div>
                          <p className="font-mono font-semibold text-slate-900">{scope.label}</p>
                          <p className="text-[11px] text-slate-600">{scope.desc}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className={`px-4 py-2 font-semibold rounded-xl cursor-pointer ${GRAD.light}`}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 font-semibold rounded-xl shadow-xs cursor-pointer ${GRAD.primary}`}
                >
                  Generate Token
                </button>
              </div>
            </form>
          ) : (
            <div className="p-6 space-y-4 text-xs">
              <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/70 flex items-start gap-2.5 text-slate-700">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  <span className="font-semibold text-slate-900">Simpan token ini sekarang.</span> Demi keamanan, secret token penuh tidak akan pernah ditampilkan lagi setelah modal ini ditutup.
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="font-medium text-slate-700 block">
                  Secret Key — <span className="font-semibold text-slate-900">{apiName}</span> ({apiExpiry})
                </span>
                <div className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-white">
                  <code className="flex-1 font-mono text-xs text-slate-900 truncate select-all">
                    {generatedToken}
                  </code>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(generatedToken);
                      showToast('Secret API Key disalin ke clipboard!', 'success');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer ${GRAD.primary}`}
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Salin
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setGeneratedToken(null)}
                  className={`px-4 py-2 font-semibold rounded-xl cursor-pointer ${GRAD.light}`}
                >
                  Buat Token Lain
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setGeneratedToken(null);
                    onClose();
                  }}
                  className={`px-5 py-2 font-semibold rounded-xl shadow-xs cursor-pointer ${GRAD.success}`}
                >
                  Selesai
                </button>
              </div>
            </div>
          )}
        </ModalShell>
      )}

      {/* 4. INVOICE DETAIL & PRINTABLE PREVIEW */}
      {activeModal === 'invoice-detail' && (
        <ModalShell onClose={onClose} maxWidth="max-w-2xl">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-xs ${GRAD.primaryStatic}`}>
                <Receipt className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900">Invoice #INV-2026-0842</h4>
                <p className="text-[11px] text-slate-600">Terbit 25 Nov 2026 • Jatuh Tempo 10 Des 2026</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setInvoicePaidStatus((prev) => (prev === 'paid' ? 'pending' : 'paid'))}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold cursor-pointer ${
                  invoicePaidStatus === 'paid' ? GRAD.success : GRAD.warning
                }`}
              >
                {invoicePaidStatus === 'paid' ? 'LUNAS' : 'MENUNGGU BAYAR'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border border-slate-200 bg-white">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Ditagihkan Oleh</p>
                <p className="font-bold text-slate-900 mt-1">PT Velora Digital Nusantara</p>
                <p className="text-slate-600">Menara Mandiri Lt. 12, Jakarta Selatan</p>
                <p className="text-slate-600">NPWP: 09.412.881.3-012.000</p>
              </div>
              <div className="sm:text-right">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Ditagihkan Kepada</p>
                <p className="font-bold text-slate-900 mt-1">PT Maju Sejahtera Tbk</p>
                <p className="text-slate-600">Attn: Bagian Keuangan / Fahmi Ibrahim</p>
                <p className="text-slate-600">finance@majusejahtera.co.id</p>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-white text-[11px] font-semibold text-slate-700">
                    <th className="py-2.5 px-3.5">Deskripsi Layanan</th>
                    <th className="py-2.5 px-3 text-center">Durasi / Qty</th>
                    <th className="py-2.5 px-3.5 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {INVOICE_ITEMS.map((row) => (
                    <tr key={row.item}>
                      <td className="py-2.5 px-3.5 font-medium text-slate-900">{row.item}</td>
                      <td className="py-2.5 px-3 text-center">{row.qty}</td>
                      <td className="py-2.5 px-3.5 text-right font-medium text-slate-900">
                        Rp {formatThousandDot(String(row.price))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <div className="w-full sm:w-72 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-800">Rp {formatThousandDot(String(invoiceSubtotal))}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>PPN (11%)</span>
                  <span className="font-medium text-slate-800">Rp {formatThousandDot(String(invoiceTax))}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm">
                  <span className="font-bold text-slate-900">Total Tagihan</span>
                  <span className="font-bold text-[#175cd3]">Rp {formatThousandDot(String(invoiceTotal))}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] text-slate-600">Klik badge status di kanan atas untuk simulasi status tagihan</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => showToast('Membuka dialog cetak faktur #INV-2026-0842...', 'info')}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 cursor-pointer ${GRAD.light}`}
              >
                <Printer className="w-3.5 h-3.5" />
                Cetak
              </button>
              <button
                type="button"
                onClick={() => showToast('Invoice #INV-2026-0842.pdf berhasil diunduh!', 'success')}
                className={`px-4 py-2 text-xs font-semibold rounded-xl shadow-xs inline-flex items-center gap-1.5 cursor-pointer ${GRAD.primary}`}
              >
                <Download className="w-3.5 h-3.5" />
                Unduh PDF
              </button>
            </div>
          </div>
        </ModalShell>
      )}

      {/* 5. TOP-UP WALLET & QUICK NOMINAL */}
      {activeModal === 'topup-wallet' && (
        <ModalShell onClose={onClose} maxWidth="max-w-lg">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-xs ${GRAD.success}`}>
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900">Top-Up Saldo Dompet</h4>
                <p className="text-[11px] text-slate-600">
                  Saldo Aktif: <strong className="text-slate-900">Rp {formatThousandDot(String(walletBalance))}</strong>
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-4 text-xs">
            <div className="space-y-2">
              <label className="font-medium text-slate-700 block">Pilih Nominal Cepat</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {['50000', '100000', '250000', '500000', '1000000'].map((nom) => {
                  const active = topupAmount === nom;
                  return (
                    <button
                      key={nom}
                      type="button"
                      onClick={() => setTopupAmount(nom)}
                      className={`py-2 px-2 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                        active ? `${GRAD.primary} shadow-xs` : GRAD.light
                      }`}
                    >
                      Rp {formatThousandDot(nom)}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-medium text-slate-700 block">Atau Ketik Nominal Custom</label>
              <div className="flex rounded-xl border border-slate-200 overflow-hidden bg-white focus-within:border-[#1351b8] focus-within:ring-2 focus-within:ring-[#1351b8]/15">
                <div className="px-3.5 py-2.5 border-r border-slate-200 flex items-center justify-center font-semibold text-slate-700 text-xs sm:text-sm select-none">
                  Rp
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  value={formatThousandDot(topupAmount)}
                  onChange={(e) => setTopupAmount(e.target.value.replace(/\D/g, ''))}
                  placeholder="150.000"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 font-medium outline-none bg-transparent"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-medium text-slate-700 block">Metode Pembayaran</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'qris' as const, label: 'QRIS Instan', fee: 'Gratis' },
                  { id: 'bca' as const, label: 'BCA VA', fee: '+Rp 2.500' },
                  { id: 'mandiri' as const, label: 'Mandiri VA', fee: '+Rp 2.500' },
                ].map((ch) => (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => setTopupChannel(ch.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      topupChannel === ch.id
                        ? 'border-[#175cd3] ring-2 ring-[#175cd3]/15'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <p className="font-semibold text-slate-900">{ch.label}</p>
                    <p className="text-[11px] text-slate-600">{ch.fee}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>Nominal Top-Up</span>
                <span className="font-medium text-slate-900">Rp {formatThousandDot(String(parsedTopup)) || '0'}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Biaya Admin</span>
                <span className="font-medium text-slate-900">
                  {topupAdminFee === 0 ? 'Rp 0 (Gratis)' : `Rp ${formatThousandDot(String(topupAdminFee))}`}
                </span>
              </div>
              <div className="pt-1.5 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-sm">
                <span>Total Bayar</span>
                <span className="text-[#175cd3]">Rp {formatThousandDot(String(topupTotal)) || '0'}</span>
              </div>
            </div>
          </div>

          <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className={`px-4 py-2 text-xs font-semibold rounded-xl cursor-pointer ${GRAD.light}`}>
              Tutup
            </button>
            <button
              type="button"
              onClick={() => {
                if (parsedTopup < 10000) {
                  showToast('Minimal nominal top-up Rp 10.000', 'warning');
                  return;
                }
                setWalletBalance((prev) => prev + parsedTopup);
                showToast(`Top-Up Rp ${formatThousandDot(String(parsedTopup))} berhasil diproses!`, 'success');
                onClose();
              }}
              className={`px-5 py-2 text-xs font-semibold rounded-xl shadow-xs cursor-pointer ${GRAD.success}`}
            >
              Top-Up Sekarang
            </button>
          </div>
        </ModalShell>
      )}

      {/* 6. APPROVAL PENGAJUAN (APPROVE / REJECT) */}
      {activeModal === 'approval-request' && (
        <ModalShell onClose={onClose} maxWidth="max-w-lg">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-xs ${GRAD.info}`}>
                <ClipboardCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900">Approval Pengajuan #REQ-KBN-204</h4>
                <p className="text-[11px] text-slate-600">Reimbursement Perjalanan Dinas Surabaya</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] text-slate-600">Pemohon</p>
                <p className="font-semibold text-slate-900 text-sm">Raka Pratama — Sales Enterprise</p>
                <p className="text-[11px] text-slate-600 mt-0.5">Diajukan 26 Nov 2026 • 2 Lampiran Struk</p>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0 ${
                  approvalStatus === 'approved'
                    ? GRAD.success
                    : approvalStatus === 'rejected'
                      ? GRAD.danger
                      : GRAD.warning
                }`}
              >
                {approvalStatus === 'approved' ? 'Disetujui' : approvalStatus === 'rejected' ? 'Ditolak' : 'Menunggu'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl border border-slate-200">
                <p className="text-[11px] text-slate-600">Total Klaim</p>
                <p className="text-base font-bold text-slate-900 mt-0.5">Rp 3.850.000</p>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-slate-600">Lampiran Utama</p>
                  <p className="font-semibold text-slate-900 mt-0.5 truncate max-w-[140px]">Struk-Hotel-SBY.pdf</p>
                </div>
                <Paperclip className="w-4 h-4 text-[#175cd3] shrink-0" />
              </div>
            </div>

            {showRejectBox && (
              <div className="space-y-1.5 animate-in fade-in duration-150">
                <label className="font-semibold text-rose-700 block">
                  Alasan Penolakan (Wajib diisi sebelum konfirmasi tolak)
                </label>
                <textarea
                  rows={2}
                  value={approvalNote}
                  onChange={(e) => setApprovalNote(e.target.value)}
                  placeholder="Contoh: Nota restoran belum menyertakan NPWP/kwitansi resmi..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-rose-300 text-slate-900 outline-none focus:ring-2 focus:ring-rose-500/15"
                />
              </div>
            )}
          </div>

          <div className="px-6 py-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => {
                setApprovalStatus('pending');
                setShowRejectBox(false);
                setApprovalNote('');
              }}
              className="text-[11px] text-[#1351b8] hover:underline font-semibold cursor-pointer"
            >
              Reset status simulasi
            </button>
            <div className="flex items-center gap-2">
              {!showRejectBox ? (
                <button
                  type="button"
                  onClick={() => setShowRejectBox(true)}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 cursor-pointer ${GRAD.danger}`}
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Tolak
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (!approvalNote.trim()) {
                      showToast('Harap isi alasan penolakan terlebih dahulu!', 'warning');
                      return;
                    }
                    setApprovalStatus('rejected');
                    setShowRejectBox(false);
                    showToast('Pengajuan ditolak dan catatan dikirim ke pemohon.', 'warning');
                  }}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl cursor-pointer ${GRAD.danger}`}
                >
                  Konfirmasi Tolak
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setApprovalStatus('approved');
                  setShowRejectBox(false);
                  showToast('Pengajuan #REQ-KBN-204 resmi disetujui!', 'success');
                }}
                className={`px-4 py-2 text-xs font-semibold rounded-xl shadow-xs inline-flex items-center gap-1.5 cursor-pointer ${GRAD.success}`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Setujui
              </button>
            </div>
          </div>
        </ModalShell>
      )}

      {/* 7. MULTI-STEP FORM WIZARD (3 TAHAP) */}
      {activeModal === 'wizard-stepper' && (
        <ModalShell onClose={onClose} maxWidth="max-w-xl">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900">Wizard Buat Proyek Baru</h4>
              <p className="text-[11px] text-slate-600">Langkah {wizardStep} dari 3 — pengisian bertahap terstruktur</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="px-6 pt-5 pb-2">
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { step: 1 as const, title: 'Info Dasar' },
                { step: 2 as const, title: 'Jadwal & Akses' },
                { step: 3 as const, title: 'Konfirmasi' },
              ].map((s) => {
                const done = wizardStep > s.step;
                const active = wizardStep === s.step;
                return (
                  <button
                    key={s.step}
                    type="button"
                    onClick={() => setWizardStep(s.step)}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                      active
                        ? 'border-[#175cd3] bg-blue-50/40'
                        : done
                          ? 'border-emerald-200'
                          : 'border-slate-200'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                        active ? GRAD.primaryStatic : done ? GRAD.success : GRAD.light
                      }`}
                    >
                      {done ? <Check className="w-3.5 h-3.5" /> : s.step}
                    </span>
                    <span className="font-semibold text-slate-900 truncate">{s.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-6 space-y-4 text-xs">
            {wizardStep === 1 && (
              <>
                <div className="space-y-1">
                  <label className="font-medium text-slate-700">Nama Proyek</label>
                  <input
                    type="text"
                    value={wizName}
                    onChange={(e) => setWizName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 outline-none focus:border-[#1351b8]"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-medium text-slate-700">Kategori</label>
                    <select
                      value={wizCategory}
                      onChange={(e) => setWizCategory(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-900 bg-white outline-none focus:border-[#1351b8]"
                    >
                      <option value="ERP & HR System">ERP &amp; HR System</option>
                      <option value="Mobile Commerce">Mobile Commerce</option>
                      <option value="Design System">Design System</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-medium text-slate-700">Estimasi Anggaran</label>
                    <div className="flex rounded-xl border border-slate-200 overflow-hidden bg-white focus-within:border-[#1351b8]">
                      <div className="px-3 py-2.5 border-r border-slate-200 font-semibold text-slate-700 select-none">
                        Rp
                      </div>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={formatThousandDot(wizBudget)}
                        onChange={(e) => setWizBudget(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-3 py-2.5 text-slate-900 outline-none bg-transparent"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {wizardStep === 2 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-medium text-slate-700">Target Selesai</label>
                    <input
                      type="date"
                      value={wizDeadline}
                      onChange={(e) => setWizDeadline(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 outline-none focus:border-[#1351b8]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-medium text-slate-700">Prioritas</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['Standard', 'High Priority'] as const).map((prio) => (
                        <button
                          key={prio}
                          type="button"
                          onClick={() => setWizPriority(prio)}
                          className={`py-2.5 px-2.5 rounded-xl font-semibold cursor-pointer ${
                            wizPriority === prio ? GRAD.primary : GRAD.light
                          }`}
                        >
                          {prio}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-medium text-slate-700 block">Visibilitas Workspace</label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { id: 'internal' as const, label: 'Tim Internal', sub: 'Hanya anggota diundang' },
                      { id: 'public' as const, label: 'Seluruh Organisasi', sub: 'Semua staf dapat melihat' },
                    ].map((vis) => (
                      <button
                        key={vis.id}
                        type="button"
                        onClick={() => setWizVisibility(vis.id)}
                        className={`p-3 rounded-xl border text-left cursor-pointer ${
                          wizVisibility === vis.id ? 'border-[#175cd3] bg-blue-50/40' : 'border-slate-200'
                        }`}
                      >
                        <p className="font-semibold text-slate-900">{vis.label}</p>
                        <p className="text-[11px] text-slate-600">{vis.sub}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={wizNotifyEmail}
                    onChange={(e) => setWizNotifyEmail(e.target.checked)}
                    className="w-4 h-4 rounded-sm text-[#175cd3]"
                  />
                  <span>Kirim ringkasan pembuatan proyek via email ke Lead Divisi</span>
                </label>
              </>
            )}

            {wizardStep === 3 && (
              <div className="p-4 rounded-xl border border-slate-200 space-y-2.5">
                <p className="font-bold text-slate-900 text-sm">Ringkasan Data Proyek</p>
                <div className="grid grid-cols-2 gap-y-2 text-xs">
                  <span className="text-slate-600">Nama Proyek</span>
                  <span className="font-semibold text-slate-900 text-right">{wizName}</span>
                  <span className="text-slate-600">Kategori</span>
                  <span className="font-medium text-slate-900 text-right">{wizCategory}</span>
                  <span className="text-slate-600">Estimasi Anggaran</span>
                  <span className="font-semibold text-[#175cd3] text-right">
                    Rp {formatThousandDot(wizBudget) || '0'}
                  </span>
                  <span className="text-slate-600">Target Deadline</span>
                  <span className="font-medium text-slate-900 text-right">{wizDeadline}</span>
                  <span className="text-slate-600">Prioritas &amp; Akses</span>
                  <span className="font-medium text-slate-900 text-right">
                    {wizPriority} • {wizVisibility === 'internal' ? 'Tim Internal' : 'Publik Org'}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => (wizardStep > 1 ? setWizardStep((prev) => (prev - 1) as 1 | 2 | 3) : onClose())}
              className={`px-4 py-2 text-xs font-semibold rounded-xl cursor-pointer ${GRAD.light}`}
            >
              {wizardStep > 1 ? 'Kembali' : 'Tutup'}
            </button>

            {wizardStep < 3 ? (
              <button
                type="button"
                onClick={() => setWizardStep((prev) => (prev + 1) as 1 | 2 | 3)}
                className={`px-5 py-2 text-xs font-semibold rounded-xl shadow-xs inline-flex items-center gap-1.5 cursor-pointer ${GRAD.primary}`}
              >
                Lanjut
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  showToast(`Proyek "${wizName}" berhasil dibuat!`, 'success');
                  setWizardStep(1);
                  onClose();
                }}
                className={`px-5 py-2 text-xs font-semibold rounded-xl shadow-xs inline-flex items-center gap-1.5 cursor-pointer ${GRAD.success}`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Buat Proyek
              </button>
            )}
          </div>
        </ModalShell>
      )}

      {/* 8. IMPORT EXCEL / CSV + VALIDATION PREVIEW */}
      {activeModal === 'csv-import' && (
        <ModalShell onClose={onClose} maxWidth="max-w-2xl">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-xs ${GRAD.primaryStatic}`}>
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900">Import Excel / CSV &amp; Validasi</h4>
                <p className="text-[11px] text-slate-600">Pratinjau pemeriksaan baris valid &amp; error sebelum impor</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-4 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-200 bg-white">
              <div className="flex items-center gap-2.5 min-w-0">
                <FileCheck2 className="w-5 h-5 text-[#175cd3] shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 truncate">{importFileName}</p>
                  <p className="text-[11px] text-slate-600">Format: .xlsx / .csv (maks 10 MB)</p>
                </div>
              </div>
              <label className={`px-3 py-1.5 rounded-lg font-semibold inline-flex items-center gap-1.5 cursor-pointer ${GRAD.light}`}>
                <UploadCloud className="w-3.5 h-3.5" />
                Ganti Berkas
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={(e) => {
                    const picked = e.target.files?.[0];
                    if (picked) {
                      setImportFileName(picked.name);
                      showToast(`File ${picked.name} dipindai!`, 'info');
                    }
                  }}
                  className="hidden"
                />
              </label>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 rounded-xl border border-slate-200">
                <p className="text-[11px] text-slate-600">Total Terbaca</p>
                <p className="text-base font-bold text-slate-900">{SAMPLE_IMPORT_ROWS.length} Baris</p>
              </div>
              <div className="p-3 rounded-xl border border-emerald-200">
                <p className="text-[11px] text-slate-600">Siap Impor (Valid)</p>
                <p className="text-base font-bold text-emerald-700">{validImportCount} Baris</p>
              </div>
              <div className="p-3 rounded-xl border border-rose-200">
                <p className="text-[11px] text-slate-600">Perlu Perbaikan</p>
                <p className="text-base font-bold text-rose-700">{errorImportCount} Baris</p>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-semibold text-slate-700">
                    <th className="py-2 px-3">Baris</th>
                    <th className="py-2 px-3">Nama</th>
                    <th className="py-2 px-3">Email</th>
                    <th className="py-2 px-3">NIK</th>
                    <th className="py-2 px-3">Validasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {SAMPLE_IMPORT_ROWS.map((r) => (
                    <tr key={r.row} className={r.valid ? '' : 'bg-rose-50/40'}>
                      <td className="py-2 px-3 font-mono">#{r.row}</td>
                      <td className="py-2 px-3 font-medium text-slate-900">{r.name}</td>
                      <td className={`py-2 px-3 ${r.valid ? '' : 'text-rose-700 font-medium'}`}>{r.email}</td>
                      <td className="py-2 px-3 font-mono">{r.nik}</td>
                      <td className="py-2 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold inline-block ${
                            r.valid ? GRAD.success : GRAD.danger
                          }`}
                        >
                          {r.note}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={skipInvalidRows}
                onChange={(e) => setSkipInvalidRows(e.target.checked)}
                className="w-4 h-4 rounded-sm text-[#175cd3]"
              />
              <span>Lewati {errorImportCount} baris error dan proses hanya {validImportCount} data valid</span>
            </label>
          </div>

          <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className={`px-4 py-2 text-xs font-semibold rounded-xl cursor-pointer ${GRAD.light}`}>
              Batal
            </button>
            <button
              type="button"
              onClick={() => {
                if (!skipInvalidRows) {
                  showToast('Centang lewati baris error atau perbaiki CSV dulu.', 'warning');
                  return;
                }
                showToast(`${validImportCount} data karyawan berhasil diimpor!`, 'success');
                onClose();
              }}
              className={`px-5 py-2 text-xs font-semibold rounded-xl shadow-xs cursor-pointer ${GRAD.primary}`}
            >
              Proses Import ({validImportCount} Data)
            </button>
          </div>
        </ModalShell>
      )}

      {/* 9. AUDIT TRAIL / HISTORY DIFF */}
      {activeModal === 'audit-trail' && (
        <ModalShell onClose={onClose} maxWidth="max-w-xl">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-xs ${GRAD.dark}`}>
                <History className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900">Audit Trail &amp; History Diff</h4>
                <p className="text-[11px] text-slate-600">Pelacakan perubahan nilai Before → After beserta metadata IP</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="px-6 pt-4 flex flex-wrap items-center gap-2">
            {[
              { id: 'all' as const, label: 'Semua Log' },
              { id: 'data' as const, label: 'Perubahan Data' },
              { id: 'security' as const, label: 'Keamanan' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setAuditFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  auditFilter === tab.id ? GRAD.primary : GRAD.light
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6 space-y-3.5 max-h-[60vh] overflow-y-auto text-xs">
            {visibleAuditLogs.map((log) => (
              <div key={log.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-900">{log.actor} <span className="font-normal text-slate-600">({log.role})</span></p>
                    <p className="text-slate-700 mt-0.5">{log.action}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${
                      log.type === 'security' ? GRAD.warning : GRAD.info
                    }`}
                  >
                    {log.type === 'security' ? 'Keamanan' : 'Perubahan'}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <p className="text-[10px] font-semibold uppercase text-slate-500">Sebelum ({log.field})</p>
                    <p className="font-mono text-rose-700 line-through mt-0.5">{log.beforeVal}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase text-slate-500">Sesudah</p>
                    <p className="font-mono font-semibold text-emerald-700 mt-0.5">{log.afterVal}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600">
                  <span>{log.time}</span>
                  <span className="font-mono">{log.ip}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className={`px-5 py-2 text-xs font-semibold rounded-xl cursor-pointer ${GRAD.primary}`}>
              Tutup Log
            </button>
          </div>
        </ModalShell>
      )}
    </>
  );
}
