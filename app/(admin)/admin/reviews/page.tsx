/**
 * Admin → Reviews — moderation queue.
 *
 * Defaults to the PENDING filter (oldest first = highest urgency). Switch to
 * PUBLISHED or HIDDEN via the status filter to see what's already moderated.
 *
 * Each row has Approve / Reject actions. Reject opens a dialog where the
 * admin can record a reason that gets stamped on the review row + emailed
 * to the customer.
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery } from "@apollo/client/react";
import { toast } from "sonner";
import {
  CheckCircle2,
  ExternalLink,
  Loader2,
  Star,
  Star as StarIcon,
  XCircle,
} from "lucide-react";

import {
  APPROVE_REVIEW,
  GET_ADMIN_REVIEWS,
  REJECT_REVIEW,
} from "@/lib/graphql/reviews";
import type {
  AdminReview,
  ApproveReviewData,
  GetAdminReviewsData,
  RejectReviewData,
  ReviewStatus,
} from "@/types/review.types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TableEmpty,
  TablePagination,
  TableSkeleton,
  TableToolbar,
  usePagination,
} from "@/components/ui/data-table";
import { useSetPageTitle } from "@/components/shell/page-title-context";

const COL_COUNT = 6;
const PAGE_SIZE_OPTIONS = [10, 25, 50] as const;

const STATUS_OPTIONS: { value: ReviewStatus; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "PUBLISHED", label: "Published" },
  { value: "HIDDEN", label: "Hidden" },
];

const STATUS_VARIANT: Record<ReviewStatus, "default" | "secondary" | "destructive" | "outline"> = {
  PENDING: "secondary",
  PUBLISHED: "default",
  HIDDEN: "destructive",
};

export default function AdminReviewsPage() {
  useSetPageTitle("Reviews");

  const [statusFilter, setStatusFilter] = useState<ReviewStatus>("PENDING");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [rejectTarget, setRejectTarget] = useState<AdminReview | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  const [serverTotal, setServerTotal] = useState(0);
  const pg = usePagination({
    totalRows: serverTotal,
    defaultPageSize: 25,
  });

  useEffect(() => {
    pg.resetPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- pg.resetPage stable
  }, [debouncedSearch, statusFilter]);

  const variables = {
    status: statusFilter,
    search: debouncedSearch || null,
    page: pg.page,
    pageSize: pg.pageSize,
  };

  const { data, loading } = useQuery<GetAdminReviewsData>(GET_ADMIN_REVIEWS, {
    variables,
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    const c = data?.adminReviews?.totalCount;
    if (typeof c === "number" && c !== serverTotal) setServerTotal(c);
  }, [data?.adminReviews?.totalCount, serverTotal]);

  const items = data?.adminReviews?.items ?? [];
  const activeFilterCount =
    (debouncedSearch ? 1 : 0) + (statusFilter !== "PENDING" ? 1 : 0);
  const resetFilters = () => {
    setSearch("");
    setStatusFilter("PENDING");
  };

  const [approveReview, { loading: approving }] =
    useMutation<ApproveReviewData>(APPROVE_REVIEW, {
      refetchQueries: [{ query: GET_ADMIN_REVIEWS, variables }],
      onCompleted: (res) => toast.success(`Approved: ${res.approveReview.productName ?? ""}`),
      onError: (err) => toast.error(`Approve failed: ${err.message}`),
    });

  const [rejectReview, { loading: rejecting }] =
    useMutation<RejectReviewData>(REJECT_REVIEW, {
      refetchQueries: [{ query: GET_ADMIN_REVIEWS, variables }],
      onCompleted: () => {
        toast.success("Review rejected");
        setRejectTarget(null);
        setRejectReason("");
      },
      onError: (err) => toast.error(`Reject failed: ${err.message}`),
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <StarIcon className="h-6 w-6 text-primary" />
          Reviews
        </h1>
        <p className="text-sm text-muted-foreground">
          Approve or reject customer reviews before they appear on product
          pages. Pending reviews are listed oldest-first.
        </p>
      </div>

      <TableToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search review title or body..."
        activeFilterCount={activeFilterCount}
        onReset={resetFilters}
        primaryFilters={
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as ReviewStatus)}
          >
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="w-24">Rating</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Review</TableHead>
              <TableHead className="hidden md:table-cell">Author</TableHead>
              <TableHead className="hidden lg:table-cell">Submitted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && items.length === 0 ? (
              <TableSkeleton colSpan={COL_COUNT} />
            ) : items.length === 0 ? (
              <TableEmpty
                colSpan={COL_COUNT}
                icon={StarIcon}
                hasFilters={activeFilterCount > 0}
                onClearFilters={resetFilters}
              >
                {statusFilter === "PENDING"
                  ? "No reviews waiting for moderation. 🎉"
                  : "No reviews match this filter."}
              </TableEmpty>
            ) : (
              items.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i <= r.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-foreground/20"
                          }`}
                          strokeWidth={1.5}
                        />
                      ))}
                    </div>
                    <Badge
                      variant={STATUS_VARIANT[r.status]}
                      className="text-[10px] mt-1.5"
                    >
                      {r.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    {r.productSlug ? (
                      <Link
                        href={`/product/${r.productSlug}`}
                        target="_blank"
                        className="font-medium hover:underline inline-flex items-center gap-1"
                      >
                        <span className="truncate">{r.productName}</span>
                        <ExternalLink className="h-3 w-3 shrink-0 opacity-60" />
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="max-w-[420px]">
                    {r.title && (
                      <div className="font-medium text-sm line-clamp-1">
                        {r.title}
                      </div>
                    )}
                    <div className="text-sm text-foreground/80 line-clamp-3">
                      {r.body}
                    </div>
                    {r.status === "HIDDEN" && r.hiddenReason && (
                      <div className="mt-1 text-[11px] text-destructive italic">
                        Hidden reason: {r.hiddenReason}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm">
                    <div>{r.customerName ?? "Anonymous"}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-[180px]">
                      {r.customerEmail ?? ""}
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                    {new Date(r.createdAt).toLocaleDateString()}
                    <div>
                      {new Date(r.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {r.status !== "PUBLISHED" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-emerald-600 hover:text-emerald-700"
                          onClick={() =>
                            approveReview({ variables: { id: r.id } })
                          }
                          disabled={approving}
                          title="Approve"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                      )}
                      {r.status !== "HIDDEN" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => {
                            setRejectTarget(r);
                            setRejectReason("");
                          }}
                          title="Reject"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
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
        pageSizeOptions={PAGE_SIZE_OPTIONS}
      />

      <AlertDialog
        open={!!rejectTarget}
        onOpenChange={(o) => !o && setRejectTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject this review?</AlertDialogTitle>
            <AlertDialogDescription>
              The review will be hidden from the product page. The customer
              will get an email with the reason (if you provide one) and a
              chance to edit + resubmit.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-2">
            <Textarea
              placeholder="Optional reason — shared with the customer."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              maxLength={500}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() =>
                rejectTarget &&
                rejectReview({
                  variables: {
                    id: rejectTarget.id,
                    reason: rejectReason.trim() || null,
                  },
                })
              }
              disabled={rejecting}
            >
              {rejecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
