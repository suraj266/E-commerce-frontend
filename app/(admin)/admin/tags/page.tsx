/**
 * Admin Tags Page — /admin/tags
 *
 * Central tag registry. Sellers (Sprint 2.4d) will pick from this list to
 * label products. Admin curates; tags are simpler than brands (no logo,
 * description, etc.) — fits a smaller dialog rather than a Sheet.
 */

"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@/lib/forms/zod-resolver";
import { toast } from "sonner";
import {
  Hash,
  Loader2,
  Pencil,
  Plus,
  Star,
  StarOff,
  Trash2,
} from "lucide-react";

import {
  CREATE_TAG,
  GET_ADMIN_TAGS,
  REMOVE_TAG,
  SET_TAG_STATUS,
  UPDATE_TAG,
} from "@/lib/graphql/tags";
import {
  CreateTagData,
  GetAdminTagsData,
  RemoveTagData,
  SetTagStatusData,
  Tag,
  TAG_STATUSES,
  TAG_STATUS_LABEL,
  TagStatus,
  UpdateTagData,
} from "@/types/tag.types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const COL_COUNT = 7;

const STATUS_VARIANT: Record<
  TagStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  ACTIVE: "default",
  INACTIVE: "secondary",
};

const tagSchema = z.object({
  name: z.string().min(2, "At least 2 characters"),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "lowercase, digits, hyphens")
    .optional()
    .or(z.literal("")),
  description: z.string().max(500, "Max 500 chars").optional(),
  isFeatured: z.boolean(),
});
type TagFormValues = z.infer<typeof tagSchema>;

