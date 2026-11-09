"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type Activity = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };

const BLOCK_SIZE = 12;
const BLOCK_MARGIN = 2;
const STEP = BLOCK_SIZE + BLOCK_MARGIN;
const LABEL_HEIGHT = 16;

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// GitHub's classic emerald contribution ramp.
const LEVEL_STYLES: { fill: string; opacity: number }[] = [
  { fill: "var(--muted-foreground)", opacity: 0.1 },
  { fill: "#0e4429", opacity: 1 },
  { fill: "#00733e", opacity: 1 },
  { fill: "#10b981", opacity: 1 },
  { fill: "#34eb9c", opacity: 1 },
];

function toWeeks(data: Activity[]) {
  const weeks: (Activity | null)[][] = [];
  let week: (Activity | null)[] = [];

  const firstDay = new Date(`${data[0].date}T12:00:00`).getDay();
  for (let i = 0; i < firstDay; i++) week.push(null);

  for (const day of data) {
    week.push(day);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length > 0) weeks.push(week);
  return weeks;
}

function monthLabels(weeks: (Activity | null)[][]) {
  const labels: { text: string; x: number }[] = [];
  let last = -1;
  weeks.forEach((week, wi) => {
    const first = week.find(Boolean);
    if (!first) return;
    const month = Number(first.date.slice(5, 7)) - 1;
    if (month !== last) {
      // skip a cramped label right at the start of a partial first month
      if (labels.length === 0 || wi > labels[labels.length - 1].x / STEP + 2) {
        labels.push({ text: MONTHS[month], x: wi * STEP });
      }
      last = month;
    }
  });
  return labels;
}

// "25 contributions on 25.02.2026" — GitHub's wording, DD.MM.YYYY.
function tipText(day: Activity) {
  const date = `${day.date.slice(8, 10)}.${day.date.slice(5, 7)}.${day.date.slice(0, 4)}`;
  const n = day.count === 0 ? "No" : day.count.toLocaleString("en");
  return `${n} contribution${day.count === 1 ? "" : "s"} on ${date}`;
}

type Tip = { text: string; cx: number; top: number };

export default function Graph({ data }: { data: Activity[] }) {
  const weeks = toWeeks(data);
  const total = data.reduce((sum, d) => sum + d.count, 0);
  const width = weeks.length * STEP - BLOCK_MARGIN;
  const height = LABEL_HEIGHT + 7 * STEP - BLOCK_MARGIN;

  // The graph sits in an overflow-x-auto strip, which would clip a bubble
  // above the top row — so the tooltip renders fixed, in a portal, from
  // viewport coordinates measured off the hovered cell.
  const [tip, setTip] = useState<Tip | null>(null);
  const [visible, setVisible] = useState(false);
  const bubbleRef = useRef<HTMLDivElement | null>(null);

  const showTip = (
    e: React.MouseEvent<SVGElement> | React.FocusEvent<SVGElement>,
    day: Activity
  ) => {
    const r = (e.currentTarget as SVGElement).getBoundingClientRect();
    setTip({ text: tipText(day), cx: r.left + r.width / 2, top: r.top });
    setVisible(true);
  };

  // Clamp the pill inside the viewport; the caret keeps pointing at the
  // cell even when the pill can't center on it.
  useLayoutEffect(() => {
    const el = bubbleRef.current;
    if (!el || !tip) return;
    const half = el.offsetWidth / 2;
    const left = Math.min(Math.max(tip.cx, half + 8), window.innerWidth - half - 8);
    el.style.left = `${left}px`;
    el.style.top = `${tip.top}px`;
    el.style.setProperty("--caret-x", `${(tip.cx - left).toFixed(1)}px`);
  }, [tip]);

  // Any scroll or tap outside stales the fixed position.
  useEffect(() => {
    if (!visible) return;
    const hide = () => setVisible(false);
    const autoHide = setTimeout(hide, 3500);
    window.addEventListener("scroll", hide, { capture: true, passive: true });
    window.addEventListener("pointerdown", hide, { capture: true });
    return () => {
      clearTimeout(autoHide);
      window.removeEventListener("scroll", hide, { capture: true });
      window.removeEventListener("pointerdown", hide, { capture: true });
    };
  }, [visible]);

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="overflow-x-auto px-4 touch-pan-x">
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="mx-auto block"
          role="grid"
          aria-label="GitHub contributions calendar graph"
          onMouseLeave={() => setVisible(false)}
        >
          {monthLabels(weeks).map((label) => (
            <text
              key={label.x}
              x={label.x}
              y={10}
              className="fill-muted-foreground font-sans select-none"
              fontSize="12"
            >
              {label.text}
            </text>
          ))}
          {weeks.map((week, wi) =>
            week.map(
              (day, di) =>
                day && (
                  <rect
                    key={day.date}
                    fill={LEVEL_STYLES[day.level].fill}
                    fillOpacity={LEVEL_STYLES[day.level].opacity}
                    x={wi * STEP}
                    y={LABEL_HEIGHT + di * STEP}
                    width={BLOCK_SIZE}
                    height={BLOCK_SIZE}
                    className="stroke-transparent stroke-1 hover:stroke-foreground/50 focus-visible:stroke-foreground cursor-pointer outline-none"
                    role="gridcell"
                    tabIndex={0}
                    aria-label={tipText(day)}
                    onMouseEnter={(e) => showTip(e, day)}
                    onClick={(e) => {
                      e.stopPropagation();
                      showTip(e, day);
                    }}
                    onFocus={(e) => showTip(e, day)}
                    onBlur={() => setVisible(false)}
                  />
                )
            )
          )}
        </svg>
      </div>

      {tip &&
        createPortal(
          <div
            ref={bubbleRef}
            role="tooltip"
            className={`pointer-events-none fixed z-50 -translate-x-1/2 translate-y-[calc(-100%-8px)] rounded-full bg-foreground px-3 py-1.5 text-sm whitespace-nowrap text-background transition-opacity duration-150 ${visible ? "opacity-100" : "opacity-0"}`}
          >
            {tip.text}
            <span
              className="absolute top-full -mt-1.25 size-2.5 -translate-x-1/2 rotate-45 rounded-br-sm bg-foreground"
              style={{ left: "calc(50% + var(--caret-x, 0px))" }}
              aria-hidden
            />
          </div>,
          document.body
        )}

      <div className="flex flex-wrap items-center justify-between gap-4 px-4 text-sm leading-none">
        <div className="space-y-1">
          <p className="text-muted-foreground">
            {total.toLocaleString("en")} contributions in the past 365 days.
          </p>
          {tip && (
            <p className="font-mono text-xs text-foreground sm:hidden" aria-live="polite">
              {tip.text}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1" aria-hidden>
          <span className="mr-1 text-muted-foreground">Less</span>
          <svg width={STEP * 5 - BLOCK_MARGIN} height={BLOCK_SIZE}>
            {LEVEL_STYLES.map((style, level) => (
              <rect
                key={level}
                fill={style.fill}
                fillOpacity={style.opacity}
                x={level * STEP}
                width={BLOCK_SIZE}
                height={BLOCK_SIZE}
              />
            ))}
          </svg>
          <span className="ml-1 text-muted-foreground">More</span>
        </div>
      </div>
    </div>
  );
}
