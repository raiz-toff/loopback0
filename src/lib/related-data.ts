import { blog, postDate } from '@/lib/blog';
import { source } from '@/lib/source';
import type { RelatedCandidate } from '@/lib/related';

/** First commit of the public repo history (git log --reverse). Older git dates are that import. */
export const HISTORY_START = new Date('2026-11-09T05:55:33Z');

/**
 * Every published post and docs page as a related-pages candidate.
 * Section roots (`/docs/labs`, `/docs/projects`, …) are left out: they list
 * everything and would match every page.
 *
 * @returns Posts first, then docs pages, in loader order.
 */
export function relatedCandidates(): RelatedCandidate[] {
  const posts: RelatedCandidate[] = blog.getPages().map((page) => ({
    url: page.url,
    title: page.data.title,
    description: page.data.description ?? undefined,
    tags: page.data.tags ?? [],
    kind: 'Post',
  }));

  const docs: RelatedCandidate[] = source
    .getPages()
    .filter((page) => page.slugs.length >= 2)
    .map((page) => ({
      url: page.url,
      title: page.data.title,
      description: page.data.description ?? undefined,
      tags: page.data.tags ?? [],
      kind: page.slugs[0] === 'projects' ? 'Project' : page.slugs[0] === 'ccna-labs' ? 'CCNA lab' : 'Lab',
      // siblings inside one lab series or project share a folder; top-level folders are too broad
      group: page.slugs.length >= 3 ? `/docs/${page.slugs.slice(0, -1).join('/')}` : undefined,
    }));

  return [...posts, ...docs];
}

/** Published date and last git date of a post, for the "Updated" rule. */
export function postDates(url: string): { published?: Date; modified?: Date } {
  const page = blog.getPages().find((p) => p.url === url);
  return { published: postDate(page?.data.date) ?? undefined, modified: page?.data.lastModified };
}
