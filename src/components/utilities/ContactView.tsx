import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Copy,
  Check,
  Building2,
  Headphones,
  MessageSquare,
} from 'lucide-react';
import { showSuccess, showToast } from '../../lib/swal';
import { FeatureSectionHeader } from '../features/FeatureSectionHeader';
import indonesiaMapRaw from '../modules/maps/indonesiaMapData.json';

interface SvgMapDataset {
  viewBox: string;
  locations: { id: string; name: string; path: string }[];
}

const indonesiaMap = indonesiaMapRaw as SvgMapDataset;

const GRAD = {
  primary: 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white',
  primaryStatic: 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white',
  info: 'bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] hover:from-[#0284c7] hover:to-[#0369a1] text-white',
  warning: 'bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:from-[#ea580c] hover:to-[#b45309] text-white',
  danger: 'bg-gradient-to-r from-[#ef4444] to-[#b91c1c] hover:from-[#dc2626] hover:to-[#991b1b] text-white',
  success: 'bg-gradient-to-r from-[#22c55e] to-[#15803d] hover:from-[#16a34a] hover:to-[#166534] text-white',
  light: 'bg-gradient-to-r from-[#f8fafc] to-[#e2e8f0] text-slate-800 border border-slate-200/80',
};

interface SentInquiry {
  id: string;
  department: string;
  subject: string;
  priority: 'Normal' | 'Urgent';
  time: string;
}

const OFFICE_PINS = [
  { id: 'id-jk', label: 'Jakarta HQ', city: 'Menara Sudirman, Jakarta Selatan', x: 188.7, y: 237.0 },
  { id: 'id-ji', label: 'Surabaya Hub', city: 'Pakuwon Tower, Surabaya', x: 311.1, y: 257.6 },
  { id: 'id-ba', label: 'Bali Studio', city: 'Renon Tech Park, Denpasar', x: 345.4, y: 273.6 },
];

