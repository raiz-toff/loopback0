import defaultMdxComponents from 'fumadocs-ui/mdx';
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import type { MDXComponents } from 'mdx/types';
import type React from 'react';
import {
  StarlightCard,
  StarlightLinkCard,
  StarlightCardGrid,
  StarlightLinkButton,
  StarlightSteps,
} from './starlight-compat';
import { Mermaid } from './mermaid';
import { Topology } from './topology';
import { CcnaBlueprint, ModuleBlueprint } from './ccna-blueprint';
import { CcnaTopology } from './ccna-topology';
import { DeviceLink } from './device-link';
import { CableBadge } from './cable-badge';
import { MdxCodeBlock } from './mdx-code-block';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    // Every content image opens in the Lightbox viewer (fumadocs-ui 16.18).
    img: (props) => <ImageZoom {...(props as React.ComponentProps<typeof ImageZoom>)} />,
    // Fenced code: shadcn-style block with title, wrap, download and copy.
    pre: MdxCodeBlock,
    // Starlight compatibility: content authored for the old site keeps working.
    Card: StarlightCard,
    LinkCard: StarlightLinkCard,
    CardGrid: StarlightCardGrid,
    LinkButton: StarlightLinkButton,
    Steps: StarlightSteps,
    Mermaid,
    Topology,
    CcnaBlueprint,
    ModuleBlueprint,
    CcnaTopology,
    DeviceLink,
    CableBadge,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
