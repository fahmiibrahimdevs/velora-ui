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
  ChevronDown,
  ChevronRight,
  RefreshCw,
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

type ActivityCategory = 'Security' | 'Deploy' | 'Content' | 'Billing';

interface ActivityEntry {
  id: string;
  actor: string;
  actorInitials: string;
  category: ActivityCategory;
  title: string;
  description: string;
  timeAgo: string;
  ip: string;
  unread: boolean;
  payload: Record<string, string>;
}

const INITIAL_ACTIVITIES: ActivityEntry[] = [
  {
    id: 'act-1',
    actor: 'Fahmi Ibrahim',
    actorInitials: 'FI',
    category: 'Deploy',
    title: 'Merilis Build Produksi v2.5.4 ke Cluster Asia-Pasifik',
    description: 'Pipeline Vite & TypeScript selesai dalam 682ms tanpa error; 3 modul baru aktif.',
    timeAgo: '4 menit lalu',
    ip: '103.42.19.104',
    unread: true,
    payload: { branch: 'main', commit: '5b25b70', region: 'ap-southeast-1', status: 'Healthy' },
  },
  {
    id: 'act-2',
    actor: 'Nadia Kusuma',
    actorInitials: 'NK',
    category: 'Security',
    title: 'Memperbarui Aturan RBAC & Two-Factor Authentication',
    description: 'Kebijakan 2FA diwajibkan untuk seluruh peran Super Admin dan Finance Approver.',
    timeAgo: '18 menit lalu',
    ip: '182.253.77.12',
    unread: true,
    payload: { scope: 'Super Admin', policy: 'TOTP Mandatory', sessionTTL: '12h' },
  },
  {
    id: 'act-3',
    actor: 'Bima Pratama',
    actorInitials: 'BP',
    category: 'Content',
    title: 'Mempublikasikan Artikel "Panduan Desain Komponen Velora"',
    description: 'Artikel masuk ke kategori UI Engineering dan disinkronkan ke portal dokumentasi.',
    timeAgo: '1 jam lalu',
    ip: '114.10.44.201',
    unread: true,
    payload: { postId: 'POST-209', category: 'UI Engineering', readTime: '6 menit' },
  },
  {
    id: 'act-4',
    actor: 'Siti Rahmawati',
    actorInitials: 'SR',
    category: 'Billing',
    title: 'Pembayaran Invoice #INV-2026-089 Terkonfirmasi',
    description: 'Langganan Enterprise Plan untuk 50 kursi tim diperpanjang otomatis.',
    timeAgo: '3 jam lalu',
    ip: '36.79.118.55',
    unread: false,
    payload: { invoice: 'INV-2026-089', amount: 'Rp 4.850.000', method: 'Virtual Account' },
  },
  {
    id: 'act-5',
    actor: 'Rizky Hidayat',
    actorInitials: 'RH',
    category: 'Security',
    title: 'Mencabut Token API Legacy (velora_key_old_02)',
    description: 'Rotasi kunci API terjadwal selesai; layanan downstream sudah memakai token v3.',
    timeAgo: '5 jam lalu',
    ip: '103.111.89.30',
    unread: false,
    payload: { keyId: 'velora_key_old_02', rotation: 'Success', gracePeriod: 'Ended' },
  },
  {
    id: 'act-6',
    actor: 'Dina Larasati',
    actorInitials: 'DL',
    category: 'Deploy',
    title: 'Sinkronisasi Cache CDN Edge Jakarta & Singapore',
    description: 'Purge aset statis selesai untuk memperbarui bundel komponen terbaru.',
    timeAgo: 'Kemarin, 17:40',
    ip: '103.28.11.90',
    unread: false,
    payload: { edgeNodes: 'JKT-01, SGP-02', hitRatio: '98.4%', duration: '1.2s' },
  },
];

const EXTRA_ACTIVITIES: ActivityEntry[] = [
  {
    id: 'act-7',
    actor: 'Andi Wijaya',
    actorInitials: 'AW',
    category: 'Content',
    title: 'Menambahkan Lampiran PDF Panduan Onboarding Tim',
    description: 'Dokumen diunggah ke pustaka aset dan ditautkan ke halaman Pusat Bantuan.',
    timeAgo: '2 hari lalu',
    ip: '180.244.132.9',
    unread: false,
    payload: { file: 'onboarding-v2.pdf', size: '2.4 MB', visibility: 'Internal' },
  },
  {
    id: 'act-8',
    actor: 'System Scheduler',
    actorInitials: 'SS',
    category: 'Billing',
    title: 'Ekspor Laporan Rekonsiliasi Bulanan Selesai',
    description: 'Rekap transaksi November siap diunduh di menu Utilities → Invoice.',
    timeAgo: '3 hari lalu',
    ip: '127.0.0.1',
    unread: false,
    payload: { records: '1,248 rows', format: 'XLSX & PDF', archive: 'Stored' },
  },
];

