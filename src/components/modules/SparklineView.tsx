import { useState, useEffect } from 'react';
import { Play, Pause, RefreshCw, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { showToast } from '../../lib/swal';

const GRAD = {
  primary: 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white',
  primaryStatic: 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white',
  infoStatic: 'bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] text-white',
  success: 'bg-gradient-to-r from-[#22c55e] to-[#15803d] hover:from-[#16a34a] hover:to-[#166534] text-white',
  successStatic: 'bg-gradient-to-r from-[#22c55e] to-[#15803d] text-white',
  warning: 'bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:from-[#ea580c] hover:to-[#b45309] text-white',
  warningStatic: 'bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white',
  dangerStatic: 'bg-gradient-to-r from-[#ef4444] to-[#b91c1c] text-white',
};

// Reusable SVG Sparkline Primitives
function LineSpark({
  data,
  stroke = '#175cd3',
  fill = '#175cd3',
  showSpots = false,
  width = 180,
  height = 48,
}: {
  data: number[];
  stroke?: string;
  fill?: string;
  showSpots?: boolean;
  width?: number;
  height?: number;
}) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = Math.max(1, max - min);
  const pad = 5;

  const pts = data.map((v, i) => ({
    x: pad + (i / Math.max(1, data.length - 1)) * (width - pad * 2),
    y: height - pad - ((v - min) / span) * (height - pad * 2),
    v,
  }));

  const poly = pts.map((p) => `${p.x},${p.y}`).join(' ');
  const area = `M ${pts[0].x},${height - pad} L ${pts.map((p) => `${p.x},${p.y}`).join(' L ')} L ${pts[pts.length - 1].x},${height - pad} Z`;

  const minIdx = data.indexOf(min);
  const maxIdx = data.indexOf(max);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto block overflow-visible">
      <path d={area} fill={fill} fillOpacity="0.14" />
      <polyline fill="none" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" points={poly} />
      {showSpots && (
        <>
          <circle cx={pts[minIdx].x} cy={pts[minIdx].y} r="3.2" fill="#ef4444" stroke="#fff" strokeWidth="1.2" />
          <circle cx={pts[maxIdx].x} cy={pts[maxIdx].y} r="3.2" fill="#22c55e" stroke="#fff" strokeWidth="1.2" />
          <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r="3.5" fill={stroke} stroke="#fff" strokeWidth="1.5" />
        </>
      )}
    </svg>
  );
}

function BarSpark({
  data,
  color = '#175cd3',
  width = 180,
  height = 48,
}: {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
}) {
  const max = Math.max(...data, 1);
  const slot = width / data.length;
  const bw = Math.max(4, slot * 0.65);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto block">
      {data.map((v, i) => {
        const bh = Math.max(4, (v / max) * (height - 6));
        return (
          <rect
            key={i}
            x={i * slot + (slot - bw) / 2}
            y={height - bh}
            width={bw}
            height={bh}
            rx="2"
            fill={color}
            opacity={0.75 + (i / data.length) * 0.25}
          />
        );
      })}
    </svg>
  );
}

function TristateSpark({ data, width = 180, height = 48 }: { data: number[]; width?: number; height?: number }) {
  const slot = width / data.length;
  const bw = Math.max(4, slot * 0.65);
  const midY = height / 2;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto block">
      <line x1="0" y1={midY} x2={width} y2={midY} stroke="#e2e8f0" strokeWidth="1" />
      {data.map((v, i) => {
        const x = i * slot + (slot - bw) / 2;
        if (v > 0) {
          return <rect key={i} x={x} y={4} width={bw} height={midY - 6} rx="2" fill="#22c55e" />;
        }
        if (v < 0) {
          return <rect key={i} x={x} y={midY + 2} width={bw} height={midY - 6} rx="2" fill="#ef4444" />;
        }
        return <rect key={i} x={x} y={midY - 2} width={bw} height={4} rx="1" fill="#94a3b8" />;
      })}
    </svg>
  );
}

function DiscreteSpark({ data, color = '#0ea5e9', width = 180, height = 48 }: { data: number[]; color?: string; width?: number; height?: number }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = Math.max(1, max - min);
  const slot = width / data.length;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto block">
      {data.map((v, i) => {
        const y = height - 8 - ((v - min) / span) * (height - 14);
        const x = i * slot + slot / 2;
        return <line key={i} x1={x} y1={y} x2={x} y2={y + 8} stroke={color} strokeWidth="2.5" strokeLinecap="round" />;
      })}
    </svg>
  );
}

