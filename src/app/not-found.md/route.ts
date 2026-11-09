import { markdownResponse } from '@/lib/markdown-response';
import { siteUrl } from '@/lib/shared';

export const revalidate = false;

const content = `# Page not found

The page you requested does not exist on ${siteUrl.host}. It may have been moved, renamed, or removed.

- [llms.txt](${new URL('/llms.txt', siteUrl)}): Index of every docs page, available as Markdown.
- [Sitemap](${new URL('/sitemap.xml', siteUrl)}): Every public URL on the site.
- [Home](${siteUrl}): Start from the home page.
`;

/**
 * Reached through the Accept-based fallback rewrite in next.config.ts and from
 * the docs Markdown route, so agents asking for Markdown get a readable error
 * instead of the HTML 404 page, with the 404 status kept.
 */
export function GET() {
  return markdownResponse(content, { status: 404, negotiated: true });
}
