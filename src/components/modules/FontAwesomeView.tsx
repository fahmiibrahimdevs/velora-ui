import React, { useState, useMemo } from 'react';
import {
  Search,
  Copy,
  Check,
  Home,
  User,
  Users,
  Settings,
  Bell,
  Mail,
  Heart,
  Star,
  Bookmark,
  Shield,
  Lock,
  Unlock,
  Key,
  Eye,
  EyeOff,
  Trash2,
  Edit3,
  Plus,
  Minus,
  Download,
  Upload,
  Share2,
  ExternalLink,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Camera,
  Video,
  Music,
  Mic,
  Volume2,
  Image as ImageIcon,
  FileText,
  Folder,
  Archive,
  Code2,
  Terminal,
  Cpu,
  Database,
  Server,
  Cloud,
  Wifi,
  Bluetooth,
  Battery,
  Smartphone,
  Laptop,
  Monitor,
  Printer,
  ShoppingCart,
  CreditCard,
  DollarSign,
  Tag,
  Award,
  Zap,
  Flame,
  Compass,
  Send,
  MessageSquare,
  ThumbsUp,
  AlertTriangle,
  Info,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RefreshCw,
  Filter,
  Sliders,
  Layers,
  Grid3x3,
  List,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  Activity,
  BarChart3,
  PieChart,
  Rocket,
  Briefcase,
} from 'lucide-react';
import { showToast } from '../../lib/swal';

type FaCategory =
  | 'UI & Navigation'
  | 'Communication'
  | 'Media & Files'
  | 'Commerce & Finance'
  | 'System & Security'
  | 'Arrows & Data';

interface FaIconDef {
  faClass: string;
  label: string;
  category: FaCategory;
  icon: React.ElementType;
}

