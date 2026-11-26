import React, { useState } from 'react';
import {
  BellRing,
  Mail,
  Check,
  Sparkles,
  Zap,
  Crown,
  Rocket,
  ShieldCheck,
  ArrowRight,
  Users,
} from 'lucide-react';
import { showSuccess, showToast } from '../../lib/swal';
import { FeatureSectionHeader } from '../features/FeatureSectionHeader';

const GRAD = {
  primary: 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white',
  primaryStatic: 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white',
  info: 'bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] hover:from-[#0284c7] hover:to-[#0369a1] text-white',
  warning: 'bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:from-[#ea580c] hover:to-[#b45309] text-white',
  success: 'bg-gradient-to-r from-[#22c55e] to-[#15803d] hover:from-[#16a34a] hover:to-[#166534] text-white',
  light: 'bg-gradient-to-r from-[#f8fafc] to-[#e2e8f0] text-slate-800 border border-slate-200/80',
  dark: 'bg-gradient-to-r from-[#1e293b] to-[#020617] hover:from-[#0f172a] hover:to-[#000000] text-white',
};

const TOPICS = [
  'Rilis Komponen UI Baru',
  'Tips React 19 & TypeScript',
  'Patch Keamanan & RBAC',
  'Penawaran Lisensi Tahunan',
];

