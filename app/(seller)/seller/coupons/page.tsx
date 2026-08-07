/**
 * Seller Coupons — /seller/coupons
 *
 * Store-scoped discount codes the seller manages for their OWN stores. Single-
 * page CRUD (Dialog for create/edit), mirroring /admin/coupons but backed by
 * the ownership-checked CouponSellerResolver (myStoreCoupons /
 * createMyStoreCoupon / updateMyStoreCoupon / removeMyStoreCoupon). Every
 * coupon must belong to one of the seller's stores — there are no platform-wide
 * seller coupons. Ownership is enforced server-side; the store picker only
 * offers stores the caller owns.
 */

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery } from "@apollo/client/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@/lib/forms/zod-resolver";
import { toast } from "sonner";
import { Loader2, Pencil, Plus, Store as StoreIcon, Tag, Trash2 } from "lucide-react";

import {
  CREATE_MY_STORE_COUPON,
  GET_MY_STORE_COUPONS,
  REMOVE_MY_STORE_COUPON,
  UPDATE_MY_STORE_COUPON,
  type CreateMyStoreCouponData,
  type MyStoreCouponsData,
  type UpdateMyStoreCouponData,
} from "@/lib/graphql/seller-coupons";
import { GET_MY_STORES } from "@/lib/graphql/stores";
import {
  Coupon,
  DISCOUNT_TYPES,
  DISCOUNT_TYPE_LABEL,
  getCouponStatus,
} from "@/types/coupon.types";
import { formatPrice } from "@/lib/utils/currency";
import { useSetPageTitle } from "@/components/shell/page-title-context";

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
import { TableEmpty, TableSkeleton } from "@/components/ui/data-table";

const COL_COUNT = 7;

interface SellerStoreOption {
  id: string;
  name: string;
  status: string;
}
interface MyStoresData {
  myStores: SellerStoreOption[];
}

