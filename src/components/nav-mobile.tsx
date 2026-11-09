"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  CornerUpLeftIcon,
  DownloadIcon,
  ExternalLinkIcon,
  FileTextIcon,
  LinkIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useClickSound } from "@/hooks/use-click-sound";
import { haptic } from "@/lib/haptic";
import type { NavGroup } from "@/lib/nav-data";
import type { BottomNavAction, BottomNavConfig } from "./bottom-nav/context";
import { useActiveAnchor } from "./bottom-nav/hooks";
import { ResumeDownloadButton } from "./resume-download-button";

// Phone menu for the bottom bar. What it lists depends on the route config
// published through <PublishBottomNav>: article headings, previous/next lab,
// a primary action, page sections with a scroll-spy highlight, and the
// site-wide Docs / Blog / Projects groups.

const PAGES = [
  { href: "/gallery", label: "Gallery" },
  { href: "/resume", label: "Resume" },
];

// How many children each group shows when nothing page-specific is published.
const GROUP_LIMIT: Record<NavGroup["id"], number> = { docs: 3, blog: 2, projects: 2 };
const TOC_LIMIT = 10;

const anchorId = (href: string) => href.split("#")[1] ?? "";

export default function NavMobile({
  groups = [],
  config,
  onOpenChange,
}: {
  groups?: NavGroup[];
  config: BottomNavConfig | null;
  onOpenChange?: (open: boolean) => void;
}) {
  const [click] = useClickSound();
  const rootRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  // The menu remembers the route it was opened on, so any navigation
  // (including back/forward swipes) closes it without an effect.
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const isOpen = openedAt === pathname;

  const sections = config?.sections;
  const toc = (config?.toc ?? []).filter((t) => t.depth <= 3).slice(0, TOC_LIMIT);
  const dense = Boolean(toc.length || sections);

  const sectionIds = sections ? sections.items.map((s) => anchorId(s.href)) : [];
  const activeSection = useActiveAnchor(sectionIds, Boolean(sections?.spy && isOpen));
  const tocIds = toc.map((t) => anchorId(t.url));
  const activeHeading = useActiveAnchor(tocIds, isOpen && toc.length > 0);

  const setOpen = useCallback(
    (open: boolean) => {
      setOpenedAt(open ? pathname : null);
      onOpenChange?.(open);
    },
    [onOpenChange, pathname]
  );

  const handleToggle = useCallback(() => {
    click();
    haptic();
    setOpen(!isOpen);
  }, [click, isOpen, setOpen]);

  const handleNavigate = (href: string) => {
    click();
    haptic();
    setOpen(false);
    const id = anchorId(href);
    const onSamePage = href.startsWith("#") || href.split("#")[0] === pathname;
    if (id && onSamePage) {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, setOpen]);

  return (
    <div ref={rootRef} className="static">
      {/* shadcn-style overlay: dims and softly blurs the page while the menu is
          open. Portaled to <body> because the bar's transform would otherwise
          make `fixed` position against the bar. Tapping it closes the menu
          through the outside-pointerdown handler. */}
      {isOpen &&
        createPortal(
          <div
            aria-hidden
            data-bottom-nav-overlay
            className="backdrop-fade fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] sm:hidden dark:bg-black/60"
          />,
          document.body
        )}
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={isOpen ? "Close navigation" : "Open navigation"}
        className="group relative flex size-8 cursor-pointer items-center justify-center rounded-lg text-foreground/80 transition-colors hover:bg-muted hover:text-foreground active:scale-95"
      >
        <div className="flex flex-col items-center justify-center gap-1">
          <span className={cn("h-0.5 w-4 rounded-[1px] bg-foreground transition-transform duration-200", isOpen && "translate-y-0.75 rotate-45")} />
          <span className={cn("h-0.5 w-4 rounded-[1px] bg-foreground transition-transform duration-200", isOpen && "-translate-y-0.75 -rotate-45")} />
        </div>
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-label="Navigation menu"
          className="menu-pop absolute bottom-full left-1/2 mb-3 w-[min(22rem,calc(100vw-1.5rem))] -translate-x-1/2 max-h-[min(72vh,calc(100dvh-7rem))] overflow-y-auto overscroll-contain rounded-2xl border border-line bg-background/95 p-2 shadow-2xl backdrop-blur-xl ring-1 ring-border/50"
        >
          {/* Primary action + back link */}
          {(config?.primary || config?.back) && (
            <div className="mb-1 flex flex-col gap-0.5">
              {config.primary && <ActionRow action={config.primary} onDone={() => setOpen(false)} />}
              {config.back && (
                <Link
                  href={config.back.href}
                  onClick={() => handleNavigate(config.back!.href)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground active:bg-muted"
                >
                  <CornerUpLeftIcon className="size-3.5" aria-hidden />
                  {config.back.label}
                </Link>
              )}
            </div>
          )}

          {/* On this page */}
          {toc.length > 0 && (
            <>
              <Label>On this page</Label>
              <div className="flex flex-col gap-0.5">
                {toc.map((item) => {
                  const id = anchorId(item.url);
                  const active = id === activeHeading;
                  return (
                    <a
                      key={item.url}
                      href={item.url}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigate(item.url);
                        history.replaceState(null, "", item.url);
                      }}
                      aria-current={active ? "location" : undefined}
                      className={cn(
                        "flex items-center gap-2 rounded-lg px-3 py-1.5 text-[13px] transition-colors hover:bg-muted/70 active:bg-muted",
                        item.depth === 3 && "pl-6",
                        active ? "bg-muted font-medium text-foreground" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <span className="truncate">{item.title}</span>
                    </a>
                  );
                })}
              </div>
            </>
          )}

          {/* Previous / next */}
          {(config?.prev || config?.next) && (
            <div className="mt-1.5 grid grid-cols-2 gap-1">
              {config.prev ? (
                <Link
                  href={config.prev.href}
                  onClick={() => handleNavigate(config.prev!.href)}
                  className="flex min-w-0 items-center gap-1.5 rounded-lg border border-line px-2.5 py-2 text-xs text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground"
                >
                  <ArrowLeftIcon className="size-3.5 shrink-0" aria-hidden />
                  <span className="truncate">{config.prev.label}</span>
                </Link>
              ) : (
                <span />
              )}
              {config.next && (
                <Link
                  href={config.next.href}
                  onClick={() => handleNavigate(config.next!.href)}
                  className="flex min-w-0 items-center justify-end gap-1.5 rounded-lg border border-line px-2.5 py-2 text-xs text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground"
                >
                  <span className="truncate">{config.next.label}</span>
                  <ArrowRightIcon className="size-3.5 shrink-0" aria-hidden />
                </Link>
              )}
            </div>
          )}

          {/* Page sections with scroll spy */}
          {sections && (
            <>
              <Label>{sections.label}</Label>
              <div className="flex flex-col gap-0.5">
                {sections.items.map((item) => {
                  const active = sections.spy && anchorId(item.href) === activeSection;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => handleNavigate(item.href)}
                      aria-current={active ? "location" : undefined}
                      className={cn(
                        "flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted/70 active:bg-muted",
                        active ? "bg-muted text-foreground" : "text-foreground"
                      )}
                    >
                      <span>{item.label}</span>
                      <span className="font-mono text-[11px] text-muted-foreground/50">#{anchorId(item.href)}</span>
                    </Link>
                  );
                })}
              </div>
            </>
          )}

          {/* Site-wide groups: compact rows when the page already has its own list */}
          {(dense || sections) && <Divider />}
          {groups.map((group) => {
            const groupActive = pathname === group.href || pathname.startsWith(group.href + "/");
            const children = dense ? [] : group.items.slice(0, GROUP_LIMIT[group.id]);
            return (
              <div key={group.id} className={cn(!dense && "mb-1")}>
                <Link
                  href={group.href}
                  onClick={() => handleNavigate(group.href)}
                  aria-current={groupActive ? "page" : undefined}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold transition-colors hover:bg-muted/70 active:bg-muted",
                    groupActive ? "bg-muted text-foreground" : "text-foreground"
                  )}
                >
                  <span>{group.label}</span>
                  <span className="font-mono text-[10px] text-muted-foreground/50">{group.items.length}</span>
                </Link>
                {children.length > 0 && (
                  <div className="ml-3 flex flex-col gap-0.5 border-l border-border/60 pl-1.5">
                    {children.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => handleNavigate(item.href)}
                        aria-current={pathname === item.href ? "page" : undefined}
                        className="flex min-w-0 items-center justify-between gap-2 rounded-md px-2.5 py-1.5 text-[13px] text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground active:bg-muted aria-[current=page]:text-foreground"
                      >
                        <span className="truncate">{item.title}</span>
                        {item.meta && <span className="shrink-0 font-mono text-[10px] text-muted-foreground/50">{item.meta}</span>}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <Label>Pages</Label>
          <div className="flex flex-col gap-0.5">
            {PAGES.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => handleNavigate(item.href)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted/70 active:bg-muted",
                    isActive ? "bg-muted font-semibold text-foreground" : "text-foreground"
                  )}
                >
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-3 pt-1.5 pb-1 font-mono text-[10px] tracking-widest text-muted-foreground/60 uppercase">
      {children}
    </div>
  );
}

function Divider() {
  return <div className="mx-1 my-1.5 h-px bg-border/60" />;
}

const ACTION_ICONS = {
  download: DownloadIcon,
  file: FileTextIcon,
  external: ExternalLinkIcon,
} as const;

/** Renders a BottomNavAction as a menu row (also reused by the bar for its inline button). */
export function ActionRow({
  action,
  onDone,
  compact = false,
  className,
}: {
  action: BottomNavAction;
  onDone?: () => void;
  compact?: boolean;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const base = compact
    ? "inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-foreground transition-colors hover:bg-muted active:scale-95"
    : "flex items-center gap-2 rounded-lg bg-muted/60 px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted active:bg-muted";

  if (action.kind === "copy-url") {
    return (
      <button
        type="button"
        className={cn(base, "cursor-pointer", className)}
        onClick={() => {
          haptic();
          navigator.clipboard
            .writeText(window.location.href)
            .then(() => {
              setCopied(true);
              setTimeout(() => {
                setCopied(false);
                onDone?.();
              }, 1200);
            })
            .catch(() => onDone?.());
        }}
        aria-live="polite"
      >
        {copied ? <CheckIcon className="size-3.5 text-emerald-600" aria-hidden /> : <LinkIcon className="size-3.5" aria-hidden />}
        {copied ? "Copied" : action.label}
      </button>
    );
  }

  if (action.kind === "resume-pdf") {
    return (
      <ResumeDownloadButton className={cn(base, "cursor-pointer", className)} onDone={onDone}>
        <DownloadIcon className="size-3.5" aria-hidden />
        {action.label}
      </ResumeDownloadButton>
    );
  }

  const Icon = ACTION_ICONS[action.icon ?? "file"];
  const external = action.icon === "external" || /^https?:/.test(action.href);
  return (
    <a
      href={action.href}
      download={action.download === true ? "" : action.download || undefined}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer noopener" : undefined}
      onClick={() => {
        haptic();
        onDone?.();
      }}
      className={cn(base, className)}
    >
      <Icon className="size-3.5" aria-hidden />
      {action.label}
    </a>
  );
}
