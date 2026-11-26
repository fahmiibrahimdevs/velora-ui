import React, { useState } from 'react';
import {
  Globe,
  MailCheck,
  Database,
  KeyRound,
  Cpu,
  Sliders,
  ArrowRight,
  Save,
  RotateCcw,
} from 'lucide-react';
import { showSuccess, showToast } from '../../lib/swal';
import { FeatureSectionHeader } from './FeatureSectionHeader';

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

type SettingSectionId = 'general' | 'seo' | 'email' | 'system' | 'security' | 'automation';

interface SettingCategoryCard {
  id: SettingSectionId;
  title: string;
  desc: string;
  status: string;
  statusGrad: string;
  iconGrad: string;
  icon: typeof Sliders;
}

const SETTING_CATEGORIES: SettingCategoryCard[] = [
  {
    id: 'general',
    title: 'General Settings',
    desc: 'Pengaturan identitas aplikasi, judul situs, zona waktu default, logo, dan format tanggal global.',
    status: 'Configured',
    statusGrad: GRAD.success,
    iconGrad: GRAD.primaryStatic,
    icon: Sliders,
  },
  {
    id: 'seo',
    title: 'SEO & Analytics',
    desc: 'Konfigurasi meta deskripsi, OpenGraph banner, pelacakan Google Analytics 4, dan verifikasi sitemap.',
    status: 'Active',
    statusGrad: GRAD.info,
    iconGrad: GRAD.info,
    icon: Globe,
  },
  {
    id: 'email',
    title: 'Email & SMTP Gateway',
    desc: 'Kredensial server SMTP, sender address resmi, enkripsi TLS, serta template notifikasi sistem.',
    status: 'Verified',
    statusGrad: GRAD.success,
    iconGrad: GRAD.warning,
    icon: MailCheck,
  },
  {
    id: 'system',
    title: 'System & Storage',
    desc: 'Manajemen cache aplikasi, penyimpanan objek S3/lokal, batas unggahan berkas, dan backup terjadwal.',
    status: 'Healthy',
    statusGrad: GRAD.success,
    iconGrad: GRAD.dark,
    icon: Database,
  },
  {
    id: 'security',
    title: 'Security & Authentication',
    desc: 'Masa berlaku sesi token JWT, rotasi kunci API, whitelist IP admin, dan kebijakan 2FA wajib.',
    status: 'Strict Mode',
    statusGrad: GRAD.warning,
    iconGrad: GRAD.danger,
    icon: KeyRound,
  },
  {
    id: 'automation',
    title: 'Automation & Webhooks',
    desc: 'Penjadwalan cron worker, endpoint webhook outbound, serta batas percobaan ulang otomatis.',
    status: '3 Active',
    statusGrad: GRAD.info,
    iconGrad: GRAD.success,
    icon: Cpu,
  },
];

