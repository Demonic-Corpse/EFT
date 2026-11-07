import React, { useEffect, useState } from 'react';
import { ArrowRight, Star, Quote, MessageSquareQuote, Sparkles } from 'lucide-react';
import { ReviewItem } from '../../types';
import { SectionHeading } from '../common/SectionHeading';
import { Button } from '../common/Button';

export const HomeReviewsPreview: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);

  useEffect(() => {
    fetch('/api/reviews/public')
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.reviews)) {
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
          setReviews(mapped);
        }
      })
      .catch(() => {});
  }, []);

  // Show only up to 3 approved reviews
  const displayReviews = reviews.slice(0, 3);

  return (
    <section className="py-20 sm:py-28 bg-white relative overflow-hidden">
      {/* Background amber blur */}
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-amber-400/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <SectionHeading
            eyebrow="Player & Family Feedback"
            title="TRAINING EXPERIENCES"
            subtitle="Discover what aspiring footballers and parents appreciate about our structured coaching philosophy."
            align="left"
            className="mb-0"
          />

          <div className="shrink-0 flex items-center gap-3">
            <Button
              to="/reviews"
              variant="outline"
              size="md"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Read All Reviews
            </Button>
          </div>
        </div>

        {displayReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {displayReviews.map((rev) => (
              <div
                key={rev.id}
                className="relative rounded-2xl bg-slate-50 border border-slate-200 p-6 sm:p-7 flex flex-col justify-between shadow-sm group hover:border-amber-400 hover:bg-white hover:shadow-lg transition-all duration-300"
              >
                <div>
                  {/* Header: Stars & Quote Icon */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < rev.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                    <Quote className="w-7 h-7 text-amber-500/20 group-hover:text-amber-500/60 transition-colors" />
                  </div>

                  {/* Content */}
                  <p className="text-sm text-slate-700 leading-relaxed mb-6 italic">
                    "{rev.content}"
                  </p>
                </div>

                {/* Author Footer */}
                <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {rev.avatar ? (
                      <img
                        src={rev.avatar}
                        alt={rev.author}
                        className="w-10 h-10 rounded-full object-cover border border-amber-400/60 shadow-sm"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-slate-950 font-bold text-sm border border-amber-400/60 shadow-sm">
                        {rev.author?.charAt(0).toUpperCase() || '?'}
                      </div>
                    )}
                    <div>
                      <h4 className="font-heading uppercase text-sm font-bold text-slate-900 tracking-wide">
                        {rev.author}
                      </h4>
                      <span className="text-[11px] font-mono text-slate-500 block">
                        Role: {rev.role} &bull; {rev.date}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 sm:p-12 rounded-2xl bg-slate-50 border border-dashed border-slate-300 text-center max-w-2xl mx-auto my-8">
            <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-600 mx-auto mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="font-heading text-lg font-bold uppercase text-slate-900 tracking-wide mb-2">
              Reviews Coming Soon
            </h4>
            <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
              Be the first to share your training experience! Submit your review or experience directly to our academy.
            </p>
            <Button
              to="/reviews"
              variant="primary"
              size="md"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Write First Review
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