const couponSchema = z
  .object({
    storeId: z.string().min(1, "Select a store"),
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
    { message: "Percentage cannot exceed 100", path: ["discountValue"] },
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

export default function SellerCouponsPage() {
  useSetPageTitle("Coupons");

  const [storeFilter, setStoreFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [deleting, setDeleting] = useState<Coupon | null>(null);

  const { data: storesData, loading: storesLoading } =
    useQuery<MyStoresData>(GET_MY_STORES, { fetchPolicy: "cache-and-network" });
  const stores = useMemo(() => storesData?.myStores ?? [], [storesData]);
  const storesById = useMemo(
    () => new Map(stores.map((s) => [s.id, s])),
    [stores],
  );

  const queryVars = { storeId: storeFilter === "all" ? null : storeFilter };
  const { data, loading } = useQuery<MyStoreCouponsData>(GET_MY_STORE_COUPONS, {
    variables: queryVars,
    fetchPolicy: "cache-and-network",
  });
  const items = data?.myStoreCoupons ?? [];

  const refetch = [{ query: GET_MY_STORE_COUPONS, variables: queryVars }];

  const [createCoupon, { loading: creating }] =
    useMutation<CreateMyStoreCouponData>(CREATE_MY_STORE_COUPON, {
      refetchQueries: refetch,
      onCompleted: () => {
        toast.success("Coupon created");
        closeDialog();
      },
      onError: (err) => toast.error(`Create failed: ${err.message}`),
    });

  const [updateCoupon, { loading: updating }] =
    useMutation<UpdateMyStoreCouponData>(UPDATE_MY_STORE_COUPON, {
      refetchQueries: refetch,
      onCompleted: () => {
        toast.success("Coupon updated");
        closeDialog();
      },
      onError: (err) => toast.error(`Update failed: ${err.message}`),
    });

  const [removeCoupon, { loading: removing }] = useMutation(
    REMOVE_MY_STORE_COUPON,
    {
      refetchQueries: refetch,
      onCompleted: () => {
        toast.success("Coupon archived");
        setDeleting(null);
      },
      onError: (err) => toast.error(`Remove failed: ${err.message}`),
    },
  );

  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: emptyForm(),
  });

  function openCreate() {
    setEditing(null);
    // Default the store to the active filter (if a specific one) or the first
    // owned store, so the seller rarely has to pick manually.
    const defaultStore =
      storeFilter !== "all" ? storeFilter : (stores[0]?.id ?? "");
    form.reset({ ...emptyForm(), storeId: defaultStore });
    setDialogOpen(true);
  }

  function openEdit(c: Coupon) {
    setEditing(c);
    form.reset({
      storeId: c.storeId ?? "",
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
    const numberOrNull = (v: unknown) => {
      if (v === "" || v == null) return null;
      const n = Number(v);
      return Number.isFinite(n) && n > 0 ? n : null;
    };
    // Fields present on BOTH create + update. `code` + `storeId` are create-only
    // here: the code is immutable, and we keep a coupon anchored to its store on
    // edit (re-scoping is intentionally not a one-click action).
    const shared = {
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
      await updateCoupon({ variables: { input: { id: editing.id, ...shared } } });
    } else {
      await createCoupon({
        variables: {
          input: { storeId: values.storeId, code: values.code, ...shared },
        },
      });
    }
  }

  const saving = creating || updating;
  const noStores = !storesLoading && stores.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Tag className="h-6 w-6 text-primary" />
            Coupons
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Discount codes for your stores. GST is computed on the discounted
            (taxable) value per CGST Act §15(3)(a).
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="w-full sm:w-auto"
          disabled={noStores}
        >
          <Plus className="mr-2 h-4 w-4" />
          New coupon
        </Button>
      </div>

      {noStores ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-card py-12 text-center">
          <StoreIcon className="h-10 w-10 text-muted-foreground mb-3" />
          <p className="font-medium">Create a store first</p>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            Coupons belong to a store, so you&apos;ll need one before adding codes.
          </p>
          <Button asChild>
            <Link href="/seller/stores/new">
              <Plus className="mr-2 h-4 w-4" />
              New store
            </Link>
          </Button>
        </div>
      ) : (
        <>
          {stores.length > 1 && (
            <Select value={storeFilter} onValueChange={setStoreFilter}>
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue placeholder="All stores" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All stores</SelectItem>
                {stores.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead>Code</TableHead>
                  <TableHead>Store</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead className="hidden md:table-cell">Min spend</TableHead>
                  <TableHead className="hidden lg:table-cell">Valid until</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && items.length === 0 ? (
                  <TableSkeleton colSpan={COL_COUNT} />
                ) : items.length === 0 ? (
                  <TableEmpty colSpan={COL_COUNT} icon={Tag}>
                    No coupons yet. Click &apos;New coupon&apos; to create one.
                  </TableEmpty>
                ) : (
                  items.map((c) => {
                    const status = getCouponStatus(c);
                    return (
                      <TableRow key={c.id}>
                        <TableCell className="font-mono text-sm font-semibold">
                          {c.code}
                          {c.description && (
                            <div className="font-sans text-xs font-normal text-muted-foreground truncate max-w-[200px]">
                              {c.name}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-[160px] truncate">
                          {c.storeId
                            ? (storesById.get(c.storeId)?.name ?? "—")
                            : "—"}
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
        </>
      )}

      <Dialog open={dialogOpen} onOpenChange={(o) => !o && closeDialog()}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? `Edit ${editing.code}` : "New coupon"}
            </DialogTitle>
            <DialogDescription>
              {editing
                ? "Update this coupon. The code and store cannot be changed."
                : "Codes are case-insensitive and stored uppercase."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="storeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Store *</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!!editing}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a store" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {stores.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                      <Input placeholder="Festive discount." {...field} />
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
                      <Select value={field.value} onValueChange={field.onChange}>
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
                        <Input type="number" step="0.01" min={0.01} {...field} />
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
                          placeholder="No cap"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Leave blank for no cap. Ignored for fixed-amount coupons.
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
                        Inactive coupons cannot be applied even within the valid
                        date range.
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

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive coupon?</AlertDialogTitle>
            <AlertDialogDescription>
              Archive{" "}
              <span className="font-semibold text-foreground font-mono">
                {deleting?.code}
              </span>
              ? Customers will no longer be able to apply it; existing orders that
              already used it keep their snapshot.
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
function emptyForm(): CouponFormValues {
  return {
    storeId: "",
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
  };
}

function toDateInput(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function addDays(d: Date, days: number): Date {
  const next = new Date(d);
  next.setDate(next.getDate() + days);
  return next;
}
