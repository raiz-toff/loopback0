import Link from 'next/link';
import Image from 'next/image';
import type { TOCItemType } from 'fumadocs-core/toc';
import { TOCProvider } from '@fumadocs/base-ui/components/toc';
import { ChevronLeftIcon, ChevronRightIcon, CornerLeftUpIcon, TagIcon } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import type { BlogAuthor, BlogPost, BlogTag } from '@/lib/blog-posts';
import { BlogPanel } from './panel';

// Ported from the fumadocs.dev blog (apps/docs/components/blog/index.tsx, MIT),
// on next/image and this repo's post model.

const dateFormat = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeZone: 'UTC' });

// T568B conductor order (wht/org, org, wht/grn, blu, wht/blu, grn, wht/brn, brn)
// in the brand palette; the striped pairs render as cream.
const T568B = ['#F1EBDE', '#D9711F', '#F1EBDE', '#2B5799', '#F1EBDE', '#2E7D46', '#F1EBDE', '#63452E'];

/** The 8-conductor brand stripe, 3px tall, for the top edge of a card. */
export function BrandStripe({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div aria-hidden {...props} className={cn('flex h-[3px] w-full', className)}>
      {T568B.map((color, i) => (
        <span key={i} className="flex-1" style={{ backgroundColor: color }} />
      ))}
    </div>
  );
}

export function BlogCards({ posts, className, ...props }: ComponentProps<'div'> & { posts: BlogPost[] }) {
  return (
    <div {...props} className={cn('grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3', className)}>
      {posts.map((post) => (
        <BlogCard key={post.url} post={post} />
      ))}
    </div>
  );
}

export function BlogCard({ post, className }: { post: BlogPost; className?: string }) {
  return (
    <Link
      href={post.url}
      className={cn(
        'group flex flex-col overflow-hidden rounded-2xl border bg-fd-card shadow-sm transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground',
        className,
      )}
    >
      <CardCover post={post} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <p className="font-medium leading-snug text-balance">{post.title}</p>
        <p className="line-clamp-2 text-sm text-fd-muted-foreground empty:hidden">{post.description}</p>
        {post.tags.length > 0 && (
          <p className="flex flex-wrap gap-1.5 pt-1">
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag.slug} className="rounded-md border border-fd-border bg-fd-secondary/60 px-1.5 py-0.5 font-mono text-[10.5px] text-fd-muted-foreground">
                {tag.name}
              </span>
            ))}
          </p>
        )}
        <CardMeta post={post} className="mt-auto pt-3" />
      </div>
    </Link>
  );
}

/** Newest post, laid out wide: cover beside the text. */
export function BlogFeaturedCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={post.url}
      className="group grid overflow-hidden rounded-2xl border bg-fd-card shadow-sm transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground md:grid-cols-[1.25fr_1fr]"
    >
      <CardCover post={post} sizes="(min-width: 768px) 60vw, 100vw" className="md:h-full md:aspect-auto" />
      <div className="flex flex-col gap-2 p-5 sm:p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-fd-primary">Latest</p>
        <p className="text-xl font-semibold leading-tight text-balance sm:text-2xl">{post.title}</p>
        <p className="line-clamp-3 text-sm text-fd-muted-foreground empty:hidden">{post.description}</p>
        {post.tags.length > 0 && (
          <p className="flex flex-wrap gap-1.5 pt-1">
            {post.tags.slice(0, 4).map((tag) => (
              <span key={tag.slug} className="rounded-md border border-fd-border bg-fd-secondary/60 px-1.5 py-0.5 font-mono text-[10.5px] text-fd-muted-foreground">
                {tag.name}
              </span>
            ))}
          </p>
        )}
        <CardMeta post={post} className="mt-auto pt-4" />
      </div>
    </Link>
  );
}

function CardCover({ post, sizes, className }: { post: BlogPost; sizes: string; className?: string }) {
  if (post.image) {
    return (
      <Image
        src={post.image}
        alt=""
        width={1200}
        height={630}
        sizes={sizes}
        unoptimized={post.image.startsWith('http')}
        className={cn('aspect-video w-full object-cover', className)}
      />
    );
  }
  return (
    <div className={cn('flex aspect-video w-full items-center justify-center diagonal-stripes', className)}>
      <span className="rounded-md bg-fd-background/85 px-2 py-1 font-mono text-[11px] text-fd-muted-foreground">{post.slug}</span>
    </div>
  );
}

function CardMeta({ post, className }: { post: BlogPost; className?: string }) {
  return (
    <div className={cn('flex flex-row items-center gap-2 text-xs', className)}>
      {post.authors.map(
        (author) =>
          author.image && (
            <Image
              key={author.name}
              src={author.image}
              alt={author.name}
              title={author.name}
              width={24}
              height={24}
              className="size-6 rounded-full border-2 border-fd-card object-cover group-hover:border-fd-accent"
            />
          ),
      )}
      <span className="ms-auto flex items-center gap-1.5 font-mono text-[11px] text-fd-muted-foreground">
        {post.date && <BlogDate date={post.date} className="text-fd-primary" />}
        {post.minutes !== undefined && (
          <>
            <span aria-hidden className="text-fd-muted-foreground/40">·</span>
            <span>{post.minutes} min</span>
          </>
        )}
      </span>
    </div>
  );
}

export interface BlogPageProps extends ComponentProps<'article'> {
  /** shows a floating panel with the table of contents */
  toc?: TOCItemType[];
}

