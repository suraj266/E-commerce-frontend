/**
 * =============================================================================
 * Admin CMS Pages — /admin/pages
 * =============================================================================
 *
 * Lists all pages (DRAFT / PUBLISHED / ARCHIVED) with status filter,
 * search, and pagination. Click a row to open the block editor at
 * /admin/pages/[id]. "Add Page" creates a new draft and routes to the editor.
 * =============================================================================
 */

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@/lib/forms/zod-resolver";
import { toast } from "sonner";
import {
  Plus,
  Loader2,
  FileText,
  ExternalLink,
  Pencil,
  Trash2,
  Lock,
} from "lucide-react";

import {
  GET_ADMIN_PAGES_PAGINATED,
  CREATE_PAGE,
  REMOVE_PAGE,
} from "@/lib/graphql/pages";
import {
  CreatePageData,
  GetAdminPagesPaginatedData,
  PAGE_STATUSES,
  PAGE_STATUS_LABEL,
  PageStatus,
  RemovePageData,
} from "@/types/page.types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const COL_COUNT = 4;
const PAGE_SIZE_OPTIONS = [25, 50, 100] as const;

// ---------------------------------------------------------------------------
// New-page dialog form (just slug + title; blocks come later in editor)
// ---------------------------------------------------------------------------
const newPageSchema = z.object({
  title: z.string().min(2, "Min 2 characters").max(120),
  slug: z
    .string()
    .min(2, "Min 2 characters")
    .max(60)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Lowercase letters/digits separated by hyphens",
    ),
});
type NewPageValues = z.infer<typeof newPageSchema>;

const STATUS_VARIANT: Record<
  PageStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  DRAFT: "outline",
  PUBLISHED: "default",
  ARCHIVED: "destructive",
};

