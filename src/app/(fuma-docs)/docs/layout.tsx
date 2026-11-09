import type { ReactNode } from 'react';
import { source } from '@/lib/source';
// Spacious on desktop (inset page panel beside the sidebar), Flux on phones
// (minimal, bottom navigation panel). The viewport decides on the client and
// follows resizes; the user agent only seeds the first server render.
import { DocsLayoutSwitch, DocsVariantProvider } from '@/components/docs/docs-variant';
import { getDocsVariant } from '@/lib/docs-variant';
import { baseOptions } from '@/lib/layout.shared';
import { SectionTheme } from '@/components/docs/section-theme';
import { LabsBackground } from '@/components/docs/labs-background';

import { getSiteTabs } from '@/lib/site-tabs';

export default async function Layout({ children }: { children: ReactNode }) {
  const tree = source.getPageTree();
  const initialVariant = await getDocsVariant();

  const base = baseOptions({ links: false });

  return (
    <div className="contents" data-fd-zone>
      <LabsBackground />
      <DocsVariantProvider initial={initialVariant}>
        <DocsLayoutSwitch tree={tree} {...base} tabs={getSiteTabs()}>
          <SectionTheme />
          {children}
        </DocsLayoutSwitch>
      </DocsVariantProvider>
    </div>
  );
}
