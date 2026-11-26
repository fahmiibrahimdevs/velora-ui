import { useState, useMemo, useRef } from 'react';
import {
  Globe,
  MapPin,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  Activity,
  Server,
  Copy,
  Check,
  Search,
  Navigation,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import worldMapRaw from './maps/worldMapData.json';
import indonesiaMapRaw from './maps/indonesiaMapData.json';
import { showToast } from '../../lib/swal';

interface MapLocation {
  id: string;
  name: string;
  path: string;
}

interface SvgMapDataset {
  label: string;
  viewBox: string;
  locations: MapLocation[];
}

const worldMap = worldMapRaw as SvgMapDataset;
const indonesiaMap = indonesiaMapRaw as SvgMapDataset;

const GRAD = {
  primary: 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white',
  primaryStatic: 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white',
  secondary: 'bg-gradient-to-r from-[#cbd5e1] to-[#94a3b8] hover:from-[#94a3b8] hover:to-[#64748b] text-white',
  info: 'bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] hover:from-[#0284c7] hover:to-[#0369a1] text-white',
  warning: 'bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:from-[#ea580c] hover:to-[#b45309] text-white',
  danger: 'bg-gradient-to-r from-[#ef4444] to-[#b91c1c] hover:from-[#dc2626] hover:to-[#991b1b] text-white',
  success: 'bg-gradient-to-r from-[#22c55e] to-[#15803d] hover:from-[#16a34a] hover:to-[#166534] text-white',
  light: 'bg-gradient-to-r from-[#f8fafc] to-[#e2e8f0] text-slate-800 border border-slate-200/80',
  dark: 'bg-gradient-to-r from-[#1e293b] to-[#020617] hover:from-[#0f172a] hover:to-[#000000] text-white',
};

type MapDatasetKey = 'world' | 'indonesia';
type VisualMode = 'choropleth' | 'markers' | 'minimal';
type CanvasTheme = 'executive' | 'oceanic' | 'dark';
type PaletteKey = 'blue' | 'emerald' | 'amber' | 'rose';
type BranchFilter = 'all' | 'hub' | 'regional' | 'branch';

interface RegionMetric {
  users: number;
  revenue: string;
  growth: string;
  latency: number;
  status: 'Optimal' | 'Normal' | 'High Load';
  city: string;
}

interface MapPinItem {
  id: string;
  name: string;
  regionId: string;
  x: number;
  y: number;
  type: 'hub' | 'regional' | 'branch';
  users: string;
  latency: string;
}

interface FlightArc {
  from: string;
  to: string;
}

const PALETTES: Record<PaletteKey, { label: string; stops: [string, string, string, string]; accent: string }> = {
  blue: {
    label: 'Royal Blue',
    stops: ['#dbeafe', '#93c5fd', '#3b82f6', '#175cd3'],
    accent: '#0f3ba0',
  },
  emerald: {
    label: 'Emerald',
    stops: ['#dcfce7', '#86efac', '#22c55e', '#15803d'],
    accent: '#166534',
  },
  amber: {
    label: 'Amber',
    stops: ['#fef3c7', '#fcd34d', '#f59e0b', '#d97706'],
    accent: '#b45309',
  },
  rose: {
    label: 'Crimson',
    stops: ['#fee2e2', '#fca5a5', '#ef4444', '#b91c1c'],
    accent: '#991b1b',
  },
};

const WORLD_METRICS: Record<string, RegionMetric> = {
  id: { users: 84200, revenue: '$412.8K', growth: '+24.6%', latency: 14, status: 'Optimal', city: 'Jakarta' },
  us: { users: 79400, revenue: '$589.2K', growth: '+18.2%', latency: 42, status: 'Optimal', city: 'New York' },
  sg: { users: 63500, revenue: '$348.5K', growth: '+21.4%', latency: 9, status: 'Optimal', city: 'Singapore' },
  jp: { users: 54100, revenue: '$294.0K', growth: '+15.8%', latency: 26, status: 'Optimal', city: 'Tokyo' },
  de: { users: 46800, revenue: '$241.3K', growth: '+12.4%', latency: 38, status: 'Normal', city: 'Frankfurt' },
  gb: { users: 41200, revenue: '$218.7K', growth: '+11.9%', latency: 41, status: 'Normal', city: 'London' },
  au: { users: 36900, revenue: '$184.2K', growth: '+14.1%', latency: 33, status: 'Normal', city: 'Sydney' },
  cn: { users: 52300, revenue: '$267.9K', growth: '+16.5%', latency: 49, status: 'High Load', city: 'Shanghai' },
  in: { users: 48600, revenue: '$196.4K', growth: '+29.3%', latency: 36, status: 'High Load', city: 'Mumbai' },
  kr: { users: 32400, revenue: '$172.0K', growth: '+13.7%', latency: 24, status: 'Optimal', city: 'Seoul' },
  my: { users: 29800, revenue: '$138.6K', growth: '+19.4%', latency: 16, status: 'Optimal', city: 'Kuala Lumpur' },
  br: { users: 26500, revenue: '$121.5K', growth: '+10.8%', latency: 64, status: 'High Load', city: 'São Paulo' },
  ca: { users: 28100, revenue: '$164.0K', growth: '+9.6%', latency: 45, status: 'Normal', city: 'Toronto' },
  fr: { users: 25400, revenue: '$149.2K', growth: '+8.4%', latency: 39, status: 'Normal', city: 'Paris' },
  nl: { users: 23900, revenue: '$142.8K', growth: '+12.1%', latency: 35, status: 'Optimal', city: 'Amsterdam' },
  ae: { users: 21700, revenue: '$156.3K', growth: '+22.0%', latency: 29, status: 'Optimal', city: 'Dubai' },
  sa: { users: 18400, revenue: '$118.4K', growth: '+17.2%', latency: 34, status: 'Normal', city: 'Riyadh' },
  ru: { users: 19200, revenue: '$98.0K', growth: '+5.1%', latency: 58, status: 'High Load', city: 'Moscow' },
  za: { users: 14800, revenue: '$74.5K', growth: '+11.3%', latency: 72, status: 'High Load', city: 'Johannesburg' },
};

const IDN_METRICS: Record<string, RegionMetric> = {
  'id-jk': { users: 46800, revenue: 'Rp 2,84 M', growth: '+28.4%', latency: 8, status: 'Optimal', city: 'Jakarta Pusat' },
  'id-jb': { users: 34200, revenue: 'Rp 1,92 M', growth: '+21.5%', latency: 11, status: 'Optimal', city: 'Bandung' },
  'id-ji': { users: 29500, revenue: 'Rp 1,64 M', growth: '+19.8%', latency: 15, status: 'Optimal', city: 'Surabaya' },
  'id-jt': { users: 22100, revenue: 'Rp 1,18 M', growth: '+16.4%', latency: 16, status: 'Normal', city: 'Semarang' },
  'id-bt': { users: 18900, revenue: 'Rp 1,04 M', growth: '+20.1%', latency: 10, status: 'Optimal', city: 'Tangerang' },
  'id-ba': { users: 16400, revenue: 'Rp 980 Jt', growth: '+25.6%', latency: 18, status: 'Optimal', city: 'Denpasar' },
  'id-su': { users: 15800, revenue: 'Rp 890 Jt', growth: '+14.7%', latency: 22, status: 'Normal', city: 'Medan' },
  'id-yo': { users: 14200, revenue: 'Rp 760 Jt', growth: '+18.9%', latency: 14, status: 'Optimal', city: 'Yogyakarta' },
  'id-sn': { users: 12900, revenue: 'Rp 710 Jt', growth: '+17.2%', latency: 26, status: 'Normal', city: 'Makassar' },
  'id-ki': { users: 11600, revenue: 'Rp 685 Jt', growth: '+31.4%', latency: 24, status: 'Optimal', city: 'Balikpapan' },
  'id-ss': { users: 10400, revenue: 'Rp 590 Jt', growth: '+13.2%', latency: 21, status: 'Normal', city: 'Palembang' },
  'id-ri': { users: 9800, revenue: 'Rp 540 Jt', growth: '+15.1%', latency: 20, status: 'Normal', city: 'Pekanbaru' },
  'id-pa': { users: 6200, revenue: 'Rp 340 Jt', growth: '+22.8%', latency: 44, status: 'High Load', city: 'Jayapura' },
};

const WORLD_PINS: MapPinItem[] = [
  { id: 'pin-jkt', name: 'Jakarta Core DC', regionId: 'id', x: 810.2, y: 471.3, type: 'hub', users: '84.2K', latency: '14ms' },
  { id: 'pin-sgp', name: 'Singapore Edge', regionId: 'sg', x: 766.4, y: 459.1, type: 'hub', users: '63.5K', latency: '9ms' },
  { id: 'pin-tyo', name: 'Tokyo Cloud', regionId: 'jp', x: 854.6, y: 356.4, type: 'hub', users: '54.1K', latency: '26ms' },
  { id: 'pin-fra', name: 'Frankfurt EU', regionId: 'de', x: 504.2, y: 295.7, type: 'regional', users: '46.8K', latency: '38ms' },
  { id: 'pin-lon', name: 'London Gateway', regionId: 'gb', x: 463.3, y: 274.9, type: 'branch', users: '41.2K', latency: '41ms' },
  { id: 'pin-nyc', name: 'US East Hub', regionId: 'us', x: 195.0, y: 298.0, type: 'hub', users: '79.4K', latency: '42ms' },
  { id: 'pin-syd', name: 'Sydney ANZ', regionId: 'au', x: 859.4, y: 537.3, type: 'regional', users: '36.9K', latency: '33ms' },
  { id: 'pin-dxb', name: 'Dubai MENA', regionId: 'ae', x: 627.5, y: 393.1, type: 'branch', users: '21.7K', latency: '29ms' },
  { id: 'pin-sao', name: 'São Paulo POP', regionId: 'br', x: 319.8, y: 491.1, type: 'branch', users: '26.5K', latency: '64ms' },
];

const WORLD_ARCS: FlightArc[] = [
  { from: 'pin-jkt', to: 'pin-sgp' },
  { from: 'pin-sgp', to: 'pin-tyo' },
  { from: 'pin-sgp', to: 'pin-syd' },
  { from: 'pin-sgp', to: 'pin-dxb' },
  { from: 'pin-dxb', to: 'pin-fra' },
  { from: 'pin-fra', to: 'pin-lon' },
  { from: 'pin-lon', to: 'pin-nyc' },
];

const IDN_PINS: MapPinItem[] = [
  { id: 'id-pin-jkt', name: 'Jakarta HQ', regionId: 'id-jk', x: 188.7, y: 237.0, type: 'hub', users: '46.8K', latency: '8ms' },
  { id: 'id-pin-bdg', name: 'Bandung Tech', regionId: 'id-jb', x: 215.4, y: 244.5, type: 'regional', users: '34.2K', latency: '11ms' },
  { id: 'id-pin-smg', name: 'Semarang Node', regionId: 'id-jt', x: 259.9, y: 253.3, type: 'branch', users: '22.1K', latency: '16ms' },
  { id: 'id-pin-sby', name: 'Surabaya Hub', regionId: 'id-ji', x: 311.1, y: 257.6, type: 'hub', users: '29.5K', latency: '15ms' },
  { id: 'id-pin-dps', name: 'Denpasar Edge', regionId: 'id-ba', x: 345.4, y: 273.6, type: 'branch', users: '16.4K', latency: '18ms' },
  { id: 'id-pin-mdn', name: 'Medan Regional', regionId: 'id-su', x: 61.1, y: 99.2, type: 'regional', users: '15.8K', latency: '22ms' },
  { id: 'id-pin-bpn', name: 'Balikpapan IKN', regionId: 'id-ki', x: 358.6, y: 123.5, type: 'regional', users: '11.6K', latency: '24ms' },
  { id: 'id-pin-mks', name: 'Makassar Timur', regionId: 'id-sn', x: 434.9, y: 194.0, type: 'regional', users: '12.9K', latency: '26ms' },
  { id: 'id-pin-dj', name: 'Jayapura POP', regionId: 'id-pa', x: 734.3, y: 207.7, type: 'branch', users: '6.2K', latency: '44ms' },
];

const IDN_ARCS: FlightArc[] = [
  { from: 'id-pin-jkt', to: 'id-pin-mdn' },
  { from: 'id-pin-jkt', to: 'id-pin-bdg' },
  { from: 'id-pin-jkt', to: 'id-pin-sby' },
  { from: 'id-pin-sby', to: 'id-pin-dps' },
  { from: 'id-pin-sby', to: 'id-pin-bpn' },
  { from: 'id-pin-sby', to: 'id-pin-mks' },
  { from: 'id-pin-mks', to: 'id-pin-dj' },
];

const WORLD_PRESETS = [
  { id: 'global', label: 'Global View', scale: 1, tx: 0, ty: 0 },
  { id: 'asia', label: 'Asia Pasifik', scale: 2.2, tx: -360, ty: -140 },
  { id: 'europe', label: 'Eropa', scale: 2.9, tx: -305, ty: -90 },
  { id: 'americas', label: 'Amerika', scale: 1.8, tx: -10, ty: -60 },
];

const IDN_PRESETS = [
  { id: 'all', label: 'Nusantara', scale: 1, tx: 0, ty: 0 },
  { id: 'java', label: 'Jawa & Bali', scale: 2.8, tx: -135, ty: -165 },
  { id: 'sumatra', label: 'Sumatera', scale: 2.3, tx: 10, ty: -18 },
  { id: 'east', label: 'Kalimantan & Timur', scale: 1.9, tx: -260, ty: -35 },
];

function deterministicMetric(id: string): RegionMetric {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) % 10000;
  }
  const users = 2500 + (hash % 18000);
  return {
    users,
    revenue: `$${(users * 0.0042).toFixed(1)}K`,
    growth: `+${(4.2 + (hash % 140) / 10).toFixed(1)}%`,
    latency: 28 + (hash % 55),
    status: users > 14000 ? 'Normal' : 'Optimal',
    city: 'Regional POP',
  };
}

