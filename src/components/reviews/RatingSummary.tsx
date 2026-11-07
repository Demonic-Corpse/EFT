import React from 'react';
import { Star, MessageSquarePlus, ExternalLink, AlertCircle } from 'lucide-react';
import { DEMO_RATING_METRICS } from '../../data/reviewsData';
import { Button } from '../common/Button';

interface RatingSummaryProps {
  onOpenLeaveReview: () => void;
}

export const RatingSummary: React.FC<RatingSummaryProps> = ({ onOpenLeaveReview }) => {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm mb-12">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between pb-6 border-b border-slate-200 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-heading uppercase text-xl sm:text-2xl font-bold text-slate-900 tracking-wide">
              ACADEMY RATING SUMMARY
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            {DEMO_RATING_METRICS.placeholderNotice}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <Button
            onClick={onOpenLeaveReview}
            variant="primary"
            size="md"
            icon={<MessageSquarePlus className="w-4 h-4" />}
            className="w-full sm:w-auto"
          >
            Leave a Review
          </Button>

          <Button
            href="https://google.com/search?q=Elite+Football+Training+Reviews+Pune"
            variant="outline"
            size="md"
            icon={<ExternalLink className="w-4 h-4" />}
            className="w-full sm:w-auto"
          >
            Google Reviews [Placeholder]
          </Button>
        </div>
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-6">
        {/* Left Column: Big Average Score (4 cols) */}
        <div className="md:col-span-4 flex flex-col justify-center items-center md:items-start p-6 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-6xl font-display tracking-tight text-slate-900 mb-2 flex items-baseline gap-1">
            <span>{DEMO_RATING_METRICS.averageRating}</span>
            <span className="text-xl text-slate-400 font-mono">/ 5.0</span>
          </div>

          <div className="flex items-center gap-1 text-amber-400 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
            ))}
          </div>

          <span className="text-xs font-mono text-slate-500">
            Based on {DEMO_RATING_METRICS.totalRatingsCount} &bull; {DEMO_RATING_METRICS.recommendationPercentage} Recommend
          </span>
        </div>

        {/* Right Column: Star Distribution Bars (8 cols) */}
        <div className="md:col-span-8 space-y-2.5 flex flex-col justify-center">
          {DEMO_RATING_METRICS.ratingBreakdown.map((row) => (
            <div key={row.stars} className="flex items-center gap-3 text-xs font-mono">
              <span className="w-12 text-slate-700 flex items-center gap-1">
                <span>{row.stars}</span>
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              </span>

              {/* Bar track */}
              <div className="flex-1 h-3 rounded-full bg-slate-100 overflow-hidden border border-slate-200/60">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${row.percentage}%` }}
                />
              </div>

              <span className="w-10 text-right text-slate-600 font-medium">{row.percentage}%</span>
              <span className="w-12 text-right text-slate-400">({row.count})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
