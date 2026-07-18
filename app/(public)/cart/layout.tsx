import type { Metadata } from "next";

// The cart is a transient, per-user page — exclude it from search indexes.
export const metadata: Metadata = {
  title: "Cart",
  robots: { index: false, follow: false },
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
