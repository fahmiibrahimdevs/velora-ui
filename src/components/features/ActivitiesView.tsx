import { useState, useMemo } from 'react';
import {
  Activity,
  Shield,
  GitBranch,
  FileText,
  CreditCard,
  Search,
  CheckCircle2,
  Clock,
  Bookmark,
  Download,
  Monitor,
  ArrowRight,
  Copy,
  Check,
  Flag,
  Radio,
  Sparkles,
  Users,
  Calendar,
} from 'lucide-react';
import { showToast } from '../../lib/swal';

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

type ActivityCategory = 'Deploy' | 'Security' | 'Content' | 'Billing';
type TimeBucket = 'Hari Ini' | 'Kemarin' | 'Minggu Ini';

interface ActivityChange {
  field: string;
  before: string;
  after: string;
}

interface ActivityEntry {
  id: string;
  actor: string;
  role: string;
  initials: string;
  avatarGrad: string;
  category: ActivityCategory;
  bucket: TimeBucket;
  dayCode: string;
  actionVerb: string;
  targetName: string;
  targetRef: string;
  summary: string;
  timeLabel: string;
  ip: string;
  location: string;
  device: string;
  severity: 'Info' | 'Warning' | 'Critical';
  unread: boolean;
  bookmarked: boolean;
  flagged: boolean;
  changes: ActivityChange[];
  payload: Record<string, string>;
}

