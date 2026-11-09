"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/cn";

export type ImageWithSkeletonProps = ImageProps & {
  wrapperClassName?: string;
  /** Whether to render the visual copyright watermark badge. Default true. */
  watermark?: boolean | "compact";
  /** Custom watermark text if needed. Defaults to "Rajkumar Neupane". */
  watermarkText?: string;
};

export function ImageWithSkeleton({
  className,
  wrapperClassName,
  alt,
  onLoad,
  watermark = true,
  watermarkText = "Rajkumar Neupane",
  ...props
}: ImageWithSkeletonProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  // High-priority (above-the-fold) images skip the fade-in. At opacity 0 the
  // browser doesn't count them for LCP until JS hydrates and onLoad fires.
  const showImmediately =
    props.preload || props.fetchPriority === "high" || props.loading === "eager";

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      className={cn("relative size-full overflow-hidden select-none", wrapperClassName)}
      style={{ WebkitTouchCallout: "none" }}
    >
      {/* ── Animated Skeleton Placeholder ── */}
      {!isLoaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 z-1 flex items-center justify-center bg-muted/70 animate-pulse select-none"
        >
          {/* Shimmer sweep */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent -translate-x-full animate-[shimmer_1.8s_infinite]" />

          {/* Camera / photo wireframe icon */}
          <div className="flex flex-col items-center gap-1.5 text-muted-foreground/40">
            <svg
              className="size-7 stroke-[1.5]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
          </div>
        </div>
      )}

      {/* ── High-Res Image with smooth fade-in ── */}
      <Image
        alt={alt}
        draggable={false}
        className={cn(
          "transition-opacity duration-300 ease-out pointer-events-none select-none",
          isLoaded || showImmediately ? "opacity-100" : "opacity-0",
          className
        )}
        onLoad={(e) => {
          setIsLoaded(true);
          onLoad?.(e);
        }}
        {...props}
      />

      {/* ── Transparent Guard Layer (Blocks direct right-click & drag extraction) ── */}
      <div
        aria-hidden="true"
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        className="pointer-events-none absolute inset-0 z-2 select-none"
      />

      {/* ── Signature Visual Copyright Watermark ── */}
      {watermark && isLoaded && (
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute bottom-2 right-2 sm:bottom-2.5 sm:right-2.5 z-3 flex items-center gap-1 sm:gap-1.5 rounded-md px-1.5 py-0.5 sm:px-2 font-mono text-[9px] sm:text-[10px] tracking-wider uppercase text-white/85 bg-black/45 backdrop-blur-md border border-white/15 select-none shadow-md transition-opacity duration-200",
            watermark === "compact" && "text-[8px] sm:text-[9px] px-1 py-0.2"
          )}
        >
          <span className="font-semibold text-white/95">©</span>
          <span className="font-medium text-white/90">
            {watermark === "compact" ? "RN" : watermarkText}
          </span>
        </div>
      )}
    </div>
  );
}
