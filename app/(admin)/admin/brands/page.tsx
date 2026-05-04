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
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Search,
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
    resolver: zodResolver(brandSchema as any) as any,
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

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search name, slug, country..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
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
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card p-2 shadow-sm min-h-[400px]">
        {loading && (
          <div className="space-y-3 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-16 w-full animate-pulse rounded-lg bg-muted"
              />
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="flex h-32 items-center justify-center text-muted-foreground">
            {searchQuery
              ? `No brands found for "${searchQuery}"`
              : "No brands yet. Click 'Add Brand' to create one."}
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <>
            <div className="flex items-center gap-4 px-3 py-2 mb-2 text-sm font-medium text-muted-foreground border-b uppercase pb-3">
              <div className="w-12 text-center">S.No</div>
              <div className="w-12">Logo</div>
              <div className="flex-1">Name</div>
              <div className="hidden md:block flex-1">Slug</div>
              <div className="hidden lg:block w-20 text-center">Country</div>
              <div className="w-24 text-center">Status</div>
              <div className="w-20 text-center">Featured</div>
              <div className="w-28 text-right">Actions</div>
            </div>

            <div className="flex flex-col gap-1 p-1">
              {filtered.map((brand, idx) => (
                <div
                  key={brand.id}
                  className="flex items-center gap-4 p-3 mb-2 bg-card border rounded-lg shadow-sm hover:bg-muted/30 transition-colors"
                >
                  <div className="w-12 text-center text-sm text-muted-foreground font-mono">
                    {idx + 1}
                  </div>
                  <div className="w-12 flex justify-center">
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
                  </div>
                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => openEdit(brand)}
                  >
                    <div className="font-semibold truncate">{brand.name}</div>
                  </div>
                  <div className="hidden md:block flex-1 min-w-0 text-xs text-muted-foreground font-mono truncate">
                    /brand/{brand.slug}
                  </div>
                  <div className="hidden lg:block w-20 text-center text-sm text-muted-foreground">
                    {brand.countryCode ?? "—"}
                  </div>
                  <div className="w-24 flex justify-center">
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
                  </div>
                  <div className="w-20 flex justify-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleFeatured(brand)}
                      title={brand.isFeatured ? "Unfeature" : "Feature"}
                    >
                      {brand.isFeatured ? (
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ) : (
                        <StarOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  <div className="w-28 flex items-center justify-end gap-1">
                    {brand.websiteUrl && (
                      <Button
                        variant="ghost"
                        size="icon"
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
                      onClick={() => openEdit(brand)}
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleting(brand)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t px-4 py-3 text-sm text-muted-foreground">
              Showing {filtered.length} of {all.length} brands
            </div>
          </>
        )}
      </div>

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
