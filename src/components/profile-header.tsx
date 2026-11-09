"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { identity } from "@/data/profile";
import StoryCover from "./cover/story-cover";
import FlipSentences from "./flip-sentences";
import { ChevronDownIcon, VerifiedIcon } from "./icons";
import { TimHortonsCup } from "./tim-hortons-cup";
import { useClickSound } from "@/hooks/use-click-sound";
import { HandwrittenArrow, HandwrittenNote } from "./handwritten-note";
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

  const flipSentences: React.ReactNode[] = [
    identity.flipSentences[0],
    <span key="tim-hortons" className="inline-flex items-center gap-1.5">
      <span>I like double double</span>
      <TimHortonsCup className="size-5 sm:size-5.5 shrink-0 -translate-y-px" />
    </span>,
    <span key="yamaha" className="inline-flex items-center">
      <span>I ride a&nbsp;</span>
      <span className="text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1.5">
        Yamaha BWS 125
        <svg viewBox="0 0 1024 1024" className="size-[22px] shrink-0 translate-y-[2px]" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M593.792 253.184l-135.04 49.472-13.952-38.016 135.04-49.472z" fill="#140509"></path><path d="M724.096 242.112c0 7.936-6.4 14.4-14.272 14.4H630.976a14.4 14.4 0 0 1-14.336-14.4V175.104c0-7.872 6.464-14.4 14.336-14.4h78.848c7.872 0 14.272 6.528 14.272 14.4v67.008z" fill="#E1B030"></path><path d="M685.952 242.112a14.4 14.4 0 0 1-14.336 14.4H592.768a14.336 14.336 0 0 1-14.336-14.4V175.104c0-7.872 6.4-14.4 14.336-14.4h78.848c7.872 0 14.336 6.528 14.336 14.4v67.008z" fill="#0008f0"></path><path d="M416.768 468.352c0 7.936-6.4 14.464-14.208 14.464H110.272a14.336 14.336 0 0 1-14.208-14.464v-50.048c0-7.936 6.336-14.4 14.208-14.4H402.56c7.808 0 14.208 6.464 14.208 14.4v50.048z" fill="#33464D"></path><path d="M217.792 736.448l-31.488-20.864 108.928-164.48 31.488 20.864z" fill="#4F6974"></path><path d="M685.824 249.344H615.04c7.104 33.344 38.464 233.408 38.464 233.408s-3.712 56.512-26.048 93.248c-31.424 51.648-47.104 53.312-93.696 60.288-46.528 6.912-123.776-1.088-123.776-1.088-67.008-35.84-16.512-143.424-16.512-143.424l-282.816 5.952c-37.632 9.6-0.256 76.992-0.256 76.992 52.48-25.728 91.264-17.152 121.024 6.336 73.856 19.648 130.752 83.52 142.784 162.624 69.824 1.408 222.976 3.52 254.656-6.528 3.136-108.032 94.656-194.688 207.232-194.688 16.704 0 32.64 1.92 48.064 5.44-47.936-112.832-198.336-298.56-198.336-298.56z" fill="#0008f0"></path><path d="M699.072 585.472l31.552-20.928 108.992 164.224-31.552 20.992z" fill="#4F6974"></path><path d="M396.288 749.76h-39.296c0-91.2-66.176-165.376-147.584-165.376-37.376 0-73.024 15.68-100.288 44.096l-28.416-27.136a177.792 177.792 0 0 1 128.704-56.256c103.04 0 186.88 91.84 186.88 204.672z" fill="#278592"></path><path d="M825.536 869.888a126.72 126.72 0 0 1-126.528-126.592c0-69.696 56.768-126.464 126.528-126.464s126.464 56.768 126.464 126.464a126.656 126.656 0 0 1-126.464 126.592z m0-205.76a79.232 79.232 0 1 0 0 158.464 79.232 79.232 0 0 0 0-158.464z" fill="#425760"></path><path d="M827.072 744.768m-44.096 0a44.096 44.096 0 1 0 88.192 0 44.096 44.096 0 1 0-88.192 0Z" fill="#607385"></path><path d="M204.672 876.544c-73.216 0-132.672-59.52-132.672-132.672s59.52-132.736 132.672-132.736c73.152 0 132.672 59.584 132.672 132.736s-59.584 132.672-132.672 132.672z m0-218.24c-47.168 0-85.632 38.4-85.632 85.568a85.76 85.76 0 0 0 85.632 85.504c47.104 0 85.504-38.4 85.504-85.504 0-47.168-38.4-85.568-85.504-85.568z" fill="#425760"></path><path d="M198.848 744.768m-44.096 0a44.096 44.096 0 1 0 88.192 0 44.096 44.096 0 1 0-88.192 0Z" fill="#607385"></path><path d="M809.856 410.368v133.824a209.28 209.28 0 0 1 74.176 3.776c-16.128-38.336-44.224-88.192-74.176-137.6z" fill="#E1B030"></path><path d="M661.376 737.6h-39.232c0-114.432 90.24-207.68 201.344-207.68 51.456 0 100.48 20.096 137.984 56.64l-27.456 28.16a157.824 157.824 0 0 0-110.592-45.376c-89.344 0-162.048 75.392-162.048 168.256z" fill="#278592"></path></g></svg>
      </span>
    </span>,
    ...identity.flipSentences.slice(1),
  ];

  return (
    <div className="relative screen-line-bottom border-x border-line">
      {/* Handwritten note on the right side pointing to the server room */}
      <HandwrittenNote
        className={cn(
          "left-full ml-3 hidden w-44 flex-col items-start xl:flex transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          isOpen ? "top-20" : "top-1.5"
        )}
        aria-hidden
      >
        <HandwrittenArrow className="size-7 -scale-y-100 -rotate-12 -translate-x-1.5" />
        <span className="ml-2 -rotate-6 whitespace-nowrap">
          play with tux 🐧
        </span>
      </HandwrittenNote>

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
            className="group/expand flex w-full items-center justify-end gap-2.5 sm:gap-3 px-3 py-2 sm:px-4 font-mono text-xs text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground cursor-pointer select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <span className="flex items-center gap-2 min-w-0">
              <span className="size-1.5 rounded-full bg-led-green animate-pulse shrink-0" aria-hidden />
              <span className="select-none text-xs shrink-0" aria-hidden>🐧</span>
              <span className="truncate font-medium text-foreground/90">
                Tux is waiting in the server room
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-background/80 px-2.5 py-0.5 text-[10px] text-muted-foreground transition-all group-hover/expand:border-border group-hover/expand:bg-background group-hover/expand:text-foreground shadow-xs shrink-0">
              <span>Expand</span>
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
