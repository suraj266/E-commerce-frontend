"use client";

/**
 * /account/addresses — customer address book.
 *
 * - Lists all saved addresses with the default pinned to the top
 * - "Add address" / "Edit" open a modal form using the same Zod schema
 * - "Set as default" promotes a non-default address (server demotes others
 *   transactionally — we never end up with two defaults)
 * - "Remove" deletes; if it was the default, server promotes the next
 *   newest so the customer always has a default once any addresses exist
 */

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Check,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  Star,
  Trash2,
} from "lucide-react";

import {
  ADD_MY_ADDRESS,
  GET_MY_ADDRESSES,
  REMOVE_MY_ADDRESS,
  SET_MY_DEFAULT_ADDRESS,
  UPDATE_MY_ADDRESS,
} from "@/lib/graphql/account";
import {
  Address,
  AddMyAddressData,
  ADDRESS_TYPE_FROM_GQL,
  ADDRESS_TYPE_LABEL,
  ADDRESS_TYPE_TO_GQL,
  AddressType,
  ADDRESS_TYPES,
  MyAddressesData,
  RemoveMyAddressData,
  SetMyDefaultAddressData,
  UpdateMyAddressData,
} from "@/types/account.types";

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

const addressSchema = z.object({
  type: z.enum(ADDRESS_TYPES),
  label: z.string().max(80).optional().or(z.literal("")),
  firstName: z.string().min(1, "Required").max(100),
  lastName: z.string().min(1, "Required").max(100),
  phone: z.string().max(20).optional().or(z.literal("")),
  addressLine1: z.string().min(1, "Required").max(200),
  addressLine2: z.string().max(200).optional().or(z.literal("")),
  city: z.string().min(1, "Required").max(100),
  state: z.string().min(1, "Required").max(100),
  postalCode: z.string().min(3).max(12),
  countryCode: z
    .string()
    .length(2, "2-letter ISO code")
    .regex(/^[A-Za-z]{2}$/, "Letters only, e.g. IN"),
  isDefault: z.boolean(),
});
type AddressValues = z.infer<typeof addressSchema>;

const EMPTY_VALUES: AddressValues = {
  type: "shipping",
  label: "",
  firstName: "",
  lastName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  countryCode: "IN",
  isDefault: false,
};

