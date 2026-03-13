import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
    const posts = await getCollection('blog');
    const sortedPosts = posts.sort(
        (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
    );

    return rss({
        title: 'Fourth Coffee Blog',
        description: 'Brewing guides, roast announcements, and coffee stories from the Fourth Coffee roastery.',
        site: context.site!,
        items: sortedPosts.map((post) => ({
            title: post.data.title,
            pubDate: post.data.pubDate,
            author: post.data.author,
            description: post.data.description ?? '',
            link: `/blog/${post.id}/`,
        })),
        customData: '<language>en-us</language>',
    });
}
