import React, { useState, useEffect } from 'react';
import {
  Globe,
  Save,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Layers,
  Sparkles,
  Award,
  Phone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

export const WebsiteContentPage: React.FC = () => {
  const { authFetch } = useAuth();
  const { success, error } = useToast();

  const [activeTab, setActiveTab] = useState<'hero' | 'stats' | 'about' | 'contact'>('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Section States
  const [heroData, setHeroData] = useState<any>({
    eyebrow: 'ELITE FOOTBALL TRAINING',
    headlinePart1: 'TRAIN HARD.',
    headlinePart2: 'PLAY ELITE.',
    subtext: 'Develop your skills, build confidence, and take your football to the next level with Elite Football Training.',
    primaryCtaText: 'Join Our Training',
    primaryCtaLink: '/contact',
    secondaryCtaText: 'Explore Our Academy',
    secondaryCtaLink: '/about',
    badge1Title: 'High Tempo',
    badge1Subtitle: 'Drills & rondos',
    badge2Title: 'Pro Mentors',
    badge2Subtitle: 'Qualified staff',
    badge3Title: 'Match Ready',
    badge3Subtitle: '11v11 leagues'
  });

  const [statsData, setStatsData] = useState<any>({
    playersTrained: '250+',
    yearsExperience: '8+',
    trainingSessions: '1,200+',
    qualifiedCoaches: '6+'
  });

  const [aboutData, setAboutData] = useState<any>({
    missionHeadline: 'OUR MISSION',
    missionQuote: 'To provide a positive, structured, and development-focused football training environment where every player can learn, grow, and improve.',
    visionHeadline: 'OUR VISION',
    visionQuote: 'To inspire the next generation of footballers through quality coaching, discipline, teamwork, and dedication.',
    storyParagraph1: 'Elite Football Training was established with a vision to help aspiring footballers improve their technical ability, physical fitness, tactical understanding, and confidence.',
    storyParagraph2: 'Our coaching methodology combines high-repetition technical ball control with game-realistic decision making.'
  });

  const [contactData, setContactData] = useState<any>({
    academyName: 'Elite Football Training',
    tagline: 'TRAIN HARD. PLAY ELITE.',
    phone: '+91 7768993889',
    email: 'elitefootballtraining01@gmail.com',
    location: 'Sports Complex, Ground 2, Stadium Road, City',
    operatingHours: '4:30 PM to 5:30 PM - Junior batch | 5:30 PM to 6:30 PM - Senior batch',
    whatsappNumber: '+917768993889',
    instagramUrl: 'https://instagram.com/elitefootballtraining',
    youtubeUrl: 'https://youtube.com/@elitefootballtraining'
  });

  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await authFetch('/api/content/public');
      if (res.ok) {
        const data = await res.json();
        if (data.hero) setHeroData(data.hero);
        if (data.stats) setStatsData(data.stats);
        if (data.about) setAboutData(data.about);
        if (data.contact) setContactData(data.contact);
      }
    } catch (err: any) {
      error('Failed to load published website content.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const saveCurrentSection = async () => {
    setSaving(true);
    let payload: any = {};
    if (activeTab === 'hero') payload = heroData;
    else if (activeTab === 'stats') payload = statsData;
    else if (activeTab === 'about') payload = aboutData;
    else if (activeTab === 'contact') payload = contactData;

    try {
      const res = await authFetch(`/api/content/${activeTab}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed to publish content.');
      success(`Website ${activeTab.toUpperCase()} section published live!`);
    } catch (err: any) {
      error(err.message || 'Error updating website content.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <span className="text-xs uppercase font-heading font-bold text-amber-500 tracking-wider">
            Public Website CMS
          </span>
          <h2 className="text-2xl sm:text-3xl font-display uppercase tracking-tight text-white">
            WEBSITE CONTENT CONTROLS
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-heading uppercase font-semibold transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-500" />
            <span>Preview Live Site</span>
          </a>

          <button
            type="button"
            onClick={saveCurrentSection}
            disabled={saving || loading}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-heading font-black text-xs uppercase tracking-wider transition-colors shadow-md shadow-amber-500/20 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Publishing...' : 'Save & Publish Changes'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="p-2 rounded-2xl bg-[#0f1523] border border-slate-800 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('hero')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-heading uppercase font-bold tracking-wider transition-colors ${activeTab === 'hero'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
            }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Home Hero Section</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('stats')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-heading uppercase font-bold tracking-wider transition-colors ${activeTab === 'stats'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
            }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Academy Statistics</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('about')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-heading uppercase font-bold tracking-wider transition-colors ${activeTab === 'about'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
            }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>About &amp; Mission</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('contact')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-heading uppercase font-bold tracking-wider transition-colors ${activeTab === 'contact'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
            }`}
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Contact Details</span>
        </button>
      </div>

      {/* TAB CONTENT */}
      <div className="bg-[#0f1523] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        {/* 1. HERO SECTION */}
        {activeTab === 'hero' && (
          <div className="space-y-5">
            <h3 className="font-heading font-bold uppercase text-sm text-amber-500 tracking-wider">
              Homepage Hero Headline &amp; Buttons
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                  Top Eyebrow Badge
                </label>
                <input
                  type="text"
                  value={heroData.eyebrow}
                  onChange={(e) => setHeroData({ ...heroData, eyebrow: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                  Headline Part 1
                </label>
                <input
                  type="text"
                  value={heroData.headlinePart1}
                  onChange={(e) => setHeroData({ ...heroData, headlinePart1: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                  Headline Part 2 (Gold Gradient)
                </label>
                <input
                  type="text"
                  value={heroData.headlinePart2}
                  onChange={(e) => setHeroData({ ...heroData, headlinePart2: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                  Supporting Pitch Subtitle
                </label>
                <textarea
                  rows={2}
                  value={heroData.subtext}
                  onChange={(e) => setHeroData({ ...heroData, subtext: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                  Primary CTA Button Label
                </label>
                <input
                  type="text"
                  value={heroData.primaryCtaText}
                  onChange={(e) => setHeroData({ ...heroData, primaryCtaText: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                  Secondary CTA Button Label
                </label>
                <input
                  type="text"
                  value={heroData.secondaryCtaText}
                  onChange={(e) => setHeroData({ ...heroData, secondaryCtaText: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* 2. STATS SECTION */}
        {activeTab === 'stats' && (
          <div className="space-y-5">
            <h3 className="font-heading font-bold uppercase text-sm text-amber-500 tracking-wider">
              Academy Credibility Counter Figures
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                  Players Trained
                </label>
                <input
                  type="text"
                  value={statsData.playersTrained}
                  onChange={(e) => setStatsData({ ...statsData, playersTrained: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                  Years of Experience
                </label>
                <input
                  type="text"
                  value={statsData.yearsExperience}
                  onChange={(e) => setStatsData({ ...statsData, yearsExperience: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                  Training Sessions Delivered
                </label>
                <input
                  type="text"
                  value={statsData.trainingSessions}
                  onChange={(e) => setStatsData({ ...statsData, trainingSessions: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                  Licensed Coaches
                </label>
                <input
                  type="text"
                  value={statsData.qualifiedCoaches}
                  onChange={(e) => setStatsData({ ...statsData, qualifiedCoaches: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* 3. ABOUT SECTION */}
        {activeTab === 'about' && (
          <div className="space-y-5">
            <h3 className="font-heading font-bold uppercase text-sm text-amber-500 tracking-wider">
              About Academy, Mission, &amp; Vision
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                  Mission Quote
                </label>
                <textarea
                  rows={2}
                  value={aboutData.missionQuote}
                  onChange={(e) => setAboutData({ ...aboutData, missionQuote: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                  Vision Quote
                </label>
                <textarea
                  rows={2}
                  value={aboutData.visionQuote}
                  onChange={(e) => setAboutData({ ...aboutData, visionQuote: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                  Academy Story Paragraph
                </label>
                <textarea
                  rows={3}
                  value={aboutData.storyParagraph1}
                  onChange={(e) => setAboutData({ ...aboutData, storyParagraph1: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* 4. CONTACT SECTION */}
        {activeTab === 'contact' && (
          <div className="space-y-5">
            <h3 className="font-heading font-bold uppercase text-sm text-amber-500 tracking-wider">
              Public Contact &amp; Pitch Location Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                  Official Phone Number
                </label>
                <input
                  type="text"
                  value={contactData.phone}
                  onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                  Enquiry Email Address
                </label>
                <input
                  type="email"
                  value={contactData.email}
                  onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                  WhatsApp Contact Number (International Format)
                </label>
                <input
                  type="text"
                  value={contactData.whatsappNumber}
                  onChange={(e) => setContactData({ ...contactData, whatsappNumber: e.target.value })}
                  placeholder="+917768993889"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                  Operating Hours
                </label>
                <input
                  type="text"
                  value={contactData.operatingHours}
                  onChange={(e) => setContactData({ ...contactData, operatingHours: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                  Pitch Complex Address
                </label>
                <input
                  type="text"
                  value={contactData.location}
                  onChange={(e) => setContactData({ ...contactData, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
