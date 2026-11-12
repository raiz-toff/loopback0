// The Marrow mark: a duplex (zipcord) fibre seen end-on, in pixels. Two
// strands share one figure-8 jacket. The glass core of each strand is the
// "marrow". The portfolio's own brand is copper (RJ45, T568B); Marrow's is
// fibre, with jacket colours from TIA-598-C.

/** TIA-598-C jacket colours for fibre patch cords. */
export const FIBRE_JACKET = {
  /** OM3 / OM4 multimode. Marrow's main colour. */
  aqua: "#19A9B8",
  /** OS2 single-mode. */
  yellow: "#E8B923",
  /** OM4+. */
  violet: "#7046A6",
  /** OM5. */
  lime: "#8BC53F",
} as const;

// J jacket, C cladding, A the transmit core, B the receive core.
const DUPLEX = [
  "..JJJJJ....JJJJJ..",
  ".JJJJJJJ..JJJJJJJ.",
  "JJJCCCJJJJJJCCCJJJ",
  "JJCCCCCJJJJCCCCCJJ",
  "JJCCACCJJJJCCBCCJJ",
  "JJCCCCCJJJJCCCCCJJ",
  "JJJCCCJJJJJJCCCJJJ",
  ".JJJJJJJ..JJJJJJJ.",
  "..JJJJJ....JJJJJ..",
];

const CLADDING = "#3f3f46";
const DARK_CORE = "#18181b";

/**
 * The Marrow mark, 18 x 9 pixels.
 *
 * @param jacket - Jacket colour. Defaults to aqua.
 * @param lit - Colour of the transmit core. Pass `null` for a dark fibre (link down).
 * @returns A decorative SVG. Size it with `className`; a height that is a multiple of 9 px keeps the pixels crisp.
 */
export function MarrowMark({
  jacket = FIBRE_JACKET.aqua,
  lit = "#ffffff",
  className,
}: {
  jacket?: string;
  lit?: string | null;
  className?: string;
}) {
  const colour: Record<string, string> = { J: jacket, C: CLADDING, A: lit ?? DARK_CORE, B: DARK_CORE };
  return (
    <svg viewBox="0 0 18 9" shapeRendering="crispEdges" aria-hidden className={className}>
      {DUPLEX.flatMap((row, y) =>
        row.split("").map((c, x) => (c === "." ? null : <rect key={`${x}.${y}`} x={x} y={y} width={1} height={1} fill={colour[c]} />)),
      )}
    </svg>
  );
}
