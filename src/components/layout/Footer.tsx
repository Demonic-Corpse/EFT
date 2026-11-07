import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Youtube,
  ArrowUpRight,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { ACADEMY_CONFIG } from '../../data/academyData';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="relative bg-slate-100 border-t border-slate-200/90 pt-16 pb-12 overflow-hidden text-slate-600">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-amber-400/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-slate-200">
            {/* Column 1: Brand & Bio (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <Link to="/" className="inline-flex items-center gap-3.5 group">
                <img
                  src="/logo.png"
                  alt="Elite Football Training Logo"
                  className="h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-md"
                />
                <div className="flex flex-col">
                  <span className="font-display text-2xl tracking-wide text-slate-900 uppercase leading-none group-hover:text-amber-600 transition-colors">
                    Elite Football
                  </span>
                  <span className="text-xs font-heading font-extrabold uppercase tracking-[0.25em] text-amber-600 leading-none mt-0.5">
                    Training
                  </span>
                </div>
              </Link>
              <p className="text-sm text-slate-600 leading-relaxed max-w-sm">
                Empowering youth and senior players with professional technical ball mastery, tactical
                game intelligence, and athletic conditioning in an elite sports environment.
              </p>
              <div className="pt-2 flex items-center gap-3">
                <a
                  href={ACADEMY_CONFIG.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-amber-600 hover:border-amber-400 shadow-sm transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href={ACADEMY_CONFIG.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-amber-600 hover:border-amber-400 shadow-sm transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Column 2: Navigation Links (2 cols) */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-heading uppercase tracking-wider text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Explore</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              </h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link to="/" className="text-slate-600 hover:text-amber-600 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-slate-600 hover:text-amber-600 transition-colors">
                    About Academy
                  </Link>
                </li>
                <li>
                  <Link to="/training" className="text-slate-600 hover:text-amber-600 transition-colors">
                    Training Programs
                  </Link>
                </li>
                <li>
                  <Link to="/album" className="text-slate-600 hover:text-amber-600 transition-colors">
                    Photo & Video Album
                  </Link>
                </li>
                <li>
                  <Link to="/reviews" className="text-slate-600 hover:text-amber-600 transition-colors">
                    Reviews & Feedback
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-slate-600 hover:text-amber-600 transition-colors">
                    Contact & Enquiries
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Training Focus (3 cols) */}
            <div className="lg:col-span-3 space-y-4">
              <h3 className="font-heading uppercase tracking-wider text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Core Programmes</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              </h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Technical Ball Mastery</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Passing & 1-Touch Circulation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Dribbling & Power Finishing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Speed, Agility & Conditioning</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>11v11 Match Preparation</span>
                </li>
              </ul>
              <div className="pt-1">
                <Link
                  to="/training"
                  className="inline-flex items-center gap-1 text-xs uppercase font-heading font-bold text-amber-600 hover:text-amber-700 hover:underline"
                >
                  <span>View All Schedules</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Column 4: Contact & Pitch Location (3 cols) */}
            <div className="lg:col-span-3 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading uppercase tracking-wider text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>Academy HQ</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                  Pune Campus
                </span>
              </div>

              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-900 font-mono font-semibold block">{ACADEMY_CONFIG.location}</span>
                    <span className="text-xs text-slate-500 block leading-relaxed">
                      {ACADEMY_CONFIG.addressDetails}
                    </span>
                    <span className="text-[11px] font-mono text-amber-700 block mt-1">
                      GPS: 18.62161° N, 73.71343° E
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-amber-600 shrink-0" />
                  <a href={`tel:${ACADEMY_CONFIG.phone}`} className="text-slate-900 font-mono font-semibold hover:text-amber-600">
                    {ACADEMY_CONFIG.phone}
                  </a>
                </div>

                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-amber-600 shrink-0" />
                  <a href={`mailto:${ACADEMY_CONFIG.email}`} className="text-slate-900 font-mono font-semibold hover:text-amber-600">
                    {ACADEMY_CONFIG.email}
                  </a>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-500">
                    Sessions: {ACADEMY_CONFIG.operatingHours}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-sans">
            <div>
              &copy; {currentYear} <span className="text-slate-800 font-semibold">Elite Football Training</span>. All rights reserved.
            </div>

            <div className="flex items-center gap-4">
              <Link
                to="/privacy-policy"
                className="hover:text-amber-600 transition-colors underline-offset-4 hover:underline"
              >
                Privacy Policy
              </Link>
              <span>&bull;</span>
              <Link
                to="/terms-and-conditions"
                className="hover:text-amber-600 transition-colors underline-offset-4 hover:underline"
              >
                Terms &amp; Conditions
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
