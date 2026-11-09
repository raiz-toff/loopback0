import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName, gitConfig } from './shared';
import Link from 'next/link';
import { getNavGroups } from './nav-data';

export function baseOptions(): BaseLayoutProps {
  const groups = getNavGroups();
  return {
    links: [
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
      title: null, // Disable default wrapped title
      children: (
        <div className="flex items-center mr-auto font-medium bg-fd-secondary/40 border border-fd-border rounded-full px-2.5 py-1.5 shadow-sm">
          <Link 
            href="/" 
            title="Go to Portfolio Home"
            className="flex items-center hover:opacity-70 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-primary rounded-full pr-2" 
            aria-label="Home"
          >
            <span
              aria-hidden="true"
              className="size-[22px] shrink-0"
              style={{
                backgroundColor: 'var(--color-fd-primary)',
                WebkitMaskImage: 'url(/logo.svg)',
                maskImage: 'url(/logo.svg)',
                WebkitMaskSize: 'contain',
                maskSize: 'contain',
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
                maskPosition: 'center',
                transition: 'background-color 0.3s ease',
              }}
            />
          </Link>
          
          <div className="w-[1px] h-4 bg-fd-border/80" />

          <Link 
            href="/docs" 
            title="Go to Docs Overview"
            className="font-semibold tracking-tight text-sm hover:text-fd-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-primary rounded-full pl-2 pr-1"
          >
            {appName}
          </Link>
        </div>
      ),
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
