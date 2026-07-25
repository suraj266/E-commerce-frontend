"use client";

import { ShieldCheck } from "lucide-react";

import { SectionHeader } from "./checkout-ui";

/** Optional free-text notes for the seller (capped at 500 chars). */
export function OrderNotesSection({
  notes,
  onChange,
}: {
  notes: string;
  onChange: (value: string) => void;
}) {
  return (
    <section className="rounded-lg border bg-card p-6">
      <SectionHeader icon={ShieldCheck} title="Order notes (optional)" />
      <textarea
        value={notes}
        onChange={(e) => onChange(e.target.value.slice(0, 500))}
        placeholder="Anything the seller should know? (e.g. delivery instructions)"
        rows={3}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-brand transition resize-none"
      />
      <p className="mt-1 text-xs text-foreground/50">{notes.length} / 500</p>
    </section>
  );
}