export function SubscribeView() {
  const [email, setEmail] = useState('fahmi@velora-ui.dev');
  const [frequency, setFrequency] = useState<'weekly' | 'monthly' | 'major'>('weekly');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([
    'Rilis Komponen UI Baru',
    'Patch Keamanan & RBAC',
  ]);
  const [subscribed, setSubscribed] = useState(false);

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [activePlan, setActivePlan] = useState<string>('Pro Growth');

  const toggleTopic = (t: string) => {
    setSelectedTopics((prev) =>
      prev.includes(t) ? prev.filter((item) => item !== t) : [...prev, t]
    );
  };

  const handleSubscribeNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      showToast('Masukkan alamat email yang valid untuk berlangganan.', 'warning');
      return;
    }
    setSubscribed(true);
    await showSuccess(
      'Berhasil Berlangganan!',
      `${email} terdaftar pada pembaruan ${frequency === 'weekly' ? 'mingguan' : frequency === 'monthly' ? 'bulanan' : 'rilis mayor'}.`
    );
  };

  const plans = [
    {
      name: 'Starter',
      desc: 'Ideal untuk proyek pribadi, prototipe cepat, dan eksplorasi komponen dasar.',
      monthlyPrice: 0,
      badge: 'Gratis',
      badgeGrad: GRAD.info,
      icon: Rocket,
      features: [
        'Hingga 3 pengguna admin aktif',
        'Akses 25+ komponen UI dasar',
        'Ekspor CSV & Print standar',
        'Dukungan komunitas GitHub',
      ],
    },
    {
      name: 'Pro Growth',
      desc: 'Untuk tim produk berkembang yang membutuhkan analitik, peta vektor, dan modul lengkap.',
      monthlyPrice: 490000,
      badge: 'Paling Populer',
      badgeGrad: GRAD.primaryStatic,
      icon: Zap,
      featured: true,
      features: [
        'Hingga 25 kursi tim kolaborator',
        'Seluruh 45+ modul Charts, Maps & Auth',
        'RBAC Policy & Audit Log Timeline',
        'Dukungan prioritas via Tiket (< 4 jam)',
      ],
    },
    {
      name: 'Enterprise',
      desc: 'Dirancang untuk perusahaan multi-cabang dengan keamanan kustom dan SLA terjamin.',
      monthlyPrice: 1490000,
      badge: 'Dedicated SLA',
      badgeGrad: GRAD.dark,
      icon: Crown,
      features: [
        'Pengguna & cabang regional tanpa batas',
        'SSO SAML 2.0 & 2FA TOTP wajib',
        'Backup harian terenkripsi & Webhook',
        'Account Manager & SLA Uptime 99.98%',
      ],
    },
  ];

  const getPriceLabel = (monthly: number) => {
    if (monthly === 0) return 'Rp 0';
    const finalPrice = billingCycle === 'annual' ? Math.round(monthly * 0.8) : monthly;
    return `Rp ${finalPrice.toLocaleString('id-ID')}`;
  };

  const choosePlan = async (planName: string) => {
    setActivePlan(planName);
    await showSuccess(
      `Paket ${planName} Dipilih`,
      `Siklus tagihan ${billingCycle === 'annual' ? 'Tahunan (Hemat 20%)' : 'Bulanan'} siap diaktifkan.`
    );
  };

  return (
    <div className="space-y-8">
      <FeatureSectionHeader
        title="Subscribe"
        description="Berlangganan buletin pembaruan fitur Velora UI atau pilih paket langganan workspace yang sesuai dengan skala tim Anda."
      />

      {/* 1. NEWSLETTER SUBSCRIPTION CARD */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs ${GRAD.primaryStatic}`}>
                <BellRing className="w-6 h-6" />
              </div>
              <div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${GRAD.info}`}>
                  Newsletter & Changelog
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  Dapatkan Update Modul & Tips Terbaru
                </h3>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pilih topik pembaruan yang paling relevan dengan pekerjaan Anda. Kami hanya mengirim email ringkas berkualitas tinggi tanpa spam.
            </p>

            <div className="flex flex-wrap gap-1.5">
              {TOPICS.map((topic) => {
                const selected = selectedTopics.includes(topic);
                return (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => toggleTopic(topic)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                      selected ? GRAD.primary : GRAD.light
                    }`}
                  >
                    {selected && <Check className="w-3 h-3" />}
                    <span>{topic}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubscribeNewsletter} className="lg:col-span-6 space-y-4 rounded-2xl border border-slate-200/80 p-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700" htmlFor="sub-email">
                Alamat Email Penerima
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="sub-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@perusahaan.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="block text-xs font-semibold text-slate-700">Frekuensi Pengiriman</span>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: 'weekly', label: 'Mingguan' },
                    { id: 'monthly', label: 'Bulanan' },
                    { id: 'major', label: 'Rilis Mayor' },
                  ] as const
                ).map((freq) => (
                  <button
                    key={freq.id}
                    type="button"
                    onClick={() => setFrequency(freq.id)}
                    className={`py-2 rounded-xl text-xs font-semibold cursor-pointer ${
                      frequency === freq.id ? GRAD.primary : GRAD.light
                    }`}
                  >
                    {freq.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-2.5 rounded-xl text-xs font-semibold shadow-xs cursor-pointer flex items-center justify-center gap-2 ${
                subscribed ? GRAD.success : GRAD.primary
              }`}
            >
              {subscribed ? <Check className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              <span>{subscribed ? 'Langganan Aktif!' : 'Berlangganan Sekarang'}</span>
            </button>
          </form>
        </div>
      </div>

      {/* 2. SAAS PRICING & PLAN UPGRADE */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#175cd3]" /> Pilihan Paket Langganan Workspace
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Paket aktif saat ini: <strong className="text-[#175cd3]">{activePlan}</strong>
            </p>
          </div>

          <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white p-1 shadow-xs self-start">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                billingCycle === 'monthly' ? GRAD.primaryStatic : 'text-slate-600'
              }`}
            >
              Bulanan
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('annual')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                billingCycle === 'annual' ? GRAD.primaryStatic : 'text-slate-600'
              }`}
            >
              <span>Tahunan</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] ${billingCycle === 'annual' ? 'bg-white/20 text-white' : GRAD.success}`}>
                -20%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isCurrent = activePlan === plan.name;
            return (
              <div
                key={plan.name}
                className={`bg-white rounded-2xl border p-6 flex flex-col justify-between gap-6 transition-all ${
                  plan.featured
                    ? 'border-[#175cd3] shadow-sm'
                    : 'border-slate-200/90 shadow-xs hover:border-slate-300'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-xs ${plan.badgeGrad}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${plan.badgeGrad}`}>
                      {plan.badge}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-slate-900">{plan.name}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{plan.desc}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-extrabold text-slate-900">
                        {getPriceLabel(plan.monthlyPrice)}
                      </span>
                      {plan.monthlyPrice > 0 && (
                        <span className="text-xs text-slate-500">/ bulan</span>
                      )}
                    </div>
                  </div>

                  <ul className="space-y-2.5 pt-1">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2 text-xs text-slate-700">
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${GRAD.success}`}>
                          <Check className="w-2.5 h-2.5" />
                        </span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => choosePlan(plan.name)}
                  className={`w-full py-2.5 rounded-xl text-xs font-semibold shadow-xs cursor-pointer flex items-center justify-center gap-1.5 ${
                    isCurrent
                      ? GRAD.success
                      : plan.featured
                        ? GRAD.primary
                        : GRAD.light
                  }`}
                >
                  {isCurrent ? (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Paket Aktif</span>
                    </>
                  ) : (
                    <>
                      <span>Pilih Paket {plan.name}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
