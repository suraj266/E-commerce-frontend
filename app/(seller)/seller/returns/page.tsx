"use client";

/**
 * Seller Returns queue (P3-02) — the seller works their return pipeline:
 * approve, schedule the reverse pickup, mark received, and pass/fail QC. This
 * page is the list; per-return actions live on the detail page.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery } from "@apollo/client/react";
import { toast } from "sonner";
import { PackageX } from "lucide-react";

import {
  GET_SELLER_RETURNS,
  RETURN_STATUSES,
  type SellerReturnsData,
  type ReturnStatus,
} from "@/lib/graphql/returns";
import { ReturnStatusBadge } from "@/components/orders/return-status-badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TableEmpty,
  TablePagination,
  TableSkeleton,
  usePagination,
} from "@/components/ui/data-table";

const COL_COUNT = 5;

export default function SellerReturnsPage() {
  const [statusFilter, setStatusFilter] = useState<"all" | ReturnStatus>("all");
  const [serverTotal, setServerTotal] = useState(0);
  const pg = usePagination({ totalRows: serverTotal, defaultPageSize: 10 });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    pg.resetPage();
  }, [statusFilter, pg.pageSize]);

  const vars = {
    page: pg.page,
    pageSize: pg.pageSize,
    status: statusFilter === "all" ? null : statusFilter,
  };

  const { data, loading, error } = useQuery<SellerReturnsData>(
    GET_SELLER_RETURNS,
    { variables: vars, fetchPolicy: "cache-and-network" },
  );

  useEffect(() => {
    if (error) toast.error(`Failed to load returns: ${error.message}`);
  }, [error]);

  useEffect(() => {
    const c = data?.sellerReturns?.totalCount;
    if (typeof c === "number" && c !== serverTotal) setServerTotal(c);
  }, [data?.sellerReturns?.totalCount, serverTotal]);

  const items = data?.sellerReturns?.items ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <PackageX className="h-6 w-6 text-primary" />
          Returns
        </h1>
        <p className="text-sm text-muted-foreground">
          Approve returns, schedule reverse pickups, and pass or fail QC.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as "all" | ReturnStatus)}
        >
          <SelectTrigger className="w-52">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {RETURN_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border bg-card shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead>Return</TableHead>
              <TableHead>Items</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="hidden lg:table-cell">Requested</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && items.length === 0 ? (
              <TableSkeleton colSpan={COL_COUNT} />
            ) : items.length === 0 ? (
              <TableEmpty colSpan={COL_COUNT} icon={PackageX}>
                No returns yet.
              </TableEmpty>
            ) : (
              items.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <div className="font-mono text-xs">{r.returnNumber}</div>
                    <div className="text-xs text-muted-foreground max-w-[16rem] truncate">
                      {r.reason}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {(r.items ?? []).reduce((n, it) => n + it.quantity, 0)} unit(s)
                  </TableCell>
                  <TableCell className="text-center">
                    <ReturnStatusBadge status={r.status} className="text-[10px]" />
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                    {new Date(r.requestedAt).toLocaleDateString("en-IN")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="secondary" size="sm">
                      <Link href={`/seller/returns/${r.id}`}>Open</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination
        page={pg.safePage}
        pageSize={pg.pageSize}
        totalRows={serverTotal}
        totalPages={pg.totalPages}
        onPageChange={pg.setPage}
        onPageSizeChange={(n) => {
          pg.setPageSize(n);
          pg.resetPage();
        }}
      />
    </div>
  );
}
