import { describe, it, expect } from 'vitest';
import { filterReviewsByScore, countByRating } from './reviews';
import type { ReviewItem } from './reviews';

// ---------------------------------------------------------------------------
// Shared fixtures
// ---------------------------------------------------------------------------

const reviews: ReviewItem[] = [
  { rating: 5, comment: 'Amazing coffee!', author: 'Alice' },
  { rating: 4, comment: 'Very good',       author: 'Bob' },
  { rating: 5, comment: 'Best I ever had', author: 'Carol' },
  { rating: 3, comment: 'Decent',          author: 'Dave' },
  { rating: 2, comment: 'Not for me',      author: 'Eve' },
  { rating: 4, comment: 'Really enjoyed',  author: 'Frank' },
  { rating: 1, comment: 'Terrible',        author: 'Grace' },
  { rating: 5, comment: 'Perfection',      author: 'Heidi' },
];

// ---------------------------------------------------------------------------
// filterReviewsByScore
// ---------------------------------------------------------------------------

describe('filterReviewsByScore', () => {
  it('returns all reviews when score is 0', () => {
    const result = filterReviewsByScore(reviews, 0);
    expect(result).toHaveLength(reviews.length);
    expect(result).toEqual(reviews);
  });

  it('returns only 5-star reviews when score is 5', () => {
    const result = filterReviewsByScore(reviews, 5);
    expect(result).toHaveLength(3);
    expect(result.every(r => r.rating === 5)).toBe(true);
  });

  it('returns only 4-star reviews when score is 4', () => {
    const result = filterReviewsByScore(reviews, 4);
    expect(result).toHaveLength(2);
    expect(result.every(r => r.rating === 4)).toBe(true);
  });

  it('returns only 3-star reviews when score is 3', () => {
    const result = filterReviewsByScore(reviews, 3);
    expect(result).toHaveLength(1);
    expect(result[0].author).toBe('Dave');
  });

  it('returns only 2-star reviews when score is 2', () => {
    const result = filterReviewsByScore(reviews, 2);
    expect(result).toHaveLength(1);
    expect(result[0].author).toBe('Eve');
  });

  it('returns only 1-star reviews when score is 1', () => {
    const result = filterReviewsByScore(reviews, 1);
    expect(result).toHaveLength(1);
    expect(result[0].author).toBe('Grace');
  });

  it('returns an empty array when no reviews match the score', () => {
    const fiveStarOnly: ReviewItem[] = [
      { rating: 5, comment: 'Great', author: 'A' },
    ];
    const result = filterReviewsByScore(fiveStarOnly, 2);
    expect(result).toHaveLength(0);
  });

  it('returns an empty array when given an empty list', () => {
    expect(filterReviewsByScore([], 0)).toEqual([]);
    expect(filterReviewsByScore([], 5)).toEqual([]);
  });

  it('returns an empty array when score is outside the valid 1–5 range', () => {
    expect(filterReviewsByScore(reviews, 6)).toHaveLength(0);
    expect(filterReviewsByScore(reviews, -1)).toHaveLength(0);
  });

  it('preserves the original order of reviews', () => {
    const result = filterReviewsByScore(reviews, 5);
    expect(result.map(r => r.author)).toEqual(['Alice', 'Carol', 'Heidi']);
  });
});

// ---------------------------------------------------------------------------
// countByRating
// ---------------------------------------------------------------------------

describe('countByRating', () => {
  it('counts reviews for each star rating', () => {
    const counts = countByRating(reviews);
    expect(counts.get(5)).toBe(3);
    expect(counts.get(4)).toBe(2);
    expect(counts.get(3)).toBe(1);
    expect(counts.get(2)).toBe(1);
    expect(counts.get(1)).toBe(1);
  });

  it('always includes keys 1 through 5, even with zero counts', () => {
    const fiveStarOnly: ReviewItem[] = [
      { rating: 5, comment: 'Great', author: 'A' },
    ];
    const counts = countByRating(fiveStarOnly);
    expect(counts.get(5)).toBe(1);
    expect(counts.get(4)).toBe(0);
    expect(counts.get(3)).toBe(0);
    expect(counts.get(2)).toBe(0);
    expect(counts.get(1)).toBe(0);
  });

  it('returns all zeros for an empty review list', () => {
    const counts = countByRating([]);
    for (let star = 1; star <= 5; star++) {
      expect(counts.get(star)).toBe(0);
    }
  });

  it('handles reviews with the same rating correctly', () => {
    const allFours: ReviewItem[] = [
      { rating: 4, comment: 'Good', author: 'A' },
      { rating: 4, comment: 'Nice', author: 'B' },
      { rating: 4, comment: 'Solid', author: 'C' },
    ];
    const counts = countByRating(allFours);
    expect(counts.get(4)).toBe(3);
    expect(counts.get(5)).toBe(0);
  });

  it('always returns a map with exactly the keys 1 through 5', () => {
    const counts = countByRating(reviews);
    expect([...counts.keys()].sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5]);
  });
});
