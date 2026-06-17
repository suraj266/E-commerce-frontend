/**
 * Site Settings Context — provides global settings to the storefront.
 *
 * Fetches GENERAL group settings once on mount and exposes typed helpers
 * like `showPriceWithTax` and `getDisplayPrice()`.
 *
 * Usage:
 *   const { showPriceWithTax, getDisplayPrice } = useSiteSettings();
 *   <span>{formatCurrency(getDisplayPrice(product.price, product.priceWithTax))}</span>
 */

"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { useQuery } from "@apollo/client/react";
import { GET_SITE_SETTINGS } from "@/lib/graphql/settings";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface SiteSetting {
  key: string;
  value: string;
  valueType: string;
}

/** Fallback brand name used wherever `platform_name` is unset. */
const DEFAULT_BRAND_NAME = "Ecommerce";
/** Default logo height (px) and the bounds we clamp the admin value to. */
const DEFAULT_LOGO_HEIGHT = 32;
const MIN_LOGO_HEIGHT = 16;
const MAX_LOGO_HEIGHT = 96;

interface SiteSettingsContextValue {
  /** All GENERAL group settings as a key→value map. */
  settings: Record<string, string>;
  /** Whether the admin has enabled tax-inclusive price display. */
  showPriceWithTax: boolean;
  /** Returns priceWithTax if the setting is ON and the value exists, else returns price. */
  getDisplayPrice: (
    price: number | null | undefined,
    priceWithTax: number | null | undefined,
  ) => number;
  /** Global brand logo URL, or null when unset (callers fall back to brandName). */
  logoUrl: string | null;
  /** Global brand name (falls back to "Ecommerce" when unset). */
  brandName: string;
  /** Rendered logo height in px (clamped), applied across the UI surfaces. */
  logoHeight: number;
  /** True while the initial fetch is in-flight. */
  loading: boolean;
}

const SiteSettingsContext = createContext<SiteSettingsContextValue>({
  settings: {},
  showPriceWithTax: false,
  getDisplayPrice: (price) => price ?? 0,
  logoUrl: null,
  brandName: DEFAULT_BRAND_NAME,
  logoHeight: DEFAULT_LOGO_HEIGHT,
  loading: true,
});

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const { data, loading } = useQuery<{ siteSettings: SiteSetting[] }>(
    GET_SITE_SETTINGS,
    {
      variables: { group: "GENERAL" },
      fetchPolicy: "cache-and-network", // ensure settings update across reloads
    },
  );

  const value = useMemo<SiteSettingsContextValue>(() => {
    const settingsMap: Record<string, string> = {};
    for (const s of data?.siteSettings ?? []) {
      settingsMap[s.key] = s.value;
    }

    const showPriceWithTax = settingsMap["show_price_with_tax"] === "true";
    const rawLogo = settingsMap["platform_logo_url"]?.trim();
    const logoUrl = rawLogo ? rawLogo : null;
    const brandName = settingsMap["platform_name"]?.trim() || DEFAULT_BRAND_NAME;

    const parsedHeight = Number(settingsMap["platform_logo_height"]);
    const logoHeight = Number.isFinite(parsedHeight)
      ? Math.min(MAX_LOGO_HEIGHT, Math.max(MIN_LOGO_HEIGHT, parsedHeight))
      : DEFAULT_LOGO_HEIGHT;

    return {
      settings: settingsMap,
      showPriceWithTax,
      getDisplayPrice: (price, priceWithTax) => {
        if (showPriceWithTax && priceWithTax != null) return priceWithTax;
        return price ?? 0;
      },
      logoUrl,
      brandName,
      logoHeight,
      loading,
    };
  }, [data, loading]);

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
