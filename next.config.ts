import type { NextConfig } from "next";
import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

// Files in public/ keep their names across deploys, so they can't be
// `immutable`. Browsers keep them a day, then revalidate in the background
// for a week. The CDN keeps them for a year, and every Vercel deploy starts
// with a fresh CDN cache, so a replaced file still goes live on the next deploy.
const PUBLIC_ASSET_CACHE =
  "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=604800";

// Static export was dropped when the docs merged in: search (/api/search),
// markdown content negotiation (proxy.ts), and OG generation need a server.
const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ["10.10.30.38"],
  images: {
    // AVIF first (~20% smaller than WebP); browsers without it get WebP.
    formats: ["image/avif", "image/webp"],
    // Optimized variants are keyed by source URL + width; 31 days instead of
    // the 4-hour default avoids re-encoding multi-MB originals.
    minimumCacheTTL: 2678400,
  },
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      // Agents asking for Markdown on a path that matches nothing get a
      // Markdown 404 (from app/not-found.md) instead of the HTML 404 page.
      // Docs URLs are handled earlier by proxy.ts and never reach this.
      fallback: [
        {
          source: "/:path*",
          destination: "/not-found.md",
          has: [
            {
              type: "header",
              key: "accept",
              value: "(?<accept>.*text/markdown.*)",
            },
          ],
        },
      ],
    };
  },
  async headers() {
    return [
      {
        // /docs/* answers with HTML or Markdown depending on Accept (proxy.ts),
        // so shared caches must key on it. Set here because Next replaces the
        // Vary header that middleware puts on page responses.
        source: "/docs/:path*",
        headers: [{ key: "Vary", value: "Accept" }],
      },
      {
        source: "/docs",
        headers: [{ key: "Vary", value: "Accept" }],
      },
      {
        source:
          "/:path(.*\\.(?:jpg|jpeg|png|webp|avif|gif|svg|ico|woff2|mp4|webm))",
        headers: [{ key: "Cache-Control", value: PUBLIC_ASSET_CACHE }],
      },
    ];
  },
};

export default withMDX(nextConfig);
