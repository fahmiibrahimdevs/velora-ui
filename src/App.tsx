import React, { useState, useEffect, useRef } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { AdminLayout } from './components/layout/AdminLayout';
import { StatCards } from './components/dashboard/StatCards';
import { RecentExamsTable } from './components/dashboard/RecentExamsTable';
import { useDashboardData } from './hooks/useDashboardData';
import { AdvancedFormsView } from './components/forms/AdvancedFormsView';
import { EditorView } from './components/forms/EditorView';
import { ValidationView } from './components/forms/ValidationView';
import { UploadFilesView } from './components/forms/UploadFilesView';
import { CalendarView } from './components/modules/CalendarView';
import { ChartJSView } from './components/modules/ChartJSView';
import { DataTablesView } from './components/modules/DataTablesView';
import { FlagView } from './components/modules/FlagView';
import { FontAwesomeView } from './components/modules/FontAwesomeView';
import { IonIconsView } from './components/modules/IonIconsView';
import { OwlCarouselView } from './components/modules/OwlCarouselView';
import { SparklineView } from './components/modules/SparklineView';
import { SweetAlertView } from './components/modules/SweetAlertView';
import { ToastrView } from './components/modules/ToastrView';
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
  Calendar,
  Copy,
  HelpCircle,
  Share2,
  Code2,
  Quote,
  Type,
  Palette,
  Bookmark,
  Flame,
  ArrowRight,
  Crown,
  ShieldCheck,
  Camera,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  CheckCheck,
  UserX,
  ZoomIn,
  ZoomOut,
  UploadCloud,
  Upload,
  FileCheck,
  FileArchive,
  TrendingUp,
  CreditCard,
  Activity,
  BarChart3,
  Cpu,
  HardDrive,
  ArrowUp,
  Folder,
  PieChart,
  Layers,
  Wrench,
} from 'lucide-react';
import { TablePagination, ShowEntriesSelector } from './components/common/TablePagination';
import { Tooltip, type TooltipPosition, type TooltipVariant } from './components/common/Tooltip';
import { Avatar, AvatarGroup, getInitials, type AvatarSize, type AvatarShape, type AvatarStatus } from './components/common/Avatar';

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
          <table className="w-full min-w-[850px] text-left border-collapse text-xs sm:text-sm table-auto">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200/80 text-[11px] uppercase tracking-wider whitespace-nowrap">
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Kode Rombel</th>
                <th className="py-3 px-4 min-w-[150px]">Nama Kelas</th>
                <th className="py-3 px-4">Tingkat</th>
                <th className="py-3 px-4 min-w-[160px]">Jurusan / Konsentrasi</th>
                <th className="py-3 px-4 min-w-[160px]">Wali Kelas</th>
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
          <table className="w-full min-w-[850px] text-left border-collapse text-xs sm:text-sm table-auto">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200/80 text-[11px] uppercase tracking-wider whitespace-nowrap">
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Kode</th>
                <th className="py-3 px-4 min-w-[180px]">Nama Mata Pelajaran</th>
                <th className="py-3 px-4">Kelompok</th>
                <th className="py-3 px-4">Alokasi Tingkat</th>
                <th className="py-3 px-4 min-w-[160px]">Guru Koordinator</th>
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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'in_progress' | 'completed'>('all');
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  // Pagination state for Simple Table & Interactive Table
  const [simplePageSize, setSimplePageSize] = useState(4);
  const [simpleCurrentPage, setSimpleCurrentPage] = useState(1);
  const [projectPageSize, setProjectPageSize] = useState(5);
  const [projectCurrentPage, setProjectCurrentPage] = useState(1);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    };
    if (isFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterOpen]);

  // Collapsible date groups state for Financial Ledger
  const [expandedDateGroups, setExpandedDateGroups] = useState<Record<string, boolean>>({
    '2026-11-24': true,
    '2026-11-22': true,
    '2026-11-19': true,
  });

  const toggleDateGroup = (dateKey: string) => {
    setExpandedDateGroups((prev) => ({
      ...prev,
      [dateKey]: !prev[dateKey],
    }));
  };

  const isAllDatesExpanded = Object.values(expandedDateGroups).every(Boolean);

  const toggleAllDateGroups = () => {
    const nextState = !isAllDatesExpanded;
    setExpandedDateGroups({
      '2026-11-24': nextState,
      '2026-11-22': nextState,
      '2026-11-19': nextState,
    });
  };

  const financialLedgerData = [
    {
      dateKey: '2026-11-24',
      dateLabel: 'Selasa, 24 November 2026',
      subtotal: 'Rp 25.750.000',
      items: [
        {
          invoice: 'INV-2026-081',
          client: 'PT Teknologi Bangsa',
          desc: 'Langganan Cloud ERP Enterprise (1 Tahun)',
          payment: 'Transfer Bank BCA',
          nominal: 'Rp 18.500.000',
          status: 'Lunas',
          statusType: 'success' as const,
        },
        {
          invoice: 'INV-2026-082',
          client: 'CV Maju Bersama',
          desc: 'Setup Integrasi Modul Kasbon & Payroll',
          payment: 'QRIS Mandiri',
          nominal: 'Rp 7.250.000',
          status: 'Lunas',
          statusType: 'success' as const,
        },
      ],
    },
    {
      dateKey: '2026-11-22',
      dateLabel: 'Minggu, 22 November 2026',
      subtotal: 'Rp 46.800.000',
      items: [
        {
          invoice: 'INV-2026-083',
          client: 'Studio Desain Kreatif',
          desc: 'Kustomisasi Desain Dashboard & Pelatihan',
          payment: 'Kartu Kredit Visa',
          nominal: 'Rp 12.000.000',
          status: 'Pending',
          statusType: 'warning' as const,
        },
        {
          invoice: 'INV-2026-084',
          client: 'PT Sumber Berkah Utama',
          desc: 'Lisensi Server On-Premise Multi-Cabang',
          payment: 'Virtual Account BNI',
          nominal: 'Rp 34.800.000',
          status: 'Jatuh Tempo',
          statusType: 'danger' as const,
        },
      ],
    },
    {
      dateKey: '2026-11-19',
      dateLabel: 'Kamis, 19 November 2026',
      subtotal: 'Rp 25.000.000',
      items: [
        {
          invoice: 'INV-2026-085',
          client: 'Global Logistik Nusantara Tbk',
          desc: 'Maintenance Berkala & Security Hardening',
          payment: 'Transfer Bank BNI',
          nominal: 'Rp 9.400.000',
          status: 'Lunas',
          statusType: 'success' as const,
        },
        {
          invoice: 'INV-2026-086',
          client: 'PT Sentosa Abadi Makmur',
          desc: 'Modul Presensi Geolocation & Face Match',
          payment: 'Transfer Bank Mandiri',
          nominal: 'Rp 15.600.000',
          status: 'Lunas',
          statusType: 'success' as const,
        },
      ],
    },
  ];

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
    {
      id: 5,
      name: 'Pusat Analitik & Laporan Keuangan Realtime',
      category: 'Business Intelligence',
      members: ['Dewi', 'Ahmad'],
      deadline: '12 Jan 2027',
      progress: 50,
      priority: 'Medium',
    },
    {
      id: 6,
      name: 'Audit Kepatuhan ISO 27001 & Pen-Test',
      category: 'Cyber Security',
      members: ['Fahmi', 'Irwansyah'],
      deadline: '15 Jan 2027',
      progress: 100,
      priority: 'High',
    },
    {
      id: 7,
      name: 'Desain Sistem Komponen UI v3',
      category: 'Design System',
      members: ['Fahmi', 'Budi'],
      deadline: '20 Jan 2027',
      progress: 90,
      priority: 'High',
    },
    {
      id: 8,
      name: 'Implementasi Rate Limiting Redis',
      category: 'Infrastructure',
      members: ['Dewi', 'Ahmad'],
      deadline: '25 Jan 2027',
      progress: 70,
      priority: 'Medium',
    },
    {
      id: 9,
      name: 'Migrasi Database PostgreSQL ke Cloud',
      category: 'Infrastructure',
      members: ['Rahmat', 'Hasan'],
      deadline: '02 Feb 2027',
      progress: 40,
      priority: 'High',
    },
    {
      id: 10,
      name: 'Integrasi WhatsApp Gateway OTP',
      category: 'Security & Auth',
      members: ['Hasan', 'Fahmi'],
      deadline: '08 Feb 2027',
      progress: 80,
      priority: 'Medium',
    },
    {
      id: 11,
      name: 'Optimasi Bundle Size & Tree Shaking',
      category: 'Frontend Core',
      members: ['Irwansyah'],
      deadline: '14 Feb 2027',
      progress: 100,
      priority: 'Low',
    },
    {
      id: 12,
      name: 'Dashboard Monitoring Log Sentry',
      category: 'DevOps & Cloud',
      members: ['Dewi', 'Siti'],
      deadline: '20 Feb 2027',
      progress: 55,
      priority: 'High',
    },
  ];

  // Simple Table Tasks Data with Pagination
  const simpleTasksData = [
    { id: 1, name: 'Redesign Landing Page', progress: 100, gradient: 'from-[#22c55e] to-[#15803d]', deadline: '12 Jun 2026', status: 'Selesai', statusBg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60' },
    { id: 2, name: 'Fix Payment Gateway API', progress: 65, gradient: 'from-[#175cd3] to-[#0f3ba0]', deadline: '16 Jun 2026', status: 'Proses', statusBg: 'bg-blue-50 text-blue-700 border-blue-200/60' },
    { id: 3, name: 'Mobile Responsive Audit', progress: 35, gradient: 'from-[#f59e0b] to-[#d97706]', deadline: '21 Jun 2026', status: 'Tertunda', statusBg: 'bg-amber-50 text-amber-700 border-amber-200/60' },
    { id: 4, name: 'Database Schema Migration', progress: 15, gradient: 'from-[#ef4444] to-[#b91c1c]', deadline: '25 Jun 2026', status: 'Pending', statusBg: 'bg-rose-50 text-rose-700 border-rose-200/60' },
    { id: 5, name: 'Implementasi Webhook Kasbon', progress: 85, gradient: 'from-[#175cd3] to-[#0f3ba0]', deadline: '28 Jun 2026', status: 'Proses', statusBg: 'bg-blue-50 text-blue-700 border-blue-200/60' },
    { id: 6, name: 'Kustomisasi Rekap Slip Gaji PDF', progress: 100, gradient: 'from-[#22c55e] to-[#15803d]', deadline: '02 Jul 2026', status: 'Selesai', statusBg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60' },
    { id: 7, name: 'Optimalisasi Index PostgreSQL', progress: 45, gradient: 'from-[#f59e0b] to-[#d97706]', deadline: '05 Jul 2026', status: 'Tertunda', statusBg: 'bg-amber-50 text-amber-700 border-amber-200/60' },
    { id: 8, name: 'Testing Stress Load Presensi', progress: 20, gradient: 'from-[#ef4444] to-[#b91c1c]', deadline: '10 Jul 2026', status: 'Pending', statusBg: 'bg-rose-50 text-rose-700 border-rose-200/60' },
  ];

  const totalSimplePages = Math.max(1, Math.ceil(simpleTasksData.length / simplePageSize));
  const paginatedSimpleTasks = simpleTasksData.slice(
    (simpleCurrentPage - 1) * simplePageSize,
    simpleCurrentPage * simplePageSize
  );

  const activeFilterCount =
    selectedPriorities.length + (selectedStatus !== 'all' ? 1 : 0);

  const resetFilters = () => {
    setSelectedPriorities([]);
    setSelectedStatus('all');
    setProjectSearch('');
    setProjectCurrentPage(1);
    showToast('Filter dan pencarian direset', 'info');
  };

  const filteredProjects = projectsData.filter((p) => {
    // 1. Text search
    const matchesSearch =
      p.name.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(projectSearch.toLowerCase());
    if (!matchesSearch) return false;

    // 2. Priority filter
    if (selectedPriorities.length > 0 && !selectedPriorities.includes(p.priority)) {
      return false;
    }

    // 3. Status/progress filter
    if (selectedStatus === 'in_progress' && p.progress === 100) {
      return false;
    }
    if (selectedStatus === 'completed' && p.progress < 100) {
      return false;
    }

    return true;
  });

  const totalProjectPages = Math.max(1, Math.ceil(filteredProjects.length / projectPageSize));
  const paginatedProjects = filteredProjects.slice(
    (projectCurrentPage - 1) * projectPageSize,
    projectCurrentPage * projectPageSize
  );

  const toggleSelectAll = () => {
    const paginatedIds = paginatedProjects.map((p) => p.id);
    const areAllPageSelected = paginatedIds.length > 0 && paginatedIds.every((id) => selectedProjects.includes(id));
    if (areAllPageSelected) {
      setSelectedProjects((prev) => prev.filter((id) => !paginatedIds.includes(id)));
    } else {
      setSelectedProjects((prev) => Array.from(new Set([...prev, ...paginatedIds])));
    }
  };

  const toggleSelectProject = (id: number) => {
    setSelectedProjects((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isAllSelected =
    paginatedProjects.length > 0 && paginatedProjects.every((p) => selectedProjects.includes(p.id));

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
            <table className="w-full min-w-[580px] text-left border-collapse table-auto">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-600 whitespace-nowrap">
                  <th className="py-3 px-4 text-center w-12">#</th>
                  <th className="py-3 px-4 min-w-[180px]">Nama Tugas</th>
                  <th className="py-3 px-4 min-w-[130px]">Progres</th>
                  <th className="py-3 px-4 min-w-[110px]">Batas Waktu</th>
                  <th className="py-3 px-4 min-w-[90px]">Status</th>
                  <th className="py-3 px-4 text-center min-w-[80px]">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {paginatedSimpleTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 text-center font-medium text-slate-500">{task.id}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{task.name}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-20 sm:w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div className={`bg-gradient-to-r ${task.gradient} h-full rounded-full`} style={{ width: `${task.progress}%` }} />
                        </div>
                        <span className="text-[11px] font-bold text-slate-500 w-7">{task.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{task.deadline}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border ${task.statusBg}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => showToast(`Detail tugas: ${task.name}`, 'info')}
                        className="px-2.5 py-1 text-[11px] font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Footer with Pagination & Show Entries */}
          <div className="px-4 py-3 sm:px-6 sm:py-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white text-xs text-slate-500">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 text-xs text-slate-500">
              <ShowEntriesSelector
                pageSize={simplePageSize}
                onPageSizeChange={(sz) => {
                  setSimplePageSize(sz);
                  setSimpleCurrentPage(1);
                }}
                options={[4, 8]}
                labelPrefix="Tampilkan"
                labelSuffix="data"
              />
              <span className="text-slate-300 hidden sm:inline">•</span>
              <span className="text-center sm:text-left">
                Menampilkan {(simpleCurrentPage - 1) * simplePageSize + 1} - {Math.min(simpleCurrentPage * simplePageSize, simpleTasksData.length)} dari {simpleTasksData.length} data
              </span>
            </div>
            <div className="inline-flex items-center justify-center gap-1 w-full sm:w-auto">
              <button
                onClick={() => setSimpleCurrentPage((p) => Math.max(1, p - 1))}
                disabled={simpleCurrentPage === 1}
                className={`w-7 h-7 flex items-center justify-center rounded-lg border transition-colors ${
                  simpleCurrentPage === 1
                    ? 'border-slate-200 text-slate-300 cursor-not-allowed'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer'
                }`}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              {Array.from({ length: totalSimplePages }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  onClick={() => setSimpleCurrentPage(pg)}
                  className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    pg === simpleCurrentPage
                      ? 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white shadow-2xs'
                      : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {pg}
                </button>
              ))}
              <button
                onClick={() => setSimpleCurrentPage((p) => Math.min(totalSimplePages, p + 1))}
                disabled={simpleCurrentPage === totalSimplePages}
                className={`w-7 h-7 flex items-center justify-center rounded-lg border transition-colors ${
                  simpleCurrentPage === totalSimplePages
                    ? 'border-slate-200 text-slate-300 cursor-not-allowed'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer'
                }`}
              >
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
            <table className="w-full min-w-[620px] text-left border-collapse table-auto">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100/90 text-[11px] font-bold uppercase tracking-wider text-slate-700 whitespace-nowrap">
                  <th className="py-3 px-4 min-w-[200px]">Karyawan</th>
                  <th className="py-3 px-4 min-w-[130px]">Departemen</th>
                  <th className="py-3 px-4 min-w-[140px]">Posisi</th>
                  <th className="py-3 px-4 min-w-[100px]">Masa Kerja</th>
                  <th className="py-3 px-4 text-center min-w-[90px]">Status</th>
                </tr>
              </thead>
              <tbody className="text-xs text-slate-700 divide-y divide-slate-200/60">
                <tr className="bg-white hover:bg-blue-50/70 transition-colors">
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
                <tr className="bg-slate-100 hover:bg-blue-50/70 transition-colors">
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
                <tr className="bg-white hover:bg-blue-50/70 transition-colors">
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
                <tr className="bg-slate-100 hover:bg-blue-50/70 transition-colors">
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
                <tr className="bg-white hover:bg-blue-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 text-white font-semibold text-xs flex items-center justify-center shadow-2xs">
                        BS
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">Budi Santoso</div>
                        <div className="text-[11px] text-slate-500">budi@velora.id</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">Mobile Development</td>
                  <td className="py-3 px-4 font-medium text-slate-700">React Native Engineer</td>
                  <td className="py-3 px-4 text-slate-600">1.8 Tahun</td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Aktif
                    </span>
                  </td>
                </tr>
                <tr className="bg-slate-100 hover:bg-blue-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-600 to-pink-600 text-white font-semibold text-xs flex items-center justify-center shadow-2xs">
                        DA
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">Dewi Anggraeni</div>
                        <div className="text-[11px] text-slate-500">dewi@velora.id</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">DevOps & Cloud</td>
                  <td className="py-3 px-4 font-medium text-slate-700">Cloud Infrastructure</td>
                  <td className="py-3 px-4 text-slate-600">3.0 Tahun</td>
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
          <div className="px-4 py-3 sm:px-6 sm:py-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-0 bg-white text-xs text-slate-500">
            <span className="text-center sm:text-left">Menampilkan 6 dari 28 anggota tim</span>
            <button
              onClick={() => showToast('Membuka seluruh daftar anggota tim...', 'info')}
              className="text-[#1351b8] hover:underline font-semibold flex items-center justify-center gap-1 cursor-pointer w-full sm:w-auto text-center"
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
            <table className="w-full min-w-[520px] text-left border-collapse table-auto">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-600 whitespace-nowrap">
                  <th className="py-3 px-4 min-w-[120px]">Node ID</th>
                  <th className="py-3 px-4 min-w-[170px]">Region</th>
                  <th className="py-3 px-4 min-w-[90px]">Uptime</th>
                  <th className="py-3 px-4 min-w-[90px]">Latensi</th>
                  <th className="py-3 px-4 text-center min-w-[95px]">Kondisi</th>
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
          <div className="px-4 py-3 sm:px-6 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 text-center sm:text-left">
            <span>5 Server Nodes dipantau realtime</span>
            <div className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Sistem Operasional Normal</span>
            </div>
          </div>
        </div>

        {/* 4. Dark Themed Table (Inversed Header) */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between">
            <h4 className="text-base font-bold text-[#1351b8]">Dark Themed Header</h4>
            <span className="text-xs font-medium text-slate-500">Inversed Table Header</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left border-collapse table-auto">
              <thead>
                <tr className="bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wider whitespace-nowrap">
                  <th className="py-3 px-4 min-w-[160px]">Layanan</th>
                  <th className="py-3 px-4 min-w-[90px]">Versi</th>
                  <th className="py-3 px-4 min-w-[120px]">Throughput</th>
                  <th className="py-3 px-4 min-w-[100px]">Error Rate</th>
                  <th className="py-3 px-4 text-center min-w-[90px]">Status</th>
                </tr>
              </thead>
              <tbody className="text-xs text-slate-700 divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-800">Auth Gateway</td>
                  <td className="py-3 px-4 font-mono text-slate-500">v2.4.1</td>
                  <td className="py-3 px-4 font-medium text-slate-700">1.840 req/s</td>
                  <td className="py-3 px-4 text-emerald-600 font-semibold">0.01%</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      Normal
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-800">Core API Engine</td>
                  <td className="py-3 px-4 font-mono text-slate-500">v3.1.0</td>
                  <td className="py-3 px-4 font-medium text-slate-700">4.250 req/s</td>
                  <td className="py-3 px-4 text-emerald-600 font-semibold">0.04%</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      Normal
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-800">Payment Service</td>
                  <td className="py-3 px-4 font-mono text-slate-500">v1.9.8</td>
                  <td className="py-3 px-4 font-medium text-slate-700">620 req/s</td>
                  <td className="py-3 px-4 text-emerald-600 font-semibold">0.00%</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      Normal
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-800">Worker Queue</td>
                  <td className="py-3 px-4 font-mono text-slate-500">v2.0.2</td>
                  <td className="py-3 px-4 font-medium text-slate-700">890 req/s</td>
                  <td className="py-3 px-4 text-amber-600 font-semibold">0.12%</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
                      Waspada
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-800">Search Elastic</td>
                  <td className="py-3 px-4 font-mono text-slate-500">v8.11</td>
                  <td className="py-3 px-4 font-medium text-slate-700">2.100 req/s</td>
                  <td className="py-3 px-4 text-emerald-600 font-semibold">0.02%</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      Normal
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 sm:px-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 bg-white text-center sm:text-left">
            <span>Total Throughput: 9.700 req/s</span>
            <span className="text-slate-400">Pembaruan otomatis tiap 5 dtk</span>
          </div>
        </div>
      </div>

      {/* Row 3: Full-Width Compact & Bordered Financial Ledger Grouped by Date */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="px-6 py-4.5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-[#1351b8]">Compact & Bordered Financial Ledger</h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/50">
                Collapsible Date Groups
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Jurnal pembukuan kas & piutang dengan baris pemisah kelompok tanggal dropdown (Klik untuk buka/tutup).
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleAllDateGroups}
              className="px-2.5 py-1.5 text-xs font-semibold text-[#1351b8] bg-blue-50/70 hover:bg-blue-100/70 border border-blue-200/60 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              {isAllDatesExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              <span>{isAllDatesExpanded ? 'Tutup Semua' : 'Buka Semua'}</span>
            </button>
            <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200 whitespace-nowrap">
              Periode: 19 - 24 Nov 2026
            </span>
            <button
              onClick={() => showToast('Mengekspor rekap transaksi keuangan...', 'success')}
              className="px-3 py-1.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" /> Unduh Ledger CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left border-collapse text-xs table-auto">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                <th className="py-3 pl-6 pr-4 whitespace-nowrap">No. Invoice</th>
                <th className="py-3 px-4 min-w-[180px]">Nama Pelanggan</th>
                <th className="py-3 px-4 min-w-[240px]">Deskripsi Layanan</th>
                <th className="py-3 px-4 whitespace-nowrap">Metode Bayar</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Nominal (IDR)</th>
                <th className="py-3 px-4 text-center whitespace-nowrap min-w-[110px]">Status</th>
                <th className="py-3 pl-4 pr-6 text-center whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {financialLedgerData.map((group) => {
                const isExpanded = expandedDateGroups[group.dateKey] ?? true;
                return (
                  <React.Fragment key={group.dateKey}>
                    {/* Collapsible Date Group Header */}
                    <tr
                      onClick={() => toggleDateGroup(group.dateKey)}
                      className="bg-slate-50/90 border-y border-slate-200/90 hover:bg-slate-100/90 transition-colors cursor-pointer select-none group/header"
                    >
                      <td colSpan={7} className="py-2.5 px-6 font-bold text-slate-800">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md flex items-center justify-center text-slate-500 group-hover/header:text-[#1351b8] group-hover/header:bg-blue-100/60 transition-all">
                              {isExpanded ? (
                                <ChevronDown className="w-4 h-4 text-[#1351b8]" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-slate-400 group-hover/header:text-[#1351b8]" />
                              )}
                            </span>
                            <Calendar className="w-3.5 h-3.5 text-[#1351b8]" />
                            <span className="group-hover/header:text-[#1351b8] transition-colors">{group.dateLabel}</span>
                            <span className="text-[10px] font-semibold bg-white px-2 py-0.5 rounded-full text-slate-600 border border-slate-200 shadow-2xs whitespace-nowrap">
                              {group.items.length} Transaksi
                            </span>
                            {!isExpanded && (
                              <span className="text-[11px] font-normal text-slate-400 italic">
                                (Klik untuk menampilkan {group.items.length} rincian)
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-semibold text-slate-700 whitespace-nowrap">
                            Subtotal: <span className="font-bold text-[#1351b8]">{group.subtotal}</span>
                          </span>
                        </div>
                      </td>
                    </tr>

                    {/* Indented Child Rows when Expanded */}
                    {isExpanded &&
                      group.items.map((item, idx) => (
                        <tr
                          key={idx}
                          className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors"
                        >
                          {/* Indented first column matching tree-grid / Bill of Material */}
                          <td className="py-2.5 pl-12 pr-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className="text-slate-300 font-mono text-xs select-none">└─</span>
                              <span className="font-mono font-medium text-blue-700">{item.invoice}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-4 font-semibold text-slate-800">{item.client}</td>
                          <td className="py-2.5 px-4 text-slate-600">{item.desc}</td>
                          <td className="py-2.5 px-4 text-slate-600 whitespace-nowrap">{item.payment}</td>
                          <td className="py-2.5 px-4 text-right font-semibold text-slate-800 whitespace-nowrap">
                            {item.nominal}
                          </td>
                          <td className="py-2.5 px-4 text-center whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap ${
                                item.statusType === 'success'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                                  : item.statusType === 'warning'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="py-2.5 pl-4 pr-6 text-center whitespace-nowrap">
                            <button
                              onClick={() => showToast(`Detail invoice ${item.invoice}`, 'info')}
                              className="text-[11px] font-medium text-[#1351b8] hover:underline cursor-pointer"
                            >
                              Detail
                            </button>
                          </td>
                        </tr>
                      ))}
                  </React.Fragment>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50/80 font-bold text-slate-800 border-t-2 border-slate-200">
                <td colSpan={4} className="py-3 pl-6 pr-4 text-right font-bold text-slate-700 whitespace-nowrap">
                  Total Keseluruhan (6 Transaksi):
                </td>
                <td className="py-3 px-4 text-right text-[#1351b8] font-bold text-sm whitespace-nowrap">
                  Rp 97.550.000
                </td>
                <td colSpan={2} className="py-3 pl-4 pr-6 text-center text-xs font-semibold text-slate-600 whitespace-nowrap">
                  4 Lunas • 1 Pending • 1 Jatuh Tempo
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="px-4 py-3 sm:px-6 sm:py-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 bg-white">
          <span className="flex items-center justify-center sm:justify-start gap-2 text-center sm:text-left">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            Standar pembukuan jurnal akuntansi PSAK / IFRS terverifikasi
          </span>
          <div className="flex items-center justify-center sm:justify-end gap-2 w-full sm:w-auto">
            <button
              onClick={() => showToast('Mengekspor laporan keuangan...', 'success')}
              className="text-[#1351b8] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Unduh Ledger CSV
            </button>
          </div>
        </div>
      </div>

      {/* Row 4: Advanced Interactive Table with Selection & Bulk Actions */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs">
        <div className="px-4 py-4 sm:px-6 sm:py-4.5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 relative rounded-t-2xl">
          <div>
            <h4 className="text-base font-bold text-[#1351b8]">Interactive Table with Row Selection</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Pilih satu atau lebih baris dengan checkbox untuk melakukan tindakan massal.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={projectSearch}
                onChange={(e) => {
                  setProjectSearch(e.target.value);
                  setProjectCurrentPage(1);
                }}
                placeholder="Cari proyek..."
                className="w-full pl-8.5 pr-8 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1351b8]/20 focus:border-[#1351b8] text-slate-700 transition-all"
              />
              {projectSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setProjectSearch('');
                    setProjectCurrentPage(1);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              {/* Filter Dropdown Popover Container */}
              <div className="relative flex-1 sm:flex-none" ref={filterDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`w-full sm:w-auto px-3 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs ${
                    activeFilterCount > 0 || isFilterOpen
                      ? 'bg-blue-50/90 border border-blue-300 text-[#1351b8] ring-2 ring-blue-500/15'
                      : 'text-slate-700 bg-white border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Filter className={`w-3.5 h-3.5 ${activeFilterCount > 0 ? 'text-[#1351b8]' : 'text-slate-500'}`} />
                  <span>Filter</span>
                  {activeFilterCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-[#1351b8] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                      {activeFilterCount}
                    </span>
                  )}
                  <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isFilterOpen ? 'rotate-180 text-[#1351b8]' : ''}`} />
                </button>

                {/* Mobile backdrop */}
                {isFilterOpen && (
                  <div
                    className="fixed inset-0 bg-slate-900/30 backdrop-blur-2xs z-40 sm:hidden"
                    onClick={() => setIsFilterOpen(false)}
                  />
                )}

                {/* Popover Floating Card */}
                {isFilterOpen && (
                  <div className="fixed inset-x-4 top-28 max-w-sm mx-auto sm:mx-0 sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 w-auto sm:w-80 bg-white rounded-2xl shadow-2xl sm:shadow-xl border border-slate-200 p-4 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                    {/* Popover Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-blue-50 text-[#1351b8] flex items-center justify-center">
                          <Filter className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-bold text-slate-800 text-sm">Filter Proyek</span>
                      </div>
                      {activeFilterCount > 0 && (
                        <button
                          type="button"
                          onClick={resetFilters}
                          className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 cursor-pointer transition-colors"
                        >
                          Reset Semua
                        </button>
                      )}
                    </div>

                    {/* Section 1: Tingkat Prioritas */}
                    <div className="py-3 border-b border-slate-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          Tingkat Prioritas
                        </span>
                        {selectedPriorities.length > 0 && (
                          <span className="text-[10px] font-semibold text-[#1351b8]">
                            {selectedPriorities.length} dipilih
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { label: 'High', color: 'bg-rose-500', text: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-300' },
                          { label: 'Medium', color: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-300' },
                          { label: 'Low', color: 'bg-blue-500', text: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-300' },
                        ].map((item) => {
                          const isSelected = selectedPriorities.includes(item.label);
                          return (
                            <button
                              key={item.label}
                              type="button"
                              onClick={() => {
                                setSelectedPriorities((prev) =>
                                  prev.includes(item.label)
                                    ? prev.filter((p) => p !== item.label)
                                    : [...prev, item.label]
                                );
                              }}
                              className={`px-2 py-1.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                isSelected
                                  ? `${item.bg} ${item.border} ${item.text} ring-2 ring-[#1351b8]/15 shadow-2xs`
                                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${item.color}`} />
                              {item.label}
                              {isSelected && <Check className="w-3 h-3 ml-0.5" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Section 2: Status Progres */}
                    <div className="py-3 border-b border-slate-100">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                        Status Progres
                      </div>
                      <div className="space-y-1">
                        {[
                          { key: 'all', label: 'Semua Status Progres' },
                          { key: 'in_progress', label: 'Sedang Berjalan (< 100%)' },
                          { key: 'completed', label: 'Selesai (100%)' },
                        ].map((opt) => {
                          const isSelected = selectedStatus === opt.key;
                          return (
                            <label
                              key={opt.key}
                              onClick={() => setSelectedStatus(opt.key as any)}
                              className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                                isSelected ? 'bg-blue-50 text-[#1351b8] font-semibold' : 'text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <span className="text-xs">{opt.label}</span>
                              <input
                                type="radio"
                                name="filterStatus"
                                checked={isSelected}
                                onChange={() => setSelectedStatus(opt.key as any)}
                                className="w-3.5 h-3.5 text-[#1351b8] focus:ring-[#1351b8] border-slate-300 cursor-pointer"
                              />
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {/* Popover Footer */}
                    <div className="pt-3 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 font-medium">
                        {filteredProjects.length} data ditemukan
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setIsFilterOpen(false);
                          showToast(`${filteredProjects.length} proyek sesuai filter`, 'info');
                        }}
                        className="px-3.5 py-1.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white font-semibold rounded-xl text-xs transition-all shadow-sm cursor-pointer"
                      >
                        Terapkan
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => showToast('Mengekspor proyek terpilih...', 'success')}
                className="flex-1 sm:flex-none px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> <span>Ekspor</span>
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Chips Bar (Visible when any filter is active) */}
        {activeFilterCount > 0 && (
          <div className="px-4 sm:px-6 py-2 bg-slate-50/80 border-b border-slate-100 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium text-[11px]">Filter Aktif:</span>
            {selectedPriorities.map((pri) => (
              <span
                key={pri}
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white border border-slate-200 text-slate-700 shadow-2xs"
              >
                <span>Prioritas: {pri}</span>
                <button
                  type="button"
                  onClick={() => setSelectedPriorities((prev) => prev.filter((p) => p !== pri))}
                  className="text-slate-400 hover:text-rose-600 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {selectedStatus !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white border border-slate-200 text-slate-700 shadow-2xs">
                <span>Status: {selectedStatus === 'in_progress' ? 'Sedang Berjalan' : 'Selesai'}</span>
                <button
                  type="button"
                  onClick={() => setSelectedStatus('all')}
                  className="text-slate-400 hover:text-rose-600 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={resetFilters}
              className="text-[11px] text-[#1351b8] hover:underline font-semibold sm:ml-auto cursor-pointer"
            >
              Hapus Semua Filter
            </button>
          </div>
        )}

        {/* Selected Banner */}
        {selectedProjects.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2.5 text-xs text-blue-900 transition-all">
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
          <table className="w-full min-w-[760px] text-left border-collapse table-auto">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-600 whitespace-nowrap">
                <th className="py-3 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-slate-300 text-[#1351b8] focus:ring-[#1351b8] cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4 min-w-[220px]">Nama Proyek</th>
                <th className="py-3 px-4 min-w-[140px]">Tim Pengembang</th>
                <th className="py-3 px-4 min-w-[120px]">Batas Waktu</th>
                <th className="py-3 px-4 min-w-[140px]">Progres</th>
                <th className="py-3 px-4 text-center min-w-[90px]">Prioritas</th>
                <th className="py-3 px-4 text-center min-w-[80px]">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="max-w-xs mx-auto space-y-2.5">
                      <div className="w-10 h-10 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                        <Filter className="w-5 h-5" />
                      </div>
                      <div className="font-semibold text-slate-700 text-sm">Tidak ada proyek yang cocok</div>
                      <p className="text-slate-400 text-xs leading-relaxed">
                        Coba sesuaikan kata kunci pencarian atau bersihkan kriteria filter yang aktif.
                      </p>
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="mt-1 px-3.5 py-1.5 bg-blue-50 text-[#1351b8] hover:bg-blue-100 rounded-xl font-semibold text-xs transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Reset Filter & Pencarian
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedProjects.map((project) => {
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
                      <td className="py-3.5 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
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
                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{project.deadline}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
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
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
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
                        className="py-3.5 px-4 text-center whitespace-nowrap"
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

        {/* Footer with Pagination & Show Entries */}
        <div className="px-4 py-3.5 sm:px-6 sm:py-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white text-xs text-slate-500 rounded-b-2xl">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 text-xs text-slate-500">
            <ShowEntriesSelector
              pageSize={projectPageSize}
              onPageSizeChange={(sz) => {
                setProjectPageSize(sz);
                setProjectCurrentPage(1);
              }}
              options={[5, 10, 20]}
              labelPrefix="Tampilkan"
              labelSuffix="data"
            />
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="text-center sm:text-left">
              Menampilkan {filteredProjects.length === 0 ? 0 : (projectCurrentPage - 1) * projectPageSize + 1} - {Math.min(projectCurrentPage * projectPageSize, filteredProjects.length)} dari {filteredProjects.length} proyek aktif
            </span>
          </div>
          <div className="flex items-center justify-center gap-1 w-full sm:w-auto">
            <button
              onClick={() => setProjectCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={projectCurrentPage === 1}
              className={`w-7 h-7 flex items-center justify-center rounded-lg border transition-colors ${
                projectCurrentPage === 1
                  ? 'border-slate-200 text-slate-300 cursor-not-allowed'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer'
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            {Array.from({ length: totalProjectPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setProjectCurrentPage(pageNum)}
                className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  pageNum === projectCurrentPage
                    ? 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white shadow-2xs'
                    : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {pageNum}
              </button>
            ))}
            <button
              onClick={() => setProjectCurrentPage((prev) => Math.min(totalProjectPages, prev + 1))}
              disabled={projectCurrentPage === totalProjectPages || filteredProjects.length === 0}
              className={`w-7 h-7 flex items-center justify-center rounded-lg border transition-colors ${
                projectCurrentPage === totalProjectPages || filteredProjects.length === 0
                  ? 'border-slate-200 text-slate-300 cursor-not-allowed'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer'
              }`}
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dedicated Tooltip Showcase matching ShizueFI & Stisla with Master Gradients & Advanced Interactivity
function TooltipView() {
  const [customPosition, setCustomPosition] = useState<TooltipPosition>('top');
  const [customVariant, setCustomVariant] = useState<TooltipVariant>('dark');
  const [customText, setCustomText] = useState('Pratinjau Tooltip Dinamis');
  const [customHotkey, setCustomHotkey] = useState('⌘K');
  const [customArrow, setCustomArrow] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [hoveredAvatar, setHoveredAvatar] = useState<number | null>(null);

  const teamMembers = [
    {
      id: 1,
      name: 'Irwansyah Putra',
      role: 'Lead UI/UX Designer',
      email: 'irwansyah@velora.id',
      initials: 'IR',
      bg: 'bg-blue-600',
      status: 'Online',
      statusColor: 'bg-emerald-500',
      projects: 8,
    },
    {
      id: 2,
      name: 'Hasan Basri',
      role: 'Senior Frontend Engineer',
      email: 'hasan@velora.id',
      initials: 'HB',
      bg: 'bg-emerald-600',
      status: 'Online',
      statusColor: 'bg-emerald-500',
      projects: 12,
    },
    {
      id: 3,
      name: 'Siti Nurhaliza',
      role: 'QA Automation Lead',
      email: 'siti@velora.id',
      initials: 'SN',
      bg: 'bg-purple-600',
      status: 'In Meeting',
      statusColor: 'bg-amber-500',
      projects: 6,
    },
  ];

  const generatedCode = `<Tooltip
  content="${customText}"
  position="${customPosition}"
  variant="${customVariant}"${customArrow ? '\n  arrow' : ''}${customHotkey ? `\n  hotkey="${customHotkey}"` : ''}
>
  <button className="px-4 py-2 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white text-xs font-semibold rounded-xl">
    Hover Me
  </button>
</Tooltip>`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopiedCode(true);
    showToast('Kode snippet React berhasil disalin ke clipboard!', 'success');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Breadcrumb Header with Master Blue Pill Accent */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-8 h-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full inline-block" />
          <h2 className="text-base sm:text-lg font-bold text-slate-800">Tooltips</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500">
          Examples for adding custom Bootstrap tooltips with CSS and JavaScript using CSS3 for animations and data-attributes for local title storage.
        </p>
      </div>

      {/* 2-Column Responsive Layout matching ShizueFI & Stisla */}
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
              <p className="text-xs text-slate-500 mb-4 font-normal">
                Arahkan kursor atau sentuh tombol untuk memunculkan tooltip di atas, kanan, bawah, atau kiri.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {/* On Top */}
                <Tooltip
                  content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus."
                  position="top"
                  variant="dark"
                >
                  <button
                    type="button"
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all shadow-xs active:scale-95 cursor-pointer"
                  >
                    On top
                  </button>
                </Tooltip>

                {/* On Right */}
                <Tooltip
                  content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus."
                  position="right"
                  variant="dark"
                >
                  <button
                    type="button"
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all shadow-xs active:scale-95 cursor-pointer"
                  >
                    On right
                  </button>
                </Tooltip>

                {/* On Bottom */}
                <Tooltip
                  content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus."
                  position="bottom"
                  variant="dark"
                >
                  <button
                    type="button"
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all shadow-xs active:scale-95 cursor-pointer"
                  >
                    On bottom
                  </button>
                </Tooltip>

                {/* On Left */}
                <Tooltip
                  content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus."
                  position="left"
                  variant="dark"
                >
                  <button
                    type="button"
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all shadow-xs active:scale-95 cursor-pointer"
                  >
                    On left
                  </button>
                </Tooltip>
              </div>
            </div>
          </div>

          {/* 2. Card: Disabled Tooltip & Form Helper */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs relative">
            <div className="px-6 py-4.5 border-b border-slate-100 rounded-t-2xl">
              <h4 className="text-base font-bold text-[#1351b8]">Disabled Tooltip & Helper</h4>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <p className="text-xs text-slate-500 mb-3 font-normal">
                  Tooltip tetap aktif pada elemen yang dinonaktifkan dengan pembungkus kontainer yang tepat:
                </p>
                <Tooltip
                  content="Tombol ini dalam status disabled namun tetap dapat memicu tooltip bantuan."
                  position="top"
                  variant="dark"
                >
                  <span className="inline-block cursor-not-allowed">
                    <button
                      type="button"
                      disabled
                      className="px-4 py-2 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white text-xs font-semibold rounded-xl opacity-60 pointer-events-none select-none cursor-not-allowed"
                    >
                      Disabled button
                    </button>
                  </span>
                </Tooltip>
              </div>

              {/* Form Input Helper Item */}
              <div className="pt-4 border-t border-slate-100">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <span>Kode Billing Pajak (e-Billing)</span>
                  <Tooltip
                    content="Kode bayar 15 digit yang diterbitkan oleh sistem e-Billing DJP Kementerian Keuangan."
                    position="right"
                    variant="dark"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-slate-400 hover:text-[#1351b8] cursor-help transition-colors" />
                  </Tooltip>
                </label>
                <div className="relative max-w-sm">
                  <input
                    type="text"
                    readOnly
                    value="0124 9918 2026 841"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 font-mono font-medium focus:outline-none"
                  />
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Arahkan kursor ke icon tanda tanya di atas untuk membaca panduan pengisian.
                </span>
              </div>
            </div>
          </div>

          {/* 3. Card: Enterprise Action Toolbar with Hotkeys */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs relative">
            <div className="px-6 py-4.5 border-b border-slate-100 rounded-t-2xl flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-[#1351b8]">Action Toolbar with Hotkeys</h4>
                <p className="text-xs text-slate-500 mt-0.5 font-normal">
                  Tooltip terintegrasi dengan shortcut keyboard untuk efisiensi navigasi.
                </p>
              </div>
            </div>
            <div className="p-6">
              <div className="inline-flex items-center p-1.5 bg-slate-50 border border-slate-200 rounded-2xl gap-1">
                <Tooltip content="Pratinjau Dokumen" hotkey="⌘P" position="top" variant="dark">
                  <button
                    type="button"
                    onClick={() => showToast('Membuka pratinjau dokumen...', 'info')}
                    className="p-2 text-slate-600 hover:text-[#1351b8] hover:bg-white rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </Tooltip>

                <Tooltip content="Sunting Entri" hotkey="⌘E" position="top" variant="dark">
                  <button
                    type="button"
                    onClick={() => showToast('Membuka mode editor...', 'info')}
                    className="p-2 text-slate-600 hover:text-[#1351b8] hover:bg-white rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </Tooltip>

                <Tooltip content="Ekspor Laporan PDF" hotkey="⌘D" position="top" variant="primary">
                  <button
                    type="button"
                    onClick={() => showToast('Mengunduh laporan PDF...', 'success')}
                    className="p-2 text-slate-600 hover:text-[#1351b8] hover:bg-white rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </Tooltip>

                <Tooltip content="Salin Tautan Akses" hotkey="⌘C" position="top" variant="dark">
                  <button
                    type="button"
                    onClick={() => showToast('Tautan berhasil disalin!', 'success')}
                    className="p-2 text-slate-600 hover:text-[#1351b8] hover:bg-white rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </Tooltip>

                <div className="w-[1px] h-5 bg-slate-200 mx-1" />

                <Tooltip content="Hapus Permanen" hotkey="Del" position="top" variant="danger">
                  <button
                    type="button"
                    onClick={() => showToast('Data siap dihapus.', 'warning')}
                    className="p-2 text-rose-500 hover:text-white hover:bg-rose-500 rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* COLUMN 2 (RIGHT) */}
        {/* ======================================================== */}
        <div className="space-y-6">
          {/* 4. Card: Contextual Variants */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs relative">
            <div className="px-6 py-4.5 border-b border-slate-100 rounded-t-2xl">
              <h4 className="text-base font-bold text-[#1351b8]">Contextual Variants</h4>
            </div>
            <div className="p-6">
              <p className="text-xs text-slate-500 mb-4 font-normal">
                Pilihan tema warna tooltip semantik sesuai dengan tingkat kepentingan informasi.
              </p>
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Dark Slate */}
                <Tooltip content="Tema gelap default dengan kontras tinggi." position="top" variant="dark">
                  <span className="px-3.5 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-xl cursor-help shadow-xs inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-300" />
                    Dark Slate
                  </span>
                </Tooltip>

                {/* Primary Blue */}
                <Tooltip content="Brand Master Gradient Velora UI." position="top" variant="primary">
                  <span className="px-3.5 py-1.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white text-xs font-semibold rounded-xl cursor-help shadow-xs inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-300" />
                    Primary Blue
                  </span>
                </Tooltip>

                {/* Success */}
                <Tooltip content="Sinkronisasi data berhasil diselesaikan 100%." position="top" variant="success">
                  <span className="px-3.5 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-xl cursor-help shadow-xs inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-200" />
                    Success
                  </span>
                </Tooltip>

                {/* Warning */}
                <Tooltip content="Perlu tinjauan: Kuota server tersisa 12%." position="top" variant="warning">
                  <span className="px-3.5 py-1.5 bg-amber-500 text-white text-xs font-semibold rounded-xl cursor-help shadow-xs inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-100" />
                    Warning
                  </span>
                </Tooltip>

                {/* Danger */}
                <Tooltip content="Peringatan: Tindakan ini permanen dan tidak dapat dibatalkan!" position="top" variant="danger">
                  <span className="px-3.5 py-1.5 bg-rose-600 text-white text-xs font-semibold rounded-xl cursor-help shadow-xs inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-200" />
                    Destructive
                  </span>
                </Tooltip>

                {/* Light */}
                <Tooltip content="Tema terang bersih dengan border dan bayangan halus." position="top" variant="light">
                  <span className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-help shadow-xs inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-400" />
                    Clean Light
                  </span>
                </Tooltip>
              </div>
            </div>
          </div>

          {/* 5. Card: Link & Paragraph with Technical Terms */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs relative">
            <div className="px-6 py-4.5 border-b border-slate-100 rounded-t-2xl">
              <h4 className="text-base font-bold text-[#1351b8]">Link & Paragraph</h4>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <span className="text-xs font-semibold text-slate-700 block mb-2">Tautan Tunggal:</span>
                <Tooltip
                  content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus."
                  position="top"
                  variant="dark"
                >
                  <a
                    href="#/tooltip"
                    onClick={(e) => e.preventDefault()}
                    className="text-[#1351b8] font-bold underline hover:text-[#0c2869] cursor-pointer text-xs sm:text-sm"
                  >
                    Hover me!
                  </a>
                </Tooltip>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-700 block mb-2">Paragraf Glosarium:</span>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Lorem ipsum dolor sit amet, consectetur{' '}
                  <Tooltip
                    content="Adipisicing elit: Frasa Latin standar industri percetakan dan tipografi modern."
                    position="top"
                    variant="dark"
                  >
                    <span className="font-bold text-slate-800 underline decoration-slate-400 decoration-dotted cursor-help">
                      adipisicing elit
                    </span>
                  </Tooltip>
                  , sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Velora UI mendukung arsitektur modern berbasis{' '}
                  <Tooltip
                    content="Single Sign-On: Autentikasi satu pintu terpadu untuk semua modul web."
                    position="top"
                    variant="primary"
                  >
                    <span className="text-[#1351b8] font-bold underline decoration-blue-400 decoration-dotted cursor-help">
                      Single Sign-On (SSO)
                    </span>
                  </Tooltip>{' '}
                  dan otorisasi{' '}
                  <Tooltip
                    content="Role-Based Access Control: Pengendalian hak akses berdasarkan peran pengguna."
                    position="top"
                    variant="success"
                  >
                    <span className="text-emerald-700 font-bold underline decoration-emerald-400 decoration-dotted cursor-help">
                      RBAC
                    </span>
                  </Tooltip>{' '}
                  secara aman.
                </p>
              </div>
            </div>
          </div>

          {/* 6. Card: Rich Hover Card (Team Avatar Profile) */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs relative">
            <div className="px-6 py-4.5 border-b border-slate-100 rounded-t-2xl flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-[#1351b8]">Rich Hover Card</h4>
                <p className="text-xs text-slate-500 mt-0.5 font-normal">
                  Arahkan kursor ke avatar untuk melihat profil ringkas anggota tim.
                </p>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="relative"
                    onMouseEnter={() => setHoveredAvatar(member.id)}
                    onMouseLeave={() => setHoveredAvatar(null)}
                  >
                    <button
                      type="button"
                      className={`w-11 h-11 rounded-full ${member.bg} text-white font-bold text-xs flex items-center justify-center shadow-md ring-2 ring-white hover:scale-110 transition-all cursor-pointer relative`}
                    >
                      {member.initials}
                      <span
                        className={`absolute bottom-0 right-0 w-3 h-3 ${member.statusColor} border-2 border-white rounded-full`}
                      />
                    </button>

                    {hoveredAvatar === member.id && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-4 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 animate-in fade-in zoom-in-95 duration-150 text-left">
                        <div className="flex items-center gap-3 mb-3">
                          <div
                            className={`w-10 h-10 rounded-full ${member.bg} text-white font-bold text-xs flex items-center justify-center`}
                          >
                            {member.initials}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h5 className="text-xs font-bold text-slate-800">{member.name}</h5>
                              <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500/20" />
                            </div>
                            <span className="text-[11px] font-medium text-slate-500 block">{member.role}</span>
                          </div>
                        </div>

                        <div className="space-y-1.5 text-xs text-slate-600 mb-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Status:</span>
                            <span className="font-semibold text-slate-700 flex items-center gap-1">
                              <span className={`w-2 h-2 rounded-full ${member.statusColor}`} />
                              {member.status}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Email:</span>
                            <span className="font-medium text-slate-700">{member.email}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Proyek Aktif:</span>
                            <span className="font-bold text-[#1351b8]">{member.projects} Proyek</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => showToast(`Mengirim pesan ke ${member.name}...`, 'info')}
                            className="flex-1 py-1.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white text-[11px] font-semibold rounded-lg hover:shadow-xs transition-all cursor-pointer text-center"
                          >
                            Kirim Pesan
                          </button>
                        </div>

                        {/* Arrow */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-6 border-x-transparent border-t-6 border-t-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* FULL WIDTH: INTERACTIVE PLAYGROUND & REACT CODE GENERATOR */}
      {/* ======================================================== */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs relative">
        <div className="px-6 py-4.5 border-b border-slate-100 rounded-t-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-base font-bold text-[#1351b8] flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#1351b8]" />
              Interactive Tooltip Playground & Code Generator
            </h4>
            <p className="text-xs text-slate-500 mt-0.5 font-normal">
              Eksplorasi properti posisi, tema warna, teks kustom, serta salin kode JSX siap pakai.
            </p>
          </div>
          <button
            type="button"
            onClick={handleCopyCode}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all shadow-xs cursor-pointer active:scale-95 self-start sm:self-auto"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? 'Tersalin ke Clipboard!' : 'Salin Kode React'}</span>
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Controls Form (7 Cols) */}
          <div className="lg:col-span-7 space-y-4.5">
            {/* Position Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Posisi Tooltip (Position):</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['top', 'right', 'bottom', 'left'] as TooltipPosition[]).map((pos) => (
                  <button
                    key={pos}
                    type="button"
                    onClick={() => setCustomPosition(pos)}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer capitalize ${
                      customPosition === pos
                        ? 'bg-blue-50 border-[#1351b8] text-[#1351b8] shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </div>

            {/* Variant Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Varian Warna (Variant):</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(
                  [
                    { id: 'dark', label: 'Dark Slate' },
                    { id: 'primary', label: 'Primary Blue' },
                    { id: 'success', label: 'Success' },
                    { id: 'warning', label: 'Warning' },
                    { id: 'danger', label: 'Destructive' },
                    { id: 'light', label: 'Clean Light' },
                  ] as { id: TooltipVariant; label: string }[]
                ).map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setCustomVariant(v.id)}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer text-left flex items-center justify-between ${
                      customVariant === v.id
                        ? 'bg-blue-50 border-[#1351b8] text-[#1351b8] shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>{v.label}</span>
                    {customVariant === v.id && <Check className="w-3.5 h-3.5 text-[#1351b8]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Content & Hotkey Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Teks Konten Tooltip:</label>
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Masukkan teks tooltip..."
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1351b8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Shortcut Keyboard (Opsional):</label>
                <input
                  type="text"
                  value={customHotkey}
                  onChange={(e) => setCustomHotkey(e.target.value)}
                  placeholder="Contoh: ⌘K atau Ctrl+S"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1351b8]"
                />
              </div>
            </div>

            {/* Arrow Toggle */}
            <div className="flex items-center gap-2 pt-1">
              <input
                id="toggleArrow"
                type="checkbox"
                checked={customArrow}
                onChange={(e) => setCustomArrow(e.target.checked)}
                className="w-4 h-4 rounded text-[#1351b8] focus:ring-blue-500 border-slate-300 cursor-pointer"
              />
              <label htmlFor="toggleArrow" className="text-xs font-semibold text-slate-700 cursor-pointer select-none">
                Gunakan Penunjuk Panah (Pointer Arrow)
              </label>
            </div>
          </div>

          {/* Live Preview & Code Output (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Live Interactive Preview Box */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100/70 border border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[160px] text-center relative">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 absolute top-3 left-4">
                Live Interactive Preview
              </span>
              <Tooltip
                content={customText || 'Tooltip Text'}
                position={customPosition}
                variant={customVariant}
                arrow={customArrow}
                hotkey={customHotkey || undefined}
              >
                <button
                  type="button"
                  className="px-5 py-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  Arahkan Kursor ke Sini
                </button>
              </Tooltip>
              <span className="text-[11px] text-slate-500 mt-4">
                Hover atau sentuh tombol untuk melihat hasil instan
              </span>
            </div>

            {/* Generated Code Snippet */}
            <div className="bg-slate-900 rounded-2xl p-4 text-xs font-mono text-slate-300 relative border border-slate-800 shadow-inner overflow-x-auto">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-400">
                <span>React JSX</span>
                <span className="text-slate-500">Tooltip.tsx</span>
              </div>
              <pre className="text-emerald-400 leading-relaxed overflow-x-auto">{generatedCode}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dedicated Typography Showcase matching ShizueFI & Stisla with Master Gradients & Advanced Interactivity
function TypographyView() {
  const [fontSize, setFontSize] = useState<'text-xs' | 'text-sm' | 'text-base' | 'text-lg' | 'text-xl' | 'text-2xl' | 'text-3xl'>('text-lg');
  const [fontWeight, setFontWeight] = useState<'font-normal' | 'font-medium' | 'font-semibold' | 'font-bold' | 'font-extrabold'>('font-semibold');
  const [lineHeight, setLineHeight] = useState<'leading-tight' | 'leading-normal' | 'leading-relaxed' | 'leading-loose'>('leading-relaxed');
  const [previewText, setPreviewText] = useState('Velora UI menghadirkan hierarki tipografi yang tajam, proporsional, dan mudah dibaca pada berbagai ukuran layar.');
  const [copiedCodeSnippet, setCopiedCodeSnippet] = useState(false);
  const [checklistTasks, setChecklistTasks] = useState<{ id: number; text: string; done: boolean }[]>([
    { id: 1, text: 'Konfigurasi hierarki heading H1 - H6 proporsional', done: true },
    { id: 2, text: 'Gunakan kontras teks slate tajam (#1e293b / #334155)', done: true },
    { id: 3, text: 'Hindari teks washed-out abu-abu pudar (#94a3b8) pada body text', done: true },
    { id: 4, text: 'Implementasikan blockquote dengan accent border Master Blue', done: false },
    { id: 5, text: 'Dukung sintaks kode inline dan blok kode teknis', done: false },
  ]);

  const toggleChecklist = (id: number) => {
    setChecklistTasks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const colorPalette = [
    {
      name: 'Primary',
      hex: '#175cd3',
      subHex: '#0f3ba0',
      bgClass: 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0]',
      textClass: 'text-white',
      borderClass: 'border-transparent',
      usage: 'Brand Master Gradient, tombol aksi utama, link aktif',
    },
    {
      name: 'Secondary',
      hex: '#64748b',
      bgClass: 'bg-slate-500',
      textClass: 'text-white',
      borderClass: 'border-transparent',
      usage: 'Teks sekunder, border pembatas, tombol sekunder',
    },
    {
      name: 'Success',
      hex: '#059669',
      bgClass: 'bg-emerald-600',
      textClass: 'text-white',
      borderClass: 'border-transparent',
      usage: 'Status aktif, verifikasi berhasil, badge positif',
    },
    {
      name: 'Info',
      hex: '#0ea5e9',
      bgClass: 'bg-sky-500',
      textClass: 'text-white',
      borderClass: 'border-transparent',
      usage: 'Pemberitahuan informatif, panduan bantuan sistem',
    },
    {
      name: 'Warning',
      hex: '#f59e0b',
      bgClass: 'bg-amber-500',
      textClass: 'text-white',
      borderClass: 'border-transparent',
      usage: 'Peringatan perhatian, masa tenggang, status pending',
    },
    {
      name: 'Danger',
      hex: '#e11d48',
      bgClass: 'bg-rose-600',
      textClass: 'text-white',
      borderClass: 'border-transparent',
      usage: 'Pesan kesalahan fatal, aksi destruktif, alert kritis',
    },
    {
      name: 'Light',
      hex: '#f8fafc',
      bgClass: 'bg-slate-100',
      textClass: 'text-slate-700',
      borderClass: 'border-slate-200',
      usage: 'Background container, area non-aktif, badge netral',
    },
    {
      name: 'Dark',
      hex: '#0f172a',
      bgClass: 'bg-slate-900',
      textClass: 'text-white',
      borderClass: 'border-transparent',
      usage: 'Teks heading utama, footer pekat, tooltip popover',
    },
  ];

  const codeSnippet = `// Inisialisasi tema tipografi Velora UI
interface TypographyTheme {
  fontFamily: 'Inter, sans-serif';
  baseSize: '16px';
  headingWeight: 600;
  crispSlateContrast: '#1e293b';
}

const theme: TypographyTheme = {
  fontFamily: 'Inter, sans-serif',
  baseSize: '16px',
  headingWeight: 600,
  crispSlateContrast: '#1e293b',
};`;

  const copyCode = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopiedCodeSnippet(true);
    showToast('Cuplikan kode berhasil disalin!', 'success');
    setTimeout(() => setCopiedCodeSnippet(false), 2000);
  };

  const copyColor = (name: string, hex: string) => {
    navigator.clipboard.writeText(hex);
    showToast(`Warna ${name} (${hex}) disalin ke clipboard!`, 'success');
  };

  const generatedSandboxClass = `${fontSize} ${fontWeight} ${lineHeight} text-slate-800 transition-all`;

  return (
    <div className="space-y-6">
      {/* Page Title & Breadcrumb Header with Master Blue Pill Accent */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-8 h-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full inline-block" />
          <h2 className="text-base sm:text-lg font-bold text-slate-800">Typography</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500">
          Documentation and examples for Bootstrap typography, including global settings, headings, body text, lists, and more.
        </p>
      </div>

      {/* 2-Column Responsive Layout matching ShizueFI & Stisla */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* ======================================================== */}
        {/* COLUMN 1 (LEFT) */}
        {/* ======================================================== */}
        <div className="space-y-6">
          {/* 1. Card: Text & Headings */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs relative">
            <div className="px-6 py-4.5 border-b border-slate-100 rounded-t-2xl flex items-center justify-between">
              <h4 className="text-base font-bold text-[#1351b8]">Text</h4>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">H1 - H6 Scale</span>
            </div>
            <div className="p-6 space-y-5">
              {/* Heading 1 to 6 with visual labels */}
              <div className="space-y-3 pb-5 border-b border-slate-100">
                <div className="flex items-baseline justify-between gap-2">
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">Heading 1</h1>
                  <span className="text-[11px] font-mono font-medium text-slate-400 shrink-0">36px / 2.25rem</span>
                </div>

                <div className="flex items-baseline justify-between gap-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">Heading 2</h2>
                  <span className="text-[11px] font-mono font-medium text-slate-400 shrink-0">30px / 1.875rem</span>
                </div>

                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-800">Heading 3</h3>
                  <span className="text-[11px] font-mono font-medium text-slate-400 shrink-0">24px / 1.5rem</span>
                </div>

                <div className="flex items-baseline justify-between gap-2">
                  <h4 className="text-lg sm:text-xl font-bold text-slate-800">Heading 4</h4>
                  <span className="text-[11px] font-mono font-medium text-slate-400 shrink-0">20px / 1.25rem</span>
                </div>

                <div className="flex items-baseline justify-between gap-2">
                  <h5 className="text-base sm:text-lg font-semibold text-slate-800">Heading 5</h5>
                  <span className="text-[11px] font-mono font-medium text-slate-400 shrink-0">18px / 1.125rem</span>
                </div>

                <div className="flex items-baseline justify-between gap-2">
                  <h6 className="text-sm sm:text-base font-semibold text-slate-700">Heading 6</h6>
                  <span className="text-[11px] font-mono font-medium text-slate-400 shrink-0">16px / 1.0rem</span>
                </div>
              </div>

              {/* Fancy Display Heading with secondary text */}
              <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-bold text-slate-800">
                  Fancy display heading{' '}
                  <span className="text-slate-400 font-normal text-base sm:text-lg">With faded secondary text</span>
                </h3>
              </div>

              {/* Lead Paragraph */}
              <div className="space-y-1">
                <p className="text-base sm:text-lg text-slate-700 font-normal leading-relaxed">
                  <span className="font-semibold text-slate-900">Lead — </span>
                  Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Duis mollis, est non commodo
                  luctus.
                </p>
              </div>

              {/* Standard Paragraph */}
              <div className="space-y-1">
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  <span className="font-semibold text-slate-800">Paragraph — </span>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore
                  et dolore magna aliqua. Ut enim ad minim veniam.
                </p>
              </div>

              {/* Interactive Clickable Link */}
              <div>
                <a
                  href="#/typography"
                  onClick={(e) => {
                    e.preventDefault();
                    showToast('Tautan interaktif berhasil diklik!', 'info');
                  }}
                  className="text-[#1351b8] hover:text-[#0c2869] text-xs sm:text-sm font-semibold underline inline-flex items-center gap-1 cursor-pointer transition-colors"
                >
                  You can click me!
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* 2. Card: Text Colors */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs relative">
            <div className="px-6 py-4.5 border-b border-slate-100 rounded-t-2xl">
              <h4 className="text-base font-bold text-[#1351b8]">Text Colors</h4>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-[#1351b8] font-bold text-sm">Text Primary</span>
                <span className="text-xs font-mono text-slate-400">text-[#1351b8]</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 font-medium text-sm">Text Secondary</span>
                <span className="text-xs font-mono text-slate-400">text-slate-500</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-emerald-600 font-semibold text-sm">Text Success</span>
                <span className="text-xs font-mono text-slate-400">text-emerald-600</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-sky-600 font-semibold text-sm">Text Info</span>
                <span className="text-xs font-mono text-slate-400">text-sky-600</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-amber-600 font-semibold text-sm">Text Warning</span>
                <span className="text-xs font-mono text-slate-400">text-amber-600</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-rose-600 font-semibold text-sm">Text Danger</span>
                <span className="text-xs font-mono text-slate-400">text-rose-600</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="bg-slate-900 text-slate-200 px-2 py-0.5 rounded text-xs font-semibold">
                  Text Light (Dark Background)
                </span>
                <span className="text-xs font-mono text-slate-400">text-slate-200</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-900 font-extrabold text-sm">Text Dark</span>
                <span className="text-xs font-mono text-slate-400">text-slate-900</span>
              </div>
            </div>
          </div>

          {/* 3. Card: Inline Text Element */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs relative">
            <div className="px-6 py-4.5 border-b border-slate-100 rounded-t-2xl">
              <h4 className="text-base font-bold text-[#1351b8]">Inline Text Element</h4>
            </div>
            <div className="p-6 space-y-3.5 text-xs sm:text-sm text-slate-700">
              <p>
                You can use the mark tag to{' '}
                <mark className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-semibold">highlight</mark>{' '}
                text.
              </p>
              <p>
                <del className="line-through text-slate-500">
                  This line of text is meant to be treated as deleted text.
                </del>
              </p>
              <p>
                <s className="line-through text-slate-500">
                  This line of text is meant to be treated as no longer accurate.
                </s>
              </p>
              <p>
                <ins className="underline decoration-[#1351b8] text-slate-900 font-medium">
                  This line of text is meant to be treated as an addition to the document.
                </ins>
              </p>
              <p>
                <u className="underline decoration-slate-400">This line of text will render as underlined</u>
              </p>
              <p>
                <small className="text-xs text-slate-500">This line of text is meant to be treated as fine print.</small>
              </p>
              <p>
                <strong className="font-bold text-slate-900">This line rendered as bold text.</strong>
              </p>
              <p>
                <em className="italic text-slate-700">This line rendered as italicized text.</em>
              </p>
              <p className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-600">
                <span>Pintasan keyboard: Tekan</span>
                <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-xs font-mono font-bold text-slate-700 shadow-xs">
                  Ctrl + S
                </kbd>
                <span>untuk menyimpan perubahan.</span>
              </p>
            </div>
          </div>

          {/* 4. Card: Abbreviations with Interactive Tooltip */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs relative">
            <div className="px-6 py-4.5 border-b border-slate-100 rounded-t-2xl">
              <h4 className="text-base font-bold text-[#1351b8]">Abbreviations</h4>
            </div>
            <div className="p-6 space-y-3">
              <p className="text-xs text-slate-500 mb-2">
                Arahkan kursor pada singkatan di bawah untuk melihat kepanjangannya melalui tooltip otomatis:
              </p>
              <div className="flex flex-wrap items-center gap-6">
                <div>
                  <Tooltip content="Attribute: Properti tambahan pada tag markup HTML." position="top">
                    <abbr className="text-sm font-bold text-slate-800 border-b border-dotted border-slate-400 cursor-help">
                      attr
                    </abbr>
                  </Tooltip>
                </div>

                <div>
                  <Tooltip
                    content="HyperText Markup Language: Format standar pembuatan halaman web sedunia."
                    position="top"
                    variant="primary"
                  >
                    <abbr className="text-sm font-bold text-[#1351b8] border-b border-dotted border-[#1351b8] cursor-help">
                      HTML
                    </abbr>
                  </Tooltip>
                </div>

                <div>
                  <Tooltip
                    content="Application Programming Interface: Saluran integrasi antar sistem backend."
                    position="top"
                    variant="dark"
                  >
                    <abbr className="text-sm font-bold text-slate-800 border-b border-dotted border-slate-400 cursor-help">
                      API
                    </abbr>
                  </Tooltip>
                </div>

                <div>
                  <Tooltip
                    content="Software as a Service: Model aplikasi cloud siap pakai berbasis langganan."
                    position="top"
                    variant="success"
                  >
                    <abbr className="text-sm font-bold text-emerald-700 border-b border-dotted border-emerald-500 cursor-help">
                      SaaS
                    </abbr>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* COLUMN 2 (RIGHT) */}
        {/* ======================================================== */}
        <div className="space-y-6">
          {/* 5. Card: Brand & Semantic Palette (Color) */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs relative">
            <div className="px-6 py-4.5 border-b border-slate-100 rounded-t-2xl flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-[#1351b8]">Color</h4>
                <p className="text-xs text-slate-500 mt-0.5">Klik kotak warna untuk menyalin nilai HEX ke clipboard.</p>
              </div>
              <Palette className="w-4 h-4 text-[#1351b8]" />
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {colorPalette.map((col) => (
                  <button
                    key={col.name}
                    type="button"
                    onClick={() => copyColor(col.name, col.hex)}
                    className={`${col.bgClass} ${col.textClass} border ${col.borderClass} p-3 rounded-xl shadow-xs text-center hover:scale-105 active:scale-95 transition-all cursor-pointer relative group flex flex-col items-center justify-center min-h-[64px]`}
                  >
                    <span className="text-xs font-bold">{col.name}</span>
                    <span className="text-[10px] font-mono opacity-80 mt-0.5">{col.hex}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 6. Card: Text Block, Quotes & Code */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs relative">
            <div className="px-6 py-4.5 border-b border-slate-100 rounded-t-2xl">
              <h4 className="text-base font-bold text-[#1351b8]">Text Block</h4>
            </div>
            <div className="p-6 space-y-6">
              {/* Blockquote with Blue Pill Accent */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-1.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full inline-block" />
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">Blockquote</span>
                </div>
                <div className="border-l-4 border-[#175cd3] pl-4 py-3 bg-slate-50/70 rounded-r-xl italic text-slate-700 text-xs sm:text-sm relative">
                  <Quote className="w-4 h-4 text-blue-300 absolute top-2 right-2 opacity-50" />
                  "SHIZUEFI made with hand — elevated into Velora UI with performance and executive elegance."
                </div>
              </div>

              {/* Inline Code with Blue Pill Accent */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-1.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full inline-block" />
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">Inline Code</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore
                  et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                  aliquip ex ea commodo consequat. Gunakan helper{' '}
                  <code className="text-xs font-mono font-semibold bg-slate-100 text-[#1351b8] px-2 py-0.5 rounded-lg border border-slate-200">
                    formatSlug()
                  </code>{' '}
                  untuk format otomatis.
                </p>
              </div>

              {/* Code Block with Blue Pill Accent */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-1.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full inline-block" />
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">Code Block</span>
                  </div>
                  <button
                    type="button"
                    onClick={copyCode}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-[#1351b8] transition-colors cursor-pointer"
                  >
                    {copiedCodeSnippet ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCodeSnippet ? 'Tersalin' : 'Salin Kode'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-500 mb-2">
                  We use modern clean styling for syntax blocks, you can adjust themes, syntax and more. Visit their documentation.
                </p>
                <div className="bg-slate-900 rounded-xl p-3.5 text-xs font-mono text-slate-300 border border-slate-800 shadow-inner overflow-x-auto">
                  <pre className="text-emerald-400"><code>var code = 'Hello';</code></pre>
                </div>
              </div>
            </div>
          </div>

          {/* 7. Card: Display Headings */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs relative">
            <div className="px-6 py-4.5 border-b border-slate-100 rounded-t-2xl">
              <h4 className="text-base font-bold text-[#1351b8]">Display</h4>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-baseline justify-between border-b border-slate-50 pb-3">
                <span className="text-5xl sm:text-6xl font-light text-slate-700 tracking-tight">Display 1</span>
                <span className="text-xs font-mono text-slate-400">text-6xl</span>
              </div>
              <div className="flex items-baseline justify-between border-b border-slate-50 pb-3">
                <span className="text-4xl sm:text-5xl font-light text-slate-700 tracking-tight">Display 2</span>
                <span className="text-xs font-mono text-slate-400">text-5xl</span>
              </div>
              <div className="flex items-baseline justify-between border-b border-slate-50 pb-3">
                <span className="text-3xl sm:text-4xl font-normal text-slate-700 tracking-tight">Display 3</span>
                <span className="text-xs font-mono text-slate-400">text-4xl</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-normal text-slate-700 tracking-tight">Display 4</span>
                <span className="text-xs font-mono text-slate-400">text-3xl</span>
              </div>
            </div>
          </div>

          {/* 8. Card: Naming a Source */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs relative">
            <div className="px-6 py-4.5 border-b border-slate-100 rounded-t-2xl">
              <h4 className="text-base font-bold text-[#1351b8]">Naming a Source</h4>
            </div>
            <div className="p-6">
              <blockquote className="border-l-4 border-slate-300 pl-4 py-2 text-slate-700 text-xs sm:text-sm">
                <p className="italic leading-relaxed font-normal">
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante."
                </p>
                <footer className="mt-2 text-xs font-medium text-slate-500">
                  — Someone famous in <cite className="text-[#1351b8] font-semibold not-italic">Source Title</cite>
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION: LISTS (UNORDERED, ORDERED, AND INTERACTIVE CHECKLIST) */}
      {/* ======================================================== */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-8 h-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full inline-block" />
            <h3 className="text-base font-bold text-slate-800">List</h3>
          </div>
          <p className="text-xs text-slate-500">
            Penyajian informasi terstruktur dalam format tidak berurutan, berurutan nomor, dan daftar tugas interaktif.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card: Unordered List */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6">
            <h4 className="text-sm font-bold text-[#1351b8] mb-3">Unordered List</h4>
            <p className="text-xs text-slate-500 mb-3.5">Sunt in culpa qui officia deserunt mollit anim id est laborum:</p>
            <ul className="list-disc pl-8 sm:pl-9 space-y-2 text-xs text-slate-600 font-normal leading-relaxed">
              <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod</li>
              <li>tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,</li>
              <li>quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo</li>
              <li>consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse</li>
              <li>cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non</li>
              <li>proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</li>
            </ul>
          </div>

          {/* Card: Ordered List */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6">
            <h4 className="text-sm font-bold text-[#1351b8] mb-3">Ordered List</h4>
            <p className="text-xs text-slate-500 mb-3.5">Sunt in culpa qui officia deserunt mollit anim id est laborum:</p>
            <ol className="list-decimal pl-8 sm:pl-9 space-y-2 text-xs text-slate-600 font-normal leading-relaxed">
              <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod</li>
              <li>tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,</li>
              <li>quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo</li>
              <li>consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse</li>
              <li>cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non</li>
              <li>proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</li>
              <li>consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse</li>
            </ol>
          </div>

          {/* Card: Interactive Task Checklist */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6">
            <h4 className="text-sm font-bold text-[#1351b8] mb-3">Interactive Checklist</h4>
            <p className="text-xs text-slate-500 mb-3">Standar penulisan tipografi sistem Velora UI:</p>
            <div className="space-y-2.5">
              {checklistTasks.map((task) => (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => toggleChecklist(task.id)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start gap-2.5 cursor-pointer ${
                    task.done
                      ? 'bg-blue-50/50 border-blue-200/60 text-slate-800'
                      : 'bg-slate-50/70 border-slate-200/80 text-slate-600 hover:bg-slate-100/70'
                  }`}
                >
                  <span
                    className={`mt-0.5 w-4 h-4 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                      task.done ? 'bg-[#1351b8] text-white' : 'border border-slate-300 bg-white'
                    }`}
                  >
                    {task.done && <Check className="w-3 h-3 stroke-[3]" />}
                  </span>
                  <span className={`text-xs ${task.done ? 'font-medium text-slate-800' : 'text-slate-600'}`}>
                    {task.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION: INTERACTIVE TYPOGRAPHY SANDBOX & SCALE TESTER */}
      {/* ======================================================== */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs relative">
        <div className="px-6 py-4.5 border-b border-slate-100 rounded-t-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-base font-bold text-[#1351b8] flex items-center gap-2">
              <Type className="w-4 h-4 text-[#1351b8]" />
              Interactive Typography Sandbox & Scale Tester
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Eksplorasi perpaduan ukuran font, ketebalan (*weight*), dan jarak baris (*leading*) secara dinamis.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(generatedSandboxClass);
              showToast('Class Tailwind berhasil disalin!', 'success');
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all shadow-xs cursor-pointer active:scale-95 self-start sm:self-auto"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Salin Class Tailwind</span>
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Controls (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Font Size Pills */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Ukuran Font (Font Size):</label>
              <div className="flex flex-wrap gap-1.5">
                {(['text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl'] as const).map(
                  (sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setFontSize(sz)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                        fontSize === sz
                          ? 'bg-blue-50 border-[#1351b8] text-[#1351b8] shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {sz}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Font Weight Pills */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Ketebalan Font (Font Weight):</label>
              <div className="flex flex-wrap gap-1.5">
                {(
                  [
                    { id: 'font-normal', label: 'Regular (400)' },
                    { id: 'font-medium', label: 'Medium (500)' },
                    { id: 'font-semibold', label: 'Semibold (600)' },
                    { id: 'font-bold', label: 'Bold (700)' },
                    { id: 'font-extrabold', label: 'Extrabold (800)' },
                  ] as const
                ).map((wt) => (
                  <button
                    key={wt.id}
                    type="button"
                    onClick={() => setFontWeight(wt.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                      fontWeight === wt.id
                        ? 'bg-blue-50 border-[#1351b8] text-[#1351b8] shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {wt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Line Height Pills */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Jarak Baris (Line Height):</label>
              <div className="flex flex-wrap gap-1.5">
                {(
                  [
                    { id: 'leading-tight', label: 'Tight (1.25)' },
                    { id: 'leading-normal', label: 'Normal (1.5)' },
                    { id: 'leading-relaxed', label: 'Relaxed (1.625)' },
                    { id: 'leading-loose', label: 'Loose (2.0)' },
                  ] as const
                ).map((lh) => (
                  <button
                    key={lh.id}
                    type="button"
                    onClick={() => setLineHeight(lh.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                      lineHeight === lh.id
                        ? 'bg-blue-50 border-[#1351b8] text-[#1351b8] shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {lh.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Editable Preview Text Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Ubah Teks Uji Coba:</label>
              <textarea
                rows={2}
                value={previewText}
                onChange={(e) => setPreviewText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1351b8]"
              />
            </div>
          </div>

          {/* Real-time Rendered Result (6 cols) */}
          <div className="lg:col-span-6 space-y-3">
            <div className="bg-gradient-to-br from-slate-50 to-slate-100/80 border border-slate-200 rounded-2xl p-6 min-h-[200px] flex flex-col justify-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3 block">
                Live Rendered Output
              </span>
              <p className={generatedSandboxClass}>{previewText || 'Ketik teks untuk melihat pratinjau...'}</p>
            </div>

            <div className="bg-slate-900 rounded-xl px-4 py-2.5 text-xs font-mono text-emerald-400 flex items-center justify-between border border-slate-800">
              <span className="text-slate-400">Class:</span>
              <span className="font-semibold">{generatedSandboxClass}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dedicated Article Showcase matching ShizueFI & Stisla with Master Gradients & Interactive Features
interface ArticleItem {
  id: number;
  title: string;
  category: string;
  desc: string;
  date?: string;
  readTime: string;
  badge?: string;
  badgeColor?: string;
  accentGradient: string;
  iconBg: string;
  iconColor: string;
  author?: {
    name: string;
    role: string;
    initials: string;
    bg: string;
  };
  views?: string;
  likes?: number;
}

function ArticleView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([2, 6]);
  const [likedIds, setLikedIds] = useState<number[]>([1, 5, 9]);
  const [activeArticleModal, setActiveArticleModal] = useState<ArticleItem | null>(null);

  const categories = ['Semua', 'Engineering', 'Design System', 'Security', 'Cloud & DevOps'];

  const toggleBookmark = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    showToast(
      bookmarkedIds.includes(id)
        ? 'Artikel dihapus dari bookmark'
        : 'Artikel berhasil disimpan ke bookmark!',
      'info'
    );
  };

  const toggleLike = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    showToast(
      likedIds.includes(id) ? 'Batal menyukai artikel' : 'Menyukai artikel ini!',
      'success'
    );
  };

  // Section 1: Article Style A (Overlay Title Banner)
  const articlesStyleA: ArticleItem[] = [
    {
      id: 1,
      title: 'Arsitektur Micro-Frontend Skala Enterprise',
      category: 'Engineering',
      readTime: '5 mnt baca',
      desc: 'Panduan lengkap pemisahan aplikasi web monolitik menjadi modul independen dengan isolasi runtime.',
      accentGradient: 'from-blue-600/20 via-sky-500/15 to-indigo-600/25',
      iconBg: 'bg-blue-500/10 border-blue-200 text-blue-600',
      iconColor: '#175cd3',
    },
    {
      id: 2,
      title: 'Optimasi Query & Sharding Database Skala Besar',
      category: 'Engineering',
      readTime: '7 mnt baca',
      desc: 'Strategi pemartisian tabel horizontal dan replikasi multi-master untuk menangani jutaan transaksi.',
      accentGradient: 'from-orange-500/20 via-amber-500/15 to-orange-600/25',
      iconBg: 'bg-orange-500/10 border-orange-200 text-orange-600',
      iconColor: '#f97316',
    },
    {
      id: 3,
      title: 'Integrasi Single Sign-On (SSO) Terpusat',
      category: 'Security',
      readTime: '4 mnt baca',
      desc: 'Implementasi protokol OAuth 2.0 dan SAML 2.0 untuk autentikasi terpusat pada seluruh sistem ekosistem.',
      accentGradient: 'from-amber-600/20 via-amber-500/15 to-yellow-600/25',
      iconBg: 'bg-amber-500/10 border-amber-200 text-amber-600',
      iconColor: '#d97706',
    },
    {
      id: 4,
      title: 'Penerapan Zero Trust Network Access (ZTNA)',
      category: 'Security',
      readTime: '6 mnt baca',
      desc: 'Paradigma keamanan modern berbasis verifikasi eksplisit, akses hak terkecil, dan asumsi pelanggaran.',
      accentGradient: 'from-emerald-500/20 via-teal-500/15 to-emerald-600/25',
      iconBg: 'bg-emerald-500/10 border-emerald-200 text-emerald-600',
      iconColor: '#059669',
    },
  ];

  // Section 2: Article Style B (Editorial Card with Badges)
  const articlesStyleB: ArticleItem[] = [
    {
      id: 5,
      title: 'Standar Desain Velora UI v2: Executive Clean Cards',
      category: 'Design System',
      readTime: '4 mnt baca',
      badge: 'Trending',
      badgeColor: 'bg-rose-500 text-white',
      desc: 'Evolusi prinsip visual modern dengan Master Gradients dan tipografi kontras tinggi tanpa abu-abu pudar.',
      accentGradient: 'from-sky-500/15 via-blue-500/10 to-indigo-500/15',
      iconBg: 'bg-sky-500/10 border-sky-200 text-sky-600',
      iconColor: '#0284c7',
    },
    {
      id: 6,
      title: 'Strategi Caching Redis untuk Latensi Sub-Milidetik',
      category: 'Cloud & DevOps',
      readTime: '6 mnt baca',
      badge: 'Populer',
      badgeColor: 'bg-amber-500 text-white',
      desc: 'Meningkatkan throughput pemrosesan transaksi hingga 10x lipat dengan caching berlapis dan invalidasi cerdas.',
      accentGradient: 'from-rose-500/15 via-pink-500/10 to-red-500/15',
      iconBg: 'bg-rose-500/10 border-rose-200 text-rose-600',
      iconColor: '#e11d48',
    },
    {
      id: 7,
      title: 'Manajemen Autentikasi JWT & Rotasi Refresh Token',
      category: 'Security',
      readTime: '5 mnt baca',
      badge: 'Pilihan Editor',
      badgeColor: 'bg-emerald-600 text-white',
      desc: 'Praktik terbaik mengamankan sesi pengguna web modern dari serangan token replay dan CSRF vulnerabilities.',
      accentGradient: 'from-emerald-500/15 via-teal-500/10 to-emerald-500/15',
      iconBg: 'bg-emerald-500/10 border-emerald-200 text-emerald-600',
      iconColor: '#10b981',
    },
    {
      id: 8,
      title: 'Automasi Pipeline CI/CD Menggunakan GitHub Actions',
      category: 'Cloud & DevOps',
      readTime: '8 mnt baca',
      badge: 'Rilis Baru',
      badgeColor: 'bg-blue-600 text-white',
      desc: 'Workflow rilis multi-tahap dengan pengujian otomatis, pemeriksaan keamanan, dan deploy tanpa downtime.',
      accentGradient: 'from-lime-500/15 via-emerald-500/10 to-teal-500/15',
      iconBg: 'bg-teal-500/10 border-teal-200 text-teal-600',
      iconColor: '#0d9488',
    },
  ];

  // Section 3: Article Style C (Author Byline & Rich Author Details)
  const articlesStyleC: ArticleItem[] = [
    {
      id: 9,
      title: 'Modernisasi Sistem Payroll & Kasbon Karyawan Berbasis Cloud',
      category: 'Engineering',
      date: 'NEWS • 5 HARI LALU',
      readTime: '5 mnt baca',
      desc: 'Transformasi modul penggajian otomatis dengan validasi multi-level approval secara real-time dan audit trail akurat.',
      accentGradient: 'from-blue-600/20 via-sky-500/15 to-indigo-600/20',
      iconBg: 'bg-blue-500/10 border-blue-200 text-blue-600',
      iconColor: '#175cd3',
      author: {
        name: 'Hasan Basri',
        role: 'WEB DEVELOPER',
        initials: 'HB',
        bg: 'bg-blue-600',
      },
      views: '1.4k',
      likes: 84,
    },
    {
      id: 10,
      title: 'Riset Desain UI/UX: Mengurangi Friction pada Form Checkout Enterprise',
      category: 'Design System',
      date: 'DESIGN • 3 HARI LALU',
      readTime: '4 mnt baca',
      desc: 'Hasil uji kegunaan (usability testing) pada 500 pengguna aktif dengan tingkat konversi alur transaksi mencapai 98%.',
      accentGradient: 'from-orange-500/20 via-amber-500/15 to-orange-600/20',
      iconBg: 'bg-orange-500/10 border-orange-200 text-orange-600',
      iconColor: '#f97316',
      author: {
        name: 'Rizal Fakhri',
        role: 'UX DESIGNER',
        initials: 'RF',
        bg: 'bg-sky-500',
      },
      views: '2.1k',
      likes: 126,
    },
    {
      id: 11,
      title: 'Pengembangan Aplikasi Pendamping Mobile dengan React Native 0.76',
      category: 'Engineering',
      date: 'MOBILE • 1 HARI LALU',
      readTime: '6 mnt baca',
      desc: 'Sinkronisasi offline-first dan push notification instan untuk verifikasi kehadiran dan perizinan karyawan di lapangan.',
      accentGradient: 'from-purple-600/20 via-indigo-500/15 to-purple-600/20',
      iconBg: 'bg-purple-500/10 border-purple-200 text-purple-600',
      iconColor: '#9333ea',
      author: {
        name: 'Irwansyah Saputra',
        role: 'MOBILE DEVELOPER',
        initials: 'IS',
        bg: 'bg-purple-600',
      },
      views: '980',
      likes: 62,
    },
  ];

  const filterArticles = (list: ArticleItem[]) => {
    return list.filter((item) => {
      const matchCategory = selectedCategory === 'Semua' || item.category === selectedCategory;
      const matchSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  };

  const filteredStyleA = filterArticles(articlesStyleA);
  const filteredStyleB = filterArticles(articlesStyleB);
  const filteredStyleC = filterArticles(articlesStyleC);

  return (
    <div className="space-y-8">
      {/* Page Title & Breadcrumb Header with Master Blue Pill Accent */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-8 h-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full inline-block" />
            <h2 className="text-base sm:text-lg font-bold text-slate-800">Article</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            This article component is based on card and flexbox, featuring multiple modern layout variants.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari artikel..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 text-xs rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1351b8] shadow-xs"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ======================================================== */}
      {/* SECTION 1: ARTICLES (ARTICLE STYLE A - OVERLAY BANNER) */}
      {/* ======================================================== */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-8 h-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full inline-block" />
            <h3 className="text-base font-bold text-slate-800">Articles</h3>
          </div>
          <p className="text-xs text-slate-500">
            This article component is based on card and flexbox.
          </p>
        </div>

        {filteredStyleA.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center text-xs text-slate-500">
            Tidak ada artikel yang cocok dengan filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredStyleA.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col group"
              >
                {/* Image Header with Overlay Title Banner (Matching ShizueFI) */}
                <div
                  className={`relative h-44 sm:h-48 bg-gradient-to-br ${article.accentGradient} flex flex-col items-center justify-center p-4 overflow-hidden`}
                >
                  {/* Decorative Tech Graphic */}
                  <div
                    className={`w-12 h-12 rounded-2xl ${article.iconBg} border flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mb-5`}
                  >
                    <BookOpen className="w-6 h-6" />
                  </div>

                  {/* Overlaid Title Banner at Bottom of Image (Signature ShizueFI Style) */}
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-slate-900/80 via-slate-900/50 to-transparent">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-blue-300 block mb-0.5">
                      {article.category} • {article.readTime}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-2 leading-snug drop-shadow-xs">
                      {article.title}
                    </h4>
                  </div>
                </div>

                {/* Card Body with centered button */}
                <div className="p-4 sm:p-5 pt-3.5 sm:pt-4 flex-1 flex flex-col justify-between space-y-3.5">
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-normal">
                    {article.desc}
                  </p>

                  <div className="pt-1 text-center">
                    <button
                      type="button"
                      onClick={() => setActiveArticleModal(article)}
                      className="px-5 py-2 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white text-xs font-semibold rounded-xl shadow-xs hover:shadow-md active:scale-95 transition-all cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <span>Read More</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* SECTION 2: ARTICLE STYLE B (EDITORIAL WITH TOP BADGES) */}
      {/* ======================================================== */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-8 h-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full inline-block" />
            <h3 className="text-base font-bold text-slate-800">Article Style B</h3>
          </div>
          <p className="text-xs text-slate-500">
            Minimalist editorial card with category badge, reading progress, and directional read-more link.
          </p>
        </div>

        {filteredStyleB.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center text-xs text-slate-500">
            Tidak ada artikel yang cocok dengan filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredStyleB.map((article) => {
              const isBookmarked = bookmarkedIds.includes(article.id);
              return (
                <div
                  key={article.id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col group"
                >
                  {/* Image Header with Top Badge */}
                  <div
                    className={`relative h-40 sm:h-44 bg-gradient-to-br ${article.accentGradient} flex items-center justify-center p-4 overflow-hidden`}
                  >
                    {/* Top-Left Badge (Matching ShizueFI 🔥 Trending) */}
                    {article.badge && (
                      <div className="absolute top-3 left-3 z-10">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-xs ${
                            article.badge === 'Trending' ? 'bg-rose-500 text-white' : 'bg-[#1351b8] text-white'
                          }`}
                        >
                          {article.badge === 'Trending' && <Flame className="w-3 h-3" />}
                          {article.badge}
                        </span>
                      </div>
                    )}

                    {/* Top-Right Bookmark Button */}
                    <button
                      type="button"
                      onClick={(e) => toggleBookmark(article.id, e)}
                      title="Simpan artikel"
                      className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-600 hover:text-[#1351b8] flex items-center justify-center shadow-xs transition-all cursor-pointer"
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-[#1351b8] text-[#1351b8]' : ''}`} />
                    </button>

                    {/* Decorative Graphic */}
                    <div
                      className={`w-12 h-12 rounded-2xl ${article.iconBg} border flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    >
                      <BookOpen className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Card Body with Title Below Image & Right Arrow Link */}
                  <div className="p-4 sm:p-5 pt-3.5 sm:pt-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wide block">
                        {article.category} • {article.readTime}
                      </span>
                      <h4 className="text-sm font-bold text-slate-800 line-clamp-2 group-hover:text-[#1351b8] transition-colors leading-snug">
                        {article.title}
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-normal pt-0.5">
                        {article.desc}
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-slate-50 flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => setActiveArticleModal(article)}
                        className="text-xs font-semibold text-[#1351b8] hover:text-[#0c2869] inline-flex items-center gap-1 group/btn cursor-pointer transition-colors"
                      >
                        <span>Read More</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* SECTION 3: ARTICLE STYLE C (AUTHOR BYLINE & PROFILE) */}
      {/* ======================================================== */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-8 h-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full inline-block" />
            <h3 className="text-base font-bold text-slate-800">Article Style C</h3>
          </div>
          <p className="text-xs text-slate-500">
            Feature article card with category meta, published time, and author profile details.
          </p>
        </div>

        {filteredStyleC.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center text-xs text-slate-500">
            Tidak ada artikel yang cocok dengan filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredStyleC.map((article) => {
              const isLiked = likedIds.includes(article.id);
              return (
                <div
                  key={article.id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col group"
                >
                  {/* Image Header */}
                  <div
                    className={`relative h-44 sm:h-48 bg-gradient-to-br ${article.accentGradient} flex items-center justify-center p-4 overflow-hidden`}
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl ${article.iconBg} border flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xs`}
                    >
                      <BookOpen className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Card Body with Author Footer */}
                  <div className="p-4 sm:p-5 pt-3.5 sm:pt-4 flex-1 flex flex-col justify-between space-y-3.5">
                    <div className="space-y-1">
                      <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-slate-400 uppercase block">
                        {article.date}
                      </span>
                      <h4
                        onClick={() => setActiveArticleModal(article)}
                        className="text-sm sm:text-base font-bold text-slate-800 line-clamp-2 hover:text-[#1351b8] cursor-pointer transition-colors leading-snug"
                      >
                        {article.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed font-normal pt-0.5">
                        {article.desc}
                      </p>
                    </div>

                    {/* Author Byline Footer (Matching ShizueFI Style C) */}
                    {article.author && (
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full ${article.author.bg} text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0`}
                          >
                            {article.author.initials}
                          </div>
                          <div>
                            <div className="flex items-center gap-1">
                              <h5 className="text-xs font-bold text-slate-800">{article.author.name}</h5>
                              <CheckCircle2 className="w-3 h-3 text-blue-500 fill-blue-500/20" />
                            </div>
                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block">
                              {article.author.role}
                            </span>
                          </div>
                        </div>

                        {/* Interactive Engagement Counters */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => toggleLike(article.id, e)}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-rose-500 transition-colors p-1"
                          >
                            <Heart
                              className={`w-3.5 h-3.5 ${
                                isLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
                              }`}
                            />
                            <span>{(article.likes || 0) + (isLiked ? 1 : 0)}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* SECTION 4: FEATURED EDITORIAL STORY (HERO SPLIT ARTICLE) */}
      {/* ======================================================== */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left Hero Graphic Banner */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#175cd3] to-[#0f3ba0] p-8 sm:p-10 flex flex-col justify-between text-white relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
            <div className="relative z-10 space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-semibold text-white shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Featured Editorial Story
              </span>
              <h3 className="text-xl sm:text-2xl font-bold leading-tight">
                Masa Depan Desain Sistem Modern: Mengintegrasikan React 19, Tailwind CSS v4, dan Aksesibilitas
              </h3>
            </div>

            <div className="relative z-10 pt-8 mt-6 border-t border-white/20 flex items-center justify-between text-xs text-blue-100">
              <span>Ditulis oleh Fahmi Ibrahim</span>
              <span>10 Menit Membaca</span>
            </div>
          </div>

          {/* Right Content & Actions */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>25 November 2026</span>
                <span>•</span>
                <span className="text-[#1351b8]">Teknologi & Desain</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                Desain sistem bukan lagi sekadar komponen UI statis, melainkan arsitektur menyeluruh yang memastikan konsistensi visual, efisiensi render DOM, serta kesiapan aksesibilitas WCAG 2.2. Pelajari bagaimana Velora UI menerapkan Master Gradients, komponen tanpa washed-out text, dan interaktivitas instan.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-medium">React 19</span>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-medium">Tailwind v4</span>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-medium">Design Tokens</span>
              </div>

              <button
                type="button"
                onClick={() =>
                  setActiveArticleModal({
                    id: 99,
                    title: 'Masa Depan Desain Sistem Modern: Mengintegrasikan React 19, Tailwind CSS v4, dan Aksesibilitas',
                    category: 'Design System',
                    readTime: '10 mnt baca',
                    desc: 'Desain sistem bukan lagi sekadar komponen UI statis, melainkan arsitektur menyeluruh yang memastikan konsistensi visual, efisiensi render DOM, serta kesiapan aksesibilitas WCAG 2.2.',
                    accentGradient: 'from-blue-600/30 to-indigo-800/40',
                    iconBg: 'bg-blue-500/10 border-blue-200 text-blue-600',
                    iconColor: '#175cd3',
                  })
                }
                className="px-5 py-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white text-xs font-semibold rounded-xl shadow-xs hover:shadow-md active:scale-95 transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>Baca Artikel Penuh</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* Lightbox / Reader Modal for Articles */}
      {/* ======================================================== */}
      {activeArticleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-1.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full inline-block" />
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  {activeArticleModal.category} • {activeArticleModal.readTime}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveArticleModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-4">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                {activeArticleModal.title}
              </h3>

              <div className="flex items-center gap-3 text-xs text-slate-500 pb-3 border-b border-slate-100">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {activeArticleModal.readTime}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  {activeArticleModal.author ? activeArticleModal.author.name : 'Velora Tech Team'}
                </span>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                <p className="text-slate-800 font-medium">{activeArticleModal.desc}</p>
                <p>
                  Dalam ekosistem aplikasi enterprise modern, implementasi komponen artikel yang modular memudahkan tim konten dan pengembang dalam mempublikasikan berita, release notes, serta panduan teknis tanpa perlu merombak ulang struktur tata letak.
                </p>
                <div className="border-l-4 border-[#175cd3] pl-4 py-2 bg-slate-50/80 rounded-r-xl italic text-slate-700">
                  "Konsistensi visual dan performa render adalah pondasi utama dalam menciptakan pengalaman membaca digital yang nyaman."
                </div>
                <p>
                  Velora UI menyediakan 3 gaya artikel standar (Style A, Style B, dan Style C) serta format editorial hero banner yang sepenuhnya responsif pada perangkat seluler, tablet, hingga layar ultra-lebar.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  showToast('Tautan artikel berhasil disalin!', 'success');
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#1351b8] cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Bagikan Tautan</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveArticleModal(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all shadow-xs cursor-pointer"
              >
                Tutup Pembaca
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Dedicated Avatar Showcase matching ShizueFI & Stisla with Master Gradients & Advanced Interactivity
function AvatarView() {
  const [sandboxSize, setSandboxSize] = useState<AvatarSize>('xl');
  const [sandboxShape, setSandboxShape] = useState<AvatarShape>('circle');
  const [sandboxStatus, setSandboxStatus] = useState<AvatarStatus | 'none'>('online');
  const [sandboxName, setSandboxName] = useState('Fahmi Ibrahim');
  const [sandboxBg, setSandboxBg] = useState('bg-gradient-to-r from-[#175cd3] to-[#0f3ba0]');
  const [sandboxSubIcon, setSandboxSubIcon] = useState<'none' | 'crown' | 'shield' | 'check'>('check');
  const [shapeToggle, setShapeToggle] = useState<AvatarShape>('circle');
  const [copiedCode, setCopiedCode] = useState(false);

  const bgOptions = [
    { label: 'Master Blue', bg: 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0]' },
    { label: 'Emerald', bg: 'bg-gradient-to-r from-emerald-600 to-teal-700' },
    { label: 'Amber', bg: 'bg-gradient-to-r from-amber-500 to-orange-600' },
    { label: 'Rose', bg: 'bg-gradient-to-r from-rose-500 to-red-700' },
    { label: 'Purple', bg: 'bg-gradient-to-r from-purple-600 to-indigo-700' },
    { label: 'Dark Slate', bg: 'bg-slate-900' },
  ];

  const subIconMap: Record<string, React.ReactNode> = {
    check: (
      <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center ring-2 ring-white shadow-xs">
        <Check className="w-2.5 h-2.5 stroke-[3]" />
      </span>
    ),
    crown: (
      <span className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center ring-2 ring-white shadow-xs">
        <Crown className="w-2.5 h-2.5" />
      </span>
    ),
    shield: (
      <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center ring-2 ring-white shadow-xs">
        <ShieldCheck className="w-2.5 h-2.5" />
      </span>
    ),
  };

  const generatedCode = `<Avatar
  name="${sandboxName}"
  size="${sandboxSize}"
  shape="${sandboxShape}"${sandboxStatus !== 'none' ? `\n  status="${sandboxStatus}"` : ''}${
    sandboxBg ? `\n  bg="${sandboxBg}"` : ''
  }
/>`;

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopiedCode(true);
    showToast('Kode snippet Avatar berhasil disalin!', 'success');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Breadcrumb Header with Master Blue Pill Accent */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-8 h-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full inline-block" />
          <h2 className="text-base sm:text-lg font-bold text-slate-800">Avatar</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500">
          Avatars are user profile pictures. Thanks to Spectre.css and modernized for Velora UI with rich states, shapes, and group stacks.
        </p>
      </div>

      {/* 2-Column Responsive Layout matching ShizueFI & Stisla */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* ======================================================== */}
        {/* COLUMN 1 (LEFT) */}
        {/* ======================================================== */}
        <div className="space-y-6">
          {/* 1. Card: Avatar Sizes */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs relative">
            <div className="px-6 py-4.5 border-b border-slate-100 rounded-t-2xl flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-[#1351b8]">Avatar</h4>
                <p className="text-xs text-slate-500 mt-0.5">Proporsi ukuran avatar dari XL (64px) hingga XS (24px).</p>
              </div>
              {/* Shape Switcher */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                {(['circle', 'rounded', 'square'] as AvatarShape[]).map((shp) => (
                  <button
                    key={shp}
                    type="button"
                    onClick={() => setShapeToggle(shp)}
                    className={`px-2.5 py-1 rounded-lg capitalize transition-all cursor-pointer ${
                      shapeToggle === shp ? 'bg-white text-[#1351b8] shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {shp}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap items-end gap-5">
                <Tooltip content="Avatar XL (64px)" position="top">
                  <div className="flex flex-col items-center gap-2">
                    <Avatar
                      size="xl"
                      shape={shapeToggle}
                      bg="bg-gradient-to-br from-blue-400 to-indigo-600"
                    />
                    <span className="text-[10px] font-mono font-semibold text-slate-400">XL (64px)</span>
                  </div>
                </Tooltip>

                <Tooltip content="Avatar LG (48px)" position="top">
                  <div className="flex flex-col items-center gap-2">
                    <Avatar
                      size="lg"
                      shape={shapeToggle}
                      bg="bg-gradient-to-br from-emerald-400 to-teal-600"
                    />
                    <span className="text-[10px] font-mono font-semibold text-slate-400">LG (48px)</span>
                  </div>
                </Tooltip>

                <Tooltip content="Avatar MD (40px)" position="top">
                  <div className="flex flex-col items-center gap-2">
                    <Avatar
                      size="md"
                      shape={shapeToggle}
                      bg="bg-gradient-to-br from-rose-400 to-red-600"
                    />
                    <span className="text-[10px] font-mono font-semibold text-slate-400">MD (40px)</span>
                  </div>
                </Tooltip>

                <Tooltip content="Avatar SM (32px)" position="top">
                  <div className="flex flex-col items-center gap-2">
                    <Avatar
                      size="sm"
                      shape={shapeToggle}
                      bg="bg-gradient-to-br from-sky-400 to-cyan-600"
                    />
                    <span className="text-[10px] font-mono font-semibold text-slate-400">SM (32px)</span>
                  </div>
                </Tooltip>

                <Tooltip content="Avatar XS (24px)" position="top">
                  <div className="flex flex-col items-center gap-2">
                    <Avatar
                      size="xs"
                      shape={shapeToggle}
                      bg="bg-gradient-to-br from-amber-400 to-orange-500"
                    />
                    <span className="text-[10px] font-mono font-semibold text-slate-400">XS (24px)</span>
                  </div>
                </Tooltip>
              </div>
            </div>
          </div>

          {/* 2. Card: Avatar Presence */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs relative">
            <div className="px-6 py-4.5 border-b border-slate-100 rounded-t-2xl">
              <h4 className="text-base font-bold text-[#1351b8]">Avatar Presence</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Indikator status kehadiran (Online, Busy/DND, Away, Offline) dengan border pemisah.
              </p>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap items-end gap-5">
                <Tooltip content="Status: Online (Aktif)" position="top" variant="success">
                  <div className="flex flex-col items-center gap-2">
                    <Avatar
                      size="xl"
                      status="online"
                      bg="bg-gradient-to-br from-blue-400 to-indigo-600"
                    />
                    <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Online
                    </span>
                  </div>
                </Tooltip>

                <Tooltip content="Status: Busy (Jangan Ganggu)" position="top" variant="danger">
                  <div className="flex flex-col items-center gap-2">
                    <Avatar
                      size="lg"
                      status="busy"
                      bg="bg-gradient-to-br from-emerald-400 to-teal-600"
                    />
                    <span className="text-[10px] font-semibold text-rose-600">Busy</span>
                  </div>
                </Tooltip>

                <Tooltip content="Status: Away (Sedang Keluar)" position="top" variant="warning">
                  <div className="flex flex-col items-center gap-2">
                    <Avatar
                      size="md"
                      status="away"
                      bg="bg-gradient-to-br from-sky-400 to-cyan-600"
                    />
                    <span className="text-[10px] font-semibold text-amber-600">Away</span>
                  </div>
                </Tooltip>

                <Tooltip content="Status: Away (Sedang Keluar)" position="top" variant="warning">
                  <div className="flex flex-col items-center gap-2">
                    <Avatar
                      size="sm"
                      status="away"
                      bg="bg-gradient-to-br from-amber-400 to-orange-500"
                    />
                    <span className="text-[10px] font-semibold text-amber-600">Away</span>
                  </div>
                </Tooltip>

                <Tooltip content="Status: Offline (Tidak Aktif)" position="top" variant="dark">
                  <div className="flex flex-col items-center gap-2">
                    <Avatar
                      size="xs"
                      status="offline"
                      bg="bg-gradient-to-br from-slate-400 to-slate-600"
                    />
                    <span className="text-[10px] font-semibold text-slate-500">Offline</span>
                  </div>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* COLUMN 2 (RIGHT) */}
        {/* ======================================================== */}
        <div className="space-y-6">
          {/* 3. Card: Avatar Icon (Sub-Icon / Badges) */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs relative">
            <div className="px-6 py-4.5 border-b border-slate-100 rounded-t-2xl">
              <h4 className="text-base font-bold text-[#1351b8]">Avatar Icon</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Avatar dengan sub-icon di pojok kanan bawah untuk menandai peran, verifikasi, atau sub-status.
              </p>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap items-end gap-5">
                <Tooltip content="Terverifikasi Super Admin" position="top" variant="primary">
                  <Avatar
                    size="xl"
                    bg="bg-gradient-to-br from-blue-400 to-indigo-600"
                    subIcon={
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center ring-2 ring-white shadow-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    }
                  />
                </Tooltip>

                <Tooltip content="Pemilik Proyek (Owner)" position="top" variant="warning">
                  <Avatar
                    size="lg"
                    bg="bg-gradient-to-br from-emerald-400 to-teal-600"
                    subIcon={
                      <span className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center ring-2 ring-white shadow-xs">
                        <Crown className="w-2.5 h-2.5" />
                      </span>
                    }
                  />
                </Tooltip>

                <Tooltip content="Keamanan Terverifikasi" position="top" variant="success">
                  <Avatar
                    size="md"
                    bg="bg-gradient-to-br from-sky-400 to-cyan-600"
                    subIcon={
                      <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 text-white flex items-center justify-center ring-2 ring-white shadow-xs">
                        <ShieldCheck className="w-2 h-2" />
                      </span>
                    }
                  />
                </Tooltip>

                <Tooltip content="Pengguna Mobile" position="top">
                  <Avatar
                    size="sm"
                    bg="bg-gradient-to-br from-amber-400 to-orange-500"
                    subIcon={
                      <span className="w-3 h-3 rounded-full bg-rose-500 text-white flex items-center justify-center ring-1.5 ring-white shadow-xs">
                        <Camera className="w-1.5 h-1.5" />
                      </span>
                    }
                  />
                </Tooltip>

                <Tooltip content="Anggota Tim" position="top">
                  <Avatar
                    size="xs"
                    bg="bg-gradient-to-br from-purple-400 to-indigo-600"
                    subIcon={
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500 text-white flex items-center justify-center ring-1 ring-white shadow-xs">
                        <Check className="w-1.5 h-1.5 stroke-[3]" />
                      </span>
                    }
                  />
                </Tooltip>
              </div>
            </div>
          </div>

          {/* 4. Card: Avatar Initial */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs relative">
            <div className="px-6 py-4.5 border-b border-slate-100 rounded-t-2xl">
              <h4 className="text-base font-bold text-[#1351b8]">Avatar Initial</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Inisial nama pengguna otomatis dengan palet gradien tajam jika foto belum tersedia.
              </p>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap items-end gap-5">
                <Tooltip content="Inisial: UM (Ukuran XL)" position="top">
                  <Avatar
                    size="xl"
                    initials="UM"
                    bg="bg-gradient-to-r from-[#175cd3] to-[#0f3ba0]"
                  />
                </Tooltip>

                <Tooltip content="Inisial: UM (Ukuran LG)" position="top">
                  <Avatar
                    size="lg"
                    initials="UM"
                    bg="bg-gradient-to-r from-rose-500 to-red-700"
                  />
                </Tooltip>

                <Tooltip content="Inisial: UM (Ukuran MD)" position="top">
                  <Avatar
                    size="md"
                    initials="UM"
                    bg="bg-gradient-to-r from-amber-500 to-orange-600"
                  />
                </Tooltip>

                <Tooltip content="Inisial: UM (Ukuran SM)" position="top">
                  <Avatar
                    size="sm"
                    initials="UM"
                    bg="bg-gradient-to-r from-emerald-500 to-teal-700"
                  />
                </Tooltip>

                <Tooltip content="Inisial: UM (Ukuran XS)" position="top">
                  <Avatar
                    size="xs"
                    initials="UM"
                    bg="bg-gradient-to-r from-sky-400 to-cyan-600"
                  />
                </Tooltip>
              </div>

              {/* Team Initials Example */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-700 block mb-3">
                  Inisial Nama Anggota Tim Inti:
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  <Tooltip content="Fahmi Ibrahim (Lead Designer)" position="top">
                    <Avatar name="Fahmi Ibrahim" size="md" bg="bg-gradient-to-r from-[#175cd3] to-[#0f3ba0]" />
                  </Tooltip>
                  <Tooltip content="Irwansyah Putra (Lead UI/UX)" position="top">
                    <Avatar name="Irwansyah Putra" size="md" bg="bg-gradient-to-r from-blue-600 to-indigo-700" />
                  </Tooltip>
                  <Tooltip content="Hasan Basri (Senior Frontend)" position="top">
                    <Avatar name="Hasan Basri" size="md" bg="bg-gradient-to-r from-emerald-600 to-teal-700" />
                  </Tooltip>
                  <Tooltip content="Siti Nurhaliza (QA Automation)" position="top">
                    <Avatar name="Siti Nurhaliza" size="md" bg="bg-gradient-to-r from-purple-600 to-indigo-700" />
                  </Tooltip>
                  <Tooltip content="Rizal Fakhri (UX Researcher)" position="top">
                    <Avatar name="Rizal Fakhri" size="md" bg="bg-gradient-to-r from-amber-500 to-orange-600" />
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 5: AVATAR GROUPS & OVERLAPPING STACK */}
      {/* ======================================================== */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs relative">
        <div className="px-6 py-4.5 border-b border-slate-100 rounded-t-2xl flex items-center justify-between">
          <div>
            <h4 className="text-base font-bold text-[#1351b8]">Avatar Groups & Overlapping Stacks</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Tumpukan avatar bertingkat (*stack*) dengan indikator counter sisa anggota untuk kolaborasi proyek.
            </p>
          </div>
          <Users className="w-4 h-4 text-[#1351b8]" />
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stack 1: Tim Pengembang Proyek */}
          <div className="p-4 bg-slate-50/70 border border-slate-100 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Tim Inti Proyek</span>
              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                6 Anggota
              </span>
            </div>
            <AvatarGroup max={4} size="md">
              <Avatar name="Fahmi Ibrahim" bg="bg-blue-600" />
              <Avatar name="Irwansyah Putra" bg="bg-indigo-600" />
              <Avatar name="Hasan Basri" bg="bg-emerald-600" />
              <Avatar name="Siti Nurhaliza" bg="bg-purple-600" />
              <Avatar name="Rizal Fakhri" bg="bg-amber-600" />
              <Avatar name="Dewi Anggraeni" bg="bg-rose-600" />
            </AvatarGroup>
            <p className="text-[11px] text-slate-500">Maksimal 4 avatar ditampilkan, selebihnya diakumulasi (+2).</p>
          </div>

          {/* Stack 2: Reviewer Pull Request (Large) */}
          <div className="p-4 bg-slate-50/70 border border-slate-100 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Reviewer Pull Request</span>
              <span className="text-[10px] font-semibold text-[#1351b8] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                Ukuran LG
              </span>
            </div>
            <AvatarGroup max={3} size="lg" spacing="-space-x-3">
              <Avatar name="Irwansyah Putra" bg="bg-gradient-to-r from-[#175cd3] to-[#0f3ba0]" />
              <Avatar name="Hasan Basri" bg="bg-gradient-to-r from-emerald-600 to-teal-700" />
              <Avatar name="Siti Nurhaliza" bg="bg-gradient-to-r from-purple-600 to-indigo-700" />
              <Avatar name="Fahmi Ibrahim" bg="bg-gradient-to-r from-amber-500 to-orange-600" />
            </AvatarGroup>
            <p className="text-[11px] text-slate-500">Tampilan stack berukuran 48px untuk area review penting.</p>
          </div>

          {/* Stack 3: Peserta Online (Small) */}
          <div className="p-4 bg-slate-50/70 border border-slate-100 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Peserta Rapat Online</span>
              <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                Live Session
              </span>
            </div>
            <AvatarGroup max={5} size="sm" spacing="-space-x-2">
              <Avatar name="Fahmi Ibrahim" bg="bg-blue-600" status="online" />
              <Avatar name="Hasan Basri" bg="bg-emerald-600" status="online" />
              <Avatar name="Irwansyah Putra" bg="bg-indigo-600" status="online" />
              <Avatar name="Siti Nurhaliza" bg="bg-purple-600" status="away" />
              <Avatar name="Rizal Fakhri" bg="bg-amber-600" status="online" />
              <Avatar name="Dewi Anggraeni" bg="bg-rose-600" status="offline" />
              <Avatar name="Budi Santoso" bg="bg-slate-700" status="online" />
            </AvatarGroup>
            <p className="text-[11px] text-slate-500">Stack kompak berukuran 32px dengan status indikator aktif.</p>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 6: INTERACTIVE AVATAR PLAYGROUND & CODE GENERATOR */}
      {/* ======================================================== */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs relative">
        <div className="px-6 py-4.5 border-b border-slate-100 rounded-t-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-base font-bold text-[#1351b8] flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#1351b8]" />
              Interactive Avatar Playground & Code Generator
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Sesuaikan ukuran, bentuk, status kehadiran, dan tema warna avatar secara langsung.
            </p>
          </div>
          <button
            type="button"
            onClick={copyCode}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all shadow-xs cursor-pointer active:scale-95 self-start sm:self-auto"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? 'Tersalin ke Clipboard!' : 'Salin Kode React'}</span>
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Controls Form (7 cols) */}
          <div className="lg:col-span-7 space-y-4.5">
            {/* Size Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Ukuran Avatar (Size):</label>
              <div className="flex flex-wrap gap-1.5">
                {(['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as AvatarSize[]).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSandboxSize(sz)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer uppercase ${
                      sandboxSize === sz
                        ? 'bg-blue-50 border-[#1351b8] text-[#1351b8] shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Shape Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Bentuk Avatar (Shape):</label>
              <div className="grid grid-cols-3 gap-2">
                {(['circle', 'rounded', 'square'] as AvatarShape[]).map((shp) => (
                  <button
                    key={shp}
                    type="button"
                    onClick={() => setSandboxShape(shp)}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer capitalize text-center ${
                      sandboxShape === shp
                        ? 'bg-blue-50 border-[#1351b8] text-[#1351b8] shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {shp}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Status Kehadiran (Presence):</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {(['none', 'online', 'busy', 'away', 'offline'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setSandboxStatus(st)}
                    className={`py-1.5 px-2.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer capitalize text-center ${
                      sandboxStatus === st
                        ? 'bg-blue-50 border-[#1351b8] text-[#1351b8] shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-Icon Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Sub-Badge Icon (Sudut Kanan Bawah):</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['none', 'check', 'crown', 'shield'] as const).map((icn) => (
                  <button
                    key={icn}
                    type="button"
                    onClick={() => setSandboxSubIcon(icn)}
                    className={`py-1.5 px-2.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer capitalize text-center ${
                      sandboxSubIcon === icn
                        ? 'bg-blue-50 border-[#1351b8] text-[#1351b8] shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {icn}
                  </button>
                ))}
              </div>
            </div>

            {/* Background Gradient Palette */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Warna Latar (Background Theme):</label>
              <div className="flex flex-wrap gap-2">
                {bgOptions.map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setSandboxBg(opt.bg)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      sandboxBg === opt.bg
                        ? 'border-[#1351b8] ring-2 ring-blue-500/20 text-[#1351b8] bg-blue-50'
                        : 'border-slate-200 text-slate-700 bg-white hover:bg-slate-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Pengguna (Untuk Inisial):</label>
              <input
                type="text"
                value={sandboxName}
                onChange={(e) => setSandboxName(e.target.value)}
                placeholder="Masukkan nama pengguna..."
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1351b8]"
              />
            </div>
          </div>

          {/* Real-time Rendered Result (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-gradient-to-br from-slate-50 to-slate-100/70 border border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[180px] text-center relative">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 absolute top-3 left-4">
                Live Rendered Avatar
              </span>
              <Avatar
                name={sandboxName}
                size={sandboxSize}
                shape={sandboxShape}
                status={sandboxStatus === 'none' ? undefined : sandboxStatus}
                subIcon={sandboxSubIcon !== 'none' ? subIconMap[sandboxSubIcon] : undefined}
                bg={sandboxBg}
              />
              <span className="text-xs font-bold text-slate-800 mt-3">{sandboxName || 'Nama Pengguna'}</span>
              <span className="text-[11px] text-slate-500">
                Inisial: <b className="text-[#1351b8]">{getInitials(sandboxName) || 'USER'}</b>
              </span>
            </div>

            {/* Code Output */}
            <div className="bg-slate-900 rounded-2xl p-4 text-xs font-mono text-slate-300 border border-slate-800 shadow-inner overflow-x-auto">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-400">
                <span>React JSX</span>
                <span className="text-slate-500">Avatar.tsx</span>
              </div>
              <pre className="text-emerald-400 leading-relaxed overflow-x-auto">{generatedCode}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dedicated Chat Box Showcase matching ShizueFI & Stisla with Master Gradients & Interactive Messaging
interface ChatMessage {
  id: string;
  sender: 'me' | 'other';
  senderName: string;
  avatarBg?: string;
  text: string;
  time: string;
  status?: 'sent' | 'delivered' | 'read';
  isAlert?: boolean;
}

interface ChatContact {
  id: number;
  name: string;
  role: string;
  status: 'online' | 'busy' | 'away' | 'offline';
  unread?: number;
  bg: string;
}

function ChatBoxView() {
  const [contactSearch, setContactSearch] = useState('');
  const [activeContactId, setActiveContactId] = useState<number>(4); // default Rizal Fakhri

  // Chat with Rizal state
  const [rizalMessages, setRizalMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'other',
      senderName: 'Rizal Fakhri',
      avatarBg: 'bg-gradient-to-r from-blue-600 to-indigo-700',
      text: 'You wanna know?',
      time: '10:44',
    },
    {
      id: 'm2',
      sender: 'me',
      senderName: 'Fahmi Ibrahim',
      text: 'Wat?!',
      time: '10:44',
      status: 'read',
    },
  ]);
  const [rizalInput, setRizalInput] = useState('');
  const [isRizalTyping, setIsRizalTyping] = useState(false);
  const rizalScrollRef = useRef<HTMLDivElement>(null);

  // Chat with Ryan state
  const [isRyanBlocked, setIsRyanBlocked] = useState(true);
  const [ryanMessages, setRyanMessages] = useState<ChatMessage[]>([
    {
      id: 'r1',
      sender: 'other',
      senderName: 'Ryan Pratama',
      avatarBg: 'bg-rose-600',
      text: 'Here you go create another table',
      time: '10:44',
    },
    {
      id: 'r2',
      sender: 'me',
      senderName: 'Fahmi Ibrahim',
      text: 'You wanted do!',
      time: '10:44',
      status: 'read',
    },
    {
      id: 'r3',
      sender: 'me',
      senderName: 'Fahmi Ibrahim',
      text: 'FXCK!',
      time: '10:44',
      status: 'read',
    },
    {
      id: 'r4',
      sender: 'other',
      senderName: 'System',
      text: 'You have blocked Ryan',
      time: '10:44',
      isAlert: true,
    },
  ]);
  const [ryanInput, setRyanInput] = useState('');
  const ryanScrollRef = useRef<HTMLDivElement>(null);

  const contacts: ChatContact[] = [
    {
      id: 1,
      name: 'Hasan Basri',
      role: 'Senior Frontend',
      status: 'online',
      unread: 2,
      bg: 'bg-emerald-600',
    },
    {
      id: 2,
      name: 'Bagus Dwi Cahya',
      role: 'Mobile Lead',
      status: 'offline',
      bg: 'bg-slate-500',
    },
    {
      id: 3,
      name: 'Wildan Ahdian',
      role: 'UI/UX Designer',
      status: 'online',
      bg: 'bg-sky-500',
    },
    {
      id: 4,
      name: 'Rizal Fakhri',
      role: 'Backend Architect',
      status: 'online',
      bg: 'bg-gradient-to-r from-blue-600 to-indigo-700',
    },
    {
      id: 5,
      name: 'Ryan Pratama',
      role: 'DevOps & Security',
      status: 'busy',
      bg: 'bg-rose-600',
    },
  ];

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
    c.role.toLowerCase().includes(contactSearch.toLowerCase())
  );

  // Auto-scroll Rizal thread
  useEffect(() => {
    if (rizalScrollRef.current) {
      rizalScrollRef.current.scrollTop = rizalScrollRef.current.scrollHeight;
    }
  }, [rizalMessages, isRizalTyping]);

  // Auto-scroll Ryan thread
  useEffect(() => {
    if (ryanScrollRef.current) {
      ryanScrollRef.current.scrollTop = ryanScrollRef.current.scrollHeight;
    }
  }, [ryanMessages]);

  const handleSendRizal = (e?: React.FormEvent, customMsg?: string) => {
    if (e) e.preventDefault();
    const textToSend = customMsg || rizalInput.trim();
    if (!textToSend) return;

    const newMsg: ChatMessage = {
      id: 'm_' + Date.now(),
      sender: 'me',
      senderName: 'Fahmi Ibrahim',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    };

    setRizalMessages((prev) => [...prev, newMsg]);
    setRizalInput('');

    // Simulate response
    setIsRizalTyping(true);
    setTimeout(() => {
      setIsRizalTyping(false);
      const responses = [
        'Haha mantap! Komponen chat box Velora UI v2 sudah aktif dan interaktif.',
        'Siap, modul chat ini sudah responsif dan siap diintegrasikan dengan WebSocket.',
        'Keren banget styling kartu dan bubble messagenya!',
        'Oke, nanti saya sinkronkan dengan database audit log.',
      ];
      const randomReply = responses[Math.floor(Math.random() * responses.length)];

      setRizalMessages((prev) => [
        ...prev.map((m) => (m.id === newMsg.id ? { ...m, status: 'read' as const } : m)),
        {
          id: 'm_res_' + Date.now(),
          sender: 'other',
          senderName: 'Rizal Fakhri',
          avatarBg: 'bg-gradient-to-r from-blue-600 to-indigo-700',
          text: randomReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1200);
  };

  const handleSendRyan = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRyanBlocked || !ryanInput.trim()) return;

    const newMsg: ChatMessage = {
      id: 'r_' + Date.now(),
      sender: 'me',
      senderName: 'Fahmi Ibrahim',
      text: ryanInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'read',
    };

    setRyanMessages((prev) => [...prev, newMsg]);
    setRyanInput('');
  };

  const toggleBlockRyan = () => {
    if (isRyanBlocked) {
      setIsRyanBlocked(false);
      setRyanMessages((prev) => [
        ...prev,
        {
          id: 'r_unblock_' + Date.now(),
          sender: 'other',
          senderName: 'System',
          text: 'Anda telah membuka blokir Ryan Pratama',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAlert: true,
        },
      ]);
      showToast('Blokir kontak Ryan berhasil dibuka!', 'success');
    } else {
      setIsRyanBlocked(true);
      setRyanMessages((prev) => [
        ...prev,
        {
          id: 'r_block_' + Date.now(),
          sender: 'other',
          senderName: 'System',
          text: 'You have blocked Ryan',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAlert: true,
        },
      ]);
      showToast('Kontak Ryan berhasil diblokir.', 'warning');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Breadcrumb Header with Master Blue Pill Accent */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-8 h-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full inline-block" />
          <h2 className="text-base sm:text-lg font-bold text-slate-800">Chat Boxes</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500">
          The chat component and is equipped with an interactive messaging engine, making it easy for you to integrate with backend WebSockets or APIs.
        </p>
      </div>

      {/* 3-Column Responsive Grid matching ShizueFI & Stisla */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* ======================================================== */}
        {/* COLUMN 1: WHO'S ONLINE? (md:col-span-12 lg:col-span-3) */}
        {/* ======================================================== */}
        <div className="md:col-span-12 lg:col-span-3">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-[#1351b8]">Who's Online?</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">4 kontak terhubung</p>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            {/* Contact Search Input */}
            <div className="p-3 border-b border-slate-100/80 bg-slate-50/50">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={contactSearch}
                  onChange={(e) => setContactSearch(e.target.value)}
                  placeholder="Cari kontak..."
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 text-xs rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1351b8]"
                />
              </div>
            </div>

            {/* Contacts List */}
            <div className="p-2 space-y-1 max-h-[380px] overflow-y-auto">
              {filteredContacts.map((contact) => (
                <button
                  key={contact.id}
                  type="button"
                  onClick={() => {
                    setActiveContactId(contact.id);
                    showToast(`Beralih ke obrolan ${contact.name}`, 'info');
                  }}
                  className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between gap-3 cursor-pointer ${
                    activeContactId === contact.id
                      ? 'bg-blue-50/80 border border-blue-200/60 shadow-xs'
                      : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar
                      name={contact.name}
                      size="sm"
                      status={contact.status}
                      bg={contact.bg}
                    />
                    <div className="min-w-0">
                      <h5 className="text-xs font-bold text-slate-800 truncate">{contact.name}</h5>
                      <span className="text-[11px] text-slate-500 capitalize flex items-center gap-1">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            contact.status === 'online'
                              ? 'bg-emerald-500'
                              : contact.status === 'busy'
                              ? 'bg-rose-500'
                              : contact.status === 'away'
                              ? 'bg-amber-500'
                              : 'bg-slate-400'
                          }`}
                        />
                        {contact.status}
                      </span>
                    </div>
                  </div>

                  {contact.unread && (
                    <span className="px-1.5 py-0.5 rounded-full bg-[#1351b8] text-white text-[10px] font-bold">
                      {contact.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="p-3 border-t border-slate-100 bg-slate-50/40 text-center">
              <button
                type="button"
                onClick={() => showToast('Membuka direktori pengguna...', 'info')}
                className="w-full py-1.5 text-xs font-semibold text-[#1351b8] hover:text-[#0c2869] transition-colors cursor-pointer"
              >
                + Mulai Obrolan Baru
              </button>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* COLUMN 2: CHAT WITH RIZAL (ACTIVE CHAT ENGINE) (md:col-span-12 lg:col-span-5) */}
        {/* ======================================================== */}
        <div className="md:col-span-12 lg:col-span-5">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden flex flex-col">
            {/* Header: Chat with Rizal */}
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar
                  name="Rizal Fakhri"
                  size="sm"
                  status="online"
                  bg="bg-gradient-to-r from-blue-600 to-indigo-700"
                />
                <div>
                  <h4 className="text-sm font-bold text-[#1351b8] flex items-center gap-1.5">
                    Chat with Rizal
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500/20" />
                  </h4>
                  <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online • Aktif sekarang
                  </span>
                </div>
              </div>

              {/* Action Icons */}
              <div className="flex items-center gap-1 text-slate-400">
                <Tooltip content="Panggilan Suara" position="top">
                  <button
                    type="button"
                    onClick={() => showToast('Memulai panggilan ke Rizal...', 'info')}
                    className="p-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                </Tooltip>

                <Tooltip content="Panggilan Video" position="top">
                  <button
                    type="button"
                    onClick={() => showToast('Memulai video call ke Rizal...', 'info')}
                    className="p-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
                  >
                    <Video className="w-4 h-4" />
                  </button>
                </Tooltip>

                <Tooltip content="Opsi Lainnya" position="top">
                  <button
                    type="button"
                    onClick={() => showToast('Menu obrolan dibuka', 'info')}
                    className="p-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </Tooltip>
              </div>
            </div>

            {/* Message Thread Body */}
            <div
              ref={rizalScrollRef}
              className="p-4 sm:p-5 h-[320px] overflow-y-auto space-y-3.5 bg-slate-50/40"
            >
              {rizalMessages.map((msg) => {
                const isMe = msg.sender === 'me';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isMe && (
                      <Avatar
                        name={msg.senderName}
                        size="xs"
                        bg={msg.avatarBg || 'bg-blue-600'}
                      />
                    )}

                    <div className={`max-w-[78%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <div
                        className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm shadow-xs ${
                          isMe
                            ? 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white rounded-br-xs'
                            : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs shadow-xs'
                        }`}
                      >
                        <p className="leading-relaxed font-normal">{msg.text}</p>
                      </div>

                      <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 px-1 font-mono">
                        <span>{msg.time}</span>
                        {isMe && msg.status && (
                          <CheckCheck
                            className={`w-3 h-3 ${
                              msg.status === 'read' ? 'text-blue-500' : 'text-slate-400'
                            }`}
                          />
                        )}
                      </div>
                    </div>

                    {isMe && (
                      <Avatar
                        name="Fahmi Ibrahim"
                        size="xs"
                        bg="bg-gradient-to-r from-[#175cd3] to-[#0f3ba0]"
                      />
                    )}
                  </div>
                );
              })}

              {/* Typing indicator bubble */}
              {isRizalTyping && (
                <div className="flex items-end gap-2.5 justify-start">
                  <Avatar name="Rizal Fakhri" size="xs" bg="bg-gradient-to-r from-blue-600 to-indigo-700" />
                  <div className="px-4 py-3 bg-white text-slate-700 border border-slate-200/80 rounded-2xl rounded-bl-xs shadow-xs inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"
                      style={{ animationDelay: '150ms' }}
                    />
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"
                      style={{ animationDelay: '300ms' }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Quick Reply Chips */}
            <div className="px-4 py-2 border-t border-slate-100 bg-white flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
                Balas Cepat:
              </span>
              {['👋 Halo!', '👍 Siap laksanakan', '⚡ Cek PR terbaru', '📁 Kirim berkas'].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleSendRizal(undefined, chip)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-[#1351b8] text-slate-600 text-[11px] font-medium rounded-full transition-all shrink-0 cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendRizal} className="p-3 border-t border-slate-100 bg-white flex items-center gap-2">
              <Tooltip content="Sisipkan Lampiran" position="top">
                <button
                  type="button"
                  onClick={() => showToast('Fitur unggah berkas chat siap dikonfigurasi.', 'info')}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
              </Tooltip>

              <input
                type="text"
                value={rizalInput}
                onChange={(e) => setRizalInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 text-xs sm:text-sm rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1351b8] transition-all"
              />

              <Tooltip content="Emoji" position="top">
                <button
                  type="button"
                  onClick={() => setRizalInput((prev) => prev + ' 😊')}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <Smile className="w-4 h-4" />
                </button>
              </Tooltip>

              <button
                type="submit"
                disabled={!rizalInput.trim()}
                className={`p-2.5 rounded-full transition-all flex items-center justify-center shadow-xs cursor-pointer ${
                  rizalInput.trim()
                    ? 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white hover:shadow-md active:scale-95'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* ======================================================== */}
        {/* COLUMN 3: CHAT WITH RYAN (BLOCKED / SECURITY ACTION) (md:col-span-12 lg:col-span-4) */}
        {/* ======================================================== */}
        <div className="md:col-span-12 lg:col-span-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden flex flex-col">
            {/* Header: Chat with Ryan */}
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar
                  name="Ryan Pratama"
                  size="sm"
                  status={isRyanBlocked ? 'busy' : 'online'}
                  bg="bg-rose-600"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    Chat with Ryan
                  </h4>
                  <span
                    className={`text-[11px] font-semibold flex items-center gap-1 ${
                      isRyanBlocked ? 'text-rose-500' : 'text-emerald-600'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isRyanBlocked ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                    />
                    {isRyanBlocked ? 'Kontak Diblokir' : 'Aktif'}
                  </span>
                </div>
              </div>

              {/* Unblock / Block Toggle */}
              <button
                type="button"
                onClick={toggleBlockRyan}
                className={`px-3 py-1 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                  isRyanBlocked
                    ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {isRyanBlocked ? 'Buka Blokir' : 'Blokir'}
              </button>
            </div>

            {/* Message Thread Body */}
            <div
              ref={ryanScrollRef}
              className="p-4 sm:p-5 h-[320px] overflow-y-auto space-y-3.5 bg-slate-50/40"
            >
              {ryanMessages.map((msg) => {
                if (msg.isAlert) {
                  return (
                    <div key={msg.id} className="text-center my-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-semibold shadow-xs">
                        <UserX className="w-3.5 h-3.5" />
                        {msg.text}
                      </span>
                    </div>
                  );
                }

                const isMe = msg.sender === 'me';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isMe && (
                      <Avatar
                        name={msg.senderName}
                        size="xs"
                        bg={msg.avatarBg || 'bg-rose-600'}
                      />
                    )}

                    <div className={`max-w-[78%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <div
                        className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm shadow-xs ${
                          isMe
                            ? 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white rounded-br-xs'
                            : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs shadow-xs'
                        }`}
                      >
                        <p className="leading-relaxed font-normal">{msg.text}</p>
                      </div>

                      <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 px-1 font-mono">
                        <span>{msg.time}</span>
                      </div>
                    </div>

                    {isMe && (
                      <Avatar
                        name="Fahmi Ibrahim"
                        size="xs"
                        bg="bg-gradient-to-r from-[#175cd3] to-[#0f3ba0]"
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer Input or Blocked Notice */}
            <div className="p-3 border-t border-slate-100 bg-white">
              {isRyanBlocked ? (
                <div className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-500 flex items-center justify-between gap-2">
                  <span>Kontak ini diblokir sehingga tidak dapat menerima pesan baru.</span>
                  <button
                    type="button"
                    onClick={toggleBlockRyan}
                    className="text-[#1351b8] font-bold hover:underline shrink-0 cursor-pointer"
                  >
                    Buka Blokir
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSendRyan} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={ryanInput}
                    onChange={(e) => setRyanInput(e.target.value)}
                    placeholder="Type a message to Ryan..."
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 text-xs sm:text-sm rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1351b8] transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!ryanInput.trim()}
                    className="p-2.5 rounded-full bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white hover:shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dedicated Gallery Showcase matching ShizueFI & Stisla with Full Lightbox Modal & Advanced Interactivity
interface GalleryImage {
  id: number;
  title: string;
  category: string;
  gradient: string;
  solidGradient: string;
  tileBg: string;
  tileBorder: string;
  tileText: string;
  iconBg: string;
  caption: string;
}

function GalleryView() {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxZoom, setLightboxZoom] = useState(1);
  const [portfolioCategory, setPortfolioCategory] = useState<string>('Semua');

  // Master gallery images dataset (10 items matching ShizueFI & Stisla gallery grid)
  const galleryImages: GalleryImage[] = [
    {
      id: 1,
      title: 'Image 1: Design Tokens & Colors',
      category: 'Design System',
      gradient: 'from-sky-400/20 via-blue-300/20 to-sky-500/25',
      solidGradient: 'from-sky-100 via-blue-50 to-sky-200',
      tileBg: 'bg-sky-100 hover:bg-sky-200/90',
      tileBorder: 'border-sky-300/80',
      tileText: 'text-sky-600',
      iconBg: 'bg-sky-500/10 text-sky-600 border-sky-200',
      caption: 'Palet warna dan token desain antarmuka enterprise.',
    },
    {
      id: 2,
      title: 'Image 2: Dashboard Analytics Flow',
      category: 'Dashboard UI',
      gradient: 'from-orange-400/20 via-amber-300/20 to-orange-500/25',
      solidGradient: 'from-orange-100 via-amber-50 to-orange-200',
      tileBg: 'bg-orange-100 hover:bg-orange-200/90',
      tileBorder: 'border-orange-300/80',
      tileText: 'text-orange-600',
      iconBg: 'bg-orange-500/10 text-orange-600 border-orange-200',
      caption: 'Alur visualisasi data grafik metrik waktu nyata.',
    },
    {
      id: 3,
      title: 'Image 3: Mobile Banking Application',
      category: 'Mobile App',
      gradient: 'from-cyan-400/20 via-teal-300/20 to-cyan-500/25',
      solidGradient: 'from-cyan-100 via-sky-50 to-cyan-200',
      tileBg: 'bg-cyan-100 hover:bg-cyan-200/90',
      tileBorder: 'border-cyan-300/80',
      tileText: 'text-cyan-600',
      iconBg: 'bg-cyan-500/10 text-cyan-600 border-cyan-200',
      caption: 'Pratinjau antarmuka transaksi perbankan digital di smartphone.',
    },
    {
      id: 4,
      title: 'Image 4: Payroll & Kasbon Approval',
      category: 'Dashboard UI',
      gradient: 'from-rose-400/20 via-pink-300/20 to-rose-500/25',
      solidGradient: 'from-rose-100 via-pink-50 to-rose-200',
      tileBg: 'bg-rose-100 hover:bg-rose-200/90',
      tileBorder: 'border-rose-300/80',
      tileText: 'text-rose-600',
      iconBg: 'bg-rose-500/10 text-rose-600 border-rose-200',
      caption: 'Modul persetujuan berjenjang kasbon dan penggajian karyawan.',
    },
    {
      id: 5,
      title: 'Image 5: Security Architecture & SSO',
      category: 'Brand Identity',
      gradient: 'from-purple-400/20 via-indigo-300/20 to-purple-500/25',
      solidGradient: 'from-purple-100 via-indigo-50 to-purple-200',
      tileBg: 'bg-purple-100 hover:bg-purple-200/90',
      tileBorder: 'border-purple-300/80',
      tileText: 'text-purple-600',
      iconBg: 'bg-purple-500/10 text-purple-600 border-purple-200',
      caption: 'Diagram keamanan terpusat OAuth 2.0 dan Single Sign-On.',
    },
    {
      id: 6,
      title: 'Image 6: Cloud Sharding & Database',
      category: 'Design System',
      gradient: 'from-amber-400/20 via-yellow-300/20 to-amber-500/25',
      solidGradient: 'from-amber-100 via-yellow-50 to-amber-200',
      tileBg: 'bg-amber-100 hover:bg-amber-200/90',
      tileBorder: 'border-amber-300/80',
      tileText: 'text-amber-600',
      iconBg: 'bg-amber-500/10 text-amber-600 border-amber-200',
      caption: 'Infrastruktur sharding database dengan replikasi multi-master.',
    },
    {
      id: 7,
      title: 'Image 7: CI/CD Pipeline Automation',
      category: 'Brand Identity',
      gradient: 'from-emerald-400/20 via-green-300/20 to-emerald-500/25',
      solidGradient: 'from-emerald-100 via-green-50 to-emerald-200',
      tileBg: 'bg-emerald-100 hover:bg-emerald-200/90',
      tileBorder: 'border-emerald-300/80',
      tileText: 'text-emerald-600',
      iconBg: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
      caption: 'Workflow otomatisasi deployment tanpa downtime.',
    },
    {
      id: 8,
      title: 'Image 8: Placeholder Lightbox Preview',
      category: 'Mobile App',
      gradient: 'from-blue-400/20 via-sky-300/20 to-blue-500/25',
      solidGradient: 'from-blue-100 via-sky-50 to-blue-200',
      tileBg: 'bg-blue-100 hover:bg-blue-200/90',
      tileBorder: 'border-blue-300/80',
      tileText: 'text-blue-600',
      iconBg: 'bg-blue-500/10 text-blue-600 border-blue-200',
      caption: 'Tampilan lightbox resolusi tinggi dengan navigasi keyboard.',
    },
    {
      id: 9,
      title: 'Image 9: Design System Components v2',
      category: 'Design System',
      gradient: 'from-orange-400/20 via-amber-300/20 to-orange-500/25',
      solidGradient: 'from-orange-100 via-amber-50 to-orange-200',
      tileBg: 'bg-orange-100 hover:bg-orange-200/90',
      tileBorder: 'border-orange-300/80',
      tileText: 'text-orange-600',
      iconBg: 'bg-orange-500/10 text-orange-600 border-orange-200',
      caption: 'Koleksi komponen UI modern berbasis React 19 dan Tailwind v4.',
    },
    {
      id: 10,
      title: 'Image 10: Performance Monitoring & SRE',
      category: 'Dashboard UI',
      gradient: 'from-rose-400/20 via-red-300/20 to-rose-500/25',
      solidGradient: 'from-rose-100 via-red-50 to-rose-200',
      tileBg: 'bg-rose-100 hover:bg-rose-200/90',
      tileBorder: 'border-rose-300/80',
      tileText: 'text-rose-600',
      iconBg: 'bg-rose-500/10 text-rose-600 border-rose-200',
      caption: 'Dashboard monitoring kesehatan server dan latensi microservices.',
    },
  ];

  const portfolioCategories = ['Semua', 'Dashboard UI', 'Mobile App', 'Brand Identity', 'Design System'];

  const filteredPortfolio = galleryImages.filter((img) =>
    portfolioCategory === 'Semua' ? true : img.category === portfolioCategory
  );

  const openLightbox = (index: number) => {
    setActiveImageIndex(index);
    setLightboxZoom(1);
    setIsLightboxOpen(true);
  };

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % galleryImages.length);
    setLightboxZoom(1);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
    setLightboxZoom(1);
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextImage();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevImage();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setIsLightboxOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen]);

  return (
    <div className="space-y-6">
      {/* Page Title & Breadcrumb Header with Master Blue Pill Accent */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-8 h-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full inline-block" />
          <h2 className="text-base sm:text-lg font-bold text-slate-800">Gallery</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500">
          Grouping multiple images on one component with interactive lightbox image preview and keyboard controls.
        </p>
      </div>

      {/* 3-Column Responsive Grid matching ShizueFI & Stisla */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* ======================================================== */}
        {/* COLUMN 1: SMALL GALLERY THUMBNAILS (md:col-span-12 lg:col-span-4) */}
        {/* ======================================================== */}
        <div className="md:col-span-12 lg:col-span-4 space-y-6">
          {/* Card 1: Gallery (Small Single Row) */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs relative">
            <div className="px-6 py-4.5 border-b border-slate-100 rounded-t-2xl">
              <h4 className="text-base font-bold text-[#1351b8]">Gallery</h4>
              <p className="text-xs text-slate-500 mt-0.5">Baris thumbnail ringkas ukuran kecil.</p>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                {galleryImages.slice(0, 8).map((img, idx) => (
                  <Tooltip key={img.id} content={`Image ${idx + 1}`} position="top">
                    <button
                      type="button"
                      onClick={() => openLightbox(idx)}
                      className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${img.tileBg} border ${img.tileBorder} ${img.tileText} flex items-center justify-center hover:scale-110 hover:shadow-md transition-all cursor-pointer shadow-2xs`}
                    >
                      <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </Tooltip>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Gallery with Overflow Count (+2) */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs relative">
            <div className="px-6 py-4.5 border-b border-slate-100 rounded-t-2xl">
              <h4 className="text-base font-bold text-[#1351b8]">Gallery</h4>
              <p className="text-xs text-slate-500 mt-0.5">Baris thumbnail dengan penanda sisa gambar (+3).</p>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                {galleryImages.slice(0, 7).map((img, idx) => (
                  <Tooltip key={img.id} content={`Image ${idx + 1}`} position="top">
                    <button
                      type="button"
                      onClick={() => openLightbox(idx)}
                      className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${img.tileBg} border ${img.tileBorder} ${img.tileText} flex items-center justify-center hover:scale-110 hover:shadow-md transition-all cursor-pointer shadow-2xs`}
                    >
                      <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </Tooltip>
                ))}

                {/* +3 Overflow Tile */}
                <Tooltip content="Lihat 3 gambar lainnya" position="top">
                  <button
                    type="button"
                    onClick={() => openLightbox(7)}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-800 text-white font-bold text-xs flex items-center justify-center hover:bg-slate-700 hover:scale-110 shadow-xs transition-all cursor-pointer"
                  >
                    +3
                  </button>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* COLUMN 2: MEDIUM GRID GALLERY (md:col-span-12 lg:col-span-4) */}
        {/* ======================================================== */}
        <div className="md:col-span-12 lg:col-span-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs relative">
            <div className="px-6 py-4.5 border-b border-slate-100 rounded-t-2xl">
              <h4 className="text-base font-bold text-[#1351b8]">Gallery .gallery-md</h4>
              <p className="text-xs text-slate-500 mt-0.5">Grid thumbnail ukuran medium dengan akumulasi tile.</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-5 gap-2.5 sm:gap-3">
                {galleryImages.map((img, idx) => (
                  <Tooltip key={img.id} content={img.title} position="top" block={true} className="w-full aspect-square">
                    <button
                      type="button"
                      onClick={() => openLightbox(idx)}
                      className={`w-full h-full rounded-xl sm:rounded-2xl ${img.tileBg} border ${img.tileBorder} ${img.tileText} flex items-center justify-center hover:scale-105 hover:shadow-md transition-all cursor-pointer shadow-2xs`}
                    >
                      <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                  </Tooltip>
                ))}

                {/* +2 Overflow Tile in Grid */}
                <Tooltip content="Lihat 2 gambar lainnya" position="top" block={true} className="w-full aspect-square">
                  <button
                    type="button"
                    onClick={() => openLightbox(8)}
                    className="w-full h-full rounded-xl sm:rounded-2xl bg-slate-800 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center hover:bg-slate-700 hover:scale-105 shadow-xs transition-all cursor-pointer"
                  >
                    +2
                  </button>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* COLUMN 3: FULL WIDTH LANDSCAPE BANNERS (md:col-span-12 lg:col-span-4) */}
        {/* ======================================================== */}
        <div className="md:col-span-12 lg:col-span-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs relative">
            <div className="px-6 py-4.5 border-b border-slate-100 rounded-t-2xl">
              <h4 className="text-base font-bold text-[#1351b8]">Gallery .gallery-fw</h4>
              <p className="text-xs text-slate-500 mt-0.5">Strip banner lanskap bertingkat.</p>
            </div>
            <div className="p-6 space-y-4">
              {/* Banner 1 */}
              <Tooltip content="Image 1: Design Tokens & Colors" position="top" block={true} className="w-full block">
                <button
                  type="button"
                  onClick={() => openLightbox(0)}
                  className="w-full h-22 sm:h-24 rounded-2xl bg-gradient-to-r from-amber-100 via-orange-100 to-amber-200/90 border border-amber-200/80 flex items-center justify-between px-5 sm:px-6 hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer relative overflow-hidden group shadow-2xs text-left"
                >
                  <div className="flex items-center gap-3 z-10">
                    <div className="w-9 h-9 rounded-xl bg-white/90 shadow-xs flex items-center justify-center text-amber-600 shrink-0">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h6 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-amber-800 transition-colors">
                        Image 1: Design Tokens
                      </h6>
                      <p className="text-[11px] text-slate-600 font-medium">Palet warna & token desain</p>
                    </div>
                  </div>
                  <div className="text-amber-600/30 group-hover:text-amber-600/60 transition-colors shrink-0">
                    <ImageIcon className="w-10 h-10 sm:w-12 sm:h-12 transform group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </button>
              </Tooltip>

              {/* Banner 2 */}
              <Tooltip content="Image 4: Payroll & Kasbon Approval" position="top" block={true} className="w-full block">
                <button
                  type="button"
                  onClick={() => openLightbox(3)}
                  className="w-full h-22 sm:h-24 rounded-2xl bg-gradient-to-r from-rose-100 via-pink-100 to-rose-200/90 border border-rose-200/80 flex items-center justify-between px-5 sm:px-6 hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer relative overflow-hidden group shadow-2xs text-left"
                >
                  <div className="flex items-center gap-3 z-10">
                    <div className="w-9 h-9 rounded-xl bg-white/90 shadow-xs flex items-center justify-center text-rose-600 shrink-0">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h6 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-rose-800 transition-colors">
                        Image 4: Payroll & Kasbon
                      </h6>
                      <p className="text-[11px] text-slate-600 font-medium">Modul persetujuan berjenjang</p>
                    </div>
                  </div>
                  <div className="text-rose-600/30 group-hover:text-rose-600/60 transition-colors shrink-0">
                    <ImageIcon className="w-10 h-10 sm:w-12 sm:h-12 transform group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </button>
              </Tooltip>

              {/* Banner 3 with +2 Overlay */}
              <Tooltip content="Lihat 2 banner lainnya" position="top" block={true} className="w-full block">
                <button
                  type="button"
                  onClick={() => openLightbox(4)}
                  className="w-full h-22 sm:h-24 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-between px-5 sm:px-6 hover:bg-slate-700 hover:scale-[1.01] transition-all cursor-pointer relative overflow-hidden group shadow-2xs text-left text-white"
                >
                  <div className="flex items-center gap-3 z-10">
                    <div className="w-9 h-9 rounded-xl bg-white/10 shadow-xs flex items-center justify-center text-white shrink-0">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h6 className="text-xs sm:text-sm font-bold text-white">
                        Security & Cloud Sharding
                      </h6>
                      <p className="text-[11px] text-slate-300 font-medium">Infrastruktur & modul lainnya</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 z-10 shrink-0">
                    <span className="font-extrabold text-xs sm:text-sm text-white px-3 py-1 rounded-lg bg-white/15 border border-white/20 shadow-xs">
                      +2
                    </span>
                  </div>
                </button>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 5: INTERACTIVE PORTFOLIO GALLERY WITH FILTER TABS */}
      {/* ======================================================== */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs relative">
        <div className="px-6 py-4.5 border-b border-slate-100 rounded-t-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-base font-bold text-[#1351b8] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Categorized Portfolio Showcase
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Filter kategori aset dan klik gambar apa pun untuk membuka pratinjau Lightbox interaktif.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {portfolioCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setPortfolioCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  portfolioCategory === cat
                    ? 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white shadow-xs'
                    : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPortfolio.map((img) => (
              <div
                key={img.id}
                onClick={() => openLightbox(img.id - 1)}
                className="group relative rounded-2xl border border-slate-100 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer bg-white flex flex-col"
              >
                {/* Image Banner */}
                <div
                  className={`relative aspect-[16/10] bg-gradient-to-br ${img.gradient} flex items-center justify-center p-6 overflow-hidden`}
                >
                  <div
                    className={`w-14 h-14 rounded-2xl ${img.iconBg} border flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xs`}
                  >
                    <ImageIcon className="w-7 h-7" />
                  </div>

                  {/* Hover Overlay with Zoom Icon */}
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center backdrop-blur-[2px]">
                    <span className="w-10 h-10 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                      <ZoomIn className="w-5 h-5" />
                    </span>
                  </div>

                  {/* Category Badge */}
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-[10px] font-bold text-slate-700 shadow-xs">
                    {img.category}
                  </span>
                </div>

                {/* Card Meta */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-[#1351b8] transition-colors leading-snug">
                      {img.title}
                    </h5>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-1 font-normal">
                      {img.caption}
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Klik untuk perbesar</span>
                    <span className="font-semibold text-[#1351b8] group-hover:underline">Buka Lightbox →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* FULL-FEATURED LIGHTBOX MODAL */}
      {/* ======================================================== */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 select-none animate-in fade-in duration-200">
          {/* Top Control Bar */}
          <div className="flex items-center justify-between text-white pb-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="w-6 h-1.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full inline-block" />
              <div>
                <h4 className="text-sm sm:text-base font-bold text-white drop-shadow-xs">
                  {galleryImages[activeImageIndex].title}
                </h4>
                <span className="text-xs text-slate-300">
                  {galleryImages[activeImageIndex].category}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <Tooltip content="Perkecil Zoom" position="bottom" variant="dark">
                <button
                  type="button"
                  onClick={() => setLightboxZoom((prev) => Math.max(0.75, prev - 0.25))}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
              </Tooltip>

              <span className="text-xs font-mono font-semibold px-2 py-1 rounded bg-white/10 text-slate-200">
                {Math.round(lightboxZoom * 100)}%
              </span>

              <Tooltip content="Perbesar Zoom" position="bottom" variant="dark">
                <button
                  type="button"
                  onClick={() => setLightboxZoom((prev) => Math.min(2.0, prev + 0.25))}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </Tooltip>

              <div className="w-[1px] h-5 bg-white/20 mx-1" />

              <Tooltip content="Tutup Lightbox (Esc)" position="bottom" variant="dark">
                <button
                  type="button"
                  onClick={() => setIsLightboxOpen(false)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </Tooltip>
            </div>
          </div>

          {/* Center Stage with Prev / Next Buttons */}
          <div className="flex-1 flex items-center justify-between gap-4 py-4 relative overflow-hidden">
            {/* Prev Button */}
            <button
              type="button"
              onClick={prevImage}
              title="Gambar Sebelumnya (ArrowLeft)"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-sm flex items-center justify-center transition-all cursor-pointer active:scale-95 shrink-0 z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Active Image Showcase Box */}
            <div className="flex-1 flex items-center justify-center max-h-[65vh] overflow-hidden">
              <div
                style={{ transform: `scale(${lightboxZoom})` }}
                className={`max-w-2xl w-full aspect-[16/10] bg-gradient-to-br ${galleryImages[activeImageIndex].solidGradient} rounded-3xl border-2 border-white/60 shadow-2xl flex flex-col items-center justify-center p-6 sm:p-10 transition-transform duration-200 relative overflow-hidden text-center`}
              >
                {/* Decorative background blurs */}
                <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/35 blur-2xl pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-white/35 blur-2xl pointer-events-none" />

                <div
                  className={`w-20 h-20 sm:w-22 sm:h-22 rounded-3xl bg-white shadow-xl border border-white flex items-center justify-center mb-4 sm:mb-5 ${galleryImages[activeImageIndex].tileText} relative z-10`}
                >
                  <ImageIcon className="w-10 h-10 sm:w-11 sm:h-11" />
                </div>

                <h3 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight leading-snug drop-shadow-xs max-w-lg relative z-10 px-2">
                  {galleryImages[activeImageIndex].title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-700 font-semibold max-w-md mt-2 leading-relaxed relative z-10 px-2">
                  {galleryImages[activeImageIndex].caption}
                </p>

                <div className="flex items-center gap-2 mt-4 sm:mt-5 relative z-10">
                  <span className="px-3.5 py-1 rounded-full bg-slate-900 text-white text-[11px] font-bold shadow-md">
                    {galleryImages[activeImageIndex].category}
                  </span>
                  <span className="px-3.5 py-1 rounded-full bg-white/95 text-slate-800 text-[11px] font-bold shadow-xs border border-slate-200">
                    PLACEHOLDER IMAGE • VELORA UI
                  </span>
                </div>
              </div>
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={nextImage}
              title="Gambar Selanjutnya (ArrowRight)"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-sm flex items-center justify-center transition-all cursor-pointer active:scale-95 shrink-0 z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Bar: Thumbnail Carousel & Counter */}
          <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
            <span className="text-xs text-slate-300 font-medium">
              Gunakan tombol panah keyboard (← / →) untuk navigasi cepat
            </span>

            {/* Clickable Thumbnail Carousel */}
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-md py-1">
              {galleryImages.map((img, idx) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => openLightbox(idx)}
                  className={`w-8 h-8 rounded-lg ${img.tileBg} border transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                    activeImageIndex === idx
                      ? 'border-[#1351b8] ring-2 ring-blue-400 scale-110 shadow-xs'
                      : 'border-white/30 opacity-70 hover:opacity-100'
                  }`}
                >
                  <ImageIcon className={`w-3.5 h-3.5 ${img.tileText}`} />
                </button>
              ))}
            </div>

            <div className="text-xs font-mono font-bold text-slate-300">
              {activeImageIndex + 1} / {galleryImages.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MULTIPLE UPLOAD SHOWCASE (Matching ShizueFI & Stisla with Rich Drag-Drop)
// ============================================================================

interface UploadFileItem {
  id: string;
  name: string;
  size: number;
  type: 'image' | 'pdf' | 'archive' | 'doc' | 'other';
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  uploadedAt: string;
  previewUrl?: string;
}

function MultipleUploadView() {
  const [files, setFiles] = useState<UploadFileItem[]>([
    {
      id: 'f-1',
      name: 'Laporan-Keuangan-Q3-2026.pdf',
      size: 2450000,
      type: 'pdf',
      progress: 100,
      status: 'completed',
      uploadedAt: '10:24 WIB',
    },
    {
      id: 'f-2',
      name: 'Dokumentasi-Rapat-Direksi-2026.jpg',
      size: 4820000,
      type: 'image',
      progress: 100,
      status: 'completed',
      uploadedAt: '10:28 WIB',
    },
    {
      id: 'f-3',
      name: 'Arsip-Kasbon-Karyawan-Nov2026.zip',
      size: 8150000,
      type: 'archive',
      progress: 100,
      status: 'completed',
      uploadedAt: '10:32 WIB',
    },
  ]);

  const [isDragging, setIsDragging] = useState(false);
  const [previewFile, setPreviewFile] = useState<UploadFileItem | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'image' | 'document'>('all');
  const [maxSizeMB, setMaxSizeMB] = useState<number>(25);
  const [autoUpload, setAutoUpload] = useState(true);

  // Compact avatar upload state demo
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const detectType = (name: string): 'image' | 'pdf' | 'archive' | 'doc' | 'other' => {
    const ext = name.split('.').pop()?.toLowerCase() || '';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return 'image';
    if (['pdf'].includes(ext)) return 'pdf';
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return 'archive';
    if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'csv', 'txt'].includes(ext)) return 'doc';
    return 'other';
  };

  const handleProcessFiles = (newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    if (fileArray.length === 0) return;

    const addedItems: UploadFileItem[] = [];
    const maxBytes = maxSizeMB * 1024 * 1024;

    fileArray.forEach((f, idx) => {
      if (f.size > maxBytes) {
        showToast(`Berkas "${f.name}" melebihi batas ${maxSizeMB}MB`, 'warning');
        return;
      }

      const fileType = detectType(f.name);
      if (filterType === 'image' && fileType !== 'image') {
        showToast(`Berkas "${f.name}" bukan format gambar yang diizinkan`, 'warning');
        return;
      }
      if (filterType === 'document' && !['pdf', 'doc'].includes(fileType)) {
        showToast(`Berkas "${f.name}" bukan format dokumen yang diizinkan`, 'warning');
        return;
      }

      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;
      const newItem: UploadFileItem = {
        id: `f-${Date.now()}-${idx}`,
        name: f.name,
        size: f.size,
        type: fileType,
        progress: autoUpload ? 20 : 0,
        status: autoUpload ? 'uploading' : 'completed',
        uploadedAt: timeStr,
        previewUrl: fileType === 'image' ? URL.createObjectURL(f) : undefined,
      };
      addedItems.push(newItem);
    });

    if (addedItems.length === 0) return;

    setFiles((prev) => [...addedItems, ...prev]);
    showSuccess(`${addedItems.length} berkas berhasil ditambahkan ke antrean.`);

    // If autoUpload, simulate realistic upload progress
    if (autoUpload) {
      addedItems.forEach((item) => {
        let currentProg = 20;
        const interval = setInterval(() => {
          currentProg += Math.floor(Math.random() * 25) + 20;
          if (currentProg >= 100) {
            currentProg = 100;
            clearInterval(interval);
            setFiles((prev) =>
              prev.map((f) => (f.id === item.id ? { ...f, progress: 100, status: 'completed' } : f))
            );
          } else {
            setFiles((prev) =>
              prev.map((f) => (f.id === item.id ? { ...f, progress: currentProg } : f))
            );
          }
        }, 160);
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessFiles(e.dataTransfer.files);
    }
  };

  const handleDeleteFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    showToast('Berkas dihapus dari antrean.', 'info');
  };

  const handleClearAll = () => {
    if (files.length === 0) return;
    setFiles([]);
    showToast('Semua berkas telah dibersihkan dari antrean.', 'info');
  };

  const handleUploadAll = () => {
    const pendingFiles = files.filter((f) => f.status === 'uploading' || f.progress < 100);
    if (pendingFiles.length === 0) {
      showToast('Semua berkas sudah selesai diunggah.', 'info');
      return;
    }
    setFiles((prev) => prev.map((f) => ({ ...f, progress: 100, status: 'completed' })));
    showSuccess('Seluruh berkas berhasil diselesaikan.');
  };

  const completedCount = files.filter((f) => f.status === 'completed').length;
  const totalBytes = files.reduce((acc, curr) => acc + curr.size, 0);

  const getBadgeTypeIcon = (type: UploadFileItem['type']) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-5 h-5 text-sky-600" />;
      case 'pdf':
        return <FileText className="w-5 h-5 text-rose-600" />;
      case 'archive':
        return <FileArchive className="w-5 h-5 text-amber-600" />;
      case 'doc':
        return <FileText className="w-5 h-5 text-blue-600" />;
      default:
        return <FileCheck className="w-5 h-5 text-slate-600" />;
    }
  };

  const getBadgeTypeBg = (type: UploadFileItem['type']) => {
    switch (type) {
      case 'image':
        return 'bg-sky-50 border-sky-200';
      case 'pdf':
        return 'bg-rose-50 border-rose-200';
      case 'archive':
        return 'bg-amber-50 border-amber-200';
      case 'doc':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Breadcrumb Header with Master Blue Pill Accent */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-8 h-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full inline-block" />
            <h2 className="text-base sm:text-lg font-bold text-slate-800">Multiple Upload</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            We use 'Dropzone.js' inspired modern uploader with drag & drop, file type verification, live queue, and simulated progress.
          </p>
        </div>

        {/* Quick link button to Statistic view */}
        <a
          href="#/statistic"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#1351b8] text-xs font-semibold border border-blue-200/80 transition-all self-start sm:self-auto cursor-pointer shadow-2xs"
        >
          <BarChart3 className="w-4 h-4" />
          <span>Lihat Halaman Statistic →</span>
        </a>
      </div>

      {/* Main Grid: Dropzone & Queue on Left (8 cols) + Settings & Compact Dropzone on Right (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: MAIN DROPZONE & LIVE QUEUE (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Dropzone Card matching ShizueFI Header */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs relative">
            <div className="px-6 py-4.5 border-b border-slate-100 rounded-t-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-base font-bold text-[#1351b8]">Multiple Upload</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tarik berkas ke dalam kotak putus-putus atau klik untuk menelusuri dari perangkat Anda.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-slate-500 px-2.5 py-1 rounded-lg bg-slate-100 self-start sm:self-auto">
                Maks {maxSizeMB} MB / berkas
              </span>
            </div>

            <div className="p-6">
              {/* Interactive Drag & Drop Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full min-h-[220px] sm:min-h-[260px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-200 select-none ${
                  isDragging
                    ? 'border-[#175cd3] bg-blue-50/70 scale-[1.01] shadow-md ring-4 ring-blue-500/10'
                    : 'border-slate-300 hover:border-[#175cd3] bg-slate-50/50 hover:bg-blue-50/30'
                }`}
              >
                {/* Hidden input element */}
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (e.target.files) handleProcessFiles(e.target.files);
                    e.target.value = '';
                  }}
                  className="hidden"
                />

                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-3 transition-transform duration-200 ${
                    isDragging
                      ? 'bg-blue-600 text-white scale-110 shadow-lg'
                      : 'bg-blue-50 text-[#175cd3] border border-blue-200/80 shadow-xs'
                  }`}
                >
                  <UploadCloud className="w-8 h-8" />
                </div>

                <h4 className="text-base sm:text-lg font-bold text-slate-800">
                  Drop files here to upload
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mt-1 font-normal leading-relaxed">
                  Tarik dan jatuhkan berkas ke sini, atau{' '}
                  <span className="text-[#1351b8] font-bold underline decoration-blue-400">
                    pilih dari komputer
                  </span>
                </p>

                <div className="flex flex-wrap items-center justify-center gap-1.5 mt-4 text-[10px] sm:text-xs font-semibold text-slate-500">
                  <span className="px-2.5 py-0.5 rounded-full bg-white border border-slate-200 shadow-2xs">
                    PNG, JPG, WEBP
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white border border-slate-200 shadow-2xs">
                    PDF, DOCX, XLSX
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white border border-slate-200 shadow-2xs">
                    ZIP, RAR, 7Z
                  </span>
                </div>
              </div>

              {/* Uploaded Queue Section */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <h5 className="text-sm font-bold text-slate-800">Daftar Antrean Berkas</h5>
                    <span className="px-2 py-0.5 rounded-full bg-[#175cd3] text-white text-[11px] font-bold">
                      {files.length}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      ({completedCount} dari {files.length} selesai • {formatFileSize(totalBytes)})
                    </span>
                  </div>

                  {files.length > 0 && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleUploadAll}
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white text-xs font-semibold hover:shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Unggah Semua</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleClearAll}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Bersihkan</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Queue File Items */}
                {files.length === 0 ? (
                  <div className="text-center py-8 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                    <Folder className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-60" />
                    <p className="text-xs font-semibold text-slate-600">Antrean berkas masih kosong</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Tarik berkas ke dropzone di atas untuk memulai</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {files.map((file) => (
                      <div
                        key={file.id}
                        className="p-3.5 sm:p-4 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* File Icon / Thumbnail */}
                          {file.previewUrl ? (
                            <img
                              src={file.previewUrl}
                              alt={file.name}
                              className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div
                              className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${getBadgeTypeBg(
                                file.type
                              )}`}
                            >
                              {getBadgeTypeIcon(file.type)}
                            </div>
                          )}

                          {/* File Meta */}
                          <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm font-bold text-slate-800 truncate" title={file.name}>
                              {file.name}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                              <span className="font-medium text-slate-600">{formatFileSize(file.size)}</span>
                              <span>•</span>
                              <span>{file.uploadedAt}</span>
                              {file.status === 'completed' && (
                                <>
                                  <span>•</span>
                                  <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                                    <CheckCircle2 className="w-3 h-3" /> Siap
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar & Actions */}
                        <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                          {/* Progress bar container */}
                          <div className="w-28 sm:w-36 flex flex-col gap-1">
                            <div className="flex items-center justify-between text-[10px] font-semibold">
                              <span
                                className={
                                  file.status === 'completed'
                                    ? 'text-emerald-700'
                                    : 'text-blue-700'
                                }
                              >
                                {file.status === 'completed' ? '100%' : `${file.progress}%`}
                              </span>
                              <span className="text-slate-400 uppercase text-[9px] font-bold">
                                {file.status}
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                style={{ width: `${file.progress}%` }}
                                className={`h-full rounded-full transition-all duration-300 ${
                                  file.status === 'completed'
                                    ? 'bg-emerald-500'
                                    : 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0]'
                                }`}
                              />
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-1 pl-2 border-l border-slate-100">
                            <Tooltip content="Pratinjau Berkas" position="top">
                              <button
                                type="button"
                                onClick={() => setPreviewFile(file)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-[#1351b8] hover:bg-blue-50 transition-colors cursor-pointer"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </Tooltip>
                            <Tooltip content="Hapus Berkas" position="top">
                              <button
                                type="button"
                                onClick={() => handleDeleteFile(file.id)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CONFIGURATION & COMPACT AVATAR UPLOADER (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card: Upload Settings */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs relative">
            <div className="px-6 py-4.5 border-b border-slate-100 rounded-t-2xl">
              <h4 className="text-base font-bold text-[#1351b8] flex items-center gap-2">
                <Settings className="w-4 h-4 text-slate-600" />
                Pengaturan Upload
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">Konfigurasi validasi dan batas sistem berkas.</p>
            </div>

            <div className="p-6 space-y-4">
              {/* Auto Upload Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-slate-800 block">Auto-Upload Simultan</label>
                  <span className="text-[11px] text-slate-500">Mulai unggah seketika saat berkas di-drop</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoUpload(!autoUpload)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    autoUpload ? 'bg-[#175cd3]' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform shadow-xs absolute top-1 ${
                      autoUpload ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-800 block mb-2">Batas Ukuran Maksimal</label>
                <div className="grid grid-cols-4 gap-2">
                  {[5, 10, 25, 50].map((mb) => (
                    <button
                      key={mb}
                      type="button"
                      onClick={() => setMaxSizeMB(mb)}
                      className={`py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        maxSizeMB === mb
                          ? 'bg-[#175cd3] text-white shadow-xs'
                          : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {mb}MB
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-800 block mb-2">Filter Jenis Berkas</label>
                <div className="flex flex-col gap-1.5">
                  {[
                    { id: 'all', label: 'Semua Tipe Berkas', desc: 'Gambar, Dokumen, dan Arsip Zip' },
                    { id: 'image', label: 'Hanya Gambar (Image Only)', desc: 'JPG, PNG, WEBP, GIF, SVG' },
                    { id: 'document', label: 'Hanya Dokumen', desc: 'PDF, DOCX, XLSX, PPTX' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFilterType(f.id as any)}
                      className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                        filterType === f.id
                          ? 'border-[#175cd3] bg-blue-50/50 text-[#1351b8]'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">{f.label}</span>
                        {filterType === f.id && <Check className="w-3.5 h-3.5 text-[#175cd3]" />}
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-0.5">{f.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card: Compact Single Profile / Avatar Uploader Demo */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs relative">
            <div className="px-6 py-4.5 border-b border-slate-100 rounded-t-2xl">
              <h4 className="text-base font-bold text-[#1351b8]">Single Image Dropzone</h4>
              <p className="text-xs text-slate-500 mt-0.5">Contoh uploader foto profil avatar ringkas.</p>
            </div>

            <div className="p-6 text-center">
              <input
                type="file"
                accept="image/*"
                ref={avatarInputRef}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setAvatarPreview(URL.createObjectURL(e.target.files[0]));
                    showSuccess('Foto profil berhasil dipilih.');
                  }
                }}
                className="hidden"
              />

              <div
                onClick={() => avatarInputRef.current?.click()}
                className="w-28 h-28 mx-auto rounded-3xl border-2 border-dashed border-slate-300 hover:border-[#175cd3] bg-slate-50/60 hover:bg-blue-50/40 flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden group shadow-2xs"
              >
                {avatarPreview ? (
                  <>
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-bold">
                      Ganti Foto
                    </div>
                  </>
                ) : (
                  <>
                    <Camera className="w-7 h-7 text-slate-400 group-hover:text-[#175cd3] transition-colors mb-1" />
                    <span className="text-[10px] font-bold text-slate-600 group-hover:text-[#1351b8]">
                      Pilih Foto
                    </span>
                  </>
                )}
              </div>

              <p className="text-xs text-slate-500 mt-3 font-normal">
                Format disarankan persegi 1:1, rasio minimal 400x400 px.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* File Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#175cd3]" />
                <h4 className="text-sm sm:text-base font-bold text-slate-800">Detail Pratinjau Berkas</h4>
              </div>
              <button
                type="button"
                onClick={() => setPreviewFile(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-6 text-center">
              {previewFile.previewUrl ? (
                <div className="max-h-64 rounded-2xl overflow-hidden border border-slate-200 mb-4 flex items-center justify-center bg-slate-50">
                  <img src={previewFile.previewUrl} alt={previewFile.name} className="max-h-64 object-contain" />
                </div>
              ) : (
                <div
                  className={`w-20 h-20 mx-auto rounded-3xl border flex items-center justify-center mb-4 ${getBadgeTypeBg(
                    previewFile.type
                  )}`}
                >
                  {getBadgeTypeIcon(previewFile.type)}
                </div>
              )}

              <h5 className="text-base font-bold text-slate-800 break-all px-4">{previewFile.name}</h5>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Ukuran: {formatFileSize(previewFile.size)} • Diunggah pada {previewFile.uploadedAt}
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 mt-3">
                <CheckCircle2 className="w-3.5 h-3.5" /> Berkas Siap Diproses Sistem
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setPreviewFile(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => {
                  showSuccess(`Mengunduh berkas ${previewFile.name}`);
                  setPreviewFile(null);
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white text-xs font-semibold hover:shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Berkas</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// STATISTIC SHOWCASE (Comprehensive Multi-Chart Dashboard matching Stisla)
// ============================================================================

function StatisticView() {
  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month' | 'year'>('month');
  const [activeLineIndex, setActiveLineIndex] = useState<number | null>(null);
  const [activeBarIndex, setActiveBarIndex] = useState<number | null>(null);
  const [activeDoughnutIndex, setActiveDoughnutIndex] = useState<number | null>(null);
  const [activeRadarIndex, setActiveRadarIndex] = useState<number | null>(null);
  const [activePolarIndex, setActivePolarIndex] = useState<number | null>(null);

  // Timeframe-sensitive datasets
  const timeLabels = {
    today: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    week: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
    year: ['2021', '2022', '2023', '2024', '2025', '2026'],
  }[timeframe];

  const lineSeries1 = {
    today: [12, 18, 45, 82, 64, 91],
    week: [42, 58, 71, 85, 92, 60, 48],
    month: [35, 48, 55, 68, 74, 62, 85, 94, 88, 105, 118, 142],
    year: [320, 540, 780, 1120, 1540, 2180],
  }[timeframe];

  const lineSeries2 = {
    today: [8, 12, 30, 54, 48, 62],
    week: [28, 38, 52, 64, 70, 45, 32],
    month: [24, 32, 40, 50, 58, 48, 65, 76, 70, 84, 92, 110],
    year: [210, 390, 580, 840, 1190, 1680],
  }[timeframe];

  const barData1 = {
    today: [45, 60, 80, 95, 70, 50],
    week: [68, 84, 76, 92, 88, 58, 42],
    month: [54, 68, 72, 85, 90, 82, 94, 105, 98, 112, 124, 138],
    year: [450, 680, 920, 1250, 1680, 2240],
  }[timeframe];

  const barData2 = {
    today: [30, 42, 55, 65, 48, 35],
    week: [45, 58, 52, 68, 60, 38, 28],
    month: [38, 48, 52, 62, 68, 58, 72, 80, 74, 88, 95, 108],
    year: [310, 490, 680, 920, 1240, 1650],
  }[timeframe];

  const doughnutData = [
    { label: 'Enterprise UI', value: 38, color: '#175cd3', count: '540 Aset' },
    { label: 'Mobile Apps', value: 27, color: '#10b981', count: '384 Aset' },
    { label: 'Cloud Services', value: 20, color: '#f59e0b', count: '284 Aset' },
    { label: 'Security & SSO', value: 15, color: '#8b5cf6', count: '213 Aset' },
  ];

  const radarData = [
    { axis: 'Kecepatan', value: 92, label: '92% Speed' },
    { axis: 'Keamanan', value: 96, label: '96% Security' },
    { axis: 'Skalabilitas', value: 85, label: '85% Scale' },
    { axis: 'Keandalan', value: 90, label: '90% Uptime' },
    { axis: 'Kemudahan UX', value: 88, label: '88% Usability' },
    { axis: 'Efisiensi Biaya', value: 82, label: '82% Cost' },
  ];

  const polarData = [
    { region: 'DKI Jakarta', value: 95, color: '#0284c7', pct: '34%' },
    { region: 'Surabaya', value: 80, color: '#10b981', pct: '26%' },
    { region: 'Bandung', value: 65, color: '#f59e0b', pct: '18%' },
    { region: 'Medan', value: 50, color: '#f43f5e', pct: '13%' },
    { region: 'Makassar', value: 38, color: '#8b5cf6', pct: '9%' },
  ];

  const departmentRanks = [
    { name: 'Engineering & IT', value: 94, target: '94/100', color: 'bg-[#175cd3]' },
    { name: 'Finance & Kasbon Approval', value: 88, target: '88/100', color: 'bg-emerald-500' },
    { name: 'Human Resources & Talent', value: 81, target: '81/100', color: 'bg-indigo-500' },
    { name: 'Marketing & Strategic Growth', value: 75, target: '75/100', color: 'bg-amber-500' },
    { name: 'Operations & Logistics', value: 68, target: '68/100', color: 'bg-purple-500' },
  ];

  // SVG Math for 1-row 2-card charts (viewBox 0 0 600 250)
  const chartW = 600;
  const chartH = 250;
  const padLeft = 40;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 38;
  const usableW = chartW - padLeft - padRight; // 540
  const usableH = chartH - padTop - padBottom; // 192

  const maxLineVal = Math.max(...lineSeries1, ...lineSeries2) * 1.15;
  const maxBarVal = Math.max(...barData1, ...barData2) * 1.12;

  const getLinePoints = (series: number[]) => {
    return series.map((val, idx) => {
      const x = padLeft + (idx / (series.length - 1)) * usableW;
      const y = chartH - padBottom - (val / maxLineVal) * usableH;
      return { x, y, val };
    });
  };

  const points1 = getLinePoints(lineSeries1);
  const points2 = getLinePoints(lineSeries2);

  const makeSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    let d = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const curr = pts[i];
      const next = pts[i + 1];
      const mx = (curr.x + next.x) / 2;
      d += ` C ${mx},${curr.y} ${mx},${next.y} ${next.x},${next.y}`;
    }
    return d;
  };

  const path1 = makeSmoothPath(points1);
  const path2 = makeSmoothPath(points2);
  const areaPath1 = `${path1} L ${points1[points1.length - 1].x},${chartH - padBottom} L ${points1[0].x},${chartH - padBottom} Z`;

  // Radar chart math (center: 150, 135, maxRadius: 85)
  const radarCx = 150;
  const radarCy = 135;
  const radarR = 85;
  const radarPoints = radarData.map((d, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    const r = (d.value / 100) * radarR;
    return {
      x: radarCx + r * Math.cos(angle),
      y: radarCy + r * Math.sin(angle),
      axisX: radarCx + (radarR + 24) * Math.cos(angle),
      axisY: radarCy + (radarR + 18) * Math.sin(angle),
      ...d,
    };
  });
  const radarPolyPoints = radarPoints.map((p) => `${p.x},${p.y}`).join(' ');

  // Polar area math (center: 150, 135)
  const polarCx = 150;
  const polarCy = 135;
  const polarMaxR = 85;

  return (
    <div className="space-y-6">
      {/* Page Title & Breadcrumb Header with Master Blue Pill Accent */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-8 h-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full inline-block" />
            <h2 className="text-base sm:text-lg font-bold text-slate-800">Statistic</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Halaman grafik analitik lengkap: Line Chart, Bar Chart, Doughnut, Radar, Polar Area, dan Sparklines dengan tampilan fit full-width.
          </p>
        </div>

        {/* Timeframe Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200/80 self-start sm:self-auto shadow-2xs">
          {[
            { id: 'today', label: 'Hari Ini' },
            { id: 'week', label: 'Minggu Ini' },
            { id: 'month', label: 'Bulan Ini' },
            { id: 'year', label: 'Tahun Ini' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTimeframe(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                timeframe === tab.id
                  ? 'bg-white text-[#1351b8] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 1: METRIC CARDS ENHANCED WITH SPARKLINE CHARTS   */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric Card 1: Total Admin */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs hover:shadow-md transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Total Admin
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-slate-900 tracking-tight">1,428</span>
                <span className="text-[11px] font-bold text-emerald-600 inline-flex items-center gap-0.5">
                  <ArrowUp className="w-3 h-3" /> +12%
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#175cd3] to-[#0f3ba0] text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform shrink-0">
              <Users className="w-6 h-6" />
            </div>
          </div>
          {/* Mini Sparkline 1 */}
          <div className="mt-4 pt-2 border-t border-slate-100">
            <svg className="w-full h-9 overflow-visible" viewBox="0 0 120 30">
              <path
                d="M 0,22 Q 20,8 40,16 T 80,10 T 120,4"
                fill="none"
                stroke="#175cd3"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium mt-1">
              <span>7 hari terakhir</span>
              <span className="text-blue-600 font-bold">Tren Naik</span>
            </div>
          </div>
        </div>

        {/* Metric Card 2: News & Articles */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs hover:shadow-md transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                News & Publikasi
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-slate-900 tracking-tight">342</span>
                <span className="text-[11px] font-bold text-emerald-600 inline-flex items-center gap-0.5">
                  <ArrowUp className="w-3 h-3" /> +8%
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white flex items-center justify-center shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform shrink-0">
              <FileText className="w-6 h-6" />
            </div>
          </div>
          {/* Mini Sparkline 2 */}
          <div className="mt-4 pt-2 border-t border-slate-100">
            <svg className="w-full h-9 overflow-visible" viewBox="0 0 120 30">
              <path
                d="M 0,24 Q 25,20 50,12 T 90,14 T 120,6"
                fill="none"
                stroke="#f43f5e"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium mt-1">
              <span>Rasio pembaca</span>
              <span className="text-rose-600 font-bold">+18.4%</span>
            </div>
          </div>
        </div>

        {/* Metric Card 3: Orders & Kasbon */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs hover:shadow-md transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Transaksi Kasbon
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-slate-900 tracking-tight">1,201</span>
                <span className="text-[11px] font-bold text-blue-600 inline-flex items-center gap-0.5">
                  <ArrowUp className="w-3 h-3" /> +4.2%
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
          </div>
          {/* Mini Sparkline 3 */}
          <div className="mt-4 pt-2 border-t border-slate-100">
            <svg className="w-full h-9 overflow-visible" viewBox="0 0 120 30">
              <path
                d="M 0,18 Q 30,26 60,10 T 95,8 T 120,4"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium mt-1">
              <span>Persetujuan SLA</span>
              <span className="text-amber-600 font-bold">96%</span>
            </div>
          </div>
        </div>

        {/* Metric Card 4: Online Users */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs hover:shadow-md transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Online Users
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-slate-900 tracking-tight">154</span>
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform shrink-0">
              <Activity className="w-6 h-6" />
            </div>
          </div>
          {/* Mini Sparkline 4 */}
          <div className="mt-4 pt-2 border-t border-slate-100">
            <svg className="w-full h-9 overflow-visible" viewBox="0 0 120 30">
              <path
                d="M 0,20 Q 20,24 45,14 T 80,18 T 120,5"
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium mt-1">
              <span>Kapasitas server</span>
              <span className="text-emerald-600 font-bold">Optimal</span>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 2: 1 ROW 2 CARDS (LINE CHART & BAR CHART FIT)    */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CARD 1: LINE & AREA CHART */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs relative flex flex-col justify-between">
          <div className="px-6 py-4.5 border-b border-slate-100 rounded-t-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-base font-bold text-[#1351b8] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#175cd3]" />
                Line Chart: Tren Transaksi & Kunjungan
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Perbandingan data realisasi transaksi terhadap estimasi kunjungan.
              </p>
            </div>
            {/* Series Legend */}
            <div className="flex items-center gap-3 text-xs font-semibold shrink-0">
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-3 h-3 rounded-full bg-[#175cd3]" />
                Transaksi
              </span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-3 h-3 rounded-full bg-[#10b981]" />
                Kunjungan
              </span>
            </div>
          </div>

          <div className="p-5 sm:p-6 flex-1 flex flex-col justify-center">
            <div className="w-full">
              <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-64 sm:h-72 select-none overflow-visible">
                <defs>
                  <linearGradient id="areaGradientPrimary" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#175cd3" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#175cd3" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines spanning 100% */}
                {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
                  const y = chartH - padBottom - pct * usableH;
                  return (
                    <g key={i}>
                      <line
                        x1={padLeft}
                        y1={y}
                        x2={chartW - padRight}
                        y2={y}
                        stroke="#f1f5f9"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                      />
                      <text
                        x={padLeft - 10}
                        y={y + 4}
                        textAnchor="end"
                        className="text-[11px] font-semibold fill-slate-400"
                      >
                        {Math.round(pct * maxLineVal)}
                      </text>
                    </g>
                  );
                })}

                {/* Area fill */}
                <path d={areaPath1} fill="url(#areaGradientPrimary)" />

                {/* Series 2 Line (Green) */}
                <path
                  d={path2}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Series 1 Line (Blue) */}
                <path
                  d={path1}
                  fill="none"
                  stroke="#175cd3"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Interactive Points Series 1 */}
                {points1.map((p, idx) => (
                  <g
                    key={idx}
                    className="cursor-pointer"
                    onMouseEnter={() => setActiveLineIndex(idx)}
                    onMouseLeave={() => setActiveLineIndex(null)}
                  >
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={activeLineIndex === idx ? 7 : 4.5}
                      fill="#ffffff"
                      stroke="#175cd3"
                      strokeWidth="3.5"
                      className="transition-all duration-150"
                    />
                    {/* Tooltip on hover */}
                    {activeLineIndex === idx && (
                      <g>
                        <rect
                          x={Math.max(10, Math.min(chartW - 100, p.x - 45))}
                          y={p.y - 42}
                          width="90"
                          height="32"
                          rx="8"
                          fill="#0f172a"
                          className="shadow-xl"
                        />
                        <text
                          x={Math.max(55, Math.min(chartW - 55, p.x))}
                          y={p.y - 28}
                          textAnchor="middle"
                          className="text-[10px] font-medium fill-slate-300"
                        >
                          {timeLabels[idx] || `T-${idx}`}
                        </text>
                        <text
                          x={Math.max(55, Math.min(chartW - 55, p.x))}
                          y={p.y - 15}
                          textAnchor="middle"
                          className="text-[11px] font-bold fill-white"
                        >
                          {p.val} Transaksi
                        </text>
                      </g>
                    )}
                  </g>
                ))}

                {/* X-axis Labels */}
                {points1.map((p, idx) => (
                  <text
                    key={idx}
                    x={p.x}
                    y={chartH - 12}
                    textAnchor="middle"
                    className="text-[11px] font-semibold fill-slate-500"
                  >
                    {timeLabels[idx] || `T-${idx}`}
                  </text>
                ))}
              </svg>
            </div>
          </div>
        </div>

        {/* CARD 2: BAR CHART */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs relative flex flex-col justify-between">
          <div className="px-6 py-4.5 border-b border-slate-100 rounded-t-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-base font-bold text-[#1351b8] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#175cd3]" />
                Bar Chart: Performa Periode
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Komparasi target vs realisasi mingguan / bulanan.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                Rata-rata 89%
              </span>
            </div>
          </div>

          <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
            <div className="w-full">
              <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-64 sm:h-72 select-none overflow-visible">
                {/* Horizontal Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
                  const y = chartH - padBottom - pct * usableH;
                  return (
                    <g key={i}>
                      <line
                        x1={padLeft}
                        y1={y}
                        x2={chartW - padRight}
                        y2={y}
                        stroke="#f1f5f9"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                      />
                      <text
                        x={padLeft - 10}
                        y={y + 4}
                        textAnchor="end"
                        className="text-[11px] font-semibold fill-slate-400"
                      >
                        {Math.round(pct * maxBarVal)}
                      </text>
                    </g>
                  );
                })}

                {/* Bars across all categories filling full width */}
                {timeLabels.map((label, idx) => {
                  const numCats = timeLabels.length;
                  const colW = usableW / numCats;
                  const colCenter = padLeft + (idx + 0.5) * colW;
                  const singleW = Math.min(20, Math.max(9, colW * 0.32));
                  const gap = 3;

                  const val1 = barData1[idx] || 0;
                  const val2 = barData2[idx] || 0;
                  const h1 = (val1 / maxBarVal) * usableH;
                  const h2 = (val2 / maxBarVal) * usableH;
                  const isHovered = activeBarIndex === idx;

                  const b1X = colCenter - singleW - gap / 2;
                  const b2X = colCenter + gap / 2;
                  const baseY = chartH - padBottom;

                  return (
                    <g
                      key={idx}
                      className="cursor-pointer transition-all"
                      onMouseEnter={() => setActiveBarIndex(idx)}
                      onMouseLeave={() => setActiveBarIndex(null)}
                    >
                      {/* Bar 1: Realisasi */}
                      <rect
                        x={b1X}
                        y={baseY - h1}
                        width={singleW}
                        height={h1}
                        rx="3.5"
                        fill={isHovered ? '#103a94' : '#175cd3'}
                        className="transition-colors duration-150"
                      />
                      {/* Bar 2: Target */}
                      <rect
                        x={b2X}
                        y={baseY - h2}
                        width={singleW}
                        height={h2}
                        rx="3.5"
                        fill={isHovered ? '#059669' : '#10b981'}
                        className="transition-colors duration-150"
                      />

                      {/* Tooltip on hover */}
                      {isHovered && (
                        <g>
                          <rect
                            x={Math.max(10, Math.min(chartW - 100, colCenter - 45))}
                            y={baseY - Math.max(h1, h2) - 40}
                            width="90"
                            height="32"
                            rx="8"
                            fill="#0f172a"
                            className="shadow-xl"
                          />
                          <text
                            x={Math.max(55, Math.min(chartW - 55, colCenter))}
                            y={baseY - Math.max(h1, h2) - 26}
                            textAnchor="middle"
                            className="text-[10px] font-medium fill-slate-300"
                          >
                            {label}
                          </text>
                          <text
                            x={Math.max(55, Math.min(chartW - 55, colCenter))}
                            y={baseY - Math.max(h1, h2) - 13}
                            textAnchor="middle"
                            className="text-[11px] font-bold fill-white"
                          >
                            {val1} / {val2}
                          </text>
                        </g>
                      )}

                      {/* X-axis Label */}
                      <text
                        x={colCenter}
                        y={chartH - 12}
                        textAnchor="middle"
                        className="text-[11px] font-semibold fill-slate-500"
                      >
                        {label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Bottom Legend for Bar Chart */}
            <div className="flex items-center justify-center gap-6 mt-3 pt-3 border-t border-slate-100 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-3 h-3 rounded-md bg-[#175cd3]" />
                Realisasi
              </span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-3 h-3 rounded-md bg-[#10b981]" />
                Target Rencana
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 3: DOUGHNUT, RADAR & POLAR AREA CHARTS           */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* CHART 3: DOUGHNUT CHART */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs relative">
          <div className="px-6 py-4.5 border-b border-slate-100 rounded-t-2xl">
            <h4 className="text-base font-bold text-[#1351b8] flex items-center gap-2">
              <PieChart className="w-4 h-4 text-[#175cd3]" />
              Doughnut Chart: Kategori
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">Proporsi distribusi pemanfaatan aset sistem.</p>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-center">
              <svg viewBox="0 0 300 270" className="w-56 h-56 select-none overflow-visible">
                {/* SVG Donut Slices */}
                {(() => {
                  let cumulativePct = 0;
                  return doughnutData.map((slice, idx) => {
                    const startAngle = (cumulativePct / 100) * 2 * Math.PI - Math.PI / 2;
                    cumulativePct += slice.value;
                    const endAngle = (cumulativePct / 100) * 2 * Math.PI - Math.PI / 2;
                    const isHovered = activeDoughnutIndex === idx;
                    const rOut = isHovered ? 104 : 98;
                    const rIn = isHovered ? 60 : 64;

                    const x1 = 150 + rOut * Math.cos(startAngle);
                    const y1 = 135 + rOut * Math.sin(startAngle);
                    const x2 = 150 + rOut * Math.cos(endAngle);
                    const y2 = 135 + rOut * Math.sin(endAngle);

                    const x3 = 150 + rIn * Math.cos(endAngle);
                    const y3 = 135 + rIn * Math.sin(endAngle);
                    const x4 = 150 + rIn * Math.cos(startAngle);
                    const y4 = 135 + rIn * Math.sin(startAngle);

                    const largeArc = slice.value > 50 ? 1 : 0;
                    const d = `M ${x1},${y1} A ${rOut},${rOut} 0 ${largeArc} 1 ${x2},${y2} L ${x3},${y3} A ${rIn},${rIn} 0 ${largeArc} 0 ${x4},${y4} Z`;

                    return (
                      <path
                        key={idx}
                        d={d}
                        fill={slice.color}
                        className="cursor-pointer transition-all duration-200 hover:opacity-90"
                        onMouseEnter={() => setActiveDoughnutIndex(idx)}
                        onMouseLeave={() => setActiveDoughnutIndex(null)}
                      />
                    );
                  });
                })()}

                {/* Center Badge */}
                <circle cx="150" cy="135" r="54" fill="#ffffff" className="shadow-inner" />
                <text x="150" y="130" textAnchor="middle" className="text-xl font-black fill-slate-900 tracking-tight">
                  {activeDoughnutIndex !== null ? `${doughnutData[activeDoughnutIndex].value}%` : '1,420'}
                </text>
                <text x="150" y="146" textAnchor="middle" className="text-[10px] font-bold fill-slate-400 uppercase tracking-widest">
                  {activeDoughnutIndex !== null ? doughnutData[activeDoughnutIndex].label : 'Total Aset'}
                </text>
              </svg>
            </div>

            {/* Doughnut Legend */}
            <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100">
              {doughnutData.map((d, i) => (
                <div
                  key={i}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    activeDoughnutIndex === i
                      ? 'border-[#175cd3] bg-blue-50/50'
                      : 'border-slate-100 hover:border-slate-200'
                  }`}
                  onMouseEnter={() => setActiveDoughnutIndex(i)}
                  onMouseLeave={() => setActiveDoughnutIndex(null)}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="text-xs font-bold text-slate-700 truncate">{d.label}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-semibold block pl-4 mt-0.5">
                    {d.value}% ({d.count})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CHART 4: RADAR / SPIDER WEB CHART */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs relative">
          <div className="px-6 py-4.5 border-b border-slate-100 rounded-t-2xl">
            <h4 className="text-base font-bold text-[#1351b8] flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#175cd3]" />
              Radar Chart: Metrik Sistem
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">Evaluasi kapabilitas dan keandalan arsitektur.</p>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-center">
              <svg viewBox="0 0 300 270" className="w-56 h-56 select-none overflow-visible">
                {/* Concentric Web Rings (20%, 40%, 60%, 80%, 100%) */}
                {[0.25, 0.5, 0.75, 1].map((lvl, idx) => {
                  const ringR = radarR * lvl;
                  const ringPts = Array.from({ length: 6 }).map((_, i) => {
                    const angle = (Math.PI / 3) * i - Math.PI / 2;
                    return `${radarCx + ringR * Math.cos(angle)},${radarCy + ringR * Math.sin(angle)}`;
                  }).join(' ');
                  return (
                    <polygon
                      key={idx}
                      points={ringPts}
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="1.2"
                    />
                  );
                })}

                {/* Axis Radial Lines */}
                {Array.from({ length: 6 }).map((_, i) => {
                  const angle = (Math.PI / 3) * i - Math.PI / 2;
                  return (
                    <line
                      key={i}
                      x1={radarCx}
                      y1={radarCy}
                      x2={radarCx + radarR * Math.cos(angle)}
                      y2={radarCy + radarR * Math.sin(angle)}
                      stroke="#cbd5e1"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Radar Data Polygon */}
                <polygon
                  points={radarPolyPoints}
                  fill="#175cd3"
                  fillOpacity="0.25"
                  stroke="#175cd3"
                  strokeWidth="2.5"
                  className="transition-all duration-300"
                />

                {/* Data Vertex Dots & Hover */}
                {radarPoints.map((pt, i) => (
                  <g
                    key={i}
                    className="cursor-pointer"
                    onMouseEnter={() => setActiveRadarIndex(i)}
                    onMouseLeave={() => setActiveRadarIndex(null)}
                  >
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={activeRadarIndex === i ? 6 : 4}
                      fill="#ffffff"
                      stroke="#175cd3"
                      strokeWidth="2.5"
                    />
                    {/* Axis Label */}
                    <text
                      x={pt.axisX}
                      y={pt.axisY}
                      textAnchor="middle"
                      className="text-[10px] font-bold fill-slate-600"
                    >
                      {pt.axis}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            {/* Radar Legend Footer */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600">
              <span>Overall Score: <strong className="text-[#1351b8]">90.5/100</strong></span>
              <span className="text-emerald-600 font-bold">Status: Sangat Andal</span>
            </div>
          </div>
        </div>

        {/* CHART 5: POLAR AREA CHART */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs relative">
          <div className="px-6 py-4.5 border-b border-slate-100 rounded-t-2xl">
            <h4 className="text-base font-bold text-[#1351b8] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#175cd3]" />
              Polar Area: Wilayah Operasional
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">Sebaran beban server berdasarkan zona regional.</p>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-center">
              <svg viewBox="0 0 300 270" className="w-56 h-56 select-none overflow-visible">
                {/* Concentric Guide Circles */}
                {[0.33, 0.66, 1].map((pct, i) => (
                  <circle
                    key={i}
                    cx={polarCx}
                    cy={polarCy}
                    r={polarMaxR * pct}
                    fill="none"
                    stroke="#f1f5f9"
                    strokeWidth="1.5"
                  />
                ))}

                {/* Polar Area Slices (5 Slices) */}
                {polarData.map((slice, i) => {
                  const sliceAngle = (2 * Math.PI) / polarData.length;
                  const startA = i * sliceAngle - Math.PI / 2;
                  const endA = (i + 1) * sliceAngle - Math.PI / 2;
                  const r = (slice.value / 100) * polarMaxR;
                  const isHovered = activePolarIndex === i;

                  const x1 = polarCx + r * Math.cos(startA);
                  const y1 = polarCy + r * Math.sin(startA);
                  const x2 = polarCx + r * Math.cos(endA);
                  const y2 = polarCy + r * Math.sin(endA);

                  const d = `M ${polarCx},${polarCy} L ${x1},${y1} A ${r},${r} 0 0 1 ${x2},${y2} Z`;

                  return (
                    <path
                      key={i}
                      d={d}
                      fill={slice.color}
                      fillOpacity={isHovered ? 0.9 : 0.65}
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="cursor-pointer transition-all duration-200"
                      onMouseEnter={() => setActivePolarIndex(i)}
                      onMouseLeave={() => setActivePolarIndex(null)}
                    />
                  );
                })}

                <circle cx={polarCx} cy={polarCy} r="5" fill="#0f172a" />
              </svg>
            </div>

            {/* Polar Legend */}
            <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
              {polarData.map((p, i) => (
                <div
                  key={i}
                  className={`p-1.5 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                    activePolarIndex === i ? 'bg-slate-50 border-slate-300' : 'border-slate-100'
                  }`}
                  onMouseEnter={() => setActivePolarIndex(i)}
                  onMouseLeave={() => setActivePolarIndex(null)}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                    <span className="font-semibold text-slate-700">{p.region}</span>
                  </div>
                  <span className="font-bold text-slate-900">{p.pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 4: HORIZONTAL BARS & INFRASTRUCTURE KPI METERS   */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Horizontal Bar Chart (lg:col-span-6) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-100 shadow-xs relative">
          <div className="px-6 py-4.5 border-b border-slate-100 rounded-t-2xl flex items-center justify-between">
            <div>
              <h4 className="text-base font-bold text-[#1351b8]">Horizontal Bar: Peringkat Divisi</h4>
              <p className="text-xs text-slate-500 mt-0.5">Aktivitas dan kepatuhan sistem per departemen.</p>
            </div>
            <span className="text-xs font-bold text-slate-500">Top 5 Divisi</span>
          </div>

          <div className="p-6 space-y-4">
            {departmentRanks.map((dept, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-700 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    {dept.name}
                  </span>
                  <span className="text-slate-900">{dept.target}</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${dept.value}%` }}
                    className={`h-full rounded-full transition-all duration-500 ${dept.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Resource Gauges (lg:col-span-6) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-100 shadow-xs relative">
          <div className="px-6 py-4.5 border-b border-slate-100 rounded-t-2xl flex items-center justify-between">
            <div>
              <h4 className="text-base font-bold text-[#1351b8]">Status Utilisasi & Sumber Daya</h4>
              <p className="text-xs text-slate-500 mt-0.5">Monitoring kapasitas memori, storage, dan jaringan.</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
              Semua Layanan Sehat
            </span>
          </div>

          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-[#175cd3]" /> CPU Multi-Core
                </span>
                <span className="text-xs font-extrabold text-[#175cd3]">42.8%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                <div style={{ width: '42.8%' }} className="h-full bg-[#175cd3] rounded-full" />
              </div>
              <p className="text-[10px] text-slate-400 mt-2">8 Cores @ 3.8 GHz • Suhu 48°C</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <HardDrive className="w-4 h-4 text-emerald-600" /> RAM Memory
                </span>
                <span className="text-xs font-extrabold text-emerald-600">64.2%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                <div style={{ width: '64.2%' }} className="h-full bg-emerald-500 rounded-full" />
              </div>
              <p className="text-[10px] text-slate-400 mt-2">20.5 GB / 32 GB DDR5 Terpakai</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <HardDrive className="w-4 h-4 text-amber-600" /> NVMe SSD Storage
                </span>
                <span className="text-xs font-extrabold text-amber-600">49.6%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                <div style={{ width: '49.6%' }} className="h-full bg-amber-500 rounded-full" />
              </div>
              <p className="text-[10px] text-slate-400 mt-2">248 GB / 500 GB RAID 10</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-purple-600" /> Bandwidth Gateway
                </span>
                <span className="text-xs font-extrabold text-purple-600">28.4%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                <div style={{ width: '28.4%' }} className="h-full bg-purple-500 rounded-full" />
              </div>
              <p className="text-[10px] text-slate-400 mt-2">284 Mbps / 1 Gbps Dedicated</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabView() {
  const [tabDefault, setTabDefault] = useState<'home' | 'profile' | 'contact'>('home');
  const [tabBordered, setTabBordered] = useState<'home' | 'profile' | 'contact'>('home');
  const [tabPills, setTabPills] = useState<'home' | 'profile' | 'contact'>('profile');
  const [tabTwoCol, setTabTwoCol] = useState<'home' | 'profile' | 'contact'>('home');
  const [tabIcon, setTabIcon] = useState<'home' | 'profile' | 'contact'>('home');
  const [tabIconCentered, setTabIconCentered] = useState<'home' | 'profile' | 'contact'>('contact');

  // Enterprise Interactive Tab State
  const [enterpriseTab, setEnterpriseTab] = useState<'profile' | 'security' | 'notifications' | 'logs'>('profile');
  const [emailNotification, setEmailNotification] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Standard Stisla Tab Copy Contents
  const tabContent = {
    home: {
      title: 'Home Content',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
    profile: {
      title: 'Profile Content',
      text: 'Sed sed metus vel lacus hendrerit tempus. Sed efficitur velit tortor, ac efficitur est lobortis quis. Nullam lacinia metus erat, sed fermentum justo rutrum ultrices. Proin quis iaculis tellus. Etiam ac vehicula eros, pharetra consectetur dui.',
    },
    contact: {
      title: 'Contact Content',
      text: 'Vestibulum imperdiet odio sed neque ultricies, ut dapibus mi maximus. Proin ligula massa, gravida in lacinia efficitur, hendrerit eget mauris. Pellentesque fermentum, sem interdum molestie finibus, nulla diam varius leo, nec varius lectus elit id dolor.',
    },
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Breadcrumb Header with Master Blue Pill Accent */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-8 h-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full inline-block" />
          <h2 className="text-base sm:text-lg font-bold text-slate-800">Tabs</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500">
          The tab component for dividing parts of content.
        </p>
      </div>

      {/* Main Grid: 3 Rows of 2-Column Cards matching Stisla exact layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CARD 1: DEFAULT TAB */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <h4 className="text-base font-bold text-[#1351b8] mb-4">Default Tab</h4>

            {/* Tab Navigation Strip */}
            <div className="border-b border-slate-200 flex items-center gap-1">
              {(['home', 'profile', 'contact'] as const).map((tab) => {
                const isActive = tabDefault === tab;
                const label = tab.charAt(0).toUpperCase() + tab.slice(1);
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setTabDefault(tab)}
                    className={`px-4 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'border border-slate-200 border-b-white bg-white rounded-t-lg -mb-px text-slate-800 shadow-2xs'
                        : 'text-[#175cd3] hover:text-[#0f3ba0] border-transparent'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Tab Body Content */}
            <div className="pt-4 text-xs sm:text-sm text-slate-600 leading-relaxed min-h-[110px]">
              {tabContent[tabDefault].text}
            </div>
          </div>
        </div>

        {/* CARD 2: BORDERED TAB */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <h4 className="text-base font-bold text-[#1351b8] mb-4">Bordered Tab</h4>

            {/* Tab Navigation Strip */}
            <div className="border-b border-slate-200 flex items-center gap-1">
              {(['home', 'profile', 'contact'] as const).map((tab) => {
                const isActive = tabBordered === tab;
                const label = tab.charAt(0).toUpperCase() + tab.slice(1);
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setTabBordered(tab)}
                    className={`px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'border border-slate-200 border-b-white bg-white rounded-t-xl -mb-px text-slate-800 shadow-2xs'
                        : 'text-[#175cd3] hover:text-[#0f3ba0] border-transparent'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Tab Body Content */}
            <div className="pt-4 text-xs sm:text-sm text-slate-600 leading-relaxed min-h-[110px]">
              {tabContent[tabBordered].text}
            </div>
          </div>
        </div>

        {/* CARD 3: TAB .NAV-PILLS */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <h4 className="text-base font-bold text-[#1351b8] mb-4">Tab .nav-pills</h4>

            {/* Pill Navigation Strip */}
            <div className="flex items-center gap-2 mb-4">
              {(['home', 'profile', 'contact'] as const).map((tab) => {
                const isActive = tabPills === tab;
                const label = tab.charAt(0).toUpperCase() + tab.slice(1);
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setTabPills(tab)}
                    className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#175cd3] text-white shadow-xs'
                        : 'text-[#175cd3] hover:bg-blue-50/70'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Tab Body Content */}
            <div className="text-xs sm:text-sm text-slate-600 leading-relaxed min-h-[110px]">
              {tabContent[tabPills].text}
            </div>
          </div>
        </div>

        {/* CARD 4: 2 COLUMN (VERTICAL TABS) */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <h4 className="text-base font-bold text-[#1351b8] mb-4">2 Column</h4>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Left Column: Vertical Tab List (md:col-span-4) */}
              <div className="md:col-span-4 flex flex-col gap-1.5">
                {(['home', 'profile', 'contact'] as const).map((tab) => {
                  const isActive = tabTwoCol === tab;
                  const label = tab.charAt(0).toUpperCase() + tab.slice(1);
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setTabTwoCol(tab)}
                      className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#175cd3] text-white shadow-xs'
                          : 'text-[#175cd3] hover:bg-blue-50/70'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* Right Column: Tab Content (md:col-span-8) */}
              <div className="md:col-span-8 text-xs sm:text-sm text-slate-600 leading-relaxed min-h-[110px]">
                {tabContent[tabTwoCol].text}
              </div>
            </div>
          </div>
        </div>

        {/* CARD 5: ICON TAB */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <h4 className="text-base font-bold text-[#1351b8] mb-4">Icon Tab</h4>

            {/* Tab Navigation Strip with Icons */}
            <div className="border-b border-slate-200 flex items-center gap-1">
              {[
                { id: 'home', label: 'Home', icon: Home },
                { id: 'profile', label: 'Profile', icon: User },
                { id: 'contact', label: 'Contact', icon: Phone },
              ].map((item) => {
                const isActive = tabIcon === item.id;
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTabIcon(item.id as any)}
                    className={`px-4 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                      isActive
                        ? 'border border-slate-200 border-b-white bg-white rounded-t-lg -mb-px text-slate-800 shadow-2xs'
                        : 'text-[#175cd3] hover:text-[#0f3ba0] border-transparent'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Body Content */}
            <div className="pt-4 text-xs sm:text-sm text-slate-600 leading-relaxed min-h-[110px]">
              {tabContent[tabIcon].text}
            </div>
          </div>
        </div>

        {/* CARD 6: ICON TAB BORDERED + CENTERED */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <h4 className="text-base font-bold text-[#1351b8] mb-4">
              Icon Tab Bordered + Centered .justify-content-center
            </h4>

            {/* Centered Tab Navigation Strip with Top Icons */}
            <div className="flex justify-center items-end gap-1 mb-0">
              {[
                { id: 'home', label: 'Home', icon: Home },
                { id: 'profile', label: 'Profile', icon: User },
                { id: 'contact', label: 'Contact', icon: Mail },
              ].map((item) => {
                const isActive = tabIconCentered === item.id;
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTabIconCentered(item.id as any)}
                    className={`flex flex-col items-center px-6 py-2.5 text-xs font-semibold cursor-pointer transition-all ${
                      isActive
                        ? 'border border-slate-200 border-b-white bg-white rounded-t-xl -mb-px text-[#1351b8] font-bold shadow-2xs relative z-10'
                        : 'text-slate-600 hover:text-slate-900 border-transparent'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 mb-1 ${isActive ? 'text-[#175cd3]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Bordered Box Content below Centered Tabs */}
            <div className="border border-slate-200 rounded-xl p-5 text-xs sm:text-sm text-slate-600 leading-relaxed bg-white min-h-[110px]">
              {tabContent[tabIconCentered].text}
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 4: MODERN ENTERPRISE TAB SYSTEM (REAL-WORLD VALUE)*/}
      {/* ======================================================== */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 sm:p-7 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h4 className="text-base font-bold text-slate-800">
                Interactive Enterprise Settings Tab (Modernized Tab System)
              </h4>
            </div>
            <p className="text-xs text-slate-500">
              Contoh implementasi tab modern untuk pengaturan sistem enterprise dengan badge notifikasi, form input, dan audit trail live.
            </p>
          </div>

          {/* Quick Tab Switcher Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200/80">
            {[
              { id: 'profile', label: 'Profil Akun', icon: User, badge: null },
              { id: 'security', label: 'Keamanan & Sandi', icon: Lock, badge: 'Aman' },
              { id: 'notifications', label: 'Notifikasi', icon: Mail, badge: '3 Baru' },
              { id: 'logs', label: 'Log Aktivitas', icon: Activity, badge: 'Live' },
            ].map((tab) => {
              const IconComp = tab.icon;
              const isActive = enterpriseTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setEnterpriseTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-[#1351b8] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold ${
                        tab.badge === 'Live'
                          ? 'bg-emerald-100 text-emerald-700'
                          : tab.badge === 'Aman'
                          ? 'bg-blue-100 text-[#1351b8]'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Panels */}
        <div className="pt-6">
          {enterpriseTab === 'profile' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-4 flex flex-col items-center p-6 bg-slate-50/70 rounded-2xl border border-slate-100 text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#175cd3] to-[#0f3ba0] text-white flex items-center justify-center font-bold text-2xl shadow-md shadow-blue-500/20 mb-3">
                  FI
                </div>
                <h5 className="text-sm font-bold text-slate-800">Fahmi Ibrahim</h5>
                <p className="text-xs text-slate-500">Lead Enterprise UI Architect</p>
                <span className="mt-2 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  Status: Aktif & Terverifikasi
                </span>
              </div>
              <div className="md:col-span-8 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap</label>
                    <input
                      type="text"
                      readOnly
                      value="Fahmi Ibrahim"
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Resmi</label>
                    <input
                      type="email"
                      readOnly
                      value="fahmi@velora-ui.test"
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi Singkat / Bio</label>
                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    Pengembang utama sistem antarmuka Velora UI. Mengembangkan desain berbasis standar eksekutif, kontras tinggi, dan modern responsiveness.
                  </p>
                </div>
              </div>
            </div>
          )}

          {enterpriseTab === 'security' && (
            <div className="space-y-4 max-w-2xl">
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 flex items-center justify-between">
                <div>
                  <h6 className="text-xs font-bold text-slate-800">Autentikasi Dua Faktor (2FA)</h6>
                  <p className="text-[11px] text-slate-500">Tingkatkan keamanan akun dengan verifikasi OTP melalui Authenticator.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setTwoFactorEnabled(!twoFactorEnabled);
                    showToast(twoFactorEnabled ? '2FA telah dinonaktifkan.' : '2FA berhasil diaktifkan!', 'success');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    twoFactorEnabled
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                  }`}
                >
                  {twoFactorEnabled ? 'Aktif' : 'Aktifkan'}
                </button>
              </div>

              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 flex items-center justify-between">
                <div>
                  <h6 className="text-xs font-bold text-slate-800">Sandi & Kredensial Terakhir</h6>
                  <p className="text-[11px] text-slate-500">Kata sandi terakhir diperbarui 14 hari yang lalu.</p>
                </div>
                <button
                  type="button"
                  onClick={() => showToast('Form ganti kata sandi dibuka.', 'info')}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#1351b8] bg-blue-50 hover:bg-blue-100 transition-all cursor-pointer"
                >
                  Ganti Sandi
                </button>
              </div>
            </div>
          )}

          {enterpriseTab === 'notifications' && (
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/60">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Notifikasi Email Transaksi</span>
                  <span className="text-[11px] text-slate-500">Terima ringkasan transaksi permohonan kasbon baru.</span>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotification}
                  onChange={(e) => {
                    setEmailNotification(e.target.checked);
                    showToast('Pengaturan notifikasi disimpan.', 'success');
                  }}
                  className="w-4 h-4 text-[#175cd3] rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/60">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Pemberitahuan Sistem & Keamanan</span>
                  <span className="text-[11px] text-slate-500">Peringatan otomatis saat ada sesi login baru dari perangkat berbeda.</span>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-[#175cd3] rounded cursor-pointer"
                />
              </div>
            </div>
          )}

          {enterpriseTab === 'logs' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold">
                    <th className="py-2.5 px-3">Waktu</th>
                    <th className="py-2.5 px-3">Aktivitas</th>
                    <th className="py-2.5 px-3">IP Address</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="py-2.5 px-3 font-medium text-slate-500">Baru saja</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">Pergantian Tab Komponen</td>
                    <td className="py-2.5 px-3 font-mono text-[11px]">192.168.1.42</td>
                    <td className="py-2.5 px-3"><span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Sukses</span></td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium text-slate-500">10 Menit lalu</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">Login via SSO Google</td>
                    <td className="py-2.5 px-3 font-mono text-[11px]">182.253.12.98</td>
                    <td className="py-2.5 px-3"><span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Sukses</span></td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium text-slate-500">1 Jam lalu</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">Ekspor Laporan Statistik Kasbon</td>
                    <td className="py-2.5 px-3 font-mono text-[11px]">192.168.1.42</td>
                    <td className="py-2.5 px-3"><span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">Selesai</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Dedicated User Component matching ShizueFI & Stisla with Master Gradients & Interactive Features
interface UserItem {
  id: string;
  name: string;
  role: string;
  avatarBg: string;
  avatarColor: string;
}

interface CommentItem {
  id: number;
  name: string;
  time: string;
  status: 'Approved' | 'Pending';
  body: string;
  avatarBg: string;
  avatarColor: string;
}

function UserView() {
  // Social Icons SVGs
  const SocialFacebook = () => (
    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );

  const SocialTwitter = () => (
    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.936 9.936 0 0024 4.59z" />
    </svg>
  );

  const SocialGithub = () => (
    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );

  const SocialInstagram = () => (
    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );

  // Follow State Map
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({
    'hasan-top': false,
    'hasan': false,
    'kusnaedi': false,
    'bagus': true,
    'wildan': false,
    'deden': false,
  });

  const toggleFollow = (id: string, name: string) => {
    setFollowingMap((prev) => {
      const nextState = !prev[id];
      showToast(nextState ? `Anda sekarang mengikuti ${name}` : `Berhenti mengikuti ${name}`, 'info');
      return { ...prev, [id]: nextState };
    });
  };

  // Carousel Slide State (0 or 1)
  const [carouselSlide, setCarouselSlide] = useState(0);

  // All Users in Carousel
  const allCarouselUsers: UserItem[] = [
    { id: 'hasan', name: 'Hasan Basri', role: 'WEB DEVELOPER', avatarBg: 'bg-blue-100', avatarColor: 'text-[#175cd3]' },
    { id: 'kusnaedi', name: 'Kusnaedi', role: 'MOBILE DEVELOPER', avatarBg: 'bg-emerald-100', avatarColor: 'text-emerald-600' },
    { id: 'bagus', name: 'Bagus Dwi Cahya', role: 'UI DESIGNER', avatarBg: 'bg-sky-100', avatarColor: 'text-sky-600' },
    { id: 'wildan', name: 'Wildan Ahdian', role: 'PROJECT MANAGER', avatarBg: 'bg-amber-100', avatarColor: 'text-amber-600' },
    { id: 'deden', name: 'Deden Febriansyah', role: 'IT SUPPORT', avatarBg: 'bg-blue-100', avatarColor: 'text-[#175cd3]' },
  ];

  const visibleUsers = carouselSlide === 0
    ? allCarouselUsers.slice(0, 4)
    : allCarouselUsers.slice(1, 5);

  // Authors Grid Data (8 bubbles)
  const authorsData = [
    { name: 'Ahmad Fauzi', role: 'Senior Maintainer', icon: Wrench, bg: 'bg-blue-100', color: 'text-[#175cd3]' },
    { name: 'Bambang Kusuma', role: 'DevOps Specialist', icon: Settings, bg: 'bg-emerald-100', color: 'text-emerald-600' },
    { name: 'Citra Kirana', role: 'Technical Writer', icon: Edit3, bg: 'bg-sky-100', color: 'text-sky-600' },
    { name: 'Dimas Anggara', role: 'Content Strategist', icon: Edit3, bg: 'bg-amber-100', color: 'text-amber-600' },
    { name: 'Eka Ramadhani', role: 'Core Architect', icon: Wrench, bg: 'bg-rose-100', color: 'text-rose-600' },
    { name: 'Fajar Nugroho', role: 'System Admin', icon: Settings, bg: 'bg-amber-100', color: 'text-amber-600' },
    { name: 'Gita Pertiwi', role: 'UX Researcher', icon: Edit3, bg: 'bg-indigo-100', color: 'text-indigo-600' },
    { name: 'Hendra Setiawan', role: 'Infrastructure Eng', icon: Settings, bg: 'bg-emerald-100', color: 'text-emerald-600' },
  ];

  // Comments State
  const [comments, setComments] = useState<CommentItem[]>([
    {
      id: 1,
      name: 'Rizal Fakhri',
      time: 'Yesterday',
      status: 'Approved',
      body: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      avatarBg: 'bg-blue-100',
      avatarColor: 'text-[#175cd3]',
    },
    {
      id: 2,
      name: 'Bambang Uciha',
      time: 'Yesterday',
      status: 'Pending',
      body: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      avatarBg: 'bg-emerald-100',
      avatarColor: 'text-emerald-600',
    },
    {
      id: 3,
      name: 'Ujang Maman',
      time: 'Yesterday',
      status: 'Approved',
      body: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident',
      avatarBg: 'bg-sky-100',
      avatarColor: 'text-sky-600',
    },
  ]);

  const handleDeleteComment = (id: number) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
    showToast('Komentar berhasil dihapus.', 'info');
  };

  // User Progress Data
  const userProgressData = [
    { name: 'Rizal Fakhri', role: 'WEB DEVELOPER', pct: 30, bg: 'bg-blue-100', color: 'text-[#175cd3]', posts: '1,239', followers: '10K', following: '2,312' },
    { name: 'Irwansyah Saputra', role: 'WEB DEVELOPER', pct: 67, bg: 'bg-rose-100', color: 'text-rose-600', posts: '4,872', followers: '43K', following: '1,290' },
    { name: 'Hasan Basri', role: 'WEB DEVELOPER', pct: 45, bg: 'bg-amber-100', color: 'text-amber-600', posts: '1,821', followers: '14K', following: '2,891' },
  ];

  // Modal State
  const [selectedUserModal, setSelectedUserModal] = useState<any | null>(null);
  const [isViewAllOpen, setIsViewAllOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Page Title & Breadcrumb Header with Master Blue Pill Accent */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-8 h-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full inline-block" />
          <h2 className="text-base sm:text-lg font-bold text-slate-800">Users</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500">
          Components relating to users, lists of users and so on.
        </p>
      </div>

      {/* ======================================================== */}
      {/* 2-COLUMN MASONRY STREAM (LEFT COLUMN 7 COLS, RIGHT 5 COLS)*/}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ======================================================== */}
        {/* LEFT COLUMN: CARD 1 (PROFILE), CARD 3 (USERS), CARD 5 (COMMENTS) */}
        {/* ======================================================== */}
        <div className="lg:col-span-7 space-y-6">
          {/* CARD 1: HORIZONTAL PROFILE CARD (Natural compact height) */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6">
            <div className="flex items-start gap-5">
              {/* Avatar & Follow Button Column */}
              <div className="flex flex-col items-center shrink-0 w-20">
                <div className="w-20 h-20 rounded-full bg-blue-100 text-[#175cd3] flex items-center justify-center shadow-sm">
                  <User className="w-10 h-10" />
                </div>
                <button
                  type="button"
                  onClick={() => toggleFollow('hasan-top', 'Hasan Basri')}
                  className={`w-full mt-3 py-1.5 px-3 rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer ${
                    followingMap['hasan-top']
                      ? 'bg-rose-500 hover:bg-rose-600 text-white'
                      : 'bg-[#175cd3] hover:bg-[#1351b8] text-white'
                  }`}
                >
                  {followingMap['hasan-top'] ? 'Following' : 'Follow'}
                </button>
              </div>

              {/* Profile Bio & Information */}
              <div className="flex-1 text-left min-w-0">
                <h4 className="text-base font-bold text-slate-800 leading-tight">Hasan Basri</h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5 mb-2.5">Web Developer</p>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore
                  magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                  commodo consequat.
                </p>
              </div>
            </div>

            {/* Card Footer: Social Media & View Posts link (No border-t matching reference image) */}
            <div className="mt-5 flex items-end justify-between gap-4">
              <div>
                <span className="block text-xs font-bold text-slate-700 mb-1.5">Follow Hasan On</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => showToast('Membuka Facebook Hasan Basri', 'info')}
                    className="w-7 h-7 rounded-lg bg-[#3b5998] text-white flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer shadow-2xs"
                    title="Facebook"
                  >
                    <SocialFacebook />
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast('Membuka Twitter Hasan Basri', 'info')}
                    className="w-7 h-7 rounded-lg bg-[#1da1f2] text-white flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer shadow-2xs"
                    title="Twitter"
                  >
                    <SocialTwitter />
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast('Membuka GitHub Hasan Basri', 'info')}
                    className="w-7 h-7 rounded-lg bg-[#24292e] text-white flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer shadow-2xs"
                    title="GitHub"
                  >
                    <SocialGithub />
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast('Membuka Instagram Hasan Basri', 'info')}
                    className="w-7 h-7 rounded-lg bg-[#3f729b] text-white flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer shadow-2xs"
                    title="Instagram"
                  >
                    <SocialInstagram />
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => showToast('Menampilkan semua publikasi artikel Hasan Basri', 'info')}
                className="text-xs font-bold text-slate-700 hover:text-[#175cd3] flex items-center gap-1 transition-colors cursor-pointer pb-1"
              >
                <span>View Posts</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* CARD 3: USERS ROW / CAROUSEL (Floats immediately below Card 1) */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6">
            <div className="flex items-center justify-between mb-5">
              <h4 className="text-base font-bold text-[#1351b8]">Users</h4>
              <button
                type="button"
                onClick={() => setIsViewAllOpen(true)}
                className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-xs transition-all cursor-pointer flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* Horizontal 4-user list */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              {visibleUsers.map((u) => {
                const isFoll = followingMap[u.id] ?? false;
                return (
                  <div key={u.id} className="flex flex-col items-center p-3 rounded-xl hover:bg-slate-50/80 transition-all">
                    <div className={`w-20 h-20 rounded-full ${u.avatarBg} ${u.avatarColor} flex items-center justify-center mb-3 shadow-xs`}>
                      <User className="w-10 h-10" />
                    </div>
                    <h5 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-1">{u.name}</h5>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5 mb-3 line-clamp-1">
                      {u.role}
                    </p>
                    <button
                      type="button"
                      onClick={() => toggleFollow(u.id, u.name)}
                      className={`w-full max-w-[88px] py-1.5 px-3 rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer ${
                        isFoll
                          ? 'bg-rose-500 hover:bg-rose-600 text-white'
                          : 'bg-[#175cd3] hover:bg-[#1351b8] text-white'
                      }`}
                    >
                      {isFoll ? 'Following' : 'Follow'}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Carousel Pagination Dots */}
            <div className="flex items-center justify-center gap-2 pt-4 border-t border-slate-100 mt-4">
              <button
                type="button"
                onClick={() => setCarouselSlide(0)}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                  carouselSlide === 0 ? 'w-6 bg-[#175cd3]' : 'bg-slate-300 hover:bg-slate-400'
                }`}
                title="Slide 1"
              />
              <button
                type="button"
                onClick={() => setCarouselSlide(1)}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                  carouselSlide === 1 ? 'w-6 bg-[#175cd3]' : 'bg-slate-300 hover:bg-slate-400'
                }`}
                title="Slide 2"
              />
            </div>
          </div>

          {/* CARD 5: COMMENTS (Floats below Card 3) */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6">
            <h4 className="text-base font-bold text-[#1351b8] mb-5">Comments</h4>

            <div className="divide-y divide-slate-100">
              {comments.map((comment) => (
                <div key={comment.id} className="py-4 first:pt-0 last:pb-0 flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full ${comment.avatarBg} ${comment.avatarColor} flex items-center justify-center shrink-0 shadow-xs mt-1`}>
                    <User className="w-6 h-6" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <h5 className="text-sm font-bold text-slate-800">{comment.name}</h5>
                        <span className="text-[11px] text-slate-400 font-medium block">{comment.time}</span>
                      </div>
                      <span
                        className={`text-xs font-semibold ${
                          comment.status === 'Approved' ? 'text-[#175cd3]' : 'text-amber-500'
                        }`}
                      >
                        {comment.status}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2 mb-2.5">
                      {comment.body}
                    </p>

                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                      <button
                        type="button"
                        onClick={() => showToast(`Membuka detail komentar dari ${comment.name}`, 'info')}
                        className="hover:text-[#175cd3] transition-colors cursor-pointer"
                      >
                        View
                      </button>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={() => showToast(`Mengedit komentar ${comment.name}`, 'info')}
                        className="hover:text-[#175cd3] transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteComment(comment.id)}
                        className="hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        Trash
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: CARD 2 (PROFILE STATS), CARD 4 (AUTHORS),  */}
        {/* CARD 6 (USER PROGRESS), CARD 7 (USER DETAILS)            */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 space-y-6">
          {/* CARD 2: VERTICAL PROFILE CARD WITH STATS (Matching reference image) */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6">
            {/* Stats Header Row */}
            <div className="flex items-center justify-between pb-5 border-b border-slate-100">
              <div className="w-18 h-18 rounded-full bg-blue-100 text-[#175cd3] flex items-center justify-center shadow-sm shrink-0 ring-4 ring-white">
                <User className="w-9 h-9" />
              </div>

              <div className="flex items-center gap-5 sm:gap-7 text-center">
                <div>
                  <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Posts</span>
                  <span className="text-base sm:text-lg font-black text-slate-800 tracking-tight">187</span>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div>
                  <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Followers</span>
                  <span className="text-base sm:text-lg font-black text-slate-800 tracking-tight">6,8K</span>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div>
                  <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Following</span>
                  <span className="text-base sm:text-lg font-black text-slate-800 tracking-tight">2,1K</span>
                </div>
              </div>
            </div>

            {/* Profile Bio (Left-aligned as in reference image) */}
            <div className="pt-4 text-left">
              <h4 className="text-sm sm:text-base font-bold text-slate-800">
                Hasan Basri <span className="text-slate-400 font-normal">/</span> <span className="text-slate-500 font-medium text-xs sm:text-sm">Web Developer</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2 mb-5">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>

            {/* Social Links Row (Centered as in reference image, without border-t) */}
            <div className="pt-1 flex flex-col items-center justify-center gap-2">
              <span className="text-xs font-bold text-slate-700 text-center">Follow Hasan On</span>
              <div className="flex items-center justify-center gap-1.5">
                <button
                  type="button"
                  onClick={() => showToast('Membuka Facebook Hasan Basri', 'info')}
                  className="w-7 h-7 rounded-lg bg-[#3b5998] text-white flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer shadow-2xs"
                  title="Facebook"
                >
                  <SocialFacebook />
                </button>
                <button
                  type="button"
                  onClick={() => showToast('Membuka Twitter Hasan Basri', 'info')}
                  className="w-7 h-7 rounded-lg bg-[#1da1f2] text-white flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer shadow-2xs"
                  title="Twitter"
                >
                  <SocialTwitter />
                </button>
                <button
                  type="button"
                  onClick={() => showToast('Membuka GitHub Hasan Basri', 'info')}
                  className="w-7 h-7 rounded-lg bg-[#24292e] text-white flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer shadow-2xs"
                  title="GitHub"
                >
                  <SocialGithub />
                </button>
                <button
                  type="button"
                  onClick={() => showToast('Membuka Instagram Hasan Basri', 'info')}
                  className="w-7 h-7 rounded-lg bg-[#3f729b] text-white flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer shadow-2xs"
                  title="Instagram"
                >
                  <SocialInstagram />
                </button>
              </div>
            </div>
          </div>

          {/* CARD 4: AUTHORS GRID */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6">
            <h4 className="text-base font-bold text-[#1351b8] mb-5">Authors</h4>

            {/* 8 Author Avatar Bubbles in 4x2 Grid */}
            <div className="grid grid-cols-4 gap-4 sm:gap-6 justify-items-center py-2">
              {authorsData.map((author, idx) => {
                const IconComponent = author.icon;
                return (
                  <div
                    key={idx}
                    className="relative group cursor-pointer"
                    onClick={() => {
                      setSelectedUserModal({
                        name: author.name,
                        role: author.role,
                        avatarBg: author.bg,
                        avatarColor: author.color,
                        posts: '320',
                        followers: '4.2K',
                        following: '890',
                      });
                    }}
                  >
                    {/* Main Avatar Bubble */}
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full ${author.bg} ${author.color} flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}>
                      <User className="w-7 h-7 sm:w-8 sm:h-8" />
                    </div>

                    {/* Badge Icon in Bottom-Right Corner */}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center">
                      <IconComponent className="w-2.5 h-2.5 text-slate-700" />
                    </div>

                    {/* Tooltip on Hover */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-900 text-white text-[10px] font-semibold py-1 px-2.5 rounded-lg whitespace-nowrap shadow-lg z-20">
                      {author.name}
                      <span className="block text-[9px] text-slate-400 font-normal">{author.role}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-100 mt-2 text-center text-xs text-slate-500">
              Klik bubble untuk melihat kartu profil dan otorisasi author.
            </div>
          </div>

          {/* CARD 6: USER PROGRESS */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6">
            <h4 className="text-base font-bold text-[#1351b8] mb-5">User Progress</h4>

            <div className="space-y-4">
              {userProgressData.map((u, idx) => (
                <div key={idx} className="flex items-center justify-between gap-3 sm:gap-4">
                  {/* Fixed-width User Info Column ensures all progress bars start at the exact same X position */}
                  <div className="w-36 sm:w-44 shrink-0 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${u.bg} ${u.color} flex items-center justify-center shadow-xs shrink-0`}>
                      <User className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h5 className="text-xs sm:text-sm font-bold text-slate-800 truncate" title={u.name}>{u.name}</h5>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block truncate">
                        {u.role}
                      </span>
                    </div>
                  </div>

                  {/* Perfectly aligned Progress Bar & Percentage directly above the bar */}
                  <div className="flex-1 max-w-[130px] sm:max-w-[170px]">
                    <span className="block text-[11px] font-bold text-slate-700 mb-1 text-left">
                      {u.pct}%
                    </span>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        style={{ width: `${u.pct}%` }}
                        className="h-full bg-[#175cd3] rounded-full transition-all duration-500"
                      />
                    </div>
                  </div>

                  {/* Detail Action Button */}
                  <div className="shrink-0 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedUserModal(u)}
                      className="px-3.5 py-1 text-xs font-semibold text-slate-700 hover:text-[#175cd3] border border-slate-200 hover:border-[#175cd3] rounded-full transition-all cursor-pointer shadow-2xs"
                    >
                      Detail
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CARD 7: USER DETAILS */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6">
            <h4 className="text-base font-bold text-[#1351b8] mb-5">User Details</h4>

            <div className="space-y-4">
              {userProgressData.map((u, idx) => (
                <div key={idx} className="flex items-center justify-between gap-3 sm:gap-4 pb-3.5 border-b border-slate-100 last:border-0 last:pb-0">
                  {/* Fixed-width User Info Column matching Card 6 */}
                  <div className="w-36 sm:w-44 shrink-0 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${u.bg} ${u.color} flex items-center justify-center shadow-xs shrink-0`}>
                      <User className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h5 className="text-xs sm:text-sm font-bold text-slate-800 truncate" title={u.name}>{u.name}</h5>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block truncate">
                        {u.role}
                      </span>
                    </div>
                  </div>

                  {/* Stat Columns: Posts, Followers, Following perfectly aligned */}
                  <div className="flex-1 flex items-center justify-end gap-3 sm:gap-6 text-center">
                    <div className="w-12 sm:w-16">
                      <span className="text-xs sm:text-sm font-bold text-slate-900 block">{u.posts}</span>
                      <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Posts</span>
                    </div>
                    <div className="w-12 sm:w-16">
                      <span className="text-xs sm:text-sm font-bold text-slate-900 block">{u.followers}</span>
                      <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Followers</span>
                    </div>
                    <div className="w-12 sm:w-16">
                      <span className="text-xs sm:text-sm font-bold text-slate-900 block">{u.following}</span>
                      <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Following</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL: USER DETAIL MODAL                                 */}
      {/* ======================================================== */}
      {selectedUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
            <button
              type="button"
              onClick={() => setSelectedUserModal(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center pt-2">
              <div className={`w-20 h-20 rounded-full ${selectedUserModal.bg || selectedUserModal.avatarBg} ${selectedUserModal.color || selectedUserModal.avatarColor} flex items-center justify-center shadow-md mb-3`}>
                <User className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{selectedUserModal.name}</h3>
              <p className="text-xs text-[#175cd3] font-semibold">{selectedUserModal.role}</p>

              <div className="grid grid-cols-3 gap-4 w-full py-4 my-4 border-y border-slate-100">
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Posts</span>
                  <span className="text-sm font-extrabold text-slate-800">{selectedUserModal.posts || '1,239'}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Followers</span>
                  <span className="text-sm font-extrabold text-slate-800">{selectedUserModal.followers || '10K'}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Following</span>
                  <span className="text-sm font-extrabold text-slate-800">{selectedUserModal.following || '2,312'}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                Pengembang perangkat lunak profesional dengan spesialisasi arsitektur web modern, komponen responsif, dan optimasi performa antarmuka pengguna.
              </p>

              <div className="flex items-center gap-3 w-full">
                <button
                  type="button"
                  onClick={() => {
                    showToast(`Kirim pesan ke ${selectedUserModal.name}`, 'info');
                    setSelectedUserModal(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-[#175cd3] hover:bg-[#1351b8] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                >
                  Kirim Pesan
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedUserModal(null)}
                  className="py-2.5 px-5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: VIEW ALL USERS DIRECTORY                          */}
      {/* ======================================================== */}
      {isViewAllOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 relative max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Direktori Lengkap Pengguna</h3>
                <p className="text-xs text-slate-500">Daftar seluruh talenta dan pengembang sistem Velora UI.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsViewAllOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto py-4 space-y-3 flex-1">
              {allCarouselUsers.map((u) => {
                const isFoll = followingMap[u.id] ?? false;
                return (
                  <div key={u.id} className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 hover:bg-slate-50/70 transition-all">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-full ${u.avatarBg} ${u.avatarColor} flex items-center justify-center shadow-xs`}>
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">{u.name}</h4>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{u.role}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleFollow(u.id, u.name)}
                      className={`py-1.5 px-4 rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer ${
                        isFoll
                          ? 'bg-rose-500 hover:bg-rose-600 text-white'
                          : 'bg-[#175cd3] hover:bg-[#1351b8] text-white'
                      }`}
                    >
                      {isFoll ? 'Following' : 'Follow'}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setIsViewAllOpen(false)}
                className="py-2 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
              >
                Tutup Direktori
              </button>
            </div>
          </div>
        </div>
      )}
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
    tooltip: {
      title: 'Tooltip',
      breadcrumbs: ['Dashboard', 'Bootstrap Components', 'Tooltip'],
    },
    typography: {
      title: 'Typography',
      breadcrumbs: ['Dashboard', 'Bootstrap Components', 'Typography'],
    },
    article: {
      title: 'Article',
      breadcrumbs: ['Dashboard', 'Components', 'Article'],
    },
    avatar: {
      title: 'Avatar',
      breadcrumbs: ['Dashboard', 'Components', 'Avatar'],
    },
    'chat-box': {
      title: 'Chat Box',
      breadcrumbs: ['Dashboard', 'Components', 'Chat Box'],
    },
    gallery: {
      title: 'Gallery',
      breadcrumbs: ['Dashboard', 'Components', 'Gallery'],
    },
    'multiple-upload': {
      title: 'Multiple Upload',
      breadcrumbs: ['Dashboard', 'Components', 'Multiple Upload'],
    },
    statistic: {
      title: 'Statistic',
      breadcrumbs: ['Dashboard', 'Components', 'Statistic'],
    },
    tab: {
      title: 'Tab',
      breadcrumbs: ['Dashboard', 'Components', 'Tab'],
    },
    user: {
      title: 'User',
      breadcrumbs: ['Dashboard', 'Components', 'User'],
    },
    'advanced-form': {
      title: 'Advanced Forms',
      breadcrumbs: ['Dashboard', 'Forms', 'Advanced Forms'],
    },
    editor: {
      title: 'Editor',
      breadcrumbs: ['Dashboard', 'Forms', 'Editor'],
    },
    validation: {
      title: 'Form Validation',
      breadcrumbs: ['Dashboard', 'Forms', 'Form Validation'],
    },
    'upload-files': {
      title: 'Upload Files',
      breadcrumbs: ['Dashboard', 'Forms', 'Upload Files'],
    },
    calendar: {
      title: 'Calendar',
      breadcrumbs: ['Dashboard', 'Modules', 'Calendar'],
    },
    chartjs: {
      title: 'ChartJS',
      breadcrumbs: ['Dashboard', 'Modules', 'ChartJS'],
    },
    datatables: {
      title: 'DataTables',
      breadcrumbs: ['Dashboard', 'Modules', 'DataTables'],
    },
    flag: {
      title: 'Flag',
      breadcrumbs: ['Dashboard', 'Modules', 'Flag'],
    },
    'font-awesome': {
      title: 'Font Awesome',
      breadcrumbs: ['Dashboard', 'Modules', 'Font Awesome'],
    },
    'ion-icons': {
      title: 'Ion Icons',
      breadcrumbs: ['Dashboard', 'Modules', 'Ion Icons'],
    },
    'owl-carousel': {
      title: 'Owl Carousel',
      breadcrumbs: ['Dashboard', 'Modules', 'Owl Carousel'],
    },
    sparkline: {
      title: 'Sparkline',
      breadcrumbs: ['Dashboard', 'Modules', 'Sparkline'],
    },
    'sweet-alert': {
      title: 'SweetAlert',
      breadcrumbs: ['Dashboard', 'Modules', 'SweetAlert'],
    },
    toastr: {
      title: 'Toastr',
      breadcrumbs: ['Dashboard', 'Modules', 'Toastr'],
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
      case 'tooltip':
        return <TooltipView />;
      case 'typography':
        return <TypographyView />;
      case 'article':
        return <ArticleView />;
      case 'avatar':
        return <AvatarView />;
      case 'chat-box':
        return <ChatBoxView />;
      case 'gallery':
        return <GalleryView />;
      case 'multiple-upload':
        return <MultipleUploadView />;
      case 'statistic':
        return <StatisticView />;
      case 'tab':
        return <TabView />;
      case 'user':
        return <UserView />;
      case 'datatables':
        return <DataTablesView />;
      case 'flag':
        return <FlagView />;
      case 'font-awesome':
        return <FontAwesomeView />;
      case 'ion-icons':
        return <IonIconsView />;
      case 'owl-carousel':
        return <OwlCarouselView />;
      case 'sparkline':
        return <SparklineView />;
      case 'sweet-alert':
        return <SweetAlertView />;
      case 'toastr':
        return <ToastrView />;
      case 'components-table':
        return <KelasView />;
      case 'advanced-form':
        return <AdvancedFormsView />;
      case 'editor':
        return <EditorView />;
      case 'validation':
        return <ValidationView />;
      case 'upload-files':
        return <UploadFilesView />;
      case 'calendar':
        return <CalendarView />;
      case 'chartjs':
        return <ChartJSView />;
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
