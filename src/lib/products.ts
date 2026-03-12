export interface ProductRow {
  name: string;
  slug: string;
  price: number;
  roast: string;
}

export interface RatingRow {
  productSlug: string;
  avgRating: string | number | null;
}

export interface ProductWithRating extends ProductRow {
  avgRating: number;
}

/** Build a map of productSlug → average rating (0 when no reviews exist). */
export function buildRatingMap(avgRatings: RatingRow[]): Map<string, number> {
  return new Map(avgRatings.map(r => [r.productSlug, Number(r.avgRating) || 0]));
}

/** Extract unique roast types from a product list, sorted alphabetically. */
export function getUniqueRoastTypes(products: ProductRow[]): string[] {
  return [...new Set(products.map(p => p.roast))].sort();
}

/**
 * Attach average ratings to products and optionally filter by roast type.
 * @param products  Raw product rows from the database.
 * @param ratingMap Slug → average-rating map produced by {@link buildRatingMap}.
 * @param roastFilter Roast type to keep, or `'all'` to keep every product.
 */
export function filterAndAttachRatings(
  products: ProductRow[],
  ratingMap: Map<string, number>,
  roastFilter: string,
): ProductWithRating[] {
  return products
    .filter(p => roastFilter === 'all' || p.roast.toLowerCase() === roastFilter.toLowerCase())
    .map(p => ({ ...p, avgRating: ratingMap.get(p.slug) ?? 0 }));
}

/**
 * Sort an array of products in-place.
 * - `'rating'` → descending by avgRating
 * - `'name'` (default) → preserves existing order (caller should pre-sort by name)
 */
export function sortProducts(products: ProductWithRating[], sort: string): void {
  if (sort === 'rating') {
    products.sort((a, b) => b.avgRating - a.avgRating);
  }
}

/**
 * Build a `/products` URL that merges the current query-string with explicit
 * overrides.  Parameters equal to their defaults (`sort=name`, `roast=all`)
 * are omitted so URLs stay clean.
 */
export function buildUrl(
  currentParams: { sort?: string | null; roast?: string | null },
  overrides: Partial<{ sort: string; roast: string }>,
): string {
  const sort = overrides.sort ?? currentParams.sort;
  const roast = overrides.roast ?? currentParams.roast;
  const sp = new URLSearchParams();
  if (sort && sort !== 'name') sp.set('sort', sort);
  if (roast && roast !== 'all') sp.set('roast', roast);
  const qs = sp.toString();
  return `/products${qs ? `?${qs}` : ''}`;
}
