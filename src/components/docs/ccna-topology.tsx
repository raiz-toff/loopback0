'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Layers,
  Network,
  Route,
  Server,
  ShieldCheck,
  Terminal,
  ArrowUpRight,
} from 'lucide-react';

export type CcnaModule = {
  id: string;
  iface: string;
  title: string;
  weight: string;
  href: string;
  blurb: string;
  status: string;
  count: number;
  icon: 'layers' | 'network' | 'route' | 'server' | 'shield' | 'terminal';
};

const MODULES: CcnaModule[] = [
  {
    id: '1.0',
    iface: 'gi0/1',
    title: 'Network Fundamentals',
    weight: '20%',
    href: '/docs/ccna-labs/1.0-network-f',
    blurb: 'OSI and TCP/IP models, cabling, and IPv4/IPv6 addressing.',
    status: '1 lab ready',
    count: 1,
    icon: 'layers',
  },
  {
    id: '2.0',
    iface: 'gi0/2',
    title: 'Network Access',
    weight: '20%',
    href: '/docs/ccna-labs/2.0-network-a',
    blurb: 'VLANs, 802.1Q trunks, Rapid PVST+, and EtherChannel (LACP).',
    status: 'overview ready',
    count: 0,
    icon: 'network',
  },
  {
    id: '3.0',
    iface: 'gi0/3',
    title: 'IP Connectivity',
    weight: '25%',
    href: '/docs/ccna-labs/3.0-ip-connect',
    blurb: 'Routing tables, static routes, and single-area OSPFv2.',
    status: 'overview ready',
    count: 0,
    icon: 'route',
  },
  {
    id: '4.0',
    iface: 'gi0/4',
    title: 'IP Services',
    weight: '10%',
    href: '/docs/ccna-labs/4.0-ip-services',
    blurb: 'First-hop redundancy, NAT, NTP, and DHCP client/relay.',
    status: 'overview ready',
    count: 0,
    icon: 'server',
  },
  {
    id: '5.0',
    iface: 'gi0/5',
    title: 'Security Fundamentals',
    weight: '15%',
    href: '/docs/ccna-labs/5.0-security-f',
    blurb: 'Switch hardening, Port Security, DHCP snooping, and ACLs.',
    status: 'overview ready',
    count: 0,
    icon: 'shield',
  },
  {
    id: '6.0',
    iface: 'gi0/6',
    title: 'Automation & Programmability',
    weight: '10%',
    href: '/docs/ccna-labs/6.0-auto-and-p',
    blurb: 'REST APIs, JSON encoding, and network controller architectures.',
    status: 'overview ready',
    count: 0,
    icon: 'terminal',
  },
];

const ICONS = {
  layers: Layers,
  network: Network,
  route: Route,
  server: Server,
  shield: ShieldCheck,
  terminal: Terminal,
} as const;

// 6 orthogonal PCB traces centered from router core (y=250 in a 500-unit viewBox)
const TRACE_D = [
  'M0 250 H32 V40 H140',
  'M0 250 H32 V124 H140',
  'M0 250 H32 V208 H140',
  'M0 250 H32 V292 H140',
  'M0 250 H32 V376 H140',
  'M0 250 H32 V460 H140',
];

const THEME_VARS = {
  '--seg-light': '#0e7490',
  '--seg-dark': '#2dd4bf',
} as React.CSSProperties;

