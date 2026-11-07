import React from 'react';
import { ArrowRight, ShieldCheck, Users, Repeat, HeartHandshake } from 'lucide-react';
import { Button } from '../common/Button';
import { ACADEMY_VALUES } from '../../data/academyData';

const VALUE_ICONS = {
  ShieldCheck: ShieldCheck,
  Users: Users,
  Repeat: Repeat,
  HeartHandshake: HeartHandshake,
};

export const HomeAboutPreview: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 bg-slate-50 border-t border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Visual Football Imagery Showcase (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl aspect-[4/5] bg-white">
              <img
                src="https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1000&q=80"
                alt="Elite Football Training session drill"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

              {/* Floating Quote Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-5 rounded-xl bg-white/95 border border-amber-300 shadow-lg backdrop-blur-md">
                <span className="text-xs uppercase font-mono tracking-widest text-amber-700 font-bold block mb-1">
                  Our Philosophy
                </span>
                <p className="text-sm font-heading uppercase text-slate-900 font-semibold leading-snug">
                  "Discipline turns talent into mastery. We train the mind as fiercely as the feet."
                </p>
              </div>
            </div>

            {/* Decorative amber corner frame */}
            <div className="absolute -top-3 -left-3 w-20 h-20 border-t-2 border-l-2 border-amber-500 rounded-tl-xl pointer-events-none" />
            <div className="absolute -bottom-3 -right-3 w-20 h-20 border-b-2 border-r-2 border-amber-500 rounded-br-xl pointer-events-none" />
          </div>

          {/* Right Column: Narrative & Values (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-xs uppercase font-heading tracking-[0.25em] font-bold text-amber-600">
                About The Academy
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display uppercase tracking-wide text-slate-900 leading-tight">
              MORE THAN DRILLS. <br />
              <span className="text-amber-600">BUILDING CHARACTER.</span>
            </h2>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-sans">
              Elite Football Training was established with a vision to help aspiring footballers improve their technical ability, physical fitness, tactical understanding, and confidence. Our training environment focuses on discipline, teamwork, consistent improvement, and a genuine love for football.
            </p>

            {/* 4 Core Pillars Grid */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              {ACADEMY_VALUES.map((val) => {
                const IconComponent =
                  VALUE_ICONS[val.iconName as keyof typeof VALUE_ICONS] || ShieldCheck;
                return (
                  <div
                    key={val.title}
                    className="p-4 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all shadow-sm"
                  >
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <h4 className="font-heading uppercase font-bold text-slate-900 text-sm tracking-wide">
                        {val.title}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {val.description}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="pt-4">
              <Button
                to="/about"
                variant="primary"
                size="md"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Learn More About Our Story
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