// ============================================================================
// 1. SETTINGS DIRECTORY HUB (#/settings)
// ============================================================================
export function SettingsView({
  onOpenDetail,
}: {
  onOpenDetail: (section: SettingSectionId) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <FeatureSectionHeader
          title="Settings"
          description="Pilih kategori konfigurasi untuk mengubah parameter aplikasi secara terperinci di halaman Setting Detail."
        />
        <button
          type="button"
          onClick={() => onOpenDetail('general')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold shadow-xs cursor-pointer shrink-0 ${GRAD.primary}`}
        >
          <span>Buka Setting Detail</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {SETTING_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 flex flex-col justify-between gap-5 hover:border-[#175cd3]/50 transition-all"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs ${cat.iconGrad}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${cat.statusGrad}`}>
                    {cat.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">{cat.title}</h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{cat.desc}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => onOpenDetail(cat.id)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#175cd3] hover:underline cursor-pointer"
                >
                  <span>Ubah Pengaturan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// 2. SETTING DETAIL SPLIT FORM (#/setting-detail)
// ============================================================================
export function SettingDetailView({
  initialSection = 'general',
}: {
  initialSection?: SettingSectionId;
}) {
  const [activeTab, setActiveTab] = useState<SettingSectionId>(initialSection);
  const [siteTitle, setSiteTitle] = useState('Velora UI Admin Console');
  const [siteDesc, setSiteDesc] = useState(
    'Template admin dashboard modern berbasis React 19 & Tailwind CSS v4.'
  );
  const [timezone, setTimezone] = useState('Asia/Jakarta (UTC+07:00)');
  const [gaCode, setGaCode] = useState('G-VELORA2026');
  const [smtpHost, setSmtpHost] = useState('smtp.velora-ui.dev');
  const [smtpPort, setSmtpPort] = useState('587');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const [sessionMinutes, setSessionMinutes] = useState('120');

  const currentMeta = SETTING_CATEGORIES.find((c) => c.id === activeTab) ?? SETTING_CATEGORIES[0];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await showSuccess(
      'Pengaturan Disimpan!',
      `Konfigurasi pada bagian ${currentMeta.title} berhasil diperbarui.`
    );
  };

  const handleReset = () => {
    setSiteTitle('Velora UI Admin Console');
    setTimezone('Asia/Jakarta (UTC+07:00)');
    setMaintenanceMode(false);
    setAutoBackup(true);
    showToast('Nilai konfigurasi dikembalikan ke default.', 'info');
  };

  return (
    <div className="space-y-6">
      <FeatureSectionHeader
        title="Setting Detail"
        description="Kelola konfigurasi teknis aplikasi per bagian mulai dari umum, SEO, email SMTP, penyimpanan, hingga keamanan."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Vertical Tab Selector */}
      <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 h-fit space-y-2">
        <div className="px-2 pb-2 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Jump To Section</h3>
          <p className="text-[11px] text-slate-600 mt-0.5">Navigasi kategori pengaturan sistem</p>
        </div>
        <div className="space-y-1.5 pt-1">
          {SETTING_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const active = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveTab(cat.id)}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between gap-2 cursor-pointer transition-all ${
                  active ? `${GRAD.primaryStatic} shadow-xs` : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{cat.title}</span>
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] ${
                    active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {cat.id.toUpperCase()}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Configuration Form */}
      <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
        <form onSubmit={handleSave} className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">{currentMeta.title}</h2>
              <p className="text-xs text-slate-600 mt-0.5">{currentMeta.desc}</p>
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${currentMeta.statusGrad}`}>
              {currentMeta.status}
            </span>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700" htmlFor="set-title">
                  Nama / Judul Situs
                </label>
                <input
                  id="set-title"
                  type="text"
                  value={siteTitle}
                  onChange={(e) => setSiteTitle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700" htmlFor="set-tz">
                  Zona Waktu Default
                </label>
                <select
                  id="set-tz"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
                >
                  <option value="Asia/Jakarta (UTC+07:00)">Asia/Jakarta (UTC+07:00)</option>
                  <option value="Asia/Makassar (UTC+08:00)">Asia/Makassar (UTC+08:00)</option>
                  <option value="Asia/Jayapura (UTC+09:00)">Asia/Jayapura (UTC+09:00)</option>
                  <option value="Asia/Singapore (UTC+08:00)">Asia/Singapore (UTC+08:00)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700" htmlFor="set-desc">
                Deskripsi Meta Global
              </label>
              <textarea
                id="set-desc"
                rows={3}
                value={siteDesc}
                onChange={(e) => setSiteDesc(e.target.value)}
                className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700" htmlFor="set-ga">
                  Google Analytics ID
                </label>
                <input
                  id="set-ga"
                  type="text"
                  value={gaCode}
                  onChange={(e) => setGaCode(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700" htmlFor="set-smtp">
                  SMTP Host
                </label>
                <input
                  id="set-smtp"
                  type="text"
                  value={smtpHost}
                  onChange={(e) => setSmtpHost(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700" htmlFor="set-port">
                  SMTP Port / Session (m)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    id="set-port"
                    type="text"
                    value={smtpPort}
                    onChange={(e) => setSmtpPort(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
                  />
                  <input
                    type="text"
                    value={sessionMinutes}
                    onChange={(e) => setSessionMinutes(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <label className="p-3.5 rounded-xl border border-slate-200/80 flex items-center justify-between gap-2 text-xs cursor-pointer">
                <div>
                  <div className="font-semibold text-slate-800">Mode Pemeliharaan (503)</div>
                  <div className="text-[11px] text-slate-500">Alihkan trafik publik ke halaman maintenance</div>
                </div>
                <input
                  type="checkbox"
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                  className="w-4 h-4 accent-[#175cd3] cursor-pointer"
                />
              </label>

              <label className="p-3.5 rounded-xl border border-slate-200/80 flex items-center justify-between gap-2 text-xs cursor-pointer">
                <div>
                  <div className="font-semibold text-slate-800">Backup Basis Data Otomatis</div>
                  <div className="text-[11px] text-slate-500">Snapshot harian ke cloud storage terenkripsi</div>
                </div>
                <input
                  type="checkbox"
                  checked={autoBackup}
                  onChange={(e) => setAutoBackup(e.target.checked)}
                  className="w-4 h-4 accent-[#175cd3] cursor-pointer"
                />
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleReset}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer ${GRAD.light}`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Default</span>
            </button>
            <button
              type="submit"
              className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold shadow-xs cursor-pointer ${GRAD.primary}`}
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
}
