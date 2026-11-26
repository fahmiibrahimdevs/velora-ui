import React, { useState, useMemo } from 'react';
import {
  Search,
  Copy,
  Check,
  Home,
  Compass,
  Navigation,
  MapPin,
  Smartphone,
  Laptop,
  Tablet,
  Wifi,
  Bluetooth,
  Battery,
  Camera,
  Video,
  Music,
  Volume2,
  Mic,
  Heart,
  Star,
  Bell,
  Mail,
  Send,
  MessageSquare,
  ThumbsUp,
  Share2,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  Wind,
  Plane,
  Car,
  Rocket,
  Zap,
  Flame,
  Shield,
  Lock,
  Key,
  Settings,
  User,
  Users,
  Calendar,
  Clock,
  Bookmark,
  Tag,
  Download,
  Upload,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { showToast } from '../../lib/swal';

type IonCat = 'App & Nav' | 'Device & Hardware' | 'Media' | 'Social & Chat' | 'Weather & Travel';

interface IonDef {
  ionName: string;
  label: string;
  cat: IonCat;
  icon: React.ElementType;
}

const ION_LIST: IonDef[] = [
  { ionName: 'ion-ios-home', label: 'Home', cat: 'App & Nav', icon: Home },
  { ionName: 'ion-ios-compass', label: 'Compass', cat: 'App & Nav', icon: Compass },
  { ionName: 'ion-md-navigate', label: 'Navigate', cat: 'App & Nav', icon: Navigation },
  { ionName: 'ion-ios-pin', label: 'Location Pin', cat: 'App & Nav', icon: MapPin },
  { ionName: 'ion-ios-settings', label: 'Settings', cat: 'App & Nav', icon: Settings },
  { ionName: 'ion-ios-person', label: 'Person', cat: 'App & Nav', icon: User },
  { ionName: 'ion-ios-people', label: 'People', cat: 'App & Nav', icon: Users },
  { ionName: 'ion-ios-calendar', label: 'Calendar', cat: 'App & Nav', icon: Calendar },
  { ionName: 'ion-ios-time', label: 'Time', cat: 'App & Nav', icon: Clock },
  { ionName: 'ion-ios-bookmark', label: 'Bookmark', cat: 'App & Nav', icon: Bookmark },
  { ionName: 'ion-ios-pricetag', label: 'Tag', cat: 'App & Nav', icon: Tag },
  { ionName: 'ion-ios-add-circle', label: 'Add', cat: 'App & Nav', icon: Plus },
  { ionName: 'ion-ios-refresh', label: 'Refresh', cat: 'App & Nav', icon: RefreshCw },
  { ionName: 'ion-ios-lock', label: 'Lock', cat: 'App & Nav', icon: Lock },
  { ionName: 'ion-ios-key', label: 'Key', cat: 'App & Nav', icon: Key },
  { ionName: 'ion-ios-shield', label: 'Shield', cat: 'App & Nav', icon: Shield },

  { ionName: 'ion-ios-phone-portrait', label: 'Smartphone', cat: 'Device & Hardware', icon: Smartphone },
  { ionName: 'ion-ios-laptop', label: 'Laptop', cat: 'Device & Hardware', icon: Laptop },
  { ionName: 'ion-ios-tablet-portrait', label: 'Tablet', cat: 'Device & Hardware', icon: Tablet },
  { ionName: 'ion-ios-wifi', label: 'WiFi', cat: 'Device & Hardware', icon: Wifi },
  { ionName: 'ion-logo-bluetooth', label: 'Bluetooth', cat: 'Device & Hardware', icon: Bluetooth },
  { ionName: 'ion-ios-battery-full', label: 'Battery Full', cat: 'Device & Hardware', icon: Battery },
  { ionName: 'ion-ios-flash', label: 'Flash', cat: 'Device & Hardware', icon: Zap },
  { ionName: 'ion-ios-cloud-download', label: 'Download', cat: 'Device & Hardware', icon: Download },
  { ionName: 'ion-ios-cloud-upload', label: 'Upload', cat: 'Device & Hardware', icon: Upload },

  { ionName: 'ion-ios-camera', label: 'Camera', cat: 'Media', icon: Camera },
  { ionName: 'ion-ios-videocam', label: 'Videocam', cat: 'Media', icon: Video },
  { ionName: 'ion-ios-musical-notes', label: 'Music', cat: 'Media', icon: Music },
  { ionName: 'ion-ios-volume-high', label: 'Volume', cat: 'Media', icon: Volume2 },
  { ionName: 'ion-ios-mic', label: 'Microphone', cat: 'Media', icon: Mic },

  { ionName: 'ion-ios-heart', label: 'Heart', cat: 'Social & Chat', icon: Heart },
  { ionName: 'ion-ios-star', label: 'Star', cat: 'Social & Chat', icon: Star },
  { ionName: 'ion-ios-notifications', label: 'Notifications', cat: 'Social & Chat', icon: Bell },
  { ionName: 'ion-ios-mail', label: 'Mail', cat: 'Social & Chat', icon: Mail },
  { ionName: 'ion-ios-send', label: 'Send', cat: 'Social & Chat', icon: Send },
  { ionName: 'ion-ios-chatbubbles', label: 'Chat', cat: 'Social & Chat', icon: MessageSquare },
  { ionName: 'ion-ios-thumbs-up', label: 'Thumbs Up', cat: 'Social & Chat', icon: ThumbsUp },
  { ionName: 'ion-ios-share', label: 'Share', cat: 'Social & Chat', icon: Share2 },

  { ionName: 'ion-ios-sunny', label: 'Sunny', cat: 'Weather & Travel', icon: Sun },
  { ionName: 'ion-ios-moon', label: 'Moon', cat: 'Weather & Travel', icon: Moon },
  { ionName: 'ion-ios-cloud', label: 'Cloud', cat: 'Weather & Travel', icon: Cloud },
  { ionName: 'ion-ios-rainy', label: 'Rainy', cat: 'Weather & Travel', icon: CloudRain },
  { ionName: 'ion-ios-leaf', label: 'Wind', cat: 'Weather & Travel', icon: Wind },
  { ionName: 'ion-ios-airplane', label: 'Airplane', cat: 'Weather & Travel', icon: Plane },
  { ionName: 'ion-ios-car', label: 'Car', cat: 'Weather & Travel', icon: Car },
  { ionName: 'ion-ios-rocket', label: 'Rocket', cat: 'Weather & Travel', icon: Rocket },
  { ionName: 'ion-ios-flame', label: 'Flame', cat: 'Weather & Travel', icon: Flame },
];

const THEME_GRADIENTS = {
  Primary: 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white',
  Info: 'bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] text-white',
  Success: 'bg-gradient-to-r from-[#22c55e] to-[#15803d] text-white',
  Warning: 'bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white',
  Danger: 'bg-gradient-to-r from-[#ef4444] to-[#b91c1c] text-white',
  Dark: 'bg-gradient-to-r from-[#1e293b] to-[#020617] text-white',
};

type ThemeName = keyof typeof THEME_GRADIENTS;

const LIGHT_BTN = 'bg-gradient-to-r from-[#f8fafc] to-[#e2e8f0] text-slate-800 border border-slate-200/80';
const PRIMARY_BTN = 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white';

export function IonIconsView() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<'All' | IonCat>('All');
  const [variant, setVariant] = useState<'outline' | 'filled' | 'sharp'>('outline');
  const [themeColor, setThemeColor] = useState<ThemeName>('Primary');
  const [selected, setSelected] = useState<IonDef>(ION_LIST[0]);
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return ION_LIST.filter((item) => {
      if (category !== 'All' && item.cat !== category) return false;
      if (!q) return true;
      return item.label.toLowerCase().includes(q) || item.ionName.toLowerCase().includes(q);
    });
  }, [search, category]);

  const resolvedIonClass = (base: string) => {
    if (variant === 'outline' && base.startsWith('ion-ios-')) return `${base}-outline`;
    if (variant === 'sharp') return base.replace('ion-ios-', 'ion-md-');
    return base;
  };

  const handleCopy = async (ion: IonDef) => {
    const cls = resolvedIonClass(ion.ionName);
    setSelected(ion);
    try {
      await navigator.clipboard.writeText(`<i class="icon ${cls}"></i>`);
      setCopied(true);
      showToast(`Disalin: <i class="icon ${cls}"></i>`, 'success');
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      showToast(`Dipilih: ${cls}`, 'info');
    }
  };

  const ActiveIcon = selected.icon;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Sub-header */}
      <div className="flex items-start gap-3">
        <div className="w-8 h-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full mt-2 shrink-0" />
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Ion Icons</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Katalog Ionicons bergaya mobile-first dengan pengubah varian (Outline, Filled, Sharp) dan tema palet gradien Velora UI.
          </p>
        </div>
      </div>

      {/* Inspector Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs ${THEME_GRADIENTS[themeColor]}`}>
            <ActiveIcon
              className="w-6 h-6"
              strokeWidth={variant === 'outline' ? 1.75 : variant === 'sharp' ? 2.4 : 2}
              fill={variant === 'filled' ? 'currentColor' : 'none'}
            />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900">{selected.label}</div>
            <code className="text-xs text-slate-600 block mt-0.5">
              &lt;i class=&quot;icon {resolvedIonClass(selected.ionName)}&quot; /&gt;
            </code>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(Object.keys(THEME_GRADIENTS) as ThemeName[]).map((tName) => (
            <button
              key={tName}
              type="button"
              onClick={() => setThemeColor(tName)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer transition-all ${
                themeColor === tName ? `${THEME_GRADIENTS[tName]} ring-2 ring-offset-1 ring-slate-300` : LIGHT_BTN
              }`}
            >
              {tName}
            </button>
          ))}

          <button
            type="button"
            onClick={() => handleCopy(selected)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-xs cursor-pointer ${PRIMARY_BTN}`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy Tag</span>
          </button>
        </div>
      </div>

      {/* Grid Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {(['All', 'App & Nav', 'Device & Hardware', 'Media', 'Social & Chat', 'Weather & Travel'] as const).map(
              (c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                    category === c ? `${PRIMARY_BTN} shadow-xs` : LIGHT_BTN
                  }`}
                >
                  {c}
                </button>
              )
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-0.5">
              {(['outline', 'filled', 'sharp'] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setVariant(v)}
                  className={`px-2.5 py-1 text-xs font-semibold capitalize rounded-lg cursor-pointer ${
                    variant === v ? 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari ion-ios..."
                className="pl-8 pr-3 py-1.5 w-44 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#175cd3]"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-8 gap-3">
          {filtered.map((item) => {
            const Icon = item.icon;
            const active = selected.ionName === item.ionName;
            return (
              <button
                key={item.ionName}
                type="button"
                onClick={() => handleCopy(item)}
                className={`group p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col items-center gap-2 text-center ${
                  active
                    ? 'border-[#175cd3] bg-blue-50/40 shadow-xs'
                    : 'border-slate-200/80 bg-white hover:border-[#175cd3]/60 hover:shadow-xs'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                    active ? `${THEME_GRADIENTS[themeColor]} shadow-xs` : 'bg-slate-50 text-slate-700'
                  }`}
                >
                  <Icon
                    className="w-5 h-5"
                    strokeWidth={variant === 'outline' ? 1.75 : variant === 'sharp' ? 2.4 : 1.9}
                    fill={variant === 'filled' ? 'currentColor' : 'none'}
                  />
                </div>
                <div className="w-full min-w-0">
                  <div className="text-[11px] font-semibold text-slate-800 truncate">{item.label}</div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {resolvedIonClass(item.ionName)}
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
