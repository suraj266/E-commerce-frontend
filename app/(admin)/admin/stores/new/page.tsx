/**
 * Admin: Create Store — /admin/stores/new
 *
 * Single-page form. Admin picks a VERIFIED seller as the owner, then fills
 * branding/locale/contact. Resulting store is ACTIVE with a default
 * placeholder warehouse.
 */

"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation, useQuery } from "@apollo/client/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@/lib/forms/zod-resolver";
import { toast } from "sonner";
import {
  ChevronLeft,
  Loader2,
  Save,
  Store as StoreIcon,
} from "lucide-react";

import { ADMIN_CREATE_STORE, GET_STORES } from "@/lib/graphql/stores";
import { GET_SELLERS } from "@/lib/graphql/sellers";
import {
  AdminCreateStoreData,
} from "@/types/store.types";
import { GetSellersData, PHONE_REGEX } from "@/types/seller.types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
// Schema
// ---------------------------------------------------------------------------
const schema = z.object({
  sellerId: z.string().uuid("Pick a seller"),
  name: z.string().min(2, "At least 2 characters").max(200),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "lowercase, digits, hyphens")
    .optional()
    .or(z.literal("")),
  description: z.string().max(1000).optional(),
  logoUrl: z.string().url().optional().or(z.literal("")),
  bannerUrl: z.string().url().optional().or(z.literal("")),
  currencyCode: z.string().length(3, "3-letter ISO code").default("INR"),
  timezone: z.string().default("Asia/Kolkata"),
  locale: z.string().default("en-IN"),
  supportEmail: z.string().email().optional().or(z.literal("")),
  supportPhone: z
    .string()
    .regex(PHONE_REGEX, "Invalid India phone")
    .optional()
    .or(z.literal("")),
  isFeatured: z.boolean().default(false),
});

type FormValues = z.infer<typeof schema>;

// ===========================================================================
export default function AdminCreateStorePage() {
  const router = useRouter();

  // Verified sellers only — backend rejects others.
  const { data: sellersData, loading: loadingSellers } = useQuery<GetSellersData>(
    GET_SELLERS,
    {
      variables: { status: "VERIFIED" },
      fetchPolicy: "cache-and-network",
    },
  );
  const sellers = sellersData?.sellers ?? [];

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      sellerId: "",
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
      isFeatured: false,
    },
  });

  const [adminCreateStore, { loading }] = useMutation<AdminCreateStoreData>(
    ADMIN_CREATE_STORE,
    {
      refetchQueries: [{ query: GET_STORES, variables: { status: null } }],
    },
  );

  async function onSubmit(values: FormValues) {
    try {
      const res = await adminCreateStore({
        variables: {
          input: {
            sellerId: values.sellerId,
            name: values.name,
            slug: values.slug || undefined,
            description: values.description || undefined,
            logoUrl: values.logoUrl || undefined,
            bannerUrl: values.bannerUrl || undefined,
            currencyCode: values.currencyCode,
            timezone: values.timezone,
            locale: values.locale,
            supportEmail: values.supportEmail || undefined,
            supportPhone: values.supportPhone || undefined,
            isFeatured: values.isFeatured,
          },
        },
      });
      const created = res.data?.adminCreateStore;
      toast.success(`Store "${created?.name}" created and active.`);
      router.push("/admin/stores");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Create failed";
      toast.error(msg);
    }
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/admin/stores">
          <ChevronLeft className="mr-1 h-4 w-4" />
          All stores
        </Link>
      </Button>

      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <StoreIcon className="h-6 w-6 text-primary" />
          Create Store
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Create a storefront under any verified seller. Starts{" "}
          <strong>ACTIVE</strong> with a placeholder warehouse — edit the
          warehouse address before fulfilling orders.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* -------- 1. Owner -------- */}
          <Card>
            <CardHeader>
              <CardTitle>Owner</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="sellerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seller *</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={loadingSellers}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              loadingSellers
                                ? "Loading verified sellers..."
                                : sellers.length === 0
                                  ? "No verified sellers — create one first"
                                  : "Pick a verified seller"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sellers.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.displayName}
                            <span className="text-xs text-muted-foreground ml-2">
                              ({s.legalName})
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-xs">
                      Only sellers with KYC status VERIFIED can own a store.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* -------- 2. Branding -------- */}
          <Card>
            <CardHeader>
              <CardTitle>Branding</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Store name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Acme Marketplace" {...field} />
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
                    <FormLabel>URL slug</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="auto-generated-from-name"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Public URL: /store/[slug]
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
                      <textarea
                        className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        placeholder="What this storefront sells"
                        {...field}
                      />
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
                      <FormLabel>Logo URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
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
                      <FormLabel>Banner URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
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
                      Feature this store on the marketplace home
                    </FormLabel>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* -------- 3. Locale -------- */}
          <Card>
            <CardHeader>
              <CardTitle>Locale</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="currencyCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <FormControl>
                        <Input placeholder="INR" maxLength={3} {...field} />
                      </FormControl>
                      <FormDescription className="text-xs">
                        ISO 4217 (e.g. INR, USD).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="timezone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Timezone</FormLabel>
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
                      <FormLabel>Locale</FormLabel>
                      <FormControl>
                        <Input placeholder="en-IN" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* -------- 4. Contact -------- */}
          <Card>
            <CardHeader>
              <CardTitle>Customer support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="supportEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Support email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
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
                        <Input placeholder="9876543210" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Sticky save bar */}
          <div className="sticky bottom-0 -mx-4 sm:-mx-0 bg-background/95 backdrop-blur border-t py-3 px-4 flex justify-end gap-2">
            <Button type="button" variant="outline" asChild>
              <Link href="/admin/stores">Cancel</Link>
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              Create store
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
