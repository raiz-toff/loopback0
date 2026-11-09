"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { useClickSound } from "@/hooks/use-click-sound";
import { ImageWithSkeleton } from "./image-with-skeleton";
import type { GalleryImage } from "@/data/gallery";

// Adapted from chanhdai.com's Apple Carousel (MIT, © Chánh Đại):
// Touch swipe + drag carousel with snap-scrolling, floating pill counter,
// active dot indicators, and subtle chevron controls.

export type AppleCarouselProps = {
  images: GalleryImage[];
  className?: string;
  onImageClick?: (index: number) => void;
  onActiveIndexChange?: (index: number) => void;
  /** Load the first slide at high priority (set only for the top post). */
  eager?: boolean;
};

export function AppleCarousel({
  images,
  className,
  onImageClick,
  onActiveIndexChange,
  eager = false,
}: AppleCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const pointerDownPos = useRef<{ x: number; y: number } | null>(null);
  const isSwiping = useRef(false);
  const [click] = useClickSound();

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const width = el.offsetWidth;
    if (width === 0) return;
    const scrollPos = el.scrollLeft;
    const newIndex = Math.round(scrollPos / width);
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < images.length) {
      setActiveIndex(newIndex);
      onActiveIndexChange?.(newIndex);
    }
  }, [activeIndex, images.length, onActiveIndexChange]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollToIndex = (index: number) => {
    click();
    const el = containerRef.current;
    if (!el) return;
    const width = el.offsetWidth;
    el.scrollTo({
      left: width * index,
      behavior: "smooth",
    });
    setActiveIndex(index);
    onActiveIndexChange?.(index);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeIndex > 0) scrollToIndex(activeIndex - 1);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeIndex < images.length - 1) scrollToIndex(activeIndex + 1);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerDownPos.current = { x: e.clientX, y: e.clientY };
    isSwiping.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!pointerDownPos.current) return;
    const deltaX = Math.abs(e.clientX - pointerDownPos.current.x);
    const deltaY = Math.abs(e.clientY - pointerDownPos.current.y);
    if (deltaX > 8 || deltaY > 8) {
      isSwiping.current = true;
    }
  };

  const handlePointerUp = () => {
    // Reset after a brief tick to allow click handler to check
    setTimeout(() => {
      isSwiping.current = false;
      pointerDownPos.current = null;
    }, 50);
  };

  const handleSlideClick = (index: number) => {
    if (isSwiping.current) return;
    onImageClick?.(index);
  };

  if (images.length === 0) return null;

  return (
    <div className={cn("group/carousel relative w-full overflow-hidden rounded-lg select-none", className)}>
      {/* Scrollable Track with touch-pan-y and swipe isolation */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="flex w-full snap-x snap-mandatory overflow-x-auto scroll-smooth scrollbar-none touch-pan-y overscroll-x-contain"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
      >
        {images.map((img, i) => (
          <div
            key={img.id || i}
            onClick={() => handleSlideClick(i)}
            className="relative aspect-[4/5] sm:aspect-[4/5] w-full shrink-0 snap-center cursor-zoom-in bg-muted/20 overflow-hidden"
          >
            {/* Ambient YouTube-style image blur in the background */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-0 overflow-hidden opacity-50 blur-2xl scale-125 saturate-150"
            >
              <Image
                src={img.src}
                alt=""
                fill
                sizes="120px"
                className="object-cover"
              />
            </div>

            <ImageWithSkeleton
              src={img.src}
              alt={img.alt || `Photo ${i + 1}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 680px, 720px"
              fetchPriority={eager && i === 0 ? "high" : "auto"}
              className="relative z-1 object-cover transition-transform duration-300 ease-out group-hover/carousel:scale-[1.01]"
            />
          </div>
        ))}
      </div>

      {/* Floating Counter Pill top-right */}
      {images.length > 1 && (
        <div className="pointer-events-none absolute top-3 right-3 z-10 flex items-center rounded-full bg-black/60 px-2.5 py-1 font-mono text-xs font-medium text-white shadow-sm backdrop-blur-md">
          {activeIndex + 1} / {images.length}
        </div>
      )}

      {/* Prev Button (revealed only on hoverable devices, touch screens swipe natively) */}
      {images.length > 1 && activeIndex > 0 && (
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous photo"
          className="absolute top-1/2 left-3 z-10 -translate-y-1/2 flex size-9 items-center justify-center rounded-full bg-background/85 text-foreground shadow-md backdrop-blur-md transition-[opacity,scale,background-color] duration-150 hover:bg-background hover:scale-105 active:scale-95 [@media(hover:none)]:hidden opacity-0 [@media(hover:hover)]:group-hover/carousel:opacity-100"
        >
          <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}

      {/* Next Button (revealed only on hoverable devices, touch screens swipe natively) */}
      {images.length > 1 && activeIndex < images.length - 1 && (
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next photo"
          className="absolute top-1/2 right-3 z-10 -translate-y-1/2 flex size-9 items-center justify-center rounded-full bg-background/85 text-foreground shadow-md backdrop-blur-md transition-[opacity,scale,background-color] duration-150 hover:bg-background hover:scale-105 active:scale-95 [@media(hover:none)]:hidden opacity-0 [@media(hover:hover)]:group-hover/carousel:opacity-100"
        >
          <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}

      {/* Fluid Dot Navigation at bottom */}
      {images.length > 1 && (
        <div className="pointer-events-none absolute bottom-3 left-0 right-0 z-10 flex justify-center gap-1.5">
          <div className="pointer-events-auto flex items-center gap-1.5 rounded-full bg-black/40 px-2 py-1 backdrop-blur-md">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollToIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-200",
                  i === activeIndex
                    ? "w-4 bg-white"
                    : "w-1.5 bg-white/50 hover:bg-white/80"
                )}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
