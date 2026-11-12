import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

// Building blocks for overview pages (the main page of a section or project).
// AGENTS.md requires these pages to be designed components, not MDX prose:
// each page is one component assembled from the parts below.

/** One card in an overview grid. */
export interface OverviewItem {
  /** Small label above the headline: a project name or a category. */
  label: string;
  /** The line a visitor reads first. */
  headline: string;
  /** One supporting sentence. */
  detail?: string;
  /** Picture shown at the top of the card, at 1200:630. */
  visual: ReactNode;
  /** Destination of the whole card. Omit when the card carries `links` instead. */
  href?: string;
  /** Several destinations, shown as a row at the foot of the card. */
  links?: { label: string; href: string }[];
  /** Short status tag beside the label, such as "Retired" or "In progress". */
  tag?: string;
  /** Tones the label down, for items that are no longer active. */
  muted?: boolean;
}

/**
 * A picture cropped to the card ratio.
 *
 * @param src - Root-absolute image path.
 * @param alt - Text alternative.
 * @param muted - Tones the image down, for retired items.
 * @returns The image at 1200:630, covering its box.
 */
export function OverviewPicture({ src, alt, muted }: { src: string; alt: string; muted?: boolean }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={1200}
      height={630}
      sizes="(min-width: 640px) 380px, 100vw"
      unoptimized={src.endsWith('.svg')}
      className={`aspect-[1200/630] w-full bg-white object-cover ${muted ? 'opacity-80 grayscale-[35%]' : ''}`}
    />
  );
}

/** Section heading inside an overview page. */
export function OverviewHeading({ children }: { children: ReactNode }) {
  return <h2 className="mt-10 mb-0 text-xl font-semibold tracking-tight text-fd-foreground">{children}</h2>;
}

function CardBody({ item }: { item: OverviewItem }) {
  return (
    <>
      <div className="border-b border-fd-border">{item.visual}</div>
      <div className="flex flex-1 flex-col p-5">
        <div className={`flex items-center gap-2 text-xs font-semibold ${item.muted ? 'text-fd-muted-foreground' : 'text-fd-primary'}`}>
          {item.label}
          {item.tag ? (
            <span
              className={`rounded-full border px-2 py-0.5 font-medium ${
                item.muted ? 'border-fd-border text-fd-muted-foreground' : 'border-amber-500/50 text-amber-700 dark:text-amber-400'
              }`}
            >
              {item.tag}
            </span>
          ) : null}
        </div>
        <h3 className="mt-1.5 text-[1.05rem]/snug font-semibold tracking-tight text-balance text-fd-card-foreground">{item.headline}</h3>
        {item.detail ? <p className="mt-1.5 text-sm leading-relaxed text-fd-muted-foreground">{item.detail}</p> : null}
        {item.links ? (
          <p className="mt-auto flex flex-wrap gap-x-4 gap-y-1 border-t border-fd-border pt-3.5 text-sm [&:not(:first-child)]:mt-4">
            {item.links.map((l) => (
              <Link key={l.href} href={l.href} className="font-medium text-fd-primary underline-offset-4 hover:underline">
                {l.label}
              </Link>
            ))}
          </p>
        ) : null}
      </div>
    </>
  );
}

const CARD = 'flex h-full flex-col overflow-hidden rounded-[14px] border border-fd-border bg-fd-card no-underline';

/**
 * Grid of picture cards, two per row from tablet width up.
 *
 * @param items - The cards, in display order.
 * @returns The grid, isolated from prose styles.
 */
export function OverviewGrid({ items }: { items: OverviewItem[] }) {
  return (
    <ul className="not-prose mt-6 grid list-none gap-4 p-0 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item.headline}>
          {item.href ? (
            <Link href={item.href} className={`${CARD} transition-colors hover:bg-fd-accent`}>
              <CardBody item={item} />
            </Link>
          ) : (
            <div className={CARD}>
              <CardBody item={item} />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

/**
 * Short titled statements in a grid: features, platforms.
 *
 * @param items - Title and one or two sentences each.
 * @returns The grid, isolated from prose styles.
 */
export function OverviewPoints({ items }: { items: { title: string; text: string }[] }) {
  return (
    <ul className="not-prose mt-4 grid list-none gap-3 p-0 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item.title} className="rounded-xl border border-fd-border bg-fd-card p-4">
          <p className="text-sm font-semibold text-fd-card-foreground">{item.title}</p>
          <p className="mt-1 text-sm leading-relaxed text-fd-muted-foreground">{item.text}</p>
        </li>
      ))}
    </ul>
  );
}

/**
 * Label and value pairs, one per row.
 *
 * @param items - `value` may hold links.
 * @returns A definition list, isolated from prose styles.
 */
export function OverviewFacts({ items }: { items: { label: string; value: ReactNode }[] }) {
  return (
    <dl className="not-prose mt-4 overflow-hidden rounded-xl border border-fd-border bg-fd-card text-sm">
      {items.map((item) => (
        <div key={item.label} className="grid grid-cols-[7.5rem_1fr] gap-4 border-b border-fd-border px-4 py-2.5 last:border-b-0 sm:grid-cols-[10rem_1fr]">
          <dt className="text-fd-muted-foreground">{item.label}</dt>
          <dd className="text-fd-card-foreground [&_a]:font-medium [&_a]:text-fd-primary [&_a]:underline-offset-4 hover:[&_a]:underline">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * Links to the pages inside this project or section.
 *
 * @param items - Title, one-line description and destination of each page.
 * @returns The grid, isolated from prose styles.
 */
export function OverviewPages({ items }: { items: { title: string; description: string; href: string }[] }) {
  return (
    <ul className="not-prose mt-4 grid list-none gap-3 p-0 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item.href}>
          <Link href={item.href} className="group block h-full rounded-xl border border-fd-border bg-fd-card p-4 no-underline transition-colors hover:bg-fd-accent">
            <p className="flex items-center justify-between gap-2 text-sm font-semibold text-fd-card-foreground">
              {item.title}
              <span aria-hidden className="text-fd-primary transition-transform group-hover:translate-x-0.5">→</span>
            </p>
            <p className="mt-1 text-sm leading-relaxed text-fd-muted-foreground">{item.description}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/**
 * Opening of a project overview: identity, one paragraph, the picture, the actions, an optional status note.
 *
 * @param identity - Logo or wordmark.
 * @param lead - What the project is, in a few sentences.
 * @param visual - Picture of the real thing.
 * @param actions - Link buttons.
 * @param note - Status that a visitor must know before reading on.
 * @returns The hero block, isolated from prose styles.
 */
export function OverviewHero({ identity, lead, visual, actions, note }: { identity?: ReactNode; lead: ReactNode; visual?: ReactNode; actions?: ReactNode; note?: ReactNode }) {
  return (
    <div className="not-prose">
      {identity ? <div className="mb-4">{identity}</div> : null}
      <p className="text-[15px] leading-relaxed text-fd-foreground">{lead}</p>
      {visual ? <div className="mt-5 overflow-hidden rounded-xl border border-fd-border">{visual}</div> : null}
      {actions ? <div className="mt-5 flex flex-wrap gap-3">{actions}</div> : null}
      {note ? (
        <p className="mt-5 rounded-lg border border-fd-border border-l-[3px] border-l-amber-500 bg-fd-card px-4 py-3 text-sm leading-relaxed text-fd-muted-foreground [&_a]:font-medium [&_a]:text-fd-primary">
          {note}
        </p>
      ) : null}
    </div>
  );
}
