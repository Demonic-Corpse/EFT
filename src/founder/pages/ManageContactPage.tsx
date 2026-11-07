import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Compass,
  Save,
  RefreshCw,
  ExternalLink,
  Navigation,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Globe
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { ACADEMY_CONFIG } from '../../data/academyData';

export const ManageContactPage: React.FC = () => {
  const { authFetch } = useAuth();
  const { success, error } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [contactData, setContactData] = useState({
    academyName: ACADEMY_CONFIG.academyName || 'Elite Football Training',
    tagline: ACADEMY_CONFIG.tagline || 'TRAIN HARD. PLAY ELITE.',
    phone: ACADEMY_CONFIG.phone || '+91 7768993889',
    email: ACADEMY_CONFIG.email || 'elitefootballtraining01@gmail.com',
    location: ACADEMY_CONFIG.location || 'Crimson Anisha Football Pitch, Pune',
    addressDetails:
      ACADEMY_CONFIG.addressDetails ||
      'Crimson Anisha Football Ground, Marunji Road, near Life Republic, Hinjawadi Phase 1 / Mulshi, Pune, Maharashtra 411057',
    operatingHours:
      ACADEMY_CONFIG.operatingHours ||
      '4:30 PM to 5:30 PM - Junior batch | 5:30 PM to 6:30 PM - Senior batch',
    whatsappNumber: ACADEMY_CONFIG.whatsappNumber || '+917768993889',
    latitude: ACADEMY_CONFIG.latitude || '18.62161° N (18° 37′ 18″ N)',
    longitude: ACADEMY_CONFIG.longitude || '73.71343° E (73° 42′ 48″ E)',
    googleMapsEmbedUrl:
      ACADEMY_CONFIG.googleMapsEmbedUrl ||
      'https://maps.google.com/maps?q=18.62161,73.71343&hl=en&z=16&output=embed',
    googleMapsUrl:
      ACADEMY_CONFIG.googleMapsUrl || 'https://www.google.com/maps?q=18.62161,73.71343',
    mapcartaUrl:
      ACADEMY_CONFIG.mapcartaUrl || 'https://mapcarta.com/N8585616660',
    instagramUrl: ACADEMY_CONFIG.instagramUrl || 'https://instagram.com/elitefootballtraining',
    youtubeUrl: ACADEMY_CONFIG.youtubeUrl || 'https://youtube.com/@elitefootballtraining',
  });

  const fetchContact = async () => {
    setLoading(true);
    try {
      const res = await authFetch('/api/content/public');
      if (res.ok) {
        const data = await res.json();
        if (data && data.contact) {
          setContactData((prev) => ({
            ...prev,
            ...data.contact,
          }));
        }
      }
    } catch (err: any) {
      error('Failed to load published contact content.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContact();
  }, []);

  const handleApplyOfficialCoordinates = () => {
    setContactData((prev) => ({
      ...prev,
      location: 'Crimson Anisha Football Pitch, Pune',
      addressDetails:
        'Crimson Anisha Football Ground, Marunji Road, near Life Republic, Hinjawadi Phase 1 / Mulshi, Pune, Maharashtra 411057',
      latitude: '18.62161° N (18° 37′ 18″ N)',
      longitude: '73.71343° E (73° 42′ 48″ E)',
      googleMapsEmbedUrl:
        'https://maps.google.com/maps?q=18.62161,73.71343&hl=en&z=16&output=embed',
      googleMapsUrl: 'https://www.google.com/maps?q=18.62161,73.71343',
      mapcartaUrl: 'https://mapcarta.com/N8585616660',
    }));
    success('Applied Crimson Anisha pitch coordinates (18.62161° N, 73.71343° E)!');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await authFetch('/api/content/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update contact info.');
      }

      success('Academy contact info & pitch location saved successfully!');
    } catch (err: any) {
      error(err.message || 'Error updating contact information.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <span className="text-[11px] font-heading uppercase tracking-widest text-amber-500 font-bold block mb-1">
            FACILITY &amp; COMMUNICATION SETTINGS
          </span>
          <h2 className="text-2xl font-display uppercase tracking-tight text-white flex items-center gap-2.5">
            <MapPin className="w-6 h-6 text-amber-500" />
            <span>Manage Contact &amp; Pitch Location</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Configure official phone numbers, enquiry email, WhatsApp routing, and GPS coordinates for the academy pitch.
            Updates take effect immediately on public Contact cards, Google Maps embed, and website footer.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleApplyOfficialCoordinates}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 text-xs font-heading uppercase font-bold tracking-wider transition-colors flex items-center gap-1.5"
            title="Load Pune Hinjawadi Pitch Coordinates"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Apply Pitch GPS</span>
          </button>

          <button
            type="button"
            onClick={fetchContact}
            disabled={loading}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700"
            title="Refresh from server"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Form (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Academy Pitch & GPS Location */}
            <div className="bg-[#0f1523] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Navigation className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-heading uppercase font-bold text-sm text-white tracking-wide">
                      Academy Training Pitch &amp; Coordinates
                    </h3>
                    <span className="text-[11px] text-slate-400 font-sans">
                      Ground address, map embeddings, and navigational links
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                  Verified Node
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                    Pitch Complex / Ground Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactData.location}
                    onChange={(e) => setContactData({ ...contactData, location: e.target.value })}
                    placeholder="e.g. Crimson Anisha Football Pitch, Pune"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                    Full Postal Address &amp; Landmarks *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={contactData.addressDetails}
                    onChange={(e) => setContactData({ ...contactData, addressDetails: e.target.value })}
                    placeholder="Detailed ground address"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                      Pitch Latitude *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactData.latitude}
                      onChange={(e) => setContactData({ ...contactData, latitude: e.target.value })}
                      placeholder="18.62161° N (18° 37′ 18″ N)"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                      Pitch Longitude *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactData.longitude}
                      onChange={(e) => setContactData({ ...contactData, longitude: e.target.value })}
                      placeholder="73.71343° E (73° 42′ 48″ E)"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                    Google Maps Embed URL (Iframe Src)
                  </label>
                  <input
                    type="url"
                    value={contactData.googleMapsEmbedUrl}
                    onChange={(e) => setContactData({ ...contactData, googleMapsEmbedUrl: e.target.value })}
                    placeholder="https://maps.google.com/maps?q=18.62161,73.71343&output=embed"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                      Direct Google Maps Link
                    </label>
                    <input
                      type="url"
                      value={contactData.googleMapsUrl}
                      onChange={(e) => setContactData({ ...contactData, googleMapsUrl: e.target.value })}
                      placeholder="https://www.google.com/maps?q=18.62161,73.71343"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                      Mapcarta Location Link
                    </label>
                    <input
                      type="url"
                      value={contactData.mapcartaUrl}
                      onChange={(e) => setContactData({ ...contactData, mapcartaUrl: e.target.value })}
                      placeholder="https://mapcarta.com/N8585616660"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Direct Channels (Phone, Email, WhatsApp) */}
            <div className="bg-[#0f1523] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800/80">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading uppercase font-bold text-sm text-white tracking-wide">
                    Direct Contact &amp; Messaging Lines
                  </h3>
                  <span className="text-[11px] text-slate-400 font-sans">
                    Parent correspondence &amp; admissions routing
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                    Official Academy Phone *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactData.phone}
                    onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                    placeholder="+91 7768993889"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                    Official Enquiry Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={contactData.email}
                    onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                    placeholder="elitefootballtraining01@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                    WhatsApp Chat Number (Digits) *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactData.whatsappNumber}
                    onChange={(e) => setContactData({ ...contactData, whatsappNumber: e.target.value })}
                    placeholder="+917768993889"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                    Operating Training Hours *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactData.operatingHours}
                    onChange={(e) => setContactData({ ...contactData, operatingHours: e.target.value })}
                    placeholder="4:30 PM to 5:30 PM - Junior batch | 5:30 PM to 6:30 PM - Senior batch"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* 3. Branding & Social */}
            <div className="bg-[#0f1523] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800/80">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading uppercase font-bold text-sm text-white tracking-wide">
                    Academy Identity &amp; Social Links
                  </h3>
                  <span className="text-[11px] text-slate-400 font-sans">
                    Public branding and social profiles
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                    Academy Name
                  </label>
                  <input
                    type="text"
                    value={contactData.academyName}
                    onChange={(e) => setContactData({ ...contactData, academyName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={contactData.tagline}
                    onChange={(e) => setContactData({ ...contactData, tagline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    value={contactData.instagramUrl}
                    onChange={(e) => setContactData({ ...contactData, instagramUrl: e.target.value })}
                    placeholder="https://instagram.com/elitefootballtraining"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                    YouTube URL
                  </label>
                  <input
                    type="url"
                    value={contactData.youtubeUrl}
                    onChange={(e) => setContactData({ ...contactData, youtubeUrl: e.target.value })}
                    placeholder="https://youtube.com/@elitefootballtraining"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-heading font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50 cursor-pointer"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Contact Information</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Live Preview Box (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0f1523] border border-slate-800 rounded-3xl p-5 shadow-xl sticky top-24 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-[11px] font-heading uppercase tracking-widest text-amber-500 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Public Contact Preview</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Live Widget</span>
              </div>

              {/* Preview Cards */}
              <div className="p-4 rounded-2xl bg-white text-slate-900 space-y-4 shadow-sm border border-slate-200">
                <div>
                  <div className="flex items-center gap-1.5 text-amber-600 mb-1">
                    <MapPin className="w-4 h-4" />
                    <span className="text-[10px] font-heading uppercase font-bold tracking-wider">
                      Academy Pitch Location
                    </span>
                  </div>
                  <h4 className="font-heading font-bold text-sm uppercase text-slate-900">
                    {contactData.location || 'Crimson Anisha Football Pitch'}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    {contactData.addressDetails || 'Marunji Road, near Life Republic, Hinjawadi, Pune'}
                  </p>
                  <div className="mt-2 text-[11px] font-mono text-amber-800 bg-amber-50 p-1.5 rounded border border-amber-200">
                    GPS: {contactData.latitude}, {contactData.longitude}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Phone</span>
                    <span className="font-mono font-bold text-slate-800">{contactData.phone}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Email</span>
                    <span className="font-mono font-bold text-slate-800 truncate block">{contactData.email}</span>
                  </div>
                </div>
              </div>

              {/* Live Map Preview */}
              <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                <div className="p-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="font-heading uppercase font-bold text-slate-300 flex items-center gap-1">
                    <Navigation className="w-3 h-3 text-amber-500" />
                    <span>Embedded Map</span>
                  </span>
                  <a
                    href={contactData.mapcartaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:text-amber-300 flex items-center gap-1 text-[10px] font-mono"
                  >
                    <span>Mapcarta #N8585616660</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>

                <div className="relative h-56 w-full bg-slate-900">
                  <iframe
                    title="Pitch Map Preview"
                    src={contactData.googleMapsEmbedUrl}
                    className="w-full h-full"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  All changes saved here automatically synchronize across all visitor-facing contact sections, maps, and footers.
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

