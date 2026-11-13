import Image from 'next/image';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { blog, postDate, readingMinutes } from '@/lib/blog';
import { findPost, getPosts } from '@/lib/blog-posts';
import { getMDXComponents } from '@/components/docs/mdx';
import { Lightbox } from '@fumadocs/base-ui/components/image-zoom';
import { author, siteUrl } from '@/lib/shared';
import { WEBSITE_ID, jsonLd as toJsonLd, personRef } from '@/lib/person-schema';
import SiteFooter from '@/components/site-footer';
import { PageComments } from '@/components/comments/page-comments';
import { RelatedPages } from '@/components/related-pages';
import { isRealUpdate, relatedPages } from '@/lib/related';
import { HISTORY_START, relatedCandidates } from '@/lib/related-data';
import {
  BlogBackLink,
  BlogBody,
  BlogDate,
  BlogDescription,
  BlogHeader,
  BlogPage,
  BlogPostNav,
  BlogTags,
  BlogTitle,
  BrandStripe,
} from '@/components/blog';

// Blog post on the fumadocs.dev blog design: header card with back link,
// title, description and date; author and tags at the end; prose body; newer / older
// navigation; floating table-of-contents and share panel.

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const page = blog.getPage([slug]);
  const found = page && findPost(getPosts(), page.url);
  if (!page || !found) notFound();

  const { post, newer, older } = found;
  const MDX = page.data.body;
  const text = await page.data.getText('processed');
  const date = postDate(page.data.date);
  // "Updated" only for a real edit (see isRealUpdate); git dates come from the lastModified plugin
  const showUpdated = isRealUpdate(date ?? undefined, page.data.lastModified, HISTORY_START);
  const candidates = relatedCandidates();
  const related = relatedPages(candidates.find((c) => c.url === page.url)!, candidates);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: page.data.title,
    description: page.data.description ?? undefined,
    url: new URL(page.url, siteUrl).toString(),
    image: new URL(post.image ?? `/og/blog/${slug}`, siteUrl).toString(),
    datePublished: date?.toISOString(),
    // last git commit to the post (fumadocs lastModified plugin), never earlier than publishing
    dateModified: (page.data.lastModified && date && page.data.lastModified > date ? page.data.lastModified : date)?.toISOString(),
    keywords: post.tags.length > 0 ? post.tags.map((t) => t.name).join(', ') : undefined,
    author: personRef,
    publisher: personRef,
    mainEntityOfPage: new URL(page.url, siteUrl).toString(),
    isPartOf: { '@id': WEBSITE_ID },
  };

  return (
    <>
      <BlogPage toc={page.data.toc}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: toJsonLd(jsonLd) }}
        />
        <BlogHeader className="gap-2 overflow-hidden px-4 pt-0 pb-4">
          <BrandStripe className="-mx-4 mb-2 w-[calc(100%+2rem)]" />
          <div className="flex w-full items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-fd-muted-foreground">
            <BlogBackLink href="/blog" className="font-mono text-[11px] uppercase tracking-[0.14em]">
              blog
            </BlogBackLink>
            <span className="flex flex-wrap items-center justify-end gap-x-2 gap-y-1">
              {post.date && <BlogDate date={post.date} />}
              {showUpdated && page.data.lastModified ? (
                <>
                  <span aria-hidden className="text-fd-muted-foreground/40">·</span>
                  <span className="text-fd-foreground">
                    Updated <BlogDate date={page.data.lastModified} />
                  </span>
                </>
              ) : null}
              <span aria-hidden className="text-fd-muted-foreground/40">·</span>
              <span>{readingMinutes(text)} min read</span>
            </span>
          </div>
          <BlogTitle className="text-xl tracking-tight text-balance sm:text-2xl">{post.title}</BlogTitle>
          <BlogDescription className="text-sm text-pretty">{post.description}</BlogDescription>
        </BlogHeader>

        {post.image ? (
          // The cover is this page's LCP element: load it at high priority.
          <div className="relative aspect-[2/1] w-full overflow-hidden rounded-xl outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10">
            <Image
              src={post.image}
              alt=""
              fill
              sizes="(min-width: 900px) 868px, 100vw"
              loading="eager"
              fetchPriority="high"
              unoptimized={post.image.startsWith('http')}
              className="object-cover"
            />
          </div>
        ) : null}

        {page.data.outcome ? (
          // how-to posts: what the reader ends with, before step one
          <dl className="grid gap-x-6 gap-y-3 rounded-xl border bg-fd-card px-4 py-3.5 text-sm sm:grid-cols-[auto_1fr]">
            <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-fd-muted-foreground sm:pt-0.5">You end with</dt>
            <dd className="text-fd-foreground">{page.data.outcome}</dd>
            {page.data.needs ? (
              <>
                <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-fd-muted-foreground sm:pt-0.5">You need</dt>
                <dd className="text-fd-foreground">{page.data.needs}</dd>
              </>
            ) : null}
          </dl>
        ) : null}

        <BlogBody>
          <Lightbox>
            <MDX components={getMDXComponents()} />
          </Lightbox>
        </BlogBody>

        {/* author and tags close the post, so the header stays short */}
        <div className="flex w-full flex-wrap items-center gap-x-3 gap-y-2 border-t border-fd-border pt-6">
          {post.authors.map((a) => (
            <a key={a.name} href={a.url} className="inline-flex items-center gap-2 text-xs transition-colors hover:text-fd-primary">
              {a.image && <Image src={a.image} alt="" width={20} height={20} className="size-5 rounded-full object-cover" />}
              <span className="font-medium">{a.name}</span>
            </a>
          ))}
          <BlogTags tags={post.tags} className="ms-auto" />
        </div>

        <RelatedPages items={related} className="w-full" />

        <BlogPostNav newer={newer} older={older} />

        <PageComments page={page.url} className="w-full border-t border-fd-border pt-6" />
      </BlogPage>
      <SiteFooter />
    </>
  );
}

export function generateStaticParams() {
  return blog.getPages().map((page) => ({ slug: page.slugs[0] }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
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
