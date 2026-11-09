"use client";

import { useClickSound } from "@/hooks/use-click-sound";
import { JpgCardHolder } from "./jpg-card-holder";
import { ImageWithSkeleton } from "./image-with-skeleton";
import type { GalleryPost } from "@/data/gallery";

export type GalleryGridProps = {
  posts: GalleryPost[];
  onOpenLightbox: (post: GalleryPost, index: number) => void;
};

export function GalleryGrid({ posts, onOpenLightbox }: GalleryGridProps) {
  const [click] = useClickSound();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
      {posts.map((post, i) => {
        const cover = post.images[0];
        const isMulti = post.images.length > 1;
        // The first two rows (up to 6 tiles) are visible on load. Load them
        // eagerly; the first tile is the LCP candidate on every breakpoint.
        const aboveFold = i < 6;

        return (
          <div
            key={post.id}
            onClick={() => {
              click();
              onOpenLightbox(post, 0);
            }}
            className="group relative cursor-pointer active:scale-[0.98] transition-transform duration-100"
          >
            <JpgCardHolder
              aspectRatio="square"
              className="p-1 hover:border-foreground/30 transition-all duration-200"
            >
              <div className="relative size-full overflow-hidden rounded-md">
                {/* No ambient blur backdrop here: the object-cover photo fills
                    the tile, so it was never visible. It still cost one
                    request per tile and became the (lazy) LCP element. */}
                <ImageWithSkeleton
                  src={cover.src}
                  alt={cover.alt || post.title}
                  fill
                  watermark="compact"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 250px"
                  loading={aboveFold ? "eager" : "lazy"}
                  fetchPriority={i === 0 ? "high" : "auto"}
                  className="relative z-1 object-cover transition-transform duration-300 ease-out [@media(hover:hover)]:group-hover:scale-105"
                />

                {/* Multi-photo indicator icon (Instagram style) */}
                {isMulti && (
                  <div className="absolute top-2 right-2 z-2 rounded bg-black/60 p-1 text-white backdrop-blur-xs">
                    <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="18" x="3" y="3" rx="2" />
                      <path d="M21 9v10a2 2 0 0 1-2 2H9" />
                    </svg>
                  </div>
                )}

                {/* Hover overlay with details (visible only on hover-capable devices) */}
                <div className="absolute inset-0 z-3 flex flex-col justify-end bg-gradient-to-t from-black/85 via-black/25 to-transparent p-2.5 transition-opacity duration-200 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:none)]:hidden">
                  <span className="font-mono text-[10px] uppercase text-white/70">
                    {post.category}
                  </span>
                  <span className="font-sans text-xs font-semibold text-white truncate">
                    {post.title}
                  </span>
                  <span className="font-mono text-[10px] text-white/60">
                    {post.images.length} {post.images.length === 1 ? "photo" : "photos"}
                  </span>
                </div>
              </div>
            </JpgCardHolder>
          </div>
        );
      })}
    </div>
  );
}