const INITIAL_EVENTS: ActivityEntry[] = [
  {
    id: 'evt-101',
    actor: 'Fahmi Ibrahim',
    role: 'Principal Architect',
    initials: 'FI',
    avatarGrad: GRAD.primaryStatic,
    category: 'Deploy',
    bucket: 'Hari Ini',
    dayCode: 'Kam',
    actionVerb: 'merilis build produksi',
    targetName: 'velora-ui v2.5.4',
    targetRef: '#426c774',
    summary: 'Pipeline TypeScript & Vite build selesai 770ms dengan 0 lint warnings pada 38 modul.',
    timeLabel: '15:25 WIB',
    ip: '103.42.19.104',
    location: 'Jakarta, ID',
    device: 'Chrome 131 · Linux x64',
    severity: 'Info',
    unread: true,
    bookmarked: true,
    flagged: false,
    changes: [
      { field: 'appVersion', before: 'v2.5.3', after: 'v2.5.4' },
      { field: 'modulesCount', before: '31 files', after: '38 files' },
      { field: 'edgeCache', before: 'Stale', after: 'Purged & Warm' },
    ],
    payload: { commit: '426c774', branch: 'main', duration: '770ms', status: 'Healthy' },
  },
  {
    id: 'evt-102',
    actor: 'Nadia Kusuma',
    role: 'Security Lead',
    initials: 'NK',
    avatarGrad: GRAD.danger,
    category: 'Security',
    bucket: 'Hari Ini',
    dayCode: 'Kam',
    actionVerb: 'memperketat kebijakan RBAC',
    targetName: 'Super Admin & Finance',
    targetRef: 'POL-2FA-09',
    summary: 'Mengaktifkan kewajiban autentikasi dua faktor TOTP dan memperpendek masa idle sesi admin.',
    timeLabel: '14:40 WIB',
    ip: '182.253.77.12',
    location: 'Bandung, ID',
    device: 'Safari 18 · macOS',
    severity: 'Critical',
    unread: true,
    bookmarked: false,
    flagged: true,
    changes: [
      { field: 'mfaPolicy', before: 'Optional', after: 'Mandatory TOTP' },
      { field: 'sessionTimeout', before: '24 jam', after: '12 jam' },
    ],
    payload: { policyId: 'POL-2FA-09', scope: 'Admin Roles', enforced: 'true' },
  },
  {
    id: 'evt-103',
    actor: 'Bima Pratama',
    role: 'Technical Writer',
    initials: 'BP',
    avatarGrad: GRAD.info,
    category: 'Content',
    bucket: 'Hari Ini',
    dayCode: 'Kam',
    actionVerb: 'mempublikasikan artikel',
    targetName: 'Panduan Design System v4',
    targetRef: 'POST-209',
    summary: 'Artikel baru diterbitkan langsung ke kategori UI Engineering dan diindeks di pencarian internal.',
    timeLabel: '11:15 WIB',
    ip: '114.10.44.201',
    location: 'Surabaya, ID',
    device: 'Firefox 132 · Windows 11',
    severity: 'Info',
    unread: true,
    bookmarked: false,
    flagged: false,
    changes: [
      { field: 'postStatus', before: 'Pending Review', after: 'Published' },
      { field: 'visibility', before: 'Internal Draft', after: 'Public Portal' },
    ],
    payload: { postId: 'POST-209', category: 'UI Engineering', readTime: '6m' },
  },
  {
    id: 'evt-104',
    actor: 'Siti Rahmawati',
    role: 'Finance Ops',
    initials: 'SR',
    avatarGrad: GRAD.success,
    category: 'Billing',
    bucket: 'Kemarin',
    dayCode: 'Rab',
    actionVerb: 'mengonfirmasi pembayaran',
    targetName: 'Enterprise Plan (50 Seats)',
    targetRef: 'INV-2026-089',
    summary: 'Tagihan perpanjangan lisensi tahunan terverifikasi otomatis melalui Virtual Account BCA.',
    timeLabel: 'Kemarin · 16:08',
    ip: '36.79.118.55',
    location: 'Jakarta, ID',
    device: 'Chrome 131 · Windows 11',
    severity: 'Info',
    unread: false,
    bookmarked: false,
    flagged: false,
    changes: [
      { field: 'invoiceStatus', before: 'Awaiting Payment', after: 'Paid' },
      { field: 'validUntil', before: '30 Nov 2026', after: '30 Nov 2027' },
    ],
    payload: { invoice: 'INV-2026-089', amount: 'Rp 4.850.000', channel: 'VA-BCA' },
  },
  {
    id: 'evt-105',
    actor: 'Rizky Hidayat',
    role: 'DevOps Engineer',
    initials: 'RH',
    avatarGrad: GRAD.warning,
    category: 'Security',
    bucket: 'Kemarin',
    dayCode: 'Rab',
    actionVerb: 'melakukan rotasi kunci API',
    targetName: 'Gateway Token Legacy',
    targetRef: 'KEY-OLD-02',
    summary: 'Token akses lama dicabut setelah 100% layanan beralih ke skema credential v3.',
    timeLabel: 'Kemarin · 10:22',
    ip: '103.111.89.30',
    location: 'Singapore, SG',
    device: 'CLI · Ubuntu Server',
    severity: 'Warning',
    unread: false,
    bookmarked: false,
    flagged: false,
    changes: [
      { field: 'keyState', before: 'Grace Period', after: 'Revoked' },
      { field: 'activeVersion', before: 'v2', after: 'v3 (Ed25519)' },
    ],
    payload: { tokenId: 'KEY-OLD-02', downstreamErrors: '0', rotatedBy: 'rizky.h' },
  },
  {
    id: 'evt-106',
    actor: 'Dina Larasati',
    role: 'Site Reliability',
    initials: 'DL',
    avatarGrad: GRAD.dark,
    category: 'Deploy',
    bucket: 'Minggu Ini',
    dayCode: 'Sen',
    actionVerb: 'menjalankan sinkronisasi CDN',
    targetName: 'Cluster JKT-01 & SGP-02',
    targetRef: 'SYNC-881',
    summary: 'Replikasi aset statis antar node Asia Tenggara mencapai hit ratio 98.4%.',
    timeLabel: 'Sen, 23 Nov · 09:05',
    ip: '103.28.11.90',
    location: 'Jakarta, ID',
    device: 'Chrome 131 · macOS',
    severity: 'Info',
    unread: false,
    bookmarked: true,
    flagged: false,
    changes: [
      { field: 'hitRatio', before: '91.2%', after: '98.4%' },
      { field: 'edgeLatency', before: '24ms', after: '11ms' },
    ],
    payload: { clusters: 'JKT-01, SGP-02', throughput: '1.8 Gbps', state: 'Synced' },
  },
];

const WEEK_PULSE = [
  { day: 'Min', count: 18 },
  { day: 'Sen', count: 42 },
  { day: 'Sel', count: 36 },
  { day: 'Rab', count: 58 },
  { day: 'Kam', count: 74 },
  { day: 'Jum', count: 31 },
  { day: 'Sab', count: 25 },
];

