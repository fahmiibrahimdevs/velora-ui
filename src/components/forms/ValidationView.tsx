import React, { useState, useRef } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  Loader2,
  Upload,
  FileCheck,
  FileWarning,
  RotateCcw,
  Send,
  ShieldCheck,
  Server,
  Sparkles,
  ChevronDown,
  Check,
  AtSign,
  ArrowRight,
} from 'lucide-react';
import { showToast, showSuccess } from '../../lib/swal';

// ============================================================================
// VALIDATION HELPERS
// ============================================================================
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_REGEX = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
const PHONE_ID_REGEX = /^(?:\+62|62|0)8[1-9][0-9]{7,11}$/;
const USERNAME_REGEX = /^[a-z0-9_]{4,16}$/;
const INVOICE_REGEX = /^INV-\d{4}-\d{4}$/;
const HEX_COLOR_REGEX = /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/;
const IPV4_REGEX = /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/;

const TAKEN_USERNAMES = ['admin', 'root', 'fahmi', 'velora', 'superuser'];

function fieldBorderClass(status: 'idle' | 'valid' | 'invalid') {
  if (status === 'valid') {
    return 'border-emerald-500 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/15';
  }
  if (status === 'invalid') {
    return 'border-rose-500 focus:border-rose-600 focus:ring-2 focus:ring-rose-500/15';
  }
  return 'border-slate-200 focus:border-[#175cd3] focus:ring-2 focus:ring-[#175cd3]/10';
}

