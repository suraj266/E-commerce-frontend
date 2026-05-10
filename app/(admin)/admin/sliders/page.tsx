/**
 * =============================================================================
 * Admin Sliders — /admin/sliders
 * =============================================================================
 *
 * Server-paginated list of sliders. Click a row to edit the slider + its
 * nested slide items at /admin/sliders/[id]. "Add Slider" creates a draft
 * and routes to the editor.
 *
 * Mirrors the categories/pages admin pattern.
 * =============================================================================
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  GalleryHorizontal,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import {
  CREATE_SLIDER,
  GET_ADMIN_SLIDERS_PAGINATED,
  REMOVE_SLIDER,
} from "@/lib/graphql/sliders";
import {
  CreateSliderData,
  GetAdminSlidersPaginatedData,
  RemoveSliderData,
  SLIDER_STATUS_LABEL,
  SLIDER_STATUSES,
  SliderStatus,
} from "@/types/slider.types";

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

const COL_COUNT = 5;
const PAGE_SIZE_OPTIONS = [25, 50, 100] as const;

const STATUS_VARIANT: Record<
  SliderStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  DRAFT: "outline",
  PUBLISHED: "default",
  ARCHIVED: "destructive",
};

const newSliderSchema = z.object({
  name: z.string().min(2, "Min 2 characters").max(80),
  key: z
    .string()
    .min(2, "Min 2 characters")
    .max(60)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Lowercase letters/digits and hyphens"),
});
type NewSliderValues = z.infer<typeof newSliderSchema>;

export default function AdminSlidersPage() {
  useSetPageTitle("Sliders");
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | SliderStatus>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleting, setDeleting] = useState<{
    id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

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
  } = useQuery<GetAdminSlidersPaginatedData>(GET_ADMIN_SLIDERS_PAGINATED, {
    variables: refetchVars,
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    if (queryError) toast.error(`Failed to load: ${queryError.message}`);
  }, [queryError]);

  useEffect(() => {
    const c = data?.adminSlidersPaginated?.totalCount;
    if (typeof c === "number" && c !== serverTotal) setServerTotal(c);
  }, [data?.adminSlidersPaginated?.totalCount, serverTotal]);

  const [createSlider, { loading: creating }] = useMutation<CreateSliderData>(
    CREATE_SLIDER,
    {
      refetchQueries: [
        { query: GET_ADMIN_SLIDERS_PAGINATED, variables: refetchVars },
      ],
      onCompleted: (res) => {
        toast.success("Slider created");
        setIsCreateOpen(false);
        router.push(`/admin/sliders/${res.createSlider.id}`);
      },
      onError: (err) => toast.error(`Create failed: ${err.message}`),
    },
  );

  const [removeSlider, { loading: removing }] = useMutation<RemoveSliderData>(
    REMOVE_SLIDER,
    {
      refetchQueries: [
        { query: GET_ADMIN_SLIDERS_PAGINATED, variables: refetchVars },
      ],
      onCompleted: (res) => {
        toast.success(`"${res.removeSlider.name}" archived`);
        setDeleting(null);
      },
      onError: (err) => toast.error(`Delete failed: ${err.message}`),
    },
  );

  const form = useForm<NewSliderValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(newSliderSchema as any) as any,
    defaultValues: { name: "", key: "" },
  });

  // Auto-derive key from name (same UX as the page-create dialog).
  const keyTouchedRef = useState<{ touched: boolean }>(() => ({ touched: false }))[0];
  const nameValue = form.watch("name");
  useEffect(() => {
    if (keyTouchedRef.touched) return;
    const auto = nameValue
      ? nameValue
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
          .slice(0, 60)
      : "";
    form.setValue("key", auto, { shouldDirty: false });
  }, [nameValue, form, keyTouchedRef]);

  function openCreate() {
    keyTouchedRef.touched = false;
    form.reset({ name: "", key: "" });
    setIsCreateOpen(true);
  }

  async function onCreate(values: NewSliderValues) {
    await createSlider({
      variables: {
        createSliderInput: { name: values.name, key: values.key },
      },
    });
  }

  // ---- Derived ----
  const items = data?.adminSlidersPaginated?.items ?? [];
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
            <GalleryHorizontal className="h-6 w-6 text-primary" />
            Sliders
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Reusable carousels. Reference them from any page builder block via
            the slider key.
          </p>
        </div>
        <Button onClick={openCreate} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Slider
        </Button>
      </div>

      <TableToolbar
        search={searchQuery}
        onSearchChange={onSearchChange}
        searchPlaceholder="Search name or key..."
        activeFilterCount={activeFilterCount}
        onReset={resetFilters}
        primaryFilters={
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as "all" | SliderStatus)}
          >
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {SLIDER_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {SLIDER_STATUS_LABEL[s]}
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
              <TableHead>Name / Key</TableHead>
              <TableHead className="hidden sm:table-cell text-center">
                Slides
              </TableHead>
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
                icon={GalleryHorizontal}
                hasFilters={activeFilterCount > 0}
                onClearFilters={resetFilters}
              >
                {debouncedSearch
                  ? `No sliders found for "${debouncedSearch}"`
                  : "No sliders yet. Click 'Add Slider' to create one."}
              </TableEmpty>
            ) : (
              items.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    <Link
                      href={`/admin/sliders/${s.id}`}
                      className="block hover:underline"
                    >
                      <div className="font-medium">{s.name}</div>
                      <div className="text-xs text-muted-foreground font-mono truncate">
                        {s.key}
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell className="text-center font-mono text-xs hidden sm:table-cell">
                    {s.items?.length ?? 0}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={STATUS_VARIANT[s.status]}
                      className="text-[10px]"
                    >
                      {SLIDER_STATUS_LABEL[s.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs hidden md:table-cell">
                    {new Date(s.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        asChild
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        title="Edit"
                      >
                        <Link href={`/admin/sliders/${s.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() =>
                          setDeleting({ id: s.id, name: s.name })
                        }
                        title="Archive"
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
            <DialogTitle>Create slider</DialogTitle>
            <DialogDescription>
              Set a name + stable key. Add slide images on the next screen.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onCreate)}
              className="space-y-4 pt-2"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Home hero slider" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="key"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Key *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="home-hero"
                        {...field}
                        onChange={(e) => {
                          keyTouchedRef.touched = true;
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Stable identifier used to reference this slider from
                      page blocks. Auto-filled from name.
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

      <AlertDialog
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive slider?</AlertDialogTitle>
            <AlertDialogDescription>
              Archive{" "}
              <span className="font-semibold text-foreground">
                &ldquo;{deleting?.name}&rdquo;
              </span>
              ? Any page blocks referencing this slider&apos;s key will fall
              back to an empty render until you restore it or pick a different
              slider.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() =>
                deleting && removeSlider({ variables: { id: deleting.id } })
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
