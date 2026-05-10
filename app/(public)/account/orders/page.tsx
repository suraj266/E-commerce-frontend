"use client";

/**
 * /account/orders — customer's order history.
 *
 * List view; each row links to /account/orders/[id] for full detail.
 * Filter by status. Pagination via local state — server-paged via the
 * `myOrders` query.
 */

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@apollo/client/react";
import { ChevronRight, Package } from "lucide-react";

import { GET_MY_ORDERS } from "@/lib/graphql/orders";
import {
  MyOrdersData,
  ORDER_STATUSES,
  ORDER_STATUS_LABEL,
  type Order,
  type OrderStatus,
} from "@/types/order.types";
import { formatPrice } from "@/lib/utils/currency";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";

const PAGE_SIZE = 10;

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  const [page, setPage] = useState(1);

  const { data, loading } = useQuery<MyOrdersData>(GET_MY_ORDERS, {
    variables: {
      status: statusFilter === "all" ? null : statusFilter,
      page,
      pageSize: PAGE_SIZE,
    },
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
  });

  const result = data?.myOrders;
  const items = result?.items ?? [];
  const totalPages = result?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
          <p className="mt-1 text-sm text-foreground/60">
            Track current orders and review past purchases.
          </p>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as "all" | OrderStatus);
            setPage(1);
          }}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm font-medium outline-none focus:border-brand transition"
        >
          <option value="all">All orders</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {ORDER_STATUS_LABEL[s]}
            </option>
          ))}
        </select>
      </header>

      {loading && items.length === 0 ? (
        <SkeletonList />
      ) : items.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="space-y-3">
          {items.map((o) => (
            <li key={o.id}>
              <OrderRow order={o} />
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="rounded-md border px-3 py-1.5 text-sm hover:border-foreground/40 disabled:opacity-40 transition"
          >
            Previous
          </button>
          <span className="text-sm text-foreground/60">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="rounded-md border px-3 py-1.5 text-sm hover:border-foreground/40 disabled:opacity-40 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function OrderRow({ order }: { order: Order }) {
  const firstItemImage = order.items[0]?.imageUrlSnapshot;
  const itemSummary =
    order.items.length === 1
      ? order.items[0].name
      : `${order.items[0]?.name ?? "Item"} + ${order.items.length - 1} more`;

  return (
    <Link
      href={`/account/orders/${order.id}`}
      className="block rounded-lg border bg-card p-4 sm:p-5 hover:bg-muted/30 transition group"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-md overflow-hidden bg-muted">
          {firstItemImage ? (
            <Image
              src={firstItemImage}
              alt={order.items[0]?.name ?? "Order item"}
              fill
              sizes="80px"
              className="object-cover"
            />
          ) : null}
          {order.itemCount > 1 && (
            <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-brand text-white text-[10px] font-bold flex items-center justify-center">
              {order.itemCount}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono text-foreground/60">
              {order.orderNumber}
            </span>
            <OrderStatusBadge status={order.status} />
          </div>
          <div className="text-sm font-semibold mt-1 line-clamp-1">
            {itemSummary}
          </div>
          <div className="text-xs text-foreground/60 mt-1">
            Placed {new Date(order.placedAt).toLocaleDateString()} ·{" "}
            {order.sellerOrders.length}{" "}
            {order.sellerOrders.length === 1 ? "seller" : "sellers"}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs uppercase tracking-wide text-foreground/50 font-semibold">
              Total
            </div>
            <div className="text-base font-bold">
              {formatPrice(order.totalAmount)}
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-foreground/40 group-hover:text-foreground/70 transition" />
        </div>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="rounded-lg border bg-muted/20 px-6 py-16 text-center space-y-4">
      <Package className="mx-auto h-10 w-10 text-foreground/30" />
      <div>
        <p className="text-base font-semibold">No orders yet</p>
        <p className="mt-1 text-sm text-foreground/60 max-w-md mx-auto">
          Once you place your first order, you&apos;ll see status, tracking,
          and invoices here.
        </p>
      </div>
      <Link
        href="/shop"
        className="inline-flex items-center justify-center rounded-md bg-brand text-white px-6 py-3 text-sm font-semibold shadow hover:bg-brand/90 transition"
      >
        Start shopping
      </Link>
    </div>
  );
}

function SkeletonList() {
  return (
    <ul className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <li
          key={i}
          className="h-24 rounded-lg bg-muted animate-pulse"
        />
      ))}
    </ul>
  );
}
