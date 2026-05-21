import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ApolloWrapper } from "@/lib/apollo/ApolloWrapper";
import { SiteSettingsProvider } from "@/lib/context/site-settings-context";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
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
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
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


