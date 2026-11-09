"use client";

import React, { useId, useState } from "react";
import { useClickSound } from "@/hooks/use-click-sound";

type P = [number, number];

// Standard 30° / 2:1 isometric projection
const iso = (x: number, y: number, z: number): P => [
  (x - y) * 0.866,
  (x + y) * 0.5 - z,
];

function box(x: number, y: number, z: number, w: number, d: number, h: number) {
  const top = pts([
    iso(x, y, z + h),
    iso(x + w, y, z + h),
    iso(x + w, y + d, z + h),
    iso(x, y + d, z + h),
  ]);
  const right = pts([
    iso(x + w, y, z),
    iso(x + w, y + d, z),
    iso(x + w, y + d, z + h),
    iso(x + w, y, z + h),
  ]);
  const front = pts([
    iso(x, y + d, z),
    iso(x + w, y + d, z),
    iso(x + w, y + d, z + h),
    iso(x, y + d, z + h),
  ]);
  return { top, right, front };
}

const pts = (list: P[]) =>
  list.map(([a, b]) => `${a.toFixed(1)},${b.toFixed(1)}`).join(" ");

interface IsoBlockProps {
  x: number;
  y: number;
  z: number;
  w: number;
  d: number;
  h: number;
  wireframe?: boolean;
  hatchTop?: boolean;
  topFill?: string;
  frontFill?: string;
  rightFill?: string;
  stroke?: string;
  className?: string;
}

function IsoBlock({
  x,
  y,
  z,
  w,
  d,
  h,
  wireframe = false,
  hatchTop = false,
  topFill = "#111111",
  frontFill = "#0a0a0a",
  rightFill = "#0d0d0d",
  stroke = "rgba(255,255,255,0.15)",
  className = "",
}: IsoBlockProps) {
  const f = box(x, y, z, w, d, h);

  if (wireframe) {
    return (
      <g fill="none" stroke={stroke} strokeWidth="1" strokeDasharray="2 4" opacity="0.4">
        <polygon points={f.top} />
        <polygon points={f.right} />
        <polygon points={f.front} />
      </g>
    );
  }

  return (
    <g stroke={stroke} strokeWidth="1" strokeLinejoin="round" className={className}>
      <polygon points={f.front} fill={frontFill} />
      <polygon points={f.right} fill={rightFill} />
      <polygon points={f.top} fill={topFill} />
      {hatchTop && <polygon points={f.top} fill="url(#iso-hatch-grid)" stroke="none" opacity="0.2" />}
    </g>
  );
}

