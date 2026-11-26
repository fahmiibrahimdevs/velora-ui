import { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp,
  BarChart3,
  PieChart as PieIcon,
  Activity,
  Layers,
  RefreshCw,
  Play,
  Pause,
  Download,
  Radio,
  Target,
  CircleDot,
} from 'lucide-react';
import { showToast } from '../../lib/swal';

// ============================================================================
// DATASET & MATH HELPERS
// ============================================================================

type PeriodKey = 'weekly' | 'monthly' | 'yearly';

const PERIOD_LABELS: Record<PeriodKey, string[]> = {
  weekly: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
  monthly: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
  yearly: ['2020', '2021', '2022', '2023', '2024', '2025', '2026'],
};

const BASE_DATASETS: Record<PeriodKey, { revenue: number[]; expense: number[]; target: number[]; actual: number[] }> = {
  weekly: {
    revenue: [42, 58, 53, 74, 86, 69, 92],
    expense: [28, 34, 31, 40, 44, 38, 49],
    target: [50, 55, 60, 70, 80, 75, 85],
    actual: [46, 61, 56, 78, 84, 71, 94],
  },
  monthly: {
    revenue: [48, 62, 58, 76, 84, 79, 95, 108, 102, 121, 134, 152],
    expense: [31, 38, 35, 44, 49, 46, 54, 60, 57, 65, 72, 79],
    target: [50, 60, 65, 75, 85, 80, 90, 100, 105, 115, 125, 140],
    actual: [48, 64, 61, 79, 88, 82, 96, 110, 104, 124, 136, 154],
  },
  yearly: {
    revenue: [320, 410, 495, 580, 710, 860, 1040],
    expense: [210, 260, 295, 340, 405, 470, 540],
    target: [300, 400, 480, 560, 680, 820, 980],
    actual: [325, 415, 502, 592, 718, 872, 1055],
  },
};

function buildSmoothPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cx = (p0.x + p1.x) / 2;
    d += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
  }
  return d;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function describeArcSlice(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return ['M', cx, cy, 'L', start.x, start.y, 'A', r, r, 0, largeArcFlag, 0, end.x, end.y, 'Z'].join(' ');
}

