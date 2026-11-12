import { getPageImage, source } from '@/lib/source';
import { notFound } from 'next/navigation';
import { ImageResponse } from 'next/og';
import { ogCard } from '@/lib/og-card';

export const revalidate = false;

/** Block-lettered name per docs section, used when the page title is too long to set large. */
const SECTION: Record<string, string> = {
  labs: 'Labs',
  projects: 'Projects',
  'ccna-labs': 'CCNA Labs',
};

/** A title short enough, and plain enough, for the block lettering. */
const SHORT_TITLE = /^[A-Za-z ]{1,9}$/;

export async function GET(_req: Request, { params }: RouteContext<'/og/docs/[...slug]'>) {
  const { slug } = await params;
  const page = source.getPage(slug.slice(0, -1));
  if (!page) notFound();

  const { title, description } = page.data;
  const card = SHORT_TITLE.test(title)
    ? ogCard({ name: title, line: description })
    : ogCard({ name: SECTION[slug[0]] ?? 'Labs', line: title });

  return new ImageResponse(card, { width: 1200, height: 630 });
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    lang: page.locale,
    slug: getPageImage(page).segments,
  }));
}
