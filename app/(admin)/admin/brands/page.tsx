/**
 * Admin Brands Page — /admin/brands
 *
 * Central registry — only admins manage brands. Sellers (Sprint 2.4d) will
 * pick from this list when listing products. UI patterns mirror Categories
 * and Stores admin pages: list + filter + Sheet for create/edit + soft-delete.
 *
 * Logo + banner upload uses the new <ImageUploader> via the Image module.
 */

"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@/lib/forms/zod-resolver";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Star,
  StarOff,
  Tag as BrandIcon,
  Eye,
} from "lucide-react";

import {
  CREATE_BRAND,
  GET_ADMIN_BRANDS,
  REMOVE_BRAND,
  SET_BRAND_STATUS,
  UPDATE_BRAND,
} from "@/lib/graphql/brands";
import {
  Brand,
  BRAND_STATUSES,
  BRAND_STATUS_LABEL,
  BrandStatus,
  CreateBrandData,
  GetAdminBrandsData,
  RemoveBrandData,
  SetBrandStatusData,
  UpdateBrandData,
} from "@/types/brand.types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
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
import { ImageUploader } from "@/components/media/image-uploader";
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

const COL_COUNT = 8;

const STATUS_VARIANT: Record<
  BrandStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  ACTIVE: "default",
  INACTIVE: "secondary",
};

const brandSchema = z.object({
  name: z.string().min(2, "At least 2 characters"),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "lowercase, digits, hyphens")
    .optional()
    .or(z.literal("")),
  description: z.string().optional(),
  logoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  bannerUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  websiteUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  countryCode: z
    .string()
    .length(2, "ISO 3166-1 alpha-2 (e.g. IN, US)")
    .optional()
    .or(z.literal("")),
  foundedYear: z.coerce.number().min(1700).max(new Date().getFullYear()).optional().or(z.literal("")),
  isFeatured: z.boolean(),
});
type BrandFormValues = z.infer<typeof brandSchema>;

