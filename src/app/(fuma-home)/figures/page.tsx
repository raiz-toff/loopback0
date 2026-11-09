import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { NetFigure } from '@/components/figures/net-figure';
import {
  Cable,
  CliWindow,
  DeviceTile,
  PacketChip,
  Port,
  TablePanel,
} from '@/components/figures/parts';
import type { Conductor, DeviceKind } from '@/components/figures/types';
import { githubFileUrl } from '@/lib/shared';
import SiteFooter from '@/components/site-footer';

// Demo of the figure kit (src/components/figures). Not linked or indexed yet.
export const metadata: Metadata = {
  title: 'Figure kit',
  description: 'Animated, step-through network figures for labs and posts, built from data.',
  robots: { index: false },
};

const KINDS: DeviceKind[] = ['pc', 'switch', 'router', 'server', 'cloud'];
const CONDUCTORS: Conductor[] = ['orange', 'green', 'blue', 'brown'];

const SAMPLE = `// src/figures/dhcp-dora.ts
export const dhcpDora: Figure = {
  id: 'dhcp-dora',
  kicker: 'DHCP',
  title: 'DHCP hands a host its address in four messages.',
  size: [640, 200],
  devices: [
    { id: 'PC1', kind: 'pc', x: 90, y: 80, note: 'no IP' },
    { id: 'SW1', kind: 'switch', x: 320, y: 80 },
    { id: 'R1', kind: 'router', x: 550, y: 80, note: 'DHCP server' },
  ],
  links: [
    { a: 'PC1', b: 'SW1', aPort: 'eth0', bPort: 'g0/1', color: 'blue' },
    { a: 'SW1', b: 'R1', aPort: 'g0/2', bPort: 'g0/0', color: 'orange', striped: true },
  ],
  steps: [
    {
      caption: 'PC1 boots with no address, so it broadcasts a DISCOVER to the whole LAN.',
      packets: [{ path: ['PC1', 'SW1', 'R1'], label: 'DISCOVER', color: 'orange' }],
    },
    // …OFFER, REQUEST, ACK
  ],
};`;

