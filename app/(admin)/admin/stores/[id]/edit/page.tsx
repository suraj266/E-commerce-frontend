/**
 * Admin: Edit Store — /admin/stores/[id]/edit
 *
 * Edits branding, locale, contact, featured flag. Slug rename allowed
 * (backend enforces uniqueness). Currency immutable once products exist.
 * Status changes use the existing override dialog on the list page.
 */

"use client";

import { use } from "react";
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

import {
  ADMIN_UPDATE_STORE,
  GET_STORE,
  GET_STORES,
} from "@/lib/graphql/stores";
import {
  AdminUpdateStoreData,
  GetStoreData,
} from "@/types/store.types";
import { PHONE_REGEX } from "@/types/seller.types";

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

const schema = z.object({
  name: z.string().min(2).max(200),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "lowercase, digits, hyphens"),
  description: z.string().max(1000).optional(),
  logoUrl: z.string().url().optional().or(z.literal("")),
  bannerUrl: z.string().url().optional().or(z.literal("")),
  currencyCode: z.string().length(3, "3-letter ISO code"),
  timezone: z.string(),
  locale: z.string(),
  supportEmail: z.string().email().optional().or(z.literal("")),
  supportPhone: z
    .string()
    .regex(PHONE_REGEX, "Invalid India phone")
    .optional()
    .or(z.literal("")),
  isFeatured: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export default function AdminEditStorePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const { data, loading: loadingStore, error } = useQuery<GetStoreData>(
    GET_STORE,
    { variables: { id }, fetchPolicy: "cache-and-network" },
  );
  const store = data?.store;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: store
      ? {
          name: store.name,
          slug: store.slug,
          description: store.description ?? "",
          logoUrl: store.logoUrl ?? "",
          bannerUrl: store.bannerUrl ?? "",
          currencyCode: store.currencyCode,
          timezone: store.timezone,
          locale: store.locale,
          supportEmail: store.supportEmail ?? "",
          supportPhone: store.supportPhone ?? "",
          isFeatured: store.isFeatured,
        }
      : undefined,
  });

  const [adminUpdateStore, { loading: saving }] = useMutation<AdminUpdateStoreData>(
    ADMIN_UPDATE_STORE,
    {
      refetchQueries: [
        { query: GET_STORES, variables: { status: null } },
        { query: GET_STORE, variables: { id } },
      ],
    },
  );

  async function onSubmit(values: FormValues) {
    try {
      await adminUpdateStore({
        variables: {
          input: {
            id,
            name: values.name,
            slug: values.slug,
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
      toast.success("Store updated");
      router.push("/admin/stores");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Save failed";
      toast.error(msg);
    }
  }

  if (loadingStore && !store) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (error || !store) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/stores">
            <ChevronLeft className="mr-1 h-4 w-4" />
            All stores
          </Link>
        </Button>
        <p className="text-sm text-destructive">
          {error?.message ?? "Store not found"}
        </p>
      </div>
    );
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
          Edit {store.name}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Update branding and contact details. Status overrides remain on the
          stores list page.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Branding</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Store name *</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL slug *</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormDescription className="text-xs">
                      Public URL: /store/[slug]. Must be unique.
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
                      <FormControl><Input placeholder="https://..." {...field} /></FormControl>
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
                      <FormControl><Input placeholder="https://..." {...field} /></FormControl>
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

          <Card>
            <CardHeader><CardTitle>Locale</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="currencyCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <FormControl><Input maxLength={3} {...field} /></FormControl>
                      <FormDescription className="text-xs">
                        Cannot change once products exist.
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
                      <FormControl><Input {...field} /></FormControl>
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
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Customer support</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="supportEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Support email</FormLabel>
                      <FormControl><Input type="email" {...field} /></FormControl>
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
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className="sticky bottom-0 -mx-4 sm:-mx-0 bg-background/95 backdrop-blur border-t py-3 px-4 flex justify-end gap-2">
            <Button type="button" variant="outline" asChild>
              <Link href="/admin/stores">Cancel</Link>
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              Save changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
