import { ProductSkeleton } from "@/components/shell/route-skeleton";

// Loading fallback for the product-detail segment — mirrors the gallery +
// buy-panel two-column layout of the real page.
export default function ProductLoading() {
  return <ProductSkeleton />;
}
