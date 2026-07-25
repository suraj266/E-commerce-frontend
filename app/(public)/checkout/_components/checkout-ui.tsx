"use client";

import Link from "next/link";

/** Section title row with an icon and an optional right-aligned action. */
export function SectionHeader({
  icon: Icon,
  title,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-base font-semibold flex items-center gap-2">
        <Icon className="h-4 w-4 text-foreground/60" />
        {title}
      </h2>
      {action}
    </div>
  );
}

/** A label/value row used throughout the order-summary totals. */
export function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-foreground/70">
      <span>{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}

/** Centred empty/gate state (not signed in, empty cart, etc.). */
export function CenteredEmpty({
  title,
  body,
  cta,
}: {
  title: string;
  body: string;
  cta: { href: string; label: string };
}) {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="text-sm text-foreground/60">{body}</p>
      <Link
        href={cta.href}
        className="inline-flex items-center justify-center rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white shadow hover:bg-brand/90 transition"
      >
        {cta.label}
      </Link>
    </div>
  );
}

/** Loading skeleton shown while the cart query resolves. */
export function SkeletonView() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 lg:py-14">
      <div className="h-8 w-48 bg-muted animate-pulse rounded mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
        <div className="h-72 rounded-lg bg-muted animate-pulse" />
      </div>
    </div>
  );
}
