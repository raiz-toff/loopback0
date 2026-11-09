"use client";

import { useHideBottomNav } from "@/components/bottom-nav/context";
import { useEffect, useCallback } from "react";
import Image from "next/image";
import { useClickSound } from "@/hooks/use-click-sound";
import {
  AppleCarouselContent,
  AppleCarouselControls,
  AppleCarouselItem,
  AppleCarouselNext,
  AppleCarouselPlayButton,
  AppleCarouselPrevious,
  AppleCarouselRoot,
  AppleCarouselTab,
  AppleCarouselTabList,
} from "@/components/apple-carousel";
import { ImageWithSkeleton } from "./image-with-skeleton";
import type { GalleryImage, GalleryPost } from "@/data/gallery";
import Tooltip from "@/components/tooltip";

export type LightboxState = {
  post: GalleryPost;
  initialIndex: number;
} | null;

export type GalleryLightboxProps = {
  state: LightboxState;
  currentIndex: number;
  onIndexChange: (newIndex: number) => void;
  onClose: () => void;
};

export function GalleryLightbox({
  state,
  currentIndex,
  onIndexChange,
  onClose,
}: GalleryLightboxProps) {
  const [click] = useClickSound();
  useHideBottomNav(Boolean(state));

  const handleClose = useCallback(() => {
    click();
    onClose();
  }, [click, onClose]);

  useEffect(() => {
    if (!state) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      } else if (e.key === "ArrowLeft") {
        const prevBtn = document.querySelector<HTMLButtonElement>(
          '[data-slot="apple-carousel-previous"]'
        );
        prevBtn?.click();
      } else if (e.key === "ArrowRight") {
        const nextBtn = document.querySelector<HTMLButtonElement>(
          '[data-slot="apple-carousel-next"]'
        );
        nextBtn?.click();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [state, handleClose]);

  if (!state) return null;

  const currentImage: GalleryImage =
    state.post.images[currentIndex] || state.post.images[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      className="fixed inset-0 z-50 flex h-[100dvh] w-full flex-col justify-between bg-black/92 backdrop-blur-xl animate-in fade-in duration-200 overflow-hidden pt-[env(safe-area-inset-top,0.75rem)] pb-[env(safe-area-inset-bottom,0.75rem)] px-3 sm:px-6"
    >
      {/* ── YouTube Ambient Mode: Fullscreen dynamic blurred backdrop ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden select-none"
      >
        <Image
          src={currentImage.src}
          alt=""
          fill
          sizes="120px"
          className="object-cover scale-125 blur-3xl saturate-200 opacity-40 dark:opacity-45 transition-all duration-700 ease-out"
        />
        {/* Soft dark vignette to ensure text & controls remain crisp */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-2xl" />
      </div>

      {/* ── Top Header Bar ── */}
      <div className="z-30 flex w-full items-center justify-between pt-2 pb-1 sm:pt-4 sm:pb-2 text-white/90">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 pr-2">
          <div className="flex flex-col min-w-0">
            {state.post.location && (
              <span className="font-mono text-[10px] sm:text-xs text-white/60 truncate">
                {state.post.location}
              </span>
            )}
            <span className="text-xs sm:text-sm font-semibold text-white tracking-tight truncate">
              {state.post.title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <span className="rounded-full bg-white/10 px-2 sm:px-2.5 py-0.5 sm:py-1 font-mono text-[11px] sm:text-xs text-white/80 border border-white/10 backdrop-blur-md">
            {currentIndex + 1} / {state.post.images.length}
          </span>
          <Tooltip label="Close" shortcut="Esc" side="bottom" align="end">
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close fullscreen lightbox"
            className="relative flex size-9 sm:size-10 items-center justify-center rounded-full bg-white/10 text-white border border-white/10 backdrop-blur-md transition hover:bg-white/20 active:scale-95 after:absolute after:-inset-2 after:content-['']"
          >
            <svg
              className="size-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          </Tooltip>
        </div>
      </div>

      {/* ── Fullscreen Apple Carousel ── */}
      <AppleCarouselRoot
        duration={3600}
        defaultIndex={currentIndex}
        onIndexChange={onIndexChange}
        className="relative flex flex-col justify-center flex-1 my-auto w-full py-1 sm:py-2 min-h-0"
      >
        {/* Visual navigation arrows for Next & Previous (Before) */}
        {state.post.images.length > 1 && (
          <>
            <AppleCarouselPrevious
              onClick={click}
              className="absolute left-1.5 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 z-40 max-sm:size-10 shadow-2xl"
            />
            <AppleCarouselNext
              onClick={click}
              className="absolute right-1.5 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 z-40 max-sm:size-10 shadow-2xl"
            />
          </>
        )}

        <AppleCarouselContent className="my-auto py-1 sm:py-2">
          {state.post.images.map((item, idx) => (
            <AppleCarouselItem
              key={item.id || idx}
              tabIndex={-1}
              className="relative !h-[48vh] sm:!h-[60vh] md:!h-[66vh] !w-[90vw] sm:!w-[76vw] md:!w-[70vw] max-w-5xl rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black/50"
            >
              {/* Blurred background image for letterbox fill (YouTube style) */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-0 overflow-hidden opacity-50 blur-2xl scale-125 saturate-150"
              >
                <Image
                  src={item.src}
                  alt=""
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              </div>

              {/* Main Photo with Skeleton Loader */}
              <ImageWithSkeleton
                src={item.src}
                alt={item.alt || state.post.title}
                fill
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 76vw, 1024px"
                loading={idx === currentIndex ? "eager" : "lazy"}
                fetchPriority={idx === currentIndex ? "high" : "auto"}
                className="relative z-1 object-contain select-none"
              />
            </AppleCarouselItem>
          ))}
        </AppleCarouselContent>

        {/* ── Apple Carousel Controls (TabList with morphing progress pills + PlayButton) ── */}
        <AppleCarouselControls size="sm" className="z-30 pt-2 sm:pt-4 max-w-full overflow-x-auto">
          <AppleCarouselTabList
            aria-label={`${state.post.title} slides`}
            className="bg-black/50 text-white border border-white/10 backdrop-blur-md max-w-[85vw] overflow-x-auto scrollbar-none"
          >
            {state.post.images.map((item, idx) => (
              <AppleCarouselTab key={item.id || idx}>
                {item.caption || `Frame ${idx + 1}`}
              </AppleCarouselTab>
            ))}
          </AppleCarouselTabList>
          <AppleCarouselPlayButton className="bg-black/50 text-white border border-white/10 backdrop-blur-md hover:bg-black/70 shrink-0" />
        </AppleCarouselControls>
      </AppleCarouselRoot>

      {/* ── Bottom Info Bar: Caption ── */}
      <div className="z-30 mx-auto mb-1 sm:mb-4 w-full max-w-3xl">
        <div className="rounded-xl border border-white/10 bg-black/45 p-2.5 sm:p-3.5 backdrop-blur-md text-white/80">
          <p className="text-xs sm:text-sm font-sans text-white/90 text-center sm:text-left">
            {currentImage.caption || state.post.description}
          </p>
        </div>
      </div>
    </div>
  );
}
