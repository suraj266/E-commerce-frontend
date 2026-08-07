"use client";

/**
 * PDP pincode → delivery ETA estimator (P4-B).
 *
 * A self-contained island dropped into the product buy block. The customer
 * enters a 6-digit pincode; we call `deliveryEstimate`, which reuses the same
 * courier serviceability the checkout uses (read-only) and degrades to the
 * store's in-house shipping config. We show an ETA window, dispatch SLA, COD
 * availability and — for a live courier rate — the carrier. Purely indicative;
 * the binding figure is re-derived at checkout.
 *
 * The pincode is remembered in localStorage and auto-checked on the next PDP so
 * repeat shoppers don't retype it (the backend caches rates per pincode).
 */

import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { Ban, Loader2, MapPin, PackageCheck, Truck } from "lucide-react";

import {
  DELIVERY_ESTIMATE,
  type GetDeliveryEstimateData,
} from "@/lib/graphql/search";
import { formatPrice } from "@/lib/utils/currency";

const PIN_RE = /^[1-9][0-9]{5}$/;
const STORAGE_KEY = "delivery_pincode";

export function DeliveryEstimator({
  productId,
  currency = "INR",
}: {
  productId: string;
  currency?: string;
}) {
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  // Prefill + auto-check a remembered pincode. Guarded to a valid pincode so a
  // stale/garbage value never fires a query (backend caches per pincode).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && PIN_RE.test(saved)) {
      setInput(saved);
      setSubmitted(saved);
    }
  }, []);

  const valid = PIN_RE.test(input);

  const { data, loading, error } = useQuery<GetDeliveryEstimateData>(
    DELIVERY_ESTIMATE,
    {
      variables: { pincode: submitted ?? "", productId },
      skip: !submitted,
      // Cache per (pincode, product) so navigating back to a PDP is instant and
      // we don't re-hit the courier API for a pincode we just checked.
      fetchPolicy: "cache-first",
      errorPolicy: "all",
    },
  );

  function check() {
    if (!valid) {
      setTouched(true);
      return;
    }
    setSubmitted(input);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, input);
    }
  }

  const est = data?.deliveryEstimate;
  const showError = !!submitted && !loading && !est && !!error;

  return (
    <div className="rounded-lg border bg-card p-4 space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Truck className="h-4 w-4 text-brand" />
        Delivery options
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={input}
            onChange={(e) => {
              setInput(e.target.value.replace(/\D/g, "").slice(0, 6));
              setTouched(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                check();
              }
            }}
            aria-label="Delivery pincode"
            placeholder="Enter delivery pincode"
            className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm outline-none focus:border-brand transition"
          />
        </div>
        <button
          type="button"
          onClick={check}
          className="rounded-md border border-brand text-brand px-4 py-2 text-sm font-semibold hover:bg-brand hover:text-brand-foreground transition"
        >
          Check
        </button>
      </div>

      {touched && !valid && input.length > 0 && (
        <p className="text-xs text-destructive">
          Enter a valid 6-digit pincode.
        </p>
      )}

      {!!submitted && loading && (
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Checking availability…
        </p>
      )}

      {showError && (
        <p className="text-sm text-muted-foreground">
          Couldn&apos;t check delivery right now. Please try again.
        </p>
      )}

      {est && !loading && (
        est.serviceable ? (
          <div className="space-y-1.5 text-sm">
            <div className="flex items-center gap-2 text-cta font-medium">
              <PackageCheck className="h-4 w-4 shrink-0" />
              {est.minDeliveryDays != null && est.maxDeliveryDays != null ? (
                <span>
                  Delivery in{" "}
                  <strong>
                    {est.minDeliveryDays === est.maxDeliveryDays
                      ? `${est.minDeliveryDays} day${est.minDeliveryDays === 1 ? "" : "s"}`
                      : `${est.minDeliveryDays}–${est.maxDeliveryDays} days`}
                  </strong>{" "}
                  to {est.pincode}
                </span>
              ) : (
                <span>Deliverable to {est.pincode}</span>
              )}
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
              {est.estimatedDispatchDays != null && (
                <span>
                  Dispatched in {est.estimatedDispatchDays} day
                  {est.estimatedDispatchDays === 1 ? "" : "s"}
                </span>
              )}
              {est.freeShipping ? (
                <span className="text-cta font-medium">Free delivery</span>
              ) : (
                est.shippingCharge != null && (
                  <span>+ {formatPrice(est.shippingCharge, currency)} shipping</span>
                )
              )}
              <span>{est.codAvailable ? "COD available" : "Prepaid only"}</span>
              {est.rateSource === "LIVE" && est.courierName && (
                <span>via {est.courierName}</span>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-destructive flex items-center gap-2">
            <Ban className="h-4 w-4 shrink-0" />
            {est.message ?? "Not deliverable to this pincode yet."}
          </p>
        )
      )}
    </div>
  );
}
