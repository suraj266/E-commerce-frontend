import type { AdminTheme } from "@/types/admin-theme.types";

/**
 * Curated theme presets. Each one fills every editable token. Click-to-apply
 * lets an admin pick a complete look without picking 8 colors by hand.
 *
 * Picks lean toward neutral surfaces (sidebar stays near-white in light /
 * near-black in dark) so the brand color is the one thing that changes
 * dramatically between presets — keeps the panel readable across all of them.
 */

type PresetTheme = Pick<
  AdminTheme,
  | "primaryLight"
  | "primaryDark"
  | "accentLight"
  | "accentDark"
  | "sidebarLight"
  | "sidebarDark"
  | "destructiveLight"
  | "destructiveDark"
  | "radius"
  | "fontFamily"
>;

export interface ThemePreset {
  id: string;
  name: string;
  /** Color shown in the preset chip — usually the light primary. */
  swatch: string;
  values: PresetTheme;
}

const NEUTRAL_DEFAULT: Omit<PresetTheme, "primaryLight" | "primaryDark"> = {
  accentLight: "oklch(0.97 0 0)",
  accentDark: "oklch(0.269 0 0)",
  sidebarLight: "oklch(0.985 0 0)",
  sidebarDark: "oklch(0.205 0 0)",
  destructiveLight: "oklch(0.577 0.245 27.325)",
  destructiveDark: "oklch(0.704 0.191 22.216)",
  radius: "0.625rem",
  fontFamily: "inter",
};

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "mono",
    name: "Default Mono",
    swatch: "oklch(0.205 0 0)",
    values: {
      ...NEUTRAL_DEFAULT,
      primaryLight: "oklch(0.205 0 0)",
      primaryDark: "oklch(0.922 0 0)",
    },
  },
  {
    id: "indigo",
    name: "Indigo",
    swatch: "oklch(0.55 0.21 273)",
    values: {
      ...NEUTRAL_DEFAULT,
      primaryLight: "oklch(0.55 0.21 273)",
      primaryDark: "oklch(0.7 0.17 273)",
    },
  },
  {
    id: "emerald",
    name: "Emerald",
    swatch: "oklch(0.62 0.17 162)",
    values: {
      ...NEUTRAL_DEFAULT,
      primaryLight: "oklch(0.62 0.17 162)",
      primaryDark: "oklch(0.75 0.14 162)",
    },
  },
  {
    id: "amber",
    name: "Amber",
    swatch: "oklch(0.78 0.17 75)",
    values: {
      ...NEUTRAL_DEFAULT,
      primaryLight: "oklch(0.72 0.17 65)",
      primaryDark: "oklch(0.82 0.16 75)",
    },
  },
  {
    id: "crimson",
    name: "Crimson",
    swatch: "oklch(0.55 0.22 25)",
    values: {
      ...NEUTRAL_DEFAULT,
      primaryLight: "oklch(0.55 0.22 25)",
      primaryDark: "oklch(0.7 0.18 25)",
    },
  },
  {
    id: "ocean",
    name: "Ocean",
    swatch: "oklch(0.6 0.13 230)",
    values: {
      ...NEUTRAL_DEFAULT,
      primaryLight: "oklch(0.55 0.13 230)",
      primaryDark: "oklch(0.72 0.11 230)",
    },
  },
];

/** Quick-pick swatches for the per-color picker. Matches the preset palette
 * but in pure colors so admins can mix and match. */
export const QUICK_SWATCHES: string[] = [
  "oklch(0.205 0 0)", // near-black
  "oklch(0.55 0.21 273)", // indigo
  "oklch(0.55 0.21 295)", // violet
  "oklch(0.55 0.22 25)", // red
  "oklch(0.65 0.2 35)", // orange
  "oklch(0.78 0.17 75)", // amber
  "oklch(0.72 0.17 130)", // lime
  "oklch(0.62 0.17 162)", // emerald
  "oklch(0.6 0.13 200)", // teal
  "oklch(0.6 0.13 230)", // sky
  "oklch(0.55 0.18 260)", // blue
  "oklch(0.55 0.21 320)", // pink
];
