import { describe, it, expect } from 'vitest';
import {
  validateSubscriptionInput,
  calculateDeliveryPrice,
  filterProductsByRoast,
} from './subscription';
import type { Product } from './types';

describe('validateSubscriptionInput', () => {
  const validInput = {
    customerName: 'Alice Johnson',
    customerEmail: 'alice@example.com',
    productSlug: 'ethiopian-yirgacheffe',
    roastPreference: 'Light' as const,
    frequency: 'monthly' as const,
    bagSize: '12oz' as const,
  };

  it('returns no errors for valid input', () => {
    const errors = validateSubscriptionInput(validInput);
    expect(errors).toEqual([]);
  });

  it('requires customerName', () => {
    const errors = validateSubscriptionInput({ ...validInput, customerName: '' });
    expect(errors).toContainEqual({ field: 'customerName', message: 'Name is required' });
  });

  it('requires customerName to not be only whitespace', () => {
    const errors = validateSubscriptionInput({ ...validInput, customerName: '   ' });
    expect(errors).toContainEqual({ field: 'customerName', message: 'Name is required' });
  });

  it('requires customerEmail', () => {
    const errors = validateSubscriptionInput({ ...validInput, customerEmail: '' });
    expect(errors).toContainEqual({ field: 'customerEmail', message: 'Email is required' });
  });

  it('validates email format', () => {
    const errors = validateSubscriptionInput({ ...validInput, customerEmail: 'not-an-email' });
    expect(errors).toContainEqual({ field: 'customerEmail', message: 'Please enter a valid email address' });
  });

  it('accepts valid email formats', () => {
    const emails = ['user@example.com', 'user.name@domain.co', 'user+tag@example.org'];
    for (const email of emails) {
      const errors = validateSubscriptionInput({ ...validInput, customerEmail: email });
      const emailErrors = errors.filter(e => e.field === 'customerEmail');
      expect(emailErrors).toEqual([]);
    }
  });

  it('requires productSlug', () => {
    const errors = validateSubscriptionInput({ ...validInput, productSlug: '' });
    expect(errors).toContainEqual({ field: 'productSlug', message: 'Please select a coffee' });
  });

  it('rejects invalid roast preference', () => {
    const errors = validateSubscriptionInput({ ...validInput, roastPreference: 'Extra-Dark' as any });
    expect(errors).toContainEqual({ field: 'roastPreference', message: 'Please select a valid roast preference' });
  });

  it('rejects invalid frequency', () => {
    const errors = validateSubscriptionInput({ ...validInput, frequency: 'weekly' as any });
    expect(errors).toContainEqual({ field: 'frequency', message: 'Please select a valid delivery frequency' });
  });

  it('rejects invalid bag size', () => {
    const errors = validateSubscriptionInput({ ...validInput, bagSize: '5lb' as any });
    expect(errors).toContainEqual({ field: 'bagSize', message: 'Please select a valid bag size' });
  });

  it('returns multiple errors for multiple invalid fields', () => {
    const errors = validateSubscriptionInput({
      customerName: '',
      customerEmail: 'bad',
      productSlug: '',
      roastPreference: 'Light',
      frequency: 'monthly',
      bagSize: '12oz',
    });
    expect(errors.length).toBeGreaterThanOrEqual(3);
    expect(errors.map(e => e.field)).toContain('customerName');
    expect(errors.map(e => e.field)).toContain('customerEmail');
    expect(errors.map(e => e.field)).toContain('productSlug');
  });
});

describe('calculateDeliveryPrice', () => {
  it('returns base price for 12oz bag', () => {
    expect(calculateDeliveryPrice(18.99, '12oz')).toBe(18.99);
  });

  it('applies 1.3x multiplier for 1lb bag', () => {
    expect(calculateDeliveryPrice(18.99, '1lb')).toBe(24.69);
  });

  it('applies 2.4x multiplier for 2lb bag', () => {
    expect(calculateDeliveryPrice(18.99, '2lb')).toBe(45.58);
  });

  it('handles zero price', () => {
    expect(calculateDeliveryPrice(0, '1lb')).toBe(0);
  });

  it('returns base price for unknown bag size', () => {
    expect(calculateDeliveryPrice(18.99, 'unknown' as any)).toBe(18.99);
  });
});

describe('filterProductsByRoast', () => {
  const products: Product[] = [
    { id: 1, name: 'Light Coffee', slug: 'light', description: '', price: 15, roast: 'Light', origin: 'Ethiopia', notes: '' },
    { id: 2, name: 'Medium Coffee', slug: 'medium', description: '', price: 16, roast: 'Medium', origin: 'Colombia', notes: '' },
    { id: 3, name: 'Dark Coffee', slug: 'dark', description: '', price: 17, roast: 'Dark', origin: 'Indonesia', notes: '' },
    { id: 4, name: 'Another Light', slug: 'another-light', description: '', price: 18, roast: 'Light', origin: 'Kenya', notes: '' },
  ];

  it('returns all products when roast preference is Any', () => {
    expect(filterProductsByRoast(products, 'Any')).toEqual(products);
  });

  it('filters to only Light roast products', () => {
    const result = filterProductsByRoast(products, 'Light');
    expect(result).toHaveLength(2);
    expect(result.every(p => p.roast === 'Light')).toBe(true);
  });

  it('filters to only Medium roast products', () => {
    const result = filterProductsByRoast(products, 'Medium');
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe('medium');
  });

  it('filters to only Dark roast products', () => {
    const result = filterProductsByRoast(products, 'Dark');
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe('dark');
  });

  it('returns empty array when no products match roast', () => {
    const lightOnly = [products[0]];
    expect(filterProductsByRoast(lightOnly, 'Dark')).toEqual([]);
  });

  it('handles empty product array', () => {
    expect(filterProductsByRoast([], 'Light')).toEqual([]);
  });
});
