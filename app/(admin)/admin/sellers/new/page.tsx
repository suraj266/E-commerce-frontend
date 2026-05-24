/**
 * Admin: Create Seller — /admin/sellers/new
 *
 * Single-page form. Atomic: creates the User account (role=seller, email
 * pre-verified) AND the Seller business record in one transaction. Result
 * starts at status VERIFIED so they can immediately receive stores.
 */

"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation } from "@apollo/client/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@/lib/forms/zod-resolver";
import { toast } from "sonner";
import {
  ChevronLeft,
  Loader2,
  Save,
  ShieldCheck,
  User as UserIcon,
} from "lucide-react";

import { ADMIN_CREATE_SELLER, GET_SELLER_USERS } from "@/lib/graphql/sellers";
import {
  AdminCreateSellerData,
  BUSINESS_TYPES,
  BUSINESS_TYPE_LABELS,
  BusinessType,
  ENTITY_BUSINESS_TYPES,
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

// ---------------------------------------------------------------------------
// Schema — combines User + Seller fields
// ---------------------------------------------------------------------------
const schema = z
  .object({
    // User account
    userName: z.string().min(2, "At least 2 characters").max(200),
    userEmail: z.string().email("Invalid email"),
    userPhone: z.string().regex(PHONE_REGEX, "Invalid India phone number"),
    userPassword: z.string().min(8, "Minimum 8 characters"),

    // Business basics
    legalName: z.string().min(2).max(200),
    displayName: z.string().min(2).max(200),
    businessType: z.enum(BUSINESS_TYPES),
    dateOfIncorporation: z.string().optional(),
    registrationNumber: z.string().max(50).optional(),

    // Tax
    panNumber: z
      .string()
      .toUpperCase()
      .regex(PAN_REGEX, "Invalid India PAN (e.g. ABCDE1234F)"),
    gstin: z
      .string()
      .toUpperCase()
      .regex(GSTIN_REGEX, "Invalid 15-char GSTIN")
      .optional()
      .or(z.literal("")),

    // Contact
    businessEmail: z.string().email(),
    businessPhone: z.string().regex(PHONE_REGEX, "Invalid India phone"),
    supportEmail: z.string().email().optional().or(z.literal("")),

    // Signatory (conditionally required for entity types)
    signatoryName: z.string().max(200).optional(),
    signatoryPan: z
      .string()
      .toUpperCase()
      .regex(PAN_REGEX, "Invalid PAN")
      .optional()
      .or(z.literal("")),
    signatoryDesignation: z.string().max(100).optional(),

    commissionRate: z.coerce.number().min(0).max(100).default(0),
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

// ===========================================================================
export default function AdminCreateSellerPage() {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      userName: "",
      userEmail: "",
      userPhone: "",
      userPassword: "",
      legalName: "",
      displayName: "",
      businessType: "PRIVATE_LIMITED" as BusinessType,
      dateOfIncorporation: "",
      registrationNumber: "",
      panNumber: "",
      gstin: "",
      businessEmail: "",
      businessPhone: "",
      supportEmail: "",
      signatoryName: "",
      signatoryPan: "",
      signatoryDesignation: "",
      commissionRate: 0,
    },
  });

  const businessType = form.watch("businessType") as BusinessType;
  const isEntity = ENTITY_BUSINESS_TYPES.includes(businessType);

  const [adminCreateSeller, { loading }] = useMutation<AdminCreateSellerData>(
    ADMIN_CREATE_SELLER,
    {
      refetchQueries: [{ query: GET_SELLER_USERS, variables: { status: null } }],
    },
  );

  async function onSubmit(values: FormValues) {
    try {
      const res = await adminCreateSeller({
        variables: {
          input: {
            userName: values.userName,
            userEmail: values.userEmail,
            userPhone: values.userPhone,
            userPassword: values.userPassword,
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
      const created = res.data?.adminCreateSeller;
      toast.success(
        `Seller "${created?.displayName}" created and verified. Login: ${values.userEmail}`,
      );
      router.push("/admin/sellers");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Create failed";
      toast.error(msg);
    }
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
          Create Seller
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Onboard a seller on their behalf. Creates the login account + business
          profile in one step. Resulting seller starts <strong>VERIFIED</strong>{" "}
          and can immediately receive stores.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* -------- 1. Login account -------- */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Login account
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Rajesh Kumar" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="userEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Login email *</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="seller@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Marked pre-verified — seller can log in immediately.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="userPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone *</FormLabel>
                      <FormControl>
                        <Input placeholder="9876543210" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="userPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Temporary password *</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Min 8 chars — share with seller"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Share this with the seller out-of-band. They can change
                      it after first login.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* -------- 2. Business basics -------- */}
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
                      <FormControl>
                        <Input
                          placeholder="Registered business name"
                          {...field}
                        />
                      </FormControl>
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
                      <FormControl>
                        <Input
                          placeholder="Storefront / brand name"
                          {...field}
                        />
                      </FormControl>
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
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
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
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
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
                      <FormControl>
                        <Input placeholder="CIN / LLPIN / etc." {...field} />
                      </FormControl>
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
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        step={0.01}
                        placeholder="0"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Percentage deducted from each order before payout.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* -------- 3. Tax -------- */}
          <Card>
            <CardHeader>
              <CardTitle>Tax</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="panNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PAN *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="ABCDE1234F"
                          maxLength={10}
                          {...field}
                        />
                      </FormControl>
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
                      <FormControl>
                        <Input
                          placeholder="22ABCDE1234F1Z5"
                          maxLength={15}
                          {...field}
                        />
                      </FormControl>
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

          {/* -------- 4. Contact -------- */}
          <Card>
            <CardHeader>
              <CardTitle>Business contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="businessEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business email *</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
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
                      <FormControl>
                        <Input placeholder="9876543210" {...field} />
                      </FormControl>
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
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="support@business.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* -------- 5. Signatory (entity types only) -------- */}
          {isEntity && (
            <Card>
              <CardHeader>
                <CardTitle>Authorised signatory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  Required for {BUSINESS_TYPE_LABELS[businessType]} — must
                  differ from the entity PAN.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="signatoryName"
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
                    name="signatoryPan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PAN *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="ABCDE1234F"
                            maxLength={10}
                            {...field}
                          />
                        </FormControl>
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
                        <FormControl>
                          <Input
                            placeholder="Director / Partner"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sticky save bar */}
          <div className="sticky bottom-0 -mx-4 sm:-mx-0 bg-background/95 backdrop-blur border-t py-3 px-4 flex justify-end gap-2">
            <Button type="button" variant="outline" asChild>
              <Link href="/admin/sellers">Cancel</Link>
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              Create & verify
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
