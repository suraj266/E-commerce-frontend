/**
 * =============================================================================
 * Admin Customers — /admin/customers
 * =============================================================================
 *
 * Server-paginated, searchable list of every storefront customer. Click a
 * row to open the detail Sheet where the admin can update name/phone/
 * status/marketing prefs, soft-delete, or restore.
 *
 * Customers self-register via /register, so there's no "Create" button —
 * keeping admins from accidentally bypassing the verification flow.
 * =============================================================================
 */

"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Pencil, RotateCcw, Trash2, Users } from "lucide-react";

import {
  GET_ADMIN_CUSTOMERS,
  RESTORE_CUSTOMER,
  SOFT_DELETE_CUSTOMER,
  UPDATE_CUSTOMER,
} from "@/lib/graphql/customers";
import {
  AdminCustomer,
  AdminCustomersData,
  RestoreCustomerData,
  SoftDeleteCustomerData,
  UpdateCustomerData,
  USER_STATUSES,
  USER_STATUS_LABEL,
  UserStatus,
} from "@/types/customer.types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
import { useSetPageTitle } from "@/components/shell/page-title-context";
import {
  TableEmpty,
  TablePagination,
  TableSkeleton,
  TableToolbar,
  usePagination,
} from "@/components/ui/data-table";

const COL_COUNT = 6;
const PAGE_SIZE_OPTIONS = [25, 50, 100] as const;

const STATUS_VARIANT: Record<
  UserStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  active: "default",
  inactive: "outline",
  suspended: "secondary",
  banned: "destructive",
};

const editSchema = z.object({
  name: z.string().min(2, "Min 2 characters").max(100),
  phone: z.string().max(20).optional().or(z.literal("")),
  status: z.enum(USER_STATUSES),
  marketingOptIn: z.boolean(),
  preferredCurrency: z
    .string()
    .length(3, "3-letter ISO code")
    .regex(/^[A-Z]{3}$/, "All caps, e.g. INR / USD"),
});
type EditValues = z.infer<typeof editSchema>;

