import React from 'react';
import { Hero } from '../components/home/Hero';
import { StatsSection } from '../components/home/StatsSection';
import { BuiltForNextLevel } from '../components/home/BuiltForNextLevel';
import { HomeGalleryPreview } from '../components/home/HomeGalleryPreview';
import { HomeReviewsPreview } from '../components/home/HomeReviewsPreview';
import { HomeAboutPreview } from '../components/home/HomeAboutPreview';
import { HomeCtaBanner } from '../components/home/HomeCtaBanner';
import { EnquiryForm } from '../components/contact/EnquiryForm';
import { ContactInfoCards } from '../components/contact/ContactInfoCards';
import { SectionHeading } from '../components/common/SectionHeading';

export const HomePage: React.FC = () => {
  return (
    <div className="relative">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Academy Highlights (4 Statistic Cards with XYZ Placeholders) */}
      <StatsSection />

      {/* 3. Training Introduction: Built For The Next Level (3 Visual Feature Cards) */}
      <BuiltForNextLevel />

      {/* 4. Training Gallery Preview */}
      <HomeGalleryPreview />

      {/* 5. Reviews Preview (3 Review Cards with Sample Content) */}
      <HomeReviewsPreview />

      {/* 6. About Preview */}
      <HomeAboutPreview />

      {/* 7. Reusable Contact Section on Home Page */}
      <section id="contact-section" className="py-20 sm:py-28 bg-slate-100/70 border-t border-slate-200 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Reach the Academy"
            title="JOIN OUR TRAINING SESSIONS"
            subtitle="Register for player evaluations, trial sessions, and squad allocations. Our coaching staff will guide your development pathway."
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            <div className="lg:col-span-7">
              <EnquiryForm />
            </div>
            <div className="lg:col-span-5">
              <ContactInfoCards />
            </div>
          </div>
        </div>
      </section>

      {/* 8. Final CTA Banner: "YOUR FOOTBALL JOURNEY STARTS HERE." */}
      <HomeCtaBanner />
    </div>
  );
};
