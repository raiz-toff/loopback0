import type { ReactNode } from "react";

// Gallery accent (warm amber / analog film tone)
const CSS =
  ":root{--color-fd-primary:#d97706;--color-fd-ring:#d97706}" +
  ":root.dark{--color-fd-primary:#f59e0b;--color-fd-ring:#f59e0b}";

export default function GalleryLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      {children}
    </>
  );
}
