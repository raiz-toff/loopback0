import { AnnotatedCover, NameplateCover } from '@/components/covers';
import { OverviewGrid, OverviewPicture, type OverviewItem } from './overview-parts';

// Overview of /docs/projects: one card per project, each with a picture, what
// the project does for the reader, and one supporting sentence.

// Marrow's own compiled output, shrunk into a non-interactive thumbnail.
function MarrowThumb() {
  return (
    <div className="relative aspect-[1200/630] w-full overflow-hidden bg-fd-background">
      <iframe
        src="/projects/network-map/my-homelab.html"
        title="Marrow diagram preview"
        loading="lazy"
        tabIndex={-1}
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 h-[250%] w-[250%] origin-top-left scale-[0.4] border-0"
      />
    </div>
  );
}

const PROJECTS: OverviewItem[] = [
  {
    label: 'Marrow',
    href: '/docs/projects/marrow',
    headline: 'Write YAML, get an interactive network diagram.',
    detail: 'No dragging boxes. The compiler places every device and routes every link, and the output is one offline HTML file.',
    visual: <MarrowThumb />,
  },
  {
    label: 'MileWage',
    href: '/docs/projects/milewage',
    headline: 'A mileage tracker that keeps your location on your own server.',
    detail: 'An Android app records the shift. A box you own stores the miles and the money, reached over Tailscale.',
    visual: <OverviewPicture src="/blog/covers/milewage.png" alt="A phone sends shift data over a private Tailscale link to a server at home" />,
  },
  {
    label: 'tunit',
    tag: 'In progress',
    href: '/docs/projects/tunit',
    headline: 'One binary that runs a full hardware QC on the repair bench.',
    detail: 'Serial, CPU, RAM, battery and S.M.A.R.T. checks, a thermal stress test and network checks. Nothing to install first.',
    visual: <NameplateCover name="tunit" label="hardware QC tool" />,
  },
  {
    label: 'Comma',
    tag: 'Retired',
    muted: true,
    href: '/docs/projects/comma',
    headline: 'An offline earnings tracker for gig workers.',
    detail: 'A PWA and an Android app. The repository is archived, and MileWage replaces it.',
    visual: (
      <AnnotatedCover
        src="/img/comma/dashboard.jpg"
        alt="Comma dashboard on a phone"
        headline="Comma tracks what a shift really paid"
        note="this week's net, the first thing on screen"
      />
    ),
  },
];

/** Overview page body for the Projects section. Registered as an MDX component. */
export function ProjectGrid() {
  return <OverviewGrid items={PROJECTS} />;
}
