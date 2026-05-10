"use client";

import { Loader2 } from "lucide-react";

/**
 * StatusToggle — accessible boolean toggle for admin lists.
 *
 * Renders an iOS-style rocker switch + label. Use anywhere you have a
 * record-level on/off (menus, categories, brands, sliders, etc.) where a
 * disguised "badge button" wouldn't read as clickable.
 *
 * Keyboard: Space / Enter toggle (browser default for <button>).
 * Screen readers: announces as a switch with checked / unchecked state.
 */
interface StatusToggleProps {
  checked: boolean;
  /** Optional explicit text — defaults to "Active" / "Inactive". */
  labelOn?: string;
  labelOff?: string;
  /** Disables the click + dims the visual. Use during in-flight mutations. */
  disabled?: boolean;
  /** Show a spinner instead of the dot during the mutation. */
  loading?: boolean;
  onChange: (next: boolean) => void;
  className?: string;
}

export function StatusToggle({
  checked,
  labelOn = "Active",
  labelOff = "Inactive",
  disabled = false,
  loading = false,
  onChange,
  className = "",
}: StatusToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={checked ? labelOn : labelOff}
      disabled={disabled || loading}
      onClick={() => onChange(!checked)}
      className={`inline-flex items-center gap-2 transition disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    >
      <span
        className={`relative inline-flex h-5 w-9 rounded-full transition-colors ${
          checked ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-600"
        }`}
      >
        <span
          className={`absolute top-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-white shadow transition-all ${
            checked ? "left-[1.125rem]" : "left-0.5"
          }`}
        >
          {loading && (
            <Loader2 className="h-2.5 w-2.5 animate-spin text-zinc-500" />
          )}
        </span>
      </span>
      <span
        className={`text-xs font-semibold ${
          checked ? "text-emerald-700 dark:text-emerald-400" : "text-zinc-500"
        }`}
      >
        {checked ? labelOn : labelOff}
      </span>
    </button>
  );
}
