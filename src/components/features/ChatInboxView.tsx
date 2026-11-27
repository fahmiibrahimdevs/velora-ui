import React, { useState } from 'react';
import {
  CheckCircle2,
  Copy,
  Paperclip,
  Phone,
  Search,
  Send,
  Tag,
} from 'lucide-react';
import { showToast } from '../../lib/swal';

const GRAD = {
  primary:
    'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white',
  primaryStatic: 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white',
  info:
    'bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] hover:from-[#0284c7] hover:to-[#0369a1] text-white',
  warning:
    'bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:from-[#ea580c] hover:to-[#b45309] text-white',
  success:
    'bg-gradient-to-r from-[#22c55e] to-[#15803d] hover:from-[#16a34a] hover:to-[#166534] text-white',
  light:
    'bg-gradient-to-r from-[#f8fafc] to-[#e2e8f0] hover:from-[#e2e8f0] hover:to-[#cbd5e1] text-slate-800 border border-slate-200/80',
} as const;

interface ChatMessage {
  id: string;
  sender: 'customer' | 'agent';
  text: string;
  time: string;
  attachment?: string;
}

interface ConversationThread {
  id: string;
  name: string;
  initials: string;
  company: string;
  email: string;
  phone: string;
  channel: 'WhatsApp' | 'Web Chat' | 'Email';
  online: boolean;
  vip: boolean;
  resolved: boolean;
  unread: number;
  lastOrder: string;
  agentNote: string;
  messages: ChatMessage[];
}

const INITIAL_THREADS: ConversationThread[] = [
  {
    id: 'c1',
    name: 'Raka Pratama',
    initials: 'RP',
    company: 'PT Maju Sejahtera Tbk',
    email: 'raka@majusejahtera.co.id',
    phone: '+62 812-3456-7890',
    channel: 'WhatsApp',
    online: true,
    vip: true,
    resolved: false,
    unread: 2,
    lastOrder: '#INV-2026-0842 • Rp 3.850.000',
    agentNote: 'Pelanggan menanyakan verifikasi bukti transfer BCA pagi ini.',
    messages: [
      {
        id: 'm1',
        sender: 'customer',
        text: 'Halo tim Velora, saya barusan transfer untuk pelunasan invoice #INV-2026-0842 ya.',
        time: '09:41',
        attachment: 'Bukti-Transfer-BCA-TRF88412.jpg',
      },
      {
        id: 'm2',
        sender: 'agent',
        text: 'Halo Pak Raka, terima kasih! Lampiran sudah masuk, tim Finance kami sedang memverifikasi mutasi ya.',
        time: '09:43',
      },
      {
        id: 'm3',
        sender: 'customer',
        text: 'Baik ditunggu konfirmasinya ya, sekalian faktur pajaknya jika sudah terbit.',
        time: '09:45',
      },
    ],
  },
  {
    id: 'c2',
    name: 'Sinta Wijaya',
    initials: 'SW',
    company: 'CV Karya Mandiri',
    email: 'sinta@karyamandiri.id',
    phone: '+62 813-9900-2211',
    channel: 'Web Chat',
    online: true,
    vip: false,
    resolved: false,
    unread: 1,
    lastOrder: '#SUB-PRO-119 • Rp 1.490.000',
    agentNote: 'Butuh bantuan tambah 3 seat admin tambahan.',
    messages: [
      {
        id: 'm21',
        sender: 'customer',
        text: 'Selamat pagi, bagaimana cara menambah 3 user Admin tambahan di workspace kami?',
        time: '08:50',
      },
    ],
  },
  {
    id: 'c3',
    name: 'Bima Pratama',
    initials: 'BP',
    company: 'Velora Logistics',
    email: 'bima@veloralogistics.id',
    phone: '+62 811-7788-4455',
    channel: 'Email',
    online: false,
    vip: true,
    resolved: true,
    unread: 0,
    lastOrder: '#INV-2026-0790 • Rp 12.500.000',
    agentNote: 'Integrasi webhook staging sudah berjalan lancar.',
    messages: [
      {
        id: 'm31',
        sender: 'customer',
        text: 'API Key production sudah kami pasang dan berfungsi baik. Terima kasih bantuannya!',
        time: 'Kemarin',
      },
      {
        id: 'm32',
        sender: 'agent',
        text: 'Sama-sama Pak Bima! Jangan ragu hubungi kami jika butuh bantuan lagi.',
        time: 'Kemarin',
      },
    ],
  },
];

