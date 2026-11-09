"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { figures } from "@/figures";
import type { FigCli, FigLink, FigTable, Figure, PortState } from "./types";
import {
  cableLine,
  cumulative,
  midpoint,
  type Point,
  pointAt,
  portAnchor,
} from "./geometry";
import {
  Cable,
  CableLabel,
  CliWindow,
  CONDUCTOR,
  DeviceTile,
  PacketChip,
  Port,
  TablePanel,
} from "./parts";

/** viewBox units per ms a packet travels. */
const SPEED = 0.26;
/** Pause at each device a packet passes through. */
const DWELL = 160;
/** Reading time after a step's packets land, while playing. */
const READ_MS = 1900;
const FADE_MS = 260;

const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;

const motionQuery = "(prefers-reduced-motion: reduce)";
function subscribeMotion(cb: () => void) {
  const mq = window.matchMedia(motionQuery);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
const useReducedMotion = () =>
  useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia(motionQuery).matches,
    () => false,
  );

interface Flight {
  line: Point[];
  lengths: number[];
  /** Length along `line` where each hop ends. */
  hopEnds: number[];
  drop: boolean;
}

/** Joins the cables a packet crosses into one line, each hop in travel order. */
function flightFor(fig: Figure, path: string[], drop: boolean): Flight | null {
  const byId = new Map(fig.devices.map((d) => [d.id, d]));
  const line: Point[] = [];
  const hopEnds: number[] = [];
  for (let i = 1; i < path.length; i++) {
    const from = path[i - 1];
    const to = path[i];
    const link = fig.links.find(
      (l) => (l.a === from && l.b === to) || (l.a === to && l.b === from),
    );
    const a = link && byId.get(link.a);
    const b = link && byId.get(link.b);
    if (!link || !a || !b) return null;
    let hop = cableLine(a, b, link);
    if (link.a !== from) hop = [...hop].reverse();
    line.push(...(line.length ? hop.slice(1) : hop));
    hopEnds.push(cumulative(line).at(-1)!);
  }
  if (drop && hopEnds.length) {
    // Stop short of the last device, at its port.
    const start = hopEnds.length > 1 ? hopEnds[hopEnds.length - 2] : 0;
    const end = hopEnds[hopEnds.length - 1];
    hopEnds[hopEnds.length - 1] = end - Math.min(42, (end - start) * 0.4);
  }
  return { line, lengths: cumulative(line), hopEnds, drop };
}

function flightDuration(f: Flight): number {
  let t = 0;
  let prev = 0;
  for (const end of f.hopEnds) {
    t += Math.max((end - prev) / SPEED, 380);
    prev = end;
  }
  return t + DWELL * (f.hopEnds.length - 1);
}

/** Position along the flight at time `t`, in length units; null once it has landed. */
function distanceAt(f: Flight, t: number): number | null {
  let clock = 0;
  let prev = 0;
  for (const end of f.hopEnds) {
    const dur = Math.max((end - prev) / SPEED, 380);
    if (t <= clock + dur)
      return prev + (end - prev) * easeInOut((t - clock) / dur);
    clock += dur;
    if (t <= clock + DWELL) return end;
    clock += DWELL;
    prev = end;
  }
  return null;
}

