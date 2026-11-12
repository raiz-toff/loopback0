import { blog } from '@/lib/blog';
import { notFound } from 'next/navigation';
import { ImageResponse } from 'next/og';
import { ogCard } from '@/lib/og-card';

export const revalidate = false;

/** Slug that stands for the blog list page (/blog) instead of a post. */
const LIST = 'index';

// Share card for the blog list and for posts without a `cover`.
export async function GET(_req: Request, { params }: RouteContext<'/og/blog/[slug]'>) {
  const { slug } = await params;
  const page = slug === LIST ? null : blog.getPage([slug]);
  if (slug !== LIST && !page) notFound();

  const line = page ? page.data.title : 'Stories, field notes, and the occasional detour.';
  return new ImageResponse(ogCard({ name: 'Blog', line }), { width: 1200, height: 630 });
}

export function generateStaticParams() {
  return [{ slug: LIST }, ...blog.getPages().map((page) => ({ slug: page.slugs[0] }))];
}
