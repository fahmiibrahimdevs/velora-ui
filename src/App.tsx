import React, { useState, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { AdminLayout } from './components/layout/AdminLayout';
import { StatCards } from './components/dashboard/StatCards';
import { RecentExamsTable } from './components/dashboard/RecentExamsTable';
import { useDashboardData } from './hooks/useDashboardData';
import { showToast, showSuccess } from './lib/swal';
import {
  FileCode2,
  FileSpreadsheet,
  CheckCircle2,
  Sparkles,
  Users,
  GraduationCap,
  BookOpen,
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  Radio,
  Award,
  Lightbulb,
  RotateCcw,
  Plane,
  Gauge,
  FileText,
  List,
  Home,
  ChevronRight,
  Loader2,
  Check,
  Star,
  AlertTriangle,
  Info,
  User,
  X,
  Minus,
  ChevronDown,
  Mail,
  Lock,
  GripVertical,
  Image as ImageIcon,
  ExternalLink,
  Maximize2,
} from 'lucide-react';
import { TablePagination, ShowEntriesSelector } from './components/common/TablePagination';

type AlertType =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark';

interface AlertItemDef {
  key: AlertType;
  title: string;
  name: string;
  gradient: string;
  flat: string;
  isLight?: boolean;
}

const alertDefinitions: AlertItemDef[] = [
  {
    key: 'primary',
    title: 'Primary',
    name: 'primary',
    gradient: 'bg-gradient-to-r from-[#175cd3] via-[#1450be] to-[#0f3ba0] text-white shadow-xs',
    flat: 'bg-[#1958ca] text-white',
  },
  {
    key: 'secondary',
    title: 'Secondary',
    name: 'secondary',
    gradient: 'bg-gradient-to-r from-[#cbd5e1] via-[#b8c2cc] to-[#94a3b8] text-white shadow-xs',
    flat: 'bg-[#cdd3d8] text-white',
  },
  {
    key: 'success',
    title: 'Success',
    name: 'success',
    gradient: 'bg-gradient-to-r from-[#22c55e] via-[#16a34a] to-[#15803d] text-white shadow-xs',
    flat: 'bg-[#47c363] text-white',
  },
  {
    key: 'danger',
    title: 'Danger',
    name: 'danger',
    gradient: 'bg-gradient-to-r from-[#ef4444] via-[#dc2626] to-[#b91c1c] text-white shadow-xs',
    flat: 'bg-[#fc544b] text-white',
  },
  {
    key: 'warning',
    title: 'Warning',
    name: 'warning',
    gradient: 'bg-gradient-to-r from-[#f59e0b] via-[#ea580c] to-[#d97706] text-white shadow-xs',
    flat: 'bg-[#ffa426] text-white',
  },
  {
    key: 'info',
    title: 'Info',
    name: 'info',
    gradient: 'bg-gradient-to-r from-[#0ea5e9] via-[#0284c7] to-[#0369a1] text-white shadow-xs',
    flat: 'bg-[#3abaf4] text-white',
  },
  {
    key: 'light',
    title: 'Light',
    name: 'light',
    gradient: 'bg-gradient-to-r from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] text-slate-800 border border-slate-200/80 shadow-xs',
    flat: 'bg-[#e3eaef] text-slate-800 border border-slate-200/50',
    isLight: true,
  },
  {
    key: 'dark',
    title: 'Dark',
    name: 'dark',
    gradient: 'bg-gradient-to-r from-[#1e293b] via-[#0f172a] to-[#020617] text-white shadow-xs',
    flat: 'bg-[#191d21] text-white',
  },
];

// Dedicated Alerts Showcase with Modern Gradient styling
function AlertView() {
  const [dismissedKeys, setDismissedKeys] = useState<string[]>([]);

  const handleDismiss = (key: string) => {
    setDismissedKeys((prev) => [...prev, key]);
    showToast(`Alert ${key} berhasil ditutup`, 'info');
  };

  const handleResetDismissed = () => {
    setDismissedKeys([]);
    showToast('Semua alert dismissable dikembalikan', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Section Header with Blue Pill Accent */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-8 h-2.5 bg-[#1351b8] rounded-full inline-block" />
          <h2 className="text-base sm:text-lg font-bold text-slate-800">Alerts</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500">
          Provide contextual feedback messages for typical user actions with the handful of available and flexible alert messages.
        </p>
      </div>

      {/* 2-Column Responsive Grid matching ShizueFI Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Default & Icon */}
        <div className="space-y-6">
          {/* Card 1: Default Alerts */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#1351b8] tracking-tight">Default</h3>
            </div>
            <div className="p-6 space-y-3.5">
              {alertDefinitions.map((item) => (
                <div
                  key={item.key}
                  className={`px-4.5 py-3.5 rounded-lg text-sm font-medium transition-all duration-200 ${item.gradient}`}
                >
                  This is a {item.name} alert.
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Icon Alerts */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#1351b8] tracking-tight">Icon</h3>
            </div>
            <div className="p-6 space-y-3.5">
              {alertDefinitions.map((item) => (
                <div
                  key={item.key}
                  className={`px-4.5 py-3.5 rounded-lg text-sm flex items-center gap-3.5 transition-all duration-200 ${item.gradient}`}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-white/15 backdrop-blur-xs">
                    <Lightbulb className="w-4.5 h-4.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-sm tracking-tight mb-0.5">{item.title}</div>
                    <div className="text-xs sm:text-sm leading-relaxed opacity-95">
                      This is a {item.name} alert.
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Title & Dismissable */}
        <div className="space-y-6">
          {/* Card 3: Title Alerts */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#1351b8] tracking-tight">Title</h3>
            </div>
            <div className="p-6 space-y-3.5">
              {alertDefinitions.map((item) => (
                <div
                  key={item.key}
                  className={`px-4.5 py-3.5 rounded-lg text-sm transition-all duration-200 ${item.gradient}`}
                >
                  <div className="font-bold text-sm tracking-tight mb-0.5">{item.title}</div>
                  <div className="text-xs sm:text-sm leading-relaxed opacity-95">
                    This is a {item.name} alert.
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: Dismissable Alerts */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-[#1351b8] tracking-tight">Dismissable</h3>
              {dismissedKeys.length > 0 && (
                <button
                  onClick={handleResetDismissed}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1351b8] hover:text-[#0c2869] transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset ({dismissedKeys.length})
                </button>
              )}
            </div>
            <div className="p-6 space-y-3.5">
              {alertDefinitions
                .filter((item) => !dismissedKeys.includes(item.key))
                .map((item) => (
                  <div
                    key={item.key}
                    className={`px-4.5 py-3.5 rounded-lg text-sm flex items-center justify-between gap-3 transition-all duration-200 ${item.gradient}`}
                  >
                    <div className="text-xs sm:text-sm font-medium">
                      This is a {item.name} alert.
                    </div>
                    <button
                      onClick={() => handleDismiss(item.key)}
                      className={`w-7 h-7 flex items-center justify-center rounded-md text-lg leading-none font-bold transition-colors ${
                        item.isLight
                          ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-300/40'
                          : 'text-white/80 hover:text-white hover:bg-black/15'
                      }`}
                      aria-label={`Tutup alert ${item.name}`}
                    >
                      &times;
                    </button>
                  </div>
                ))}

              {dismissedKeys.length === alertDefinitions.length && (
                <div className="text-center py-8 space-y-2">
                  <p className="text-sm text-slate-500 font-medium">
                    Semua alert dismissable telah ditutup.
                  </p>
                  <button
                    onClick={handleResetDismissed}
                    className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg bg-[#1351b8] text-white hover:bg-[#0c2869] transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Tampilkan Kembali Semua Alert
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dedicated Badges Showcase matching ShizueFI & Stisla with Modern Gradient improvements
function BadgeView() {
  const badgeVariants = [
    {
      name: 'Primary',
      gradient: 'bg-gradient-to-r from-[#175cd3] via-[#1450be] to-[#0f3ba0] text-white shadow-xs',
      soft: 'bg-blue-50 text-[#1351b8] border border-blue-200/80',
    },
    {
      name: 'Secondary',
      gradient: 'bg-gradient-to-r from-[#cbd5e1] via-[#b8c2cc] to-[#94a3b8] text-white shadow-xs',
      soft: 'bg-slate-100 text-slate-700 border border-slate-200/80',
    },
    {
      name: 'Success',
      gradient: 'bg-gradient-to-r from-[#22c55e] via-[#16a34a] to-[#15803d] text-white shadow-xs',
      soft: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80',
    },
    {
      name: 'Danger',
      gradient: 'bg-gradient-to-r from-[#ef4444] via-[#dc2626] to-[#b91c1c] text-white shadow-xs',
      soft: 'bg-rose-50 text-rose-700 border border-rose-200/80',
    },
    {
      name: 'Warning',
      gradient: 'bg-gradient-to-r from-[#f59e0b] via-[#ea580c] to-[#d97706] text-white shadow-xs',
      soft: 'bg-amber-50 text-amber-700 border border-amber-200/80',
    },
    {
      name: 'Info',
      gradient: 'bg-gradient-to-r from-[#0ea5e9] via-[#0284c7] to-[#0369a1] text-white shadow-xs',
      soft: 'bg-sky-50 text-sky-700 border border-sky-200/80',
    },
    {
      name: 'Light',
      gradient: 'bg-gradient-to-r from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] text-slate-800 border border-slate-200/80 shadow-xs',
      soft: 'bg-slate-50 text-slate-600 border border-slate-200/60',
      isLight: true,
    },
    {
      name: 'Dark',
      gradient: 'bg-gradient-to-r from-[#1e293b] via-[#0f172a] to-[#020617] text-white shadow-xs',
      soft: 'bg-slate-800 text-slate-100 border border-slate-900',
    },
  ];

  const simpleButtons = [
    { name: 'Primary', bg: 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white' },
    { name: 'Danger', bg: 'bg-gradient-to-r from-[#ef4444] to-[#b91c1c] hover:from-[#dc2626] hover:to-[#991b1b] text-white' },
    { name: 'Warning', bg: 'bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:from-[#ea580c] hover:to-[#b45309] text-white' },
    { name: 'Success', bg: 'bg-gradient-to-r from-[#22c55e] to-[#15803d] hover:from-[#16a34a] hover:to-[#166534] text-white' },
    { name: 'Dark', bg: 'bg-gradient-to-r from-[#1e293b] to-[#020617] hover:from-[#0f172a] hover:to-[#000000] text-white' },
  ];

  const iconButtons = [
    { name: 'Primary', bg: 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white' },
    { name: 'Danger', bg: 'bg-gradient-to-r from-[#ef4444] to-[#b91c1c] hover:from-[#dc2626] hover:to-[#991b1b] text-white' },
    { name: 'Warning', bg: 'bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:from-[#ea580c] hover:to-[#b45309] text-white' },
    { name: 'Success', bg: 'bg-gradient-to-r from-[#22c55e] to-[#15803d] hover:from-[#16a34a] hover:to-[#166534] text-white' },
  ];

  return (
    <div className="space-y-6">
      {/* Section Header with Blue Pill Accent */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-8 h-2.5 bg-[#1351b8] rounded-full inline-block" />
          <h2 className="text-base sm:text-lg font-bold text-slate-800">Badges</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500">
          Examples for badges, our small count and labeling component.
        </p>
      </div>

      {/* 2-Column Responsive Grid matching ShizueFI Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Heading & Variation & Improvements */}
        <div className="space-y-6">
          {/* Card 1: Heading */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#1351b8] tracking-tight">Heading</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">Heading 1</h1>
                <span className="px-3 py-1 text-sm font-semibold rounded-lg bg-slate-100 text-slate-700 border border-slate-200/80 shadow-2xs">New</span>
              </div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">Heading 2</h2>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-md bg-slate-100 text-slate-700 border border-slate-200/80 shadow-2xs">New</span>
              </div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">Heading 3</h3>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-md bg-slate-100 text-slate-700 border border-slate-200/80 shadow-2xs">New</span>
              </div>
              <div className="flex items-center gap-2.5">
                <h4 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight">Heading 4</h4>
                <span className="px-2 py-0.5 text-[11px] font-semibold rounded-md bg-slate-100 text-slate-700 border border-slate-200/80 shadow-2xs">New</span>
              </div>
              <div className="flex items-center gap-2">
                <h5 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">Heading 5</h5>
                <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-slate-100 text-slate-700 border border-slate-200/80 shadow-2xs">New</span>
              </div>
              <div className="flex items-center gap-2">
                <h6 className="text-sm font-bold text-slate-800 tracking-tight">Heading 6</h6>
                <span className="px-1.5 py-0.5 text-[9px] font-semibold rounded-sm bg-slate-100 text-slate-700 border border-slate-200/80 shadow-2xs">New</span>
              </div>
            </div>
          </div>

          {/* Card 2: Variation */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#1351b8] tracking-tight">Variation</h3>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-2.5 items-center">
                {badgeVariants.map((item) => (
                  <span
                    key={item.name}
                    className={`px-3 py-1 text-xs font-semibold rounded-md shadow-xs transition-transform hover:scale-105 select-none ${item.gradient}`}
                  >
                    {item.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Card 3: Modern Improvements - Pill & Live Status Badges */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#1351b8] tracking-tight">Pill &amp; Live Status Badges (Modern)</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">Pill Gradient Badges</p>
                <div className="flex flex-wrap gap-2 items-center">
                  {badgeVariants.map((item) => (
                    <span
                      key={`pill-${item.name}`}
                      className={`px-3.5 py-1 text-xs font-semibold rounded-full shadow-xs transition-transform hover:scale-105 select-none ${item.gradient}`}
                    >
                      {item.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">Live Status Indicators</p>
                <div className="flex flex-wrap gap-2.5 items-center text-xs font-semibold">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2" />
                    Live System
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80">
                    <span className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
                    Active Node
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80">
                    <span className="w-2 h-2 rounded-full bg-amber-500 mr-2" />
                    Pending Review
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200/80">
                    <span className="w-2 h-2 rounded-full bg-rose-500 mr-2" />
                    Critical Alert
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Button & Link & Soft Badges */}
        <div className="space-y-6">
          {/* Card 4: Button */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#1351b8] tracking-tight">Button</h3>
            </div>
            <div className="p-6 space-y-6">
              {/* Simple Subheading */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-4 h-1 bg-[#1351b8] rounded-full inline-block" />
                  <h4 className="text-sm font-bold text-slate-800">Simple</h4>
                </div>
                <div className="flex flex-wrap gap-2.5 items-center">
                  {simpleButtons.map((btn) => (
                    <button
                      key={`btn-simple-${btn.name}`}
                      onClick={() => showToast(`Tombol notifikasi ${btn.name} diklik!`, 'info')}
                      className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all inline-flex items-center gap-2 cursor-pointer active:scale-95 shadow-xs hover:shadow-md ${btn.bg}`}
                    >
                      Notifications
                      <span className="px-2 py-0.5 rounded-md bg-white/25 backdrop-blur-xs font-bold text-[11px] leading-tight text-white">
                        4
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Icons Subheading */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-4 h-1 bg-[#1351b8] rounded-full inline-block" />
                  <h4 className="text-sm font-bold text-slate-800">Icons</h4>
                </div>
                <div className="flex flex-wrap gap-2.5 items-center">
                  {iconButtons.map((btn) => (
                    <button
                      key={`btn-icon-${btn.name}`}
                      onClick={() => showToast(`Notifikasi dengan icon ${btn.name} diklik!`, 'info')}
                      className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all inline-flex items-center gap-2 cursor-pointer active:scale-95 shadow-xs hover:shadow-md ${btn.bg}`}
                    >
                      <Plane className="w-3.5 h-3.5" />
                      Notifications
                      <span className="px-2 py-0.5 rounded-md bg-white/25 backdrop-blur-xs font-bold text-[11px] leading-tight text-white">
                        4
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card 5: Link */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#1351b8] tracking-tight">Link</h3>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-2.5 items-center">
                {badgeVariants.map((item) => (
                  <button
                    key={`link-${item.name}`}
                    onClick={() => showToast(`Badge link ${item.name} berhasil diakses!`, 'info')}
                    className={`px-3 py-1 text-xs font-semibold rounded-md shadow-xs transition-all hover:scale-105 hover:shadow-md cursor-pointer select-none ${item.gradient}`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Card 6: Modern Improvements - Soft Tint Badges */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#1351b8] tracking-tight">Soft &amp; Outline Badges (Modern)</h3>
            </div>
            <div className="p-6">
              <p className="text-xs text-slate-500 mb-3">
                Modern soft-tinted badges with gentle contrast and subtle border accents for tags and metadata.
              </p>
              <div className="flex flex-wrap gap-2.5 items-center">
                {badgeVariants.map((item) => (
                  <span
                    key={`soft-${item.name}`}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg shadow-2xs transition-transform hover:scale-105 select-none ${item.soft}`}
                  >
                    {item.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dedicated Breadcrumb Showcase matching ShizueFI & Stisla specification
function BreadcrumbView() {
  const gradientBackgrounds = [
    {
      name: 'Primary',
      gradient: 'bg-gradient-to-r from-[#175cd3] via-[#1450be] to-[#0f3ba0] text-white shadow-xs',
    },
    {
      name: 'Warning',
      gradient: 'bg-gradient-to-r from-[#f59e0b] via-[#ea580c] to-[#d97706] text-white shadow-xs',
    },
    {
      name: 'Success',
      gradient: 'bg-gradient-to-r from-[#22c55e] via-[#16a34a] to-[#15803d] text-white shadow-xs',
    },
    {
      name: 'Danger',
      gradient: 'bg-gradient-to-r from-[#ef4444] via-[#dc2626] to-[#b91c1c] text-white shadow-xs',
    },
    {
      name: 'Secondary',
      gradient: 'bg-gradient-to-r from-[#cbd5e1] via-[#b8c2cc] to-[#94a3b8] text-white shadow-xs',
    },
    {
      name: 'Dark',
      gradient: 'bg-gradient-to-r from-[#1e293b] via-[#0f172a] to-[#020617] text-white shadow-xs',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Section Header with Blue Pill Accent */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-8 h-2.5 bg-[#1351b8] rounded-full inline-block" />
          <h2 className="text-base sm:text-lg font-bold text-slate-800">Breadcrumb</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500">
          Indicate the current page’s location within a navigational hierarchy that automatically adds separators via CSS.
        </p>
      </div>

      {/* 2-Column Responsive Grid matching ShizueFI Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Default, Icon & Modern Chevron Improvements */}
        <div className="space-y-6">
          {/* Card 1: Default */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#1351b8] tracking-tight">Default</h3>
            </div>
            <div className="p-6 space-y-4">
              {/* Item 1: Single Home */}
              <nav aria-label="breadcrumb">
                <ol className="flex items-center px-4.5 py-3 rounded-xl bg-slate-50/90 border border-slate-200/60 text-xs sm:text-sm font-medium text-slate-500">
                  <li className="text-slate-600 font-semibold" aria-current="page">Home</li>
                </ol>
              </nav>

              {/* Item 2: Home / Library / Data */}
              <nav aria-label="breadcrumb">
                <ol className="flex items-center px-4.5 py-3 rounded-xl bg-slate-50/90 border border-slate-200/60 text-xs sm:text-sm font-medium">
                  <li>
                    <button
                      onClick={() => showToast('Navigasi ke Home', 'info')}
                      className="text-[#1351b8] hover:underline cursor-pointer"
                    >
                      Home
                    </button>
                  </li>
                  <li className="text-slate-400 mx-2.5">/</li>
                  <li>
                    <button
                      onClick={() => showToast('Navigasi ke Library', 'info')}
                      className="text-[#1351b8] hover:underline cursor-pointer"
                    >
                      Library
                    </button>
                  </li>
                  <li className="text-slate-400 mx-2.5">/</li>
                  <li className="text-slate-600 font-semibold" aria-current="page">Data</li>
                </ol>
              </nav>
            </div>
          </div>

          {/* Card 2: Icon */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#1351b8] tracking-tight">Icon</h3>
            </div>
            <div className="p-6 space-y-4">
              {/* Item 1: Icon Home */}
              <nav aria-label="breadcrumb">
                <ol className="flex items-center px-4.5 py-3 rounded-xl bg-slate-50/90 border border-slate-200/60 text-xs sm:text-sm font-medium text-slate-600 font-semibold">
                  <li className="inline-flex items-center gap-1.5" aria-current="page">
                    <Gauge className="w-4 h-4 text-slate-500" />
                    Home
                  </li>
                </ol>
              </nav>

              {/* Item 2: Icon Home / Library / Data */}
              <nav aria-label="breadcrumb">
                <ol className="flex items-center px-4.5 py-3 rounded-xl bg-slate-50/90 border border-slate-200/60 text-xs sm:text-sm font-medium">
                  <li>
                    <button
                      onClick={() => showToast('Navigasi ke Home Dashboard', 'info')}
                      className="inline-flex items-center gap-1.5 text-[#1351b8] hover:underline cursor-pointer"
                    >
                      <Gauge className="w-4 h-4" />
                      Home
                    </button>
                  </li>
                  <li className="text-slate-400 mx-2.5">/</li>
                  <li>
                    <button
                      onClick={() => showToast('Navigasi ke Library File', 'info')}
                      className="inline-flex items-center gap-1.5 text-[#1351b8] hover:underline cursor-pointer"
                    >
                      <FileText className="w-4 h-4" />
                      Library
                    </button>
                  </li>
                  <li className="text-slate-400 mx-2.5">/</li>
                  <li className="inline-flex items-center gap-1.5 text-slate-600 font-semibold" aria-current="page">
                    <List className="w-4 h-4 text-slate-500" />
                    Data
                  </li>
                </ol>
              </nav>
            </div>
          </div>

          {/* Card 3: Modern Chevron Improvement */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#1351b8] tracking-tight">Modern Chevron Separators (Improvement)</h3>
            </div>
            <div className="p-6 space-y-3.5">
              <nav aria-label="breadcrumb">
                <ol className="flex items-center px-4.5 py-3 rounded-xl bg-slate-50/90 border border-slate-200/60 text-xs sm:text-sm font-medium">
                  <li>
                    <button
                      onClick={() => showToast('Navigasi ke App Root', 'info')}
                      className="inline-flex items-center gap-1.5 text-slate-600 hover:text-[#1351b8] transition-colors cursor-pointer"
                    >
                      <Home className="w-4 h-4 text-[#1351b8]" />
                      Velora
                    </button>
                  </li>
                  <li className="mx-2 text-slate-400">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </li>
                  <li>
                    <button
                      onClick={() => showToast('Navigasi ke Components', 'info')}
                      className="text-slate-600 hover:text-[#1351b8] transition-colors cursor-pointer"
                    >
                      Bootstrap
                    </button>
                  </li>
                  <li className="mx-2 text-slate-400">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </li>
                  <li className="text-[#1351b8] font-bold" aria-current="page">
                    Breadcrumb
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>

        {/* Right Column: Background (Gradients) */}
        <div className="space-y-6">
          {/* Card 4: Background */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#1351b8] tracking-tight">Background</h3>
            </div>
            <div className="p-6 space-y-3.5">
              {gradientBackgrounds.map((bg) => (
                <nav key={bg.name} aria-label={`breadcrumb-${bg.name}`}>
                  <ol className={`flex items-center px-5 py-3.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${bg.gradient}`}>
                    <li>
                      <button
                        onClick={() => showToast(`Navigasi Home pada breadcrumb ${bg.name}`, 'info')}
                        className="inline-flex items-center gap-1.5 text-white/85 hover:text-white transition-colors cursor-pointer"
                      >
                        <Gauge className="w-4 h-4 opacity-90" />
                        Home
                      </button>
                    </li>
                    <li className="text-white/60 mx-2.5 font-light">/</li>
                    <li>
                      <button
                        onClick={() => showToast(`Navigasi Library pada breadcrumb ${bg.name}`, 'info')}
                        className="inline-flex items-center gap-1.5 text-white/85 hover:text-white transition-colors cursor-pointer"
                      >
                        <FileText className="w-4 h-4 opacity-90" />
                        Library
                      </button>
                    </li>
                    <li className="text-white/60 mx-2.5 font-light">/</li>
                    <li className="inline-flex items-center gap-1.5 text-white font-bold" aria-current="page">
                      <List className="w-4 h-4" />
                      Data
                    </li>
                  </ol>
                </nav>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dedicated Buttons Showcase matching ShizueFI & Stisla with Modern Gradients
function ButtonsView() {
  const [isProcessing, setIsProcessing] = useState(false);

  const basicButtons = [
    { name: 'Primary', class: 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white' },
    { name: 'Secondary', class: 'bg-gradient-to-r from-[#cbd5e1] to-[#94a3b8] hover:from-[#94a3b8] hover:to-[#64748b] text-white' },
    { name: 'Info', class: 'bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] hover:from-[#0284c7] hover:to-[#0369a1] text-white' },
    { name: 'Warning', class: 'bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:from-[#ea580c] hover:to-[#b45309] text-white' },
    { name: 'Danger', class: 'bg-gradient-to-r from-[#ef4444] to-[#b91c1c] hover:from-[#dc2626] hover:to-[#991b1b] text-white' },
    { name: 'Success', class: 'bg-gradient-to-r from-[#22c55e] to-[#15803d] hover:from-[#16a34a] hover:to-[#166534] text-white' },
    { name: 'Light', class: 'bg-gradient-to-r from-[#f8fafc] to-[#e2e8f0] hover:bg-slate-200 text-slate-800 border border-slate-200/80' },
    { name: 'Dark', class: 'bg-gradient-to-r from-[#1e293b] to-[#020617] hover:from-[#0f172a] hover:to-[#000000] text-white' },
    { name: 'Link', class: 'text-[#1351b8] hover:underline font-semibold bg-transparent shadow-none' },
  ];

  const outlineButtons = [
    { name: 'Primary', class: 'border border-[#1351b8] text-[#1351b8] hover:bg-[#1351b8] hover:text-white' },
    { name: 'Secondary', class: 'border border-slate-400 text-slate-600 hover:bg-slate-500 hover:text-white' },
    { name: 'Info', class: 'border border-sky-500 text-sky-600 hover:bg-sky-500 hover:text-white' },
    { name: 'Warning', class: 'border border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white' },
    { name: 'Danger', class: 'border border-rose-500 text-rose-600 hover:bg-rose-500 hover:text-white' },
    { name: 'Success', class: 'border border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white' },
    { name: 'Light', class: 'border border-slate-200 text-slate-400 hover:bg-slate-100 hover:text-slate-700' },
    { name: 'Dark', class: 'border border-slate-800 text-slate-800 hover:bg-slate-900 hover:text-white' },
  ];

  const iconButtons = [
    { name: 'Default', icon: User, class: 'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50' },
    { name: 'Primary', icon: Edit3, class: 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white' },
    { name: 'Secondary', icon: User, class: 'bg-gradient-to-r from-[#cbd5e1] to-[#94a3b8] text-white' },
    { name: 'Info', icon: Info, class: 'bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] text-white' },
    { name: 'Warning', icon: AlertTriangle, class: 'bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white' },
    { name: 'Danger', icon: X, class: 'bg-gradient-to-r from-[#ef4444] to-[#b91c1c] text-white' },
    { name: 'Success', icon: Check, class: 'bg-gradient-to-r from-[#22c55e] to-[#15803d] text-white' },
    { name: 'Light', icon: Star, class: 'bg-gradient-to-r from-[#f8fafc] to-[#e2e8f0] text-slate-800 border border-slate-200/80' },
    { name: 'Dark', icon: FileText, class: 'bg-gradient-to-r from-[#1e293b] to-[#020617] text-white' },
  ];

  const onlyIconButtons = [
    { icon: Edit3, class: 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white' },
    { icon: User, class: 'bg-gradient-to-r from-[#cbd5e1] to-[#94a3b8] text-white' },
    { icon: Info, class: 'bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] text-white' },
    { icon: AlertTriangle, class: 'bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white' },
    { icon: X, class: 'bg-gradient-to-r from-[#ef4444] to-[#b91c1c] text-white' },
    { icon: Check, class: 'bg-gradient-to-r from-[#22c55e] to-[#15803d] text-white' },
    { icon: Star, class: 'bg-gradient-to-r from-[#f8fafc] to-[#e2e8f0] text-slate-800 border border-slate-200/80' },
    { icon: FileText, class: 'bg-gradient-to-r from-[#1e293b] to-[#020617] text-white' },
  ];

  const handleProgressClick = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      showToast('Aksi proses selesai!', 'success');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Section Header with Blue Pill Accent */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-8 h-2.5 bg-[#1351b8] rounded-full inline-block" />
          <h2 className="text-base sm:text-lg font-bold text-slate-800">Buttons</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500">
          Use Bootstrap’s custom button styles for actions in forms, dialogs, and more with support for multiple sizes, states, and more.
        </p>
      </div>

      {/* Row 1: Basic & Buttons .btn-outline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Card 1: Basic */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4.5 border-b border-slate-100">
            <h3 className="text-base font-bold text-[#1351b8] tracking-tight">Basic</h3>
          </div>
          <div className="p-6">
            <p className="text-xs text-slate-500 mb-4 font-normal">
              Use the <code className="text-pink-600 bg-pink-50 px-1 py-0.5 rounded text-[11px]">.btn .btn-&#123;color&#125;</code> classes.
            </p>
            <div className="flex flex-wrap gap-2.5 items-center">
              {basicButtons.map((btn) => (
                <button
                  key={`basic-${btn.name}`}
                  onClick={() => showToast(`Tombol ${btn.name} diklik!`, 'info')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer active:scale-95 shadow-xs hover:shadow-md ${btn.class}`}
                >
                  {btn.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Card 2: Buttons .btn-outline */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4.5 border-b border-slate-100">
            <h3 className="text-base font-bold text-[#1351b8] tracking-tight">
              Buttons <code className="text-sm font-mono text-[#1351b8] bg-blue-50 px-1.5 py-0.5 rounded-md">.btn-outline</code>
            </h3>
          </div>
          <div className="p-6">
            <p className="text-xs text-slate-500 mb-4 font-normal">
              Use the <code className="text-pink-600 bg-pink-50 px-1 py-0.5 rounded text-[11px]">.btn .btn-outline-&#123;color&#125;</code> classes.
            </p>
            <div className="flex flex-wrap gap-2.5 items-center">
              {outlineButtons.map((btn) => (
                <button
                  key={`outline-${btn.name}`}
                  onClick={() => showToast(`Tombol Outline ${btn.name} diklik!`, 'info')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer active:scale-95 ${btn.class}`}
                >
                  {btn.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Button Sizes & Button States */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Card 3: Button Sizes */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4.5 border-b border-slate-100">
            <h3 className="text-base font-bold text-[#1351b8] tracking-tight">Button Sizes</h3>
          </div>
          <div className="p-6">
            <p className="text-xs text-slate-500 mb-4 font-normal">
              Use the <code className="text-pink-600 bg-pink-50 px-1 py-0.5 rounded text-[11px]">.btn-lg</code> or <code className="text-pink-600 bg-pink-50 px-1 py-0.5 rounded text-[11px]">.btn-sm</code> classes.
            </p>
            <div className="flex flex-wrap gap-3 items-center">
              <button
                onClick={() => showToast('Ukuran Small diklik', 'info')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:from-[#ea580c] hover:to-[#b45309] text-white shadow-xs cursor-pointer active:scale-95"
              >
                Small
              </button>
              <button
                onClick={() => showToast('Ukuran Normal diklik', 'info')}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#ef4444] to-[#b91c1c] hover:from-[#dc2626] hover:to-[#991b1b] text-white shadow-xs cursor-pointer active:scale-95"
              >
                Normal
              </button>
              <button
                onClick={() => showToast('Ukuran Large diklik', 'info')}
                className="px-6 py-3 rounded-2xl text-base font-bold bg-gradient-to-r from-[#1e293b] to-[#020617] hover:from-[#0f172a] hover:to-[#000000] text-white shadow-sm cursor-pointer active:scale-95"
              >
                Large
              </button>
            </div>
          </div>
        </div>

        {/* Card 4: Button States */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4.5 border-b border-slate-100">
            <h3 className="text-base font-bold text-[#1351b8] tracking-tight">Button States</h3>
          </div>
          <div className="p-6">
            <p className="text-xs text-slate-500 mb-4 font-normal">
              Use the <code className="text-pink-600 bg-pink-50 px-1 py-0.5 rounded text-[11px]">.disabled</code> or <code className="text-pink-600 bg-pink-50 px-1 py-0.5 rounded text-[11px]">.btn-progress</code> classes.
            </p>
            <div className="flex flex-wrap gap-3 items-center">
              <button
                onClick={() => showToast('State Normal', 'info')}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white shadow-xs cursor-pointer active:scale-95"
              >
                Normal
              </button>
              <button
                disabled
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#175cd3]/60 text-white/70 shadow-none cursor-not-allowed"
              >
                Disabled
              </button>
              <button
                onClick={handleProgressClick}
                className="px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white shadow-xs inline-flex items-center justify-center min-w-[90px] cursor-pointer"
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-4 h-4 animate-spin text-white/80" />
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Icon Button & Only Icon Button */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Card 5: Icon Button */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4.5 border-b border-slate-100">
            <h3 className="text-base font-bold text-[#1351b8] tracking-tight">Icon Button</h3>
          </div>
          <div className="p-6">
            <p className="text-xs text-slate-500 mb-4 font-normal">
              Use the <code className="text-pink-600 bg-pink-50 px-1 py-0.5 rounded text-[11px]">.btn-icon</code> and <code className="text-pink-600 bg-pink-50 px-1 py-0.5 rounded text-[11px]">.icon-left</code> classes.
            </p>
            <div className="flex flex-wrap gap-2.5 items-center">
              {iconButtons.map((btn) => {
                const IconComponent = btn.icon;
                return (
                  <button
                    key={`icon-btn-${btn.name}`}
                    onClick={() => showToast(`Icon Button ${btn.name} diklik!`, 'info')}
                    className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 transition-all duration-150 cursor-pointer active:scale-95 shadow-xs hover:shadow-md ${btn.class}`}
                  >
                    <IconComponent className="w-4 h-4" />
                    {btn.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Card 6: Only Icon Button */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4.5 border-b border-slate-100">
            <h3 className="text-base font-bold text-[#1351b8] tracking-tight">Only Icon Button</h3>
          </div>
          <div className="p-6">
            <p className="text-xs text-slate-500 mb-4 font-normal">
              Use the <code className="text-pink-600 bg-pink-50 px-1 py-0.5 rounded text-[11px]">.btn-icon</code> class.
            </p>
            <div className="flex flex-wrap gap-2.5 items-center">
              {onlyIconButtons.map((btn, idx) => {
                const IconComponent = btn.icon;
                return (
                  <button
                    key={`only-icon-${idx}`}
                    onClick={() => showToast(`Icon button diklik!`, 'info')}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150 cursor-pointer active:scale-95 shadow-xs hover:shadow-md ${btn.class}`}
                  >
                    <IconComponent className="w-4 h-4" />
                  </button>
                );
              })}
            </div>

            <p className="text-xs text-slate-500 mt-5 mb-2.5 font-normal">Sizes.</p>
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => showToast('Small Icon Button', 'info')}
                className="w-7 h-7 rounded-lg bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white flex items-center justify-center shadow-xs cursor-pointer active:scale-95"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => showToast('Normal Icon Button', 'info')}
                className="w-9 h-9 rounded-xl bg-gradient-to-r from-[#ef4444] to-[#b91c1c] text-white flex items-center justify-center shadow-xs cursor-pointer active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
              <button
                onClick={() => showToast('Large Icon Button', 'info')}
                className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#22c55e] to-[#15803d] text-white flex items-center justify-center shadow-sm cursor-pointer active:scale-95"
              >
                <Check className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Button Group & Vertical Variation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Card 7: Button Group */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4.5 border-b border-slate-100">
            <h3 className="text-base font-bold text-[#1351b8] tracking-tight">Button Group</h3>
          </div>
          <div className="p-6 space-y-4">
            {/* Group 1: Secondary Group */}
            <div className="inline-flex rounded-xl shadow-xs overflow-hidden" role="group">
              <button
                onClick={() => showToast('Left clicked', 'info')}
                className="px-4 py-2 text-xs sm:text-sm font-semibold bg-slate-200 hover:bg-slate-300 text-slate-700 border-r border-slate-300/80 cursor-pointer"
              >
                Left
              </button>
              <button
                onClick={() => showToast('Middle clicked', 'info')}
                className="px-4 py-2 text-xs sm:text-sm font-semibold bg-slate-200 hover:bg-slate-300 text-slate-700 border-r border-slate-300/80 cursor-pointer"
              >
                Middle
              </button>
              <button
                onClick={() => showToast('Right clicked', 'info')}
                className="px-4 py-2 text-xs sm:text-sm font-semibold bg-slate-200 hover:bg-slate-300 text-slate-700 cursor-pointer"
              >
                Right
              </button>
            </div>

            {/* Group 2: Colored Danger, Warning, Success */}
            <div>
              <div className="inline-flex rounded-xl shadow-xs overflow-hidden" role="group">
                <button
                  onClick={() => showToast('Left Danger', 'info')}
                  className="px-4 py-2 text-xs sm:text-sm font-semibold bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white border-r border-black/10 cursor-pointer"
                >
                  Left
                </button>
                <button
                  onClick={() => showToast('Middle Warning', 'info')}
                  className="px-4 py-2 text-xs sm:text-sm font-semibold bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white border-r border-black/10 cursor-pointer"
                >
                  Middle
                </button>
                <button
                  onClick={() => showToast('Right Success', 'info')}
                  className="px-4 py-2 text-xs sm:text-sm font-semibold bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-white cursor-pointer"
                >
                  Right
                </button>
              </div>
            </div>

            {/* Group 3: Small Primary Group */}
            <div>
              <div className="inline-flex rounded-lg shadow-2xs overflow-hidden" role="group">
                <button
                  onClick={() => showToast('Left Small', 'info')}
                  className="px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-[#175cd3] to-[#1244a2] text-white border-r border-blue-400/30 cursor-pointer"
                >
                  Left
                </button>
                <button
                  onClick={() => showToast('Middle Small', 'info')}
                  className="px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-[#175cd3] to-[#1244a2] text-white border-r border-blue-400/30 cursor-pointer"
                >
                  Middle
                </button>
                <button
                  onClick={() => showToast('Right Small', 'info')}
                  className="px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-[#175cd3] to-[#1244a2] text-white cursor-pointer"
                >
                  Right
                </button>
              </div>
            </div>

            {/* Group 4: Large Danger Group */}
            <div>
              <div className="inline-flex rounded-2xl shadow-sm overflow-hidden" role="group">
                <button
                  onClick={() => showToast('Left Large', 'info')}
                  className="px-6 py-3 text-base font-bold bg-gradient-to-r from-[#ef4444] to-[#b91c1c] text-white border-r border-red-700/40 cursor-pointer"
                >
                  Left
                </button>
                <button
                  onClick={() => showToast('Middle Large', 'info')}
                  className="px-6 py-3 text-base font-bold bg-gradient-to-r from-[#ef4444] to-[#b91c1c] text-white border-r border-red-700/40 cursor-pointer"
                >
                  Middle
                </button>
                <button
                  onClick={() => showToast('Right Large', 'info')}
                  className="px-6 py-3 text-base font-bold bg-gradient-to-r from-[#ef4444] to-[#b91c1c] text-white cursor-pointer"
                >
                  Right
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Card 8: Vertical Variation */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4.5 border-b border-slate-100">
            <h3 className="text-base font-bold text-[#1351b8] tracking-tight">Vertical Variation</h3>
          </div>
          <div className="p-6">
            <div className="inline-flex flex-col rounded-xl shadow-xs overflow-hidden w-28" role="group">
              <button
                onClick={() => showToast('Vertical: Left', 'info')}
                className="px-4 py-2.5 text-xs sm:text-sm font-semibold bg-slate-200 hover:bg-slate-300 text-slate-700 border-b border-slate-300/80 cursor-pointer text-left"
              >
                Left
              </button>
              <button
                onClick={() => showToast('Vertical: Middle', 'info')}
                className="px-4 py-2.5 text-xs sm:text-sm font-semibold bg-slate-200 hover:bg-slate-300 text-slate-700 border-b border-slate-300/80 cursor-pointer text-left"
              >
                Middle
              </button>
              <button
                onClick={() => showToast('Vertical: Right', 'info')}
                className="px-4 py-2.5 text-xs sm:text-sm font-semibold bg-slate-200 hover:bg-slate-300 text-slate-700 border-b border-slate-300/80 cursor-pointer text-left"
              >
                Right
              </button>
              <button
                onClick={() => showToast('Vertical: Justify', 'info')}
                className="px-4 py-2.5 text-xs sm:text-sm font-semibold bg-slate-200 hover:bg-slate-300 text-slate-700 cursor-pointer text-left"
              >
                Justify
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dedicated Cards Showcase matching ShizueFI & Stisla with Modern Gradients & Interactive Features
function CardsView() {
  // State for Section 3: Button Group & Dropdown
  const [activeTabButtonGroup, setActiveTabButtonGroup] = useState<'Home' | 'Profile' | 'Setting'>('Home');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // State for Section 4: Functionality Cards
  const [isCardCollapsed, setIsCardCollapsed] = useState(false);
  const [isCardDismissed, setIsCardDismissed] = useState(false);
  const [isPictureModalOpen, setIsPictureModalOpen] = useState(false);
  const [isLoginProgress, setIsLoginProgress] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // State for Section 5: Sortable Cards
  const initialSortableCards = [
    { id: 'primary', label: '.card-primary', title: 'Card Header', border: 'border-t-[#1351b8]', titleColor: 'text-[#1351b8]' },
    { id: 'secondary', label: '.card-secondary', title: 'Card Header', border: 'border-t-slate-400', titleColor: 'text-slate-600' },
    { id: 'danger', label: '.card-danger', title: 'Card Header', border: 'border-t-rose-500', titleColor: 'text-rose-600' },
    { id: 'warning', label: '.card-warning', title: 'Card Header', border: 'border-t-amber-500', titleColor: 'text-amber-600' },
  ];
  const [sortableCards, setSortableCards] = useState(initialSortableCards);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const cardVariants = [
    { name: '.card-primary', border: 'border-t-[#1351b8]', titleColor: 'text-[#1351b8]' },
    { name: '.card-secondary', border: 'border-t-slate-400', titleColor: 'text-slate-600' },
    { name: '.card-danger', border: 'border-t-rose-500', titleColor: 'text-rose-600' },
    { name: '.card-warning', border: 'border-t-amber-500', titleColor: 'text-amber-600' },
    { name: '.card-info', border: 'border-t-sky-500', titleColor: 'text-sky-600' },
    { name: '.card-success', border: 'border-t-emerald-500', titleColor: 'text-emerald-600' },
    { name: '.card-light', border: 'border-t-slate-200', titleColor: 'text-slate-700' },
    { name: '.card-dark', border: 'border-t-slate-800', titleColor: 'text-slate-900' },
  ];

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;
    const updated = [...sortableCards];
    const [moved] = updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, moved);
    setSortableCards(updated);
    setDraggedIndex(null);
    showToast('Posisi card berhasil ditukar!', 'info');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoginProgress(true);
    // Simulates Stisla / ShizueFI $.cardProgress()
    setTimeout(() => {
      setIsLoginProgress(false);
      showToast('Login berhasil! Progress mode selesai.', 'success');
    }, 2200);
  };

  return (
    <div className="space-y-10">
      {/* ======================================================== */}
      {/* SECTION 1: CARDS */}
      {/* ======================================================== */}
      <div className="space-y-4">
        {/* Section Header with Blue Pill Accent */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-8 h-2.5 bg-[#1351b8] rounded-full inline-block" />
            <h2 className="text-base sm:text-lg font-bold text-slate-800">Cards</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Bootstrap’s cards provide a flexible and extensible content container with multiple variants and options.
          </p>
        </div>

        {/* 2-Column Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Column Left */}
          <div className="space-y-6">
            {/* Card 1: Card Title with Footer */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden flex flex-col justify-between">
              <div className="px-6 py-4.5 border-b border-slate-100">
                <h4 className="text-base font-bold text-[#1351b8]">Card Title</h4>
              </div>
              <div className="p-6">
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  This is some text within a card body.
                </p>
              </div>
              <div className="px-6 py-3.5 border-t border-slate-100 text-xs font-medium text-slate-500">
                Footer Card
              </div>
            </div>

            {/* Card 2: Card Action Button */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden flex flex-col justify-between">
              <div className="px-6 py-4.5 border-b border-slate-100">
                <h4 className="text-base font-bold text-[#1351b8]">Card Action Button</h4>
              </div>
              <div className="p-6">
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  This is some text within a card body.
                </p>
              </div>
              <div className="px-6 py-3.5 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => showToast('Form submitted successfully!', 'success')}
                  className="px-5 py-2 bg-[#1351b8] hover:bg-[#0f449e] text-white text-xs font-semibold rounded-lg transition-all shadow-xs active:scale-95 cursor-pointer"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>

          {/* Column Right */}
          <div className="space-y-6">
            {/* Card 3: Card Title with Links */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
              <div className="px-6 py-4.5 border-b border-slate-100">
                <h4 className="text-base font-bold text-[#1351b8]">Card Title</h4>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Some quick example text to build on the card title and make up the bulk of the card's content.
                </p>
                <div className="flex items-center gap-4 text-xs font-semibold text-[#1351b8] pt-1">
                  <a
                    href="#card-link"
                    onClick={(e) => {
                      e.preventDefault();
                      showToast('Clicked: Card link', 'info');
                    }}
                    className="inline-flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    Card link
                    <ExternalLink className="w-3 h-3 text-[#1351b8]" />
                  </a>
                  <a
                    href="#another-link"
                    onClick={(e) => {
                      e.preventDefault();
                      showToast('Clicked: Another link', 'info');
                    }}
                    className="inline-flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    Another link
                    <ExternalLink className="w-3 h-3 text-[#1351b8]" />
                  </a>
                </div>
              </div>
            </div>

            {/* Card 4: Footer bg-whitesmoke */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden flex flex-col justify-between">
              <div className="px-6 py-4.5 border-b border-slate-100">
                <h4 className="text-base font-bold text-[#1351b8]">
                  Footer <code className="text-xs px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono font-normal">bg-whitesmoke</code>
                </h4>
              </div>
              <div className="p-6">
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  This is some text within a card body.
                </p>
              </div>
              <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200/80 text-xs font-medium text-slate-600">
                Footer Card
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 2: CARD VARIANTS (8 Colors) */}
      {/* ======================================================== */}
      <div className="space-y-4">
        {/* Section Header with Blue Pill Accent */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-8 h-2.5 bg-[#1351b8] rounded-full inline-block" />
            <h2 className="text-base sm:text-lg font-bold text-slate-800">Card Variants</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Basically, the Bootstrap card can be given a color variant.
          </p>
        </div>

        {/* 4-Column Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cardVariants.map((variant, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-2xl border border-slate-100 shadow-xs border-t-4 ${variant.border} overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all duration-200`}
            >
              <div className="px-6 py-4.5 border-b border-slate-100/80">
                <h4 className={`text-sm sm:text-base font-bold ${variant.titleColor}`}>Card Header</h4>
              </div>
              <div className="p-6">
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  Card <code className="text-xs px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono font-normal">{variant.name}</code>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 3: CARD BUTTON & INPUT */}
      {/* ======================================================== */}
      <div className="space-y-4">
        {/* Section Header with Blue Pill Accent */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-8 h-2.5 bg-[#1351b8] rounded-full inline-block" />
            <h2 className="text-base sm:text-lg font-bold text-slate-800">Card Button &amp; Input</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Also, you can give a button or input on the card header.
          </p>
        </div>

        {/* 2-Column Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Column Left */}
          <div className="space-y-6">
            {/* 1. Card Header with Single Button */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
                <h4 className="text-base font-bold text-[#1351b8]">Card Header</h4>
                <div>
                  <button
                    type="button"
                    onClick={() => showToast('Action: View All triggered', 'info')}
                    className="px-4 py-1.5 bg-[#1351b8] hover:bg-[#0f449e] text-white text-xs font-semibold rounded-full shadow-xs active:scale-95 transition-all cursor-pointer"
                  >
                    View All
                  </button>
                </div>
              </div>
              <div className="p-6">
                <p className="text-xs sm:text-sm text-slate-600">Write something here</p>
              </div>
            </div>

            {/* 2. Button Group */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
                <h4 className="text-base font-bold text-[#1351b8]">Button Group</h4>
                <div>
                  <div className="inline-flex rounded-full bg-slate-100 p-0.5 border border-slate-200/80">
                    {(['Home', 'Profile', 'Setting'] as const).map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => {
                          setActiveTabButtonGroup(tab);
                          showToast(`Selected tab: ${tab}`, 'info');
                        }}
                        className={`px-3.5 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                          activeTabButtonGroup === tab
                            ? 'bg-[#1351b8] text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-xs sm:text-sm text-slate-600">Write something here</p>
              </div>
            </div>

            {/* 3. Input Text */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
                <h4 className="text-base font-bold text-emerald-600">Input Text</h4>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-40 sm:w-56 px-4 py-1.5 text-xs rounded-full border border-slate-200/90 text-slate-700 placeholder:text-slate-400 focus:outline-hidden focus:border-[#1351b8] focus:ring-2 focus:ring-[#1351b8]/15 transition-all"
                  />
                </div>
              </div>
              <div className="p-6">
                <p className="text-xs sm:text-sm text-slate-600">Write something here</p>
              </div>
            </div>
          </div>

          {/* Column Right */}
          <div className="space-y-6">
            {/* 4. Card Header with Two Buttons */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
                <h4 className="text-base font-bold text-slate-700">Card Header</h4>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => showToast('Action: View All triggered', 'info')}
                    className="px-4 py-1.5 bg-[#1351b8] hover:bg-[#0f449e] text-white text-xs font-semibold rounded-full shadow-xs active:scale-95 transition-all cursor-pointer"
                  >
                    View All
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast('Action: Delete All triggered', 'warning')}
                    className="px-4 py-1.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold rounded-full shadow-xs active:scale-95 transition-all cursor-pointer"
                  >
                    Delete All
                  </button>
                </div>
              </div>
              <div className="p-6">
                <p className="text-xs sm:text-sm text-slate-600">Write something here</p>
              </div>
            </div>

            {/* 5. Dropdown Button */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-visible relative">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
                <h4 className="text-base font-bold text-rose-600">Dropdown Button</h4>
                <div className="flex items-center gap-2 relative">
                  <button
                    type="button"
                    onClick={() => showToast('Action: View All triggered', 'info')}
                    className="px-4 py-1.5 bg-[#1351b8] hover:bg-[#0f449e] text-white text-xs font-semibold rounded-full shadow-xs active:scale-95 transition-all cursor-pointer"
                  >
                    View All
                  </button>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-full shadow-xs active:scale-95 transition-all inline-flex items-center gap-1 cursor-pointer"
                    >
                      Options
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>

                    {/* Interactive Dropdown Menu */}
                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-150">
                        <button
                          type="button"
                          onClick={() => {
                            showToast('View detail option selected', 'info');
                            setIsDropdownOpen(false);
                          }}
                          className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-500" />
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            showToast('Edit item option selected', 'info');
                            setIsDropdownOpen(false);
                          }}
                          className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                          Edit
                        </button>
                        <div className="my-1 border-t border-slate-100" />
                        <button
                          type="button"
                          onClick={() => {
                            showToast('Delete option selected', 'warning');
                            setIsDropdownOpen(false);
                          }}
                          className="w-full text-left px-3.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-xs sm:text-sm text-slate-600">Write something here</p>
              </div>
            </div>

            {/* 6. Input Button */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
                <h4 className="text-base font-bold text-amber-600">Input Button</h4>
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-36 sm:w-48 px-3.5 py-1.5 text-xs rounded-l-full border border-r-0 border-slate-200/90 text-slate-700 placeholder:text-slate-400 focus:outline-hidden focus:border-[#1351b8] focus:ring-1 focus:ring-[#1351b8]/15 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => showToast('Search query executed', 'info')}
                    className="px-3 py-1.5 bg-[#1351b8] hover:bg-[#0f449e] text-white rounded-r-full flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    <Search className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <p className="text-xs sm:text-sm text-slate-600">Write something here</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 4: FUNCTIONALITY CARD */}
      {/* ======================================================== */}
      <div className="space-y-4">
        {/* Section Header with Blue Pill Accent */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-8 h-2.5 bg-[#1351b8] rounded-full inline-block" />
            <h2 className="text-base sm:text-lg font-bold text-slate-800">Functionality Card</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            You can provide functionality on the card.
          </p>
        </div>

        {/* 2-Column Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Column Left: Show/Hide & My Picture */}
          <div className="space-y-6">
            {/* 1. Show/Hide (Collapse) */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden transition-all duration-300">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
                <h4 className="text-base font-bold text-slate-800">Show/Hide</h4>
                <div>
                  <button
                    type="button"
                    onClick={() => setIsCardCollapsed(!isCardCollapsed)}
                    aria-label={isCardCollapsed ? 'Expand Card' : 'Collapse Card'}
                    className="w-7 h-7 rounded-full bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center shadow-xs active:scale-90 transition-all cursor-pointer"
                  >
                    {isCardCollapsed ? <Plus className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Animated Collapsible Body & Footer */}
              {!isCardCollapsed && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-6">
                    <p className="text-xs sm:text-sm text-slate-600">
                      You can show or hide this card.
                    </p>
                  </div>
                  <div className="px-6 py-3.5 border-t border-slate-100 text-xs font-medium text-slate-500">
                    Card Footer
                  </div>
                </div>
              )}
            </div>

            {/* 2. My Picture Card with Interactive Preview Modal */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
                <h4 className="text-base font-bold text-slate-800">My Picture</h4>
                <div>
                  <button
                    type="button"
                    onClick={() => setIsPictureModalOpen(true)}
                    className="px-4 py-1.5 bg-[#1351b8] hover:bg-[#0f449e] text-white text-xs font-semibold rounded-full shadow-xs active:scale-95 transition-all cursor-pointer"
                  >
                    View All
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-xs sm:text-sm text-slate-500">
                  Click the picture below to see the magic!
                </p>

                {/* Picture Container with Interactive Hover & Zoom Trigger */}
                <div
                  onClick={() => setIsPictureModalOpen(true)}
                  className="relative group rounded-xl overflow-hidden border border-slate-200/90 bg-gradient-to-br from-indigo-50/70 via-sky-50/60 to-purple-50/70 aspect-[16/9] flex items-center justify-center cursor-pointer shadow-xs hover:shadow-md transition-all duration-300"
                >
                  {/* Decorative Illustration graphic */}
                  <div className="flex flex-col items-center justify-center text-center p-6 space-y-2.5">
                    <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-indigo-100 flex items-center justify-center text-[#1351b8] group-hover:scale-110 transition-transform duration-300">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700 group-hover:text-[#1351b8] transition-colors">
                        Velora Design System Showcase
                      </p>
                      <p className="text-xs text-slate-400">Click to preview in Lightbox</p>
                    </div>
                  </div>

                  {/* Hover Overlay with Zoom Icon */}
                  <div className="absolute inset-0 bg-[#1351b8]/60 backdrop-blur-2xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center text-white gap-2 font-semibold text-xs">
                    <Maximize2 className="w-4 h-4" />
                    <span>Lihat Ukuran Penuh</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column Right: Dismiss Card & Sample Login Card */}
          <div className="space-y-6">
            {/* 3. Dismiss Card */}
            {!isCardDismissed ? (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden transition-all duration-300">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
                  <h4 className="text-base font-bold text-slate-800">Dismiss</h4>
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCardDismissed(true);
                        showToast('Card berhasil di-dismiss!', 'warning');
                      }}
                      aria-label="Dismiss Card"
                      className="w-7 h-7 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-xs active:scale-90 transition-all cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-xs sm:text-sm text-slate-600">
                    You can dimiss this card.
                  </p>
                </div>
                <div className="px-6 py-3.5 border-t border-slate-100 text-xs font-medium text-slate-500">
                  Card Footer
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-6 text-center space-y-3">
                <p className="text-xs sm:text-sm text-slate-500">
                  Card telah di-dismiss (disembunyikan).
                </p>
                <button
                  type="button"
                  onClick={() => setIsCardDismissed(false)}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-full shadow-xs active:scale-95 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#1351b8]" />
                  Kembalikan Card
                </button>
              </div>
            )}

            {/* 4. Login Card with Progress Mode Overlay */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden relative">
              {/* Progress Mode Overlay matching Stisla $.cardProgress */}
              {isLoginProgress && (
                <div className="absolute inset-0 bg-white/92 backdrop-blur-2xs z-20 flex flex-col items-center justify-center p-6 space-y-3 animate-in fade-in duration-200">
                  <Loader2 className="w-9 h-9 text-[#1351b8] animate-spin" />
                  <p className="text-xs sm:text-sm font-semibold text-slate-700">
                    Mengautentikasi pengguna...
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsLoginProgress(false);
                      showToast('Login progress dibatalkan', 'info');
                    }}
                    className="px-3.5 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-full transition-colors cursor-pointer"
                  >
                    Batal (Dismiss)
                  </button>
                </div>
              )}

              <form onSubmit={handleLoginSubmit}>
                <div className="px-6 py-4.5 border-b border-slate-100">
                  <h4 className="text-base font-bold text-slate-800">Login</h4>
                </div>
                <div className="p-6 space-y-4">
                  <p className="text-xs text-slate-500">
                    Click login to change the card to progress mode.
                  </p>

                  {/* Username (Email) input group */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700">Username</label>
                    <div className="flex rounded-lg border border-slate-200/90 overflow-hidden focus-within:border-[#1351b8] focus-within:ring-2 focus-within:ring-[#1351b8]/15 transition-all">
                      <div className="px-3 py-2 bg-slate-50 border-r border-slate-200/80 flex items-center justify-center text-slate-500">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="Email"
                        className="flex-1 px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Password input group */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700">Password</label>
                    <div className="flex rounded-lg border border-slate-200/90 overflow-hidden focus-within:border-[#1351b8] focus-within:ring-2 focus-within:ring-[#1351b8]/15 transition-all">
                      <div className="px-3 py-2 bg-slate-50 border-r border-slate-200/80 flex items-center justify-center text-slate-500">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Password"
                        className="flex-1 px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Remember Me Checkbox */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="remember-me"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-[#1351b8] rounded-sm border-slate-300 focus:ring-[#1351b8]/20 cursor-pointer"
                    />
                    <label htmlFor="remember-me" className="text-xs text-slate-600 cursor-pointer select-none">
                      Remember Me
                    </label>
                  </div>
                </div>

                {/* Form Footer */}
                <div className="px-6 py-4 bg-slate-50/60 border-t border-slate-100 flex items-center gap-3">
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#1351b8] hover:bg-[#0f449e] text-white text-xs font-semibold rounded-lg shadow-xs active:scale-95 transition-all cursor-pointer"
                  >
                    Login
                  </button>
                  <a
                    href="#register"
                    onClick={(e) => {
                      e.preventDefault();
                      showToast('Navigasi ke pembuatan akun baru', 'info');
                    }}
                    className="text-xs font-medium text-[#1351b8] hover:underline"
                  >
                    Create new Account?
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 5: SORTABLE CARD (Interactive Drag & Drop) */}
      {/* ======================================================== */}
      <div className="space-y-4">
        {/* Section Header with Blue Pill Accent & Reset Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-8 h-2.5 bg-[#1351b8] rounded-full inline-block" />
              <h2 className="text-base sm:text-lg font-bold text-slate-800">Sortable Card</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Other cool cards, this one can be sorted. Geser (drag &amp; drop) untuk menukar urutan posisi card.
            </p>
          </div>
          <div>
            <button
              type="button"
              onClick={() => {
                setSortableCards(initialSortableCards);
                showToast('Urutan card dikembalikan ke default!', 'info');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200/90 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              Reset Urutan
            </button>
          </div>
        </div>

        {/* 4-Column Responsive Grid with HTML5 Drag & Drop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sortableCards.map((card, idx) => (
            <div
              key={card.id}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, idx)}
              className={`bg-white rounded-2xl border border-slate-100 shadow-xs border-t-4 ${card.border} overflow-hidden cursor-grab active:cursor-grabbing hover:-translate-y-1 hover:shadow-md transition-all duration-200 select-none ${
                draggedIndex === idx ? 'opacity-40 scale-95 border-dashed border-[#1351b8]' : ''
              }`}
            >
              <div className="px-5 py-4 border-b border-slate-100/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <h4 className={`text-sm sm:text-base font-bold ${card.titleColor}`}>{card.title}</h4>
                </div>
                <span title="Tahan dan geser untuk menukar posisi" className="text-slate-400 hover:text-slate-600 p-1">
                  <GripVertical className="w-4 h-4" />
                </span>
              </div>
              <div className="p-5">
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  Card <code className="text-xs px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono font-normal">{card.label}</code>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* Lightbox Modal for "My Picture" */}
      {/* ======================================================== */}
      {isPictureModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm sm:text-base font-bold text-slate-800">Magic Picture Preview</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPictureModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="rounded-xl overflow-hidden aspect-[16/10] bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 flex flex-col items-center justify-center text-white p-6 shadow-inner relative">
                <ImageIcon className="w-16 h-16 opacity-90 mb-3" />
                <h4 className="text-lg font-bold">Velora UI Design Suite</h4>
                <p className="text-xs text-blue-100 text-center max-w-xs mt-1">
                  Komponen antarmuka modern terintegrasi dengan gradien elegan dan standar clean executive design.
                </p>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Ini adalah simulasi fitur Chocolat lightbox image modal dari template Stisla / ShizueFI yang telah ditingkatkan menjadi komponen React modal interaktif.
              </p>
            </div>
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setIsPictureModalOpen(false)}
                className="px-4 py-2 bg-[#1351b8] hover:bg-[#0f449e] text-white text-xs font-semibold rounded-lg transition-all cursor-pointer shadow-xs"
              >
                Tutup Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DashboardView() {
  const { data, isLoading } = useDashboardData();

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[350px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#1351b8] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Memuat data Velora UI...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Banner / Welcome Callout */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#0c2869] via-[#103a94] to-[#164ebd] rounded-2xl p-6 text-white shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/15 text-amber-300 backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5" />
              Sistem CBT & LMS Terintegrasi
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Selamat Datang di Portal Admin Velora UI
            </h2>
            <p className="text-xs sm:text-sm text-blue-100/90 font-normal leading-relaxed">
              Pantau jalannya ujian berbasis komputer, bank soal pilihan ganda, dan rekapitulasi nilai
              secara real-time melalui panel navigasi terpadu.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-shrink-0">
            <button
              onClick={() => showToast('Semua layanan CBT & LMS siap digunakan!', 'success')}
              className="px-4 py-2 bg-white text-[#0c2869] font-bold text-xs rounded-xl shadow-xs hover:bg-blue-50 transition-all focus:outline-none"
            >
              Cek Status Server
            </button>
            <button
              onClick={() =>
                showSuccess(
                  'Panduan Singkat',
                  'Gunakan menu sidebar sebelah kiri untuk navigasi ke Bank Soal, Jadwal Ujian, atau Monitoring Hasil.'
                )
              }
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium text-xs rounded-xl transition-all border border-white/20"
            >
              Panduan Singkat
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Metric Stat Cards */}
      <StatCards stats={data.stats} />

      {/* Main Monitoring Table */}
      <RecentExamsTable exams={data.recentExams} />
    </div>
  );
}

function BlankPageView() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-12 shadow-xs min-h-[420px] flex flex-col justify-center items-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#1351b8] flex items-center justify-center mb-4 shadow-inner">
        <FileCode2 className="w-8 h-8" strokeWidth={2} />
      </div>
      <h3 className="text-lg font-bold text-slate-800">Halaman Kosong Siap Pakai</h3>
      <p className="text-sm text-slate-500 max-w-md mx-auto mt-2 mb-6 leading-relaxed">
        Template blank page ini siap Anda gunakan sebagai kanvas untuk membuat form input baru, tabel data, ataupun halaman statistik CBT kustom.
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={() => showToast('Memulai komponen baru di Blank Page...', 'success')}
          className="px-5 py-2.5 bg-[#1351b8] hover:bg-[#0f449e] text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
        >
          Mulai Tambah Komponen
        </button>
      </div>
    </div>
  );
}

// Dedicated Kelas & Rombel View
function KelasView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTingkat, setSelectedTingkat] = useState('Semua');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const classes = [
    { id: 1, kode: 'X-RPL-1', nama: 'Sepuluh RPL 1', tingkat: 'X', jurusan: 'Rekayasa Perangkat Lunak', wali: 'Budi Santoso, S.Kom', siswa: 36, status: 'Siap Ujian' },
    { id: 2, kode: 'X-RPL-2', nama: 'Sepuluh RPL 2', tingkat: 'X', jurusan: 'Rekayasa Perangkat Lunak', wali: 'Agus Setiawan, S.Kom', siswa: 36, status: 'Siap Ujian' },
    { id: 3, kode: 'X-TKJ-1', nama: 'Sepuluh TKJ 1', tingkat: 'X', jurusan: 'Teknik Komputer Jaringan', wali: 'Rina Astuti, S.Pd', siswa: 35, status: 'Siap Ujian' },
    { id: 4, kode: 'X-TKJ-2', nama: 'Sepuluh TKJ 2', tingkat: 'X', jurusan: 'Teknik Komputer Jaringan', wali: 'Eko Prasetyo, S.T', siswa: 35, status: 'Siap Ujian' },
    { id: 5, kode: 'X-DKV-1', nama: 'Sepuluh DKV 1', tingkat: 'X', jurusan: 'Desain Komunikasi Visual', wali: 'Maya Indah, S.Ds', siswa: 34, status: 'Siap Ujian' },
    { id: 6, kode: 'X-AKL-1', nama: 'Sepuluh AKL 1', tingkat: 'X', jurusan: 'Akuntansi Keuangan', wali: 'Sri Wahyuni, S.E', siswa: 36, status: 'Siap Ujian' },
    { id: 7, kode: 'XI-MIPA-1', nama: 'Sebelas MIPA 1', tingkat: 'XI', jurusan: 'MIPA Unggulan', wali: 'Ahmad Fauzi, M.Pd', siswa: 34, status: 'Sesi Aktif' },
    { id: 8, kode: 'XI-MIPA-2', nama: 'Sebelas MIPA 2', tingkat: 'XI', jurusan: 'MIPA Reguler', wali: 'Nurul Hidayati, M.Si', siswa: 35, status: 'Sesi Aktif' },
    { id: 9, kode: 'XI-IPS-1', nama: 'Sebelas IPS 1', tingkat: 'XI', jurusan: 'Ilmu Pengetahuan Sosial', wali: 'Siti Rahma, S.Pd', siswa: 32, status: 'Siap Ujian' },
    { id: 10, kode: 'XI-IPS-2', nama: 'Sebelas IPS 2', tingkat: 'XI', jurusan: 'Ilmu Pengetahuan Sosial', wali: 'Bambang Irawan, M.Pd', siswa: 33, status: 'Siap Ujian' },
    { id: 11, kode: 'XI-RPL-1', nama: 'Sebelas RPL 1', tingkat: 'XI', jurusan: 'Rekayasa Perangkat Lunak', wali: 'Fahmi Nugroho, S.Kom', siswa: 36, status: 'Siap Ujian' },
    { id: 12, kode: 'XI-TKJ-1', nama: 'Sebelas TKJ 1', tingkat: 'XI', jurusan: 'Teknik Komputer Jaringan', wali: 'Aris Munandar, S.T', siswa: 34, status: 'Siap Ujian' },
    { id: 13, kode: 'XII-MIPA-1', nama: 'Duabelas MIPA 1', tingkat: 'XII', jurusan: 'MIPA 1', wali: 'Dian Permata, S.Si', siswa: 36, status: 'Selesai' },
    { id: 14, kode: 'XII-MIPA-2', nama: 'Duabelas MIPA 2', tingkat: 'XII', jurusan: 'MIPA 2', wali: 'Drs. Hendro Wibowo', siswa: 35, status: 'Selesai' },
    { id: 15, kode: 'XII-IPS-1', nama: 'Duabelas IPS 1', tingkat: 'XII', jurusan: 'IPS 1', wali: 'Yuni Astuti, M.Pd', siswa: 33, status: 'Selesai' },
    { id: 16, kode: 'XII-RPL-1', nama: 'Duabelas RPL 1', tingkat: 'XII', jurusan: 'Rekayasa Perangkat Lunak', wali: 'Hendra Gunawan, S.Kom', siswa: 35, status: 'Siap Ujian' },
    { id: 17, kode: 'XII-RPL-2', nama: 'Duabelas RPL 2', tingkat: 'XII', jurusan: 'Rekayasa Perangkat Lunak', wali: 'Dimas Pratama, M.Kom', siswa: 34, status: 'Siap Ujian' },
    { id: 18, kode: 'XII-TKJ-1', nama: 'Duabelas TKJ 1', tingkat: 'XII', jurusan: 'Teknik Komputer Jaringan', wali: 'Bayu Wicaksono, S.T', siswa: 36, status: 'Siap Ujian' },
  ];

  const filtered = classes.filter((c) => {
    const matchSearch =
      c.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.kode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.wali.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.jurusan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTingkat = selectedTingkat === 'Semua' || c.tingkat === selectedTingkat;
    return matchSearch && matchTingkat;
  });

  // Calculate paginated slice
  const paginatedClasses = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleFilterTingkat = (tingkat: string) => {
    setSelectedTingkat(tingkat);
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handleAddClass = () => {
    showToast('Formulir tambah kelas & rombel dibuka.', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-8 h-2.5 bg-[#1351b8] rounded-full inline-block" />
            <h2 className="text-base sm:text-lg font-bold text-slate-800">Data Kelas &amp; Rombel</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Kelola data rombongan belajar, alokasi wali kelas, dan pembagian peserta ujian CBT per tingkatan.
          </p>
        </div>
        <button
          onClick={handleAddClass}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1351b8] hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Tambah Rombel Baru
        </button>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Total Rombel</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{classes.length} Kelas</p>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">3 Tingkatan (X, XI, XII)</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1351b8] flex items-center justify-center font-bold">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Total Siswa Aktif</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">629 Siswa</p>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">100% Terdaftar CBT</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Rata-rata per Kelas</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">35 Siswa</p>
            <p className="text-[11px] text-slate-500 font-medium mt-1">Standar Kemdikbud</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Ruang CBT Siap</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">6 Laboratorium</p>
            <p className="text-[11px] text-blue-600 font-medium mt-1">Kapasitas 600 Klien</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Radio className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Table Filter Bar: Show Entries on Left, Search + Filters on Right */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Show Entries Dropdown */}
          <div className="flex items-center gap-3">
            <ShowEntriesSelector
              pageSize={pageSize}
              onPageSizeChange={handlePageSizeChange}
              options={[5, 10, 25, 50]}
            />
          </div>

          {/* Search Input & Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative w-full sm:w-64 md:w-72">
              <input
                type="text"
                placeholder="Cari kode, nama rombel, atau wali..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full bg-slate-50 text-slate-800 placeholder-slate-400 text-xs sm:text-sm pl-9 pr-4 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1351b8]"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2" />
            </div>

            {/* Tingkat Filter Buttons */}
            <div className="flex items-center gap-1">
              {['Semua', 'X', 'XI', 'XII'].map((t) => (
                <button
                  key={t}
                  onClick={() => handleFilterTingkat(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    selectedTingkat === t
                      ? 'bg-[#1351b8] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t === 'Semua' ? 'Semua' : `Kelas ${t}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200/80 text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">No</th>
                <th className="py-3 px-4">Kode Rombel</th>
                <th className="py-3 px-4">Nama Kelas</th>
                <th className="py-3 px-4">Tingkat</th>
                <th className="py-3 px-4">Jurusan / Konsentrasi</th>
                <th className="py-3 px-4">Wali Kelas</th>
                <th className="py-3 px-4 text-center">Jumlah Siswa</th>
                <th className="py-3 px-4 text-center">Status CBT</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paginatedClasses.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    Tidak ada rombel yang cocok dengan kriteria pencarian "{searchTerm}".
                  </td>
                </tr>
              ) : (
                paginatedClasses.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      {(currentPage - 1) * pageSize + idx + 1}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-[#1351b8]">
                      {item.kode}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">{item.nama}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-[11px] font-semibold">
                        Kelas {item.tingkat}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{item.jurusan}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">{item.wali}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2.5 py-1 bg-blue-50 text-[#1351b8] rounded-full text-xs font-semibold">
                        {item.siswa} Siswa
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          item.status === 'Sesi Aktif'
                            ? 'bg-blue-100 text-blue-800 animate-pulse'
                            : item.status === 'Selesai'
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => showToast(`Detail rombel: ${item.nama}`, 'info')}
                          className="p-1.5 text-slate-400 hover:text-[#1351b8] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Detail Kelas"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => showToast(`Edit kelas: ${item.nama}`, 'info')}
                          className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Rombel"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => showToast(`Hapus rombel: ${item.nama}`, 'warning')}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Rombel"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Dynamic Pagination Bar */}
        <TablePagination
          currentPage={currentPage}
          totalEntries={filtered.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  );
}

// Dedicated Mata Pelajaran View
function MataPelajaranView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKelompok, setSelectedKelompok] = useState('Semua');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const subjects = [
    { id: 1, kode: 'MTK-01', nama: 'Matematika Wajib', kelompok: 'Kelompok A (Wajib)', tingkat: 'X, XI, XII', koordinator: 'Budi Santoso, S.Kom', bankSoal: 320, status: 'Aktif' },
    { id: 2, kode: 'BIN-01', nama: 'Bahasa Indonesia', kelompok: 'Kelompok A (Wajib)', tingkat: 'X, XI, XII', koordinator: 'Siti Rahma, S.Pd', bankSoal: 280, status: 'Aktif' },
    { id: 3, kode: 'BIG-01', nama: 'Bahasa Inggris', kelompok: 'Kelompok A (Wajib)', tingkat: 'X, XI, XII', koordinator: 'Dian Permata, S.Si', bankSoal: 250, status: 'Aktif' },
    { id: 4, kode: 'FIS-02', nama: 'Fisika Peminatan', kelompok: 'Kelompok C (Peminatan)', tingkat: 'XI, XII', koordinator: 'Ahmad Fauzi, M.Pd', bankSoal: 190, status: 'Aktif' },
    { id: 5, kode: 'KIM-01', nama: 'Kimia Peminatan', kelompok: 'Kelompok C (Peminatan)', tingkat: 'XI, XII', koordinator: 'Nurul Hidayati, M.Si', bankSoal: 180, status: 'Aktif' },
    { id: 6, kode: 'BIO-01', nama: 'Biologi Peminatan', kelompok: 'Kelompok C (Peminatan)', tingkat: 'XI, XII', koordinator: 'Drs. Hendro Wibowo', bankSoal: 210, status: 'Aktif' },
    { id: 7, kode: 'SEJ-01', nama: 'Sejarah Indonesia', kelompok: 'Kelompok A (Wajib)', tingkat: 'X, XI, XII', koordinator: 'Yuni Astuti, M.Pd', bankSoal: 170, status: 'Aktif' },
    { id: 8, kode: 'EKO-01', nama: 'Ekonomi Peminatan', kelompok: 'Kelompok C (Peminatan)', tingkat: 'XI, XII', koordinator: 'Sri Wahyuni, S.E', bankSoal: 195, status: 'Aktif' },
    { id: 9, kode: 'GEO-01', nama: 'Geografi Peminatan', kelompok: 'Kelompok C (Peminatan)', tingkat: 'XI, XII', koordinator: 'Bambang Irawan, M.Pd', bankSoal: 160, status: 'Aktif' },
    { id: 10, kode: 'SOS-01', nama: 'Sosiologi Peminatan', kelompok: 'Kelompok C (Peminatan)', tingkat: 'XI, XII', koordinator: 'Maya Indah, S.Ds', bankSoal: 150, status: 'Aktif' },
    { id: 11, kode: 'RPL-03', nama: 'Pemrograman Web & Mobile', kelompok: 'Kejuruan RPL', tingkat: 'XI, XII', koordinator: 'Hendra Gunawan, S.Kom', bankSoal: 210, status: 'Aktif' },
    { id: 12, kode: 'RPL-04', nama: 'Basis Data Relasional', kelompok: 'Kejuruan RPL', tingkat: 'XI, XII', koordinator: 'Fahmi Nugroho, S.Kom', bankSoal: 185, status: 'Aktif' },
    { id: 13, kode: 'TKJ-02', nama: 'Administrasi Sistem Jaringan', kelompok: 'Kejuruan TKJ', tingkat: 'XI, XII', koordinator: 'Aris Munandar, S.T', bankSoal: 220, status: 'Aktif' },
    { id: 14, kode: 'TKJ-03', nama: 'Keamanan Jaringan & Cloud', kelompok: 'Kejuruan TKJ', tingkat: 'XII', koordinator: 'Bayu Wicaksono, S.T', bankSoal: 175, status: 'Aktif' },
    { id: 15, kode: 'PAI-01', nama: 'Pendidikan Agama & Budi Pekerti', kelompok: 'Kelompok A (Wajib)', tingkat: 'X, XI, XII', koordinator: 'Ust. Syarif Hidayat, M.Ag', bankSoal: 180, status: 'Aktif' },
    { id: 16, kode: 'PJK-01', nama: 'Pendidikan Jasmani & Olahraga', kelompok: 'Kelompok B (Umum)', tingkat: 'X, XI', koordinator: 'Dimas Pratama, S.Pd', bankSoal: 140, status: 'Aktif' },
  ];

  const filtered = subjects.filter((s) => {
    const matchSearch =
      s.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.kode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.koordinator.toLowerCase().includes(searchTerm.toLowerCase());
    const matchKelompok = selectedKelompok === 'Semua' || s.kelompok.includes(selectedKelompok);
    return matchSearch && matchKelompok;
  });

  const paginatedSubjects = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleFilterKelompok = (kelompok: string) => {
    setSelectedKelompok(kelompok);
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handleAddSubject = () => {
    showToast('Formulir tambah mata pelajaran dibuka.', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-8 h-2.5 bg-[#1351b8] rounded-full inline-block" />
            <h2 className="text-base sm:text-lg font-bold text-slate-800">Mata Pelajaran &amp; Kurikulum</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Daftar kurikulum mata pelajaran terintegrasi bank butir soal CBT dan silabus LMS.
          </p>
        </div>
        <button
          onClick={handleAddSubject}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1351b8] hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Tambah Mapel Baru
        </button>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Total Mata Pelajaran</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{subjects.length} Mapel</p>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">Kurikulum Merdeka &amp; K13</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1351b8] flex items-center justify-center font-bold">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Mapel Diujikan CBT</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">16 Mapel</p>
            <p className="text-[11px] text-blue-600 font-medium mt-1">Siap Pelaksanaan PTS/PAS</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Total Butir Bank Soal</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">3.045 Butir</p>
            <p className="text-[11px] text-amber-600 font-medium mt-1">PG &amp; Kompleks Terverifikasi</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Guru Koordinator</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">38 Pengampu</p>
            <p className="text-[11px] text-purple-600 font-medium mt-1">Hak Pembuat Soal Aktif</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Table Filter Bar: Show Entries on Left, Search + Filters on Right */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Show Entries Dropdown */}
          <div className="flex items-center gap-3">
            <ShowEntriesSelector
              pageSize={pageSize}
              onPageSizeChange={handlePageSizeChange}
              options={[5, 10, 25, 50]}
            />
          </div>

          {/* Search Input & Kelompok Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative w-full sm:w-64 md:w-72">
              <input
                type="text"
                placeholder="Cari kode mapel, nama, atau guru..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full bg-slate-50 text-slate-800 placeholder-slate-400 text-xs sm:text-sm pl-9 pr-4 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1351b8]"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2" />
            </div>

            {/* Kelompok Filter Buttons */}
            <div className="flex items-center gap-1 flex-wrap">
              {['Semua', 'Wajib', 'Peminatan', 'Kejuruan'].map((k) => (
                <button
                  key={k}
                  onClick={() => handleFilterKelompok(k)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    selectedKelompok === k
                      ? 'bg-[#1351b8] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {k === 'Semua' ? 'Semua' : k}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200/80 text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">No</th>
                <th className="py-3 px-4">Kode</th>
                <th className="py-3 px-4">Nama Mata Pelajaran</th>
                <th className="py-3 px-4">Kelompok</th>
                <th className="py-3 px-4">Alokasi Tingkat</th>
                <th className="py-3 px-4">Guru Koordinator</th>
                <th className="py-3 px-4 text-center">Bank Soal</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paginatedSubjects.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    Tidak ada mata pelajaran yang cocok dengan kriteria pencarian "{searchTerm}".
                  </td>
                </tr>
              ) : (
                paginatedSubjects.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      {(currentPage - 1) * pageSize + idx + 1}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-[#1351b8]">
                      {item.kode}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">{item.nama}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-[11px] font-semibold">
                        {item.kelompok}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{item.tingkat}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">{item.koordinator}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2.5 py-1 bg-blue-50 text-[#1351b8] rounded-full text-xs font-semibold">
                        {item.bankSoal} Butir
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => showToast(`Lihat bank butir: ${item.nama}`, 'info')}
                          className="p-1.5 text-slate-400 hover:text-[#1351b8] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Lihat Bank Soal"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => showToast(`Edit mata pelajaran: ${item.nama}`, 'info')}
                          className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Mapel"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => showToast(`Hapus mapel: ${item.nama}`, 'warning')}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Mapel"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Dynamic Pagination Bar */}
        <TablePagination
          currentPage={currentPage}
          totalEntries={filtered.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  );
}

function PlaceholderView({ title, icon: Icon, desc }: { title: string; icon: React.ElementType; desc: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center shadow-xs">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 text-[#1351b8] flex items-center justify-center mb-4 shadow-inner">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-slate-800">{title}</h3>
      <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-6 leading-relaxed">
        {desc}
      </p>
      <button
        onClick={() => showToast(`Modul ${title} siap dikonfigurasi.`, 'info')}
        className="px-4 py-2 bg-[#1351b8] hover:bg-[#0f449e] text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
      >
        Konfigurasi Modul Ini
      </button>
    </div>
  );
}

// Helper to get initial active menu from URL hash (e.g. #/alert) or localStorage
const getInitialMenu = (): string => {
  if (typeof window !== 'undefined') {
    const hash = window.location.hash.replace(/^#\/?/, '').trim();
    if (hash) {
      return hash;
    }
    try {
      const saved = localStorage.getItem('velora_active_menu');
      if (saved) return saved;
    } catch {}
  }
  return 'general-dashboard';
};

export function App() {
  const [activeMenu, setActiveMenu] = useState<string>(getInitialMenu);

  const handleSelectMenu = (id: string) => {
    setActiveMenu(id);
    if (typeof window !== 'undefined') {
      window.location.hash = `#/${id}`;
      try {
        localStorage.setItem('velora_active_menu', id);
      } catch {}
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '').trim();
      if (hash && hash !== activeMenu) {
        setActiveMenu(hash);
        try {
          localStorage.setItem('velora_active_menu', hash);
        } catch {}
      }
    };

    window.addEventListener('hashchange', handleHashChange);

    // Initial sync of URL hash
    if (typeof window !== 'undefined') {
      const currentHash = window.location.hash.replace(/^#\/?/, '').trim();
      if (!currentHash) {
        window.history.replaceState(null, '', `#/${activeMenu}`);
      }
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [activeMenu]);

  const pageMeta: Record<string, { title: string; breadcrumbs: string[] }> = {
    'general-dashboard': {
      title: 'General Dashboard',
      breadcrumbs: ['Velora UI', 'Dashboard', 'General Dashboard'],
    },
    'ecommerce-dashboard': {
      title: 'Ecommerce Dashboard',
      breadcrumbs: ['Velora UI', 'Dashboard', 'Ecommerce Dashboard'],
    },
    dashboard: {
      title: 'General Dashboard',
      breadcrumbs: ['Velora UI', 'Dashboard'],
    },
    'blank-page': {
      title: 'Blank Page',
      breadcrumbs: ['Velora UI', 'Starter', 'Blank Page'],
    },
    alert: {
      title: 'Alert Showcase',
      breadcrumbs: ['Velora UI', 'Bootstrap', 'Alert'],
    },
    badge: {
      title: 'Badge Showcase',
      breadcrumbs: ['Velora UI', 'Bootstrap', 'Badge'],
    },
    breadcrumb: {
      title: 'Breadcrumb Showcase',
      breadcrumbs: ['Velora UI', 'Bootstrap', 'Breadcrumb'],
    },
    buttons: {
      title: 'Buttons Showcase',
      breadcrumbs: ['Velora UI', 'Bootstrap', 'Buttons'],
    },
    card: {
      title: 'Card',
      breadcrumbs: ['Dashboard', 'Bootstrap Components', 'Card'],
    },
    form: {
      title: 'Form Elements',
      breadcrumbs: ['Velora UI', 'Bootstrap', 'Form'],
    },
    modal: {
      title: 'Modal & Dialog',
      breadcrumbs: ['Velora UI', 'Bootstrap', 'Modal'],
    },
    pagination: {
      title: 'Pagination & Data Table',
      breadcrumbs: ['Velora UI', 'Bootstrap', 'Pagination'],
    },
    table: {
      title: 'Data Table Showcase',
      breadcrumbs: ['Velora UI', 'Bootstrap', 'Table'],
    },
    datatables: {
      title: 'DataTables Module',
      breadcrumbs: ['Velora UI', 'Modules', 'DataTables'],
    },
    credits: {
      title: 'Credits & Attribution',
      breadcrumbs: ['Velora UI', 'Credits'],
    },
  };

  const formatSlug = (slug: string) =>
    slug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

  const currentMeta = pageMeta[activeMenu] || {
    title: formatSlug(activeMenu),
    breadcrumbs: ['Velora UI', 'Pages', formatSlug(activeMenu)],
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'general-dashboard':
      case 'ecommerce-dashboard':
      case 'dashboard':
        return <DashboardView />;
      case 'pagination':
      case 'table':
      case 'datatables':
      case 'components-table':
        return <KelasView />;
      case 'advanced-form':
      case 'forms':
        return <MataPelajaranView />;
      case 'card':
        return <CardsView />;
      case 'alert':
        return <AlertView />;
      case 'badge':
        return <BadgeView />;
      case 'breadcrumb':
        return <BreadcrumbView />;
      case 'buttons':
        return <ButtonsView />;
      case 'blank-page':
        return <BlankPageView />;
      case 'credits':
        return (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-sm max-w-3xl space-y-4">
            <h3 className="text-xl font-bold text-slate-800">Credits & Attribution</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Velora UI is built with love, inspired by the legendary Stisla admin dashboard theme and modernized using React 19, Tailwind CSS v4, Vite, and Lucide React.
            </p>
            <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-4 text-xs font-medium text-slate-500">
              <span>Author: <b>Fahmi Ibrahim</b></span>
              <span>•</span>
              <span>License: <b>MIT License</b></span>
              <span>•</span>
              <a href="https://github.com/fahmiibrahimdevs/velora-ui" target="_blank" rel="noreferrer" className="text-[#1351b8] hover:underline font-semibold">GitHub Repository</a>
            </div>
          </div>
        );
      default:
        return (
          <PlaceholderView
            title={currentMeta.title}
            icon={CheckCircle2}
            desc="Halaman modul siap untuk pengembangan fitur selanjutnya."
          />
        );
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AdminLayout
        activeMenu={activeMenu}
        onSelectMenu={handleSelectMenu}
        pageTitle={currentMeta.title}
        breadcrumbs={currentMeta.breadcrumbs}
      >
        {renderContent()}
      </AdminLayout>
    </QueryClientProvider>
  );
}

export default App;
