"use client";

import { useEffect, useRef, useState } from "react";

interface RevealProps {
  children: React.ReactNode;
  /** Position in a list — drives the staggered animation-delay. */
  index?: number;
  /** Per-item stagger step in ms (default 50). */
  step?: number;
  className?: string;
}

/**
 * Fades + slides its child up the first time it scrolls into view, with a
 * per-index stagger so grids "deal in" rather than snapping in all at once.
 *
 * Uses IntersectionObserver (one-shot, then disconnects). The motion classes
 * come from tw-animate-css; the global `prefers-reduced-motion` block in
 * globals.css collapses the animation to ~0ms for motion-sensitive users, so
 * they just get an instant render. SSR / no-IO environments render visible.
 */
export function Reveal({ children, index = 0, step = 50, className = "" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      // No IO (very old browsers / test envs) → reveal next frame so the
      // content is never stuck hidden. Deferred so it's not a synchronous
      // setState in the effect body.
      const id = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(id);
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} ${
        shown ? "animate-in fade-in slide-in-from-bottom-3 duration-500" : "opacity-0"
      }`}
      style={shown ? { animationDelay: `${index * step}ms`, animationFillMode: "both" } : undefined}
    >
      {children}
    </div>
  );
}
