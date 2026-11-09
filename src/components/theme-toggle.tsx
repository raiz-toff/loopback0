"use client";

import { useCallback, useEffect } from "react";
import { flushSync } from "react-dom";
import { useTheme } from "next-themes";
import { useClickSound } from "@/hooks/use-click-sound";
import { DarkSideIcon } from "./icons";
import Tooltip from "./tooltip";

export default function ThemeToggle() {
  const [click] = useClickSound();
  // Theme state now lives in next-themes (fumadocs RootProvider) so the docs
  // theme toggle and this one stay in sync; same localStorage "theme" key.
  const { resolvedTheme, setTheme } = useTheme();

  const switchTheme = useCallback(() => {
    flushSync(() => setTheme(resolvedTheme === "dark" ? "light" : "dark"));
  }, [resolvedTheme, setTheme]);

  const handleClick = useCallback(() => {
    click();
    // Paint the button press first, then swap the theme. Inline, the view-
    // transition snapshot plus the flushSync re-render blocked the next
    // paint for ~208ms (INP). Run after that paint, they no longer count.
    // flushSync stays: the view transition needs the DOM updated inside
    // its callback.
    requestAnimationFrame(() => {
      setTimeout(() => {
        const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduceMotion || !document.startViewTransition) switchTheme();
        else document.startViewTransition(switchTheme);
      }, 0);
    });
  }, [click, switchTheme]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === "d" &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey &&
        !e.shiftKey
      ) {
        const target = e.target as HTMLElement | null;
        if (
          target &&
          (target.tagName === "INPUT" ||
            target.tagName === "TEXTAREA" ||
            target.isContentEditable)
        ) {
          return;
        }
        e.preventDefault();
        handleClick();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClick]);

  return (
    <Tooltip label="Toggle mode" shortcut="D" side="bottom">
      <button
        type="button"
        onClick={handleClick}
        aria-label="Toggle theme"
        className="relative flex size-8 items-center justify-center rounded-md border bg-background text-foreground/80 shadow-2xs transition-[background-color,scale] duration-150 ease-out after:absolute after:-inset-1.5 after:content-[''] hover:bg-muted active:scale-[0.96] cursor-pointer"
      >
        <DarkSideIcon className="size-4" />
      </button>
    </Tooltip>
  );
}

