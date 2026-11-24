import React, { useState, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { AdminLayout } from './components/layout/AdminLayout';
import { StatCards } from './components/dashboard/StatCards';
import { RecentExamsTable } from './components/dashboard/RecentExamsTable';
import { useDashboardData } from './hooks/useDashboardData';
import { showToast, showSuccess } from './lib/swal';
import {
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
  ChevronLeft,
  Loader2,
  Check,
  Star,
  AlertTriangle,
  Info,
  User,
  X,
  Minus,
  ChevronDown,
  ChevronUp,
  Heart,
  Clock,
  Mail,
  Lock,
  GripVertical,
  Image as ImageIcon,
  ExternalLink,
  Maximize2,
  Settings,
  Download,
  Filter,
  ArrowUpRight,
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
          <span className="w-8 h-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full inline-block" />
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
                    className="inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white shadow-xs active:scale-95 transition-all cursor-pointer"
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
          <span className="w-8 h-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full inline-block" />
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
          <span className="w-8 h-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full inline-block" />
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
          <span className="w-8 h-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full inline-block" />
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
                className="px-4 py-2 text-xs sm:text-sm font-semibold bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-700 border-r border-slate-300/80 cursor-pointer transition-all"
              >
                Left
              </button>
              <button
                onClick={() => showToast('Middle clicked', 'info')}
                className="px-4 py-2 text-xs sm:text-sm font-semibold bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-700 border-r border-slate-300/80 cursor-pointer transition-all"
              >
                Middle
              </button>
              <button
                onClick={() => showToast('Right clicked', 'info')}
                className="px-4 py-2 text-xs sm:text-sm font-semibold bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-700 cursor-pointer transition-all"
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
                className="px-4 py-2.5 text-xs sm:text-sm font-semibold bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-700 border-b border-slate-300/80 cursor-pointer text-left transition-all"
              >
                Left
              </button>
              <button
                onClick={() => showToast('Vertical: Middle', 'info')}
                className="px-4 py-2.5 text-xs sm:text-sm font-semibold bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-700 border-b border-slate-300/80 cursor-pointer text-left transition-all"
              >
                Middle
              </button>
              <button
                onClick={() => showToast('Vertical: Right', 'info')}
                className="px-4 py-2.5 text-xs sm:text-sm font-semibold bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-700 border-b border-slate-300/80 cursor-pointer text-left transition-all"
              >
                Right
              </button>
              <button
                onClick={() => showToast('Vertical: Justify', 'info')}
                className="px-4 py-2.5 text-xs sm:text-sm font-semibold bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-700 cursor-pointer text-left transition-all"
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
    { id: 'primary', label: '.card-primary', title: 'Card Header', gradient: 'from-[#175cd3] to-[#0f3ba0]', titleColor: 'text-[#1351b8]' },
    { id: 'secondary', label: '.card-secondary', title: 'Card Header', gradient: 'from-[#64748b] to-[#475569]', titleColor: 'text-slate-600' },
    { id: 'danger', label: '.card-danger', title: 'Card Header', gradient: 'from-[#ef4444] to-[#b91c1c]', titleColor: 'text-rose-600' },
    { id: 'warning', label: '.card-warning', title: 'Card Header', gradient: 'from-[#f59e0b] to-[#d97706]', titleColor: 'text-amber-600' },
  ];
  const [sortableCards, setSortableCards] = useState(initialSortableCards);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const cardVariants = [
    { name: '.card-primary', gradient: 'from-[#175cd3] to-[#0f3ba0]', titleColor: 'text-[#1351b8]' },
    { name: '.card-secondary', gradient: 'from-[#64748b] to-[#475569]', titleColor: 'text-slate-600' },
    { name: '.card-danger', gradient: 'from-[#ef4444] to-[#b91c1c]', titleColor: 'text-rose-600' },
    { name: '.card-warning', gradient: 'from-[#f59e0b] to-[#d97706]', titleColor: 'text-amber-600' },
    { name: '.card-info', gradient: 'from-[#0ea5e9] to-[#0284c7]', titleColor: 'text-sky-600' },
    { name: '.card-success', gradient: 'from-[#22c55e] to-[#15803d]', titleColor: 'text-emerald-600' },
    { name: '.card-light', gradient: 'from-slate-200 to-slate-300', titleColor: 'text-slate-700' },
    { name: '.card-dark', gradient: 'from-[#1e293b] to-[#020617]', titleColor: 'text-slate-900' },
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
            <span className="w-8 h-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full inline-block" />
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
                  className="px-5 py-2 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white text-xs font-semibold rounded-lg transition-all shadow-xs active:scale-95 cursor-pointer"
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
            <span className="w-8 h-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full inline-block" />
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
              className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Thin gradient accent line at top of card */}
                <div className={`h-1 w-full bg-gradient-to-r ${variant.gradient}`} />
                <div className="px-6 py-4.5 border-b border-slate-100/80">
                  <h4 className={`text-sm sm:text-base font-bold ${variant.titleColor}`}>Card Header</h4>
                </div>
                <div className="p-6">
                  <p className="text-xs sm:text-sm text-slate-600 font-medium">
                    Card <code className="text-xs px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono font-normal">{variant.name}</code>
                  </p>
                </div>
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
            <span className="w-8 h-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full inline-block" />
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
                    className="px-4 py-1.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white text-xs font-semibold rounded-full shadow-xs active:scale-95 transition-all cursor-pointer"
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
                            ? 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white shadow-xs'
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
                    className="px-4 py-1.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white text-xs font-semibold rounded-full shadow-xs active:scale-95 transition-all cursor-pointer"
                  >
                    View All
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast('Action: Delete All triggered', 'warning')}
                    className="px-4 py-1.5 bg-gradient-to-r from-[#ef4444] to-[#b91c1c] hover:from-[#dc2626] hover:to-[#991b1b] text-white text-xs font-semibold rounded-full shadow-xs active:scale-95 transition-all cursor-pointer"
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
                    className="px-4 py-1.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white text-xs font-semibold rounded-full shadow-xs active:scale-95 transition-all cursor-pointer"
                  >
                    View All
                  </button>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="px-3.5 py-1.5 bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:from-[#ea580c] hover:to-[#b45309] text-white text-xs font-semibold rounded-full shadow-xs active:scale-95 transition-all inline-flex items-center gap-1 cursor-pointer"
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
                    className="px-3 py-1.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white rounded-r-full flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
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
            <span className="w-8 h-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full inline-block" />
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
                    className="w-7 h-7 rounded-full bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] hover:from-[#0284c7] hover:to-[#0369a1] text-white flex items-center justify-center shadow-xs active:scale-90 transition-all cursor-pointer"
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
                    className="px-4 py-1.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white text-xs font-semibold rounded-full shadow-xs active:scale-95 transition-all cursor-pointer"
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
                    className="px-5 py-2 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white text-xs font-semibold rounded-lg shadow-xs active:scale-95 transition-all cursor-pointer"
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
              <span className="w-8 h-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full inline-block" />
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
              className={`bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden cursor-grab active:cursor-grabbing hover:-translate-y-1 hover:shadow-md transition-all duration-200 select-none ${
                draggedIndex === idx ? 'opacity-40 scale-95 border-dashed border-[#1351b8]' : ''
              }`}
            >
              {/* Thin gradient accent line at top of card */}
              <div className={`h-1 w-full bg-gradient-to-r ${card.gradient}`} />
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
                className="px-4 py-2 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white text-xs font-semibold rounded-lg shadow-xs active:scale-95 transition-all cursor-pointer"
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

