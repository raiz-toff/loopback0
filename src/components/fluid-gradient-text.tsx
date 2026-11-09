"use client";

// Adapted from chanhdai.com's FluidGradientText (MIT, © Chánh Đại).
// A pointer-following linear-gradient fill (smoothed by a spring) reveals the
// name solid, over an always-visible faint outline.
//
// The name is a pre-merged outline (name-outline.ts), not live text:
// - no 52 KB Devanagari webfont and no font swap while scrolling;
// - one contour, so the outline has no seams where glyphs overlap;
// - `non-scaling-stroke` keeps the outline 1 CSS px at any width. At phone
//   width a scaled stroke shrank to ~0.3px and rendered as broken dashes.
//
// The spring is hand-rolled (same stiffness/damping as motion/react's
// useSpring) and writes the gradient's x1 attribute directly. It runs only
// while the pointer or a finger moves; nothing animates on its own.

import { useCallback, useEffect, useRef } from "react";
import { NAME_OUTLINE } from "./name-outline";

const STIFFNESS = 150;
const DAMPING = 25;
/** Stop the loop once within this many viewBox units/velocity of rest. */
const REST_DELTA = 0.5;

// viewBox: the outline centred in a box with the footer's 2550:560 aspect, at
// the same scale the old 560px text had (outline width ≈ 82% of the box).
const VB_W = 4555;
const VB_H = 1000;
const VB_X = -(VB_W - NAME_OUTLINE.width) / 2;
const VB_Y = -(VB_H - NAME_OUTLINE.height) / 2;

export function FluidGradientText() {
  const gradientRef = useRef<SVGLinearGradientElement>(null);
  const spring = useRef({
    x: VB_X + VB_W / 2,
    velocity: 0,
    target: VB_X + VB_W / 2,
    frame: 0,
    lastTime: 0,
  });

  /** Moves the spring target; `ratio` is 0..1 across the name's width. */
  const setTarget = useCallback((ratio: number) => {
    const s = spring.current;
    s.target = VB_X + ratio * VB_W;
    if (s.frame) return;

    s.lastTime = 0;
    const step = (time: number) => {
      // Clamp dt so a backgrounded tab can't make the integration explode.
      const dt = s.lastTime ? Math.min((time - s.lastTime) / 1000, 1 / 30) : 1 / 60;
      s.lastTime = time;

      const force = -STIFFNESS * (s.x - s.target) - DAMPING * s.velocity;
      s.velocity += force * dt;
      s.x += s.velocity * dt;

      if (Math.abs(s.x - s.target) < REST_DELTA && Math.abs(s.velocity) < REST_DELTA) {
        s.x = s.target;
        s.velocity = 0;
        s.frame = 0;
      } else {
        s.frame = requestAnimationFrame(step);
      }
      gradientRef.current?.setAttribute("x1", String(s.x));
    };
    s.frame = requestAnimationFrame(step);
  }, []);

  const follow = (clientX: number, el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    setTarget((clientX - rect.left) / rect.width);
  };

  // Cancel any in-flight spring frame on unmount.
  useEffect(() => {
    const s = spring.current;
    return () => cancelAnimationFrame(s.frame);
  }, []);

  return (
    <div
      className="relative size-full overflow-hidden after:absolute after:bottom-0 after:h-px after:w-full after:bg-current/15 touch-pan-y"
      onMouseMove={(e) => follow(e.clientX, e.currentTarget)}
      onMouseLeave={() => setTarget(0.5)}
      onTouchStart={(e) => e.touches[0] && follow(e.touches[0].clientX, e.currentTarget)}
      onTouchMove={(e) => e.touches[0] && follow(e.touches[0].clientX, e.currentTarget)}
      onTouchEnd={() => setTarget(0.5)}
    >
      <svg
        className="size-full translate-y-[37.5%] select-none"
        viewBox={`${VB_X} ${VB_Y} ${VB_W} ${VB_H}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="राजकुमार (Rajkumar)"
      >
        <path
          d={NAME_OUTLINE.d}
          fill="url(#fluid_gradient_text_linear)"
          stroke="currentColor"
          strokeOpacity="0.35"
          strokeWidth="1"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        <defs>
          <linearGradient
            ref={gradientRef}
            id="fluid_gradient_text_linear"
            x1={VB_X + VB_W / 2}
            y1={VB_Y}
            x2={VB_X + VB_W / 2}
            y2={VB_Y + VB_H}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.625" stopColor="currentColor" stopOpacity="0" />
            <stop offset="1" stopColor="currentColor" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
