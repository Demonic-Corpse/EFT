import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  ArrowLeft,
  Calendar,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Lock,
  Eye,
  UserCheck,
  FileCheck2,
  Sparkles,
} from 'lucide-react';
import { ACADEMY_CONFIG } from '../data/academyData';

export const PrivacyPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Privacy Policy | Elite Football Training';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Privacy Policy for Elite Football Training explaining personal data handling, children’s privacy safeguards, and parental rights under the DPDP Act 2023.'
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
            <span className="text-amber-700 font-semibold">Privacy Policy</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 text-amber-800 text-xs font-heading font-bold uppercase tracking-widest mb-4 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Data Protection &amp; Governance</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display uppercase tracking-tight text-slate-900 leading-none mb-4">
            PRIVACY POLICY
          </h1>

          <p className="text-base sm:text-lg text-slate-600 font-sans leading-relaxed max-w-2xl">
            How Elite Football Training collects, handles, stores, and protects personal data for players, parents, guardians, and website visitors.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              Effective / Last Updated: {lastUpdated}
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              DPDP Act 2023 Aligned
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

        {/* Advisory Box - Statutory & Academy Review Notice */}
        <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-amber-50/80 border border-amber-300/80 text-amber-900 text-xs sm:text-sm leading-relaxed flex items-start gap-3 shadow-sm">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-heading uppercase font-bold text-amber-800 block mb-1 tracking-wide">
              Statutory Alignment Notice (DPDP Act, 2023)
            </span>
            <p>
              This privacy policy is designed in accordance with applicable Indian laws, including the Digital Personal Data Protection Act, 2023 (DPDP Act). Specific internal record retention periods, consent log management, and designated Grievance Officer details are maintained and verified directly by Elite Football Training management.
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
              <strong>Elite Football Training</strong> (&ldquo;Academy&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) operates football training programs at Crimson Anisha Global School Ground, Marunji, Hinjewadi, Maharashtra, India.
            </p>
            <p className="text-sm sm:text-base leading-relaxed">
              We respect the privacy of visitors, parents, guardians, and aspiring players. This Privacy Policy explains our practices regarding the collection, processing, storage, and protection of personal data when you visit our website or submit enquiries for training programs, trial sessions, and squad allocations.
            </p>
          </section>

          {/* Section 2: Information We Collect */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-900 uppercase tracking-wide">
                2. Information We Collect
              </h2>
            </div>
            <p className="text-sm sm:text-base leading-relaxed">
              We collect information that you voluntarily choose to provide when interacting with our website:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base pl-2 text-slate-600">
              <li><strong>Parent or Guardian Name:</strong> Collected to communicate regarding training, scheduling, and admissions.</li>
              <li><strong>Contact Phone Number:</strong> Used to respond to enquiries, confirm trial session timings, and share batch updates.</li>
              <li><strong>Email Address (Optional):</strong> Collected when voluntarily provided for official written communications.</li>
              <li><strong>Player Name and Age / Date of Birth:</strong> Used solely to evaluate appropriate age-cohort squad allocation (Junior Batch or Senior Batch).</li>
              <li><strong>Football Experience Level &amp; Coaching Needs:</strong> Information shared regarding past experience, playing positions, or specific fitness goals.</li>
              <li><strong>General Messages:</strong> Any voluntary questions, slot preferences, or remarks submitted via our contact forms.</li>
            </ul>
            <p className="text-sm sm:text-base leading-relaxed pt-2">
              <em>Technical Information:</em> When visiting our website, standard web server logs (such as IP address, browser type, device operating system, and access timestamps) may be automatically processed for security monitoring, preventing abuse, and ensuring stable network delivery.
            </p>
          </section>

          {/* Section 3: How We Use Information */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-900 uppercase tracking-wide">
                3. How We Use Information
              </h2>
            </div>
            <p className="text-sm sm:text-base leading-relaxed">
              Personal data collected through the website is used strictly for legitimate academy operations:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base pl-2 text-slate-600">
              <li>To respond promptly to trial session requests and admission enquiries.</li>
              <li>To contact parents or legal guardians regarding pitch schedules, trial allocations, and batch timings.</li>
              <li>To share detailed coaching curriculums, monthly fee schedules, and required training kits.</li>
              <li>To manage registration records, player rosters, and trial evaluations.</li>
              <li>To communicate tournament schedules, friendly fixture invitations, and academy event updates.</li>
              <li>To maintain website security, troubleshoot technical errors, and optimize user experience.</li>
              <li>To comply with applicable legal, accounting, and regulatory obligations under Indian law.</li>
            </ul>
          </section>

          {/* Section 4: Children's Privacy & Parental Consent */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-900 uppercase tracking-wide">
                4. Children&rsquo;s Privacy &amp; Parental Consent
              </h2>
            </div>
            <p className="text-sm sm:text-base leading-relaxed">
              Because Elite Football Training provides coaching to children and young footballers, safeguarding minors&rsquo; privacy is of paramount importance:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base pl-2 text-slate-600">
              <li><strong>Parental Submission:</strong> We require all website enquiries, registrations, and communications involving children (under 18 years of age) to be made by a parent or legal guardian.</li>
              <li><strong>No Commercial Profiling:</strong> We do not knowingly collect, track, or profile personal data of children for third-party commercial marketing or advertising purposes.</li>
              <li><strong>Media &amp; Photographs Consent:</strong> Identifiable photographs or video clips of minors taken during training drills or tournaments will only be published with verifiable parental or guardian consent.</li>
              <li><strong>Parental Rights:</strong> In accordance with the Digital Personal Data Protection Act, 2023, parents or legal guardians hold full rights to inspect, update, or request the deletion of any personal data submitted about their child.</li>
            </ul>
          </section>

          {/* Section 5: Sharing of Information */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-900 uppercase tracking-wide">
                5. Sharing of Information
              </h2>
            </div>
            <p className="text-sm sm:text-base leading-relaxed">
              <strong>We do not sell, rent, trade, or monetize your personal information.</strong>
            </p>
            <p className="text-sm sm:text-base leading-relaxed">
              Information is only shared under the following limited circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base pl-2 text-slate-600">
              <li><strong>Authorized Academy Personnel:</strong> Internal coaching directors, batch coordinators, and administrative staff on a need-to-know basis to process admissions and manage pitch safety.</li>
              <li><strong>Essential Infrastructure Providers:</strong> Secure hosting, communication, or messaging vendors assisting in website delivery and official communications under appropriate confidentiality.</li>
              <li><strong>Legal Compliance:</strong> When disclosure is mandatory by law, judicial summons, governmental directive, or necessary to protect player safety, emergency medical care, or legal rights.</li>
            </ul>
          </section>

          {/* Section 6: Data Security */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-900 uppercase tracking-wide">
                6. Data Security Measures
              </h2>
            </div>
            <p className="text-sm sm:text-base leading-relaxed">
              We implement reasonable organizational, administrative, and technical safeguards to protect personal data against unauthorized access, loss, alteration, disclosure, or misuse. Access to stored administrative databases is password-protected and restricted solely to authorized academy administrators.
            </p>
            <p className="text-sm sm:text-base leading-relaxed text-slate-500">
              <em>Note:</em> While we implement diligent precautions, no method of transmission over the Internet or electronic storage is completely impenetrable. We encourage parents not to submit sensitive financial credentials or unrequested sensitive documents through general contact forms.
            </p>
          </section>

          {/* Section 7: Cookies and Website Analytics */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-900 uppercase tracking-wide">
                7. Cookies and Website Analytics
              </h2>
            </div>
            <p className="text-sm sm:text-base leading-relaxed">
              Our website is built with clean, modern web technologies:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base pl-2 text-slate-600">
              <li>The website does <strong>not</strong> employ third-party advertising tracking cookies, behavioral tracking pixels, or cross-site commercial profiling tools.</li>
              <li>Standard technical cookies or local storage may be utilized exclusively for necessary website functionality (such as managing secure administrative sessions or retaining interface display preferences).</li>
              <li>Visitors can control or disable cookies at any time through their personal browser settings.</li>
            </ul>
          </section>

          {/* Section 8: Data Retention */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-900 uppercase tracking-wide">
                8. Data Retention
              </h2>
            </div>
            <p className="text-sm sm:text-base leading-relaxed">
              We retain personal data only for as long as reasonably necessary to fulfill the purposes for which it was gathered—including answering prospective enquiries, administering player training during an active season, resolving past communication records, or satisfying legal, tax, and reporting obligations under applicable Indian laws. When personal data is no longer required, it will be securely deleted or anonymized.
            </p>
          </section>

          {/* Section 9: Your Privacy Rights */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-900 uppercase tracking-wide">
                9. Your Privacy Rights (DPDP Act, 2023)
              </h2>
            </div>
            <p className="text-sm sm:text-base leading-relaxed">
              Subject to applicable provisions of Indian data protection laws, individuals or their authorized parents/legal guardians hold the following rights:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base pl-2 text-slate-600">
              <li><strong>Right to Access:</strong> Request confirmation and a summary of personal data held about you or your child.</li>
              <li><strong>Right to Correction &amp; Update:</strong> Request correction of inaccurate, incomplete, or out-of-date personal data.</li>
              <li><strong>Right to Erasure:</strong> Request deletion of personal data where processing is no longer required for academy operations and retention is not mandated by law.</li>
              <li><strong>Right to Withdraw Consent:</strong> Where data processing is based on consent (such as media publication), withdraw consent at any time for future promotional use.</li>
              <li><strong>Right of Grievance Redressal:</strong> Submit a grievance to our designated academy point of contact regarding personal data handling.</li>
            </ul>
          </section>

          {/* Section 10: External Links */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-900 uppercase tracking-wide">
                10. External Links
              </h2>
            </div>
            <p className="text-sm sm:text-base leading-relaxed">
              Our website contains links to external platforms such as Instagram, YouTube, Google Maps, and WhatsApp. Please note that clicking on these external links directs you to independent third-party services whose data handling practices are governed by their respective privacy statements. We encourage you to review their independent privacy policies.
            </p>
          </section>

          {/* Section 11: Changes to this Policy */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-900 uppercase tracking-wide">
                11. Changes to this Privacy Policy
              </h2>
            </div>
            <p className="text-sm sm:text-base leading-relaxed">
              We may review and update this Privacy Policy periodically to reflect changes in our operational procedures, coaching facilities, or applicable statutory rules. Updated policies will be published on this page with a revised effective date. We recommend checking this page periodically to stay informed.
            </p>
          </section>

          {/* Section 12: Contact & Grievance Redressal */}
          <section className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-900 uppercase tracking-wide">
                12. Contact &amp; Privacy Grievance Redressal
              </h2>
            </div>
            <p className="text-sm sm:text-base leading-relaxed">
              For any questions, clarifications, consent withdrawal, or privacy-related requests, please contact Elite Football Training:
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
                to="/terms-and-conditions"
                className="inline-flex items-center gap-2 text-xs font-heading font-bold uppercase tracking-wider text-amber-700 hover:text-amber-800 transition-colors"
              >
                <span>View Terms &amp; Conditions &rarr;</span>
              </Link>
            </div>
          </section>
        </article>
      </main>
    </div>
  );
};

