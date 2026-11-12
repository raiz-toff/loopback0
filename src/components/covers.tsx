/* eslint-disable @next/next/no-img-element */
import { ConductorStripe } from "@/components/conductor-stripe";
import { HandwrittenArrow } from "@/components/handwritten-note";
import RNMark from "@/components/rn-mark";
import { pixelLayout } from "@/lib/pixel-text";

// Brand covers, drawn at the share-card ratio (1200 x 630) and sized in
// container units so one component works as a card image at any width.
// Colours are the fixed brand hexes: a cover is an image, it does not theme.

const PAPER = "#E8E4DA";
const INK = "#18181b";

/**
 * Text in the brand's block lettering.
 *
 * @param text - Letters A to Z and spaces; other characters render blank.
 * @param color - Fill colour of the lit cells. Defaults to brand ink.
 * @returns An SVG that scales to the width or height given through `props`.
 */
export function PixelText({ text, color = INK, ...props }: { text: string; color?: string } & React.ComponentProps<"svg">) {
  const { width, height, cells } = pixelLayout(text);
  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMinYMid meet" role="img" aria-label={text} {...props}>
      {cells.map((c) => (
        <rect key={`${c.x}-${c.y}`} x={c.x} y={c.y} width="9" height="9" fill={color} />
      ))}
    </svg>
  );
}

/**
 * Nameplate cover: the composition of public/social.png, with a subject in
 * place of the name. RN mark, block-lettered name, rule, label, conductor stripe.
 *
 * @param name - Short subject name, set large. Letter size steps down as it gets longer.
 * @param label - One short line under the rule.
 * @returns A 1200:630 block that fills its container's width.
 */
export function NameplateCover({ name, label }: { name: string; label: string }) {
  const nameWidth = Math.min(57, name.length * 9.5);
  const labelWidth = Math.min(57, label.length * 2.9);
  return (
    <div className="relative aspect-[1200/630] w-full overflow-hidden [container-type:inline-size]" style={{ background: PAPER }}>
      <RNMark className="absolute top-[13cqw] left-[6.5cqw] h-auto w-[25cqw]" />
      <div className="absolute top-[14.5cqw] left-[36cqw]">
        <PixelText text={name} className="block h-auto" style={{ width: `${nameWidth}cqw` }} />
        <div className="my-[2.4cqw] h-px w-[40cqw]" style={{ background: "rgba(24,24,27,.22)" }} />
        <PixelText text={label} color="#77736a" className="block h-auto" style={{ width: `${labelWidth}cqw` }} />
      </div>
      <ConductorStripe className="absolute inset-x-0 bottom-0 h-[2.2cqw]" />
    </div>
  );
}

const HATCH = "repeating-linear-gradient(135deg, transparent 0 7px, rgba(24,24,27,.07) 7px 8px)";
const BROWN = "#63452E";

/**
 * Annotated screenshot cover: a real phone screenshot on the hatched panel,
 * with one handwritten note pointing at the thing to notice.
 *
 * @param src - Root-absolute path of a portrait phone screenshot. Its top is shown.
 * @param alt - Text alternative for the screenshot.
 * @param headline - Short statement set beside the screenshot.
 * @param note - Handwritten note. Keep it to one line of thought.
 * @returns A 1200:630 block that fills its container's width.
 */
export function AnnotatedCover({ src, alt, headline, note }: { src: string; alt: string; headline: string; note: string }) {
  return (
    <div className="relative aspect-[1200/630] w-full overflow-hidden [container-type:inline-size]" style={{ background: PAPER, color: INK }}>
      <div className="absolute inset-0" style={{ backgroundImage: HATCH }} />
      <div
        className="absolute top-[7cqw] right-[8cqw] w-[31cqw] overflow-hidden rounded-t-[3cqw] border-[0.5cqw] border-b-0 shadow-xl"
        style={{ borderColor: INK, height: "60cqw" }}
      >
        <img src={src} alt={alt} loading="lazy" className="w-full" />
      </div>
      <p className="absolute top-[7cqw] left-[6.5cqw] max-w-[46cqw] font-semibold" style={{ fontSize: "6.4cqw", lineHeight: 1.05, letterSpacing: "-0.03em" }}>
        {headline}
      </p>
      <p className="absolute top-[36cqw] left-[13cqw] max-w-[36cqw] -rotate-3 font-handwritten" style={{ fontSize: "4.6cqw", lineHeight: 1, color: BROWN }}>
        {note}
      </p>
      <HandwrittenArrow className="absolute top-[30cqw] left-[49cqw] size-[8cqw] -scale-x-100 rotate-[150deg]" style={{ color: BROWN }} />
    </div>
  );
}
