import React, { useState } from 'react';
import {
  Bookmark,
  CheckCircle2,
  CreditCard,
  Heart,
  Mail,
  MessageSquare,
  Phone,
  Plus,
  Send,
  ShieldCheck,
  Sparkles,
  UserCheck,
  UserPlus,
} from 'lucide-react';
import { showToast } from '../../lib/swal';
import { FeatureSectionHeader } from '../features/FeatureSectionHeader';
import { formatThousandDot, GRAD } from './modalShared';
import {
  CardContentShowcaseExtra,
  type CardShowcaseCategory,
} from './CardContentShowcaseExtra';

export function CardContentShowcaseSection() {
  const [filter, setFilter] = useState<CardShowcaseCategory>('all');
  // 1. Profile Card state
  const [following, setFollowing] = useState(false);

  // 2. Quick Form Card state
  const [reqTitle, setReqTitle] = useState('Perjalanan Dinas Klien Surabaya');
  const [reqCategory, setReqCategory] = useState('Operasional Proyek');
  const [reqBudget, setReqBudget] = useState('1500000');
  const [reqNotes, setReqNotes] = useState('Tiket transport PP dan akomodasi hotel 2 malam.');
  const [reqConfirm, setReqConfirm] = useState(true);

  // 3. Checklist / Sprint Card state
  const [todoItems, setTodoItems] = useState([
    { id: 't1', label: 'Setup Autentikasi & 2FA Passkey', done: true },
    { id: 't2', label: 'Integrasi Payment Gateway QRIS', done: true },
    { id: 't3', label: 'UAT Portal Klien & Bukti Transfer PDF', done: false },
    { id: 't4', label: 'Deploy Release Staging v2.6', done: false },
  ]);
  const [newTodo, setNewTodo] = useState('');

  // 4. Stats Period state
  const [statsPeriod, setStatsPeriod] = useState<'month' | 'quarter'>('month');

  // 5. Article Card state
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  // 6. Feature Toggles Card state
  const [toggle2FA, setToggle2FA] = useState(true);
  const [toggleWebhook, setToggleWebhook] = useState(true);
  const [toggleMaintenance, setToggleMaintenance] = useState(false);

  const doneCount = todoItems.filter((t) => t.done).length;
  const todoPct = todoItems.length ? Math.round((doneCount / todoItems.length) * 100) : 0;

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newTodo.trim();
    if (!clean) return;
    setTodoItems((prev) => [...prev, { id: `t-${Date.now()}`, label: clean, done: false }]);
    setNewTodo('');
  };

  const show = (cat: Exclude<CardShowcaseCategory, 'all'>) => filter === 'all' || filter === cat;

  return (
    <div className="space-y-6">
      <FeatureSectionHeader
        title="Card Content Variations (19 Examples)"
        description="Koleksi lengkap berbagai variasi isi konten Card: Profil, Form Input, Checklist Sprint, Produk E-Commerce, Corporate Card, Tim, Tabel Ringkas, Grafik Bar, FAQ Accordion, hingga Timeline."
      />

      {/* Cardless Filter Strip matching Velora UI standards */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'all' as const, label: 'Semua Card (19)' },
          { id: 'forms' as const, label: 'Form, Upload & API (5)' },
          { id: 'team' as const, label: 'Profil, Tim & Chat (4)' },
          { id: 'finance' as const, label: 'Finance, Produk & Tabel (6)' },
          { id: 'content' as const, label: 'Artikel, Grafik & FAQ (4)' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
              filter === tab.id ? `${GRAD.primary} shadow-xs` : GRAD.light
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
        {/* 1. PROFILE CARD */}
        {show('team') && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] relative">
            <span className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${GRAD.success}`}>
              Online
            </span>
          </div>
          <div className="px-6 pb-6 -mt-10 relative space-y-4">
            <div className="flex items-end justify-between gap-3">
              <div className="w-20 h-20 rounded-2xl bg-white p-1 shadow-md border border-slate-100">
                <div className={`w-full h-full rounded-xl flex items-center justify-center text-lg font-extrabold ${GRAD.info}`}>
                  NK
                </div>
              </div>
              <div className="flex gap-2 pb-1">
                <button
                  type="button"
                  onClick={() => {
                    setFollowing((prev) => !prev);
                    showToast(following ? 'Berhenti mengikuti Nadia Kusuma' : 'Mengikuti Nadia Kusuma!', 'info');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer ${
                    following ? GRAD.success : GRAD.primary
                  }`}
                >
                  {following ? <UserCheck className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                  {following ? 'Following' : 'Follow'}
                </button>
                <button
                  type="button"
                  onClick={() => showToast('Membuka pesan untuk Nadia Kusuma', 'info')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1 cursor-pointer ${GRAD.light}`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Chat
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-base font-bold text-slate-900">Nadia Kusuma</h4>
              <p className="text-xs text-slate-600">Product Design Lead • Velora Studio</p>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600">
              <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-[#175cd3]" /> nadia@velora.id</p>
              <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-[#175cd3]" /> +62 812-8800-4455</p>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center">
              <div className="p-2 rounded-xl border border-slate-100">
                <p className="text-sm font-bold text-slate-900">24</p>
                <p className="text-[11px] text-slate-600">Proyek</p>
              </div>
              <div className="p-2 rounded-xl border border-slate-100">
                <p className="text-sm font-bold text-slate-900">98%</p>
                <p className="text-[11px] text-slate-600">On-Time</p>
              </div>
              <div className="p-2 rounded-xl border border-slate-100">
                <p className="text-sm font-bold text-[#175cd3]">4.9 ★</p>
                <p className="text-[11px] text-slate-600">Rating</p>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* 2. QUICK FORM INPUT CARD */}
        {show('forms') && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            showToast(`Pengajuan "${reqTitle}" sebesar Rp ${formatThousandDot(reqBudget) || '0'} tersimpan!`, 'success');
          }}
          className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden flex flex-col justify-between"
        >
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h4 className="text-sm sm:text-base font-bold text-[#1351b8]">Form Input Pengajuan</h4>
              <p className="text-[11px] text-slate-600">Contoh form lengkap di dalam card</p>
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${GRAD.info}`}>
              Form Card
            </span>
          </div>

          <div className="p-6 space-y-3.5 text-xs">
            <div className="space-y-1">
              <label className="font-medium text-slate-700 block">Judul Pengajuan</label>
              <input
                type="text"
                required
                value={reqTitle}
                onChange={(e) => setReqTitle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 outline-none focus:border-[#1351b8]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-medium text-slate-700 block">Kategori</label>
                <select
                  value={reqCategory}
                  onChange={(e) => setReqCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 bg-white outline-none focus:border-[#1351b8]"
                >
                  <option value="Operasional Proyek">Operasional Proyek</option>
                  <option value="Lisensi Cloud">Lisensi Cloud</option>
                  <option value="Reimbursement">Reimbursement</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-medium text-slate-700 block">Estimasi Biaya</label>
                <div className="flex rounded-xl border border-slate-200 overflow-hidden bg-white focus-within:border-[#1351b8]">
                  <span className="px-2.5 py-2 border-r border-slate-200 font-semibold text-slate-700 select-none">
                    Rp
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formatThousandDot(reqBudget)}
                    onChange={(e) => setReqBudget(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-2.5 py-2 text-slate-900 outline-none bg-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-medium text-slate-700 block">Keterangan Singkat</label>
              <textarea
                rows={2}
                value={reqNotes}
                onChange={(e) => setReqNotes(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 outline-none focus:border-[#1351b8]"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={reqConfirm}
                onChange={(e) => setReqConfirm(e.target.checked)}
                className="w-4 h-4 rounded-sm text-[#175cd3]"
              />
              <span>Data pengajuan sudah sesuai bukti</span>
            </label>
          </div>

          <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setReqTitle('');
                setReqBudget('');
                setReqNotes('');
              }}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl cursor-pointer ${GRAD.light}`}
            >
              Reset
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 cursor-pointer ${GRAD.primary}`}
            >
              <Send className="w-3.5 h-3.5" />
              Kirim Form
            </button>
          </div>
        </form>
        )}

        {/* 3. CHECKLIST & PROGRESS TRACKER CARD */}
        {show('forms') && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-2">
            <div>
              <h4 className="text-sm sm:text-base font-bold text-[#1351b8]">Sprint Checklist</h4>
              <p className="text-[11px] text-slate-600">{doneCount} dari {todoItems.length} item selesai</p>
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${GRAD.primaryStatic}`}>
              {todoPct}%
            </span>
          </div>

          <div className="p-6 space-y-4 text-xs">
            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                style={{ width: `${todoPct}%` }}
                className="h-full bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] transition-all duration-300"
              />
            </div>

            <div className="space-y-2 max-h-44 overflow-y-auto">
              {todoItems.map((it) => (
                <label
                  key={it.id}
                  className="p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 flex items-center gap-2.5 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={it.done}
                    onChange={() =>
                      setTodoItems((prev) =>
                        prev.map((row) => (row.id === it.id ? { ...row, done: !row.done } : row)),
                      )
                    }
                    className="w-4 h-4 rounded-sm text-[#175cd3]"
                  />
                  <span className={it.done ? 'line-through text-slate-500' : 'font-medium text-slate-800'}>
                    {it.label}
                  </span>
                </label>
              ))}
            </div>

            <form onSubmit={handleAddTodo} className="flex gap-2">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Tambah item baru..."
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-slate-900 outline-none focus:border-[#1351b8]"
              />
              <button
                type="submit"
                className={`px-3 py-2 rounded-xl font-semibold inline-flex items-center cursor-pointer ${GRAD.primary}`}
                aria-label="Tambah"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
        )}

        {/* 4. REVENUE & BREAKDOWN METRICS CARD */}
        {show('finance') && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-2">
            <h4 className="text-sm sm:text-base font-bold text-[#1351b8]">Ringkasan Pendapatan</h4>
            <div className="flex gap-1">
              {[
                { id: 'month' as const, label: 'Bulan Ini' },
                { id: 'quarter' as const, label: 'Q4' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setStatsPeriod(p.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer ${
                    statsPeriod === p.id ? GRAD.primary : GRAD.light
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 space-y-4 text-xs">
            <div className="flex items-end justify-between gap-2">
              <div>
                <p className="text-[11px] text-slate-600">Total Proyek &amp; Retainer</p>
                <p className="text-2xl font-extrabold text-slate-900 mt-0.5">
                  {statsPeriod === 'month' ? 'Rp 148.500.000' : 'Rp 412.000.000'}
                </p>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${GRAD.success}`}>
                {statsPeriod === 'month' ? '+18.4%' : '+24.1%'}
              </span>
            </div>

            <div className="space-y-3 pt-1">
              {[
                { label: 'Web & ERP Development', pct: statsPeriod === 'month' ? 54 : 58, grad: 'from-[#175cd3] to-[#0f3ba0]' },
                { label: 'Mobile App iOS / Android', pct: statsPeriod === 'month' ? 31 : 27, grad: 'from-[#0ea5e9] to-[#0284c7]' },
                { label: 'Maintenance & SLA Retainer', pct: 15, grad: 'from-[#22c55e] to-[#15803d]' },
              ].map((bar) => (
                <div key={bar.label} className="space-y-1">
                  <div className="flex justify-between font-medium text-slate-700">
                    <span>{bar.label}</span>
                    <span className="font-bold text-slate-900">{bar.pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      style={{ width: `${bar.pct}%` }}
                      className={`h-full bg-gradient-to-r ${bar.grad} transition-all duration-300`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        )}

        {/* 5. SUBSCRIPTION / BILLING SUMMARY CARD */}
        {show('finance') && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#175cd3]" />
              <h4 className="text-sm sm:text-base font-bold text-[#1351b8]">Paket &amp; Kuota Tim</h4>
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${GRAD.warning}`}>
              Velora Pro
            </span>
          </div>

          <div className="p-6 space-y-4 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 text-sm">Rp 1.490.000 / bln</p>
                <p className="text-[11px] text-slate-600 mt-0.5">Perpanjangan otomatis 15 Des 2026</p>
              </div>
              <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="font-medium text-slate-700">Kursi Anggota Terpakai</span>
                <span className="font-bold text-slate-900">18 / 25 Seat</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#f59e0b] to-[#d97706]" style={{ width: '72%' }} />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-600">
              <span>Metode Bayar Aktif</span>
              <span className="font-semibold text-slate-900">BCA Virtual Account •••• 4911</span>
            </div>
          </div>

          <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => showToast('Membuka riwayat tagihan...', 'info')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl cursor-pointer ${GRAD.light}`}
            >
              Riwayat Tagihan
            </button>
            <button
              type="button"
              onClick={() => showToast('Membuka dialog upgrade paket!', 'success')}
              className={`px-4 py-2 text-xs font-semibold rounded-xl cursor-pointer ${GRAD.primary}`}
            >
              Upgrade Enterprise
            </button>
          </div>
        </div>
        )}

        {/* 6. ARTICLE / PREFERENCES & TIMELINE MIX CARD */}
        {show('content') && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="h-28 bg-gradient-to-tr from-[#175cd3] via-[#0ea5e9] to-[#22c55e] p-5 flex flex-col justify-between text-white">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/20 backdrop-blur-2xs">
                Engineering Blog
              </span>
              <button
                type="button"
                onClick={() => {
                  setBookmarked((b) => !b);
                  showToast(bookmarked ? 'Dihapus dari bookmark' : 'Disimpan ke bookmark!', 'info');
                }}
                className="p-1.5 rounded-lg bg-white/15 hover:bg-white/25 cursor-pointer"
                aria-label="Bookmark"
              >
                <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-white' : ''}`} />
              </button>
            </div>
            <p className="text-[11px] text-white/90 font-medium">27 Nov 2026 • 5 menit baca</p>
          </div>

          <div className="p-5 space-y-3 text-xs flex-1">
            <h4 className="text-sm font-bold text-slate-900 leading-snug">
              Arsitektur Modular Design System di React &amp; Tailwind v4
            </h4>
            <p className="text-slate-600 leading-relaxed line-clamp-2">
              Panduan menyusun komponen kartu, modal dialog, serta standar token warna agar konsisten di seluruh tim engineering.
            </p>

            {/* Quick Feature Toggles Preview */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#175cd3]" />
                Contoh Switch Pengaturan di Card
              </p>
              {[
                { label: 'Aktifkan 2FA Wajib', checked: toggle2FA, onToggle: () => setToggle2FA((v) => !v) },
                { label: 'Webhook Real-Time', checked: toggleWebhook, onToggle: () => setToggleWebhook((v) => !v) },
                { label: 'Maintenance Mode', checked: toggleMaintenance, onToggle: () => setToggleMaintenance((v) => !v) },
              ].map((sw) => (
                <div key={sw.label} className="flex items-center justify-between">
                  <span className="text-slate-700 font-medium">{sw.label}</span>
                  <button
                    type="button"
                    onClick={sw.onToggle}
                    className={`w-9 h-5 rounded-full transition-colors p-0.5 cursor-pointer ${
                      sw.checked ? 'bg-[#175cd3]' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-white shadow transition-transform ${
                        sw.checked ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${GRAD.primaryStatic}`}>
                FI
              </span>
              <span className="font-semibold text-slate-800">Fahmi Ibrahim</span>
            </div>
            <button
              type="button"
              onClick={() => setLiked((l) => !l)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer ${
                liked ? GRAD.danger : GRAD.light
              }`}
            >
              <Heart className={`w-3 h-3 ${liked ? 'fill-white' : ''}`} />
              {liked ? 49 : 48}
            </button>
          </div>
        </div>
        )}

        {/* 7. RECENT TIMELINE ACTIVITY CARD */}
        {show('content') && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden lg:col-span-2 xl:col-span-3">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h4 className="text-sm sm:text-base font-bold text-[#1351b8]">Timeline Aktivitas di Card</h4>
              <p className="text-[11px] text-slate-600">Contoh ringkasan log &amp; status rilis horizontal di dalam card penuh</p>
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${GRAD.success}`}>
              Live Feed
            </span>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {[
              {
                title: 'Pembayaran Termin #INV-0842',
                desc: 'Verifikasi bukti transfer BCA sebesar Rp 3.850.000 disetujui oleh Finance.',
                time: '5 menit lalu',
                badge: 'Finance',
                grad: GRAD.success,
              },
              {
                title: 'Rilis Top Navigation Layout',
                desc: 'Push commit #f3b92b2 berhasil di-build dalam 920ms tanpa warning lint.',
                time: '38 menit lalu',
                badge: 'Deploy',
                grad: GRAD.primaryStatic,
              },
              {
                title: 'Onboarding Klien Baru PT Maju',
                desc: 'Workspace & 18 akun tim selesai dibuat lengkap dengan akses 2FA.',
                time: '2 jam lalu',
                badge: 'Workspace',
                grad: GRAD.info,
              },
            ].map((ev) => (
              <div key={ev.title} className="p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${ev.grad}`}>
                    {ev.badge}
                  </span>
                  <span className="text-[11px] text-slate-500">{ev.time}</span>
                </div>
                <p className="font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#175cd3] shrink-0" />
                  {ev.title}
                </p>
                <p className="text-slate-600 leading-relaxed">{ev.desc}</p>
              </div>
            ))}
          </div>
        </div>
        )}

        {/* 8 - 19 EXTRA CARD EXAMPLES */}
        <CardContentShowcaseExtra filter={filter} />
      </div>
    </div>
  );
}
