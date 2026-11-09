import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { blog, postDate, readingMinutes } from '@/lib/blog';
import { getMDXComponents } from '@/components/docs/mdx';
import { author, githubFileUrl, githubIssueUrl, siteUrl } from '@/lib/shared';
import SiteFooter from '@/components/site-footer';
import { PublishBottomNav } from '@/components/bottom-nav/context';

// Blog post — standalone article layout (no docs chrome): back link,
// title, dateline + reading time, prose body.

function formatPostDate(d: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(d);
}

export default async function BlogPostPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const page = blog.getPage([slug]);
  if (!page) notFound();

  const MDX = page.data.body;
  const text = await page.data.getText('processed');
  const date = postDate(page.data.date);
  const tags: string[] = page.data.tags ?? [];
  const cover = page.data.cover ?? undefined;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: page.data.title,
    description: page.data.description ?? undefined,
    url: new URL(page.url, siteUrl).toString(),
    image: new URL(cover ?? `/og/blog/${slug}`, siteUrl).toString(),
    datePublished: date?.toISOString(),
    keywords: tags.length > 0 ? tags.join(', ') : undefined,
    author: { '@type': 'Person', name: author.name, url: author.url },
  };

  return (
    <>
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-14">
        <PublishBottomNav
          toc={page.data.toc}
          progress
          primary={{ kind: 'copy-url', label: 'Copy link' }}
          back={{ label: 'All posts', href: '/blog' }}
          showSearch={false}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
          }}
        />
        <Link
          href="/blog"
          className="group inline-flex items-center gap-2 rounded-lg border border-line bg-muted/40 px-3.5 py-2 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground shadow-xs transition-all hover:border-border hover:bg-muted hover:text-foreground active:scale-95"
        >
          <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-1" />
          <span>Blog</span>
        </Link>

        {cover ? (
          // The cover is this page's LCP element: load it at high priority.
          <div className="relative mt-6 aspect-[2/1] w-full overflow-hidden rounded-xl outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10">
            <Image
              src={cover}
              alt=""
              fill
              sizes="(min-width: 768px) 720px, 100vw"
              loading="eager"
              fetchPriority="high"
              unoptimized={cover.startsWith('http')}
              className="object-cover"
            />
          </div>
        ) : null}

        <h1 className="mt-6 text-balance text-3xl font-bold tracking-tight text-fd-foreground sm:text-4xl">
          {page.data.title}
        </h1>
        {page.data.description ? (
          <p className="mt-4 text-pretty text-[16px] leading-relaxed text-fd-muted-foreground">
            {page.data.description}
          </p>
        ) : null}

        <p className="mt-6 border-b border-fd-border pb-6 font-mono text-[11.5px] uppercase tracking-[0.14em] text-fd-muted-foreground">
          {date ? `${formatPostDate(date)} · ` : ''}
          {readingMinutes(text)} min read
          {tags.length > 0 && (
            <span className="text-fd-muted-foreground/70">
              {tags.map((tag) => (
                <span key={tag}>
                  <span className="mx-2 text-fd-muted-foreground/40">/</span>
                  {tag}
                </span>
              ))}
            </span>
          )}
        </p>

        <article className="prose mt-8">
          <MDX components={getMDXComponents()} />
        </article>

        <p className="mt-12 flex flex-wrap gap-x-5 gap-y-2 border-t border-fd-border pt-6 font-mono text-[11.5px] uppercase tracking-[0.14em] text-fd-muted-foreground">
          <a
            href={githubFileUrl(`content/blog/${page.path}`, 'edit')}
            target="_blank"
            rel="noreferrer noopener"
            className="transition-colors hover:text-fd-foreground"
          >
            Edit on GitHub
          </a>
          <a
            href={githubIssueUrl(page.data.title, page.url)}
            target="_blank"
            rel="noreferrer noopener"
            className="transition-colors hover:text-fd-foreground"
          >
            Report an issue
          </a>
        </p>
      </main>
      <SiteFooter />
    </>
  );
}

export function generateStaticParams() {
  return blog.getPages().map((page) => ({ slug: page.slugs[0] }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const page = blog.getPage([slug]);
  if (!page) notFound();

  const date = postDate(page.data.date);
  const image = page.data.cover ?? `/og/blog/${slug}`;

  return {
    title: page.data.title,
    description: page.data.description,
    alternates: { canonical: page.url },
    openGraph: {
      type: 'article',
      title: page.data.title,
      description: page.data.description ?? undefined,
      url: page.url,
      images: image,
      publishedTime: date?.toISOString(),
      authors: [author.url],
      tags: page.data.tags ?? undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: page.data.title,
      description: page.data.description ?? undefined,
      images: image,
    },
  };
}
