import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { ApolloWrapper } from "@/lib/apollo/ApolloWrapper";
import { SiteSettingsProvider } from "@/lib/context/site-settings-context";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

// Display/heading voice — geometric, contemporary, gives the storefront a
// recognizable personality instead of "default Inter everywhere". Consumed via
// the `--font-heading` token (globals.css) → `font-heading` utility.
const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ecommerce Platform",
  description: "Multi-seller ecommerce platform - Admin, Seller & Customer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
      // Browser extensions (Grammarly, Scribe Recorder, dark-mode forcers,
      // password managers, etc.) routinely mutate <html>/<body> attributes
      // before React hydrates, which triggers a noisy mismatch warning.
      // Scope is limited to direct attributes of <html> — descendants are
      // still hydration-checked normally.
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        <ApolloWrapper>
          <SiteSettingsProvider>{children}</SiteSettingsProvider>
        </ApolloWrapper>
        {/* Global toast notifications */}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}