function describeDonutArc(cx: number, cy: number, rOuter: number, rInner: number, startAngle: number, endAngle: number): string {
  const outerStart = polarToCartesian(cx, cy, rOuter, endAngle);
  const outerEnd = polarToCartesian(cx, cy, rOuter, startAngle);
  const innerStart = polarToCartesian(cx, cy, rInner, endAngle);
  const innerEnd = polarToCartesian(cx, cy, rInner, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? '0' : '1';
  return [
    'M', outerStart.x, outerStart.y,
    'A', rOuter, rOuter, 0, largeArc, 0, outerEnd.x, outerEnd.y,
    'L', innerEnd.x, innerEnd.y,
    'A', rInner, rInner, 0, largeArc, 1, innerStart.x, innerStart.y,
    'Z',
  ].join(' ');
}

// ============================================================================
// CHART DATA DEFINITIONS
// ============================================================================

const DOUGHNUT_DATA = [
  { label: 'Direct Web', value: 340, color: '#175cd3', gradClass: 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0]' },
  { label: 'Mobile App', value: 245, color: '#0ea5e9', gradClass: 'bg-gradient-to-r from-[#0ea5e9] to-[#0284c7]' },
  { label: 'Partner API', value: 148, color: '#22c55e', gradClass: 'bg-gradient-to-r from-[#22c55e] to-[#15803d]' },
  { label: 'Referral', value: 109, color: '#f59e0b', gradClass: 'bg-gradient-to-r from-[#f59e0b] to-[#d97706]' },
];

const PIE_DATA = [
  { label: 'Desktop Chrome', value: 44, color: '#175cd3', gradClass: 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0]' },
  { label: 'Mobile Safari', value: 26, color: '#0ea5e9', gradClass: 'bg-gradient-to-r from-[#0ea5e9] to-[#0284c7]' },
  { label: 'Android WebView', value: 17, color: '#22c55e', gradClass: 'bg-gradient-to-r from-[#22c55e] to-[#15803d]' },
  { label: 'Edge / Firefox', value: 13, color: '#ef4444', gradClass: 'bg-gradient-to-r from-[#ef4444] to-[#b91c1c]' },
];

const RADAR_AXES = ['Kecepatan', 'Keamanan', 'UI/UX', 'Skalabilitas', 'Reliabilitas', 'Dukungan'];
const RADAR_SERIES = {
  velora: [92, 88, 95, 86, 91, 90],
  baseline: [74, 80, 72, 78, 76, 68],
};

const POLAR_DATA = [
  { label: 'Engineering', value: 88, color: '#175cd3', gradClass: 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0]' },
  { label: 'Product UI', value: 74, color: '#0ea5e9', gradClass: 'bg-gradient-to-r from-[#0ea5e9] to-[#0284c7]' },
  { label: 'Cloud Infra', value: 65, color: '#22c55e', gradClass: 'bg-gradient-to-r from-[#22c55e] to-[#15803d]' },
  { label: 'Marketing', value: 52, color: '#f59e0b', gradClass: 'bg-gradient-to-r from-[#f59e0b] to-[#d97706]' },
  { label: 'Security QA', value: 81, color: '#ef4444', gradClass: 'bg-gradient-to-r from-[#ef4444] to-[#b91c1c]' },
  { label: 'Operations', value: 46, color: '#94a3b8', gradClass: 'bg-gradient-to-r from-[#cbd5e1] to-[#94a3b8]' },
];

const HORIZONTAL_CHANNELS = [
  { name: 'Enterprise SaaS', value: 92, amount: 'Rp 412 Jt', gradClass: 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0]' },
  { name: 'Cloud Hosting', value: 78, amount: 'Rp 318 Jt', gradClass: 'bg-gradient-to-r from-[#0ea5e9] to-[#0284c7]' },
  { name: 'UI Kit Licenses', value: 64, amount: 'Rp 214 Jt', gradClass: 'bg-gradient-to-r from-[#22c55e] to-[#15803d]' },
  { name: 'Custom Integration', value: 51, amount: 'Rp 168 Jt', gradClass: 'bg-gradient-to-r from-[#f59e0b] to-[#d97706]' },
  { name: 'Support SLA', value: 39, amount: 'Rp 96 Jt', gradClass: 'bg-gradient-to-r from-[#ef4444] to-[#b91c1c]' },
];

const BUBBLE_POINTS = [
  { label: 'Modul Auth', x: 22, y: 68, r: 16, users: '12.4k', color: '#175cd3' },
  { label: 'Dashboard Core', x: 42, y: 84, r: 22, users: '28.9k', color: '#0ea5e9' },
  { label: 'Forms Suite', x: 64, y: 74, r: 19, users: '21.3k', color: '#22c55e' },
  { label: 'Calendar Pro', x: 78, y: 58, r: 14, users: '9.8k', color: '#f59e0b' },
  { label: 'Upload Engine', x: 51, y: 42, r: 15, users: '11.2k', color: '#ef4444' },
  { label: 'API Gateway', x: 86, y: 86, r: 18, users: '18.5k', color: '#175cd3' },
  { label: 'Billing Export', x: 30, y: 35, r: 12, users: '6.1k', color: '#0ea5e9' },
];

// ============================================================================
// MAIN CHARTJS VIEW
// ============================================================================

export function ChartJSView() {
  const [period, setPeriod] = useState<PeriodKey>('monthly');
  const [jitterSeed, setJitterSeed] = useState(0);

  // Card 1: Line Chart states
  const [showRevenueLine, setShowRevenueLine] = useState(true);
  const [showExpenseLine, setShowExpenseLine] = useState(true);
  const [hoverLineIdx, setHoverLineIdx] = useState<number | null>(null);

  // Card 2: Bar Chart states
  const [barLayout, setBarLayout] = useState<'grouped' | 'stacked'>('grouped');
  const [hoverBarIdx, setHoverBarIdx] = useState<number | null>(null);

  // Card 3 & 4: Circular Chart hover states
  const [hoverDonutIdx, setHoverDonutIdx] = useState<number | null>(null);
  const [activePieIdx, setActivePieIdx] = useState<number | null>(0);

  // Card 5 & 6: Radar & Polar hover states
  const [hoverRadarIdx, setHoverRadarIdx] = useState<number | null>(null);
  const [hoverPolarIdx, setHoverPolarIdx] = useState<number | null>(null);

  // Card 7: Mixed Combo hover state
  const [hoverComboIdx, setHoverComboIdx] = useState<number | null>(null);

  // Card 9: Bubble hover state
  const [hoverBubbleIdx, setHoverBubbleIdx] = useState<number | null>(null);

  // Card 10: Live Streaming Chart
  const [streamRunning, setStreamRunning] = useState(true);
  const [streamData, setStreamData] = useState<number[]>([44, 52, 48, 61, 58, 72, 66, 79, 75, 84, 78, 86]);

  useEffect(() => {
    if (!streamRunning) return;
    const timer = window.setInterval(() => {
      setStreamData((prev) => {
        const last = prev[prev.length - 1] ?? 60;
        const delta = Math.round((Math.random() - 0.45) * 22);
        const nextVal = Math.max(18, Math.min(96, last + delta));
        return [...prev.slice(1), nextVal];
      });
    }, 1100);
    return () => window.clearInterval(timer);
  }, [streamRunning]);

  // Apply subtle deterministic randomization if user clicks "Acak Data"
  const activeDataset = useMemo(() => {
    const base = BASE_DATASETS[period];
    if (jitterSeed === 0) return base;
    const mutate = (arr: number[], offset: number) =>
      arr.map((v, i) => Math.max(10, Math.round(v * (0.85 + (((i + jitterSeed + offset) % 7) * 0.05)))));
    return {
      revenue: mutate(base.revenue, 1),
      expense: mutate(base.expense, 3),
      target: mutate(base.target, 2),
      actual: mutate(base.actual, 4),
    };
  }, [period, jitterSeed]);

  const labels = PERIOD_LABELS[period];

  // =========================================================================
  // 1. LINE CHART GEOMETRY (Full-Width viewBox 600x240)
  // =========================================================================
  const lineW = 600;
  const lineH = 240;
  const linePad = { top: 20, right: 20, bottom: 32, left: 42 };
  const linePlotW = lineW - linePad.left - linePad.right;
  const linePlotH = lineH - linePad.top - linePad.bottom;
  const lineMaxVal = Math.ceil(Math.max(...activeDataset.revenue, ...activeDataset.expense) * 1.15);

  const revenuePts = activeDataset.revenue.map((v, i) => ({
    x: linePad.left + (i / Math.max(1, labels.length - 1)) * linePlotW,
    y: linePad.top + linePlotH - (v / lineMaxVal) * linePlotH,
    v,
  }));
  const expensePts = activeDataset.expense.map((v, i) => ({
    x: linePad.left + (i / Math.max(1, labels.length - 1)) * linePlotW,
    y: linePad.top + linePlotH - (v / lineMaxVal) * linePlotH,
    v,
  }));

  const revenuePath = buildSmoothPath(revenuePts);
  const revenueArea =
    revenuePath &&
    `${revenuePath} L ${revenuePts[revenuePts.length - 1].x} ${linePad.top + linePlotH} L ${revenuePts[0].x} ${linePad.top + linePlotH} Z`;
  const expensePath = buildSmoothPath(expensePts);

  // =========================================================================
  // 2. BAR CHART GEOMETRY (Full-Width viewBox 600x240)
  // =========================================================================
  const barMaxVal =
    barLayout === 'stacked'
      ? Math.ceil(Math.max(...activeDataset.target.map((t, i) => t + activeDataset.actual[i])) * 1.12)
      : Math.ceil(Math.max(...activeDataset.target, ...activeDataset.actual) * 1.15);

  // =========================================================================
  // 3 & 4. DOUGHNUT & PIE ARCS
  // =========================================================================
  const donutTotal = DOUGHNUT_DATA.reduce((s, d) => s + d.value, 0);
  const donutArcs = useMemo(() => {
    let cursor = 0;
    return DOUGHNUT_DATA.map((d) => {
      const sweep = (d.value / donutTotal) * 360;
      const start = cursor;
      const end = cursor + sweep - 1.5;
      cursor += sweep;
      return { ...d, start, end, pct: Math.round((d.value / donutTotal) * 100) };
    });
  }, [donutTotal]);

  const pieTotal = PIE_DATA.reduce((s, d) => s + d.value, 0);
  const pieArcs = useMemo(() => {
    let cursor = 0;
    return PIE_DATA.map((d) => {
      const sweep = (d.value / pieTotal) * 360;
      const start = cursor;
      const end = cursor + sweep;
      const mid = start + sweep / 2;
      cursor += sweep;
      return { ...d, start, end, mid };
    });
  }, [pieTotal]);

  // =========================================================================
  // 5. RADAR GEOMETRY
  // =========================================================================
  const radarCx = 160;
  const radarCy = 135;
  const radarR = 96;
  const radarPoint = (axisIdx: number, score: number) => {
    const angle = (axisIdx * 360) / RADAR_AXES.length;
    return polarToCartesian(radarCx, radarCy, (score / 100) * radarR, angle);
  };
  const veloraPoly = RADAR_SERIES.velora
    .map((s, i) => {
      const p = radarPoint(i, s);
      return `${p.x},${p.y}`;
    })
    .join(' ');
  const baselinePoly = RADAR_SERIES.baseline
    .map((s, i) => {
      const p = radarPoint(i, s);
      return `${p.x},${p.y}`;
    })
    .join(' ');

  // =========================================================================
  // 7. MIXED BAR + LINE COMBO GEOMETRY
  // =========================================================================
  const comboConvRates = activeDataset.actual.map((a, i) =>
    Math.min(98, Math.max(25, Math.round((a / Math.max(1, activeDataset.target[i])) * 68)))
  );
  const comboPts = comboConvRates.map((rate, i) => {
    const slotW = linePlotW / labels.length;
    return {
      x: linePad.left + i * slotW + slotW / 2,
      y: linePad.top + linePlotH - (rate / 100) * linePlotH,
      rate,
    };
  });
  const comboLinePath = buildSmoothPath(comboPts);

  // Export Dataset Summary JSON
  const handleExportSummary = () => {
    const payload = {
      period,
      labels,
      datasets: activeDataset,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `velora-chartjs-${period}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Dataset grafik berhasil diekspor ke JSON.', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ========================================================================= */}
      {/* SUB-HEADER & GLOBAL CONTROLS */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full mt-2 shrink-0" />
          <div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">ChartJS Showcase</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Koleksi lengkap 10 jenis grafik interaktif (Line, Bar, Doughnut, Pie, Radar, Polar Area, Mixed Combo, Horizontal Bar, Bubble Scatter &amp; Live Streaming).
            </p>
          </div>
        </div>

        {/* Global Period & Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-2xs">
            {(
              [
                { id: 'weekly', label: 'Mingguan' },
                { id: 'monthly', label: 'Bulanan' },
                { id: 'yearly', label: 'Tahunan' },
              ] as const
            ).map((item) => {
              const active = period === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPeriod(item.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    active
                      ? 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => {
              setJitterSeed((s) => s + 1);
              showToast('Data grafik diperbarui secara dinamis.', 'info');
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] hover:from-[#0284c7] hover:to-[#0369a1] text-white shadow-xs cursor-pointer transition-all active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Acak Data</span>
          </button>

          <button
            type="button"
            onClick={handleExportSummary}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white shadow-xs cursor-pointer transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 1: LINE CHART + BAR CHART */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* CARD 1: SMOOTH AREA LINE CHART */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#175cd3]" />
                <h3 className="text-base font-bold text-slate-800">Line Chart — Arus Pendapatan</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Kurva bezier halus dengan area gradien &amp; toggle dataset.
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowRevenueLine(!showRevenueLine)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold cursor-pointer transition-all ${
                  showRevenueLine
                    ? 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white shadow-xs'
                    : 'bg-gradient-to-r from-[#f8fafc] to-[#e2e8f0] text-slate-600 border border-slate-200/80'
                }`}
              >
                Pendapatan
              </button>
              <button
                type="button"
                onClick={() => setShowExpenseLine(!showExpenseLine)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold cursor-pointer transition-all ${
                  showExpenseLine
                    ? 'bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] text-white shadow-xs'
                    : 'bg-gradient-to-r from-[#f8fafc] to-[#e2e8f0] text-slate-600 border border-slate-200/80'
                }`}
              >
                Pengeluaran
              </button>
            </div>
          </div>

          <div className="relative">
            <svg viewBox={`0 0 ${lineW} ${lineH}`} className="w-full h-auto block overflow-visible">
              <defs>
                <linearGradient id="chartjs-rev-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#175cd3" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#175cd3" stopOpacity="0.01" />
                </linearGradient>
                <linearGradient id="chartjs-rev-stroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#175cd3" />
                  <stop offset="100%" stopColor="#0f3ba0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid */}
              {[0, 0.25, 0.5, 0.75, 1].map((t, idx) => {
                const y = linePad.top + linePlotH - t * linePlotH;
                const val = Math.round(t * lineMaxVal);
                return (
                  <g key={idx}>
                    <line
                      x1={linePad.left}
                      y1={y}
                      x2={lineW - linePad.right}
                      y2={y}
                      stroke="#e2e8f0"
                      strokeDasharray="4 4"
                    />
                    <text x={linePad.left - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#64748b">
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* Area + Lines */}
              {showRevenueLine && revenueArea && <path d={revenueArea} fill="url(#chartjs-rev-fill)" />}
              {showExpenseLine && (
                <path
                  d={expensePath}
                  fill="none"
                  stroke="#0ea5e9"
                  strokeWidth="2.5"
                  strokeDasharray="6 4"
                  strokeLinecap="round"
                />
              )}
              {showRevenueLine && (
                <path
                  d={revenuePath}
                  fill="none"
                  stroke="url(#chartjs-rev-stroke)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              )}

              {/* Hover Crosshair */}
              {hoverLineIdx !== null && revenuePts[hoverLineIdx] && (
                <line
                  x1={revenuePts[hoverLineIdx].x}
                  y1={linePad.top}
                  x2={revenuePts[hoverLineIdx].x}
                  y2={linePad.top + linePlotH}
                  stroke="#94a3b8"
                  strokeDasharray="3 3"
                />
              )}

              {/* Data Points + X Labels + Hover Columns */}
              {labels.map((lbl, i) => {
                const slotW = linePlotW / labels.length;
                const rp = revenuePts[i];
                const ep = expensePts[i];
                const isHover = hoverLineIdx === i;
                return (
                  <g key={lbl}>
                    <text
                      x={rp.x}
                      y={lineH - 8}
                      textAnchor="middle"
                      fontSize="10.5"
                      fontWeight={isHover ? '700' : '500'}
                      fill={isHover ? '#175cd3' : '#64748b'}
                    >
                      {lbl}
                    </text>
                    {showExpenseLine && (
                      <circle
                        cx={ep.x}
                        cy={ep.y}
                        r={isHover ? 5 : 3}
                        fill="#ffffff"
                        stroke="#0ea5e9"
                        strokeWidth="2"
                      />
                    )}
                    {showRevenueLine && (
                      <circle
                        cx={rp.x}
                        cy={rp.y}
                        r={isHover ? 6 : 3.5}
                        fill="#ffffff"
                        stroke="#175cd3"
                        strokeWidth="2.5"
                      />
                    )}
                    <rect
                      x={rp.x - slotW / 2}
                      y={linePad.top}
                      width={slotW}
                      height={linePlotH + 20}
                      fill="transparent"
                      className="cursor-pointer"
                      onMouseEnter={() => setHoverLineIdx(i)}
                      onMouseLeave={() => setHoverLineIdx(null)}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Floating Hover Tooltip */}
            {hoverLineIdx !== null && (
              <div className="mt-2 px-3 py-2 rounded-xl bg-slate-900 text-white text-xs flex items-center justify-between animate-in fade-in duration-100">
                <span className="font-bold">{labels[hoverLineIdx]}</span>
                <div className="flex items-center gap-4">
                  {showRevenueLine && (
                    <span>
                      Pendapatan: <strong>Rp {activeDataset.revenue[hoverLineIdx]} Jt</strong>
                    </span>
                  )}
                  {showExpenseLine && (
                    <span className="text-sky-300">
                      Pengeluaran: <strong>Rp {activeDataset.expense[hoverLineIdx]} Jt</strong>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CARD 2: BAR CHART (GROUPED / STACKED) */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#175cd3]" />
                <h3 className="text-base font-bold text-slate-800">Bar Chart — Target vs Realisasi</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Bandingkan performa dalam mode Grouped atau Stacked secara instan.
              </p>
            </div>

            <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-0.5">
              {(['grouped', 'stacked'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setBarLayout(mode)}
                  className={`px-2.5 py-1 text-[11px] font-semibold capitalize rounded-lg cursor-pointer transition-all ${
                    barLayout === mode
                      ? 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div>
            <svg viewBox={`0 0 ${lineW} ${lineH}`} className="w-full h-auto block overflow-visible">
              <defs>
                <linearGradient id="chartjs-bar-primary" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#175cd3" />
                  <stop offset="100%" stopColor="#0f3ba0" />
                </linearGradient>
                <linearGradient id="chartjs-bar-success" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#15803d" />
                </linearGradient>
              </defs>

              {[0, 0.25, 0.5, 0.75, 1].map((t, idx) => {
                const y = linePad.top + linePlotH - t * linePlotH;
                const val = Math.round(t * barMaxVal);
                return (
                  <g key={idx}>
                    <line
                      x1={linePad.left}
                      y1={y}
                      x2={lineW - linePad.right}
                      y2={y}
                      stroke="#e2e8f0"
                      strokeDasharray="4 4"
                    />
                    <text x={linePad.left - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#64748b">
                      {val}
                    </text>
                  </g>
                );
              })}

              {labels.map((lbl, i) => {
                const slotW = linePlotW / labels.length;
                const centerX = linePad.left + i * slotW + slotW / 2;
                const tVal = activeDataset.target[i];
                const aVal = activeDataset.actual[i];
                const baseLineY = linePad.top + linePlotH;
                const isHover = hoverBarIdx === i;

                const tH = (tVal / barMaxVal) * linePlotH;
                const aH = (aVal / barMaxVal) * linePlotH;
                const barW = Math.min(22, slotW * 0.34);

                return (
                  <g
                    key={lbl}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoverBarIdx(i)}
                    onMouseLeave={() => setHoverBarIdx(null)}
                  >
                    {isHover && (
                      <rect
                        x={centerX - slotW * 0.44}
                        y={linePad.top}
                        width={slotW * 0.88}
                        height={linePlotH}
                        rx="6"
                        fill="#eff6ff"
                      />
                    )}

                    {barLayout === 'grouped' ? (
                      <>
                        <rect
                          x={centerX - barW - 2}
                          y={baseLineY - tH}
                          width={barW}
                          height={tH}
                          rx="4"
                          fill="url(#chartjs-bar-primary)"
                          opacity={isHover ? 1 : 0.9}
                        />
                        <rect
                          x={centerX + 2}
                          y={baseLineY - aH}
                          width={barW}
                          height={aH}
                          rx="4"
                          fill="url(#chartjs-bar-success)"
                          opacity={isHover ? 1 : 0.9}
                        />
                      </>
                    ) : (
                      <>
                        <rect
                          x={centerX - barW * 0.7}
                          y={baseLineY - tH}
                          width={barW * 1.4}
                          height={tH}
                          rx="3"
                          fill="url(#chartjs-bar-primary)"
                        />
                        <rect
                          x={centerX - barW * 0.7}
                          y={baseLineY - tH - aH}
                          width={barW * 1.4}
                          height={aH}
                          rx="4"
                          fill="url(#chartjs-bar-success)"
                        />
                      </>
                    )}

                    <text
                      x={centerX}
                      y={lineH - 8}
                      textAnchor="middle"
                      fontSize="10.5"
                      fontWeight={isHover ? '700' : '500'}
                      fill={isHover ? '#175cd3' : '#64748b'}
                    >
                      {lbl}
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700">
                  <span className="w-3 h-3 rounded bg-gradient-to-r from-[#175cd3] to-[#0f3ba0]" />
                  Target
                </span>
                <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700">
                  <span className="w-3 h-3 rounded bg-gradient-to-r from-[#22c55e] to-[#15803d]" />
                  Realisasi
                </span>
              </div>
              {hoverBarIdx !== null && (
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[11px] font-semibold">
                  {labels[hoverBarIdx]}: Target {activeDataset.target[hoverBarIdx]} • Realisasi{' '}
                  {activeDataset.actual[hoverBarIdx]}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 2: DOUGHNUT CHART + PIE CHART */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* CARD 3: DOUGHNUT CHART */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <CircleDot className="w-4 h-4 text-[#175cd3]" />
                <h3 className="text-base font-bold text-slate-800">Doughnut Chart — Distribusi Kanal</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Hover segmen atau item legenda untuk melihat detail porsi pendapatan.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white text-[11px] font-semibold">
              4 Kanal
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
            <svg viewBox="0 0 220 220" className="w-full max-w-[230px] mx-auto h-auto block">
              {donutArcs.map((arc, i) => {
                const isHover = hoverDonutIdx === i;
                return (
                  <path
                    key={arc.label}
                    d={describeDonutArc(110, 110, isHover ? 96 : 90, 56, arc.start, arc.end)}
                    fill={arc.color}
                    className="cursor-pointer transition-all duration-200"
                    opacity={hoverDonutIdx === null || isHover ? 1 : 0.55}
                    onMouseEnter={() => setHoverDonutIdx(i)}
                    onMouseLeave={() => setHoverDonutIdx(null)}
                  />
                );
              })}
              <text x="110" y="104" textAnchor="middle" fontSize="11" fill="#64748b" fontWeight="600">
                {hoverDonutIdx !== null ? donutArcs[hoverDonutIdx].label : 'Total Revenue'}
              </text>
              <text x="110" y="126" textAnchor="middle" fontSize="18" fill="#0f172a" fontWeight="800">
                {hoverDonutIdx !== null
                  ? `Rp ${donutArcs[hoverDonutIdx].value} Jt`
                  : `Rp ${donutTotal} Jt`}
              </text>
            </svg>

            <div className="space-y-2.5">
              {donutArcs.map((arc, i) => {
                const isHover = hoverDonutIdx === i;
                return (
                  <div
                    key={arc.label}
                    onMouseEnter={() => setHoverDonutIdx(i)}
                    onMouseLeave={() => setHoverDonutIdx(null)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                      isHover ? 'border-[#175cd3] bg-blue-50/50 shadow-2xs' : 'border-slate-100 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-3 h-3 rounded-full shrink-0 ${arc.gradClass}`} />
                      <span className="font-semibold text-slate-800">{arc.label}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900">Rp {arc.value} Jt</span>
                      <span className="ml-1.5 text-[11px] text-slate-500">({arc.pct}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CARD 4: INTERACTIVE EXPLODED PIE CHART */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-[#175cd3]" />
                <h3 className="text-base font-bold text-slate-800">Pie Chart — Pangsa Perangkat</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Klik salah satu potongan pie untuk efek explode &amp; detail metrik.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] text-white text-[11px] font-semibold">
              Interactive Slice
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
            <svg viewBox="0 0 220 220" className="w-full max-w-[230px] mx-auto h-auto block overflow-visible">
              {pieArcs.map((arc, i) => {
                const isSelected = activePieIdx === i;
                const rad = ((arc.mid - 90) * Math.PI) / 180;
                const tx = isSelected ? Math.cos(rad) * 10 : 0;
                const ty = isSelected ? Math.sin(rad) * 10 : 0;

                return (
                  <path
                    key={arc.label}
                    d={describeArcSlice(110, 110, 86, arc.start, arc.end)}
                    fill={arc.color}
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    transform={`translate(${tx}, ${ty})`}
                    className="cursor-pointer transition-all duration-200"
                    onClick={() => setActivePieIdx(isSelected ? null : i)}
                  />
                );
              })}
            </svg>

            <div className="space-y-2.5">
              {pieArcs.map((arc, i) => {
                const isSelected = activePieIdx === i;
                return (
                  <button
                    key={arc.label}
                    type="button"
                    onClick={() => setActivePieIdx(isSelected ? null : i)}
                    className={`w-full p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                      isSelected
                        ? `${arc.gradClass} border-transparent shadow-xs`
                        : 'border-slate-100 bg-white text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <span className="font-semibold flex items-center gap-2">
                      {!isSelected && <span className={`w-2.5 h-2.5 rounded-full ${arc.gradClass}`} />}
                      {arc.label}
                    </span>
                    <span className="font-bold">{arc.value}%</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 3: RADAR CHART + POLAR AREA CHART */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* CARD 5: RADAR CHART */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-[#175cd3]" />
                <h3 className="text-base font-bold text-slate-800">Radar Chart — Skor Kualitas</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Perbandingan 6 dimensi performa antara Velora UI v2 vs Standar Baseline.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold">
              <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white">
                Velora v2
              </span>
              <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] text-white">
                Baseline
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <svg viewBox="0 0 320 270" className="w-full max-w-[320px] mx-auto h-auto block overflow-visible">
              {/* Concentric Polygon Webs */}
              {[25, 50, 75, 100].map((lvl) => {
                const pts = RADAR_AXES.map((_, idx) => {
                  const p = radarPoint(idx, lvl);
                  return `${p.x},${p.y}`;
                }).join(' ');
                return <polygon key={lvl} points={pts} fill="none" stroke="#e2e8f0" strokeWidth="1" />;
              })}

              {/* Radial Spokes + Axis Labels */}
              {RADAR_AXES.map((axis, idx) => {
                const edge = radarPoint(idx, 100);
                const lblPos = radarPoint(idx, 120);
                return (
                  <g key={axis}>
                    <line x1={radarCx} y1={radarCy} x2={edge.x} y2={edge.y} stroke="#e2e8f0" />
                    <text
                      x={lblPos.x}
                      y={lblPos.y + 3}
                      textAnchor="middle"
                      fontSize="10.5"
                      fontWeight={hoverRadarIdx === idx ? '700' : '600'}
                      fill={hoverRadarIdx === idx ? '#175cd3' : '#475569'}
                    >
                      {axis}
                    </text>
                  </g>
                );
              })}

              {/* Baseline Polygon */}
              <polygon
                points={baselinePoly}
                fill="#0ea5e9"
                fillOpacity="0.16"
                stroke="#0ea5e9"
                strokeWidth="2"
              />

              {/* Velora Polygon */}
              <polygon
                points={veloraPoly}
                fill="#175cd3"
                fillOpacity="0.22"
                stroke="#175cd3"
                strokeWidth="2.5"
              />

              {/* Interactive Dots */}
              {RADAR_AXES.map((axis, idx) => {
                const vp = radarPoint(idx, RADAR_SERIES.velora[idx]);
                const bp = radarPoint(idx, RADAR_SERIES.baseline[idx]);
                const active = hoverRadarIdx === idx;
                return (
                  <g
                    key={axis}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoverRadarIdx(idx)}
                    onMouseLeave={() => setHoverRadarIdx(null)}
                  >
                    <circle cx={bp.x} cy={bp.y} r={active ? 4.5 : 3} fill="#0ea5e9" stroke="#fff" strokeWidth="1.5" />
                    <circle cx={vp.x} cy={vp.y} r={active ? 6 : 4} fill="#175cd3" stroke="#fff" strokeWidth="2" />
                  </g>
                );
              })}
            </svg>

            <div className="w-full sm:w-48 space-y-1.5 shrink-0">
              {RADAR_AXES.map((axis, idx) => (
                <div
                  key={axis}
                  onMouseEnter={() => setHoverRadarIdx(idx)}
                  onMouseLeave={() => setHoverRadarIdx(null)}
                  className={`px-3 py-1.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                    hoverRadarIdx === idx ? 'border-[#175cd3] bg-blue-50/50' : 'border-slate-100 bg-white'
                  }`}
                >
                  <span className="font-medium text-slate-700">{axis}</span>
                  <span className="font-bold text-[#175cd3]">
                    {RADAR_SERIES.velora[idx]} <span className="text-slate-400 font-normal">/ {RADAR_SERIES.baseline[idx]}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CARD 6: POLAR AREA CHART */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#175cd3]" />
                <h3 className="text-base font-bold text-slate-800">Polar Area Chart — Alokasi Anggaran</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Sudut sama (60°) dengan radius proporsional terhadap skor anggaran tiap divisi.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-[#22c55e] to-[#15803d] text-white text-[11px] font-semibold">
              6 Divisi
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <svg viewBox="0 0 240 240" className="w-full max-w-[240px] mx-auto h-auto block">
              {[25, 50, 75, 100].map((r) => (
                <circle key={r} cx="120" cy="120" r={r} fill="none" stroke="#e2e8f0" strokeDasharray="3 3" />
              ))}

              {POLAR_DATA.map((item, idx) => {
                const step = 360 / POLAR_DATA.length;
                const start = idx * step;
                const end = start + step;
                const isHover = hoverPolarIdx === idx;
                const radius = (item.value / 100) * 96 + (isHover ? 5 : 0);

                return (
                  <path
                    key={item.label}
                    d={describeArcSlice(120, 120, radius, start, end)}
                    fill={item.color}
                    fillOpacity={hoverPolarIdx === null || isHover ? 0.82 : 0.4}
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="cursor-pointer transition-all duration-200"
                    onMouseEnter={() => setHoverPolarIdx(idx)}
                    onMouseLeave={() => setHoverPolarIdx(null)}
                  />
                );
              })}
            </svg>

            <div className="space-y-2">
              {POLAR_DATA.map((item, idx) => (
                <div
                  key={item.label}
                  onMouseEnter={() => setHoverPolarIdx(idx)}
                  onMouseLeave={() => setHoverPolarIdx(null)}
                  className={`px-3 py-1.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                    hoverPolarIdx === idx ? 'border-[#175cd3] bg-blue-50/40' : 'border-slate-100 bg-white'
                  }`}
                >
                  <span className="flex items-center gap-2 font-medium text-slate-700">
                    <span className={`w-2.5 h-2.5 rounded-full ${item.gradClass}`} />
                    {item.label}
                  </span>
                  <span className="font-bold text-slate-800">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 4: MIXED BAR + LINE COMBO + HORIZONTAL BAR CHART */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* CARD 7: MIXED BAR + LINE COMBO */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#175cd3]" />
                <h3 className="text-base font-bold text-slate-800">Mixed Combo — Volume &amp; Konversi</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Kombinasi grafik batang transaksi dengan garis tren persentase konversi.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-semibold">
              <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white">
                Bar: Volume
              </span>
              <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white">
                Line: Rate %
              </span>
            </div>
          </div>

          <svg viewBox={`0 0 ${lineW} ${lineH}`} className="w-full h-auto block overflow-visible">
            <defs>
              <linearGradient id="chartjs-combo-bar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#175cd3" stopOpacity="0.88" />
                <stop offset="100%" stopColor="#0f3ba0" stopOpacity="0.72" />
              </linearGradient>
            </defs>

            {[0, 0.25, 0.5, 0.75, 1].map((t, idx) => {
              const y = linePad.top + linePlotH - t * linePlotH;
              return (
                <g key={idx}>
                  <line
                    x1={linePad.left}
                    y1={y}
                    x2={lineW - linePad.right}
                    y2={y}
                    stroke="#e2e8f0"
                    strokeDasharray="4 4"
                  />
                  <text x={linePad.left - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#64748b">
                    {Math.round(t * 100)}%
                  </text>
                </g>
              );
            })}

            {labels.map((lbl, i) => {
              const slotW = linePlotW / labels.length;
              const centerX = linePad.left + i * slotW + slotW / 2;
              const maxRev = Math.max(...activeDataset.revenue);
              const barH = (activeDataset.revenue[i] / (maxRev * 1.15)) * linePlotH;
              const barW = Math.min(26, slotW * 0.45);
              const isHover = hoverComboIdx === i;

              return (
                <g
                  key={lbl}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoverComboIdx(i)}
                  onMouseLeave={() => setHoverComboIdx(null)}
                >
                  <rect
                    x={centerX - barW / 2}
                    y={linePad.top + linePlotH - barH}
                    width={barW}
                    height={barH}
                    rx="4"
                    fill="url(#chartjs-combo-bar)"
                    opacity={isHover ? 1 : 0.8}
                  />
                  <text
                    x={centerX}
                    y={lineH - 8}
                    textAnchor="middle"
                    fontSize="10.5"
                    fontWeight={isHover ? '700' : '500'}
                    fill={isHover ? '#175cd3' : '#64748b'}
                  >
                    {lbl}
                  </text>
                </g>
              );
            })}

            <path d={comboLinePath} fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />

            {comboPts.map((pt, i) => (
              <circle
                key={i}
                cx={pt.x}
                cy={pt.y}
                r={hoverComboIdx === i ? 6 : 3.5}
                fill="#ffffff"
                stroke="#d97706"
                strokeWidth="2.5"
                className="pointer-events-none"
              />
            ))}
          </svg>

          {hoverComboIdx !== null && (
            <div className="mt-2 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs flex items-center justify-between">
              <span className="font-bold">{labels[hoverComboIdx]}</span>
              <span>
                Volume: <strong>Rp {activeDataset.revenue[hoverComboIdx]} Jt</strong> • Konversi:{' '}
                <strong className="text-amber-300">{comboConvRates[hoverComboIdx]}%</strong>
              </span>
            </div>
          )}
        </div>

        {/* CARD 8: HORIZONTAL BAR RANKING */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
          <div className="flex items-center justify-between gap-2 mb-5">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#175cd3] rotate-90" />
                <h3 className="text-base font-bold text-slate-800">Horizontal Bar — Top Produk</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Peringkat kontribusi produk dengan bar gradien penuh &amp; metrik nominal.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white text-[11px] font-semibold">
              Top 5
            </span>
          </div>

          <div className="space-y-4">
            {HORIZONTAL_CHANNELS.map((ch) => (
              <div key={ch.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{ch.name}</span>
                  <span className="font-bold text-slate-900">
                    {ch.amount} <span className="text-slate-500 font-normal">({ch.value}%)</span>
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${ch.value}%` }}
                    className={`h-full rounded-full transition-all duration-500 ${ch.gradClass}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 5: BUBBLE SCATTER CHART + REALTIME LIVE STREAMING CHART */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* CARD 9: BUBBLE / SCATTER PLOT */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <CircleDot className="w-4 h-4 text-[#175cd3]" />
                <h3 className="text-base font-bold text-slate-800">Bubble Chart — Adopsi Fitur</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Sumbu X (Frekuensi), Sumbu Y (Kepuasan), dan Ukuran Bubble (Jumlah Pengguna).
              </p>
            </div>
          </div>

          <svg viewBox={`0 0 ${lineW} ${lineH}`} className="w-full h-auto block overflow-visible">
            {[0, 25, 50, 75, 100].map((v) => {
              const y = linePad.top + linePlotH - (v / 100) * linePlotH;
              const x = linePad.left + (v / 100) * linePlotW;
              return (
                <g key={v}>
                  <line x1={linePad.left} y1={y} x2={lineW - linePad.right} y2={y} stroke="#f1f5f9" />
                  <line x1={x} y1={linePad.top} x2={x} y2={linePad.top + linePlotH} stroke="#f1f5f9" />
                  <text x={linePad.left - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#64748b">
                    {v}
                  </text>
                  <text x={x} y={lineH - 8} textAnchor="middle" fontSize="10" fill="#64748b">
                    {v}
                  </text>
                </g>
              );
            })}

            {BUBBLE_POINTS.map((b, idx) => {
              const cx = linePad.left + (b.x / 100) * linePlotW;
              const cy = linePad.top + linePlotH - (b.y / 100) * linePlotH;
              const isHover = hoverBubbleIdx === idx;
              return (
                <g
                  key={b.label}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoverBubbleIdx(idx)}
                  onMouseLeave={() => setHoverBubbleIdx(null)}
                >
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isHover ? b.r + 4 : b.r}
                    fill={b.color}
                    fillOpacity={isHover ? 0.92 : 0.7}
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="transition-all duration-150"
                  />
                  <text
                    x={cx}
                    y={cy + 3}
                    textAnchor="middle"
                    fontSize="9.5"
                    fontWeight="700"
                    fill="#ffffff"
                    className="pointer-events-none"
                  >
                    {b.users}
                  </text>
                </g>
              );
            })}
          </svg>

          {hoverBubbleIdx !== null && (
            <div className="mt-2 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs flex items-center justify-between">
              <span className="font-bold">{BUBBLE_POINTS[hoverBubbleIdx].label}</span>
              <span>
                Frekuensi {BUBBLE_POINTS[hoverBubbleIdx].x}% • Kepuasan {BUBBLE_POINTS[hoverBubbleIdx].y}% •{' '}
                <strong>{BUBBLE_POINTS[hoverBubbleIdx].users} user</strong>
              </span>
            </div>
          )}
        </div>

        {/* CARD 10: REALTIME LIVE TELEMETRY STREAMING */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Radio className={`w-4 h-4 ${streamRunning ? 'text-emerald-600 animate-pulse' : 'text-slate-400'}`} />
                <h3 className="text-base font-bold text-slate-800">Realtime Stream — Beban Server</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Pembaruan metrik otomatis setiap 1 detik dengan tombol Pause / Resume.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setStreamRunning(!streamRunning)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white shadow-xs cursor-pointer transition-all active:scale-95 ${
                streamRunning
                  ? 'bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:from-[#ea580c] hover:to-[#b45309]'
                  : 'bg-gradient-to-r from-[#22c55e] to-[#15803d] hover:from-[#16a34a] hover:to-[#166534]'
              }`}
            >
              {streamRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{streamRunning ? 'Pause Stream' : 'Resume Stream'}</span>
            </button>
          </div>

          <svg viewBox={`0 0 ${lineW} ${lineH}`} className="w-full h-auto block overflow-visible">
            <defs>
              <linearGradient id="chartjs-stream-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#22c55e" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {[0, 25, 50, 75, 100].map((v) => {
              const y = linePad.top + linePlotH - (v / 100) * linePlotH;
              return (
                <g key={v}>
                  <line
                    x1={linePad.left}
                    y1={y}
                    x2={lineW - linePad.right}
                    y2={y}
                    stroke="#e2e8f0"
                    strokeDasharray="4 4"
                  />
                  <text x={linePad.left - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#64748b">
                    {v}%
                  </text>
                </g>
              );
            })}

            {(() => {
              const pts = streamData.map((val, i) => ({
                x: linePad.left + (i / (streamData.length - 1)) * linePlotW,
                y: linePad.top + linePlotH - (val / 100) * linePlotH,
              }));
              const path = buildSmoothPath(pts);
              const area = `${path} L ${pts[pts.length - 1].x} ${linePad.top + linePlotH} L ${pts[0].x} ${linePad.top + linePlotH} Z`;
              const lastPt = pts[pts.length - 1];
              return (
                <>
                  <path d={area} fill="url(#chartjs-stream-fill)" />
                  <path d={path} fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" />
                  <circle cx={lastPt.x} cy={lastPt.y} r="6" fill="#22c55e" stroke="#ffffff" strokeWidth="2.5" />
                </>
              );
            })()}
          </svg>

          <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
            <span>
              Status:{' '}
              <strong className={streamRunning ? 'text-emerald-600' : 'text-amber-600'}>
                {streamRunning ? 'Live Streaming' : 'Dijeda'}
              </strong>
            </span>
            <span>
              Beban Saat Ini:{' '}
              <strong className="text-slate-900">{streamData[streamData.length - 1]}% CPU</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
