import React, { useState, useMemo } from 'react';
import {
  Ticket,
  Search,
  Send,
  Plus,
  Clock,
  CheckCircle2,
  Paperclip,
  MessageSquare,
} from 'lucide-react';
import { showToast, showSuccess } from '../../lib/swal';

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

type TicketStatus = 'Open' | 'In Progress' | 'Resolved';
type TicketPriority = 'High' | 'Medium' | 'Low';

interface TicketMessage {
  id: string;
  sender: string;
  isAgent: boolean;
  time: string;
  body: string;
}

interface SupportTicket {
  id: string;
  subject: string;
  requester: string;
  requesterEmail: string;
  department: string;
  priority: TicketPriority;
  status: TicketStatus;
  updatedAt: string;
  messages: TicketMessage[];
}

const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'TKT-4091',
    subject: 'Ekspor CSV DataTables menampilkan karakter simbol pada kolom Rupiah',
    requester: 'Rina Marlina',
    requesterEmail: 'rina@mitradata.id',
    department: 'Finance Ops',
    priority: 'High',
    status: 'Open',
    updatedAt: '5 menit lalu',
    messages: [
      {
        id: 'm1',
        sender: 'Rina Marlina',
        isAgent: false,
        time: '14:52 WIB',
        body: 'Halo tim Velora, saat kami klik Export CSV pada halaman DataTables, kolom nominal masih membawa spasi non-breaking. Apakah ada opsi format angka mentah?',
      },
      {
        id: 'm2',
        sender: 'Support Agent (Fahmi)',
        isAgent: true,
        time: '15:01 WIB',
        body: 'Terima kasih laporannya Bu Rina! Tim kami sedang menyiapkan formatter numeric agar Excel langsung membacanya sebagai angka.',
      },
    ],
  },
  {
    id: 'TKT-4088',
    subject: 'Permintaan aktivasi SSO SAML untuk 25 pengguna baru divisi HR',
    requester: 'Andi Wijaya',
    requesterEmail: 'andi.wijaya@nusacorp.co.id',
    department: 'IT Security',
    priority: 'Medium',
    status: 'In Progress',
    updatedAt: '32 menit lalu',
    messages: [
      {
        id: 'm3',
        sender: 'Andi Wijaya',
        isAgent: false,
        time: '14:15 WIB',
        body: 'Kami sudah mengunggah metadata XML IdP Okta di portal. Mohon bantu verifikasi endpoint ACS.',
      },
    ],
  },
  {
    id: 'TKT-4082',
    subject: 'Panduan kustomisasi warna tema gradient pada tombol modul internal',
    requester: 'Budi Santoso',
    requesterEmail: 'budi@kreasiweb.id',
    department: 'Frontend Team',
    priority: 'Low',
    status: 'Resolved',
    updatedAt: 'Kemarin',
    messages: [
      {
        id: 'm4',
        sender: 'Budi Santoso',
        isAgent: false,
        time: 'Kemarin 10:20',
        body: 'Apakah ada referensi palet gradient standar yang dipakai seluruh komponen Velora UI?',
      },
      {
        id: 'm5',
        sender: 'Support Agent (Nadia)',
        isAgent: true,
        time: 'Kemarin 10:34',
        body: 'Ya! Bisa langsung mengacu pada konstanta ButtonsView (primary #175cd3 -> #0f3ba0, info #0ea5e9 -> #0284c7).',
      },
    ],
  },
];

