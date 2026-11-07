import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield, ArrowRight, PhoneCall } from 'lucide-react';
import { ACADEMY_CONFIG } from '../../data/academyData';

const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Training', path: '/training' },
  { name: 'Album', path: '/album' },
  { name: 'Reviews', path: '/reviews' },
  { name: 'Contact', path: '/contact' },
];

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-sm py-2.5'
            : 'bg-white/90 backdrop-blur-sm border-b border-slate-200/60 py-3.5 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)]'
          }`}
      >
        <div className="w-full max-w-[1560px] mx-auto px-8 sm:px-14 md:px-20 lg:px-28 xl:px-36">
          <div className="flex items-center justify-between">
            {/* Logo with User Uploaded Image & Highlighted Name */}
            <Link
              to="/"
              className="flex items-center gap-3 group focus:outline-none"
              aria-label="Elite Football Training - Home"
            >
              <img
                src="/logo.png"
                alt="Elite Football Training Logo"
                className="h-11 sm:h-12 md:h-13 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-md"
              />
              <div className="flex flex-col">
                <span className="font-display text-xl sm:text-2xl tracking-wide text-slate-900 uppercase leading-none group-hover:text-amber-600 transition-colors">
                  Elite Football
                </span>
                <span className="text-[10px] sm:text-xs font-heading font-extrabold uppercase tracking-[0.22em] text-amber-600 leading-none mt-0.5">
                  Training
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Main Navigation">
              {NAV_LINKS.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-3.5 py-2 text-sm uppercase tracking-wider font-heading font-bold transition-colors duration-200 ${isActive ? 'text-amber-600 font-extrabold' : 'text-slate-700 hover:text-amber-600'
                      }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-amber-500 shadow-glow-sm rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* CTA Button & Mobile Trigger */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <Link
                to="/contact"
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs md:text-sm uppercase tracking-wider font-heading font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 hover:shadow-glow-md transition-all duration-300 active:scale-95 border border-amber-500 shadow-sm"
              >
                <span>Join Training</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Mobile Menu Toggle Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-lg text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 border border-slate-200 focus:outline-none"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-6 h-6 text-amber-600" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Slide-out Menu Panel */}
        <div
          className={`fixed top-0 right-0 bottom-0 w-full max-w-xs bg-white border-l border-slate-200 p-6 flex flex-col justify-between shadow-2xl transform transition-transform duration-300 ease-out ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-slate-200">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5">
                <img
                  src="/logo.png"
                  alt="Elite Football Training Logo"
                  className="h-10 w-auto object-contain drop-shadow-md"
                />
                <div className="flex flex-col">
                  <span className="font-display text-lg tracking-wide text-slate-900 uppercase leading-none">
                    Elite Football
                  </span>
                  <span className="text-[10px] font-heading font-extrabold uppercase tracking-[0.22em] text-amber-600 leading-none mt-0.5">
                    Training
                  </span>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Links */}
            <div className="flex flex-col py-6 space-y-1">
              {NAV_LINKS.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg text-base font-heading font-semibold uppercase tracking-wider transition-colors ${isActive
                        ? 'bg-amber-50 text-amber-700 border-l-4 border-amber-500 font-bold'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                  >
                    <span>{link.name}</span>
                    {isActive && <span className="w-2 h-2 rounded-full bg-amber-500 shadow-glow-sm" />}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="space-y-3 pt-6 border-t border-slate-200">
            <Link
              to="/contact"
              className="w-full py-3.5 rounded-lg flex items-center justify-center gap-2 bg-amber-500 text-slate-950 font-heading font-bold text-base uppercase tracking-wider shadow-sm hover:bg-amber-400 transition-colors"
            >
              <span>Join Training</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-600 font-mono pt-1">
              <PhoneCall className="w-3.5 h-3.5 text-amber-600" />
              <span>{ACADEMY_CONFIG.phone}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
