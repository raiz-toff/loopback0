"use client";

import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import type { NavGroup, NavLink } from "@/lib/nav-data";
import { cn } from "@/lib/cn";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

// Header dropdowns (Docs / Blog / Projects) built from getNavGroups(). The
// popup is capped to the viewport (--available-width) so it never overflows
// on narrow screens; the two-column layout only kicks in from md up.

export default function SiteNavMenu({
  groups,
  links,
  className,
}: {
  groups: NavGroup[];
  links: { href: string; label: string; emphasis?: boolean }[];
  className?: string;
}) {
  return (
    <NavigationMenu className={className} align="end">
      <NavigationMenuList className="gap-0.5">
        {groups.map((group) => (
          <NavigationMenuItem key={group.id}>
            <NavigationMenuTrigger>{group.label}</NavigationMenuTrigger>
            <NavigationMenuContent>
              <GroupPanel group={group} />
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
        {links.map((item) => (
          <NavigationMenuItem key={item.href}>
            <NavigationMenuLink
              className={cn(
                navigationMenuTriggerStyle(),
                item.emphasis && "font-semibold text-foreground"
              )}
              render={<Link href={item.href} />}
            >
              {item.label}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function GroupPanel({ group }: { group: NavGroup }) {
  const twoColumn = Boolean(group.aside?.items.length);
  return (
    <div
      className={cn(
        "w-[min(calc(100vw-1.5rem),22rem)]",
        twoColumn && "md:w-[36rem] md:grid md:grid-cols-[1.25fr_1fr] md:gap-2"
      )}
    >
      <ul className="flex flex-col gap-0.5">
        {group.items.map((item) => (
          <ListItem key={item.href} item={item} />
        ))}
      </ul>

      {group.aside && (
        <div className="mt-2 border-t border-line pt-2 md:mt-0 md:border-t-0 md:border-l md:pt-0 md:pl-2">
          <div className="px-2 pt-1.5 pb-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">
            {group.aside.label}
          </div>
          <ul className="flex flex-col gap-0.5">
            {group.aside.items.map((item) => (
              <ListItem key={item.href} item={item} compact />
            ))}
          </ul>
        </div>
      )}

      {group.footer && (
        <div className={cn("mt-1 border-t border-line pt-1", twoColumn && "md:col-span-2")}>
          <NavigationMenuLink
            render={<Link href={group.footer.href} />}
            className="justify-between px-2 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            {group.footer.title}
            <ArrowRightIcon className="size-3.5" aria-hidden />
          </NavigationMenuLink>
        </div>
      )}
    </div>
  );
}

function ListItem({ item, compact = false }: { item: NavLink; compact?: boolean }) {
  return (
    <li>
      <NavigationMenuLink render={<Link href={item.href} />} className="items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="flex items-baseline justify-between gap-3">
            <span className={cn("truncate leading-snug font-medium", compact && "text-[13px]")}>
              {item.title}
            </span>
            {item.meta && (
              <span className="shrink-0 font-mono text-[10px] tracking-tight text-muted-foreground/70">
                {item.meta}
              </span>
            )}
          </div>
          {item.description && !compact && (
            <span className="line-clamp-2 text-xs leading-snug text-muted-foreground">
              {item.description}
            </span>
          )}
        </div>
      </NavigationMenuLink>
    </li>
  );
}
