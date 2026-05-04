/**
 * =============================================================================
 * Admin Tax Management — /admin/taxes
 * =============================================================================
 *
 * Full CRUD for the tax catalog. Sellers pick one of these per product via
 * the radio group on the product form.
 *
 * Server-side paginated + searchable, mirroring the categories admin
 * structure. Drag-reorder isn't supported (taxes are flat — admin sets
 * displayOrder via the edit form when needed).
 * =============================================================================
 */

"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Receipt,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import {
  GET_ADMIN_TAXES_PAGINATED,
  CREATE_TAX,
  UPDATE_TAX,
  REMOVE_TAX,
} from "@/lib/graphql/taxes";
import type {
  Tax,
  GetAdminTaxesPaginatedData,
  CreateTaxData,
  UpdateTaxData,
  RemoveTaxData,
} from "@/types/tax.types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { useSetPageTitle } from "@/components/shell/page-title-context";

// ---------------------------------------------------------------------------
// Form schema
// ---------------------------------------------------------------------------
const taxSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name max 50 characters"),
  rate: z.coerce
    .number()
    .min(0, "Rate must be 0 or more")
    .max(100, "Rate must be 100 or less"),
  description: z.string().max(500).optional(),
  isActive: z.boolean(),
  displayOrder: z.coerce.number().min(0),
});
type TaxFormValues = z.infer<typeof taxSchema>;

