"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useClickSound } from "@/hooks/use-click-sound";
import { haptic } from "@/lib/haptic";
import { PillIcon, PillLabel, pillClass } from "./pill";
import {
  EllipsisIcon,
  LinkChainIcon,
  LinkedInIcon,
  ShareIcon,
  XBrandIcon,
} from "./icons";

export type ShareMenuProps = {
  /** Title passed to the native share sheet. */
  title: string;
  /** URL to share. Relative URLs are resolved against the current origin. */
  url: string;
  /** Menu horizontal alignment relative to button. Default 'end' (right-aligned). */
  align?: "start" | "end";
  triggerClassName?: string;
  iconOnly?: boolean;
};

const itemClass =
  "flex w-full items-center gap-2.5 rounded px-2.5 py-1.5 text-left text-sm whitespace-nowrap transition-colors hover:bg-muted [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground";

const subscribeNever = () => () => {};

export default function ShareMenu({
  title,
  url,
  align = "end",
  triggerClassName,
  iconOnly,
}: ShareMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const canNativeShare = useSyncExternalStore(
    subscribeNever,
    () => "share" in navigator,
    () => false,
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const [click] = useClickSound();

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setIsOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  const absoluteUrl = () =>
    url.startsWith("http") ? url : new URL(url, window.location.origin).toString();

  const copyLink = async () => {
    click();
    try {
      await navigator.clipboard.writeText(absoluteUrl());
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setIsOpen(false);
      }, 1200);
    } catch {
      // clipboard unavailable; leave the menu open so the user can retry
    }
  };

  const intentUrl = (base: string) =>
    `${base}${encodeURIComponent(
      typeof window === "undefined" ? url : absoluteUrl()
    )}`;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label="Share this page"
        aria-expanded={isOpen}
        onClick={() => {
          click();
          haptic();
          setIsOpen((v) => !v);
        }}
        className={triggerClassName || pillClass}
      >
        <ShareIcon className="size-4 shrink-0" />
        {!iconOnly && !triggerClassName && <PillLabel>Share</PillLabel>}
      </button>

      {isOpen && (
        <div
          className={`menu-pop absolute top-full z-50 mt-2 min-w-48 rounded-lg border border-border bg-background p-1.5 shadow-xl ${
            align === "start" ? "left-0" : "right-0"
          }`}
        >
          <button type="button" className={itemClass} onClick={copyLink}>
            <LinkChainIcon />
            {copied ? "Copied!" : "Copy link"}
          </button>

          <a
            className={itemClass}
            href={intentUrl("https://x.com/intent/tweet?url=")}
            target="_blank"
            rel="noopener"
            onClick={() => {
              click();
              setIsOpen(false);
            }}
          >
            <XBrandIcon />
            Share on X
          </a>

          <a
            className={itemClass}
            href={intentUrl("https://www.linkedin.com/sharing/share-offsite?url=")}
            target="_blank"
            rel="noopener"
            onClick={() => {
              click();
              setIsOpen(false);
            }}
          >
            <LinkedInIcon />
            Share on LinkedIn
          </a>

          {canNativeShare && (
            <button
              type="button"
              className={itemClass}
              onClick={() => {
                click();
                navigator.share({ title, url: absoluteUrl() }).catch(() => {});
                setIsOpen(false);
              }}
            >
              <EllipsisIcon />
              Other app
            </button>
          )}
        </div>
      )}
    </div>
  );
}
