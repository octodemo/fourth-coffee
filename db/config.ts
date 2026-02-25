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

export default defineDb({ tables: { Product, Review } });
