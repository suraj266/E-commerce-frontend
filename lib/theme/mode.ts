import "server-only";
import { cookies } from "next/headers";

/**
 * Light/dark preference shared between the admin and seller portals. Stored
 * in a cookie at path `/` so the server can apply `.dark` on the
 * `[data-admin-theme]` wrapper at render time (no flash of the wrong mode
 * on first paint), and toggling in one portal carries over to the other.
 *
 * v1 keeps it binary — no "system" option — so SSR can decide
 * deterministically without knowing the user's OS preference.
 */

export type AppThemeMode = "light" | "dark";

export const APP_THEME_MODE_COOKIE = "admin-theme-mode";

export async function getAppThemeMode(): Promise<AppThemeMode> {
  const v = (await cookies()).get(APP_THEME_MODE_COOKIE)?.value;
  return v === "dark" ? "dark" : "light";
}

// Back-compat aliases — older imports use these names.
export const ADMIN_THEME_MODE_COOKIE = APP_THEME_MODE_COOKIE;
export const getAdminThemeMode = getAppThemeMode;
export type AdminThemeMode = AppThemeMode;
