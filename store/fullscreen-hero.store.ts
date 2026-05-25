/**
 * Fullscreen-hero presence flag — refcount-based coordination between
 * Hero `lg` variants and SiteHeader.
 *
 * Any hero in `lg` height calls `enable()` on mount + `disable()` on
 * unmount via the `useFullscreenHeroMarker` hook. SiteHeader subscribes
 * to `count > 0` to know whether to render in its hidden-at-top mode
 * (slides in on scroll instead of always-visible).
 *
 * Refcounting (vs a plain boolean) avoids races when multiple lg heroes
 * unmount/remount across page transitions.
 */

import { useEffect } from "react";
import { create } from "zustand";

interface FullscreenHeroState {
  count: number;
  enable: () => void;
  disable: () => void;
}

export const useFullscreenHeroStore = create<FullscreenHeroState>((set) => ({
  count: 0,
  enable: () => set((s) => ({ count: s.count + 1 })),
  disable: () => set((s) => ({ count: Math.max(0, s.count - 1) })),
}));

/** Convenience hook for hero variants. Pass `true` when height === "lg". */
export function useFullscreenHeroMarker(active: boolean) {
  const enable = useFullscreenHeroStore((s) => s.enable);
  const disable = useFullscreenHeroStore((s) => s.disable);

  useEffect(() => {
    if (!active) return;
    enable();
    return () => disable();
  }, [active, enable, disable]);
}
