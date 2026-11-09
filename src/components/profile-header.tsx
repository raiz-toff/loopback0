"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { identity } from "@/data/profile";
import StoryCover from "./cover/story-cover";
import FlipSentences from "./flip-sentences";
import { ChevronDownIcon, VerifiedIcon } from "./icons";
import Link from "next/link";
import { useClickSound } from "@/hooks/use-click-sound";
import { cn } from "./panel";

const COVER_OPEN_KEY = "portfolio:cover-open";
const subscribeNoop = () => () => {};
const readCoverOpen = () => {
  try {
    return localStorage.getItem(COVER_OPEN_KEY) === "true";
  } catch {
    return false;
  }
};

export default function ProfileHeader() {
  // Saved preference is read without an effect: closed during SSR and
  // hydration, then the stored value. A click overrides it for the session.
  const savedOpen = useSyncExternalStore(subscribeNoop, readCoverOpen, () => false);
  const [override, setOverride] = useState<boolean | null>(null);
  const isOpen = override ?? savedOpen;
  const [playClick] = useClickSound();

  const handleToggle = useCallback(() => {
    playClick();
    const next = !isOpen;
    setOverride(next);
    try {
      localStorage.setItem(COVER_OPEN_KEY, String(next));
    } catch {}
  }, [playClick, isOpen]);

  const flipSentences: React.ReactNode[] = identity.flipSentences;

  return (
    <div className="relative screen-line-bottom border-x border-line">
      {/* Collapsible cover banner container */}
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className={cn(
              "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
              isOpen ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"
            )}
          >
            <figure className="relative block w-full p-2 sm:p-2.5">
              <StoryCover variant="hero" />
              <figcaption className="pointer-events-none absolute right-3 bottom-3 text-xs/none tracking-wide text-muted-foreground/50 tabular-nums select-none sm:right-4 sm:bottom-4">
                Fig. 010
              </figcaption>

              {/* Collapse button */}
              <button
                type="button"
                onClick={handleToggle}
                aria-expanded={isOpen}
                aria-label="Collapse cover to top"
                className="group/btn absolute top-2.5 right-2 sm:top-3.5 sm:right-3.5 z-30 inline-flex items-center gap-1 rounded-full border border-line bg-background/85 px-2 py-0.5 sm:px-2.5 sm:py-1 font-mono text-[10px] text-muted-foreground backdrop-blur-sm transition-all hover:border-border hover:bg-muted/80 hover:text-foreground cursor-pointer select-none shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <span className="text-muted-foreground/80 group-hover/btn:text-foreground">Cover</span>
                <ChevronDownIcon className="size-3 text-muted-foreground transition-transform duration-300 rotate-180 group-hover/btn:-translate-y-0.5 group-hover/btn:text-foreground" />
              </button>
            </figure>
          </div>
        </div>
      </div>

      {/* Slim expand strip when collapsed */}
      <div
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          isOpen
            ? "grid-rows-[0fr] opacity-0 pointer-events-none"
            : "grid-rows-[1fr] opacity-100"
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <button
            type="button"
            onClick={handleToggle}
            aria-expanded={isOpen}
            aria-label="Expand cover banner"
            className="group/expand flex w-full items-center justify-end gap-2 px-3 py-1.5 sm:px-4 text-xs text-muted-foreground/80 transition-colors hover:bg-muted/40 hover:text-foreground cursor-pointer select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-background/80 px-2.5 py-0.5 text-[10px] text-muted-foreground transition-all group-hover/expand:border-border group-hover/expand:bg-background group-hover/expand:text-foreground shadow-xs shrink-0">
              <span>Show cover</span>
              <ChevronDownIcon className="size-3 transition-transform duration-300 group-hover/expand:translate-y-0.5" />
            </span>
          </button>
        </div>
      </div>

      {/* Profile row: Avatar on left, Name & Flip sentences on right */}
      <div className="grid grid-cols-[auto_1fr] border-t border-line">
        {/* Avatar cell */}
        <div className="flex shrink-0 items-end justify-center border-r border-line px-1 sm:px-1.5 pb-2.5 sm:pb-3">
          <div
            className={cn(
              "relative size-28 min-[24rem]:size-32 sm:size-36 lg:size-40 rounded-full z-20",
              "transition-[margin] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
              isOpen ? "-mt-14 sm:-mt-18 lg:-mt-20" : "mt-2.5 sm:mt-3.5"
            )}
          >
            <Image
              src="/img/portrait.jpg"
              alt="Rajkumar Neupane"
              width={160}
              height={160}
              sizes="160px"
              className="block size-full rounded-full object-cover select-none ring-4 ring-background shadow-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97]"
              loading="eager"
              fetchPriority="high"
              onClick={playClick}
            />
          </div>
        </div>

        {/* Name and flip sentences anchored to bottom */}
        <div className="flex flex-col justify-end pb-2.5 sm:pb-3 pl-2.5 sm:pl-3 pr-2">
          <div className="flex items-center gap-2">
            <h1 className="-translate-y-px text-[1.25rem]/tight min-[390px]:text-[1.35rem]/tight font-medium tracking-tight sm:text-2xl md:text-[1.85rem]/none lg:text-[2rem]/none truncate sm:overflow-visible">
              {identity.name}
            </h1>
            <VerifiedIcon
              className="size-4.5 select-none text-led-green/90 shrink-0"
              aria-hidden
            />
            {/* The one action a first-time visitor needs; phones get it from the bottom bar. */}
            <Link
              href="/resume"
              className="ml-auto hidden shrink-0 items-center rounded-lg border border-line bg-background px-3 py-1.5 text-xs font-semibold text-foreground shadow-xs transition-colors hover:bg-muted sm:inline-flex"
            >
              Resume
            </Link>
          </div>

          <FlipSentences
            sentences={flipSentences}
            className="mt-1 flex items-center"
          />
        </div>
      </div>
    </div>
  );
}