const FA_ICONS: FaIconDef[] = [
  { faClass: 'fa-solid fa-house', label: 'House', category: 'UI & Navigation', icon: Home },
  { faClass: 'fa-solid fa-magnifying-glass', label: 'Search', category: 'UI & Navigation', icon: Search },
  { faClass: 'fa-solid fa-user', label: 'User', category: 'UI & Navigation', icon: User },
  { faClass: 'fa-solid fa-users', label: 'Users', category: 'UI & Navigation', icon: Users },
  { faClass: 'fa-solid fa-gear', label: 'Settings', category: 'UI & Navigation', icon: Settings },
  { faClass: 'fa-solid fa-sliders', label: 'Sliders', category: 'UI & Navigation', icon: Sliders },
  { faClass: 'fa-solid fa-filter', label: 'Filter', category: 'UI & Navigation', icon: Filter },
  { faClass: 'fa-solid fa-table-cells', label: 'Grid', category: 'UI & Navigation', icon: Grid3x3 },
  { faClass: 'fa-solid fa-list', label: 'List', category: 'UI & Navigation', icon: List },
  { faClass: 'fa-solid fa-layer-group', label: 'Layers', category: 'UI & Navigation', icon: Layers },
  { faClass: 'fa-solid fa-plus', label: 'Plus', category: 'UI & Navigation', icon: Plus },
  { faClass: 'fa-solid fa-minus', label: 'Minus', category: 'UI & Navigation', icon: Minus },
  { faClass: 'fa-solid fa-pen-to-square', label: 'Edit', category: 'UI & Navigation', icon: Edit3 },
  { faClass: 'fa-solid fa-trash', label: 'Trash', category: 'UI & Navigation', icon: Trash2 },
  { faClass: 'fa-solid fa-bookmark', label: 'Bookmark', category: 'UI & Navigation', icon: Bookmark },
  { faClass: 'fa-solid fa-heart', label: 'Heart', category: 'UI & Navigation', icon: Heart },
  { faClass: 'fa-solid fa-star', label: 'Star', category: 'UI & Navigation', icon: Star },
  { faClass: 'fa-solid fa-eye', label: 'Eye', category: 'UI & Navigation', icon: Eye },
  { faClass: 'fa-solid fa-eye-slash', label: 'Eye Slash', category: 'UI & Navigation', icon: EyeOff },

  { faClass: 'fa-solid fa-bell', label: 'Bell', category: 'Communication', icon: Bell },
  { faClass: 'fa-solid fa-envelope', label: 'Mail', category: 'Communication', icon: Mail },
  { faClass: 'fa-solid fa-paper-plane', label: 'Send', category: 'Communication', icon: Send },
  { faClass: 'fa-solid fa-comment', label: 'Message', category: 'Communication', icon: MessageSquare },
  { faClass: 'fa-solid fa-phone', label: 'Phone', category: 'Communication', icon: Phone },
  { faClass: 'fa-solid fa-share-nodes', label: 'Share', category: 'Communication', icon: Share2 },
  { faClass: 'fa-solid fa-thumbs-up', label: 'Thumbs Up', category: 'Communication', icon: ThumbsUp },
  { faClass: 'fa-solid fa-up-right-from-square', label: 'External', category: 'Communication', icon: ExternalLink },
  { faClass: 'fa-solid fa-location-dot', label: 'Location', category: 'Communication', icon: MapPin },
  { faClass: 'fa-solid fa-compass', label: 'Compass', category: 'Communication', icon: Compass },

  { faClass: 'fa-solid fa-image', label: 'Image', category: 'Media & Files', icon: ImageIcon },
  { faClass: 'fa-solid fa-camera', label: 'Camera', category: 'Media & Files', icon: Camera },
  { faClass: 'fa-solid fa-video', label: 'Video', category: 'Media & Files', icon: Video },
  { faClass: 'fa-solid fa-music', label: 'Music', category: 'Media & Files', icon: Music },
  { faClass: 'fa-solid fa-microphone', label: 'Mic', category: 'Media & Files', icon: Mic },
  { faClass: 'fa-solid fa-volume-high', label: 'Volume', category: 'Media & Files', icon: Volume2 },
  { faClass: 'fa-solid fa-file-lines', label: 'File Text', category: 'Media & Files', icon: FileText },
  { faClass: 'fa-solid fa-folder', label: 'Folder', category: 'Media & Files', icon: Folder },
  { faClass: 'fa-solid fa-box-archive', label: 'Archive', category: 'Media & Files', icon: Archive },
  { faClass: 'fa-solid fa-download', label: 'Download', category: 'Media & Files', icon: Download },
  { faClass: 'fa-solid fa-upload', label: 'Upload', category: 'Media & Files', icon: Upload },

  { faClass: 'fa-solid fa-cart-shopping', label: 'Cart', category: 'Commerce & Finance', icon: ShoppingCart },
  { faClass: 'fa-solid fa-credit-card', label: 'Credit Card', category: 'Commerce & Finance', icon: CreditCard },
  { faClass: 'fa-solid fa-dollar-sign', label: 'Currency', category: 'Commerce & Finance', icon: DollarSign },
  { faClass: 'fa-solid fa-tag', label: 'Tag', category: 'Commerce & Finance', icon: Tag },
  { faClass: 'fa-solid fa-award', label: 'Award', category: 'Commerce & Finance', icon: Award },
  { faClass: 'fa-solid fa-briefcase', label: 'Briefcase', category: 'Commerce & Finance', icon: Briefcase },
  { faClass: 'fa-solid fa-calendar', label: 'Calendar', category: 'Commerce & Finance', icon: Calendar },
  { faClass: 'fa-solid fa-clock', label: 'Clock', category: 'Commerce & Finance', icon: Clock },

  { faClass: 'fa-solid fa-shield-halved', label: 'Shield', category: 'System & Security', icon: Shield },
  { faClass: 'fa-solid fa-lock', label: 'Lock', category: 'System & Security', icon: Lock },
  { faClass: 'fa-solid fa-unlock', label: 'Unlock', category: 'System & Security', icon: Unlock },
  { faClass: 'fa-solid fa-key', label: 'Key', category: 'System & Security', icon: Key },
  { faClass: 'fa-solid fa-code', label: 'Code', category: 'System & Security', icon: Code2 },
  { faClass: 'fa-solid fa-terminal', label: 'Terminal', category: 'System & Security', icon: Terminal },
  { faClass: 'fa-solid fa-microchip', label: 'CPU', category: 'System & Security', icon: Cpu },
  { faClass: 'fa-solid fa-database', label: 'Database', category: 'System & Security', icon: Database },
  { faClass: 'fa-solid fa-server', label: 'Server', category: 'System & Security', icon: Server },
  { faClass: 'fa-solid fa-cloud', label: 'Cloud', category: 'System & Security', icon: Cloud },
  { faClass: 'fa-solid fa-wifi', label: 'WiFi', category: 'System & Security', icon: Wifi },
  { faClass: 'fa-solid fa-bluetooth', label: 'Bluetooth', category: 'System & Security', icon: Bluetooth },
  { faClass: 'fa-solid fa-battery-full', label: 'Battery', category: 'System & Security', icon: Battery },
  { faClass: 'fa-solid fa-mobile-screen', label: 'Mobile', category: 'System & Security', icon: Smartphone },
  { faClass: 'fa-solid fa-laptop', label: 'Laptop', category: 'System & Security', icon: Laptop },
  { faClass: 'fa-solid fa-desktop', label: 'Monitor', category: 'System & Security', icon: Monitor },
  { faClass: 'fa-solid fa-print', label: 'Printer', category: 'System & Security', icon: Printer },

  { faClass: 'fa-solid fa-arrow-up', label: 'Arrow Up', category: 'Arrows & Data', icon: ArrowUp },
  { faClass: 'fa-solid fa-arrow-down', label: 'Arrow Down', category: 'Arrows & Data', icon: ArrowDown },
  { faClass: 'fa-solid fa-arrow-left', label: 'Arrow Left', category: 'Arrows & Data', icon: ArrowLeft },
  { faClass: 'fa-solid fa-arrow-right', label: 'Arrow Right', category: 'Arrows & Data', icon: ArrowRight },
  { faClass: 'fa-solid fa-arrows-rotate', label: 'Refresh', category: 'Arrows & Data', icon: RefreshCw },
  { faClass: 'fa-solid fa-chart-line', label: 'Trending', category: 'Arrows & Data', icon: TrendingUp },
  { faClass: 'fa-solid fa-wave-square', label: 'Activity', category: 'Arrows & Data', icon: Activity },
  { faClass: 'fa-solid fa-chart-column', label: 'Bar Chart', category: 'Arrows & Data', icon: BarChart3 },
  { faClass: 'fa-solid fa-chart-pie', label: 'Pie Chart', category: 'Arrows & Data', icon: PieChart },
  { faClass: 'fa-solid fa-bolt', label: 'Bolt', category: 'Arrows & Data', icon: Zap },
  { faClass: 'fa-solid fa-fire', label: 'Flame', category: 'Arrows & Data', icon: Flame },
  { faClass: 'fa-solid fa-rocket', label: 'Rocket', category: 'Arrows & Data', icon: Rocket },
  { faClass: 'fa-solid fa-triangle-exclamation', label: 'Warning', category: 'Arrows & Data', icon: AlertTriangle },
  { faClass: 'fa-solid fa-circle-info', label: 'Info', category: 'Arrows & Data', icon: Info },
  { faClass: 'fa-solid fa-circle-check', label: 'Check Circle', category: 'Arrows & Data', icon: CheckCircle2 },
  { faClass: 'fa-solid fa-circle-xmark', label: 'Times Circle', category: 'Arrows & Data', icon: XCircle },
  { faClass: 'fa-solid fa-circle-question', label: 'Help', category: 'Arrows & Data', icon: HelpCircle },
];

