"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

// Contextual bottom bar (phones only). The bar itself lives in the root
// layout; each route publishes what belongs there through <PublishBottomNav>
// and the bar re-renders. Nothing here renders markup.

export type BottomNavLink = { label: string; href: string; meta?: string };

export type BottomNavAction =
  | {
      kind: "link";
      label: string;
      href: string;
      icon?: "download" | "file" | "external";
      /** `true` keeps the filename, a string renames the download. */
      download?: boolean | string;
    }
  | { kind: "copy-url"; label: string }
  /** Fetches the resume PDF through POST /api/resume (no crawlable link). */
  | { kind: "resume-pdf"; label: string };

export type BottomNavTocItem = { title: ReactNode; url: string; depth: number };

export type BottomNavConfig = {
  /** In-page anchors (homepage sections, story chapters). `spy` highlights the one in view. */
  sections?: { label: string; items: BottomNavLink[]; spy?: boolean };
  /** Headings of the current article or lab. */
  toc?: BottomNavTocItem[];
  prev?: BottomNavLink;
  next?: BottomNavLink;
  /** One action promoted into the bar itself, e.g. Download PDF. */
  primary?: BottomNavAction;
  back?: BottomNavLink;
  /** Reading progress along the bar's top edge. */
  progress?: boolean;
  /** Hide the bar's search when the page already has one (fumadocs chrome). */
  showSearch?: boolean;
};

type ContextValue = {
  config: BottomNavConfig | null;
  setConfig: (config: BottomNavConfig | null) => void;
  hiddenCount: number;
  setHiddenCount: (update: (n: number) => number) => void;
};

const BottomNavContext = createContext<ContextValue | null>(null);

export function BottomNavProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<BottomNavConfig | null>(null);
  const [hiddenCount, setHiddenCount] = useState(0);
  const value = useMemo(
    () => ({ config, setConfig, hiddenCount, setHiddenCount }),
    [config, hiddenCount]
  );
  return <BottomNavContext.Provider value={value}>{children}</BottomNavContext.Provider>;
}

export function useBottomNavState() {
  const ctx = useContext(BottomNavContext);
  return { config: ctx?.config ?? null, hidden: (ctx?.hiddenCount ?? 0) > 0 };
}

/**
 * Publishes the bar contents for the current route. Call once per page; the
 * config is cleared when the page unmounts. Pass a stable object (props from
 * a server component, or a useMemo result) so the effect does not loop.
 */
export function useBottomNav(config: BottomNavConfig) {
  const ctx = useContext(BottomNavContext);
  const setConfig = ctx?.setConfig;
  useEffect(() => {
    if (!setConfig) return;
    setConfig(config);
    return () => setConfig(null);
  }, [config, setConfig]);
}

/** Hides the bar while `when` is true, e.g. behind the gallery lightbox. */
export function useHideBottomNav(when: boolean) {
  const ctx = useContext(BottomNavContext);
  const setHiddenCount = ctx?.setHiddenCount;
  useEffect(() => {
    if (!when || !setHiddenCount) return;
    setHiddenCount((n) => n + 1);
    return () => setHiddenCount((n) => Math.max(0, n - 1));
  }, [when, setHiddenCount]);
}

/** Server-friendly publisher: render it anywhere inside a page. */
export function PublishBottomNav(props: BottomNavConfig) {
  const { sections, toc, prev, next, primary, back, progress, showSearch } = props;
  const config = useMemo<BottomNavConfig>(
    () => ({ sections, toc, prev, next, primary, back, progress, showSearch }),
    [sections, toc, prev, next, primary, back, progress, showSearch]
  );
  useBottomNav(config);
  return null;
}