export function CcnaTopology() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div
      aria-label="CCNA 200-301 curriculum topology map"
      className="not-prose my-8 w-full select-none"
      style={THEME_VARS}
    >
      {/* MOBILE (< md): Vertical tree list with sleek indicator strip */}
      <div className="flex flex-col gap-3 md:hidden">
        {/* Core Router Badge */}
        <div className="flex items-center gap-3 rounded-xl border border-fd-border bg-fd-card/80 p-3.5 backdrop-blur-sm shadow-xs">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-[var(--seg)]/30 bg-[var(--seg)]/10 text-[var(--seg)]">
            <Network className="size-5" strokeWidth={1.8} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-fd-foreground">
                CCNA 200-301 · Core
              </span>
              <span className="rounded-full bg-[var(--seg)]/15 px-2 py-0.5 font-mono text-[9px] font-medium text-[var(--seg)]">
                6 Domains
              </span>
            </div>
            <div className="mt-0.5 font-mono text-[11px] text-fd-muted-foreground">
              v1.1 Blueprint · 120 Mins
            </div>
          </div>
        </div>

        {/* Domain Cards */}
        <div className="flex flex-col gap-2.5">
          {MODULES.map((m) => {
            const Icon = ICONS[m.icon];
            return (
              <Link
                key={m.id}
                href={m.href}
                className="group relative flex items-center gap-3.5 rounded-xl border border-fd-border bg-fd-card/70 p-3.5 no-underline backdrop-blur-sm transition-all duration-200 hover:-translate-y-px hover:border-[var(--seg)] hover:shadow-xs active:scale-[0.98]"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-fd-border bg-fd-muted/40 text-[var(--seg)] transition-colors group-hover:border-[var(--seg)]">
                  <Icon className="size-4.5" strokeWidth={1.8} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline gap-2">
                    <span className="truncate text-sm font-semibold tracking-tight text-fd-foreground no-underline group-hover:text-[var(--seg)]">
                      {m.id} {m.title}
                    </span>
                    <span className="font-mono text-[10px] text-fd-muted-foreground">
                      {m.iface}
                    </span>
                  </span>
                  <span className="mt-0.5 line-clamp-1 text-xs text-fd-muted-foreground">
                    {m.blurb}
                  </span>
                </span>

                <span className="flex shrink-0 flex-col items-end gap-1">
                  <span className="font-mono text-xs font-semibold text-fd-foreground">
                    {m.weight}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-[10px] text-fd-muted-foreground">
                    <span>{m.count > 0 ? `${m.count} lab` : 'overview'}</span>
                    <ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* DESKTOP (>= md): Authentic Marrow Hardware Chassis & PCB Bus */}
      <div className="hidden w-full items-center md:flex">
        {/* Core Router */}
        <div className="group/core shrink-0 flex-col items-center justify-center gap-2 rounded-xl border border-fd-border bg-fd-card/70 px-4 py-6 text-center backdrop-blur-sm transition-all duration-200 hover:-translate-y-px hover:border-[var(--seg)] hover:shadow-md md:flex md:w-36">
          <div className="flex size-11 items-center justify-center rounded-lg border border-fd-border bg-fd-muted/50 text-[var(--seg)] shadow-xs transition-transform duration-200 group-hover/core:scale-105">
            <Network className="size-5.5" strokeWidth={1.9} />
          </div>
          <div>
            <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-fd-foreground">
              CCNA 200-301
            </div>
            <div className="mt-0.5 font-mono text-[9.5px] tracking-wide text-fd-muted-foreground">
              v1.1 blueprint
            </div>
          </div>
          <div className="mt-1 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-[var(--seg)]">
            <span className="size-1.5 rounded-full bg-[var(--seg)] motion-safe:animate-pulse" />
            6 domains
          </div>
        </div>

        {/* Smooth Hairline PCB Traces */}
        <svg
          aria-hidden
          viewBox="0 0 140 500"
          preserveAspectRatio="none"
          className="h-[500px] w-16 shrink-0 lg:w-22"
        >
          {MODULES.map((m, i) => {
            const active = hovered === m.id;
            return (
              <g key={m.id} className="seg-node">
                <path
                  d={TRACE_D[i]}
                  fill="none"
                  vectorEffect="non-scaling-stroke"
                  strokeWidth={active ? 2 : 1.4}
                  stroke={
                    active
                      ? 'var(--seg-light)'
                      : 'color-mix(in oklab, var(--color-fd-foreground) 18%, transparent)'
                  }
                  style={{
                    transition: 'stroke 0.25s ease, stroke-width 0.25s ease',
                    filter: active ? 'drop-shadow(0 0 3px var(--seg-light))' : undefined,
                  }}
                />
                <circle
                  r="2.5"
                  fill="var(--seg-light)"
                  className="motion-reduce:hidden"
                  opacity={active ? 1 : 0.8}
                >
                  <animateMotion
                    dur={active ? '1.5s' : '5s'}
                    begin={`${i * 0.9}s`}
                    repeatCount="indefinite"
                    path={TRACE_D[i]}
                  />
                </circle>
              </g>
            );
          })}
        </svg>

        {/* Chassis Nodes */}
        <div className="grid h-[500px] w-full min-w-0 grid-cols-1 grid-rows-6 items-center">
          {MODULES.map((m) => {
            const Icon = ICONS[m.icon];
            const isHovered = hovered === m.id;

            return (
              <Link
                key={m.id}
                href={m.href}
                className="group relative flex w-full min-w-0 items-center gap-3.5 rounded-xl border border-fd-border bg-fd-card/70 px-4 py-3 no-underline backdrop-blur-sm transition-all duration-200 hover:-translate-y-px hover:border-[var(--seg-light)] hover:shadow-md active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring"
                onMouseEnter={() => setHovered(m.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(m.id)}
                onBlur={() => setHovered(null)}
              >
                {/* Connector Pin */}
                <span
                  aria-hidden
                  className="absolute -left-[5px] top-1/2 size-2.5 -translate-y-1/2 border bg-fd-background transition-colors duration-200"
                  style={{
                    borderColor: isHovered
                      ? 'var(--seg-light)'
                      : 'color-mix(in oklab, var(--seg-light) 50%, var(--color-fd-border))',
                    backgroundColor: isHovered ? 'var(--seg-light)' : 'var(--color-fd-background)',
                  }}
                />

                {/* Icon Chip */}
                <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-fd-border bg-fd-muted/30 text-[var(--seg-light)] transition-colors duration-200 group-hover:border-[var(--seg-light)]">
                  <Icon className="size-4.5" strokeWidth={1.8} />
                </span>

                {/* Body */}
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline gap-2">
                    <span className="truncate text-[14.5px] font-semibold tracking-tight text-fd-foreground no-underline group-hover:text-[var(--seg-light)]">
                      {m.id} {m.title}
                    </span>
                    <span className="font-mono text-[10px] text-fd-muted-foreground">
                      {m.iface}
                    </span>
                  </span>
                  <span className="mt-0.5 line-clamp-1 text-[12.5px] text-fd-muted-foreground">
                    {m.blurb}
                  </span>
                </span>

                {/* Weight + status */}
                <span className="flex shrink-0 flex-col items-end gap-0.5">
                  <span className="font-mono text-[11px] font-medium text-fd-foreground">
                    {m.weight}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-[10.5px] text-fd-muted-foreground">
                    <span>{m.count > 0 ? `${m.count} lab` : 'overview'}</span>
                    <ArrowUpRight className="size-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
