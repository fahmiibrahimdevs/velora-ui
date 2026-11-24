import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeMenu: string;
  onSelectMenu: (id: string) => void;
  pageTitle: string;
  breadcrumbs?: string[];
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  activeMenu,
  onSelectMenu,
  pageTitle,
  breadcrumbs = ['Dashboard', 'CBT Components', 'Card'],
}) => {
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#f4f6f9] text-slate-800 flex font-sans">
      {/* Sidebar */}
      <Sidebar
        activeId={activeMenu}
        onSelect={onSelectMenu}
        isOpenMobile={isOpenMobile}
        onCloseMobile={() => setIsOpenMobile(false)}
        isCollapsed={isCollapsed}
      />

      {/* Main Content Area - Full Width */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Sticky Header: Menggabungkan Navbar Biru & Sub-Header Putih agar ikut saat di-scroll */}
        <div className="sticky top-0 z-20 flex flex-col">
          {/* Topbar */}
          <Topbar
            onToggleMobile={() => setIsOpenMobile(true)}
            isCollapsed={isCollapsed}
            onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          />

          {/* Sub-Header Bar: Putih menyatu langsung di bawah Navbar Biru */}
          <div className="bg-white border-b border-slate-200/80 px-6 sm:px-8 py-3.5 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
              {pageTitle}
            </h1>

            {/* Breadcrumb Links (Right-aligned) */}
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
        </div>

        {/* Page Content Body (Abu-abu terang di bawah bar putih) */}
        <main className="flex-1 w-full px-6 sm:px-8 py-7 space-y-6">
          {children}
        </main>

        {/* Full-width Clean Footer */}
        <footer className="py-4 px-6 sm:px-8 border-t border-slate-200/80 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 bg-[#f4f6f9]">
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
        </footer>
      </div>
    </div>
  );
};
