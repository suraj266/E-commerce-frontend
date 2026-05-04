"use client";

/**
 * Page title context — lets a leaf page override the breadcrumb's last
 * segment. Without this, the header falls back to the URL's last segment,
 * which renders raw UUIDs on dynamic detail routes.
 *
 * Usage from a page:
 *   useSetPageTitle(product?.name ?? "Edit product");
 *
 * The header reads the current value via `usePageTitle()`. On unmount the
 * page clears its title (only if it still owns it) so navigating away
 * doesn't leave a stale label behind.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface PageTitleContextValue {
  title: string | null;
  setTitle: (next: string | null) => void;
}

const PageTitleContext = createContext<PageTitleContextValue | null>(null);

export function PageTitleProvider({ children }: { children: React.ReactNode }) {
  const [title, setTitle] = useState<string | null>(null);
  return (
    <PageTitleContext.Provider value={{ title, setTitle }}>
      {children}
    </PageTitleContext.Provider>
  );
}

export function usePageTitle(): string | null {
  return useContext(PageTitleContext)?.title ?? null;
}

/**
 * Push a title for the current page. Cleared on unmount, but only if the
 * current value still matches — protects against a fast page transition
 * where the next page's mount runs before the previous page's cleanup.
 */
export function useSetPageTitle(title: string | null | undefined) {
  const ctx = useContext(PageTitleContext);
  const lastTitleRef = useRef<string | null>(null);

  const set = useCallback(
    (value: string | null) => {
      if (!ctx) return;
      ctx.setTitle(value);
      lastTitleRef.current = value;
    },
    [ctx],
  );

  useEffect(() => {
    if (!ctx) return;
    const next = title ?? null;
    set(next);
    return () => {
      // Only clear if we still own the title — prevents clobbering
      // a concurrently-mounted next page that already set its own.
      if (ctx && lastTitleRef.current === next) {
        ctx.setTitle(null);
        lastTitleRef.current = null;
      }
    };
  }, [ctx, set, title]);
}