export default function AdminPagesPage() {
  useSetPageTitle("Pages");
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | PageStatus>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleting, setDeleting] = useState<{
    id: string;
    title: string;
    isSystem: boolean;
  } | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Server pagination
  const [serverTotal, setServerTotal] = useState(0);
  const pg = usePagination({
    totalRows: serverTotal,
    defaultPageSize: 50,
  });

  useEffect(() => {
    pg.resetPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- pg.resetPage stable
  }, [debouncedSearch, statusFilter]);

  const refetchVars = {
    status: statusFilter === "all" ? null : statusFilter,
    page: pg.page,
    pageSize: pg.pageSize,
    search: debouncedSearch || null,
  };

  const {
    data,
    loading: queryLoading,
    error: queryError,
  } = useQuery<GetAdminPagesPaginatedData>(GET_ADMIN_PAGES_PAGINATED, {
    variables: refetchVars,
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    if (queryError) toast.error(`Failed to load: ${queryError.message}`);
  }, [queryError]);

  // Sync server-reported totalCount into the pagination hook
  useEffect(() => {
    const c = data?.adminPagesPaginated?.totalCount;
    if (typeof c === "number" && c !== serverTotal) setServerTotal(c);
  }, [data?.adminPagesPaginated?.totalCount, serverTotal]);

  const [createPage, { loading: creating }] = useMutation<CreatePageData>(
    CREATE_PAGE,
    {
      refetchQueries: [
        { query: GET_ADMIN_PAGES_PAGINATED, variables: refetchVars },
      ],
      onCompleted: (res) => {
        toast.success("Page created");
        setIsCreateOpen(false);
        router.push(`/admin/pages/${res.createPage.id}`);
      },
      onError: (err) => toast.error(`Create failed: ${err.message}`),
    },
  );

  const [removePage, { loading: removing }] = useMutation<RemovePageData>(
    REMOVE_PAGE,
    {
      refetchQueries: [
        { query: GET_ADMIN_PAGES_PAGINATED, variables: refetchVars },
      ],
      onCompleted: (res) => {
        toast.success(`"${res.removePage.title}" archived`);
        setDeleting(null);
      },
      onError: (err) => toast.error(`Delete failed: ${err.message}`),
    },
  );

  const form = useForm<NewPageValues>({
    resolver: zodResolver(newPageSchema),
    defaultValues: { title: "", slug: "" },
  });

  /**
   * Auto-derive the slug from the title until the user manually edits the
   * slug field. We use a ref (not RHF's dirtyFields) because the ref is
   * synchronous and less affected by RHF subscription nuances.
   *
   * Reset on dialog open. Once `slugTouchedRef.current` flips to true, the
   * title→slug sync stops permanently for that session.
   */
  const slugTouchedRef = useRef(false);

  function openCreate() {
    slugTouchedRef.current = false;
    form.reset({ title: "", slug: "" });
    setIsCreateOpen(true);
  }

  function slugify(input: string): string {
    return input
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60);
  }

  const titleValue = form.watch("title");
  useEffect(() => {
    if (slugTouchedRef.current) return;
    // Empty title clears the slug too — keeps the two in lockstep until
    // the user takes ownership of the slug.
    form.setValue("slug", titleValue ? slugify(titleValue) : "", {
      shouldDirty: false,
    });
  }, [titleValue, form]);

  async function onCreate(values: NewPageValues) {
    await createPage({
      variables: {
        createPageInput: {
          title: values.title,
          slug: values.slug,
          blocks: "[]",
        },
      },
    });
  }

  // ---- Derived ----
  const items = data?.adminPagesPaginated?.items ?? [];
  const activeFilterCount =
    (debouncedSearch ? 1 : 0) + (statusFilter !== "all" ? 1 : 0);
  const onSearchChange = (v: string) => {
    setSearchQuery(v);
    pg.resetPage();
  };
  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    pg.resetPage();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Pages
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Build pages from blocks. Click a row to edit its content.
          </p>
        </div>
        <Button onClick={openCreate} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Page
        </Button>
      </div>

      <TableToolbar
        search={searchQuery}
        onSearchChange={onSearchChange}
        searchPlaceholder="Search title or slug..."
        activeFilterCount={activeFilterCount}
        onReset={resetFilters}
        primaryFilters={
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as "all" | PageStatus)}
          >
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {PAGE_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {PAGE_STATUS_LABEL[s]}
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
              <TableHead>Title / Slug</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="hidden md:table-cell">Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {queryLoading && items.length === 0 ? (
              <TableSkeleton colSpan={COL_COUNT} />
            ) : items.length === 0 ? (
              <TableEmpty
                colSpan={COL_COUNT}
                icon={FileText}
                hasFilters={activeFilterCount > 0}
                onClearFilters={resetFilters}
              >
                {debouncedSearch
                  ? `No pages found for "${debouncedSearch}"`
                  : "No pages yet. Click 'Add Page' to create one."}
              </TableEmpty>
            ) : (
              items.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <Link
                      href={`/admin/pages/${p.id}`}
                      className="block hover:underline"
                    >
                      <div className="font-medium flex items-center gap-2">
                        {p.title}
                        {p.isSystem && (
                          <span
                            title="System page"
                            className="text-muted-foreground"
                          >
                            <Lock className="h-3 w-3" />
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono truncate">
                        /{p.slug}
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={STATUS_VARIANT[p.status]}
                      className="text-[10px]"
                    >
                      {PAGE_STATUS_LABEL[p.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs hidden md:table-cell">
                    {new Date(p.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {p.status === "PUBLISHED" && (
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          title="View public"
                        >
                          <Link
                            href={`/${p.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                      <Button
                        asChild
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        title="Edit"
                      >
                        <Link href={`/admin/pages/${p.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      {!p.isSystem && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() =>
                            setDeleting({
                              id: p.id,
                              title: p.title,
                              isSystem: p.isSystem,
                            })
                          }
                          title="Archive"
                        >
                          <Trash2 className="h-4 w-4" />
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

      {/* Create dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create page</DialogTitle>
            <DialogDescription>
              Set a title and URL slug. You&apos;ll add blocks on the next
              screen.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onCreate)}
              className="space-y-4 pt-2"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Diwali Sale"
                        {...field}
                      />
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
                    <FormLabel>Slug *</FormLabel>
                    <FormControl>
                      <div className="flex rounded-md border overflow-hidden focus-within:ring-1 focus-within:ring-ring">
                        <span className="flex items-center px-3 bg-muted text-muted-foreground text-sm border-r select-none">
                          /
                        </span>
                        <input
                          className="flex-1 bg-transparent px-3 py-2 text-sm outline-none"
                          placeholder="diwali-sale"
                          {...field}
                          onChange={(e) => {
                            // The user took manual ownership of the slug —
                            // stop auto-syncing from title for this session.
                            slugTouchedRef.current = true;
                            field.onChange(e);
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormDescription className="text-xs">
                      Auto-filled from title. Edit to customize.{" "}
                      <span className="font-mono">
                        /{field.value || "your-slug"}
                      </span>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={creating}>
                  {creating && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create + edit
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive page?</AlertDialogTitle>
            <AlertDialogDescription>
              Soft-archive{" "}
              <span className="font-semibold text-foreground">
                &ldquo;{deleting?.title}&rdquo;
              </span>
              ? It will stop showing on the public site but stays recoverable.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() =>
                deleting &&
                removePage({ variables: { id: deleting.id } })
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