export function ValidationView() {
  // =========================================================================
  // CARD 1: DEFAULT VALIDATION (Submit-Triggered)
  // =========================================================================
  const [defValues, setDefValues] = useState({
    name: '',
    email: '',
    subject: 'Dukungan Teknis',
    message: '',
  });
  const [defSubmitted, setDefSubmitted] = useState(false);

  const defErrors = {
    name:
      !defValues.name.trim()
        ? 'Nama wajib diisi.'
        : defValues.name.trim().length < 3
        ? 'Nama minimal 3 karakter.'
        : '',
    email:
      !defValues.email.trim()
        ? 'Email wajib diisi.'
        : !EMAIL_REGEX.test(defValues.email.trim())
        ? 'Format email tidak valid (contoh: nama@domain.com).'
        : '',
    subject: !defValues.subject.trim() ? 'Subjek wajib diisi.' : '',
    message:
      !defValues.message.trim()
        ? 'Pesan tidak boleh kosong.'
        : defValues.message.trim().length < 10
        ? `Pesan minimal 10 karakter (saat ini ${defValues.message.trim().length}).`
        : '',
  };

  const getDefStatus = (field: keyof typeof defErrors): 'idle' | 'valid' | 'invalid' => {
    if (!defSubmitted) return 'idle';
    return defErrors[field] ? 'invalid' : 'valid';
  };

  const handleDefaultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDefSubmitted(true);
    const hasError = Object.values(defErrors).some(Boolean);
    if (hasError) {
      showToast('Periksa kembali field yang bertanda merah.', 'warning');
      return;
    }
    showSuccess('Default Validation Lolos!', `Pesan dari ${defValues.name} telah tervalidasi.`);
  };

  // =========================================================================
  // CARD 2: REAL-TIME REACTIVE, ASYNC USERNAME & PASSWORD MATCHING
  // =========================================================================
  const [rtValues, setRtValues] = useState({
    username: '',
    phone: '',
    website: '',
    password: '',
    confirmPassword: '',
  });
  const [rtTouched, setRtTouched] = useState<Record<string, boolean>>({});
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const usernameTimerRef = useRef<number | null>(null);

  const handleUsernameChange = (val: string) => {
    const clean = val.toLowerCase();
    setRtValues((p) => ({ ...p, username: clean }));
    setRtTouched((p) => ({ ...p, username: true }));
    setUsernameAvailable(null);

    if (usernameTimerRef.current) {
      window.clearTimeout(usernameTimerRef.current);
    }

    if (USERNAME_REGEX.test(clean)) {
      setUsernameChecking(true);
      usernameTimerRef.current = window.setTimeout(() => {
        setUsernameChecking(false);
        setUsernameAvailable(!TAKEN_USERNAMES.includes(clean));
      }, 450);
    } else {
      setUsernameChecking(false);
    }
  };

  const pwRules = [
    { label: 'Minimal 8 karakter', pass: rtValues.password.length >= 8 },
    { label: 'Mengandung huruf besar (A-Z)', pass: /[A-Z]/.test(rtValues.password) },
    { label: 'Mengandung angka (0-9)', pass: /[0-9]/.test(rtValues.password) },
    { label: 'Mengandung simbol (!@#$%^&*)', pass: /[^A-Za-z0-9]/.test(rtValues.password) },
  ];
  const pwAllPass = pwRules.every((r) => r.pass);

  const rtErrors = {
    username: !rtValues.username
      ? 'Username wajib diisi.'
      : !USERNAME_REGEX.test(rtValues.username)
      ? 'Hanya huruf kecil, angka, underscore (4–16 karakter).'
      : usernameAvailable === false
      ? `Username "${rtValues.username}" sudah dipakai (coba selain admin/root/fahmi/velora).`
      : '',
    phone: !rtValues.phone.trim()
      ? 'Nomor HP wajib diisi.'
      : !PHONE_ID_REGEX.test(rtValues.phone.trim())
      ? 'Format harus nomor Indonesia valid (08xx / +628xx).'
      : '',
    website:
      rtValues.website.trim() && !URL_REGEX.test(rtValues.website.trim())
        ? 'URL harus diawali http:// atau https://'
        : '',
    password: !pwAllPass ? 'Password belum memenuhi seluruh kriteria keamanan.' : '',
    confirmPassword: !rtValues.confirmPassword
      ? 'Konfirmasi password wajib diisi.'
      : rtValues.confirmPassword !== rtValues.password
      ? 'Password konfirmasi tidak cocok.'
      : '',
  };

  const getRtStatus = (field: keyof typeof rtErrors): 'idle' | 'valid' | 'invalid' => {
    if (!rtTouched[field]) return 'idle';
    if (field === 'username' && usernameChecking) return 'idle';
    if (field === 'website' && !rtValues.website.trim()) return 'idle';
    return rtErrors[field] ? 'invalid' : 'valid';
  };

  const handleReactiveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRtTouched({
      username: true,
      phone: true,
      website: true,
      password: true,
      confirmPassword: true,
    });
    if (usernameChecking) {
      showToast('Tunggu pengecekan username selesai...', 'info');
      return;
    }
    if (Object.values(rtErrors).some(Boolean)) {
      showToast('Masih ada input yang belum valid.', 'warning');
      return;
    }
    showSuccess('Akun Tervalidasi!', `Username @${rtValues.username} memenuhi seluruh syarat keamanan.`);
  };

  // =========================================================================
  // CARD 3: CUSTOM CONTROLS, NUMERIC RANGE & FILE VALIDATION
  // =========================================================================
  const [ctrlDept, setCtrlDept] = useState('');
  const [ctrlPlan, setCtrlPlan] = useState('');
  const [ctrlPerms, setCtrlPerms] = useState<string[]>(['Read']);
  const [ctrlAge, setCtrlAge] = useState('22');
  const [ctrlAgree, setCtrlAgree] = useState(false);
  const [ctrlFile, setCtrlFile] = useState<{ name: string; sizeBytes: number; ext: string } | null>(
    null
  );
  const [ctrlSubmitted, setCtrlSubmitted] = useState(false);

  const togglePerm = (perm: string) => {
    setCtrlPerms((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const ageNum = Number(ctrlAge);
  const allowedExts = ['pdf', 'png', 'jpg', 'jpeg'];
  const fileError = !ctrlFile
    ? 'Lampiran dokumen wajib diunggah.'
    : !allowedExts.includes(ctrlFile.ext.toLowerCase())
    ? `Ekstensi .${ctrlFile.ext} ditolak. Hanya .pdf, .png, .jpg.`
    : ctrlFile.sizeBytes > 2 * 1024 * 1024
    ? `Ukuran ${(ctrlFile.sizeBytes / (1024 * 1024)).toFixed(2)} MB melebihi batas maksimal 2 MB.`
    : '';

  const ctrlErrors = {
    dept: !ctrlDept ? 'Pilih departemen terlebih dahulu.' : '',
    plan: !ctrlPlan ? 'Pilih salah satu paket langganan.' : '',
    perms: ctrlPerms.length < 2 ? `Pilih minimal 2 izin akses (terpilih ${ctrlPerms.length}).` : '',
    age:
      ctrlAge === '' || Number.isNaN(ageNum)
        ? 'Usia harus berupa angka.'
        : ageNum < 18 || ageNum > 65
        ? 'Usia harus berada di rentang 18 – 65 tahun.'
        : '',
    file: fileError,
    agree: !ctrlAgree ? 'Anda wajib menyetujui syarat & ketentuan.' : '',
  };

  const handleRealFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const ext = f.name.split('.').pop() || '';
    setCtrlFile({ name: f.name, sizeBytes: f.size, ext });
    setCtrlSubmitted(true);
  };

  const handleControlsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCtrlSubmitted(true);
    if (Object.values(ctrlErrors).some(Boolean)) {
      showToast('Lengkapi kontrol & file yang belum valid.', 'warning');
      return;
    }
    showSuccess('Validasi Kontrol Berhasil!', `Paket ${ctrlPlan} untuk departemen ${ctrlDept} siap diproses.`);
  };

  // =========================================================================
  // CARD 4: TOOLTIP FEEDBACK VALIDATION (Stisla Tooltip Style)
  // =========================================================================
  const [ttValues, setTtValues] = useState({
    firstName: 'Fahmi',
    lastName: 'Ibrahim',
    username: '',
    city: 'Bandung',
    postalCode: '40115',
  });
  const [ttValidated, setTtValidated] = useState(true);

  const ttErrors = {
    firstName: !ttValues.firstName.trim() ? 'Nama depan wajib diisi!' : '',
    lastName: !ttValues.lastName.trim() ? 'Nama belakang wajib diisi!' : '',
    username:
      !ttValues.username.trim() || ttValues.username.trim().length < 3
        ? 'Masukkan username unik minimal 3 huruf.'
        : '',
    city: !ttValues.city.trim() ? 'Kota domisili wajib diisi.' : '',
    postalCode: !/^\d{5}$/.test(ttValues.postalCode.trim())
      ? 'Kode pos harus tepat 5 digit angka.'
      : '',
  };

  const renderTooltipBadge = (field: keyof typeof ttErrors) => {
    if (!ttValidated) return null;
    const err = ttErrors[field];
    const isErr = Boolean(err);
    return (
      <div className="relative mt-1.5 inline-block">
        <div
          className={`w-2 h-2 rotate-45 absolute -top-1 left-3 ${
            isErr ? 'bg-rose-600' : 'bg-emerald-600'
          }`}
        />
        <div
          className={`relative px-2.5 py-1 rounded-md text-[11px] font-medium text-white shadow-sm ${
            isErr ? 'bg-rose-600' : 'bg-emerald-600'
          }`}
        >
          {err || 'Looks good!'}
        </div>
      </div>
    );
  };

  // =========================================================================
  // CARD 5: SERVER-SIDE VALIDATION SIMULATOR (HTTP 422 / 200)
  // =========================================================================
  const [srvValues, setSrvValues] = useState({
    nik: '3201010101010001',
    corpEmail: 'fahmi@gmail.com',
    promoCode: 'EXPIRED99',
  });
  const [srvLoading, setSrvLoading] = useState(false);
  const [srvResponse, setSrvResponse] = useState<{
    status: number;
    message: string;
    errors: Record<string, string[]>;
  } | null>({
    status: 422,
    message: 'The given data was invalid.',
    errors: {
      nik: ['NIK 3201010101010001 sudah terdaftar di database HR.'],
      corpEmail: ['Wajib menggunakan email resmi domain @velora.id.'],
      promoCode: ['Kode promo tidak ditemukan atau sudah kedaluwarsa.'],
    },
  });

  const handleServerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSrvLoading(true);

    window.setTimeout(() => {
      const errors: Record<string, string[]> = {};
      if (!/^\d{16}$/.test(srvValues.nik.trim())) {
        errors.nik = ['NIK harus tepat 16 digit angka.'];
      } else if (srvValues.nik.trim() === '3201010101010001') {
        errors.nik = ['NIK 3201010101010001 sudah terdaftar di database HR.'];
      }

      if (!srvValues.corpEmail.trim().toLowerCase().endsWith('@velora.id')) {
        errors.corpEmail = ['Wajib menggunakan email resmi domain @velora.id.'];
      }

      const validPromos = ['VELORA2026', 'PROMO50', ''];
      if (!validPromos.includes(srvValues.promoCode.trim().toUpperCase())) {
        errors.promoCode = ['Kode promo tidak ditemukan atau sudah kedaluwarsa.'];
      }

      setSrvLoading(false);
      if (Object.keys(errors).length > 0) {
        setSrvResponse({
          status: 422,
          message: 'The given data was invalid.',
          errors,
        });
        showToast('Server mengembalikan 422 Validation Error.', 'error');
      } else {
        setSrvResponse({
          status: 200,
          message: 'Employee record verified & saved.',
          errors: {},
        });
        showToast('200 OK — Data valid dan disimpan oleh server!', 'success');
      }
    }, 550);
  };

  // =========================================================================
  // CARD 6: CLICKABLE ERROR SUMMARY & REGEX PATTERN VALIDATOR
  // =========================================================================
  const [patValues, setPatValues] = useState({
    invoiceCode: 'INV-2026-01',
    hexColor: '#175cd3',
    ipAddress: '192.168.1.999',
  });
  const [patSubmitted, setPatSubmitted] = useState(true);

  const invRef = useRef<HTMLInputElement>(null);
  const hexRef = useRef<HTMLInputElement>(null);
  const ipRef = useRef<HTMLInputElement>(null);

  const patErrors = [
    {
      key: 'invoiceCode',
      label: 'Kode Invoice',
      message: 'Harus berformat INV-YYYY-XXXX (contoh: INV-2026-0042).',
      invalid: !INVOICE_REGEX.test(patValues.invoiceCode.trim()),
      ref: invRef,
    },
    {
      key: 'hexColor',
      label: 'Hex Color',
      message: 'Harus berformat #RGB atau #RRGGBB (contoh: #175cd3).',
      invalid: !HEX_COLOR_REGEX.test(patValues.hexColor.trim()),
      ref: hexRef,
    },
    {
      key: 'ipAddress',
      label: 'Alamat IPv4',
      message: 'Harus berupa alamat IPv4 valid (0–255 per oktet).',
      invalid: !IPV4_REGEX.test(patValues.ipAddress.trim()),
      ref: ipRef,
    },
  ];
  const activePatErrors = patSubmitted ? patErrors.filter((e) => e.invalid) : [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ========================================================================= */}
      {/* SUB-HEADER BANNER */}
      {/* ========================================================================= */}
      <div className="flex items-start gap-3">
        <div className="w-8 h-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full mt-2 shrink-0" />
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Form Validation</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Koleksi lengkap pola validasi formulir: Submit validation, real-time reactive + async check, tooltip feedback, file &amp; range rules, hingga simulasi HTTP 422 server-side error.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2-COLUMN MASONRY GRID */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* ======================================================================= */}
        {/* LEFT COLUMN */}
        {/* ======================================================================= */}
        <div className="space-y-6">
          {/* --------------------------------------------------------------------- */}
          {/* CARD 1: DEFAULT VALIDATION */}
          {/* --------------------------------------------------------------------- */}
          <form
            onSubmit={handleDefaultSubmit}
            noValidate
            className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6"
          >
            <div className="flex items-center justify-between gap-2 mb-5">
              <div>
                <h3 className="text-base font-bold text-[#175cd3] tracking-tight">Default Validation</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Validasi klasik saat tombol Submit ditekan dengan feedback valid/invalid.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[#175cd3] text-[11px] font-semibold">
                On Submit
              </span>
            </div>

            <div className="space-y-4">
              {/* Your Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Your Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={defValues.name}
                    onChange={(e) => setDefValues((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Masukkan nama lengkap..."
                    className={`w-full px-3.5 py-2.5 pr-10 bg-white border rounded-xl text-sm text-slate-800 focus:outline-none transition-all ${fieldBorderClass(
                      getDefStatus('name')
                    )}`}
                  />
                  {getDefStatus('name') === 'valid' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-3 top-1/2 -translate-y-1/2" />
                  )}
                  {getDefStatus('name') === 'invalid' && (
                    <AlertCircle className="w-4 h-4 text-rose-500 absolute right-3 top-1/2 -translate-y-1/2" />
                  )}
                </div>
                {defSubmitted && (
                  <p
                    className={`mt-1 text-xs font-medium ${
                      defErrors.name ? 'text-rose-600' : 'text-emerald-600'
                    }`}
                  >
                    {defErrors.name || 'Looks good!'}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={defValues.email}
                    onChange={(e) => setDefValues((p) => ({ ...p, email: e.target.value }))}
                    placeholder="email@perusahaan.com"
                    className={`w-full px-3.5 py-2.5 pr-10 bg-white border rounded-xl text-sm text-slate-800 focus:outline-none transition-all ${fieldBorderClass(
                      getDefStatus('email')
                    )}`}
                  />
                  {getDefStatus('email') === 'valid' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-3 top-1/2 -translate-y-1/2" />
                  )}
                  {getDefStatus('email') === 'invalid' && (
                    <AlertCircle className="w-4 h-4 text-rose-500 absolute right-3 top-1/2 -translate-y-1/2" />
                  )}
                </div>
                {defSubmitted && (
                  <p
                    className={`mt-1 text-xs font-medium ${
                      defErrors.email ? 'text-rose-600' : 'text-emerald-600'
                    }`}
                  >
                    {defErrors.email || 'Email terverifikasi!'}
                  </p>
                )}
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Subject <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={defValues.subject}
                  onChange={(e) => setDefValues((p) => ({ ...p, subject: e.target.value }))}
                  className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm text-slate-800 focus:outline-none transition-all ${fieldBorderClass(
                    getDefStatus('subject')
                  )}`}
                />
                {defSubmitted && defErrors.subject && (
                  <p className="mt-1 text-xs font-medium text-rose-600">{defErrors.subject}</p>
                )}
              </div>

              {/* Message */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Message <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-500">
                    {defValues.message.trim().length} / min 10 karakter
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={defValues.message}
                  onChange={(e) => setDefValues((p) => ({ ...p, message: e.target.value }))}
                  placeholder="Tulis pesan minimal 10 karakter..."
                  className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm text-slate-800 focus:outline-none transition-all ${fieldBorderClass(
                    getDefStatus('message')
                  )}`}
                />
                {defSubmitted && (
                  <p
                    className={`mt-1 text-xs font-medium ${
                      defErrors.message ? 'text-rose-600' : 'text-emerald-600'
                    }`}
                  >
                    {defErrors.message || 'Pesan sudah memenuhi batas panjang.'}
                  </p>
                )}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setDefValues({ name: '', email: '', subject: 'Dukungan Teknis', message: '' });
                    setDefSubmitted(false);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white text-xs font-semibold rounded-xl shadow-xs cursor-pointer transition-all active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit
                </button>
              </div>
            </div>
          </form>

          {/* --------------------------------------------------------------------- */}
          {/* CARD 2: REAL-TIME REACTIVE + ASYNC + PASSWORD CHECKLIST */}
          {/* --------------------------------------------------------------------- */}
          <form
            onSubmit={handleReactiveSubmit}
            noValidate
            className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6"
          >
            <div className="flex items-center justify-between gap-2 mb-5">
              <div>
                <h3 className="text-base font-bold text-[#175cd3] tracking-tight">
                  Real-time Reactive &amp; Async Check
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Validasi langsung saat mengetik, cek ketersediaan username, dan checklist password.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold">
                Live Rules
              </span>
            </div>

            <div className="space-y-4">
              {/* Async Username */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Username (Async Check)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={rtValues.username}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    placeholder="cth: dev_budi (coba 'admin' untuk tes dipakai)"
                    className={`w-full px-3.5 py-2.5 pr-10 bg-white border rounded-xl text-sm text-slate-800 focus:outline-none transition-all ${fieldBorderClass(
                      getRtStatus('username')
                    )}`}
                  />
                  {usernameChecking && (
                    <Loader2 className="w-4 h-4 text-[#175cd3] animate-spin absolute right-3 top-1/2 -translate-y-1/2" />
                  )}
                  {!usernameChecking && getRtStatus('username') === 'valid' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-3 top-1/2 -translate-y-1/2" />
                  )}
                  {!usernameChecking && getRtStatus('username') === 'invalid' && (
                    <AlertCircle className="w-4 h-4 text-rose-500 absolute right-3 top-1/2 -translate-y-1/2" />
                  )}
                </div>
                {rtTouched.username && (
                  <p
                    className={`mt-1 text-xs font-medium ${
                      usernameChecking
                        ? 'text-[#175cd3]'
                        : rtErrors.username
                        ? 'text-rose-600'
                        : 'text-emerald-600'
                    }`}
                  >
                    {usernameChecking
                      ? 'Mengecek ketersediaan username...'
                      : rtErrors.username || `Username @${rtValues.username} tersedia!`}
                  </p>
                )}
              </div>

              {/* Phone & Website */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    No. WhatsApp (ID)
                  </label>
                  <input
                    type="text"
                    value={rtValues.phone}
                    onChange={(e) => {
                      setRtValues((p) => ({ ...p, phone: e.target.value }));
                      setRtTouched((p) => ({ ...p, phone: true }));
                    }}
                    placeholder="081234567890"
                    className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm text-slate-800 focus:outline-none transition-all ${fieldBorderClass(
                      getRtStatus('phone')
                    )}`}
                  />
                  {rtTouched.phone && (
                    <p
                      className={`mt-1 text-xs font-medium ${
                        rtErrors.phone ? 'text-rose-600' : 'text-emerald-600'
                      }`}
                    >
                      {rtErrors.phone || 'Nomor HP valid.'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Website (Opsional)
                  </label>
                  <input
                    type="url"
                    value={rtValues.website}
                    onChange={(e) => {
                      setRtValues((p) => ({ ...p, website: e.target.value }));
                      setRtTouched((p) => ({ ...p, website: true }));
                    }}
                    placeholder="https://velora.id"
                    className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm text-slate-800 focus:outline-none transition-all ${fieldBorderClass(
                      getRtStatus('website')
                    )}`}
                  />
                  {rtTouched.website && rtValues.website.trim() && (
                    <p
                      className={`mt-1 text-xs font-medium ${
                        rtErrors.website ? 'text-rose-600' : 'text-emerald-600'
                      }`}
                    >
                      {rtErrors.website || 'URL valid.'}
                    </p>
                  )}
                </div>
              </div>

              {/* Password + Live Checklist */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Password Keamanan Tinggi
                </label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={rtValues.password}
                    onChange={(e) => {
                      setRtValues((p) => ({ ...p, password: e.target.value }));
                      setRtTouched((p) => ({ ...p, password: true }));
                    }}
                    placeholder="Masukkan password..."
                    className={`w-full px-3.5 py-2.5 pr-10 bg-white border rounded-xl text-sm text-slate-800 focus:outline-none transition-all ${fieldBorderClass(
                      getRtStatus('password')
                    )}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Live 4-rule Checklist */}
                <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {pwRules.map((rule) => (
                    <div
                      key={rule.label}
                      className={`flex items-center gap-1.5 text-xs ${
                        rule.pass ? 'text-emerald-600 font-medium' : 'text-slate-500'
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                          rule.pass ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        <Check className="w-2.5 h-2.5" />
                      </span>
                      <span>{rule.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPw ? 'text' : 'password'}
                    value={rtValues.confirmPassword}
                    onChange={(e) => {
                      setRtValues((p) => ({ ...p, confirmPassword: e.target.value }));
                      setRtTouched((p) => ({ ...p, confirmPassword: true }));
                    }}
                    placeholder="Ulangi password..."
                    className={`w-full px-3.5 py-2.5 pr-10 bg-white border rounded-xl text-sm text-slate-800 focus:outline-none transition-all ${fieldBorderClass(
                      getRtStatus('confirmPassword')
                    )}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPw(!showConfirmPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {rtTouched.confirmPassword && (
                  <p
                    className={`mt-1 text-xs font-medium ${
                      rtErrors.confirmPassword ? 'text-rose-600' : 'text-emerald-600'
                    }`}
                  >
                    {rtErrors.confirmPassword || 'Password cocok!'}
                  </p>
                )}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white text-xs font-semibold rounded-xl shadow-xs cursor-pointer transition-all active:scale-95"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Validasi &amp; Daftar
                </button>
              </div>
            </div>
          </form>

          {/* --------------------------------------------------------------------- */}
          {/* CARD 3: CUSTOM CONTROLS, RANGE & FILE VALIDATION */}
          {/* --------------------------------------------------------------------- */}
          <form
            onSubmit={handleControlsSubmit}
            noValidate
            className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6"
          >
            <div className="flex items-center justify-between gap-2 mb-5">
              <div>
                <h3 className="text-base font-bold text-[#175cd3] tracking-tight">
                  Custom Controls, Range &amp; File Validation
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Validasi dropdown, minimal pilihan checkbox, batas angka, dan ekstensi/ukuran file.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Department Select & Age Range */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Departemen <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={ctrlDept}
                      onChange={(e) => setCtrlDept(e.target.value)}
                      className={`w-full appearance-none px-3.5 py-2.5 bg-white border rounded-xl text-sm text-slate-800 focus:outline-none pr-9 cursor-pointer ${
                        ctrlSubmitted
                          ? fieldBorderClass(ctrlErrors.dept ? 'invalid' : 'valid')
                          : 'border-slate-200 focus:border-[#175cd3]'
                      }`}
                    >
                      <option value="">-- Pilih Departemen --</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Product Design">Product Design</option>
                      <option value="QA & Security">QA &amp; Security</option>
                      <option value="DevOps">DevOps</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  {ctrlSubmitted && ctrlErrors.dept && (
                    <p className="mt-1 text-xs font-medium text-rose-600">{ctrlErrors.dept}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Usia Kandidat (18–65)
                  </label>
                  <input
                    type="number"
                    value={ctrlAge}
                    onChange={(e) => setCtrlAge(e.target.value)}
                    className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm text-slate-800 focus:outline-none transition-all ${
                      ctrlSubmitted || ctrlAge !== '22'
                        ? fieldBorderClass(ctrlErrors.age ? 'invalid' : 'valid')
                        : 'border-slate-200 focus:border-[#175cd3]'
                    }`}
                  />
                  {(ctrlSubmitted || ctrlAge !== '22') && ctrlErrors.age && (
                    <p className="mt-1 text-xs font-medium text-rose-600">{ctrlErrors.age}</p>
                  )}
                </div>
              </div>

              {/* Radio Group (Plan Tier) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Paket Langganan <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {['Starter', 'Pro', 'Enterprise'].map((tier) => {
                    const active = ctrlPlan === tier;
                    return (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => setCtrlPlan(tier)}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                          active
                            ? 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] border-[#175cd3] text-white shadow-xs'
                            : ctrlSubmitted && ctrlErrors.plan
                            ? 'bg-white border-rose-300 text-slate-700 hover:bg-rose-50/40'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {tier}
                      </button>
                    );
                  })}
                </div>
                {ctrlSubmitted && ctrlErrors.plan && (
                  <p className="mt-1 text-xs font-medium text-rose-600">{ctrlErrors.plan}</p>
                )}
              </div>

              {/* Checkbox Group (Min 2 Required) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-700">
                    Izin Akses (Minimal 2) <span className="text-rose-500">*</span>
                  </label>
                  <span
                    className={`text-[11px] font-semibold ${
                      ctrlPerms.length >= 2 ? 'text-emerald-600' : 'text-amber-600'
                    }`}
                  >
                    {ctrlPerms.length} terpilih
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Read', 'Write', 'Delete', 'Export', 'Admin'].map((perm) => {
                    const checked = ctrlPerms.includes(perm);
                    return (
                      <label
                        key={perm}
                        onClick={() => togglePerm(perm)}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium cursor-pointer select-none transition-all ${
                          checked
                            ? 'bg-blue-50 border-[#175cd3] text-[#175cd3] font-semibold'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded flex items-center justify-center ${
                            checked ? 'bg-[#175cd3] text-white' : 'border border-slate-300 bg-white'
                          }`}
                        >
                          {checked && <Check className="w-3 h-3" />}
                        </span>
                        <span>{perm}</span>
                      </label>
                    );
                  })}
                </div>
                {ctrlSubmitted && ctrlErrors.perms && (
                  <p className="mt-1 text-xs font-medium text-rose-600">{ctrlErrors.perms}</p>
                )}
              </div>

              {/* File Upload + Quick Edge Case Simulators */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Dokumen Pendukung (.pdf, .png, .jpg • Maks 2 MB)
                  </label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setCtrlFile({ name: 'portofolio.pdf', sizeBytes: 840 * 1024, ext: 'pdf' });
                        setCtrlSubmitted(true);
                      }}
                      className="text-[11px] text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-md font-medium cursor-pointer"
                    >
                      Tes File Valid
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCtrlFile({ name: 'video-demo.mp4', sizeBytes: 5 * 1024 * 1024, ext: 'mp4' });
                        setCtrlSubmitted(true);
                      }}
                      className="text-[11px] text-rose-700 bg-rose-50 hover:bg-rose-100 px-2 py-0.5 rounded-md font-medium cursor-pointer"
                    >
                      Tes File Salah
                    </button>
                  </div>
                </div>

                <label
                  className={`flex items-center gap-3 p-3.5 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
                    ctrlSubmitted && ctrlErrors.file
                      ? 'border-rose-400 bg-rose-50/30'
                      : ctrlFile && !ctrlErrors.file
                      ? 'border-emerald-400 bg-emerald-50/30'
                      : 'border-slate-200 hover:border-[#175cd3] bg-slate-50/40'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
                    {ctrlFile && ctrlErrors.file ? (
                      <FileWarning className="w-4 h-4 text-rose-500" />
                    ) : ctrlFile ? (
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Upload className="w-4 h-4 text-[#175cd3]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-slate-800 truncate">
                      {ctrlFile ? ctrlFile.name : 'Klik untuk pilih file dari perangkat'}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {ctrlFile
                        ? `${(ctrlFile.sizeBytes / 1024).toFixed(0)} KB • .${ctrlFile.ext}`
                        : 'Maksimal 2 MB (PDF, PNG, JPG)'}
                    </div>
                  </div>
                  <input type="file" onChange={handleRealFileUpload} className="sr-only" />
                </label>
                {ctrlSubmitted && ctrlErrors.file && (
                  <p className="mt-1 text-xs font-medium text-rose-600">{ctrlErrors.file}</p>
                )}
              </div>

              {/* Terms Toggle */}
              <div>
                <label
                  onClick={() => setCtrlAgree(!ctrlAgree)}
                  className="inline-flex items-center gap-2.5 cursor-pointer select-none"
                >
                  <div
                    className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                      ctrlAgree ? 'bg-[#175cd3]' : 'bg-slate-200'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-xs transform transition-transform ${
                        ctrlAgree ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </div>
                  <span className="text-xs text-slate-700">
                    Saya menyetujui kebijakan privasi &amp; syarat layanan
                  </span>
                </label>
                {ctrlSubmitted && ctrlErrors.agree && (
                  <p className="mt-1 text-xs font-medium text-rose-600">{ctrlErrors.agree}</p>
                )}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white text-xs font-semibold rounded-xl shadow-xs cursor-pointer transition-all active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Validasi Kontrol
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* ======================================================================= */}
        {/* RIGHT COLUMN */}
        {/* ======================================================================= */}
        <div className="space-y-6">
          {/* --------------------------------------------------------------------- */}
          {/* CARD 4: TOOLTIP FEEDBACK VALIDATION (Stisla Style) */}
          {/* --------------------------------------------------------------------- */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
              <div>
                <h3 className="text-base font-bold text-[#175cd3] tracking-tight">
                  Tooltip Feedback Validation
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pesan valid/error tampil sebagai badge tooltip mengambang di bawah tiap input.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setTtValues({
                    firstName: 'Fahmi',
                    lastName: 'Ibrahim',
                    username: 'fahmiibrahim',
                    city: 'Bandung',
                    postalCode: '40115',
                  });
                  setTtValidated(true);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-[#175cd3] text-[11px] font-semibold rounded-lg cursor-pointer transition-colors"
              >
                <Sparkles className="w-3 h-3" />
                Isi Semua Valid
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={ttValues.firstName}
                    onChange={(e) => setTtValues((p) => ({ ...p, firstName: e.target.value }))}
                    className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm text-slate-800 focus:outline-none ${
                      ttValidated
                        ? fieldBorderClass(ttErrors.firstName ? 'invalid' : 'valid')
                        : 'border-slate-200'
                    }`}
                  />
                  {renderTooltipBadge('firstName')}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={ttValues.lastName}
                    onChange={(e) => setTtValues((p) => ({ ...p, lastName: e.target.value }))}
                    className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm text-slate-800 focus:outline-none ${
                      ttValidated
                        ? fieldBorderClass(ttErrors.lastName ? 'invalid' : 'valid')
                        : 'border-slate-200'
                    }`}
                  />
                  {renderTooltipBadge('lastName')}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Username
                </label>
                <div
                  className={`flex rounded-xl border overflow-hidden transition-all ${
                    ttValidated
                      ? ttErrors.username
                        ? 'border-rose-500'
                        : 'border-emerald-500'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="px-3.5 py-2.5 bg-slate-50 border-r border-slate-200 text-slate-500 flex items-center justify-center shrink-0">
                    <AtSign className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={ttValues.username}
                    onChange={(e) => setTtValues((p) => ({ ...p, username: e.target.value }))}
                    placeholder="username"
                    className="w-full px-3.5 py-2.5 bg-white text-sm text-slate-800 focus:outline-none"
                  />
                </div>
                {renderTooltipBadge('username')}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">City</label>
                  <input
                    type="text"
                    value={ttValues.city}
                    onChange={(e) => setTtValues((p) => ({ ...p, city: e.target.value }))}
                    className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm text-slate-800 focus:outline-none ${
                      ttValidated
                        ? fieldBorderClass(ttErrors.city ? 'invalid' : 'valid')
                        : 'border-slate-200'
                    }`}
                  />
                  {renderTooltipBadge('city')}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Postal Code (5 Digit)
                  </label>
                  <input
                    type="text"
                    value={ttValues.postalCode}
                    onChange={(e) => setTtValues((p) => ({ ...p, postalCode: e.target.value }))}
                    className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm text-slate-800 focus:outline-none ${
                      ttValidated
                        ? fieldBorderClass(ttErrors.postalCode ? 'invalid' : 'valid')
                        : 'border-slate-200'
                    }`}
                  />
                  {renderTooltipBadge('postalCode')}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setTtValidated(false)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer transition-colors"
                >
                  Sembunyikan Tooltip
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTtValidated(true);
                    const ok = Object.values(ttErrors).every((v) => !v);
                    if (ok) {
                      showSuccess('Tooltip Validation Lolos!', 'Seluruh field alamat telah valid.');
                    } else {
                      showToast('Perbaiki tooltip berwarna merah.', 'warning');
                    }
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white text-xs font-semibold rounded-xl shadow-xs cursor-pointer transition-all active:scale-95"
                >
                  Submit Tooltip Form
                </button>
              </div>
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* CARD 5: SERVER-SIDE VALIDATION SIMULATOR (HTTP 422 / 200) */}
          {/* --------------------------------------------------------------------- */}
          <form
            onSubmit={handleServerSubmit}
            noValidate
            className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
              <div>
                <h3 className="text-base font-bold text-[#175cd3] tracking-tight">
                  Server-Side Error Simulator
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Simulasi pemetaan respons error HTTP 422 dari backend API ke tiap field.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSrvValues({
                    nik: '3201999988887777',
                    corpEmail: 'fahmi@velora.id',
                    promoCode: 'VELORA2026',
                  });
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-semibold rounded-lg cursor-pointer transition-colors"
              >
                <Server className="w-3 h-3" />
                Isi Payload Valid
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  NIK Karyawan (16 Digit)
                </label>
                <input
                  type="text"
                  value={srvValues.nik}
                  onChange={(e) => setSrvValues((p) => ({ ...p, nik: e.target.value }))}
                  className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm text-slate-800 focus:outline-none ${
                    srvResponse
                      ? fieldBorderClass(srvResponse.errors.nik ? 'invalid' : 'valid')
                      : 'border-slate-200'
                  }`}
                />
                {srvResponse?.errors.nik && (
                  <p className="mt-1 text-xs font-medium text-rose-600">{srvResponse.errors.nik[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Corporate Email (@velora.id)
                </label>
                <input
                  type="email"
                  value={srvValues.corpEmail}
                  onChange={(e) => setSrvValues((p) => ({ ...p, corpEmail: e.target.value }))}
                  className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm text-slate-800 focus:outline-none ${
                    srvResponse
                      ? fieldBorderClass(srvResponse.errors.corpEmail ? 'invalid' : 'valid')
                      : 'border-slate-200'
                  }`}
                />
                {srvResponse?.errors.corpEmail && (
                  <p className="mt-1 text-xs font-medium text-rose-600">
                    {srvResponse.errors.corpEmail[0]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Kode Promo (Coba: VELORA2026)
                </label>
                <input
                  type="text"
                  value={srvValues.promoCode}
                  onChange={(e) => setSrvValues((p) => ({ ...p, promoCode: e.target.value }))}
                  className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm text-slate-800 uppercase focus:outline-none ${
                    srvResponse
                      ? fieldBorderClass(srvResponse.errors.promoCode ? 'invalid' : 'valid')
                      : 'border-slate-200'
                  }`}
                />
                {srvResponse?.errors.promoCode && (
                  <p className="mt-1 text-xs font-medium text-rose-600">
                    {srvResponse.errors.promoCode[0]}
                  </p>
                )}
              </div>

              {/* JSON Response Inspector */}
              {srvResponse && (
                <div className="rounded-xl border border-slate-200 overflow-hidden">
                  <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-700">API Response Payload</span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold ${
                        srvResponse.status === 200
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      HTTP {srvResponse.status}
                    </span>
                  </div>
                  <pre className="code-editor-mono bg-[#0f172a] text-slate-200 p-3 text-[11px] leading-5 overflow-x-auto m-0">
                    {JSON.stringify(srvResponse, null, 2)}
                  </pre>
                </div>
              )}

              <div className="pt-1 flex justify-end">
                <button
                  type="submit"
                  disabled={srvLoading}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] disabled:opacity-60 text-white text-xs font-semibold rounded-xl shadow-xs cursor-pointer transition-all active:scale-95"
                >
                  {srvLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Server className="w-4 h-4" />
                  )}
                  <span>{srvLoading ? 'Mengirim ke API...' : 'Simulasikan Request API'}</span>
                </button>
              </div>
            </div>
          </form>

          {/* --------------------------------------------------------------------- */}
          {/* CARD 6: CLICKABLE ERROR SUMMARY & REGEX PATTERN VALIDATOR */}
          {/* --------------------------------------------------------------------- */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setPatSubmitted(true);
              const errs = patErrors.filter((item) => item.invalid);
              if (errs.length === 0) {
                showSuccess('Pola Regex Valid!', 'Seluruh format Invoice, HEX, dan IPv4 benar.');
              } else {
                showToast(`Ditemukan ${errs.length} kesalahan format.`, 'warning');
              }
            }}
            noValidate
            className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6"
          >
            <div className="flex items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-base font-bold text-[#175cd3] tracking-tight">
                  Error Summary Banner &amp; Regex Pattern
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ringkasan error terpusat di atas form — klik item error untuk langsung fokus ke input.
                </p>
              </div>
            </div>

            {/* Interactive Error Summary Banner */}
            {activePatErrors.length > 0 && (
              <div className="mb-4 p-3.5 rounded-xl border border-rose-200 bg-rose-50/70 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-700">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Terdapat {activePatErrors.length} format yang perlu diperbaiki:</span>
                </div>
                <ul className="space-y-1 pl-1">
                  {activePatErrors.map((err) => (
                    <li key={err.key}>
                      <button
                        type="button"
                        onClick={() => err.ref.current?.focus()}
                        className="inline-flex items-center gap-1.5 text-left text-xs text-rose-700 hover:text-rose-900 hover:underline cursor-pointer"
                      >
                        <ArrowRight className="w-3 h-3 shrink-0" />
                        <span>
                          <strong>{err.label}:</strong> {err.message}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Kode Invoice (Regex: <code className="text-[#175cd3]">INV-YYYY-XXXX</code>)
                </label>
                <input
                  ref={invRef}
                  type="text"
                  value={patValues.invoiceCode}
                  onChange={(e) => setPatValues((p) => ({ ...p, invoiceCode: e.target.value }))}
                  className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm text-slate-800 focus:outline-none ${
                    patSubmitted
                      ? fieldBorderClass(patErrors[0].invalid ? 'invalid' : 'valid')
                      : 'border-slate-200'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    HEX Color
                  </label>
                  <div className="relative">
                    <input
                      ref={hexRef}
                      type="text"
                      value={patValues.hexColor}
                      onChange={(e) => setPatValues((p) => ({ ...p, hexColor: e.target.value }))}
                      className={`w-full px-3.5 py-2.5 pr-10 bg-white border rounded-xl text-sm text-slate-800 focus:outline-none ${
                        patSubmitted
                          ? fieldBorderClass(patErrors[1].invalid ? 'invalid' : 'valid')
                          : 'border-slate-200'
                      }`}
                    />
                    <span
                      style={{
                        backgroundColor: HEX_COLOR_REGEX.test(patValues.hexColor.trim())
                          ? patValues.hexColor.trim()
                          : '#e2e8f0',
                      }}
                      className="w-5 h-5 rounded-md border border-slate-200 absolute right-3 top-1/2 -translate-y-1/2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Alamat IPv4
                  </label>
                  <input
                    ref={ipRef}
                    type="text"
                    value={patValues.ipAddress}
                    onChange={(e) => setPatValues((p) => ({ ...p, ipAddress: e.target.value }))}
                    className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm text-slate-800 focus:outline-none ${
                      patSubmitted
                        ? fieldBorderClass(patErrors[2].invalid ? 'invalid' : 'valid')
                        : 'border-slate-200'
                    }`}
                  />
                </div>
              </div>

              <div className="pt-1 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setPatValues({
                      invoiceCode: 'INV-2026-0042',
                      hexColor: '#175cd3',
                      ipAddress: '192.168.1.10',
                    })
                  }
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer transition-colors"
                >
                  Isi Contoh Valid
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white text-xs font-semibold rounded-xl shadow-xs cursor-pointer transition-all active:scale-95"
                >
                  Periksa Pola
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