export default function AdminTagsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | TagStatus>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Tag | null>(null);
  const [deleting, setDeleting] = useState<Tag | null>(null);

  const { data, loading, error } = useQuery<GetAdminTagsData>(GET_ADMIN_TAGS, {
    variables: { status: statusFilter === "all" ? null : statusFilter },
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    if (error) toast.error(`Failed to load: ${error.message}`);
  }, [error]);

  const refetchVars = { status: statusFilter === "all" ? null : statusFilter };

  const [createTag, { loading: creating }] = useMutation<CreateTagData>(
    CREATE_TAG,
    {
      refetchQueries: [{ query: GET_ADMIN_TAGS, variables: refetchVars }],
      onCompleted: () => {
        toast.success("Tag created");
        closeDialog();
      },
      onError: (err) => toast.error(`Create failed: ${err.message}`),
    },
  );

  const [updateTag, { loading: updating }] = useMutation<UpdateTagData>(
    UPDATE_TAG,
    {
      refetchQueries: [{ query: GET_ADMIN_TAGS, variables: refetchVars }],
      onCompleted: () => {
        toast.success("Tag updated");
        closeDialog();
      },
      onError: (err) => toast.error(`Update failed: ${err.message}`),
    },
  );

  const [setTagStatus] = useMutation<SetTagStatusData>(SET_TAG_STATUS, {
    refetchQueries: [{ query: GET_ADMIN_TAGS, variables: refetchVars }],
    onError: (err) => toast.error(`Status change failed: ${err.message}`),
  });

  const [removeTag, { loading: removing }] = useMutation<RemoveTagData>(
    REMOVE_TAG,
    {
      refetchQueries: [{ query: GET_ADMIN_TAGS, variables: refetchVars }],
      onCompleted: (res) => {
        toast.success(`"${res.removeTag.name}" deleted`);
        setDeleting(null);
      },
      onError: (err) => toast.error(`Delete failed: ${err.message}`),
    },
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<TagFormValues>({
    resolver: zodResolver(tagSchema),
    defaultValues: { name: "", slug: "", description: "", isFeatured: false },
  });

  function openCreate() {
    setEditing(null);
    form.reset({ name: "", slug: "", description: "", isFeatured: false });
    setDialogOpen(true);
  }

  function openEdit(tag: Tag) {
    setEditing(tag);
    form.reset({
      name: tag.name,
      slug: tag.slug,
      description: tag.description ?? "",
      isFeatured: tag.isFeatured,
    });
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setEditing(null);
  }

  async function onSubmit(values: TagFormValues) {
    const input = {
      name: values.name,
      slug: values.slug || undefined,
      description: values.description || undefined,
      isFeatured: values.isFeatured,
    };
    if (editing) {
      await updateTag({
        variables: { updateTagInput: { id: editing.id, ...input } },
      });
    } else {
      await createTag({ variables: { createTagInput: input } });
    }
  }

  async function toggleFeatured(tag: Tag) {
    await setTagStatus({
      variables: {
        setTagStatusInput: { id: tag.id, isFeatured: !tag.isFeatured },
      },
    });
    toast.success(
      `${tag.name} ${!tag.isFeatured ? "featured" : "unfeatured"}`,
    );
  }

  async function toggleStatus(tag: Tag) {
    const next = tag.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    await setTagStatus({
      variables: { setTagStatusInput: { id: tag.id, status: next } },
    });
    toast.success(`${tag.name} → ${TAG_STATUS_LABEL[next]}`);
  }

  async function confirmDelete() {
    if (!deleting) return;
    await removeTag({ variables: { id: deleting.id } });
  }

  // Derived
  const all = data?.adminTags ?? [];
  const filtered = all.filter((t) => {
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    return (
      t.name.toLowerCase().includes(q) ||
      t.slug.toLowerCase().includes(q) ||
      t.description?.toLowerCase().includes(q)
    );
  });

  const pg = usePagination({ totalRows: filtered.length, defaultPageSize: 25 });
  const visible = filtered.slice(pg.start, pg.start + pg.pageSize);

  const activeFilterCount =
    (searchQuery ? 1 : 0) + (statusFilter !== "all" ? 1 : 0);
  const onSearchChange = (v: string) => {
    setSearchQuery(v);
    pg.resetPage();
  };
  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    pg.resetPage();
  };

  const isSaving = creating || updating;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Hash className="h-6 w-6 text-primary" />
            Tags
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Cross-cutting product labels (trending, seasonal, themes). Sellers
            pick from this list when listing products.
          </p>
        </div>
        <Button onClick={openCreate} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Tag
        </Button>
      </div>

      <TableToolbar
        search={searchQuery}
        onSearchChange={onSearchChange}
        searchPlaceholder="Search name, slug, description..."
        activeFilterCount={activeFilterCount}
        onReset={resetFilters}
        primaryFilters={
          <Select
            value={statusFilter}
            onValueChange={(val) => setStatusFilter(val as "all" | TagStatus)}
          >
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {TAG_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {TAG_STATUS_LABEL[s]}
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
              <TableHead className="w-12">#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Slug</TableHead>
              <TableHead className="hidden lg:table-cell">
                Description
              </TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && all.length === 0 ? (
              <TableSkeleton colSpan={COL_COUNT} />
            ) : visible.length === 0 ? (
              <TableEmpty
                colSpan={COL_COUNT}
                icon={Hash}
                hasFilters={activeFilterCount > 0}
                onClearFilters={resetFilters}
              >
                {searchQuery
                  ? `No tags found for "${searchQuery}"`
                  : "No tags yet. Click 'Add Tag' to create one."}
              </TableEmpty>
            ) : (
              visible.map((tag, idx) => (
                <TableRow key={tag.id}>
                  <TableCell className="text-xs text-muted-foreground font-mono">
                    {pg.start + idx + 1}
                  </TableCell>
                  <TableCell>
                    <button
                      type="button"
                      onClick={() => openEdit(tag)}
                      className="text-left hover:underline"
                    >
                      <div className="font-semibold truncate">{tag.name}</div>
                    </button>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-xs text-muted-foreground font-mono truncate max-w-[240px]">
                    /tag/{tag.slug}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground truncate max-w-[280px]">
                    {tag.description ?? "—"}
                  </TableCell>
                  <TableCell className="text-center">
                    <button
                      type="button"
                      onClick={() => toggleStatus(tag)}
                      className="cursor-pointer"
                      title="Click to toggle"
                    >
                      <Badge
                        variant={STATUS_VARIANT[tag.status]}
                        className="text-xs"
                      >
                        {TAG_STATUS_LABEL[tag.status]}
                      </Badge>
                    </button>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => toggleFeatured(tag)}
                      title={tag.isFeatured ? "Unfeature" : "Feature"}
                    >
                      {tag.isFeatured ? (
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ) : (
                        <StarOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEdit(tag)}
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => setDeleting(tag)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
        totalRows={filtered.length}
        totalPages={pg.totalPages}
        onPageChange={pg.setPage}
        onPageSizeChange={(n) => {
          pg.setPageSize(n);
          pg.resetPage();
        }}
      />

      {/* ===================================================================
          CREATE / EDIT DIALOG (smaller than Brand Sheet — tags are simple)
      =================================================================== */}
      <Dialog open={dialogOpen} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="sm:max-w-md focus:ring-0">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Tag" : "Add Tag"}</DialogTitle>
            <DialogDescription>
              {editing
                ? "Update tag details. Slug change affects the public URL."
                : "Sellers will see this tag when listing products."}
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
                    <FormLabel>Tag Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Trending" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="auto-generated-if-blank" {...field} />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Public URL: /tag/[slug]. Lowercase, digits, hyphens.
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
                        placeholder="Short context for this tag"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4"
                      />
                    </FormControl>
                    <FormLabel className="!m-0">
                      Feature this tag (appears in homepage tag cloud)
                    </FormLabel>
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editing ? "Save Changes" : "Create Tag"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* ===================================================================
          DELETE DIALOG
      =================================================================== */}
      <AlertDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tag?</AlertDialogTitle>
            <AlertDialogDescription>
              Soft-delete{" "}
              <span className="font-semibold text-foreground">
                &ldquo;{deleting?.name}&rdquo;
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
