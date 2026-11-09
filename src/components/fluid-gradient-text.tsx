"use client";

// Faithful port of chanhdai.com's FluidGradientText (MIT, © Chánh Đại).
// A cursor-following linear-gradient fill (smoothed by a spring) reveals the
// text solid, over an always-visible faint stroke. Defaults tuned for
// "RAJKUMAR" — the equivalent of chanhdai's useDialKit("FluidGradientText", …).
//
// The spring is hand-rolled (same stiffness/damping as the original
// motion/react useSpring) and writes the gradient's x1 attribute directly.
// This footer renders on every page; importing motion here put ~46 KB gzip
// of animation library on routes that use nothing else from it.

import { useCallback, useEffect, useRef } from "react";

const STIFFNESS = 150;
const DAMPING = 25;
/** Stop the loop once within this many viewBox units/velocity of rest. */
const REST_DELTA = 0.5;
const FALLBACK_FONTS = "Helvetica, Arial, sans-serif";

export type FluidGradientTextProps = {
  /** Text content rendered inside the SVG. */
  text?: string;
  /**
   * SVG viewBox width used to scale the gradient and text layout.
   * @default 2550
   */
  svgViewBoxWidth?: number;
  /**
   * SVG viewBox height used as the base text size.
   * @default 560
   */
  svgViewBoxHeight?: number;
};

export function FluidGradientText({
  text = "राजकुमार",
  svgViewBoxWidth = 2550,
  svgViewBoxHeight = 560,
}: FluidGradientTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<SVGLinearGradientElement>(null);
  const textRef = useRef<SVGTextElement>(null);
  const spring = useRef({
    x: svgViewBoxWidth / 2,
    velocity: 0,
    target: svgViewBoxWidth / 2,
    frame: 0,
    lastTime: 0,
  });

  /** Moves the spring target; `ratio` is 0..1 across the text's width. */
  const setTarget = useCallback(
    (ratio: number) => {
      const s = spring.current;
      s.target = ratio * svgViewBoxWidth;
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
    },
    [svgViewBoxWidth]
  );

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const containerRect = event.currentTarget.getBoundingClientRect();
    setTarget((event.clientX - containerRect.left) / containerRect.width);
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (event.touches.length > 0) {
      const touch = event.touches[0];
      const containerRect = event.currentTarget.getBoundingClientRect();
      setTarget((touch.clientX - containerRect.left) / containerRect.width);
    }
  };

  const handleMouseLeave = () => {
    setTarget(0.5);
  };

  // On touch-only devices, run an ambient soft sweep so the gradient is
  // alive. Only while the footer is on screen: an always-on rAF loop costs
  // main-thread time on every frame of every page.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const isTouch = window.matchMedia("(hover: none)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!isTouch || reduceMotion) return;

    let sweepFrame = 0;
    let start: number | null = null;
    const sweep = (time: number) => {
      if (start === null) start = time;
      const elapsed = (time - start) / 1000;
      setTarget(0.5 + 0.28 * Math.sin(elapsed * 1.4));
      sweepFrame = requestAnimationFrame(sweep);
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !sweepFrame) {
        sweepFrame = requestAnimationFrame(sweep);
      } else if (!entry.isIntersecting && sweepFrame) {
        cancelAnimationFrame(sweepFrame);
        sweepFrame = 0;
      }
    });
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(sweepFrame);
    };
  }, [setTarget]);

  // The Devanagari webfont (~52 KB) is only needed for this footer word.
  // Browsers fetch a webfont as soon as text using it is laid out, even far
  // below the fold, so it competed with each page's LCP image. Apply the
  // family once the footer is near the viewport.
  useEffect(() => {
    const el = containerRef.current;
    const textEl = textRef.current;
    if (!el || !textEl) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        textEl.style.fontFamily = `var(--font-devanagari), ${FALLBACK_FONTS}`;
        observer.disconnect();
      },
      { rootMargin: "600px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Cancel any in-flight spring frame on unmount.
  useEffect(() => {
    const s = spring.current;
    return () => cancelAnimationFrame(s.frame);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative size-full overflow-hidden after:absolute after:bottom-0 after:h-px after:w-full after:bg-current/15 touch-pan-y"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchMove}
      onTouchMove={handleTouchMove}
    >
      <svg
        className="size-full translate-y-[37.5%] select-none"
        viewBox={`0 0 ${svgViewBoxWidth} ${svgViewBoxHeight}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <text
          ref={textRef}
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          stroke="currentColor"
          strokeOpacity="0.3"
          strokeWidth="2"
          fill="url(#fluid_gradient_text_linear)"
          style={{
            fontFamily: FALLBACK_FONTS,
            fontSize: svgViewBoxHeight,
            fontWeight: "bold",
          }}
        >
          {text}
        </text>
        <defs>
          <linearGradient
            ref={gradientRef}
            id="fluid_gradient_text_linear"
            x1={svgViewBoxWidth / 2}
            y1="0"
            x2={svgViewBoxWidth / 2}
            y2={svgViewBoxHeight}
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
