/**
 * Admin: Edit Seller — /admin/sellers/[id]/edit
 *
 * Edits business fields on any existing Seller (any status). User account
 * fields (email/password) are NOT edited here — they belong to the User
 * record and have their own admin flow.
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
  ShieldCheck,
} from "lucide-react";

import {
  ADMIN_UPDATE_SELLER,
  GET_SELLER,
  GET_SELLER_USERS,
} from "@/lib/graphql/sellers";
import {
  AdminUpdateSellerData,
  BUSINESS_TYPES,
  BUSINESS_TYPE_LABELS,
  BusinessType,
  ENTITY_BUSINESS_TYPES,
  GetSellerData,
  GSTIN_REGEX,
  PAN_REGEX,
  PHONE_REGEX,
} from "@/types/seller.types";

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

const schema = z
  .object({
    legalName: z.string().min(2).max(200),
    displayName: z.string().min(2).max(200),
    businessType: z.enum(BUSINESS_TYPES),
    dateOfIncorporation: z.string().optional(),
    registrationNumber: z.string().max(50).optional(),

    panNumber: z
      .string()
      .toUpperCase()
      .regex(PAN_REGEX, "Invalid India PAN"),
    gstin: z
      .string()
      .toUpperCase()
      .regex(GSTIN_REGEX, "Invalid 15-char GSTIN")
      .optional()
      .or(z.literal("")),

    businessEmail: z.string().email(),
    businessPhone: z.string().regex(PHONE_REGEX, "Invalid India phone"),
    supportEmail: z.string().email().optional().or(z.literal("")),

    signatoryName: z.string().max(200).optional(),
    signatoryPan: z
      .string()
      .toUpperCase()
      .regex(PAN_REGEX, "Invalid PAN")
      .optional()
      .or(z.literal("")),
    signatoryDesignation: z.string().max(100).optional(),

    commissionRate: z.coerce.number().min(0).max(100),
  })
  .superRefine((val, ctx) => {
    if (ENTITY_BUSINESS_TYPES.includes(val.businessType as BusinessType)) {
      if (!val.signatoryName) {
        ctx.addIssue({
          path: ["signatoryName"],
          code: z.ZodIssueCode.custom,
          message: "Required for entity business types",
        });
      }
      if (!val.signatoryPan) {
        ctx.addIssue({
          path: ["signatoryPan"],
          code: z.ZodIssueCode.custom,
          message: "Required for entity business types",
        });
      }
      if (
        val.signatoryPan &&
        val.signatoryPan.toUpperCase() === val.panNumber.toUpperCase()
      ) {
        ctx.addIssue({
          path: ["signatoryPan"],
          code: z.ZodIssueCode.custom,
          message: "Signatory PAN must differ from entity PAN",
        });
      }
    }
  });

type FormValues = z.infer<typeof schema>;

export default function AdminEditSellerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const { data, loading: loadingSeller, error } = useQuery<GetSellerData>(
    GET_SELLER,
    { variables: { id }, fetchPolicy: "cache-and-network" },
  );
  const seller = data?.seller;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: seller
      ? {
          legalName: seller.legalName,
          displayName: seller.displayName,
          businessType: seller.businessType,
          dateOfIncorporation: seller.dateOfIncorporation
            ? seller.dateOfIncorporation.slice(0, 10)
            : "",
          registrationNumber: seller.registrationNumber ?? "",
          panNumber: seller.panNumber,
          gstin: seller.gstin ?? "",
          businessEmail: seller.businessEmail,
          businessPhone: seller.businessPhone,
          supportEmail: seller.supportEmail ?? "",
          signatoryName: seller.signatoryName ?? "",
          signatoryPan: seller.signatoryPan ?? "",
          signatoryDesignation: seller.signatoryDesignation ?? "",
          commissionRate: seller.commissionRate,
        }
      : undefined,
  });

  const businessType = form.watch("businessType") as BusinessType | undefined;
  const isEntity = businessType
    ? ENTITY_BUSINESS_TYPES.includes(businessType)
    : false;

  const [adminUpdateSeller, { loading: saving }] = useMutation<AdminUpdateSellerData>(
    ADMIN_UPDATE_SELLER,
    {
      refetchQueries: [
        { query: GET_SELLER_USERS, variables: { status: null } },
        { query: GET_SELLER, variables: { id } },
      ],
    },
  );

  async function onSubmit(values: FormValues) {
    try {
      await adminUpdateSeller({
        variables: {
          updateSellerInput: {
            id,
            legalName: values.legalName,
            displayName: values.displayName,
            businessType: values.businessType,
            dateOfIncorporation: values.dateOfIncorporation
              ? new Date(values.dateOfIncorporation).toISOString()
              : undefined,
            registrationNumber: values.registrationNumber || undefined,
            panNumber: values.panNumber,
            gstin: values.gstin || undefined,
            businessEmail: values.businessEmail,
            businessPhone: values.businessPhone,
            supportEmail: values.supportEmail || undefined,
            signatoryName: values.signatoryName || undefined,
            signatoryPan: values.signatoryPan || undefined,
            signatoryDesignation: values.signatoryDesignation || undefined,
            commissionRate: values.commissionRate,
          },
        },
      });
      toast.success("Seller updated");
      router.push("/admin/sellers");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Save failed";
      toast.error(msg);
    }
  }

  if (loadingSeller && !seller) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (error || !seller) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/sellers">
            <ChevronLeft className="mr-1 h-4 w-4" />
            All sellers
          </Link>
        </Button>
        <p className="text-sm text-destructive">
          {error?.message ?? "Seller not found"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/admin/sellers">
          <ChevronLeft className="mr-1 h-4 w-4" />
          All sellers
        </Link>
      </Button>

      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" />
          Edit {seller.displayName}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Update business profile fields. Status changes use the verification
          workflow from the sellers list.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Business basics */}
          <Card>
            <CardHeader>
              <CardTitle>Business basics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="legalName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Legal name *</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display name *</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="businessType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business type *</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {BUSINESS_TYPES.map((bt) => (
                            <SelectItem key={bt} value={bt}>
                              {BUSINESS_TYPE_LABELS[bt]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dateOfIncorporation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of incorporation</FormLabel>
                      <FormControl><Input type="date" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="registrationNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registration number</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="commissionRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform commission (%)</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} max={100} step={0.01} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Tax */}
          <Card>
            <CardHeader><CardTitle>Tax</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="panNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PAN *</FormLabel>
                      <FormControl><Input maxLength={10} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gstin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GSTIN</FormLabel>
                      <FormControl><Input maxLength={15} {...field} /></FormControl>
                      <FormDescription className="text-xs">
                        Optional. Required for GST-registered businesses.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader><CardTitle>Business contact</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="businessEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business email *</FormLabel>
                      <FormControl><Input type="email" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="businessPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business phone *</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
            </CardContent>
          </Card>

          {/* Signatory (entity types only) */}
          {isEntity && (
            <Card>
              <CardHeader><CardTitle>Authorised signatory</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="signatoryName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name *</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="signatoryPan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PAN *</FormLabel>
                        <FormControl><Input maxLength={10} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="signatoryDesignation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Designation</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          <div className="sticky bottom-0 -mx-4 sm:-mx-0 bg-background/95 backdrop-blur border-t py-3 px-4 flex justify-end gap-2">
            <Button type="button" variant="outline" asChild>
              <Link href="/admin/sellers">Cancel</Link>
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
