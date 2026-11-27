import React, { useState } from 'react';
import {
  Bell,
  ChevronDown,
  ChevronRight,
  Columns3,
  Copy,
  Flame,
  Heart,
  LogOut,
  Mail,
  Menu,
  Search,
  Server,
  Settings,
  Shapes,
  User,
} from 'lucide-react';
import { confirmDialog, showToast } from '../../lib/swal';
import { Sidebar } from './Sidebar';

interface TopNavLayoutProps {
  children: React.ReactNode;
  activeMenu: string;
  onSelectMenu: (id: string) => void;
  pageTitle: string;
  breadcrumbs?: string[];
}

export const TopNavLayout: React.FC<TopNavLayoutProps> = ({
  children,
  activeMenu,
  onSelectMenu,
  pageTitle,
  breadcrumbs = ['Dashboard', 'Layout', 'Top Navigation'],
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [appMenuOpen, setAppMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openNavMenu, setOpenNavMenu] = useState<string | null>(null);
  const [hoverLevel2Open, setHoverLevel2Open] = useState(false);
  const [hoverLevel3Open, setHoverLevel3Open] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    setUserDropdownOpen(false);
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

  const navigateAndClose = (id: string) => {
    onSelectMenu(id);
    setOpenNavMenu(null);
    setHoverLevel2Open(false);
    setHoverLevel3Open(false);
    setMobileMenuOpen(false);
    setAppMenuOpen(false);
  };

  const isDashboardActive =
    activeMenu === 'general-dashboard' ||
    activeMenu === 'ecommerce-dashboard' ||
    activeMenu === 'dashboard';
  const isLayoutActive = activeMenu === 'layout-top-navigation' || activeMenu === 'layout-default';

  const containerCls = 'w-full max-w-[1520px] mx-auto px-4 sm:px-8 lg:px-10';

  return (
    <div className="min-h-screen bg-[#f4f6f9] text-slate-800 flex flex-col font-sans">
      {/* ======================================================== */}
      {/* BAR 1: PRIMARY ROYAL BLUE TOPBAR (FULL-WIDTH SPACE-BETWEEN) */}
      {/* ======================================================== */}
      <header className="bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white shadow-xs sticky top-0 z-40">
        <div className="w-full px-6 sm:px-8 h-[72px] flex items-center justify-between gap-4">
          {/* Left: Mobile Sidebar Toggle, Brand & Top Utility Links */}
          <div className="flex items-center gap-3 sm:gap-6">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-xl text-white/90 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Buka Sidebar Menu"
            >
              <Menu className="w-5 h-5" strokeWidth={2.5} />
            </button>

            <button
              type="button"
              onClick={() => navigateAndClose('general-dashboard')}
              className="text-base sm:text-lg font-extrabold tracking-[0.14em] uppercase text-white cursor-pointer shrink-0"
            >
              VELORA UI
            </button>

            <nav className="hidden lg:flex items-center gap-5 text-xs font-medium text-white/90">
              {/* Application Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setAppMenuOpen((prev) => !prev)}
                  className="font-semibold text-white hover:text-white/90 inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Application</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-80" />
                </button>
                {appMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setAppMenuOpen(false)} />
                    <div className="absolute left-0 mt-3 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 text-xs text-slate-700 animate-in fade-in duration-150">
                      <button
                        type="button"
                        onClick={() => navigateAndClose('general-dashboard')}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 font-medium cursor-pointer"
                      >
                        General Dashboard
                      </button>
                      <button
                        type="button"
                        onClick={() => navigateAndClose('kanban')}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 font-medium cursor-pointer"
                      >
                        Kanban Board
                      </button>
                      <button
                        type="button"
                        onClick={() => navigateAndClose('modal')}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 font-medium cursor-pointer"
                      >
                        Modal Showcase (36+)
                      </button>
                      <div className="border-t border-slate-100 my-1" />
                      <button
                        type="button"
                        onClick={() => navigateAndClose('layout-default')}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 font-semibold text-[#175cd3] flex items-center gap-2 cursor-pointer"
                      >
                        <Columns3 className="w-3.5 h-3.5" />
                        Kembali ke Default Sidebar
                      </button>
                    </div>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={() => navigateAndClose('tickets')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Report Something
              </button>

              <button
                type="button"
                onClick={() =>
                  showToast('Semua service berjalan normal • Uptime 99.98%', 'success')
                }
                className="hover:text-white transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Server className="w-3.5 h-3.5 text-emerald-300" />
                <span>Server Status</span>
              </button>
            </nav>
          </div>

          {/* Right: Search Input, Mail, Bell, Profile */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  showToast(`Mencari "${searchQuery}"...`, 'info');
                }
              }}
              className="hidden md:block relative w-56 xl:w-72"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="w-full bg-white text-slate-800 placeholder-slate-400 text-xs sm:text-sm pl-4 pr-10 py-2 rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-white/40"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 bottom-0 px-3 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer"
                title="Cari"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            <button
              type="button"
              onClick={() => navigateAndClose('chat-inbox')}
              className="relative p-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              title="Pesan Masuk"
            >
              <Mail className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full ring-2 ring-[#1351b8]" />
            </button>

            <button
              type="button"
              onClick={() => navigateAndClose('notifications')}
              className="relative p-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              title="Notifikasi"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full ring-2 ring-[#1351b8]" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 hover:bg-white/10 rounded-lg transition-all cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white">
                  <User className="w-4 h-4" />
                </div>
                <span className="hidden sm:inline text-xs sm:text-sm font-semibold text-white">
                  Hi, Fahmi Ibrahim
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-white/80" />
              </button>

              {userDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl py-1.5 z-50 border border-slate-100 text-xs text-slate-700 animate-in fade-in duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="font-semibold text-slate-900">Fahmi Ibrahim</p>
                      <p className="text-[11px] text-slate-500">Administrator</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        navigateAndClose('profile');
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 font-medium cursor-pointer"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      Profil Akun
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        navigateAndClose('settings');
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 font-medium cursor-pointer"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      Pengaturan
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        navigateAndClose('layout-default');
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 font-semibold text-[#175cd3] cursor-pointer"
                    >
                      <Columns3 className="w-4 h-4" />
                      Switch ke Default Layout
                    </button>
                    <div className="border-t border-slate-100 my-1" />
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2 font-semibold cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Keluar
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Slide-Out Drawer (uses standard Velora Sidebar on < lg) */}
      <Sidebar
        activeId={activeMenu}
        onSelect={navigateAndClose}
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        isCollapsed={false}
        mobileOnly
      />

      {/* ======================================================== */}
      {/* BAR 2: SECONDARY WHITE HORIZONTAL NAVIGATION (MATCHES PRIMARY HEIGHT) */}
      {/* ======================================================== */}
      <div className="bg-white border-b border-slate-200/80 shadow-2xs relative z-30">
        <div className={`${containerCls} hidden lg:flex items-center justify-between gap-6 h-[72px]`}>
          <nav className="flex items-center gap-7 h-full">
            {/* 1. Dashboard Dropdown */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => setOpenNavMenu('dashboard')}
              onMouseLeave={() => setOpenNavMenu(null)}
            >
              <button
                type="button"
                onClick={() =>
                  setOpenNavMenu((prev) => (prev === 'dashboard' ? null : 'dashboard'))
                }
                className={`h-full text-xs font-semibold inline-flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
                  isDashboardActive
                    ? 'border-[#175cd3] text-[#175cd3]'
                    : 'border-transparent text-slate-600 hover:text-[#175cd3]'
                }`}
              >
                <Flame className="w-4 h-4" />
                <span>Dashboard</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>

              {openNavMenu === 'dashboard' && (
                <div className="absolute left-0 top-full w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 text-xs animate-in fade-in duration-100">
                  <button
                    type="button"
                    onClick={() => navigateAndClose('general-dashboard')}
                    className="w-full text-left px-4 py-2.5 text-slate-700 hover:bg-slate-50 hover:text-[#175cd3] font-medium cursor-pointer"
                  >
                    General Dashboard
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateAndClose('ecommerce-dashboard')}
                    className="w-full text-left px-4 py-2.5 text-slate-700 hover:bg-slate-50 hover:text-[#175cd3] font-medium cursor-pointer"
                  >
                    Ecommerce Dashboard
                  </button>
                </div>
              )}
            </div>

            {/* 2. Top Navigation / Layout Switcher */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => setOpenNavMenu('layout')}
              onMouseLeave={() => setOpenNavMenu(null)}
            >
              <button
                type="button"
                onClick={() => navigateAndClose('layout-top-navigation')}
                className={`h-full text-xs font-semibold inline-flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
                  isLayoutActive
                    ? 'border-[#175cd3] text-[#175cd3]'
                    : 'border-transparent text-slate-600 hover:text-[#175cd3]'
                }`}
              >
                <Heart className="w-4 h-4" />
                <span>Top Navigation</span>
              </button>

              {openNavMenu === 'layout' && (
                <div className="absolute left-0 top-full w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 text-xs animate-in fade-in duration-100">
                  <button
                    type="button"
                    onClick={() => navigateAndClose('layout-top-navigation')}
                    className="w-full text-left px-4 py-2.5 text-[#175cd3] bg-blue-50/40 font-semibold cursor-pointer"
                  >
                    Top Navigation (Aktif)
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateAndClose('layout-default')}
                    className="w-full text-left px-4 py-2.5 text-slate-700 hover:bg-slate-50 hover:text-[#175cd3] font-medium cursor-pointer"
                  >
                    Default Layout (Sidebar)
                  </button>
                </div>
              )}
            </div>

            {/* 3. Multiple Dropdown (3-level nested hover menu matching reference!) */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => setOpenNavMenu('multiple')}
              onMouseLeave={() => {
                setOpenNavMenu(null);
                setHoverLevel2Open(false);
                setHoverLevel3Open(false);
              }}
            >
              <button
                type="button"
                onClick={() =>
                  setOpenNavMenu((prev) => (prev === 'multiple' ? null : 'multiple'))
                }
                className="h-full text-xs font-semibold inline-flex items-center gap-2 border-b-2 border-transparent text-slate-600 hover:text-[#175cd3] transition-colors cursor-pointer"
              >
                <Copy className="w-4 h-4" />
                <span>Multiple Dropdown</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>

              {openNavMenu === 'multiple' && (
                <div className="absolute left-0 top-full w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 text-xs animate-in fade-in duration-100">
                  <button
                    type="button"
                    onClick={() => {
                      showToast('Not Dropdown Link diklik!', 'info');
                      setOpenNavMenu(null);
                    }}
                    className="w-full text-left px-4 py-2.5 text-slate-700 hover:bg-slate-50 hover:text-[#175cd3] font-medium cursor-pointer"
                  >
                    Not Dropdown Link
                  </button>

                  {/* Hover Me -> Level 2 Flyout */}
                  <div
                    className="relative"
                    onMouseEnter={() => setHoverLevel2Open(true)}
                    onMouseLeave={() => {
                      setHoverLevel2Open(false);
                      setHoverLevel3Open(false);
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setHoverLevel2Open((prev) => !prev)}
                      className="w-full text-left px-4 py-2.5 text-slate-800 hover:bg-slate-50 hover:text-[#175cd3] font-semibold flex items-center justify-between cursor-pointer"
                    >
                      <span>Hover Me</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    </button>

                    {hoverLevel2Open && (
                      <div className="absolute left-full top-0 ml-0.5 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50">
                        <button
                          type="button"
                          onClick={() => {
                            showToast('Submenu Level 2 - Link diklik!', 'info');
                            setOpenNavMenu(null);
                          }}
                          className="w-full text-left px-4 py-2.5 text-slate-700 hover:bg-slate-50 hover:text-[#175cd3] font-medium cursor-pointer"
                        >
                          Link
                        </button>

                        {/* Level 2 -> Level 3 Flyout */}
                        <div
                          className="relative"
                          onMouseEnter={() => setHoverLevel3Open(true)}
                          onMouseLeave={() => setHoverLevel3Open(false)}
                        >
                          <button
                            type="button"
                            onClick={() => setHoverLevel3Open((prev) => !prev)}
                            className="w-full text-left px-4 py-2.5 text-slate-800 hover:bg-slate-50 hover:text-[#175cd3] font-semibold flex items-center justify-between cursor-pointer"
                          >
                            <span>Link</span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                          </button>

                          {hoverLevel3Open && (
                            <div className="absolute left-full top-0 ml-0.5 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50">
                              {['Link', 'Link 2', 'Link 3'].map((lbl) => (
                                <button
                                  key={lbl}
                                  type="button"
                                  onClick={() => {
                                    showToast(`Nested Level 3 (${lbl}) dipilih!`, 'success');
                                    setOpenNavMenu(null);
                                  }}
                                  className="w-full text-left px-4 py-2.5 text-slate-700 hover:bg-slate-50 hover:text-[#175cd3] font-medium cursor-pointer"
                                >
                                  {lbl}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            showToast('Submenu Level 2 - Link 3 diklik!', 'info');
                            setOpenNavMenu(null);
                          }}
                          className="w-full text-left px-4 py-2.5 text-slate-700 hover:bg-slate-50 hover:text-[#175cd3] font-medium cursor-pointer"
                        >
                          Link 3
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 4. Quick Components & Pages */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => setOpenNavMenu('components')}
              onMouseLeave={() => setOpenNavMenu(null)}
            >
              <button
                type="button"
                onClick={() =>
                  setOpenNavMenu((prev) => (prev === 'components' ? null : 'components'))
                }
                className={`h-full text-xs font-semibold inline-flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
                  ['modal', 'empty-states', 'kanban', 'file-manager', 'chat-inbox'].includes(
                    activeMenu,
                  )
                    ? 'border-[#175cd3] text-[#175cd3]'
                    : 'border-transparent text-slate-600 hover:text-[#175cd3]'
                }`}
              >
                <Shapes className="w-4 h-4" />
                <span>Explore UI Pages</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>

              {openNavMenu === 'components' && (
                <div className="absolute left-0 top-full w-60 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 text-xs animate-in fade-in duration-100">
                  {[
                    { id: 'modal', label: 'Modal Showcase (36+)' },
                    { id: 'empty-states', label: 'Empty & Skeleton Loaders' },
                    { id: 'kanban', label: 'Kanban Board' },
                    { id: 'file-manager', label: 'File Manager' },
                    { id: 'chat-inbox', label: 'Chat Inbox' },
                    { id: 'notifications', label: 'Notification Center' },
                    { id: 'activities', label: 'Activities Timeline' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => navigateAndClose(item.id)}
                      className={`w-full text-left px-4 py-2.5 font-medium cursor-pointer ${
                        activeMenu === item.id
                          ? 'text-[#175cd3] bg-blue-50/40 font-semibold'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-[#175cd3]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Quick switch right button */}
          <button
            type="button"
            onClick={() => navigateAndClose('layout-default')}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-[#f8fafc] to-[#e2e8f0] hover:from-[#e2e8f0] hover:to-[#cbd5e1] text-slate-800 border border-slate-200/80 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Columns3 className="w-3.5 h-3.5 text-[#175cd3]" />
            <span>Default Sidebar</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* WIDE CONTENT CONTAINER (SPACIOUS WIDTH) */}
      {/* ======================================================== */}
      <div className={`${containerCls} flex-1 flex flex-col py-6 space-y-6`}>
        {/* Sub-Header White Card Bar matching Top Navigation layout */}
        <div className="bg-white rounded-xl border border-slate-200/80 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
          <h1 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight">
            {pageTitle}
          </h1>

          <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <React.Fragment key={idx}>
                  {idx > 0 && <span className="text-slate-400">/</span>}
                  {isLast ? (
                    <span className="text-slate-600 font-semibold">{crumb}</span>
                  ) : (
                    <span className="text-[#1351b8] hover:underline cursor-pointer">
                      {crumb}
                    </span>
                  )}
                </React.Fragment>
              );
            })}
          </nav>
        </div>

        {/* Main Page Body */}
        <main className="flex-1 w-full space-y-6">{children}</main>
      </div>

      {/* ======================================================== */}
      {/* CLEAN FOOTER ALIGNED WITH WIDE CONTAINER */}
      {/* ======================================================== */}
      <footer className="border-t border-slate-200/80 bg-[#f4f6f9]">
        <div
          className={`${containerCls} py-4 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2`}
        >
          <p>
            Copyright &copy; 2026 &bull; Crafted by{' '}
            <a
              href="https://github.com/fahmiibrahimdevs"
              target="_blank"
              rel="noreferrer"
              className="text-[#1351b8] font-semibold hover:underline"
            >
              Fahmi Ibrahim
            </a>{' '}
            &bull; Velora UI Admin Template
          </p>
          <p className="font-mono text-slate-400">v1.0.0</p>
        </div>
      </footer>
    </div>
  );
};
