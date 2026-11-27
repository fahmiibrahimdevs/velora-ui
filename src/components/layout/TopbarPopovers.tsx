import React, { useState } from 'react';
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  ChevronRight,
  Code2,
  Mail,
  UserPlus,
} from 'lucide-react';
import { showToast } from '../../lib/swal';

const GRAD = {
  primaryStatic: 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white',
  info: 'bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] text-white',
  success: 'bg-gradient-to-r from-[#22c55e] to-[#15803d] text-white',
  danger: 'bg-gradient-to-r from-[#ef4444] to-[#b91c1c] text-white',
  warning: 'bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white',
} as const;

interface TopbarPopoversProps {
  onNavigate?: (id: string) => void;
  onBeforeOpen?: () => void;
}

interface MessagePreview {
  id: string;
  sender: string;
  initials: string;
  avatarGrad: string;
  online: boolean;
  preview: string;
  time: string;
  unread: boolean;
}

interface NotifPreview {
  id: string;
  icon: 'code' | 'user' | 'done' | 'alert';
  iconGrad: string;
  text: React.ReactNode;
  time: string;
  unread: boolean;
}

const INITIAL_MESSAGES: MessagePreview[] = [
  {
    id: 'msg-1',
    sender: 'Raka Pratama',
    initials: 'RP',
    avatarGrad: GRAD.primaryStatic,
    online: true,
    preview: 'Halo tim, bukti transfer pelunasan #INV-2026-0842 sudah saya unggah ya.',
    time: '10 MENIT LALU',
    unread: true,
  },
  {
    id: 'msg-2',
    sender: 'Nadia Kusuma',
    initials: 'NK',
    avatarGrad: GRAD.success,
    online: true,
    preview: 'Desain modal showcase & top navigation sudah siap dicek di staging.',
    time: '2 JAM LALU',
    unread: true,
  },
  {
    id: 'msg-3',
    sender: 'Bima Pratama',
    initials: 'BP',
    avatarGrad: GRAD.info,
    online: false,
    preview: 'Endpoint webhook staging sudah berhasil membalas 200 OK tanpa kendala.',
    time: '5 JAM LALU',
    unread: false,
  },
  {
    id: 'msg-4',
    sender: 'Sinta Wijaya',
    initials: 'SW',
    avatarGrad: GRAD.warning,
    online: true,
    preview: 'Mohon bantuannya untuk verifikasi faktur pajak Q4 periode November.',
    time: '12 JAM LALU',
    unread: false,
  },
];

const INITIAL_NOTIFS: NotifPreview[] = [
  {
    id: 'nt-1',
    icon: 'code',
    iconGrad: GRAD.primaryStatic,
    text: (
      <>
        Pembaruan template <span className="font-semibold text-slate-900">Velora UI v2.5</span> tersedia!
      </>
    ),
    time: '2 MENIT LALU',
    unread: true,
  },
  {
    id: 'nt-2',
    icon: 'user',
    iconGrad: GRAD.info,
    text: (
      <>
        <span className="font-semibold text-slate-900">Raka Pratama</span> bergabung ke workspace Engineering
      </>
    ),
    time: '1 JAM LALU',
    unread: true,
  },
  {
    id: 'nt-3',
    icon: 'done',
    iconGrad: GRAD.success,
    text: (
      <>
        <span className="font-semibold text-slate-900">Nadia Kusuma</span> memindahkan task{' '}
        <span className="font-semibold text-slate-900">Fix bug header</span> ke{' '}
        <span className="font-semibold text-slate-900">Done</span>
      </>
    ),
    time: '4 JAM LALU',
    unread: false,
  },
  {
    id: 'nt-4',
    icon: 'alert',
    iconGrad: GRAD.danger,
    text: <>Kapasitas storage dokumen tersisa 15%. Periksa arsip backup.</>,
    time: '12 JAM LALU',
    unread: false,
  },
];

