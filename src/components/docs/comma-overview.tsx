/* eslint-disable @next/next/no-img-element */
import Image from 'next/image';
import Link from 'next/link';
import { OverviewFacts, OverviewHeading, OverviewHero, OverviewPages, OverviewPoints } from './overview-parts';
import { StarlightLinkButton as LinkButton } from './starlight-compat';

// Overview of /docs/projects/comma (retired).

const SHOTS = [
  { src: '/img/comma/dashboard.jpg', alt: 'Comma dashboard with weekly net earnings, shift time, distance and hourly rate' },
  { src: '/img/comma/shift-details.jpg', alt: 'Comma shift details with a GPS route map, duration, hourly rate and distance' },
  { src: '/img/comma/analytics.jpg', alt: 'Comma analytics cards for gross earnings, net take-home, average rate and tax set-aside' },
];

const FEATURES = [
  { title: 'Tracks shifts', text: 'A native foreground service records the route while a shift runs on the phone.' },
  { title: 'Splits the distance', text: 'A Got First Order tap separates dead distance from active distance.' },
  { title: 'Logs expenses', text: 'Deductible items are flagged and totalled.' },
  { title: 'Estimates tax', text: 'Set-asides follow country rules for Canada, the United States, the United Kingdom and Nepal.' },
  { title: 'Syncs without a server', text: "An optional encrypted sync uses the driver's own Google Drive." },
];

const FACTS = [
  { label: 'Final release', value: '1.5.0, 2026-07-17' },
  { label: 'First web release', value: '1.1.0, 2026-05-15' },
  { label: 'Retired', value: '2026-11-11' },
  { label: 'Licence', value: 'MIT' },
  { label: 'Phone app', value: 'Expo SDK 56, React Native, TypeScript, SQLite with Drizzle ORM' },
  { label: 'Web app', value: 'Vanilla JavaScript PWA, IndexedDB with Dexie' },
  {
    label: 'Sync',
    value: (
      <>
        Google Drive <code>appDataFolder</code>, AES-256-GCM
      </>
    ),
  },
  { label: 'Successor', value: <Link href="/docs/projects/milewage">MileWage</Link> },
];

const BRANCHES = [
  { label: 'main', value: 'The full Comma: the React Native Android app, the web app and the documentation site. Released as 1.5.0.' },
  { label: 'feat/android-only', value: 'A smaller Android-only app without the web app, the documentation site or gamification. Never released.' },
  { label: 'native-android', value: 'Comma Simple, a Kotlin and Jetpack Compose rewrite with shifts, expenses, reports and Google Drive backup.' },
];

const PAGES = [
  { title: 'Architecture', description: 'Two apps, one data model, and the registries for countries and platforms.', href: '/docs/projects/comma/architecture' },
  { title: 'GPS tracking', description: 'The browser tracker, the native tracker, and how both differ from MileWage.', href: '/docs/projects/comma/gps-tracking' },
  { title: 'Sync engine', description: 'Serverless sync over Google Drive, the interop defects it produced, and the audit that followed.', href: '/docs/projects/comma/sync-engine' },
  { title: 'Decision: retirement of Comma', description: 'Why development stopped and what replaced it.', href: '/docs/projects/comma/decisions/retire-comma' },
];

/** Overview page body for the retired Comma project. Registered as an MDX component. */
export function CommaOverview() {
  return (
    <>
      <OverviewHero
        identity={
          <div className="flex items-center gap-4">
            <img src="/img/comma/logo.png" alt="Comma logo" className="size-[72px] rounded-2xl" />
            <span className="text-[1.75rem] font-bold tracking-tight text-fd-foreground">Comma</span>
          </div>
        }
        note={
          <>
            <strong className="text-fd-foreground">Note:</strong> Comma is retired. The repository was archived on 2026-11-11 and receives no updates. <Link href="/docs/projects/milewage">MileWage</Link> replaces it. MileWage does not import Comma data.
          </>
        }
        lead={
          <>
            <strong>Comma</strong> is a local-first earnings tracker for gig workers who deliver for DoorDash, Uber Eats, SkipTheDishes, Instacart and Amazon Flex. It records shifts with GPS, splits active and dead distance, logs expenses and estimates tax set-asides. It has no account and no server.
          </>
        }
        actions={
          <>
            <LinkButton href="https://github.com/raiz-toff/Comma" icon="github">Archived Repository</LinkButton>
            <LinkButton href="https://comma-docs.vercel.app/" variant="secondary" icon="external">Original Documentation</LinkButton>
            <LinkButton href="/blog/comma" variant="secondary" icon="right-arrow">Read the Launch Post</LinkButton>
          </>
        }
      />
      <div className="not-prose">
        <ul className="mt-6 grid list-none grid-cols-3 gap-3 p-0">
          {SHOTS.map((s) => (
            <li key={s.src} className="overflow-hidden rounded-xl border border-fd-border">
              <Image src={s.src} alt={s.alt} width={480} height={1000} sizes="(min-width: 640px) 240px, 33vw" className="aspect-[9/16] w-full object-cover object-top" />
            </li>
          ))}
        </ul>
        <OverviewHeading>What it does</OverviewHeading>
        <OverviewPoints items={FEATURES} />
        <OverviewHeading>Facts</OverviewHeading>
        <OverviewFacts items={FACTS} />
        <OverviewHeading>Final state of the repository</OverviewHeading>
        <p className="mt-3 text-sm text-fd-muted-foreground">Comma ended in three forms, each on its own branch.</p>
        <OverviewFacts items={BRANCHES} />
        <OverviewHeading>In this section</OverviewHeading>
        <OverviewPages items={PAGES} />
      </div>
    </>
  );
}
