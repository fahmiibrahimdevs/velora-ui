import React from 'react';
import { Activity, Users, HelpCircle, Award, TrendingUp } from 'lucide-react';
import type { DashboardStats } from '../../types';

interface StatCardsProps {
  stats: DashboardStats;
}

export const StatCards: React.FC<StatCardsProps> = ({ stats }) => {
  const cards = [
    {
      title: 'Ujian Aktif Saat Ini',
      value: stats.activeExams,
      unit: 'Sesi CBT',
      subtext: 'Sedang berjalan online',
      icon: Activity,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50',
      trend: '+2 hari ini',
    },
    {
      title: 'Siswa / Peserta',
      value: stats.registeredStudents,
      unit: 'Terdaftar',
      subtext: '94% hadir tepat waktu',
      icon: Users,
      iconColor: 'text-indigo-600',
      iconBg: 'bg-indigo-50',
      trend: '100% aktif',
    },
    {
      title: 'Bank Soal Terverifikasi',
      value: stats.totalQuestions.toLocaleString('id-ID'),
      unit: 'Butir Soal',
      subtext: 'Pilihan ganda & kunci',
      icon: HelpCircle,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50',
      trend: '+120 butir baru',
    },
    {
      title: 'Rata-rata Skor Peserta',
      value: `${stats.averageScore}`,
      unit: '/ 100',
      subtext: 'Tingkat kelulusan 94.6%',
      icon: Award,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50',
      trend: '+3.2% dari TO lalu',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  {card.title}
                </p>
                <div className="flex items-baseline gap-1.5 mt-2">
                  <span className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
                    {card.value}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">{card.unit}</span>
                </div>
              </div>

              <div className={`p-2.5 rounded-xl ${card.iconBg} ${card.iconColor}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 truncate">{card.subtext}</span>
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                <TrendingUp className="w-3 h-3" />
                {card.trend}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