export const TopbarPopovers: React.FC<TopbarPopoversProps> = ({ onNavigate, onBeforeOpen }) => {
  const [openPanel, setOpenPanel] = useState<'messages' | 'notifications' | null>(null);
  const [messages, setMessages] = useState<MessagePreview[]>(INITIAL_MESSAGES);
  const [notifs, setNotifs] = useState<NotifPreview[]>(INITIAL_NOTIFS);

  const unreadMsgCount = messages.filter((m) => m.unread).length;
  const unreadNotifCount = notifs.filter((n) => n.unread).length;

  const togglePanel = (target: 'messages' | 'notifications') => {
    onBeforeOpen?.();
    setOpenPanel((prev) => (prev === target ? null : target));
  };

  const renderNotifIcon = (kind: NotifPreview['icon']) => {
    if (kind === 'code') return <Code2 className="w-4 h-4" />;
    if (kind === 'user') return <UserPlus className="w-4 h-4" />;
    if (kind === 'done') return <CheckCircle2 className="w-4 h-4" />;
    return <AlertTriangle className="w-4 h-4" />;
  };

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 relative">
      {openPanel && (
        <div className="fixed inset-0 z-40" onClick={() => setOpenPanel(null)} />
      )}

      {/* ======================================================== */}
      {/* MESSAGES ICON & POPOVER */}
      {/* ======================================================== */}
      <div className="relative">
        <button
          type="button"
          onClick={() => togglePanel('messages')}
          className={`relative p-2 rounded-lg transition-colors cursor-pointer ${
            openPanel === 'messages'
              ? 'bg-white/15 text-white'
              : 'text-white/90 hover:text-white hover:bg-white/10'
          }`}
          title="Pesan Masuk"
          aria-label="Messages"
        >
          <Mail className="w-5 h-5" strokeWidth={2} />
          {unreadMsgCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full ring-2 ring-[#1351b8]" />
          )}
        </button>

        {openPanel === 'messages' && (
          <div className="fixed left-4 right-4 top-[76px] sm:left-auto sm:right-0 sm:top-auto sm:absolute sm:mt-3 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden text-slate-800 animate-in fade-in duration-150">
            {/* Popover Header */}
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-slate-900">Messages</span>
                {unreadMsgCount > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${GRAD.primaryStatic}`}>
                    {unreadMsgCount} Baru
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setMessages((prev) => prev.map((m) => ({ ...m, unread: false })));
                  showToast('Semua pesan ditandai sudah dibaca!', 'info');
                }}
                className="text-xs font-semibold text-[#175cd3] hover:text-[#0f3ba0] hover:underline cursor-pointer"
              >
                Mark All As Read
              </button>
            </div>

            {/* Popover Body */}
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
              {messages.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setMessages((prev) =>
                      prev.map((item) => (item.id === m.id ? { ...item, unread: false } : item)),
                    );
                    setOpenPanel(null);
                    if (onNavigate) {
                      onNavigate('chat-inbox');
                    } else {
                      showToast(`Membuka percakapan dengan ${m.sender}`, 'info');
                    }
                  }}
                  className={`w-full text-left px-5 py-3.5 flex items-start gap-3.5 hover:bg-slate-50/80 transition-colors cursor-pointer ${
                    m.unread ? 'bg-blue-50/30' : 'bg-white'
                  }`}
                >
                  <div className="relative shrink-0 mt-0.5">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shadow-xs ${m.avatarGrad}`}
                    >
                      {m.initials}
                    </div>
                    <span
                      className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
                        m.online ? 'bg-emerald-500' : 'bg-slate-300'
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-slate-900 truncate">{m.sender}</p>
                      {m.unread && (
                        <span className="w-2 h-2 rounded-full bg-[#175cd3] shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-snug line-clamp-2 mt-0.5">
                      {m.preview}
                    </p>
                    <p className="text-[10px] font-semibold tracking-wide text-slate-500 uppercase mt-1.5">
                      {m.time}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Popover Footer */}
            <div className="px-5 py-3 border-t border-slate-100 bg-white text-center">
              <button
                type="button"
                onClick={() => {
                  setOpenPanel(null);
                  if (onNavigate) {
                    onNavigate('chat-inbox');
                  } else {
                    showToast('Membuka seluruh pesan...', 'info');
                  }
                }}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#175cd3] hover:text-[#0f3ba0] cursor-pointer"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* NOTIFICATIONS ICON & POPOVER */}
      {/* ======================================================== */}
      <div className="relative">
        <button
          type="button"
          onClick={() => togglePanel('notifications')}
          className={`relative p-2 rounded-lg transition-colors cursor-pointer ${
            openPanel === 'notifications'
              ? 'bg-white/15 text-white'
              : 'text-white/90 hover:text-white hover:bg-white/10'
          }`}
          title="Notifikasi"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" strokeWidth={2} />
          {unreadNotifCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full ring-2 ring-[#1351b8]" />
          )}
        </button>

        {openPanel === 'notifications' && (
          <div className="fixed left-4 right-4 top-[76px] sm:left-auto sm:right-0 sm:top-auto sm:absolute sm:mt-3 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden text-slate-800 animate-in fade-in duration-150">
            {/* Popover Header */}
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-slate-900">Notifications</span>
                {unreadNotifCount > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${GRAD.warning}`}>
                    {unreadNotifCount} Baru
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setNotifs((prev) => prev.map((n) => ({ ...n, unread: false })));
                  showToast('Semua notifikasi ditandai sudah dibaca!', 'info');
                }}
                className="text-xs font-semibold text-[#175cd3] hover:text-[#0f3ba0] hover:underline cursor-pointer"
              >
                Mark All As Read
              </button>
            </div>

            {/* Popover Body */}
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
              {notifs.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => {
                    setNotifs((prev) =>
                      prev.map((item) => (item.id === n.id ? { ...item, unread: false } : item)),
                    );
                    setOpenPanel(null);
                    if (onNavigate) {
                      onNavigate('notifications');
                    } else {
                      showToast('Membuka detail notifikasi...', 'info');
                    }
                  }}
                  className={`w-full text-left px-5 py-3.5 flex items-start gap-3.5 hover:bg-slate-50/80 transition-colors cursor-pointer ${
                    n.unread ? 'bg-blue-50/30' : 'bg-white'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-xs mt-0.5 ${n.iconGrad}`}
                  >
                    {renderNotifIcon(n.icon)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs text-slate-700 leading-snug">{n.text}</p>
                      {n.unread && (
                        <span className="w-2 h-2 rounded-full bg-[#175cd3] shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-[10px] font-semibold tracking-wide text-slate-500 uppercase mt-1.5">
                      {n.time}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Popover Footer */}
            <div className="px-5 py-3 border-t border-slate-100 bg-white text-center">
              <button
                type="button"
                onClick={() => {
                  setOpenPanel(null);
                  if (onNavigate) {
                    onNavigate('notifications');
                  } else {
                    showToast('Membuka Notification Center...', 'info');
                  }
                }}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#175cd3] hover:text-[#0f3ba0] cursor-pointer"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
