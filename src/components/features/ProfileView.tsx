import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Save,
  UserCheck,
  Sparkles,
  Globe,
  Shield,
  Laptop,
  MessageSquare,
  UserPlus,
  Lock,
  Bell,
  Calendar,
  FolderGit2,
} from 'lucide-react';
import { showSuccess, showToast } from '../../lib/swal';
import { Avatar } from '../common/Avatar';
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

type ProfileTab = 'edit' | 'security' | 'notifications';

export function ProfileView() {
  const [activeTab, setActiveTab] = useState<ProfileTab>('edit');
  const [isFollowing, setIsFollowing] = useState(false);

  const [firstName, setFirstName] = useState('Fahmi');
  const [lastName, setLastName] = useState('Ibrahim');
  const [roleTitle, setRoleTitle] = useState('Principal Product Architect');
  const [email, setEmail] = useState('fahmi@velora-ui.dev');
  const [phone, setPhone] = useState('+62 812-8899-4410');
  const [location, setLocation] = useState('Jakarta Selatan, Indonesia');
  const [website, setWebsite] = useState('https://velora-ui.dev');
  const [bio, setBio] = useState(
    'Merancang sistem antarmuka modern berbasis React 19, Laravel, dan TypeScript dengan fokus performa tinggi serta keterbacaan visual eksekutif.'
  );
  const [newsletter, setNewsletter] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [ticketDigest, setTicketDigest] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'FI';

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await showSuccess('Profil Diperbarui', `Informasi akun ${firstName} ${lastName} telah disimpan.`);
  };

  const handleSaveSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword.length < 8) {
      showToast('Kata sandi baru minimal 8 karakter.', 'warning');
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    await showSuccess('Keamanan Diperbarui', 'Pengaturan 2FA dan kredensial keamanan tersimpan.');
  };

  return (
    <div className="space-y-6">
      <FeatureSectionHeader
        title="Profile"
        description="Profil administrator lengkap dengan statistik ringkas, daftar keahlian, pencapaian, serta pengaturan akun & keamanan."
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN (4 cols): Compact, Tightly Filled Profile Card */}
        <div className="xl:col-span-4 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            {/* Horizontal Left-Aligned Identity Block (Zero Empty Side Void) */}
            <div className="p-5 space-y-4">
              <div className="flex items-start gap-4">
                <Avatar
                  size="xl"
                  shape="rounded"
                  status="online"
                  initials={initials}
                  bg={GRAD.primaryStatic}
                />
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 truncate">
                      {firstName} {lastName}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${GRAD.success}`}>
                      Active
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#175cd3] flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{roleTitle}</span>
                  </p>
                  <p className="text-xs text-slate-600 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{location}</span>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${GRAD.info}`}>
                  <UserCheck className="w-3.5 h-3.5" /> Verified Admin
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                  <Calendar className="w-3.5 h-3.5" /> Bergabung Nov 2024
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsFollowing((v) => !v);
                    showToast(
                      !isFollowing ? `Anda mengikuti ${firstName}.` : `Berhenti mengikuti ${firstName}.`,
                      'info'
                    );
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold shadow-xs cursor-pointer inline-flex items-center justify-center gap-1.5 ${
                    isFollowing ? GRAD.success : GRAD.primary
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{isFollowing ? 'Mengikuti' : 'Ikuti Profil'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => showToast(`Membuka pesan langsung ke ${email}`, 'info')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold cursor-pointer inline-flex items-center justify-center gap-1.5 ${GRAD.light}`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Kirim Pesan</span>
                </button>
              </div>
            </div>

            {/* Clean 3-Column Divided Stat Bar */}
            <div className="grid grid-cols-3 divide-x divide-slate-100 border-y border-slate-100 py-3.5 bg-white">
              <div className="text-center px-2">
                <div className="text-base font-bold text-slate-900">142</div>
                <div className="text-[11px] text-slate-600">Posts</div>
              </div>
              <div className="text-center px-2">
                <div className="text-base font-bold text-slate-900">6.8K</div>
                <div className="text-[11px] text-slate-600">Followers</div>
              </div>
              <div className="text-center px-2">
                <div className="text-base font-bold text-slate-900">28</div>
                <div className="text-[11px] text-slate-600">Projects</div>
              </div>
            </div>

            {/* Bio + Contact Tiles + Skills */}
            <div className="p-5 space-y-4">
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Tentang Saya
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">{bio}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-2 pt-3 border-t border-slate-100">
                <div className="p-2.5 rounded-xl border border-slate-200/80 flex items-center gap-2.5 text-xs">
                  <Mail className="w-3.5 h-3.5 text-[#175cd3] shrink-0" />
                  <span className="text-slate-700 truncate font-medium">{email}</span>
                </div>
                <div className="p-2.5 rounded-xl border border-slate-200/80 flex items-center gap-2.5 text-xs">
                  <Phone className="w-3.5 h-3.5 text-[#175cd3] shrink-0" />
                  <span className="text-slate-700 font-medium">{phone}</span>
                </div>
                <div className="p-2.5 rounded-xl border border-slate-200/80 flex items-center gap-2.5 text-xs sm:col-span-2 xl:col-span-1">
                  <Globe className="w-3.5 h-3.5 text-[#175cd3] shrink-0" />
                  <span className="text-slate-700 truncate font-medium">{website}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Keahlian Utama
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {['React 19', 'TypeScript', 'Tailwind v4', 'Laravel', 'Design Systems', 'ChartJS'].map(
                    (skill) => (
                      <span
                        key={skill}
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${GRAD.primaryStatic}`}
                      >
                        {skill}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Achievements Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#175cd3]" /> Pencapaian Terkini
            </h3>
            <div className="space-y-2 text-xs">
              {[
                { label: 'Velora UI Release v2.5', detail: '40+ Modul Selesai', grad: GRAD.success },
                { label: 'Zero Lint Warnings Streak', detail: '39 Files Clean', grad: GRAD.primaryStatic },
                { label: 'Uptime SLA Monitor', detail: '99.98% Bulanan', grad: GRAD.info },
              ].map((ach) => (
                <div
                  key={ach.label}
                  className="p-2.5 rounded-xl border border-slate-200/80 flex items-center justify-between gap-2"
                >
                  <span className="font-semibold text-slate-800">{ach.label}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${ach.grad}`}>
                    {ach.detail}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (8 cols): Tabbed Profile Editor + Active Projects Strip */}
        <div className="xl:col-span-8 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            {/* Card Tabs Header */}
            <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Pengaturan Akun</h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Perubahan data langsung diperbarui pada kartu profil di sebelah kiri.
                </p>
              </div>

              <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
                {(
                  [
                    { id: 'edit', label: 'Edit Profil' },
                    { id: 'security', label: 'Keamanan & Sesi' },
                    { id: 'notifications', label: 'Preferensi' },
                  ] as const
                ).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                      activeTab === t.id ? `${GRAD.primaryStatic} shadow-xs` : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              {activeTab === 'edit' && (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-700" htmlFor="prof-first">
                        Nama Depan
                      </label>
                      <input
                        id="prof-first"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-700" htmlFor="prof-last">
                        Nama Belakang
                      </label>
                      <input
                        id="prof-last"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-700" htmlFor="prof-role">
                        Jabatan / Peran
                      </label>
                      <input
                        id="prof-role"
                        type="text"
                        value={roleTitle}
                        onChange={(e) => setRoleTitle(e.target.value)}
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-700" htmlFor="prof-loc">
                        Lokasi
                      </label>
                      <input
                        id="prof-loc"
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-700" htmlFor="prof-email">
                        Email
                      </label>
                      <input
                        id="prof-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-700" htmlFor="prof-phone">
                        No. Telepon
                      </label>
                      <input
                        id="prof-phone"
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700" htmlFor="prof-web">
                      Situs Web
                    </label>
                    <input
                      id="prof-web"
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700" htmlFor="prof-bio">
                      Bio Singkat
                    </label>
                    <textarea
                      id="prof-bio"
                      rows={4}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold shadow-xs cursor-pointer ${GRAD.primary}`}
                    >
                      <Save className="w-4 h-4" />
                      <span>Simpan Perubahan Profil</span>
                    </button>
                  </div>
                </form>
              )}

              {activeTab === 'security' && (
                <form onSubmit={handleSaveSecurity} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-700" htmlFor="sec-curr">
                        Kata Sandi Saat Ini
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          id="sec-curr"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-700" htmlFor="sec-new">
                        Kata Sandi Baru
                      </label>
                      <div className="relative">
                        <Shield className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          id="sec-new"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Minimal 8 karakter"
                          className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
                        />
                      </div>
                    </div>
                  </div>

                  <label className="p-3.5 rounded-xl border border-slate-200/80 flex items-center justify-between gap-2 text-xs cursor-pointer">
                    <div>
                      <div className="font-semibold text-slate-800">Autentikasi Dua Faktor (2FA TOTP)</div>
                      <div className="text-[11px] text-slate-500">
                        Lindungi login admin menggunakan aplikasi Authenticator
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={twoFactor}
                      onChange={(e) => setTwoFactor(e.target.checked)}
                      className="w-4 h-4 accent-[#175cd3] cursor-pointer"
                    />
                  </label>

                  <div className="space-y-2.5">
                    <div className="text-xs font-bold text-slate-800">Perangkat Aktif</div>
                    {[
                      { dev: 'Chrome 131 · Linux Desktop', loc: 'Jakarta, ID', current: true },
                      { dev: 'Safari 18 · MacBook Pro', loc: 'Bandung, ID', current: false },
                    ].map((s) => (
                      <div
                        key={s.dev}
                        className="p-3.5 rounded-xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <Laptop className="w-4 h-4 text-[#175cd3]" />
                          <div>
                            <div className="font-semibold text-slate-900">{s.dev}</div>
                            <div className="text-[11px] text-slate-500">{s.loc}</div>
                          </div>
                        </div>
                        {s.current ? (
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${GRAD.success}`}>
                            Sesi Ini
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => showToast(`Sesi ${s.dev} telah dicabut.`, 'info')}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer ${GRAD.danger}`}
                          >
                            Cabut Sesi
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold shadow-xs cursor-pointer ${GRAD.primary}`}
                    >
                      <Save className="w-4 h-4" />
                      <span>Simpan Keamanan</span>
                    </button>
                  </div>
                </form>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-4">
                  {[
                    {
                      title: 'Laporan Ringkasan Mingguan',
                      desc: 'Kirim rekap analitik dashboard setiap hari Senin pagi ke email.',
                      checked: newsletter,
                      toggle: () => setNewsletter((v) => !v),
                    },
                    {
                      title: 'Peringatan Login & Keamanan RBAC',
                      desc: 'Notifikasi instan saat ada login dari perangkat atau lokasi baru.',
                      checked: securityAlerts,
                      toggle: () => setSecurityAlerts((v) => !v),
                    },
                    {
                      title: 'Ringkasan Harian Tiket Support',
                      desc: 'Dapatkan daftar tiket prioritas tinggi yang belum ditanggapi.',
                      checked: ticketDigest,
                      toggle: () => setTicketDigest((v) => !v),
                    },
                  ].map((pref) => (
                    <label
                      key={pref.title}
                      className="p-4 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3 cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <Bell className="w-4 h-4 text-[#175cd3] mt-0.5 shrink-0" />
                        <div>
                          <div className="text-xs font-bold text-slate-900">{pref.title}</div>
                          <div className="text-[11px] text-slate-600 mt-0.5">{pref.desc}</div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={pref.checked}
                        onChange={pref.toggle}
                        className="w-4 h-4 accent-[#175cd3] cursor-pointer"
                      />
                    </label>
                  ))}

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() =>
                        showSuccess('Preferensi Disimpan', 'Pengaturan notifikasi Anda telah diperbarui.')
                      }
                      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold shadow-xs cursor-pointer ${GRAD.primary}`}
                    >
                      <Save className="w-4 h-4" />
                      <span>Simpan Preferensi</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Harmonized Bottom Projects Card on Right Column */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-[#175cd3]" /> Proyek Aktif yang Dikelola
              </h3>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${GRAD.info}`}>
                3 Aktif
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { name: 'Velora UI v2.5', progress: 92, tag: 'Design System', grad: GRAD.primaryStatic },
                { name: 'HRM Payroll Core', progress: 78, tag: 'Laravel 12', grad: GRAD.info },
                { name: 'Analytics Vector Engine', progress: 100, tag: 'Completed', grad: GRAD.success },
              ].map((proj) => (
                <div key={proj.name} className="p-3.5 rounded-xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 truncate">{proj.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${proj.grad}`}>
                      {proj.progress}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className={`h-full rounded-full ${proj.grad}`} style={{ width: `${proj.progress}%` }} />
                  </div>
                  <div className="text-[11px] text-slate-500">{proj.tag}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
