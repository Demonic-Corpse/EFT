import React from 'react';
import {
  ShieldCheck,
  Users,
  Repeat,
  HeartHandshake,
  Target,
  Compass,
  ArrowRight,
  Sparkles,
  Award,
  Zap,
  Trophy,
  MapPin,
  Calendar,
} from 'lucide-react';
import { SectionHeading } from '../components/common/SectionHeading';
import { Button } from '../components/common/Button';
import {
  ACADEMY_MISSION,
  ACADEMY_VISION,
  ACADEMY_STORY,
  ACADEMY_VALUES,
  COACHING_PHILOSOPHY,
  HEAD_COACH_INFO,
} from '../data/academyData';

const VALUE_ICONS = {
  ShieldCheck: ShieldCheck,
  Users: Users,
  Repeat: Repeat,
  HeartHandshake: HeartHandshake,
};

export const AboutPage: React.FC = () => {
  return (
    <div className="pt-24 pb-20 bg-slate-50 text-slate-900">
      {/* Page Hero */}
      <section className="relative py-16 sm:py-24 bg-gradient-to-b from-amber-50/60 via-slate-50 to-slate-50 border-b border-slate-200 overflow-hidden">
        {/* Cinematic sports background overlay */}
        <div className="absolute inset-0 z-0 opacity-15">
          <img
            src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1800&q=80"
            alt="Football pitch aerial background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-50/85" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 text-amber-800 text-xs font-heading font-bold uppercase tracking-widest mb-6 shadow-sm">
            <Target className="w-3.5 h-3.5 text-amber-600" />
            <span>Academy Ethos & Principles</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-display uppercase tracking-tight text-slate-900 leading-none mb-6">
            MORE THAN <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 drop-shadow-[0_2px_15px_rgba(217,119,6,0.25)]">
              JUST FOOTBALL.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-sans leading-relaxed">
            Building better players, stronger mindsets, and a passion for the beautiful game.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-xs uppercase font-heading tracking-[0.2em] font-bold text-amber-600">
                Origin & Foundations
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display uppercase tracking-wide text-slate-900">
              OUR STORY
            </h2>

            <div className="space-y-4 text-base sm:text-lg text-slate-600 leading-relaxed font-sans">
              <p>{ACADEMY_STORY.paragraph1}</p>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl aspect-video sm:aspect-[4/3] bg-white">
              <img
                src="https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=1200&q=80"
                alt="Elite football training drills"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-white/95 border border-slate-200 shadow-lg backdrop-blur-md">
                <span className="text-xs font-mono font-bold uppercase text-amber-700 block mb-1">
                  On-Pitch Culture
                </span>
                <p className="text-sm font-heading uppercase text-slate-900 font-semibold">
                  Where precision, discipline, and player joy meet every single session.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder & Head Coach Portfolio Section */}
      <section className="py-20 sm:py-24 bg-white border-y border-slate-200 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-400/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeading
            eyebrow="Founder & Head Coach – Elite Football Training"
            title="MEET OUR HEAD COACH"
            subtitle="Leading with passion, discipline, and a player-first philosophy on and off the pitch."
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left Side: High Quality Founder Portrait */}
            <div className="lg:col-span-5">
              <div className="relative group rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 shadow-xl">
                {/* Image frame */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-950">
                  <img
                    src={HEAD_COACH_INFO.image}
                    alt={`${HEAD_COACH_INFO.name} - ${HEAD_COACH_INFO.designation}`}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                  {/* Subtle vignette gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Floating Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 text-amber-400 border border-amber-400/50 text-[11px] font-heading font-extrabold uppercase tracking-widest backdrop-blur-md shadow-md">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    {HEAD_COACH_INFO.badge}
                  </span>
                </div>

                {/* Bottom Card Overlay on Image */}
                <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent text-white">
                  <h3 className="font-display uppercase text-2xl sm:text-3xl tracking-wide text-white">
                    {HEAD_COACH_INFO.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-300 mt-1">
                    <span className="text-amber-400 font-semibold">{HEAD_COACH_INFO.designation}</span>
                    <span>&bull;</span>
                    <span>{HEAD_COACH_INFO.academy}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-2 font-sans">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{HEAD_COACH_INFO.location}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Professional Biography & Coaching Philosophy */}
            <div className="lg:col-span-7 space-y-8">
              {/* Header Details */}
              <div className="pb-6 border-b border-slate-200">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-heading font-bold uppercase tracking-wider mb-3">
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  <span>Academy Leadership</span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-display uppercase tracking-tight text-slate-900">
                  {HEAD_COACH_INFO.name}
                </h3>
                <p className="text-sm font-heading uppercase tracking-wider text-amber-600 font-bold mt-1">
                  {HEAD_COACH_INFO.designation} &bull; {HEAD_COACH_INFO.academy}
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mt-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{HEAD_COACH_INFO.location}</span>
                </div>
              </div>

              {/* Verified Credentials Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {HEAD_COACH_INFO.credentials.map((cred) => {
                  const IconComp =
                    cred.icon === 'Award'
                      ? Award
                      : cred.icon === 'Calendar'
                      ? Calendar
                      : cred.icon === 'Trophy'
                      ? Trophy
                      : Users;
                  return (
                    <div
                      key={cred.label}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-400 transition-colors shadow-xs text-center flex flex-col items-center justify-center"
                    >
                      <div className="w-7 h-7 rounded-lg bg-amber-100/80 border border-amber-300 flex items-center justify-center text-amber-700 mb-1.5">
                        <IconComp className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold block">
                        {cred.label}
                      </span>
                      <span className="text-xs font-heading uppercase font-bold text-slate-900 mt-0.5 leading-tight">
                        {cred.value}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Biography Paragraphs */}
              <div className="space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed font-sans">
                {HEAD_COACH_INFO.bio.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              {/* Coaching Philosophy Section */}
              <div className="pt-2">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <h4 className="font-heading uppercase tracking-wider text-base sm:text-lg font-bold text-slate-900">
                    COACHING PHILOSOPHY
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {HEAD_COACH_INFO.philosophy.map((item) => {
                    const IconComp =
                      item.icon === 'Zap'
                        ? Zap
                        : item.icon === 'ShieldCheck'
                        ? ShieldCheck
                        : item.icon === 'Users'
                        ? Users
                        : Trophy;
                    return (
                      <div
                        key={item.title}
                        className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-400 hover:bg-amber-50/20 transition-all shadow-sm group"
                      >
                        <div className="w-9 h-9 rounded-xl bg-amber-100/80 border border-amber-300 flex items-center justify-center text-amber-700 mb-3 group-hover:scale-105 transition-transform">
                          <IconComp className="w-4 h-4" />
                        </div>
                        <h5 className="font-heading uppercase font-bold text-sm text-slate-900 tracking-wide mb-1">
                          {item.title}
                        </h5>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 relative overflow-hidden group hover:border-amber-400 hover:shadow-md transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 blur-2xl rounded-full" />
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-6">
                <Target className="w-6 h-6" />
              </div>
              <span className="text-xs font-heading font-bold uppercase tracking-[0.2em] text-amber-700 block mb-2">
                {ACADEMY_MISSION.headline}
              </span>
              <p className="text-xl sm:text-2xl font-display uppercase tracking-wide text-slate-900 leading-snug">
                "{ACADEMY_MISSION.quote}"
              </p>
            </div>

            {/* Vision */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 relative overflow-hidden group hover:border-amber-400 hover:shadow-md transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-2xl rounded-full" />
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-6">
                <Compass className="w-6 h-6" />
              </div>
              <span className="text-xs font-heading font-bold uppercase tracking-[0.2em] text-amber-700 block mb-2">
                {ACADEMY_VISION.headline}
              </span>
              <p className="text-xl sm:text-2xl font-display uppercase tracking-wide text-slate-900 leading-snug">
                "{ACADEMY_VISION.quote}"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section (4 Cards) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Core Identity"
          title="OUR VALUES"
          subtitle="Four non-negotiable pillars that govern every training drill, match simulation, and off-pitch interaction at Elite Football Training."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ACADEMY_VALUES.map((val, idx) => {
            const Icon =
              VALUE_ICONS[val.iconName as keyof typeof VALUE_ICONS] || ShieldCheck;
            return (
              <div
                key={val.title}
                className="p-7 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-lg transition-all duration-300 shadow-sm flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-6 group-hover:scale-110 group-hover:border-amber-400 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 uppercase block mb-1">
                    Value 0{idx + 1}
                  </span>
                  <h3 className="text-2xl font-display uppercase tracking-wide text-slate-900 mb-3 group-hover:text-amber-600 transition-colors">
                    {val.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-sans">
                    {val.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span>Academy Standard</span>
                  <span className="text-amber-600 font-bold">&#10003;</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Coaching Philosophy Section */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Development Methodology"
            title="COACHING PHILOSOPHY"
            subtitle="How we approach technical training, physical development, tactical awareness, and player confidence."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
            {COACHING_PHILOSOPHY.map((item, index) => (
              <div
                key={item.pillar}
                className="p-8 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-amber-50 border border-amber-200 text-amber-800">
                      {item.tag}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-display uppercase tracking-wide text-slate-900 mb-3">
                    {item.pillar}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-sans">
                    {item.detail}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-400 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>Subject to ongoing coach review and verification</span>
                </div>
              </div>
            ))}
          </div>

          {/* Philosophy CTA */}
          <div className="p-8 rounded-2xl bg-gradient-to-r from-amber-50/80 via-white to-amber-50/80 border border-amber-300 shadow-md text-center max-w-3xl mx-auto space-y-5">
            <h3 className="text-2xl sm:text-3xl font-display uppercase tracking-wide text-slate-900">
              EXPERIENCE OUR COACHING IN ACTION
            </h3>
            <p className="text-sm text-slate-600">
              Book a trial session or connect directly with our academy coaches to find the right training cohort for you.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                to="/contact"
                variant="primary"
                size="md"
                icon={<ArrowRight className="w-4 h-4" />}
                className="shadow-sm"
              >
                Connect With Our Academy
              </Button>
              <Button
                to="/training"
                variant="secondary"
                size="md"
                className="shadow-sm"
              >
                View Training Programmes
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
