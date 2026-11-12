/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { OverviewFacts, OverviewHeading, OverviewHero, OverviewPages, OverviewPicture, OverviewPoints } from './overview-parts';
import { StarlightLinkButton as LinkButton } from './starlight-compat';

// Overview of /docs/projects/milewage.

const FEATURES = [
  { title: 'Records the shift', text: 'The Android app tracks GPS with the screen off and works offline for weeks. It needs nothing from Google.' },
  { title: 'Counts the miles', text: 'Shifts, trips and stops are derived from the GPS track, with active and deadhead miles as an estimate.' },
  { title: 'Keeps the money', text: 'Earnings, expenses with receipt photos, vehicles, odometer readings, parking and tolls.' },
  { title: 'Prepares tax records', text: 'Mileage deductions for Canada, the United States and Great Britain, or a rate you set, with a PDF report and CSV files.' },
  { title: 'Backs up the data', text: 'Nightly encrypted backups, with a recovery key that only the owner holds.' },
];

const FACTS = [
  { label: 'Version', value: '0.3.0, released 2026-11-11' },
  { label: 'Licence', value: 'AGPL-3.0' },
  { label: 'Server', value: 'Fastify and SQLite in Docker, behind Caddy' },
  { label: 'Web app', value: 'React, Material Design 3' },
  { label: 'Phone app', value: 'Kotlin, Jetpack Compose, Android 8.0 or later' },
  { label: 'Network', value: 'Tailscale, or plain HTTP on the home LAN' },
  { label: 'Tenancy', value: 'One driver per server' },
  {
    label: 'Predecessor',
    value: (
      <>
        <Link href="/docs/projects/comma">Comma</Link>, retired
      </>
    ),
  },
];

const PAGES = [
  { title: 'Install on a home server', description: 'Start the Docker stack, publish it on a tailnet and pair the phone.', href: '/docs/projects/milewage/install' },
  { title: 'Architecture', description: 'The server, the web app, the Android app and the engine they share.', href: '/docs/projects/milewage/architecture' },
  { title: 'Mileage engine', description: 'What the phone records, what is filtered out, and how two implementations agree.', href: '/docs/projects/milewage/mileage-engine' },
  { title: 'Brand', description: 'The Coin Road mark, the palette and the ten concepts that were not chosen.', href: '/docs/projects/milewage/brand' },
  { title: 'Decisions', description: 'Architecture decision records for the phone app, tracking and the distance gate.', href: '/docs/projects/milewage/decisions/native-android-app' },
];

/** Overview page body for the MileWage project. Registered as an MDX component. */
export function MileWageOverview() {
  return (
    <>
      <OverviewHero
        identity={
          <>
            <img className="h-16 w-auto dark:hidden" src="/img/milewage/lockup.svg" alt="MileWage" />
            <img className="hidden h-16 w-auto dark:block" src="/img/milewage/lockup-reverse.svg" alt="MileWage" />
          </>
        }
        lead={
          <>
            <strong>MileWage</strong> is a self-hosted mileage and earnings tracker for delivery and ride-hail drivers. A native Android app records the shift. A server on a machine you own stores the miles and the money. The phone reaches the server over Tailscale, and no location history is stored on a third-party service.
          </>
        }
        visual={<OverviewPicture src="/blog/covers/milewage.png" alt="A phone sends shift data over a private Tailscale link to a server at home" />}
        actions={
          <>
            <LinkButton href="https://github.com/raiz-toff/Milewage" icon="github">Source Repository</LinkButton>
            <LinkButton href="https://github.com/raiz-toff/Milewage/releases/latest" variant="secondary" icon="external">Latest Release</LinkButton>
            <LinkButton href="/blog/milewage" variant="secondary" icon="right-arrow">Read the Build Post</LinkButton>
          </>
        }
        note={
          <>
            <strong className="text-fd-foreground">Note:</strong> Version 0.3.0 is a complete build that has not had a field test. No real shift has been recorded on the road, and the Android app has not run on a real phone. The open items are in the repository&apos;s <code>CHANGELOG.md</code> and <code>TODO.md</code>.
          </>
        }
      />
      <div className="not-prose">
        <OverviewHeading>What it does</OverviewHeading>
        <OverviewPoints items={FEATURES} />
        <OverviewHeading>Facts</OverviewHeading>
        <OverviewFacts items={FACTS} />
        <OverviewHeading>In this section</OverviewHeading>
        <OverviewPages items={PAGES} />
      </div>
    </>
  );
}