export function ContactView() {
  const [name, setName] = useState('Fahmi Ibrahim');
  const [email, setEmail] = useState('fahmi@velora-ui.dev');
  const [department, setDepartment] = useState('Sales & Enterprise');
  const [priority, setPriority] = useState<'Normal' | 'Urgent'>('Normal');
  const [subject, setSubject] = useState('Konsultasi Lisensi Multi-Cabang Velora UI');
  const [message, setMessage] = useState(
    'Halo tim Velora, kami berencana menerapkan template dashboard ini untuk 12 cabang regional kami. Mohon jadwal demo dan penawaran resmi.'
  );
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeOfficeId, setActiveOfficeId] = useState('id-jk');
  const [sentHistory, setSentHistory] = useState<SentInquiry[]>([
    {
      id: 'INQ-882',
      department: 'Technical Support',
      subject: 'Pertanyaan integrasi API ChartJS & WebSockets',
      priority: 'Normal',
      time: 'Kemarin · 14:20',
    },
  ]);

  const copyContact = (val: string, key: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    showToast(`${key} disalin ke clipboard.`, 'success');
    setTimeout(() => setCopiedKey(null), 1600);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      showToast('Mohon lengkapi seluruh kolom formulir kontak.', 'warning');
      return;
    }
    const nextItem: SentInquiry = {
      id: `INQ-${883 + sentHistory.length}`,
      department,
      subject: subject.trim(),
      priority,
      time: 'Baru saja',
    };
    setSentHistory((prev) => [nextItem, ...prev]);
    await showSuccess('Pesan Terkirim!', `Tim ${department} akan membalas ke ${email} dalam < 2 jam kerja.`);
  };

  const activeOffice = OFFICE_PINS.find((o) => o.id === activeOfficeId) ?? OFFICE_PINS[0];

  return (
    <div className="space-y-6">
      <FeatureSectionHeader
        title="Contact"
        description="Hubungi tim penjualan, dukungan teknis, atau kantor cabang Velora UI dan kirimkan pesan konsultasi langsung."
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* LEFT: Direct Channels & Office Map */}
        <div className="xl:col-span-5 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-xs ${GRAD.primaryStatic}`}>
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Saluran Dukungan Langsung</h3>
                  <p className="text-[11px] text-slate-600">Respons rata-rata di bawah 15 menit</p>
                </div>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${GRAD.success}`}>
                Online
              </span>
            </div>

            <div className="space-y-2.5">
              {[
                { key: 'Email Resmi', value: 'support@velora-ui.dev', icon: Mail },
                { key: 'Hotline Enterprise', value: '+62 21-5099-8820', icon: Phone },
                { key: 'Kantor Pusat', value: 'Sudirman CBD Kav 52-53, Jakarta', icon: MapPin },
                { key: 'Jam Operasional', value: 'Senin – Jumat, 08:30 – 17:30 WIB', icon: Clock },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.key}
                    className="p-3 rounded-xl border border-slate-200/80 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className="w-4 h-4 text-[#175cd3] shrink-0" />
                      <div className="min-w-0">
                        <div className="text-[11px] text-slate-500">{item.key}</div>
                        <div className="text-xs font-semibold text-slate-900 truncate">{item.value}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyContact(item.value, item.key)}
                      className={`p-1.5 rounded-lg cursor-pointer shrink-0 ${GRAD.light}`}
                      title={`Salin ${item.key}`}
                    >
                      {copiedKey === item.key ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Nusantara Office Map Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#175cd3]" /> Lokasi Kantor & Studio
              </h3>
              <div className="flex gap-1">
                {OFFICE_PINS.map((pin) => (
                  <button
                    key={pin.id}
                    type="button"
                    onClick={() => setActiveOfficeId(pin.id)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-semibold cursor-pointer ${
                      activeOfficeId === pin.id ? GRAD.primaryStatic : GRAD.light
                    }`}
                  >
                    {pin.label.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-2">
              <svg viewBox={indonesiaMap.viewBox} className="w-full h-36" aria-label="Peta Kantor Velora UI">
                {indonesiaMap.locations.map((loc) => (
                  <path
                    key={loc.id}
                    d={loc.path}
                    fill={loc.id === activeOfficeId ? '#175cd3' : '#e2e8f0'}
                    stroke="#ffffff"
                    strokeWidth={0.6}
                  />
                ))}
                {OFFICE_PINS.map((pin) => (
                  <circle
                    key={pin.id}
                    cx={pin.x}
                    cy={pin.y}
                    r={pin.id === activeOfficeId ? 6 : 4}
                    fill={pin.id === activeOfficeId ? '#ef4444' : '#0ea5e9'}
                    stroke="#ffffff"
                    strokeWidth={1.5}
                    className="cursor-pointer"
                    onClick={() => setActiveOfficeId(pin.id)}
                  />
                ))}
              </svg>
            </div>

            <div className="text-xs text-slate-700 flex items-center justify-between gap-2">
              <strong className="text-slate-900">{activeOffice.label}</strong>
              <span className="text-slate-600">{activeOffice.city}</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Inquiry Form + Sent History */}
        <div className="xl:col-span-7 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Kirim Pesan atau Pertanyaan</h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Pilih departemen yang dituju agar permintaan Anda langsung diteruskan ke tim terkait.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700" htmlFor="ct-name">
                    Nama Lengkap
                  </label>
                  <input
                    id="ct-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700" htmlFor="ct-email">
                    Email Balasan
                  </label>
                  <input
                    id="ct-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700" htmlFor="ct-dept">
                    Departemen Tujuan
                  </label>
                  <select
                    id="ct-dept"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
                  >
                    <option value="Sales & Enterprise">Sales & Enterprise</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Billing & Partnership">Billing & Partnership</option>
                    <option value="Security Audit">Security Audit</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <span className="block text-xs font-semibold text-slate-700">Prioritas Penanganan</span>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Normal', 'Urgent'] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={`py-2 rounded-xl text-xs font-semibold cursor-pointer ${
                          priority === p
                            ? p === 'Urgent'
                              ? GRAD.danger
                              : GRAD.primary
                            : GRAD.light
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700" htmlFor="ct-sub">
                  Subjek Pesan
                </label>
                <input
                  id="ct-sub"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700" htmlFor="ct-msg">
                  Detail Pesan
                </label>
                <textarea
                  id="ct-msg"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
                />
              </div>

              <div className="pt-1 flex justify-end">
                <button
                  type="submit"
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold shadow-xs cursor-pointer ${GRAD.primary}`}
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Pesan Sekarang</span>
                </button>
              </div>
            </form>
          </div>

          {/* Sent Inquiry History */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#175cd3]" /> Riwayat Pesan Terkirim
            </h3>
            <div className="space-y-2">
              {sentHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${GRAD.primaryStatic}`}>
                      {item.id}
                    </span>
                    <span className="font-semibold text-slate-900 truncate">{item.subject}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${item.priority === 'Urgent' ? GRAD.danger : GRAD.info}`}>
                      {item.department}
                    </span>
                    <span className="text-[11px] text-slate-500">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
