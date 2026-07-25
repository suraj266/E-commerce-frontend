"use client";

import Link from "next/link";
import { Loader2, MapPin, Plus } from "lucide-react";

import { Address } from "@/types/account.types";
import { SectionHeader } from "./checkout-ui";

/**
 * Shipping-address picker. Renders the saved addresses as selectable cards,
 * a loading state while they resolve, and a "no addresses" prompt otherwise.
 */
export function AddressSection({
  addresses,
  loading,
  selectedAddressId,
  onSelect,
}: {
  addresses: Address[];
  loading: boolean;
  selectedAddressId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <section className="rounded-lg border bg-card p-6">
      <SectionHeader
        icon={MapPin}
        title="Shipping address"
        action={
          <Link
            href="/account/addresses"
            className="text-xs font-semibold text-brand hover:underline"
          >
            Manage
          </Link>
        }
      />

      {loading && addresses.length === 0 ? (
        <div className="text-sm text-foreground/60">
          <Loader2 className="inline h-4 w-4 animate-spin mr-2" />
          Loading addresses...
        </div>
      ) : addresses.length === 0 ? (
        <NoAddressBlock />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {addresses.map((a) => (
            <AddressOption
              key={a.id}
              addr={a}
              selected={selectedAddressId === a.id}
              onSelect={() => onSelect(a.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function AddressOption({
  addr,
  selected,
  onSelect,
}: {
  addr: Address;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`text-left rounded-md border p-4 transition ${
        selected
          ? "border-brand bg-blue-50/50 ring-2 ring-brand/10"
          : "hover:border-foreground/40"
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] uppercase tracking-wide font-semibold text-foreground/60">
          {addr.label || addr.type}
        </span>
        {addr.isDefault && (
          <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-brand text-white">
            Default
          </span>
        )}
      </div>
      <div className="text-sm font-semibold">
        {addr.firstName} {addr.lastName}
      </div>
      <div className="text-xs text-foreground/70 mt-1 leading-relaxed">
        {addr.addressLine1}
        {addr.addressLine2 && <>, {addr.addressLine2}</>}
        <br />
        {addr.city}, {addr.state} {addr.postalCode}
      </div>
      {addr.phone && (
        <div className="text-xs text-foreground/60 mt-1">{addr.phone}</div>
      )}
    </button>
  );
}

function NoAddressBlock() {
  return (
    <div className="rounded-md border border-dashed bg-muted/20 px-4 py-6 text-center">
      <p className="text-sm text-foreground/70">
        You don&apos;t have any saved addresses.
      </p>
      <Link
        href="/account/addresses"
        className="mt-3 inline-flex items-center justify-center rounded-md bg-brand text-white px-5 py-2 text-sm font-semibold hover:bg-brand/90 transition"
      >
        <Plus className="mr-1.5 h-4 w-4" />
        Add an address
      </Link>
    </div>
  );
}
