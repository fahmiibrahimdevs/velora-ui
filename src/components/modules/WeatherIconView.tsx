import React, { useState, useMemo } from 'react';
import {
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudRain,
  CloudDrizzle,
  CloudSnow,
  CloudLightning,
  CloudFog,
  Wind,
  Droplets,
  Thermometer,
  Umbrella,
  Snowflake,
  Sunrise,
  Sunset,
  Compass,
  Gauge,
  Waves,
  Tornado,
  Rainbow,
  Haze,
  Sparkles,
  Zap,
  Search,
  Copy,
  Check,
  MapPin,
} from 'lucide-react';
import { showToast } from '../../lib/swal';

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

type WeatherCategory =
  | 'Daylight'
  | 'Night & Lunar'
  | 'Rain & Storm'
  | 'Wind & Fog'
  | 'Temp & Instruments';

type IconBadgeStyle = 'clean' | 'gradient' | 'tinted';
type IconSize = 'sm' | 'md' | 'lg';

interface WeatherIconDef {
  wiClass: string;
  label: string;
  category: WeatherCategory;
  accentGrad: string;
  render: (className: string) => React.ReactNode;
}

// Crisp custom vector SVGs for classic Weather Icons not directly duplicated in Lucide
const LunarWaxingSvg = ({ className }: { className: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 3a6 9 0 0 1 0 18 9 9 0 0 0 0-18Z" fill="currentColor" stroke="none" opacity="0.85" />
  </svg>
);

const LunarHalfSvg = ({ className }: { className: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 3a9 9 0 0 1 0 18Z" fill="currentColor" stroke="none" opacity="0.85" />
  </svg>
);

const CelsiusSvg = ({ className }: { className: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="6.5" cy="7.5" r="2.2" />
    <path d="M19 8.5a4.5 4.5 0 0 0-7.5 3.5v1a4.5 4.5 0 0 0 7.5 3.5" />
  </svg>
);

const FahrenheitSvg = ({ className }: { className: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="6.5" cy="7.5" r="2.2" />
    <path d="M12.5 18V7h6.5" />
    <path d="M12.5 12.5h5" />
  </svg>
);

const HailSvg = ({ className }: { className: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 14.9A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 2.5 8.2" />
    <circle cx="8.5" cy="18" r="1.2" fill="currentColor" />
    <circle cx="12.5" cy="20" r="1.2" fill="currentColor" />
    <circle cx="16" cy="18" r="1.2" fill="currentColor" />
  </svg>
);

const HorizonSunSvg = ({ className }: { className: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 17h18" />
    <path d="M7 17a5 5 0 0 1 10 0" />
    <path d="M12 6v3" />
    <path d="m6.4 9.4 2.1 2.1" />
    <path d="m17.6 9.4-2.1 2.1" />
  </svg>
);

const WEATHER_ICONS: WeatherIconDef[] = [
  // Daylight
  { wiClass: 'wi wi-day-sunny', label: 'Day Sunny', category: 'Daylight', accentGrad: GRAD.warning, render: (c) => <Sun className={c} /> },
  { wiClass: 'wi wi-day-cloudy', label: 'Day Partly Cloudy', category: 'Daylight', accentGrad: GRAD.warning, render: (c) => <CloudSun className={c} /> },
  { wiClass: 'wi wi-day-haze', label: 'Day Haze', category: 'Daylight', accentGrad: GRAD.warning, render: (c) => <Haze className={c} /> },
  { wiClass: 'wi wi-day-rain', label: 'Day Rain', category: 'Daylight', accentGrad: GRAD.info, render: (c) => <CloudRain className={c} /> },
  { wiClass: 'wi wi-day-thunderstorm', label: 'Day Storm', category: 'Daylight', accentGrad: GRAD.primary, render: (c) => <CloudLightning className={c} /> },
  { wiClass: 'wi wi-sunrise', label: 'Sunrise', category: 'Daylight', accentGrad: GRAD.warning, render: (c) => <Sunrise className={c} /> },
  { wiClass: 'wi wi-sunset', label: 'Sunset', category: 'Daylight', accentGrad: GRAD.danger, render: (c) => <Sunset className={c} /> },
  { wiClass: 'wi wi-horizon', label: 'Solar Horizon', category: 'Daylight', accentGrad: GRAD.warning, render: (c) => <HorizonSunSvg className={c} /> },
  { wiClass: 'wi wi-rainbow', label: 'Rainbow Arc', category: 'Daylight', accentGrad: GRAD.success, render: (c) => <Rainbow className={c} /> },

  // Night & Lunar
  { wiClass: 'wi wi-night-clear', label: 'Night Clear', category: 'Night & Lunar', accentGrad: GRAD.dark, render: (c) => <Moon className={c} /> },
  { wiClass: 'wi wi-night-alt-cloudy', label: 'Night Cloudy', category: 'Night & Lunar', accentGrad: GRAD.dark, render: (c) => <CloudMoon className={c} /> },
  { wiClass: 'wi wi-stars', label: 'Starry Sky', category: 'Night & Lunar', accentGrad: GRAD.primary, render: (c) => <Sparkles className={c} /> },
  { wiClass: 'wi wi-moon-waxing-crescent-3', label: 'Waxing Crescent', category: 'Night & Lunar', accentGrad: GRAD.dark, render: (c) => <LunarWaxingSvg className={c} /> },
  { wiClass: 'wi wi-moon-first-quarter', label: 'First Quarter', category: 'Night & Lunar', accentGrad: GRAD.dark, render: (c) => <LunarHalfSvg className={c} /> },
  { wiClass: 'wi wi-night-rain', label: 'Night Rain', category: 'Night & Lunar', accentGrad: GRAD.info, render: (c) => <CloudDrizzle className={c} /> },
  { wiClass: 'wi wi-night-lightning', label: 'Night Lightning', category: 'Night & Lunar', accentGrad: GRAD.danger, render: (c) => <Zap className={c} /> },

  // Rain & Storm
  { wiClass: 'wi wi-cloud', label: 'Overcast Cloud', category: 'Rain & Storm', accentGrad: GRAD.secondary, render: (c) => <Cloud className={c} /> },
  { wiClass: 'wi wi-rain', label: 'Heavy Rain', category: 'Rain & Storm', accentGrad: GRAD.info, render: (c) => <CloudRain className={c} /> },
  { wiClass: 'wi wi-showers', label: 'Light Showers', category: 'Rain & Storm', accentGrad: GRAD.info, render: (c) => <CloudDrizzle className={c} /> },
  { wiClass: 'wi wi-thunderstorm', label: 'Thunderstorm', category: 'Rain & Storm', accentGrad: GRAD.danger, render: (c) => <CloudLightning className={c} /> },
  { wiClass: 'wi wi-snow', label: 'Snowfall', category: 'Rain & Storm', accentGrad: GRAD.info, render: (c) => <CloudSnow className={c} /> },
  { wiClass: 'wi wi-snowflake-cold', label: 'Snowflake', category: 'Rain & Storm', accentGrad: GRAD.info, render: (c) => <Snowflake className={c} /> },
  { wiClass: 'wi wi-hail', label: 'Ice Hail', category: 'Rain & Storm', accentGrad: GRAD.primary, render: (c) => <HailSvg className={c} /> },
  { wiClass: 'wi wi-umbrella', label: 'Rain Protection', category: 'Rain & Storm', accentGrad: GRAD.primary, render: (c) => <Umbrella className={c} /> },
  { wiClass: 'wi wi-raindrops', label: 'Precipitation', category: 'Rain & Storm', accentGrad: GRAD.info, render: (c) => <Droplets className={c} /> },

  // Wind & Fog
  { wiClass: 'wi wi-strong-wind', label: 'Strong Wind', category: 'Wind & Fog', accentGrad: GRAD.info, render: (c) => <Wind className={c} /> },
  { wiClass: 'wi wi-tornado', label: 'Tornado Alert', category: 'Wind & Fog', accentGrad: GRAD.danger, render: (c) => <Tornado className={c} /> },
  { wiClass: 'wi wi-fog', label: 'Dense Fog', category: 'Wind & Fog', accentGrad: GRAD.secondary, render: (c) => <CloudFog className={c} /> },
  { wiClass: 'wi wi-sea-breeze', label: 'Marine Waves', category: 'Wind & Fog', accentGrad: GRAD.info, render: (c) => <Waves className={c} /> },
  { wiClass: 'wi wi-wind-direction', label: 'Wind Direction', category: 'Wind & Fog', accentGrad: GRAD.primary, render: (c) => <Compass className={c} /> },

  // Temp & Instruments
  { wiClass: 'wi wi-thermometer', label: 'Thermometer', category: 'Temp & Instruments', accentGrad: GRAD.danger, render: (c) => <Thermometer className={c} /> },
  { wiClass: 'wi wi-barometer', label: 'Barometer', category: 'Temp & Instruments', accentGrad: GRAD.primary, render: (c) => <Gauge className={c} /> },
  { wiClass: 'wi wi-celsius', label: 'Celsius Scale', category: 'Temp & Instruments', accentGrad: GRAD.warning, render: (c) => <CelsiusSvg className={c} /> },
  { wiClass: 'wi wi-fahrenheit', label: 'Fahrenheit Scale', category: 'Temp & Instruments', accentGrad: GRAD.info, render: (c) => <FahrenheitSvg className={c} /> },
  { wiClass: 'wi wi-humidity', label: 'Humidity Drop', category: 'Temp & Instruments', accentGrad: GRAD.info, render: (c) => <Droplets className={c} /> },
  { wiClass: 'wi wi-lightning', label: 'Static Alert', category: 'Temp & Instruments', accentGrad: GRAD.warning, render: (c) => <Zap className={c} /> },
];

interface CityWeather {
  id: string;
  city: string;
  country: string;
  condition: string;
  tempC: number;
  humidity: number;
  windKmh: number;
  uvIndex: string;
  gradient: string;
  icon: React.ElementType;
  forecast: { day: string; tempC: number; icon: React.ElementType }[];
}

const CITIES_WEATHER: CityWeather[] = [
  {
    id: 'jkt',
    city: 'Jakarta',
    country: 'Indonesia',
    condition: 'Cerah Berawan',
    tempC: 31,
    humidity: 68,
    windKmh: 14,
    uvIndex: 'High (7)',
    gradient: GRAD.primaryStatic,
    icon: CloudSun,
    forecast: [
      { day: 'Kam', tempC: 31, icon: CloudSun },
      { day: 'Jum', tempC: 32, icon: Sun },
      { day: 'Sab', tempC: 29, icon: CloudRain },
      { day: 'Min', tempC: 30, icon: CloudSun },
      { day: 'Sen', tempC: 28, icon: CloudLightning },
    ],
  },
  {
    id: 'bdg',
    city: 'Bandung',
    country: 'Indonesia',
    condition: 'Hujan Ringan',
    tempC: 23,
    humidity: 84,
    windKmh: 11,
    uvIndex: 'Moderate (4)',
    gradient: GRAD.info,
    icon: CloudDrizzle,
    forecast: [
      { day: 'Kam', tempC: 23, icon: CloudDrizzle },
      { day: 'Jum', tempC: 22, icon: CloudRain },
      { day: 'Sab', tempC: 24, icon: CloudSun },
      { day: 'Min', tempC: 23, icon: Cloud },
      { day: 'Sen', tempC: 21, icon: CloudFog },
    ],
  },
  {
    id: 'sby',
    city: 'Surabaya',
    country: 'Indonesia',
    condition: 'Panas Terik',
    tempC: 34,
    humidity: 58,
    windKmh: 19,
    uvIndex: 'Very High (9)',
    gradient: GRAD.warning,
    icon: Sun,
    forecast: [
      { day: 'Kam', tempC: 34, icon: Sun },
      { day: 'Jum', tempC: 35, icon: Sun },
      { day: 'Sab', tempC: 33, icon: CloudSun },
      { day: 'Min', tempC: 34, icon: Sun },
      { day: 'Sen', tempC: 32, icon: Wind },
    ],
  },
  {
    id: 'tyo',
    city: 'Tokyo',
    country: 'Japan',
    condition: 'Salju Tipis',
    tempC: 4,
    humidity: 72,
    windKmh: 22,
    uvIndex: 'Low (2)',
    gradient: GRAD.dark,
    icon: CloudSnow,
    forecast: [
      { day: 'Kam', tempC: 4, icon: CloudSnow },
      { day: 'Jum', tempC: 6, icon: Cloud },
      { day: 'Sab', tempC: 8, icon: CloudSun },
      { day: 'Min', tempC: 3, icon: Snowflake },
      { day: 'Sen', tempC: 7, icon: Sun },
    ],
  },
  {
    id: 'lon',
    city: 'London',
    country: 'United Kingdom',
    condition: 'Berkabut & Angin',
    tempC: 9,
    humidity: 88,
    windKmh: 27,
    uvIndex: 'Low (1)',
    gradient: GRAD.success,
    icon: CloudFog,
    forecast: [
      { day: 'Kam', tempC: 9, icon: CloudFog },
      { day: 'Jum', tempC: 8, icon: CloudRain },
      { day: 'Sab', tempC: 11, icon: Wind },
      { day: 'Min', tempC: 10, icon: CloudDrizzle },
      { day: 'Sen', tempC: 12, icon: CloudSun },
    ],
  },
];

export function WeatherIconView() {
  const [selectedCityId, setSelectedCityId] = useState('jkt');
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const [category, setCategory] = useState<'All' | WeatherCategory>('All');
  const [badgeStyle, setBadgeStyle] = useState<IconBadgeStyle>('clean');
  const [iconSize, setIconSize] = useState<IconSize>('md');
  const [search, setSearch] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<WeatherIconDef>(WEATHER_ICONS[0]);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const cityWeather = CITIES_WEATHER.find((c) => c.id === selectedCityId) ?? CITIES_WEATHER[0];
  const CityMainIcon = cityWeather.icon;

  const formatTemp = (tempC: number) =>
    unit === 'C' ? `${tempC}°C` : `${Math.round((tempC * 9) / 5 + 32)}°F`;

  const filteredIcons = useMemo(() => {
    const q = search.trim().toLowerCase();
    return WEATHER_ICONS.filter((item) => {
      const matchCat = category === 'All' || item.category === category;
      const matchSearch =
        !q || item.label.toLowerCase().includes(q) || item.wiClass.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [category, search]);

  const sizeClass =
    iconSize === 'sm' ? 'w-4 h-4' : iconSize === 'md' ? 'w-6 h-6' : 'w-8 h-8';

  const copyText = (value: string, label: string) => {
    navigator.clipboard.writeText(value);
    setCopiedType(label);
    showToast(`${label} berhasil disalin!`, 'success');
    setTimeout(() => setCopiedType(null), 1600);
  };

  return (
    <div className="space-y-6">
      <style>{`
        @keyframes wi-spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes wi-float-cloud {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes wi-pulse-bolt {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.45; transform: scale(0.92); }
        }
        .wi-anim-spin { animation: wi-spin-slow 12s linear infinite; }
        .wi-anim-float { animation: wi-float-cloud 3s ease-in-out infinite; }
        .wi-anim-bolt { animation: wi-pulse-bolt 1.5s ease-in-out infinite; }
      `}</style>

      {/* 1. LIVE WEATHER WIDGETS & ANIMATED ICON SHOWCASE */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Interactive City Forecast Widget */}
        <div className="xl:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">1. Live Weather Forecast Widgets</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${GRAD.info}`}>
                  Interactive Preview
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Contoh penerapan Weather Icons dalam widget prakiraan cuaca kota & konversi skala suhu real-time.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-0.5">
                {(['C', 'F'] as const).map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setUnit(u)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                      unit === u ? `${GRAD.primaryStatic} shadow-xs` : 'text-slate-600'
                    }`}
                  >
                    °{u}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-1">
                {CITIES_WEATHER.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCityId(c.id)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                      selectedCityId === c.id ? GRAD.primary : GRAD.light
                    }`}
                  >
                    {c.city}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Gradient Hero Forecast Banner */}
          <div className={`rounded-2xl p-6 shadow-sm ${cityWeather.gradient}`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-xs border border-white/25 flex items-center justify-center shrink-0">
                  <CityMainIcon className="w-9 h-9 text-white wi-anim-float" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-white/90">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>
                      {cityWeather.city}, {cityWeather.country}
                    </span>
                  </div>
                  <div className="text-4xl font-bold tracking-tight mt-0.5">
                    {formatTemp(cityWeather.tempC)}
                  </div>
                  <div className="text-xs font-semibold text-white/90 mt-0.5">{cityWeather.condition}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 sm:gap-5 bg-black/15 rounded-2xl px-4 py-3 border border-white/15">
                <div>
                  <div className="text-[11px] text-white/80 flex items-center gap-1">
                    <Droplets className="w-3 h-3" /> Humidity
                  </div>
                  <div className="text-sm font-bold mt-0.5">{cityWeather.humidity}%</div>
                </div>
                <div>
                  <div className="text-[11px] text-white/80 flex items-center gap-1">
                    <Wind className="w-3 h-3" /> Wind
                  </div>
                  <div className="text-sm font-bold mt-0.5">{cityWeather.windKmh} km/h</div>
                </div>
                <div>
                  <div className="text-[11px] text-white/80 flex items-center gap-1">
                    <Sun className="w-3 h-3" /> UV Index
                  </div>
                  <div className="text-sm font-bold mt-0.5">{cityWeather.uvIndex}</div>
                </div>
              </div>
            </div>

            {/* 5-Day Mini Forecast Strip */}
            <div className="grid grid-cols-5 gap-2 mt-5 pt-4 border-t border-white/20">
              {cityWeather.forecast.map((f) => {
                const DayIcon = f.icon;
                return (
                  <div
                    key={f.day}
                    className="rounded-xl bg-white/10 hover:bg-white/20 transition-colors px-2 py-2.5 text-center border border-white/10"
                  >
                    <div className="text-[11px] font-semibold text-white/85">{f.day}</div>
                    <DayIcon className="w-5 h-5 mx-auto my-1.5 text-white" />
                    <div className="text-xs font-bold text-white">{formatTemp(f.tempC)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Animated Weather Scenes Panel */}
        <div className="xl:col-span-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base font-bold text-slate-900">2. Animated Weather Motion</h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${GRAD.warning}`}>SVG Motion</span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Variasi ikon vektor dengan animasi CSS halus siap pakai untuk status dashboard.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 flex-1">
            <div className="rounded-2xl border border-slate-200/80 p-4 flex flex-col items-center justify-center text-center gap-2">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs ${GRAD.warning}`}>
                <Sun className="w-6 h-6 wi-anim-spin" />
              </div>
              <div className="text-xs font-bold text-slate-900">Solar Spin</div>
              <div className="text-[10px] text-slate-500">wi-day-sunny</div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 p-4 flex flex-col items-center justify-center text-center gap-2">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs ${GRAD.info}`}>
                <CloudRain className="w-6 h-6 wi-anim-float" />
              </div>
              <div className="text-xs font-bold text-slate-900">Cloud Drift</div>
              <div className="text-[10px] text-slate-500">wi-rain</div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 p-4 flex flex-col items-center justify-center text-center gap-2">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs ${GRAD.danger}`}>
                <CloudLightning className="w-6 h-6 wi-anim-bolt" />
              </div>
              <div className="text-xs font-bold text-slate-900">Storm Flash</div>
              <div className="text-[10px] text-slate-500">wi-thunderstorm</div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 p-4 flex flex-col items-center justify-center text-center gap-2">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs ${GRAD.dark}`}>
                <Moon className="w-6 h-6 wi-anim-float" />
              </div>
              <div className="text-xs font-bold text-slate-900">Night Glow</div>
              <div className="text-[10px] text-slate-500">wi-night-clear</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SELECTED WEATHER ICON INSPECTOR BAR */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xs ${selectedIcon.accentGrad}`}>
            {selectedIcon.render('w-7 h-7')}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-slate-900">{selectedIcon.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${GRAD.info}`}>
                {selectedIcon.category}
              </span>
            </div>
            <code className="text-xs text-slate-600 mt-1 block">
              &lt;i class=&quot;{selectedIcon.wiClass}&quot;&gt;&lt;/i&gt;
            </code>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => copyText(`<i class="${selectedIcon.wiClass}"></i>`, 'HTML Tag')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer ${GRAD.light}`}
          >
            {copiedType === 'HTML Tag' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy HTML</span>
          </button>
          <button
            type="button"
            onClick={() => copyText(selectedIcon.wiClass, 'Class Name')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs cursor-pointer ${GRAD.primary}`}
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Class</span>
          </button>
        </div>
      </div>

      {/* 4. FULL WEATHER ICONS CATALOG */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-5">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
          {/* Categories */}
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                'All',
                'Daylight',
                'Night & Lunar',
                'Rain & Storm',
                'Wind & Fog',
                'Temp & Instruments',
              ] as const
            ).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  category === cat ? `${GRAD.primary} shadow-xs` : GRAD.light
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Badge Style, Size & Search */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-0.5">
              {(['clean', 'gradient', 'tinted'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setBadgeStyle(st)}
                  className={`px-2.5 py-1 text-xs font-semibold capitalize rounded-lg cursor-pointer ${
                    badgeStyle === st ? `${GRAD.primaryStatic} shadow-xs` : 'text-slate-600'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-0.5">
              {(['sm', 'md', 'lg'] as const).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setIconSize(sz)}
                  className={`px-2.5 py-1 text-xs font-semibold uppercase rounded-lg cursor-pointer ${
                    iconSize === sz ? `${GRAD.primaryStatic} shadow-xs` : 'text-slate-600'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari wi-day-sunny, rain..."
                className="pl-8 pr-3 py-1.5 w-48 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#175cd3]"
              />
            </div>
          </div>
        </div>

        {/* Weather Icons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-8 gap-3">
          {filteredIcons.map((item) => {
            const active = selectedIcon.wiClass === item.wiClass;
            const iconBoxClass =
              badgeStyle === 'gradient'
                ? `${item.accentGrad} shadow-xs`
                : badgeStyle === 'tinted'
                  ? 'bg-sky-50 text-[#175cd3] border border-sky-100'
                  : 'bg-slate-50 text-slate-700 group-hover:text-[#175cd3]';

            return (
              <button
                key={item.wiClass}
                type="button"
                onClick={() => {
                  setSelectedIcon(item);
                  copyText(item.wiClass, item.label);
                }}
                className={`group p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col items-center gap-2 text-center ${
                  active
                    ? 'border-[#175cd3] bg-blue-50/40 shadow-xs'
                    : 'border-slate-200/80 bg-white hover:border-[#175cd3]/60 hover:shadow-xs'
                }`}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${iconBoxClass}`}>
                  {item.render(sizeClass)}
                </div>
                <div className="w-full min-w-0">
                  <div className="text-[11px] font-semibold text-slate-800 truncate">{item.label}</div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {item.wiClass.replace('wi ', '')}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. WEATHER SEVERITY PILLS & SIZE COMPARISON STRIP */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Weather Alert Badges & Semantic Variants</h3>
          <p className="text-xs text-slate-600">
            Variasi pill notifikasi cuaca menggunakan palet gradient standar Velora UI.
          </p>
          <div className="flex flex-wrap gap-2.5">
            <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold ${GRAD.warning}`}>
              <Sun className="w-3.5 h-3.5" /> Cerah Terik (34°C)
            </span>
            <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold ${GRAD.info}`}>
              <CloudRain className="w-3.5 h-3.5" /> Hujan Sedang
            </span>
            <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold ${GRAD.primaryStatic}`}>
              <Wind className="w-3.5 h-3.5" /> Angin Kencang 28 km/h
            </span>
            <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold ${GRAD.danger}`}>
              <CloudLightning className="w-3.5 h-3.5" /> Waspada Badai Petir
            </span>
            <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold ${GRAD.success}`}>
              <Rainbow className="w-3.5 h-3.5" /> Udara Sehat (AQI 28)
            </span>
            <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold ${GRAD.dark}`}>
              <Moon className="w-3.5 h-3.5" /> Malam Sejuk (21°C)
            </span>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Scale Comparison (Selected Icon)</h3>
          <p className="text-xs text-slate-600">
            Pratinjau proporsi ikon <span className="font-semibold text-slate-800">{selectedIcon.label}</span> di berbagai ukuran UI.
          </p>
          <div className="flex items-end justify-between gap-3 pt-2">
            {[
              { tag: '20px', box: 'w-9 h-9', ic: 'w-4 h-4' },
              { tag: '28px', box: 'w-11 h-11', ic: 'w-6 h-6' },
              { tag: '36px', box: 'w-14 h-14', ic: 'w-8 h-8' },
              { tag: '48px', box: 'w-16 h-16', ic: 'w-10 h-10' },
            ].map((sz) => (
              <div key={sz.tag} className="flex flex-col items-center gap-1.5">
                <div className={`${sz.box} rounded-2xl flex items-center justify-center shadow-xs ${selectedIcon.accentGrad}`}>
                  {selectedIcon.render(sz.ic)}
                </div>
                <span className="text-[11px] font-semibold text-slate-600">{sz.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
