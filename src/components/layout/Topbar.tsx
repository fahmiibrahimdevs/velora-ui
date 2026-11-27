import React, { useState } from 'react';
import {
  Menu,
  ChevronDown,
  User,
  Settings,
  LogOut,
} from 'lucide-react';
import { confirmDialog, showToast } from '../../lib/swal';
import { TopbarPopovers } from './TopbarPopovers';
import { GlobalSearchBar } from './GlobalSearchBar';

interface TopbarProps {
  onToggleMobile: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onNavigate?: (id: string) => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  onToggleMobile,
  onToggleCollapse,
  onNavigate,
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

        {/* Live Global Search + Ctrl+K Command Palette */}
        <GlobalSearchBar onNavigate={onNavigate} />
      </div>

      {/* Right: Mail, Bell, & User Profile Dropdown */}
      <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
        <TopbarPopovers
          onNavigate={onNavigate}
          onBeforeOpen={() => setIsDropdownOpen(false)}
        />

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
                    if (onNavigate) onNavigate('profile');
                    else showToast('Buka profil pengguna', 'info');
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium cursor-pointer"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  Profil Akun
                </button>

                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    if (onNavigate) onNavigate('settings');
                    else showToast('Buka pengaturan', 'info');
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium cursor-pointer"
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
