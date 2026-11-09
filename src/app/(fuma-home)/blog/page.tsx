import Link from 'next/link';
import type { Metadata } from 'next';
import { TagIcon } from 'lucide-react';
import { getPostsWithMinutes, getTags } from '@/lib/blog-posts';
import { BlogCards, BlogFeaturedCard, BrandStripe } from '@/components/blog';
import SiteFooter from '@/components/site-footer';

// Blog index: the editorial header and mono meta line of the original page,
// the fumadocs.dev card grid (cover, description, author, date) with tags and
// reading time added, a featured slot for the newest post, and a tag strip
// that leads to the tag pages.

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Stories, field notes, and the occasional detour — the human side of the lab.',
};

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const updatedDate = (d: Date) => `${d.getDate()} ${MONTHS[d.getMonth()].toUpperCase()} ${d.getFullYear()}`;

const TAG_STRIP = 8;

function DottedLeader() {
  return <span aria-hidden className="mx-4 flex-1 self-center border-t border-dotted border-fd-border" />;
}

export default async function BlogIndexPage() {
  const posts = await getPostsWithMinutes();
  const [latest, ...rest] = posts;
  const tags = getTags(posts);
  const latestDate = posts.find((p) => p.date)?.date;

  return (
    <>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        {/* header card: brand stripe, eyebrow, title, meta line, tags entry point */}
        <header className="overflow-hidden rounded-xl border bg-fd-card text-fd-card-foreground shadow-sm">
          <BrandStripe />
          <div className="flex flex-col gap-3 px-5 pt-4 pb-5 sm:px-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-fd-muted-foreground">
              index <span className="mx-1 text-fd-muted-foreground/50">/</span> blog posts
            </p>
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
              <div>
                <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                  Blog<span className="text-fd-primary">.</span>
                </h1>
                <p className="mt-2 text-pretty text-[15px] text-fd-muted-foreground">
                  Stories, field notes, and the occasional detour.
                </p>
              </div>
              <Link
                href="/blog/tags"
                className="inline-flex items-center gap-2 rounded-lg border bg-fd-secondary/50 px-3 py-1.5 font-mono text-xs text-fd-foreground transition-colors hover:bg-fd-accent"
              >
                <TagIcon className="size-3.5" />
                All tags
              </Link>
            </div>
            <div className="flex font-mono text-[11px] uppercase tracking-[0.16em] text-fd-muted-foreground">
              <span>{posts.length} entries</span>
              <DottedLeader />
              {latestDate ? (
                <span>
                  updated {updatedDate(latestDate)}
                  <span className="mx-2 text-fd-muted-foreground/40">/</span>
                </span>
              ) : null}
              <a href="/rss.xml" className="transition-colors hover:text-fd-primary">
                rss
              </a>
            </div>
          </div>
        </header>

        {/* tag strip: most used first */}
        {tags.length > 0 && (
          <nav aria-label="Browse by tag" className="mt-4 flex flex-wrap items-center gap-1.5">
            {tags.slice(0, TAG_STRIP).map((tag) => (
              <Link
                key={tag.slug}
                href={tag.url}
                className="rounded-md border border-fd-border bg-fd-card px-2 py-1 font-mono text-[11px] text-fd-muted-foreground transition-colors hover:border-fd-primary/40 hover:text-fd-foreground"
              >
                {tag.name} <span className="text-fd-muted-foreground/50">{tag.count}</span>
              </Link>
            ))}
            {tags.length > TAG_STRIP && (
              <Link href="/blog/tags" className="px-1 font-mono text-[11px] text-fd-muted-foreground transition-colors hover:text-fd-primary">
                +{tags.length - TAG_STRIP} more
              </Link>
            )}
          </nav>
        )}

        {posts.length === 0 ? (
          <p className="mt-10 text-fd-muted-foreground">Nothing here yet — the first post is being written.</p>
        ) : (
          <>
            <div className="mt-6">
              <BlogFeaturedCard post={latest} />
            </div>
            {rest.length > 0 && (
              <>
                <div className="mt-8 flex font-mono text-[11px] uppercase tracking-[0.16em] text-fd-muted-foreground">
                  <span>earlier</span>
                  <DottedLeader />
                  <span>{rest.length} posts</span>
                </div>
                <BlogCards posts={rest} className="mt-4 gap-3 sm:grid-cols-2 lg:grid-cols-3" />
              </>
            )}
          </>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
