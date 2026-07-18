import type { Metadata } from "next";

// Checkout (and its success / failed sub-routes) are private transactional
// pages — keep them out of search indexes.
export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
