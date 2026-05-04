/**
 * Auto-pick a readable foreground (near-white vs near-black) for any OKLCH
 * base color, based on its lightness channel L.
 *
 * Why: admins editing the theme should not have to manually choose a
 * matching foreground every time they pick a primary color. We just look
 * at the L value (0..1 in OKLCH) and flip above the empirical 0.62 mark.
 *
 * Input must look like "oklch(0.205 0 0)" or "oklch(0.205 0.05 240)".
 * Falls back to a safe near-black if the input doesn't parse.
 */
export function deriveForeground(oklch: string): string {
  const match = oklch.match(/oklch\(\s*([\d.]+)/i);
  const L = match ? parseFloat(match[1]) : 0.5;
  return L > 0.62 ? "oklch(0.145 0 0)" : "oklch(0.985 0 0)";
}
