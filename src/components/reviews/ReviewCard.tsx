import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';
import { ReviewItem } from '../../types';

interface ReviewCardProps {
  review: ReviewItem;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div className="relative rounded-2xl bg-white border border-slate-200 p-6 sm:p-7 flex flex-col justify-between shadow-sm group hover:border-amber-400 hover:shadow-md transition-all duration-300">
      <div>
        {/* Rating and Quote */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                }`}
              />
            ))}
          </div>
          <Quote className="w-6 h-6 text-amber-500/20 group-hover:text-amber-500/50 transition-colors" />
        </div>

        {/* Review Content */}
        <p className="text-sm text-slate-600 leading-relaxed mb-6 italic">
          "{review.content}"
        </p>
      </div>

      {/* Author and Role */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {review.avatar ? (
            <img
              src={review.avatar}
              alt={review.author}
              className="w-10 h-10 rounded-full object-cover border border-amber-300"
              loading="lazy"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-slate-950 font-bold text-sm border border-amber-400/60">
              {review.author?.charAt(0).toUpperCase() || '?'}
            </div>
          )}
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-heading uppercase text-sm font-bold text-slate-900 tracking-wide">
                {review.author}
              </h4>
              {review.verifiedBadge && (
                <span title="Verified reviewer" className="inline-flex">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                </span>
              )}
            </div>
            <span className="text-xs font-mono text-slate-500 block">
              {review.role} &bull; {review.date}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
