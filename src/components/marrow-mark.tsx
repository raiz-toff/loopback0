// The Marrow mark: a fibre with its jacket stripped back to the glass core,
// in pixels. The core is the "marrow"; light leaves the cleaved end. The grid
// matches Marrow's own mark (tools/Marrow packages/site/src/chrome/fibre.ts),
// so update both together. The portfolio's own brand is copper (RJ45, T568B);
// Marrow's is fibre, with jacket colours from TIA-598-C.

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

// J jacket, C cladding, A the lit core, L light leaving the cleaved end.
const STRAND = [
  ".JJJJJJJJJ........",
  "JJJJJJJJJJ........",
  "JJJJJJJJJJCCCC....",
  "JAAAAAAAAAAAAC.L..",
  "JAAAAAAAAAAAAC.L.L",
  "JAAAAAAAAAAAAC.L..",
  "JJJJJJJJJJCCCC....",
  "JJJJJJJJJJ........",
  ".JJJJJJJJJ........",
];

const CLADDING = "#3f3f46";
const DARK_CORE = "#18181b";

/**
 * The Marrow mark, 18 x 9 pixels.
 *
 * @param jacket - Jacket colour. Defaults to aqua.
 * @param lit - Colour of the core. Pass `null` for a dark fibre (link down): dark core, no light at the end.
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
  const colour: Record<string, string | undefined> = {
    J: jacket,
    C: CLADDING,
    A: lit ?? DARK_CORE,
    L: lit === null ? undefined : jacket,
  };
  return (
    <svg viewBox="0 0 18 9" shapeRendering="crispEdges" aria-hidden className={className}>
      {STRAND.flatMap((row, y) =>
        row.split("").map((c, x) =>
          c === "." || !colour[c] ? null : <rect key={`${x}.${y}`} x={x} y={y} width={1} height={1} fill={colour[c]} />,
        ),
      )}
    </svg>
  );
}
