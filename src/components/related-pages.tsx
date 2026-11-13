import Link from 'next/link';
import { cn } from '@/lib/cn';
import type { RelatedCandidate } from '@/lib/related';

/**
 * "Related" list for the end of a post or lab: up to three rows, each with
 * its kind, title and one line of description.
 *
 * @param items - Output of `relatedPages`. Renders nothing when empty.
 */
export function RelatedPages({ items, className }: { items: RelatedCandidate[]; className?: string }) {
  if (items.length === 0) return null;
  return (
    <nav aria-labelledby="related-heading" className={cn('not-prose flex flex-col gap-3', className)}>
      <h2 id="related-heading" className="font-mono text-[11px] uppercase tracking-[0.14em] text-fd-muted-foreground">
        Related
      </h2>
      <ul className="flex flex-col divide-y divide-fd-border overflow-hidden rounded-xl border border-fd-border">
        {items.map((item) => (
          <li key={item.url}>
            <Link href={item.url} className="flex flex-col gap-0.5 px-4 py-3 transition-colors hover:bg-fd-accent">
              <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-fd-muted-foreground">{item.kind}</span>
              <span className="font-medium text-fd-foreground">{item.title}</span>
              {item.description ? <span className="line-clamp-1 text-sm text-fd-muted-foreground">{item.description}</span> : null}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