export default function AdminCustomersPage() {
  useSetPageTitle("Customers");

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | UserStatus>("all");
  const [includeDeleted, setIncludeDeleted] = useState(false);

  const [editing, setEditing] = useState<AdminCustomer | null>(null);
  const [deleting, setDeleting] = useState<AdminCustomer | null>(null);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Server pagination — pass server's totalCount as totalRows after the first
  // response so totalPages computes correctly. Pre-fetch we treat as a single
  // page.
  const [serverTotal, setServerTotal] = useState(0);
  const pg = usePagination({
    totalRows: serverTotal,
    defaultPageSize: 50,
  });

  // Reset page when filters change
  useEffect(() => {
    pg.resetPage();
  }, [debouncedSearch, statusFilter, includeDeleted, pg.pageSize]);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- pg.resetPage stable

  const refetchVars = {
    status: statusFilter === "all" ? null : statusFilter,
    search: debouncedSearch || null,
    includeDeleted,
    page: pg.page,
    pageSize: pg.pageSize,
  };

  const {
    data,
    loading: queryLoading,
    error: queryError,
  } = useQuery<AdminCustomersData>(GET_ADMIN_CUSTOMERS, {
    variables: refetchVars,
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    if (queryError) toast.error(`Failed to load: ${queryError.message}`);
  }, [queryError]);

  // Sync server-reported totalCount into the pagination hook
  useEffect(() => {
    const c = data?.adminCustomers?.totalCount;
    if (typeof c === "number" && c !== serverTotal) setServerTotal(c);
  }, [data?.adminCustomers?.totalCount, serverTotal]);

  const [updateCustomer, { loading: updating }] =
    useMutation<UpdateCustomerData>(UPDATE_CUSTOMER, {
      refetchQueries: [{ query: GET_ADMIN_CUSTOMERS, variables: refetchVars }],
      onCompleted: () => {
        toast.success("Customer updated");
        setEditing(null);
      },
      onError: (err) => toast.error(`Update failed: ${err.message}`),
    });

  const [softDeleteCustomer, { loading: deletingMutation }] =
    useMutation<SoftDeleteCustomerData>(SOFT_DELETE_CUSTOMER, {
      refetchQueries: [{ query: GET_ADMIN_CUSTOMERS, variables: refetchVars }],
      onCompleted: (res) => {
        toast.success(`${res.softDeleteCustomer.email} archived`);
        setDeleting(null);
      },
      onError: (err) => toast.error(`Archive failed: ${err.message}`),
    });

  const [restoreCustomer, { loading: restoring }] =
    useMutation<RestoreCustomerData>(RESTORE_CUSTOMER, {
      refetchQueries: [{ query: GET_ADMIN_CUSTOMERS, variables: refetchVars }],
      onCompleted: (res) => {
        toast.success(`${res.restoreCustomer.email} restored`);
      },
      onError: (err) => toast.error(`Restore failed: ${err.message}`),
    });

  const form = useForm<EditValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(editSchema as any) as any,
    defaultValues: {
      name: "",
      phone: "",
      status: "active",
      marketingOptIn: false,
      preferredCurrency: "INR",
    },
  });

  // Re-seed the form whenever the edited customer changes
  useEffect(() => {
    if (!editing) return;
    form.reset({
      name: editing.name,
      phone: editing.phone ?? "",
      status: ((editing.status as UserStatus) ?? "active"),
      marketingOptIn: editing.marketingOptIn,
      preferredCurrency: editing.preferredCurrency,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing?.id]);

  async function onSubmit(values: EditValues) {
    if (!editing) return;
    await updateCustomer({
      variables: {
        input: {
          id: editing.id,
          name: values.name,
          phone: values.phone || null,
          status: values.status,
          marketingOptIn: values.marketingOptIn,
          preferredCurrency: values.preferredCurrency.toUpperCase(),
        },
      },
    });
  }

  // ---- Derived ----
  const items = data?.adminCustomers?.items ?? [];
  const activeFilterCount =
    (debouncedSearch ? 1 : 0) +
    (statusFilter !== "all" ? 1 : 0) +
    (includeDeleted ? 1 : 0);

  const onSearchChange = (v: string) => {
    setSearchQuery(v);
    pg.resetPage();
  };
  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setIncludeDeleted(false);
    pg.resetPage();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          Customers
        </h1>
        <p className="text-sm text-muted-foreground">
          Storefront shoppers. Customers self-register via the public site —
          admin can review, suspend, or archive accounts here.
        </p>
      </div>

      <TableToolbar
        search={searchQuery}
        onSearchChange={onSearchChange}
        searchPlaceholder="Search name, email, phone..."
        activeFilterCount={activeFilterCount}
        onReset={resetFilters}
        primaryFilters={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as "all" | UserStatus)}
            >
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {USER_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {USER_STATUS_LABEL[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <label className="flex items-center gap-2 text-sm text-muted-foreground select-none cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-input"
                checked={includeDeleted}
                onChange={(e) => setIncludeDeleted(e.target.checked)}
              />
              Show archived
            </label>
          </div>
        }
      />

      <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead>Name</TableHead>
              <TableHead>Email / Phone</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="hidden md:table-cell">Joined</TableHead>
              <TableHead className="hidden lg:table-cell">Last login</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {queryLoading && items.length === 0 ? (
              <TableSkeleton colSpan={COL_COUNT} />
            ) : items.length === 0 ? (
              <TableEmpty
                colSpan={COL_COUNT}
                icon={Users}
                hasFilters={activeFilterCount > 0}
                onClearFilters={resetFilters}
              >
                {debouncedSearch
                  ? `No customers found for "${debouncedSearch}"`
                  : "No customers yet."}
              </TableEmpty>
            ) : (
              items.map((c) => {
                const isDeleted = !!c.deletedAt;
                const status = (c.status ?? "active") as UserStatus;
                return (
                  <TableRow
                    key={c.id}
                    className={isDeleted ? "opacity-60" : ""}
                  >
                    <TableCell>
                      <button
                        onClick={() => setEditing(c)}
                        className="text-left hover:underline"
                      >
                        <div className="font-medium">{c.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {c.preferredCurrency}
                          {c.marketingOptIn && " · Subscribed"}
                          {isDeleted && " · Archived"}
                        </div>
                      </button>
                    </TableCell>
                    <TableCell>
                      <div className="text-foreground">{c.email}</div>
                      <div className="text-xs text-muted-foreground">
                        {c.phone ?? "No phone"}
                        {c.emailVerifiedAt ? " · Verified" : " · Unverified"}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={STATUS_VARIANT[status]}
                        className="text-[10px]"
                      >
                        {USER_STATUS_LABEL[status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs hidden md:table-cell">
                      {new Date(c.userCreatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs hidden lg:table-cell">
                      {c.lastLoginAt
                        ? new Date(c.lastLoginAt).toLocaleDateString()
                        : "Never"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setEditing(c)}
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        {isDeleted ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-emerald-600 hover:text-emerald-700"
                            disabled={restoring}
                            onClick={() =>
                              restoreCustomer({ variables: { id: c.id } })
                            }
                            title="Restore"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => setDeleting(c)}
                            title="Archive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
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

      {/* Edit Sheet */}
      <Sheet open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <SheetContent className="sm:max-w-md w-full overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit customer</SheetTitle>
            <SheetDescription>
              Update profile, account status, or marketing preferences.
            </SheetDescription>
          </SheetHeader>

          {editing && (
            <div className="px-4 pb-4">
              <div className="rounded-md bg-muted/40 p-3 text-xs space-y-1 mb-5">
                <div>
                  <span className="text-muted-foreground">Email: </span>
                  <span className="font-medium">{editing.email}</span>
                  {editing.emailVerifiedAt ? (
                    <span className="ml-1 text-emerald-600">· Verified</span>
                  ) : (
                    <span className="ml-1 text-amber-600">· Unverified</span>
                  )}
                </div>
                <div>
                  <span className="text-muted-foreground">Joined: </span>
                  <span>
                    {new Date(editing.userCreatedAt).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Last login: </span>
                  <span>
                    {editing.lastLoginAt
                      ? new Date(editing.lastLoginAt).toLocaleString()
                      : "Never"}
                  </span>
                </div>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Optional"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Customers add this during checkout. Edit only if
                          you&apos;re cleaning up bad data.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account status</FormLabel>
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
                            {USER_STATUSES.map((s) => (
                              <SelectItem key={s} value={s}>
                                {USER_STATUS_LABEL[s]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-xs">
                          Suspended / banned customers cannot log in.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="preferredCurrency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred currency</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            maxLength={3}
                            onChange={(e) =>
                              field.onChange(e.target.value.toUpperCase())
                            }
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          ISO 4217 code (INR, USD, EUR...)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="marketingOptIn"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-md border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm">
                            Marketing emails
                          </FormLabel>
                          <FormDescription className="text-xs">
                            Whether the customer agreed to promotional emails.
                            Honor unsubscribes — never flip this on.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-input"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <SheetFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setEditing(null)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={updating}>
                      {updating && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Save changes
                    </Button>
                  </SheetFooter>
                </form>
              </Form>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete confirmation */}
      <AlertDialog
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive customer?</AlertDialogTitle>
            <AlertDialogDescription>
              Archive{" "}
              <span className="font-semibold text-foreground">
                {deleting?.email}
              </span>
              ? Their orders and history are kept for audit. The account is
              marked inactive — they can no longer log in. You can restore
              this from the &ldquo;Show archived&rdquo; filter.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() =>
                deleting &&
                softDeleteCustomer({ variables: { id: deleting.id } })
              }
              disabled={deletingMutation}
            >
              {deletingMutation && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Archive
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
