/**
 * Admin Coupons — /admin/coupons
 *
 * Cross-store catalog of discount codes. Single-page CRUD (no detail route)
 * using a Dialog for create/edit. Same shape as /admin/taxes — search +
 * status filter + data-table toolkit.
 *
 * Status filter values mirror the backend:
 *   active   = isActive AND now between validFrom..validUntil
 *   inactive = isActive=false
 *   expired  = validUntil < now
 */

"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Pencil, Plus, Tag, Trash2 } from "lucide-react";

import {
  CREATE_COUPON,
  GET_ADMIN_COUPONS,
  REMOVE_COUPON,
  UPDATE_COUPON,
} from "@/lib/graphql/coupons";
import {
  Coupon,
  CouponStatusFilter,
  COUPON_STATUS_FILTERS,
  CreateCouponData,
  DISCOUNT_TYPES,
  DISCOUNT_TYPE_LABEL,
  GetAdminCouponsData,
  UpdateCouponData,
  getCouponStatus,
} from "@/types/coupon.types";
import { formatPrice } from "@/lib/utils/currency";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  TableSkeleton,
  TableToolbar,
} from "@/components/ui/data-table";
import { useSetPageTitle } from "@/components/shell/page-title-context";

const COL_COUNT = 8;

const STATUS_FILTER_LABEL: Record<CouponStatusFilter, string> = {
  all: "All",
  active: "Active",
  inactive: "Inactive",
  expired: "Expired",
};

const couponSchema = z
  .object({
    code: z
      .string()
      .min(3, "Min 3 characters")
      .max(40, "Max 40 characters")
      .regex(/^[A-Za-z0-9_-]+$/, "Letters, digits, hyphens, underscores"),
    name: z.string().min(1, "Required").max(120),
    description: z.string().max(500).optional(),
    discountType: z.enum(DISCOUNT_TYPES),
    discountValue: z.coerce.number().min(0.01, "Must be > 0"),
    minimumPurchaseAmount: z
      .union([z.coerce.number().min(0), z.literal("")])
      .optional(),
    maximumDiscountAmount: z
      .union([z.coerce.number().min(0), z.literal("")])
      .optional(),
    usageLimit: z.union([z.coerce.number().int().min(1), z.literal("")]).optional(),
    usageLimitPerUser: z
      .union([z.coerce.number().int().min(1).max(100), z.literal("")])
      .optional(),
    validFrom: z.string().min(1, "Required"),
    validUntil: z.string().min(1, "Required"),
    isActive: z.boolean(),
  })
  .refine((v) => new Date(v.validUntil) > new Date(v.validFrom), {
    message: "End date must be after start date",
    path: ["validUntil"],
  })
  .refine(
    (v) => !(v.discountType === "percentage" && Number(v.discountValue) > 100),
    {
      message: "Percentage cannot exceed 100",
      path: ["discountValue"],
    },
  );
type CouponFormValues = z.infer<typeof couponSchema>;

const STATUS_VARIANT: Record<
  ReturnType<typeof getCouponStatus>,
  "default" | "secondary" | "destructive" | "outline"
> = {
  active: "default",
  scheduled: "secondary",
  expired: "destructive",
  inactive: "outline",
};

const STATUS_LABEL: Record<ReturnType<typeof getCouponStatus>, string> = {
  active: "Active",
  scheduled: "Scheduled",
  expired: "Expired",
  inactive: "Inactive",
};

