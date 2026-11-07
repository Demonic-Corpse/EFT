import { ReviewItem } from '../types';

/**
 * REVIEWS & TESTIMONIALS REPOSITORY
 * Genuine reviews will appear here once submitted by players/parents or added via Admin.
 */
export const REVIEWS_ITEMS: ReviewItem[] = [];

export const DEMO_RATING_METRICS = {
  averageRating: '5.0',
  totalRatingsCount: '0 Reviews',
  recommendationPercentage: '100%',
  ratingBreakdown: [
    { stars: 5, percentage: 100, count: '0' },
    { stars: 4, percentage: 0, count: '0' },
    { stars: 3, percentage: 0, count: '0' },
    { stars: 2, percentage: 0, count: '0' },
    { stars: 1, percentage: 0, count: '0' },
  ],
  placeholderNotice:
    'Genuine player and parent feedback will appear here as reviews are submitted and approved.',
};
