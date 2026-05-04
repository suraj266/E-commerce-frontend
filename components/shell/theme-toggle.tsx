"use client";

/**
 * Light/dark toggle used by both the admin and seller shells.
 *
 * Mirrors the cookie that the server reads in each portal's layout so a fresh
 * page load applies the right class server-side (no FOUC). The button itself
 * just flips the class on `[data-admin-theme]` and writes the cookie — no
 * router refresh, no re-fetch.
 *
 * The cookie is at path `/` so toggling in one portal carries over to the
 * other (single platform brand, single dark/light preference).
 *
 * Reads its initial state from the DOM rather than props to avoid threading
 * the cookie value through every layout → header chain.
 */

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

const COOKIE_NAME = "admin-theme-mode";
const ONE_YEAR = 60 * 60 * 24 * 365;

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Read the initial state from the DOM after hydration. Before mount we
  // render a placeholder so SSR HTML matches.
  useEffect(() => {
    const root = document.querySelector("[data-admin-theme]");
    setIsDark(root?.classList.contains("dark") ?? false);
    setMounted(true);
  }, []);

  function toggle() {
    const next = !isDark;
    const root = document.querySelector("[data-admin-theme]");
    if (root) root.classList.toggle("dark", next);
    document.cookie = `${COOKIE_NAME}=${next ? "dark" : "light"}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
    setIsDark(next);
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      className="relative h-9 w-9"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {mounted ? (
        isDark ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )
      ) : (
        // Pre-hydration placeholder — same dimensions, no icon
        <span className="h-4 w-4" />
      )}
    </Button>
  );
}
