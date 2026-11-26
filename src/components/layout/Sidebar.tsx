import React, { useState, useEffect } from 'react';
import {
  Flame,
  Columns3,
  Square,
  Boxes,
  Shapes,
  FileText,
  Plug,
  User,
  AlertCircle,
  Bike,
  MoreHorizontal,
  PenTool,
  ChevronRight,
  ChevronDown,
  X,
  LogOut,
} from 'lucide-react';
import type { NavSection } from '../../types';
import { confirmDialog, showToast } from '../../lib/swal';

interface SidebarProps {
  activeId: string;
  onSelect: (id: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  isCollapsed: boolean;
}

const navSections: NavSection[] = [
  {
    title: 'DASHBOARD',
    items: [
      {
        id: 'dashboard-group',
        label: 'Dashboard',
        icon: Flame,
        children: [
          { id: 'general-dashboard', label: 'General Dashboard' },
          { id: 'ecommerce-dashboard', label: 'Ecommerce Dashboard' },
        ],
      },
    ],
  },
  {
    title: 'STARTER',
    items: [
      {
        id: 'layout-group',
        label: 'Layout',
        icon: Columns3,
        children: [
          { id: 'layout-default', label: 'Default Layout' },
          { id: 'layout-transparent', label: 'Transparent Sidebar' },
          { id: 'layout-top-navigation', label: 'Top Navigation' },
        ],
      },
      {
        id: 'blank-page',
        label: 'Blank Page',
        icon: Square,
      },
      {
        id: 'bootstrap-group',
        label: 'Bootstrap',
        icon: Boxes,
        children: [
          { id: 'alert', label: 'Alert' },
          { id: 'badge', label: 'Badge' },
          { id: 'breadcrumb', label: 'Breadcrumb' },
          { id: 'buttons', label: 'Buttons' },
          { id: 'card', label: 'Card' },
          { id: 'carousel', label: 'Carousel' },
          { id: 'collapse', label: 'Collapse' },
          { id: 'dropdown', label: 'Dropdown' },
          { id: 'form', label: 'Form' },
          { id: 'list-group', label: 'List Group' },
          { id: 'media-object', label: 'Media Object' },
          { id: 'modal', label: 'Modal' },
          { id: 'nav', label: 'Nav' },
          { id: 'navbar', label: 'Navbar' },
          { id: 'pagination', label: 'Pagination' },
          { id: 'popover', label: 'Popover' },
          { id: 'progress', label: 'Progress' },
          { id: 'table', label: 'Table' },
          { id: 'tooltip', label: 'Tooltip' },
          { id: 'typography', label: 'Typography' },
        ],
      },
    ],
  },
  {
    title: 'VELORA UI',
    items: [
      {
        id: 'components-group',
        label: 'Components',
        icon: Shapes,
        children: [
          { id: 'article', label: 'Article' },
          { id: 'avatar', label: 'Avatar' },
          { id: 'chat-box', label: 'Chat Box' },
          { id: 'gallery', label: 'Gallery' },
          { id: 'multiple-upload', label: 'Multiple Upload' },
          { id: 'statistic', label: 'Statistic' },
          { id: 'tab', label: 'Tab' },
          { id: 'components-table', label: 'Table' },
          { id: 'user', label: 'User' },
        ],
      },
      {
        id: 'forms-group',
        label: 'Forms',
        icon: FileText,
        children: [
          { id: 'advanced-form', label: 'Advanced Form' },
          { id: 'editor', label: 'Editor' },
          { id: 'validation', label: 'Validation' },
          { id: 'upload-files', label: 'Upload Files' },
        ],
      },
      {
        id: 'modules-group',
        label: 'Modules',
        icon: Plug,
        children: [
          { id: 'calendar', label: 'Calendar' },
          { id: 'chartjs', label: 'ChartJS' },
          { id: 'datatables', label: 'DataTables' },
          { id: 'flag', label: 'Flag' },
          { id: 'font-awesome', label: 'Font Awesome' },
          { id: 'ion-icons', label: 'Ion Icons' },
          { id: 'owl-carousel', label: 'Owl Carousel' },
          { id: 'sparkline', label: 'Sparkline' },
          { id: 'sweet-alert', label: 'Sweet Alert' },
          { id: 'toastr', label: 'Toastr' },
          { id: 'vector-map', label: 'Vector Map' },
          { id: 'weather-icon', label: 'Weather Icon' },
        ],
      },
    ],
  },
  {
    title: 'PAGES',
    items: [
      {
        id: 'auth-group',
        label: 'Auth',
        icon: User,
        children: [
          { id: 'forgot-password', label: 'Forgot Password' },
          { id: 'login', label: 'Login' },
          { id: 'login-2', label: 'Login 2' },
          { id: 'register', label: 'Register' },
          { id: 'reset-password', label: 'Reset Password' },
        ],
      },
      {
        id: 'errors-group',
        label: 'Errors',
        icon: AlertCircle,
        children: [
          { id: 'error-503', label: '503' },
          { id: 'error-403', label: '403' },
          { id: 'error-404', label: '404' },
          { id: 'error-500', label: '500' },
        ],
      },
      {
        id: 'features-group',
        label: 'Features',
        icon: Bike,
        children: [
          { id: 'activities', label: 'Activities' },
          { id: 'post-create', label: 'Post Create' },
          { id: 'posts', label: 'Posts' },
          { id: 'profile', label: 'Profile' },
          { id: 'settings', label: 'Settings' },
          { id: 'setting-detail', label: 'Setting Detail' },
          { id: 'tickets', label: 'Tickets' },
        ],
      },
      {
        id: 'utilities-group',
        label: 'Utilities',
        icon: MoreHorizontal,
        children: [
          { id: 'contact', label: 'Contact' },
          { id: 'invoice', label: 'Invoice' },
          { id: 'subscribe', label: 'Subscribe' },
        ],
      },
      {
        id: 'credits',
        label: 'Credits',
        icon: PenTool,
      },
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeId,
  onSelect,
  isOpenMobile,
  onCloseMobile,
  isCollapsed,
}) => {
  // Hanya 1 dropdown yang bisa terbuka pada saat bersamaan (Accordion mode)
  const [openDropdownId, setOpenDropdownId] = useState<string | null>('dashboard-group');

  // Mini-sidebar hover & click state untuk flyout dan tooltip (Stisla style)
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const [clickedItemId, setClickedItemId] = useState<string | null>(null);
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);

  // Toggle dropdown: jika buka yang lain, yang sebelumnya otomatis tertutup
  const toggleDropdown = (id: string) => {
    setOpenDropdownId((prev) => (prev === id ? null : id));
  };

  // Sinkronisasi otomatis: buka grup yang menaungi menu aktif saat activeId berganti
  useEffect(() => {
    for (const section of navSections) {
      for (const item of section.items) {
        if (item.children?.some((c) => c.id === activeId)) {
          setOpenDropdownId(item.id);
          return;
        }
      }
    }
  }, [activeId]);

  const handleLogout = async () => {
    const confirmed = await confirmDialog({
      title: 'Konfirmasi Keluar',
      text: 'Apakah Anda yakin ingin mengakhiri sesi Velora UI?',
      confirmButtonText: 'Ya, Keluar',
      cancelButtonText: 'Batal',
      isDangerous: true,
      icon: 'warning',
    });

    if (confirmed) {
      showToast('Sesi Anda telah diakhiri dengan aman.', 'info');
    }
  };

  const sidebarContent = (
    <div
      className={`flex flex-col h-full select-none transition-colors duration-200 bg-white text-slate-700 border-r border-slate-200/90 ${
        isCollapsed ? 'overflow-visible' : 'overflow-hidden'
      }`}
    >
      {/* Brand Header */}
      <div className="h-[72px] flex items-center justify-center px-4 flex-shrink-0 border-b border-slate-100 bg-white relative">
        {!isCollapsed ? (
          <span className="text-[18px] font-black tracking-[0.25em] uppercase font-sans text-center text-[#1351b8]">
            VELORA
          </span>
        ) : (
          <div className="mx-auto text-[17px] font-black tracking-widest text-slate-800">
            VL
          </div>
        )}

        <button
          onClick={onCloseMobile}
          className="lg:hidden absolute right-3 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Tutup menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Sections */}
      <div
        className={`flex-1 px-0 ${
          isCollapsed
            ? 'py-3 space-y-1.5 overflow-visible'
            : 'py-3.5 space-y-4 overflow-y-auto sidebar-scrollbar'
        }`}
      >
        {navSections.map((section) => (
          <div key={section.title} className={isCollapsed ? 'space-y-1.5' : 'space-y-1'}>
            {/* Section Header: Rata Kiri di pl-5 */}
            {!isCollapsed && (
              <h3 className="pl-5 pr-3 pt-4 pb-1.5 text-[11px] font-bold tracking-[1.4px] uppercase text-left text-slate-400">
                {section.title}
              </h3>
            )}

            <div className={isCollapsed ? 'space-y-1.5' : 'space-y-0.5'}>
              {section.items.map((item) => {
                const Icon = item.icon;
                const hasChildren = Boolean(item.children && item.children.length > 0);
                const isGroupOpen = openDropdownId === item.id;
                const isChildActive = hasChildren && item.children?.some((c) => c.id === activeId);
                const isDirectActive = activeId === item.id;

                // Saat collapsed: jika ada item yang diklik (clickedItemId), item itu yang aktif visual.
                // Jika tidak ada yang diklik, gunakan activeId/isChildActive.
                const isThisItemActive = isCollapsed
                  ? clickedItemId !== null
                    ? clickedItemId === item.id
                    : isDirectActive || isChildActive
                  : isDirectActive || isChildActive;

                const isThisItemHovered = hoveredItemId === item.id;
                const showFlyout =
                  isCollapsed &&
                  hasChildren &&
                  (hoveredItemId === item.id || clickedItemId === item.id);
                const showTooltip = isCollapsed && !hasChildren && hoveredItemId === item.id;

                // Background abu-abu lembut full width HANYA saat sidebar expanded
                const groupContainerClass =
                  !isCollapsed && hasChildren && isGroupOpen
                    ? 'bg-[#f8fafb] border-y border-slate-100/90 w-full'
                    : 'w-full';

                return (
                  <div
                    key={item.id}
                    className={`transition-colors relative ${groupContainerClass}`}
                    onMouseEnter={() => {
                      if (isCollapsed) setHoveredItemId(item.id);
                    }}
                    onMouseLeave={() => {
                      if (isCollapsed) {
                        setHoveredItemId(null);
                        setClickedItemId(null);
                      }
                    }}
                  >
                    {/* Menu Item Button */}
                    <button
                      onClick={() => {
                        if (isCollapsed) {
                          if (hasChildren) {
                            // Klik item dropdown saat collapsed (Gambar 2): icon jadi biru & flyout terbuka
                            setClickedItemId(item.id);
                          } else {
                            setClickedItemId(null);
                            onSelect(item.id);
                          }
                          return;
                        }

                        if (hasChildren) {
                          toggleDropdown(item.id);
                        } else {
                          onSelect(item.id);
                          if (isOpenMobile) onCloseMobile();
                        }
                      }}
                      className={
                        isCollapsed
                          ? 'w-full flex items-center justify-center py-1 group focus:outline-none'
                          : `w-full group flex items-center gap-3.5 px-6 py-3.5 text-sm transition-colors ${
                              isGroupOpen
                                ? 'text-[#1351b8] font-bold'
                                : isThisItemActive
                                ? 'text-[#1351b8] font-bold'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                            }`
                      }
                    >
                      {isCollapsed ? (
                        /* Kotak Icon saat Collapsed (Gambar 1, 2, 3) */
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-150 ${
                            isThisItemActive
                              ? 'bg-[#1351b8] text-white shadow-md shadow-[#1351b8]/35'
                              : isThisItemHovered
                              ? 'bg-slate-100 text-slate-800'
                              : 'text-slate-500'
                          }`}
                        >
                          <Icon
                            className="w-[22px] h-[22px] flex-shrink-0 transition-colors"
                            strokeWidth={isThisItemActive ? 2.4 : 1.9}
                          />
                        </div>
                      ) : (
                        /* Tampilan Normal saat Expanded */
                        <>
                          <Icon
                            className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${
                              isGroupOpen || isThisItemActive
                                ? 'text-[#1351b8]'
                                : 'text-slate-400 group-hover:text-slate-700'
                            }`}
                            strokeWidth={isGroupOpen || isThisItemActive ? 2.4 : 1.9}
                          />

                          <span className="flex-1 text-left truncate leading-tight">
                            {item.label}
                          </span>

                          {/* Dropdown Indicator (Chevron selalu di ujung kanan) */}
                          {hasChildren && (
                            <span
                              className={`ml-auto flex-shrink-0 transition-transform ${
                                isGroupOpen
                                  ? 'text-[#1351b8]'
                                  : 'text-slate-400 group-hover:text-slate-700'
                              }`}
                            >
                              {isGroupOpen ? (
                                <ChevronDown className="w-4 h-4" strokeWidth={2.4} />
                              ) : (
                                <ChevronRight className="w-4 h-4" strokeWidth={2.4} />
                              )}
                            </span>
                          )}
                        </>
                      )}
                    </button>

                    {/* Mini-Sidebar Flyout Dropdown Menu (Gambar 1 & Gambar 2) */}
                    {showFlyout && (
                      <div
                        className="absolute left-[79px] top-0 z-50 w-56 bg-white rounded-r-xl rounded-l-none shadow-xl border-y border-r border-slate-200/90 py-3.5 px-5 animate-in fade-in duration-100"
                        onMouseEnter={() => setHoveredItemId(item.id)}
                        onMouseLeave={() => {
                          setHoveredItemId(null);
                          setClickedItemId(null);
                        }}
                      >
                        {/* Header Title (Uppercase, bold dark slate seperti LAYOUT di screenshot) */}
                        <div className="text-[10px] font-bold tracking-[1.4px] uppercase text-slate-800 mb-2.5">
                          {item.label}
                        </div>

                        {/* Submenu Item Links */}
                        <div className="space-y-0.5 max-h-[calc(100vh-140px)] overflow-y-auto sidebar-scrollbar">
                          {item.children?.map((child) => {
                            const isSubActive = activeId === child.id;
                            return (
                              <button
                                key={child.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSelect(child.id);
                                  setHoveredItemId(null);
                                  setClickedItemId(null);
                                }}
                                className={`w-full text-left py-1.5 text-[13px] leading-5 transition-colors flex items-center justify-between font-medium ${
                                  isSubActive
                                    ? 'text-[#1351b8] font-bold'
                                    : 'text-slate-500 hover:text-slate-900'
                                }`}
                              >
                                <span className="truncate">{child.label}</span>
                                {isSubActive && (
                                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-[#1351b8]" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Mini-Sidebar Tooltip untuk item non-dropdown (Gambar 3) */}
                    {showTooltip && (
                      <div className="absolute left-[84px] top-1/2 -translate-y-1/2 z-50 pointer-events-none flex items-center animate-in fade-in zoom-in-95 duration-100">
                        {/* Caret Arrow pointing left */}
                        <div className="w-0 h-0 border-y-[5px] border-y-transparent border-r-[6px] border-r-slate-900 -mr-[1px]" />
                        {/* Tooltip Content Badge */}
                        <div className="bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-md shadow-lg whitespace-nowrap">
                          {item.label}
                        </div>
                      </div>
                    )}

                    {/* Submenu Dropdown Items saat Normal/Expanded - Rata kiri presisi sejajar huruf pertama label induk (56px) */}
                    {!isCollapsed && hasChildren && isGroupOpen && (
                      <div className="pl-[56px] pr-6 pb-2 pt-1 space-y-0.5 animate-in fade-in duration-150">
                        {item.children?.map((child) => {
                          const isSubActive = activeId === child.id;
                          const subClass = isSubActive
                            ? 'text-[#1351b8] font-bold'
                            : 'text-slate-600 hover:text-slate-900 font-medium';

                          return (
                            <button
                              key={child.id}
                              onClick={() => {
                                onSelect(child.id);
                                if (isOpenMobile) onCloseMobile();
                              }}
                              className={`w-full text-left py-1.5 text-[13px] leading-5 transition-colors flex items-center justify-between ${subClass}`}
                            >
                              <span className="truncate">{child.label}</span>
                              {isSubActive && (
                                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-[#1351b8]" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer / Quick Logout Button */}
      <div
        className="p-3 border-t border-slate-100 bg-slate-50/50 relative"
        onMouseEnter={() => {
          if (isCollapsed) setIsLogoutHovered(true);
        }}
        onMouseLeave={() => {
          if (isCollapsed) setIsLogoutHovered(false);
        }}
      >
        <button
          onClick={handleLogout}
          className={
            isCollapsed
              ? 'w-11 h-11 mx-auto flex items-center justify-center rounded-xl text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-colors'
              : 'w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors'
          }
        >
          <LogOut className={`${isCollapsed ? 'w-5 h-5' : 'w-4 h-4'} text-rose-500`} />
          {!isCollapsed && <span>Keluar Sistem</span>}
        </button>

        {/* Tooltip untuk tombol logout saat collapsed */}
        {isCollapsed && isLogoutHovered && (
          <div className="absolute left-[84px] top-1/2 -translate-y-1/2 z-50 pointer-events-none flex items-center animate-in fade-in zoom-in-95 duration-100">
            <div className="w-0 h-0 border-y-[5px] border-y-transparent border-r-[6px] border-r-slate-900 -mr-[1px]" />
            <div className="bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-md shadow-lg whitespace-nowrap">
              Keluar Sistem
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={`hidden lg:block fixed inset-y-0 left-0 z-30 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        } shadow-xs`}
      >
        {sidebarContent}
      </aside>

      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
          isOpenMobile ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          onClick={onCloseMobile}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        />

        <div
          className={`absolute inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl transform transition-transform duration-300 ease-out ${
            isOpenMobile ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {sidebarContent}
        </div>
      </div>
    </>
  );
};
