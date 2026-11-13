// Pixel medium for blog-cover: draw on one grid, export a crisp PNG.
//
// Every shape, letter and stripe sits on the same 80 x 42 grid of 15 px cells
// (1200 x 630), so nothing mixes pixel sizes. Shapes are tested at cell
// centres, which gives clean pixel edges with no anti-aliasing.
//
// Used by render.mjs; a cover file exports `draw(kit)` that returns a grid.

import { pixelLayout } from "../../../src/lib/pixel-text.ts";

/** Grid width in cells. */
export const COLS = 80;
/** Grid height in cells. */
export const ROWS = 42;
/** Cell size in px; COLS * CELL x ROWS * CELL = 1200 x 630. */
export const CELL = 15;

/** Brand palette (AGENTS.md) plus the two shades the medium needs. */
export const C = {
  paper: "#E8E4DA",
  cream: "#F1EBDE",
  ink: "#18181b",
  shade: "#cfc8b8",
  orange: "#D9711F",
  green: "#2E7D46",
  blue: "#2B5799",
  brown: "#63452E",
  // Marrow's fibre brand (tools/Marrow packages/site/src/chrome/fibre.ts): only for Marrow subjects.
  aqua: "#19A9B8",
  aquaDark: "#0B7480",
};

/** T568B conductors in pin order; `true` = the white-banded conductor. */
export const T568B = [
  [C.orange, true], [C.orange, false], [C.green, true], [C.blue, false],
  [C.blue, true], [C.green, false], [C.brown, true], [C.brown, false],
];

/** @returns {(string|null)[][]} An empty grid (null = paper). */
export const blank = () => Array.from({ length: ROWS }, () => Array(COLS).fill(null));

/**
 * Sets one cell; out-of-range cells are ignored.
 * @param {(string|null)[][]} g @param {number} x @param {number} y @param {string|null} color
 */
export function set(g, x, y, color) {
  if (x >= 0 && y >= 0 && x < COLS && y < ROWS) g[y][x] = color;
}

/**
 * Fills every cell whose centre is inside `inside`.
 * @param {(string|null)[][]} g
 * @param {(x: number, y: number) => boolean} inside - Test in cell units.
 * @param {string} color
 */
export function fill(g, inside, color) {
  for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) if (inside(x + 0.5, y + 0.5)) g[y][x] = color;
}

/**
 * Draws a 1-cell outline on the inner edge of a shape. Call it last so fills
 * and shading never eat the edge (outlines are what keep pixel shapes legible).
 */
export function outline(g, inside, color = C.ink) {
  const hit = (x, y) => inside(x + 0.5, y + 0.5);
  for (let y = 0; y < ROWS; y++)
    for (let x = 0; x < COLS; x++)
      if (hit(x, y) && (!hit(x - 1, y) || !hit(x + 1, y) || !hit(x, y - 1) || !hit(x, y + 1))) g[y][x] = color;
}

/**
 * Shades the underside of a shape: cells within `depth` cells of its lower edge.
 */
export function shadeBelow(g, inside, color = C.shade, depth = 2.2) {
  fill(g, (x, y) => inside(x, y) && !inside(x, y + depth), color);
}

// ── shape tests (cell units; combine with union / minus) ──────────────────
export const circle = (cx, cy, r) => (x, y) => (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
export const rect = (x0, y0, x1, y1) => (x, y) => x >= x0 && x <= x1 && y >= y0 && y <= y1;
export const segment = (ax, ay, bx, by, w) => (x, y) => {
  const dx = bx - ax, dy = by - ay;
  const t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(x - (ax + t * dx), y - (ay + t * dy)) <= w;
};
export const union = (...fs) => (x, y) => fs.some((f) => f(x, y));
export const minus = (a, b) => (x, y) => a(x, y) && !b(x, y);

/**
 * Writes `text` in the 5 x 7 block lettering, one letter pixel per grid cell.
 * @param {string} text - Letters A to Z and spaces.
 * @returns {{ width: number, height: number }} Size in cells.
 */
export function letters(g, text, x0, y0, color = C.ink) {
  const { width, cells } = pixelLayout(text);
  cells.forEach(({ x, y }) => set(g, x0 + x / 10, y0 + y / 10, color));
  return { width: width / 10, height: 7 };
}

/** The T568B stripe across the bottom `rows` rows (the signature on every cover). */
export function stripe(g, rows = 2) {
  for (let x = 0; x < COLS; x++) {
    const [color, banded] = T568B[Math.floor((x / COLS) * 8)];
    for (let r = 1; r <= rows; r++) set(g, x, ROWS - r, banded && x % 3 === 2 ? C.cream : color);
  }
}

/**
 * Serialises a grid as SVG (paper background, one rect per horizontal run).
 * @returns {string}
 */
export function toSvg(g) {
  let out = `<rect width="${COLS}" height="${ROWS}" fill="${C.paper}"/>`;
  g.forEach((row, y) => {
    for (let x = 0; x < COLS; ) {
      const c = row[x];
      let n = 1;
      while (x + n < COLS && row[x + n] === c) n++;
      if (c) out += `<rect x="${x}" y="${y}" width="${n}" height="1" fill="${c}"/>`;
      x += n;
    }
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${COLS * CELL}" height="${ROWS * CELL}" viewBox="0 0 ${COLS} ${ROWS}" shape-rendering="crispEdges">${out}</svg>`;
}