// ===========================================================================
export default function AdminBrandsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | BrandStatus>("all");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<Brand | null>(null);
  const [deleting, setDeleting] = useState<Brand | null>(null);

  const { data, loading, error } = useQuery<GetAdminBrandsData>(
    GET_ADMIN_BRANDS,
    {
      variables: { status: statusFilter === "all" ? null : statusFilter },
      fetchPolicy: "cache-and-network",
    },
  );

  useEffect(() => {
    if (error) toast.error(`Failed to load: ${error.message}`);
  }, [error]);

  const refetchVars = { status: statusFilter === "all" ? null : statusFilter };

  const [createBrand, { loading: creating }] = useMutation<CreateBrandData>(
    CREATE_BRAND,
    {
      refetchQueries: [{ query: GET_ADMIN_BRANDS, variables: refetchVars }],
      onCompleted: () => {
        toast.success("Brand created");
        closeSheet();
      },
      onError: (err) => toast.error(`Create failed: ${err.message}`),
    },
  );

  const [updateBrand, { loading: updating }] = useMutation<UpdateBrandData>(
    UPDATE_BRAND,
    {
      refetchQueries: [{ query: GET_ADMIN_BRANDS, variables: refetchVars }],
      onCompleted: () => {
        toast.success("Brand updated");
        closeSheet();
      },
      onError: (err) => toast.error(`Update failed: ${err.message}`),
    },
  );

  const [setBrandStatus] = useMutation<SetBrandStatusData>(SET_BRAND_STATUS, {
    refetchQueries: [{ query: GET_ADMIN_BRANDS, variables: refetchVars }],
    onError: (err) => toast.error(`Status change failed: ${err.message}`),
  });

  const [removeBrand, { loading: removing }] = useMutation<RemoveBrandData>(
    REMOVE_BRAND,
    {
      refetchQueries: [{ query: GET_ADMIN_BRANDS, variables: refetchVars }],
      onCompleted: (res) => {
        toast.success(`"${res.removeBrand.name}" deleted`);
        setDeleting(null);
      },
      onError: (err) => toast.error(`Delete failed: ${err.message}`),
    },
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      logoUrl: "",
      bannerUrl: "",
      websiteUrl: "",
      countryCode: "",
      foundedYear: "",
      isFeatured: false,
    },
  });

  function openCreate() {
    setEditing(null);
    form.reset({
      name: "",
      slug: "",
      description: "",
      logoUrl: "",
      bannerUrl: "",
      websiteUrl: "",
      countryCode: "",
      foundedYear: "",
      isFeatured: false,
    });
    setSheetOpen(true);
  }

  function openEdit(brand: Brand) {
    setEditing(brand);
    form.reset({
      name: brand.name,
      slug: brand.slug,
      description: brand.description ?? "",
      logoUrl: brand.logoUrl ?? "",
      bannerUrl: brand.bannerUrl ?? "",
      websiteUrl: brand.websiteUrl ?? "",
      countryCode: brand.countryCode ?? "",
      foundedYear: brand.foundedYear ?? "",
      isFeatured: brand.isFeatured,
    });
    setSheetOpen(true);
  }

  function closeSheet() {
    setSheetOpen(false);
    setEditing(null);
  }

  async function onSubmit(values: BrandFormValues) {
    const input = {
      name: values.name,
      slug: values.slug || undefined,
      description: values.description || undefined,
      logoUrl: values.logoUrl || undefined,
      bannerUrl: values.bannerUrl || undefined,
      websiteUrl: values.websiteUrl || undefined,
      countryCode: values.countryCode || undefined,
      foundedYear:
        typeof values.foundedYear === "number" ? values.foundedYear : undefined,
      isFeatured: values.isFeatured,
    };

    if (editing) {
      await updateBrand({
        variables: { updateBrandInput: { id: editing.id, ...input } },
      });
    } else {
      await createBrand({ variables: { createBrandInput: input } });
    }
  }

  async function toggleFeatured(brand: Brand) {
    await setBrandStatus({
      variables: {
        setBrandStatusInput: {
          id: brand.id,
          isFeatured: !brand.isFeatured,
        },
      },
    });
    toast.success(
      `${brand.name} ${!brand.isFeatured ? "featured" : "unfeatured"}`,
    );
  }

  async function toggleStatus(brand: Brand) {
    const next = brand.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    await setBrandStatus({
      variables: { setBrandStatusInput: { id: brand.id, status: next } },
    });
    toast.success(`${brand.name} → ${BRAND_STATUS_LABEL[next]}`);
  }

  async function confirmDelete() {
    if (!deleting) return;
    await removeBrand({ variables: { id: deleting.id } });
  }

  // Derived
  const all = data?.adminBrands ?? [];
  const filtered = all.filter((b) => {
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    return (
      b.name.toLowerCase().includes(q) ||
      b.slug.toLowerCase().includes(q) ||
      b.countryCode?.toLowerCase().includes(q)
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
            <BrandIcon className="h-6 w-6 text-primary" />
            Brands
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Central brand registry. Sellers will pick from this list when
            listing products.
          </p>
        </div>
        <Button onClick={openCreate} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Brand
        </Button>
      </div>

      <TableToolbar
        search={searchQuery}
        onSearchChange={onSearchChange}
        searchPlaceholder="Search name, slug, country..."
        activeFilterCount={activeFilterCount}
        onReset={resetFilters}
        primaryFilters={
          <Select
            value={statusFilter}
            onValueChange={(val) => setStatusFilter(val as "all" | BrandStatus)}
          >
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {BRAND_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {BRAND_STATUS_LABEL[s]}
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
              <TableHead className="w-14">Logo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Slug</TableHead>
              <TableHead className="hidden lg:table-cell text-center">
                Country
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
                icon={BrandIcon}
                hasFilters={activeFilterCount > 0}
                onClearFilters={resetFilters}
              >
                {searchQuery
                  ? `No brands found for "${searchQuery}"`
                  : "No brands yet. Click 'Add Brand' to create one."}
              </TableEmpty>
            ) : (
              visible.map((brand, idx) => (
                <TableRow key={brand.id}>
                  <TableCell className="text-xs text-muted-foreground font-mono">
                    {pg.start + idx + 1}
                  </TableCell>
                  <TableCell>
                    {brand.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={brand.logoUrl}
                        alt={brand.name}
                        className="h-10 w-10 rounded-md object-cover bg-muted"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                        <BrandIcon className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <button
                      type="button"
                      onClick={() => openEdit(brand)}
                      className="text-left hover:underline"
                    >
                      <div className="font-semibold truncate">{brand.name}</div>
                    </button>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-xs text-muted-foreground font-mono truncate max-w-[240px]">
                    /brand/{brand.slug}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-center text-sm text-muted-foreground">
                    {brand.countryCode ?? "—"}
                  </TableCell>
                  <TableCell className="text-center">
                    <button
                      type="button"
                      onClick={() => toggleStatus(brand)}
                      className="cursor-pointer"
                      title="Click to toggle"
                    >
                      <Badge
                        variant={STATUS_VARIANT[brand.status]}
                        className="text-xs"
                      >
                        {BRAND_STATUS_LABEL[brand.status]}
                      </Badge>
                    </button>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => toggleFeatured(brand)}
                      title={brand.isFeatured ? "Unfeature" : "Feature"}
                    >
                      {brand.isFeatured ? (
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ) : (
                        <StarOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {brand.websiteUrl && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          asChild
                          title="Open website"
                        >
                          <a
                            href={brand.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Eye className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEdit(brand)}
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => setDeleting(brand)}
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
          CREATE / EDIT SHEET
      =================================================================== */}
      <Sheet open={sheetOpen} onOpenChange={(open) => !open && closeSheet()}>
        <SheetContent className="sm:max-w-xl w-full overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editing ? "Edit Brand" : "Add Brand"}</SheetTitle>
            <SheetDescription>
              {editing
                ? "Update brand details. Slug change will affect public URL."
                : "Brand will be available for sellers to attach to products."}
            </SheetDescription>
          </SheetHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 px-6 pb-6 pt-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Apple" {...field} />
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
                      Public URL: /brand/[slug]. Lowercase, digits, hyphens.
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
                      <Input placeholder="Short tagline" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="logoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo</FormLabel>
                      <FormControl>
                        <ImageUploader
                          purpose="LOGO"
                          ownerType="GENERIC"
                          initialUrl={field.value || null}
                          onUploaded={(img) => field.onChange(img.url)}
                          onClear={() => field.onChange("")}
                          aspectClass="aspect-square h-32"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bannerUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Banner</FormLabel>
                      <FormControl>
                        <ImageUploader
                          purpose="BANNER"
                          ownerType="GENERIC"
                          initialUrl={field.value || null}
                          onUploaded={(img) => field.onChange(img.url)}
                          onClear={() => field.onChange("")}
                          aspectClass="aspect-[16/9] h-32"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="websiteUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://brand.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="countryCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country (ISO-2)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="IN"
                          maxLength={2}
                          {...field}
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
                  name="foundedYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Founded Year</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1700}
                          max={new Date().getFullYear()}
                          placeholder="1976"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                      Feature this brand on the homepage
                    </FormLabel>
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={closeSheet}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editing ? "Save Changes" : "Create Brand"}
                </Button>
              </div>
            </form>
          </Form>
        </SheetContent>
      </Sheet>

      {/* ===================================================================
          DELETE DIALOG
      =================================================================== */}
      <AlertDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Brand?</AlertDialogTitle>
            <AlertDialogDescription>
              Soft-delete{" "}
              <span className="font-semibold text-foreground">
                &ldquo;{deleting?.name}&rdquo;
              </span>
              . The record stays in the database with a deletion timestamp. Once
              products link to this brand, delete will be blocked.
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
