import type { BaseLayoutProps } from '@fumadocs/base-ui/layouts/shared';
import { appName, gitConfig } from './shared';
import { getNavGroups } from './nav-data';

export function baseOptions({ links = true }: { links?: boolean } = {}): BaseLayoutProps {
  const groups = getNavGroups();
  return {
    // The docs layout passes `links: false`: its sidebar switcher already covers
    // Labs / Blog / Projects, so the header keeps only GitHub and the theme toggle.
    links: !links ? [] : [
      ...groups.map((g) => ({
        type: 'menu' as const,
        text: g.label,
        url: g.href,
        items: g.items.map((i) => ({ text: i.title, description: i.description ?? i.meta, url: i.href })),
      })),
      { text: 'Gallery', url: '/gallery' },
      { text: 'Resume', url: '/resume' },
    ],
    nav: {
      // Plain fallback. The layouts swap in <NavPill /> (RN mark → home,
      // section name → /docs) on the client; see components/docs/nav-pill.tsx.
      url: '/',
      title: appName,
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
