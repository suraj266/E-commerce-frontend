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
  /** True while the initial fetch is in-flight. */
  loading: boolean;
}

const SiteSettingsContext = createContext<SiteSettingsContextValue>({
  settings: {},
  showPriceWithTax: false,
  getDisplayPrice: (price) => price ?? 0,
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

    return {
      settings: settingsMap,
      showPriceWithTax,
      getDisplayPrice: (price, priceWithTax) => {
        if (showPriceWithTax && priceWithTax != null) return priceWithTax;
        return price ?? 0;
      },
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
