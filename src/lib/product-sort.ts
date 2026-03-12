export interface ProductWithRating {
  name: string;
  slug: string;
  price: number;
  roast: string;
  avgRating: number;
}

export type SortOption = 'name' | 'rating';

export function sortProducts(products: ProductWithRating[], sortBy: SortOption): ProductWithRating[] {
  return [...products].sort((a, b) => {
    if (sortBy === 'rating') return b.avgRating - a.avgRating;
    return a.name.localeCompare(b.name);
  });
}

export function filterByRoast(products: ProductWithRating[], roast: string): ProductWithRating[] {
  if (roast === 'All') return products;
  return products.filter(p => p.roast === roast);
}

export function getUniqueRoasts(products: ProductWithRating[]): string[] {
  return [...new Set(products.map(p => p.roast))].sort();
}