// Generates the isometric floor grid
function IsometricGrid() {
  const lines = [];
  const size = 600;
  const step = 40;
  for (let i = -size; i <= size; i += step) {
    const [x1, y1] = iso(i, -size, -20);
    const [x2, y2] = iso(i, size, -20);
    lines.push(
      <line key={`v${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
    );
    const [x3, y3] = iso(-size, i, -20);
    const [x4, y4] = iso(size, i, -20);
    lines.push(
      <line key={`h${i}`} x1={x3} y1={y3} x2={x4} y2={y4} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
    );
  }
  return <g className="pointer-events-none">{lines}</g>;
}

export default function TransistorCoverGrid({
  className = "",
  ...props
}: React.ComponentProps<"div">) {
  const [active, setActive] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<"3d" | "2d">("3d");
  const [click] = useClickSound?.() ?? [() => {}];
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");

  const toggle = () => {
    click();
    setActive((prev) => !prev);
  };

  // Isometric Pin Coordinates
  const [gateX, gateY] = iso(0, 0, 52);
  const [drainX, drainY] = iso(-80, 0, 24);
  const [sourceX, sourceY] = iso(80, 0, 24);

  // Rigid/Circuit routing for signal traces (matching network cable aesthetic)
  const drainCablePath = `M ${drainX} ${drainY} L ${drainX} ${drainY - 30} L 180 -105 L 310 -105`;
  const sourceCablePath = `M ${sourceX} ${sourceY} L ${sourceX} ${sourceY + 30} L 200 115 L 310 115`;
  const gateCablePath = `M ${gateX} ${gateY} L ${gateX - 40} ${gateY - 20} L -180 75 L -310 75`;
  const channelCarrierPath = `M ${drainX} ${drainY + 6} L ${sourceX} ${sourceY + 6}`;

  // Colors
  const colGate = "#0ea5e9";   // Cyan/Blue
  const colDrain = "#f97316";  // Orange
  const colSource = "#10b981"; // Emerald

  return (
    <div
      className={`relative flex flex-col items-center w-full rounded-xl border border-white/10 bg-[#050505] p-2 sm:p-4 font-mono text-white/90 shadow-2xl transition-all ${className}`}
      {...props}
    >
      {/* ── Top Terminal Bar ── */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 flex items-center rounded-full border border-white/10 bg-black/60 px-4 py-1.5 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        <button
          type="button"
          onClick={() => { click(); setViewMode("3d"); }}
          className={`flex items-center gap-2 text-xs font-mono transition-colors ${viewMode === "3d" ? "text-white" : "text-white/40 hover:text-white/70"}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${viewMode === "3d" ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : "bg-transparent"}`} />
          01
        </button>
        <span className="mx-3 text-white/20">—</span>
        <button
          type="button"
          onClick={() => { click(); setViewMode("2d"); }}
          className={`flex items-center gap-2 text-xs font-mono transition-colors ${viewMode === "2d" ? "text-white" : "text-white/40 hover:text-white/70"}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${viewMode === "2d" ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : "bg-transparent"}`} />
          02
        </button>
      </div>

      {/* ── Main Canvas Viewport ── */}
      <div className="relative w-full overflow-hidden rounded-lg bg-[#080808] border border-white/5 select-none min-h-[450px] flex items-center justify-center">
        
        {/* Toggle Overlay Button */}
        <button
          type="button"
          onClick={toggle}
          className="absolute top-6 right-6 z-10 flex items-center gap-3 rounded-md border border-white/10 bg-[#0a0a0a]/80 px-3 py-2 text-[10px] uppercase tracking-widest backdrop-blur hover:bg-white/5 transition-colors cursor-pointer"
        >
          <div className="flex flex-col items-end gap-1">
            <span className="text-white/40">Bias State</span>
            <span className={active ? "text-emerald-400" : "text-white/40"}>
              {active ? "Conducting" : "Cutoff"}
            </span>
          </div>
          <span className="relative flex h-3 w-3">
            <span className={`absolute inline-flex h-full w-full rounded-full transition-opacity duration-300 ${active ? "animate-ping bg-emerald-500 opacity-40" : "opacity-0"}`} />
            <span className={`relative inline-flex h-3 w-3 rounded-full border border-white/20 ${active ? "bg-emerald-500 shadow-[0_0_12px_#10b981]" : "bg-[#111]"}`} />
          </span>
        </button>

        {/* Bottom Left FIG Tag */}
        <div className="absolute bottom-6 left-6 z-10 rounded-full border border-white/10 bg-[#0a0a0a]/80 px-4 py-1.5 backdrop-blur-md">
          <span className="text-[10px] text-white/50 tracking-wider">
            FIG_013 <span className="text-white/80 ml-2">the mosfet</span>
          </span>
        </div>

        {viewMode === "3d" ? (
          <svg viewBox="-440 -190 880 380" className="relative block h-full w-full max-w-4xl" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="iso-hatch-grid" width="4" height="4" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="4" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              </pattern>
              <filter id={`glow-${id}`} x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" opacity="0.8" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Background Grid */}
            <IsometricGrid />

            <g>
              {/* Reference Bounding Box */}
              <g stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="4 4">
                <line x1="-390" y1="-150" x2="-390" y2="150" />
                <line x1="390" y1="-150" x2="390" y2="150" />
              </g>

              {/* Wireframe background elements (Server-like) */}
              <IsoBlock x={-270} y={-180} z={0} w={65} d={65} h={35} wireframe stroke="rgba(255,255,255,0.1)" />
              <IsoBlock x={190} y={-200} z={0} w={65} d={65} h={75} wireframe stroke="rgba(255,255,255,0.1)" />

              {/* 1. Substrate (p-Silicon) */}
              <IsoBlock
                x={-140} y={-100} z={0} w={280} d={200} h={20}
                hatchTop
                topFill="#0a0a0c"
                frontFill="#050506"
                rightFill="#08080a"
                stroke="rgba(255,255,255,0.15)"
              />

              {/* Substrate Callout */}
              <g transform={`translate(${iso(-140, 100, 0)[0]}, ${iso(-140, 100, 0)[1]})`}>
                <line x1="0" y1="0" x2="-30" y2="20" stroke="rgba(255,255,255,0.3)" strokeDasharray="2 2" />
                <text x="-35" y="24" textAnchor="end" className="text-[9px] fill-white/40 tracking-wider">
                  p-Si BULK
                </text>
              </g>

              {/* 2. Drain Diffusion Well (n+) */}
              <IsoBlock
                x={-115} y={-65} z={10} w={70} d={130} h={14}
                topFill={active ? "#1a1a1a" : "#0d0d0d"}
                frontFill="#111" rightFill="#0a0a0a" stroke="rgba(255,255,255,0.2)"
              />
              <g transform={`translate(${drainX}, ${drainY})`}>
                <ellipse rx="6" ry="3" fill="#222" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                <circle r="2" className={active ? "fill-[#f97316]" : "fill-white/20"} filter={active ? `url(#glow-${id})` : ""} />
              </g>

              {/* 3. Source Diffusion Well (n+) */}
              <IsoBlock
                x={45} y={-65} z={10} w={70} d={130} h={14}
                topFill={active ? "#1a1a1a" : "#0d0d0d"}
                frontFill="#111" rightFill="#0a0a0a" stroke="rgba(255,255,255,0.2)"
              />
              <g transform={`translate(${sourceX}, ${sourceY})`}>
                <ellipse rx="6" ry="3" fill="#222" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                <circle r="2" className={active ? "fill-[#10b981]" : "fill-white/20"} filter={active ? `url(#glow-${id})` : ""} />
              </g>

              {/* 4. Inversion Channel (Target Brackets & Block) */}
              {active ? (
                <g>
                  {/* Corner Target Brackets (like 'core // spine') */}
                  <g stroke={colSource} strokeWidth="1" fill="none" opacity="0.6">
                    <path d={`M ${iso(-55, -75, 18)[0]} ${iso(-55, -75, 18)[1]} l -8 0 l 0 -8`} />
                    <path d={`M ${iso(55, 75, 18)[0]} ${iso(55, 75, 18)[1]} l 8 0 l 0 8`} />
                  </g>
                  <g filter={`url(#glow-${id})`}>
                    <IsoBlock x={-45} y={-65} z={18} w={90} d={130} h={4.5} topFill="rgba(16, 185, 129, 0.8)" frontFill="rgba(16, 185, 129, 0.5)" rightFill="rgba(16, 185, 129, 0.3)" stroke={colSource} />
                  </g>
                </g>
              ) : (
                <IsoBlock x={-45} y={-65} z={18} w={90} d={130} h={4.5} wireframe stroke="rgba(255,255,255,0.1)" />
              )}

              {/* 5. SiO2 Gate Dielectric */}
              <IsoBlock
                x={-42} y={-55} z={20} w={84} d={110} h={5.5}
                topFill="rgba(255,255,255,0.03)" frontFill="rgba(255,255,255,0.01)" rightFill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.1)"
              />

              {/* 6. Gate Electrode */}
              <g onClick={toggle} className="cursor-pointer hover:opacity-90" role="button" tabIndex={0} aria-label="Toggle Bias">
                <IsoBlock
                  x={-42} y={-55} z={25.5} w={84} d={110} h={24}
                  topFill={active ? "#151515" : "#0d0d0d"} frontFill="#0a0a0a" rightFill="#050505"
                  stroke={active ? colGate : "rgba(255,255,255,0.2)"}
                />
                <g transform={`translate(${gateX}, ${gateY})`}>
                  <ellipse rx="6" ry="3" fill="#222" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                  <circle r="2.5" className={active ? "fill-[#0ea5e9]" : "fill-white/20"} filter={active ? `url(#glow-${id})` : ""} />
                </g>
              </g>

              {/* 7. Schematic Data Cables */}
              {/* Drain Cable */}
              <path d={drainCablePath} fill="none" stroke={colDrain} strokeWidth="4" strokeLinecap="square" strokeLinejoin="round" opacity={active ? 0.9 : 0.2} />
              <path d={drainCablePath} fill="none" stroke="#fff" strokeWidth="1.5" strokeDasharray="3 6" strokeLinecap="square" strokeLinejoin="round" opacity={active ? 1 : 0.1} />

              {/* Source Cable */}
              <path d={sourceCablePath} fill="none" stroke={active ? colSource : "rgba(255,255,255,0.2)"} strokeWidth="4" strokeLinecap="square" strokeLinejoin="round" opacity={active ? 0.9 : 0.2} />
              <path d={sourceCablePath} fill="none" stroke="#fff" strokeWidth="1.5" strokeDasharray="3 6" strokeLinecap="square" strokeLinejoin="round" opacity={active ? 1 : 0.1} />

              {/* Gate Cable */}
              <path d={gateCablePath} fill="none" stroke={colGate} strokeWidth="4" strokeLinecap="square" strokeLinejoin="round" opacity={active ? 0.9 : 0.2} />
              <path d={gateCablePath} fill="none" stroke="#fff" strokeWidth="1.5" strokeDasharray="3 6" strokeLinecap="square" strokeLinejoin="round" opacity={active ? 1 : 0.1} />

              {/* Dynamic Data Particles */}
              {active && (
                <g className="pointer-events-none">
                  <circle r="2.5" fill="#fff" filter={`url(#glow-${id})`}>
                    <animateMotion path={drainCablePath} dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle r="2" fill="#fff" filter={`url(#glow-${id})`}>
                    <animateMotion path={channelCarrierPath} dur="0.8s" repeatCount="indefinite" />
                  </circle>
                  <circle r="2.5" fill="#fff" filter={`url(#glow-${id})`}>
                    <animateMotion path={sourceCablePath} dur="2s" begin="0.4s" repeatCount="indefinite" />
                  </circle>
                </g>
              )}

              {/* 8. Breakout Badges (Terminal Style) */}
              {/* Gate */}
              <g transform="translate(-320, 60)">
                <rect x="-10" y="-12" width="10" height="24" rx="2" fill="#111" stroke="rgba(255,255,255,0.1)" />
                <rect x="-6" y="-3" width="6" height="6" rx="3" fill={active ? colGate : "#333"} />
                <text x="-20" y="0" textAnchor="end" className="text-[10px] uppercase tracking-widest fill-white/80">Hard Work</text>
                <text x="-20" y="14" textAnchor="end" className="text-[8px] fill-white/30">GATE // V_GS</text>
              </g>

              {/* Drain */}
              <g transform="translate(320, -115)">
                <rect x="0" y="-12" width="10" height="24" rx="2" fill="#111" stroke="rgba(255,255,255,0.1)" />
                <rect x="2" y="-3" width="6" height="6" rx="3" fill={active ? colDrain : "#333"} />
                <text x="20" y="0" textAnchor="start" className="text-[10px] uppercase tracking-widest fill-white/80">Success</text>
                <text x="20" y="14" textAnchor="start" className="text-[8px] fill-white/30">DRAIN // V_DD</text>
              </g>

              {/* Source */}
              <g transform="translate(320, 105)">
                <rect x="0" y="-12" width="10" height="24" rx="2" fill="#111" stroke="rgba(255,255,255,0.1)" />
                <rect x="2" y="-3" width="6" height="6" rx="3" fill={active ? colSource : "#333"} filter={active ? `url(#glow-${id})` : ""} />
                <text x="20" y="0" textAnchor="start" className={`text-[10px] uppercase tracking-widest transition-colors ${active ? "fill-white" : "fill-white/50"}`}>Life</text>
                <text x="20" y="14" textAnchor="start" className="text-[8px] fill-white/30">SOURCE // OUT</text>
              </g>
            </g>
          </svg>
        ) : (
          /* ══════════════════════════════════════════════════════════
             2D SCHEMATIC VIEW (Minimal Dark Mode)
             ══════════════════════════════════════════════════════════ */
          <svg viewBox="-440 -190 880 380" className="relative block h-full w-full max-w-4xl" xmlns="http://www.w3.org/2000/svg">
            <IsometricGrid />
            <g transform="translate(0, 0)">
              {/* Chassis enclosure */}
              <circle r="95" fill="#080808" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="6 6" />

              {/* Gate Electrode */}
              <line x1="-30" y1="-65" x2="-30" y2="65" stroke={active ? colGate : "#333"} strokeWidth="4" strokeLinecap="square" />

              {/* Drain, Channel, Source Segments */}
              <g stroke={active ? colSource : "#444"} strokeWidth="4" strokeLinecap="square">
                <line x1="-12" y1="-60" x2="-12" y2="-22" />
                <line x1="-12" y1="-14" x2="-12" y2="14" />
                <line x1="-12" y1="22" x2="-12" y2="60" />
              </g>

              {/* Active Conduction Bridge */}
              {active && <line x1="-12" y1="-60" x2="-12" y2="60" stroke={colSource} strokeWidth="4" strokeLinecap="square" />}

              {/* Substrate Electron Arrow */}
              <path d="M 22 0 L -10 0" fill="none" stroke={active ? colSource : "#444"} strokeWidth="2" />
              <polygon points="-4,-4.5 -11,0 -4,4.5" fill={active ? colSource : "#444"} />

              {/* Rigid Diagram Leads */}
              <path d="M -12 -42 L 22 -42 L 22 -90 L 220 -90" fill="none" stroke={active ? colDrain : "#333"} strokeWidth="2.5" strokeLinejoin="round" />
              <path d="M -12 42 L 22 42 L 22 90 L 220 90" fill="none" stroke={active ? colSource : "#333"} strokeWidth="2.5" strokeLinejoin="round" />
              <path d="M -30 0 L -220 0" fill="none" stroke={active ? colGate : "#333"} strokeWidth="2.5" strokeLinejoin="round" />

              {/* Schematic Labels */}
              <text x="-235" y="-4" textAnchor="end" className="text-[10px] uppercase tracking-widest fill-white/80">Hard Work</text>
              <text x="-235" y="12" textAnchor="end" className="text-[8px] fill-white/30">GATE // IN</text>

              <text x="235" y="-94" textAnchor="start" className="text-[10px] uppercase tracking-widest fill-white/80">Success</text>
              <text x="235" y="-78" textAnchor="start" className="text-[8px] fill-white/30">DRAIN // V_DD</text>

              <text x="235" y="86" textAnchor="start" className={`text-[10px] uppercase tracking-widest transition-colors ${active ? "fill-white" : "fill-white/50"}`}>Life</text>
              <text x="235" y="102" textAnchor="start" className="text-[8px] fill-white/30">SOURCE // OUT</text>
            </g>
          </svg>
        )}
      </div>

      {/* ── Terminal Console Output ── */}
      <div className="w-full bg-[#0a0a0a] border border-white/5 rounded-md p-4 flex flex-wrap items-center justify-between gap-4 mt-2">
        <div className="flex items-center gap-4">
          <span className="text-[10px] text-white/40 uppercase tracking-widest">Sys_Log</span>
          <p className="text-xs text-white/60">
            {active ? (
              <>
                <span className="text-[#10b981] font-bold">ACK:</span> Channel conducting. <span className="text-[#0ea5e9]">Hard Work</span> threshold met, resolving <span className="text-[#f97316]">Success</span> into <span className="text-[#10b981]">Life</span> output.
              </>
            ) : (
              <>
                <span className="text-white/40 font-bold">ERR:</span> Subthreshold cutoff. Gate bias low. Output isolated.
              </>
            )}
          </p>
        </div>
        <span className="text-[10px] text-white/20">[ click visual to toggle state ]</span>
      </div>
    </div>
  );
}
