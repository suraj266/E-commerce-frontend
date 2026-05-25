"use client";

/**
 * SiteHeader — public storefront header.
 *
 * Renders two menus:
 *   - HEADER_TOP: thin strip above the main bar (small text links)
 *   - HEADER_PRIMARY: main horizontal nav with 1-level hover dropdowns
 *
 * Both menus are admin-managed via /admin/menus. If a menu is missing or
 * inactive, that surface is hidden (no fallback) — admin sees the empty
 * state in /admin/menus and adds items there.
 *
 * Mobile: at <md breakpoints the primary nav collapses into a hamburger
 * that opens MobileMenuDrawer.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery } from "@apollo/client/react";
import { ChevronDown, Menu as MenuIcon } from "lucide-react";

import { useFullscreenHeroStore } from "@/store/fullscreen-hero.store";

import { HeaderWishlistLink } from "@/components/wishlist/header-wishlist-link";
import { HeaderCartLink } from "@/components/cart/header-cart-link";
import { HeaderAccountLink } from "@/components/auth/header-account-link";
import { SearchTrigger } from "@/components/layout/search-trigger";
import { GET_PUBLIC_MENU } from "@/lib/graphql/menus";
import {
  GetPublicMenuData,
  parseMenuItems,
  type MenuItem,
} from "@/types/menu.types";
import { Button } from "@/components/ui/button";
import { MobileMenuDrawer } from "./mobile-menu-drawer";

function isExternal(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

function MenuLink({ item, className }: { item: MenuItem; className?: string }) {
  const ext = isExternal(item.url);
  const target = item.target ?? (ext ? "_blank" : "_self");
  const baseClass = className ?? "";
  if (target === "_blank") {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClass}
      >
        {item.label}
      </a>
    );
  }
  return (
    <Link href={item.url} className={baseClass}>
      {item.label}
    </Link>
  );
}

function PrimaryItem({ item }: { item: MenuItem }) {
  const visibleChildren = (item.children ?? []).filter((c) => c.visible !== false);
  const hasChildren = visibleChildren.length > 0;

  if (!hasChildren) {
    return (
      <MenuLink
        item={item}
        className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition"
      />
    );
  }

  return (
    <div className="relative group">
      <button
        type="button"
        className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition flex items-center gap-1"
      >
        {item.label}
        <ChevronDown className="h-3 w-3 mt-0.5" />
      </button>
      {/* Dropdown — appears on hover/focus-within */}
      <div className="absolute left-0 top-full pt-1 hidden group-hover:block group-focus-within:block z-50">
        <div className="rounded-md border bg-popover shadow-lg py-2 min-w-[220px]">
          {visibleChildren.map((child) => (
            <MenuLink
              key={child.id}
              item={child}
              className="block px-4 py-2 text-sm hover:bg-muted/50 transition"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  // True when a fullscreen-hero variant (lg height) is mounted on this page.
  // Drives the "hidden at top, slides in on scroll" mode.
  const hasFullscreenHero = useFullscreenHeroStore((s) => s.count > 0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!hasFullscreenHero) {
      setScrolled(false);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hasFullscreenHero]);

  // Hide-at-top mode: header is fixed (out of flow) so the lg hero can fill
  // the viewport, and we translate it offscreen until the user scrolls.
  const overlayMode = hasFullscreenHero;
  const hideAtTop = overlayMode && !scrolled;

  // Fetch HEADER_TOP separately so a missing/inactive top strip doesn't
  // block the rest of the header from rendering.
  const { data: topData } = useQuery<GetPublicMenuData>(GET_PUBLIC_MENU, {
    variables: { location: "HEADER_TOP" },
    fetchPolicy: "cache-first",
    errorPolicy: "ignore",
  });

  const { data: primaryData } = useQuery<GetPublicMenuData>(GET_PUBLIC_MENU, {
    variables: { location: "HEADER_PRIMARY" },
    fetchPolicy: "cache-first",
    errorPolicy: "ignore",
  });

  const topItems = parseMenuItems(topData?.publicMenu?.items).filter(
    (i) => i.visible !== false,
  );
  const primaryItems = parseMenuItems(primaryData?.publicMenu?.items).filter(
    (i) => i.visible !== false,
  );

  const positionClass = overlayMode
    ? "fixed top-0 left-0 right-0"
    : "sticky top-0";
  const bgClass = hideAtTop
    ? "bg-transparent border-transparent"
    : "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b";
  const transformClass = hideAtTop ? "-translate-y-full" : "translate-y-0";

  return (
    <>
      <header
        className={`${positionClass} z-40 ${bgClass} ${transformClass} transition-transform duration-300 ease-out`}
      >
        {/* Top strip */}
        {topItems.length > 0 && (
          <div className="bg-muted/30 border-b border-border/50">
            <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-end gap-4 text-xs">
              {topItems.map((item) => (
                <MenuLink
                  key={item.id}
                  item={item}
                  className="text-muted-foreground hover:text-foreground transition"
                />
              ))}
            </div>
          </div>
        )}

        {/* Main bar */}
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <MenuIcon className="h-5 w-5" />
          </Button>

          {/* Logo / wordmark */}
          <Link href="/" className="font-bold text-lg shrink-0">
            Ecommerce
          </Link>

          {/* Primary nav (desktop). No flex-1 — the inline search input
              below takes the spare horizontal space instead. */}
          <nav className="hidden md:flex items-center gap-1 shrink-0">
            {primaryItems.map((item) => (
              <PrimaryItem key={item.id} item={item} />
            ))}
          </nav>

          {/* Inline header search. Renders an always-visible input on
              desktop (flex-1 inside the SearchTrigger) and a separate icon
              trigger on mobile, so the same component covers both layouts. */}
          <SearchTrigger />

          {/* Right-side actions */}
          <div className="ml-auto md:ml-0 flex items-center gap-1 shrink-0">
            <HeaderAccountLink />
            <HeaderWishlistLink />
            <HeaderCartLink />
          </div>
        </div>
      </header>

      <MobileMenuDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        items={primaryItems}
        topItems={topItems}
      />
    </>
  );
}
