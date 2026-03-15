import type { CartItem } from './types';

const STORAGE_KEY = 'fourth-coffee-cart';

function loadCart(): CartItem[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

let items = $state<CartItem[]>(loadCart());

export const cart = {
  get items() { return items; },

  get totalItems() {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  },

  get totalPrice() {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  add(slug: string, name: string, price: number, quantity: number = 1) {
    const existing = items.find(item => item.slug === slug);
    if (existing) {
      existing.quantity += quantity;
      items = [...items];
    } else {
      items = [...items, { slug, name, price, quantity }];
    }
    saveCart(items);
  },

  remove(slug: string) {
    items = items.filter(item => item.slug !== slug);
    saveCart(items);
  },

  updateQuantity(slug: string, quantity: number) {
    if (quantity <= 0) {
      this.remove(slug);
      return;
    }
    const existing = items.find(item => item.slug === slug);
    if (existing) {
      existing.quantity = quantity;
      items = [...items];
      saveCart(items);
    }
  },

  clear() {
    items = [];
    saveCart(items);
  },
};
