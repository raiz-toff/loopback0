export function SolderingIronText() {
  return (
    <>
      soldering{" "}
      <span className="group/iron relative inline-flex items-baseline cursor-default font-medium text-foreground">
        {/* Bold Soldering Iron tool forming the letter 'i' with top-tip smoke */}
        <span
          className="relative -bottom-1 inline-flex h-[1.7em] w-[0.95em] shrink-0 select-none items-end overflow-visible align-baseline mr-[0.08em]"
          aria-hidden="true"
        >
          <svg
            viewBox="0 -24 20 56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-full overflow-visible"
          >
            {/* ── 1. Soldering Iron Body (Vertical, Bold Definition) ── */}
            {/* Metal Tip at Top */}
            <line
              x1="10"
              y1="2"
              x2="10"
              y2="8.5"
              stroke="#B0B4C4"
              strokeWidth="2.8"
              strokeLinecap="round"
              className="group-hover/iron:stroke-amber-300 transition-colors"
            />

            {/* Heating Barrel */}
            <rect
              x="7"
              y="8.5"
              width="6"
              height="8.5"
              rx="0.8"
              fill="#D6D8E5"
            />
            {/* Temperature Ring Accent */}
            <rect
              x="7.5"
              y="14.5"
              width="5"
              height="2"
              rx="0.5"
              fill="#3C5496"
            />

            {/* Collet / Nut */}
            <rect
              x="5.5"
              y="17"
              width="9"
              height="3.5"
              rx="0.8"
              fill="#EF4D36"
            />

            {/* Handle Base (Dark Red) */}
            <rect
              x="6.2"
              y="20.5"
              width="7.6"
              height="9.5"
              rx="0.8"
              fill="#D43825"
            />

            {/* Handle Grip Ribs (Light Red) */}
            <rect
              x="5.5"
              y="21.5"
              width="9"
              height="1.4"
              rx="0.5"
              fill="#EF4D36"
            />
            <rect
              x="5.5"
              y="24.5"
              width="9"
              height="1.4"
              rx="0.5"
              fill="#EF4D36"
            />
            <rect
              x="5.5"
              y="27.5"
              width="9"
              height="1.4"
              rx="0.5"
              fill="#EF4D36"
            />

            {/* Handle Base Cap (Dark Grey) */}
            <rect
              x="6.2"
              y="30"
              width="7.6"
              height="3.5"
              rx="0.8"
              fill="#423D4A"
            />

            {/* ── 2. Bold Smooth Smoke Stream Rising Straight from Top Tip (10, 2) ── */}
            {/* Primary smooth smoke stream */}
            <path
              d="M 10 2 C 6 -6, 14 -15, 9 -23 C 5 -30, 13 -37, 8 -44"
              strokeWidth="1.8"
              strokeLinecap="round"
              className="smooth-smoke-stream smooth-smoke-1 stroke-zinc-400/95 dark:stroke-zinc-100 group-hover/iron:stroke-amber-400"
            />
            {/* Secondary weaving stream */}
            <path
              d="M 10 2 C 13 -7, 6 -16, 12 -24 C 15 -31, 7 -38, 11 -45"
              strokeWidth="1.3"
              strokeLinecap="round"
              className="smooth-smoke-stream smooth-smoke-2 stroke-zinc-500/85 dark:stroke-zinc-300 group-hover/iron:stroke-amber-300"
            />
          </svg>
        </span>

        {/* 'ron' text seamlessly completing the word */}
        <span className="underline decoration-amber-500/50 decoration-dotted underline-offset-4 transition-colors duration-200 group-hover/iron:text-amber-500 dark:group-hover/iron:text-amber-400 group-hover/iron:decoration-amber-500">
          ron
        </span>
      </span>
    </>
  );
}
