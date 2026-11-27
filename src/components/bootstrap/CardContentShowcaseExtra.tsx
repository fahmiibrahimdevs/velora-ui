import React, { useState } from 'react';
import {
  Calendar,
  Check,
  ChevronDown,
  Copy,
  CreditCard,
  Download,
  Eye,
  EyeOff,
  FileSpreadsheet,
  FileText,
  Heart,
  Image as ImageIcon,
  KeyRound,
  MessageSquare,
  Paperclip,
  RefreshCw,
  Send,
  ShoppingBag,
  Star,
  Trash2,
  Users,
} from 'lucide-react';
import { showToast } from '../../lib/swal';
import { formatThousandDot, GRAD } from './modalShared';

export type CardShowcaseCategory = 'all' | 'team' | 'forms' | 'finance' | 'content';

interface CardContentShowcaseExtraProps {
  filter: CardShowcaseCategory;
}

const CHART_BARS = [
  { day: 'Sen', val: 48, label: 'Rp 12,4 jt' },
  { day: 'Sel', val: 72, label: 'Rp 18,9 jt' },
  { day: 'Rab', val: 60, label: 'Rp 15,2 jt' },
  { day: 'Kam', val: 90, label: 'Rp 24,8 jt' },
  { day: 'Jum', val: 82, label: 'Rp 21,6 jt' },
  { day: 'Sab', val: 44, label: 'Rp 11,0 jt' },
  { day: 'Min', val: 34, label: 'Rp 8,5 jt' },
];

const TABLE_ROWS = [
  { id: '#TRX-901', client: 'PT Maju Jaya', status: 'Lunas', total: 'Rp 4.500.000', tab: 'latest' as const },
  { id: '#TRX-902', client: 'CV Karya Digital', status: 'Pending', total: 'Rp 2.850.000', tab: 'pending' as const },
  { id: '#TRX-903', client: 'Studio Nusantara', status: 'Lunas', total: 'Rp 7.200.000', tab: 'latest' as const },
  { id: '#TRX-904', client: 'Klinik Medika', status: 'Pending', total: 'Rp 1.950.000', tab: 'pending' as const },
];

