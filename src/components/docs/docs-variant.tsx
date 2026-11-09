"use client";

import { createContext, useContext, useSyncExternalStore, type ComponentProps, type ReactNode } from "react";
import type * as PageTree from "fumadocs-core/page-tree";
import type { BaseLayoutProps, LayoutTab } from "@fumadocs/base-ui/layouts/shared";
import { DocsLayout as SpaciousLayout } from "@fumadocs/base-ui/layouts/spacious";
import { DocsLayout as FluxLayout } from "@fumadocs/base-ui/layouts/flux";
import * as SpaciousPage from "@fumadocs/base-ui/layouts/spacious/page";
import * as FluxPage from "@fumadocs/base-ui/layouts/flux/page";
import type { DocsVariant } from "@/lib/docs-variant";
import { NavPill } from "./nav-pill";

// Spacious above the md breakpoint, Flux below it, decided by the viewport and
// re-evaluated on resize. The server passes its user-agent guess as `initial`
// so the first paint is right on phones; after hydration the media query wins.
// Layout and page parts both read the same context, because each fumadocs
// layout family requires its own page components.

const PHONE_QUERY = "(max-width: 767.98px)";

const VariantContext = createContext<DocsVariant>("spacious");

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(PHONE_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

export function DocsVariantProvider({ initial, children }: { initial: DocsVariant; children: ReactNode }) {
  const variant = useSyncExternalStore<DocsVariant>(
    subscribe,
    () => (window.matchMedia(PHONE_QUERY).matches ? "flux" : "spacious"),
    () => initial
  );
  return <VariantContext.Provider value={variant}>{children}</VariantContext.Provider>;
}

export function useDocsVariant(): DocsVariant {
  return useContext(VariantContext);
}

type SwitchProps = BaseLayoutProps & { tree: PageTree.Root; tabs?: LayoutTab[]; children: ReactNode };

/** Renders the Spacious or Flux DocsLayout for the current variant. */
export function DocsLayoutSwitch({ nav, ...props }: SwitchProps) {
  const variant = useDocsVariant();
  const Layout = variant === "flux" ? FluxLayout : SpaciousLayout;
  // The brand pill is a component (two links), so it is attached here on the
  // client rather than in the server-side baseOptions().
  return <Layout {...props} nav={{ ...nav, title: NavPill }} />;
}

// Page parts, each resolved against the active family.
function pick<K extends keyof typeof SpaciousPage & keyof typeof FluxPage>(variant: DocsVariant, name: K) {
  return (variant === "flux" ? FluxPage : SpaciousPage)[name];
}

export function DocsPage(props: ComponentProps<typeof SpaciousPage.DocsPage>) {
  const C = pick(useDocsVariant(), "DocsPage") as typeof SpaciousPage.DocsPage;
  return <C {...props} />;
}
export function DocsTitle(props: ComponentProps<typeof SpaciousPage.DocsTitle>) {
  const C = pick(useDocsVariant(), "DocsTitle") as typeof SpaciousPage.DocsTitle;
  return <C {...props} />;
}
export function DocsDescription(props: ComponentProps<typeof SpaciousPage.DocsDescription>) {
  const C = pick(useDocsVariant(), "DocsDescription") as typeof SpaciousPage.DocsDescription;
  return <C {...props} />;
}
export function DocsBody(props: ComponentProps<typeof SpaciousPage.DocsBody>) {
  const C = pick(useDocsVariant(), "DocsBody") as typeof SpaciousPage.DocsBody;
  return <C {...props} />;
}
export function EditOnGitHub(props: ComponentProps<typeof SpaciousPage.EditOnGitHub>) {
  const C = pick(useDocsVariant(), "EditOnGitHub") as typeof SpaciousPage.EditOnGitHub;
  return <C {...props} />;
}
export function MarkdownCopyButton(props: ComponentProps<typeof SpaciousPage.MarkdownCopyButton>) {
  const C = pick(useDocsVariant(), "MarkdownCopyButton") as typeof SpaciousPage.MarkdownCopyButton;
  return <C {...props} />;
}
export function ViewOptionsPopover(props: ComponentProps<typeof SpaciousPage.ViewOptionsPopover>) {
  const C = pick(useDocsVariant(), "ViewOptionsPopover") as typeof SpaciousPage.ViewOptionsPopover;
  return <C {...props} />;
}
