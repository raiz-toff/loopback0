import { cn } from "@/lib/cn";

// Hazard tape: the yellow-and-black stripes of data-centre floors and cages.
// Brand use: marks unfinished content (docs pages with `construction`).
export const HAZARD_YELLOW = "#F2C230";
export const HAZARD_BLACK = "#161616";
export const HAZARD_STRIPES = `repeating-linear-gradient(-45deg, ${HAZARD_YELLOW} 0 6px, ${HAZARD_BLACK} 6px 12px)`;

/** Notice boxed in hazard stripes, like a barrier around an open floor tile. */
export function CautionFrame({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="not-prose my-6 rounded-lg p-1.5" style={{ background: HAZARD_STRIPES }}>
      <div className="rounded-md bg-fd-background p-4">
        <div className="font-semibold text-fd-foreground">{title}</div>
        {children ? <div className="mt-1 text-sm text-fd-muted-foreground">{children}</div> : null}
      </div>
    </div>
  );
}

/**
 * Strip of hazard tape across a card's top-right corner. Its own clipping
 * layer, so the card can keep overflow visible. Place inside a `relative` card.
 */
export function CornerTape({ text }: { text: string }) {
  return (
    <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]" aria-hidden>
      <span
        className="absolute -right-[27px] top-[11px] flex h-[14px] w-[90px] rotate-45 items-center justify-center"
        style={{ background: HAZARD_STRIPES }}
      >
        <span
          className="rounded-[2px] px-1 text-[8px] font-black leading-none tracking-[0.14em]"
          style={{ background: HAZARD_YELLOW, color: HAZARD_BLACK, fontFamily: "Arial, Helvetica, sans-serif" }}
        >
          {text}
        </span>
      </span>
    </span>
  );
}

/** Yellow caution tape with repeating bold text, laid across something closed off. */
export function CautionTape({ text, className }: { text: string; className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none overflow-hidden whitespace-nowrap border-y-2 py-0.5 text-[11px] font-black tracking-[0.18em]",
        className,
      )}
      style={{ background: HAZARD_YELLOW, color: HAZARD_BLACK, borderColor: HAZARD_BLACK, fontFamily: "Arial, Helvetica, sans-serif" }}
      aria-hidden
    >
      {Array.from({ length: 8 }, () => `${text}  ◆  `).join("")}
    </div>
  );
}
