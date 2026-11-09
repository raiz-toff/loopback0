"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import type { NavGroup } from "@/lib/nav-data";
import CommandMenu from "./command-menu";
import NavMobile, { ActionRow } from "./nav-mobile";
import { useBottomNavState } from "./bottom-nav/context";
import { useReadingProgress, useScrolledAway } from "./bottom-nav/hooks";

// Phone-only floating bar. Contents follow the route: pages publish a config
// through <PublishBottomNav>; this reads it, hides while a lightbox is open,
// slides away on downward scroll, and shows reading progress when asked.

export default function SiteBottomNav({ groups }: { groups?: NavGroup[] }) {
  const pathname = usePathname();
  const { config, hidden } = useBottomNavState();
  // Mirrors NavMobile: open state is tied to the route it was opened on.
  const [menuOpenAt, setMenuOpenAt] = useState<string | null>(null);
  const menuOpen = menuOpenAt === pathname;
  const setMenuOpen = (open: boolean) => setMenuOpenAt(open ? pathname : null);
  const scrolledAway = useScrolledAway();
  const progress = useReadingProgress(Boolean(config?.progress));

  // fumadocs pages ship their own mobile search; one is enough.
  const inFumadocsZone = pathname.startsWith("/docs") || pathname.startsWith("/blog");
  const showSearch = config?.showSearch ?? !inFumadocsZone;
  const primary = config?.primary;

  // Docs pages run Flux on phones (own bottom panel) and blog posts carry
  // fumadocs' floating TOC panel; this bar would sit on top of either.
  if (hidden || pathname.startsWith("/docs") || pathname.startsWith("/blog")) return null;

  return (
    <aside
      aria-label="Mobile bottom navigation"
      data-bottom-nav
      className={cn(
        "pointer-events-none fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom,0))] left-1/2 z-50 -translate-x-1/2 transition-[transform,opacity] duration-300 ease-out sm:hidden",
        scrolledAway && !menuOpen && "translate-y-[calc(100%+1.25rem)] opacity-0"
      )}
    >
      <div className="pointer-events-auto relative flex items-center rounded-xl border border-line bg-background/90 py-1 pr-1 pl-1.5 shadow-xl ring-1 ring-border/40 backdrop-blur-md">
        {config?.progress && (
          <span
            aria-hidden
            className="absolute inset-x-2 top-0 h-0.5 origin-left rounded-full bg-foreground/70 transition-transform duration-150"
            style={{ transform: `scaleX(${progress})` }}
          />
        )}

        {showSearch && (
          <>
            <CommandMenu triggerClassName="gap-2 border-none bg-transparent px-1.5 min-w-20 text-muted-foreground hover:bg-transparent hover:text-foreground active:scale-none" />
            <span className="mx-1 h-5 w-px bg-border/80" aria-hidden />
          </>
        )}

        {primary && (
          <>
            <ActionRow action={primary} compact className="max-w-40 truncate" />
            <span className="mx-1 h-5 w-px bg-border/80" aria-hidden />
          </>
        )}

        {!showSearch && !primary && (
          <span className="px-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Menu</span>
        )}

        <NavMobile groups={groups} config={config} onOpenChange={setMenuOpen} />
      </div>
    </aside>
  );
}
