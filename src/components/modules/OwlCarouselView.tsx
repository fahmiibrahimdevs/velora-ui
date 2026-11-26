import { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Star,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { showToast } from '../../lib/swal';

const GRAD = {
  primary: 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white',
  primaryStatic: 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white',
  infoStatic: 'bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] text-white',
  successStatic: 'bg-gradient-to-r from-[#22c55e] to-[#15803d] text-white',
  warningStatic: 'bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white',
  light: 'bg-gradient-to-r from-[#f8fafc] to-[#e2e8f0] text-slate-800 border border-slate-200/80',
};

const HERO_SLIDES = [
  {
    id: 1,
    badge: 'Featured Release',
    title: 'Velora UI Enterprise System v2.5',
    desc: 'Antarmuka admin modern berbasis React 19 & Tailwind v4 dengan performa render ultra-cepat dan konsistensi komponen tinggi.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 2,
    badge: 'Analytics Suite',
    title: 'Visualisasi Data Real-time & ChartJS',
    desc: 'Pantau KPI bisnis melalui 10 tipe grafik interaktif, sparklines tabel, dan ekspor laporan instan.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 3,
    badge: 'Developer Experience',
    title: 'Modular Architecture & Clean Code',
    desc: 'Struktur komponen terpisah yang siap dikembangkan lebih lanjut bersama tim frontend maupun backend.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
  },
];

const PRODUCT_CARDS = [
  {
    id: 'p1',
    title: 'Cloud Infrastructure Pro',
    tag: 'Infrastructure',
    price: 'Rp 1.450.000/bln',
    rating: 4.9,
    tagGrad: GRAD.primaryStatic,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'p2',
    title: 'Design System Figma Kit',
    tag: 'UI/UX Kit',
    price: 'Rp 790.000',
    rating: 4.8,
    tagGrad: GRAD.infoStatic,
    image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'p3',
    title: 'Realtime Telemetry SDK',
    tag: 'Monitoring',
    price: 'Rp 950.000/bln',
    rating: 5.0,
    tagGrad: GRAD.successStatic,
    image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'p4',
    title: 'Automated Security Audit',
    tag: 'Security',
    price: 'Rp 1.200.000',
    rating: 4.7,
    tagGrad: GRAD.warningStatic,
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'p5',
    title: 'Enterprise Auth Gateway',
    tag: 'Identity',
    price: 'Rp 1.100.000/bln',
    rating: 4.9,
    tagGrad: GRAD.primaryStatic,
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
  },
];

const TESTIMONIALS = [
  {
    name: 'Nadia Kusuma',
    role: 'Head of Product, Nusantara Tech',
    quote: 'Velora UI memangkas waktu pengembangan dashboard internal kami hingga 60% tanpa mengorbankan estetika.',
  },
  {
    name: 'Rizky Pratama',
    role: 'Principal Engineer, CloudID',
    quote: 'Komponen Forms, DataTables, dan Editor-nya sangat matang, responsif, dan mudah diintegrasikan dengan API.',
  },
  {
    name: 'Siti Rahmawati',
    role: 'UI/UX Lead, Studio Bandung',
    quote: 'Konsistensi palet gradien dan clean white cards membuat seluruh modul terlihat seperti satu produk premium.',
  },
];

const GALLERY_THUMBS = [
  {
    title: 'Workspace Kolaborasi Modern',
    caption: 'Ruang kerja kreatif tim desain & rekayasa perangkat lunak.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80',
  },
  {
    title: 'Arsitektur Cloud Terdistribusi',
    caption: 'Monitoring node server real-time lintas wilayah Asia Tenggara.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80',
  },
  {
    title: 'Desain Mobile & Web Adaptif',
    caption: 'Pengalaman pengguna yang mulus dari layar ponsel hingga monitor ultrawide.',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1000&q=80',
  },
  {
    title: 'Analitik Performa Bisnis',
    caption: 'Pengambilan keputusan berbasis data dengan laporan komprehensif.',
    image: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&w=1000&q=80',
  },
];

export function OwlCarouselView() {
  // 1. Hero Carousel
  const [heroIdx, setHeroIdx] = useState(0);
  const [heroAutoplay, setHeroAutoplay] = useState(true);

  useEffect(() => {
    if (!heroAutoplay) return;
    const t = window.setInterval(() => {
      setHeroIdx((i) => (i + 1) % HERO_SLIDES.length);
    }, 4200);
    return () => window.clearInterval(t);
  }, [heroAutoplay]);

  // 2. Multi-Item Product Carousel
  const [prodOffset, setProdOffset] = useState(0);
  const maxProdOffset = PRODUCT_CARDS.length - 3;

  // 3. Center-Focused Testimonial Carousel
  const [testiIdx, setTestiIdx] = useState(1);

  // 4. Thumbnail Synced Gallery Carousel
  const [thumbIdx, setThumbIdx] = useState(0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Sub-header */}
      <div className="flex items-start gap-3">
        <div className="w-8 h-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full mt-2 shrink-0" />
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Owl Carousel</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            4 variasi slider interaktif: Hero Banner Autoplay, Multi-Card Product Slider, Center-Focus Testimonial, dan Thumbnail-Synced Gallery.
          </p>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 1. HERO BANNER CAROUSEL */}
      {/* ===================================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-[#175cd3]">1. Hero Banner Carousel (Autoplay)</h3>
            <p className="text-xs text-slate-500">Slide penuh dengan tombol navigasi, indikator titik, dan Play/Pause.</p>
          </div>
          <button
            type="button"
            onClick={() => setHeroAutoplay(!heroAutoplay)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
              heroAutoplay ? GRAD.primary : GRAD.light
            }`}
          >
            {heroAutoplay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{heroAutoplay ? 'Autoplay Aktif' : 'Autoplay Dijeda'}</span>
          </button>
        </div>

        <div className="relative rounded-2xl overflow-hidden border border-slate-200 h-72 sm:h-80">
          <div
            style={{ transform: `translateX(-${heroIdx * 100}%)` }}
            className="flex h-full transition-transform duration-500 ease-out"
          >
            {HERO_SLIDES.map((s) => (
              <div key={s.id} className="w-full h-full shrink-0 relative">
                <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/60 to-transparent flex items-center p-6 sm:p-10">
                  <div className="max-w-lg space-y-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${GRAD.primaryStatic}`}>
                      <Sparkles className="w-3 h-3" />
                      {s.badge}
                    </span>
                    <h4 className="text-xl sm:text-2xl font-bold text-white leading-tight">{s.title}</h4>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{s.desc}</p>
                    <button
                      type="button"
                      onClick={() => showToast(`Membuka detail: ${s.title}`, 'info')}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold shadow-sm cursor-pointer ${GRAD.primary}`}
                    >
                      <span>Pelajari Lebih Lanjut</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setHeroIdx((i) => (i - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md flex items-center justify-center cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => setHeroIdx((i) => (i + 1) % HERO_SLIDES.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md flex items-center justify-center cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            {HERO_SLIDES.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setHeroIdx(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  heroIdx === idx ? `w-7 ${GRAD.primaryStatic}` : 'w-2 bg-white/60 hover:bg-white'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. MULTI-CARD PRODUCT CAROUSEL */}
      {/* ===================================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-[#175cd3]">2. Multi-Item Product Carousel</h3>
            <p className="text-xs text-slate-500">Menampilkan 3 kartu produk sekaligus dengan navigasi geser halus.</p>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={prodOffset <= 0}
              onClick={() => setProdOffset((o) => Math.max(0, o - 1))}
              className={`p-2 rounded-xl cursor-pointer disabled:opacity-40 ${GRAD.light}`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={prodOffset >= maxProdOffset}
              onClick={() => setProdOffset((o) => Math.min(maxProdOffset, o + 1))}
              className={`p-2 rounded-xl cursor-pointer disabled:opacity-40 ${GRAD.primary}`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden">
          <div
            style={{ transform: `translateX(-${prodOffset * (100 / 3)}%)` }}
            className="flex transition-transform duration-300 ease-out -mx-2"
          >
            {PRODUCT_CARDS.map((p) => (
              <div key={p.id} className="w-full md:w-1/3 shrink-0 px-2">
                <div className="rounded-2xl border border-slate-200/80 overflow-hidden bg-white hover:shadow-sm transition-shadow">
                  <img src={p.image} alt={p.title} className="w-full h-40 object-cover" />
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${p.tagGrad}`}>
                        {p.tag}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        {p.rating}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 truncate">{p.title}</h4>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-bold text-[#175cd3]">{p.price}</span>
                      <button
                        type="button"
                        onClick={() => showToast(`Produk "${p.title}" ditambahkan.`, 'success')}
                        className={`px-3 py-1 rounded-lg text-[11px] font-semibold cursor-pointer ${GRAD.primary}`}
                      >
                        Pilih
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* ROW 3: CENTER-FOCUSED TESTIMONIAL + THUMBNAIL GALLERY CAROUSEL */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* 3. Center-Focused Testimonial */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#175cd3]">3. Center-Focus Testimonial</h3>
              <p className="text-xs text-slate-500">Kartu aktif disorot di tengah dengan gradien border.</p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setTestiIdx((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
                className={`p-1.5 rounded-lg cursor-pointer ${GRAD.light}`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setTestiIdx((i) => (i + 1) % TESTIMONIALS.length)}
                className={`p-1.5 rounded-lg cursor-pointer ${GRAD.primary}`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {TESTIMONIALS.map((item, idx) => {
              const active = idx === testiIdx;
              return (
                <div
                  key={item.name}
                  onClick={() => setTestiIdx(idx)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    active
                      ? 'border-[#175cd3] bg-blue-50/30 shadow-sm scale-[1.01]'
                      : 'border-slate-200/70 opacity-65 hover:opacity-100'
                  }`}
                >
                  <p className="text-xs text-slate-700 italic leading-relaxed">&ldquo;{item.quote}&rdquo;</p>
                  <div className="mt-2.5 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900">{item.name}</div>
                      <div className="text-[11px] text-slate-500">{item.role}</div>
                    </div>
                    {active && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${GRAD.primaryStatic}`}>
                        Active
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Thumbnail Synced Gallery Carousel */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-[#175cd3]">4. Thumbnail-Synced Gallery</h3>
            <p className="text-xs text-slate-500">Klik thumbnail di bawah untuk berpindah ke slide utama terkait.</p>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-slate-200 h-56">
            <img
              src={GALLERY_THUMBS[thumbIdx].image}
              alt={GALLERY_THUMBS[thumbIdx].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-900/40 to-transparent p-4">
              <div className="text-sm font-bold text-white">{GALLERY_THUMBS[thumbIdx].title}</div>
              <div className="text-xs text-slate-200">{GALLERY_THUMBS[thumbIdx].caption}</div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2.5">
            {GALLERY_THUMBS.map((g, idx) => (
              <button
                key={g.title}
                type="button"
                onClick={() => setThumbIdx(idx)}
                className={`rounded-xl overflow-hidden border-2 transition-all cursor-pointer h-16 ${
                  thumbIdx === idx ? 'border-[#175cd3] ring-2 ring-[#175cd3]/20' : 'border-transparent opacity-65 hover:opacity-100'
                }`}
              >
                <img src={g.image} alt={g.title} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
