"use client";

/**
 * Storefront light/dark toggle. Mirrors the admin/seller ThemeToggle: it flips
 * `.dark` on the `[data-store-theme]` wrapper (rendered by the public layout)
 * and writes the shared platform theme cookie so a fresh load applies the
 * right mode server-side (no flash of the wrong theme).
 *
 * Reuses the same cookie as the admin/seller portals — one platform, one
 * light/dark preference — and reads its initial state from the DOM after
 * hydration so SSR HTML matches.
 */

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

const COOKIE_NAME = "admin-theme-mode";
const ONE_YEAR = 60 * 60 * 24 * 365;

export function StoreThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Defer the DOM read a frame so it's not a synchronous setState in the
    // effect body; the placeholder icon covers this single frame.
    const id = requestAnimationFrame(() => {
      const root = document.querySelector("[data-store-theme]");
      setIsDark(root?.classList.contains("dark") ?? false);
      setMounted(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  function toggle() {
    const next = !isDark;
    const root = document.querySelector("[data-store-theme]");
    if (root) root.classList.toggle("dark", next);
    document.cookie = `${COOKIE_NAME}=${next ? "dark" : "light"}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
    setIsDark(next);
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {mounted ? (
        isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />
      ) : (
        <span className="h-5 w-5" />
      )}
    </Button>
  );
}
