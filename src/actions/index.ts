import { defineAction } from 'astro:actions';
import { z } from 'astro/zod';
import { db, Review, Subscription } from 'astro:db';

export const server = {
  addReview: defineAction({
    input: z.object({
      slug: z.string(),
      author: z.string().min(1),
      rating: z.number().min(1).max(5),
      comment: z.string().min(1),
    }),
    handler: async (input) => {
      const [review] = await db
        .insert(Review)
        .values({
          productSlug: input.slug,
          author: input.author,
          rating: input.rating,
          comment: input.comment,
        })
        .returning();
      return review;
    },
  }),

  createSubscription: defineAction({
    input: z.object({
      customerName: z.string().min(1, 'Name is required'),
      customerEmail: z.string().email('Valid email is required'),
      productSlug: z.string().min(1, 'Please select a coffee'),
      roastPreference: z.enum(['Light', 'Medium', 'Dark', 'Any']),
      frequency: z.enum(['monthly', 'bi-weekly']),
      bagSize: z.enum(['12oz', '1lb', '2lb']),
    }),
    handler: async (input) => {
      const [subscription] = await db
        .insert(Subscription)
        .values({
          customerName: input.customerName,
          customerEmail: input.customerEmail,
          productSlug: input.productSlug,
          roastPreference: input.roastPreference,
          frequency: input.frequency,
          bagSize: input.bagSize,
          createdAt: new Date().toISOString(),
        })
        .returning();
      return subscription;
    },
  }),
};