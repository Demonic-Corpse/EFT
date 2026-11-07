import React from 'react';
import { ArrowRight, PhoneCall, Calendar } from 'lucide-react';
import { Button } from '../common/Button';
import { ACADEMY_CONFIG } from '../../data/academyData';

export const HomeCtaBanner: React.FC = () => {
  return (
    <section className="relative py-20 sm:py-24 bg-gradient-to-b from-amber-50/60 via-white to-amber-50/40 overflow-hidden border-t border-slate-200">
      {/* Pitch grass pattern & radial amber glow */}
      <div className="absolute inset-0 bg-carbon-grid opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-80 bg-amber-400/15 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 text-amber-800 text-xs font-heading font-bold uppercase tracking-widest mb-6 shadow-sm">
          <Calendar className="w-3.5 h-3.5 text-amber-600" />
          <span>New Training Batches Opening Soon</span>
        </div>

        <h2 className="text-4xl sm:text-5xl md:text-6xl font-display uppercase tracking-wide text-slate-900 leading-tight mb-6">
          YOUR FOOTBALL JOURNEY <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 drop-shadow-[0_2px_15px_rgba(217,119,6,0.25)]">
            STARTS HERE.
          </span>
        </h2>

        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10 font-sans">
          Take the next step in your game. Connect with Elite Football Training and discover the right training path for you.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <Button
            to="/contact"
            size="lg"
            variant="primary"
            icon={<ArrowRight className="w-5 h-5" />}
            className="shadow-md hover:shadow-lg w-full sm:w-auto"
          >
            Contact the Academy
          </Button>

          <Button
            href={`https://wa.me/${ACADEMY_CONFIG.whatsappNumber.replace(/[^0-9]/g, '')}?text=Hello%20Elite%20Football%20Training%20Academy%2C%20I%20would%20like%20to%20enquire%20about%20training%20sessions.`}
            size="lg"
            variant="secondary"
            icon={<PhoneCall className="w-5 h-5" />}
            className="w-full sm:w-auto shadow-sm"
          >
            Direct WhatsApp Enquiry
          </Button>
        </div>

        <div className="mt-8 text-xs text-slate-500 font-mono">
          Response within 24 hours &bull; All age groups from U-9 to Senior Men & Women
        </div>
      </div>
    </section>
  );
};
