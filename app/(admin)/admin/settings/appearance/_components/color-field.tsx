"use client";

/**
 * Single color editor used twice per concept (light + dark variant).
 *
 * Surface: a swatch preview, an OKLCH text input, a native color picker
 * (the most familiar control for non-designers), and a row of curated
 * quick-pick swatches. The native picker speaks hex, so the field
 * round-trips hex ↔ OKLCH on input change.
 */

import { useId, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  hexToOklchString,
  oklchToHex,
  parseOklch,
} from "@/lib/theme/oklch-utils";
import { QUICK_SWATCHES } from "@/lib/theme/theme-presets";

interface ColorFieldProps {
  label: string;
  value: string;
  onChange: (next: string) => void;
}

export function ColorField({ label, value, onChange }: ColorFieldProps) {
  const id = useId();
  const isValid = useMemo(() => parseOklch(value) !== null, [value]);
  const hex = useMemo(
    () => (isValid ? oklchToHex(value) : "#000000"),
    [isValid, value],
  );

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
      >
        {label}
      </label>

      <div className="flex items-center gap-2">
        {/* Swatch preview — uses CSS background-color directly so OKLCH renders natively */}
        <div
          className="h-9 w-9 shrink-0 rounded-md border shadow-sm"
          style={{ backgroundColor: isValid ? value : "transparent" }}
          aria-hidden
        />

        {/* Native picker — converts hex out and OKLCH in. Hidden by default
            and revealed via the swatch click for affordance. */}
        <input
          type="color"
          aria-label={`${label} color picker`}
          className="h-9 w-9 shrink-0 cursor-pointer rounded-md border bg-transparent p-0.5"
          value={hex}
          onChange={(e) => {
            const next = hexToOklchString(e.target.value);
            if (next) onChange(next);
          }}
        />

        {/* Free-form OKLCH input — escape hatch for power users */}
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`font-mono text-xs ${
            isValid ? "" : "border-destructive focus-visible:ring-destructive"
          }`}
          placeholder="oklch(0.5 0.15 240)"
        />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {QUICK_SWATCHES.map((swatch) => (
          <button
            key={swatch}
            type="button"
            onClick={() => onChange(swatch)}
            className="h-5 w-5 rounded-full border shadow-sm transition hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            style={{ backgroundColor: swatch }}
            aria-label={`Set ${label.toLowerCase()} to ${swatch}`}
          />
        ))}
      </div>

      {!isValid && (
        <p className="text-xs text-destructive">
          Not a valid OKLCH color. Example: <code>oklch(0.55 0.21 273)</code>
        </p>
      )}
    </div>
  );
}
