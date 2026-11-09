import Image from 'next/image';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { blog, postDate, readingMinutes } from '@/lib/blog';
import { findPost, getPosts } from '@/lib/blog-posts';
import { getMDXComponents } from '@/components/docs/mdx';
import { Lightbox } from '@fumadocs/base-ui/components/image-zoom';
import { author, githubFileUrl, githubIssueUrl, siteUrl } from '@/lib/shared';
import SiteFooter from '@/components/site-footer';
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
// title, description, author, tags and date; prose body; newer / older
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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: page.data.title,
    description: page.data.description ?? undefined,
    url: new URL(page.url, siteUrl).toString(),
    image: new URL(post.image ?? `/og/blog/${slug}`, siteUrl).toString(),
    datePublished: date?.toISOString(),
    keywords: post.tags.length > 0 ? post.tags.map((t) => t.name).join(', ') : undefined,
    author: { '@type': 'Person', name: author.name, url: author.url },
  };

  return (
    <>
      <BlogPage toc={page.data.toc}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
        <BlogHeader className="gap-2 overflow-hidden px-4 pt-0 pb-4">
          <BrandStripe className="-mx-4 mb-2 w-[calc(100%+2rem)]" />
          <div className="flex w-full items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-fd-muted-foreground">
            <BlogBackLink href="/blog" className="font-mono text-[11px] uppercase tracking-[0.14em]">
              blog
            </BlogBackLink>
            <span className="flex items-center gap-2">
              {post.date && <BlogDate date={post.date} />}
              <span aria-hidden className="text-fd-muted-foreground/40">·</span>
              <span>{readingMinutes(text)} min read</span>
            </span>
          </div>
          <BlogTitle className="text-xl tracking-tight text-balance sm:text-2xl">{post.title}</BlogTitle>
          <BlogDescription className="text-sm text-pretty">{post.description}</BlogDescription>
          <div className="flex w-full flex-wrap items-center gap-x-3 gap-y-2 pt-1">
            {post.authors.map((a) => (
              <a key={a.name} href={a.url} className="inline-flex items-center gap-2 text-xs transition-colors hover:text-fd-primary">
                {a.image && <Image src={a.image} alt="" width={20} height={20} className="size-5 rounded-full object-cover" />}
                <span className="font-medium">{a.name}</span>
              </a>
            ))}
            <BlogTags tags={post.tags} className="ms-auto" />
          </div>
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

        <BlogBody>
          <Lightbox>
            <MDX components={getMDXComponents()} />
          </Lightbox>
        </BlogBody>

        <p className="flex flex-wrap gap-x-5 gap-y-2 border-t border-fd-border pt-6 font-mono text-[11.5px] uppercase tracking-[0.14em] text-fd-muted-foreground">
          <a href={githubFileUrl(`content/blog/${page.path}`, 'edit')} target="_blank" rel="noreferrer noopener" className="transition-colors hover:text-fd-foreground">
            Edit on GitHub
          </a>
          <a href={githubIssueUrl(page.data.title, page.url)} target="_blank" rel="noreferrer noopener" className="transition-colors hover:text-fd-foreground">
            Report an issue
          </a>
        </p>

        <BlogPostNav newer={newer} older={older} />
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
