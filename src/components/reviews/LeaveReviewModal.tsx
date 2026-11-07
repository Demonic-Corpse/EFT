import React, { useState } from 'react';
import { X, Star, CheckCircle, AlertCircle, Send } from 'lucide-react';
import { Button } from '../common/Button';

interface LeaveReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitDemoReview?: (review: { author: string; role: 'Player' | 'Parent'; rating: number; content: string }) => void;
}

export const LeaveReviewModal: React.FC<LeaveReviewModalProps> = ({
  isOpen,
  onClose,
  onSubmitDemoReview,
}) => {
  const [author, setAuthor] = useState('');
  const [role, setRole] = useState<'Player' | 'Parent'>('Player');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim()) {
      setError('Please provide your name or initials.');
      return;
    }
    if (!content.trim() || content.trim().length < 15) {
      setError('Please share at least 15 characters describing your training experience.');
      return;
    }

    setError('');
    fetch('/api/reviews/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        author: author.trim(),
        role,
        rating,
        content: content.trim(),
      }),
    }).catch((err) => console.warn('Review submit fallback:', err));

    setIsSubmitted(true);

    if (onSubmitDemoReview) {
      onSubmitDemoReview({
        author: author.trim(),
        role,
        rating,
        content: content.trim(),
      });
    }
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setAuthor('');
    setContent('');
    setRating(5);
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <h3 className="font-heading uppercase text-2xl font-bold text-slate-900 tracking-wide">
                Leave Academy Feedback
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mb-6">
              Share your football coaching experience. Your perspective inspires our training culture.
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Reviewer Name */}
              <div>
                <label className="block text-xs font-heading uppercase tracking-wider text-slate-700 font-bold mb-1.5">
                  Your Full Name / Trainee Name *
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. Alex Sharma / Rohit's Parent"
                  className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm transition-all"
                  required
                />
              </div>

              {/* Role: Player / Parent */}
              <div>
                <label className="block text-xs font-heading uppercase tracking-wider text-slate-700 font-bold mb-1.5">
                  Relationship to Academy *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('Player')}
                    className={`py-2 px-4 rounded-lg text-xs font-heading uppercase tracking-wider font-semibold border transition-all ${
                      role === 'Player'
                        ? 'bg-amber-50 text-amber-700 border-amber-400 shadow-sm font-bold'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    Academy Player
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('Parent')}
                    className={`py-2 px-4 rounded-lg text-xs font-heading uppercase tracking-wider font-semibold border transition-all ${
                      role === 'Parent'
                        ? 'bg-amber-50 text-amber-700 border-amber-400 shadow-sm font-bold'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    Parent / Guardian
                  </button>
                </div>
              </div>

              {/* Star Rating Selector */}
              <div>
                <label className="block text-xs font-heading uppercase tracking-wider text-slate-700 font-bold mb-1.5">
                  Rating: {rating} of 5 Stars
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 text-slate-400 hover:scale-110 transition-transform focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          (hoverRating || rating) >= star
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Message */}
              <div>
                <label className="block text-xs font-heading uppercase tracking-wider text-slate-700 font-bold mb-1.5">
                  Your Review Message *
                </label>
                <textarea
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tell us about the training drills, coaches' guidance, improvement in agility, or match day performance..."
                  className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm leading-relaxed transition-all"
                  required
                />
              </div>

              {/* Transparent Demo Notice */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-500 font-mono">
                Notice: This frontend preview form simulates review submission. Reviews are not published to the live academy directory until approved by staff in the future phase.
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  icon={<Send className="w-4 h-4" />}
                  className="w-full font-bold"
                >
                  Submit Demo Review
                </Button>
              </div>
            </form>
          </div>
        ) : (
          /* Confirmation Success State */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-50 border border-amber-300 flex items-center justify-center text-amber-600 shadow-sm">
              <CheckCircle className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-display uppercase tracking-wide text-slate-900">
              REVIEW RECEIVED (DEMO STATE)
            </h3>

            <p className="text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
              Thank you, <strong className="text-slate-900">{author}</strong>! Your {rating}-star feedback has been staged successfully in demo preview mode.
            </p>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-500 font-mono max-w-sm mx-auto">
              Backend Notice: In production, this review will be routed to the moderation queue before public display.
            </div>

            <div className="pt-4">
              <Button onClick={handleResetAndClose} variant="secondary" size="md">
                Close Window
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
