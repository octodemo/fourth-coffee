import type { RoastPreference, DeliveryFrequency, BagSize, Product } from './types';
import { BAG_SIZE_OPTIONS } from './types';

export interface SubscriptionInput {
  customerName: string;
  customerEmail: string;
  productSlug: string;
  roastPreference: RoastPreference;
  frequency: DeliveryFrequency;
  bagSize: BagSize;
}

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validates subscription form input, returning an array of validation errors.
 * Returns an empty array if all input is valid.
 */
export function validateSubscriptionInput(input: SubscriptionInput): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!input.customerName || input.customerName.trim().length === 0) {
    errors.push({ field: 'customerName', message: 'Name is required' });
  }

  if (!input.customerEmail || input.customerEmail.trim().length === 0) {
    errors.push({ field: 'customerEmail', message: 'Email is required' });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.customerEmail)) {
    errors.push({ field: 'customerEmail', message: 'Please enter a valid email address' });
  }

  if (!input.productSlug || input.productSlug.trim().length === 0) {
    errors.push({ field: 'productSlug', message: 'Please select a coffee' });
  }

  const validRoasts: RoastPreference[] = ['Light', 'Medium', 'Dark', 'Any'];
  if (!validRoasts.includes(input.roastPreference)) {
    errors.push({ field: 'roastPreference', message: 'Please select a valid roast preference' });
  }

  const validFrequencies: DeliveryFrequency[] = ['monthly', 'bi-weekly'];
  if (!validFrequencies.includes(input.frequency)) {
    errors.push({ field: 'frequency', message: 'Please select a valid delivery frequency' });
  }

  const validBagSizes: BagSize[] = ['12oz', '1lb', '2lb'];
  if (!validBagSizes.includes(input.bagSize)) {
    errors.push({ field: 'bagSize', message: 'Please select a valid bag size' });
  }

  return errors;
}

/**
 * Calculates estimated price per delivery based on the product price and bag size.
 */
export function calculateDeliveryPrice(basePrice: number, bagSize: BagSize): number {
  const option = BAG_SIZE_OPTIONS.find(o => o.value === bagSize);
  if (!option) return basePrice;
  return Math.round(basePrice * option.priceMultiplier * 100) / 100;
}

/**
 * Filters products by roast preference. If preference is 'Any', returns all products.
 */
export function filterProductsByRoast(products: Product[], roast: RoastPreference): Product[] {
  if (roast === 'Any') return products;
  return products.filter(p => p.roast === roast);
}