// Dedicated Carousel Showcase matching ShizueFI & Stisla with Interactive Controls & Crossfade
function CarouselView() {
  // 1. Simple Carousel State (Auto-plays every 3.5s)
  const [simpleIndex, setSimpleIndex] = useState(0);
  const [isSimplePaused, setIsSimplePaused] = useState(false);

  // 2. Caption Carousel State
  const [captionIndex, setCaptionIndex] = useState(0);

  // 3. Navigation & Indicator Carousel State
  const [navIndex, setNavIndex] = useState(0);

  // 4. Crossfade Carousel State
  const [fadeIndex, setFadeIndex] = useState(0);

  // Auto-play for Simple Carousel
  useEffect(() => {
    if (isSimplePaused) return;
    const timer = setInterval(() => {
      setSimpleIndex((prev) => (prev + 1) % 3);
    }, 3500);
    return () => clearInterval(timer);
  }, [isSimplePaused]);

  // Captions data
  const captionSlides = [
    {
      title: 'Heading',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
      title: 'Velora Design System',
      desc: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    },
    {
      title: 'Reactive Architecture',
      desc: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
  ];

  // Helper placeholder visual component (Blue Theme)
  const renderBluePlaceholder = (slideNum: number) => (
    <div className="w-full h-full bg-[#dff1fd] relative flex flex-col items-center justify-center select-none overflow-hidden">
      {/* Decorative floating shapes */}
      <span className="absolute top-8 left-12 text-[#93c5fd] font-bold text-xs select-none">+</span>
      <span className="absolute bottom-12 left-16 w-2.5 h-2.5 border-2 border-[#93c5fd] rounded-xs select-none" />
      <span className="absolute top-12 right-20 w-3 h-3 border-2 border-[#93c5fd] rounded-full select-none" />
      <span className="absolute bottom-16 right-14 text-[#93c5fd] font-bold text-sm select-none">+</span>
      <span className="absolute top-1/2 left-8 w-1.5 h-1.5 bg-[#93c5fd] rounded-full select-none" />

      {/* Frame placeholder */}
      <div className="relative z-10 flex flex-col items-center gap-3">
        <div className="w-24 h-18 sm:w-28 sm:h-20 bg-[#38bdf8] rounded-xl p-2 flex flex-col justify-end relative shadow-sm overflow-hidden">
          {/* Sun */}
          <div className="absolute top-2.5 left-3.5 w-3.5 h-3.5 bg-white rounded-full shadow-xs" />
          {/* Mountain silhouettes */}
          <div className="flex items-end justify-center w-full">
            <div className="w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-b-[26px] border-b-white relative -mr-2" />
            <div className="w-0 h-0 border-l-[28px] border-l-transparent border-r-[28px] border-r-transparent border-b-[38px] border-b-white/90" />
          </div>
        </div>
        <p className="text-[11px] font-bold tracking-widest text-[#0284c7] uppercase">
          PLACEHOLDER IMAGE {slideNum}
        </p>
      </div>
    </div>
  );

  // Helper placeholder visual component (Mint Green Theme for Crossfade)
  const renderGreenPlaceholder = (slideNum: number) => (
    <div className="w-full h-full bg-[#dcfce7] relative flex flex-col items-center justify-center select-none overflow-hidden">
      {/* Decorative floating shapes */}
      <span className="absolute top-8 left-12 text-[#86efac] font-bold text-xs select-none">+</span>
      <span className="absolute bottom-12 left-16 w-2.5 h-2.5 border-2 border-[#86efac] rounded-xs select-none" />
      <span className="absolute top-12 right-20 w-3 h-3 border-2 border-[#86efac] rounded-full select-none" />
      <span className="absolute bottom-16 right-14 text-[#86efac] font-bold text-sm select-none">+</span>
      <span className="absolute top-1/2 left-8 w-1.5 h-1.5 bg-[#86efac] rounded-full select-none" />

      {/* Frame placeholder */}
      <div className="relative z-10 flex flex-col items-center gap-3">
        <div className="w-24 h-18 sm:w-28 sm:h-20 bg-[#4ade80] rounded-xl p-2 flex flex-col justify-end relative shadow-sm overflow-hidden">
          {/* Sun */}
          <div className="absolute top-2.5 left-3.5 w-3.5 h-3.5 bg-white rounded-full shadow-xs" />
          {/* Mountain silhouettes */}
          <div className="flex items-end justify-center w-full">
            <div className="w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-b-[26px] border-b-white relative -mr-2" />
            <div className="w-0 h-0 border-l-[28px] border-l-transparent border-r-[28px] border-r-transparent border-b-[38px] border-b-white/90" />
          </div>
        </div>
        <p className="text-[11px] font-bold tracking-widest text-emerald-600 uppercase">
          PLACEHOLDER IMAGE {slideNum}
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Section Header with Blue Pill Accent */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-8 h-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full inline-block" />
          <h2 className="text-base sm:text-lg font-bold text-slate-800">Carousel</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500">
          A slideshow component for cycling through elements—images or slides of text—like a carousel.
        </p>
      </div>

      {/* 2x2 Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* ======================================================== */}
        {/* CARD 1: SIMPLE (Auto Slide) */}
        {/* ======================================================== */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between">
            <h4 className="text-base font-bold text-[#1351b8]">Simple</h4>
            <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
              Auto Slide (3.5s)
            </span>
          </div>
          <div className="p-6">
            <div
              className="relative h-64 sm:h-72 w-full rounded-xl overflow-hidden shadow-2xs"
              onMouseEnter={() => setIsSimplePaused(true)}
              onMouseLeave={() => setIsSimplePaused(false)}
            >
              {/* Slides wrapper with smooth sliding translateX */}
              <div
                className="flex w-full h-full transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${simpleIndex * 100}%)` }}
              >
                <div className="w-full h-full shrink-0">{renderBluePlaceholder(1)}</div>
                <div className="w-full h-full shrink-0">{renderBluePlaceholder(2)}</div>
                <div className="w-full h-full shrink-0">{renderBluePlaceholder(3)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* CARD 2: CAPTION */}
        {/* ======================================================== */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="px-6 py-4.5 border-b border-slate-100">
            <h4 className="text-base font-bold text-[#1351b8]">Caption</h4>
          </div>
          <div className="p-6">
            <div className="relative h-64 sm:h-72 w-full rounded-xl overflow-hidden shadow-2xs group">
              {/* Slides wrapper with smooth sliding translateX */}
              <div
                className="flex w-full h-full transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${captionIndex * 100}%)` }}
              >
                <div className="w-full h-full shrink-0 relative">{renderBluePlaceholder(1)}</div>
                <div className="w-full h-full shrink-0 relative">{renderBluePlaceholder(2)}</div>
                <div className="w-full h-full shrink-0 relative">{renderBluePlaceholder(3)}</div>
              </div>

              {/* Caption Overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/70 via-slate-900/35 to-transparent pt-10 pb-7 px-8 text-center text-white pointer-events-none">
                <h5 className="text-base sm:text-lg font-bold mb-1">
                  {captionSlides[captionIndex].title}
                </h5>
                <p className="text-xs text-white/90 leading-relaxed max-w-md mx-auto line-clamp-2">
                  {captionSlides[captionIndex].desc}
                </p>
              </div>

              {/* Previous Button */}
              <button
                type="button"
                onClick={() => setCaptionIndex((prev) => (prev === 0 ? 2 : prev - 1))}
                aria-label="Previous Slide"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/40 hover:bg-white text-slate-800 shadow-xs backdrop-blur-2xs flex items-center justify-center transition-all cursor-pointer opacity-70 group-hover:opacity-100"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Next Button */}
              <button
                type="button"
                onClick={() => setCaptionIndex((prev) => (prev + 1) % 3)}
                aria-label="Next Slide"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/40 hover:bg-white text-slate-800 shadow-xs backdrop-blur-2xs flex items-center justify-center transition-all cursor-pointer opacity-70 group-hover:opacity-100"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Bottom Indicators */}
              <div className="absolute bottom-2.5 inset-x-0 flex items-center justify-center gap-1.5 z-10">
                {[0, 1, 2].map((idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCaptionIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
                      captionIndex === idx ? 'w-8 bg-white' : 'w-4 bg-white/50 hover:bg-white/75'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* CARD 3: NAVIGATION & INDICATOR */}
        {/* ======================================================== */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="px-6 py-4.5 border-b border-slate-100">
            <h4 className="text-base font-bold text-[#1351b8]">Navigation &amp; Indicator</h4>
          </div>
          <div className="p-6">
            <div className="relative h-64 sm:h-72 w-full rounded-xl overflow-hidden shadow-2xs group">
              {/* Slides wrapper with smooth sliding translateX */}
              <div
                className="flex w-full h-full transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${navIndex * 100}%)` }}
              >
                <div className="w-full h-full shrink-0">{renderBluePlaceholder(1)}</div>
                <div className="w-full h-full shrink-0">{renderBluePlaceholder(2)}</div>
                <div className="w-full h-full shrink-0">{renderBluePlaceholder(3)}</div>
              </div>

              {/* Previous Button */}
              <button
                type="button"
                onClick={() => setNavIndex((prev) => (prev === 0 ? 2 : prev - 1))}
                aria-label="Previous Slide"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/50 hover:bg-white text-slate-800 shadow-xs backdrop-blur-2xs flex items-center justify-center transition-all cursor-pointer opacity-70 group-hover:opacity-100"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Next Button */}
              <button
                type="button"
                onClick={() => setNavIndex((prev) => (prev + 1) % 3)}
                aria-label="Next Slide"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/50 hover:bg-white text-slate-800 shadow-xs backdrop-blur-2xs flex items-center justify-center transition-all cursor-pointer opacity-70 group-hover:opacity-100"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Bottom Indicators */}
              <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-1.5 z-10">
                {[0, 1, 2].map((idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setNavIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
                      navIndex === idx ? 'w-8 bg-[#1351b8]' : 'w-4 bg-slate-400/60 hover:bg-slate-500'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* CARD 4: CROSSFADE */}
        {/* ======================================================== */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between">
            <h4 className="text-base font-bold text-[#1351b8]">Crossfade</h4>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
              Fade Transition
            </span>
          </div>
          <div className="p-6">
            <div className="relative h-64 sm:h-72 w-full rounded-xl overflow-hidden shadow-2xs group">
              {/* Stacked Crossfade slides */}
              {[1, 2, 3].map((slideNum, idx) => (
                <div
                  key={slideNum}
                  className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                    fadeIndex === idx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  {renderGreenPlaceholder(slideNum)}
                </div>
              ))}

              {/* Previous Button */}
              <button
                type="button"
                onClick={() => setFadeIndex((prev) => (prev === 0 ? 2 : prev - 1))}
                aria-label="Previous Slide"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/50 hover:bg-white text-slate-800 shadow-xs backdrop-blur-2xs flex items-center justify-center transition-all cursor-pointer opacity-70 group-hover:opacity-100"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Next Button */}
              <button
                type="button"
                onClick={() => setFadeIndex((prev) => (prev + 1) % 3)}
                aria-label="Next Slide"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/50 hover:bg-white text-slate-800 shadow-xs backdrop-blur-2xs flex items-center justify-center transition-all cursor-pointer opacity-70 group-hover:opacity-100"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Bottom Indicators */}
              <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-1.5 z-20">
                {[0, 1, 2].map((idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFadeIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
                      fadeIndex === idx ? 'w-8 bg-emerald-600' : 'w-4 bg-emerald-400/50 hover:bg-emerald-600/70'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dedicated Collapse Showcase matching ShizueFI & Stisla with Interactive States
function CollapseView() {
  // Simple Collapse State (default true matching screenshot)
  const [isSimpleOpen, setIsSimpleOpen] = useState(true);

  // Multiple Targets States
  const [isTarget1Open, setIsTarget1Open] = useState(false);
  const [isTarget2Open, setIsTarget2Open] = useState(false);

  // Accordion State (default 1 open matching screenshot)
  const [activeAccordion, setActiveAccordion] = useState<number | null>(1);

  const toggleBothTargets = () => {
    if (isTarget1Open && isTarget2Open) {
      setIsTarget1Open(false);
      setIsTarget2Open(false);
    } else {
      setIsTarget1Open(true);
      setIsTarget2Open(true);
    }
  };

  const handleAccordionClick = (panelNum: number) => {
    setActiveAccordion((prev) => (prev === panelNum ? null : panelNum));
  };

  const accordionPanels = [
    {
      id: 1,
      title: 'Panel 1',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
    {
      id: 2,
      title: 'Panel 2',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
    {
      id: 3,
      title: 'Panel 3',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Section Header with Blue Pill Accent */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-8 h-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full inline-block" />
          <h2 className="text-base sm:text-lg font-bold text-slate-800">Collapse</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500">
          Toggle the visibility of content across your project with a few classes and our JavaScript plugins.
        </p>
      </div>

      {/* 2-Column Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Column 1: Simple & Multiple Targets */}
        <div className="space-y-6">
          {/* Card 1: Simple */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h4 className="text-base font-bold text-[#1351b8]">Simple</h4>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsSimpleOpen(!isSimpleOpen)}
                  className="px-4 py-2 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white text-xs font-semibold rounded-lg shadow-xs active:scale-95 transition-all cursor-pointer"
                >
                  Link with href
                </button>
                <button
                  type="button"
                  onClick={() => setIsSimpleOpen(!isSimpleOpen)}
                  className="px-4 py-2 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white text-xs font-semibold rounded-lg shadow-xs active:scale-95 transition-all cursor-pointer"
                >
                  Button with data-target
                </button>
              </div>

              {/* Collapsible Panel */}
              {isSimpleOpen && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                    Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Multiple Targets */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h4 className="text-base font-bold text-[#1351b8]">Multiple Targets</h4>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsTarget1Open(!isTarget1Open)}
                  className="px-4 py-2 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white text-xs font-semibold rounded-lg shadow-xs active:scale-95 transition-all cursor-pointer"
                >
                  Toggle first element
                </button>
                <button
                  type="button"
                  onClick={() => setIsTarget2Open(!isTarget2Open)}
                  className="px-4 py-2 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white text-xs font-semibold rounded-lg shadow-xs active:scale-95 transition-all cursor-pointer"
                >
                  Toggle second element
                </button>
                <button
                  type="button"
                  onClick={toggleBothTargets}
                  className="px-4 py-2 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white text-xs font-semibold rounded-lg shadow-xs active:scale-95 transition-all cursor-pointer"
                >
                  Toggle both elements
                </button>
              </div>

              {/* Target Panels */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {isTarget1Open && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident.
                    </p>
                  </div>
                )}
                {isTarget2Open && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Accordion */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h4 className="text-base font-bold text-[#1351b8]">Accordion</h4>
            </div>
            <div className="p-6 space-y-3">
              {accordionPanels.map((panel) => {
                const isActive = activeAccordion === panel.id;
                return (
                  <div key={panel.id} className="space-y-3">
                    {/* Header bar */}
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => handleAccordionClick(panel.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleAccordionClick(panel.id);
                        }
                      }}
                      className={`w-full text-left px-5 py-3 rounded-lg font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer select-none flex items-center justify-between ${
                        isActive
                          ? 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white shadow-xs'
                          : 'bg-[#f4f6f9] hover:bg-slate-200/80 text-slate-700'
                      }`}
                    >
                      <span>{panel.title}</span>
                    </div>

                    {/* Accordion Body */}
                    {isActive && (
                      <div className="animate-in fade-in slide-in-from-top-1 duration-200 px-2 py-1">
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {panel.content}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dedicated Dropdown Showcase matching ShizueFI & Stisla with Interactive Overlays & Directions
function DropdownView() {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const toggleDropdown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenDropdownId((prev) => (prev === id ? null : id));
  };

  const handleItemClick = (name: string) => {
    showToast(`Memilih opsi: ${name}`, 'info');
    setOpenDropdownId(null);
  };

  return (
    <div className="space-y-6">
      {/* Section Header with Blue Pill Accent */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-8 h-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full inline-block" />
          <h2 className="text-base sm:text-lg font-bold text-slate-800">Dropdown</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500">
          Toggle contextual overlays for displaying lists of links and more with the Bootstrap dropdown plugin.
        </p>
      </div>

      {/* 2-Column Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Column 1: Simple, Split, Direction */}
        <div className="space-y-6">
          {/* 1. Simple Dropdown */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-visible">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h4 className="text-base font-bold text-[#1351b8]">Simple</h4>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap items-center gap-3">
                {/* Blue Button */}
                <div className="relative dropdown-container">
                  <button
                    type="button"
                    onClick={(e) => toggleDropdown('simple-blue', e)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white text-xs font-semibold rounded-lg shadow-xs active:scale-95 transition-all cursor-pointer"
                  >
                    <span>Easy Dropdown</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>

                  {openDropdownId === 'simple-blue' && (
                    <div className="absolute left-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <button
                        type="button"
                        onClick={() => handleItemClick('Action')}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Action
                      </button>
                      <button
                        type="button"
                        onClick={() => handleItemClick('Another action')}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Another action
                      </button>
                      <button
                        type="button"
                        onClick={() => handleItemClick('Something else here')}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Something else here
                      </button>
                    </div>
                  )}
                </div>

                {/* Green Button */}
                <div className="relative dropdown-container">
                  <button
                    type="button"
                    onClick={(e) => toggleDropdown('simple-green', e)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#22c55e] to-[#15803d] hover:from-[#16a34a] hover:to-[#166534] text-white text-xs font-semibold rounded-lg shadow-xs active:scale-95 transition-all cursor-pointer"
                  >
                    <span>Easy Dropdown</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>

                  {openDropdownId === 'simple-green' && (
                    <div className="absolute left-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <button
                        type="button"
                        onClick={() => handleItemClick('Action')}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Action
                      </button>
                      <button
                        type="button"
                        onClick={() => handleItemClick('Another action')}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Another action
                      </button>
                      <button
                        type="button"
                        onClick={() => handleItemClick('Something else here')}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Something else here
                      </button>
                    </div>
                  )}
                </div>

                {/* Dark Button */}
                <div className="relative dropdown-container">
                  <button
                    type="button"
                    onClick={(e) => toggleDropdown('simple-dark', e)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#1e293b] to-[#020617] hover:from-[#0f172a] hover:to-[#000000] text-white text-xs font-semibold rounded-lg shadow-xs active:scale-95 transition-all cursor-pointer"
                  >
                    <span>Easy Dropdown</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>

                  {openDropdownId === 'simple-dark' && (
                    <div className="absolute left-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <button
                        type="button"
                        onClick={() => handleItemClick('Action')}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Action
                      </button>
                      <button
                        type="button"
                        onClick={() => handleItemClick('Another action')}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Another action
                      </button>
                      <button
                        type="button"
                        onClick={() => handleItemClick('Something else here')}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Something else here
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Split Dropdown */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-visible">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h4 className="text-base font-bold text-[#1351b8]">Split</h4>
            </div>
            <div className="p-6">
              <div className="relative inline-flex rounded-lg shadow-xs dropdown-container">
                <button
                  type="button"
                  onClick={() => showToast('Tombol Split Dropdown utama diklik!', 'success')}
                  className="px-4 py-2 bg-gradient-to-r from-[#ef4444] to-[#dc2626] hover:from-[#dc2626] hover:to-[#b91c1c] text-white text-xs font-semibold rounded-l-lg border-r border-red-700/40 active:scale-98 transition-all cursor-pointer"
                >
                  Split Dropdown
                </button>
                <button
                  type="button"
                  onClick={(e) => toggleDropdown('split-red', e)}
                  aria-label="Toggle split dropdown"
                  className="px-2.5 py-2 bg-gradient-to-r from-[#dc2626] to-[#b91c1c] hover:from-[#b91c1c] hover:to-[#991b1b] text-white text-xs font-semibold rounded-r-lg active:scale-98 transition-all cursor-pointer"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {openDropdownId === 'split-red' && (
                  <div className="absolute left-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <button
                      type="button"
                      onClick={() => handleItemClick('Action')}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Action
                    </button>
                    <button
                      type="button"
                      onClick={() => handleItemClick('Another action')}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Another action
                    </button>
                    <button
                      type="button"
                      onClick={() => handleItemClick('Something else here')}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Something else here
                    </button>
                    <div className="my-1 border-t border-slate-100" />
                    <button
                      type="button"
                      onClick={() => handleItemClick('Separated link')}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Separated link
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 3. Direction (Dropup, Dropright, Dropleft) */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-visible">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h4 className="text-base font-bold text-[#1351b8]">Direction</h4>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap items-center gap-3">
                {/* Dropup */}
                <div className="relative dropdown-container">
                  <button
                    type="button"
                    onClick={(e) => toggleDropdown('dir-dropup', e)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#1e293b] to-[#020617] hover:from-[#0f172a] hover:to-[#000000] text-white text-xs font-semibold rounded-lg shadow-xs active:scale-95 transition-all cursor-pointer"
                  >
                    <span>Dropup</span>
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>

                  {openDropdownId === 'dir-dropup' && (
                    <div className="absolute left-0 bottom-full mb-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <button
                        type="button"
                        onClick={() => handleItemClick('Action')}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Action
                      </button>
                      <button
                        type="button"
                        onClick={() => handleItemClick('Another action')}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Another action
                      </button>
                      <button
                        type="button"
                        onClick={() => handleItemClick('Something else here')}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Something else here
                      </button>
                      <div className="my-1 border-t border-slate-100" />
                      <button
                        type="button"
                        onClick={() => handleItemClick('Separated link')}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Separated link
                      </button>
                    </div>
                  )}
                </div>

                {/* Dropright */}
                <div className="relative dropdown-container">
                  <button
                    type="button"
                    onClick={(e) => toggleDropdown('dir-dropright', e)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#1e293b] to-[#020617] hover:from-[#0f172a] hover:to-[#000000] text-white text-xs font-semibold rounded-lg shadow-xs active:scale-95 transition-all cursor-pointer"
                  >
                    <span>Dropright</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  {openDropdownId === 'dir-dropright' && (
                    <div className="absolute left-full top-0 ml-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <button
                        type="button"
                        onClick={() => handleItemClick('Action')}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Action
                      </button>
                      <button
                        type="button"
                        onClick={() => handleItemClick('Another action')}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Another action
                      </button>
                      <button
                        type="button"
                        onClick={() => handleItemClick('Something else here')}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Something else here
                      </button>
                      <div className="my-1 border-t border-slate-100" />
                      <button
                        type="button"
                        onClick={() => handleItemClick('Separated link')}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Separated link
                      </button>
                    </div>
                  )}
                </div>

                {/* Dropleft */}
                <div className="relative dropdown-container">
                  <button
                    type="button"
                    onClick={(e) => toggleDropdown('dir-dropleft', e)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#1e293b] to-[#020617] hover:from-[#0f172a] hover:to-[#000000] text-white text-xs font-semibold rounded-lg shadow-xs active:scale-95 transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Dropleft</span>
                  </button>

                  {openDropdownId === 'dir-dropleft' && (
                    <div className="absolute right-full top-0 mr-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <button
                        type="button"
                        onClick={() => handleItemClick('Action')}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Action
                      </button>
                      <button
                        type="button"
                        onClick={() => handleItemClick('Another action')}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Another action
                      </button>
                      <button
                        type="button"
                        onClick={() => handleItemClick('Something else here')}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Something else here
                      </button>
                      <div className="my-1 border-t border-slate-100" />
                      <button
                        type="button"
                        onClick={() => handleItemClick('Separated link')}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Separated link
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Icon, Size, Title */}
        <div className="space-y-6">
          {/* 4. Icon */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-visible">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h4 className="text-base font-bold text-[#1351b8]">Icon</h4>
            </div>
            <div className="p-6">
              <div className="relative inline-block dropdown-container">
                <button
                  type="button"
                  onClick={(e) => toggleDropdown('icon-blue', e)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white text-xs font-semibold rounded-lg shadow-xs active:scale-95 transition-all cursor-pointer"
                >
                  <span>With Icon</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {openDropdownId === 'icon-blue' && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <button
                      type="button"
                      onClick={() => handleItemClick('Action')}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <Heart className="w-3.5 h-3.5 text-rose-500" />
                      <span>Action</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleItemClick('Another action')}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                      <span>Another action</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleItemClick('Something else here')}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>Something else here</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 5. Size (Small, Normal, Large) */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-visible">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h4 className="text-base font-bold text-[#1351b8]">Size</h4>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap items-center gap-3">
                {/* Small button */}
                <div className="relative dropdown-container">
                  <button
                    type="button"
                    onClick={(e) => toggleDropdown('size-sm', e)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] hover:from-[#0284c7] hover:to-[#0369a1] text-white text-[11px] font-semibold rounded-lg shadow-xs active:scale-95 transition-all cursor-pointer"
                  >
                    <span>Small button</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  {openDropdownId === 'size-sm' && (
                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <button
                        type="button"
                        onClick={() => handleItemClick('Action')}
                        className="w-full text-left px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Action
                      </button>
                      <button
                        type="button"
                        onClick={() => handleItemClick('Another action')}
                        className="w-full text-left px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Another action
                      </button>
                      <button
                        type="button"
                        onClick={() => handleItemClick('Something else here')}
                        className="w-full text-left px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Something else here
                      </button>
                      <div className="my-1 border-t border-slate-100" />
                      <button
                        type="button"
                        onClick={() => handleItemClick('Separated link')}
                        className="w-full text-left px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Separated link
                      </button>
                    </div>
                  )}
                </div>

                {/* Normal button */}
                <div className="relative dropdown-container">
                  <button
                    type="button"
                    onClick={(e) => toggleDropdown('size-normal', e)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#ef4444] to-[#b91c1c] hover:from-[#dc2626] hover:to-[#991b1b] text-white text-xs font-semibold rounded-lg shadow-xs active:scale-95 transition-all cursor-pointer"
                  >
                    <span>Normal button</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>

                  {openDropdownId === 'size-normal' && (
                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <button
                        type="button"
                        onClick={() => handleItemClick('Action')}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Action
                      </button>
                      <button
                        type="button"
                        onClick={() => handleItemClick('Another action')}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Another action
                      </button>
                      <button
                        type="button"
                        onClick={() => handleItemClick('Something else here')}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Something else here
                      </button>
                      <div className="my-1 border-t border-slate-100" />
                      <button
                        type="button"
                        onClick={() => handleItemClick('Separated link')}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Separated link
                      </button>
                    </div>
                  )}
                </div>

                {/* Large button */}
                <div className="relative dropdown-container">
                  <button
                    type="button"
                    onClick={(e) => toggleDropdown('size-large', e)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:from-[#ea580c] hover:to-[#b45309] text-white text-sm font-semibold rounded-lg shadow-xs active:scale-95 transition-all cursor-pointer"
                  >
                    <span>Large button</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {openDropdownId === 'size-large' && (
                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <button
                        type="button"
                        onClick={() => handleItemClick('Action')}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Action
                      </button>
                      <button
                        type="button"
                        onClick={() => handleItemClick('Another action')}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Another action
                      </button>
                      <button
                        type="button"
                        onClick={() => handleItemClick('Something else here')}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Something else here
                      </button>
                      <div className="my-1 border-t border-slate-100" />
                      <button
                        type="button"
                        onClick={() => handleItemClick('Separated link')}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Separated link
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 6. Title */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-visible">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h4 className="text-base font-bold text-[#1351b8]">Title</h4>
            </div>
            <div className="p-6">
              <div className="relative inline-block dropdown-container">
                <button
                  type="button"
                  onClick={(e) => toggleDropdown('title-green', e)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#22c55e] to-[#15803d] hover:from-[#16a34a] hover:to-[#166534] text-white text-xs font-semibold rounded-lg shadow-xs active:scale-95 transition-all cursor-pointer"
                >
                  <span>Options</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {openDropdownId === 'title-green' && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      HI, JOHN!
                    </div>
                    <button
                      type="button"
                      onClick={() => handleItemClick('Action')}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Action
                    </button>
                    <button
                      type="button"
                      onClick={() => handleItemClick('Another action')}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Another action
                    </button>
                    <button
                      type="button"
                      onClick={() => handleItemClick('Something else here')}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Something else here
                    </button>
                    <div className="my-1 border-t border-slate-100" />
                    <button
                      type="button"
                      onClick={() => handleItemClick('Separated link')}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Separated link
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dedicated Form Showcase matching ShizueFI & Stisla with 13 Comprehensive Cards
function FormView() {
  const [rangeValue, setRangeValue] = useState(50);
  const [colorValue, setColorValue] = useState('#000000');
  const [html5Form, setHtml5Form] = useState({
    text: '',
    select: 'Option 1',
    multipleSelect: ['Option 1'],
    textarea: '',
    checkbox1: false,
    checkbox2: false,
    date: '',
    datetime: '',
    email: '',
    month: '',
    password: '',
    radio: 'Radio 2',
    search: '',
    tel: '',
    time: '',
    url: '',
    week: '',
  });

  const handleResetHtml5 = () => {
    setHtml5Form({
      text: '',
      select: 'Option 1',
      multipleSelect: ['Option 1'],
      textarea: '',
      checkbox1: false,
      checkbox2: false,
      date: '',
      datetime: '',
      email: '',
      month: '',
      password: '',
      radio: 'Radio 2',
      search: '',
      tel: '',
      time: '',
      url: '',
      week: '',
    });
    setRangeValue(50);
    setColorValue('#000000');
    showToast('Form berhasil di-reset!', 'info');
  };

  const handleSubmitHtml5 = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Data formulir berhasil dikirim!', 'success');
  };

  // Section title pill component inside card bodies (matching ShizueFI)
  const FormSectionTitle = ({ title }: { title: string }) => (
    <div className="flex items-center gap-2 mb-3 mt-5 first:mt-0">
      <span className="w-6 h-1.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full inline-block" />
      <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700">{title}</h5>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Section Header with Blue Pill Accent */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-8 h-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full inline-block" />
          <h2 className="text-base sm:text-lg font-bold text-slate-800">Forms</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500">
          Examples and usage guidelines for form control styles, layout options, and custom components for creating a wide variety of forms.
        </p>
      </div>

      {/* 2-Column Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* ======================================================== */}
        {/* COLUMN 1 (LEFT) */}
        {/* ======================================================== */}
        <div className="space-y-6">
          {/* 1. HTML5 Form Basic */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h4 className="text-base font-bold text-[#1351b8]">HTML5 Form Basic</h4>
            </div>
            <form onSubmit={handleSubmitHtml5}>
              <div className="p-6 space-y-4.5">
                {/* Note Alert Info Callout */}
                <div className="bg-[#e0f2fe] border border-[#bae6fd] text-[#0369a1] px-4 py-3 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2">
                  <span className="font-bold">Note!</span>
                  <span>Not all browsers support HTML5 type input.</span>
                </div>

                {/* Text */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">Text</label>
                  <input
                    type="text"
                    value={html5Form.text}
                    onChange={(e) => setHtml5Form({ ...html5Form, text: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200/90 text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#1351b8] focus:ring-2 focus:ring-[#1351b8]/15 transition-all"
                  />
                </div>

                {/* Select */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">Select</label>
                  <select
                    value={html5Form.select}
                    onChange={(e) => setHtml5Form({ ...html5Form, select: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200/90 text-slate-800 bg-white focus:outline-hidden focus:border-[#1351b8] focus:ring-2 focus:ring-[#1351b8]/15 transition-all cursor-pointer"
                  >
                    <option>Option 1</option>
                    <option>Option 2</option>
                    <option>Option 3</option>
                  </select>
                </div>

                {/* Select Multiple */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">Select Multiple</label>
                  <select
                    multiple
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200/90 text-slate-800 bg-white focus:outline-hidden focus:border-[#1351b8] focus:ring-2 focus:ring-[#1351b8]/15 transition-all h-28"
                  >
                    <option>Option 1</option>
                    <option>Option 2</option>
                    <option>Option 3</option>
                    <option>Option 4</option>
                  </select>
                </div>

                {/* Textarea */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">Textarea</label>
                  <textarea
                    rows={3}
                    value={html5Form.textarea}
                    onChange={(e) => setHtml5Form({ ...html5Form, textarea: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200/90 text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#1351b8] focus:ring-2 focus:ring-[#1351b8]/15 transition-all"
                  />
                </div>

                {/* Checkbox */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-700 block">Checkbox</label>
                  <div className="flex flex-col gap-2.5 pt-0.5">
                    <label className="inline-flex items-center gap-2.5 cursor-pointer select-none text-xs text-slate-700">
                      <input
                        type="checkbox"
                        checked={html5Form.checkbox1}
                        onChange={(e) => setHtml5Form({ ...html5Form, checkbox1: e.target.checked })}
                        className="w-4 h-4 text-[#1351b8] rounded-sm border-slate-300 focus:ring-[#1351b8]/20 cursor-pointer"
                      />
                      <span>Checkbox 1</span>
                    </label>
                    <label className="inline-flex items-center gap-2.5 cursor-pointer select-none text-xs text-slate-700">
                      <input
                        type="checkbox"
                        checked={html5Form.checkbox2}
                        onChange={(e) => setHtml5Form({ ...html5Form, checkbox2: e.target.checked })}
                        className="w-4 h-4 text-[#1351b8] rounded-sm border-slate-300 focus:ring-[#1351b8]/20 cursor-pointer"
                      />
                      <span>Checkbox 2</span>
                    </label>
                  </div>
                </div>

                {/* Color */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={colorValue}
                      onChange={(e) => setColorValue(e.target.value)}
                      className="w-full h-10 p-1 rounded-lg border border-slate-200/90 bg-white cursor-pointer"
                    />
                  </div>
                </div>

                {/* Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">Date</label>
                  <input
                    type="date"
                    value={html5Form.date}
                    onChange={(e) => setHtml5Form({ ...html5Form, date: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200/90 text-slate-800 focus:outline-hidden focus:border-[#1351b8] focus:ring-2 focus:ring-[#1351b8]/15 transition-all"
                  />
                </div>

                {/* Datetime Local */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">Datetime Local</label>
                  <input
                    type="datetime-local"
                    value={html5Form.datetime}
                    onChange={(e) => setHtml5Form({ ...html5Form, datetime: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200/90 text-slate-800 focus:outline-hidden focus:border-[#1351b8] focus:ring-2 focus:ring-[#1351b8]/15 transition-all"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">Email</label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={html5Form.email}
                    onChange={(e) => setHtml5Form({ ...html5Form, email: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200/90 text-slate-800 focus:outline-hidden focus:border-[#1351b8] focus:ring-2 focus:ring-[#1351b8]/15 transition-all"
                  />
                </div>

                {/* File */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">File</label>
                  <input
                    type="file"
                    className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer border border-slate-200/90 rounded-lg p-1.5"
                  />
                </div>

                {/* Month */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">Month</label>
                  <input
                    type="month"
                    value={html5Form.month}
                    onChange={(e) => setHtml5Form({ ...html5Form, month: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200/90 text-slate-800 focus:outline-hidden focus:border-[#1351b8] focus:ring-2 focus:ring-[#1351b8]/15 transition-all"
                  />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">Password</label>
                  <input
                    type="password"
                    placeholder="Password"
                    value={html5Form.password}
                    onChange={(e) => setHtml5Form({ ...html5Form, password: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200/90 text-slate-800 focus:outline-hidden focus:border-[#1351b8] focus:ring-2 focus:ring-[#1351b8]/15 transition-all"
                  />
                </div>

                {/* Radio */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-700 block">Radio</label>
                  <div className="flex flex-col gap-2.5 pt-0.5">
                    <label className="inline-flex items-center gap-2.5 cursor-pointer select-none text-xs text-slate-700">
                      <input
                        type="radio"
                        name="html5Radio"
                        checked={html5Form.radio === 'Radio 1'}
                        onChange={() => setHtml5Form({ ...html5Form, radio: 'Radio 1' })}
                        className="w-4 h-4 text-[#1351b8] border-slate-300 focus:ring-[#1351b8]/20 cursor-pointer"
                      />
                      <span>Radio 1</span>
                    </label>
                    <label className="inline-flex items-center gap-2.5 cursor-pointer select-none text-xs text-slate-700">
                      <input
                        type="radio"
                        name="html5Radio"
                        checked={html5Form.radio === 'Radio 2'}
                        onChange={() => setHtml5Form({ ...html5Form, radio: 'Radio 2' })}
                        className="w-4 h-4 text-[#1351b8] border-slate-300 focus:ring-[#1351b8]/20 cursor-pointer"
                      />
                      <span>Radio 2</span>
                    </label>
                  </div>
                </div>

                {/* Range */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700">Range</label>
                    <span className="text-[11px] font-bold text-[#1351b8] bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
                      {rangeValue}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={rangeValue}
                    onChange={(e) => setRangeValue(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1351b8]"
                  />
                </div>

                {/* Search */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">Search</label>
                  <input
                    type="search"
                    placeholder="Search..."
                    value={html5Form.search}
                    onChange={(e) => setHtml5Form({ ...html5Form, search: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200/90 text-slate-800 focus:outline-hidden focus:border-[#1351b8] focus:ring-2 focus:ring-[#1351b8]/15 transition-all"
                  />
                </div>

                {/* Tel */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">Tel</label>
                  <input
                    type="tel"
                    placeholder="+62 812 3456 7890"
                    value={html5Form.tel}
                    onChange={(e) => setHtml5Form({ ...html5Form, tel: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200/90 text-slate-800 focus:outline-hidden focus:border-[#1351b8] focus:ring-2 focus:ring-[#1351b8]/15 transition-all"
                  />
                </div>

                {/* Time */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">Time</label>
                  <input
                    type="time"
                    value={html5Form.time}
                    onChange={(e) => setHtml5Form({ ...html5Form, time: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200/90 text-slate-800 focus:outline-hidden focus:border-[#1351b8] focus:ring-2 focus:ring-[#1351b8]/15 transition-all"
                  />
                </div>

                {/* Url */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">Url</label>
                  <input
                    type="url"
                    placeholder="https://example.com"
                    value={html5Form.url}
                    onChange={(e) => setHtml5Form({ ...html5Form, url: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200/90 text-slate-800 focus:outline-hidden focus:border-[#1351b8] focus:ring-2 focus:ring-[#1351b8]/15 transition-all"
                  />
                </div>

                {/* Week */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">Week</label>
                  <input
                    type="week"
                    value={html5Form.week}
                    onChange={(e) => setHtml5Form({ ...html5Form, week: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200/90 text-slate-800 focus:outline-hidden focus:border-[#1351b8] focus:ring-2 focus:ring-[#1351b8]/15 transition-all"
                  />
                </div>
              </div>

              {/* Card Footer with Submit & Reset */}
              <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white text-xs font-semibold rounded-lg shadow-xs active:scale-95 transition-all cursor-pointer"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={handleResetHtml5}
                  className="px-4 py-2 bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200/80 shadow-xs active:scale-95 transition-all cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>

          {/* 2. Inline Forms */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h4 className="text-base font-bold text-[#1351b8]">Inline Forms</h4>
            </div>
            <div className="p-6">
              <form className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  placeholder="Jane Doe"
                  className="w-full sm:w-1/2 px-3.5 py-2 text-xs rounded-lg border border-slate-200/90 text-slate-800 focus:outline-hidden focus:border-[#1351b8] focus:ring-2 focus:ring-[#1351b8]/15 transition-all"
                />
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full sm:w-1/2 px-3.5 py-2 text-xs rounded-lg border border-slate-200/90 text-slate-800 focus:outline-hidden focus:border-[#1351b8] focus:ring-2 focus:ring-[#1351b8]/15 transition-all"
                />
              </form>
            </div>
          </div>

          {/* 3. Help Text */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h4 className="text-base font-bold text-[#1351b8]">Help Text</h4>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Password</label>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200/90 text-slate-800 focus:outline-hidden focus:border-[#1351b8] focus:ring-2 focus:ring-[#1351b8]/15 transition-all"
                />
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.
                </p>
              </div>

              <div className="pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <label className="text-xs font-medium text-slate-700 shrink-0">Password</label>
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-48 px-3.5 py-1.5 text-xs rounded-lg border border-slate-200/90 text-slate-800 focus:outline-hidden focus:border-[#1351b8] focus:ring-2 focus:ring-[#1351b8]/15 transition-all"
                  />
                  <span className="text-[11px] text-slate-500">
                    Must be 8-20 characters long.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Custom Forms #2 */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h4 className="text-base font-bold text-[#1351b8]">Custom Forms #2</h4>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <FormSectionTitle title="Select" />
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">Choose One</label>
                  <select className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200/90 text-slate-800 bg-white focus:outline-hidden focus:border-[#1351b8] focus:ring-2 focus:ring-[#1351b8]/15 transition-all cursor-pointer">
                    <option>Open this select menu</option>
                    <option>One</option>
                    <option>Two</option>
                    <option>Three</option>
                  </select>
                </div>
              </div>

              <div>
                <FormSectionTitle title="File Browser" />
                <div className="flex rounded-lg border border-slate-200/90 overflow-hidden focus-within:border-[#1351b8] focus-within:ring-2 focus-within:ring-[#1351b8]/15 transition-all">
                  <input
                    type="text"
                    readOnly
                    placeholder="Choose file"
                    className="flex-1 px-3.5 py-2 text-xs bg-white text-slate-500 placeholder:text-slate-400 focus:outline-hidden"
                  />
                  <label className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border-l border-slate-200/90 cursor-pointer transition-colors flex items-center justify-center">
                    Browse
                    <input type="file" className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Input Group Text */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h4 className="text-base font-bold text-[#1351b8]">Input Group Text</h4>
            </div>
            <div className="p-6 space-y-4">
              {/* @ Username */}
              <div className="flex rounded-lg border border-slate-200/90 overflow-hidden focus-within:border-[#1351b8] focus-within:ring-2 focus-within:ring-[#1351b8]/15 transition-all">
                <span className="px-3.5 py-2 bg-slate-50 border-r border-slate-200/80 text-xs font-medium text-slate-500 flex items-center justify-center">
                  @
                </span>
                <input
                  type="text"
                  placeholder="Username"
                  className="flex-1 px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden"
                />
              </div>

              {/* Your URL .com */}
              <div className="flex rounded-lg border border-slate-200/90 overflow-hidden focus-within:border-[#1351b8] focus-within:ring-2 focus-within:ring-[#1351b8]/15 transition-all">
                <input
                  type="text"
                  placeholder="Your URL"
                  className="flex-1 px-3.5 py-2 text-xs text-right text-slate-800 placeholder:text-slate-400 focus:outline-hidden"
                />
                <span className="px-3.5 py-2 bg-slate-50 border-l border-slate-200/80 text-xs font-medium text-slate-500 flex items-center justify-center">
                  .com
                </span>
              </div>

              {/* $ .00 */}
              <div className="flex rounded-lg border border-slate-200/90 overflow-hidden focus-within:border-[#1351b8] focus-within:ring-2 focus-within:ring-[#1351b8]/15 transition-all">
                <span className="px-3.5 py-2 bg-slate-50 border-r border-slate-200/80 text-xs font-medium text-slate-500 flex items-center justify-center">
                  $
                </span>
                <input
                  type="text"
                  placeholder="0"
                  className="flex-1 px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden"
                />
                <span className="px-3.5 py-2 bg-slate-50 border-l border-slate-200/80 text-xs font-medium text-slate-500 flex items-center justify-center">
                  .00
                </span>
              </div>
            </div>
          </div>

          {/* 6. Input Group #2 */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h4 className="text-base font-bold text-[#1351b8]">Input Group #2</h4>
            </div>
            <div className="p-6 space-y-5">
              {/* Multiple Addons */}
              <div>
                <FormSectionTitle title="Multiple Addons" />
                <div className="flex rounded-lg border border-slate-200/90 overflow-hidden focus-within:border-[#1351b8] focus-within:ring-2 focus-within:ring-[#1351b8]/15 transition-all">
                  <span className="px-3.5 py-2 bg-slate-50 border-r border-slate-200/80 text-xs font-medium text-slate-500 flex items-center justify-center shrink-0">
                    First and last name
                  </span>
                  <input
                    type="text"
                    placeholder="First name"
                    className="flex-1 px-3 py-2 text-xs border-r border-slate-200/80 text-slate-800 placeholder:text-slate-400 focus:outline-hidden"
                  />
                  <input
                    type="text"
                    placeholder="Last name"
                    className="flex-1 px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Button */}
              <div>
                <FormSectionTitle title="Button" />
                <div className="flex rounded-lg border border-slate-200/90 overflow-hidden focus-within:border-[#1351b8] focus-within:ring-2 focus-within:ring-[#1351b8]/15 transition-all">
                  <input
                    type="text"
                    placeholder="Search or input..."
                    className="flex-1 px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => showToast('Tombol Action Input Group diklik', 'info')}
                    className="px-4 py-2 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white text-xs font-semibold transition-all active:scale-95 cursor-pointer"
                  >
                    Button
                  </button>
                </div>
              </div>

              {/* Select With Button */}
              <div>
                <FormSectionTitle title="Select With Button" />
                <div className="flex rounded-lg border border-slate-200/90 overflow-hidden focus-within:border-[#1351b8] focus-within:ring-2 focus-within:ring-[#1351b8]/15 transition-all">
                  <select className="flex-1 px-3.5 py-2 text-xs text-slate-800 bg-white focus:outline-hidden cursor-pointer">
                    <option>Choose...</option>
                    <option>One</option>
                    <option>Two</option>
                    <option>Three</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => showToast('Action Select With Button diklik', 'info')}
                    className="px-4 py-2 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white text-xs font-semibold transition-all active:scale-95 cursor-pointer"
                  >
                    Button
                  </button>
                </div>
              </div>

              {/* Select, Button & Input */}
              <div>
                <FormSectionTitle title="Select, Button & Input" />
                <div className="flex rounded-lg border border-slate-200/90 overflow-hidden focus-within:border-[#1351b8] focus-within:ring-2 focus-within:ring-[#1351b8]/15 transition-all">
                  <select className="px-3.5 py-2 text-xs text-slate-800 bg-white border-r border-slate-200/80 focus:outline-hidden cursor-pointer">
                    <option>Choose...</option>
                    <option>One</option>
                    <option>Two</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Type value..."
                    className="flex-1 px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => showToast('Action Select, Button & Input diklik', 'info')}
                    className="px-4 py-2 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white text-xs font-semibold transition-all active:scale-95 cursor-pointer"
                  >
                    Button
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* COLUMN 2 (RIGHT) */}
        {/* ======================================================== */}
        <div className="space-y-6">
          {/* 7. Sizing */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h4 className="text-base font-bold text-[#1351b8]">Sizing</h4>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <FormSectionTitle title="Text" />
                <div className="space-y-4">
                  <div className="space-y-2.5">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                      <span>Text</span>
                      <code className="text-[11px] px-2 py-0.5 rounded-md bg-blue-50 text-[#1351b8] font-mono border border-blue-100 font-semibold">
                        .form-control-sm
                      </code>
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-1.5 text-[11px] rounded-md border border-slate-200/90 text-slate-800 focus:outline-hidden focus:border-[#1351b8] focus:ring-2 focus:ring-[#1351b8]/15 transition-all"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-xs font-semibold text-slate-700 block">Text (Normal)</label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200/90 text-slate-800 focus:outline-hidden focus:border-[#1351b8] focus:ring-2 focus:ring-[#1351b8]/15 transition-all"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                      <span>Text</span>
                      <code className="text-[11px] px-2 py-0.5 rounded-md bg-blue-50 text-[#1351b8] font-mono border border-blue-100 font-semibold">
                        .form-control-lg
                      </code>
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200/90 text-slate-800 focus:outline-hidden focus:border-[#1351b8] focus:ring-2 focus:ring-[#1351b8]/15 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <FormSectionTitle title="Select" />
                <div className="space-y-4">
                  <div className="space-y-2.5">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                      <span>Select</span>
                      <code className="text-[11px] px-2 py-0.5 rounded-md bg-blue-50 text-[#1351b8] font-mono border border-blue-100 font-semibold">
                        .form-control-sm
                      </code>
                    </label>
                    <select className="w-full px-3 py-1.5 text-[11px] rounded-md border border-slate-200/90 text-slate-800 bg-white focus:outline-hidden focus:border-[#1351b8] focus:ring-2 focus:ring-[#1351b8]/15 transition-all cursor-pointer">
                      <option>Option 1</option>
                      <option>Option 2</option>
                    </select>
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-xs font-semibold text-slate-700 block">Select (Normal)</label>
                    <select className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200/90 text-slate-800 bg-white focus:outline-hidden focus:border-[#1351b8] focus:ring-2 focus:ring-[#1351b8]/15 transition-all cursor-pointer">
                      <option>Option 1</option>
                      <option>Option 2</option>
                    </select>
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                      <span>Select</span>
                      <code className="text-[11px] px-2 py-0.5 rounded-md bg-blue-50 text-[#1351b8] font-mono border border-blue-100 font-semibold">
                        .form-control-lg
                      </code>
                    </label>
                    <select className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200/90 text-slate-800 bg-white focus:outline-hidden focus:border-[#1351b8] focus:ring-2 focus:ring-[#1351b8]/15 transition-all cursor-pointer">
                      <option>Option 1</option>
                      <option>Option 2</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 8. Disabled & Read Only */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h4 className="text-base font-bold text-[#1351b8]">Disabled &amp; Read Only</h4>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <FormSectionTitle title="Text" />
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-600">Readonly</label>
                    <input
                      type="text"
                      readOnly
                      value="Readonly input field"
                      className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200/80 bg-slate-100 text-slate-500 cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-600">Readonly Plain Text</label>
                    <p className="text-sm font-semibold text-slate-800 py-1">Hello!</p>
                  </div>
                </div>
              </div>

              <div>
                <FormSectionTitle title="Select" />
                <div className="space-y-1">
                  <label className="text-xs text-slate-600">Select Disabled</label>
                  <select disabled className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200/80 bg-slate-100 text-slate-400 cursor-not-allowed">
                    <option>Option 1</option>
                  </select>
                </div>
              </div>

              <div>
                <FormSectionTitle title="Checkbox" />
                <label className="inline-flex items-center gap-2 cursor-not-allowed opacity-60 text-xs text-slate-600">
                  <input type="checkbox" disabled className="w-4 h-4 rounded-sm border-slate-300" />
                  <span>Disabled checkbox</span>
                </label>
              </div>

              <div>
                <FormSectionTitle title="Radio" />
                <label className="inline-flex items-center gap-2 cursor-not-allowed opacity-60 text-xs text-slate-600">
                  <input type="radio" disabled className="w-4 h-4 border-slate-300" />
                  <span>Disabled radio</span>
                </label>
              </div>
            </div>
          </div>

          {/* 9. Inline */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h4 className="text-base font-bold text-[#1351b8]">Inline</h4>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 block">Inline Checkbox</label>
                <div className="flex items-center gap-7">
                  <label className="inline-flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none">
                    <input type="checkbox" className="w-4 h-4 text-[#1351b8] rounded-sm border-slate-300" />
                    <span>1</span>
                  </label>
                  <label className="inline-flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none">
                    <input type="checkbox" className="w-4 h-4 text-[#1351b8] rounded-sm border-slate-300" />
                    <span>2</span>
                  </label>
                  <label className="inline-flex items-center gap-2 text-xs text-slate-400 cursor-not-allowed select-none">
                    <input type="checkbox" disabled className="w-4 h-4 rounded-sm border-slate-300" />
                    <span>3 (disabled)</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-xs font-semibold text-slate-700 block">Inline Radio</label>
                <div className="flex items-center gap-7">
                  <label className="inline-flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none">
                    <input type="radio" name="inlineRadio" className="w-4 h-4 text-[#1351b8] border-slate-300" />
                    <span>1</span>
                  </label>
                  <label className="inline-flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none">
                    <input type="radio" name="inlineRadio" className="w-4 h-4 text-[#1351b8] border-slate-300" />
                    <span>2</span>
                  </label>
                  <label className="inline-flex items-center gap-2 text-xs text-slate-400 cursor-not-allowed select-none">
                    <input type="radio" disabled name="inlineRadio" className="w-4 h-4 border-slate-300" />
                    <span>3 (disabled)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* 10. Horizontal Form (Grid Layout) */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h4 className="text-base font-bold text-[#1351b8]">Horizontal Form</h4>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">Email</label>
                  <input type="email" placeholder="Email" className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200/90 focus:outline-hidden focus:border-[#1351b8]" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">Password</label>
                  <input type="password" placeholder="Password" className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200/90 focus:outline-hidden focus:border-[#1351b8]" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Address</label>
                <input type="text" placeholder="1234 Main St" className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200/90 focus:outline-hidden focus:border-[#1351b8]" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Address 2</label>
                <input type="text" placeholder="Apartment, studio, or floor" className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200/90 focus:outline-hidden focus:border-[#1351b8]" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-6 space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">City</label>
                  <input type="text" className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200/90 focus:outline-hidden focus:border-[#1351b8]" />
                </div>
                <div className="sm:col-span-4 space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">State</label>
                  <select className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200/90 bg-white focus:outline-hidden focus:border-[#1351b8]">
                    <option>Choose...</option>
                    <option>DKI Jakarta</option>
                    <option>Jawa Barat</option>
                  </select>
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">Zip</label>
                  <input type="text" className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200/90 focus:outline-hidden focus:border-[#1351b8]" />
                </div>
              </div>

              <label className="inline-flex items-center gap-2 cursor-pointer select-none text-xs text-slate-700 pt-1">
                <input type="checkbox" className="w-4 h-4 text-[#1351b8] rounded-sm border-slate-300" />
                <span>Check me out</span>
              </label>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => showToast('Horizontal form submitted!', 'success')}
                  className="px-5 py-2 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white text-xs font-semibold rounded-lg shadow-xs active:scale-95 transition-all cursor-pointer"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>

          {/* 11. Horizontal Form (Label Left Layout) */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h4 className="text-base font-bold text-[#1351b8]">Horizontal Form</h4>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label className="sm:w-1/4 text-xs font-medium text-slate-700">Email</label>
                <div className="sm:w-3/4">
                  <input type="email" placeholder="Email" className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200/90 focus:outline-hidden focus:border-[#1351b8]" />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label className="sm:w-1/4 text-xs font-medium text-slate-700">Password</label>
                <div className="sm:w-3/4">
                  <input type="password" placeholder="Password" className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200/90 focus:outline-hidden focus:border-[#1351b8]" />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <label className="sm:w-1/4 text-xs font-medium text-slate-700 pt-1">Radios</label>
                <div className="sm:w-3/4 space-y-2">
                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input type="radio" name="horizRadio" defaultChecked className="w-4 h-4 text-[#1351b8] border-slate-300" />
                    <span>First radio</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input type="radio" name="horizRadio" className="w-4 h-4 text-[#1351b8] border-slate-300" />
                    <span>Second radio</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-slate-400 cursor-not-allowed">
                    <input type="radio" disabled name="horizRadio" className="w-4 h-4 border-slate-300" />
                    <span>Third disabled radio</span>
                  </label>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label className="sm:w-1/4 text-xs font-medium text-slate-700">Checkbox</label>
                <div className="sm:w-3/4">
                  <label className="inline-flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-[#1351b8] rounded-sm border-slate-300" />
                    <span>Example checkbox</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-100">
              <button
                type="button"
                onClick={() => showToast('Sign in berhasil!', 'success')}
                className="px-5 py-2 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white text-xs font-semibold rounded-lg shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                Sign in
              </button>
            </div>
          </div>

          {/* 12. Custom Forms */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h4 className="text-base font-bold text-[#1351b8]">Custom Forms</h4>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <FormSectionTitle title="Checkbox" />
                <label className="inline-flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-[#1351b8] rounded-sm border-slate-300 focus:ring-[#1351b8]/20" />
                  <span>Check this custom checkbox</span>
                </label>
              </div>

              <div>
                <FormSectionTitle title="Radio" />
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input type="radio" name="customRadioSample" defaultChecked className="w-4 h-4 text-[#1351b8] border-slate-300" />
                    <span>Toggle this custom radio</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input type="radio" name="customRadioSample" className="w-4 h-4 text-[#1351b8] border-slate-300" />
                    <span>Or toggle this other custom radio</span>
                  </label>
                </div>
              </div>

              <div>
                <FormSectionTitle title="Inline" />
                <div className="flex items-center gap-4">
                  <label className="inline-flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input type="radio" name="customRadioInline" defaultChecked className="w-4 h-4 text-[#1351b8] border-slate-300" />
                    <span>Toggle this custom radio</span>
                  </label>
                  <label className="inline-flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input type="radio" name="customRadioInline" className="w-4 h-4 text-[#1351b8] border-slate-300" />
                    <span>Or toggle this other custom radio</span>
                  </label>
                </div>
              </div>

              <div>
                <FormSectionTitle title="Disabled" />
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs text-slate-400 cursor-not-allowed">
                    <input type="checkbox" disabled className="w-4 h-4 rounded-sm border-slate-300" />
                    <span>Check this custom checkbox</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-slate-400 cursor-not-allowed">
                    <input type="radio" disabled className="w-4 h-4 border-slate-300" />
                    <span>Toggle this custom radio</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* 13. Learn More */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h4 className="text-base font-bold text-[#1351b8]">Learn More</h4>
            </div>
            <div className="p-8 text-center bg-gradient-to-b from-slate-50/50 to-white">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-800">Learn More</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
                All the above form elements are the default of bootstrap and you can learn them on the official documentation provided by Bootstrap.
              </p>
              <div className="mt-5">
                <a
                  href="https://getbootstrap.com/docs/4.0/components/forms/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white text-xs font-semibold rounded-lg shadow-xs active:scale-95 transition-all cursor-pointer"
                >
                  <span>Learn more</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
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
            <span className="w-8 h-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full inline-block" />
            <h2 className="text-base sm:text-lg font-bold text-slate-800">Data Kelas &amp; Rombel</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Kelola data rombongan belajar, alokasi wali kelas, dan pembagian peserta ujian CBT per tingkatan.
          </p>
        </div>
        <button
          onClick={handleAddClass}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-all self-start sm:self-auto cursor-pointer active:scale-95"
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
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedTingkat === t
                      ? 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white shadow-xs'
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
            <span className="w-8 h-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full inline-block" />
            <h2 className="text-base sm:text-lg font-bold text-slate-800">Mata Pelajaran &amp; Kurikulum</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Daftar kurikulum mata pelajaran terintegrasi bank butir soal CBT dan silabus LMS.
          </p>
        </div>
        <button
          onClick={handleAddSubject}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-all self-start sm:self-auto cursor-pointer active:scale-95"
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
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedKelompok === k
                      ? 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white shadow-xs'
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

// Dedicated List Group Showcase matching ShizueFI & Stisla with Master Gradients
function ListGroupView() {
  // State for interactive Active card
  const [activeItem, setActiveItem] = useState<number>(1);

  // State for interactive Link card
  const [activeLink, setActiveLink] = useState<number>(0);

  // State for Custom Content card
  const [activeCustomItem, setActiveCustomItem] = useState<number>(0);

  // State for JavaScript Behavior tabs
  const [activeTab, setActiveTab] = useState<'home' | 'profile' | 'messages' | 'settings'>('home');

  const basicItems = [
    'Cras justo odio',
    'Dapibus ac facilisis in',
    'Morbi leo risus',
    'Porta ac consectetur ac',
    'Vestibulum at eros',
  ];

  const contextualItems = [
    { text: 'Dapibus ac facilisis in', class: 'bg-white text-slate-700 font-medium' },
    { text: 'A simple primary list group item', class: 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white font-medium' },
    { text: 'A simple secondary list group item', class: 'bg-gradient-to-r from-[#cbd5e1] to-[#94a3b8] text-slate-800 font-medium' },
    { text: 'A simple success list group item', class: 'bg-gradient-to-r from-[#22c55e] to-[#15803d] text-white font-medium' },
    { text: 'A simple danger list group item', class: 'bg-gradient-to-r from-[#ef4444] to-[#b91c1c] text-white font-medium' },
    { text: 'A simple warning list group item', class: 'bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white font-medium' },
    { text: 'A simple info list group item', class: 'bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] text-white font-medium' },
    { text: 'A simple light list group item', class: 'bg-gradient-to-r from-[#f8fafc] to-[#e2e8f0] text-slate-700 font-medium' },
    { text: 'A simple dark list group item', class: 'bg-gradient-to-r from-[#1e293b] to-[#020617] text-white font-medium' },
  ];

  const badgeItems = [
    { text: 'Cras justo odio', count: 14 },
    { text: 'Dapibus ac facilisis in', count: 2 },
    { text: 'Morbi leo risus', count: 1 },
  ];

  const customItems = [
    {
      id: 0,
      title: 'List group item heading',
      time: '3 days ago',
      desc: 'Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.',
      sub: 'Donec id elit non mi porta.',
    },
    {
      id: 1,
      title: 'List group item heading',
      time: '3 days ago',
      desc: 'Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.',
      sub: 'Donec id elit non mi porta.',
    },
    {
      id: 2,
      title: 'List group item heading',
      time: '3 days ago',
      desc: 'Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.',
      sub: 'Donec id elit non mi porta.',
    },
  ];

  const tabContents = {
    home: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    profile: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.',
    messages: 'In quis non esse eiusmod sunt fugiat magna pariatur officia anim ex officia nostrud amet nisi pariatur eu est id ut exercitation ex ad reprehenderit dolore nostrud sit ut culpa consequat magna ad labore proident ad qui et tempor exercitation in aute veniam et velit dolore irure qui ex magna ex culpa enim anim ea mollit consequat ullamco exercitation in.',
    settings: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.',
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Breadcrumb Header with Master Blue Pill Accent */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-8 h-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full inline-block" />
          <h2 className="text-base sm:text-lg font-bold text-slate-800">List Group</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500">
          List groups are a flexible and powerful component for displaying a series of content. Modify and extend them to support just about any content within.
        </p>
      </div>

      {/* 2-Column Responsive Layout matching ShizueFI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* ======================================================== */}
        {/* COLUMN 1 (LEFT) */}
        {/* ======================================================== */}
        <div className="space-y-6">
          {/* 1. Basic */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h4 className="text-base font-bold text-[#1351b8]">Basic</h4>
            </div>
            <div className="p-6">
              <ul className="rounded-xl border border-slate-200/90 overflow-hidden divide-y divide-slate-200/90 text-xs sm:text-sm font-medium text-slate-700">
                {basicItems.map((item, idx) => (
                  <li key={idx} className="px-5 py-3.5 bg-white">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 2. Disabled */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h4 className="text-base font-bold text-[#1351b8]">Disabled</h4>
            </div>
            <div className="p-6">
              <ul className="rounded-xl border border-slate-200/90 overflow-hidden divide-y divide-slate-200/90 text-xs sm:text-sm font-medium">
                {basicItems.map((item, idx) => {
                  const isDisabled = idx === 1;
                  return (
                    <li
                      key={idx}
                      className={`px-5 py-3.5 ${
                        isDisabled
                          ? 'bg-slate-50/80 text-slate-400 cursor-not-allowed select-none opacity-60'
                          : 'bg-white text-slate-700'
                      }`}
                    >
                      {item}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* 3. Flush */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h4 className="text-base font-bold text-[#1351b8]">Flush</h4>
            </div>
            <div className="p-6">
              <ul className="divide-y divide-slate-200/90 border-y border-slate-200/90 text-xs sm:text-sm font-medium text-slate-700">
                {basicItems.map((item, idx) => (
                  <li key={idx} className="px-4 py-3.5 bg-white">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 4. Badges */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h4 className="text-base font-bold text-[#1351b8]">Badges</h4>
            </div>
            <div className="p-6">
              <ul className="rounded-xl border border-slate-200/90 overflow-hidden divide-y divide-slate-200/90 text-xs sm:text-sm font-medium text-slate-700">
                {badgeItems.map((item, idx) => (
                  <li key={idx} className="px-5 py-3.5 bg-white flex items-center justify-between">
                    <span>{item.text}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#1351b8]/10 text-[#1351b8] border border-[#1351b8]/20 shadow-2xs">
                      {item.count}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 5. JavaScript Behavior */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h4 className="text-base font-bold text-[#1351b8]">JavaScript Behavior</h4>
            </div>
            <div className="p-6">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="w-full sm:w-44 shrink-0 rounded-xl border border-slate-200/90 overflow-hidden divide-y divide-slate-200/90">
                  {(['home', 'profile', 'messages', 'settings'] as const).map((tab) => {
                    const isActive = activeTab === tab;
                    const label = tab.charAt(0).toUpperCase() + tab.slice(1);
                    return (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={`w-full text-left px-4 py-3 text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-between ${
                          isActive
                            ? 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white shadow-xs'
                            : 'bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span>{label}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="flex-1 text-xs sm:text-sm text-slate-600 leading-relaxed pt-1 animate-in fade-in duration-200">
                  {tabContents[activeTab]}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* COLUMN 2 (RIGHT) */}
        {/* ======================================================== */}
        <div className="space-y-6">
          {/* 1. Active */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h4 className="text-base font-bold text-[#1351b8]">Active</h4>
            </div>
            <div className="p-6">
              <ul className="rounded-xl border border-slate-200/90 overflow-hidden divide-y divide-slate-200/90 text-xs sm:text-sm font-medium">
                {basicItems.map((item, idx) => {
                  const isActive = activeItem === idx;
                  return (
                    <li
                      key={idx}
                      onClick={() => setActiveItem(idx)}
                      className={`px-5 py-3.5 transition-all cursor-pointer select-none ${
                        isActive
                          ? 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white shadow-xs font-semibold'
                          : 'bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {item}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* 2. Link */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h4 className="text-base font-bold text-[#1351b8]">Link</h4>
            </div>
            <div className="p-6">
              <div className="rounded-xl border border-slate-200/90 overflow-hidden divide-y divide-slate-200/90 text-xs sm:text-sm font-medium">
                {basicItems.map((item, idx) => {
                  const isDisabled = idx === 4;
                  const isActive = activeLink === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => {
                        if (!isDisabled) {
                          setActiveLink(idx);
                          showToast(`Link "${item}" dipilih!`, 'info');
                        }
                      }}
                      className={`w-full text-left px-5 py-3.5 transition-all select-none ${
                        isDisabled
                          ? 'bg-slate-50/80 text-slate-400 cursor-not-allowed opacity-60'
                          : isActive
                          ? 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white shadow-xs font-semibold cursor-pointer'
                          : 'bg-white hover:bg-slate-50 text-slate-700 cursor-pointer'
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3. Contextual Classes */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h4 className="text-base font-bold text-[#1351b8]">Contextual Classes</h4>
            </div>
            <div className="p-6">
              <ul className="rounded-xl border border-slate-200/90 overflow-hidden divide-y divide-slate-200/90 text-xs sm:text-sm">
                {contextualItems.map((item, idx) => (
                  <li key={idx} className={`px-5 py-3.5 ${item.class}`}>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 4. Custom Content */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h4 className="text-base font-bold text-[#1351b8]">Custom Content</h4>
            </div>
            <div className="p-6">
              <div className="rounded-xl border border-slate-200/90 overflow-hidden divide-y divide-slate-200/90 text-xs sm:text-sm">
                {customItems.map((item, idx) => {
                  const isActive = activeCustomItem === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        setActiveCustomItem(idx);
                        showToast(`Item "${item.title}" dipilih!`, 'info');
                      }}
                      className={`p-5 transition-all cursor-pointer select-none ${
                        isActive
                          ? 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white shadow-xs'
                          : 'bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <h5 className={`text-sm sm:text-base font-bold ${isActive ? 'text-white' : 'text-slate-800'}`}>
                          {item.title}
                        </h5>
                        <span className={`text-[11px] sm:text-xs font-normal ${isActive ? 'text-white/80' : 'text-slate-400'}`}>
                          {item.time}
                        </span>
                      </div>
                      <p className={`text-xs sm:text-sm mb-2 leading-relaxed ${isActive ? 'text-white/95' : 'text-slate-600'}`}>
                        {item.desc}
                      </p>
                      <p className={`text-[11px] sm:text-xs font-normal ${isActive ? 'text-white/75' : 'text-slate-400'}`}>
                        {item.sub}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dedicated Media Object Showcase matching ShizueFI & Stisla
function MediaObjectView() {
  const dummyText =
    'Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.';

  const shortText =
    'Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus oringilla. Donec lacinia congue felis in faucibus.';

  const renderMediaThumbnail = () => (
    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-blue-50/80 border border-blue-100 flex items-center justify-center text-[#1351b8] shrink-0 shadow-2xs">
      <ImageIcon className="w-6 h-6 sm:w-7 sm:h-7 opacity-80" />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page Title & Breadcrumb Header with Master Blue Pill Accent */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-8 h-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full inline-block" />
          <h2 className="text-base sm:text-lg font-bold text-slate-800">Media Object</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500">
          Examples for Bootstrap's media object to construct highly repetitive components like blog comments, tweets, and the like.
        </p>
      </div>

      {/* 2-Column Responsive Layout matching ShizueFI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* ======================================================== */}
        {/* COLUMN 1 (LEFT) */}
        {/* ======================================================== */}
        <div className="space-y-6">
          {/* 1. Simple */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h4 className="text-base font-bold text-[#1351b8]">Simple</h4>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-4 sm:gap-5">
                {renderMediaThumbnail()}
                <div className="space-y-1">
                  <h5 className="text-sm sm:text-base font-bold text-slate-800">Media heading</h5>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {dummyText}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 2. List */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h4 className="text-base font-bold text-[#1351b8]">List</h4>
            </div>
            <div className="p-6 space-y-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-start gap-4 sm:gap-5">
                  {renderMediaThumbnail()}
                  <div className="space-y-1">
                    <h5 className="text-sm sm:text-base font-bold text-slate-800">List-based media object</h5>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      {shortText}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* COLUMN 2 (RIGHT) */}
        {/* ======================================================== */}
        <div className="space-y-6">
          {/* 3. Nesting */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h4 className="text-base font-bold text-[#1351b8]">Nesting</h4>
            </div>
            <div className="p-6 space-y-6">
              {/* Parent Media */}
              <div className="flex items-start gap-4 sm:gap-5">
                {renderMediaThumbnail()}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h5 className="text-sm sm:text-base font-bold text-slate-800">Media heading</h5>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      {dummyText}
                    </p>
                  </div>

                  {/* Nested Child Media */}
                  <div className="flex items-start gap-4 sm:gap-5 pt-1">
                    {renderMediaThumbnail()}
                    <div className="space-y-1">
                      <h5 className="text-sm sm:text-base font-bold text-slate-800">Media heading</h5>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                        {dummyText}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Order */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h4 className="text-base font-bold text-[#1351b8]">Order</h4>
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between gap-4 sm:gap-5">
                <div className="space-y-1 flex-1">
                  <h5 className="text-sm sm:text-base font-bold text-slate-800">Media object</h5>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {dummyText}
                  </p>
                </div>
                {renderMediaThumbnail()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dedicated Modal Showcase matching ShizueFI & Stisla with Master Gradients & Full Interactivity
function ModalView() {
  const [activeModal, setActiveModal] = useState<
    'demo' | 'center' | 'confirm' | 'bootstrap' | 'buttons' | 'footer-bg' | 'login' | 'footer-extra' | null
  >(null);

  // Login form state inside Login modal
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginRemember, setLoginRemember] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const closeModal = () => setActiveModal(null);

  return (
    <div className="space-y-6">
      {/* Page Title & Breadcrumb Header with Master Blue Pill Accent */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-8 h-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full inline-block" />
          <h2 className="text-base sm:text-lg font-bold text-slate-800">Modal</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500">
          Use Bootstrap's JavaScript modal plugin to add dialogs to your site for lightboxes, user notifications, or completely custom content.
        </p>
      </div>

      {/* 2-Column Responsive Layout matching ShizueFI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* ======================================================== */}
        {/* COLUMN 1 (LEFT) */}
        {/* ======================================================== */}
        <div className="space-y-6">
          {/* 1. Modal Template */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h4 className="text-base font-bold text-[#1351b8]">Modal Template</h4>
            </div>
            <div className="p-6">
              <div className="rounded-xl border border-slate-200/90 shadow-sm overflow-hidden bg-white max-w-md">
                <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
                  <h5 className="text-sm font-bold text-slate-800">Modal Template</h5>
                  <button
                    type="button"
                    onClick={() => showToast('Modal template preview close icon', 'info')}
                    className="text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-5">
                  <p className="text-xs sm:text-sm text-slate-600 font-normal">
                    Modal body text goes here.
                  </p>
                </div>
                <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => showToast('Perubahan disimpan!', 'success')}
                    className="px-4 py-2 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white text-xs font-semibold rounded-lg shadow-xs transition-all active:scale-95 cursor-pointer"
                  >
                    Save changes
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast('Modal ditutup', 'info')}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg transition-all active:scale-95 cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Modal Confirm */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h4 className="text-base font-bold text-[#1351b8]">Modal Confirm</h4>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                You can easily change the default browser confirmation box with a bootstrap modal.
              </p>
              <button
                type="button"
                onClick={() => setActiveModal('confirm')}
                className="px-4 py-2 bg-gradient-to-r from-[#ef4444] to-[#b91c1c] hover:from-[#dc2626] hover:to-[#991b1b] text-white text-xs font-semibold rounded-lg shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>

          {/* 3. The Bootstrap Way */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h4 className="text-base font-bold text-[#1351b8]">The Bootstrap Way</h4>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Use the Bootstrap method to create modal. You need to create an HTML structure for modal and the following button will trigger it.
              </p>
              <button
                type="button"
                onClick={() => setActiveModal('bootstrap')}
                className="px-4 py-2 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white text-xs font-semibold rounded-lg shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                Aw, yeah!
              </button>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* COLUMN 2 (RIGHT) */}
        {/* ======================================================== */}
        <div className="space-y-6">
          {/* 4. Modal Demo */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h4 className="text-base font-bold text-[#1351b8]">Modal Demo</h4>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                We've created a plugin to easily create a bootstrap modal.
              </p>
              <button
                type="button"
                onClick={() => setActiveModal('demo')}
                className="px-4 py-2 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white text-xs font-semibold rounded-lg shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                Launch Modal
              </button>
            </div>
          </div>

          {/* 5. Modal Center */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h4 className="text-base font-bold text-[#1351b8]">Modal Center</h4>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                You can change the modal position to center.
              </p>
              <button
                type="button"
                onClick={() => setActiveModal('center')}
                className="px-4 py-2 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white text-xs font-semibold rounded-lg shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                Launch Modal
              </button>
            </div>
          </div>

          {/* 6. The Others */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h4 className="text-base font-bold text-[#1351b8]">The Others</h4>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Check the modal.js code in the dist/js/page folder to get the source code.
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModal('buttons')}
                  className="px-3.5 py-2 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white text-xs font-semibold rounded-lg shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  Buttons
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModal('footer-bg')}
                  className="px-3.5 py-2 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white text-xs font-semibold rounded-lg shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  Footer Background
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModal('login')}
                  className="px-3.5 py-2 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white text-xs font-semibold rounded-lg shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModal('footer-extra')}
                  className="px-3.5 py-2 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white text-xs font-semibold rounded-lg shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  Something in the Footer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* INTERACTIVE MODAL DIALOGS */}
      {/* ======================================================== */}

      {/* 1. Modal Demo (Top Aligned matching Image 1) */}
      {activeModal === 'demo' && (
        <div
          onClick={closeModal}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-2xs flex items-start justify-center pt-16 sm:pt-24 p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200"
          >
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h4 className="text-base font-bold text-slate-800">Modal Title</h4>
              <button
                type="button"
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                Modal body text goes here. Posisi modal ini berada di bagian atas layar (top-aligned) sesuai dengan standar Bootstrap modal demo.
              </p>
            </div>
            <div className="px-6 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  showToast('Perubahan berhasil disimpan!', 'success');
                  closeModal();
                }}
                className="px-4 py-2 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white text-xs font-semibold rounded-lg shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                Save changes
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg transition-all active:scale-95 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal Center (Center Aligned matching Image 2) */}
      {activeModal === 'center' && (
        <div
          onClick={closeModal}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200"
          >
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h4 className="text-base font-bold text-slate-800">Modal Title</h4>
              <button
                type="button"
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                Modal body text goes here. Posisi modal ini secara presisi berada di tengah layar secara vertikal dan horizontal (vertically centered).
              </p>
            </div>
            <div className="px-6 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  showToast('Perubahan berhasil disimpan!', 'success');
                  closeModal();
                }}
                className="px-4 py-2 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white text-xs font-semibold rounded-lg shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                Save changes
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg transition-all active:scale-95 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Modal Confirm (Delete Alert) */}
      {activeModal === 'confirm' && (
        <div
          onClick={closeModal}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200"
          >
            <div className="p-6 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shadow-inner">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-base font-bold text-slate-800">Konfirmasi Penghapusan</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Apakah Anda yakin ingin menghapus data ini? Tindakan ini bersifat permanen dan tidak dapat dibatalkan.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    showToast('Data berhasil dihapus!', 'warning');
                    closeModal();
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#ef4444] to-[#b91c1c] hover:from-[#dc2626] hover:to-[#991b1b] text-white text-xs font-semibold rounded-lg shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  Ya, Hapus Data
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-all active:scale-95 cursor-pointer"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. The Bootstrap Way Modal */}
      {activeModal === 'bootstrap' && (
        <div
          onClick={closeModal}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200"
          >
            <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#1351b8]" />
                <h4 className="text-base font-bold text-slate-800">Aw, yeah! Bootstrap Modal</h4>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-3">
              <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                Modal ini dipicu dengan metode standar HTML structure &amp; JavaScript event handler. Terintegrasi sempurna dengan animasi Tailwind CSS dan ekosistem React.
              </p>
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100/80 text-xs text-[#1351b8] leading-relaxed font-medium">
                💡 <b>Tips:</b> Anda dapat menekan tombol <b>Escape</b> pada keyboard atau mengklik di luar area modal untuk menutup jendela ini secara instan.
              </div>
            </div>
            <div className="px-6 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={closeModal}
                className="px-5 py-2 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white text-xs font-semibold rounded-lg shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                Keren, Mengerti!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Custom Buttons Modal */}
      {activeModal === 'buttons' && (
        <div
          onClick={closeModal}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200"
          >
            <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between">
              <h4 className="text-base font-bold text-slate-800">Multiple Action Buttons</h4>
              <button
                type="button"
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                Modal ini mendemonstrasikan berbagai varian tombol tindakan di footer modal dengan gradien warna dasar yang konsisten.
              </p>
            </div>
            <div className="px-6 py-3.5 bg-slate-50/70 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  showToast('Aksi Danger diklik', 'warning');
                  closeModal();
                }}
                className="px-3.5 py-1.5 bg-gradient-to-r from-[#ef4444] to-[#b91c1c] hover:from-[#dc2626] hover:to-[#991b1b] text-white text-xs font-semibold rounded-lg shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                Danger
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast('Aksi Success diklik', 'success');
                  closeModal();
                }}
                className="px-3.5 py-1.5 bg-gradient-to-r from-[#22c55e] to-[#15803d] hover:from-[#16a34a] hover:to-[#166534] text-white text-xs font-semibold rounded-lg shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                Success
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast('Aksi Info diklik', 'info');
                  closeModal();
                }}
                className="px-3.5 py-1.5 bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] hover:from-[#0284c7] hover:to-[#0369a1] text-white text-xs font-semibold rounded-lg shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                Info
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg transition-all active:scale-95 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Footer Background Modal */}
      {activeModal === 'footer-bg' && (
        <div
          onClick={closeModal}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200"
          >
            <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between">
              <h4 className="text-base font-bold text-slate-800">Footer Background Variant</h4>
              <button
                type="button"
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                Modal ini menampilkan kustomisasi footer dengan warna latar belakang khusus yang elegan dan kontras.
              </p>
            </div>
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Dark Footer Styling</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    showToast('Tersimpan di Dark Footer!', 'success');
                    closeModal();
                  }}
                  className="px-4 py-1.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white text-xs font-semibold rounded-lg shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-all active:scale-95 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. Login Form Modal */}
      {activeModal === 'login' && (
        <div
          onClick={closeModal}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200"
          >
            <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between">
              <h4 className="text-base font-bold text-slate-800">Login to Account</h4>
              <button
                type="button"
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                showToast(`Login berhasil sebagai ${loginEmail || 'pengguna'}!`, 'success');
                closeModal();
              }}
              className="p-6 space-y-4"
            >
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Email Address</label>
                <div className="flex rounded-lg border border-slate-200 overflow-hidden focus-within:border-[#1351b8] focus-within:ring-2 focus-within:ring-[#1351b8]/15 transition-all">
                  <div className="px-3 py-2 bg-slate-50 border-r border-slate-200 flex items-center justify-center text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm text-slate-800 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Password</label>
                <div className="flex rounded-lg border border-slate-200 overflow-hidden focus-within:border-[#1351b8] focus-within:ring-2 focus-within:ring-[#1351b8]/15 transition-all">
                  <div className="px-3 py-2 bg-slate-50 border-r border-slate-200 flex items-center justify-center text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm text-slate-800 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600">
                  <input
                    type="checkbox"
                    checked={loginRemember}
                    onChange={(e) => setLoginRemember(e.target.checked)}
                    className="w-4 h-4 text-[#1351b8] rounded-sm border-slate-300 focus:ring-[#1351b8]/20"
                  />
                  <span>Remember Me</span>
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    showToast('Navigasi reset password', 'info');
                  }}
                  className="text-[#1351b8] hover:underline font-semibold"
                >
                  Forgot Password?
                </a>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-all active:scale-98 cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. Something in the Footer Modal */}
      {activeModal === 'footer-extra' && (
        <div
          onClick={closeModal}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200"
          >
            <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between">
              <h4 className="text-base font-bold text-slate-800">Something in the Footer</h4>
              <button
                type="button"
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                Modal ini menampilkan elemen tambahan di bagian kiri footer (seperti checkbox persetujuan atau opsi "Jangan tampilkan lagi").
              </p>
            </div>
            <div className="px-6 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-3">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                  className="w-4 h-4 text-[#1351b8] rounded-sm border-slate-300 focus:ring-[#1351b8]/20"
                />
                <span>Jangan tampilkan lagi</span>
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    showToast('Pilihan disimpan!', 'success');
                    closeModal();
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white text-xs font-semibold rounded-lg shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  Save changes
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg transition-all active:scale-95 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Dedicated Nav Showcase matching ShizueFI & Stisla with Master Gradients & Full Interactivity
function NavView() {
  // State for interactive Base Nav
  const [activeBaseNav, setActiveBaseNav] = useState<number>(0);

  // State for interactive Vertical Nav
  const [activeVerticalNav, setActiveVerticalNav] = useState<number>(0);

  // State for interactive Tabs
  const [activeTabNav, setActiveTabNav] = useState<number>(0);

  // State for interactive Simple Pills
  const [activeSimplePill, setActiveSimplePill] = useState<number>(0);

  // State for interactive Icon Pills
  const [activeIconPill, setActiveIconPill] = useState<number>(0);

  const navLinks = ['Active', 'Link', 'Link', 'Disabled'];

  const iconPills = [
    { name: 'Home', icon: Home },
    { name: 'Profile', icon: User },
    { name: 'Setting', icon: Settings },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title & Breadcrumb Header with Master Blue Pill Accent */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-8 h-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full inline-block" />
          <h2 className="text-base sm:text-lg font-bold text-slate-800">Navs</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500">
          Examples for how to use Bootstrap’s included navigation components.
        </p>
      </div>

      {/* 2-Column Responsive Layout matching ShizueFI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* ======================================================== */}
        {/* COLUMN 1 (LEFT) */}
        {/* ======================================================== */}
        <div className="space-y-6">
          {/* 1. Base Nav */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h4 className="text-base font-bold text-[#1351b8]">Base Nav</h4>
            </div>
            <div className="p-6">
              <nav className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm">
                {navLinks.map((link, idx) => {
                  const isDisabled = idx === 3;
                  const isActive = activeBaseNav === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => {
                        if (!isDisabled) {
                          setActiveBaseNav(idx);
                          showToast(`Nav item "${link}" aktif!`, 'info');
                        }
                      }}
                      className={`font-semibold transition-all select-none ${
                        isDisabled
                          ? 'text-slate-300 cursor-not-allowed'
                          : isActive
                          ? 'text-[#1351b8] cursor-pointer'
                          : 'text-[#1351b8] hover:text-[#0c2869] hover:underline cursor-pointer'
                      }`}
                    >
                      {link}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* 2. Vertical Nav */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h4 className="text-base font-bold text-[#1351b8]">Vertical</h4>
            </div>
            <div className="p-6">
              <nav className="flex flex-col space-y-3 text-xs sm:text-sm">
                {navLinks.map((link, idx) => {
                  const isDisabled = idx === 3;
                  const isActive = activeVerticalNav === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => {
                        if (!isDisabled) {
                          setActiveVerticalNav(idx);
                          showToast(`Vertical nav "${link}" aktif!`, 'info');
                        }
                      }}
                      className={`text-left font-semibold transition-all select-none self-start ${
                        isDisabled
                          ? 'text-slate-300 cursor-not-allowed'
                          : isActive
                          ? 'text-[#1351b8] cursor-pointer'
                          : 'text-[#1351b8] hover:text-[#0c2869] hover:underline cursor-pointer'
                      }`}
                    >
                      {link}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* COLUMN 2 (RIGHT) */}
        {/* ======================================================== */}
        <div className="space-y-6">
          {/* 3. Tabs */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h4 className="text-base font-bold text-[#1351b8]">Tabs</h4>
            </div>
            <div className="p-6">
              <div className="border-b border-slate-200">
                <nav className="flex flex-wrap items-center -mb-px gap-1 text-xs sm:text-sm">
                  {navLinks.map((link, idx) => {
                    const isDisabled = idx === 3;
                    const isActive = activeTabNav === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => {
                          if (!isDisabled) {
                            setActiveTabNav(idx);
                            showToast(`Tab "${link}" aktif!`, 'info');
                          }
                        }}
                        className={`px-4 py-2.5 font-semibold transition-all select-none rounded-t-lg border-b-2 ${
                          isDisabled
                            ? 'text-slate-300 border-transparent cursor-not-allowed'
                            : isActive
                            ? 'text-slate-800 bg-white border-slate-200 border-t border-x border-b-white font-bold cursor-pointer'
                            : 'text-[#1351b8] border-transparent hover:text-slate-700 hover:border-slate-300 cursor-pointer'
                        }`}
                      >
                        {link}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>

          {/* 4. Pills */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h4 className="text-base font-bold text-[#1351b8]">Pills</h4>
            </div>
            <div className="p-6 space-y-6">
              {/* Sub-section 1: Simple */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-2 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full inline-block" />
                  <h5 className="text-xs sm:text-sm font-bold text-slate-800">Simple</h5>
                </div>
                <nav className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                  {navLinks.map((link, idx) => {
                    const isDisabled = idx === 3;
                    const isActive = activeSimplePill === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => {
                          if (!isDisabled) {
                            setActiveSimplePill(idx);
                            showToast(`Pill "${link}" aktif!`, 'info');
                          }
                        }}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all select-none ${
                          isDisabled
                            ? 'text-slate-300 cursor-not-allowed'
                            : isActive
                            ? 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white shadow-xs cursor-pointer'
                            : 'text-[#1351b8] hover:bg-slate-100 cursor-pointer'
                        }`}
                      >
                        {link}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Sub-section 2: Icon */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-2 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full inline-block" />
                  <h5 className="text-xs sm:text-sm font-bold text-slate-800">Icon</h5>
                </div>
                <nav className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                  {iconPills.map((pill, idx) => {
                    const Icon = pill.icon;
                    const isActive = activeIconPill === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setActiveIconPill(idx);
                          showToast(`Icon Pill "${pill.name}" aktif!`, 'info');
                        }}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all select-none cursor-pointer ${
                          isActive
                            ? 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white shadow-xs'
                            : 'text-[#1351b8] hover:bg-slate-100'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{pill.name}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dedicated Navbar Showcase matching ShizueFI & Stisla with Master Gradients & Interactivity
function NavbarView() {
  const [activeItemIdx, setActiveItemIdx] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  return (
    <div className="space-y-6">
      {/* Page Title & Breadcrumb Header with Master Blue Pill Accent */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-8 h-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full inline-block" />
          <h2 className="text-base sm:text-lg font-bold text-slate-800">Navbar</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500">
          Examples for Bootstrap’s powerful, responsive navigation header, the navbar. Includes support for branding, navigation, and more, including support for our collapse plugin.
        </p>
      </div>

      {/* Full-width Stacked Cards Layout matching ShizueFI */}
      <div className="space-y-6">
        {/* 1. Brand */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="px-6 py-4.5 border-b border-slate-100">
            <h4 className="text-base font-bold text-[#1351b8]">Brand</h4>
          </div>
          <div className="p-6">
            <div className="bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white rounded-xl px-5 sm:px-6 py-3.5 sm:py-4 shadow-xs flex items-center justify-between">
              <span className="font-bold tracking-widest text-white uppercase text-sm sm:text-base select-none">
                MY APP
              </span>
            </div>
          </div>
        </div>

        {/* 2. Items */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="px-6 py-4.5 border-b border-slate-100">
            <h4 className="text-base font-bold text-[#1351b8]">Items</h4>
          </div>
          <div className="p-6">
            <div className="bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white rounded-xl px-5 sm:px-6 py-3 sm:py-3.5 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <span className="font-bold tracking-widest text-white uppercase text-sm sm:text-base select-none">
                MY APP
              </span>
              <nav className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium">
                {['Home', 'Features', 'Pricing', 'About'].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setActiveItemIdx(idx);
                      showToast(`Navigasi ke "${item}"`, 'info');
                    }}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer select-none ${
                      activeItemIdx === idx
                        ? 'bg-white/20 text-white font-bold shadow-2xs'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* 3. Form */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="px-6 py-4.5 border-b border-slate-100">
            <h4 className="text-base font-bold text-[#1351b8]">Form</h4>
          </div>
          <div className="p-6">
            <div className="bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white rounded-xl px-5 sm:px-6 py-3.5 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <span className="font-bold tracking-widest text-white uppercase text-sm sm:text-base select-none">
                MY APP
              </span>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  showToast(`Mencari: "${searchQuery || 'Semua Data'}"`, 'info');
                }}
                className="flex rounded-lg overflow-hidden bg-white shadow-2xs border border-slate-200/80"
              >
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-3.5 py-1.5 text-xs text-slate-800 outline-none w-36 sm:w-48 placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:text-[#1351b8] bg-slate-50 hover:bg-slate-100 border-l border-slate-200 transition-colors cursor-pointer"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* 4. Text */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="px-6 py-4.5 border-b border-slate-100">
            <h4 className="text-base font-bold text-[#1351b8]">Text</h4>
          </div>
          <div className="p-6">
            <div className="bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white rounded-xl px-5 sm:px-6 py-3.5 sm:py-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <span className="font-bold tracking-widest text-white uppercase text-sm sm:text-base select-none">
                MY APP
              </span>
              <span className="text-xs sm:text-sm text-white/90 font-medium">
                Navbar text with an inline element
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dedicated Pagination Showcase matching ShizueFI & Stisla with Master Gradients & Interactivity
function PaginationView() {
  const [activeBasicPage, setActiveBasicPage] = useState<number>(1);
  const [activeDisabledPage, setActiveDisabledPage] = useState<number>(2);
  const [activeIconPage, setActiveIconPage] = useState<number>(1);
  const [activeSmallPage, setActiveSmallPage] = useState<number>(1);
  const [activeLargePage, setActiveLargePage] = useState<number>(2);

  const pages = [1, 2, 3];

  return (
    <div className="space-y-6">
      {/* Page Title & Breadcrumb Header with Master Blue Pill Accent */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-8 h-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full inline-block" />
          <h2 className="text-base sm:text-lg font-bold text-slate-800">Pagination</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500">
          Examples for showing pagination to indicate a series of related content exists across multiple pages.
        </p>
      </div>

      {/* 2-Column Responsive Layout matching ShizueFI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* ======================================================== */}
        {/* COLUMN 1 (LEFT) */}
        {/* ======================================================== */}
        <div className="space-y-6">
          {/* 1. Card: Pagination */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h4 className="text-base font-bold text-[#1351b8]">Pagination</h4>
            </div>
            <div className="p-6">
              <nav aria-label="Basic Pagination" className="flex items-center gap-1 select-none">
                <button
                  type="button"
                  disabled={activeBasicPage <= 1}
                  onClick={() => {
                    if (activeBasicPage > 1) {
                      setActiveBasicPage((p) => p - 1);
                      showToast(`Halaman ${activeBasicPage - 1}`, 'info');
                    }
                  }}
                  className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                    activeBasicPage <= 1
                      ? 'text-slate-300 cursor-not-allowed'
                      : 'text-[#1351b8] hover:bg-slate-100 cursor-pointer'
                  }`}
                >
                  Previous
                </button>
                {pages.map((p) => {
                  const isActive = activeBasicPage === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        setActiveBasicPage(p);
                        showToast(`Halaman ${p}`, 'info');
                      }}
                      className={`min-w-[36px] h-9 px-3 flex items-center justify-center text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white shadow-xs font-bold'
                          : 'text-[#1351b8] hover:bg-slate-100'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  type="button"
                  disabled={activeBasicPage >= pages.length}
                  onClick={() => {
                    if (activeBasicPage < pages.length) {
                      setActiveBasicPage((p) => p + 1);
                      showToast(`Halaman ${activeBasicPage + 1}`, 'info');
                    }
                  }}
                  className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                    activeBasicPage >= pages.length
                      ? 'text-slate-300 cursor-not-allowed'
                      : 'text-[#1351b8] hover:bg-slate-100 cursor-pointer'
                  }`}
                >
                  Next
                </button>
              </nav>
            </div>
          </div>

          {/* 2. Card: Disabled & Active State */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h4 className="text-base font-bold text-[#1351b8]">Disabled &amp; Active State</h4>
            </div>
            <div className="p-6">
              <nav aria-label="Disabled and Active Pagination" className="flex items-center gap-1 select-none">
                <span className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-300 cursor-not-allowed">
                  Previous
                </span>
                {pages.map((p) => {
                  const isActive = activeDisabledPage === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        setActiveDisabledPage(p);
                        showToast(`Halaman aktif: ${p}`, 'info');
                      }}
                      className={`min-w-[36px] h-9 px-3 flex items-center justify-center text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white shadow-xs font-bold'
                          : 'text-[#1351b8] hover:bg-slate-100'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => {
                    if (activeDisabledPage < pages.length) {
                      setActiveDisabledPage((p) => p + 1);
                      showToast(`Halaman ${activeDisabledPage + 1}`, 'info');
                    }
                  }}
                  className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-[#1351b8] hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* COLUMN 2 (RIGHT) */}
        {/* ======================================================== */}
        <div className="space-y-6">
          {/* 3. Card: Icon */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h4 className="text-base font-bold text-[#1351b8]">Icon</h4>
            </div>
            <div className="p-6">
              <nav aria-label="Icon Pagination" className="flex items-center gap-1 select-none">
                <button
                  type="button"
                  disabled={activeIconPage <= 1}
                  onClick={() => {
                    if (activeIconPage > 1) {
                      setActiveIconPage((p) => p - 1);
                      showToast(`Halaman ${activeIconPage - 1}`, 'info');
                    }
                  }}
                  className={`min-w-[36px] h-9 px-3 flex items-center justify-center text-sm font-bold rounded-lg transition-all ${
                    activeIconPage <= 1
                      ? 'text-slate-300 cursor-not-allowed'
                      : 'text-[#1351b8] hover:bg-slate-100 cursor-pointer'
                  }`}
                  aria-label="Previous"
                >
                  &laquo;
                </button>
                {pages.map((p) => {
                  const isActive = activeIconPage === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        setActiveIconPage(p);
                        showToast(`Halaman ${p}`, 'info');
                      }}
                      className={`min-w-[36px] h-9 px-3 flex items-center justify-center text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white shadow-xs font-bold'
                          : 'text-[#1351b8] hover:bg-slate-100'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  type="button"
                  disabled={activeIconPage >= pages.length}
                  onClick={() => {
                    if (activeIconPage < pages.length) {
                      setActiveIconPage((p) => p + 1);
                      showToast(`Halaman ${activeIconPage + 1}`, 'info');
                    }
                  }}
                  className={`min-w-[36px] h-9 px-3 flex items-center justify-center text-sm font-bold rounded-lg transition-all ${
                    activeIconPage >= pages.length
                      ? 'text-slate-300 cursor-not-allowed'
                      : 'text-[#1351b8] hover:bg-slate-100 cursor-pointer'
                  }`}
                  aria-label="Next"
                >
                  &raquo;
                </button>
              </nav>
            </div>
          </div>

          {/* 4. Card: Sizing */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h4 className="text-base font-bold text-[#1351b8]">Sizing</h4>
            </div>
            <div className="p-6 space-y-6">
              {/* Small Pagination */}
              <div>
                <nav aria-label="Small Pagination" className="flex items-center gap-1 select-none">
                  {pages.map((p) => {
                    const isActive = activeSmallPage === p;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => {
                          setActiveSmallPage(p);
                          showToast(`Small pagination: ${p}`, 'info');
                        }}
                        className={`min-w-[28px] h-7 px-2.5 flex items-center justify-center text-xs font-semibold rounded-md transition-all cursor-pointer ${
                          isActive
                            ? 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white shadow-xs font-bold'
                            : 'text-[#1351b8] hover:bg-slate-100'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Large Pagination */}
              <div>
                <nav aria-label="Large Pagination" className="flex items-center gap-1.5 select-none">
                  {pages.map((p) => {
                    const isActive = activeLargePage === p;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => {
                          setActiveLargePage(p);
                          showToast(`Large pagination: ${p}`, 'info');
                        }}
                        className={`min-w-[44px] h-11 px-4 flex items-center justify-center text-sm sm:text-base font-bold rounded-xl transition-all cursor-pointer ${
                          isActive
                            ? 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white shadow-xs'
                            : 'text-[#1351b8] hover:bg-slate-100'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dedicated Popover Showcase matching ShizueFI & Stisla with Master Gradients & Interactivity
function PopoverView() {
  const [activeDirection, setActiveDirection] = useState<'top' | 'right' | 'bottom' | 'left' | null>(null);
  const [isDisabledPopoverOpen, setIsDisabledPopoverOpen] = useState(false);
  const [isDismissibleOpen, setIsDismissibleOpen] = useState(false);
  const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false);

  const toggleDirection = (dir: 'top' | 'right' | 'bottom' | 'left') => {
    setActiveDirection((prev) => (prev === dir ? null : dir));
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Breadcrumb Header with Master Blue Pill Accent */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-8 h-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full inline-block" />
          <h2 className="text-base sm:text-lg font-bold text-slate-800">Popovers</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500">
          Examples for adding Bootstrap popovers, like those found in iOS, to any element on your site.
        </p>
      </div>

      {/* 2-Column Responsive Layout matching ShizueFI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* ======================================================== */}
        {/* COLUMN 1 (LEFT) */}
        {/* ======================================================== */}
        <div className="space-y-6">
          {/* 1. Card: Directions */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs relative">
            <div className="px-6 py-4.5 border-b border-slate-100 rounded-t-2xl">
              <h4 className="text-base font-bold text-[#1351b8]">Directions</h4>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap items-center gap-3">
                {/* On Top */}
                <div className="relative inline-block">
                  <button
                    type="button"
                    onClick={() => toggleDirection('top')}
                    className={`px-4 py-2 text-xs font-semibold rounded-lg shadow-xs transition-all active:scale-95 cursor-pointer ${
                      activeDirection === 'top'
                        ? 'bg-slate-300 text-slate-800 font-bold'
                        : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                    }`}
                  >
                    On top
                  </button>
                  {activeDirection === 'top' && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 bg-white rounded-xl shadow-xl border border-slate-200 text-xs text-slate-700 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <p className="leading-relaxed font-normal">Vivamus sagittis lacus vel augue laoreet rutrum faucibus.</p>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-6 border-x-transparent border-t-6 border-t-white" />
                    </div>
                  )}
                </div>

                {/* On Right */}
                <div className="relative inline-block">
                  <button
                    type="button"
                    onClick={() => toggleDirection('right')}
                    className={`px-4 py-2 text-xs font-semibold rounded-lg shadow-xs transition-all active:scale-95 cursor-pointer ${
                      activeDirection === 'right'
                        ? 'bg-slate-300 text-slate-800 font-bold'
                        : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                    }`}
                  >
                    On right
                  </button>
                  {activeDirection === 'right' && (
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 w-48 p-2.5 bg-white rounded-xl shadow-xl border border-slate-200 text-xs text-slate-700 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <p className="leading-relaxed font-normal">Vivamus sagittis lacus vel augue laoreet rutrum faucibus.</p>
                      <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-y-6 border-y-transparent border-r-6 border-r-white" />
                    </div>
                  )}
                </div>

                {/* On Bottom */}
                <div className="relative inline-block">
                  <button
                    type="button"
                    onClick={() => toggleDirection('bottom')}
                    className={`px-4 py-2 text-xs font-semibold rounded-lg shadow-xs transition-all active:scale-95 cursor-pointer ${
                      activeDirection === 'bottom'
                        ? 'bg-slate-300 text-slate-800 font-bold'
                        : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                    }`}
                  >
                    On bottom
                  </button>
                  {activeDirection === 'bottom' && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 p-2.5 bg-white rounded-xl shadow-xl border border-slate-200 text-xs text-slate-700 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <p className="leading-relaxed font-normal">Vivamus sagittis lacus vel augue laoreet rutrum faucibus.</p>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-6 border-x-transparent border-b-6 border-b-white" />
                    </div>
                  )}
                </div>

                {/* On Left */}
                <div className="relative inline-block">
                  <button
                    type="button"
                    onClick={() => toggleDirection('left')}
                    className={`px-4 py-2 text-xs font-semibold rounded-lg shadow-xs transition-all active:scale-95 cursor-pointer ${
                      activeDirection === 'left'
                        ? 'bg-slate-300 text-slate-800 font-bold'
                        : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                    }`}
                  >
                    On left
                  </button>
                  {activeDirection === 'left' && (
                    <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 w-48 p-2.5 bg-white rounded-xl shadow-xl border border-slate-200 text-xs text-slate-700 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <p className="leading-relaxed font-normal">Vivamus sagittis lacus vel augue laoreet rutrum faucibus.</p>
                      <div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-y-6 border-y-transparent border-l-6 border-l-white" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Card: Disabled Popover */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs relative">
            <div className="px-6 py-4.5 border-b border-slate-100 rounded-t-2xl">
              <h4 className="text-base font-bold text-[#1351b8]">Disabled Popover</h4>
            </div>
            <div className="p-6">
              <div
                className="relative inline-block"
                onMouseEnter={() => setIsDisabledPopoverOpen(true)}
                onMouseLeave={() => setIsDisabledPopoverOpen(false)}
                onClick={() => setIsDisabledPopoverOpen(!isDisabledPopoverOpen)}
              >
                <button
                  type="button"
                  disabled
                  className="px-4 py-2 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white text-xs font-semibold rounded-lg opacity-60 cursor-not-allowed select-none pointer-events-none"
                >
                  Disabled button
                </button>
                {isDisabledPopoverOpen && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 bg-white rounded-xl shadow-xl border border-slate-200 text-xs text-slate-700 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <p className="font-bold text-slate-800 mb-0.5">Disabled Popover</p>
                    <p className="leading-relaxed text-slate-600 font-normal">Tombol ini dalam status disabled namun tetap dapat memicu popover.</p>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-6 border-x-transparent border-t-6 border-t-white" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* COLUMN 2 (RIGHT) */}
        {/* ======================================================== */}
        <div className="space-y-6">
          {/* 3. Card: Dismiss */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs relative">
            <div className="px-6 py-4.5 border-b border-slate-100 rounded-t-2xl">
              <h4 className="text-base font-bold text-[#1351b8]">Dismiss</h4>
            </div>
            <div className="p-6">
              <div className="relative inline-block">
                <button
                  type="button"
                  onClick={() => setIsDismissibleOpen(!isDismissibleOpen)}
                  className="px-4 py-2 bg-gradient-to-r from-[#ef4444] to-[#b91c1c] hover:from-[#dc2626] hover:to-[#991b1b] text-white text-xs font-semibold rounded-lg shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  Dismissible popover
                </button>
                {isDismissibleOpen && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 w-56 p-3 bg-white rounded-xl shadow-xl border border-slate-200 text-xs text-slate-700 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100">
                      <span className="font-bold text-slate-800">Dismissible popover</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsDismissibleOpen(false);
                        }}
                        className="text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="leading-relaxed text-slate-600 font-normal">
                      And here's some amazing content. It's very engaging. Right?
                    </p>
                    <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-y-6 border-y-transparent border-r-6 border-r-white" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 4. Card: Link */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs relative">
            <div className="px-6 py-4.5 border-b border-slate-100 rounded-t-2xl">
              <h4 className="text-base font-bold text-[#1351b8]">Link</h4>
            </div>
            <div className="p-6">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Lorem ipsum dolor sit amet, consectetur{' '}
                <span className="relative inline-block">
                  <button
                    type="button"
                    onClick={() => setIsLinkPopoverOpen(!isLinkPopoverOpen)}
                    onMouseEnter={() => setIsLinkPopoverOpen(true)}
                    onMouseLeave={() => setIsLinkPopoverOpen(false)}
                    className="text-[#1351b8] font-bold underline hover:text-[#0c2869] cursor-pointer"
                  >
                    adipisicing elit
                  </button>
                  {isLinkPopoverOpen && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 p-3 bg-white rounded-xl shadow-xl border border-slate-200 text-xs text-slate-700 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <p className="font-bold text-[#1351b8] mb-1">Adipisicing elit</p>
                      <p className="leading-relaxed text-slate-600 font-normal">
                        Consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                      </p>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-6 border-x-transparent border-t-6 border-t-white" />
                    </div>
                  )}
                </span>
                , sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dedicated Progress Showcase matching ShizueFI & Stisla with Master Gradients
function ProgressView() {
  const simpleValues = [0, 25, 50, 75, 100];
  const labelValues = [0, 25, 50, 75, 100];
  const heightVariants = [
    { height: 'h-[5px]', width: '25%' },
    { height: 'h-[10px]', width: '25%' },
    { height: 'h-[15px]', width: '25%' },
    { height: 'h-[20px]', width: '25%' },
    { height: 'h-[25px]', width: '25%' },
  ];

  const backgroundVariants = [
    { name: 'Success', width: '25%', gradient: 'from-[#22c55e] to-[#15803d]' },
    { name: 'Info', width: '50%', gradient: 'from-[#0ea5e9] to-[#0284c7]' },
    { name: 'Warning', width: '75%', gradient: 'from-[#f59e0b] to-[#d97706]' },
    { name: 'Danger', width: '100%', gradient: 'from-[#ef4444] to-[#b91c1c]' },
    { name: 'Info 100%', width: '100%', gradient: 'from-[#0ea5e9] to-[#0284c7]' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title & Breadcrumb Header with Master Blue Pill Accent */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-8 h-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full inline-block" />
          <h2 className="text-base sm:text-lg font-bold text-slate-800">Progress</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500">
          Examples for using Bootstrap custom progress bars featuring support for stacked bars, animated backgrounds, and text labels.
        </p>
      </div>

      {/* 2-Column Responsive Layout matching ShizueFI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* ======================================================== */}
        {/* COLUMN 1 (LEFT) */}
        {/* ======================================================== */}
        <div className="space-y-6">
          {/* 1. Card: Simple */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h4 className="text-base font-bold text-[#1351b8]">Simple</h4>
            </div>
            <div className="p-6 space-y-4">
              {simpleValues.map((val, idx) => (
                <div key={idx} className="w-full bg-slate-100 rounded-full h-[15px] overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] h-full rounded-full transition-all duration-500"
                    style={{ width: `${val}%` }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 2. Card: Label */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h4 className="text-base font-bold text-[#1351b8]">Label</h4>
            </div>
            <div className="p-6 space-y-4">
              {labelValues.map((val, idx) => (
                <div key={idx} className="w-full bg-slate-100 rounded-full h-[18px] overflow-hidden relative">
                  <div
                    className="bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] h-full rounded-full flex items-center justify-center text-[10px] font-bold text-white transition-all duration-500 shadow-2xs"
                    style={{ width: `${Math.max(val, 0)}%` }}
                  >
                    {val > 0 && `${val}%`}
                  </div>
                  {val === 0 && (
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-700">
                      0%
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* COLUMN 2 (RIGHT) */}
        {/* ======================================================== */}
        <div className="space-y-6">
          {/* 3. Card: Height */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h4 className="text-base font-bold text-[#1351b8]">Height</h4>
            </div>
            <div className="p-6 space-y-4">
              {heightVariants.map((item, idx) => (
                <div key={idx} className={`w-full bg-slate-100 rounded-full ${item.height} overflow-hidden`}>
                  <div
                    className="bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] h-full rounded-full transition-all duration-500"
                    style={{ width: item.width }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 4. Card: Background */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100">
              <h4 className="text-base font-bold text-[#1351b8]">Background</h4>
            </div>
            <div className="p-6 space-y-4">
              {backgroundVariants.map((item, idx) => (
                <div key={idx} className="w-full bg-slate-100 rounded-full h-[16px] overflow-hidden">
                  <div
                    className={`bg-gradient-to-r ${item.gradient} h-full rounded-full transition-all duration-500 shadow-2xs`}
                    style={{ width: item.width }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dedicated Bootstrap Table Showcase with 5 Diverse Table Variants
function TableView() {
  const [selectedProjects, setSelectedProjects] = useState<number[]>([1, 3]);
  const [projectSearch, setProjectSearch] = useState('');

  const projectsData = [
    {
      id: 1,
      name: 'Modernisasi Portal Velora UI v2',
      category: 'Design System',
      members: ['Fahmi', 'Siti', 'Budi'],
      deadline: '10 Des 2026',
      progress: 85,
      priority: 'High',
    },
    {
      id: 2,
      name: 'Integrasi Single Sign-On (SSO)',
      category: 'Security & Auth',
      members: ['Hasan', 'Ahmad'],
      deadline: '18 Des 2026',
      progress: 60,
      priority: 'Medium',
    },
    {
      id: 3,
      name: 'Optimasi Latensi Database Sharding',
      category: 'Infrastructure',
      members: ['Rahmat', 'Fahmi', 'Dewi'],
      deadline: '24 Des 2026',
      progress: 35,
      priority: 'High',
    },
    {
      id: 4,
      name: 'Refactoring Payroll & Kasbon Module',
      category: 'Finance Service',
      members: ['Irwansyah', 'Siti'],
      deadline: '30 Des 2026',
      progress: 100,
      priority: 'Low',
    },
  ];

  const filteredProjects = projectsData.filter(
    (p) =>
      p.name.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(projectSearch.toLowerCase())
  );

  const toggleSelectAll = () => {
    if (selectedProjects.length === filteredProjects.length) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(filteredProjects.map((p) => p.id));
    }
  };

  const toggleSelectProject = (id: number) => {
    setSelectedProjects((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isAllSelected =
    filteredProjects.length > 0 && selectedProjects.length === filteredProjects.length;

  return (
    <div className="space-y-6">
      {/* Page Title & Breadcrumb Header with Master Blue Pill Accent */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-8 h-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full inline-block" />
          <h2 className="text-base sm:text-lg font-bold text-slate-800">Table</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500">
          Koleksi variasi styling tabel Bootstrap modern: Simple Table, Striped & Hoverable, Contextual Alert Rows, Compact Financial Ledger, dan Interactive Table dengan seleksi baris massal.
        </p>
      </div>

      {/* Row 1: Simple Table & Striped Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* 1. Simple Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between">
            <h4 className="text-base font-bold text-[#1351b8]">Simple Table</h4>
            <span className="text-xs font-medium text-slate-500">Default Bordered</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  <th className="py-3 px-4 text-center w-12">#</th>
                  <th className="py-3 px-4">Nama Tugas</th>
                  <th className="py-3 px-4">Progres</th>
                  <th className="py-3 px-4">Batas Waktu</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                <tr className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 text-center font-medium text-slate-500">1</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">Redesign Landing Page</td>
                  <td className="py-3 px-4">
                    <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-[#22c55e] to-[#15803d] h-full rounded-full w-full" />
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">12 Jun 2026</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      Selesai
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => showToast('Detail tugas Redesign Landing Page', 'info')}
                      className="px-2.5 py-1 text-[11px] font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 text-center font-medium text-slate-500">2</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">Fix Payment Gateway API</td>
                  <td className="py-3 px-4">
                    <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] h-full rounded-full w-[65%]" />
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">16 Jun 2026</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
                      Proses
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => showToast('Detail tugas Fix Payment Gateway API', 'info')}
                      className="px-2.5 py-1 text-[11px] font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 text-center font-medium text-slate-500">3</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">Mobile Responsive Audit</td>
                  <td className="py-3 px-4">
                    <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-[#f59e0b] to-[#d97706] h-full rounded-full w-[35%]" />
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">21 Jun 2026</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
                      Tertunda
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => showToast('Detail tugas Mobile Responsive Audit', 'info')}
                      className="px-2.5 py-1 text-[11px] font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 text-center font-medium text-slate-500">4</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">Database Schema Migration</td>
                  <td className="py-3 px-4">
                    <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-[#ef4444] to-[#b91c1c] h-full rounded-full w-[15%]" />
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">25 Jun 2026</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
                      Pending
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => showToast('Detail tugas Database Schema Migration', 'info')}
                      className="px-2.5 py-1 text-[11px] font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* Footer with Pagination */}
          <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-between bg-white text-xs text-slate-500">
            <span>Menampilkan 1 - 4 dari 16 data</span>
            <div className="inline-flex items-center gap-1">
              <button disabled className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 cursor-not-allowed">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white font-semibold shadow-2xs">
                1
              </button>
              <button className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                2
              </button>
              <button className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* 2. Striped & Hover Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between">
            <h4 className="text-base font-bold text-[#1351b8]">Striped & Hoverable</h4>
            <span className="text-xs font-medium text-slate-500">Zebra Striping</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  <th className="py-3 px-4">Karyawan</th>
                  <th className="py-3 px-4">Departemen</th>
                  <th className="py-3 px-4">Posisi</th>
                  <th className="py-3 px-4">Masa Kerja</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="text-xs text-slate-700 divide-y divide-slate-100">
                <tr className="bg-white hover:bg-blue-50/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-semibold text-xs flex items-center justify-center shadow-2xs">
                        IR
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">Irwansyah Putra</div>
                        <div className="text-[11px] text-slate-500">irwansyah@velora.id</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">Product & UI/UX</td>
                  <td className="py-3 px-4 font-medium text-slate-700">Lead Designer</td>
                  <td className="py-3 px-4 text-slate-600">3.5 Tahun</td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Aktif
                    </span>
                  </td>
                </tr>
                <tr className="bg-slate-50/70 hover:bg-blue-50/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-600 text-white font-semibold text-xs flex items-center justify-center shadow-2xs">
                        HB
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">Hasan Basri</div>
                        <div className="text-[11px] text-slate-500">hasan@velora.id</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">Engineering</td>
                  <td className="py-3 px-4 font-medium text-slate-700">Senior Frontend</td>
                  <td className="py-3 px-4 text-slate-600">2.1 Tahun</td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Aktif
                    </span>
                  </td>
                </tr>
                <tr className="bg-white hover:bg-blue-50/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-semibold text-xs flex items-center justify-center shadow-2xs">
                        RH
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">Rahmat Hidayat</div>
                        <div className="text-[11px] text-slate-500">rahmat@velora.id</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">Marketing</td>
                  <td className="py-3 px-4 font-medium text-slate-700">Growth Specialist</td>
                  <td className="py-3 px-4 text-slate-600">1.0 Tahun</td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/50">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      Cuti
                    </span>
                  </td>
                </tr>
                <tr className="bg-slate-50/70 hover:bg-blue-50/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-purple-600 text-white font-semibold text-xs flex items-center justify-center shadow-2xs">
                        SN
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">Siti Nurhaliza</div>
                        <div className="text-[11px] text-slate-500">siti@velora.id</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">Quality Assurance</td>
                  <td className="py-3 px-4 font-medium text-slate-700">QA Automation Lead</td>
                  <td className="py-3 px-4 text-slate-600">4.2 Tahun</td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Aktif
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* Footer */}
          <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-between bg-white text-xs text-slate-500">
            <span>Menampilkan 4 dari 28 anggota tim</span>
            <button
              onClick={() => showToast('Membuka seluruh daftar anggota tim...', 'info')}
              className="text-[#1351b8] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              Lihat Semua <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Row 2: Contextual Alert Rows & Compact Bordered Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* 3. Contextual Alert Rows */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between">
            <h4 className="text-base font-bold text-[#1351b8]">Contextual Alert Rows</h4>
            <span className="text-xs font-medium text-slate-500">Semantic Row States</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  <th className="py-3 px-4">Node ID</th>
                  <th className="py-3 px-4">Region</th>
                  <th className="py-3 px-4">Uptime</th>
                  <th className="py-3 px-4">Latensi</th>
                  <th className="py-3 px-4 text-center">Kondisi</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-slate-100">
                {/* Success Row */}
                <tr className="bg-emerald-50/60 border-l-4 border-l-emerald-500 hover:bg-emerald-50/90 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-emerald-900">srv-prod-01</td>
                  <td className="py-3 px-4 font-medium text-emerald-800">US East (Virginia)</td>
                  <td className="py-3 px-4 font-bold text-emerald-700">99.99%</td>
                  <td className="py-3 px-4 font-medium text-emerald-700">18 ms</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-600 text-white shadow-2xs">
                      Optimal
                    </span>
                  </td>
                </tr>
                {/* Info Row */}
                <tr className="bg-sky-50/60 border-l-4 border-l-sky-500 hover:bg-sky-50/90 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-sky-900">srv-prod-02</td>
                  <td className="py-3 px-4 font-medium text-sky-800">EU Central (Frankfurt)</td>
                  <td className="py-3 px-4 font-bold text-sky-700">99.85%</td>
                  <td className="py-3 px-4 font-medium text-sky-700">34 ms</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-600 text-white shadow-2xs">
                      Maintenance
                    </span>
                  </td>
                </tr>
                {/* Warning Row */}
                <tr className="bg-amber-50/60 border-l-4 border-l-amber-500 hover:bg-amber-50/90 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-amber-900">srv-edge-03</td>
                  <td className="py-3 px-4 font-medium text-amber-800">AP Southeast (Jakarta)</td>
                  <td className="py-3 px-4 font-bold text-amber-700">97.40%</td>
                  <td className="py-3 px-4 font-medium text-amber-700">148 ms</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-600 text-white shadow-2xs">
                      High Load
                    </span>
                  </td>
                </tr>
                {/* Danger Row */}
                <tr className="bg-rose-50/60 border-l-4 border-l-rose-500 hover:bg-rose-50/90 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-rose-900">srv-edge-04</td>
                  <td className="py-3 px-4 font-medium text-rose-800">SA East (São Paulo)</td>
                  <td className="py-3 px-4 font-bold text-rose-700">86.20%</td>
                  <td className="py-3 px-4 font-medium text-rose-700">380 ms</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-600 text-white shadow-2xs">
                      Degraded
                    </span>
                  </td>
                </tr>
                {/* Default/Normal Row */}
                <tr className="bg-white hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-800">srv-backup-05</td>
                  <td className="py-3 px-4 font-medium text-slate-700">AP East (Hong Kong)</td>
                  <td className="py-3 px-4 font-bold text-slate-700">100.0%</td>
                  <td className="py-3 px-4 font-medium text-slate-600">2 ms</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      Standby
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 border-t border-slate-100 bg-white flex flex-wrap items-center justify-between text-xs text-slate-500">
            <span>5 Server Nodes dipantau realtime</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Sistem Operasional Normal</span>
            </div>
          </div>
        </div>

        {/* 4. Compact & Bordered Financial Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between">
            <h4 className="text-base font-bold text-[#1351b8]">Compact & Bordered</h4>
            <span className="text-xs font-medium text-slate-500">Dense Accounting Format</span>
          </div>
          <div className="p-5 overflow-x-auto">
            <table className="w-full text-left border-collapse border border-slate-200 text-xs">
              <thead>
                <tr className="bg-slate-100/80 text-slate-700 font-bold">
                  <th className="border border-slate-200 py-2 px-3">No. Invoice</th>
                  <th className="border border-slate-200 py-2 px-3">Pelanggan</th>
                  <th className="border border-slate-200 py-2 px-3">Tanggal</th>
                  <th className="border border-slate-200 py-2 px-3 text-right">Nominal</th>
                  <th className="border border-slate-200 py-2 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="border border-slate-200 py-1.5 px-3 font-mono font-medium text-blue-700">INV-2026-081</td>
                  <td className="border border-slate-200 py-1.5 px-3 font-medium">PT Teknologi Bangsa</td>
                  <td className="border border-slate-200 py-1.5 px-3 text-slate-500">24 Nov 2026</td>
                  <td className="border border-slate-200 py-1.5 px-3 text-right font-medium text-slate-800">Rp 18.500.000</td>
                  <td className="border border-slate-200 py-1.5 px-3 text-center">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">Lunas</span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="border border-slate-200 py-1.5 px-3 font-mono font-medium text-blue-700">INV-2026-082</td>
                  <td className="border border-slate-200 py-1.5 px-3 font-medium">CV Maju Bersama</td>
                  <td className="border border-slate-200 py-1.5 px-3 text-slate-500">23 Nov 2026</td>
                  <td className="border border-slate-200 py-1.5 px-3 text-right font-medium text-slate-800">Rp 7.250.000</td>
                  <td className="border border-slate-200 py-1.5 px-3 text-center">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">Lunas</span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="border border-slate-200 py-1.5 px-3 font-mono font-medium text-blue-700">INV-2026-083</td>
                  <td className="border border-slate-200 py-1.5 px-3 font-medium">Studio Desain Kreatif</td>
                  <td className="border border-slate-200 py-1.5 px-3 text-slate-500">21 Nov 2026</td>
                  <td className="border border-slate-200 py-1.5 px-3 text-right font-medium text-slate-800">Rp 12.000.000</td>
                  <td className="border border-slate-200 py-1.5 px-3 text-center">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">Pending</span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="border border-slate-200 py-1.5 px-3 font-mono font-medium text-blue-700">INV-2026-084</td>
                  <td className="border border-slate-200 py-1.5 px-3 font-medium">PT Sumber Berkah</td>
                  <td className="border border-slate-200 py-1.5 px-3 text-slate-500">19 Nov 2026</td>
                  <td className="border border-slate-200 py-1.5 px-3 text-right font-medium text-slate-800">Rp 34.800.000</td>
                  <td className="border border-slate-200 py-1.5 px-3 text-center">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">Jatuh Tempo</span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="border border-slate-200 py-1.5 px-3 font-mono font-medium text-blue-700">INV-2026-085</td>
                  <td className="border border-slate-200 py-1.5 px-3 font-medium">Global Logistik Tbk</td>
                  <td className="border border-slate-200 py-1.5 px-3 text-slate-500">17 Nov 2026</td>
                  <td className="border border-slate-200 py-1.5 px-3 text-right font-medium text-slate-800">Rp 9.400.000</td>
                  <td className="border border-slate-200 py-1.5 px-3 text-center">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">Lunas</span>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="bg-slate-50 font-bold text-slate-800">
                  <td colSpan={3} className="border border-slate-200 py-2 px-3 text-right">Total Transaksi:</td>
                  <td className="border border-slate-200 py-2 px-3 text-right text-blue-700 font-bold">Rp 81.950.000</td>
                  <td className="border border-slate-200 py-2 px-3 text-center text-slate-500">5 Transaksi</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Standar audit keuangan PSAK</span>
            <button
              onClick={() => showToast('Mengekspor laporan keuangan...', 'success')}
              className="text-[#1351b8] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Unduh Ledger CSV
            </button>
          </div>
        </div>
      </div>

      {/* Row 3: Advanced Interactive Table with Selection & Bulk Actions */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="px-6 py-4.5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h4 className="text-base font-bold text-[#1351b8]">Interactive Table with Row Selection</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Pilih satu atau lebih baris dengan checkbox untuk melakukan tindakan massal.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={projectSearch}
                onChange={(e) => setProjectSearch(e.target.value)}
                placeholder="Cari proyek..."
                className="pl-8.5 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1351b8]/20 focus:border-[#1351b8] text-slate-700 w-48 transition-all"
              />
            </div>
            <button
              onClick={() => showToast('Menampilkan filter lanjutan...', 'info')}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Filter className="w-3.5 h-3.5 text-slate-500" /> Filter
            </button>
            <button
              onClick={() => showToast('Mengekspor proyek terpilih...', 'success')}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Ekspor
            </button>
          </div>
        </div>

        {/* Selected Banner */}
        {selectedProjects.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 px-6 py-2.5 flex items-center justify-between text-xs text-blue-900 transition-all">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span className="font-semibold">{selectedProjects.length} proyek terpilih</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => showToast(`${selectedProjects.length} proyek ditandai selesai!`, 'success')}
                className="px-2.5 py-1 bg-white text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 font-semibold text-[11px] transition-colors cursor-pointer"
              >
                Tandai Selesai
              </button>
              <button
                onClick={() => {
                  setSelectedProjects([]);
                  showToast('Pilihan dibatalkan', 'info');
                }}
                className="px-2.5 py-1 text-slate-600 hover:text-slate-900 font-medium text-[11px] cursor-pointer"
              >
                Batal Pilihan
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                <th className="py-3 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-slate-300 text-[#1351b8] focus:ring-[#1351b8] cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4">Nama Proyek</th>
                <th className="py-3 px-4">Tim Pengembang</th>
                <th className="py-3 px-4">Batas Waktu</th>
                <th className="py-3 px-4">Progres</th>
                <th className="py-3 px-4 text-center">Prioritas</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Tidak ada proyek yang sesuai dengan pencarian.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project) => {
                  const isChecked = selectedProjects.includes(project.id);
                  return (
                    <tr
                      key={project.id}
                      className={`transition-colors cursor-pointer ${
                        isChecked ? 'bg-blue-50/50 hover:bg-blue-50/70' : 'hover:bg-slate-50/60'
                      }`}
                      onClick={() => toggleSelectProject(project.id)}
                    >
                      <td
                        className="py-3.5 px-4 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectProject(project.id)}
                          className="w-4 h-4 rounded border-slate-300 text-[#1351b8] focus:ring-[#1351b8] cursor-pointer"
                        />
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{project.name}</div>
                        <div className="text-[11px] text-slate-500">{project.category}</div>
                      </td>
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center -space-x-2">
                          {project.members.map((member, mIdx) => (
                            <div
                              key={mIdx}
                              title={member}
                              className="w-6.5 h-6.5 rounded-full border-2 border-white bg-gradient-to-tr from-[#175cd3] to-[#0f3ba0] text-white text-[10px] font-bold flex items-center justify-center shadow-2xs"
                            >
                              {member.charAt(0)}
                            </div>
                          ))}
                          <span className="text-[11px] text-slate-500 pl-3 font-medium">
                            {project.members.length} Anggota
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{project.deadline}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                project.progress === 100
                                  ? 'bg-gradient-to-r from-[#22c55e] to-[#15803d]'
                                  : project.progress > 50
                                  ? 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0]'
                                  : 'bg-gradient-to-r from-[#f59e0b] to-[#d97706]'
                              }`}
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-bold text-slate-600 w-8">
                            {project.progress}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            project.priority === 'High'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
                              : project.priority === 'Medium'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                              : 'bg-blue-50 text-blue-700 border border-blue-200/60'
                          }`}
                        >
                          {project.priority}
                        </span>
                      </td>
                      <td
                        className="py-3.5 px-4 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => showToast(`Lihat proyek: ${project.name}`, 'info')}
                            title="Lihat Detail"
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => showToast(`Edit proyek: ${project.name}`, 'info')}
                            title="Edit Proyek"
                            className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white text-xs text-slate-500">
          <span>Menampilkan {filteredProjects.length} dari {projectsData.length} proyek aktif</span>
          <div className="flex items-center gap-1">
            <button disabled className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 cursor-not-allowed">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white font-semibold shadow-2xs">
              1
            </button>
            <button className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
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
        className="px-4 py-2 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white text-xs font-semibold rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
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
    carousel: {
      title: 'Carousel',
      breadcrumbs: ['Dashboard', 'Bootstrap Components', 'Carousel'],
    },
    collapse: {
      title: 'Collapse',
      breadcrumbs: ['Dashboard', 'Bootstrap Components', 'Collapse'],
    },
    dropdown: {
      title: 'Dropdown',
      breadcrumbs: ['Dashboard', 'Bootstrap Components', 'Dropdown'],
    },
    form: {
      title: 'Form',
      breadcrumbs: ['Dashboard', 'Bootstrap Components', 'Form'],
    },
    'list-group': {
      title: 'List Group',
      breadcrumbs: ['Dashboard', 'Bootstrap Components', 'List Group'],
    },
    'media-object': {
      title: 'Media Object',
      breadcrumbs: ['Dashboard', 'Bootstrap Components', 'Media Object'],
    },
    modal: {
      title: 'Modal',
      breadcrumbs: ['Dashboard', 'Bootstrap Components', 'Modal'],
    },
    nav: {
      title: 'Nav',
      breadcrumbs: ['Dashboard', 'Bootstrap Components', 'Nav'],
    },
    navbar: {
      title: 'Navbar',
      breadcrumbs: ['Dashboard', 'Bootstrap Components', 'Navbar'],
    },
    pagination: {
      title: 'Pagination',
      breadcrumbs: ['Dashboard', 'Bootstrap Components', 'Pagination'],
    },
    popover: {
      title: 'Popover',
      breadcrumbs: ['Dashboard', 'Bootstrap Components', 'Popover'],
    },
    progress: {
      title: 'Progress',
      breadcrumbs: ['Dashboard', 'Bootstrap Components', 'Progress'],
    },
    table: {
      title: 'Table',
      breadcrumbs: ['Dashboard', 'Bootstrap Components', 'Table'],
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
        return <PaginationView />;
      case 'popover':
        return <PopoverView />;
      case 'progress':
        return <ProgressView />;
      case 'table':
        return <TableView />;
      case 'datatables':
      case 'components-table':
        return <KelasView />;
      case 'advanced-form':
      case 'forms':
        return <MataPelajaranView />;
      case 'card':
        return <CardsView />;
      case 'carousel':
        return <CarouselView />;
      case 'collapse':
        return <CollapseView />;
      case 'dropdown':
        return <DropdownView />;
      case 'form':
        return <FormView />;
      case 'list-group':
        return <ListGroupView />;
      case 'media-object':
        return <MediaObjectView />;
      case 'modal':
        return <ModalView />;
      case 'nav':
        return <NavView />;
      case 'navbar':
        return <NavbarView />;
      case 'alert':
        return <AlertView />;
      case 'badge':
        return <BadgeView />;
      case 'breadcrumb':
        return <BreadcrumbView />;
      case 'buttons':
        return <ButtonsView />;
      case 'blank-page':
        return <KelasView />;
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
