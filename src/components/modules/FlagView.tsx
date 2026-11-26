import React, { useState, useMemo } from 'react';
import { Search, Copy, Check, Globe } from 'lucide-react';
import { showToast } from '../../lib/swal';

// ============================================================================
// CRISP VECTOR COUNTRY FLAGS (Zero external CDN / OS emoji dependency)
// ============================================================================

type Continent = 'Asia' | 'Europe' | 'Americas' | 'Oceania' | 'Middle East';

interface CountryFlagDef {
  code: string;
  name: string;
  continent: Continent;
  currency: string;
  lang: string;
  renderSvg: () => React.ReactNode;
}

const FLAG_LIST: CountryFlagDef[] = [
  {
    code: 'id',
    name: 'Indonesia',
    continent: 'Asia',
    currency: 'IDR (Rp)',
    lang: 'Bahasa Indonesia',
    renderSvg: () => (
      <svg viewBox="0 0 64 48" className="w-full h-full object-cover">
        <rect width="64" height="24" fill="#E11D48" />
        <rect y="24" width="64" height="24" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    code: 'sg',
    name: 'Singapore',
    continent: 'Asia',
    currency: 'SGD ($)',
    lang: 'English / Malay',
    renderSvg: () => (
      <svg viewBox="0 0 64 48" className="w-full h-full">
        <rect width="64" height="24" fill="#EF3340" />
        <rect y="24" width="64" height="24" fill="#FFFFFF" />
        <circle cx="16" cy="12" r="7" fill="#FFFFFF" />
        <circle cx="18.5" cy="12" r="6" fill="#EF3340" />
        <circle cx="19" cy="8.5" r="1.1" fill="#FFFFFF" />
        <circle cx="22.5" cy="11" r="1.1" fill="#FFFFFF" />
        <circle cx="21" cy="15" r="1.1" fill="#FFFFFF" />
        <circle cx="16.8" cy="15" r="1.1" fill="#FFFFFF" />
        <circle cx="15.5" cy="11" r="1.1" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    code: 'my',
    name: 'Malaysia',
    continent: 'Asia',
    currency: 'MYR (RM)',
    lang: 'Bahasa Melayu',
    renderSvg: () => (
      <svg viewBox="0 0 64 48" className="w-full h-full">
        <rect width="64" height="48" fill="#FFFFFF" />
        {[0, 2, 4, 6, 8, 10, 12].map((i) => (
          <rect key={i} y={i * 3.43} width="64" height="3.43" fill="#CC0001" />
        ))}
        <rect width="32" height="27.4" fill="#010066" />
        <circle cx="14" cy="13.7" r="7" fill="#FFCC00" />
        <circle cx="16.5" cy="13.7" r="5.8" fill="#010066" />
        <circle cx="21" cy="13.7" r="3" fill="#FFCC00" />
      </svg>
    ),
  },
  {
    code: 'jp',
    name: 'Japan',
    continent: 'Asia',
    currency: 'JPY (¥)',
    lang: 'Japanese',
    renderSvg: () => (
      <svg viewBox="0 0 64 48" className="w-full h-full">
        <rect width="64" height="48" fill="#FFFFFF" />
        <circle cx="32" cy="24" r="11" fill="#BC002D" />
      </svg>
    ),
  },
  {
    code: 'kr',
    name: 'South Korea',
    continent: 'Asia',
    currency: 'KRW (₩)',
    lang: 'Korean',
    renderSvg: () => (
      <svg viewBox="0 0 64 48" className="w-full h-full">
        <rect width="64" height="48" fill="#FFFFFF" />
        <path d="M32 14 A10 10 0 0 1 32 34 A5 5 0 0 1 32 24 A5 5 0 0 0 32 14 Z" fill="#CD2E3A" />
        <path d="M32 34 A10 10 0 0 1 32 14 A5 5 0 0 1 32 24 A5 5 0 0 0 32 34 Z" fill="#0047A0" />
        <rect x="10" y="10" width="8" height="2" transform="rotate(-35 14 11)" fill="#111827" />
        <rect x="46" y="10" width="8" height="2" transform="rotate(35 50 11)" fill="#111827" />
        <rect x="10" y="36" width="8" height="2" transform="rotate(35 14 37)" fill="#111827" />
        <rect x="46" y="36" width="8" height="2" transform="rotate(-35 50 37)" fill="#111827" />
      </svg>
    ),
  },
  {
    code: 'th',
    name: 'Thailand',
    continent: 'Asia',
    currency: 'THB (฿)',
    lang: 'Thai',
    renderSvg: () => (
      <svg viewBox="0 0 64 48" className="w-full h-full">
        <rect width="64" height="48" fill="#A51931" />
        <rect y="8" width="64" height="32" fill="#F4F5F8" />
        <rect y="16" width="64" height="16" fill="#2D2A4A" />
      </svg>
    ),
  },
  {
    code: 'vn',
    name: 'Vietnam',
    continent: 'Asia',
    currency: 'VND (₫)',
    lang: 'Vietnamese',
    renderSvg: () => (
      <svg viewBox="0 0 64 48" className="w-full h-full">
        <rect width="64" height="48" fill="#DA251D" />
        <polygon points="32,12 35,21 44,21 37,26 40,35 32,30 24,35 27,26 20,21 29,21" fill="#FFFF00" />
      </svg>
    ),
  },
  {
    code: 'cn',
    name: 'China',
    continent: 'Asia',
    currency: 'CNY (¥)',
    lang: 'Mandarin',
    renderSvg: () => (
      <svg viewBox="0 0 64 48" className="w-full h-full">
        <rect width="64" height="48" fill="#DE2910" />
        <polygon points="12,8 14,13 19,13 15,16 17,21 12,18 7,21 9,16 5,13 10,13" fill="#FFDE00" />
        <circle cx="23" cy="9" r="1.4" fill="#FFDE00" />
        <circle cx="26" cy="13" r="1.4" fill="#FFDE00" />
        <circle cx="26" cy="18" r="1.4" fill="#FFDE00" />
        <circle cx="22" cy="22" r="1.4" fill="#FFDE00" />
      </svg>
    ),
  },
  {
    code: 'in',
    name: 'India',
    continent: 'Asia',
    currency: 'INR (₹)',
    lang: 'Hindi / English',
    renderSvg: () => (
      <svg viewBox="0 0 64 48" className="w-full h-full">
        <rect width="64" height="16" fill="#FF9933" />
        <rect y="16" width="64" height="16" fill="#FFFFFF" />
        <rect y="32" width="64" height="16" fill="#138808" />
        <circle cx="32" cy="24" r="6" fill="none" stroke="#000080" strokeWidth="1.6" />
        <circle cx="32" cy="24" r="1.5" fill="#000080" />
      </svg>
    ),
  },
  {
    code: 'us',
    name: 'United States',
    continent: 'Americas',
    currency: 'USD ($)',
    lang: 'English (US)',
    renderSvg: () => (
      <svg viewBox="0 0 64 48" className="w-full h-full">
        <rect width="64" height="48" fill="#FFFFFF" />
        {[0, 2, 4, 6, 8, 10, 12].map((i) => (
          <rect key={i} y={i * 3.69} width="64" height="3.69" fill="#B22234" />
        ))}
        <rect width="28" height="25.8" fill="#3C3B6E" />
        {[6, 12, 18, 24].map((x) =>
          [5, 11, 17, 22].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1" fill="#FFFFFF" />)
        )}
      </svg>
    ),
  },
  {
    code: 'ca',
    name: 'Canada',
    continent: 'Americas',
    currency: 'CAD ($)',
    lang: 'English / French',
    renderSvg: () => (
      <svg viewBox="0 0 64 48" className="w-full h-full">
        <rect width="16" height="48" fill="#FF0000" />
        <rect x="16" width="32" height="48" fill="#FFFFFF" />
        <rect x="48" width="16" height="48" fill="#FF0000" />
        <polygon points="32,12 35,20 41,19 37,25 40,29 33,28 33,35 31,35 31,28 24,29 27,25 23,19 29,20" fill="#FF0000" />
      </svg>
    ),
  },
  {
    code: 'br',
    name: 'Brazil',
    continent: 'Americas',
    currency: 'BRL (R$)',
    lang: 'Portuguese',
    renderSvg: () => (
      <svg viewBox="0 0 64 48" className="w-full h-full">
        <rect width="64" height="48" fill="#009C3B" />
        <polygon points="32,6 56,24 32,42 8,24" fill="#FFDF00" />
        <circle cx="32" cy="24" r="8" fill="#002776" />
        <path d="M24 23 Q32 20 40 25" stroke="#FFFFFF" strokeWidth="1.8" fill="none" />
      </svg>
    ),
  },
  {
    code: 'gb',
    name: 'United Kingdom',
    continent: 'Europe',
    currency: 'GBP (£)',
    lang: 'English (UK)',
    renderSvg: () => (
      <svg viewBox="0 0 64 48" className="w-full h-full">
        <rect width="64" height="48" fill="#012169" />
        <path d="M0,0 L64,48 M64,0 L0,48" stroke="#FFFFFF" strokeWidth="8" />
        <path d="M0,0 L64,48 M64,0 L0,48" stroke="#C8102E" strokeWidth="4" />
        <path d="M32,0 V48 M0,24 H64" stroke="#FFFFFF" strokeWidth="12" />
        <path d="M32,0 V48 M0,24 H64" stroke="#C8102E" strokeWidth="7" />
      </svg>
    ),
  },
  {
    code: 'de',
    name: 'Germany',
    continent: 'Europe',
    currency: 'EUR (€)',
    lang: 'German',
    renderSvg: () => (
      <svg viewBox="0 0 64 48" className="w-full h-full">
        <rect width="64" height="16" fill="#111827" />
        <rect y="16" width="64" height="16" fill="#DD0000" />
        <rect y="32" width="64" height="16" fill="#FFCE00" />
      </svg>
    ),
  },
  {
    code: 'fr',
    name: 'France',
    continent: 'Europe',
    currency: 'EUR (€)',
    lang: 'French',
    renderSvg: () => (
      <svg viewBox="0 0 64 48" className="w-full h-full">
        <rect width="21.3" height="48" fill="#0055A4" />
        <rect x="21.3" width="21.4" height="48" fill="#FFFFFF" />
        <rect x="42.7" width="21.3" height="48" fill="#EF4135" />
      </svg>
    ),
  },
  {
    code: 'nl',
    name: 'Netherlands',
    continent: 'Europe',
    currency: 'EUR (€)',
    lang: 'Dutch',
    renderSvg: () => (
      <svg viewBox="0 0 64 48" className="w-full h-full">
        <rect width="64" height="16" fill="#AE1C28" />
        <rect y="16" width="64" height="16" fill="#FFFFFF" />
        <rect y="32" width="64" height="16" fill="#21468B" />
      </svg>
    ),
  },
  {
    code: 'it',
    name: 'Italy',
    continent: 'Europe',
    currency: 'EUR (€)',
    lang: 'Italian',
    renderSvg: () => (
      <svg viewBox="0 0 64 48" className="w-full h-full">
        <rect width="21.3" height="48" fill="#009246" />
        <rect x="21.3" width="21.4" height="48" fill="#FFFFFF" />
        <rect x="42.7" width="21.3" height="48" fill="#CE2B37" />
      </svg>
    ),
  },
  {
    code: 'es',
    name: 'Spain',
    continent: 'Europe',
    currency: 'EUR (€)',
    lang: 'Spanish',
    renderSvg: () => (
      <svg viewBox="0 0 64 48" className="w-full h-full">
        <rect width="64" height="12" fill="#AA151B" />
        <rect y="12" width="64" height="24" fill="#F1BF00" />
        <rect y="36" width="64" height="12" fill="#AA151B" />
        <rect x="14" y="18" width="8" height="12" rx="2" fill="#AA151B" />
      </svg>
    ),
  },
  {
    code: 'ch',
    name: 'Switzerland',
    continent: 'Europe',
    currency: 'CHF',
    lang: 'German / French',
    renderSvg: () => (
      <svg viewBox="0 0 64 48" className="w-full h-full">
        <rect width="64" height="48" fill="#D52B1E" />
        <rect x="27" y="11" width="10" height="26" fill="#FFFFFF" />
        <rect x="19" y="19" width="26" height="10" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    code: 'se',
    name: 'Sweden',
    continent: 'Europe',
    currency: 'SEK',
    lang: 'Swedish',
    renderSvg: () => (
      <svg viewBox="0 0 64 48" className="w-full h-full">
        <rect width="64" height="48" fill="#006AA7" />
        <rect x="18" width="9" height="48" fill="#FECC00" />
        <rect y="19.5" width="64" height="9" fill="#FECC00" />
      </svg>
    ),
  },
  {
    code: 'au',
    name: 'Australia',
    continent: 'Oceania',
    currency: 'AUD ($)',
    lang: 'English',
    renderSvg: () => (
      <svg viewBox="0 0 64 48" className="w-full h-full">
        <rect width="64" height="48" fill="#00008B" />
        <rect width="28" height="24" fill="#012169" />
        <path d="M14,0 V24 M0,12 H28" stroke="#FFFFFF" strokeWidth="5" />
        <path d="M14,0 V24 M0,12 H28" stroke="#C8102E" strokeWidth="3" />
        <circle cx="14" cy="34" r="3" fill="#FFFFFF" />
        <circle cx="46" cy="14" r="2" fill="#FFFFFF" />
        <circle cx="52" cy="24" r="2" fill="#FFFFFF" />
        <circle cx="46" cy="34" r="2" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    code: 'ae',
    name: 'United Arab Emirates',
    continent: 'Middle East',
    currency: 'AED',
    lang: 'Arabic',
    renderSvg: () => (
      <svg viewBox="0 0 64 48" className="w-full h-full">
        <rect x="16" width="48" height="16" fill="#00732F" />
        <rect x="16" y="16" width="48" height="16" fill="#FFFFFF" />
        <rect x="16" y="32" width="48" height="16" fill="#111827" />
        <rect width="16" height="48" fill="#FF0000" />
      </svg>
    ),
  },
  {
    code: 'sa',
    name: 'Saudi Arabia',
    continent: 'Middle East',
    currency: 'SAR',
    lang: 'Arabic',
    renderSvg: () => (
      <svg viewBox="0 0 64 48" className="w-full h-full">
        <rect width="64" height="48" fill="#006C35" />
        <rect x="16" y="17" width="32" height="5" rx="2" fill="#FFFFFF" />
        <rect x="18" y="28" width="28" height="2.5" rx="1" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    code: 'tr',
    name: 'Turkey',
    continent: 'Middle East',
    currency: 'TRY (₺)',
    lang: 'Turkish',
    renderSvg: () => (
      <svg viewBox="0 0 64 48" className="w-full h-full">
        <rect width="64" height="48" fill="#E30A17" />
        <circle cx="25" cy="24" r="10" fill="#FFFFFF" />
        <circle cx="28" cy="24" r="8" fill="#E30A17" />
        <polygon points="39,19 40.5,23 44.5,23 41.3,25.4 42.5,29.5 39,27 35.5,29.5 36.7,25.4 33.5,23 37.5,23" fill="#FFFFFF" />
      </svg>
    ),
  },
];

const GRAD = {
  primary: 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white',
  primaryStatic: 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white',
  info: 'bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] text-white',
  light: 'bg-gradient-to-r from-[#f8fafc] to-[#e2e8f0] text-slate-800 border border-slate-200/80',
};

export function FlagView() {
  const [search, setSearch] = useState('');
  const [continent, setContinent] = useState<'All' | Continent>('All');
  const [shape, setShape] = useState<'classic' | 'square' | 'circle'>('classic');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeLocale, setActiveLocale] = useState<CountryFlagDef>(FLAG_LIST[0]);

  const filteredFlags = useMemo(() => {
    const q = search.toLowerCase().trim();
    return FLAG_LIST.filter((f) => {
      if (continent !== 'All' && f.continent !== continent) return false;
      if (!q) return true;
      return (
        f.name.toLowerCase().includes(q) ||
        f.code.toLowerCase().includes(q) ||
        f.currency.toLowerCase().includes(q)
      );
    });
  }, [search, continent]);

  const handleCopySnippet = async (flag: CountryFlagDef) => {
    const snippet = `<span className="flag-icon flag-icon-${flag.code}" />`;
    setActiveLocale(flag);
    try {
      await navigator.clipboard.writeText(snippet);
      setCopiedCode(flag.code);
      showToast(`Disalin: ${snippet} (${flag.name})`, 'success');
      window.setTimeout(() => setCopiedCode(null), 1500);
    } catch {
      showToast(`${flag.name} (${flag.code.toUpperCase()}) dipilih.`, 'info');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Sub-header */}
      <div className="flex items-start gap-3">
        <div className="w-8 h-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full mt-2 shrink-0" />
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Flag Icons</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Koleksi bendera negara vektor SVG tajam dengan filter kawasan, pengubah bentuk (4:3, Square, Circle), dan salin class cepat.
          </p>
        </div>
      </div>

      {/* Live Locale Switcher Preview */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-9 rounded-lg overflow-hidden border border-slate-200 shadow-2xs shrink-0">
            {activeLocale.renderSvg()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">{activeLocale.name}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${GRAD.primaryStatic}`}>
                {activeLocale.code}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Bahasa: <strong>{activeLocale.lang}</strong> • Mata Uang: <strong>{activeLocale.currency}</strong>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleCopySnippet(activeLocale)}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs cursor-pointer transition-all active:scale-95 ${GRAD.primary}`}
        >
          <Copy className="w-3.5 h-3.5" />
          <span>Salin Snippet JSX</span>
        </button>
      </div>

      {/* Main Gallery Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-5">
        {/* Controls Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Continent Filter */}
          <div className="flex flex-wrap gap-1.5">
            {(['All', 'Asia', 'Europe', 'Americas', 'Oceania', 'Middle East'] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setContinent(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  continent === c ? `${GRAD.primary} shadow-xs` : GRAD.light
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Search + Shape Switcher */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-0.5">
              {(
                [
                  { id: 'classic', label: '4:3' },
                  { id: 'square', label: 'Square' },
                  { id: 'circle', label: 'Circle' },
                ] as const
              ).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setShape(s.id)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg cursor-pointer transition-all ${
                    shape === s.id ? `${GRAD.primaryStatic} shadow-xs` : 'text-slate-600'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari negara / kode ISO..."
                className="pl-8 pr-3 py-1.5 w-52 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#175cd3]"
              />
            </div>
          </div>
        </div>

        {/* Flags Grid */}
        {filteredFlags.length === 0 ? (
          <div className="py-12 text-center border border-slate-100 rounded-2xl">
            <Globe className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">Negara tidak ditemukan</p>
            <p className="text-xs text-slate-500 mt-1">Coba ubah kata kunci pencarian atau pilih tab All.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
            {filteredFlags.map((flag) => {
              const isCopied = copiedCode === flag.code;
              const isSelected = activeLocale.code === flag.code;

              const shapeClass =
                shape === 'circle'
                  ? 'w-14 h-14 rounded-full'
                  : shape === 'square'
                  ? 'w-14 h-14 rounded-xl'
                  : 'w-16 h-12 rounded-lg';

              return (
                <button
                  key={flag.code}
                  type="button"
                  onClick={() => handleCopySnippet(flag)}
                  className={`group p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-2.5 ${
                    isSelected
                      ? 'border-[#175cd3] bg-blue-50/40 shadow-xs'
                      : 'border-slate-200/80 bg-white hover:border-[#175cd3]/60 hover:shadow-xs'
                  }`}
                >
                  <div
                    className={`${shapeClass} overflow-hidden border border-slate-200 shadow-2xs group-hover:scale-105 transition-transform`}
                  >
                    {flag.renderSvg()}
                  </div>

                  <div className="min-w-0 w-full">
                    <div className="text-xs font-bold text-slate-800 truncate">{flag.name}</div>
                    <div className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-slate-500">
                      {isCopied ? (
                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                          <Check className="w-3 h-3" /> Copied!
                        </span>
                      ) : (
                        <span className="uppercase">{flag.code}</span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
