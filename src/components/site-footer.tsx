import { FluidGradientText } from "@/components/fluid-gradient-text";
import { identity, links } from "@/data/profile";
import { ProtectedEmail } from "./protected-contact";
import { ResumeDownloadButton } from "./resume-download-button";
import Tooltip from "@/components/tooltip";
import RNMark from "@/components/rn-mark";
import { HandwrittenArrow, HandwrittenNote } from "@/components/handwritten-note";
import {
  ArrowUpRightIcon,
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
  XBrandIcon,
} from "./icons";

function CornerTicks() {
  return (
    <>
      <span className="absolute -top-1.5 -left-1.5 select-none font-mono text-[10px] text-muted-foreground/40">
        +
      </span>
      <span className="absolute -top-1.5 -right-1.5 select-none font-mono text-[10px] text-muted-foreground/40">
        +
      </span>
      <span className="absolute -bottom-1.5 -left-1.5 select-none font-mono text-[10px] text-muted-foreground/40">
        +
      </span>
      <span className="absolute -bottom-1.5 -right-1.5 select-none font-mono text-[10px] text-muted-foreground/40">
        +
      </span>
    </>
  );
}

export default function SiteFooter() {
  return (
    <footer id="contact" className="max-w-screen overflow-x-clip px-2">
      <div className="mx-auto border-x border-line md:max-w-3xl">
        <div className="stripe-divider h-6 w-full" aria-hidden />

        {/* 2-Column HUD Cards */}
        <div className="screen-line-top grid grid-cols-1 gap-3 p-3 md:grid-cols-2">
          {/* Left Card */}
          <div className="relative border border-line bg-background/80 p-4 font-mono text-xs shadow-xs">
            <CornerTicks />
            <div className="space-y-2.5 text-muted-foreground">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-muted-foreground/70">contact:</span>
                <MailIcon className="size-3.5 shrink-0 text-muted-foreground" />
                <ProtectedEmail emailB64={identity.emailB64} />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-muted-foreground/70">resume:</span>
                <ResumeDownloadButton className="inline-flex cursor-pointer items-center gap-1 rounded border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-500 transition-colors hover:bg-amber-500/20">
                  pdf ↓
                </ResumeDownloadButton>
              </div>
            </div>
          </div>

          {/* Right Card */}
          <div className="relative border border-line bg-background/80 p-4 font-mono text-xs shadow-xs">
            <CornerTicks />
            <div className="space-y-2.5 text-muted-foreground">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-muted-foreground/70">blog:</span>
                <a
                  href={links.blog}
                  className="text-foreground underline decoration-muted-foreground/40 decoration-1 underline-offset-4 transition-colors hover:decoration-foreground"
                >
                  rajkumarneupane.com/blog
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-muted-foreground/70">gallery:</span>
                <a
                  href={links.gallery}
                  className="text-foreground underline decoration-muted-foreground/40 decoration-1 underline-offset-4 transition-colors hover:decoration-foreground"
                >
                  rajkumarneupane.com/gallery
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-muted-foreground/70">labs:</span>
                <a
                  href={links.labs}
                  className="text-foreground underline decoration-muted-foreground/40 decoration-1 underline-offset-4 transition-colors hover:decoration-foreground"
                >
                  rajkumarneupane.com/docs
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-muted-foreground/70">design:</span>
                <a
                  href="https://github.com/ncdai/chanhdai.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-foreground underline decoration-muted-foreground/40 decoration-1 underline-offset-4 transition-colors hover:decoration-foreground"
                >
                  adapted from chanhdai.com (MIT)
                  <ArrowUpRightIcon className="size-3 text-muted-foreground/60" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="screen-line-top grid grid-cols-1 items-center gap-2 px-4 py-3 font-mono text-xs text-muted-foreground/70 sm:grid-cols-3">
          <div className="hidden sm:block" />
          <span className="inline-flex items-center justify-center gap-2 text-center">
            <RNMark className="h-3 w-auto" />
            © 2026 rajkumar neupane
          </span>
          <div className="flex items-center justify-center gap-3 sm:justify-end">
            <Tooltip label="GitHub · raiz-toff" side="top" align="center">
            <a
              href={links.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-muted-foreground transition-colors hover:text-[#A9520F] dark:hover:text-[#E8843A]"
            >
              <GitHubIcon className="size-4" />
            </a>
            </Tooltip>
            <Tooltip label="LinkedIn · rjneupane" side="top" align="center">
            <a
              href={links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-muted-foreground transition-colors hover:text-[#2B5799] dark:hover:text-[#6E97D8]"
            >
              <LinkedInIcon className="size-4" />
            </a>
            </Tooltip>
            <Tooltip label="X" side="top" align="end">
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
              className="text-muted-foreground transition-colors hover:text-[#2E7D46] dark:hover:text-[#4FA36A]"
            >
              <XBrandIcon className="size-4" />
            </a>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Large Fluid Gradient Name Graphic at Footer End */}
      <div className="screen-line-top relative aspect-[2550/560] w-full text-foreground">
        <FluidGradientText />
        <HandwrittenNote className="top-1 right-3 flex items-end text-base sm:top-2 sm:right-6 sm:text-lg" aria-hidden>
          <span className="mb-1.5 -rotate-3 whitespace-nowrap">that&apos;s my name in Nepali</span>
          <HandwrittenArrow className="size-6 translate-y-2 sm:size-7" />
        </HandwrittenNote>
      </div>
    </footer>
  );
}
