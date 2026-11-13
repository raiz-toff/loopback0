import type { MetadataRoute } from 'next';
import { source } from '@/lib/source';
import { blog, postDate } from '@/lib/blog';
import { siteUrl } from '@/lib/shared';

// Every published page (portfolio + docs + blog), absolute against the
// canonical origin. Draft pages never reach the loaders, so they never leak
// in here. /cover is a design playground and stays unlisted.
/** The later of two optional dates. */
function latest(a?: Date | null, b?: Date | null): Date | undefined {
  if (!a) return b ?? undefined;
  if (!b) return a;
  return a > b ? a : b;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const abs = (path: string) => new URL(path, siteUrl).toString();

  // lastmod: the page's last git commit (fumadocs lastModified plugin), else
  // its frontmatter date. Pages with neither stay undated rather than guessed.
  const docs = source.getPages().map((page) => ({
    url: abs(page.url),
    lastModified: page.data.lastModified ?? postDate(page.data.date) ?? undefined,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const posts = blog.getPages().map((page) => ({
    url: abs(page.url),
    lastModified: latest(page.data.lastModified, postDate(page.data.date)),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [
    { url: abs('/'), changeFrequency: 'weekly', priority: 1 },
    { url: abs('/about'), changeFrequency: 'monthly', priority: 0.9 },
    { url: abs('/docs'), changeFrequency: 'weekly', priority: 0.9 },
    { url: abs('/blog'), changeFrequency: 'weekly', priority: 0.8 },
    { url: abs('/gallery'), changeFrequency: 'weekly', priority: 0.8 },
    ...docs,
    ...posts,
  ];
}
