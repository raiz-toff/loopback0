/**
 * Related pages for the end of a post or lab: rank every other page by the
 * words it shares with the target (title, description, tags; rarer words
 * count more), plus a bonus for pages in the same lab or project folder.
 */

/** A page that can be suggested. */
export interface RelatedCandidate {
  /** Site path, e.g. `/blog/marrow` or `/docs/labs/vlan-labs/vlan-trunk`. */
  url: string;
  title: string;
  description?: string;
  tags?: string[];
  /** Kind shown to the reader. */
  kind: 'Post' | 'Lab' | 'CCNA lab' | 'Project';
  /** Folder the page lives in (e.g. `/docs/labs/vlan-labs`); siblings get a bonus. */
  group?: string;
}

const STOP = new Set(
  ('a an and are as at be by for from how i in into is it its my of on or the this to with why what your you ' +
    'using use set setup up lab labs guide part step steps one two new over via vs not no can will was were ' +
    // activity words: they say what the author did, not what the page is about
    'built build building start started starting fix fixing fixed troubleshoot troubleshooting configure ' +
    'configuring install installing setting run running make making working get getting story')
    .split(' '),
);

/** Lowercased content words of a page; tags count three times. */
function terms(c: RelatedCandidate): string[] {
  const words = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9.+-]+/g, ' ')
      .split(' ')
      .map((w) => w.replace(/^[.+-]+|[.+-]+$/g, ''))
      .filter((w) => w.length > 2 && !STOP.has(w));
  const tagWords = (c.tags ?? []).flatMap((t) => words(t));
  return [...words(c.title), ...words(c.description ?? ''), ...tagWords, ...tagWords, ...tagWords];
}

/**
 * Picks the most related pages for `target`.
 *
 * @param target - The page being read.
 * @param candidates - Every published page (the target may be included; it is skipped).
 * @param limit - Maximum results.
 * @returns Up to `limit` candidates with a positive score, best first; ties keep input order.
 */
export function relatedPages(target: RelatedCandidate, candidates: RelatedCandidate[], limit = 3): RelatedCandidate[] {
  const pool = candidates.filter((c) => c.url !== target.url);
  const bags = new Map(pool.map((c) => [c.url, new Set(terms(c))]));
  // inverse document frequency over the pool: a word on every page is worth little
  const df = new Map<string, number>();
  for (const bag of bags.values()) for (const w of bag) df.set(w, (df.get(w) ?? 0) + 1);
  const idf = (w: string) => Math.log(1 + pool.length / (df.get(w) ?? pool.length));

  const mine = terms(target);
  const weight = new Map<string, number>();
  for (const w of mine) weight.set(w, (weight.get(w) ?? 0) + 1);

  return pool
    .map((c, i) => {
      const bag = bags.get(c.url)!;
      let score = 0;
      for (const [w, n] of weight) if (bag.has(w)) score += Math.min(n, 3) * idf(w);
      if (target.group && c.group === target.group) score += 2;
      return { c, i, score };
    })
    .filter((r) => r.score > 0.5)
    .sort((a, b) => b.score - a.score || a.i - b.i)
    .slice(0, limit)
    .map((r) => r.c);
}

/**
 * Whether a page's last-modified date is a real edit worth showing as "Updated".
 * The public repo's history starts on `historyStart`, so every older page's git
 * date is that import, not an edit.
 *
 * @param published - Frontmatter date.
 * @param modified - Last git commit touching the page.
 * @param historyStart - Date of the first commit in the public history.
 * @returns True when the edit is after the history start and at least 7 days after publishing.
 */
export function isRealUpdate(published: Date | undefined, modified: Date | undefined, historyStart: Date): boolean {
  if (!modified) return false;
  const day = 24 * 60 * 60 * 1000;
  if (modified.getTime() <= historyStart.getTime() + day) return false;
  if (published && modified.getTime() - published.getTime() < 7 * day) return false;
  return true;
}
