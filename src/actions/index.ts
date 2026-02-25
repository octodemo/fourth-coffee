import { defineAction } from 'astro:actions';
import { z } from 'astro/zod';
import { db, Review } from 'astro:db';

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
};