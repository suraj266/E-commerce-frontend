import type { Metadata } from "next";
import { AccountShell } from "./_components/account-shell";

// Private, per-user pages — keep them out of search indexes.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AccountShell>{children}</AccountShell>;
}
