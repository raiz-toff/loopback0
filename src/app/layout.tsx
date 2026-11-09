import type { Metadata } from "next";
import { Caveat, Geist, Geist_Mono } from "next/font/google";
import { Provider } from "@/components/docs/provider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { author, siteUrl, siteDescription } from "@/lib/shared";
import SiteBottomNav from "@/components/site-bottom-nav";
import { BottomNavProvider } from "@/components/bottom-nav/context";
import { getNavGroups } from "@/lib/nav-data";
import ScrollToTop from "@/components/scroll-to-top";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Decorative faces: not preloaded, so they don't compete with the LCP image
// and the body fonts. They still load as soon as text using them renders.
const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  preload: false,
});


const description = siteDescription;

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "Rajkumar Neupane — Network Support Technician",
    template: "%s · Rajkumar Neupane",
  },
  description,
  authors: [{ name: author.name, url: author.url }],
  creator: author.name,
  openGraph: {
    type: "website",
    siteName: "Rajkumar Neupane",
    title: "Rajkumar Neupane — Network Support Technician",
    description,
    images: [
      {
        url: "/social.png",
        width: 2848,
        height: 1504,
        alt: "RN monogram built from the 8 twisted-pair conductors in T568B order — Rajkumar Neupane, Network Support Technician",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rajkumar Neupane — Network Support Technician",
    description,
    images: "/social.png",
  },
  alternates: {
    types: { "application/rss+xml": "/rss.xml" },
  },
  // app/favicon.ico covers the classic path; these add the sharp variants.
  // The svg is scheme-aware (its tile swaps dark via an embedded media query).
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml", sizes: "any" },
      { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  other: {
    "darkreader-lock": "",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <meta name="darkreader-lock" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && !navigator.clipboard) {
                navigator.clipboard = {
                  writeText: function(text) {
                    return new Promise(function(resolve, reject) {
                      try {
                        var ta = document.createElement('textarea');
                        ta.value = text;
                        ta.style.position = 'fixed';
                        ta.style.top = '0';
                        ta.style.left = '0';
                        ta.style.opacity = '0';
                        document.body.appendChild(ta);
                        ta.focus();
                        ta.select();
                        var success = document.execCommand('copy');
                        document.body.removeChild(ta);
                        if (success) { resolve(); } else { reject(new Error('execCommand copy failed')); }
                      } catch (err) {
                        reject(err);
                      }
                    });
                  },
                  readText: function() {
                    return Promise.resolve('');
                  }
                };
              }
              // Plain-HTTP origins (LAN dev) also lack ClipboardItem, which
              // Fumadocs' "Copy Markdown" uses. Copy its text/plain part as text.
              if (typeof window !== 'undefined' && typeof window.ClipboardItem === 'undefined') {
                window.ClipboardItem = function(items) { this.items = items; };
                navigator.clipboard.write = function(entries) {
                  var item = entries && entries[0] && entries[0].items;
                  if (!item || !item['text/plain']) return Promise.reject(new Error('Nothing to copy'));
                  return Promise.resolve(item['text/plain']).then(function(v) {
                    return typeof v === 'string' ? v : v.text();
                  }).then(function(text) { return navigator.clipboard.writeText(text); });
                };
              }
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col pb-16 sm:pb-0" suppressHydrationWarning>
        {/* RootProvider's next-themes reads the same localStorage "theme" key
            the old inline script wrote, so saved preferences carry over. */}
        <Provider>
          <BottomNavProvider>
            {children}
            <SiteBottomNav groups={getNavGroups()} />
            <ScrollToTop />
          </BottomNavProvider>
        </Provider>
        <Analytics />
        {/* Real-user Core Web Vitals (LCP, INP, CLS) per route. CrUX has
            too little traffic data for a personal site to report field data. */}
        <SpeedInsights />
      </body>
    </html>
  );
}

