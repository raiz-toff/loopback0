import { getLayoutTabs, type LayoutTab } from '@fumadocs/base-ui/layouts/shared';
import { Feather } from 'lucide-react';
import { source } from './source';

// Section switcher shown at the top of the sidebar in both the docs and the
// blog layouts: Labs, Projects, CCNA Labs from the docs tree, plus Blog.
// Colours follow the coloured section icons on the Fumadocs docs site.
const TAB_COLORS: Record<string, string> = {
  '/docs/labs': '#f59e0b', // amber / gold
  '/docs/projects': '#3b82f6', // blue
  '/docs/ccna-labs': '#06b6d4', // cyan
  '/blog': '#a855f7', // violet
};

function tinted(icon: React.ReactNode, color: string) {
  return (
    <div
      // The switcher gives icons a 36px box on phones but only 16px from md up.
      // On desktop the badge is a fixed 24px that overflows that box through
      // negative margins, so the glyph stays 16px instead of shrinking to a dot.
      className="size-full rounded-md border p-1 md:-m-1 md:size-6 md:p-[3px] [&_svg]:size-full"
      style={{ color, backgroundColor: `${color}1a`, borderColor: `${color}33` }}
    >
      {icon}
    </div>
  );
}

export function getSiteTabs(): LayoutTab[] {
  const docTabs = getLayoutTabs(source.getPageTree(), {
    transform(option) {
      if (option.unlisted) return null;
      const color = TAB_COLORS[option.url];
      return color ? { ...option, icon: tinted(option.icon, color) } : option;
    },
  });

  const blogTab: LayoutTab = {
    url: '/blog',
    title: 'Blog',
    description: 'Field notes and technical writeups',
    icon: tinted(<Feather />, TAB_COLORS['/blog']),
  };

  return [...docTabs, blogTab];
}
