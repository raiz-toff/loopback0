import type { FigDevice, FigLink, Route } from './types';

export type Point = [number, number];

/** Half the device tile's side, in viewBox units. */
export const TILE = 26;
/** Corner cut on cable bends. */
const CHAMFER = 8;

/** Waypoints of a cable from `a` to `b`, corners not yet cut. */
function waypoints(a: FigDevice, b: FigDevice, route?: Route): Point[] {
  const aligned = a.x === b.x || a.y === b.y;
  const r = route ?? (aligned ? 'straight' : 'hvh');
  const A: Point = [a.x, a.y];
  const B: Point = [b.x, b.y];
  switch (r) {
    case 'straight':
      return [A, B];
    case 'hv':
      return [A, [b.x, a.y], B];
    case 'vh':
      return [A, [a.x, b.y], B];
    case 'vhv': {
      const my = (a.y + b.y) / 2;
      return [A, [a.x, my], [b.x, my], B];
    }
    default: {
      const mx = (a.x + b.x) / 2;
      return [A, [mx, a.y], [mx, b.y], B];
    }
  }
}

/** Cuts each corner with a straight chamfer, so bends read as cable, not wire. */
function chamfer(points: Point[]): Point[] {
  if (points.length < 3) return points;
  const out: Point[] = [points[0]];
  for (let i = 1; i < points.length - 1; i++) {
    const [px, py] = points[i - 1];
    const [cx, cy] = points[i];
    const [nx, ny] = points[i + 1];
    const inLen = Math.hypot(cx - px, cy - py);
    const outLen = Math.hypot(nx - cx, ny - cy);
    const c = Math.min(CHAMFER, inLen / 2, outLen / 2);
    if (c < 1) {
      out.push(points[i]);
      continue;
    }
    out.push([cx - ((cx - px) / inLen) * c, cy - ((cy - py) / inLen) * c]);
    out.push([cx + ((nx - cx) / outLen) * c, cy + ((ny - cy) / outLen) * c]);
  }
  out.push(points[points.length - 1]);
  return out;
}

/** A cable's centre line from device `a` to device `b`. */
export function cableLine(a: FigDevice, b: FigDevice, link: FigLink): Point[] {
  return chamfer(waypoints(a, b, link.route));
}

export function toPath(points: Point[]): string {
  return points.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join('');
}

/** Where a cable leaves a device's tile, and the unit direction it leaves in. */
export function portAnchor(line: Point[], atStart: boolean): { at: Point; dir: Point } {
  const [p0, p1] = atStart ? [line[0], line[1]] : [line[line.length - 1], line[line.length - 2]];
  const len = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]) || 1;
  const dir: Point = [(p1[0] - p0[0]) / len, (p1[1] - p0[1]) / len];
  // Distance from the centre to the tile's edge along `dir` (square tile).
  const edge = TILE / Math.max(Math.abs(dir[0]), Math.abs(dir[1]));
  return { at: [p0[0] + dir[0] * (edge + 4), p0[1] + dir[1] * (edge + 4)], dir };
}

/** The point halfway along a polyline. */
export function midpoint(line: Point[]): Point {
  return pointAt(line, cumulative(line), 0.5);
}

/** Running length to each point of a polyline. */
export function cumulative(line: Point[]): number[] {
  const out = [0];
  for (let i = 1; i < line.length; i++) {
    out.push(out[i - 1] + Math.hypot(line[i][0] - line[i - 1][0], line[i][1] - line[i - 1][1]));
  }
  return out;
}

/** The point at share `t` (0–1) of a polyline's length. */
export function pointAt(line: Point[], lengths: number[], t: number): Point {
  const total = lengths[lengths.length - 1];
  const d = Math.min(Math.max(t, 0), 1) * total;
  for (let i = 1; i < line.length; i++) {
    if (d <= lengths[i]) {
      const span = lengths[i] - lengths[i - 1] || 1;
      const k = (d - lengths[i - 1]) / span;
      return [
        line[i - 1][0] + (line[i][0] - line[i - 1][0]) * k,
        line[i - 1][1] + (line[i][1] - line[i - 1][1]) * k,
      ];
    }
  }
  return line[line.length - 1];
}