const GRAD = {
  primary: 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white',
  primaryStatic: 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white',
  info: 'bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] text-white',
  light: 'bg-gradient-to-r from-[#f8fafc] to-[#e2e8f0] text-slate-800 border border-slate-200/80',
};

export function FontAwesomeView() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<'All' | FaCategory>('All');
  const [iconSize, setIconSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [badgeStyle, setBadgeStyle] = useState<'clean' | 'gradient'>('clean');
  const [selectedIcon, setSelectedIcon] = useState<FaIconDef>(FA_ICONS[0]);
  const [copiedFlag, setCopiedFlag] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return FA_ICONS.filter((item) => {
      if (category !== 'All' && item.category !== category) return false;
      if (!q) return true;
      return item.label.toLowerCase().includes(q) || item.faClass.toLowerCase().includes(q);
    });
  }, [search, category]);

  const copyClass = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedFlag(true);
      showToast(`Disalin: ${text} (${label})`, 'success');
      window.setTimeout(() => setCopiedFlag(false), 1400);
    } catch {
      showToast(`Dipilih: ${text}`, 'info');
    }
  };

  const sizeClass = iconSize === 'sm' ? 'w-4 h-4' : iconSize === 'lg' ? 'w-7 h-7' : 'w-5 h-5';
  const SelectedComp = selectedIcon.icon;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Sub-header */}
      <div className="flex items-start gap-3">
        <div className="w-8 h-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full mt-2 shrink-0" />
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Font Awesome Icons</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Direktori {FA_ICONS.length} ikon Font Awesome terkurasi lengkap dengan filter kategori, pratinjau ukuran, gaya gradien, dan salin kode HTML/React.
          </p>
        </div>
      </div>

      {/* Selected Icon Inspector Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs ${GRAD.primaryStatic}`}>
            <SelectedComp className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">{selectedIcon.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${GRAD.info}`}>
                {selectedIcon.category}
              </span>
            </div>
            <code className="text-xs text-slate-600 mt-0.5 block">
              &lt;i class=&quot;{selectedIcon.faClass}&quot; /&gt;
            </code>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => copyClass(`<i class="${selectedIcon.faClass}"></i>`, 'HTML')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer ${GRAD.light}`}
          >
            {copiedFlag ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy HTML</span>
          </button>
          <button
            type="button"
            onClick={() => copyClass(selectedIcon.faClass, 'Class Name')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs cursor-pointer transition-all active:scale-95 ${GRAD.primary}`}
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Class</span>
          </button>
        </div>
      </div>

      {/* Main Grid Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-5">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
          {/* Categories */}
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                'All',
                'UI & Navigation',
                'Communication',
                'Media & Files',
                'Commerce & Finance',
                'System & Security',
                'Arrows & Data',
              ] as const
            ).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  category === cat ? `${GRAD.primary} shadow-xs` : GRAD.light
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Style, Size & Search */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-0.5">
              {(['clean', 'gradient'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setBadgeStyle(st)}
                  className={`px-2.5 py-1 text-xs font-semibold capitalize rounded-lg cursor-pointer ${
                    badgeStyle === st ? `${GRAD.primaryStatic} shadow-xs` : 'text-slate-600'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-0.5">
              {(['sm', 'md', 'lg'] as const).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setIconSize(sz)}
                  className={`px-2.5 py-1 text-xs font-semibold uppercase rounded-lg cursor-pointer ${
                    iconSize === sz ? `${GRAD.primaryStatic} shadow-xs` : 'text-slate-600'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari fa-house, user..."
                className="pl-8 pr-3 py-1.5 w-48 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#175cd3]"
              />
            </div>
          </div>
        </div>

        {/* Icons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-8 gap-3">
          {filtered.map((item) => {
            const Icon = item.icon;
            const active = selectedIcon.faClass === item.faClass;
            return (
              <button
                key={item.faClass}
                type="button"
                onClick={() => {
                  setSelectedIcon(item);
                  copyClass(item.faClass, item.label);
                }}
                className={`group p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col items-center gap-2 text-center ${
                  active
                    ? 'border-[#175cd3] bg-blue-50/40 shadow-xs'
                    : 'border-slate-200/80 bg-white hover:border-[#175cd3]/60 hover:shadow-xs'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                    badgeStyle === 'gradient'
                      ? `${GRAD.primaryStatic} shadow-xs`
                      : 'bg-slate-50 text-slate-700 group-hover:text-[#175cd3]'
                  }`}
                >
                  <Icon className={sizeClass} />
                </div>
                <div className="w-full min-w-0">
                  <div className="text-[11px] font-semibold text-slate-800 truncate">{item.label}</div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {item.faClass.replace('fa-solid ', '')}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
