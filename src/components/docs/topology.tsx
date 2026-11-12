'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { ArrowRight, Maximize2, Minimize2, ExternalLink, Waypoints } from 'lucide-react';
import { GitHubIcon } from '@/components/icons';
import { cn } from '@/lib/cn';
import Tooltip from '@/components/tooltip';
import { PixelText } from '@/components/covers';
import { MarrowMark } from '@/components/marrow-mark';

// One switch for the "Curious how this diagram was made?" Marrow note.
// false: only pages with `marrowNote: true` in frontmatter show it.
// true:  every Marrow diagram (under /projects/network-map/) shows it,
//        frontmatter topologies and inline <Topology /> alike.
// Opt out: `marrowNote: false` in frontmatter, or madeWithMarrow={false} inline.
const MARROW_NOTE_ON_ALL_DIAGRAMS = true;

// Interactive network topology embed. The diagrams are self-contained HTML
// files under /public/projects/network-map/, referenced by the `topology`
// frontmatter (or used inline via <Topology src="..." />).
export function Topology({
  src,
  title = 'Interactive Topology',
  height = 560,
  madeWithMarrow,
}: {
  src: string;
  title?: string;
  height?: number;
  /** Footer linking to Marrow. Unset: follows MARROW_NOTE_ON_ALL_DIAGRAMS. */
  madeWithMarrow?: boolean;
}) {
  const showMarrowNote =
    madeWithMarrow ?? (MARROW_NOTE_ON_ALL_DIAGRAMS && src.startsWith('/projects/network-map/'));
  const [fullscreen, setFullscreen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const { resolvedTheme } = useTheme();

  // The iframe can finish loading before React hydrates and attaches onLoad, in
  // which case that event is lost and the overlay would hang forever. Catch the
  // already-loaded case on mount. (Same-origin, so contentDocument is readable;
  // the about:blank guard avoids matching the placeholder document.)
  useEffect(() => {
    const doc = frameRef.current?.contentDocument;
    if (doc && doc.readyState === 'complete' && doc.location.href !== 'about:blank') {
      setLoaded(true);
    }
  }, []);

  // The diagrams are built with `theme: auto`, so standalone they follow the
  // viewer's OS. Embedded, they should follow *this site's* toggle instead —
  // Marrow accepts a `marrow:theme` postMessage that overrides the baked theme.
  const sendTheme = useCallback(() => {
    if (!resolvedTheme) return;
    frameRef.current?.contentWindow?.postMessage(
      { type: 'marrow:theme', theme: resolvedTheme === 'dark' ? 'dark' : 'light' },
      window.location.origin,
    );
  }, [resolvedTheme]);

  // The diagram announces itself when its runtime is ready; answer that ping,
  // and re-send whenever our theme changes afterwards.
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.source === frameRef.current?.contentWindow && e.data?.type === 'marrow:ready') {
        sendTheme();
      }
    };
    window.addEventListener('message', onMessage);
    sendTheme();
    return () => window.removeEventListener('message', onMessage);
  }, [sendTheme]);

  // Ensure the embedded iframe opens in Marrow's minimal embedded mode.
  // Appending #embed=true activates data-chrome="minimal", stripping the redundant
  // top command bar, breadcrumbs, dock, and minimap, resulting in a cleaner,
  // distraction-free canvas inside documentation cards.
  const embedSrc = src.includes('#')
    ? (src.includes('embed=') ? src : `${src};embed=true`)
    : `${src}#embed=true`;

  return (
    <figure
      className={cn(
        'not-prose my-6 flex flex-col overflow-hidden rounded-xl border border-fd-border bg-fd-card shadow-sm',
        fullscreen && 'fixed inset-3 z-50 my-0 shadow-2xl',
      )}
    >
      {/* header bar */}
      <div className="flex items-center gap-2 border-b border-fd-border bg-fd-muted/40 px-3 py-2">
        <Waypoints className="size-4 shrink-0 text-fd-primary" />
        <span className="truncate text-sm font-medium text-fd-foreground">{title}</span>
        <span className="ml-1 rounded-full border border-fd-border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-fd-muted-foreground">
          Interactive
        </span>
        <div className="ml-auto flex items-center gap-1">
          <Tooltip label={fullscreen ? 'Exit fullscreen' : 'Fullscreen'} side="bottom" align="end">
            <button
              type="button"
              onClick={() => setFullscreen((v) => !v)}
              aria-label={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
              className="inline-flex size-7 items-center justify-center rounded-md text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
            >
              {fullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
            </button>
          </Tooltip>
          <Tooltip label="Open in a new tab" side="bottom" align="end">
            <a
              href={src}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Open topology in a new tab"
              className="inline-flex size-7 items-center justify-center rounded-md text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
            >
              <ExternalLink className="size-4" />
            </a>
          </Tooltip>
        </div>
      </div>

      {/* diagram */}
      <div className="relative flex-1 bg-fd-background">
        {!loaded && (
          // pointer-events-none: never let the placeholder swallow pans/clicks
          // meant for the diagram underneath it.
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-fd-muted-foreground">
            Loading topology…
          </div>
        )}
        <iframe
          ref={frameRef}
          src={embedSrc}
          title={title}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className="block w-full border-0"
          style={{ height: fullscreen ? '100%' : height }}
        />
      </div>

      {showMarrowNote && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-fd-border bg-fd-muted/40 px-3 py-2 text-xs text-fd-muted-foreground">
          <MarrowMark className="h-[18px] w-auto shrink-0" />
          <PixelText text="Marrow" color="currentColor" aria-hidden className="h-[14px] w-auto shrink-0 text-fd-foreground" />
          <span>Curious how this diagram was made?</span>
          <a
            href="https://github.com/raiz-toff/Marrow"
            target="_blank"
            rel="noreferrer noopener"
            className="group inline-flex items-center gap-1.5 font-medium text-fd-foreground underline-offset-4 hover:underline"
          >
            <GitHubIcon className="size-3.5" aria-hidden />
            It&apos;s compiled from YAML with Marrow
            <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      )}
    </figure>
  );
}
