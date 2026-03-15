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
    price: number;
    quantity: number;
}