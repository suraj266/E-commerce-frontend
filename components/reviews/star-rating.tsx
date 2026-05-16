"use client";

/**
 * Star-rating display + optional interactive input.
 *
 * Read-only: pass `value` (0..5, fractional OK). Renders 5 stars with a
 * partial fill for the fractional portion.
 *
 * Interactive: also pass `onChange`. Clicking a star sets the value to its
 * index; hovering previews. Useful inside the write-review form.
 */

import { Star } from "lucide-react";
import { useState } from "react";

interface StarRatingProps {
  value: number;
  /** Pixel size; defaults to 16 for read-only, raise for the write form. */
  size?: number;
  /** Provide to enable click-to-rate. Disabled = read-only display. */
  onChange?: (next: number) => void;
  /** Optional aria-label override. */
  ariaLabel?: string;
}

export function StarRating({
  value,
  size = 16,
  onChange,
  ariaLabel,
}: StarRatingProps) {
  const [hover, setHover] = useState<number | null>(null);
  const interactive = !!onChange;
  const displayed = hover ?? value;

  return (
    <div
      role={interactive ? "radiogroup" : "img"}
      aria-label={ariaLabel ?? `Rating: ${value.toFixed(1)} out of 5`}
      className="inline-flex items-center gap-0.5"
    >
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = Math.max(0, Math.min(1, displayed - (i - 1)));
        if (interactive) {
          return (
            <button
              key={i}
              type="button"
              role="radio"
              aria-checked={value === i}
              onClick={() => onChange?.(i)}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              className="cursor-pointer transition-transform hover:scale-110 focus:outline-none"
            >
              <StarShape size={size} fill={fill} />
            </button>
          );
        }
        return <StarShape key={i} size={size} fill={fill} />;
      })}
    </div>
  );
}

/** A single star rendered with a partial fill via SVG mask. */
function StarShape({ size, fill }: { size: number; fill: number }) {
  // Use two stacked icons — empty outline + filled clipped — to avoid
  // pixel-snapping issues with the SVG mask approach.
  const filledStyle = {
    width: size,
    height: size,
    clipPath: `inset(0 ${100 - fill * 100}% 0 0)`,
  } as const;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <Star
        className="text-foreground/20"
        style={{ width: size, height: size }}
        strokeWidth={1.5}
      />
      <Star
        className="absolute inset-0 text-amber-400 fill-amber-400"
        style={filledStyle}
        strokeWidth={1.5}
      />
    </div>
  );
}
