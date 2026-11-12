import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { certInterfaces, labLog, links, projects, techStack } from "@/data/profile";
import { cn } from "@/lib/cn";

// Discovery playground: networking-inspired brand ideas on real content.
// Not linked or indexed. Delete once the choices are made.
export const metadata: Metadata = {
  title: "Brand Lab — Rajkumar Neupane",
  robots: { index: false },
};

/* ── shared bits ─────────────────────────────────────────────────────── */

function Idea({ n, title, source, children }: { n: number | string; title: string; source: string; children: ReactNode }) {
  return (
    <section className="mt-14 border-t border-line pt-8">
      <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Idea {n}</div>
      <h2 className="mt-1 text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{source}</p>
      <div className="mt-5 grid gap-6">{children}</div>
    </section>
  );
}

function Use({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div>
      <div className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground">{label}</div>
      <div className={cn("rounded-xl border border-line p-5", className)}>{children}</div>
    </div>
  );
}

const TAGS = ["Proxmox", "Networking", "Cisco", "Setup", "Linux", "Homelab", "CCNA", "Security"];

/* ── 1. fibre colour code (TIA-598) ──────────────────────────────────── */

// First four use the site's T568B hexes, so the palettes agree.
const FIBRE = [
  { name: "Blue", hex: "#2B5799" },
  { name: "Orange", hex: "#D9711F" },
  { name: "Green", hex: "#2E7D46" },
  { name: "Brown", hex: "#63452E" },
  { name: "Slate", hex: "#6B7A89" },
  { name: "White", hex: "#F1EBDE" },
  { name: "Red", hex: "#C8323C" },
  { name: "Black", hex: "#1C1C1E" },
  { name: "Yellow", hex: "#E8B923" },
  { name: "Violet", hex: "#7046A6" },
  { name: "Rose", hex: "#E39AB5" },
  { name: "Aqua", hex: "#19A9B8" },
];

/* ── 5. RJ45 jack ────────────────────────────────────────────────────── */

function Jack({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("size-4 shrink-0", className)} aria-hidden>
      <rect x="2.5" y="3.5" width="19" height="17" rx="2.5" className="fill-background stroke-foreground" strokeWidth="1.4" />
      <path d="M6 7.5h12v8.5h-3v2.5h-6V16H6z" className="fill-foreground/10 stroke-foreground" strokeWidth="1.2" strokeLinejoin="round" />
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={i} x={7.1 + i * 1.3} y="8.3" width="0.7" height="3.2" rx=".3" fill="#C9A227" />
      ))}
    </svg>
  );
}

/* ── 6. rack-unit card ───────────────────────────────────────────────── */

function RackEar({ side }: { side: "left" | "right" }) {
  return (
    <div
      className={cn(
        "absolute inset-y-0 flex w-5 flex-col items-center justify-between border-y border-line bg-muted/60 py-2",
        side === "left" ? "-left-5 rounded-l-md border-l" : "-right-5 rounded-r-md border-r",
      )}
      aria-hidden
    >
      {[0, 1].map((i) => (
        <span key={i} className="size-2 rounded-full border border-foreground/30 bg-background shadow-[inset_0_1px_1px_rgb(0_0_0/.25)]" />
      ))}
    </div>
  );
}

/* ── 4. velcro strap ─────────────────────────────────────────────────── */

const velcro: CSSProperties = {
  backgroundColor: "#1d1d20",
  backgroundImage: "radial-gradient(rgb(255 255 255 / .09) 0.8px, transparent 0.9px)",
  backgroundSize: "4px 4px",
};

/* ── 9. 25-pair telephone code ───────────────────────────────────────── */

const TIP = [
  { name: "white", hex: "#F1EBDE" },
  { name: "red", hex: "#C8323C" },
  { name: "black", hex: "#1C1C1E" },
  { name: "yellow", hex: "#E8B923" },
  { name: "violet", hex: "#7046A6" },
];
const RING = [
  { name: "blue", hex: "#2B5799" },
  { name: "orange", hex: "#D9711F" },
  { name: "green", hex: "#2E7D46" },
  { name: "brown", hex: "#63452E" },
  { name: "slate", hex: "#6B7A89" },
];
/** Pair n (1–25): tip colour by group of five, ring colour within it. */
const pair = (n: number) => ({ tip: TIP[Math.floor((n - 1) / 5)], ring: RING[(n - 1) % 5] });

