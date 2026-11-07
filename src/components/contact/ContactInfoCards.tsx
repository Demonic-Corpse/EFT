import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, MessageSquare, ExternalLink, Navigation, Compass } from 'lucide-react';
import { ACADEMY_CONFIG } from '../../data/academyData';
import { Button } from '../common/Button';

export const ContactInfoCards: React.FC = () => {
  const [config, setConfig] = useState(ACADEMY_CONFIG);

  useEffect(() => {
    fetch('/api/content/public')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.contact) {
          setConfig((prev) => ({
            ...prev,
            ...data.contact,
          }));
        }
      })
      .catch((err) => console.warn('Could not fetch dynamic contact content:', err));
  }, []);

  const phone = config.phone || ACADEMY_CONFIG.phone;
  const email = config.email || ACADEMY_CONFIG.email;
  const location = config.location || ACADEMY_CONFIG.location;
  const addressDetails = config.addressDetails || ACADEMY_CONFIG.addressDetails;
  const operatingHours = config.operatingHours || ACADEMY_CONFIG.operatingHours;
  const whatsappNumber = config.whatsappNumber || ACADEMY_CONFIG.whatsappNumber;
  const googleMapsEmbedUrl =
    config.googleMapsEmbedUrl ||
    'https://maps.google.com/maps?q=18.62161,73.71343&hl=en&z=16&output=embed';
  const latitude = config.latitude || '18.62161° N (18° 37′ 18″ N)';
  const longitude = config.longitude || '73.71343° E (73° 42′ 48″ E)';
  const googleMapsUrl =
    config.googleMapsUrl || 'https://www.google.com/maps?q=18.62161,73.71343';
  const mapcartaUrl =
    config.mapcartaUrl || 'https://mapcarta.com/N8585616660';

  return (
    <div className="space-y-6">
      {/* Contact Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Card 1: Phone */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 transition-colors shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Phone className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-heading uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
              Direct Coaching Line
            </span>
          </div>
          <span className="text-xs font-heading uppercase tracking-wider text-slate-500 font-bold block mb-1">
            Academy Phone Line
          </span>
          <a
            href={`tel:${phone}`}
            className="text-lg font-mono font-bold text-slate-900 hover:text-amber-600 transition-colors block"
          >
            {phone}
          </a>
          <span className="text-[11px] text-slate-500 font-mono mt-1 block">
            Mon–Sat: 06:30 AM – 08:30 PM
          </span>
        </div>

        {/* Card 2: Email */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 transition-colors shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Mail className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-heading uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700">
              Trials & Admissions
            </span>
          </div>
          <span className="text-xs font-heading uppercase tracking-wider text-slate-500 font-bold block mb-1">
            Official Email
          </span>
          <a
            href={`mailto:${email}`}
            className="text-lg font-mono font-bold text-slate-900 hover:text-amber-600 transition-colors block truncate"
          >
            {email}
          </a>
          <span className="text-[11px] text-slate-500 font-mono mt-1 block">
            Coaching & trials correspondence
          </span>
        </div>

        {/* Card 3: Location */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 transition-colors shadow-sm sm:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <MapPin className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-heading uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700">
              Official Academy Pitch
            </span>
          </div>
          <span className="text-xs font-heading uppercase tracking-wider text-slate-500 font-bold block mb-1">
            Training Ground & Academy Facility
          </span>
          <h4 className="text-base sm:text-lg font-heading font-bold text-slate-900 uppercase tracking-wide">
            {location}
          </h4>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            {addressDetails}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-800 bg-amber-50/90 px-3 py-1.5 rounded-lg border border-amber-200/80">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>{operatingHours}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              <Compass className="w-3.5 h-3.5 text-amber-600" />
              <span>{latitude}, {longitude}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Direct WhatsApp Action Box */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-50 via-amber-100/40 to-amber-50 border border-amber-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-amber-600" />
            <h4 className="font-heading uppercase font-bold text-slate-900 text-base tracking-wide">
              Instant WhatsApp Support
            </h4>
          </div>
          <p className="text-xs text-slate-600">
            Have questions regarding age criteria, kit requirements, or weekend slots? Chat directly with the coaching coordinator.
          </p>
        </div>

        <Button
          href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=Hello%20Elite%20Football%20Training%2C%20I%20would%20like%20to%20know%20more%20about%20your%20football%20academy%20at%20Crimson%20Anisha%20pitch.`}
          variant="primary"
          size="sm"
          icon={<ExternalLink className="w-3.5 h-3.5" />}
          className="shrink-0 font-bold"
        >
          Chat on WhatsApp
        </Button>
      </div>

      {/* Google Maps Embed / Interactive Academy Pitch */}
      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-heading font-bold uppercase tracking-wider text-slate-800">
            <Navigation className="w-4 h-4 text-amber-600" />
            <span>Academy Pitch Map Preview</span>
          </div>
          <span className="text-[11px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-bold">
            18.62161° N, 73.71343° E
          </span>
        </div>

        <div className="relative h-72 sm:h-80 w-full bg-slate-100 flex items-center justify-center overflow-hidden">
          {/* Interactive frame with clean map view */}
          <iframe
            title="Elite Football Training Map Location - Crimson Anisha Pitch"
            src={googleMapsEmbedUrl}
            className="w-full h-full"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />

          <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-lg bg-white/95 border border-slate-200 backdrop-blur-md flex flex-wrap items-center justify-between text-xs text-slate-600 shadow-md gap-2">
            <span className="font-mono truncate mr-2">
              GPS: 18°37′18″N, 73°42′48″E (Mulshi / Hinjawadi, Pune)
            </span>
            <div className="flex items-center gap-3">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-600 hover:text-amber-700 flex items-center gap-1 font-heading uppercase font-bold shrink-0"
              >
                <span>Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-slate-300">|</span>
              <a
                href={mapcartaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-600 hover:text-amber-700 flex items-center gap-1 font-heading uppercase font-bold shrink-0"
              >
                <span>Mapcarta</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
