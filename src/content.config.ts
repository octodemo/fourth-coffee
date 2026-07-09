import { defineCollection } from "astro:content";
import { z } from "zod";
import { glob } from "astro/loaders";

const blogCollection = defineCollection({
    loader: glob({pattern: '**/*.md', base: 'src/content/blog'}),
    schema: z.object({
        title: z.string(),
        pubDate: z.date(),
        author: z.string(),
        description: z.string().optional(),
    }),
});

export const collections = {
    blog: blogCollection,
};