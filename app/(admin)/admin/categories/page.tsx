/**
 * =============================================================================
 * Admin Category Management Page
 * =============================================================================
 *
 * Full CRUD interface for managing product categories.
 * Route: /admin/categories
 *
 * FEATURES:
 * - List all categories in a data table (Name, Slug, Parent, Status, Order)
 * - Create new category via a slide-over Dialog form
 * - Edit any category by clicking the Edit action
 * - Delete (soft-delete) via a confirmation AlertDialog
 * - Toast feedback for every operation success/error
 * - Parentage support: dropdown to pick parent category
 *
 * GRAPHQL:
 * - Query:    GET_CATEGORIES (public, no token needed)
 * - Mutation: CREATE_CATEGORY (requires category:create permission)
 * - Mutation: UPDATE_CATEGORY (requires category:update permission)
 * - Mutation: REMOVE_CATEGORY (requires category:delete permission)
 * =============================================================================
 */

"use client";

import { useState, useEffect } from "react";
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
  FolderTree,
  ToggleLeft,
  ToggleRight,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import {
  GET_CATEGORIES,
  GET_ADMIN_CATEGORIES_PAGINATED,
  CREATE_CATEGORY,
  UPDATE_CATEGORY,
  REMOVE_CATEGORY,
  UPDATE_CATEGORY_TREE
} from "@/lib/graphql/categories";
import type {
  Category,
  GetCategoriesData,
  GetAdminCategoriesPaginatedData,
  CreateCategoryData,
  UpdateCategoryData,
  RemoveCategoryData,
} from "@/types/category.types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CategorySortableList } from "./components/sortable-tree";
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

