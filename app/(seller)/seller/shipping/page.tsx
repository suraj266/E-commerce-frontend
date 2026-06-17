"use client";

/**
 * /seller/shipping — shipping methods (couriers) the seller can use.
 *
 * Multi-provider by design; today only Shiprocket is offered. Each method shows
 * its connection status with a "Manage" button → /seller/shipping/manage.
 */

import Link from "next/link";
import { useQuery } from "@apollo/client/react";
import { Truck, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";

import { GET_MY_COURIER_ACCOUNTS } from "@/lib/graphql/courier";
import type { MyCourierAccountsData, CourierProvider } from "@/types/courier.types";

import { Badge } from "@/components/ui/badge";

const METHODS: { provider: CourierProvider; name: string; blurb: string }[] = [
  {
    provider: "SHIPROCKET",
    name: "Shiprocket",
    blurb:
      "Live rates at checkout, AWB + label generation, and automatic tracking across 25+ couriers.",
  },
];

export default function SellerShippingPage() {
  const { data, loading } = useQuery<MyCourierAccountsData>(GET_MY_COURIER_ACCOUNTS, {
    fetchPolicy: "cache-and-network",
  });
  const accounts = data?.myCourierAccounts ?? [];
  const accountFor = (p: CourierProvider) => accounts.find((a) => a.provider === p);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Truck className="h-6 w-6 text-primary" />
          Shipping methods
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Connect a courier to show live delivery rates at checkout and generate
          shipping labels + tracking automatically. Without a courier, your flat
          shipping rates (Settings) are used.
        </p>
      </div>

      {loading && accounts.length === 0 ? (
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {METHODS.map((m) => {
            const acc = accountFor(m.provider);
            const connected = acc?.status === "CONNECTED";
            return (
              <div key={m.provider} className="rounded-lg border bg-card p-5 flex flex-col">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" />
                    <span className="text-lg font-semibold">{m.name}</span>
                  </div>
                  {acc ? (
                    <Badge variant={connected && acc.isEnabled ? "default" : "secondary"} className="text-xs">
                      {connected && acc.isEnabled && <CheckCircle2 className="h-3 w-3 mr-1" />}
                      {acc.isEnabled ? acc.status : "DISABLED"}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      Not connected
                    </Badge>
                  )}
                </div>
                <p className="mt-2 text-sm text-muted-foreground flex-1">{m.blurb}</p>
                <Link
                  href="/seller/shipping/manage"
                  className="mt-4 inline-flex items-center justify-between rounded-md border px-4 py-2 text-sm font-semibold hover:bg-muted/40 transition"
                >
                  {acc ? "Manage" : "Connect"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
