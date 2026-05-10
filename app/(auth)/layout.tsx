/**
 * =============================================================================
 * Auth Layout
 * =============================================================================
 *
 * Wraps every (auth) route group page with the reverse-auth proxy so logged-in
 * users get bounced to their dashboard instead of seeing the login screen.
 *
 * The actual visual chrome (split-screen, branding, etc.) lives in each page
 * via <AuthSplitLayout>, so individual pages can vary their visual panel
 * copy without forking the whole layout.
 * =============================================================================
 */

import { ReverseAuthProxy } from "@/components/providers/reverse-auth-proxy";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ReverseAuthProxy>{children}</ReverseAuthProxy>;
}