// ---------------------------------------------------------------------------
// Zod validation schema for category form
// ---------------------------------------------------------------------------
const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().optional(),
  description: z.string().optional(),
  parentId: z.string().optional(),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  displayOrder: z.coerce.number().min(0, "Order must be 0 or more"),
  isActive: z.boolean(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

// ===========================================================================
// Main Component
// ===========================================================================

export default function CategoriesPage() {
  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  // Server-side pagination — the backend `adminCategoriesPaginated` query
  // returns a slice + counts. The full `categories` query is still used for
  // the parent-picker dropdown so admins can re-parent into anything,
  // including rows on other pages.
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  // Debounce the search box so we don't hit the backend on every keystroke.
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Reset to page 1 whenever the search or page size changes — otherwise
  // the user can land beyond the new total page count.
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, pageSize]);

  // ---------------------------------------------------------------------------
  // GraphQL Hooks
  // ---------------------------------------------------------------------------

  // Paginated table feed — only this slice is rendered + drag-sortable.
  const {
    data: pageData,
    loading: queryLoading,
    error: queryError,
  } = useQuery<GetAdminCategoriesPaginatedData>(GET_ADMIN_CATEGORIES_PAGINATED, {
    variables: {
      page: currentPage,
      pageSize,
      search: debouncedSearch || null,
    },
    fetchPolicy: "cache-and-network",
  });

  // Full list — used ONLY by the parent-picker dropdown and the cycle-check
  // helper. Stays cached across renders.
  const { data: fullData } = useQuery<GetCategoriesData>(GET_CATEGORIES, {
    fetchPolicy: "cache-first",
  });

  // Show toast on query error
  useEffect(() => {
    if (queryError) toast.error(`Failed to load categories: ${queryError.message}`);
  }, [queryError]);

  const [createCategory, { loading: creating }] =
    useMutation<CreateCategoryData>(CREATE_CATEGORY, {
      // After create → re-fetch category list from server
      refetchQueries: [
        { query: GET_CATEGORIES },
        {
          query: GET_ADMIN_CATEGORIES_PAGINATED,
          variables: {
            page: currentPage,
            pageSize,
            search: debouncedSearch || null,
          },
        },
      ],
      onCompleted: () => {
        toast.success("Category created successfully!");
        closeForm();
      },
      onError: (err) => toast.error(`Create failed: ${err.message}`),
    });

  const [updateCategory, { loading: updating }] =
    useMutation<UpdateCategoryData>(UPDATE_CATEGORY, {
      refetchQueries: [
        { query: GET_CATEGORIES },
        {
          query: GET_ADMIN_CATEGORIES_PAGINATED,
          variables: {
            page: currentPage,
            pageSize,
            search: debouncedSearch || null,
          },
        },
      ],
      onCompleted: () => {
        toast.success("Category updated successfully!");
        closeForm();
      },
      onError: (err) => toast.error(`Update failed: ${err.message}`),
    });

  const [removeCategory, { loading: deleting }] =
    useMutation<RemoveCategoryData>(REMOVE_CATEGORY, {
      refetchQueries: [
        { query: GET_CATEGORIES },
        {
          query: GET_ADMIN_CATEGORIES_PAGINATED,
          variables: {
            page: currentPage,
            pageSize,
            search: debouncedSearch || null,
          },
        },
      ],
      onCompleted: (data) => {
        toast.success(`"${data.removeCategory.name}" deleted.`);
        setDeletingCategory(null);
      },
      onError: (err) => toast.error(`Delete failed: ${err.message}`),
    });

  const [updateCategoryTree, { loading: updatingTree }] = useMutation(UPDATE_CATEGORY_TREE, {
    refetchQueries: [{ query: GET_CATEGORIES }],
    onCompleted: () => toast.success("List reordered successfully!"),
    onError: (err) => toast.error(`Failed to reorder: ${err.message}`),
  });

  // Inline status toggle mutation — separate hook so it doesn't trigger the form's
  // success toast or close the dialog.
  const [updateCategoryStatus] = useMutation<UpdateCategoryData>(UPDATE_CATEGORY, {
    refetchQueries: [{ query: GET_CATEGORIES }],
    onError: (err) => toast.error(`Status update failed: ${err.message}`),
  });

  // ---------------------------------------------------------------------------
  // React Hook Form
  // ---------------------------------------------------------------------------
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema as any) as any,
    defaultValues: {
      name: "",
      description: "",
      parentId: "",
      imageUrl: "",
      displayOrder: 0,
      isActive: true,
    },
  });

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  /** Open the "Create" dialog with a blank form */
  function openCreateForm() {
    setEditingCategory(null);
    form.reset({
      name: "",
      slug: "",
      description: "",
      parentId: "",
      imageUrl: "",
      displayOrder: 0,
      isActive: true,
    });
    setIsFormOpen(true);
  }

  /** Open the "Edit" dialog pre-filled with selected category data */
  function openEditForm(category: Category) {
    setEditingCategory(category);
    form.reset({
      name: category.name,
      slug: category.slug,
      description: category.description ?? "",
      parentId: category.parentId ?? "",
      imageUrl: category.imageUrl ?? "",
      displayOrder: category.displayOrder,
      isActive: category.isActive,
    });
    setIsFormOpen(true);
  }

  /** Close the form dialog and reset state */
  function closeForm() {
    setIsFormOpen(false);
    setEditingCategory(null);
    form.reset();
  }

  /** Handle form submit — calls Create or Update based on editingCategory */
  async function onSubmit(values: CategoryFormValues) {
    const input = {
      name: values.name,
      slug: values.slug || undefined,
      description: values.description || undefined,
      parentId: values.parentId || undefined,
      imageUrl: values.imageUrl || undefined,
      displayOrder: values.displayOrder,
      isActive: values.isActive,
    };

    if (editingCategory) {
      // Update existing
      await updateCategory({
        variables: {
          updateCategoryInput: { id: editingCategory.id, ...input },
        },
      });
    } else {
      // Create new
      await createCategory({
        variables: { createCategoryInput: input },
      });
    }
  }

  /** Confirm and execute soft-delete */
  async function confirmDelete() {
    if (!deletingCategory) return;
    await removeCategory({ variables: { id: deletingCategory.id } });
  }

  /** Execute batch tree update after drag and drop stops */
  async function handleReorder(newCategoryOrder: Category[]) {
    const input = newCategoryOrder.map((cat) => ({
      id: cat.id,
      parentId: cat.parentId || null,
      displayOrder: cat.displayOrder,
    }));
    await updateCategoryTree({ variables: { input: { items: input } } });
  }

  /** Inline status change from the row dropdown */
  async function handleStatusChange(category: Category, isActive: boolean) {
    await updateCategoryStatus({
      variables: { updateCategoryInput: { id: category.id, isActive } },
    });
    toast.success(`"${category.name}" set to ${isActive ? "Active" : "Inactive"}`);
  }

  // ---------------------------------------------------------------------------
  // Derived data
  // ---------------------------------------------------------------------------

  // Full list (cached) — used by parent picker + cycle check only.
  const allCategories = fullData?.categories ?? [];

  // Paginated slice — what actually renders in the sortable table.
  const paged = pageData?.adminCategoriesPaginated;
  const tableCategories = paged?.items ?? [];
  const totalCount = paged?.totalCount ?? 0;
  const totalPages = paged?.totalPages ?? 1;
  const serverPage = paged?.currentPage ?? currentPage;
  const startIdx = (serverPage - 1) * pageSize + 1;
  const endIdx = Math.min(serverPage * pageSize, totalCount);

  // Helper function to find all descendants of a given category ID
  function getDescendantIds(parentId: string): string[] {
    const children = allCategories.filter(c => c.parentId === parentId).map(c => c.id);
    const descendants = [...children];
    for (const childId of children) {
      descendants.push(...getDescendantIds(childId));
    }
    return descendants;
  }

  // Build a lookup map: id → name (for displaying parent name in table).
  // Uses the FULL list because a row on this page might be parented to a
  // category that's on a different page.
  const categoryMap = Object.fromEntries(allCategories.map((c) => [c.id, c.name]));

  // Find all descendants of the currently editing category so we can disable/hide them in the dropdown
  const invalidParentIds = editingCategory ? [editingCategory.id, ...getDescendantIds(editingCategory.id)] : [];

  const isSaving = creating || updating || updatingTree;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="space-y-6">
      {/* -------- Page Header -------- */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <FolderTree className="h-6 w-6 text-primary" />
            Categories
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage product categories for your store.
          </p>
        </div>
        <Button onClick={openCreateForm} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* -------- Search Bar -------- */}
      <div className="relative w-full sm:max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search categories..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* -------- Category Drag-and-Drop List -------- */}
      <div className="rounded-lg border bg-card p-2 shadow-sm min-h-[400px]">
        {/* Loading skeleton rows */}
        {queryLoading && (
          <div className="space-y-3 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 w-full animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!queryLoading && tableCategories.length === 0 && (
          <div className="flex h-32 items-center justify-center text-muted-foreground">
            {debouncedSearch
              ? `No categories found for "${debouncedSearch}"`
              : "No categories yet. Click 'Add Category' to create one."}
          </div>
        )}

        {/* Sortable List Component */}
        {!queryLoading && tableCategories.length > 0 && (
          <>
            {/* Headers mock using flex layout to match the list exactly */}
            <div className="flex items-center gap-4 px-3 py-2 mb-2 text-sm font-medium text-muted-foreground border-b uppercase pb-3">
              <div className="w-5 ml-2 mr-2"></div>
              <div className="flex-1">Name & Slug</div>
              <div className="hidden lg:block w-32">Parent</div>
              <div className="hidden sm:block w-16 text-center">Order</div>
              <div className="w-28 text-center">Status</div>
              <div className="w-16 text-right">Actions</div>
            </div>

            {/* Draggable Component — only the current page is sortable.
                Cross-page drag isn't supported (rare in practice; admin can
                bump displayOrder via the edit form for cross-page moves). */}
            <CategorySortableList
              items={tableCategories}
              categoryMap={categoryMap}
              onEdit={openEditForm}
              onDelete={setDeletingCategory}
              onReorder={handleReorder}
              onStatusChange={handleStatusChange}
            />
          </>
        )}

        {/* Pagination footer */}
        {!queryLoading && totalCount > 0 && (
          <div className="border-t px-3 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{startIdx}</span>–
              <span className="font-medium text-foreground">{endIdx}</span> of{" "}
              <span className="font-medium text-foreground">
                {totalCount.toLocaleString("en-IN")}
              </span>{" "}
              {debouncedSearch ? `matches for "${debouncedSearch}"` : "categories"}
            </div>

            <div className="flex items-center gap-2">
              {/* Page size selector */}
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
                    {[25, 50, 100, 200].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Page nav */}
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

      {/* ======================================================================
          CREATE / EDIT DIALOG
      ====================================================================== */}
      <Dialog open={isFormOpen} onOpenChange={(open) => !open && closeForm()}>
        <DialogContent className="sm:max-w-3xl focus:ring-0">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Category" : "Create Category"}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? "Update the details for this category."
                : "Fill in the details to create a new product category."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">

              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Electronics" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Permalink / Slug */}
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => {
                  const currentOrigin = typeof window !== "undefined" ? window.location.origin : "";
                  const previewUrl = `${currentOrigin}/categories/${field.value || form.watch("name").toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || "category-name"}`;
                  
                  return (
                    <FormItem>
                      <FormLabel>Permalink</FormLabel>
                      <FormControl>
                        <div className="flex rounded-md border border-input shadow-sm overflow-hidden focus-within:ring-1 focus-within:ring-ring">
                          <span className="flex items-center px-3 bg-muted text-muted-foreground text-sm border-r select-none whitespace-nowrap">
                            {currentOrigin}/categories/
                          </span>
                          <input
                            placeholder="leave blank to auto-generate"
                            className="flex-1 bg-transparent px-3 py-2 text-sm outline-none w-full"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription className="text-xs">
                        Preview: <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline break-all">{previewUrl}</a>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Short description..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Parent Category */}
              <FormField
                control={form.control}
                name="parentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent Category</FormLabel>
                    <Select
                      value={field.value ?? ""}
                      onValueChange={(val) =>
                        field.onChange(val === "none" ? "" : val)
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="None (Root Category)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None (Root Category)</SelectItem>
                        {allCategories
                          // Prevent selecting self or any of its descendants as a parent
                          .filter((c) => !invalidParentIds.includes(c.id))
                          .map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Leave empty to make this a top-level category.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Image URL */}
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/image.png"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Display Order + Is Active (side by side) */}
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
                        onValueChange={(val) =>
                          field.onChange(val === "active")
                        }
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

              {/* Action buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={closeForm}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingCategory ? "Save Changes" : "Create Category"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* ======================================================================
          DELETE CONFIRMATION DIALOG
      ====================================================================== */}
      <AlertDialog
        open={!!deletingCategory}
        onOpenChange={(open) => !open && setDeletingCategory(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                &ldquo;{deletingCategory?.name}&rdquo;
              </span>
              ? This is a soft delete — the category will be hidden but can be
              restored from the database if needed.
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