const CAT_BADGE: Record<ActivityCategory, { grad: string; icon: typeof Activity }> = {
  Deploy: { grad: GRAD.primaryStatic, icon: GitBranch },
  Security: { grad: GRAD.danger, icon: Shield },
  Content: { grad: GRAD.info, icon: FileText },
  Billing: { grad: GRAD.success, icon: CreditCard },
};

export function ActivitiesView() {
  const [events, setEvents] = useState<ActivityEntry[]>(INITIAL_EVENTS);
  const [category, setCategory] = useState<'All' | ActivityCategory>('All');
  const [selectedDay, setSelectedDay] = useState<string>('All');
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string>(INITIAL_EVENTS[0].id);
  const [copiedPayload, setCopiedPayload] = useState(false);

  const unreadCount = useMemo(() => events.filter((e) => e.unread).length, [events]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return events.filter((ev) => {
      const matchCat = category === 'All' || ev.category === category;
      const matchDay = selectedDay === 'All' || ev.dayCode === selectedDay;
      const matchBookmark = !onlyBookmarked || ev.bookmarked;
      const matchQ =
        !q ||
        ev.actor.toLowerCase().includes(q) ||
        ev.targetName.toLowerCase().includes(q) ||
        ev.targetRef.toLowerCase().includes(q) ||
        ev.summary.toLowerCase().includes(q);
      return matchCat && matchDay && matchBookmark && matchQ;
    });
  }, [events, category, selectedDay, onlyBookmarked, search]);

  const groupedBuckets = useMemo(() => {
    const order: TimeBucket[] = ['Hari Ini', 'Kemarin', 'Minggu Ini'];
    return order
      .map((bucket) => ({
        bucket,
        items: filtered.filter((ev) => ev.bucket === bucket),
      }))
      .filter((g) => g.items.length > 0);
  }, [filtered]);

  const activeEvent = useMemo(
    () => events.find((e) => e.id === selectedId) ?? events[0],
    [events, selectedId]
  );

  const selectEvent = (ev: ActivityEntry) => {
    setSelectedId(ev.id);
    if (ev.unread) {
      setEvents((prev) => prev.map((item) => (item.id === ev.id ? { ...item, unread: false } : item)));
    }
  };

  const toggleBookmark = (id: string) => {
    setEvents((prev) =>
      prev.map((item) => (item.id === id ? { ...item, bookmarked: !item.bookmarked } : item))
    );
  };

  const toggleFlag = (id: string) => {
    setEvents((prev) =>
      prev.map((item) => (item.id === id ? { ...item, flagged: !item.flagged } : item))
    );
    showToast('Status tanda tinjauan diperbarui.', 'info');
  };

  const markAllRead = () => {
    setEvents((prev) => prev.map((item) => ({ ...item, unread: false })));
    showToast('Semua aktivitas ditandai sudah dibaca.', 'success');
  };

  const simulateLiveEvent = () => {
    const newId = `evt-${Date.now()}`;
    const newEv: ActivityEntry = {
      id: newId,
      actor: 'Fahmi Ibrahim',
      role: 'Principal Architect',
      initials: 'FI',
      avatarGrad: GRAD.primaryStatic,
      category: 'Deploy',
      bucket: 'Hari Ini',
      dayCode: 'Kam',
      actionVerb: 'memicu sinkronisasi live',
      targetName: 'Telemetry Stream Node',
      targetRef: `LIVE-${String(events.length + 1).padStart(2, '0')}`,
      summary: 'Peristiwa audit baru diterima secara real-time dari layanan gateway utama.',
      timeLabel: 'Baru saja',
      ip: '103.42.19.104',
      location: 'Jakarta, ID',
      device: 'API Webhook v3',
      severity: 'Info',
      unread: true,
      bookmarked: false,
      flagged: false,
      changes: [{ field: 'streamSync', before: 'Idle', after: 'Connected' }],
      payload: { source: 'live-pulse', latency: '9ms', verified: 'true' },
    };
    setEvents((prev) => [newEv, ...prev]);
    setSelectedId(newId);
    setSelectedDay('All');
    setCategory('All');
    showToast('1 aktivitas live baru masuk ke stream!', 'info');
  };

  const copyPayload = () => {
    navigator.clipboard.writeText(JSON.stringify(activeEvent.payload, null, 2));
    setCopiedPayload(true);
    showToast('Payload JSON disalin ke clipboard.', 'success');
    setTimeout(() => setCopiedPayload(false), 1600);
  };

  const exportAudit = () => {
    showToast(`Mengekspor ${filtered.length} catatan aktivitas ke audit-log.json (demo).`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP PULSE KPI STRIP */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold text-slate-600">Aktivitas Minggu Ini</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">284</div>
            <span className={`inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${GRAD.success}`}>
              +18.4% vs lalu
            </span>
          </div>
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-xs ${GRAD.primaryStatic}`}>
            <Activity className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold text-slate-600">Deploy & Rilis</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">14</div>
            <span className={`inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${GRAD.info}`}>
              100% Sukses
            </span>
          </div>
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-xs ${GRAD.info}`}>
            <GitBranch className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold text-slate-600">Belum Dibaca</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{unreadCount}</div>
            <span className={`inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${GRAD.warning}`}>
              Perlu Tinjauan
            </span>
          </div>
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-xs ${GRAD.warning}`}>
            <Shield className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold text-slate-600">Anggota Aktif</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">6 Tim</div>
            <span className={`inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${GRAD.dark}`}>
              Online Sekarang
            </span>
          </div>
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-xs ${GRAD.dark}`}>
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 2. VELOCITY PULSE + COMMAND BAR */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          {/* Interactive Weekly Pulse Bars */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 pr-2 border-r border-slate-200">
              <Calendar className="w-4 h-4 text-[#175cd3]" />
              <div>
                <div className="text-xs font-bold text-slate-900">Pulse Harian</div>
                <div className="text-[11px] text-slate-500">Klik hari untuk filter</div>
              </div>
            </div>

            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedDay('All')}
                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold cursor-pointer ${
                  selectedDay === 'All' ? GRAD.primary : GRAD.light
                }`}
              >
                Semua
              </button>
              {WEEK_PULSE.map((bar) => {
                const active = selectedDay === bar.day;
                const h = Math.max(14, Math.round((bar.count / 74) * 34));
                return (
                  <button
                    key={bar.day}
                    type="button"
                    onClick={() => setSelectedDay(active ? 'All' : bar.day)}
                    className="group flex flex-col items-center gap-1 cursor-pointer"
                    title={`${bar.day}: ${bar.count} aktivitas`}
                  >
                    <div className="h-9 flex items-end">
                      <div
                        className={`w-5 rounded-md transition-all ${
                          active
                            ? GRAD.primaryStatic
                            : 'bg-slate-200 group-hover:bg-[#3b82f6]'
                        }`}
                        style={{ height: `${h}px` }}
                      />
                    </div>
                    <span
                      className={`text-[10px] font-semibold ${
                        active ? 'text-[#175cd3]' : 'text-slate-500'
                      }`}
                    >
                      {bar.day}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Global Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={simulateLiveEvent}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold shadow-xs cursor-pointer ${GRAD.info}`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Simulasikan Event Live</span>
            </button>
            <button
              type="button"
              onClick={markAllRead}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer ${GRAD.light}`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Baca Semua</span>
            </button>
            <button
              type="button"
              onClick={exportAudit}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs cursor-pointer ${GRAD.primary}`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor Log</span>
            </button>
          </div>
        </div>

        {/* Filter Pills + Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-1.5">
            {(['All', 'Deploy', 'Security', 'Content', 'Billing'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  category === cat ? GRAD.primary : GRAD.light
                }`}
              >
                {cat}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setOnlyBookmarked((v) => !v)}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                onlyBookmarked ? GRAD.warning : GRAD.light
              }`}
            >
              <Bookmark className="w-3 h-3" /> Tersimpan
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari aktor, commit, invoice..."
              className="pl-8 pr-3 py-1.5 w-60 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#175cd3]"
            />
          </div>
        </div>
      </div>

      {/* 3. MASTER-DETAIL SPLIT WORKSPACE */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left: Grouped Clean Activity Feed */}
        <div className="xl:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-5">
          {groupedBuckets.map((group) => (
            <div key={group.bucket} className="space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  {group.bucket}
                </span>
                <span className="text-[11px] font-semibold text-slate-500">
                  {group.items.length} aktivitas
                </span>
              </div>

              <div className="space-y-2">
                {group.items.map((ev) => {
                  const isSelected = activeEvent.id === ev.id;
                  const cat = CAT_BADGE[ev.category];
                  return (
                    <div
                      key={ev.id}
                      onClick={() => selectEvent(ev)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                        isSelected
                          ? 'border-[#175cd3] bg-blue-50/35 shadow-xs'
                          : 'border-slate-200/80 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="relative shrink-0">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold shadow-xs ${ev.avatarGrad}`}>
                            {ev.initials}
                          </div>
                          {ev.unread && (
                            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#175cd3] border-2 border-white" />
                          )}
                        </div>

                        <div className="min-w-0 space-y-1">
                          <p className="text-xs text-slate-700 leading-snug">
                            <strong className="font-bold text-slate-900">{ev.actor}</strong>{' '}
                            <span>{ev.actionVerb}</span>{' '}
                            <strong className="font-semibold text-[#175cd3]">{ev.targetName}</strong>
                          </p>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${cat.grad}`}>
                              {ev.category}
                            </span>
                            <code className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-mono text-slate-700">
                              {ev.targetRef}
                            </code>
                            <span className="text-[11px] text-slate-500 flex items-center gap-1 ml-1">
                              <Clock className="w-3 h-3" /> {ev.timeLabel}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(ev.id);
                          }}
                          className={`p-1.5 rounded-lg cursor-pointer ${
                            ev.bookmarked ? GRAD.warning : GRAD.light
                          }`}
                          title="Simpan Aktivitas"
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {groupedBuckets.length === 0 && (
            <div className="py-12 text-center text-xs text-slate-500">
              Tidak ada aktivitas pada kombinasi filter ini. Klik <strong>Semua</strong> pada Pulse Harian untuk reset.
            </div>
          )}
        </div>

        {/* Right: Sticky Event Forensics Inspector */}
        <div className="xl:col-span-5 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-5">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm shadow-xs ${activeEvent.avatarGrad}`}>
                  {activeEvent.initials}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{activeEvent.actor}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${CAT_BADGE[activeEvent.category].grad}`}>
                      {activeEvent.category}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    {activeEvent.role} &bull; {activeEvent.timeLabel}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => toggleFlag(activeEvent.id)}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold cursor-pointer ${
                  activeEvent.flagged ? GRAD.danger : GRAD.light
                }`}
              >
                <Flag className="w-3 h-3" />
                <span>{activeEvent.flagged ? 'Ditandai' : 'Tandai'}</span>
              </button>
            </div>

            <div className="space-y-1.5">
              <div className="text-xs font-bold text-slate-900">
                {activeEvent.actionVerb.charAt(0).toUpperCase() + activeEvent.actionVerb.slice(1)}:{' '}
                <span className="text-[#175cd3]">{activeEvent.targetName}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{activeEvent.summary}</p>
            </div>

            {/* Diff Changes */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#175cd3]" /> Ringkasan Perubahan (Before → After)
              </div>
              <div className="space-y-1.5">
                {activeEvent.changes.map((chg) => (
                  <div
                    key={chg.field}
                    className="p-2.5 rounded-xl border border-slate-200/80 bg-white flex flex-wrap items-center justify-between gap-2 text-xs"
                  >
                    <code className="font-semibold text-slate-700">{chg.field}</code>
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-red-50 text-red-700 font-mono text-[11px]">
                        {chg.before}
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono text-[11px] font-semibold">
                        {chg.after}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Client Context */}
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-xl border border-slate-200/80">
                <div className="text-[11px] text-slate-500">Alamat IP & Lokasi</div>
                <div className="font-semibold text-slate-900 mt-0.5 font-mono text-[11px]">
                  {activeEvent.ip} ({activeEvent.location})
                </div>
              </div>
              <div className="p-3 rounded-xl border border-slate-200/80">
                <div className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Monitor className="w-3 h-3" /> Perangkat
                </div>
                <div className="font-semibold text-slate-900 mt-0.5 text-[11px] truncate">
                  {activeEvent.device}
                </div>
              </div>
            </div>

            {/* Raw Payload */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden">
              <div className="px-3.5 py-2 bg-white border-b border-slate-200 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700">Audit Event Payload</span>
                <button
                  type="button"
                  onClick={copyPayload}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer ${GRAD.light}`}
                >
                  {copiedPayload ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedPayload ? 'Disalin' : 'Copy JSON'}</span>
                </button>
              </div>
              <pre className="bg-slate-950 text-sky-200 p-3.5 text-[11px] font-mono overflow-x-auto leading-relaxed">
                {JSON.stringify(activeEvent.payload, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
