import React, { useState, useMemo } from 'react';
import { Search, Plus, Send, Mail, MessageCircle, ShieldCheck, CreditCard } from 'lucide-react';
import { showToast } from '../../lib/swal';

const GRAD = {
  primary: 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white',
  primaryStatic: 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white',
  info: 'bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] hover:from-[#0284c7] hover:to-[#0369a1] text-white',
  warning: 'bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:from-[#ea580c] hover:to-[#b45309] text-white',
  success: 'bg-gradient-to-r from-[#22c55e] to-[#15803d] hover:from-[#16a34a] hover:to-[#166534] text-white',
  light: 'bg-gradient-to-r from-[#f8fafc] to-[#e2e8f0] text-slate-800 border border-slate-200/80',
};

type ChannelType = 'email' | 'whatsapp' | 'system' | 'billing';

interface ActivityRecord {
  id: string;
  variant: 'card' | 'compact';
  channel: ChannelType;
  actor: string;
  actionText: string;
  targetActor?: string;
  targetSuffix?: string;
  timestamp: string;
  subject?: string;
  bodyPreview?: string;
  bodyFull?: string;
}

// ============================================================================
// CRISP CHANNEL NODE ICONS MATCHING REFERENCE SCREENSHOT
// ============================================================================
const GmailIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
    <path fill="#EA4335" d="M20 18h-2V9.25L12 13 6 9.25V18H4V6h1.2l6.8 4.25L18.8 6H20v12Z" />
    <path fill="#4285F4" d="M4 6h2v12H4V6Z" />
    <path fill="#34A853" d="M18 6h2v12h-2V6Z" />
    <path fill="#FBBC05" d="M18 6v4.6l2-1.35V6h-2Z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
    <circle cx="12" cy="12" r="9.5" fill="#22C55E" />
    <path
      fill="#FFFFFF"
      d="M15.8 14.3c-.2-.1-1.2-.6-1.4-.7-.2-.1-.3-.1-.5.1-.1.2-.5.7-.7.8-.1.2-.2.2-.4.1-.9-.4-1.6-1-2.2-1.8-.2-.3-.1-.4.1-.6.1-.1.3-.4.4-.5.1-.2.1-.3 0-.5-.1-.1-.5-1.2-.7-1.6-.2-.4-.3-.3-.5-.3h-.4c-.2 0-.4.1-.6.3-.5.5-.8 1.2-.8 2 0 .9.5 1.8 1.2 2.6 1.2 1.4 2.7 2.2 4.3 2.6.6.1 1.2.1 1.7 0 .5-.1 1.2-.5 1.4-1 .2-.5.2-.9.1-1-.1-.1-.2-.2-.4-.3Z"
    />
  </svg>
);

const SystemRingIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" aria-hidden="true">
    <circle cx="12" cy="12" r="8" fill="#DBEAFE" />
    <circle cx="12" cy="12" r="5" fill="#175CD3" />
    <circle cx="12" cy="12" r="2.2" fill="#FFFFFF" />
  </svg>
);

const BillingIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="3" stroke="#0EA5E9" strokeWidth="2" />
    <path d="M3 10h18" stroke="#0EA5E9" strokeWidth="2" />
    <path d="M7 14.5h4" stroke="#175CD3" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const INITIAL_ACTIVITIES: ActivityRecord[] = [
  {
    id: 'a-1',
    variant: 'card',
    channel: 'email',
    actor: 'Avik Banerjee',
    actionText: 'sent an email to',
    targetActor: 'Mark Anthony',
    timestamp: '06:30PM | 26 Nov',
    subject: "Sub: Don't miss out on the 15% Discount offer!",
    bodyPreview:
      'Velora Enterprise menyediakan manajemen Customer Experience (CXM) yang membantu bisnis dari berbagai skala menghadirkan pengalaman pelanggan terbaik...',
    bodyFull:
      'Velora Enterprise menyediakan manajemen Customer Experience (CXM) yang membantu bisnis dari berbagai skala menghadirkan pengalaman pelanggan terbaik di seluruh kanal komunikasi. Promo eksklusif diskon 15% untuk perpanjangan tahunan berlaku hingga akhir bulan ini. Silakan konfirmasi melalui portal tagihan atau balas email ini untuk aktivasi langsung.',
  },
  {
    id: 'a-2',
    variant: 'card',
    channel: 'whatsapp',
    actor: 'Avik Banerjee',
    actionText: 'sent a message via WhatsApp',
    timestamp: '05:45PM | 26 Nov',
    bodyPreview:
      'Halo Mark, paket onboarding tim sales Anda sudah aktif hari ini. Kami juga melampirkan ringkasan jadwal demo minggu depan untuk tim cabang...',
    bodyFull:
      'Halo Mark, paket onboarding tim sales Anda sudah aktif hari ini. Kami juga melampirkan ringkasan jadwal demo minggu depan untuk tim cabang Jakarta dan Surabaya. Jika ada penyesuaian jam, silakan beri tahu melalui pesan WhatsApp ini.',
  },
  {
    id: 'a-3',
    variant: 'compact',
    channel: 'system',
    actor: 'Shobana R',
    actionText: 'removed from cadence',
    targetSuffix: 'Scheduled activity.',
    timestamp: '04:20PM | 26 Nov',
  },
  {
    id: 'a-4',
    variant: 'compact',
    channel: 'system',
    actor: 'Nadia Kusuma',
    actionText: 'updated policy for',
    targetSuffix: 'Two-Factor Authentication.',
    timestamp: '03:10PM | 26 Nov',
  },
  {
    id: 'a-5',
    variant: 'card',
    channel: 'email',
    actor: 'Fahmi Ibrahim',
    actionText: 'sent an email to',
    targetActor: 'Tim Engineering',
    timestamp: '01:15PM | 26 Nov',
    subject: 'Sub: Release Notes Velora UI v2.5 & Panduan Migrasi Komponen',
    bodyPreview:
      'Seluruh modul Maps, Weather Icons, Auth Standalone, dan Error Pages kini telah lolos pemeriksaan TypeScript & oxlint tanpa warning...',
    bodyFull:
      'Seluruh modul Maps, Weather Icons, Auth Standalone, dan Error Pages kini telah lolos pemeriksaan TypeScript & oxlint tanpa warning. Tim frontend dapat langsung menggunakan palet gradient standar ButtonsView pada seluruh modul lanjutan.',
  },
  {
    id: 'a-6',
    variant: 'card',
    channel: 'billing',
    actor: 'Siti Rahmawati',
    actionText: 'verified invoice for',
    targetActor: 'PT Nusantara Digital',
    timestamp: '10:05AM | 25 Nov',
    subject: 'Sub: Pembayaran Invoice #INV-2026-089 Terkonfirmasi',
    bodyPreview:
      'Pembayaran paket Enterprise Annual (50 Seats) sebesar Rp 4.850.000 telah diterima otomatis melalui Virtual Account BCA...',
    bodyFull:
      'Pembayaran paket Enterprise Annual (50 Seats) sebesar Rp 4.850.000 telah diterima otomatis melalui Virtual Account BCA. Faktur pajak dan kwitansi resmi sudah tersedia di menu Utilities → Invoice.',
  },
  {
    id: 'a-7',
    variant: 'compact',
    channel: 'system',
    actor: 'Rizky Hidayat',
    actionText: 'assigned to cadence',
    targetSuffix: 'Quarterly Review Follow-up.',
    timestamp: '09:30AM | 25 Nov',
  },
  {
    id: 'a-8',
    variant: 'compact',
    channel: 'system',
    actor: 'Bima Pratama',
    actionText: 'completed task in',
    targetSuffix: 'Customer Onboarding Pipeline.',
    timestamp: '08:45AM | 25 Nov',
  },
];

