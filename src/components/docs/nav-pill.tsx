"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { appName } from "@/lib/shared";
import Tooltip from "@/components/tooltip";

// Brand pill for the fumadocs layouts' title slot. The slot would otherwise
// wrap the title in a single link, so this renders its own two: the RN mark
// goes home, the section name goes to the docs hub. Passed as a component
// (not an element) from client modules only, since functions cannot cross the
// server/client boundary.
export function NavPill({ className }: ComponentProps<"a">) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0 rounded-full border border-fd-border bg-fd-secondary/40 py-1.5 pr-1 pl-2.5 font-medium shadow-sm",
        className
      )}
    >
      <Tooltip label="Front page" side="bottom" align="start">
      <Link
        href="/"
        aria-label="Home"
        className="inline-flex items-center rounded-full pr-2 transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-primary"
      >
        <span
          aria-hidden="true"
          className="size-[22px] shrink-0"
          style={{
            backgroundColor: "var(--color-fd-primary)",
            WebkitMaskImage: "url(/logo.svg)",
            maskImage: "url(/logo.svg)",
            WebkitMaskSize: "contain",
            maskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskPosition: "center",
            transition: "background-color 0.3s ease",
          }}
        />
      </Link>
      </Tooltip>
      <span aria-hidden className="h-4 w-px bg-fd-border/80" />
      <Tooltip label="Labs, projects & CCNA notes" side="bottom">
      <Link
        href="/docs"
        className="rounded-full pr-1.5 pl-2 text-sm font-semibold tracking-tight transition-colors hover:text-fd-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-primary"
      >
        {appName}
      </Link>
      </Tooltip>
    </span>
  );
}
