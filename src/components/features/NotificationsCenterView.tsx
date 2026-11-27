import { useState } from 'react';
import {
  Bell,
  CheckCheck,
  CreditCard,
  Mail,
  MessageSquare,
  ShieldAlert,
  Smartphone,
  Trash2,
} from 'lucide-react';
import { showToast } from '../../lib/swal';
import { FeatureSectionHeader } from './FeatureSectionHeader';

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

type NotifCategory = 'security' | 'finance' | 'system';

interface NotificationItem {
  id: string;
  category: NotifCategory;
  dayGroup: 'Hari Ini' | 'Kemarin';
  title: string;
  desc: string;
  time: string;
  unread: boolean;
}

const INITIAL_NOTIFS: NotificationItem[] = [
  {
    id: 'nf-1',
    category: 'finance',
    dayGroup: 'Hari Ini',
    title: 'Pembayaran Invoice #INV-2026-0842 Terverifikasi',
    desc: 'Dana sebesar Rp 3.850.000 dari PT Maju Sejahtera Tbk telah masuk ke rekening BCA.',
    time: '5 menit lalu',
    unread: true,
  },
  {
    id: 'nf-2',
    category: 'security',
    dayGroup: 'Hari Ini',
    title: 'Login Perangkat Baru Terdeteksi',
    desc: 'Akun Fahmi Ibrahim masuk dari Chrome Linux (IP 103.48.21.9) pukul 09:05 WIB.',
    time: '32 menit lalu',
    unread: true,
  },
  {
    id: 'nf-3',
    category: 'system',
    dayGroup: 'Hari Ini',
    title: 'Nadia Kusuma menandai Anda di KAN-105',
    desc: 'Kartu "UI System Blueprint" dipindahkan ke kolom In Review dan menunggu komentar.',
    time: '2 jam lalu',
    unread: false,
  },
  {
    id: 'nf-4',
    category: 'finance',
    dayGroup: 'Kemarin',
    title: 'Pengajuan Kasbon #REQ-KBN-204 Menunggu Approval',
    desc: 'Raka Pratama mengajukan klaim perjalanan dinas Surabaya dengan 2 lampiran struk.',
    time: 'Kemarin, 16:40 WIB',
    unread: false,
  },
];

interface ChannelRule {
  id: string;
  label: string;
  email: boolean;
  push: boolean;
  whatsapp: boolean;
}

const INITIAL_RULES: ChannelRule[] = [
  { id: 'r1', label: 'Approval Kasbon & Reimbursement', email: true, push: true, whatsapp: true },
  { id: 'r2', label: 'Login & Aktivitas Keamanan Akun', email: true, push: true, whatsapp: false },
  { id: 'r3', label: 'Pembayaran Invoice Masuk', email: true, push: false, whatsapp: true },
  { id: 'r4', label: 'Mention Tugas & Komentar Kanban', email: false, push: true, whatsapp: false },
];

