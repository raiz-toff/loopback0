"use client";

import { cn } from "@/lib/cn";

export default function Tooltip({
  label,
  shortcut,
  side = "top",
  align = "center",
  children,
  className,
}: {
  label: React.ReactNode;
  shortcut?: string;
  side?: "top" | "bottom";
  align?: "center" | "start" | "end";
  children: React.ReactNode;
  className?: string;
}) {
  const isTop = side === "top";

  const alignClass =
    align === "start"
      ? "left-0"
      : align === "end"
      ? "right-0"
      : "left-1/2 -translate-x-1/2";

  const arrowAlignClass =
    align === "start"
      ? "left-3"
      : align === "end"
      ? "right-3"
      : "left-1/2 -translate-x-1/2";

  return (
    <span className={cn("group/tooltip relative inline-flex", className)}>
      {children}
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute z-50 flex items-center whitespace-nowrap text-xs font-medium select-none",
          "rounded-xl bg-white text-zinc-900 border border-zinc-200/80 shadow-[0_4px_12px_rgba(0,0,0,0.12)] px-2.5 py-1.5",
          "opacity-0 scale-95 transition-all duration-150 ease-out",
          "[@media(hover:hover)]:group-hover/tooltip:opacity-100 [@media(hover:hover)]:group-hover/tooltip:scale-100",
          "group-focus-within/tooltip:opacity-100 group-focus-within/tooltip:scale-100",
          "[@media(hover:none)]:hidden",
          alignClass,
          isTop
            ? "bottom-full mb-2 group-hover/tooltip:-translate-y-0.5"
            : "top-full mt-2 group-hover/tooltip:translate-y-0.5"
        )}
      >
        <span>{label}</span>
        {shortcut && (
          <kbd className="ml-2 inline-flex h-4.5 min-w-4.5 items-center justify-center rounded bg-zinc-100 px-1 font-mono text-[10px] font-semibold text-zinc-600 shadow-2xs border border-zinc-200/60">
            {shortcut}
          </kbd>
        )}
        {/* Pointer arrow */}
        <span
          className={cn(
            "absolute size-2 rotate-45 bg-white",
            arrowAlignClass,
            isTop
              ? "top-full -mt-1 border-r border-b border-zinc-200/80"
              : "bottom-full -mb-1 border-l border-t border-zinc-200/80"
          )}
          aria-hidden
        />
      </span>
    </span>
  );
}
