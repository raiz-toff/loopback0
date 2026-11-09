'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';
import type { Conductor, DeviceKind, FigCli, FigTable, PortState } from './types';
import { TILE, type Point, toPath } from './geometry';

/** T568B pair colours, the brand palette. */
export const CONDUCTOR: Record<Conductor, string> = {
  orange: '#D9711F',
  green: '#2E7D46',
  blue: '#2B5799',
  brown: '#63452E',
};
export const CREAM = '#F1EBDE';
/** Text colour that passes contrast on each conductor. */
const ON_CONDUCTOR: Record<Conductor, string> = {
  orange: '#18181b',
  green: CREAM,
  blue: CREAM,
  brown: CREAM,
};

const MONO = 'var(--font-geist-mono), ui-monospace, monospace';

/* ── devices ──────────────────────────────────────────────────────────── */

/** Generic 24×24 stroke glyph for a device kind. */
export function DeviceGlyph({ kind }: { kind: DeviceKind }) {
  switch (kind) {
    case 'pc':
      return (
        <>
          <rect x="3" y="4" width="18" height="12" rx="1.5" />
          <path d="M12 16v4M8 20h8" />
        </>
      );
    case 'switch':
      return (
        <>
          <rect x="2" y="6.5" width="20" height="11" rx="2" />
          <path d="M6 10.5h11M15 8.5l2 2-2 2M18 13.5H7M9 11.5l-2 2 2 2" />
        </>
      );
    case 'router':
      return (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 6.5v11M6.5 12h11M10.2 8.3 12 6.5l1.8 1.8M10.2 15.7 12 17.5l1.8-1.8M8.3 10.2 6.5 12l1.8 1.8M15.7 10.2 17.5 12l-1.8 1.8" />
        </>
      );
    case 'server':
      return (
        <>
          <rect x="5" y="3" width="14" height="7.5" rx="1.5" />
          <rect x="5" y="13.5" width="14" height="7.5" rx="1.5" />
          <path d="M8.5 6.75h.01M8.5 17.25h.01" strokeWidth="2.4" />
        </>
      );
    case 'cloud':
      return <path d="M7 18h10a4 4 0 0 0 .5-7.97A5.5 5.5 0 0 0 7 9.5 4.25 4.25 0 0 0 7 18z" />;
  }
}