export function CardContentShowcaseExtra({ filter }: CardContentShowcaseExtraProps) {
  // 8. Product Card
  const [prodWishlist, setProdWishlist] = useState(false);
  const [prodColor, setProdColor] = useState<'Biru' | 'Hitam' | 'Silver'>('Biru');
  const [prodQty, setProdQty] = useState(1);

  // 9. Corporate Card
  const [showCardNum, setShowCardNum] = useState(false);

  // 10. Team Collaborators
  const [members, setMembers] = useState<
    { id: string; name: string; init: string; role: 'Admin' | 'Editor' | 'Viewer'; grad: string }[]
  >([
    { id: 'm1', name: 'Raka Pratama', init: 'RP', role: 'Admin', grad: GRAD.primaryStatic },
    { id: 'm2', name: 'Sinta Wijaya', init: 'SW', role: 'Editor', grad: GRAD.info },
    { id: 'm3', name: 'Bima Pratama', init: 'BP', role: 'Viewer', grad: GRAD.success },
  ]);

  // 11. Attachments Card
  const [attachments, setAttachments] = useState([
    { id: 'a1', name: 'Kontrak-Kerja-2026.pdf', size: '2.4 MB', kind: 'pdf' as const },
    { id: 'a2', name: 'RAB-Estimasi-Q4.xlsx', size: '840 KB', kind: 'xlsx' as const },
    { id: 'a3', name: 'Wireframe-Portal.png', size: '1.6 MB', kind: 'img' as const },
  ]);

  // 13. Event RSVP
  const [rsvp, setRsvp] = useState<'hadir' | 'izin'>('hadir');

  // 14. Mini Comments Feed
  const [comments, setComments] = useState([
    { id: 'cm1', author: 'Nadia Kusuma', text: 'Komponen modal dan card sudah siap direview ya!', time: '5m lalu' },
    { id: 'cm2', author: 'Fahmi Ibrahim', text: 'Mantap, lanjut integrasi ke halaman project.', time: '2m lalu' },
  ]);
  const [commentInput, setCommentInput] = useState('');

  // 15. API Credential
  const [showSecret, setShowSecret] = useState(false);
  const [pingStatus, setPingStatus] = useState<'idle' | 'ok'>('idle');

  // 16. FAQ Accordion
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // 17. Compact Table Tab
  const [tableTab, setTableTab] = useState<'all' | 'latest' | 'pending'>('all');

  // 18. Bar Chart hover
  const [activeBarIdx, setActiveBarIdx] = useState<number>(3);

  // 19. Support Ticket Quick Form
  const [ticketSubj, setTicketSubj] = useState('');
  const [ticketPrio, setTicketPrio] = useState('Normal');

  const show = (cat: Exclude<CardShowcaseCategory, 'all'>) => filter === 'all' || filter === cat;

  const filteredTableRows =
    tableTab === 'all' ? TABLE_ROWS : TABLE_ROWS.filter((r) => r.tab === tableTab);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    setComments((prev) => [
      ...prev,
      { id: `cm-${Date.now()}`, author: 'Anda', text: commentInput.trim(), time: 'Baru saja' },
    ]);
    setCommentInput('');
  };

  return (
    <>
      {/* 8. PRODUCT E-COMMERCE CARD */}
      {show('finance') && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="p-5 bg-gradient-to-br from-[#0f172a] via-[#175cd3] to-[#0ea5e9] text-white relative">
            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${GRAD.danger}`}>
                Diskon 20%
              </span>
              <button
                type="button"
                onClick={() => setProdWishlist((w) => !w)}
                className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center cursor-pointer"
                aria-label="Wishlist"
              >
                <Heart className={`w-4 h-4 ${prodWishlist ? 'fill-rose-400 text-rose-400' : 'text-white'}`} />
              </button>
            </div>
            <div className="py-5 text-center space-y-1">
              <ShoppingBag className="w-10 h-10 mx-auto opacity-95" />
              <p className="text-xs font-semibold text-blue-100">Hardware &amp; Kit Bundling</p>
            </div>
          </div>

          <div className="p-5 space-y-3 text-xs">
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-sm font-bold text-slate-900">Velora Dev Dock Pro USB-C</h4>
              <span className="inline-flex items-center gap-0.5 font-semibold text-amber-600 shrink-0">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 4.9
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-extrabold text-[#175cd3]">
                Rp {formatThousandDot(String(1890000 * prodQty))}
              </span>
              <span className="text-[11px] line-through text-slate-500">Rp 2.350.000</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5">
                {(['Biru', 'Hitam', 'Silver'] as const).map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setProdColor(col)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold cursor-pointer ${
                      prodColor === col ? GRAD.primary : GRAD.light
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
              <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setProdQty((q) => Math.max(1, q - 1))}
                  className="px-2.5 py-1 hover:bg-slate-50 font-bold cursor-pointer"
                >
                  -
                </button>
                <span className="px-2.5 py-1 font-semibold text-slate-900">{prodQty}</span>
                <button
                  type="button"
                  onClick={() => setProdQty((q) => q + 1)}
                  className="px-2.5 py-1 hover:bg-slate-50 font-bold cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="px-5 py-3.5 border-t border-slate-100">
            <button
              type="button"
              onClick={() => showToast(`${prodQty}x Velora Dev Dock (${prodColor}) masuk keranjang!`, 'success')}
              className={`w-full py-2 rounded-xl text-xs font-semibold cursor-pointer ${GRAD.primary}`}
            >
              + Tambah ke Keranjang
            </button>
          </div>
        </div>
      )}

      {/* 9. CORPORATE BANK / VIRTUAL CARD */}
      {show('finance') && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-[#1351b8] flex items-center gap-1.5">
              <CreditCard className="w-4 h-4" /> Kartu Operasional Tim
            </h4>
            <button
              type="button"
              onClick={() => setShowCardNum((s) => !s)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer ${GRAD.light}`}
            >
              {showCardNum ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              {showCardNum ? 'Tutup' : 'Intip'}
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#175cd3] text-white space-y-5 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold tracking-wider uppercase text-blue-200">
                Velora Corporate
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${GRAD.success}`}>
                Aktif
              </span>
            </div>
            <p className="font-mono text-base sm:text-lg font-bold tracking-widest">
              {showCardNum ? '4532  8810  2940  1234' : '4532  ••••  ••••  1234'}
            </p>
            <div className="flex items-center justify-between text-[11px] text-slate-200">
              <div>
                <p className="text-slate-400 text-[10px]">PEMEGANG</p>
                <p className="font-semibold text-white">FAHMI IBRAHIM</p>
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-[10px]">EXP / CVV</p>
                <p className="font-mono font-semibold text-white">{showCardNum ? '11/29 • 842' : '11/29 • •••'}</p>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-600">Pemakaian Limit Bulan Ini</span>
              <span className="font-bold text-slate-900">Rp 14,2 jt / 25 jt</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#175cd3] to-[#0ea5e9]" style={{ width: '57%' }} />
            </div>
          </div>
        </div>
      )}

      {/* 10. TEAM COLLABORATORS & ROLE SWITCHER CARD */}
      {show('team') && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#175cd3]" />
              <h4 className="text-sm font-bold text-[#1351b8]">Anggota Proyek</h4>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${GRAD.primaryStatic}`}>
              {members.length} Aktif
            </span>
          </div>

          <div className="p-5 divide-y divide-slate-100 text-xs">
            {members.map((m) => (
              <div key={m.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${m.grad}`}>
                    {m.init}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 truncate">{m.name}</p>
                    <p className="text-[10px] text-emerald-600 font-medium">● Online</p>
                  </div>
                </div>
                <select
                  value={m.role}
                  onChange={(e) => {
                    const nextRole = e.target.value as 'Admin' | 'Editor' | 'Viewer';
                    setMembers((prev) =>
                      prev.map((row) => (row.id === m.id ? { ...row, role: nextRole } : row)),
                    );
                    showToast(`Role ${m.name} diubah ke ${nextRole}`, 'success');
                  }}
                  className="px-2 py-1 rounded-lg border border-slate-200 text-[11px] font-semibold text-slate-700 bg-white outline-none cursor-pointer"
                >
                  <option value="Admin">Admin</option>
                  <option value="Editor">Editor</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>
            ))}
          </div>

          <div className="px-5 py-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => showToast('Dialog undang anggota siap dibuka!', 'info')}
              className={`w-full py-2 rounded-xl text-xs font-semibold cursor-pointer ${GRAD.light}`}
            >
              + Undang Kolaborator Baru
            </button>
          </div>
        </div>
      )}

      {/* 11. FILE ATTACHMENTS LIST CARD */}
      {show('forms') && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Paperclip className="w-4 h-4 text-[#175cd3]" />
              <h4 className="text-sm font-bold text-[#1351b8]">Lampiran Dokumen</h4>
            </div>
            <span className="text-[11px] font-semibold text-slate-600">{attachments.length} File</span>
          </div>

          <div className="p-5 space-y-2.5 text-xs">
            {attachments.map((att) => (
              <div
                key={att.id}
                className="p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      att.kind === 'pdf' ? GRAD.danger : att.kind === 'xlsx' ? GRAD.success : GRAD.info
                    }`}
                  >
                    {att.kind === 'pdf' ? (
                      <FileText className="w-4 h-4" />
                    ) : att.kind === 'xlsx' ? (
                      <FileSpreadsheet className="w-4 h-4" />
                    ) : (
                      <ImageIcon className="w-4 h-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 truncate">{att.name}</p>
                    <p className="text-[10px] text-slate-600">{att.size}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => showToast(`Mengunduh ${att.name}...`, 'success')}
                    className="p-1.5 rounded-lg text-[#175cd3] hover:bg-blue-50 cursor-pointer"
                    title="Unduh"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttachments((prev) => prev.filter((x) => x.id !== att.id))}
                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 12. MINI INVOICE SUMMARY CARD */}
      {show('finance') && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-[#1351b8]">Ringkasan Tagihan</h4>
              <p className="text-[11px] text-slate-600">#INV-2026-0842 • PT Maju Jaya</p>
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${GRAD.success}`}>
              LUNAS
            </span>
          </div>

          <div className="p-5 space-y-2.5 text-xs">
            <div className="flex justify-between text-slate-700">
              <span>Implementasi Modul ERP</span>
              <span className="font-medium text-slate-900">Rp 8.000.000</span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>Setup Cloud Server &amp; SSL</span>
              <span className="font-medium text-slate-900">Rp 1.500.000</span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>PPN 11%</span>
              <span className="font-medium text-slate-900">Rp 1.045.000</span>
            </div>
            <div className="pt-2.5 border-t border-slate-200 flex justify-between font-bold text-sm">
              <span className="text-slate-900">Total Bayar</span>
              <span className="text-[#175cd3]">Rp 10.545.000</span>
            </div>
          </div>

          <div className="px-5 py-3.5 border-t border-slate-100 flex justify-end">
            <button
              type="button"
              onClick={() => showToast('Kwitansi #INV-2026-0842.pdf diunduh!', 'success')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer ${GRAD.primary}`}
            >
              <Download className="w-3.5 h-3.5" />
              Unduh Kwitansi
            </button>
          </div>
        </div>
      )}

      {/* 13. EVENT SCHEDULE & RSVP CARD */}
      {show('team') && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="p-5 flex items-start gap-3.5 border-b border-slate-100">
            <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 ${GRAD.primaryStatic}`}>
              <span className="text-[10px] font-bold uppercase leading-none">NOV</span>
              <span className="text-base font-extrabold leading-tight">28</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Weekly Sprint Review &amp; Demo</h4>
              <p className="text-[11px] text-slate-600 mt-0.5 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#175cd3]" /> Jumat, 14:00 – 15:30 WIB
              </p>
            </div>
          </div>

          <div className="p-5 space-y-3 text-xs">
            <div className="p-2.5 rounded-xl border border-slate-200 flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] text-slate-700 truncate">meet.google.com/vlr-sprint</span>
              <button
                type="button"
                onClick={() => showToast('Link meeting disalin!', 'success')}
                className="text-[#175cd3] font-semibold text-[11px] shrink-0 cursor-pointer"
              >
                Salin
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setRsvp('hadir');
                  showToast('Status RSVP: Hadir!', 'success');
                }}
                className={`py-2 rounded-xl font-semibold inline-flex items-center justify-center gap-1 cursor-pointer ${
                  rsvp === 'hadir' ? GRAD.success : GRAD.light
                }`}
              >
                <Check className="w-3.5 h-3.5" /> Hadir
              </button>
              <button
                type="button"
                onClick={() => {
                  setRsvp('izin');
                  showToast('Status RSVP: Izin', 'info');
                }}
                className={`py-2 rounded-xl font-semibold cursor-pointer ${
                  rsvp === 'izin' ? GRAD.warning : GRAD.light
                }`}
              >
                Izin / Bentrok
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 14. MINI COMMENTS & FEED CARD */}
      {show('team') && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#175cd3]" />
              <h4 className="text-sm font-bold text-[#1351b8]">Diskusi Komentar</h4>
            </div>
            <span className="text-[11px] text-slate-600">{comments.length} Balasan</span>
          </div>

          <div className="p-5 space-y-3 text-xs">
            <div className="space-y-2.5 max-h-36 overflow-y-auto">
              {comments.map((c) => (
                <div key={c.id} className="p-2.5 rounded-xl border border-slate-100">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-bold text-slate-900">{c.author}</span>
                    <span className="text-slate-500">{c.time}</span>
                  </div>
                  <p className="text-slate-700 mt-0.5">{c.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleCommentSubmit} className="flex gap-2">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Tulis balasan cepat..."
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-slate-900 outline-none focus:border-[#1351b8]"
              />
              <button
                type="submit"
                className={`px-3 py-2 rounded-xl font-semibold inline-flex items-center cursor-pointer ${GRAD.primary}`}
                aria-label="Kirim Komentar"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 15. API KEY & WEBHOOK HEALTH CARD */}
      {show('forms') && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[#175cd3]" />
              <h4 className="text-sm font-bold text-[#1351b8]">API &amp; Webhook Key</h4>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${GRAD.success}`}>
              {pingStatus === 'ok' ? '200 OK (94ms)' : 'Connected'}
            </span>
          </div>

          <div className="p-5 space-y-3 text-xs">
            <div className="space-y-1">
              <span className="text-[11px] font-medium text-slate-600">Production Secret Key</span>
              <div className="p-2.5 rounded-xl border border-slate-200 flex items-center justify-between gap-2">
                <code className="font-mono text-slate-900 truncate">
                  {showSecret ? 'vlr_live_98a7c4b1e0f234d9' : 'vlr_live_••••••••••••••••'}
                </code>
                <div className="flex gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowSecret((s) => !s)}
                    className="p-1 text-slate-500 hover:text-slate-900 cursor-pointer"
                  >
                    {showSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText('vlr_live_98a7c4b1e0f234d9');
                      showToast('API Key disalin!', 'success');
                    }}
                    className="p-1 text-[#175cd3] cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setPingStatus('ok');
                showToast('Test ping webhook sukses: 200 OK (94ms)', 'success');
              }}
              className={`w-full py-2 rounded-xl font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer ${GRAD.dark}`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Kirim Test Ping Webhook
            </button>
          </div>
        </div>
      )}

      {/* 16. INTERACTIVE FAQ ACCORDION CARD */}
      {show('content') && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h4 className="text-sm font-bold text-[#1351b8]">FAQ Accordion Card</h4>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {[
              {
                q: 'Apakah komponen card bisa dipakai dengan form?',
                a: 'Ya, setiap card mendukung layout grid input, validasi, tombol aksi footer, serta format angka otomatis.',
              },
              {
                q: 'Bagaimana cara menyamakan warna gradien?',
                a: 'Gunakan utilitas palet GRAD standar Velora UI untuk semua tombol aktif, badge status, dan header banner.',
              },
              {
                q: 'Apakah mendukung mode mobile & Top Nav?',
                a: 'Sepenuhnya responsif mengikuti lebar kontainer 1520px pada Top Navigation maupun Default Sidebar.',
              },
            ].map((item, idx) => {
              const open = openFaq === idx;
              return (
                <div key={item.q} className="px-5 py-3">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : idx)}
                    className="w-full flex items-center justify-between gap-2 text-left font-semibold text-slate-900 cursor-pointer"
                  >
                    <span>{item.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${open ? 'rotate-180 text-[#175cd3]' : ''}`} />
                  </button>
                  {open && <p className="text-slate-600 mt-2 leading-relaxed">{item.a}</p>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 17. COMPACT TABBED TABLE CARD */}
      {show('finance') && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden lg:col-span-2">
          <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h4 className="text-sm font-bold text-[#1351b8]">Tabel Transaksi Ringkas di Card</h4>
              <p className="text-[11px] text-slate-600">Dilengkapi filter tab status di header card</p>
            </div>
            <div className="flex gap-1.5">
              {[
                { id: 'all' as const, label: 'Semua' },
                { id: 'latest' as const, label: 'Lunas' },
                { id: 'pending' as const, label: 'Pending' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTableTab(t.id)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-semibold cursor-pointer ${
                    tableTab === t.id ? GRAD.primary : GRAD.light
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-600">
                  <th className="py-2.5 px-5">Invoice</th>
                  <th className="py-2.5 px-4">Klien</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-5 text-right">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTableRows.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-5 font-mono font-semibold text-[#175cd3]">{r.id}</td>
                    <td className="py-2.5 px-4 font-medium text-slate-900">{r.client}</td>
                    <td className="py-2.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          r.status === 'Lunas' ? GRAD.success : GRAD.warning
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-5 text-right font-bold text-slate-900">{r.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 18. WEEKLY BAR CHART MINI ANALYTICS CARD */}
      {show('content') && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden p-5 flex flex-col justify-between space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-[#1351b8]">Grafik Mingguan di Card</h4>
              <p className="text-[11px] text-slate-600">Klik/arahkan batang untuk lihat nilai</p>
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${GRAD.info}`}>
              {CHART_BARS[activeBarIdx].label}
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2 items-end h-32 pt-4">
            {CHART_BARS.map((b, idx) => {
              const active = idx === activeBarIdx;
              return (
                <button
                  key={b.day}
                  type="button"
                  onMouseEnter={() => setActiveBarIdx(idx)}
                  onClick={() => setActiveBarIdx(idx)}
                  className="flex flex-col items-center gap-1.5 h-full justify-end cursor-pointer"
                >
                  <div
                    style={{ height: `${b.val}%` }}
                    className={`w-full rounded-t-lg transition-all ${
                      active
                        ? 'bg-gradient-to-t from-[#0f3ba0] to-[#0ea5e9]'
                        : 'bg-gradient-to-t from-[#cbd5e1] to-[#94a3b8] opacity-75 hover:opacity-100'
                    }`}
                  />
                  <span className={`text-[10px] ${active ? 'font-bold text-[#175cd3]' : 'text-slate-600'}`}>
                    {b.day}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 19. QUICK SUPPORT TICKET FORM CARD */}
      {show('forms') && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            showToast(`Tiket bantuan (${ticketPrio}) berhasil dikirim ke tim support!`, 'success');
            setTicketSubj('');
          }}
          className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden flex flex-col justify-between"
        >
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h4 className="text-sm font-bold text-[#1351b8]">Quick Support Ticket</h4>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${GRAD.warning}`}>
              SLA 15m
            </span>
          </div>

          <div className="p-5 space-y-3 text-xs">
            <input
              type="text"
              required
              value={ticketSubj}
              onChange={(e) => setTicketSubj(e.target.value)}
              placeholder="Subjek kendala (mis. Gagal export CSV)..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 outline-none focus:border-[#1351b8]"
            />
            <div className="flex gap-2">
              {['Normal', 'Urgent', 'Blocker'].map((pr) => (
                <button
                  key={pr}
                  type="button"
                  onClick={() => setTicketPrio(pr)}
                  className={`flex-1 py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer ${
                    ticketPrio === pr ? (pr === 'Blocker' ? GRAD.danger : GRAD.primary) : GRAD.light
                  }`}
                >
                  {pr}
                </button>
              ))}
            </div>
          </div>

          <div className="px-5 py-3.5 border-t border-slate-100 flex justify-end">
            <button type="submit" className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer ${GRAD.primary}`}>
              Kirim Tiket
            </button>
          </div>
        </form>
      )}
    </>
  );
}
