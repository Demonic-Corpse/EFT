import React, { useState } from 'react';
import { Star, MessageSquareQuote, MessageSquarePlus, Quote, CheckCircle2, Award } from 'lucide-react';
import { REVIEWS_ITEMS } from '../data/reviewsData';
import { ReviewItem } from '../types';
import { ReviewCard } from '../components/reviews/ReviewCard';
import { RatingSummary } from '../components/reviews/RatingSummary';
import { LeaveReviewModal } from '../components/reviews/LeaveReviewModal';
import { SectionHeading } from '../components/common/SectionHeading';
import { Button } from '../components/common/Button';

export const ReviewsPage: React.FC = () => {
  const [reviewsList, setReviewsList] = useState<ReviewItem[]>(REVIEWS_ITEMS);
  const [isLeaveReviewOpen, setIsLeaveReviewOpen] = useState(false);

  // Fetch live approved reviews from database API
  React.useEffect(() => {
    fetch('/api/reviews/public')
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.reviews) && data.reviews.length > 0) {
          const mapped: ReviewItem[] = data.reviews.map((r: any) => ({
            id: r.id,
            author: r.author,
            role: r.role,
            rating: r.rating,
            date: r.date,
            content: r.content,
            avatar: r.avatar || '',
            verifiedBadge: Boolean(r.verified_badge),
          }));
          setReviewsList(mapped);
        }
      })
      .catch((err) => console.warn('Could not fetch public reviews:', err));
  }, []);

  // Featured Testimonial (e.g. from senior player or long-term parent)
  const featuredReview = reviewsList[0];

  const handleAddDemoReview = (newRev: {
    author: string;
    role: 'Player' | 'Parent';
    rating: number;
    content: string;
  }) => {
    const item: ReviewItem = {
      id: `rev-${Date.now()}`,
      author: newRev.author,
      role: newRev.role,
      rating: newRev.rating,
      date: 'Just Now (Demo Submission)',
      content: newRev.content,
      avatar: '',
      verifiedBadge: false,
    };
    setReviewsList([item, ...reviewsList]);
  };

  return (
    <div className="pt-24 pb-20 bg-slate-50 text-slate-900 min-h-screen">
      {/* Page Hero */}
      <section className="relative py-16 sm:py-24 bg-gradient-to-b from-amber-50/60 via-slate-50 to-slate-50 border-b border-slate-200 overflow-hidden">
        {/* Background photo */}
        <div className="absolute inset-0 z-0 opacity-15">
          <img
            src="https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=1800&q=80"
            alt="Football academy match day celebration"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-50/85" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 text-amber-800 text-xs font-heading font-bold uppercase tracking-widest mb-6 shadow-sm">
            <MessageSquareQuote className="w-3.5 h-3.5 text-amber-600" />
            <span>Community Feedback & Testimonials</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-display uppercase tracking-tight text-slate-900 leading-none mb-6">
            REAL PROGRESS. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 drop-shadow-[0_2px_15px_rgba(217,119,6,0.25)]">
              REAL EXPERIENCES.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-sans leading-relaxed mb-8">
            Discover what players and families value about their football training journey.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              onClick={() => setIsLeaveReviewOpen(true)}
              size="lg"
              variant="primary"
              icon={<MessageSquarePlus className="w-5 h-5" />}
              className="shadow-sm"
            >
              Leave a Review
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Featured Testimonial Banner */}
        {featuredReview && (
          <div className="mb-14 rounded-3xl bg-gradient-to-r from-amber-50/90 via-white to-amber-50/90 border border-amber-300 p-8 sm:p-10 shadow-lg relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 w-60 h-60 bg-amber-400/10 blur-3xl rounded-full pointer-events-none" />

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative z-10">
              <div className="space-y-4 max-w-3xl">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-heading font-bold uppercase tracking-wider bg-amber-500 text-slate-950 shadow-sm">
                    FEATURED STORY
                  </span>
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                <blockquote className="text-xl sm:text-2xl font-sans italic text-slate-900 leading-relaxed">
                  "{featuredReview.content}"
                </blockquote>

                <div className="flex items-center gap-4 pt-2">
                  {featuredReview.avatar ? (
                    <img
                      src={featuredReview.avatar}
                      alt={featuredReview.author}
                      className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 shadow-sm"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center text-slate-950 font-bold text-base border-2 border-amber-400 shadow-sm">
                      {featuredReview.author?.charAt(0).toUpperCase() || '?'}
                    </div>
                  )}
                  <div>
                    <h4 className="font-heading uppercase text-base sm:text-lg font-bold text-slate-900 tracking-wide">
                      {featuredReview.author}
                    </h4>
                    <span className="text-xs font-mono text-amber-700 font-semibold">
                      {featuredReview.role} &bull; {featuredReview.date}
                    </span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 p-5 rounded-2xl bg-white border border-slate-200 text-center w-full lg:w-60 shadow-sm">
                <Award className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                <span className="text-xs uppercase font-heading font-bold text-slate-800 block">
                  Verified Trainee
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Rating Analytics Summary Section */}
        <RatingSummary onOpenLeaveReview={() => setIsLeaveReviewOpen(true)} />

        {/* All Reviews Responsive Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-display uppercase tracking-wide text-slate-900">
              ALL PLAYER & PARENT VOICES
            </h3>
            <span className="text-xs font-mono text-slate-500">
              {reviewsList.length} Verified Feedback {reviewsList.length === 1 ? 'Entry' : 'Entries'}
            </span>
          </div>

          {reviewsList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviewsList.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <div className="p-12 rounded-2xl bg-white border border-dashed border-slate-300 text-center max-w-xl mx-auto space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mx-auto">
                <MessageSquareQuote className="w-7 h-7" />
              </div>
              <h4 className="font-heading text-lg font-bold uppercase text-slate-900 tracking-wide">
                No Reviews Published Yet
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Be the first player or parent to share your experience with Elite Football Training!
              </p>
              <Button
                onClick={() => setIsLeaveReviewOpen(true)}
                variant="primary"
                size="md"
                icon={<MessageSquarePlus className="w-4 h-4" />}
              >
                Submit the First Review
              </Button>
            </div>
          )}
        </div>

        {/* Bottom Transparency Notice */}
        <div className="mt-16 p-6 rounded-2xl bg-white border border-slate-200 text-center max-w-3xl mx-auto space-y-2 text-xs sm:text-sm text-slate-600 shadow-sm">
          <p className="text-slate-900 font-semibold">
            Transparency Assurance:
          </p>
          <p>
            Elite Football Training does not fabricate reviews or ratings. All testimonials shown here are genuine, verified submissions from players and parents.
          </p>
        </div>
      </div>

      {/* Leave Review Interactive Modal */}
      <LeaveReviewModal
        isOpen={isLeaveReviewOpen}
        onClose={() => setIsLeaveReviewOpen(false)}
        onSubmitDemoReview={handleAddDemoReview}
      />
    </div>
  );
};
