import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Mail, Phone, MapPin, MessageSquare, HelpCircle, CheckCircle2 } from 'lucide-react';
import { EnquiryForm } from '../components/contact/EnquiryForm';
import { ContactInfoCards } from '../components/contact/ContactInfoCards';
import { SectionHeading } from '../components/common/SectionHeading';

const FAQS = [
  {
    q: 'How does a player join a trial training session?',
    a: 'Simply fill out the Training Enquiry Form on this page with player age and experience level. Our coaching staff will allocate an introductory trial slot on the appropriate pitch based on age category.',
  },
  {
    q: 'What training kit and footwear are required?',
    a: 'For trial sessions, standard athletic sportswear and molded football boots (FG/AG) or turf trainers with shin guards are recommended. Official academy training kits are issued upon enrollment.',
  },
  {
    q: 'What age groups does Elite Football Training cater to?',
    a: 'Our structured curriculum caters to grassroots juniors (U-9, U-11), intermediate youth (U-13, U-15), competitive senior squads (U-17, U-19), as well as adult open development sessions.',
  },
  {
    q: 'Are weekend-only training sessions available?',
    a: 'Yes, we provide flexible weekend development batches (Saturday & Sunday) alongside our intensive weekday evening schedules.',
  },
];

export const ContactPage: React.FC = () => {
  const location = useLocation();

  // Extract program prefill query if user arrived from a ProgramCard CTA
  const initialProgram = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('program') || '';
  }, [location.search]);

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      {/* Page Hero */}
      <section className="relative py-16 sm:py-24 bg-gradient-to-b from-amber-50/70 via-slate-50 to-slate-50 border-b border-slate-200 overflow-hidden">
        {/* Background photo */}
        <div className="absolute inset-0 z-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=1800&q=80"
            alt="Football training stadium"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-50/70" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-heading font-bold uppercase tracking-widest mb-6">
            <Mail className="w-3.5 h-3.5 text-amber-600" />
            <span>Connect & Registration Hub</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-display uppercase tracking-tight text-slate-900 leading-none mb-6">
            GET IN TOUCH. <br />
            <span className="text-amber-600">
              JOIN THE ACADEMY.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-sans leading-relaxed">
            Start your football journey with Elite Football Training. Register for trial sessions, batch schedules, and academy admissions.
          </p>
        </div>
      </section>

      {/* Main Form and Info Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start mb-20">
          {/* Left Column: Interactive Enquiry Form (7 cols) */}
          <div className="lg:col-span-7">
            <EnquiryForm initialProgram={initialProgram} />
          </div>

          {/* Right Column: Contact Cards & Map Preview (5 cols) */}
          <div className="lg:col-span-5">
            <ContactInfoCards />
          </div>
        </div>

        {/* Academy FAQs Section */}
        <section className="pt-12 border-t border-slate-200 max-w-4xl mx-auto">
          <SectionHeading
            eyebrow="Quick Answers"
            title="FREQUENTLY ASKED QUESTIONS"
            subtitle="Everything parents and aspiring players need to know before stepping onto the training pitch."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 transition-colors shadow-sm"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0 mt-0.5">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <h4 className="font-heading uppercase text-base font-bold text-slate-900 tracking-wide">
                    {faq.q}
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-10 font-sans">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
