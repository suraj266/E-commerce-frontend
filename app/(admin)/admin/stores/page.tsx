/**
 * Admin Stores Page — /admin/stores
 *
 * Cross-seller view of all storefronts. Admin can:
 *   - Filter by status
 *   - Search by name / slug
 *   - Suspend / reactivate / archive stores via the override dialog
 *   - Soft-delete entirely
 *
 * Read-only otherwise — sellers manage their own branding via /seller/stores/.
 */

"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Eye,
  Loader2,
  Search,
  ShieldCheck,
  Store as StoreIcon,
  Trash2,
} from "lucide-react";

import {
  ADMIN_REMOVE_STORE,
  GET_STORES,
  SET_STORE_STATUS,
} from "@/lib/graphql/stores";
import {
  AdminRemoveStoreData,
  GetStoresData,
  SetStoreStatusData,
  Store,
  StoreStatus,
  STORE_STATUSES,
  STORE_STATUS_LABEL,
} from "@/types/store.types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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

const setStatusSchema = z.object({
  status: z.enum(STORE_STATUSES),
  reason: z.string().optional(),
});
type SetStatusValues = z.infer<typeof setStatusSchema>;

export default function AdminStoresPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | StoreStatus>("all");
  const [openStore, setOpenStore] = useState<Store | null>(null);
  const [statusDialog, setStatusDialog] = useState<Store | null>(null);
  const [deletingStore, setDeletingStore] = useState<Store | null>(null);

  const { data, loading, error } = useQuery<GetStoresData>(GET_STORES, {
    variables: { status: statusFilter === "all" ? null : statusFilter },
    // Admin pages need fresh data — cache-first hides newly-created stores
    // until the variable combo gets a network hit. cache-and-network shows
    // cached entries instantly AND triggers a background refetch.
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    if (error) toast.error(`Failed to load: ${error.message}`);
  }, [error]);

  const refetchVars = { status: statusFilter === "all" ? null : statusFilter };

  const [setStatus, { loading: settingStatus }] =
    useMutation<SetStoreStatusData>(SET_STORE_STATUS, {
      refetchQueries: [{ query: GET_STORES, variables: refetchVars }],
      onCompleted: (res) => {
        toast.success(`Status set to ${res.setStoreStatus.status}`);
        setStatusDialog(null);
        if (openStore?.id === res.setStoreStatus.id) {
          setOpenStore(res.setStoreStatus);
        }
      },
      onError: (err) => toast.error(`Failed: ${err.message}`),
    });

  const [adminRemoveStore, { loading: removing }] =
    useMutation<AdminRemoveStoreData>(ADMIN_REMOVE_STORE, {
      refetchQueries: [{ query: GET_STORES, variables: refetchVars }],
      onCompleted: (res) => {
        toast.success(`"${res.adminRemoveStore.name}" deleted`);
        setDeletingStore(null);
        setOpenStore(null);
      },
      onError: (err) => toast.error(`Delete failed: ${err.message}`),
    });

  const statusForm = useForm<SetStatusValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(setStatusSchema as any) as any,
    defaultValues: { status: "ACTIVE", reason: "" },
  });

  function openStatus(store: Store) {
    setStatusDialog(store);
    statusForm.reset({
      status: store.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE",
      reason: "",
    });
  }

  async function onStatusSubmit(values: SetStatusValues) {
    if (!statusDialog) return;
    await setStatus({
      variables: {
        setStoreStatusInput: {
          id: statusDialog.id,
          status: values.status,
          reason: values.reason || undefined,
        },
      },
    });
  }

  async function confirmDelete() {
    if (!deletingStore) return;
    await adminRemoveStore({ variables: { id: deletingStore.id } });
  }

  const all = data?.stores ?? [];
  const filtered = all.filter((s) => {
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    return (
      s.name.toLowerCase().includes(q) ||
      s.slug.toLowerCase().includes(q) ||
      s.supportEmail?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <StoreIcon className="h-6 w-6 text-primary" />
          Stores
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          All seller storefronts across the marketplace.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search name, slug, support email..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(val) => setStatusFilter(val as "all" | StoreStatus)}
        >
          <SelectTrigger className="w-full sm:w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STORE_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {STORE_STATUS_LABEL[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border bg-card p-2 shadow-sm min-h-[400px]">
        {loading && (
          <div className="space-y-3 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-14 w-full animate-pulse rounded-lg bg-muted"
              />
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="flex h-32 items-center justify-center text-muted-foreground">
            {searchQuery
              ? `No stores found for "${searchQuery}"`
              : "No stores yet."}
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <>
            <div className="flex items-center gap-4 px-3 py-2 mb-2 text-sm font-medium text-muted-foreground border-b uppercase pb-3">
              <div className="w-12 text-center">S.No</div>
              <div className="flex-1">Name</div>
              <div className="hidden md:block flex-1">Slug</div>
              <div className="hidden md:block w-24 text-center">Currency</div>
              <div className="w-32 text-center">Status</div>
              <div className="w-28 text-right">Actions</div>
            </div>

            <div className="flex flex-col gap-1 p-1">
              {filtered.map((store, idx) => (
                <div
                  key={store.id}
                  className="flex items-center gap-4 p-3 mb-2 bg-card border rounded-lg shadow-sm hover:bg-muted/30 transition-colors"
                >
                  <div className="w-12 text-center text-sm text-muted-foreground font-mono">
                    {idx + 1}
                  </div>
                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => setOpenStore(store)}
                  >
                    <div className="font-semibold truncate">{store.name}</div>
                  </div>
                  <div className="hidden md:block flex-1 min-w-0 text-sm text-muted-foreground font-mono truncate">
                    /{store.slug}
                  </div>
                  <div className="hidden md:block w-24 text-center text-sm text-muted-foreground">
                    {store.currencyCode}
                  </div>
                  <div className="w-32 flex justify-center">
                    <Badge
                      variant={STATUS_VARIANT[store.status]}
                      className="capitalize w-full flex justify-center text-xs"
                    >
                      {STORE_STATUS_LABEL[store.status]}
                    </Badge>
                  </div>
                  <div className="w-28 flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      title="View / override"
                      onClick={() => setOpenStore(store)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Delete"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeletingStore(store)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t px-4 py-3 text-sm text-muted-foreground">
              Showing {filtered.length} of {all.length} stores
            </div>
          </>
        )}
      </div>

      {/* Detail Sheet */}
      <Sheet open={!!openStore} onOpenChange={(o) => !o && setOpenStore(null)}>
        <SheetContent className="sm:max-w-xl w-full overflow-y-auto">
          {openStore && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  {openStore.name}
                  <Badge variant={STATUS_VARIANT[openStore.status]} className="text-xs">
                    {STORE_STATUS_LABEL[openStore.status]}
                  </Badge>
                </SheetTitle>
                <SheetDescription>
                  /{openStore.slug} · {openStore.currencyCode}
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6 mt-6 px-6">
                <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  <Field label="Description" value={openStore.description ?? "—"} />
                  <Field label="Currency" value={openStore.currencyCode} />
                  <Field label="Timezone" value={openStore.timezone} />
                  <Field label="Locale" value={openStore.locale} />
                  <Field label="Support email" value={openStore.supportEmail ?? "—"} />
                  <Field label="Support phone" value={openStore.supportPhone ?? "—"} />
                  <Field
                    label="Warehouses"
                    value={String(openStore.warehouses?.length ?? 0)}
                  />
                  <Field
                    label="Created"
                    value={new Date(openStore.createdAt).toLocaleDateString()}
                  />
                </dl>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    Status Override
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    Use this to suspend a misbehaving store or reactivate one.
                    Reason is recorded in metadata audit trail.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => openStatus(openStore)}
                  >
                    Override status
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Status override dialog */}
      <Dialog
        open={!!statusDialog}
        onOpenChange={(o) => !o && setStatusDialog(null)}
      >
        <DialogContent className="sm:max-w-md focus:ring-0">
          <DialogHeader>
            <DialogTitle>Override Store Status</DialogTitle>
            <DialogDescription>
              {statusDialog && (
                <>
                  Force the status for{" "}
                  <span className="font-semibold text-foreground">
                    {statusDialog.name}
                  </span>
                  .
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <Form {...statusForm}>
            <form
              className="space-y-4 pt-2"
              onSubmit={statusForm.handleSubmit(onStatusSubmit)}
            >
              <FormField
                control={statusForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Status</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {STORE_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {STORE_STATUS_LABEL[s]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={statusForm.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason</FormLabel>
                    <FormControl>
                      <Input placeholder="Reason..." {...field} />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Recommended for SUSPENDED.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStatusDialog(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={settingStatus}>
                  {settingStatus && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Apply
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete dialog */}
      <AlertDialog
        open={!!deletingStore}
        onOpenChange={(o) => !o && setDeletingStore(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Store?</AlertDialogTitle>
            <AlertDialogDescription>
              Soft-delete{" "}
              <span className="font-semibold text-foreground">
                &ldquo;{deletingStore?.name}&rdquo;
              </span>
              . The record stays in the database with a deletion timestamp.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmDelete}
              disabled={removing}
            >
              {removing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm truncate" title={value}>
        {value}
      </dd>
    </div>
  );
}
