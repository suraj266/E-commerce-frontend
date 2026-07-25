/**
 * Shared route-level loading skeletons.
 *
 * These back the per-segment `loading.tsx` files. Next.js wraps each segment's
 * `page.tsx` in a `<Suspense>` boundary whose fallback is the segment's
 * `loading.tsx`; keeping the skeletons here means each `loading.tsx` stays a
 * one-line wrapper and the shapes stay consistent across route groups.
 *
 * All variants are pure presentational Server Components (no client JS) built
 * from the design-system `Skeleton` primitive and tokens.
 *
 * - `RouteSkeleton`        — generic centered content shell (default).
 * - `ProductSkeleton`      — product-detail shape: gallery + buy panel.
 * - `CheckoutSkeleton`     — checkout shape: form column + order summary rail.
 * - `DashboardSkeleton`    — admin/seller shape: header + stat tiles + table.
 */

import { Skeleton } from "@/components/ui/skeleton";

/**
 * Generic full-width content placeholder. Used by the top-level route-group
 * `loading.tsx` files (public / admin / seller / customer) and the account
 * segment.
 */
export function RouteSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-10">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-4 w-2/3" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}

/**
 * Product detail: image gallery on the left, title / price / variant / buy
 * controls on the right. Mirrors the two-column layout of the real page.
 */
export function ProductSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div className="space-y-4">
          <Skeleton className="aspect-square w-full rounded-xl" />
          <div className="flex gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-20 rounded-lg" />
            ))}
          </div>
        </div>
        {/* Buy panel */}
        <div className="space-y-5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="h-7 w-32" />
          <div className="space-y-2 pt-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="flex gap-3 pt-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-16 rounded-md" />
            ))}
          </div>
          <Skeleton className="h-12 w-full rounded-md" />
          <Skeleton className="h-12 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
}

/**
 * Checkout: form column (address / shipping / payment) plus a sticky order
 * summary rail. Mirrors the real `grid lg:grid-cols-[1fr_360px]` layout.
 */
export function CheckoutSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-10 lg:py-14">
      <Skeleton className="h-8 w-40" />
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        {/* Form column */}
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, section) => (
            <div key={section} className="space-y-3 rounded-lg border p-5">
              <Skeleton className="h-5 w-40" />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full rounded-md" />
                ))}
              </div>
            </div>
          ))}
        </div>
        {/* Order summary rail */}
        <div className="space-y-4 rounded-lg border p-5">
          <Skeleton className="h-5 w-32" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-14 w-14 rounded-md" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>
          ))}
          <Skeleton className="h-px w-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-6 w-1/2" />
          </div>
          <Skeleton className="h-12 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
}

/**
 * Admin / seller dashboard: page header, a row of stat tiles, then a table
 * placeholder. Rendered inside the existing sidebar shell (the group layout
 * stays mounted while the segment streams).
 */
export function DashboardSkeleton() {
  return (
    <div className="w-full space-y-6 p-4 md:p-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-lg" />
        ))}
      </div>
      <div className="space-y-3 rounded-lg border p-4">
        <Skeleton className="h-5 w-40" />
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    </div>
  );
}

export default RouteSkeleton;
