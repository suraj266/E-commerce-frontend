/**
 * AuthSplitLayout — shared two-pane shell for /login and /register.
 *
 * Left pane: a fixed-aspect visual panel (image with overlay text + brand
 * copy at the bottom). Hidden below md so the form takes the full width on
 * mobile. Falls back to a navy gradient when no `imageUrl` is provided.
 *
 * Right pane: the page-specific form, scrollable on small viewports.
 *
 * The visual copy (eyebrow heading + supporting line) is passed via props
 * so each auth page can have its own marketing message.
 */

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface AuthSplitLayoutProps {
  /** Form-side content (the actual auth form). */
  children: React.ReactNode;
  /** Big white heading shown over the visual panel. */
  visualTitle: string;
  /** Smaller supporting line under the title. */
  visualSubtext?: string;
  /** Optional background image URL for the visual panel. */
  imageUrl?: string;
  /** Show a back arrow at the top of the form panel — links to `/`. */
  showBackLink?: boolean;
  /** Brand wordmark above the form — defaults to the project name. */
  brand?: string;
}

export function AuthSplitLayout({
  children,
  visualTitle,
  visualSubtext,
  imageUrl,
  showBackLink = false,
  brand = "LUXE",
}: AuthSplitLayoutProps) {
  return (
    <div className="min-h-screen w-full grid md:grid-cols-2 bg-white">
      {/* ============================================================
          Left visual panel — md+ only
          ============================================================ */}
      <aside className="hidden md:flex relative overflow-hidden">
        {imageUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-brand/40 via-brand/30 to-brand/80" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-brand to-slate-800" />
        )}

        {/* Bottom-left copy overlay */}
        <div className="relative z-10 mt-auto p-10 lg:p-14 max-w-lg text-white">
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight leading-tight">
            {visualTitle}
          </h2>
          {visualSubtext && (
            <p className="mt-3 text-sm lg:text-base text-white/80 leading-relaxed">
              {visualSubtext}
            </p>
          )}
        </div>
      </aside>

      {/* ============================================================
          Right form panel
          ============================================================ */}
      <main className="flex flex-col px-6 py-10 sm:px-12 lg:px-20">
        <div className="flex items-center justify-between">
          {showBackLink ? (
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          ) : (
            <span />
          )}
        </div>

        <div className="flex-1 flex items-center">
          <div className="w-full max-w-md mx-auto py-8">
            {brand && (
              <div className="mb-10 text-2xl font-bold tracking-[0.2em] text-brand">
                {brand}
              </div>
            )}
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
