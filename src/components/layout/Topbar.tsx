import React, { useState } from 'react';
import {
  Menu,
  Search,
  Mail,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
} from 'lucide-react';
import { confirmDialog, showToast } from '../../lib/swal';

interface TopbarProps {
  onToggleMobile: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  onToggleMobile,
  onToggleCollapse,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    const confirmed = await confirmDialog({
      title: 'Konfirmasi Keluar',
      text: 'Apakah Anda yakin ingin mengakhiri sesi?',
      confirmButtonText: 'Ya, Keluar',
      cancelButtonText: 'Batal',
      isDangerous: true,
      icon: 'warning',
    });

    if (confirmed) {
      showToast('Anda telah berhasil keluar dari sistem.', 'info');
    }
  };

  const handleNotifications = () => {
    showToast('2 notifikasi ujian baru tersedia.', 'info');
  };

  const handleMessages = () => {
    showToast('Tidak ada pesan baru.', 'info');
  };

  return (
    <header className="relative h-[72px] px-6 sm:px-8 flex items-center justify-between gap-4 transition-all bg-[#1351b8] text-white shadow-xs">
      {/* Left: Hamburger & Search Bar */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-xl">
        {/* Toggle Button */}
        <button
          onClick={() => {
            if (window.innerWidth < 1024) {
              onToggleMobile();
            } else {
              onToggleCollapse();
            }
          }}
          className="p-2 text-white/90 hover:text-white hover:bg-white/10 rounded-xl transition-colors focus:outline-none"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" strokeWidth={2.5} />
        </button>

        {/* Search Input Bar (Matching Stisla style) */}
        <div className="relative w-full max-w-xs sm:max-w-sm">
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-white text-slate-800 placeholder-slate-400 text-xs sm:text-sm pl-4 pr-10 py-2 rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-white/40 border-none transition-all"
          />
          <button
            type="button"
            className="absolute right-0 top-0 bottom-0 px-3 text-slate-500 hover:text-slate-800 flex items-center justify-center"
            title="Cari"
          >
            <Search className="w-4 h-4" strokeWidth={2.2} />
          </button>
        </div>
      </div>

      {/* Right: Mail, Bell, & User Profile Dropdown */}
      <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
        {/* Mail Icon */}
        <button
          onClick={handleMessages}
          className="relative p-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          title="Pesan Masuk"
        >
          <Mail className="w-5 h-5" strokeWidth={2} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full ring-2 ring-[#1351b8]" />
        </button>

        {/* Bell Icon */}
        <button
          onClick={handleNotifications}
          className="relative p-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          title="Notifikasi"
        >
          <Bell className="w-5 h-5" strokeWidth={2} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full ring-2 ring-[#1351b8]" />
        </button>

        {/* User Profile Pill Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 hover:bg-white/10 rounded-lg transition-all focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white font-semibold text-xs overflow-hidden shadow-xs">
              <User className="w-4 h-4" />
            </div>

            <span className="hidden sm:inline text-xs sm:text-sm font-semibold text-white tracking-tight">
              Hi, Fahmi Ibrahim
            </span>

            <ChevronDown className="w-3.5 h-3.5 text-white/80" strokeWidth={2.5} />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-1.5 z-50 border border-slate-100 text-xs text-slate-700 animate-in fade-in duration-150">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="font-semibold text-slate-800">Fahmi Ibrahim</p>
                  <p className="text-[11px] text-slate-500">Administrator</p>
                </div>

                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    showToast('Buka profil pengguna', 'info');
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  Profil Akun
                </button>

                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    showToast('Buka pengaturan', 'info');
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  Pengaturan
                </button>

                <div className="border-t border-slate-100 my-1" />

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-rose-50 flex items-center gap-2 text-rose-600 font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  Keluar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