function PairMark({ n, className }: { n: number; className?: string }) {
  const { tip, ring } = pair(n);
  return (
    <span className={cn("inline-flex h-2.5 w-7 overflow-hidden rounded-full ring-1 ring-black/15", className)} aria-hidden>
      <span className="flex-1" style={{ background: tip.hex }} />
      <span className="flex-1" style={{ background: ring.hex }} />
    </span>
  );
}

/* ── 11. hazard tape ─────────────────────────────────────────────────── */

const HAZARD = "repeating-linear-gradient(-45deg, #F2C230 0 10px, #161616 10px 20px)";

/* ── 13. keystone wall plate ─────────────────────────────────────────── */

function Keystone({ color, label, href }: { color: string; label: string; href: string }) {
  return (
    <a href={href} className="group flex flex-col items-center gap-2 outline-none">
      <span
        className="relative flex h-14 w-11 items-start justify-center rounded-[5px] pt-2 shadow-[inset_0_-2px_0_rgb(0_0_0/.2)] transition-transform group-hover:-translate-y-0.5 group-focus-visible:ring-2 group-focus-visible:ring-foreground"
        style={{ background: color }}
      >
        {/* the RJ45 opening, with its 8 gold contacts */}
        <svg viewBox="0 0 24 22" className="w-7" aria-hidden>
          <path d="M2 2h20v13h-5v4H7v-4H2z" fill="#121214" />
          {Array.from({ length: 8 }, (_, i) => (
            <rect key={i} x={4.4 + i * 2.1} y="3.4" width="1" height="5" rx=".4" fill="#C9A227" />
          ))}
        </svg>
      </span>
      <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted-foreground group-hover:text-foreground">
        {label}
      </span>
    </a>
  );
}

/* ── 16. rack elevation ──────────────────────────────────────────────── */

const RACK = [
  { label: "Intro", u: 1, color: "#D9711F" },
  { label: "About", u: 2, color: "#D9711F" },
  { label: "Stack", u: 1, color: "#2E7D46" },
  { label: "Experience", u: 2, color: "#2B5799" },
  { label: "Certs", u: 1, color: "#2B5799" },
  { label: "Blog", u: 2, color: "#2E7D46" },
  { label: "Labs", u: 2, color: "#63452E" },
  { label: "Projects", u: 1, color: "#63452E" },
];

/* ── 17/18. RJ45 plug (clear, wires visible) ─────────────────────────── */

const WIRES = ["#D9711F", "#D9711F", "#2E7D46", "#2B5799", "#2B5799", "#2E7D46", "#63452E", "#63452E"];
const STRIPED = [true, false, true, false, true, false, true, false];

function LoosePlug({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 90" className={className} aria-hidden>
      {/* cable sagging in from the left */}
      <path d="M0 30 C 60 30, 70 62, 120 58" fill="none" className="stroke-foreground/70" strokeWidth="9" strokeLinecap="round" />
      {/* boot */}
      <path d="M116 50 h20 l4 4 v8 l-4 4 h-20z" className="fill-foreground/80" />
      {/* clear plug body with the 8 wires inside */}
      <rect x="138" y="44" width="62" height="28" rx="3" className="fill-foreground/10 stroke-foreground/60" strokeWidth="1.2" />
      {WIRES.map((c, i) => (
        <g key={i}>
          <rect x="140" y={46.5 + i * 3.1} width="54" height="2.1" fill={c} />
          {STRIPED[i] ? <rect x="140" y={46.5 + i * 3.1} width="54" height="2.1" fill="url(#plug-stripe)" /> : null}
        </g>
      ))}
      {/* latch */}
      <path d="M150 44 l16 -8 h6 l-14 8z" className="fill-foreground/30" />
      <defs>
        <pattern id="plug-stripe" width="6" height="3" patternUnits="userSpaceOnUse">
          <rect x="3" width="3" height="3" fill="#F1EBDE" />
        </pattern>
      </defs>
    </svg>
  );
}