interface ServiceMetric {
  id: string;
  service: string;
  region: string;
  latencyMs: number;
  status: 'Healthy' | 'Elevated';
  history: number[];
}

const INITIAL_SERVICES: ServiceMetric[] = [
  { id: 'srv-1', service: 'API Gateway Core', region: 'ap-southeast-1', latencyMs: 24, status: 'Healthy', history: [22, 26, 21, 28, 25, 23, 27, 24, 22, 24] },
  { id: 'srv-2', service: 'Auth & JWT Signer', region: 'ap-southeast-1', latencyMs: 18, status: 'Healthy', history: [19, 17, 21, 18, 16, 20, 19, 17, 18, 18] },
  { id: 'srv-3', service: 'Upload Object Worker', region: 'ap-southeast-3', latencyMs: 68, status: 'Elevated', history: [45, 52, 48, 60, 58, 64, 71, 65, 69, 68] },
  { id: 'srv-4', service: 'PostgreSQL Primary', region: 'ap-southeast-3', latencyMs: 12, status: 'Healthy', history: [14, 12, 13, 11, 15, 12, 13, 12, 11, 12] },
];

export function SparklineView() {
  const [live, setLive] = useState(true);
  const [services, setServices] = useState<ServiceMetric[]>(INITIAL_SERVICES);
  const [seed, setSeed] = useState(0);

  useEffect(() => {
    if (!live) return;
    const t = window.setInterval(() => {
      setServices((prev) =>
        prev.map((s) => {
          const last = s.history[s.history.length - 1] ?? s.latencyMs;
          const delta = Math.round((Math.random() - 0.48) * 8);
          const next = Math.max(8, Math.min(95, last + delta));
          return {
            ...s,
            latencyMs: next,
            status: next > 55 ? 'Elevated' : 'Healthy',
            history: [...s.history.slice(1), next],
          };
        })
      );
    }, 1300);
    return () => window.clearInterval(t);
  }, [live]);

  const visitorLine = [24, 38, 32, 49, 44, 62, 58, 74, 69, 86, 82, 95].map((v) => v + (seed % 3) * 4);
  const ordersBar = [18, 25, 22, 34, 41, 36, 48, 52, 46, 58, 64, 72].map((v) => v + (seed % 4) * 3);
  const tristateData = [1, 1, -1, 1, 0, 1, 1, -1, 1, 1, 1, -1];
  const discreteData = [12, 18, 15, 22, 29, 25, 31, 28, 36, 42, 38, 45];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Sub-header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full mt-2 shrink-0" />
          <div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Sparkline Micro-Charts</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Grafik mikro ringkas untuk kartu KPI, ringkasan eksekutif, bullet target, dan tabel telemetri live.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setSeed((s) => s + 1);
            showToast('Data sparkline diperbarui.', 'info');
          }}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs cursor-pointer transition-all active:scale-95 ${GRAD.primary}`}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Row 1: 4 Mini KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Visitors</span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${GRAD.successStatic}`}>
              <TrendingUp className="w-3 h-3" /> +18.4%
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900">48,920</div>
          <LineSpark data={visitorLine} stroke="#175cd3" fill="#175cd3" showSpots />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Daily Orders</span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${GRAD.infoStatic}`}>
              +12.1%
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900">1,842</div>
          <BarSpark data={ordersBar} color="#0ea5e9" />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Win / Loss Streak</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${GRAD.primaryStatic}`}>
              Tristate
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900">8W – 3L</div>
          <TristateSpark data={tristateData} />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Error Spike</span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${GRAD.warningStatic}`}>
              <TrendingDown className="w-3 h-3" /> 0.14%
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900">42 req/m</div>
          <DiscreteSpark data={discreteData} color="#f59e0b" />
        </div>
      </div>

      {/* Row 2: 6 Sparkline Styles Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-5">
          <div>
            <h3 className="text-base font-bold text-[#175cd3]">Sparkline Variants Gallery</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Varian Line dengan titik Min/Max, Bar, Tristate, dan Discrete dalam skala penuh.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">Line + Min/Max Spots</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${GRAD.primaryStatic}`}>Line</span>
              </div>
              <LineSpark data={visitorLine} stroke="#175cd3" fill="#175cd3" showSpots width={220} height={60} />
            </div>

            <div className="p-4 rounded-xl border border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">Bar Sparkline</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${GRAD.successStatic}`}>Bar</span>
              </div>
              <BarSpark data={ordersBar} color="#22c55e" width={220} height={60} />
            </div>

            <div className="p-4 rounded-xl border border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">Tristate (+ / 0 / -)</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${GRAD.dangerStatic}`}>Tristate</span>
              </div>
              <TristateSpark data={tristateData} width={220} height={60} />
            </div>

            <div className="p-4 rounded-xl border border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">Discrete Tick</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${GRAD.infoStatic}`}>Discrete</span>
              </div>
              <DiscreteSpark data={discreteData} color="#0ea5e9" width={220} height={60} />
            </div>
          </div>
        </div>

        {/* Bullet Graph & Micro Pie Sparklines */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-5">
          <div>
            <h3 className="text-base font-bold text-[#175cd3]">Bullet Sparklines &amp; Inline Pies</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Mengukur pencapaian aktual terhadap garis target KPI serta diagram pie berukuran mikro.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { label: 'Q4 Revenue Target', actual: 86, target: 80, pctText: '86% / Target 80%', grad: GRAD.primaryStatic },
              { label: 'Customer Retention', actual: 94, target: 90, pctText: '94% / Target 90%', grad: GRAD.successStatic },
              { label: 'Ticket Resolution SLA', actual: 72, target: 85, pctText: '72% / Target 85%', grad: GRAD.warningStatic },
            ].map((b) => (
              <div key={b.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{b.label}</span>
                  <span className="font-bold text-slate-700">{b.pctText}</span>
                </div>
                <div className="relative h-5 rounded-lg bg-slate-100 overflow-hidden">
                  {/* Qualitative bands */}
                  <div className="absolute inset-y-0 left-0 w-[60%] bg-slate-200/60" />
                  <div className="absolute inset-y-0 left-[60%] w-[25%] bg-slate-200/35" />
                  {/* Actual bar */}
                  <div style={{ width: `${b.actual}%` }} className={`relative h-2.5 top-[5px] rounded-r ${b.grad}`} />
                  {/* Target marker */}
                  <div
                    style={{ left: `${b.target}%` }}
                    className="absolute inset-y-0.5 w-0.5 bg-slate-900"
                    title={`Target ${b.target}%`}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Inline Micro Pie Row */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-4">
            {[
              { label: 'CPU', pct: 68, color: '#175cd3' },
              { label: 'RAM', pct: 82, color: '#0ea5e9' },
              { label: 'Disk', pct: 45, color: '#22c55e' },
              { label: 'Cache', pct: 91, color: '#f59e0b' },
            ].map((m) => {
              const r = 13;
              const circ = 2 * Math.PI * r;
              const dash = (m.pct / 100) * circ;
              return (
                <div key={m.label} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-100">
                  <svg width="34" height="34" viewBox="0 0 34 34" className="-rotate-90">
                    <circle cx="17" cy="17" r={r} fill="none" stroke="#e2e8f0" strokeWidth="4" />
                    <circle
                      cx="17"
                      cy="17"
                      r={r}
                      fill="none"
                      stroke={m.color}
                      strokeWidth="4"
                      strokeDasharray={`${dash} ${circ}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="text-xs">
                    <div className="font-bold text-slate-800">{m.label}</div>
                    <div className="text-[11px] text-slate-500">{m.pct}% used</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 3: Live Table with Embedded Sparklines */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#175cd3]" />
              <h3 className="text-base font-bold text-[#175cd3]">Live Service Sparklines Table</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Setiap baris menampilkan tren latensi 10 titik terakhir secara real-time.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setLive(!live)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer shadow-xs ${
              live ? GRAD.warning : GRAD.success
            }`}
          >
            {live ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{live ? 'Pause Live' : 'Resume Live'}</span>
          </button>
        </div>

        <div className="overflow-x-auto border border-slate-200/80 rounded-xl">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Region</th>
                <th className="py-3 px-4 w-48">Latency Trend (10 ticks)</th>
                <th className="py-3 px-4">Current</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {services.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-bold text-slate-800">{s.service}</td>
                  <td className="py-3 px-4 text-slate-500 font-mono">{s.region}</td>
                  <td className="py-2 px-4">
                    <div className="w-40">
                      <LineSpark
                        data={s.history}
                        stroke={s.status === 'Healthy' ? '#175cd3' : '#f59e0b'}
                        fill={s.status === 'Healthy' ? '#175cd3' : '#f59e0b'}
                        width={160}
                        height={34}
                      />
                    </div>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-800">{s.latencyMs} ms</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        s.status === 'Healthy' ? GRAD.successStatic : GRAD.warningStatic
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