export default function AdminCouponsPage() {
  useSetPageTitle("Coupons");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<CouponStatusFilter>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [deleting, setDeleting] = useState<Coupon | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 250);
    return () => clearTimeout(t);
  }, [search]);

  const queryVars = {
    search: debouncedSearch || null,
    status: statusFilter === "all" ? null : statusFilter,
  };

  const { data, loading } = useQuery<GetAdminCouponsData>(GET_ADMIN_COUPONS, {
    variables: queryVars,
    fetchPolicy: "cache-and-network",
  });

  const items = data?.adminCoupons ?? [];

  const [createCoupon, { loading: creating }] =
    useMutation<CreateCouponData>(CREATE_COUPON, {
      refetchQueries: [{ query: GET_ADMIN_COUPONS, variables: queryVars }],
      onCompleted: () => {
        toast.success("Coupon created");
        closeDialog();
      },
      onError: (err) => toast.error(`Create failed: ${err.message}`),
    });

  const [updateCoupon, { loading: updating }] =
    useMutation<UpdateCouponData>(UPDATE_COUPON, {
      refetchQueries: [{ query: GET_ADMIN_COUPONS, variables: queryVars }],
      onCompleted: () => {
        toast.success("Coupon updated");
        closeDialog();
      },
      onError: (err) => toast.error(`Update failed: ${err.message}`),
    });

  const [removeCoupon, { loading: removing }] = useMutation(REMOVE_COUPON, {
    refetchQueries: [{ query: GET_ADMIN_COUPONS, variables: queryVars }],
    onCompleted: () => {
      toast.success("Coupon archived");
      setDeleting(null);
    },
    onError: (err) => toast.error(`Remove failed: ${err.message}`),
  });

  const form = useForm<CouponFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(couponSchema as any) as any,
    defaultValues: {
      code: "",
      name: "",
      description: "",
      discountType: "percentage",
      discountValue: 10,
      minimumPurchaseAmount: "",
      maximumDiscountAmount: "",
      usageLimit: "",
      usageLimitPerUser: "",
      validFrom: toDateInput(new Date()),
      validUntil: toDateInput(addDays(new Date(), 30)),
      isActive: true,
    },
  });

  function openCreate() {
    setEditing(null);
    form.reset({
      code: "",
      name: "",
      description: "",
      discountType: "percentage",
      discountValue: 10,
      minimumPurchaseAmount: "",
      maximumDiscountAmount: "",
      usageLimit: "",
      usageLimitPerUser: "",
      validFrom: toDateInput(new Date()),
      validUntil: toDateInput(addDays(new Date(), 30)),
      isActive: true,
    });
    setDialogOpen(true);
  }

  function openEdit(c: Coupon) {
    setEditing(c);
    form.reset({
      code: c.code,
      name: c.name,
      description: c.description ?? "",
      discountType: c.discountType,
      discountValue: c.discountValue,
      minimumPurchaseAmount: c.minimumPurchaseAmount ?? "",
      maximumDiscountAmount: c.maximumDiscountAmount ?? "",
      usageLimit: c.usageLimit ?? "",
      usageLimitPerUser: c.usageLimitPerUser ?? "",
      validFrom: toDateInput(new Date(c.validFrom)),
      validUntil: toDateInput(new Date(c.validUntil)),
      isActive: c.isActive,
    });
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setEditing(null);
  }

  async function onSubmit(values: CouponFormValues) {
    const numberOrNull = (v: unknown) =>
      v === "" || v == null ? null : Number(v);
    const payload = {
      code: values.code,
      name: values.name,
      description: values.description || undefined,
      discountType: values.discountType,
      discountValue: Number(values.discountValue),
      minimumPurchaseAmount: numberOrNull(values.minimumPurchaseAmount),
      maximumDiscountAmount: numberOrNull(values.maximumDiscountAmount),
      usageLimit: numberOrNull(values.usageLimit),
      usageLimitPerUser: numberOrNull(values.usageLimitPerUser),
      validFrom: new Date(values.validFrom).toISOString(),
      validUntil: new Date(values.validUntil).toISOString(),
      isActive: values.isActive,
    };
    if (editing) {
      await updateCoupon({
        variables: { input: { id: editing.id, ...payload } },
      });
    } else {
      await createCoupon({ variables: { input: payload } });
    }
  }

  const activeFilterCount =
    (debouncedSearch ? 1 : 0) + (statusFilter !== "all" ? 1 : 0);
  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
  };
  const saving = creating || updating;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Tag className="h-6 w-6 text-primary" />
            Coupons
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Discount codes customers enter at checkout. GST is computed on the
            discounted (taxable) value per CGST Act §15(3)(a).
          </p>
        </div>
        <Button onClick={openCreate} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          New coupon
        </Button>
      </div>

      <TableToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search code or name..."
        activeFilterCount={activeFilterCount}
        onReset={resetFilters}
        primaryFilters={
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as CouponStatusFilter)}
          >
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COUPON_STATUS_FILTERS.map((s) => (
                <SelectItem key={s} value={s}>
                  {STATUS_FILTER_LABEL[s]}
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
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead className="hidden md:table-cell">Min spend</TableHead>
              <TableHead className="hidden lg:table-cell">Valid until</TableHead>
              <TableHead className="hidden xl:table-cell text-center">
                Used
              </TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && items.length === 0 ? (
              <TableSkeleton colSpan={COL_COUNT} />
            ) : items.length === 0 ? (
              <TableEmpty
                colSpan={COL_COUNT}
                icon={Tag}
                hasFilters={activeFilterCount > 0}
                onClearFilters={resetFilters}
              >
                {debouncedSearch
                  ? `No coupons found for "${debouncedSearch}"`
                  : "No coupons yet. Click 'New coupon' to create one."}
              </TableEmpty>
            ) : (
              items.map((c) => {
                const status = getCouponStatus(c);
                return (
                  <TableRow key={c.id}>
                    <TableCell className="font-mono text-sm font-semibold">
                      {c.code}
                    </TableCell>
                    <TableCell className="max-w-[260px]">
                      <div className="font-medium truncate">{c.name}</div>
                      {c.description && (
                        <div className="text-xs text-muted-foreground truncate">
                          {c.description}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {c.discountType === "percentage"
                          ? `${c.discountValue}%`
                          : formatPrice(c.discountValue)}
                      </div>
                      {c.discountType === "percentage" &&
                        c.maximumDiscountAmount != null && (
                          <div className="text-[10px] text-muted-foreground">
                            up to {formatPrice(c.maximumDiscountAmount)}
                          </div>
                        )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm">
                      {c.minimumPurchaseAmount != null
                        ? formatPrice(c.minimumPurchaseAmount)
                        : "—"}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm whitespace-nowrap">
                      {new Date(c.validUntil).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="hidden xl:table-cell text-center tabular-nums">
                      <span>{c.redemptionCount ?? 0}</span>
                      {c.usageLimit != null && (
                        <span className="text-muted-foreground">
                          {" / "}
                          {c.usageLimit}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={STATUS_VARIANT[status]}
                        className="text-[10px]"
                      >
                        {STATUS_LABEL[status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEdit(c)}
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => setDeleting(c)}
                          title="Archive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={(o) => !o && closeDialog()}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? `Edit ${editing.code}` : "New coupon"}
            </DialogTitle>
            <DialogDescription>
              {editing
                ? "Update this coupon. The code itself cannot be changed."
                : "Codes are case-insensitive and stored uppercase."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="DIWALI25"
                          {...field}
                          disabled={!!editing}
                          className="font-mono uppercase"
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Diwali Sale 25% Off" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Sitewide festive discount."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="discountType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount type *</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {DISCOUNT_TYPES.map((t) => (
                            <SelectItem key={t} value={t}>
                              {DISCOUNT_TYPE_LABEL[t]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="discountValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {form.watch("discountType") === "percentage"
                          ? "Discount % *"
                          : "Discount amount (₹) *"}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min={0.01}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="minimumPurchaseAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum spend (₹)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          placeholder="No minimum"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maximumDiscountAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max discount (₹)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          placeholder="Cap on percentage discounts"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Ignored for fixed-amount coupons.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="usageLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total usage limit</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          placeholder="Unlimited"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="usageLimitPerUser"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Per-customer limit</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={100}
                          placeholder="Unlimited"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="validFrom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valid from *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="validUntil"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valid until *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-md border p-3">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm">Active</FormLabel>
                      <FormDescription className="text-xs">
                        Inactive coupons cannot be applied even within the
                        valid date range.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editing ? "Save changes" : "Create coupon"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive coupon?</AlertDialogTitle>
            <AlertDialogDescription>
              Archive{" "}
              <span className="font-semibold text-foreground font-mono">
                {deleting?.code}
              </span>
              ? Customers will no longer be able to apply it; existing orders
              that already used it keep their snapshot.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() =>
                deleting && removeCoupon({ variables: { id: deleting.id } })
              }
              disabled={removing}
            >
              {removing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Archive
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ---------------------------------------------------------------------------
function toDateInput(d: Date): string {
  // <input type="date"> wants yyyy-mm-dd in local time.
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function addDays(d: Date, days: number): Date {
  const next = new Date(d);
  next.setDate(next.getDate() + days);
  return next;
}
