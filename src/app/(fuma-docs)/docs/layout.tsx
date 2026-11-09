import type { ReactNode } from 'react';
import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { SectionTheme } from '@/components/docs/section-theme';
import { LabsBackground } from '@/components/docs/labs-background';

import { getLayoutTabs, type LayoutTab } from 'fumadocs-ui/layouts/shared';
import { Feather } from 'lucide-react';

// Per-section accent colours for the sidebar switcher (Labs, Projects, CCNA Labs, Blog),
// like the coloured section icons on the Fumadocs docs site.
const TAB_COLORS: Record<string, string> = {
  '/docs/labs': '#f59e0b', // amber / gold
  '/docs/projects': '#3b82f6', // blue
  '/docs/ccna-labs': '#06b6d4', // cyan
  '/blog': '#a855f7', // violet
};

export default function Layout({ children }: { children: ReactNode }) {
  const tree = source.getPageTree();

  const docTabs = getLayoutTabs(tree, {
    transform(option) {
      if (option.unlisted) return null;
      const color = TAB_COLORS[option.url];
      if (!color) return option;
      return {
        ...option,
        icon: (
          <div
            className="size-full rounded-md border p-1 [&_svg]:size-full"
            style={{
              color,
              backgroundColor: `${color}1a`,
              borderColor: `${color}33`,
            }}
          >
            {option.icon}
          </div>
        ),
      };
    },
  });

  const blogTab: LayoutTab = {
    url: '/blog',
    title: 'Blog',
    description: 'Field notes and technical writeups',
    icon: (
      <div
        className="size-full rounded-md border p-1 [&_svg]:size-full"
        style={{
          color: '#a855f7',
          backgroundColor: '#a855f71a',
          borderColor: '#a855f733',
        }}
      >
        <Feather />
      </div>
    ),
  };

  return (
    <div className="contents" data-fd-zone>
      <LabsBackground />
      <DocsLayout
        tree={tree}
        {...baseOptions()}
        tabs={[...docTabs, blogTab]}
      >
        <SectionTheme />
        {children}
      </DocsLayout>
    </div>
  );
}
