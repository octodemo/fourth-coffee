export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  roast: string;
  origin: string;
  notes: string;
}

export interface CartItem {
    slug: string;
    name: string;
    quantity: number;
}

export type RoastPreference = 'Light' | 'Medium' | 'Dark' | 'Any';
export type DeliveryFrequency = 'monthly' | 'bi-weekly';
export type BagSize = '12oz' | '1lb' | '2lb';

export interface Subscription {
  id: number;
  customerName: string;
  customerEmail: string;
  productSlug: string;
  roastPreference: RoastPreference;
  frequency: DeliveryFrequency;
  bagSize: BagSize;
  createdAt: string;
}

export const ROAST_OPTIONS: RoastPreference[] = ['Light', 'Medium', 'Dark', 'Any'];
export const FREQUENCY_OPTIONS: { value: DeliveryFrequency; label: string }[] = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'bi-weekly', label: 'Every 2 Weeks' },
];
export const BAG_SIZE_OPTIONS: { value: BagSize; label: string; priceMultiplier: number }[] = [
  { value: '12oz', label: '12 oz', priceMultiplier: 1.0 },
  { value: '1lb', label: '1 lb', priceMultiplier: 1.3 },
  { value: '2lb', label: '2 lb', priceMultiplier: 2.4 },
];