function getArcPath(x1: number, y1: number, x2: number, y2: number): string {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dist = Math.hypot(x2 - x1, y2 - y1);
  const lift = Math.min(75, Math.max(16, dist * 0.22));
  return `M ${x1} ${y1} Q ${mx} ${my - lift} ${x2} ${y2}`;
}

export function VectorMapView() {
  const [datasetKey, setDatasetKey] = useState<MapDatasetKey>('world');
  const [visualMode, setVisualMode] = useState<VisualMode>('choropleth');
  const [canvasTheme, setCanvasTheme] = useState<CanvasTheme>('executive');
  const [paletteKey, setPaletteKey] = useState<PaletteKey>('blue');
  const [showPins, setShowPins] = useState(true);
  const [showArcs, setShowArcs] = useState(true);
  const [showGrid, setShowGrid] = useState(true);

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [activePreset, setActivePreset] = useState('global');
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);

  const [selectedId, setSelectedId] = useState<string>('id');
  const [hoveredLoc, setHoveredLoc] = useState<{ id: string; name: string; x: number; y: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Branch mini map controls
  const [branchFilter, setBranchFilter] = useState<BranchFilter>('all');
  const [selectedProvId, setSelectedProvId] = useState<string>('id-jk');

  const currentMap = datasetKey === 'world' ? worldMap : indonesiaMap;
  const metricsMap = datasetKey === 'world' ? WORLD_METRICS : IDN_METRICS;
  const pins = datasetKey === 'world' ? WORLD_PINS : IDN_PINS;
  const arcs = datasetKey === 'world' ? WORLD_ARCS : IDN_ARCS;
  const presets = datasetKey === 'world' ? WORLD_PRESETS : IDN_PRESETS;
  const palette = PALETTES[paletteKey];

  const getMetric = (id: string): RegionMetric => metricsMap[id] ?? deterministicMetric(id);

  const selectedLoc = useMemo(
    () => currentMap.locations.find((l) => l.id === selectedId) ?? currentMap.locations[0],
    [currentMap, selectedId]
  );

  const selectedMetric = getMetric(selectedLoc.id);

  const switchDataset = (next: MapDatasetKey) => {
    setDatasetKey(next);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setActivePreset(next === 'world' ? 'global' : 'all');
    setSelectedId(next === 'world' ? 'id' : 'id-jk');
    setHoveredLoc(null);
  };

  const applyPreset = (presetId: string) => {
    const found = presets.find((p) => p.id === presetId);
    if (!found) return;
    setActivePreset(presetId);
    setZoom(found.scale);
    setPan({ x: found.tx, y: found.ty });
  };

  const getFillColor = (locId: string): string => {
    const isSelected = selectedLoc.id === locId;
    const isHovered = hoveredLoc?.id === locId;
    if (isSelected) return palette.accent;
    if (isHovered) return palette.stops[2];

    if (visualMode === 'minimal') {
      return canvasTheme === 'dark' ? '#1e293b' : '#f1f5f9';
    }

    const custom = metricsMap[locId];
    if (!custom) {
      return canvasTheme === 'dark' ? '#1e293b' : '#e2e8f0';
    }

    const maxUsers = datasetKey === 'world' ? 85000 : 47000;
    const ratio = custom.users / maxUsers;
    if (ratio >= 0.72) return palette.stops[3];
    if (ratio >= 0.48) return palette.stops[2];
    if (ratio >= 0.25) return palette.stops[1];
    return palette.stops[0];
  };

  const topRegions = useMemo(() => {
    const entries = Object.entries(metricsMap)
      .map(([id, m]) => {
        const loc = currentMap.locations.find((l) => l.id === id);
        return {
          id,
          name: loc?.name ?? id.toUpperCase(),
          ...m,
        };
      })
      .sort((a, b) => b.users - a.users);

    if (!searchQuery.trim()) return entries.slice(0, 7);
    const q = searchQuery.toLowerCase();
    return entries.filter((e) => e.name.toLowerCase().includes(q) || e.city.toLowerCase().includes(q));
  }, [metricsMap, currentMap.locations, searchQuery]);

  const filteredIdnPins = useMemo(() => {
    if (branchFilter === 'all') return IDN_PINS;
    return IDN_PINS.filter((p) => p.type === branchFilter);
  }, [branchFilter]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(label);
    showToast(`${label} disalin ke clipboard`, 'success');
    setTimeout(() => setCopiedId(null), 1600);
  };

  const mapSurfaceClass =
    canvasTheme === 'dark'
      ? 'bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#020617] border-slate-800'
      : canvasTheme === 'oceanic'
        ? 'bg-gradient-to-br from-[#eff6ff] via-[#e0f2fe] to-[#f8fafc] border-sky-200/80'
        : 'bg-white border-slate-200';

  const strokeColor = canvasTheme === 'dark' ? '#334155' : '#ffffff';

  const generatedSnippet = `<VectorMap
  dataset="${datasetKey}"
  mode="${visualMode}"
  theme="${canvasTheme}"
  palette="${paletteKey}"
  showMarkers={${showPins}}
  showConnections={${showArcs}}
  showGrid={${showGrid}}
  selectedRegion="${selectedLoc.id}"
/>`;

  const [, , vbW, vbH] = currentMap.viewBox.split(' ').map(Number);

  return (
    <div className="space-y-6">
      <style>{`
        @keyframes vm-dash-flow {
          to { stroke-dashoffset: -24; }
        }
        @keyframes vm-ping-slow {
          0% { transform: scale(1); opacity: 0.75; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        .vm-arc-animated {
          stroke-dasharray: 5 5;
          animation: vm-dash-flow 1.4s linear infinite;
        }
        .vm-pin-pulse {
          transform-box: fill-box;
          transform-origin: center;
          animation: vm-ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>

      {/* 1. HERO INTERACTIVE VECTOR MAP EXPLORER */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-5">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${GRAD.primaryStatic}`}>
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">1. Interactive Vector Map Studio</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${GRAD.info}`}>
                  {currentMap.locations.length} Regions SVG
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Peta vektor SVG interaktif penuh untuk skala Global (256 negara) & Indonesia (34 provinsi) dengan pan/zoom, choropleth, dan live data nodes.
              </p>
            </div>
          </div>

          {/* Dataset & Visual Mode Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
              {(
                [
                  { id: 'world', label: 'World Map' },
                  { id: 'indonesia', label: 'Indonesia (34)' },
                ] as const
              ).map((ds) => (
                <button
                  key={ds.id}
                  type="button"
                  onClick={() => switchDataset(ds.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    datasetKey === ds.id ? `${GRAD.primaryStatic} shadow-xs` : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {ds.label}
                </button>
              ))}
            </div>

            <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
              {(
                [
                  { id: 'choropleth', label: 'Choropleth' },
                  { id: 'markers', label: 'Pins & Nodes' },
                  { id: 'minimal', label: 'Minimal' },
                ] as const
              ).map((md) => (
                <button
                  key={md.id}
                  type="button"
                  onClick={() => setVisualMode(md.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    visualMode === md.id ? `${GRAD.primaryStatic} shadow-xs` : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {md.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filter & Theme Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Region Focus Presets */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-600 mr-1 flex items-center gap-1">
              <Navigation className="w-3.5 h-3.5 text-[#175cd3]" /> Fokus:
            </span>
            {presets.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => applyPreset(p.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  activePreset === p.id ? `${GRAD.primary} shadow-xs` : GRAD.light
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Canvas Theme & Palette Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
              {(
                [
                  { id: 'executive', label: 'Executive' },
                  { id: 'oceanic', label: 'Oceanic' },
                  { id: 'dark', label: 'Dark NOC' },
                ] as const
              ).map((tm) => (
                <button
                  key={tm.id}
                  type="button"
                  onClick={() => setCanvasTheme(tm.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    canvasTheme === tm.id ? `${GRAD.primaryStatic} shadow-xs` : 'text-slate-600'
                  }`}
                >
                  {tm.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 pl-1">
              {(Object.keys(PALETTES) as PaletteKey[]).map((pk) => (
                <button
                  key={pk}
                  type="button"
                  onClick={() => setPaletteKey(pk)}
                  title={PALETTES[pk].label}
                  className={`w-6 h-6 rounded-full cursor-pointer transition-transform border-2 ${
                    paletteKey === pk ? 'border-slate-900 scale-110 shadow-xs' : 'border-white shadow-xs opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: PALETTES[pk].stops[3] }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Map Canvas + Right Region Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Interactive SVG Map Canvas */}
          <div className="lg:col-span-8 flex flex-col">
            <div
              className={`relative rounded-2xl border overflow-hidden select-none flex-1 min-h-[380px] ${mapSurfaceClass} ${
                isDragging ? 'cursor-grabbing' : 'cursor-grab'
              }`}
              onMouseDown={(e) => {
                setIsDragging(true);
                dragStartRef.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
              }}
              onMouseMove={(e) => {
                if (!isDragging || !dragStartRef.current) return;
                const dx = (e.clientX - dragStartRef.current.x) / zoom;
                const dy = (e.clientY - dragStartRef.current.y) / zoom;
                setPan({ x: dragStartRef.current.panX + dx, y: dragStartRef.current.panY + dy });
              }}
              onMouseUp={() => {
                setIsDragging(false);
                dragStartRef.current = null;
              }}
              onMouseLeave={() => {
                setIsDragging(false);
                dragStartRef.current = null;
                setHoveredLoc(null);
              }}
            >
              {/* Floating Zoom Controls */}
              <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(4.5, +(z + 0.4).toFixed(1)))}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-sm cursor-pointer ${GRAD.light}`}
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(1, +(z - 0.4).toFixed(1)))}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-sm cursor-pointer ${GRAD.light}`}
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset(datasetKey === 'world' ? 'global' : 'all')}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-sm cursor-pointer ${GRAD.primary}`}
                  title="Reset View"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Layer Toggle Chips (Top Left) */}
              <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setShowPins((v) => !v)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold shadow-xs cursor-pointer flex items-center gap-1 ${
                    showPins ? GRAD.primary : GRAD.light
                  }`}
                >
                  <MapPin className="w-3 h-3" /> Pins
                </button>
                <button
                  type="button"
                  onClick={() => setShowArcs((v) => !v)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold shadow-xs cursor-pointer flex items-center gap-1 ${
                    showArcs ? GRAD.info : GRAD.light
                  }`}
                >
                  <Activity className="w-3 h-3" /> Routes
                </button>
                <button
                  type="button"
                  onClick={() => setShowGrid((v) => !v)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold shadow-xs cursor-pointer flex items-center gap-1 ${
                    showGrid ? GRAD.dark : GRAD.light
                  }`}
                >
                  <Layers className="w-3 h-3" /> Grid
                </button>
              </div>

              {/* Hover Tooltip */}
              {hoveredLoc && !isDragging && (
                <div
                  className="pointer-events-none absolute z-30 bg-slate-900/95 text-white px-3 py-2 rounded-xl shadow-lg border border-slate-700/80 text-xs min-w-[155px]"
                  style={{
                    left: Math.min(hoveredLoc.x + 14, 480),
                    top: Math.max(hoveredLoc.y - 60, 12),
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-white">{hoveredLoc.name}</span>
                    <span className="px-1.5 py-0.5 rounded bg-white/15 text-[10px] uppercase font-mono">
                      {hoveredLoc.id}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-slate-300">
                    <span>Traffic</span>
                    <span className="font-semibold text-sky-300">
                      {getMetric(hoveredLoc.id).users.toLocaleString()} users
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-300">
                    <span>Latency</span>
                    <span className="font-semibold text-emerald-300">{getMetric(hoveredLoc.id).latency} ms</span>
                  </div>
                </div>
              )}

              {/* SVG Viewport */}
              <svg
                viewBox={currentMap.viewBox}
                className="w-full h-full min-h-[380px] transition-transform duration-150"
                aria-label={currentMap.label}
              >
                <g transform={`scale(${zoom}) translate(${pan.x}, ${pan.y})`}>
                  {/* Optional Subtle Map Graticule Grid */}
                  {showGrid && (
                    <g
                      stroke={canvasTheme === 'dark' ? 'rgba(148,163,184,0.12)' : 'rgba(15,59,160,0.06)'}
                      strokeWidth={0.6 / zoom}
                      strokeDasharray="3 3"
                    >
                      {[0.2, 0.4, 0.6, 0.8].map((r) => (
                        <line key={`h-${r}`} x1={0} y1={vbH * r} x2={vbW} y2={vbH * r} />
                      ))}
                      {[0.2, 0.4, 0.6, 0.8].map((r) => (
                        <line key={`v-${r}`} x1={vbW * r} y1={0} x2={vbW * r} y2={vbH} />
                      ))}
                    </g>
                  )}

                  {/* Region Polygons */}
                  {currentMap.locations.map((loc) => (
                    <path
                      key={loc.id}
                      d={loc.path}
                      fill={getFillColor(loc.id)}
                      stroke={strokeColor}
                      strokeWidth={(selectedLoc.id === loc.id ? 1.2 : 0.55) / zoom}
                      className="transition-colors duration-150 cursor-pointer"
                      onMouseMove={(e) => {
                        const container = e.currentTarget.ownerSVGElement?.parentElement;
                        if (!container) return;
                        const rect = container.getBoundingClientRect();
                        setHoveredLoc({
                          id: loc.id,
                          name: loc.name,
                          x: e.clientX - rect.left,
                          y: e.clientY - rect.top,
                        });
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedId(loc.id);
                      }}
                    />
                  ))}

                  {/* Flight / Network Connection Arcs */}
                  {showArcs &&
                    arcs.map((arc) => {
                      const fromPin = pins.find((p) => p.id === arc.from);
                      const toPin = pins.find((p) => p.id === arc.to);
                      if (!fromPin || !toPin) return null;
                      return (
                        <path
                          key={`${arc.from}-${arc.to}`}
                          d={getArcPath(fromPin.x, fromPin.y, toPin.x, toPin.y)}
                          fill="none"
                          stroke={canvasTheme === 'dark' ? '#38bdf8' : palette.stops[3]}
                          strokeWidth={1.6 / zoom}
                          strokeOpacity={0.78}
                          className="vm-arc-animated pointer-events-none"
                        />
                      );
                    })}

                  {/* Pulsing Marker Pins */}
                  {showPins &&
                    pins.map((pin) => {
                      const isSel = selectedLoc.id === pin.regionId;
                      const pinColor =
                        pin.type === 'hub'
                          ? '#ef4444'
                          : pin.type === 'regional'
                            ? '#f59e0b'
                            : '#0ea5e9';
                      return (
                        <g
                          key={pin.id}
                          className="cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedId(pin.regionId);
                          }}
                          onMouseMove={(e) => {
                            const container = e.currentTarget.ownerSVGElement?.parentElement;
                            if (!container) return;
                            const rect = container.getBoundingClientRect();
                            setHoveredLoc({
                              id: pin.regionId,
                              name: pin.name,
                              x: e.clientX - rect.left,
                              y: e.clientY - rect.top,
                            });
                          }}
                        >
                          <circle
                            cx={pin.x}
                            cy={pin.y}
                            r={(isSel ? 7 : 5) / zoom}
                            fill={pinColor}
                            className="vm-pin-pulse"
                          />
                          <circle
                            cx={pin.x}
                            cy={pin.y}
                            r={(isSel ? 4.8 : 3.6) / zoom}
                            fill={pinColor}
                            stroke="#ffffff"
                            strokeWidth={1.3 / zoom}
                          />
                          {zoom >= 1.4 && (
                            <text
                              x={pin.x + 6 / zoom}
                              y={pin.y + 3 / zoom}
                              fontSize={9 / zoom}
                              fontWeight={600}
                              fill={canvasTheme === 'dark' ? '#f8fafc' : '#0f172a'}
                              className="pointer-events-none"
                            >
                              {pin.name}
                            </text>
                          )}
                        </g>
                      );
                    })}
                </g>
              </svg>

              {/* Bottom Legend Strip */}
              <div
                className={`absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 rounded-xl border text-[11px] backdrop-blur-xs ${
                  canvasTheme === 'dark'
                    ? 'bg-slate-900/80 border-slate-700 text-slate-200'
                    : 'bg-white/90 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Traffic Intensity:</span>
                  <div className="flex items-center gap-1">
                    <span>Low</span>
                    {palette.stops.map((c) => (
                      <span key={c} className="w-4 h-2.5 rounded-xs inline-block" style={{ backgroundColor: c }} />
                    ))}
                    <span>Peak</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#ef4444]" /> Core Hub
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#f59e0b]" /> Regional
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#0ea5e9]" /> Edge POP
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Region Inspector Card */}
          <div className="lg:col-span-4 rounded-2xl border border-slate-200/90 bg-white p-5 flex flex-col justify-between gap-4">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${GRAD.primaryStatic}`}>
                    Region Inspector
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1.5">{selectedLoc.name}</h3>
                  <p className="text-xs text-slate-600">
                    Node: <span className="font-semibold text-slate-800">{selectedMetric.city}</span> · Code:{' '}
                    <code className="text-[11px] bg-slate-100 px-1.5 py-0.5 rounded text-[#175cd3] font-semibold">
                      {selectedLoc.id.toUpperCase()}
                    </code>
                  </p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold ${
                    selectedMetric.status === 'Optimal'
                      ? GRAD.success
                      : selectedMetric.status === 'Normal'
                        ? GRAD.info
                        : GRAD.warning
                  }`}
                >
                  {selectedMetric.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border border-slate-200/80 bg-white">
                  <div className="text-[11px] text-slate-600">Active Users</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">
                    {selectedMetric.users.toLocaleString()}
                  </div>
                </div>
                <div className="p-3 rounded-xl border border-slate-200/80 bg-white">
                  <div className="text-[11px] text-slate-600">Est. Revenue</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">{selectedMetric.revenue}</div>
                </div>
                <div className="p-3 rounded-xl border border-slate-200/80 bg-white">
                  <div className="text-[11px] text-slate-600">MoM Growth</div>
                  <div className="text-sm font-bold text-emerald-600 mt-0.5 flex items-center gap-1">
                    {selectedMetric.growth} <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="p-3 rounded-xl border border-slate-200/80 bg-white">
                  <div className="text-[11px] text-slate-600">Avg Latency</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{selectedMetric.latency} ms</div>
                </div>
              </div>

              {/* Quick Switch Top Nodes */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-700">Quick Focus Wilayah</div>
                <div className="flex flex-wrap gap-1.5">
                  {(datasetKey === 'world'
                    ? ['id', 'sg', 'jp', 'us', 'de', 'au']
                    : ['id-jk', 'id-jb', 'id-ji', 'id-ba', 'id-su', 'id-ki']
                  ).map((code) => {
                    const found = currentMap.locations.find((l) => l.id === code);
                    if (!found) return null;
                    const active = selectedLoc.id === code;
                    return (
                      <button
                        key={code}
                        type="button"
                        onClick={() => setSelectedId(code)}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold cursor-pointer transition-all ${
                          active ? GRAD.primary : GRAD.light
                        }`}
                      >
                        {found.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleCopy(selectedLoc.id, 'Region ID')}
                className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer ${GRAD.light}`}
              >
                {copiedId === 'Region ID' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Region ID</span>
              </button>
              <button
                type="button"
                onClick={() => handleCopy(generatedSnippet, 'JSX Snippet')}
                className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold shadow-xs cursor-pointer ${GRAD.primary}`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Copy Config</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SPLIT MAP SHOWCASE: INDONESIA BRANCH NETWORK & TOP REGIONAL LEADERBOARD */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left: Indonesia Branch Distribution Variation */}
        <div className="xl:col-span-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">2. Jaringan Cabang Nusantara (34 Provinsi)</h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${GRAD.success}`}>Live Sync</span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Variasi peta khusus Indonesia dengan filter status infrastruktur & inspeksi provinsi.
              </p>
            </div>

            <div className="flex flex-wrap gap-1">
              {(
                [
                  { id: 'all', label: 'Semua' },
                  { id: 'hub', label: 'Hub' },
                  { id: 'regional', label: 'Regional' },
                  { id: 'branch', label: 'Cabang' },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setBranchFilter(f.id)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold cursor-pointer ${
                    branchFilter === f.id ? GRAD.primary : GRAD.light
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-3">
            <svg viewBox={indonesiaMap.viewBox} className="w-full h-56" aria-label="Indonesia Branch Map">
              {indonesiaMap.locations.map((loc) => {
                const active = selectedProvId === loc.id;
                const hasMetric = Boolean(IDN_METRICS[loc.id]);
                return (
                  <path
                    key={loc.id}
                    d={loc.path}
                    fill={active ? '#175cd3' : hasMetric ? '#93c5fd' : '#e2e8f0'}
                    stroke="#ffffff"
                    strokeWidth={0.7}
                    className="cursor-pointer transition-colors hover:fill-[#3b82f6]"
                    onClick={() => setSelectedProvId(loc.id)}
                  >
                    <title>{loc.name}</title>
                  </path>
                );
              })}

              {IDN_ARCS.map((arc) => {
                const a = IDN_PINS.find((p) => p.id === arc.from);
                const b = IDN_PINS.find((p) => p.id === arc.to);
                if (!a || !b) return null;
                return (
                  <path
                    key={`${arc.from}-${arc.to}`}
                    d={getArcPath(a.x, a.y, b.x, b.y)}
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth={1.3}
                    strokeOpacity={0.65}
                    className="vm-arc-animated pointer-events-none"
                  />
                );
              })}

              {filteredIdnPins.map((pin) => {
                const color = pin.type === 'hub' ? '#ef4444' : pin.type === 'regional' ? '#f59e0b' : '#22c55e';
                return (
                  <g
                    key={pin.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedProvId(pin.regionId)}
                  >
                    <circle cx={pin.x} cy={pin.y} r={5} fill={color} className="vm-pin-pulse" />
                    <circle cx={pin.x} cy={pin.y} r={4} fill={color} stroke="#fff" strokeWidth={1.2} />
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {filteredIdnPins.slice(0, 6).map((pin) => {
              const isSelected = selectedProvId === pin.regionId;
              return (
                <button
                  key={pin.id}
                  type="button"
                  onClick={() => setSelectedProvId(pin.regionId)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected ? 'border-[#175cd3] bg-blue-50/40 shadow-xs' : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-slate-900 truncate">{pin.name}</span>
                    <span className="text-[10px] font-semibold text-emerald-600">{pin.latency}</span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-0.5">{pin.users} active users</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Regional Metrics & Traffic Leaderboard */}
        <div className="xl:col-span-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">3. Regional Traffic & Server Nodes</h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${GRAD.info}`}>
                  {datasetKey === 'world' ? 'Global' : 'Indonesia'}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Klik baris wilayah untuk langsung menyorot region tersebut di Vector Map Explorer.
              </p>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari wilayah / kota..."
                className="pl-8 pr-3 py-1.5 w-48 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#175cd3]"
              />
            </div>
          </div>

          <div className="space-y-2.5">
            {topRegions.map((item) => {
              const maxVal = datasetKey === 'world' ? 84200 : 46800;
              const pct = Math.min(100, Math.round((item.users / maxVal) * 100));
              const isSelected = selectedLoc.id === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected ? 'border-[#175cd3] bg-blue-50/30 shadow-xs' : 'border-slate-200/80 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${GRAD.primaryStatic}`}>
                        {item.id}
                      </span>
                      <span className="text-xs font-bold text-slate-900 truncate">{item.name}</span>
                      <span className="text-[11px] text-slate-600 hidden sm:inline">({item.city})</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-bold text-slate-900">{item.users.toLocaleString()}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          item.status === 'Optimal'
                            ? GRAD.success
                            : item.status === 'Normal'
                              ? GRAD.info
                              : GRAD.warning
                        }`}
                      >
                        {item.latency}ms
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${GRAD.primaryStatic}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. EMBED SNIPPET BAR */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${GRAD.dark}`}>
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Live Component Usage Snippet</h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Salin konfigurasi Vector Map aktif ({datasetKey}, mode {visualMode}, tema {canvasTheme}) untuk digunakan di modul dashboard.
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <pre className="bg-slate-950 text-slate-100 text-[11px] px-4 py-2.5 rounded-xl font-mono overflow-x-auto max-w-xl">
            {generatedSnippet}
          </pre>
          <button
            type="button"
            onClick={() => handleCopy(generatedSnippet, 'React VectorMap')}
            className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs cursor-pointer shrink-0 ${GRAD.primary}`}
          >
            {copiedId === 'React VectorMap' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>Salin Snippet</span>
          </button>
        </div>
      </div>
    </div>
  );
}
