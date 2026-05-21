/**
 * Seller Store Detail — /seller/stores/[id]
 *
 * Shows the store's branding (editable), locale, contact, and warehouse list.
 * Inline edit form for branding + contact. Warehouse add/edit/delete managed
 * via dialog. Currency is shown as read-only after first product (UI hint;
 * backend enforces too).
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@/lib/forms/zod-resolver";
import { toast } from "sonner";
import {
  ArrowLeft,
  ExternalLink,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  Star,
  Trash2,
  Warehouse as WarehouseIcon,
} from "lucide-react";

import {
  CREATE_MY_WAREHOUSE,
  GET_MY_STORE,
  GET_MY_STORES,
  REMOVE_MY_STORE,
  REMOVE_MY_WAREHOUSE,
  UPDATE_MY_STORE,
  UPDATE_MY_WAREHOUSE,
} from "@/lib/graphql/stores";
import {
  CreateMyWarehouseData,
  GetMyStoreData,
  RemoveMyStoreData,
  RemoveMyWarehouseData,
  Store,
  STORE_STATUS_LABEL,
  StoreStatus,
  UpdateMyStoreData,
  UpdateMyWarehouseData,
  Warehouse,
} from "@/types/store.types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/media/image-uploader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";

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

const PHONE_REGEX = /^(\+?91)?[6-9][0-9]{9}$/;
const PINCODE_REGEX = /^[1-9][0-9]{5}$/;

const editStoreSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  logoUrl: z.string().url().optional().or(z.literal("")),
  bannerUrl: z.string().url().optional().or(z.literal("")),
  supportEmail: z.string().email().optional().or(z.literal("")),
  supportPhone: z.string().regex(PHONE_REGEX).optional().or(z.literal("")),
});
type EditStoreValues = z.infer<typeof editStoreSchema>;

const warehouseSchema = z.object({
  name: z.string().min(2),
  code: z.string().min(2),
  addressLine1: z.string().min(2),
  addressLine2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  postalCode: z.string().regex(PINCODE_REGEX, "6-digit pincode"),
  phone: z.string().regex(PHONE_REGEX).optional().or(z.literal("")),
  isDefault: z.boolean(),
});
type WarehouseValues = z.infer<typeof warehouseSchema>;

// ===========================================================================
export default function StoreDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const { data, loading, error, refetch } = useQuery<GetMyStoreData>(
    GET_MY_STORE,
    { variables: { id }, fetchPolicy: "cache-and-network" },
  );

  useEffect(() => {
    if (error) toast.error(`Failed to load: ${error.message}`);
  }, [error]);

  const store = data?.myStore ?? null;

  const [isEditing, setIsEditing] = useState(false);
  const [warehouseDialog, setWarehouseDialog] = useState<{
    open: boolean;
    editing: Warehouse | null;
  }>({ open: false, editing: null });
  const [deletingStore, setDeletingStore] = useState(false);
  const [deletingWarehouse, setDeletingWarehouse] = useState<Warehouse | null>(
    null,
  );

  const [updateStore, { loading: saving }] =
    useMutation<UpdateMyStoreData>(UPDATE_MY_STORE);

  const [createWarehouse, { loading: addingWh }] =
    useMutation<CreateMyWarehouseData>(CREATE_MY_WAREHOUSE);

  const [updateWarehouse, { loading: updatingWh }] =
    useMutation<UpdateMyWarehouseData>(UPDATE_MY_WAREHOUSE);

  const [removeWarehouse, { loading: removingWh }] =
    useMutation<RemoveMyWarehouseData>(REMOVE_MY_WAREHOUSE);

  const [removeStore, { loading: removingStore }] = useMutation<RemoveMyStoreData>(
    REMOVE_MY_STORE,
    { refetchQueries: [{ query: GET_MY_STORES }] },
  );

  if (loading) {
    return <div className="h-96 animate-pulse rounded-lg bg-muted" />;
  }
  if (!store) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          Store not found.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/seller/stores">
          <ArrowLeft className="mr-1 h-4 w-4" />
          All stores
        </Link>
      </Button>

      <Header store={store} />

      <BrandingCard
        store={store}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        saving={saving}
        onSave={async (vals) => {
          await updateStore({
            variables: {
              updateStoreInput: {
                id: store.id,
                name: vals.name,
                slug: vals.slug,
                description: vals.description || undefined,
                logoUrl: vals.logoUrl || undefined,
                bannerUrl: vals.bannerUrl || undefined,
                supportEmail: vals.supportEmail || undefined,
                supportPhone: vals.supportPhone || undefined,
              },
            },
          });
          toast.success("Store updated");
          setIsEditing(false);
          await refetch();
        }}
      />

      <WarehousesCard
        warehouses={store.warehouses ?? []}
        onAdd={() => setWarehouseDialog({ open: true, editing: null })}
        onEdit={(w) => setWarehouseDialog({ open: true, editing: w })}
        onDelete={setDeletingWarehouse}
      />

      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-destructive">Danger zone</CardTitle>
          <CardDescription>
            Soft-delete this store. Cannot be undone via UI.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            onClick={() => setDeletingStore(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete store
          </Button>
        </CardContent>
      </Card>

      {/* Warehouse add/edit dialog */}
      <WarehouseDialog
        open={warehouseDialog.open}
        editing={warehouseDialog.editing}
        onClose={() => setWarehouseDialog({ open: false, editing: null })}
        saving={addingWh || updatingWh}
        onSave={async (vals) => {
          if (warehouseDialog.editing) {
            await updateWarehouse({
              variables: {
                updateWarehouseInput: {
                  id: warehouseDialog.editing.id,
                  name: vals.name,
                  code: vals.code,
                  addressLine1: vals.addressLine1,
                  addressLine2: vals.addressLine2 || undefined,
                  city: vals.city,
                  state: vals.state,
                  postalCode: vals.postalCode,
                  phone: vals.phone || undefined,
                  isDefault: vals.isDefault,
                },
              },
            });
            toast.success("Warehouse updated");
          } else {
            await createWarehouse({
              variables: {
                createWarehouseInput: {
                  storeId: store.id,
                  name: vals.name,
                  code: vals.code,
                  addressLine1: vals.addressLine1,
                  addressLine2: vals.addressLine2 || undefined,
                  city: vals.city,
                  state: vals.state,
                  postalCode: vals.postalCode,
                  phone: vals.phone || undefined,
                  isDefault: vals.isDefault,
                },
              },
            });
            toast.success("Warehouse added");
          }
          setWarehouseDialog({ open: false, editing: null });
          await refetch();
        }}
      />

      {/* Delete warehouse */}
      <AlertDialog
        open={!!deletingWarehouse}
        onOpenChange={(open) => !open && setDeletingWarehouse(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete warehouse?</AlertDialogTitle>
            <AlertDialogDescription>
              {deletingWarehouse && (
                <>
                  Soft-delete &ldquo;{deletingWarehouse.name}&rdquo;
                  ({deletingWarehouse.code}). Blocked if inventory exists.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={removingWh}
              onClick={async () => {
                if (!deletingWarehouse) return;
                try {
                  await removeWarehouse({
                    variables: { id: deletingWarehouse.id },
                  });
                  toast.success("Warehouse deleted");
                  setDeletingWarehouse(null);
                  await refetch();
                } catch (err) {
                  const msg =
                    err instanceof Error ? err.message : "Delete failed";
                  toast.error(msg);
                }
              }}
            >
              {removingWh && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete store */}
      <AlertDialog
        open={deletingStore}
        onOpenChange={(open) => !open && setDeletingStore(false)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this store?</AlertDialogTitle>
            <AlertDialogDescription>
              Soft-delete &ldquo;{store.name}&rdquo;. Blocked if products exist.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={removingStore}
              onClick={async () => {
                try {
                  await removeStore({ variables: { id: store.id } });
                  toast.success("Store deleted");
                  router.push("/seller/stores");
                } catch (err) {
                  const msg =
                    err instanceof Error ? err.message : "Delete failed";
                  toast.error(msg);
                }
              }}
            >
              {removingStore && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Subcomponents
// ---------------------------------------------------------------------------
function Header({ store }: { store: Store }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center overflow-hidden">
          {store.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={store.logoUrl}
              alt={store.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <WarehouseIcon className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight">{store.name}</h1>
            <Badge variant={STATUS_VARIANT[store.status]} className="text-xs">
              {STORE_STATUS_LABEL[store.status]}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            /{store.slug} · {store.currencyCode}
          </p>
        </div>
      </div>
      <Button variant="outline" asChild>
        <Link href={`/store/${store.slug}`} target="_blank">
          <ExternalLink className="mr-2 h-4 w-4" />
          View public page
        </Link>
      </Button>
    </div>
  );
}

function BrandingCard({
  store,
  isEditing,
  setIsEditing,
  saving,
  onSave,
}: {
  store: Store;
  isEditing: boolean;
  setIsEditing: (v: boolean) => void;
  saving: boolean;
  onSave: (v: EditStoreValues) => Promise<void>;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<EditStoreValues>({
    resolver: zodResolver(editStoreSchema),
    defaultValues: {
      name: store.name,
      slug: store.slug,
      description: store.description ?? "",
      logoUrl: store.logoUrl ?? "",
      bannerUrl: store.bannerUrl ?? "",
      supportEmail: store.supportEmail ?? "",
      supportPhone: store.supportPhone ?? "",
    },
  });

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Branding & Contact</CardTitle>
        {!isEditing ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              form.reset({
                name: store.name,
                slug: store.slug,
                description: store.description ?? "",
                logoUrl: store.logoUrl ?? "",
                bannerUrl: store.bannerUrl ?? "",
                supportEmail: store.supportEmail ?? "",
                supportPhone: store.supportPhone ?? "",
              });
              setIsEditing(true);
            }}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
        ) : null}
      </CardHeader>
      <CardContent>
        {!isEditing ? (
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <Field label="Description" value={store.description ?? "—"} />
            <Field label="Currency" value={store.currencyCode} />
            <Field label="Timezone" value={store.timezone} />
            <Field label="Locale" value={store.locale} />
            <Field label="Support email" value={store.supportEmail ?? "—"} />
            <Field label="Support phone" value={store.supportPhone ?? "—"} />
          </dl>
        ) : (
          <Form {...form}>
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit(onSave)}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      <Input {...field} />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Changing this changes your public URL.
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
                      <Input {...field} />
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
                          ownerType="STORE"
                          ownerId={store.id}
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
                          ownerType="STORE"
                          ownerId={store.id}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="supportEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Support email</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="supportPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Support phone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save changes
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}

function WarehousesCard({
  warehouses,
  onAdd,
  onEdit,
  onDelete,
}: {
  warehouses: Warehouse[];
  onAdd: () => void;
  onEdit: (w: Warehouse) => void;
  onDelete: (w: Warehouse) => void;
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Warehouses</CardTitle>
        <Button variant="outline" size="sm" onClick={onAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add warehouse
        </Button>
      </CardHeader>
      <CardContent>
        {warehouses.length === 0 ? (
          <p className="text-sm text-muted-foreground">No warehouses yet.</p>
        ) : (
          <div className="space-y-2">
            {warehouses.map((w) => (
              <div
                key={w.id}
                className="flex items-center gap-3 rounded-md border p-3"
              >
                <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">{w.name}</span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {w.code}
                    </span>
                    {w.isDefault && (
                      <Badge variant="default" className="text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        Default
                      </Badge>
                    )}
                    {!w.isActive && (
                      <Badge variant="secondary" className="text-xs">
                        Inactive
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {w.addressLine1}
                    {w.addressLine2 ? `, ${w.addressLine2}` : ""}, {w.city},{" "}
                    {w.state} {w.postalCode}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(w)}
                  title="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => onDelete(w)}
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function WarehouseDialog({
  open,
  editing,
  onClose,
  saving,
  onSave,
}: {
  open: boolean;
  editing: Warehouse | null;
  onClose: () => void;
  saving: boolean;
  onSave: (v: WarehouseValues) => Promise<void>;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<WarehouseValues>({
    resolver: zodResolver(warehouseSchema),
    defaultValues: {
      name: "",
      code: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      phone: "",
      isDefault: false,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: editing?.name ?? "",
        code: editing?.code ?? "",
        addressLine1: editing?.addressLine1 ?? "",
        addressLine2: editing?.addressLine2 ?? "",
        city: editing?.city ?? "",
        state: editing?.state ?? "",
        postalCode: editing?.postalCode ?? "",
        phone: editing?.phone ?? "",
        isDefault: editing?.isDefault ?? false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editing]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-2xl focus:ring-0">
        <DialogHeader>
          <DialogTitle>
            {editing ? "Edit Warehouse" : "Add Warehouse"}
          </DialogTitle>
          <DialogDescription>
            Pickup address for orders. Mark one as default per store.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSave)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="addressLine1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address line 1 *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="addressLine2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address line 2</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pincode *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isDefault"
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
                  <FormLabel className="!m-0">Default warehouse for this store</FormLabel>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editing ? "Save" : "Add"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-medium truncate" title={value}>
        {value}
      </dd>
    </div>
  );
}
