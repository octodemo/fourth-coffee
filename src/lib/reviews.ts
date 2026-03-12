export interface ReviewItem {
  rating: number;
  comment: string;
  author: string;
}

/**
 * Filter reviews by star score.
 * @param reviews  The full list of reviews.
 * @param score    The star rating to keep (1–5), or `0` to keep all reviews.
 */
export function filterReviewsByScore(
  reviews: ReviewItem[],
  score: number,
): ReviewItem[] {
  if (score === 0) return reviews;
  return reviews.filter(r => r.rating === score);
}

/**
 * Count how many reviews exist for each star rating (1–5).
 * Returns a map of rating → count, always including keys 1–5.
 */
export function countByRating(reviews: ReviewItem[]): Map<number, number> {
  const counts = new Map<number, number>([
    [1, 0],
    [2, 0],
    [3, 0],
    [4, 0],
    [5, 0],
  ]);
  for (const r of reviews) {
    counts.set(r.rating, (counts.get(r.rating) ?? 0) + 1);
  }
  return counts;
}
