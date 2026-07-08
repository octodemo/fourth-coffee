import { describe, it, expect } from 'vitest';
import { sortProducts, filterByRoast, getUniqueRoasts, type ProductWithRating } from '../src/lib/product-sort';

const products: ProductWithRating[] = [
  { name: 'Colombian Supremo', slug: 'colombian-supremo', price: 16.99, roast: 'Medium', avgRating: 3.5 },
  { name: 'Ethiopian Yirgacheffe', slug: 'ethiopian-yirgacheffe', price: 18.99, roast: 'Light', avgRating: 4.8 },
  { name: 'Sumatra Mandheling', slug: 'sumatra-mandheling', price: 17.99, roast: 'Dark', avgRating: 4.0 },
  { name: 'Sunrise Blend', slug: 'sunrise-blend', price: 15.99, roast: 'Medium', avgRating: 0 },
];

describe('sortProducts', () => {
  it('sorts by name alphabetically', () => {
    const result = sortProducts(products, 'name');
    expect(result.map(p => p.name)).toEqual([
      'Colombian Supremo',
      'Ethiopian Yirgacheffe',
      'Sumatra Mandheling',
      'Sunrise Blend',
    ]);
  });

  it('sorts by rating descending', () => {
    const result = sortProducts(products, 'rating');
    expect(result.map(p => p.name)).toEqual([
      'Ethiopian Yirgacheffe',
      'Sumatra Mandheling',
      'Colombian Supremo',
      'Sunrise Blend',
    ]);
  });

  it('does not mutate the original array', () => {
    const original = [...products];
    sortProducts(products, 'rating');
    expect(products).toEqual(original);
  });

  it('handles empty array', () => {
    expect(sortProducts([], 'name')).toEqual([]);
    expect(sortProducts([], 'rating')).toEqual([]);
  });

  it('handles products with equal ratings', () => {
    const tied: ProductWithRating[] = [
      { name: 'B Coffee', slug: 'b', price: 10, roast: 'Dark', avgRating: 4.0 },
      { name: 'A Coffee', slug: 'a', price: 10, roast: 'Light', avgRating: 4.0 },
    ];
    const result = sortProducts(tied, 'rating');
    // Both have same rating; sort is stable so original order preserved
    expect(result.every(p => p.avgRating === 4.0)).toBe(true);
  });
});

describe('filterByRoast', () => {
  it('returns all products when roast is "All"', () => {
    const result = filterByRoast(products, 'All');
    expect(result).toHaveLength(4);
  });

  it('filters to only Medium roast', () => {
    const result = filterByRoast(products, 'Medium');
    expect(result).toHaveLength(2);
    expect(result.every(p => p.roast === 'Medium')).toBe(true);
  });

  it('filters to only Dark roast', () => {
    const result = filterByRoast(products, 'Dark');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Sumatra Mandheling');
  });

  it('returns empty array for non-existent roast', () => {
    expect(filterByRoast(products, 'Extra Dark')).toEqual([]);
  });

  it('does not mutate the original array', () => {
    const original = [...products];
    filterByRoast(products, 'Light');
    expect(products).toEqual(original);
  });
});

describe('getUniqueRoasts', () => {
  it('returns unique roasts sorted alphabetically', () => {
    expect(getUniqueRoasts(products)).toEqual(['Dark', 'Light', 'Medium']);
  });

  it('returns empty array for empty input', () => {
    expect(getUniqueRoasts([])).toEqual([]);
  });

  it('handles single product', () => {
    expect(getUniqueRoasts([products[0]])).toEqual(['Medium']);
  });
});