/* ── hazard tape for CCNA Labs ───────────────────────────────────────── */

const DOMAINS = [
  { n: "1.0", name: "Network Fundamentals", weight: 20, labs: 1 },
  { n: "2.0", name: "Network Access", weight: 20, labs: 0 },
  { n: "3.0", name: "IP Connectivity", weight: 25, labs: 0 },
  { n: "4.0", name: "IP Services", weight: 10, labs: 0 },
  { n: "5.0", name: "Security Fundamentals", weight: 15, labs: 0 },
  { n: "6.0", name: "Automation & Programmability", weight: 10, labs: 0 },
];
const HAZARD_FINE = "repeating-linear-gradient(-45deg, #F2C230 0 6px, #161616 6px 12px)";

/** Yellow caution tape with repeating bold text. */
function CautionTape({ text, className }: { text: string; className?: string }) {
  return (
    <div
      className={cn("overflow-hidden whitespace-nowrap border-y-2 border-[#161616] bg-[#F2C230] py-0.5 text-[11px] font-black tracking-[0.18em] text-[#161616]", className)}
      style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
      aria-hidden
    >
      {Array.from({ length: 8 }, () => `${text}  ◆  `).join("")}
    </div>
  );
}

/* ── page ────────────────────────────────────────────────────────────── */

