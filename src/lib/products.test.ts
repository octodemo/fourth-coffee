import { describe, it, expect } from 'vitest';
import {
  buildRatingMap,
  getUniqueRoastTypes,
  filterAndAttachRatings,
  sortProducts,
  buildUrl,
} from './products';
import type { ProductRow, RatingRow, ProductWithRating } from './products';

// ---------------------------------------------------------------------------
// Shared fixtures
// ---------------------------------------------------------------------------

const products: ProductRow[] = [
  { name: 'Ethiopian Yirgacheffe', slug: 'ethiopian-yirgacheffe', price: 18.99, roast: 'Light' },
  { name: 'Colombian Supremo',    slug: 'colombian-supremo',     price: 16.99, roast: 'Medium' },
  { name: 'Sumatra Mandheling',   slug: 'sumatra-mandheling',    price: 17.99, roast: 'Dark' },
  { name: 'Sunrise Blend',        slug: 'sunrise-blend',         price: 15.99, roast: 'Medium' },
  { name: 'Kenya AA',             slug: 'kenya-aa',              price: 19.99, roast: 'Light' },
  { name: 'French Roast',         slug: 'french-roast',          price: 16.99, roast: 'Dark' },
];

// ---------------------------------------------------------------------------
// buildRatingMap
// ---------------------------------------------------------------------------