export function ActivitiesView() {
  const [activities, setActivities] = useState<ActivityRecord[]>(INITIAL_ACTIVITIES);
  const [channelFilter, setChannelFilter] = useState<'all' | ChannelType>('all');
  const [search, setSearch] = useState('');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [showComposer, setShowComposer] = useState(false);

  // Quick composer state
  const [newChannel, setNewChannel] = useState<ChannelType>('email');
  const [newTarget, setNewTarget] = useState('Nadia Kusuma');
  const [newSubject, setNewSubject] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return activities.filter((item) => {
      const matchChan = channelFilter === 'all' || item.channel === channelFilter;
      const matchQ =
        !q ||
        item.actor.toLowerCase().includes(q) ||
        (item.targetActor?.toLowerCase().includes(q) ?? false) ||
        (item.targetSuffix?.toLowerCase().includes(q) ?? false) ||
        (item.subject?.toLowerCase().includes(q) ?? false) ||
        (item.bodyPreview?.toLowerCase().includes(q) ?? false);
      return matchChan && matchQ;
    });
  }, [activities, channelFilter, search]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderNodeIcon = (channel: ChannelType) => {
    switch (channel) {
      case 'email':
        return <GmailIcon />;
      case 'whatsapp':
        return <WhatsAppIcon />;
      case 'billing':
        return <BillingIcon />;
      default:
        return <SystemRingIcon />;
    }
  };

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) {
      showToast('Isi pesan atau keterangan aktivitas wajib diisi.', 'warning');
      return;
    }

    const isCompact = newChannel === 'system';
    const created: ActivityRecord = isCompact
      ? {
          id: `a-${Date.now()}`,
          variant: 'compact',
          channel: 'system',
          actor: 'Fahmi Ibrahim',
          actionText: 'updated workflow step',
          targetSuffix: newMessage.trim(),
          timestamp: 'Just now | 26 Nov',
        }
      : {
          id: `a-${Date.now()}`,
          variant: 'card',
          channel: newChannel,
          actor: 'Fahmi Ibrahim',
          actionText:
            newChannel === 'email'
              ? 'sent an email to'
              : newChannel === 'whatsapp'
                ? 'sent a WhatsApp message to'
                : 'sent billing update to',
          targetActor: newTarget.trim() || 'Team Workspace',
          timestamp: 'Just now | 26 Nov',
          subject: newSubject.trim() ? `Sub: ${newSubject.trim()}` : undefined,
          bodyPreview: newMessage.trim(),
          bodyFull: newMessage.trim(),
        };

    setActivities((prev) => [created, ...prev]);
    setNewSubject('');
    setNewMessage('');
    setShowComposer(false);
    showToast('Aktivitas baru ditambahkan ke timeline.', 'success');
  };

  return (
    <div className="space-y-5">
      {/* Compact Header Filter & Action Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                { id: 'all', label: 'Semua Aktivitas', icon: null },
                { id: 'email', label: 'Email', icon: Mail },
                { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
                { id: 'system', label: 'Cadence / Sistem', icon: ShieldCheck },
                { id: 'billing', label: 'Billing', icon: CreditCard },
              ] as const
            ).map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setChannelFilter(tab.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                    channelFilter === tab.id ? `${GRAD.primary} shadow-xs` : GRAD.light
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama, subjek, pesan..."
                className="pl-8 pr-3 py-1.5 w-56 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#175cd3]"
              />
            </div>

            <button
              type="button"
              onClick={() => setShowComposer((v) => !v)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-xs cursor-pointer ${GRAD.primary}`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Catat Aktivitas</span>
            </button>
          </div>
        </div>

        {/* Inline Activity Logger */}
        {showComposer && (
          <form onSubmit={handleAddActivity} className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-3">
              <select
                value={newChannel}
                onChange={(e) => setNewChannel(e.target.value as ChannelType)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#175cd3]"
              >
                <option value="email">Email Message</option>
                <option value="whatsapp">WhatsApp Chat</option>
                <option value="billing">Billing Notice</option>
                <option value="system">System / Cadence Event</option>
              </select>
            </div>
            {newChannel !== 'system' && (
              <>
                <div className="md:col-span-3">
                  <input
                    type="text"
                    value={newTarget}
                    onChange={(e) => setNewTarget(e.target.value)}
                    placeholder="Penerima..."
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#175cd3]"
                  />
                </div>
                <div className="md:col-span-6">
                  <input
                    type="text"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder="Subjek (opsional)..."
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#175cd3]"
                  />
                </div>
              </>
            )}
            <div className={newChannel === 'system' ? 'md:col-span-7' : 'md:col-span-10'}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={
                  newChannel === 'system'
                    ? 'Deskripsi event (mis. Scheduled activity updated.)'
                    : 'Isi ringkasan pesan...'
                }
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#175cd3]"
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                className={`w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold shadow-xs cursor-pointer ${GRAD.info}`}
              >
                <Send className="w-3.5 h-3.5" /> Tambah
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Clean Communication & System Activity Timeline Directly on Page Canvas */}
      <div className="max-w-5xl py-1">
        <div className="relative space-y-5 before:content-[''] before:absolute before:left-[18px] before:top-3 before:bottom-3 before:w-px before:bg-slate-300/80">
          {filtered.map((item) => {
            const isExpanded = Boolean(expandedIds[item.id]);

            if (item.variant === 'compact') {
              return (
                <div key={item.id} className="relative flex items-center gap-4 min-h-[28px]">
                  {/* Aligned compact node */}
                  <div className="w-9 flex items-center justify-center shrink-0 relative z-10">
                    <div className="w-6 h-6 rounded-full bg-white border border-slate-200 shadow-2xs flex items-center justify-center">
                      {renderNodeIcon(item.channel)}
                    </div>
                  </div>

                  {/* Single-line crisp inline event */}
                  <div className="text-[13px] text-slate-600 leading-snug flex flex-wrap items-center gap-x-1.5">
                    <span>
                      {item.actor} {item.actionText}{' '}
                      {item.targetSuffix && (
                        <strong className="font-semibold text-slate-900">{item.targetSuffix}</strong>
                      )}
                    </span>
                    <span className="text-slate-400 text-xs">{item.timestamp}</span>
                  </div>
                </div>
              );
            }

            return (
              <div key={item.id} className="relative flex items-start gap-4">
                {/* Aligned channel node */}
                <div className="w-9 pt-1.5 flex items-center justify-center shrink-0 relative z-10">
                  <div className="w-9 h-9 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center">
                    {renderNodeIcon(item.channel)}
                  </div>
                </div>

                {/* Rich Message Card */}
                <div className="flex-1 min-w-0 bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden hover:border-slate-300 transition-colors">
                  {/* Card Header Row */}
                  <div className="px-4 sm:px-5 py-3 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <div className="text-[13px] text-slate-600">
                      <strong className="font-semibold text-slate-900">{item.actor}</strong>{' '}
                      <span>{item.actionText}</span>
                      {item.targetActor && (
                        <>
                          {' '}
                          <strong className="font-semibold text-slate-900">{item.targetActor}</strong>
                        </>
                      )}
                    </div>
                    <span className="text-xs text-slate-500 whitespace-nowrap shrink-0">
                      {item.timestamp}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="px-4 sm:px-5 py-4 space-y-2">
                    {item.subject && (
                      <div className="text-[13px] font-bold text-slate-900">{item.subject}</div>
                    )}
                    <p className="text-[13px] text-slate-600 leading-relaxed">
                      {isExpanded ? item.bodyFull : item.bodyPreview}{' '}
                      {item.bodyFull && item.bodyFull !== item.bodyPreview && (
                        <button
                          type="button"
                          onClick={() => toggleExpand(item.id)}
                          className="font-semibold text-[#175cd3] hover:underline cursor-pointer inline"
                        >
                          {isExpanded ? 'View less' : 'View more'}
                        </button>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="py-10 text-center text-xs text-slate-500">
              Tidak ada aktivitas yang cocok dengan filter atau kata kunci Anda.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