export function NotificationsCenterView() {
  const [notifs, setNotifs] = useState<NotificationItem[]>(INITIAL_NOTIFS);
  const [catFilter, setCatFilter] = useState<'all' | NotifCategory>('all');
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [rules, setRules] = useState<ChannelRule[]>(INITIAL_RULES);
  const [quietHours, setQuietHours] = useState(true);

  const visibleNotifs = notifs.filter((n) => {
    if (catFilter !== 'all' && n.category !== catFilter) return false;
    if (unreadOnly && !n.unread) return false;
    return true;
  });

  const unreadCount = notifs.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, unread: false })));
    showToast('Semua notifikasi ditandai sudah dibaca!', 'success');
  };

  const clearRead = () => {
    setNotifs((prev) => prev.filter((n) => n.unread));
    showToast('Notifikasi yang sudah dibaca dibersihkan.', 'info');
  };

  const toggleRule = (id: string, key: 'email' | 'push' | 'whatsapp') => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [key]: !r[key] } : r)),
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <FeatureSectionHeader
          title="Notification Center"
          description="Pusat notifikasi sistem beserta pengaturan kanal peringatan Email, Push Browser, dan WhatsApp."
        />

        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          {unreadCount > 0 && (
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${GRAD.warning}`}>
              {unreadCount} Belum Dibaca
            </span>
          )}
          <button
            type="button"
            onClick={markAllRead}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer ${GRAD.light}`}
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Tandai Semua Dibaca
          </button>
          <button
            type="button"
            onClick={clearRead}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer ${GRAD.danger}`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            Bersihkan Dibaca
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Notification Feed */}
        <div className="lg:col-span-7 xl:col-span-8 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all' as const, label: 'Semua' },
                { id: 'finance' as const, label: 'Keuangan' },
                { id: 'security' as const, label: 'Keamanan' },
                { id: 'system' as const, label: 'Sistem & Tugas' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setCatFilter(t.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
                    catFilter === t.id ? GRAD.primary : GRAD.light
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={unreadOnly}
                onChange={(e) => setUnreadOnly(e.target.checked)}
                className="w-4 h-4 rounded-sm text-[#175cd3]"
              />
              <span>Hanya belum dibaca</span>
            </label>
          </div>

          {visibleNotifs.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Bell className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-900">Tidak ada notifikasi</p>
              <p className="text-xs text-slate-600">Semua pemberitahuan pada filter ini sudah bersih.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {visibleNotifs.map((n) => {
                const Icon =
                  n.category === 'finance'
                    ? CreditCard
                    : n.category === 'security'
                      ? ShieldAlert
                      : Bell;
                const badgeGrad =
                  n.category === 'finance'
                    ? GRAD.success
                    : n.category === 'security'
                      ? GRAD.warning
                      : GRAD.primaryStatic;
                return (
                  <div
                    key={n.id}
                    onClick={() =>
                      setNotifs((prev) =>
                        prev.map((item) => (item.id === n.id ? { ...item, unread: false } : item)),
                      )
                    }
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                      n.unread ? 'border-[#175cd3]/40 shadow-xs' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${badgeGrad}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs sm:text-sm font-bold text-slate-900">{n.title}</span>
                          <span className="text-[10px] font-semibold text-slate-600 px-2 py-0.5 rounded-full bg-slate-100">
                            {n.dayGroup}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{n.desc}</p>
                        <p className="text-[11px] text-slate-500">{n.time}</p>
                      </div>
                    </div>

                    {n.unread && <span className="w-2.5 h-2.5 rounded-full bg-[#175cd3] shrink-0 mt-1.5" />}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Channel Matrix Preferences */}
        <div className="lg:col-span-5 xl:col-span-4 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4 text-xs">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Preferensi Kanal Peringatan</h3>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Atur notifikasi mana yang masuk ke Email, Push App, atau WhatsApp
            </p>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="grid grid-cols-12 px-3 py-2.5 border-b border-slate-200 text-[10px] font-bold uppercase text-slate-600">
              <span className="col-span-6">Kategori Event</span>
              <span className="col-span-2 text-center inline-flex justify-center" title="Email"><Mail className="w-3.5 h-3.5" /></span>
              <span className="col-span-2 text-center inline-flex justify-center" title="Push"><Smartphone className="w-3.5 h-3.5" /></span>
              <span className="col-span-2 text-center inline-flex justify-center" title="WhatsApp"><MessageSquare className="w-3.5 h-3.5" /></span>
            </div>
            <div className="divide-y divide-slate-100">
              {rules.map((r) => (
                <div key={r.id} className="grid grid-cols-12 items-center px-3 py-2.5 gap-1">
                  <span className="col-span-6 font-medium text-slate-800 leading-snug pr-1">{r.label}</span>
                  <div className="col-span-2 flex justify-center">
                    <input
                      type="checkbox"
                      checked={r.email}
                      onChange={() => toggleRule(r.id, 'email')}
                      className="w-4 h-4 rounded-sm text-[#175cd3] cursor-pointer"
                    />
                  </div>
                  <div className="col-span-2 flex justify-center">
                    <input
                      type="checkbox"
                      checked={r.push}
                      onChange={() => toggleRule(r.id, 'push')}
                      className="w-4 h-4 rounded-sm text-[#175cd3] cursor-pointer"
                    />
                  </div>
                  <div className="col-span-2 flex justify-center">
                    <input
                      type="checkbox"
                      checked={r.whatsapp}
                      onChange={() => toggleRule(r.id, 'whatsapp')}
                      className="w-4 h-4 rounded-sm text-[#175cd3] cursor-pointer"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-slate-900">Mode Jangan Ganggu (Quiet Hours)</p>
              <p className="text-[11px] text-slate-600">Jeda notifikasi non-kritis pukul 22:00 – 07:00 WIB</p>
            </div>
            <button
              type="button"
              onClick={() => setQuietHours((prev) => !prev)}
              className={`w-10 h-5.5 rounded-full transition-colors p-0.5 shrink-0 cursor-pointer ${
                quietHours ? 'bg-[#175cd3]' : 'bg-slate-300'
              }`}
            >
              <span
                className={`block w-4.5 h-4.5 rounded-full bg-white shadow transition-transform ${
                  quietHours ? 'translate-x-4.5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <button
            type="button"
            onClick={() => showToast('Preferensi kanal notifikasi berhasil disimpan!', 'success')}
            className={`w-full py-2.5 rounded-xl text-xs font-semibold shadow-xs cursor-pointer ${GRAD.primary}`}
          >
            Simpan Preferensi
          </button>
        </div>
      </div>
    </div>
  );
}