function Section({ kicker, title, children }: { kicker: string; title: string; children: ReactNode }) {
  return (
    <section className="mt-16">
      <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{kicker}</div>
      <h2 className="mt-1.5 text-2xl font-semibold tracking-tight text-balance">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Swatch({ label, children, w = 150, h = 90 }: { label: string; children: ReactNode; w?: number; h?: number }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <svg viewBox={`0 0 ${w} ${h}`} className="block h-auto w-full" aria-hidden>
        {children}
      </svg>
      <div className="border-t border-border px-2.5 py-1.5 font-mono text-[10.5px] text-muted-foreground">{label}</div>
    </div>
  );
}

export default function FiguresPage() {
  return (
    <>
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-14 sm:px-6">
        <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          Figure kit · demo
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          Show the network doing it, not a screenshot of it.
        </h1>
        <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-muted-foreground text-pretty">
          Each figure proves one sentence. Packets travel the real cables, the console types the command that
          shows the result, and every step has a text version. A figure is a short data file, so a new one
          takes minutes, not a design session.
        </p>

        <Section kicker="01 · Live" title="Three figures, one kit.">
          <p className="mb-2 text-[14px] text-muted-foreground">
            They play once when they scroll into view. Use the arrows to step through at your own pace.
          </p>
          <NetFigure id="dhcp-dora" />
          <NetFigure id="mac-learning" />
          <NetFigure id="stp-loop" />
        </Section>

        <Section kicker="02 · Parts" title="Everything a figure is made of.">
          <h3 className="mb-2 font-mono text-[12px] text-muted-foreground">Devices</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {KINDS.map((k) => (
              <Swatch key={k} label={k} w={120} h={110}>
                <DeviceTile kind={k} x={60} y={40} label={k.toUpperCase()} note="note line" />
              </Swatch>
            ))}
          </div>

          <h3 className="mt-6 mb-2 font-mono text-[12px] text-muted-foreground">Cables: the four T568B pairs</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {CONDUCTORS.map((c) => (
              <Swatch key={c} label={`${c} · solid / striped`} w={150} h={70}>
                <Cable line={[[14, 24], [136, 24]]} color={c} />
                <Cable line={[[14, 48], [136, 48]]} color={c} striped />
              </Swatch>
            ))}
          </div>

          <h3 className="mt-6 mb-2 font-mono text-[12px] text-muted-foreground">Packets and port states</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Swatch label="packet" w={150} h={60}>
              <g transform="translate(75 34)">
                <PacketChip label="DISCOVER" color="orange" />
              </g>
            </Swatch>
            <Swatch label="packet with tag" w={150} h={60}>
              <g transform="translate(75 34)">
                <PacketChip label="ARP" tag="VLAN 10" color="blue" />
              </g>
            </Swatch>
            <Swatch label="dropped packet" w={150} h={60}>
              <g transform="translate(75 40)">
                <PacketChip label="BCAST" color="orange" />
                <g>
                  <circle r="9" cy="-17" fill="#D9711F" />
                  <path d="M-3.5 -20.5l7 7m0-7-7 7" stroke="#18181b" strokeWidth="1.8" strokeLinecap="round" />
                </g>
              </g>
            </Swatch>
            <Swatch label="forwarding · blocking · down" w={150} h={60}>
              <Cable line={[[10, 36], [140, 36]]} color="green" />
              <Port at={[30, 36]} dir={[1, 0]} name="g0/1" />
              <Port at={[75, 36]} dir={[1, 0]} name="g0/2" state="blocking" />
              <Port at={[120, 36]} dir={[1, 0]} name="g0/3" state="down" />
            </Swatch>
          </div>

          <h3 className="mt-6 mb-2 font-mono text-[12px] text-muted-foreground">Side panels</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <CliWindow
              cli={{ device: 'SW1', cmd: 'show vlan brief', out: ['VLAN Name     Status    Ports', '10   USERS    active    Gi0/1, Gi0/2', '20   SERVERS  active    Gi0/3'] }}
              animate={false}
            />
            <TablePanel
              table={{
                title: 'SW1 · mac address-table',
                cols: ['VLAN', 'MAC address', 'Port'],
                rows: [
                  ['10', '0050.79a6.000a', 'g0/1'],
                  ['10', '0050.79a6.000c', 'g0/3'],
                ],
                fresh: [1],
              }}
            />
          </div>
        </Section>

        <Section kicker="03 · Make your own" title="A figure is a data file, and a skill writes it with you.">
          <ol className="list-decimal space-y-2 pl-5 text-[15px] leading-relaxed">
            <li>
              <strong>Pick one mechanism and write its claim</strong> as one sentence: “STP blocks one port so a
              loop cannot melt the network.” If it needs two sentences, it is two figures.
            </li>
            <li>
              <strong>Place the devices</strong> on a 640-wide canvas and cable them. Cables route themselves at
              right angles.
            </li>
            <li>
              <strong>Write 3 to 6 steps.</strong> Each step is one caption, plus the packets that move, the
              command that proves it, or the table that changes.
            </li>
            <li>
              <strong>Register it</strong> in <code className="font-mono text-[13px]">src/figures/index.ts</code>,
              then drop it into any lab or post:{' '}
              <code className="font-mono text-[13px]">{'<NetFigure id="dhcp-dora" />'}</code>
            </li>
          </ol>

          <pre className="mt-6 overflow-x-auto rounded-xl border border-border bg-muted/40 p-4 font-mono text-[12px] leading-relaxed">
            {SAMPLE}
          </pre>

          <div className="mt-6 rounded-xl border border-border p-4">
            <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              Claude Code skill · net-figure
            </div>
            <p className="mt-2 text-[15px] leading-relaxed">
              Ask “make a figure that shows how ARP finds a MAC address” and the{' '}
              <code className="font-mono text-[13px]">net-figure</code> skill takes it from there. It picks the
              claim, lays out the devices, writes the steps in CCNA-accurate terms, registers the figure and
              checks it renders. The rules it follows (one mechanism, short captions, real IOS output, the T568B
              palette) live in the skill file.
            </p>
            <a
              href={githubFileUrl('.claude/skills/net-figure/SKILL.md')}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-3 inline-block font-mono text-[12px] underline underline-offset-4"
            >
              Read the skill →
            </a>
          </div>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
