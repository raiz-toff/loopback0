import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { ConductorStripe } from "@/components/conductor-stripe";
import { PixelText } from "@/components/covers";
import { HandwrittenArrow } from "@/components/handwritten-note";
import { GitHubIcon } from "@/components/icons";
import { FIBRE_JACKET, MarrowMark as Fibre } from "@/components/marrow-mark";
import RNMark from "@/components/rn-mark";
import { cn } from "@/lib/cn";

// Design ideas for the credit strip under every Marrow diagram
// (src/components/docs/topology.tsx). Not linked or indexed.
// Delete once one is chosen.
export const metadata: Metadata = {
  title: "Marrow credit strip — Brand Lab",
  robots: { index: false },
};

const HATCH = "repeating-linear-gradient(135deg, transparent 0 7px, color-mix(in oklab, currentColor 9%, transparent) 7px 8px)";
const PINS = ["#D9711F", "#D9711F", "#2E7D46", "#2B5799", "#2B5799", "#2E7D46", "#63452E", "#63452E"];

/* ── shared bits ─────────────────────────────────────────────────────── */

/** The bottom of a diagram card, with `children` as its strip. Shown at desktop and phone width. */
function Frame({ children }: { children: ReactNode }) {
  const card = (
    <div className="overflow-hidden rounded-xl border border-line bg-background shadow-sm">
      <div
        className="h-24 bg-background"
        style={{ backgroundImage: "radial-gradient(color-mix(in oklab, currentColor 14%, transparent) 1px, transparent 1px)", backgroundSize: "16px 16px" }}
        aria-hidden
      />
      {children}
    </div>
  );
  return (
    <div className="grid gap-4">
      {card}
      <div className="w-[340px] max-w-full">{card}</div>
    </div>
  );
}

function Idea({ n, title, why, children }: { n: string; title: string; why: string; children: ReactNode }) {
  return (
    <section className="mt-12 border-t border-line pt-8">
      <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Idea {n}</div>
      <h2 className="mt-1 text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{why}</p>
      <div className="mt-5">
        <Frame>{children}</Frame>
      </div>
    </section>
  );
}

function Strip({ className, children, style }: { className?: string; children: ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      className={cn("flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-line bg-muted/40 px-3 py-2 text-xs text-muted-foreground", className)}
      style={style}
    >
      {children}
    </div>
  );
}

function Go({ children }: { children: ReactNode }) {
  return (
    <span className="group inline-flex items-center gap-1 font-medium text-foreground">
      {children}
      <ArrowRight className="size-3" />
    </span>
  );
}

function Source() {
  return (
    <span className="ml-auto inline-flex items-center gap-1.5">
      <GitHubIcon className="size-3.5" aria-hidden />
      Source
    </span>
  );
}

const { aqua: AQUA, yellow: YELLOW, violet: VIOLET, lime: LIME } = FIBRE_JACKET;

/* ── page ────────────────────────────────────────────────────────────── */

