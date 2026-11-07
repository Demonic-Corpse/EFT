import React from 'react';
import { ArrowRight, Trophy, Zap, Shield, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';

export const Hero: React.FC = () => {
  const [content, setContent] = React.useState({
    eyebrow: 'ELITE FOOTBALL TRAINING',
    headlinePart1: 'TRAIN HARD.',
    headlinePart2: 'PLAY ELITE.',
    subtext: 'Develop your skills, build confidence, and take your football to the next level with Elite Football Training.',
    primaryCtaText: 'Join Our Training',
    primaryCtaLink: '/contact',
    secondaryCtaText: 'Explore Our Academy',
    secondaryCtaLink: '/about',
  });

  React.useEffect(() => {
    fetch('/api/content/public')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.hero) {
          setContent((prev) => ({ ...prev, ...data.hero }));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden pt-28 pb-16 bg-slate-50">
      {/* Background Football Image — will be replaced by video background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=2000&q=85"
          alt="Football players training on pitch"
          className="w-full h-full object-cover object-right md:object-center scale-105"
          loading="eager"
        />
        {/* Left-side gradient: strong white fade so text stays readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-50/95 md:via-slate-50/90 to-slate-50/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-slate-50/50" />
        <div className="absolute inset-0 bg-pitch-pattern bg-[length:24px_24px] opacity-30" />
      </div>

      {/* Decorative Warm Pitch Glow on left */}
      <div className="absolute top-1/3 -left-20 w-96 h-96 bg-amber-400/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-60 bg-amber-500/8 blur-[100px] rounded-full pointer-events-none" />

      {/* Content — well-balanced left alignment */}
      <div className="relative z-10 w-full max-w-[1560px] mx-auto px-8 sm:px-14 md:px-20 lg:px-28 xl:px-36">
        <div className="max-w-xl lg:max-w-2xl">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/90 border border-amber-300 shadow-sm backdrop-blur-md mb-6">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
            <span className="text-xs sm:text-sm font-heading uppercase font-bold tracking-[0.2em] text-amber-700">
              {content.eyebrow}
            </span>
          </div>

          {/* Main Headline — left aligned */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display uppercase tracking-tight text-slate-900 leading-[0.92] mb-6 drop-shadow-sm">
            {content.headlinePart1} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 drop-shadow-[0_2px_15px_rgba(217,119,6,0.3)]">
              {content.headlinePart2}
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="text-lg sm:text-xl text-slate-700 font-sans font-normal leading-relaxed mb-10 max-w-xl">
            {content.subtext}
          </p>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5 mb-12">
            <Button
              to={content.primaryCtaLink}
              size="lg"
              variant="primary"
              icon={<ArrowRight className="w-5 h-5" />}
              className="shadow-md hover:shadow-lg"
            >
              {content.primaryCtaText}
            </Button>
            <Button
              to={content.secondaryCtaLink}
              size="lg"
              variant="secondary"
              className="border-slate-300 hover:border-amber-500 shadow-sm"
            >
              {content.secondaryCtaText}
            </Button>
          </div>

          {/* Feature Badges */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-200/80 max-w-lg">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/90 border border-slate-200/90 shadow-sm backdrop-blur-sm">
              <Zap className="w-4 h-4 text-amber-600 shrink-0" />
              <div className="text-xs">
                <span className="font-heading uppercase font-bold text-slate-900 block">High Tempo</span>
                <span className="text-[11px] text-slate-500 font-sans">Drills &amp; rondos</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/90 border border-slate-200/90 shadow-sm backdrop-blur-sm">
              <Shield className="w-4 h-4 text-amber-600 shrink-0" />
              <div className="text-xs">
                <span className="font-heading uppercase font-bold text-slate-900 block">Pro Mentors</span>
                <span className="text-[11px] text-slate-500 font-sans">Qualified staff</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/90 border border-slate-200/90 shadow-sm backdrop-blur-sm">
              <Trophy className="w-4 h-4 text-amber-600 shrink-0" />
              <div className="text-xs">
                <span className="font-heading uppercase font-bold text-slate-900 block">Match Ready</span>
                <span className="text-[11px] text-slate-500 font-sans">11v11 leagues</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};
