import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  ArrowLeft,
  ShieldCheck,
  Calendar,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Users,
  Camera,
  Scale,
} from 'lucide-react';
import { ACADEMY_CONFIG } from '../data/academyData';

export const TermsPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Terms & Conditions | Elite Football Training';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Terms & Conditions governing website usage, training participation, admissions, and policies for Elite Football Training at Crimson Anisha pitch, Hinjewadi, Pune.'
      );
    }
  }, []);

  const lastUpdated = 'November 2026';

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      {/* Hero Header */}
      <section className="relative py-14 sm:py-20 bg-gradient-to-b from-amber-50/70 via-slate-50 to-slate-50 border-b border-slate-200 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-amber-400/10 blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-6">
            <Link to="/" className="hover:text-amber-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-amber-700 font-semibold">Terms &amp; Conditions</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 text-amber-800 text-xs font-heading font-bold uppercase tracking-widest mb-4 shadow-sm">
            <FileText className="w-3.5 h-3.5 text-amber-600" />
            <span>Academy Legal Policies</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display uppercase tracking-tight text-slate-900 leading-none mb-4">
            TERMS &amp; CONDITIONS
          </h1>

          <p className="text-base sm:text-lg text-slate-600 font-sans leading-relaxed max-w-2xl">
            Please read these Terms &amp; Conditions carefully before using our website or submitting training enquiries for Elite Football Training.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              Effective / Last Updated: {lastUpdated}
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              Pune Campus, Maharashtra
            </span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-heading uppercase tracking-wider font-bold text-slate-600 hover:text-amber-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Academy Home</span>
          </Link>
        </div>

        {/* Advisory Box - Draft & Academy Confirmation Notice */}
        <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-amber-50/80 border border-amber-300/80 text-amber-900 text-xs sm:text-sm leading-relaxed flex items-start gap-3 shadow-sm">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-heading uppercase font-bold text-amber-800 block mb-1 tracking-wide">
              Academy Review &amp; Statutory Alignment Notice
            </span>
            <p>
              This document reflects the operational and web usage framework for Elite Football Training. Specific commercial terms (such as exact monthly fee revisions, tournament fee inclusions, and formal academy waiver forms) remain subject to final confirmation and execution with parents or legal guardians upon player enrollment.
            </p>
          </div>
        </div>

        {/* Policy Document Body */}
        <article className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-10 text-slate-700 font-sans">
          {/* Section 1: Introduction */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-900 uppercase tracking-wide">
                1. Introduction
              </h2>
            </div>
            <p className="text-sm sm:text-base leading-relaxed">
              Welcome to <strong>Elite Football Training</strong>, a football coaching academy located at Crimson Anisha Global School Ground, Marunji, Hinjewadi, Maharashtra, India.
            </p>
            <p className="text-sm sm:text-base leading-relaxed">
              By accessing or browsing this website, or by submitting an admission or trial enquiry through our forms, you acknowledge that you have read, understood, and agree to be bound by these Terms &amp; Conditions. If you do not agree with any part of these terms, please refrain from using this website or submitting personal enquiries.
            </p>
          </section>

          {/* Section 2: Website Usage */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-900 uppercase tracking-wide">
                2. Website Usage
              </h2>
            </div>
            <p className="text-sm sm:text-base leading-relaxed">
              Visitors agree to use this website solely for lawful purposes related to learning about, enrolling in, or engaging with our football coaching programs:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base pl-2 text-slate-600">
              <li>Visitors must use the website strictly for legitimate, lawful purposes.</li>
              <li>Users must not misuse, damage, impair, or attempt to disrupt the functionality, servers, or security infrastructure of the website.</li>
              <li>
                All website content—including text, branding, academy crests, logos, graphic design, and photographs—is the property of Elite Football Training or its content licensors and must not be copied, reproduced, republished, or distributed without prior written permission.
              </li>
            </ul>
          </section>

          {/* Section 3: Training and Admissions */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-900 uppercase tracking-wide">
                3. Training and Admissions
              </h2>
            </div>
            <p className="text-sm sm:text-base leading-relaxed">
              Our training programs and batch enrollments are managed according to coach-to-player ratios and pitch capacity:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base pl-2 text-slate-600">
              <li>All training sessions, batches, and pitch schedules are subject to slot availability and academy calendar schedules.</li>
              <li>Submitting an online enquiry or trial request does not guarantee admission or slot reservation.</li>
              <li>Admissions are confirmed only after direct communication, skill assessment/trial, and formal acceptance by academy coaching staff.</li>
              <li>Monthly training fees, due dates, payment methods, and applicable training kit or pitch arrangements will be directly communicated by the academy.</li>
              <li>Any operational adjustments to training schedules, session timings, or monthly fee structures will be communicated in advance through appropriate academy communication channels (such as WhatsApp, email, or telephone).</li>
            </ul>
          </section>

          {/* Section 4: Training Participation */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-900 uppercase tracking-wide">
                4. Training Participation, Discipline &amp; Health
              </h2>
            </div>
            <p className="text-sm sm:text-base leading-relaxed">
              We prioritize sportsmanship, physical safety, and mutual respect on and off the training pitch:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base pl-2 text-slate-600">
              <li>Players are expected to arrive punctually, follow coaches’ instructions diligently, respect teammates and opponents, and maintain high standards of sports discipline.</li>
              <li>Parents or legal guardians must provide accurate and truthful personal and emergency contact information during registration.</li>
              <li>Parents or guardians must proactively inform the academy coaching staff regarding any relevant medical conditions, allergies, physical limitations, or safety considerations prior to a player taking part in drills.</li>
              <li>Participation in external competitive tournaments or match fixtures is subject to squad selection by coaches, tournament organizers' rules, eligibility criteria, and prior parental/guardian consent where applicable.</li>
            </ul>
          </section>

          {/* Section 5: Photography and Videos */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-900 uppercase tracking-wide">
                5. Photography and Videos
              </h2>
            </div>
            <p className="text-sm sm:text-base leading-relaxed">
              Media documentation helps celebrate player progress and community achievements:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base pl-2 text-slate-600">
              <li>Photographs and videos may be captured during regular academy training drills, friendly matches, and tournament events for coaching analysis, match records, and academy promotional showcases.</li>
              <li>Identifiable photographs or video recordings featuring minors will only be published on the website or official social media channels with appropriate parental or legal guardian consent.</li>
              <li>Parents or legal guardians retain the right at any time to contact the academy to request the withdrawal of consent or removal of specific published photos/videos from future promotional use.</li>
            </ul>
          </section>

          {/* Section 6: Third-Party Services */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-900 uppercase tracking-wide">
                6. Third-Party Services &amp; Links
              </h2>
            </div>
            <p className="text-sm sm:text-base leading-relaxed">
              The website may provide hyperlinks to third-party platforms, including Instagram, YouTube, Google Maps, and WhatsApp. These external services are operated independently. Elite Football Training does not control and is not responsible for the privacy practices, content, availability, or operational policies of any third-party websites or services.
            </p>
          </section>

          {/* Section 7: Limitation of Liability */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-900 uppercase tracking-wide">
                7. Limitation of Liability
              </h2>
            </div>
            <p className="text-sm sm:text-base leading-relaxed">
              Elite Football Training takes reasonable steps to keep information on this website accurate, timely, and functional. However, the academy provides this website on an "as-is" and "as-available" basis and does not warrant uninterrupted, error-free, or virus-free operation.
            </p>
            <p className="text-sm sm:text-base leading-relaxed">
              Nothing in these Terms &amp; Conditions excludes, restricts, or modifies any condition, warranty, right, or liability that cannot lawfully be excluded under applicable Indian laws.
            </p>
          </section>

          {/* Section 8: Changes to Terms */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-900 uppercase tracking-wide">
                8. Changes to Terms
              </h2>
            </div>
            <p className="text-sm sm:text-base leading-relaxed">
              Elite Football Training reserves the right to review, modify, or update these Terms &amp; Conditions whenever necessary (for instance, to reflect regulatory revisions, facility updates, or operational changes). The updated version will be posted directly on this page with an updated effective date. Continued use of the website following any changes signifies acceptance of the revised terms.
            </p>
          </section>

          {/* Section 9: Contact Information */}
          <section className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-900 uppercase tracking-wide">
                9. Contact &amp; Academy Details
              </h2>
            </div>
            <p className="text-sm sm:text-base leading-relaxed">
              If you have any questions, clarifications, or requests concerning these Terms &amp; Conditions, please contact us using our official academy channels:
            </p>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-sm">
              <div className="font-heading uppercase font-bold text-slate-900 tracking-wide">
                {ACADEMY_CONFIG.academyName}
              </div>
              <div className="flex items-start gap-2.5 text-slate-600">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Crimson Anisha Global School Ground, Marunji, Hinjewadi / Mulshi, Pune, Maharashtra 411057, India
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-600">
                <Phone className="w-4 h-4 text-amber-600 shrink-0" />
                <a href={`tel:${ACADEMY_CONFIG.phone}`} className="font-mono font-semibold text-slate-900 hover:text-amber-600 transition-colors">
                  {ACADEMY_CONFIG.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-slate-600">
                <Mail className="w-4 h-4 text-amber-600 shrink-0" />
                <a href={`mailto:${ACADEMY_CONFIG.email}`} className="font-mono font-semibold text-slate-900 hover:text-amber-600 transition-colors">
                  {ACADEMY_CONFIG.email}
                </a>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-heading text-xs font-bold uppercase tracking-wider hover:bg-amber-400 transition-colors shadow-sm"
              >
                <span>Contact Academy</span>
              </Link>
              <Link
                to="/privacy-policy"
                className="inline-flex items-center gap-2 text-xs font-heading font-bold uppercase tracking-wider text-amber-700 hover:text-amber-800 transition-colors"
              >
                <span>View Privacy Policy &rarr;</span>
              </Link>
            </div>
          </section>
        </article>
      </main>
    </div>
  );
};

