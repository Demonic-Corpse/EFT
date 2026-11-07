import React from 'react';
import { ACADEMY_STAT_ITEMS } from '../../data/academyData';
import { Award, Users, Calendar, ShieldCheck } from 'lucide-react';

const ICONS = {
  players: Users,
  experience: Calendar,
  sessions: Award,
  coaches: ShieldCheck,
};

export const StatsSection: React.FC = () => {
  return (
    <section id="highlights-section" className="relative py-16 sm:py-20 bg-slate-100/70 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-xs uppercase font-heading tracking-[0.2em] font-bold text-amber-600">
                Academy Track Record
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display uppercase tracking-wide text-slate-900">
              PERFORMANCE IN NUMBERS
            </h2>
          </div>
        </div>

        {/* 3 Statistic Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {ACADEMY_STAT_ITEMS.map((item) => {
            const Icon = ICONS[item.key as keyof typeof ICONS] || Users;
            return (
              <div
                key={item.key}
                className="relative group p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/90 hover:border-amber-400 hover:shadow-lg transition-all duration-300 shadow-sm overflow-hidden"
              >
                {/* Subtle top amber border line on hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 group-hover:scale-110 group-hover:border-amber-400 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>

                <div className="text-4xl sm:text-5xl font-display tracking-tight text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">
                  {item.value}
                </div>

                <h3 className="text-base sm:text-lg font-heading font-bold uppercase text-slate-800 tracking-wide mb-1">
                  {item.label}
                </h3>

                <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                  {item.subtext}
                </p>

                <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 font-mono italic">
                  * {item.note}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