export default function BrandLab() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12">
      <Link href="/" className="font-mono text-xs text-muted-foreground hover:text-foreground">
        ← home
      </Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight">Brand discovery</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Your four picks, then ten new ideas, each shown on your real content. Nothing here moves on its own.
        Pick the ones you want.
      </p>

      {/* HAZARD */}
      <div className="mt-14 border-t-2 border-foreground/80 pt-6">
        <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Idea 11, explored</div>
        <h2 className="mt-1 text-3xl font-bold tracking-tight">Hazard tape on CCNA Labs</h2>
        <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
          Seven ways to say “under construction” on the CCNA section: 1 of 6 domains has labs so far. Mix and match.
        </p>
      </div>

      <Idea n="11A" title="Header strip" source="A thin hazard band above the page title, plus a status chip. Quiet, always visible.">
        <Use label="CCNA Labs page header" className="overflow-hidden p-0">
          <div className="h-1.5" style={{ background: HAZARD_FINE }} />
          <div className="p-5">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-2xl font-bold tracking-tight">CCNA 200-301 Lab Guide</h3>
              <span className="rounded px-1.5 py-0.5 font-mono text-[10.5px] font-bold text-[#161616]" style={{ background: "#F2C230" }}>
                UNDER CONSTRUCTION
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">Lab configurations, topologies and verification notes for the CCNA 200-301 curriculum.</p>
          </div>
        </Use>
      </Idea>

      <Idea n="11B" title="Caution frame" source="A callout boxed in hazard stripes, like a barrier around an open floor tile. Says what is done and what is next.">
        <Use label="Top of the CCNA overview">
          <div className="rounded-lg p-1.5" style={{ background: HAZARD }}>
            <div className="rounded-md bg-background p-4">
              <div className="font-semibold">This section is being built.</div>
              <p className="mt-1 text-sm text-muted-foreground">
                1 of 6 exam domains has labs so far. Network Fundamentals is first; Network Access is next.
              </p>
            </div>
          </div>
        </Use>
      </Idea>

      <Idea n="11C" title="Corner tape on domain cards" source="Finished domains look normal; unbuilt ones get a strip of tape across the corner.">
        <Use label="The six domains">
          <div className="grid gap-3 sm:grid-cols-3">
            {DOMAINS.map((d) => (
              <div key={d.n} className="relative overflow-hidden rounded-lg border border-line p-3">
                {d.labs === 0 ? (
                  <div className="absolute -right-10 top-4 w-36 rotate-45 py-0.5 text-center text-[9px] font-black tracking-[0.16em] text-[#161616]" style={{ background: HAZARD_FINE }}>
                    <span className="rounded-sm bg-[#F2C230] px-1">SOON</span>
                  </div>
                ) : null}
                <div className="font-mono text-[11px] text-muted-foreground">{d.n} · {d.weight}%</div>
                <div className="mt-1 pr-6 text-[14px] font-medium">{d.name}</div>
                <div className="mt-2 font-mono text-[11px] text-muted-foreground">{d.labs ? `${d.labs} lab` : "no labs yet"}</div>
              </div>
            ))}
          </div>
        </Use>
      </Idea>

      <Idea n="11D" title="Caution tape across locked cards" source="Unbuilt domains are dimmed with a strip of caution tape stretched across them, like a closed-off area.">
        <Use label="The six domains">
          <div className="grid gap-3 sm:grid-cols-3">
            {DOMAINS.map((d) => (
              <div key={d.n} className="relative overflow-hidden rounded-lg border border-line p-3">
                <div className={d.labs === 0 ? "opacity-40" : undefined}>
                  <div className="font-mono text-[11px] text-muted-foreground">{d.n} · {d.weight}%</div>
                  <div className="mt-1 text-[14px] font-medium">{d.name}</div>
                  <div className="mt-2 font-mono text-[11px] text-muted-foreground">{d.labs ? `${d.labs} lab` : "no labs yet"}</div>
                </div>
                {d.labs === 0 ? <CautionTape text="WORK IN PROGRESS" className="absolute top-1/2 -left-4 w-[140%] -translate-y-1/2 -rotate-[8deg]" /> : null}
              </div>
            ))}
          </div>
        </Use>
      </Idea>

      <Idea n="11E" title="Coverage bar" source="One bar weighted by the exam blueprint. Built domains are solid; the rest is hazard tape still to be laid.">
        <Use label="Exam coverage">
          <div className="flex h-4 overflow-hidden rounded-sm ring-1 ring-black/15">
            {DOMAINS.map((d) => (
              <div
                key={d.n}
                title={`${d.n} ${d.name}`}
                className="border-r border-background last:border-r-0"
                style={{ width: `${d.weight}%`, background: d.labs ? "#2E7D46" : HAZARD_FINE }}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between font-mono text-[11px] text-muted-foreground">
            <span>20% of the blueprint has labs</span>
            <span>80% under construction</span>
          </div>
        </Use>
      </Idea>

      <Idea n="11F" title="Sidebar markers" source="In the docs sidebar, unbuilt pages carry a tiny hazard swatch so readers know before they click.">
        <Use label="Docs sidebar">
          <ul className="grid max-w-xs gap-1.5 text-[14px]">
            {DOMAINS.map((d) => (
              <li key={d.n} className="flex items-center justify-between rounded-md px-2 py-1 hover:bg-muted">
                <span className={d.labs ? "" : "text-muted-foreground"}>{d.name}</span>
                {d.labs === 0 ? <span className="h-2.5 w-4 rounded-[2px] ring-1 ring-black/20" style={{ background: HAZARD_FINE }} aria-label="under construction" /> : null}
              </li>
            ))}
          </ul>
        </Use>
      </Idea>

      <Idea n="11G" title="Construction zone divider" source="A hazard band marks where finished content ends and the unbuilt part starts.">
        <Use label="Inside the CCNA overview">
          <p className="text-sm">1.0 Network Fundamentals: Device Hardening →</p>
          <div className="my-4 flex items-center gap-3">
            <div className="h-2 flex-1 rounded-sm" style={{ background: HAZARD }} />
            <span className="font-mono text-[10.5px] font-bold tracking-[0.14em] text-muted-foreground">UNDER CONSTRUCTION BELOW</span>
            <div className="h-2 flex-1 rounded-sm" style={{ background: HAZARD }} />
          </div>
          <p className="text-sm text-muted-foreground">2.0 Network Access, 3.0 IP Connectivity, 4.0 IP Services…</p>
        </Use>
      </Idea>

      {/* 1 */}
      <Idea n={1} title="Fibre colour code: a 12-colour palette" source="TIA-598 orders fibre strands in 12 fixed colours. Your four T568B colours are its first four, so it extends what you have when 4 isn't enough.">
        <div className="grid grid-cols-6 gap-2 sm:grid-cols-12">
          {FIBRE.map((f, i) => (
            <div key={f.name} className="text-center">
              <div className="h-10 rounded-md border border-black/10" style={{ background: f.hex }} />
              <div className="mt-1 font-mono text-[10px] text-muted-foreground">
                {i + 1} {f.name}
              </div>
            </div>
          ))}
        </div>
        <Use label="On blog tags (colour by fibre order)">
          <div className="flex flex-wrap gap-2">
            {TAGS.map((t, i) => (
              <span key={t} className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-[13px]">
                <span className="size-2 rounded-full ring-1 ring-black/15" style={{ background: FIBRE[i].hex }} />
                {t}
              </span>
            ))}
          </div>
        </Use>
      </Idea>

      {/* 5 */}
      <Idea n={5} title="The RJ45 jack" source="The jack outline with its 8 gold contacts, as a small icon: list bullets, markers, a favicon frame.">
        <Use label="As list bullets (tech stack)">
          <ul className="grid gap-2 text-[14px] sm:grid-cols-2">
            {techStack.slice(0, 6).map((s) => (
              <li key={s.name} className="flex items-center gap-2.5">
                <Jack /> <span className="font-medium">{s.name}</span>
                <span className="text-muted-foreground">· {s.role}</span>
              </li>
            ))}
          </ul>
        </Use>
      </Idea>

      {/* 6 */}
      <Idea n={6} title="Rack-mounted cards" source="Server-rack details on a card: thin rack ears on the sides with screw holes, like a 1U device bolted into the rack.">
        <Use label="A project card" className="px-10">
          <div className="relative rounded-md border border-line bg-background p-4">
            <RackEar side="left" />
            <RackEar side="right" />
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-semibold">{projects[0].name}</span>
              <span className="font-mono text-[11px] text-muted-foreground">{projects[0].kind}</span>
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground">{projects[0].description}</p>
          </div>
        </Use>
      </Idea>

      {/* 8 */}
      <Idea n={8} title="Velcro cable straps" source="Closets bundle cables with velcro straps. A strap that groups related chips into one bundle.">
        <Use label="Certifications, bundled">
          <div className="relative inline-flex flex-wrap items-center gap-2 rounded-lg p-1.5 pr-8" style={velcro}>
            {certInterfaces.slice(0, 3).map((c) => (
              <span key={c.port} className="rounded-md bg-background px-2.5 py-1 text-[12.5px] font-medium">
                {c.desc.split(" — ")[0].split(" (")[0]}
              </span>
            ))}
            <span className="absolute inset-y-1.5 right-1.5 w-5 rounded-[4px] bg-[#2B5799]" aria-hidden />
          </div>
        </Use>
      </Idea>

      <div className="mt-20 border-t-2 border-foreground/80 pt-6">
        <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">New ideas</div>
        <h2 className="mt-1 text-3xl font-bold tracking-tight">Still deciding</h2>
      </div>

      {/* 9 */}
      <Idea n={9} title="The 25-pair telephone code" source="The original copper standard: 5 tip colours × 5 ring colours = 25 unique pairs. Every lab or post gets its own two-colour pair mark.">
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-[repeat(25,minmax(0,1fr))]">
          {Array.from({ length: 25 }, (_, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <PairMark n={i + 1} className="h-3 w-full" />
              <span className="font-mono text-[9px] text-muted-foreground">{i + 1}</span>
            </div>
          ))}
        </div>
        <Use label="On Lab Log cards">
          <div className="grid gap-3 sm:grid-cols-2">
            {labLog.slice(0, 4).map((l, i) => {
              const { tip, ring } = pair(i + 1 + i * 6);
              return (
                <div key={l.title} className="rounded-lg border border-line p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium">{l.title}</span>
                    <PairMark n={i + 1 + i * 6} />
                  </div>
                  <div className="mt-1 font-mono text-[10.5px] text-muted-foreground">
                    pair {i + 1 + i * 6} · {tip.name}/{ring.name} · {l.date}
                  </div>
                </div>
              );
            })}
          </div>
        </Use>
      </Idea>

      {/* 11 */}
      <Idea n={11} title="Hazard tape for work in progress" source="The yellow-and-black stripes on data-centre floors and cages. Unfinished labs show it proudly instead of hiding.">
        <Use label="A lab still being built" className="overflow-hidden p-0">
          <div className="h-2" style={{ background: HAZARD }} />
          <div className="p-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Mega Lab: 14-phase enterprise build</span>
              <span className="rounded px-1.5 py-0.5 font-mono text-[10.5px] font-bold text-[#161616]" style={{ background: "#F2C230" }}>
                IN PROGRESS
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">Phases 1–13 written. Phase 14 underway.</p>
          </div>
        </Use>
      </Idea>

      {/* 13 */}
      <Idea n={13} title="Keystone wall plate for contact" source="A wall faceplate with one keystone jack per way to reach you, each in a pair colour. Your contact section becomes something to plug into.">
        <Use label="Contact">
          <div className="flex justify-center">
            <div className="relative rounded-2xl border border-black/10 px-8 pt-7 pb-5 shadow-[0_2px_6px_rgb(0_0_0/.25),inset_0_1px_0_rgb(255_255_255/.7)]" style={{ background: "linear-gradient(180deg,#f4f2ec,#e2dfd6)" }}>
              <span className="absolute top-2 left-1/2 size-2.5 -translate-x-1/2 rounded-full bg-[#cfcbc1] shadow-[inset_0_1px_1px_rgb(0_0_0/.35)]" />
              <span className="absolute bottom-2 left-1/2 size-2.5 -translate-x-1/2 rounded-full bg-[#cfcbc1] shadow-[inset_0_1px_1px_rgb(0_0_0/.35)]" />
              <div className="flex gap-5 [&_span.font-mono]:text-zinc-600">
                <Keystone color="#D9711F" label="GitHub" href={links.github} />
                <Keystone color="#2B5799" label="LinkedIn" href={links.linkedin} />
                <Keystone color="#2E7D46" label="Email" href="#" />
                <Keystone color="#63452E" label="Resume" href={links.resume} />
              </div>
            </div>
          </div>
        </Use>
      </Idea>

      {/* 16 */}
      <Idea n={16} title="Rack elevation map" source="A data-centre rack elevation shows which device sits in which slot. Your homepage sections as devices in a rack.">
        <Use label="Homepage, as a rack" className="flex justify-center">
          <div className="flex gap-1.5">
            <div className="flex flex-col-reverse justify-start font-mono text-[9px] text-muted-foreground">
              {Array.from({ length: 12 }, (_, i) => (
                <span key={i} className="flex h-6 items-center">{String(i + 1).padStart(2, "0")}</span>
              ))}
            </div>
            <div className="w-64 rounded-md border-x-[6px] border-y-2 border-zinc-500/50 bg-muted/40 p-0.5">
              {RACK.map((r) => (
                <div
                  key={r.label}
                  className="mb-px flex items-center justify-between rounded-[3px] border border-line bg-background px-2.5"
                  style={{ height: r.u * 24 - 1 }}
                >
                  <span className="text-[12.5px] font-medium">{r.label}</span>
                  <span className="flex items-center gap-1.5 font-mono text-[9px] text-muted-foreground">
                    {r.u}U <span className="h-1.5 w-4 rounded-full" style={{ background: r.color }} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Use>
      </Idea>

      {/* 18 */}
      <Idea n={18} title="Empty states as an unplugged cable" source="Wherever a list is empty, a loose cable with its plug hanging free: the clear plug shows the 8 wires in T568B order.">
        <Use label="No posts for this tag" className="flex flex-col items-center gap-2 py-8">
          <LoosePlug className="w-56" />
          <p className="text-sm text-muted-foreground">Nothing plugged in here yet.</p>
        </Use>
      </Idea>

      <p className="mt-16 border-t border-line pt-6 font-mono text-xs text-muted-foreground">
        Pick by number, e.g. “9, 13, 17”. This page gets deleted after.
      </p>
    </main>
  );
}