export default function AddressesPage() {
  const [editing, setEditing] = useState<Address | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<Address | null>(null);

  const { data, loading } = useQuery<MyAddressesData>(GET_MY_ADDRESSES, {
    fetchPolicy: "cache-and-network",
  });
  const items = data?.myAddresses ?? [];

  const [addAddress] = useMutation<AddMyAddressData>(ADD_MY_ADDRESS, {
    refetchQueries: [{ query: GET_MY_ADDRESSES }],
    onCompleted: () => toast.success("Address added"),
    onError: (err) => toast.error(`Add failed: ${err.message}`),
  });
  const [updateAddress] = useMutation<UpdateMyAddressData>(UPDATE_MY_ADDRESS, {
    refetchQueries: [{ query: GET_MY_ADDRESSES }],
    onCompleted: () => toast.success("Address updated"),
    onError: (err) => toast.error(`Update failed: ${err.message}`),
  });
  const [setDefault] = useMutation<SetMyDefaultAddressData>(
    SET_MY_DEFAULT_ADDRESS,
    {
      refetchQueries: [{ query: GET_MY_ADDRESSES }],
      onCompleted: () => toast.success("Default address updated"),
      onError: (err) => toast.error(err.message),
    },
  );
  const [removeAddress, { loading: removing }] =
    useMutation<RemoveMyAddressData>(REMOVE_MY_ADDRESS, {
      refetchQueries: [{ query: GET_MY_ADDRESSES }],
      onCompleted: () => {
        toast.success("Address removed");
        setDeleting(null);
      },
      onError: (err) => toast.error(`Remove failed: ${err.message}`),
    });

  const form = useForm<AddressValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(addressSchema as any) as any,
    defaultValues: EMPTY_VALUES,
  });

  const dialogOpen = creating || !!editing;
  function closeDialog() {
    setCreating(false);
    setEditing(null);
  }

  // Re-seed the form whenever the dialog opens for create/edit.
  useEffect(() => {
    if (creating) {
      form.reset(EMPTY_VALUES);
    } else if (editing) {
      form.reset({
        type:
          (ADDRESS_TYPE_FROM_GQL[editing.type] as AddressType) ?? "shipping",
        label: editing.label ?? "",
        firstName: editing.firstName,
        lastName: editing.lastName,
        phone: editing.phone ?? "",
        addressLine1: editing.addressLine1,
        addressLine2: editing.addressLine2 ?? "",
        city: editing.city,
        state: editing.state,
        postalCode: editing.postalCode,
        countryCode: editing.countryCode,
        isDefault: editing.isDefault,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creating, editing?.id]);

  async function onSubmit(values: AddressValues) {
    const payload = {
      type: ADDRESS_TYPE_TO_GQL[values.type],
      label: values.label || undefined,
      firstName: values.firstName,
      lastName: values.lastName,
      phone: values.phone || undefined,
      addressLine1: values.addressLine1,
      addressLine2: values.addressLine2 || undefined,
      city: values.city,
      state: values.state,
      postalCode: values.postalCode,
      countryCode: values.countryCode.toUpperCase(),
      isDefault: values.isDefault,
    };
    if (editing) {
      await updateAddress({
        variables: { input: { id: editing.id, ...payload } },
      });
    } else {
      await addAddress({ variables: { input: payload } });
    }
    closeDialog();
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Addresses</h1>
          <p className="mt-1 text-sm text-foreground/60">
            Manage shipping and billing addresses for faster checkout.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="inline-flex items-center justify-center rounded-md bg-brand text-white px-5 py-2.5 text-sm font-semibold shadow hover:bg-brand/90 transition"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Add address
        </button>
      </header>

      {loading && items.length === 0 ? (
        <div className="rounded-lg border bg-card p-8">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState onAdd={() => setCreating(true)} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((addr) => (
            <AddressCard
              key={addr.id}
              addr={addr}
              onEdit={() => setEditing(addr)}
              onDelete={() => setDeleting(addr)}
              onSetDefault={() =>
                setDefault({ variables: { id: addr.id } })
              }
            />
          ))}
        </div>
      )}

      {/* --- Create / Edit dialog --- */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(o) => {
          if (!o) closeDialog();
        }}
      >
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit address" : "Add address"}
            </DialogTitle>
            <DialogDescription>
              {editing
                ? "Update the details below."
                : "Add a new shipping or billing address."}
            </DialogDescription>
          </DialogHeader>

          <form
            id="address-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field
                label="Address type"
                error={form.formState.errors.type?.message}
              >
                <select
                  {...form.register("type")}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-brand transition"
                >
                  {ADDRESS_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {ADDRESS_TYPE_LABEL[t]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field
                label="Label"
                hint="Optional — e.g. 'Home', 'Office'"
                error={form.formState.errors.label?.message}
              >
                <input
                  {...form.register("label")}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-brand transition"
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field
                label="First name"
                error={form.formState.errors.firstName?.message}
              >
                <input
                  {...form.register("firstName")}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-brand transition"
                />
              </Field>
              <Field
                label="Last name"
                error={form.formState.errors.lastName?.message}
              >
                <input
                  {...form.register("lastName")}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-brand transition"
                />
              </Field>
            </div>

            <Field
              label="Phone"
              hint="Optional — for delivery coordination"
              error={form.formState.errors.phone?.message}
            >
              <input
                {...form.register("phone")}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-brand transition"
              />
            </Field>

            <Field
              label="Address line 1"
              error={form.formState.errors.addressLine1?.message}
            >
              <input
                {...form.register("addressLine1")}
                placeholder="Street address, P.O. box"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-brand transition"
              />
            </Field>
            <Field
              label="Address line 2"
              hint="Optional — apartment, suite, unit"
              error={form.formState.errors.addressLine2?.message}
            >
              <input
                {...form.register("addressLine2")}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-brand transition"
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Field label="City" error={form.formState.errors.city?.message}>
                <input
                  {...form.register("city")}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-brand transition"
                />
              </Field>
              <Field
                label="State / Region"
                error={form.formState.errors.state?.message}
              >
                <input
                  {...form.register("state")}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-brand transition"
                />
              </Field>
              <Field
                label="Postal code"
                error={form.formState.errors.postalCode?.message}
              >
                <input
                  {...form.register("postalCode")}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-brand transition"
                />
              </Field>
            </div>

            <Field
              label="Country code"
              hint="ISO 3166-1 alpha-2, e.g. IN, US, GB"
              error={form.formState.errors.countryCode?.message}
            >
              <input
                {...form.register("countryCode")}
                maxLength={2}
                onChange={(e) =>
                  form.setValue(
                    "countryCode",
                    e.target.value.toUpperCase(),
                    { shouldValidate: true },
                  )
                }
                className="w-full sm:max-w-32 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-brand transition uppercase"
              />
            </Field>

            <label className="flex items-center gap-2 cursor-pointer select-none text-sm">
              <input
                type="checkbox"
                {...form.register("isDefault")}
                className="h-4 w-4 rounded border-input"
              />
              Set as default address
            </label>
          </form>

          <DialogFooter>
            <button
              type="button"
              onClick={closeDialog}
              className="inline-flex items-center justify-center rounded-md border px-5 py-2 text-sm font-medium hover:bg-muted/40 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="address-form"
              disabled={form.formState.isSubmitting}
              className="inline-flex items-center justify-center rounded-md bg-brand text-white px-5 py-2 text-sm font-semibold shadow hover:bg-brand/90 transition disabled:opacity-60"
            >
              {form.formState.isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {editing ? "Save changes" : "Add address"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- Delete confirm --- */}
      <AlertDialog
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this address?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleting && (
                <>
                  Removing{" "}
                  <span className="font-semibold text-foreground">
                    {deleting.label || `${deleting.firstName} ${deleting.lastName}`}
                  </span>
                  . This can&apos;t be undone.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() =>
                deleting &&
                removeAddress({ variables: { id: deleting.id } })
              }
              disabled={removing}
            >
              {removing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function AddressCard({
  addr,
  onEdit,
  onDelete,
  onSetDefault,
}: {
  addr: Address;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
}) {
  const fullName = `${addr.firstName} ${addr.lastName}`.trim();
  const typeLabel =
    ADDRESS_TYPE_LABEL[ADDRESS_TYPE_FROM_GQL[addr.type] ?? "shipping"];

  return (
    <div className="rounded-lg border bg-card p-5 flex flex-col">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] uppercase tracking-wide font-semibold text-foreground/60">
              {typeLabel}
            </span>
            {addr.isDefault && (
              <span className="text-[10px] uppercase tracking-wide font-semibold px-1.5 py-0.5 rounded bg-brand text-white inline-flex items-center gap-1">
                <Star className="h-3 w-3 fill-white" />
                Default
              </span>
            )}
          </div>
          {addr.label && (
            <div className="text-xs text-foreground/60 mt-0.5">
              {addr.label}
            </div>
          )}
          <div className="text-base font-semibold mt-1">{fullName}</div>
        </div>
      </div>

      <address className="not-italic text-sm text-foreground/80 leading-relaxed flex-1">
        {addr.addressLine1}
        {addr.addressLine2 && (
          <>
            <br />
            {addr.addressLine2}
          </>
        )}
        <br />
        {addr.city}, {addr.state} {addr.postalCode}
        <br />
        {addr.countryCode}
        {addr.phone && (
          <>
            <br />
            <span className="text-foreground/60">{addr.phone}</span>
          </>
        )}
      </address>

      <div className="mt-4 pt-3 border-t flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-1 text-xs font-medium text-foreground/70 hover:text-foreground transition px-2 py-1 rounded hover:bg-muted/40"
          >
            <Pencil className="h-3 w-3" />
            Edit
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex items-center gap-1 text-xs font-medium text-foreground/70 hover:text-destructive transition px-2 py-1 rounded hover:bg-muted/40"
          >
            <Trash2 className="h-3 w-3" />
            Remove
          </button>
        </div>
        {!addr.isDefault && (
          <button
            type="button"
            onClick={onSetDefault}
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
          >
            <Check className="h-3 w-3" />
            Set as default
          </button>
        )}
      </div>
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="rounded-lg border bg-muted/20 px-6 py-16 text-center space-y-3">
      <MapPin className="mx-auto h-8 w-8 text-foreground/30" />
      <p className="text-base font-semibold">No addresses yet</p>
      <p className="text-sm text-foreground/60 max-w-sm mx-auto">
        Save a delivery address to speed up checkout the next time you place
        an order.
      </p>
      <button
        type="button"
        onClick={onAdd}
        className="inline-flex items-center justify-center rounded-md bg-brand text-white px-5 py-2.5 text-sm font-semibold shadow hover:bg-brand/90 transition mt-2"
      >
        <Plus className="mr-1.5 h-4 w-4" />
        Add your first address
      </button>
    </div>
  );
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      {children}
      {hint && !error && (
        <p className="text-xs text-foreground/60 mt-1">{hint}</p>
      )}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}
