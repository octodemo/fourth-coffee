import { describe, it, expect, beforeEach } from 'vitest';
import type { CartItem } from '../src/lib/types';

const STORAGE_KEY = 'fourth-coffee-cart';

// In-memory localStorage mock
let store: Record<string, string> = {};
Object.defineProperty(globalThis, 'localStorage', {
  value: {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  },
  writable: true,
});

import { cart } from '../src/lib/cart.svelte';

function storedCart(): CartItem[] {
  const raw = store[STORAGE_KEY];
  return raw ? JSON.parse(raw) : [];
}

describe('cart store', () => {
  beforeEach(() => {
    store = {};
    cart.clear();
  });

  it('starts empty after clear', () => {
    expect(cart.items).toEqual([]);
    expect(cart.totalItems).toBe(0);
    expect(cart.totalPrice).toBe(0);
  });

  it('adds an item', () => {
    cart.add('ethiopian', 'Ethiopian Yirgacheffe', 18.99, 2);

    expect(cart.items).toHaveLength(1);
    expect(cart.items[0]).toMatchObject({ slug: 'ethiopian', name: 'Ethiopian Yirgacheffe', price: 18.99, quantity: 2 });
    expect(cart.totalItems).toBe(2);
    expect(cart.totalPrice).toBeCloseTo(37.98);
    expect(storedCart()).toHaveLength(1);
  });

  it('increments quantity when adding same item', () => {
    cart.add('colombian', 'Colombian Supremo', 16.99, 1);
    cart.add('colombian', 'Colombian Supremo', 16.99, 3);

    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].quantity).toBe(4);
    expect(cart.totalItems).toBe(4);
  });

  it('handles multiple distinct items', () => {
    cart.add('ethiopian', 'Ethiopian Yirgacheffe', 18.99, 1);
    cart.add('colombian', 'Colombian Supremo', 16.99, 2);

    expect(cart.items).toHaveLength(2);
    expect(cart.totalItems).toBe(3);
    expect(cart.totalPrice).toBeCloseTo(18.99 + 16.99 * 2);
  });

  it('removes an item', () => {
    cart.add('ethiopian', 'Ethiopian Yirgacheffe', 18.99, 1);
    cart.add('colombian', 'Colombian Supremo', 16.99, 1);
    cart.remove('ethiopian');

    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].slug).toBe('colombian');
    expect(storedCart()).toHaveLength(1);
  });

  it('updates quantity', () => {
    cart.add('ethiopian', 'Ethiopian Yirgacheffe', 18.99, 1);
    cart.updateQuantity('ethiopian', 5);

    expect(cart.items[0].quantity).toBe(5);
    expect(cart.totalItems).toBe(5);
  });

  it('removes item when quantity set to 0', () => {
    cart.add('ethiopian', 'Ethiopian Yirgacheffe', 18.99, 2);
    cart.updateQuantity('ethiopian', 0);

    expect(cart.items).toHaveLength(0);
  });

  it('clears all items', () => {
    cart.add('ethiopian', 'Ethiopian Yirgacheffe', 18.99, 1);
    cart.add('colombian', 'Colombian Supremo', 16.99, 1);
    cart.clear();

    expect(cart.items).toHaveLength(0);
    expect(cart.totalItems).toBe(0);
    expect(cart.totalPrice).toBe(0);
    expect(storedCart()).toHaveLength(0);
  });

  it('persists to localStorage', () => {
    cart.add('sunrise', 'Sunrise Blend', 15.99, 3);

    const persisted = storedCart();
    expect(persisted).toHaveLength(1);
    expect(persisted[0]).toMatchObject({ slug: 'sunrise', quantity: 3, price: 15.99 });
  });

  it('defaults quantity to 1', () => {
    cart.add('ethiopian', 'Ethiopian Yirgacheffe', 18.99);

    expect(cart.items[0].quantity).toBe(1);
  });
});
