/**
 * Admin Panel theme record. Mirrors the backend AdminThemeSetting model.
 * All color values are raw OKLCH strings ("oklch(L C H)") so they can be
 * dropped straight into a CSS variable without conversion.
 */
export interface AdminTheme {
  id: string;
  primaryLight: string;
  primaryDark: string;
  accentLight: string;
  accentDark: string;
  sidebarLight: string;
  sidebarDark: string;
  destructiveLight: string;
  destructiveDark: string;
  /** CSS length, e.g. "0.625rem". */
  radius: string;
  /** 'inter' | 'jetbrains' | 'system' | null. */
  fontFamily?: string | null;
  updatedAt: string;
  updatedById?: string | null;
}

/**
 * Hard-coded fallback used when the backend is unreachable on first paint.
 * Values match the original tokens in app/globals.css so the admin panel
 * looks identical to the pre-dynamic-theme state.
 */
export const ADMIN_THEME_DEFAULTS: AdminTheme = {
  id: "global",
  primaryLight: "oklch(0.205 0 0)",
  primaryDark: "oklch(0.922 0 0)",
  accentLight: "oklch(0.97 0 0)",
  accentDark: "oklch(0.269 0 0)",
  sidebarLight: "oklch(0.985 0 0)",
  sidebarDark: "oklch(0.205 0 0)",
  destructiveLight: "oklch(0.577 0.245 27.325)",
  destructiveDark: "oklch(0.704 0.191 22.216)",
  radius: "0.625rem",
  fontFamily: "inter",
  updatedAt: new Date(0).toISOString(),
};

export interface GetAdminThemeData {
  adminTheme: AdminTheme;
}

export interface UpdateAdminThemeData {
  updateAdminTheme: AdminTheme;
}

export interface ResetAdminThemeData {
  resetAdminTheme: AdminTheme;
}
