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
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Hash,
  Loader2,
  Pencil,
  Plus,
  Search,
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
    resolver: zodResolver(tagSchema as any) as any,
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

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search name, slug, description..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
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
      </div>

      {/* Table */}
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
              ? `No tags found for "${searchQuery}"`
              : "No tags yet. Click 'Add Tag' to create one."}
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <>
            <div className="flex items-center gap-4 px-3 py-2 mb-2 text-sm font-medium text-muted-foreground border-b uppercase pb-3">
              <div className="w-12 text-center">S.No</div>
              <div className="flex-1">Name</div>
              <div className="hidden md:block flex-1">Slug</div>
              <div className="hidden lg:block flex-1">Description</div>
              <div className="w-24 text-center">Status</div>
              <div className="w-20 text-center">Featured</div>
              <div className="w-24 text-right">Actions</div>
            </div>

            <div className="flex flex-col gap-1 p-1">
              {filtered.map((tag, idx) => (
                <div
                  key={tag.id}
                  className="flex items-center gap-4 p-3 mb-2 bg-card border rounded-lg shadow-sm hover:bg-muted/30 transition-colors"
                >
                  <div className="w-12 text-center text-sm text-muted-foreground font-mono">
                    {idx + 1}
                  </div>
                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => openEdit(tag)}
                  >
                    <div className="font-semibold truncate">{tag.name}</div>
                  </div>
                  <div className="hidden md:block flex-1 min-w-0 text-xs text-muted-foreground font-mono truncate">
                    /tag/{tag.slug}
                  </div>
                  <div className="hidden lg:block flex-1 min-w-0 text-sm text-muted-foreground truncate">
                    {tag.description ?? "—"}
                  </div>
                  <div className="w-24 flex justify-center">
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
                  </div>
                  <div className="w-20 flex justify-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleFeatured(tag)}
                      title={tag.isFeatured ? "Unfeature" : "Feature"}
                    >
                      {tag.isFeatured ? (
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ) : (
                        <StarOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  <div className="w-24 flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEdit(tag)}
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleting(tag)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t px-4 py-3 text-sm text-muted-foreground">
              Showing {filtered.length} of {all.length} tags
            </div>
          </>
        )}
      </div>

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
