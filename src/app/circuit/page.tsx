import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import TransistorCover from "@/components/cover/transistor-cover";
import { Panel, PanelContent, PanelHeader, PanelTitle, Separator } from "@/components/panel";
import SiteFooter from "@/components/site-footer";
import ThemeToggle from "@/components/theme-toggle";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Transistor (Hard Work × Success = Life) — Rajkumar Neupane",
  description:
    "An N-channel MOSFET schematic drawn in high school +2 physics: Hard Work at the gate conducts Success into Life. Reconstructed in React and SVG.",
  robots: { index: false, follow: false },
};

export default function CircuitPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return (
    <div className="relative isolate flex-1">
      {/* Sticky Top Header */}
      <header className="sticky top-0 z-50 max-w-screen overflow-x-clip bg-background px-2">
        <div className="screen-line-top screen-line-bottom mx-auto flex h-(--header-height) items-center justify-between border-x border-line px-4 md:max-w-3xl">
          <Link
            href="/"
            className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            ← back to front page
          </Link>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-medium tracking-tight text-muted-foreground sm:text-sm">
              CIRCUIT // +2 MOSFET
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-screen overflow-x-clip px-2 pb-24">
        <div className="mx-auto md:max-w-3xl">
          {/* Header Description Panel */}
          <Panel className="screen-line-bottom-none">
            <PanelContent className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="rounded-full border border-line bg-muted/50 px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                  HIGH SCHOOL +2 ARTIFACT · FIG_MOSFET
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  N-Channel Enhancement Mode
                </span>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-balance">
                  The Transistor
                </h1>
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  High School +2 Physics Artifact · Hard Work × Success = Life
                </p>
              </div>

              <p className="max-w-[65ch] text-sm leading-relaxed text-muted-foreground">
                Reconstructed from high school (+2) science and electronics notes.
                Gate control governs channel conduction: without hard work at the gate,
                success at the drain cannot reach life at the source.
              </p>
            </PanelContent>
          </Panel>

          <Separator />

          {/* Artwork Stage */}
          <Panel>
            <PanelHeader className="flex flex-wrap items-baseline justify-between gap-2">
              <PanelTitle className="text-lg font-medium">
                N-MOSFET Architecture
              </PanelTitle>
              <div className="flex items-center gap-3 font-mono text-xs">
                <a
                  href="/img/high-school-mosfet.svg"
                  download="high-school-mosfet.svg"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  ↓ Download SVG
                </a>
              </div>
            </PanelHeader>

            <PanelContent className="space-y-4">
              <TransistorCover />
            </PanelContent>
          </Panel>

          <Separator />

          {/* Footer Note */}
          <Panel className="screen-line-top-none">
            <PanelContent>
              <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-muted-foreground">
                <Link
                  href="/"
                  className="transition-colors hover:text-foreground"
                >
                  ← return to homepage
                </Link>
                <span className="text-[11px] text-muted-foreground/70">
                  Dev environment only · Draft review page
                </span>
              </div>
            </PanelContent>
          </Panel>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