export function TicketsView() {
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
  const [selectedId, setSelectedId] = useState<string>('TKT-4091');
  const [statusFilter, setStatusFilter] = useState<'All' | TicketStatus>('All');
  const [search, setSearch] = useState('');
  const [replyText, setReplyText] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [showNewComposer, setShowNewComposer] = useState(false);

  const filteredTickets = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tickets.filter((t) => {
      const matchSt = statusFilter === 'All' || t.status === statusFilter;
      const matchQ =
        !q ||
        t.id.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.requester.toLowerCase().includes(q);
      return matchSt && matchQ;
    });
  }, [tickets, statusFilter, search]);

  const activeTicket = useMemo(
    () => tickets.find((t) => t.id === selectedId) ?? tickets[0],
    [tickets, selectedId]
  );

  const sendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) {
      showToast('Isi balasan tidak boleh kosong.', 'warning');
      return;
    }
    const newMsg: TicketMessage = {
      id: `m-${Date.now()}`,
      sender: 'Support Agent (Anda)',
      isAgent: true,
      time: 'Baru saja',
      body: replyText.trim(),
    };
    setTickets((prev) =>
      prev.map((t) =>
        t.id === activeTicket.id
          ? { ...t, updatedAt: 'Baru saja', status: t.status === 'Open' ? 'In Progress' : t.status, messages: [...t.messages, newMsg] }
          : t
      )
    );
    setReplyText('');
    showToast('Balasan tiket terkirim.', 'success');
  };

  const updateTicketStatus = (nextStatus: TicketStatus) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === activeTicket.id ? { ...t, status: nextStatus, updatedAt: 'Baru saja' } : t))
    );
    showToast(`Status ${activeTicket.id} diubah ke ${nextStatus}.`, 'info');
  };

  const createTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim()) {
      showToast('Subjek tiket wajib diisi.', 'warning');
      return;
    }
    const created: SupportTicket = {
      id: `TKT-${4092 + tickets.length}`,
      subject: newSubject.trim(),
      requester: 'Fahmi Ibrahim',
      requesterEmail: 'fahmi@velora-ui.dev',
      department: 'Product Ops',
      priority: 'Medium',
      status: 'Open',
      updatedAt: 'Baru saja',
      messages: [
        {
          id: `m-init-${Date.now()}`,
          sender: 'Fahmi Ibrahim',
          isAgent: false,
          time: 'Baru saja',
          body: 'Tiket baru dibuat melalui pusat dukungan Velora UI.',
        },
      ],
    };
    setTickets((prev) => [created, ...prev]);
    setSelectedId(created.id);
    setNewSubject('');
    setShowNewComposer(false);
    await showSuccess('Tiket Dibuat', `${created.id} masuk ke antrean dukungan.`);
  };

  const priorityBadge = (p: TicketPriority) =>
    p === 'High' ? GRAD.danger : p === 'Medium' ? GRAD.warning : GRAD.info;

  const statusBadge = (s: TicketStatus) =>
    s === 'Open' ? GRAD.warning : s === 'In Progress' ? GRAD.primaryStatic : GRAD.success;

  return (
    <div className="space-y-5">
      {showNewComposer && (
        <form
          onSubmit={createTicket}
          className="bg-white rounded-2xl border border-[#175cd3]/40 shadow-xs p-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
        >
          <input
            type="text"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            placeholder="Tulis subjek kendala atau permintaan tiket baru..."
            className="flex-1 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowNewComposer(false)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer ${GRAD.light}`}
            >
              Batal
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-xl text-xs font-semibold shadow-xs cursor-pointer ${GRAD.primary}`}
            >
              Buat Tiket
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Queue Panel */}
        <div className="xl:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-xs ${GRAD.primaryStatic}`}>
                <Ticket className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Antrean Tiket</h2>
                <p className="text-[11px] text-slate-600">{tickets.length} total percakapan</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowNewComposer((v) => !v)}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-xs cursor-pointer ${GRAD.primary}`}
            >
              <Plus className="w-3.5 h-3.5" /> Tiket Baru
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari ID tiket, pengirim, subjek..."
              className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#175cd3]"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {(['All', 'Open', 'In Progress', 'Resolved'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold cursor-pointer ${
                  statusFilter === st ? GRAD.primary : GRAD.light
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-0.5">
            {filteredTickets.map((tkt) => {
              const active = tkt.id === activeTicket.id;
              return (
                <button
                  key={tkt.id}
                  type="button"
                  onClick={() => setSelectedId(tkt.id)}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer space-y-2 ${
                    active ? 'border-[#175cd3] bg-blue-50/35 shadow-xs' : 'border-slate-200/80 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono font-bold text-[#175cd3]">{tkt.id}</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${priorityBadge(tkt.priority)}`}>
                        {tkt.priority}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusBadge(tkt.status)}`}>
                        {tkt.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-slate-900 line-clamp-2">{tkt.subject}</div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{tkt.requester}</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {tkt.updatedAt}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Conversation Detail Panel */}
        <div className="xl:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 flex flex-col justify-between gap-5">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${GRAD.primaryStatic}`}>
                    {activeTicket.id}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${statusBadge(activeTicket.status)}`}>
                    {activeTicket.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-2">{activeTicket.subject}</h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Pelapor: <strong>{activeTicket.requester}</strong> ({activeTicket.requesterEmail}) &bull;{' '}
                  {activeTicket.department}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 shrink-0">
                {(['Open', 'In Progress', 'Resolved'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => updateTicketStatus(st)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold cursor-pointer ${
                      activeTicket.status === st ? GRAD.primary : GRAD.light
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Thread Messages */}
            <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
              {activeTicket.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-4 rounded-2xl border space-y-1.5 ${
                    msg.isAgent ? 'border-[#175cd3]/30 bg-blue-50/25 ml-4 sm:ml-8' : 'border-slate-200 bg-white mr-4 sm:mr-8'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-[#175cd3]" />
                      {msg.sender}
                    </span>
                    <span className="text-[11px] text-slate-500">{msg.time}</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{msg.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Reply Form */}
          <form onSubmit={sendReply} className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-600">Balasan Cepat:</span>
              {[
                'Sedang kami investigasi tim teknis.',
                'Perbaikan sudah diterapkan, silakan cek ulang.',
                'Tiket ditandai selesai. Hubungi kami jika perlu bantuan lagi.',
              ].map((quick) => (
                <button
                  key={quick}
                  type="button"
                  onClick={() => setReplyText(quick)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer ${GRAD.light}`}
                >
                  {quick}
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Tulis tanggapan resmi agen dukungan..."
              className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
            />

            <div className="flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => showToast('Lampiran log diagnostic dilampirkan (demo).', 'info')}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer ${GRAD.light}`}
              >
                <Paperclip className="w-3.5 h-3.5" /> Lampirkan Berkas
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateTicketStatus('Resolved')}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer ${GRAD.success}`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Tandai Selesai
                </button>
                <button
                  type="submit"
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold shadow-xs cursor-pointer ${GRAD.primary}`}
                >
                  <Send className="w-3.5 h-3.5" /> Kirim Balasan
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
