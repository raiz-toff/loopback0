"use client";

import type { ComponentProps } from "react";
import { HomeLayout } from "@fumadocs/base-ui/layouts/home";
import { NavPill } from "./nav-pill";

/** fumadocs HomeLayout with the two-link brand pill in its title slot. */
export function SiteHomeLayout({ nav, ...props }: ComponentProps<typeof HomeLayout>) {
  return <HomeLayout {...props} nav={{ ...nav, title: NavPill }} />;
}