/** The figure's state at a step: notes, ports, cli and table carry forward. */
function stateAt(fig: Figure, index: number) {
  const notes: Record<string, string> = {};
  const ports: Record<string, PortState> = {};
  let cli: { value: FigCli; step: number } | undefined;
  let table: FigTable | undefined;
  for (let i = 0; i <= index; i++) {
    const s = fig.steps[i];
    Object.assign(notes, s.notes);
    Object.assign(ports, s.ports);
    if (s.cli) cli = { value: s.cli, step: i };
    if (s.table) table = s.table;
  }
  return { notes, ports, cli, table };
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * An animated, step-through network figure. Pass a registered figure `id`
 * (see `src/figures`) or a `figure` object.
 */
export function NetFigure({ id, figure }: { id?: string; figure?: Figure }) {
  const fig = figure ?? (id ? figures[id] : undefined);
  if (!fig) {
    return (
      <p className="rounded-lg border border-dashed border-border p-4 font-mono text-sm text-muted-foreground">
        NetFigure: no figure named “{id}”.
      </p>
    );
  }
  return <FigureView fig={fig} />;
}

function FigureView({ fig }: { fig: Figure }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  // Bumped to replay the current step's packets.
  const [run, setRun] = useState(0);
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const packetRefs = useRef<(SVGGElement | null)[]>([]);
  const started = useRef(false);

  const step = fig.steps[index];
  const last = fig.steps.length - 1;
  const state = useMemo(() => stateAt(fig, index), [fig, index]);
  const hasPanel = useMemo(
    () => fig.steps.some((s) => s.cli || s.table),
    [fig],
  );
  const byId = useMemo(() => new Map(fig.devices.map((d) => [d.id, d])), [fig]);
  const lines = useMemo(
    () =>
      fig.links.map((l) => {
        const a = byId.get(l.a);
        const b = byId.get(l.b);
        return a && b ? cableLine(a, b, l) : null;
      }),
    [fig, byId],
  );
  const flights = useMemo(
    () => (step.packets ?? []).map((p) => flightFor(fig, p.path, !!p.drop)),
    [fig, step],
  );

  // Start playing the first time the figure scrolls into view.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || reduced) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          setPlaying(true);
          setRun((r) => r + 1);
        }
      },
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  // Fly this step's packets, then advance if playing. Writes transforms directly: no re-renders per frame.
  useEffect(() => {
    const els = packetRefs.current;
    const place = (el: SVGGElement, f: Flight, d: number, opacity: number) => {
      const [x, y] = pointAt(f.line, f.lengths, d / f.lengths.at(-1)!);
      el.setAttribute("transform", `translate(${x} ${y})`);
      el.style.opacity = String(opacity);
    };
    const showDrop = (el: SVGGElement, on: boolean) => {
      const x = el.querySelector<SVGGElement>("[data-drop]");
      if (x) x.style.opacity = on ? "1" : "0";
    };

    let frame = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const advance = () => {
      if (!playing) return;
      timer = setTimeout(() => {
        if (index < last) setIndex(index + 1);
        else setPlaying(false);
      }, READ_MS);
    };

    if (reduced || run === 0) {
      // Still frame: each packet sits on its cable mid-flight (or at its drop point).
      flights.forEach((f, i) => {
        const el = els[i];
        if (!f || !el) return;
        place(el, f, f.drop ? f.hopEnds.at(-1)! : f.hopEnds.at(-1)! * 0.5, 1);
        showDrop(el, f.drop);
      });
      if (run > 0) advance();
      return () => clearTimeout(timer);
    }

    const total = Math.max(
      0,
      ...flights.map((f) => (f ? flightDuration(f) : 0)),
    );
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = now - t0;
      flights.forEach((f, i) => {
        const el = els[i];
        if (!f || !el) return;
        const d = distanceAt(f, t);
        if (d !== null) {
          place(el, f, d, Math.min(1, t / 120));
          showDrop(el, false);
          return;
        }
        // Landed: a dropped packet shows its ✕ before fading.
        const after = t - flightDuration(f);
        const hold = f.drop ? 650 : 0;
        place(
          el,
          f,
          f.hopEnds.at(-1)!,
          after < hold ? 1 : Math.max(0, 1 - (after - hold) / FADE_MS),
        );
        showDrop(el, f.drop);
      });
      if (t < total + 650 + FADE_MS) frame = requestAnimationFrame(tick);
      else advance();
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, [flights, index, last, playing, reduced, run]);

  const go = (i: number) => {
    setPlaying(false);
    setIndex(Math.min(Math.max(i, 0), last));
    setRun((r) => r + 1);
  };
  const togglePlay = () => {
    if (playing) return setPlaying(false);
    if (index === last) setIndex(0);
    setPlaying(true);
    setRun((r) => r + 1);
  };

  const focus = step.focus ? new Set(step.focus) : null;
  const linkDim = (l: FigLink) =>
    !!focus && !(focus.has(l.a) && focus.has(l.b));
  const [w, h] = fig.size;

  return (
    <figure
      ref={rootRef}
      className="not-prose my-8 overflow-hidden rounded-xl border border-border bg-background text-foreground"
      aria-label={fig.title}
    >
      {/* header */}
      <header className="flex items-stretch border-b border-border">
        <div
          aria-hidden
          className="w-10 shrink-0 border-r border-border"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, transparent 0 6px, var(--border) 6px 7px)",
          }}
        />
        <div className="px-4 py-3">
          <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">
            Fig · {fig.kicker}
          </div>
          <div className="mt-1 text-[15px] font-semibold tracking-tight text-balance">
            {fig.title}
          </div>
        </div>
      </header>

      {/* stage + panel */}
      <div
        className={cn("grid", hasPanel && "md:grid-cols-[minmax(0,1fr)_17rem]")}
      >
        {/* On phones the stage keeps a readable size and scrolls sideways in its box. */}
        <div className="overflow-x-auto">
          <svg
            viewBox={`0 0 ${w} ${h}`}
            className="block h-auto w-full min-w-[540px]"
            role="img"
            aria-label={`${fig.title}. Step ${index + 1} of ${last + 1}: ${step.caption}`}
            style={{
              backgroundImage:
                "radial-gradient(var(--border) 1px, transparent 1px)",
              backgroundSize: "18px 18px",
            }}
          >
            {fig.links.map((l, i) => {
              const line = lines[i];
              return line ? (
                <Cable
                  key={i}
                  line={line}
                  color={l.color}
                  striped={l.striped}
                  dim={linkDim(l)}
                />
              ) : null;
            })}
            {fig.links.map((l, i) => {
              const line = lines[i];
              if (!line) return null;
              const a = portAnchor(line, true);
              const b = portAnchor(line, false);
              return (
                <g
                  key={i}
                  style={{
                    opacity: linkDim(l) ? 0.35 : 1,
                    transition: "opacity 300ms ease",
                  }}
                >
                  <Port
                    at={a.at}
                    dir={a.dir}
                    name={l.aPort}
                    state={
                      l.aPort ? state.ports[`${l.a}:${l.aPort}`] : undefined
                    }
                  />
                  <Port
                    at={b.at}
                    dir={b.dir}
                    name={l.bPort}
                    state={
                      l.bPort ? state.ports[`${l.b}:${l.bPort}`] : undefined
                    }
                  />
                  {l.label ? (
                    <CableLabel at={midpoint(line)} text={l.label} />
                  ) : null}
                </g>
              );
            })}
            {fig.devices.map((d) => (
              <DeviceTile
                key={d.id}
                kind={d.kind}
                x={d.x}
                y={d.y}
                label={d.label ?? d.id}
                note={state.notes[d.id] ?? d.note}
                dim={!!focus && !focus.has(d.id)}
                labelTop={d.labelTop}
              />
            ))}
            {(step.packets ?? []).map((p, i) => (
              <g
                key={`${index}-${run}-${i}`}
                ref={(el) => {
                  packetRefs.current[i] = el;
                }}
                style={{ opacity: 0 }}
              >
                <PacketChip label={p.label} tag={p.tag} color={p.color} />
              </g>
            ))}
          </svg>
        </div>

        {hasPanel ? (
          <div className="flex min-h-40 flex-col gap-3 border-t border-border p-3 md:border-t-0 md:border-l">
            {state.cli ? (
              <CliWindow
                key={`${state.cli.step}-${run}`}
                cli={state.cli.value}
                animate={!reduced && state.cli.step === index && run > 0}
              />
            ) : null}
            {state.table ? <TablePanel table={state.table} /> : null}
            {!state.cli && !state.table ? (
              <p className="m-auto font-mono text-[11px] text-muted-foreground">
                waiting for traffic…
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* controls + caption */}
      <div className="flex flex-col gap-3 border-t border-border px-4 py-3 sm:flex-row sm:items-center">
        <div className="flex shrink-0 items-center gap-1">
          <ControlButton
            label="Previous step"
            onClick={() => go(index - 1)}
            disabled={index === 0}
          >
            <ChevronLeft className="size-4" />
          </ControlButton>
          <ControlButton
            label={playing ? "Pause" : index === last ? "Replay" : "Play"}
            onClick={togglePlay}
          >
            {playing ? (
              <Pause className="size-4" />
            ) : index === last ? (
              <RotateCcw className="size-4" />
            ) : (
              <Play className="size-4" />
            )}
          </ControlButton>
          <ControlButton
            label="Next step"
            onClick={() => go(index + 1)}
            disabled={index === last}
          >
            <ChevronRight className="size-4" />
          </ControlButton>
          <span className="ml-2 font-mono text-[11px] tabular-nums text-muted-foreground">
            {pad(index + 1)}/{pad(last + 1)}
          </span>
        </div>
        <p
          className="m-0 min-h-[2.6em] flex-1 text-[13.5px] leading-snug text-pretty"
          aria-live="polite"
        >
          {step.caption}
        </p>
      </div>
      <div className="flex gap-1 px-4 pb-3" role="group" aria-label="Steps">
        {fig.steps.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => go(i)}
            aria-label={`Step ${i + 1}`}
            aria-current={i === index ? "step" : undefined}
            className="group flex h-4 flex-1 cursor-pointer items-center"
          >
            <span
              className={cn(
                "h-1 w-full rounded-full transition-colors",
                i <= index
                  ? ""
                  : "bg-border group-hover:bg-muted-foreground/40",
              )}
              style={
                i <= index
                  ? {
                      background:
                        CONDUCTOR[
                          (["orange", "green", "blue", "brown"] as const)[i % 4]
                        ],
                    }
                  : undefined
              }
            />
          </button>
        ))}
      </div>

      {/* text version */}
      <details className="border-t border-border px-4 py-2.5 text-[13px]">
        <summary className="cursor-pointer font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
          Text version
        </summary>
        <ol className="mt-2 mb-1 list-decimal space-y-1 pl-5">
          {fig.steps.map((s, i) => (
            <li key={i}>
              {s.caption}
              {s.cli ? (
                <code className="ml-1 font-mono text-[12px] text-muted-foreground">
                  ({s.cli.device}# {s.cli.cmd})
                </code>
              ) : null}
            </li>
          ))}
        </ol>
      </details>
    </figure>
  );
}

function ControlButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex size-9 cursor-pointer items-center justify-center rounded-md border border-border text-foreground transition-colors hover:bg-muted disabled:cursor-default disabled:opacity-35"
    >
      {children}
    </button>
  );
}
