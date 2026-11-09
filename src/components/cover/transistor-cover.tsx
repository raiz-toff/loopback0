"use client";

import React, { useEffect, useId, useState } from "react";
import { useClickSound } from "@/hooks/use-click-sound";

/* ────────────────────────────────────────────────────────────────
   geometry — 30° isometric. viewer sits at +x +y, so the visible
   faces of any box are: top, front (+y) and side (+x).
   ──────────────────────────────────────────────────────────────── */
type P = [number, number];
type V = [number, number, number];

const K = 0.866;
const iso = (x: number, y: number, z: number): P => [(x - y) * K, (x + y) / 2 - z];
const fmt = (p: P) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`;
const pts = (vs: V[]) => vs.map((v) => fmt(iso(...v))).join(" ");
const trace = (vs: V[]) => vs.map((v, i) => `${i ? "L" : "M"}${fmt(iso(...v))}`).join(" ");

const fTop = (x: number, y: number, z: number, w: number, d: number): V[] => [
  [x, y, z], [x + w, y, z], [x + w, y + d, z], [x, y + d, z],
];
const fFront = (x: number, y: number, z: number, w: number, h: number): V[] => [
  [x, y, z], [x + w, y, z], [x + w, y, z + h], [x, y, z + h],
];
const fSide = (x: number, y: number, z: number, d: number, h: number): V[] => [
  [x, y, z], [x, y + d, z], [x, y + d, z + h], [x, y, z + h],
];

/* ── palette: matched to docs topology navigation graph accents ── */
const GATE = "var(--col-gate, #60a5fa)";
const DRAIN = "var(--col-drain, #fbbf24)";
const SRC = "var(--col-src, #2dd4bf)";
const DIM = "var(--mf-dim)";
const mix = (c: string, p: number, base = "var(--mf-front)") =>
  `color-mix(in oklab, ${c} ${p}%, ${base})`;
const FADE = "fill .45s ease, stroke .45s ease, opacity .45s ease";

const vars = {
  "--mf-bg": "var(--background, #09090b)",
  "--mf-fg": "var(--foreground, #e4e4e7)",
  "--mf-dim": "color-mix(in oklab, var(--mf-fg) 48%, transparent)",
  "--mf-line": "color-mix(in oklab, var(--mf-fg) 26%, transparent)",
  "--mf-top": "color-mix(in oklab, var(--mf-fg) 12%, var(--mf-bg))",
  "--mf-front": "color-mix(in oklab, var(--mf-fg) 6.5%, var(--mf-bg))",
  "--mf-side": "color-mix(in oklab, var(--mf-fg) 3.5%, var(--mf-bg))",
} as React.CSSProperties;

const CSS = `
@keyframes mf-flow{to{stroke-dashoffset:-9.1}}
.mf-flow{stroke-dasharray:.1 9;stroke-linecap:round;animation:mf-flow .8s linear infinite}
.mf-hit{cursor:pointer;transition:filter .2s;outline:none;}
.mf-hit:focus, .mf-hit:focus-visible{outline:none;}
.mf-hit:hover{filter:brightness(1.25)}
@media (prefers-reduced-motion:reduce){.mf-flow{animation:none}}

