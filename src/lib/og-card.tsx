import { readFileSync } from "node:fs";
import { join } from "node:path";
import { pixelTextSvg } from "./pixel-text";

// Share card (1200 x 630) in the brand's nameplate layout: RN mark, a short
// name in block lettering, a rule, one line of plain text, conductor stripe.
// Returned as JSX for next/og's ImageResponse, so it uses only the CSS subset
// that renderer supports (flexbox, absolute positioning, <img>).

const PAPER = "#E8E4DA";
const INK = "#18181b";
const CREAM = "#F1EBDE";

const svgUri = (svg: string) => `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

let mark: string | undefined;
function markUri(): string {
  mark ??= svgUri(readFileSync(join(process.cwd(), "public/logo.svg"), "utf8"));
  return mark;
}

// The eight T568B conductors in pin order; striped ones are banded with cream.
const PINS: [string, boolean][] = [
  ["#D9711F", true],
  ["#D9711F", false],
  ["#2E7D46", true],
  ["#2B5799", false],
  ["#2B5799", true],
  ["#2E7D46", false],
  ["#63452E", true],
  ["#63452E", false],
];

function stripeUri(): string {
  const parts = PINS.map(([color, striped], i) => {
    const x = i * 150;
    if (!striped) return `<rect x="${x}" width="150" height="26" fill="${color}"/>`;
    const bands = [0, 1, 2].map((b) => `<rect x="${x + b * 51}" width="34" height="26" fill="${color}"/>`).join("");
    return `<rect x="${x}" width="150" height="26" fill="${CREAM}"/>${bands}`;
  }).join("");
  return svgUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 26">${parts}</svg>`);
}

/** Longest text shown under the rule; longer text is cut with an ellipsis. */
const MAX_LINE = 150;

/**
 * Builds the share card.
 *
 * @param name - Short name set in block lettering (letters A to Z and spaces). Letter size steps down as it gets longer.
 * @param line - Plain-text line under the rule: a title or a one-sentence description. Font size steps down with length.
 * @returns JSX for `new ImageResponse(..., { width: 1200, height: 630 })`.
 * @throws {Error} When `public/logo.svg` cannot be read.
 */
export function ogCard({ name, line }: { name: string; line?: string | null }) {
  const letters = Math.max(1, name.length);
  const nameWidth = Math.min(690, letters * 114);
  const nameHeight = Math.round((nameWidth * 70) / (letters * 60 - 10));
  const text = line && line.length > MAX_LINE ? `${line.slice(0, MAX_LINE - 1).trimEnd()}…` : line;
  const fontSize = !text ? 0 : text.length <= 48 ? 46 : text.length <= 90 ? 38 : 30;

  return (
    <div style={{ display: "flex", width: "100%", height: "100%", background: PAPER, position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", width: "100%", height: 604, padding: "0 78px" }}>
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img src={markUri()} width={300} height={205} />
        <div style={{ display: "flex", flexDirection: "column", marginLeft: 54, width: 690 }}>
          {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
          <img src={svgUri(pixelTextSvg(name, INK))} width={nameWidth} height={nameHeight} />
          <div style={{ display: "flex", width: 480, height: 2, background: "rgba(24,24,27,0.22)", margin: "30px 0 26px" }} />
          {text ? (
            <div style={{ display: "flex", fontSize, lineHeight: 1.22, color: "#57534e", letterSpacing: "-0.01em" }}>{text}</div>
          ) : null}
        </div>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
      <img src={stripeUri()} width={1200} height={26} style={{ position: "absolute", left: 0, bottom: 0 }} />
    </div>
  );
}
