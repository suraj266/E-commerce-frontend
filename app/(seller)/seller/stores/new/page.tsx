/**
 * Create Store Wizard — /seller/stores/new
 *
 * 5-step flow:
 *   1. Branding   (name, slug, description, logoUrl, bannerUrl)
 *   2. Locale     (currency, timezone, locale)
 *   3. Contact    (supportEmail, supportPhone)
 *   4. Warehouse  (first warehouse — required before going ACTIVE)
 *   5. Review & Create — submits createMyStore + createMyWarehouse, then
 *      submitMyStoreForReview to flip DRAFT → ACTIVE.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@/lib/forms/zod-resolver";
import { toast } from "sonner";
import {
  Store as StoreIcon,
  Globe,
  Mail,
  Warehouse as WarehouseIcon,
  Send,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Check,
} from "lucide-react";

import {
  CREATE_MY_STORE,
  CREATE_MY_WAREHOUSE,
  GET_MY_STORES,
  SUBMIT_MY_STORE_FOR_REVIEW,
} from "@/lib/graphql/stores";
import {
  CreateMyStoreData,
  CreateMyWarehouseData,
  SubmitMyStoreForReviewData,
} from "@/types/store.types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------
const PHONE_REGEX = /^(\+?91)?[6-9][0-9]{9}$/;
const PINCODE_REGEX = /^[1-9][0-9]{5}$/;
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const wizardSchema = z.object({
  // Step 1
  name: z.string().min(2, "Store name must be at least 2 characters"),
  slug: z
    .string()
    .regex(SLUG_REGEX, "Lowercase letters, numbers and hyphens only")
    .optional()
    .or(z.literal("")),
  description: z.string().optional(),
  logoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  bannerUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),

  // Step 2
  currencyCode: z.enum(["INR", "USD", "EUR", "GBP"]),
  timezone: z.string().min(1),
  locale: z.string().min(1),

  // Step 3
  supportEmail: z
    .string()
    .email("Must be a valid email")
    .optional()
    .or(z.literal("")),
  supportPhone: z
    .string()
    .regex(PHONE_REGEX, "Invalid India phone number")
    .optional()
    .or(z.literal("")),

  // Step 4
  warehouseName: z.string().min(2, "Warehouse name required"),
  warehouseCode: z.string().min(2, "Code required (e.g. MUM01)"),
  addressLine1: z.string().min(2),
  addressLine2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  postalCode: z.string().regex(PINCODE_REGEX, "6-digit pincode"),
  warehousePhone: z
    .string()
    .regex(PHONE_REGEX, "Invalid India phone number")
    .optional()
    .or(z.literal("")),
});

type WizardValues = z.infer<typeof wizardSchema>;

const STEPS = [
  { id: 1, name: "Branding", icon: StoreIcon },
  { id: 2, name: "Locale", icon: Globe },
  { id: 3, name: "Contact", icon: Mail },
  { id: 4, name: "Warehouse", icon: WarehouseIcon },
  { id: 5, name: "Review", icon: Send },
] as const;

const STEP_FIELDS: Record<number, (keyof WizardValues)[]> = {
  1: ["name", "slug", "description", "logoUrl", "bannerUrl"],
  2: ["currencyCode", "timezone", "locale"],
  3: ["supportEmail", "supportPhone"],
  4: [
    "warehouseName",
    "warehouseCode",
    "addressLine1",
    "addressLine2",
    "city",
    "state",
    "postalCode",
    "warehousePhone",
  ],
  5: [],
};

// ===========================================================================
export default function CreateStoreWizardPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<WizardValues>({
    resolver: zodResolver(wizardSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      logoUrl: "",
      bannerUrl: "",
      currencyCode: "INR",
      timezone: "Asia/Kolkata",
      locale: "en-IN",
      supportEmail: "",
      supportPhone: "",
      warehouseName: "",
      warehouseCode: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      warehousePhone: "",
    },
  });

  const [createStore] = useMutation<CreateMyStoreData>(CREATE_MY_STORE);
  const [createWarehouse] = useMutation<CreateMyWarehouseData>(
    CREATE_MY_WAREHOUSE,
  );
  const [submitForReview] = useMutation<SubmitMyStoreForReviewData>(
    SUBMIT_MY_STORE_FOR_REVIEW,
    { refetchQueries: [{ query: GET_MY_STORES }] },
  );

  const [submitting, setSubmitting] = useState(false);

  async function next() {
    const fields = STEP_FIELDS[step];
    const valid = await form.trigger(fields);
    if (!valid) return;
    setStep((s) => Math.min(5, s + 1));
  }

  function back() {
    setStep((s) => Math.max(1, s - 1));
  }

  async function handleSubmit() {
    const v = form.getValues();
    try {
      setSubmitting(true);

      const storeRes = await createStore({
        variables: {
          createStoreInput: {
            name: v.name,
            slug: v.slug || undefined,
            description: v.description || undefined,
            logoUrl: v.logoUrl || undefined,
            bannerUrl: v.bannerUrl || undefined,
            currencyCode: v.currencyCode,
            timezone: v.timezone,
            locale: v.locale,
            supportEmail: v.supportEmail || undefined,
            supportPhone: v.supportPhone || undefined,
          },
        },
      });
      const storeId = storeRes.data?.createMyStore.id;
      if (!storeId) throw new Error("Store creation failed");

      await createWarehouse({
        variables: {
          createWarehouseInput: {
            storeId,
            name: v.warehouseName,
            code: v.warehouseCode,
            addressLine1: v.addressLine1,
            addressLine2: v.addressLine2 || undefined,
            city: v.city,
            state: v.state,
            postalCode: v.postalCode,
            phone: v.warehousePhone || undefined,
            isDefault: true,
          },
        },
      });

      await submitForReview({ variables: { id: storeId } });

      toast.success("Store created and activated!");
      router.push(`/seller/stores/${storeId}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to create store";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Create a Store</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Set up branding, locale, contact, and your first pickup warehouse.
        </p>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-1 sm:gap-2">
        {STEPS.map((s, idx) => {
          const active = step === s.id;
          const done = step > s.id;
          const Icon = s.icon;
          return (
            <div key={s.id} className="flex items-center gap-1 sm:gap-2 flex-1">
              <div
                className={`h-9 w-9 rounded-full flex items-center justify-center ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : done
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </div>
              <span
                className={`hidden sm:inline text-sm ${
                  active ? "font-semibold" : "text-muted-foreground"
                }`}
              >
                {s.name}
              </span>
              {idx < STEPS.length - 1 && (
                <div className="h-px flex-1 bg-border" />
              )}
            </div>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{STEPS[step - 1].name}</CardTitle>
          <CardDescription>{stepDescription(step)}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              {step === 1 && <Step1Branding form={form} />}
              {step === 2 && <Step2Locale form={form} />}
              {step === 3 && <Step3Contact form={form} />}
              {step === 4 && <Step4Warehouse form={form} />}
              {step === 5 && <Step5Review values={form.getValues()} />}

              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={back}
                  disabled={step === 1 || submitting}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" /> Back
                </Button>
                {step < 5 ? (
                  <Button type="button" onClick={next}>
                    Next <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                  >
                    {submitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    <Send className="mr-2 h-4 w-4" />
                    Create Store
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

function stepDescription(step: number) {
  switch (step) {
    case 1:
      return "Public-facing identity. Slug becomes your storefront URL.";
    case 2:
      return "Currency is locked once products are added — choose carefully.";
    case 3:
      return "Customer support contact (visible on order confirmations).";
    case 4:
      return "Pickup address for orders. You can add more warehouses later.";
    case 5:
      return "Review and submit. Store will go ACTIVE immediately.";
  }
}

// ---------------------------------------------------------------------------
// Steps
// ---------------------------------------------------------------------------
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Step1Branding({ form }: { form: any }) {
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Store Name *</FormLabel>
            <FormControl>
              <Input placeholder="e.g. Trueway Sports" {...field} />
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
              Public URL: /store/[slug]. Lowercase letters, digits, hyphens.
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
                  ownerType="STORE"
                  initialUrl={field.value || null}
                  onUploaded={(img) => field.onChange(img.url)}
                  onClear={() => field.onChange("")}
                  aspectClass="aspect-square h-32"
                />
              </FormControl>
              <FormDescription className="text-xs">
                Square preferred. JPEG / PNG / WebP, max 5 MB.
              </FormDescription>
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
                  initialUrl={field.value || null}
                  onUploaded={(img) => field.onChange(img.url)}
                  onClear={() => field.onChange("")}
                  aspectClass="aspect-[16/9] h-32"
                />
              </FormControl>
              <FormDescription className="text-xs">
                16:9 banner shown on your public storefront.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Step2Locale({ form }: { form: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <FormField
        control={form.control}
        name="currencyCode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Currency *</FormLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="INR">INR — Indian Rupee</SelectItem>
                <SelectItem value="USD">USD — US Dollar</SelectItem>
                <SelectItem value="EUR">EUR — Euro</SelectItem>
                <SelectItem value="GBP">GBP — British Pound</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="timezone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Timezone *</FormLabel>
            <FormControl>
              <Input placeholder="Asia/Kolkata" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="locale"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Locale *</FormLabel>
            <FormControl>
              <Input placeholder="en-IN" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Step3Contact({ form }: { form: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="supportEmail"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Support Email</FormLabel>
            <FormControl>
              <Input placeholder="support@yourstore.com" {...field} />
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
            <FormLabel>Support Phone</FormLabel>
            <FormControl>
              <Input placeholder="9876543210" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Step4Warehouse({ form }: { form: any }) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="warehouseName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Warehouse Name *</FormLabel>
              <FormControl>
                <Input placeholder="Mumbai Hub" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="warehouseCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code *</FormLabel>
              <FormControl>
                <Input placeholder="MUM01" {...field} />
              </FormControl>
              <FormDescription className="text-xs">
                Short identifier, unique per store.
              </FormDescription>
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
            <FormLabel>Address Line 1 *</FormLabel>
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
            <FormLabel>Address Line 2</FormLabel>
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
                <Input placeholder="400001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="warehousePhone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Warehouse Phone</FormLabel>
            <FormControl>
              <Input placeholder="9876543210" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

function Step5Review({ values }: { values: WizardValues }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Confirm details. Currency is immutable once products are added.
      </p>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
        <Field label="Store name" value={values.name} />
        <Field label="Slug" value={values.slug || "(auto)"} />
        <Field label="Currency" value={values.currencyCode} />
        <Field label="Timezone" value={values.timezone} />
        <Field label="Locale" value={values.locale} />
        <Field label="Support email" value={values.supportEmail || "—"} />
        <Field label="Support phone" value={values.supportPhone || "—"} />
        <Field
          label="Warehouse"
          value={`${values.warehouseName} (${values.warehouseCode})`}
        />
        <Field
          label="Address"
          value={`${values.addressLine1}, ${values.city}, ${values.state} ${values.postalCode}`}
        />
      </dl>
    </div>
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
