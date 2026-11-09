import Image from "next/image";
import Link from "next/link";
import { blog, postDate } from "@/lib/blog";
import { Panel, PanelHeader, PanelTitle, PanelTitleSup, Separator } from "./panel";
import { ArrowUpRightIcon } from "./icons";

// Blog posts flagged `featured: true` in frontmatter, surfaced on the homepage.
// This is the ONLY place that reads the `featured` field — flip it in a post's
// frontmatter and the post appears/disappears here, no hand-maintained list.
// Cards mirror the Lab Log grid so the two content panels read as one system.

const MONTHS = [
  "jan", "feb", "mar", "apr", "may", "jun",
  "jul", "aug", "sep", "oct", "nov", "dec",
];

// Lowercase "jul 2026" stamp, matching the Lab Log date style.
function stamp(date: Date | null): string {
  return date ? `${MONTHS[date.getMonth()]} ${date.getFullYear()}` : "undated";
}

type FeaturedPost = {
  url: string;
  slug: string;
  title: string;
  blurb: string;
  cover: string | null;
  date: Date | null;
  featured?: boolean;
};

export default function FeaturedPosts() {
  const posts: FeaturedPost[] = blog
    .getPages()
    .map((page) => {
      const slug = page.slugs[page.slugs.length - 1] ?? "";
      const cover = (page.data as { cover?: string | null }).cover;
      const featured = (page.data as { featured?: boolean | null }).featured === true;
      return {
        url: page.url,
        slug,
        title: page.data.title ?? slug,
        blurb: (page.data as { description?: string | null }).description ?? "",
        // only root-absolute covers are servable straight from a static route
        cover: cover && cover.startsWith("/") ? cover : null,
        date: postDate(page.data.date),
        featured,
      };
    })
    // Sort: featured first, then newest first
    .sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0);
    })
    .slice(0, 4);

  // Nothing featured → render nothing (no empty panel, no orphan divider).
  if (posts.length === 0) return null;

  return (
    <>
      <Panel id="blog" className="bg-tech-pattern">
        <PanelHeader>
          <PanelTitle>
            Featured Writing
            <PanelTitleSup>({posts.length})</PanelTitleSup>
          </PanelTitle>
        </PanelHeader>

        <ul className="grid sm:grid-cols-2">
          {posts.map((post, i) => (
            <li
              key={post.url}
              className={[
                // hairline grid: every cell but the last row gets a bottom rule;
                // on two columns, left cells get a right rule
                i < posts.length - 1 ? "border-b border-line" : "",
                i < posts.length - 2 ? "sm:border-b" : "sm:border-b-0",
                i % 2 === 0 ? "sm:border-r sm:border-line" : "",
                i >= posts.length - 2 ? "sm:!border-b-0" : "",
              ].join(" ")}
            >
              <Link href={post.url} className="group block p-4">
                <div className="overflow-hidden rounded-md border border-line">
                  {post.cover ? (
                    <Image
                      src={post.cover}
                      alt=""
                      width={880}
                      height={495}
                      sizes="(min-width: 768px) 352px, (min-width: 640px) 50vw, 100vw"
                      className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  ) : (
                    // cover-less posts get the site's diagonal-stripe filler
                    <div className="flex aspect-video w-full items-center justify-center diagonal-stripes">
                      <span className="rounded-md bg-background/85 px-2 py-1 font-mono text-[11px] text-muted-foreground">
                        {post.slug}
                      </span>
                    </div>
                  )}
                </div>

                <p className="mt-3 font-mono text-xs text-muted-foreground/70">
                  {stamp(post.date)}
                </p>

                <h3 className="mt-1 flex items-baseline gap-1.5 text-base font-medium">
                  <span className="decoration-current/30 underline-offset-3 transition-colors group-hover:underline">
                    {post.title}
                  </span>
                  <ArrowUpRightIcon className="size-3.5 shrink-0 self-center text-muted-foreground/50 transition-colors group-hover:text-foreground" />
                </h3>

                <p className="mt-1 text-pretty text-sm leading-relaxed text-muted-foreground">
                  {post.blurb}
                </p>
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/blog"
          className="screen-line-top diagonal-stripes group flex w-full items-center justify-center py-3.5 transition-all duration-200 hover:brightness-125"
        >
          <span className="flex items-center gap-2 rounded-md border border-line bg-background/90 px-3 py-1.5 font-mono text-xs text-muted-foreground shadow-xs backdrop-blur-xs transition-all duration-200 group-hover:border-border group-hover:bg-background group-hover:text-foreground group-hover:shadow-sm">
            <span>all posts</span>
            <span className="text-muted-foreground/40 transition-transform group-hover:translate-x-0.5">→</span>
            <span className="font-semibold text-foreground">/blog</span>
          </span>
        </Link>
      </Panel>

      <Separator />
    </>
  );
}
