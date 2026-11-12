// The brand's display lettering: 5 x 7 block glyphs, one square per lit cell,
// as used in public/social.png. Shared by the React covers and the generated
// share cards.

const GLYPHS: Record<string, string[]> = {
  A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  B: ["11110", "10001", "10001", "11110", "10001", "10001", "11110"],
  C: ["01110", "10001", "10000", "10000", "10000", "10001", "01110"],
  D: ["11110", "10001", "10001", "10001", "10001", "10001", "11110"],
  E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
  F: ["11111", "10000", "10000", "11110", "10000", "10000", "10000"],
  G: ["01110", "10001", "10000", "10111", "10001", "10001", "01110"],
  H: ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
  I: ["01110", "00100", "00100", "00100", "00100", "00100", "01110"],
  J: ["00111", "00010", "00010", "00010", "00010", "10010", "01100"],
  K: ["10001", "10010", "10100", "11000", "10100", "10010", "10001"],
  L: ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
  M: ["10001", "11011", "10101", "10101", "10001", "10001", "10001"],
  N: ["10001", "11001", "10101", "10011", "10001", "10001", "10001"],
  O: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
  P: ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
  Q: ["01110", "10001", "10001", "10001", "10101", "10010", "01101"],
  R: ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
  S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
  T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
  U: ["10001", "10001", "10001", "10001", "10001", "10001", "01110"],
  V: ["10001", "10001", "10001", "10001", "10001", "01010", "00100"],
  W: ["10001", "10001", "10001", "10101", "10101", "11011", "10001"],
  X: ["10001", "10001", "01010", "00100", "01010", "10001", "10001"],
  Y: ["10001", "10001", "01010", "00100", "00100", "00100", "00100"],
  Z: ["11111", "00001", "00010", "00100", "01000", "10000", "11111"],
};

/** One grid unit in SVG user space; a lit cell is drawn 1 unit smaller to leave a gap. */
const CELL = 10;

export interface PixelLayout {
  /** viewBox width in SVG units */
  width: number;
  /** viewBox height in SVG units */
  height: number;
  /** top-left corner of every lit cell */
  cells: { x: number; y: number }[];
}

/**
 * Lays out `text` in the block lettering.
 *
 * @param text - Letters A to Z and spaces; case is ignored. Any other character renders as a blank cell-width gap.
 * @returns The viewBox size and the position of every lit cell.
 */
export function pixelLayout(text: string): PixelLayout {
  const chars = text.toUpperCase().split("");
  const cells: PixelLayout["cells"] = [];
  chars.forEach((ch, i) => {
    (GLYPHS[ch] ?? []).forEach((row, y) => {
      row.split("").forEach((bit, x) => {
        if (bit === "1") cells.push({ x: (i * 6 + x) * CELL, y: y * CELL });
      });
    });
  });
  return { width: Math.max(1, chars.length * 6 - 1) * CELL, height: 7 * CELL, cells };
}

/**
 * Renders `text` in the block lettering as a standalone SVG document.
 *
 * @param text - See {@link pixelLayout}.
 * @param color - Fill colour of the lit cells.
 * @returns SVG markup, for use where React SVG is not available (share-card images).
 */
export function pixelTextSvg(text: string, color: string): string {
  const { width, height, cells } = pixelLayout(text);
  const rects = cells.map((c) => `<rect x="${c.x}" y="${c.y}" width="${CELL - 1}" height="${CELL - 1}" fill="${color}"/>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">${rects}</svg>`;
}
