"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { useClickSound } from "@/hooks/use-click-sound";
import { galleryPosts, type GalleryPost } from "@/data/gallery";
import { GalleryPostCard } from "./gallery-post-card";
import { GalleryGrid } from "./gallery-grid";
import { GalleryLightbox, type LightboxState } from "./gallery-lightbox";

function DottedLeader() {
  return (
    <span
      aria-hidden
      className="mx-4 flex-1 self-center border-t border-dotted border-fd-border"
    />
  );
}

export function GalleryView() {
  const [viewMode, setViewMode] = useState<"feed" | "grid">("grid");
  const [lightboxState, setLightboxState] = useState<LightboxState>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [click] = useClickSound();

  const totalFrames = useMemo(() => {
    return galleryPosts.reduce((acc, post) => acc + post.images.length, 0);
  }, []);

  const handleOpenLightbox = (post: GalleryPost, index: number) => {
    setLightboxState({ post, initialIndex: index });
    setLightboxIndex(index);
  };

  const handleCloseLightbox = () => {
    setLightboxState(null);
  };

  return (
    <div className="w-full flex flex-col gap-8">
      {/* ── Single Unified Rule: Frame count <dotted-line> [Feed] [Grid] ── */}
      <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.16em] text-fd-muted-foreground">
        <span>{totalFrames} frames</span>
        <DottedLeader />

        {/* View Mode Switcher */}
        <div className="flex items-center rounded-lg border border-border bg-muted/30 p-0.5 text-muted-foreground normal-case tracking-normal">
          <button
            type="button"
            onClick={() => {
              click();
              setViewMode("feed");
            }}
            aria-label="Feed View"
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-[background-color,color]",
              viewMode === "feed"
                ? "bg-background text-foreground shadow-xs"
                : "hover:text-foreground"
            )}
          >
            <svg
              className="size-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
            </svg>
            <span>Feed</span>
          </button>

          <button
            type="button"
            onClick={() => {
              click();
              setViewMode("grid");
            }}
            aria-label="Grid View"
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-[background-color,color]",
              viewMode === "grid"
                ? "bg-background text-foreground shadow-xs"
                : "hover:text-foreground"
            )}
          >
            <svg
              className="size-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="7" height="7" x="3" y="3" />
              <rect width="7" height="7" x="14" y="3" />
              <rect width="7" height="7" x="14" y="14" />
              <rect width="7" height="7" x="3" y="14" />
            </svg>
            <span>Grid</span>
          </button>
        </div>
      </div>

      {/* ── Content View ── */}
      {viewMode === "feed" ? (
        <div className="mx-auto flex w-full max-w-xl flex-col gap-6 sm:gap-8">
          {galleryPosts.map((post, i) => (
            <GalleryPostCard
              key={post.id}
              post={post}
              eager={i === 0}
              onOpenLightbox={handleOpenLightbox}
            />
          ))}
        </div>
      ) : (
        <GalleryGrid
          posts={galleryPosts}
          onOpenLightbox={handleOpenLightbox}
        />
      )}

      {/* ── Fullscreen Lightbox Modal ── */}
      <GalleryLightbox
        state={lightboxState}
        currentIndex={lightboxIndex}
        onIndexChange={setLightboxIndex}
        onClose={handleCloseLightbox}
      />
    </div>
  );
}
