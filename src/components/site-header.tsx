import Link from "next/link";
import CommandMenu from "./command-menu";
import RNMark from "./rn-mark";
import ThemeToggle from "./theme-toggle";
import SiteNavMenu from "./site-nav-menu";
import { getNavGroups } from "@/lib/nav-data";

// Plain links that sit after the Docs / Blog / Projects dropdowns.
const priorityNav = [
  { href: "/gallery", label: "Gallery" },
  { href: "/resume", label: "Resume", emphasis: true },
];

function VerticalSeparator({ className = "" }: { className?: string }) {
  return <span className={`h-5 w-px self-center bg-border ${className}`} aria-hidden />;
}

export default function SiteHeader() {
  const navGroups = getNavGroups();

  return (
    <header className="sticky top-0 z-50 max-w-screen overflow-x-clip bg-background px-2">
      <div className="screen-line-top screen-line-bottom mx-auto flex h-(--header-height) items-center gap-2 border-r border-line pr-2 sm:gap-4 md:max-w-3xl">
        <Link href="/" aria-label="Home">
          <RNMark className="h-9 w-auto shrink-0" />
        </Link>

        <div className="flex-1" />

        {/* Action group: Priority destinations (Lab Notes, Gallery, Resume) + Search + Theme */}
        <div className="flex items-center">
          {/* Docs / Blog / Projects dropdowns + Gallery / Resume. Below sm the
              bottom bar's NavMobile carries the same groups. */}
          <SiteNavMenu groups={navGroups} links={priorityNav} className="max-sm:hidden" />

          <VerticalSeparator className="mx-3 max-sm:hidden" />

          <div className="max-sm:hidden">
            <CommandMenu />
          </div>

          <VerticalSeparator className="mx-2" />

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
