import React from 'react';
import { ArrowRight, Zap, HelpCircle } from 'lucide-react';
import { SchedulePreview } from '../components/training/SchedulePreview';
import { Button } from '../components/common/Button';

export const TrainingPage: React.FC = () => {
  return (
    <div className="pt-24 pb-20 bg-slate-50 text-slate-900">
      {/* Hero Section */}
      <section className="relative py-16 sm:py-24 bg-gradient-to-b from-amber-50/60 via-slate-50 to-slate-50 border-b border-slate-200 overflow-hidden">
        {/* Background photo */}
        <div className="absolute inset-0 z-0 opacity-15">
          <img
            src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1800&q=80"
            alt="Football training session with cones and footballs"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-50/85" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 text-amber-800 text-xs font-heading font-bold uppercase tracking-widest mb-6 shadow-sm">
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>Structured Development Pathways</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-display uppercase tracking-tight text-slate-900 leading-none mb-6">
            DEVELOP YOUR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 drop-shadow-[0_2px_15px_rgba(217,119,6,0.25)]">
              FULL POTENTIAL.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto font-sans leading-relaxed mb-8">
            Six comprehensive training disciplines engineered to build world-class ball mastery, explosive athleticism, and intelligent tactical decision-making.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              to="/contact"
              size="lg"
              variant="primary"
              icon={<ArrowRight className="w-5 h-5" />}
              className="shadow-sm"
            >
              Enquire About Training
            </Button>
          </div>
        </div>
      </section>

      {/* Schedule Preview Section with Table */}
      <SchedulePreview />

      {/* FAQ / Enquiry Assistance Box */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-amber-300 text-center relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-1/2 translate-x-1/2 w-96 h-32 bg-amber-400/10 blur-3xl rounded-full" />
          
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-6 shadow-sm">
            <HelpCircle className="w-7 h-7" />
          </div>

          <h3 className="text-3xl sm:text-4xl font-display uppercase tracking-wide text-slate-900 mb-4">
            UNSURE WHICH PROGRAM SUITS YOU?
          </h3>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto mb-8 font-sans leading-relaxed">
            Our coaching team conducts non-judgmental skill assessments to place every player in the cohort where they will experience optimal challenge and rapid growth.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              to="/contact"
              size="lg"
              variant="primary"
              icon={<ArrowRight className="w-5 h-5" />}
              className="shadow-sm"
            >
              Book Player Evaluation Trial
            </Button>
            <Button
              to="/reviews"
              size="lg"
              variant="secondary"
              className="shadow-sm"
            >
              Read Player Experiences
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
