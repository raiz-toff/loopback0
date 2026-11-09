import type { Metadata } from "next";
import SiteFooter from "@/components/site-footer";
import { GalleryView } from "@/components/gallery/gallery-view";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Off the clock. Snaps from trail rides around the valley, streets in Toronto, and things I stopped to look at.",
};

export default function GalleryPage() {
  return (
    <>
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 sm:px-6 py-12 sm:py-16">
        {/* Header Section */}
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-fd-muted-foreground">
          index <span className="mx-1 text-fd-muted-foreground/50">/</span> gallery
        </p>

        <h1 className="mt-4 text-balance text-4xl font-bold tracking-tight text-fd-foreground sm:text-5xl">
          Gallery<span className="text-fd-primary">.</span>
        </h1>

        <p className="mt-4 text-pretty text-[15px] text-fd-muted-foreground max-w-2xl">
          Off the clock. Snaps from trail rides around the valley, streets in Toronto, and things I stopped to look at.
        </p>

        {/* Gallery Streamlined View */}
        <div className="mt-10">
          <GalleryView />
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
