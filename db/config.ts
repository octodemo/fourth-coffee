import { defineDb, defineTable, column } from 'astro:db';

const Product = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name: column.text(),
    slug: column.text({ unique: true }),
    description: column.text(),
    price: column.number(),
    roast: column.text(),
    origin: column.text(),
    notes: column.text(),
  },
});

const Review = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    productSlug: column.text(),
    author: column.text(),
    rating: column.number(),
    comment: column.text(),
  },
});

const Subscription = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    customerName: column.text(),
    customerEmail: column.text(),
    productSlug: column.text(),
    roastPreference: column.text(),
    frequency: column.text(),
    bagSize: column.text(),
    createdAt: column.text(),
  },
});

export default defineDb({ tables: { Product, Review, Subscription } });