export function BlogPage({ toc, className, ...props }: BlogPageProps) {
  const article = (
    <article
      {...props}
      className={cn(
        'mx-auto flex w-full max-w-[900px] flex-col gap-6 px-4 py-8',
        // room for the panel
        toc && 'pb-24',
        className,
      )}
    />
  );
  if (!toc) return article;

  return (
    <TOCProvider toc={toc}>
      {article}
      <BlogPanel />
    </TOCProvider>
  );
}

/** the card on top of blog pages */
export function BlogHeader(props: ComponentProps<'div'>) {
  return (
    <div
      {...props}
      className={cn(
        'flex flex-col items-start gap-4 border-y bg-fd-card px-4 pt-3.5 pb-6 text-fd-card-foreground shadow-inner max-sm:-mx-4 sm:rounded-xl sm:border',
        props.className,
      )}
    />
  );
}

export function BlogBackLink({ children = 'Back to Blog', ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      className={cn(
        'inline-flex items-center gap-2 text-sm text-fd-muted-foreground transition-colors hover:text-fd-accent-foreground',
        props.className,
      )}
    >
      <CornerLeftUpIcon className="size-3.5" />
      {children}
    </Link>
  );
}

export function BlogTitle(props: ComponentProps<'h1'>) {
  return <h1 {...props} className={cn('text-2xl font-semibold', props.className)} />;
}

export function BlogDescription(props: ComponentProps<'p'>) {
  return <p {...props} className={cn('text-fd-muted-foreground empty:hidden', props.className)} />;
}

export function BlogAuthors({ authors, className, ...props }: ComponentProps<'div'> & { authors: BlogAuthor[] }) {
  return (
    <div {...props} className={cn('flex flex-row flex-wrap gap-x-6 gap-y-2', className)}>
      {authors.map((author) => {
        const content = (
          <>
            {author.image && (
              <Image src={author.image} alt="" width={28} height={28} className="size-7 rounded-full object-cover" />
            )}
            <span className="flex flex-col leading-tight">
              <span className="font-medium">{author.name}</span>
              {author.title && <span className="text-xs text-fd-muted-foreground">{author.title}</span>}
            </span>
          </>
        );

        return author.url ? (
          <a key={author.name} href={author.url} className="inline-flex items-center gap-2 text-sm transition-colors hover:text-fd-primary">
            {content}
          </a>
        ) : (
          <span key={author.name} className="inline-flex items-center gap-2 text-sm">
            {content}
          </span>
        );
      })}
    </div>
  );
}

export function BlogTags({ tags, className, ...props }: ComponentProps<'div'> & { tags: BlogTag[] }) {
  if (tags.length === 0) return null;

  return (
    <div {...props} className={cn('flex flex-row flex-wrap items-center gap-2', className)}>
      <TagIcon className="size-3.5 text-fd-muted-foreground" />
      {tags.map((tag) => (
        <Link
          key={tag.slug}
          href={tag.url}
          className="rounded-md border border-fd-border bg-fd-secondary/60 px-1.5 py-0.5 font-mono text-[11px] text-fd-muted-foreground transition-colors hover:border-fd-primary/40 hover:text-fd-foreground"
        >
          {tag.name}
        </Link>
      ))}
    </div>
  );
}

export function BlogDate({ date, ...props }: Omit<ComponentProps<'time'>, 'children'> & { date: Date | string }) {
  const value = new Date(date);
  return (
    <time dateTime={value.toISOString()} {...props}>
      {dateFormat.format(value)}
    </time>
  );
}

/** adds typography styles */
export function BlogBody(props: ComponentProps<'div'>) {
  return <div {...props} className={cn('prose min-w-0', props.className)} />;
}

/** links to the newer and older posts */
export function BlogPostNav({ newer, older, className, ...props }: ComponentProps<'nav'> & { newer?: BlogPost; older?: BlogPost }) {
  if (!newer && !older) return null;

  return (
    <nav {...props} className={cn('grid gap-2 sm:grid-cols-2', className)}>
      {newer && (
        <PostLink post={newer}>
          <ChevronLeftIcon className="size-3.5 rtl:rotate-180" />
          Newer post
        </PostLink>
      )}
      {older && (
        <PostLink post={older} className="sm:col-start-2 sm:items-end">
          Older post
          <ChevronRightIcon className="size-3.5 rtl:rotate-180" />
        </PostLink>
      )}
    </nav>
  );
}

function PostLink({ post, className, children }: { post: BlogPost; className?: string; children: ReactNode }) {
  return (
    <Link
      href={post.url}
      className={cn(
        'flex flex-col gap-1 rounded-xl border bg-fd-card p-4 text-fd-card-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground',
        className,
      )}
    >
      <span className="inline-flex items-center gap-1 text-xs text-fd-muted-foreground">{children}</span>
      <span className="font-medium">{post.title}</span>
    </Link>
  );
}

/** tags with their number of posts, see `getTags()` */
export function BlogTagCards({ tags, className, ...props }: ComponentProps<'div'> & { tags: (BlogTag & { count: number })[] }) {
  return (
    <div {...props} className={cn('grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4', className)}>
      {tags.map((tag) => (
        <Link
          key={tag.slug}
          href={tag.url}
          className="flex flex-row items-center gap-2 rounded-lg border bg-fd-card px-2 py-1 font-mono text-fd-card-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
        >
          <TagIcon className="size-3.5 shrink-0 text-fd-muted-foreground" />
          <span className="font-medium">{tag.name}</span>
          <span className="ms-auto text-sm text-fd-muted-foreground">{tag.count}</span>
        </Link>
      ))}
    </div>
  );
}