:root {
  --col-gate: #2563eb;
  --col-drain: #b45309;
  --col-src: #0e7490;
}
.dark, :root.dark {
  --col-gate: #60a5fa;
  --col-drain: #fbbf24;
  --col-src: #2dd4bf;
}
`;

/* ── primitives ── */
function Poly({
  v, fill, stroke = "none", sw = 1, dash, op,
}: { v: V[]; fill: string; stroke?: string; sw?: number; dash?: string; op?: number }) {
  return (
    <polygon
      points={pts(v)}
      strokeWidth={sw}
      strokeDasharray={dash}
      strokeLinejoin="round"
      style={{ fill, stroke, opacity: op, transition: FADE }}
    />
  );
}

function Block({
  x, y, z, w, d, h, c = {}, stroke = "var(--mf-line)", ghost = false,
}: {
  x: number; y: number; z: number; w: number; d: number; h: number;
  c?: { t?: string; f?: string; s?: string }; stroke?: string; ghost?: boolean;
}) {
  const faces: [V[], string][] = [
    [fFront(x, y + d, z, w, h), c.f ?? "var(--mf-front)"],
    [fSide(x + w, y, z, d, h), c.s ?? "var(--mf-side)"],
    [fTop(x, y, z + h, w, d), c.t ?? "var(--mf-top)"],
  ];
  return (
    <g>
      {faces.map(([v, fill], i) =>
        ghost ? (
          <Poly key={i} v={v} fill="none" stroke={stroke} dash="3 4" op={0.5} />
        ) : (
          <Poly key={i} v={v} fill={fill} stroke={stroke} />
        ),
      )}
    </g>
  );
}

/** pill label in the same language as "core // spine", "pve-01" */
function Tag({
  x, y, align, title, color,
}: { x: number; y: number; align: "start" | "end" | "middle"; title: string; color: string }) {
  const w = title.length * 7.5 + 34;
  const x0 = align === "end" ? -w : align === "middle" ? -w / 2 : 0;
  return (
    <g transform={`translate(${x},${y})`}>
      <rect
        x={x0} y={-12} width={w} height={24} rx={12}
        style={{
          fill: "color-mix(in oklab, var(--mf-bg) 88%, transparent)",
          stroke: `color-mix(in oklab, ${color} 45%, transparent)`,
          transition: FADE,
        }}
      />
      <circle cx={x0 + 12} cy={0} r={2.75} style={{ fill: color, transition: FADE }} />
      <text
        x={x0 + 22}
        y={4}
        fontSize={12.5}
        fontWeight={600}
        letterSpacing={0.3}
        style={{
          fill: color,
          fontFamily: "var(--font-sans), system-ui, sans-serif",
          transition: FADE,
        }}
      >
        {title}
      </text>
    </g>
  );
}

/** Motherboard PCB surface trace with solder-mask underlay */
function PcbTrace({ d, color, on }: { d: string; color: string; on: boolean }) {
  return (
    <g style={{ opacity: on ? 1 : 0.35, transition: "opacity .45s" }}>
      {/* Solder mask relief channel */}
      <path d={d} fill="none" stroke="var(--mf-bg)" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke="var(--mf-line)" strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" opacity={0.6} />
      {/* Conductive copper trace */}
      <path d={d} fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
      {on && <path d={d} fill="none" stroke="var(--mf-fg)" strokeWidth={1.3} className="mf-flow" />}
    </g>
  );
}

function Pulse({
  path, color, dur, n = 2, filter,
}: { path: string; color: string; dur: number; n?: number; filter?: string }) {
  return (
    <>
      {Array.from({ length: n }, (_, i) => (
        <circle key={i} r={2.6} fill={color} filter={filter}>
          <animateMotion dur={`${dur}s`} begin={`${-(dur / n) * i}s`} repeatCount="indefinite" path={path} />
        </circle>
      ))}
    </>
  );
}

/** text laid flat on the cutaway face (plane y = const) */
function FaceText({ x, y, z, children }: { x: number; y: number; z: number; children: React.ReactNode }) {
  const [e, f] = iso(x, y, z);
  return (
    <text
      transform={`matrix(0.866 0.5 0 1 ${e.toFixed(1)} ${f.toFixed(1)})`}
      textAnchor="middle" fontSize={8} letterSpacing={0.4} fill={DIM}
    >
      {children}
    </text>
  );
}

/* ────────────────────────────────────────────────────────────────
   package geometry — the die sits on the board (z = 0). every
   terminal is a real gull-wing lead: a metal strip with width and
   thickness that runs across the die, bends over the edge, and
   lands its foot on a copper pad with solder fillets.
   profiles are (a, z) pairs along x, giving the lead's top surface.
   ──────────────────────────────────────────────────────────────── */
const DIE_H = 22;
const LT = 2.5; // lead thickness
const LW = 12; // lead width
const ZL = DIE_H + LT; // top of a lead lying on the die
const GATE_Y = -86; // gate runner lane, just behind the gate finger

type Prof = [number, number][];

// drain: foot + bend live behind the die's hidden -x face (drawn first),
// the run across the die top is drawn after the die.
const DRAIN_FOOT: Prof = [[-184, LT], [-166, LT], [-156, ZL], [-150, ZL]];
const DRAIN_RUN: Prof = [[-150, ZL], [-80, ZL]];
const SRC_LEAD: Prof = [[80, ZL], [156, ZL], [166, LT], [184, LT]];
// gate: starts under the gate's back end, exits over the visible +x edge
const GATE_LEAD: Prof = [[36, ZL], [156, ZL], [166, LT], [184, LT]];

const dEnd: V = [-275, 0, 0];
const sEnd: V = [275, 0, 0];
const gEnd: V = [205, -150, 0];
const gPin: V = [50, GATE_Y, ZL];

const drainTracePath = trace([dEnd, [-190, 0, 0]]);
const sourceTracePath = trace([[190, 0, 0], sEnd]);
const gateTracePath = trace([[190, GATE_Y, 0], [205, GATE_Y, 0], gEnd]);

const drainPulsePath = trace([
  [-275, 0, 1], [-184, 0, LT + 1], [-166, 0, LT + 1], [-156, 0, ZL + 1], [-80, 0, ZL + 1],
]);
const sourcePulsePath = trace([
  [80, 0, ZL + 1], [156, 0, ZL + 1], [166, 0, LT + 1], [184, 0, LT + 1], [275, 0, 1],
]);
const gatePulsePath = trace([
  gEnd, [205, GATE_Y, 1], [184, GATE_Y, LT + 1], [166, GATE_Y, LT + 1],
  [156, GATE_Y, ZL + 1], [50, GATE_Y, ZL + 1],
]);

/** extruded gull-wing lead. thickness is a miter offset of the profile,
 *  so bends keep a constant wall; only viewer-facing faces are drawn. */
function Lead({ prof, c, color, on = true }: { prof: Prof; c: number; color: string; on?: boolean }) {
  const half = LW / 2;
  const P = (a: number, z: number, s: number): V => [a, c + s, z];
  const nrm = prof.slice(1).map(([a2, z2], i) => {
    const [a1, z1] = prof[i];
    const L = Math.hypot(a2 - a1, z2 - z1) || 1;
    return [(z2 - z1) / L, -(a2 - a1) / L] as [number, number];
  });
  const inner = prof.map(([a, z], i) => {
    const n1 = nrm[Math.max(0, i - 1)];
    const n2 = nrm[Math.min(nrm.length - 1, i)];
    let ma = n1[0] + n2[0];
    let mz = n1[1] + n2[1];
    const ml = Math.hypot(ma, mz) || 1;
    ma /= ml;
    mz /= ml;
    const k = LT / Math.max(0.35, ma * n1[0] + mz * n1[1]);
    return [a + ma * k, z + mz * k] as [number, number];
  });
  const top = mix(color, on ? 42 : 20, "var(--mf-top)");
  const side = mix(color, on ? 22 : 10);
  const edge = mix(color, on ? 75 : 40, "var(--mf-line)");
  return (
    <g>
      {nrm.map(([na, nz], i) => {
        // outward normal (-na, -nz); viewer looks down (1,1,1)
        if (-na - nz <= 0) return null;
        const [a1, z1] = prof[i];
        const [a2, z2] = prof[i + 1];
        return (
          <Poly key={i} v={[P(a1, z1, -half), P(a2, z2, -half), P(a2, z2, half), P(a1, z1, half)]}
            fill={top} stroke={edge} sw={0.8} />
        );
      })}
      <Poly
        v={[...prof.map(([a, z]) => P(a, z, half)), ...[...inner].reverse().map(([a, z]) => P(a, z, half))]}
        fill={side} stroke={edge} sw={0.8}
      />
      {on && (
        <path d={trace(prof.map(([a, z]) => P(a, z + 0.2, 0)))} fill="none" stroke="var(--mf-fg)"
          strokeWidth={1.1} className="mf-flow" opacity={0.8} />
      )}
    </g>
  );
}

/** solder wedge at a lead's toe or heel */
function Fillet({ a, dir, c }: { a: number; dir: 1 | -1; c: number }) {
  const half = LW / 2 + 0.8;
  const b = a + dir * 5;
  const t = "color-mix(in oklab, var(--mf-fg) 24%, var(--mf-bg))";
  const s = "color-mix(in oklab, var(--mf-fg) 15%, var(--mf-bg))";
  return (
    <g>
      <Poly v={[[a, c - half, LT], [b, c - half, 0.4], [b, c + half, 0.4], [a, c + half, LT]]}
        fill={t} stroke="var(--mf-line)" sw={0.6} />
      <Poly v={[[a, c + half, 0.4], [a, c + half, LT], [b, c + half, 0.4]]}
        fill={s} stroke="var(--mf-line)" sw={0.6} />
    </g>
  );
}

/** copper land on the board under a lead foot */
function CopperPad({ x, c, color }: { x: number; c: number; color: string }) {
  return (
    <Block x={x} y={c - 9} z={0} w={28} d={18} h={1.2}
      c={{ t: mix(color, 28, "var(--mf-top)"), f: mix(color, 16), s: mix(color, 10) }}
      stroke={mix(color, 55, "var(--mf-line)")} />
  );
}

/** metal contact on an n+ well, 2×2 via cuts */
function Contact({ x, color }: { x: number; color: string }) {
  const via = mix(color, 65, "var(--mf-bg)");
  return (
    <g>
      <Block x={x - 9} y={-9} z={DIE_H} w={18} d={18} h={4}
        c={{ t: mix(color, 38, "var(--mf-top)"), f: mix(color, 20), s: mix(color, 12) }}
        stroke={mix(color, 70, "var(--mf-line)")} />
      {[[-6, -6], [1, -6], [-6, 1], [1, 1]].map(([dx, dy], i) => (
        <Poly key={i} v={fTop(x + dx, dy, DIE_H + 4, 5, 5)} fill={via} />
      ))}
    </g>
  );
}

export default function TransistorCover({
  className = "",
  style,
  ...props
}: React.ComponentProps<"div">) {
  const [active, setActive] = useState(true);
  const [scene, setScene] = useState<0 | 1>(0);
  const [touched, setTouched] = useState(false);
  const [still, setStill] = useState(false);
  const [click] = useClickSound?.() ?? [() => { }];
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setStill(m.matches);
    on();
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);

  const toggle = () => {
    click();
    setTouched(true);
    setActive((a) => !a);
  };
  const pick = (s: 0 | 1) => {
    click();
    setScene(s);
  };

  const glow = `url(#glow-${id})`;
  const live = active && !still;
  const gateC = active
    ? { t: mix(GATE, 42, "var(--mf-top)"), f: mix(GATE, 24), s: mix(GATE, 13) }
    : {};
  const wellT = (c: string) => mix(c, active ? 30 : 12, "var(--mf-top)");
  const wellF = (c: string) => mix(c, active ? 20 : 8);
  const sw = (on: boolean) => `${on ? "" : "pointer-events-none opacity-0 blur-[3px]"}`;
  const ticks = Array.from({ length: 13 }, (_, i) => -300 + i * 50);

  const gc = active ? GATE : DIM;
  const cc = active ? SRC : DIM;

  return (
    <div
      {...props}
      style={{ ...vars, ...style }}
      className={`space-y-2.5 font-mono text-foreground ${className ?? ""}`}
    >
      <style>{CSS}</style>

      {/* ── Interactive Viewport ── */}
      <div
        role="region"
        aria-label="Interactive MOSFET architecture"
        tabIndex={0}
        onClick={toggle}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle();
          }
        }}
        className="relative isolate aspect-[2/1] min-h-[320px] w-full cursor-pointer select-none overflow-hidden rounded-md border border-border/60 bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >

        {/* ═════════ 01 — the die (motherboard mounted) ═════════ */}
        <svg
          viewBox="0 0 880 440"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Isometric cutaway of an N-channel MOSFET soldered to motherboard"
          className={`absolute inset-0 h-full w-full transition-[opacity,filter] duration-500 ${sw(scene === 0)}`}
        >
          <defs>
            <filter id={`glow-${id}`} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id={`fade-${id}`} gradientUnits="userSpaceOnUse" cx="0" cy="0" r="340">
              <stop offset="0" stopColor="#fff" />
              <stop offset="1" stopColor="#000" />
            </radialGradient>
            <mask id={`mask-${id}`} maskUnits="userSpaceOnUse" x="-440" y="-260" width="880" height="520">
              <rect x="-440" y="-260" width="880" height="520" fill={`url(#fade-${id})`} />
            </mask>
            <radialGradient id={`amb-${id}`}>
              <stop offset="0" style={{ stopColor: GATE, stopOpacity: 0.2 }} />
              <stop offset="1" style={{ stopColor: GATE, stopOpacity: 0 }} />
            </radialGradient>
            <pattern id={`dt-${id}`} width="14" height="14" patternUnits="userSpaceOnUse"
              patternTransform="matrix(0.866 0.5 -0.866 0.5 0 0)">
              <circle cx="7" cy="7" r="0.9" fill="var(--mf-fg)" opacity="0.3" />
            </pattern>
            <pattern id={`df-${id}`} width="14" height="14" patternUnits="userSpaceOnUse"
              patternTransform="matrix(0.866 0.5 0 1 0 0)">
              <circle cx="7" cy="7" r="0.9" fill="var(--mf-fg)" opacity="0.3" />
            </pattern>
          </defs>

          <g transform="translate(440,258)">
            {/* Motherboard PCB Ground Plane (z = 0) */}
            <ellipse cx={0} cy={30} rx={310} ry={155} fill={`url(#amb-${id})`}
              style={{ opacity: active ? 1 : 0, transition: "opacity .6s" }} />
            <g mask={`url(#mask-${id})`}>
              <g fill="none" stroke="var(--mf-line)" strokeWidth={0.8} strokeDasharray="2 5" opacity={0.55}>
                {ticks.map((n) => (
                  <g key={n}>
                    <path d={trace([[n, -300, 0], [n, 300, 0]])} />
                    <path d={trace([[-300, n, 0], [300, n, 0]])} />
                  </g>
                ))}
              </g>
            </g>

            {/* neighbouring footprints, unpopulated */}
            <Block x={-30} y={-230} z={0} w={70} d={70} h={10} ghost />
            <Block x={40} y={-280} z={0} w={50} d={50} h={8} ghost />

            {/* copper traces on the board */}
            <PcbTrace d={drainTracePath} color={DRAIN} on={active} />
            <PcbTrace d={sourceTracePath} color={active ? SRC : "var(--mf-dim)"} on={active} />
            <PcbTrace d={gateTracePath} color={GATE} on={active} />

            {/* terminal test points */}
            <circle cx={iso(...dEnd)[0]} cy={iso(...dEnd)[1]} r={5} fill="var(--mf-bg)" stroke={DRAIN} strokeWidth={2} />
            <circle cx={iso(...sEnd)[0]} cy={iso(...sEnd)[1]} r={5} fill="var(--mf-bg)" stroke={active ? SRC : "var(--mf-dim)"} strokeWidth={2} />
            <circle cx={iso(...gEnd)[0]} cy={iso(...gEnd)[1]} r={5} fill="var(--mf-bg)" stroke={gc} strokeWidth={2} />

            {/* drain land — sits behind the die's hidden face, so it's drawn first */}
            <CopperPad x={-190} c={0} color={DRAIN} />
            <Fillet a={-184} dir={-1} c={0} />
            <Fillet a={-166} dir={1} c={0} />
            <Lead prof={DRAIN_FOOT} c={0} color={DRAIN} on={active} />

            {/* die, seated on the board */}
            <Block x={-150} y={-100} z={0} w={300} d={200} h={DIE_H} />

            {/* n+ wells, flush with the cut face */}
            <Poly v={fTop(-115, -70, 22, 70, 170)} fill={wellT(DRAIN)} stroke="var(--mf-line)" />
            <Poly v={fFront(-115, 100, 8, 70, 14)} fill={wellF(DRAIN)} stroke="var(--mf-line)" />
            <Poly v={fTop(45, -70, 22, 70, 170)} fill={wellT(SRC)} stroke="var(--mf-line)" />
            <Poly v={fFront(45, 100, 8, 70, 14)} fill={wellF(SRC)} stroke="var(--mf-line)" />

            {/* Doping texture on die faces */}
            <polygon points={pts(fTop(-150, -100, 22, 300, 200))} fill={`url(#dt-${id})`} />
            <polygon points={pts(fFront(-150, 100, 0, 300, 22))} fill={`url(#df-${id})`} />
            <FaceText x={-80} y={100} z={11}>n+</FaceText>
            <FaceText x={80} y={100} z={11}>n+</FaceText>
            <FaceText x={0} y={100} z={4}>p-type substrate</FaceText>

            {/* Inversion channel (lights up flush on die surface when active) */}
            <g filter={glow} style={{ opacity: active ? 1 : 0, transition: "opacity .45s" }}>
              <Poly v={fTop(-45, -76, 22, 90, 152)} fill={mix(SRC, 60, "var(--mf-top)")} />
              <Poly v={fFront(-45, 100, 18, 90, 4)} fill={SRC} stroke={SRC} />
            </g>

            {/* Channel length dimension callout */}
            <g fill="none" stroke="var(--mf-dim)" strokeWidth={0.9}>
              <path d={trace([[-45, 118, 0], [45, 118, 0]])} />
              <path d={trace([[-45, 113, 0], [-45, 123, 0]])} />
              <path d={trace([[45, 113, 0], [45, 123, 0]])} />
            </g>
            <FaceText x={0} y={118} z={-9}>channel length</FaceText>

            {/* drain: metal run across the die onto the n+ contact */}
            <Lead prof={DRAIN_RUN} c={0} color={DRAIN} on={active} />
            <Contact x={-80} color={DRAIN} />

            {/* gate lead: lands on a poly extension tucked under the gate's back
              end, runs behind the gate, and drops over the visible +x edge */}
            <CopperPad x={162} c={GATE_Y} color={GATE} />
            <Fillet a={184} dir={1} c={GATE_Y} />
            <Fillet a={166} dir={-1} c={GATE_Y} />
            <Lead prof={GATE_LEAD} c={GATE_Y} color={GATE} on={active} />
            <Block x={24} y={-96} z={DIE_H} w={28} d={20} h={5}
              c={{ t: mix(GATE, active ? 34 : 16, "var(--mf-top)"), f: mix(GATE, 18), s: mix(GATE, 10) }}
              stroke={mix(GATE, active ? 75 : 40, "var(--mf-line)")} />

            {/* gate stack: thin oxide + polysilicon gate */}
            <Block x={-48} y={-80} z={DIE_H} w={96} d={160} h={4}
              c={{ t: mix(GATE, 14, "var(--mf-top)"), f: mix(GATE, 10), s: mix(GATE, 6) }} />
            <g className="mf-hit">
              <g filter={active ? glow : undefined}>
                <Block x={-44} y={-76} z={26} w={88} d={152} h={14} c={gateC}
                  stroke={active ? GATE : "var(--mf-line)"} />
              </g>
              {/* generous hit area, kept outside the filter */}
              <polygon points={pts(fTop(-48, -80, 40, 96, 160))} fill="none" pointerEvents="all" />
            </g>

            {!touched && (
              <circle cx={iso(...gPin)[0]} cy={iso(...gPin)[1]} fill="none" stroke={GATE} strokeWidth={1}>
                <animate attributeName="r" values="3;14" dur="1.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.9;0" dur="1.8s" repeatCount="indefinite" />
              </circle>
            )}

            {/* source: n+ contact, run across the die, gull-wing down to its land */}
            <CopperPad x={162} c={0} color={SRC} />
            <Fillet a={184} dir={1} c={0} />
            <Fillet a={166} dir={-1} c={0} />
            <Lead prof={SRC_LEAD} c={0} color={SRC} on={active} />
            <Contact x={80} color={SRC} />

            {/* charge carriers ride the actual lead geometry */}
            {live && (
              <g filter={glow}>
                <Pulse path={drainPulsePath} color={DRAIN} dur={2.2} />
                <Pulse path={trace([[-80, 100, 20], [80, 100, 20]])} color={SRC} dur={1.1} n={3} />
                <Pulse path={sourcePulsePath} color={SRC} dur={2.2} />
                <Pulse path={gatePulsePath} color={GATE} dur={2.6} n={1} />
              </g>
            )}

            {/* terminals */}
            <Tag x={iso(...dEnd)[0] - 12} y={iso(...dEnd)[1]} align="end" title="success" color={DRAIN} />
            <Tag x={iso(...sEnd)[0] + 12} y={iso(...sEnd)[1]} align="start" title="life" color={active ? SRC : DIM} />
            <Tag x={iso(...gEnd)[0] + 12} y={iso(...gEnd)[1]} align="start" title="hard work" color={gc} />
          </g>
        </svg>

        {/* ═════════ 02 — the symbol (schematic) ═════════ */}
        <svg
          viewBox="0 0 880 440"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Schematic symbol of an N-channel MOSFET"
          className={`absolute inset-0 h-full w-full transition-[opacity,filter] duration-500 ${sw(scene === 1)}`}
        >
          <defs>
            <filter id={`glow-sym-${id}`} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g transform="translate(440,225)" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <circle cx={-2} r={124} stroke="var(--mf-line)" strokeDasharray="2 6" />
            <circle cx={-2} r={148} stroke="var(--mf-line)" strokeDasharray="1 9" opacity={0.6} />

            {/* leads */}
            <g strokeWidth={2.4} style={{ transition: FADE }}>
              <path d="M-262 0H-34" style={{ stroke: gc }} />
              <path d="M262 -110H30V-48H-14" stroke={DRAIN} />
              <path d="M-14 48H30V110H262" style={{ stroke: cc }} />
            </g>

            {/* gate plate · oxide gap · channel segments */}
            <path d="M-34 -58V58" strokeWidth={3.5} style={{ stroke: gc, transition: FADE }} />
            <g strokeWidth={3.5} style={{ stroke: cc, transition: FADE }}>
              <path d="M-14 -62V-34" />
              <path d="M-14 -14V14" />
              <path d="M-14 34V62" />
            </g>
            <path d="M-14 -48V48" stroke={SRC} strokeWidth={3.5} filter={`url(#glow-sym-${id})`}
              style={{ opacity: active ? 1 : 0, transition: "opacity .45s" }} />
            <text x={-24} y={-70} textAnchor="middle" fontSize={8} fill={DIM} stroke="none">sio₂</text>

            {/* body tied to source, arrow into the channel */}
            <path d="M-14 0H30V48" stroke={DIM} strokeWidth={2} />
            <polygon points="-14,0 -5,-4 -5,4" fill={DIM} stroke="none" />
            <circle cx={30} cy={48} r={2.8} fill={cc} stroke="none" style={{ transition: FADE }} />

            {/* current flow */}
            {active && (
              <g stroke="var(--mf-fg)" strokeWidth={1.3} className="mf-flow">
                <path d="M262 -110H30V-48H-14" />
                <path d="M-14 -48V48" />
                <path d="M-14 48H30V110H262" />
              </g>
            )}
            {active && (
              <path d="M-262 0H-34" stroke="var(--mf-fg)" strokeWidth={1.3} className="mf-flow" />
            )}
            {live && (
              <g stroke="none" filter={`url(#glow-sym-${id})`}>
                <Pulse path="M262 -110H30V-48H-14V48H30V110H262" color={SRC} dur={3.2} n={3} />
              </g>
            )}

            <g stroke="none">
              <Tag x={-278} y={0} align="end" title="hard work" color={gc} />
              <Tag x={278} y={-110} align="start" title="success" color={DRAIN} />
              <Tag x={278} y={110} align="start" title="life" color={active ? SRC : DIM} />
            </g>
          </g>
        </svg>

        {/* ── chrome ── */}
        <div className="absolute left-1/2 top-4 z-10 flex -translate-x-1/2 items-center rounded-full border border-border/60 bg-background/70 p-1 text-[11px] backdrop-blur-sm">
          {([0, 1] as const).map((i) => (
            <React.Fragment key={i}>
              {i === 1 && <span className="mx-1 h-px w-4 bg-border" />}
              <button
                type="button"
                aria-pressed={scene === i}
                onClick={(e) => {
                  e.stopPropagation();
                  pick(i);
                }}
                className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${scene === i
                    ? "border-border bg-muted text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
              >
                {scene === i && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
                0{i + 1}
              </button>
            </React.Fragment>
          ))}
        </div>

        <div className="pointer-events-none absolute bottom-4 left-4 z-10 rounded-full border border-border/60 bg-background/70 px-3 py-1.5 text-[11px] backdrop-blur-sm">
          <span className="text-muted-foreground/70">FIG_020{scene ? "B" : ""}</span>{" "}
          <span className="text-muted-foreground">{scene ? "the symbol" : "the die"}</span>
        </div>

      </div>

      {/* ── Caption in simple English, completely clear of the artwork ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1 text-xs text-muted-foreground">
        <p className="leading-relaxed">
          {active ? (
            <span>
              With <strong className="font-sans font-semibold" style={{ color: GATE }}>hard work</strong>,{" "}
              <strong className="font-sans font-semibold" style={{ color: DRAIN }}>success</strong> flows into{" "}
              <strong className="font-sans font-semibold" style={{ color: SRC }}>life</strong>.
            </span>
          ) : (
            <span>
              Without <strong className="font-sans font-semibold" style={{ color: GATE }}>hard work</strong>,{" "}
              <strong className="font-sans font-semibold" style={{ color: DRAIN }}>success</strong> cannot reach{" "}
              <strong className="font-sans font-semibold text-foreground">life</strong>.
            </span>
          )}
        </p>
        <span className="text-[11px] text-muted-foreground/60 hidden sm:inline">
          click canvas to toggle
        </span>
      </div>
    </div>
  );
}
