/**
 * Seller's stores list — /seller/stores
 *
 * Shows all stores owned by the current seller. Verified sellers can create
 * new stores from here. Each store row links to its detail page where the
 * seller can edit branding and manage warehouses.
 */

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useQuery } from "@apollo/client/react";
import { toast } from "sonner";
import { Plus, Store as StoreIcon, ChevronRight } from "lucide-react";

import { GET_MY_STORES } from "@/lib/graphql/stores";
import {
  GetMyStoresData,
  Store,
  StoreStatus,
  STORE_STATUS_LABEL,
} from "@/types/store.types";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const STATUS_VARIANT: Record<
  StoreStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  DRAFT: "outline",
  ACTIVE: "default",
  INACTIVE: "secondary",
  SUSPENDED: "destructive",
  UNDER_REVIEW: "secondary",
};

export default function MyStoresPage() {
  const { data, loading, error } = useQuery<GetMyStoresData>(GET_MY_STORES, {
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    if (error) toast.error(`Failed to load stores: ${error.message}`);
  }, [error]);

  const stores = data?.myStores ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <StoreIcon className="h-6 w-6 text-primary" />
            My Stores
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your storefronts. Each store has its own branding,
            currency, and warehouses.
          </p>
        </div>
        <Button asChild>
          <Link href="/seller/stores/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Store
          </Link>
        </Button>
      </div>

      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 w-full animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      )}

      {!loading && stores.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center space-y-4">
            <StoreIcon className="h-12 w-12 mx-auto text-muted-foreground/50" />
            <div>
              <h3 className="font-semibold">No stores yet</h3>
              <p className="text-sm text-muted-foreground">
                Create your first store to start listing products.
              </p>
            </div>
            <Button asChild>
              <Link href="/seller/stores/new">
                <Plus className="mr-2 h-4 w-4" />
                Create your first store
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {!loading && stores.length > 0 && (
        <div className="grid gap-3">
          {stores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      )}
    </div>
  );
}

function StoreCard({ store }: { store: Store }) {
  return (
    <Link href={`/seller/stores/${store.id}`}>
      <Card className="hover:bg-muted/30 transition-colors cursor-pointer">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="h-14 w-14 rounded-md bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
            {store.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={store.logoUrl}
                alt={store.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <StoreIcon className="h-6 w-6 text-muted-foreground" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold truncate">{store.name}</h3>
              <Badge variant={STATUS_VARIANT[store.status]} className="text-xs">
                {STORE_STATUS_LABEL[store.status]}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground truncate">
              /{store.slug} · {store.currencyCode} · {store.warehouses?.length ?? 0}{" "}
              warehouse{(store.warehouses?.length ?? 0) === 1 ? "" : "s"}
            </p>
          </div>

          <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        </CardContent>
      </Card>
    </Link>
  );
}