export default function MarrowCreditLab() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12">
      <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Brand lab</div>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">The credit strip under a Marrow diagram</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        The fibre mark at the top is what the site uses now. Below it are the eight earlier takes built from the portfolio&apos;s own kit, each at desktop and phone width.
      </p>

      <section className="mt-12 border-t border-line pt-8">
        <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Marrow brand · chosen</div>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">Fibre: you are copper, Marrow is glass</h2>
        <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
          Your brand is the RJ45 plug and its T568B colours. Marrow takes the other link standard: fibre. A fibre is a jacket around a glass core, and
          the core is the marrow. The colours come from TIA-598-C, which fixes a jacket colour for each fibre type, the way T568B fixes yours.
        </p>

        <div className="mt-5 grid gap-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4 rounded-xl border border-line p-6" style={{ background: "#18181b", color: "#fafafa" }}>
            <Fibre className="h-[72px] w-auto" />
            <div>
              <PixelText text="Marrow" color="#fafafa" aria-label="Marrow" className="block h-[42px] w-auto" />
              <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: AQUA }}>
                The network, down to the core
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-line p-5">
              <div className="mb-3 font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground">The palette is the jacket code</div>
              <div className="grid gap-2.5 text-xs text-muted-foreground">
                {[
                  [AQUA, "Aqua: OM3 / OM4. The main colour."],
                  [YELLOW, "Yellow: OS2 single-mode. Long links, highlights."],
                  [VIOLET, "Violet: OM4+."],
                  [LIME, "Lime: OM5."],
                ].map(([c, label]) => (
                  <div key={label} className="flex items-center gap-3">
                    <Fibre jacket={c} className="h-[18px] w-auto shrink-0" />
                    {label}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-line p-5">
              <div className="mb-3 font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground">The core carries the state</div>
              <div className="grid gap-2.5 text-xs text-muted-foreground">
                {[
                  ["#ffffff", "Lit: link up"],
                  ["#E8B923", "Amber: degraded"],
                  ["#C8323C", "Red: fault"],
                  [null, "Dark fibre: down, or still compiling"],
                ].map(([c, label]) => (
                  <div key={label} className="flex items-center gap-3">
                    <Fibre lit={c} className="h-[18px] w-auto shrink-0" />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Frame>
            <Strip>
              <Fibre className="h-[18px] w-auto shrink-0" />
              <PixelText text="Marrow" color="currentColor" aria-hidden className="h-[14px] w-auto shrink-0 text-foreground" />
              <span>Curious how this diagram was made?</span>
              <Go>It&apos;s compiled from YAML</Go>
              <Source />
            </Strip>
          </Frame>
        </div>
      </section>

      <Idea n="A" title="Block lettering wordmark" why="MARROW in the 5 x 7 lettering, then the question and the link.">
        <Strip>
          <PixelText text="Marrow" color="currentColor" aria-hidden className="h-[14px] w-auto shrink-0 text-foreground" />
          <span>Curious how this diagram was made?</span>
          <Go>It&apos;s compiled from YAML with Marrow</Go>
          <Source />
        </Strip>
      </Idea>

      <Idea n="B" title="Conductor stripe edge" why="No mark at all. The T568B stripe replaces the strip's top border, so the diagram sits on your signature line. Text stays plain.">
        <ConductorStripe className="h-[3px]" />
        <Strip className="border-t-0">
          <span>Curious how this diagram was made?</span>
          <Go>It&apos;s compiled from YAML with Marrow</Go>
          <Source />
        </Strip>
      </Idea>

      <Idea n="C" title="One line of block lettering" why="The lettering is the whole strip. No sentence, no second link: one pixel line that is the link.">
        <Strip className="justify-between py-2.5">
          <PixelText text="Compiled from YAML with Marrow" color="currentColor" aria-label="Compiled from YAML with Marrow" className="h-[10.5px] w-auto max-w-[calc(100%-1.5rem)] text-foreground" />
          <ArrowRight className="size-3 text-foreground" />
        </Strip>
      </Idea>

      <Idea n="D" title="Handwritten note" why="Your Caveat note and arrow, the same voice as the annotated screenshots. Reads as you talking, not as a footer.">
        <Strip className="py-1.5">
          <HandwrittenArrow className="size-5 -scale-y-100 rotate-[-20deg]" />
          <span className="font-handwritten text-[19px]/none text-foreground">nobody dragged these boxes — it&apos;s compiled from YAML</span>
          <span className="ml-auto">
            <Go>Marrow</Go>
          </span>
        </Strip>
      </Idea>

      <Idea n="E" title="Eight pins" why="The eight T568B conductors as a row of small squares, like the contacts in a plug. Smaller and quieter than the stripe.">
        <Strip>
          <span className="flex shrink-0 gap-[2px]" aria-hidden>
            {PINS.map((c, i) => (
              <span key={i} className="h-3 w-[5px]" style={{ background: i % 2 === 0 ? `linear-gradient(${c} 50%, #F1EBDE 50%)` : c }} />
            ))}
          </span>
          <span>Curious how this diagram was made?</span>
          <Go>It&apos;s compiled from YAML with Marrow</Go>
          <Source />
        </Strip>
      </Idea>

      <Idea n="F" title="Small label, like the rest of the site" why="Geist Mono in small capitals, the style of your section labels. No art; it relies on type alone.">
        <Strip className="font-mono text-[10.5px] uppercase tracking-[0.12em]">
          <span>Diagram</span>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1 text-foreground">
            Compiled from YAML with Marrow
            <ArrowRight className="size-3" />
          </span>
          <span className="ml-auto">Source</span>
        </Strip>
      </Idea>

      <Idea n="G" title="Hatched panel" why="The hatch lines from your panels and covers fill the strip, with the wordmark on top. Ties the diagram card to the cover images.">
        <Strip style={{ backgroundImage: HATCH }}>
          <PixelText text="Marrow" color="currentColor" aria-hidden className="h-[14px] w-auto shrink-0 text-foreground" />
          <Go>How this diagram was made</Go>
          <Source />
        </Strip>
      </Idea>

      <Idea n="H" title="Signed with the RN mark" why="Says the part a recruiter cares about: you built the tool. RN mark, then one sentence.">
        <Strip>
          <RNMark className="h-4 w-auto shrink-0" aria-hidden />
          <span>Drawn by Marrow, a compiler I built.</span>
          <Go>See how it works</Go>
          <Source />
        </Strip>
      </Idea>
    </main>
  );
}