// ===========================================================================
export default function TaxesPage() {
  useSetPageTitle("Taxes");

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTax, setEditingTax] = useState<Tax | null>(null);
  const [deletingTax, setDeletingTax] = useState<Tax | null>(null);

  // Debounce search to avoid hitting the backend on every keystroke
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Reset to page 1 on search/page-size change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, pageSize]);

  // ---- Data ----
  const refetchVars = {
    page: currentPage,
    pageSize,
    search: debouncedSearch || null,
  };

  const {
    data,
    loading: queryLoading,
    error: queryError,
  } = useQuery<GetAdminTaxesPaginatedData>(GET_ADMIN_TAXES_PAGINATED, {
    variables: refetchVars,
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    if (queryError) toast.error(`Failed to load taxes: ${queryError.message}`);
  }, [queryError]);

  // ---- Mutations ----
  const refetchQueries = [
    { query: GET_ADMIN_TAXES_PAGINATED, variables: refetchVars },
  ];

  const [createTax, { loading: creating }] = useMutation<CreateTaxData>(
    CREATE_TAX,
    {
      refetchQueries,
      onCompleted: () => {
        toast.success("Tax created");
        closeForm();
      },
      onError: (err) => toast.error(`Create failed: ${err.message}`),
    },
  );

  const [updateTax, { loading: updating }] = useMutation<UpdateTaxData>(
    UPDATE_TAX,
    {
      refetchQueries,
      onCompleted: () => {
        toast.success("Tax updated");
        closeForm();
      },
      onError: (err) => toast.error(`Update failed: ${err.message}`),
    },
  );

  const [removeTax, { loading: deleting }] = useMutation<RemoveTaxData>(
    REMOVE_TAX,
    {
      refetchQueries,
      onCompleted: (res) => {
        toast.success(`"${res.removeTax.name}" deleted`);
        setDeletingTax(null);
      },
      onError: (err) => toast.error(`Delete failed: ${err.message}`),
    },
  );

  // ---- Form ----
  const form = useForm<TaxFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(taxSchema as any) as any,
    defaultValues: {
      name: "",
      rate: 0,
      description: "",
      isActive: true,
      displayOrder: 0,
    },
  });

  function openCreateForm() {
    setEditingTax(null);
    form.reset({
      name: "",
      rate: 0,
      description: "",
      isActive: true,
      displayOrder: 0,
    });
    setIsFormOpen(true);
  }

  function openEditForm(tax: Tax) {
    setEditingTax(tax);
    form.reset({
      name: tax.name,
      rate: tax.rate,
      description: tax.description ?? "",
      isActive: tax.isActive,
      displayOrder: tax.displayOrder,
    });
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setEditingTax(null);
    form.reset();
  }

  async function onSubmit(values: TaxFormValues) {
    const input = {
      name: values.name,
      rate: values.rate,
      description: values.description || undefined,
      isActive: values.isActive,
      displayOrder: values.displayOrder,
    };

    if (editingTax) {
      await updateTax({
        variables: { updateTaxInput: { id: editingTax.id, ...input } },
      });
    } else {
      await createTax({ variables: { createTaxInput: input } });
    }
  }

  async function confirmDelete() {
    if (!deletingTax) return;
    await removeTax({ variables: { id: deletingTax.id } });
  }

  // ---- Derived ----
  const paged = data?.adminTaxesPaginated;
  const taxes = paged?.items ?? [];
  const totalCount = paged?.totalCount ?? 0;
  const totalPages = paged?.totalPages ?? 1;
  const serverPage = paged?.currentPage ?? currentPage;
  const startIdx = (serverPage - 1) * pageSize + 1;
  const endIdx = Math.min(serverPage * pageSize, totalCount);
  const isSaving = creating || updating;

  // ---- Render ----
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Receipt className="h-6 w-6 text-primary" />
            Taxes
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Tax catalog. Sellers pick one of these per product.
          </p>
        </div>
        <Button onClick={openCreateForm} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Tax
        </Button>
      </div>

      {/* Search */}
      <div className="relative w-full sm:max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search name or description..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card shadow-sm min-h-[300px]">
        {queryLoading && (
          <div className="space-y-3 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-14 w-full animate-pulse rounded-lg bg-muted"
              />
            ))}
          </div>
        )}

        {!queryLoading && taxes.length === 0 && (
          <div className="flex h-32 items-center justify-center text-muted-foreground">
            {debouncedSearch
              ? `No taxes found for "${debouncedSearch}"`
              : "No taxes yet. Click 'Add Tax' to create one."}
          </div>
        )}

        {!queryLoading && taxes.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase text-muted-foreground border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Name</th>
                  <th className="px-3 py-3 text-right font-medium">Rate</th>
                  <th className="px-3 py-3 text-left font-medium hidden md:table-cell">
                    Description
                  </th>
                  <th className="px-3 py-3 text-center font-medium hidden sm:table-cell">
                    Order
                  </th>
                  <th className="px-3 py-3 text-center font-medium">Status</th>
                  <th className="px-3 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {taxes.map((tax) => (
                  <tr
                    key={tax.id}
                    className="border-b last:border-b-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium">{tax.name}</td>
                    <td className="px-3 py-3 text-right font-mono">
                      {tax.rate.toFixed(2)}%
                    </td>
                    <td className="px-3 py-3 text-muted-foreground hidden md:table-cell max-w-md truncate">
                      {tax.description ?? "—"}
                    </td>
                    <td className="px-3 py-3 text-center font-mono text-xs hidden sm:table-cell text-muted-foreground">
                      {tax.displayOrder}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <Badge
                        variant={tax.isActive ? "default" : "secondary"}
                        className="text-[10px]"
                      >
                        {tax.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEditForm(tax)}
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => setDeletingTax(tax)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination footer */}
        {!queryLoading && totalCount > 0 && (
          <div className="border-t px-3 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">{startIdx}</span>–
              <span className="font-medium text-foreground">{endIdx}</span> of{" "}
              <span className="font-medium text-foreground">
                {totalCount.toLocaleString("en-IN")}
              </span>{" "}
              {debouncedSearch
                ? `matches for "${debouncedSearch}"`
                : "taxes"}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 mr-2">
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  Rows
                </span>
                <Select
                  value={String(pageSize)}
                  onValueChange={(v) => setPageSize(Number(v))}
                >
                  <SelectTrigger className="h-8 w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[25, 50, 100].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(1)}
                disabled={serverPage <= 1}
                title="First page"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={serverPage <= 1}
                title="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium px-2 min-w-[5rem] text-center">
                {serverPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={serverPage >= totalPages}
                title="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(totalPages)}
                disabled={serverPage >= totalPages}
                title="Last page"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={(o) => !o && closeForm()}>
        <DialogContent className="sm:max-w-md focus:ring-0">
          <DialogHeader>
            <DialogTitle>
              {editingTax ? "Edit Tax" : "Create Tax"}
            </DialogTitle>
            <DialogDescription>
              {editingTax
                ? "Update this tax. Changes apply to all products tagged with it."
                : "Define a new tax. Sellers will see it as an option on the product form."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 pt-2"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. GST 18%" {...field} />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Shown to sellers as the radio option label.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rate (%) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        step={0.01}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Single percentage value (0-100, 2 decimals).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Optional admin-facing notes..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="displayOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Order</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        value={field.value ? "active" : "inactive"}
                        onValueChange={(v) => field.onChange(v === "active")}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeForm}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {editingTax ? "Save Changes" : "Create Tax"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog
        open={!!deletingTax}
        onOpenChange={(o) => !o && setDeletingTax(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete tax?</AlertDialogTitle>
            <AlertDialogDescription>
              Soft-delete{" "}
              <span className="font-semibold text-foreground">
                &ldquo;{deletingTax?.name}&rdquo;
              </span>
              ? Products currently tagged with this tax will lose the
              assignment but stay listed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmDelete}
              disabled={deleting}
            >
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
