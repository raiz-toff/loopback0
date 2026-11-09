"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { useClickSound } from "@/hooks/use-click-sound";
import { VerifiedIcon, MapPinIcon } from "@/components/icons";
import ShareMenu from "@/components/share-menu";
import Tooltip from "@/components/tooltip";
import { JpgCardHolder } from "./jpg-card-holder";
import { AppleCarousel } from "./apple-carousel";
import { ImageWithSkeleton } from "./image-with-skeleton";
import type { GalleryPost } from "@/data/gallery";

export type GalleryPostCardProps = {
  post: GalleryPost;
  onOpenLightbox: (post: GalleryPost, index: number) => void;
  /** Load this post's first photo at high priority (top of the feed only). */
  eager?: boolean;
};

export function GalleryPostCard({
  post,
  onOpenLightbox,
  eager = false,
}: GalleryPostCardProps) {
  const [copied, setCopied] = useState(false);
  const [click] = useClickSound();

  const handleCopyLink = async () => {
    click();
    const url = `${window.location.origin}/gallery#${post.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore clipboard error
    }
  };

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const isMultiImage = post.images.length > 1;
  const firstImage = post.images[0];
  const activeImage = post.images[currentImageIndex] || firstImage;
  const postUrl = typeof window !== "undefined" ? `${window.location.origin}/gallery#${post.id}` : `/gallery#${post.id}`;

  return (
    <article
      id={post.id}
      className="flex flex-col rounded-2xl border border-border bg-card/60 backdrop-blur-sm transition-[border-color,box-shadow] duration-200 hover:border-foreground/20"
    >
      {/* ── Post Header (Instagram-style) ── */}
      <div className="flex items-center justify-between px-3.5 py-3 sm:px-4 sm:py-3.5 border-b border-border/60">
        <div className="flex items-center gap-2.5">
          {/* Avatar Ring */}
          <div className="relative flex size-9 shrink-0 items-center justify-center rounded-full bg-linear-to-tr from-amber-500 via-rose-500 to-indigo-500 p-0.5">
            <div className="flex size-full items-center justify-center rounded-full bg-background font-mono text-xs font-bold text-foreground">
              RN
            </div>
          </div>

          <div className="flex flex-col leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-foreground tracking-tight">
                Rajkumar Neupane
              </span>
              <VerifiedIcon className="size-3.5 text-blue-500 shrink-0" />
            </div>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              {post.location && (
                <span className="inline-flex items-center gap-0.5 truncate max-w-[200px] sm:max-w-[260px]">
                  <MapPinIcon className="size-3 shrink-0" />
                  {post.location}
                </span>
              )}
              <span>•</span>
              <span className="font-mono text-[11px] shrink-0">{post.date}</span>
            </div>
          </div>
        </div>

        {/* Share Dropdown */}
        <div className="flex items-center">
          <ShareMenu title={post.title} url={postUrl} />
        </div>
      </div>

      {/* ── Post Media Stage with YouTube-style Ambient Blur Glow ── */}
      <div className="relative overflow-hidden p-2 sm:p-3 bg-muted/20">
        {/* Ambient Blur Layer (YouTube Ambient Mode) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-8 -z-0 overflow-hidden opacity-45 dark:opacity-55 blur-3xl saturate-150 transition-opacity duration-700"
        >
          <Image
            src={activeImage.src}
            alt=""
            fill
            sizes="120px"
            className="object-cover scale-125 transition-all duration-700 ease-out"
          />
        </div>

        <JpgCardHolder className="relative z-10 bg-background/85 shadow-md backdrop-blur-md">
          {isMultiImage ? (
            <AppleCarousel
              images={post.images}
              onImageClick={(index) => onOpenLightbox(post, index)}
              onActiveIndexChange={setCurrentImageIndex}
              eager={eager}
            />
          ) : (
            <div
              onClick={() => onOpenLightbox(post, 0)}
              className="relative aspect-[4/5] w-full cursor-zoom-in bg-muted/20 overflow-hidden"
            >
              {/* Blurred background image for single photo */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-0 overflow-hidden opacity-50 blur-2xl scale-125 saturate-150"
              >
                <Image
                  src={firstImage.src}
                  alt=""
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              </div>

              <ImageWithSkeleton
                src={firstImage.src}
                alt={firstImage.alt || post.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 680px, 720px"
                fetchPriority={eager ? "high" : "auto"}
                className="relative z-1 object-cover transition-transform duration-300 ease-out hover:scale-[1.01]"
              />
            </div>
          )}
        </JpgCardHolder>
      </div>

      {/* ── Utilitarian Action Bar (Strictly NO Likes, NO Comments) ── */}
      <div className="flex items-center justify-between px-3.5 py-2 sm:px-4 sm:py-2.5 border-t border-border/40 text-muted-foreground">
        <div className="flex items-center gap-1">
          {/* Copy Post Link */}
          <Tooltip label={copied ? "Link Copied!" : "Copy Post Link"} align="start">
            <button
              type="button"
              onClick={handleCopyLink}
              aria-label="Copy direct post link"
              className={cn(
                "relative flex size-8 items-center justify-center rounded-md transition-[color,background-color] hover:bg-muted hover:text-foreground active:scale-95",
                copied && "text-emerald-500 dark:text-emerald-400"
              )}
            >
              <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </button>
          </Tooltip>

          {/* Fullscreen Trigger */}
          <Tooltip label="Expand Fullscreen">
            <button
              type="button"
              onClick={() => onOpenLightbox(post, 0)}
              aria-label="Expand image fullscreen"
              className="relative flex size-8 items-center justify-center rounded-md transition-[color,background-color] hover:bg-muted hover:text-foreground active:scale-95 after:absolute after:-inset-1.5 after:content-['']"
            >
              <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 3 21 3 21 9" />
                <polyline points="9 21 3 21 3 15" />
                <line x1="21" y1="3" x2="14" y2="10" />
                <line x1="3" y1="21" x2="10" y2="14" />
              </svg>
            </button>
          </Tooltip>
        </div>

        {/* Category Pill */}
        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground/80 px-2 py-0.5 rounded-full bg-muted/60">
          #{post.category}
        </span>
      </div>

      {/* ── Post Caption & Tags ── */}
      <div className="px-3.5 pb-3.5 sm:px-4 sm:pb-4 pt-1 flex flex-col gap-1.5">
        <p className="text-sm font-sans leading-relaxed text-foreground/90">
          <span className="font-semibold text-foreground mr-1.5">rajkumar</span>
          {post.description}
        </p>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors cursor-default"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