const CATEGORY_META: Record<ActivityCategory, { grad: string; icon: typeof Activity }> = {
  Security: { grad: GRAD.danger, icon: Shield },
  Deploy: { grad: GRAD.primaryStatic, icon: GitBranch },
  Content: { grad: GRAD.info, icon: FileText },
  Billing: { grad: GRAD.success, icon: CreditCard },
};

export function ActivitiesView() {
  const [items, setItems] = useState<ActivityEntry[]>(INITIAL_ACTIVITIES);
  const [loadedExtra, setLoadedExtra] = useState(false);
  const [category, setCategory] = useState<'All' | ActivityCategory>('All');
  const [onlyUnread, setOnlyUnread] = useState(false);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>('act-1');

  const unreadCount = useMemo(() => items.filter((i) => i.unread).length, [items]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchCat = category === 'All' || item.category === category;
      const matchUnread = !onlyUnread || item.unread;
      const matchQuery =
        !q ||
        item.actor.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);
      return matchCat && matchUnread && matchQuery;
    });
  }, [items, category, onlyUnread, search]);

  const markAllRead = () => {
    setItems((prev) => prev.map((i) => ({ ...i, unread: false })));
    showToast('Semua log aktivitas ditandai telah dibaca.', 'success');
  };

  const loadOlder = () => {
    if (loadedExtra) return;
    setItems((prev) => [...prev, ...EXTRA_ACTIVITIES]);
    setLoadedExtra(true);
    showToast('Riwayat aktivitas sebelumnya dimuat.', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Top Filter & Summary Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-xs ${GRAD.primaryStatic}`}>
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Timeline Aktivitas & Audit Log</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${GRAD.info}`}>
                  {unreadCount} Belum Dibaca
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Pantau riwayat deploy, perubahan keamanan RBAC, publikasi konten, dan transaksi sistem secara kronologis.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setOnlyUnread((v) => !v)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                onlyUnread ? GRAD.warning : GRAD.light
              }`}
            >
              Belum Dibaca ({unreadCount})
            </button>
            <button
              type="button"
              onClick={markAllRead}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs cursor-pointer ${GRAD.primary}`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Tandai Semua Dibaca</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap gap-1.5">
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
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari aktor atau aktivitas..."
              className="pl-8 pr-3 py-1.5 w-60 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#175cd3]"
            />
          </div>
        </div>
      </div>

      {/* Vertical Timeline List */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
        <div className="relative pl-6 sm:pl-8 space-y-5 before:content-[''] before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {filtered.map((entry) => {
            const meta = CATEGORY_META[entry.category];
            const CatIcon = meta.icon;
            const isExpanded = expandedId === entry.id;
            return (
              <div key={entry.id} className="relative">
                <div
                  className={`absolute -left-6 sm:-left-8 top-1 w-7 h-7 rounded-xl flex items-center justify-center shadow-xs ${meta.grad}`}
                >
                  <CatIcon className="w-3.5 h-3.5" />
                </div>

                <div
                  className={`rounded-2xl border p-4 sm:p-5 transition-all ${
                    entry.unread ? 'border-[#175cd3]/40 bg-blue-50/20' : 'border-slate-200/80 bg-white'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${meta.grad}`}>
                          {entry.category}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{entry.actor}</span>
                        {entry.unread && (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${GRAD.warning}`}>
                            Baru
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">{entry.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{entry.description}</p>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                        <Clock className="w-3 h-3" /> {entry.timeAgo}
                      </span>
                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer ${GRAD.light}`}
                      >
                        <span>Detail Log</span>
                        {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(entry.payload).map(([k, v]) => (
                          <span
                            key={k}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-[11px] text-slate-700"
                          >
                            <span className="text-slate-500">{k}:</span>{' '}
                            <strong className="font-semibold text-slate-900">{v}</strong>
                          </span>
                        ))}
                      </div>
                      <span className="text-[11px] font-mono text-slate-500">IP: {entry.ip}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="py-10 text-center text-xs text-slate-500">
              Tidak ada aktivitas yang sesuai dengan filter pencarian saat ini.
            </div>
          )}
        </div>

        {!loadedExtra && (
          <div className="pt-5 flex justify-center">
            <button
              type="button"
              onClick={loadOlder}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer ${GRAD.light}`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Muat Aktivitas Sebelumnya</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
