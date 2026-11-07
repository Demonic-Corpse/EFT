import React, { useState, useEffect } from 'react';
import { Send, CheckCircle, AlertCircle, PhoneCall, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';
import { ACADEMY_CONFIG } from '../../data/academyData';
import { EnquiryFormData } from '../../types';

interface EnquiryFormProps {
  initialProgram?: string;
  className?: string;
}

export const EnquiryForm: React.FC<EnquiryFormProps> = ({
  initialProgram = '',
  className = '',
}) => {
  const [formData, setFormData] = useState<EnquiryFormData>({
    fullName: '',
    contactNumber: '',
    email: '',
    playerAge: '',
    experienceLevel: 'Beginner / Grassroots',
    programPreference: initialProgram || 'Technical Football Training',
    message: '',
  });

  const [errors, setErrors] = useState<Partial<EnquiryFormData>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialProgram) {
      setFormData((prev) => ({ ...prev, programPreference: initialProgram }));
    }
  }, [initialProgram]);

  const validate = () => {
    const errs: Partial<EnquiryFormData> = {};
    if (!formData.fullName.trim()) {
      errs.fullName = 'Full Name is required';
    }
    if (!formData.contactNumber.trim() || formData.contactNumber.trim().length < 8) {
      errs.contactNumber = 'A valid contact phone number is required';
    }
    if (!formData.playerAge.trim()) {
      errs.playerAge = 'Player age is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    fetch('/api/enquiries/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.fullName,
        phone: formData.contactNumber,
        email: formData.email,
        player_age: formData.playerAge,
        experience_level: formData.experienceLevel,
        program_interest: formData.programPreference,
        message: formData.message || 'Interested in joining training sessions.',
      }),
    })
      .catch((err) => console.warn('Enquiry submission fallback:', err))
      .finally(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
      });
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({
      fullName: '',
      contactNumber: '',
      email: '',
      playerAge: '',
      experienceLevel: 'Beginner / Grassroots',
      programPreference: 'Technical Football Training',
      message: '',
    });
    setErrors({});
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Elite Football Training! I would like to enquire for training.\nPlayer: ${
      formData.fullName || 'Prospective Player'
    }\nAge: ${formData.playerAge || 'Not specified'}\nLevel: ${
      formData.experienceLevel
    }\nPreferred Program: ${formData.programPreference}`
  );

  return (
    <div className={`rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm relative overflow-hidden ${className}`}>
      {/* Subtle pitch accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

      {!isSubmitted ? (
        <div>
          <div className="mb-4">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-600 block mb-1">
              Direct Application
            </span>
            <h3 className="text-2xl sm:text-3xl font-display uppercase tracking-wide text-slate-900">
              TRAINING ENQUIRY FORM
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-sans">
            Submit your information for trial sessions, batch allocations, and training schedules.
          </p>

          {/* Validation summary error if any */}
          {Object.keys(errors).length > 0 && (
            <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Please complete all required fields highlighted below.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Student/Parent Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-heading uppercase tracking-wider text-slate-700 font-bold mb-1.5">
                  Student / Parent Name *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className={`w-full px-4 py-2.5 rounded-lg bg-white border text-slate-900 placeholder-slate-400 focus:outline-none text-sm transition-colors ${
                    errors.fullName
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-400/20'
                      : 'border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
                  }`}
                />
                {errors.fullName && <p className="text-[11px] text-rose-600 mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-xs font-heading uppercase tracking-wider text-slate-700 font-bold mb-1.5">
                  Contact Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  placeholder="e.g. +91 98765 43210"
                  className={`w-full px-4 py-2.5 rounded-lg bg-white border text-slate-900 placeholder-slate-400 focus:outline-none text-sm transition-colors ${
                    errors.contactNumber
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-400/20'
                      : 'border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
                  }`}
                />
                {errors.contactNumber && (
                  <p className="text-[11px] text-rose-600 mt-1">{errors.contactNumber}</p>
                )}
              </div>
            </div>

            {/* Email (Optional) & Player Age */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-heading uppercase tracking-wider text-slate-700 font-bold mb-1.5">
                  Email Address <span className="text-slate-400">(Optional)</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. contact@example.com"
                  className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-heading uppercase tracking-wider text-slate-700 font-bold mb-1.5">
                  Player Age (or Date of Birth) *
                </label>
                <input
                  type="text"
                  value={formData.playerAge}
                  onChange={(e) => setFormData({ ...formData, playerAge: e.target.value })}
                  placeholder="e.g. 14 years old (U-15)"
                  className={`w-full px-4 py-2.5 rounded-lg bg-white border text-slate-900 placeholder-slate-400 focus:outline-none text-sm transition-colors ${
                    errors.playerAge
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-400/20'
                      : 'border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
                  }`}
                />
                {errors.playerAge && (
                  <p className="text-[11px] text-rose-600 mt-1">{errors.playerAge}</p>
                )}
              </div>
            </div>

            {/* Football Experience Level */}
            <div>
              <label className="block text-xs font-heading uppercase tracking-wider text-slate-700 font-bold mb-1.5">
                Football Experience Level
              </label>
              <select
                value={formData.experienceLevel}
                onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm"
              >
                <option value="Beginner / Grassroots">Beginner / Grassroots</option>
                <option value="School / College Team Player">School / College Team Player</option>
                <option value="Club / Advanced Player">Club / Advanced Player</option>
                <option value="Competitive Tournament Trials">Competitive Tournament Trials</option>
              </select>
            </div>

            {/* Message Field */}
            <div>
              <label className="block text-xs font-heading uppercase tracking-wider text-slate-700 font-bold mb-1.5">
                Message / Specific Coaching Needs
              </label>
              <textarea
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Mention trial slot preferences, specific position (striker, midfielder, goalkeeper), or fitness goals..."
                className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm"
              />
            </div>

            {/* Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isSubmitting}
                icon={<Send className="w-4 h-4" />}
                className="w-full sm:flex-1 font-bold"
              >
                {isSubmitting ? 'Processing...' : 'Submit Training Enquiry'}
              </Button>

              <Button
                href={`https://wa.me/${ACADEMY_CONFIG.whatsappNumber.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`}
                variant="secondary"
                size="md"
                icon={<PhoneCall className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                WhatsApp Direct
              </Button>
            </div>
          </form>
        </div>
      ) : (
        /* Submission Success Demonstration */
        <div className="text-center py-10 space-y-5 animate-in fade-in duration-300">
          <div className="w-20 h-20 mx-auto rounded-full bg-amber-50 border border-amber-300 flex items-center justify-center text-amber-600 shadow-sm">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs uppercase font-mono tracking-widest text-amber-600 font-bold block mb-1">
              Enquiry Staged (Frontend Demo)
            </span>
            <h3 className="text-3xl font-display uppercase tracking-wide text-slate-900">
              APPLICATION RECEIVED!
            </h3>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 max-w-md mx-auto text-left text-xs font-mono space-y-1.5 text-slate-700">
            <div><strong className="text-slate-900">Player:</strong> {formData.fullName} ({formData.playerAge})</div>
            <div><strong className="text-slate-900">Phone:</strong> {formData.contactNumber}</div>
            <div><strong className="text-slate-900">Programme:</strong> {formData.programPreference}</div>
            <div><strong className="text-slate-900">Level:</strong> {formData.experienceLevel}</div>
          </div>

          <p className="text-xs text-slate-500 max-w-sm mx-auto font-sans">
            In live production, an automated trial confirmation SMS/Email will be dispatched to the applicant.
          </p>

          <div className="pt-3 flex items-center justify-center gap-4">
            <Button onClick={handleReset} variant="secondary" size="md">
              Submit Another Enquiry
            </Button>
            <Button
              href={`https://wa.me/${ACADEMY_CONFIG.whatsappNumber.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`}
              variant="outline"
              size="md"
              icon={<PhoneCall className="w-4 h-4" />}
            >
              Reach on WhatsApp
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
