import { cn } from "@/lib/cn";

// Adapted from chanhdai.com's JPG Card Holder concept:
// Analog photo print / slide holder framing with hairline border,
// matte padding, subtle corner notches, and monospace plate labels.

export type JpgCardHolderProps = {
  children: React.ReactNode;
  className?: string;
  badge?: string;
  caption?: string;
  aspectRatio?: "square" | "portrait" | "landscape" | "auto";
  onClick?: () => void;
};

export function JpgCardHolder({
  children,
  className,
  badge,
  caption,
  aspectRatio = "auto",
  onClick,
}: JpgCardHolderProps) {
  const aspectClass = {
    square: "aspect-square",
    portrait: "aspect-[4/5]",
    landscape: "aspect-[16/10]",
    auto: "",
  }[aspectRatio];

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card p-1.5 sm:p-2 transition-[border-color,box-shadow,transform] duration-200 ease-out",
        onClick && "cursor-pointer hover:border-foreground/30 active:scale-[0.99]",
        className
      )}
    >
      {/* Matte photo bed with inner hairline ring */}
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-lg bg-muted/40",
          aspectClass
        )}
      >
        {children}

        {/* Subtle analog corner indicators */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-black/5 dark:ring-white/10"
        />

        {badge && (
          <div className="pointer-events-none absolute top-2 right-2 rounded bg-black/60 px-1.5 py-0.5 font-mono text-[10px] font-medium tracking-wider text-white backdrop-blur-md">
            {badge}
          </div>
        )}
      </div>

      {caption && (
        <div className="flex items-center justify-between px-1 pt-1.5 text-xs text-muted-foreground">
          <span className="truncate font-sans font-normal">{caption}</span>
        </div>
      )}
    </div>
  );
}
