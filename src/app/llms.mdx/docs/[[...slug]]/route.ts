import { getLLMText, getPageMarkdownUrl, source } from '@/lib/source';
import { markdownResponse } from '@/lib/markdown-response';
import { GET as notFoundMarkdown } from '@/app/not-found.md/route';

export const revalidate = false;

export async function GET(_req: Request, { params }: RouteContext<'/llms.mdx/docs/[[...slug]]'>) {
  const { slug } = await params;
  const page = source.getPage(slug?.slice(0, -1));
  // Agents reach this URL by negotiation on /docs/*, so keep variants apart.
  if (!page) return notFoundMarkdown();

  return markdownResponse(await getLLMText(page), { negotiated: true });
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    lang: page.locale,
    slug: getPageMarkdownUrl(page).segments,
  }));
}
