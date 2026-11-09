"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useClickSound } from "@/hooks/use-click-sound";
import { MenuIcon, XIcon } from "./icons";

const NAV_ITEMS = [
  { href: "/#about", label: "About" },
  { href: "/#stack", label: "Stack" },
  { href: "/#experience", label: "Experience" },
  { href: "/#certs", label: "Certifications" },
  { href: "/#blog", label: "Blog" },
  { href: "/#lab-log", label: "Lab Log" },
  { href: "/#projects", label: "Projects" },
  { href: "/#contact", label: "Contact" },
];

const EXTERNAL_LINKS = [
  { href: "/docs", label: "Lab Notes (Docs)" },
  { href: "/blog", label: "Technical Blog" },
  { href: "/gallery", label: "Gallery" },
  { href: "/resume", label: "Resume" },
];

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [click] = useClickSound();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const handleNavigate = (hash: string) => {
    click();
    setIsOpen(false);
    if (hash.startsWith("/#")) {
      const el = document.querySelector(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div ref={rootRef} className="relative sm:hidden">
      <button
        type="button"
        onClick={() => {
          click();
          setIsOpen((prev) => !prev);
        }}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        className="relative flex size-8 items-center justify-center rounded-md text-muted-foreground transition-[color,scale] duration-150 ease-out after:absolute after:-inset-1.5 after:content-[''] hover:text-foreground active:scale-[0.96]"
      >
        {isOpen ? <XIcon className="size-4" /> : <MenuIcon className="size-4" />}
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-label="Mobile navigation"
          className="menu-pop absolute top-full right-0 z-50 mt-2 w-56 rounded-lg border border-line bg-background/95 p-1.5 shadow-xl backdrop-blur-md"
        >
          <div className="px-2 py-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">
            Page Sections
          </div>
          <div className="flex flex-col gap-0.5">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                role="menuitem"
                onClick={() => handleNavigate(item.href)}
                className="flex items-center justify-between rounded px-2.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted active:bg-muted"
              >
                <span>{item.label}</span>
                <span className="font-mono text-[11px] text-muted-foreground/60">
                  {item.href.replace("/", "")}
                </span>
              </Link>
            ))}
          </div>

          <div className="my-1.5 h-px bg-line" role="separator" />

          <div className="px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">
            Navigation
          </div>
          <div className="flex flex-col gap-0.5">
            {EXTERNAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                role="menuitem"
                onClick={() => {
                  click();
                  setIsOpen(false);
                }}
                className="flex items-center justify-between rounded px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:bg-muted"
              >
                <span>{link.label}</span>
                <span className="font-mono text-xs text-muted-foreground/50">↗</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