const QUICK_REPLIES = [
  'Sedang kami cek ya, mohon tunggu sebentar 🙏',
  'Bukti pembayaran sudah terverifikasi sah ✅',
  'Silakan cek email, faktur PDF sudah dikirim.',
];

export function ChatInboxView() {
  const [threads, setThreads] = useState<ConversationThread[]>(INITIAL_THREADS);
  const [activeId, setActiveId] = useState<string>('c1');
  const [filterTab, setFilterTab] = useState<'all' | 'unread' | 'vip'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [noteDraft, setNoteDraft] = useState<Record<string, string>>({});

  const visibleThreads = threads.filter((t) => {
    if (filterTab === 'unread' && t.unread === 0) return false;
    if (filterTab === 'vip' && !t.vip) return false;
    if (searchQuery.trim() && !t.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const activeThread = threads.find((t) => t.id === activeId) ?? threads[0];

  const selectThread = (id: string) => {
    setActiveId(id);
    setThreads((prev) => prev.map((t) => (t.id === id ? { ...t, unread: 0 } : t)));
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = messageInput.trim();
    if (!clean || !activeThread) return;
    const now = new Date();
    const hhmm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThread.id
          ? {
              ...t,
              unread: 0,
              messages: [
                ...t.messages,
                { id: `msg-${Date.now()}`, sender: 'agent', text: clean, time: hhmm },
              ],
            }
          : t,
      ),
    );
    setMessageInput('');
  };

  const toggleResolved = () => {
    if (!activeThread) return;
    const nextState = !activeThread.resolved;
    setThreads((prev) =>
      prev.map((t) => (t.id === activeThread.id ? { ...t, resolved: nextState } : t)),
    );
    showToast(
      nextState ? 'Tiket percakapan ditandai Selesai!' : 'Percakapan dibuka kembali.',
      nextState ? 'success' : 'info',
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-8 h-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full inline-block" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Live Chat &amp; Helpdesk Inbox
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            Workspace layanan pelanggan 3-kolom dengan daftar obrolan, balasan cepat, status penyelesaian, dan profil CRM.
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${GRAD.success}`}>
          Agen Online • SLA &lt; 2 menit
        </span>
      </div>

      {/* 3-Column Split Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
        {/* Column 1: Conversations List */}
        <div className="lg:col-span-4 xl:col-span-3 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-100 space-y-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 focus-within:border-[#1351b8]">
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari pelanggan..."
                className="w-full text-xs text-slate-900 outline-none"
              />
            </div>
            <div className="flex gap-1.5">
              {[
                { id: 'all' as const, label: 'Semua' },
                { id: 'unread' as const, label: 'Belum Dibaca' },
                { id: 'vip' as const, label: 'VIP' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setFilterTab(t.id)}
                  className={`flex-1 py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer ${
                    filterTab === t.id ? GRAD.primary : GRAD.light
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto flex-1">
            {visibleThreads.map((t) => {
              const selected = t.id === activeThread.id;
              const lastMsg = t.messages[t.messages.length - 1];
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => selectThread(t.id)}
                  className={`w-full p-4 text-left flex items-start gap-3 transition-all cursor-pointer ${
                    selected ? 'bg-blue-50/40' : 'hover:bg-slate-50/70'
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold ${GRAD.primaryStatic}`}>
                      {t.initials}
                    </div>
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                        t.online ? 'bg-emerald-500' : 'bg-slate-300'
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900 truncate">{t.name}</span>
                      <span className="text-[10px] text-slate-500 shrink-0">{lastMsg?.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 truncate mt-0.5">{lastMsg?.text}</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[10px] font-medium text-slate-500">{t.channel}</span>
                      {t.unread > 0 && (
                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${GRAD.primaryStatic}`}>
                          {t.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Column 2: Active Message Stream */}
        <div className="lg:col-span-5 xl:col-span-6 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-200">
          {/* Chat Header */}
          <div className="px-5 py-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold ${GRAD.info}`}>
                {activeThread.initials}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-slate-900">{activeThread.name}</p>
                  {activeThread.vip && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${GRAD.warning}`}>
                      VIP
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-600">
                  {activeThread.company} • {activeThread.channel}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleResolved}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer ${
                activeThread.resolved ? GRAD.success : GRAD.light
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {activeThread.resolved ? 'Selesai' : 'Tandai Selesai'}
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-5 space-y-3.5 overflow-y-auto bg-white max-h-[400px]">
            {activeThread.messages.map((msg) => {
              const isAgent = msg.sender === 'agent';
              return (
                <div key={msg.id} className={`flex flex-col ${isAgent ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-2xs ${
                      isAgent
                        ? `${GRAD.primaryStatic} rounded-br-xs`
                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs'
                    }`}
                  >
                    <p>{msg.text}</p>
                    {msg.attachment && (
                      <div className="mt-2 p-2 rounded-xl border border-slate-200 flex items-center gap-2 text-[11px] text-slate-800 bg-white">
                        <Paperclip className="w-3.5 h-3.5 text-[#175cd3]" />
                        <span className="font-medium truncate">{msg.attachment}</span>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.time}</span>
                </div>
              );
            })}
          </div>

          {/* Quick Reply + Composer */}
          <div className="p-4 border-t border-slate-100 space-y-2.5 bg-white">
            <div className="flex flex-wrap gap-1.5">
              {QUICK_REPLIES.map((qr) => (
                <button
                  key={qr}
                  type="button"
                  onClick={() => setMessageInput(qr)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium cursor-pointer ${GRAD.light}`}
                >
                  {qr}
                </button>
              ))}
            </div>

            <form onSubmit={sendMessage} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => showToast('Lampiran file ditambahkan ke chat!', 'info')}
                className={`p-2.5 rounded-xl cursor-pointer ${GRAD.light}`}
                title="Lampirkan file"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder={`Balas pesan ke ${activeThread.name}...`}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 outline-none focus:border-[#1351b8]"
              />
              <button
                type="submit"
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer ${GRAD.primary}`}
              >
                <Send className="w-3.5 h-3.5" />
                Kirim
              </button>
            </form>
          </div>
        </div>

        {/* Column 3: Customer Context & Notes */}
        <div className="lg:col-span-3 p-5 space-y-4 text-xs bg-white">
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 text-sm">Profil Pelanggan</h4>
            <p className="text-[11px] text-slate-600">Konteks order &amp; catatan internal tim</p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Email</span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(activeThread.email);
                  showToast('Email pelanggan disalin!', 'success');
                }}
                className="font-medium text-[#175cd3] hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span className="truncate max-w-[130px]">{activeThread.email}</span>
                <Copy className="w-3 h-3 shrink-0" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600 flex items-center gap-1"><Phone className="w-3 h-3" /> Telepon</span>
              <span className="font-medium text-slate-900">{activeThread.phone}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 space-y-1.5">
            <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">Transaksi Terakhir</p>
            <p className="font-semibold text-slate-900">{activeThread.lastOrder}</p>
            <div className="flex gap-1.5 pt-1">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold inline-flex items-center gap-1 ${GRAD.info}`}>
                <Tag className="w-2.5 h-2.5" /> {activeThread.channel}
              </span>
              {activeThread.vip && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${GRAD.warning}`}>
                  Enterprise
                </span>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-800 block">Catatan Internal Agen</label>
            <textarea
              rows={4}
              value={noteDraft[activeThread.id] ?? activeThread.agentNote}
              onChange={(e) =>
                setNoteDraft((prev) => ({ ...prev, [activeThread.id]: e.target.value }))
              }
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 outline-none focus:border-[#1351b8]"
            />
            <button
              type="button"
              onClick={() => showToast('Catatan internal agen disimpan!', 'success')}
              className={`w-full py-2 rounded-xl font-semibold cursor-pointer ${GRAD.light}`}
            >
              Simpan Catatan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
