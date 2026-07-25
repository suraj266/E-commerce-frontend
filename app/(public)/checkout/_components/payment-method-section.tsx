"use client";

import Image from "next/image";
import { Banknote, CreditCard, Loader2, Wallet } from "lucide-react";

import { ActiveGateway, PaymentGateway } from "@/types/order.types";
import { formatPrice } from "@/lib/utils/currency";
import { SectionHeader } from "./checkout-ui";

/**
 * Payment-method selector. The gateways are fetched dynamically from the
 * backend, so whatever the admin has enabled shows up here.
 */
export function PaymentMethodSection({
  gateways,
  loading,
  selectedGateway,
  onSelect,
}: {
  gateways: ActiveGateway[];
  loading: boolean;
  selectedGateway: PaymentGateway | null;
  onSelect: (gateway: PaymentGateway) => void;
}) {
  return (
    <section className="rounded-lg border bg-card p-6">
      <SectionHeader icon={CreditCard} title="Payment method" />

      {loading ? (
        <div className="text-sm text-foreground/60">
          <Loader2 className="inline h-4 w-4 animate-spin mr-2" />
          Loading payment methods...
        </div>
      ) : gateways.length === 0 ? (
        <div className="rounded-md border border-dashed bg-muted/20 px-4 py-6 text-center text-sm text-foreground/70">
          No payment methods are currently available. Please contact support.
        </div>
      ) : (
        <div className="space-y-2">
          {gateways.map((gw) => (
            <GatewayOption
              key={gw.id}
              gw={gw}
              selected={selectedGateway === gw.gateway}
              onSelect={() => onSelect(gw.gateway)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

/** Dynamic gateway option card — replaces the old hardcoded PaymentOption. */
function GatewayOption({
  gw,
  selected,
  onSelect,
}: {
  gw: ActiveGateway;
  selected: boolean;
  onSelect: () => void;
}) {
  const icon =
    gw.gateway === "COD" ? (
      <Banknote className="h-5 w-5 text-foreground/60" />
    ) : (
      <Wallet className="h-5 w-5 text-foreground/60" />
    );

  return (
    <label
      className={`flex items-start gap-3 rounded-md border p-3 transition cursor-pointer ${
        selected ? "border-brand bg-blue-50/50" : "hover:border-foreground/40"
      }`}
    >
      <input
        type="radio"
        name="payment-gateway"
        value={gw.gateway}
        checked={selected}
        onChange={onSelect}
        className="mt-0.5 h-4 w-4"
      />
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        {gw.logoUrl ? (
          <div className="relative h-6 w-6">
            <Image
              src={gw.logoUrl}
              alt={gw.displayName}
              fill
              sizes="50px"
              className="object-contain rounded"
            />
          </div>
        ) : (
          icon
        )}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold flex items-center gap-2">
            {gw.displayName}
            {gw.isDefault && (
              <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                Recommended
              </span>
            )}
          </div>
          {gw.description && (
            <div className="text-xs text-foreground/60 mt-0.5 line-clamp-1">
              {gw.description}
            </div>
          )}
          {gw.processingFee > 0 && (
            <div className="text-xs text-foreground/50 mt-0.5">
              Processing fee:{" "}
              {gw.processingFeeType === "PERCENTAGE"
                ? `${gw.processingFee}%`
                : formatPrice(gw.processingFee)}
            </div>
          )}
        </div>
      </div>
    </label>
  );
}
