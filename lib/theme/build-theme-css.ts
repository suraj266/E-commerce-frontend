import type { AdminTheme } from "@/types/admin-theme.types";
import { deriveForeground } from "./derive-foreground";

/**
 * Render an admin theme record into a scoped CSS block. The block sets CSS
 * variables on `[data-admin-theme]` for light mode and on
 * `[data-admin-theme].dark` (or `.dark [data-admin-theme]`) for dark mode.
 *
 * Drop the result into a server-rendered `<style>` tag inside the (admin)
 * layout. The variables cascade to every Shadcn/Radix component below.
 *
 * Only tokens an admin can change are scoped here. Neutral surface tokens
 * (--background, --foreground, --muted, --border, --card) stay in
 * globals.css so contrast doesn't drift unexpectedly.
 */
export function buildThemeCss(theme: AdminTheme): string {
  const fontFamily =
    theme.fontFamily === "jetbrains"
      ? "var(--font-geist-mono), monospace"
      : theme.fontFamily === "system"
        ? "system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
        : "var(--font-sans), system-ui, sans-serif";

  const lightFg = deriveForeground(theme.primaryLight);
  const darkFg = deriveForeground(theme.primaryDark);

  // Brand-tinted active/hover surface for the sidebar. We blend the primary
  // color with the sidebar bg so the tint adapts automatically when either
  // changes.
  //
  // CRITICAL: mix in `oklab` (rectangular L/a/b), NOT `oklch` (polar L/C/H).
  // OKLCH would rotate through the hue circle when blending with an
  // achromatic color (white/black has hue=0), producing wrong tints — e.g.
  // blue + white in oklch travels via violet→pink at low percentages,
  // landing on lavender instead of light blue. OKLab interpolates on a
  // straight line between the two colors, so blue stays blue.
  //
  // ~15% in light reads as a soft, lightly-branded tint for the active/hover
  // item; ~18% in dark mode compensates for visual absorption on dark surfaces.
  const sidebarAccentLight =
    "color-mix(in oklab, var(--primary) 15%, var(--sidebar))";
  const sidebarAccentDark =
    "color-mix(in oklab, var(--primary) 18%, var(--sidebar))";

  return `
[data-admin-theme] {
  --primary: ${theme.primaryLight};
  --primary-foreground: ${lightFg};
  --accent: ${theme.accentLight};
  --accent-foreground: ${deriveForeground(theme.accentLight)};
  --sidebar: ${theme.sidebarLight};
  --sidebar-primary: ${theme.primaryLight};
  --sidebar-primary-foreground: ${lightFg};
  --sidebar-accent: ${sidebarAccentLight};
  --sidebar-accent-foreground: var(--primary);
  --destructive: ${theme.destructiveLight};
  --radius: ${theme.radius};
  --font-sans: ${fontFamily};
}
[data-admin-theme].dark,
.dark [data-admin-theme] {
  --primary: ${theme.primaryDark};
  --primary-foreground: ${darkFg};
  --accent: ${theme.accentDark};
  --accent-foreground: ${deriveForeground(theme.accentDark)};
  --sidebar: ${theme.sidebarDark};
  --sidebar-primary: ${theme.primaryDark};
  --sidebar-primary-foreground: ${darkFg};
  --sidebar-accent: ${sidebarAccentDark};
  --sidebar-accent-foreground: var(--primary);
  --destructive: ${theme.destructiveDark};
}
`.trim();
}
