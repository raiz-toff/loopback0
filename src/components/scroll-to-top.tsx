"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUpIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { useIsScrolled } from "@/hooks/use-is-scrolled";
import { useClickSound } from "@/hooks/use-click-sound";
import { haptic } from "@/lib/haptic";
import Tooltip from "@/components/tooltip";

export function ScrollToTop({
  className,
  ...props
}: React.ComponentProps<"button">) {
  // Docs pages carry Flux's bottom panel on phones and blog posts the floating
  // TOC panel; keep the button off both.
  const pathname = usePathname();
  const onDocs = pathname.startsWith("/docs") || pathname.startsWith("/blog");
  const visible = useIsScrolled() === true;
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");
  const [click] = useClickSound();

  useEffect(() => {
    let lastY = typeof window !== "undefined" ? window.scrollY : 0;
    const onScroll = () => {
      const curY = window.scrollY;
      setScrollDirection(curY > lastY ? "down" : "up");
      lastY = curY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    click();
    haptic();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Tooltip
      label="Back to top"
      side="top"
      align="end"
      className={cn(
        "fixed right-4 bottom-[calc(0.75rem+env(safe-area-inset-bottom,0))] z-50 lg:right-8",
        onDocs && "max-sm:hidden",
        !visible && "pointer-events-none"
      )}
    >
    <button
      type="button"
      data-visible={visible}
      data-scroll-direction={scrollDirection}
      aria-label="Scroll to top"
      tabIndex={visible ? 0 : -1}
      onClick={handleClick}
      className={cn(
        "flex size-9 items-center justify-center rounded-xl border border-line bg-background/90 text-foreground/80 shadow-md backdrop-blur-md ring-1 ring-border/40 cursor-pointer select-none",
        "transition-[opacity,visibility,transform,background-color,color] duration-300 active:scale-95 hover:bg-muted hover:text-foreground",
        "data-[scroll-direction=down]:opacity-35 data-[scroll-direction=up]:opacity-100 hover:opacity-100",
        visible
          ? "visible opacity-100 translate-y-0"
          : "invisible opacity-0 pointer-events-none translate-y-2",
        className
      )}
      {...props}
    >
      <ArrowUpIcon className="size-4" />
    </button>
    </Tooltip>
  );
}

export default ScrollToTop;