describe('buildRatingMap', () => {
  it('maps each productSlug to its average rating', () => {
    const rows: RatingRow[] = [
      { productSlug: 'ethiopian-yirgacheffe', avgRating: 4.5 },
      { productSlug: 'colombian-supremo',     avgRating: 3.5 },
    ];
    const map = buildRatingMap(rows);

    expect(map.get('ethiopian-yirgacheffe')).toBe(4.5);
    expect(map.get('colombian-supremo')).toBe(3.5);
  });

  it('converts string avgRating values (as returned by Astro DB) to numbers', () => {
    const rows: RatingRow[] = [
      { productSlug: 'kenya-aa', avgRating: '4.75' },
    ];
    const map = buildRatingMap(rows);
    expect(map.get('kenya-aa')).toBe(4.75);
  });

  it('converts null avgRating to 0', () => {
    const rows: RatingRow[] = [
      { productSlug: 'french-roast', avgRating: null },
    ];
    const map = buildRatingMap(rows);
    expect(map.get('french-roast')).toBe(0);
  });

  it('returns an empty map when given an empty array', () => {
    expect(buildRatingMap([])).toEqual(new Map());
  });

  it('stores 0 when avgRating is exactly 0 (a product with no ratings yet)', () => {
    const rows: RatingRow[] = [
      { productSlug: 'sunrise-blend', avgRating: 0 },
    ];
    const map = buildRatingMap(rows);
    expect(map.get('sunrise-blend')).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// getUniqueRoastTypes
// ---------------------------------------------------------------------------

describe('getUniqueRoastTypes', () => {
  it('returns each roast type exactly once', () => {
    const types = getUniqueRoastTypes(products);
    expect(types.filter(t => t === 'Light')).toHaveLength(1);
    expect(types.filter(t => t === 'Medium')).toHaveLength(1);
    expect(types.filter(t => t === 'Dark')).toHaveLength(1);
  });

  it('returns roast types sorted alphabetically', () => {
    const types = getUniqueRoastTypes(products);
    expect(types).toEqual(['Dark', 'Light', 'Medium']);
  });

  it('returns an empty array when given an empty product list', () => {
    expect(getUniqueRoastTypes([])).toEqual([]);
  });

  it('returns a single entry when all products share the same roast type', () => {
    const mediumOnly: ProductRow[] = [
      { name: 'Colombian Supremo', slug: 'colombian-supremo', price: 16.99, roast: 'Medium' },
      { name: 'Sunrise Blend',     slug: 'sunrise-blend',     price: 15.99, roast: 'Medium' },
    ];
    expect(getUniqueRoastTypes(mediumOnly)).toEqual(['Medium']);
  });

  it('handles a single product correctly', () => {
    const single: ProductRow[] = [
      { name: 'Kenya AA', slug: 'kenya-aa', price: 19.99, roast: 'Light' },
    ];
    expect(getUniqueRoastTypes(single)).toEqual(['Light']);
  });
});

// ---------------------------------------------------------------------------
// filterAndAttachRatings
// ---------------------------------------------------------------------------

describe('filterAndAttachRatings', () => {
  const ratingMap = new Map([
    ['ethiopian-yirgacheffe', 4.5],
    ['colombian-supremo',     3.5],
    ['sumatra-mandheling',    5.0],
    ['sunrise-blend',        4.0],
    ['kenya-aa',             4.75],
    ['french-roast',         2.5],
  ]);

  it('returns all products when roastFilter is "all"', () => {
    const result = filterAndAttachRatings(products, ratingMap, 'all');
    expect(result).toHaveLength(products.length);
  });

  it('keeps only Light-roast products when roastFilter is "light" (case-insensitive)', () => {
    const result = filterAndAttachRatings(products, ratingMap, 'light');
    expect(result.every(p => p.roast.toLowerCase() === 'light')).toBe(true);
    expect(result).toHaveLength(2);
  });

  it('keeps only Medium-roast products when roastFilter is "Medium"', () => {
    const result = filterAndAttachRatings(products, ratingMap, 'Medium');
    expect(result.every(p => p.roast.toLowerCase() === 'medium')).toBe(true);
    expect(result).toHaveLength(2);
  });

  it('keeps only Dark-roast products when roastFilter is "DARK"', () => {
    const result = filterAndAttachRatings(products, ratingMap, 'DARK');
    expect(result.every(p => p.roast.toLowerCase() === 'dark')).toBe(true);
    expect(result).toHaveLength(2);
  });

  it('attaches the correct avgRating from the rating map', () => {
    const result = filterAndAttachRatings(products, ratingMap, 'all');
    const kenya = result.find(p => p.slug === 'kenya-aa');
    expect(kenya?.avgRating).toBe(4.75);
  });

  it('defaults avgRating to 0 for products not in the rating map', () => {
    const emptyMap = new Map<string, number>();
    const result = filterAndAttachRatings(products, emptyMap, 'all');
    expect(result.every(p => p.avgRating === 0)).toBe(true);
  });

  it('returns an empty array when no products match the filter', () => {
    const result = filterAndAttachRatings(products, ratingMap, 'espresso');
    expect(result).toHaveLength(0);
  });

  it('returns an empty array when the product list is empty', () => {
    const result = filterAndAttachRatings([], ratingMap, 'all');
    expect(result).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// sortProducts
// ---------------------------------------------------------------------------

describe('sortProducts', () => {
  function makeList(): ProductWithRating[] {
    return [
      { name: 'Colombian Supremo',    slug: 'colombian-supremo',     price: 16.99, roast: 'Medium', avgRating: 3.5 },
      { name: 'Kenya AA',             slug: 'kenya-aa',              price: 19.99, roast: 'Light',  avgRating: 4.75 },
      { name: 'French Roast',         slug: 'french-roast',          price: 16.99, roast: 'Dark',   avgRating: 2.5 },
      { name: 'Ethiopian Yirgacheffe',slug: 'ethiopian-yirgacheffe', price: 18.99, roast: 'Light',  avgRating: 4.5 },
      { name: 'Sumatra Mandheling',   slug: 'sumatra-mandheling',    price: 17.99, roast: 'Dark',   avgRating: 5.0 },
    ];
  }

  it('sorts by descending avgRating when sort is "rating"', () => {
    const list = makeList();
    sortProducts(list, 'rating');
    const ratings = list.map(p => p.avgRating);
    for (let i = 0; i < ratings.length - 1; i++) {
      expect(ratings[i]).toBeGreaterThanOrEqual(ratings[i + 1]);
    }
  });

  it('places the highest-rated product first when sort is "rating"', () => {
    const list = makeList();
    sortProducts(list, 'rating');
    expect(list[0].slug).toBe('sumatra-mandheling'); // avgRating 5.0
  });

  it('places the lowest-rated product last when sort is "rating"', () => {
    const list = makeList();
    sortProducts(list, 'rating');
    expect(list[list.length - 1].slug).toBe('french-roast'); // avgRating 2.5
  });

  it('does not change the order when sort is "name"', () => {
    const list = makeList();
    const originalSlugs = list.map(p => p.slug);
    sortProducts(list, 'name');
    expect(list.map(p => p.slug)).toEqual(originalSlugs);
  });

  it('does not change the order when sort is an unrecognised value', () => {
    const list = makeList();
    const originalSlugs = list.map(p => p.slug);
    sortProducts(list, 'unknown');
    expect(list.map(p => p.slug)).toEqual(originalSlugs);
  });

  it('handles products with equal ratings stably (no throws)', () => {
    const list: ProductWithRating[] = [
      { name: 'A', slug: 'a', price: 10, roast: 'Light',  avgRating: 4.0 },
      { name: 'B', slug: 'b', price: 10, roast: 'Medium', avgRating: 4.0 },
      { name: 'C', slug: 'c', price: 10, roast: 'Dark',   avgRating: 4.0 },
    ];
    expect(() => sortProducts(list, 'rating')).not.toThrow();
    expect(list.every(p => p.avgRating === 4.0)).toBe(true);
  });

  it('handles a single-element list without throwing', () => {
    const list: ProductWithRating[] = [
      { name: 'A', slug: 'a', price: 10, roast: 'Light', avgRating: 3.0 },
    ];
    expect(() => sortProducts(list, 'rating')).not.toThrow();
  });

  it('handles an empty list without throwing', () => {
    expect(() => sortProducts([], 'rating')).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// buildUrl
// ---------------------------------------------------------------------------

describe('buildUrl', () => {
  it('returns "/products" when both sort and roast are at their defaults', () => {
    expect(buildUrl({ sort: 'name', roast: 'all' }, {})).toBe('/products');
  });

  it('includes sort=rating when overriding sort', () => {
    const url = buildUrl({ sort: 'name', roast: 'all' }, { sort: 'rating' });
    expect(url).toBe('/products?sort=rating');
  });

  it('includes roast param when overriding to a specific roast', () => {
    const url = buildUrl({ sort: 'name', roast: 'all' }, { roast: 'dark' });
    expect(url).toBe('/products?roast=dark');
  });

  it('includes both sort and roast when both are non-default', () => {
    const url = buildUrl({ sort: 'name', roast: 'all' }, { sort: 'rating', roast: 'light' });
    expect(url).toContain('sort=rating');
    expect(url).toContain('roast=light');
  });

  it('omits sort param when override resets it back to "name"', () => {
    const url = buildUrl({ sort: 'rating', roast: 'dark' }, { sort: 'name' });
    expect(url).not.toContain('sort=');
    expect(url).toContain('roast=dark');
  });

  it('omits roast param when override resets it back to "all"', () => {
    const url = buildUrl({ sort: 'rating', roast: 'dark' }, { roast: 'all' });
    expect(url).not.toContain('roast=');
    expect(url).toContain('sort=rating');
  });

  it('preserves current sort when only roast is overridden', () => {
    const url = buildUrl({ sort: 'rating', roast: 'all' }, { roast: 'medium' });
    expect(url).toBe('/products?sort=rating&roast=medium');
  });

  it('preserves current roast when only sort is overridden', () => {
    const url = buildUrl({ sort: 'name', roast: 'light' }, { sort: 'rating' });
    expect(url).toBe('/products?sort=rating&roast=light');
  });

  it('returns "/products" when current params are null and no overrides given', () => {
    expect(buildUrl({ sort: null, roast: null }, {})).toBe('/products');
  });
});
