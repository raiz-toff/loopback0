import { blog } from './blog';
import { postDate, readingMinutes } from './content-utils';
import { identity } from '@/data/profile';
import { author as siteAuthor } from './shared';

// Blog view model, adapted from the fumadocs.dev blog (apps/docs/lib/blog.ts,
// MIT): posts newest first with tags and authors resolved, plus helpers for
// the post navigation and the tag pages.

export interface BlogAuthor {
  name: string;
  /** role or job title */
  title?: string;
  /** link to profile or website */
  url?: string;
  /** avatar URL */
  image?: string;
}

export interface BlogTag {
  /** as written in the first post using it */
  name: string;
  /** URL segment, see `tagSlug()` */
  slug: string;
  /** URL of the tag page */
  url: string;
}

export interface BlogPost {
  url: string;
  slug: string;
  title: string;
  description?: string;
  date?: Date;
  /** cover image URL */
  image?: string;
  tags: BlogTag[];
  authors: BlogAuthor[];
  /** Reading time, present when loaded with `getPostsWithMinutes()`. */
  minutes?: number;
}

/** The one author on this site. */
export const blogAuthor: BlogAuthor = {
  name: identity.name,
  url: siteAuthor.url,
  image: '/img/portrait.jpg',
};

/** lowercase, whitespace replaced by `-` */
export function tagSlug(tag: string): string {
  return tag.toLowerCase().replace(/\s+/g, '-');
}

/** Posts of the blog collection, newest first, undated posts last. */
export function getPosts(): BlogPost[] {
  const posts = blog.getPages().map((page): BlogPost => {
    const cover = page.data.cover ?? undefined;
    return {
      url: page.url,
      slug: page.slugs[page.slugs.length - 1],
      title: page.data.title,
      description: page.data.description ?? undefined,
      date: postDate(page.data.date) ?? undefined,
      image: cover && (cover.startsWith('/') || cover.startsWith('http')) ? cover : undefined,
      tags: (page.data.tags ?? []).map((name: string) => {
        const slug = tagSlug(name);
        return { name, slug, url: `/blog/tags/${slug}` };
      }),
      authors: [blogAuthor],
    };
  });

  return posts.sort((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0));
}

/** Same as `getPosts()`, with each post's reading time filled in. */
export async function getPostsWithMinutes(): Promise<BlogPost[]> {
  const minutes = new Map<string, number>();
  await Promise.all(
    blog.getPages().map(async (page) => {
      minutes.set(page.url, readingMinutes(await page.data.getText('processed')));
    }),
  );
  return getPosts().map((post) => ({ ...post, minutes: minutes.get(post.url) }));
}

/** The post at `url`, with the posts published right after (`newer`) and before (`older`). */
export function findPost(
  posts: BlogPost[],
  url: string,
): { post: BlogPost; newer?: BlogPost; older?: BlogPost } | undefined {
  const index = posts.findIndex((post) => post.url === url);
  const post = posts[index];
  if (!post) return;
  return { post, newer: posts[index - 1], older: posts[index + 1] };
}

/** Tags with their number of posts, most used first. */
export function getTags(posts: BlogPost[]): (BlogTag & { count: number })[] {
  const tags = new Map<string, BlogTag & { count: number }>();
  for (const post of posts) {
    for (const tag of post.tags) {
      const info = tags.get(tag.slug);
      if (info) info.count++;
      else tags.set(tag.slug, { ...tag, count: 1 });
    }
  }
  return Array.from(tags.values()).sort((a, b) => b.count - a.count);
}

/** A tag and its posts, `undefined` when no post has it. */
export function getTagPosts(posts: BlogPost[], slug: string) {
  let key = slug;
  try {
    key = decodeURIComponent(slug);
  } catch {
    // routers may pass the slug URI encoded; fall back to the raw value
  }
  let tag: BlogTag | undefined;
  const tagged: BlogPost[] = [];
  for (const post of posts) {
    const match = post.tags.find((item) => item.slug === key);
    if (!match) continue;
    tag ??= match;
    tagged.push(post);
  }
  if (tag) return { tag, posts: tagged };
}
