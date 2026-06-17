"use client";

/**
 * DeliveryCheck — a lightweight pincode "check delivery" widget for the cart.
 *
 * Before the customer picks an address, they can enter a pincode to see whether
 * their cart is serviceable, the estimated shipping charge, and COD
 * availability. Uses the same `shippingQuote` engine as checkout/placement.
 */

import { useState } from "react";
import { useLazyQuery } from "@apollo/client/react";
import { MapPin, Loader2, CheckCircle2, XCircle } from "lucide-react";

import { GET_SHIPPING_QUOTE } from "@/lib/graphql/shipping";
import type { ShippingQuoteData } from "@/types/shipping.types";
import { formatPrice } from "@/lib/utils/currency";

export function DeliveryCheck() {
  const [pincode, setPincode] = useState("");
  const [runQuote, { data, loading }] =
    useLazyQuery<ShippingQuoteData>(GET_SHIPPING_QUOTE, {
      fetchPolicy: "network-only",
    });

  const valid = /^[1-9][0-9]{5}$/.test(pincode);
  const quote = data?.shippingQuote ?? null;

  const check = () => {
    if (!valid) return;
    runQuote({ variables: { input: { pincode } } });
  };

  return (
    <div className="rounded-md border bg-muted/20 p-3 space-y-2">
      <div className="flex items-center gap-1.5 text-sm font-medium">
        <MapPin className="h-4 w-4 text-primary" />
        Check delivery
      </div>
      <div className="flex gap-2">
        <input
          inputMode="numeric"
          maxLength={6}
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          onKeyDown={(e) => e.key === "Enter" && check()}
          placeholder="Enter pincode"
          className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-brand transition"
        />
        <button
          type="button"
          onClick={check}
          disabled={!valid || loading}
          className="rounded-md bg-foreground/90 text-background px-3 py-2 text-sm font-semibold hover:bg-foreground transition disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Check"}
        </button>
      </div>

      {quote && (
        <div className="text-xs space-y-1">
          {quote.serviceable ? (
            <div className="flex items-center gap-1.5 text-green-700">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Delivers to {pincode}
              {" · "}
              {quote.shippingTotal > 0
                ? `Shipping ${formatPrice(quote.shippingTotal)}`
                : "Free shipping"}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-destructive">
              <XCircle className="h-3.5 w-3.5" />
              Not deliverable to {pincode}
            </div>
          )}
          {quote.serviceable && (
            <div className="text-muted-foreground">
              {quote.codEligible
                ? "Cash on Delivery available"
                : "Cash on Delivery not available"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
