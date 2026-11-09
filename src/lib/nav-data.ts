import { source } from './source';
import { blog } from './blog';
import { postDate } from './content-utils';
import { projects } from '@/data/profile';

// Server-only: builds the dropdown contents for the site header, the mobile
// bottom nav and the fumadocs top nav from the real content collections, so
// new labs, posts and projects show up in the menus without touching code.

export type NavLink = {
  title: string;
  href: string;
  description?: string;
  /** Short trailing label: a date, a stack, a count. */
  meta?: string;
};

export type NavGroup = {
  id: 'docs' | 'blog' | 'projects';
  label: string;
  href: string;
  items: NavLink[];
  /** Optional second column (desktop only). */
  aside?: { label: string; items: NavLink[] };
  footer?: NavLink;
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function shortDate(d: Date | null): string | undefined {
  return d ? `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}` : undefined;
}

type DocPage = ReturnType<typeof source.getPages>[number];

function isIndexPage(page: DocPage): boolean {
  const path = (page as unknown as { path?: string }).path ?? '';
  return /(^|\/)index\.mdx?$/.test(path);
}

export function getNavGroups(): NavGroup[] {
  // Docs: the three top-level sections, plus the most recently dated labs.
  const sections: NavLink[] = ['labs', 'ccna-labs', 'projects']
    .map((slug) => source.getPage([slug]))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .map((p) => ({ title: p.data.title, href: p.url, description: p.data.description }));

  const recentLabs: NavLink[] = source
    .getPages()
    .filter((p) => (p.slugs[0] === 'labs' || p.slugs[0] === 'ccna-labs') && !isIndexPage(p))
    .map((p) => ({ page: p, date: postDate(p.data.date) }))
    .filter((x): x is { page: DocPage; date: Date } => x.date !== null)
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 4)
    .map(({ page, date }) => ({ title: page.data.title, href: page.url, meta: shortDate(date) }));

  // Blog: latest five published posts.
  const posts: NavLink[] = blog
    .getPages()
    .map((p) => ({ page: p, date: postDate(p.data.date) }))
    .sort((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0))
    .slice(0, 5)
    .map(({ page, date }) => ({ title: page.data.title, href: page.url, meta: shortDate(date) }));

  // Projects: from the profile data, preferring the write-up over the repo.
  const projectLinks: NavLink[] = projects
    .map((p) => ({
      title: p.name,
      href: p.docs ?? p.source ?? '/docs/projects',
      description: p.description,
      meta: p.stack,
    }))
    .filter((p) => p.href);

  return [
    {
      id: 'docs',
      label: 'Docs',
      href: '/docs',
      items: sections,
      aside: recentLabs.length ? { label: 'Recent labs', items: recentLabs } : undefined,
      footer: { title: 'Browse all docs', href: '/docs' },
    },
    {
      id: 'blog',
      label: 'Blog',
      href: '/blog',
      items: posts,
      footer: { title: 'All posts', href: '/blog' },
    },
    {
      id: 'projects',
      label: 'Projects',
      href: '/docs/projects',
      items: projectLinks,
      footer: { title: 'All projects', href: '/docs/projects' },
    },
  ];
}
