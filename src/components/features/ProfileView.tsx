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
} from 'lucide-react';
import { showSuccess } from '../../lib/swal';

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

export function ProfileView() {
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
  const [twoFactor, setTwoFactor] = useState(true);

  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'FI';

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await showSuccess('Profil Diperbarui', `Informasi akun ${firstName} ${lastName} telah disimpan.`);
  };

  return (
    <div className="space-y-6">
      {/* Executive Profile Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className={`h-28 sm:h-32 px-6 py-4 flex items-start justify-end ${GRAD.primaryStatic}`}>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs border border-white/25 text-[11px] font-semibold">
            <UserCheck className="w-3.5 h-3.5" /> Verified Enterprise Admin
          </span>
        </div>

        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-10">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <div
                className={`w-20 h-20 rounded-2xl border-4 border-white shadow-md flex items-center justify-center text-2xl font-bold shrink-0 ${GRAD.dark}`}
              >
                {initials}
              </div>
              <div className="pt-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900">
                    {firstName} {lastName}
                  </h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${GRAD.success}`}>
                    Active
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-[#175cd3]" /> {roleTitle}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#175cd3]" /> {location}
                  </span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-2 border-t md:border-t-0 border-slate-100">
              <div className="text-center">
                <div className="text-lg font-bold text-slate-900">142</div>
                <div className="text-[11px] text-slate-600">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-slate-900">6.8K</div>
                <div className="text-[11px] text-slate-600">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-slate-900">28</div>
                <div className="text-[11px] text-slate-600">Projects</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Split Profile Summary & Edit Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Tentang & Kontak</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{bio}</p>

            <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2.5 text-slate-700">
                <Mail className="w-4 h-4 text-[#175cd3]" />
                <span>{email}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-700">
                <Phone className="w-4 h-4 text-[#175cd3]" />
                <span>{phone}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-700">
                <Globe className="w-4 h-4 text-[#175cd3]" />
                <span>{website}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="text-xs font-semibold text-slate-800">Keahlian Utama</div>
              <div className="flex flex-wrap gap-1.5">
                {['React 19', 'TypeScript', 'Tailwind v4', 'Laravel', 'Design Systems', 'ChartJS'].map((skill) => (
                  <span key={skill} className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${GRAD.info}`}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#175cd3]" /> Pencapaian Terkini
            </h3>
            <div className="space-y-2.5 text-xs">
              {[
                { label: 'Velora UI Release v2.5', detail: '40+ Modul Selesai', grad: GRAD.success },
                { label: 'Zero Lint Warnings Streak', detail: '33 Files Clean', grad: GRAD.primaryStatic },
                { label: 'Uptime SLA Monitor', detail: '99.98% Bulanan', grad: GRAD.info },
              ].map((ach) => (
                <div key={ach.label} className="p-3 rounded-xl border border-slate-200/80 flex items-center justify-between gap-2">
                  <span className="font-semibold text-slate-800">{ach.label}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${ach.grad}`}>
                    {ach.detail}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
          <form onSubmit={handleSave} className="space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Edit Informasi Profil</h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Perubahan akan langsung disinkronkan ke tampilan kartu profil Anda.
              </p>
            </div>

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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <label className="p-3 rounded-xl border border-slate-200/80 flex items-center justify-between gap-2 text-xs cursor-pointer">
                <span className="font-semibold text-slate-700">Langganan Laporan Mingguan</span>
                <input
                  type="checkbox"
                  checked={newsletter}
                  onChange={(e) => setNewsletter(e.target.checked)}
                  className="w-4 h-4 accent-[#175cd3] cursor-pointer"
                />
              </label>
              <label className="p-3 rounded-xl border border-slate-200/80 flex items-center justify-between gap-2 text-xs cursor-pointer">
                <span className="font-semibold text-slate-700">Autentikasi Dua Faktor (2FA)</span>
                <input
                  type="checkbox"
                  checked={twoFactor}
                  onChange={(e) => setTwoFactor(e.target.checked)}
                  className="w-4 h-4 accent-[#175cd3] cursor-pointer"
                />
              </label>
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
        </div>
      </div>
    </div>
  );
}