/** A device tile with its glyph, label and note, centred on (x, y). */
export function DeviceTile({
  kind,
  x,
  y,
  label,
  note,
  dim,
  labelTop,
}: {
  kind: DeviceKind;
  x: number;
  y: number;
  label: string;
  note?: string;
  dim?: boolean;
  labelTop?: boolean;
}) {
  // Label and note stack under the tile, or above it (note on top) when `labelTop`.
  const labelY = labelTop ? y - TILE - (note ? 21 : 8) : y + TILE + 15;
  const noteY = labelTop ? y - TILE - 8 : y + TILE + 28;
  return (
    <g style={{ opacity: dim ? 0.32 : 1, transition: 'opacity 300ms ease' }}>
      <rect
        x={x - TILE}
        y={y - TILE}
        width={TILE * 2}
        height={TILE * 2}
        rx="12"
        className="fill-background stroke-border"
        strokeWidth="1.25"
      />
      <g
        transform={`translate(${x - 14.4} ${y - 14.4}) scale(1.2)`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-foreground"
      >
        <DeviceGlyph kind={kind} />
      </g>
      <text
        x={x}
        y={labelY}
        textAnchor="middle"
        className="fill-foreground"
        style={{ font: `600 11px ${MONO}` }}
      >
        {label}
      </text>
      {note ? (
        <text
          x={x}
          y={noteY}
          textAnchor="middle"
          className="fill-muted-foreground"
          style={{ font: `400 10px ${MONO}` }}
        >
          {note}
        </text>
      ) : null}
    </g>
  );
}

/* ── cables and ports ─────────────────────────────────────────────────── */

/** A cable: an ink sheath round a coloured core; striped cores get cream bands. */
export function Cable({
  line,
  color = 'blue',
  striped,
  dim,
}: {
  line: Point[];
  color?: Conductor;
  striped?: boolean;
  dim?: boolean;
}) {
  const d = toPath(line);
  return (
    <g fill="none" strokeLinejoin="round" style={{ opacity: dim ? 0.28 : 1, transition: 'opacity 300ms ease' }}>
      <path d={d} className="stroke-foreground" strokeWidth="6.5" strokeOpacity="0.85" />
      <path d={d} stroke={CONDUCTOR[color]} strokeWidth="3.5" />
      {striped ? <path d={d} stroke={CREAM} strokeWidth="3.5" strokeDasharray="5 6" /> : null}
    </g>
  );
}

/** Chip at a cable's middle, e.g. `trunk`. */
export function CableLabel({ at, text }: { at: Point; text: string }) {
  const w = text.length * 5.6 + 10;
  return (
    <g transform={`translate(${at[0]} ${at[1]})`}>
      <rect x={-w / 2} y="-8" width={w} height="16" rx="4" className="fill-background stroke-border" />
      <text y="3.2" textAnchor="middle" className="fill-muted-foreground" style={{ font: `500 9px ${MONO}` }}>
        {text}
      </text>
    </g>
  );
}

/** The plug where a cable meets a device, with its interface name and state. */
export function Port({
  at,
  dir,
  name,
  state = 'forwarding',
}: {
  at: Point;
  dir: Point;
  name?: string;
  state?: PortState;
}) {
  // Labels grow away from the device: along the cable, beside it.
  const horizontal = Math.abs(dir[0]) > Math.abs(dir[1]);
  const labelAt: Point = horizontal
    ? [at[0] + (dir[0] > 0 ? -3 : 3), at[1] - 8]
    : [at[0] + 7, at[1] + (dir[1] > 0 ? 10 : -4)];
  const anchor = horizontal ? (dir[0] > 0 ? 'start' : 'end') : 'start';
  const blocking = state === 'blocking';
  const down = state === 'down';
  return (
    <g>
      <rect
        x={at[0] - 4}
        y={at[1] - 4}
        width="8"
        height="8"
        rx="1.5"
        fill={blocking ? CONDUCTOR.orange : undefined}
        className={cn(!blocking && 'fill-background', 'stroke-foreground')}
        strokeWidth="1.25"
        style={{ opacity: down ? 0.4 : 1, transition: 'fill 200ms ease' }}
      />
      {blocking ? (
        <path
          d={`M${at[0] - 2} ${at[1] - 2}l4 4m0-4-4 4`}
          stroke="#18181b"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      ) : null}
      {name ? (
        <text
          x={labelAt[0]}
          y={labelAt[1]}
          textAnchor={anchor}
          className="fill-muted-foreground"
          style={{ font: `400 8.5px ${MONO}` }}
        >
          {blocking ? `${name} BLK` : name}
        </text>
      ) : null}
    </g>
  );
}

/* ── packets ──────────────────────────────────────────────────────────── */

export function packetWidth(label: string, tag?: string): number {
  return label.length * 6 + 14 + (tag ? tag.length * 5.6 + 10 : 0);
}

/**
 * A packet chip centred on (0, 0): an optional dark tag segment, then the label
 * on its conductor colour. The `data-drop` group is the ✕ shown when dropped.
 */
export function PacketChip({ label, tag, color = 'orange' }: { label: string; tag?: string; color?: Conductor }) {
  const w = packetWidth(label, tag);
  const tagW = tag ? tag.length * 5.6 + 10 : 0;
  const x0 = -w / 2;
  return (
    <>
      <rect x={x0 - 1.5} y="-9.5" width={w + 3} height="19" rx="5.5" className="fill-foreground" fillOpacity="0.9" />
      {tag ? (
        <text
          x={x0 + tagW / 2}
          y="3.3"
          textAnchor="middle"
          className="fill-background"
          style={{ font: `600 8.5px ${MONO}` }}
        >
          {tag}
        </text>
      ) : null}
      <rect x={x0 + tagW} y="-8" width={w - tagW} height="16" rx="4" fill={CONDUCTOR[color]} />
      <text
        x={x0 + tagW + (w - tagW) / 2}
        y="3.4"
        textAnchor="middle"
        fill={ON_CONDUCTOR[color]}
        style={{ font: `600 9.5px ${MONO}`, letterSpacing: '0.02em' }}
      >
        {label}
      </text>
      <g data-drop="" style={{ opacity: 0 }}>
        <circle r="9" cy="-17" fill={CONDUCTOR.orange} />
        <path d="M-3.5 -20.5l7 7m0-7-7 7" stroke="#18181b" strokeWidth="1.8" strokeLinecap="round" />
      </g>
    </>
  );
}

/* ── side panels ──────────────────────────────────────────────────────── */

/** A console window that types its command, then prints the output. */
export function CliWindow({ cli, animate }: { cli: FigCli; animate: boolean }) {
  const full = cli.cmd.length;
  const [typed, setTyped] = useState(animate ? 0 : full);

  useEffect(() => {
    if (!animate) return;
    let n = 0;
    const timer = setInterval(() => {
      n += 1;
      setTyped(n);
      if (n >= full) clearInterval(timer);
    }, 28);
    return () => clearInterval(timer);
  }, [animate, full]);

  const done = typed >= full;
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-background">
      <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground">
        <span className="size-1.5 rounded-full" style={{ background: CONDUCTOR.green }} aria-hidden />
        {cli.device} · console
      </div>
      <pre className="m-0 px-3 py-2.5 font-mono text-[11.5px] leading-relaxed whitespace-pre-wrap break-words text-foreground">
        <span className="text-muted-foreground">{cli.device}#</span> {cli.cmd.slice(0, typed)}
        {!done ? <span className="animate-pulse">▍</span> : null}
        {done && cli.out?.length ? `\n${cli.out.join('\n')}` : null}
      </pre>
    </div>
  );
}

/** A small table, e.g. a MAC address table, with new rows marked. */
export function TablePanel({ table }: { table: FigTable }) {
  const fresh = new Set(table.fresh ?? []);
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-background">
      <div className="border-b border-border bg-muted/50 px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground">
        {table.title}
      </div>
      <table className="w-full border-collapse font-mono text-[11px]">
        <thead>
          <tr className="text-left text-muted-foreground">
            {table.cols.map((c) => (
              <th key={c} className="px-3 py-1.5 font-medium">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.length === 0 ? (
            <tr>
              <td colSpan={table.cols.length} className="px-3 py-2 text-muted-foreground">
                (empty)
              </td>
            </tr>
          ) : (
            table.rows.map((row, i) => (
              <tr
                key={row.join('|')}
                className={cn('border-t border-border/60 transition-colors duration-500', fresh.has(i) && 'bg-[#D9711F]/12')}
              >
                {row.map((cell, j) => (
                  <td key={j} className="px-3 py-1.5 text-foreground">
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
