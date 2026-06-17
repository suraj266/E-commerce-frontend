/**
 * =============================================================================
 * Seller Self-Onboarding Wizard
 * =============================================================================
 * Route: /seller/onboarding
 *
 * 3-step wizard for the LOGGED-IN user to register as a seller. The userId
 * is taken from the JWT auth context on the backend — never from the form.
 *
 * Steps:
 *   1. Business Basics  → legalName, displayName, businessType, dateOfIncorp,
 *                         registrationNumber, signatory (entity types only)
 *   2. Tax Info         → panNumber (mandatory), gstin (optional)
 *   3. Contact          → businessEmail, businessPhone, supportEmail
 *
 * After all steps:
 *   - Seller record is in DRAFT (created or updated)
 *   - Seller can review and click "Submit for Review" → status → PENDING
 *
 * =============================================================================
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@/lib/forms/zod-resolver";
import { toast } from "sonner";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ShieldCheck,
  Send,
} from "lucide-react";

import {
  GET_MY_SELLER,
  CREATE_MY_SELLER,
  UPDATE_MY_SELLER,
  SUBMIT_MY_SELLER_FOR_REVIEW,
} from "@/lib/graphql/sellers";
import {
  BUSINESS_TYPES,
  BUSINESS_TYPE_LABELS,
  BusinessType,
  ENTITY_BUSINESS_TYPES,
  GetMySellerData,
  CreateMySellerData,
  UpdateMySellerData,
  SubmitMySellerForReviewData,
  Seller,
  PAN_REGEX,
  GSTIN_REGEX,
  PHONE_REGEX,
} from "@/types/seller.types";
import {
  GST_STATES,
  findStateByCode,
  stateCodeFromGstin,
} from "@/lib/constants/gst-states";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
// Validation — single schema with conditional signatory check via superRefine.
// Each step calls form.trigger([...stepFields]) which respects refinements.
// ---------------------------------------------------------------------------
const fullSchema = z
  .object({
    // Step 1
    legalName: z.string().min(2, "Legal name is required"),
    displayName: z.string().min(2, "Display name is required"),
    businessType: z.enum(BUSINESS_TYPES),
    dateOfIncorporation: z.string().optional(),
    registrationNumber: z.string().optional(),
    signatoryName: z.string().optional(),
    signatoryPan: z.string().optional(),
    signatoryDesignation: z.string().optional(),

    // Step 2
    panNumber: z
      .string()
      .regex(PAN_REGEX, "Invalid PAN format (e.g. ABCDE1234F)"),
    gstin: z
      .string()
      .optional()
      .refine((v) => !v || GSTIN_REGEX.test(v), {
        message: "Invalid GSTIN (must be 15 chars)",
      }),
    stateCode: z
      .string()
      .regex(/^[0-9]{2}$/, "Select your registered state")
      .refine((c) => !!findStateByCode(c), "Unknown state code"),
    stateName: z.string().min(2),

    // Step 3
    businessEmail: z.string().email("Invalid email"),
    businessPhone: z
      .string()
      .regex(PHONE_REGEX, "Invalid India phone (10 digits, optional +91)"),
    supportEmail: z
      .string()
      .optional()
      .refine((v) => !v || z.string().email().safeParse(v).success, {
        message: "Invalid email",
      }),
  })
  .superRefine((data, ctx) => {
    const isEntity = ENTITY_BUSINESS_TYPES.includes(
      data.businessType as BusinessType,
    );
    if (isEntity) {
      if (!data.signatoryName || data.signatoryName.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["signatoryName"],
          message: "Signatory name is required for this business type",
        });
      }
      if (!data.signatoryPan || !PAN_REGEX.test(data.signatoryPan)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["signatoryPan"],
          message: "Valid signatory PAN is required for this business type",
        });
      }
      if (
        data.signatoryPan &&
        data.signatoryPan.toUpperCase() === data.panNumber?.toUpperCase()
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["signatoryPan"],
          message: "Signatory PAN must differ from entity PAN",
        });
      }
    }

    // GSTIN prefix must agree with the selected state code (the first two
    // chars of a GSTIN are always the state code).
    if (data.gstin && data.stateCode) {
      const gstinPrefix = data.gstin.slice(0, 2);
      if (gstinPrefix !== data.stateCode) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["stateCode"],
          message: `State (${data.stateCode}) doesn't match GSTIN prefix (${gstinPrefix})`,
        });
      }
    }
  });

type WizardValues = z.infer<typeof fullSchema>;

// ===========================================================================
// Page
// ===========================================================================
export default function SellerOnboardingPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 4 = review
  const [submitting, setSubmitting] = useState(false);

  const { data, loading: queryLoading, refetch } =
    useQuery<GetMySellerData>(GET_MY_SELLER);
  const existing = data?.mySeller ?? null;

  const [createMySeller] = useMutation<CreateMySellerData>(CREATE_MY_SELLER, {
    refetchQueries: [{ query: GET_MY_SELLER }],
  });
  const [updateMySeller] = useMutation<UpdateMySellerData>(UPDATE_MY_SELLER, {
    refetchQueries: [{ query: GET_MY_SELLER }],
  });
  const [submitForReview, { loading: submittingReview }] =
    useMutation<SubmitMySellerForReviewData>(SUBMIT_MY_SELLER_FOR_REVIEW, {
      refetchQueries: [{ query: GET_MY_SELLER }],
    });

  const form = useForm<WizardValues>({
    resolver: zodResolver(fullSchema),
    defaultValues: {
      legalName: "",
      displayName: "",
      businessType: "INDIVIDUAL",
      dateOfIncorporation: "",
      registrationNumber: "",
      signatoryName: "",
      signatoryPan: "",
      signatoryDesignation: "",
      panNumber: "",
      gstin: "",
      stateCode: "",
      stateName: "",
      businessEmail: "",
      businessPhone: "",
      supportEmail: "",
    },
  });

  // Hydrate form from server when existing seller loads
  useEffect(() => {
    if (existing) {
      form.reset({
        legalName: existing.legalName,
        displayName: existing.displayName,
        businessType: existing.businessType,
        dateOfIncorporation: existing.dateOfIncorporation
          ? existing.dateOfIncorporation.slice(0, 10)
          : "",
        registrationNumber: existing.registrationNumber ?? "",
        signatoryName: existing.signatoryName ?? "",
        signatoryPan: existing.signatoryPan ?? "",
        signatoryDesignation: existing.signatoryDesignation ?? "",
        panNumber: existing.panNumber,
        gstin: existing.gstin ?? "",
        stateCode: existing.stateCode ?? "",
        stateName: existing.stateName ?? "",
        businessEmail: existing.businessEmail,
        businessPhone: existing.businessPhone,
        supportEmail: existing.supportEmail ?? "",
      });
    }
  }, [existing, form]);

  const businessType = form.watch("businessType");
  const isEntity = ENTITY_BUSINESS_TYPES.includes(businessType);

  const editable =
    !existing ||
    existing.overallStatus === "DRAFT" ||
    existing.overallStatus === "REJECTED";

  // -------------------------------------------------------------------------
  // Step navigation: validate current step's fields, then move on.
  // -------------------------------------------------------------------------
  async function nextStep() {
    let fields: (keyof WizardValues)[] = [];
    if (step === 1) {
      fields = [
        "legalName",
        "displayName",
        "businessType",
        "dateOfIncorporation",
        "registrationNumber",
        ...(isEntity
          ? (["signatoryName", "signatoryPan", "signatoryDesignation"] as const)
          : []),
      ];
    } else if (step === 2) {
      fields = ["panNumber", "gstin", "stateCode", "stateName"];
    } else if (step === 3) {
      fields = ["businessEmail", "businessPhone", "supportEmail"];
    }
    const valid = await form.trigger(fields);
    if (!valid) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    if (step === 3) {
      // Save the draft after step 3
      await persist();
      setStep(4);
    } else {
      setStep((s) => (s + 1) as 1 | 2 | 3 | 4);
    }
  }

  function prevStep() {
    setStep((s) => Math.max(1, s - 1) as 1 | 2 | 3 | 4);
  }

  async function persist() {
    const values = form.getValues();
    const input = {
      legalName: values.legalName,
      displayName: values.displayName,
      businessType: values.businessType,
      dateOfIncorporation: values.dateOfIncorporation || undefined,
      registrationNumber: values.registrationNumber || undefined,
      panNumber: values.panNumber.toUpperCase(),
      gstin: values.gstin ? values.gstin.toUpperCase() : undefined,
      stateCode: values.stateCode || undefined,
      stateName: values.stateName || undefined,
      businessEmail: values.businessEmail.toLowerCase(),
      businessPhone: values.businessPhone,
      supportEmail: values.supportEmail
        ? values.supportEmail.toLowerCase()
        : undefined,
      signatoryName: isEntity ? values.signatoryName : undefined,
      signatoryPan: isEntity ? values.signatoryPan?.toUpperCase() : undefined,
      signatoryDesignation: isEntity
        ? values.signatoryDesignation
        : undefined,
    };

    try {
      setSubmitting(true);
      if (existing) {
        await updateMySeller({
          variables: {
            updateSellerInput: { id: existing.id, ...input },
          },
        });
        toast.success("Draft saved");
      } else {
        await createMySeller({
          variables: { createSellerInput: input },
        });
        toast.success("Seller draft created");
      }
      await refetch();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Save failed";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSubmitForReview() {
    if (!existing) return;
    try {
      await submitForReview({ variables: { id: existing.id } });
      toast.success("Submitted for review!");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Submit failed";
      toast.error(msg);
    }
  }

  if (queryLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // If already submitted (PENDING/UNDER_REVIEW/VERIFIED) show status card
  if (existing && !editable) {
    return <StatusCard seller={existing} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" />
          {existing ? "Continue Onboarding" : "Become a Seller"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Complete KYC to start selling on the platform.
        </p>
      </div>

      <Stepper current={step} />

      {existing?.overallStatus === "REJECTED" && existing.rejectionReason && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm">
          <div className="font-semibold text-destructive">
            Your previous submission was rejected
          </div>
          <div className="mt-1 text-muted-foreground">
            {existing.rejectionReason}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            Edit the fields below and re-submit.
          </div>
        </div>
      )}

      <Form {...form}>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="space-y-5 rounded-lg border bg-card p-6"
        >
          {step === 1 && <Step1Fields control={form.control} isEntity={isEntity} />}
          {step === 2 && <Step2Fields form={form} />}
          {step === 3 && <Step3Fields control={form.control} />}
          {step === 4 && (
            <ReviewStep values={form.getValues()} isEntity={isEntity} />
          )}

          <Separator />

          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={step === 1 || submitting}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>

            {step < 4 ? (
              <Button type="button" onClick={nextStep} disabled={submitting}>
                {submitting && step === 3 && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {step === 3 ? "Save & Review" : "Next"}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmitForReview}
                disabled={submittingReview}
              >
                {submittingReview && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                <Send className="h-4 w-4 mr-1" />
                Submit for Review
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stepper
// ---------------------------------------------------------------------------
function Stepper({ current }: { current: 1 | 2 | 3 | 4 }) {
  const steps = [
    { n: 1, label: "Business" },
    { n: 2, label: "Tax" },
    { n: 3, label: "Contact" },
    { n: 4, label: "Review" },
  ];
  return (
    <div className="flex items-center gap-2">
      {steps.map((s, i) => {
        const done = current > s.n;
        const active = current === s.n;
        return (
          <div key={s.n} className="flex items-center gap-2 flex-1">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${
                done
                  ? "bg-primary text-primary-foreground"
                  : active
                    ? "bg-primary/20 border-2 border-primary text-primary"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {done ? <CheckCircle2 className="h-4 w-4" /> : s.n}
            </div>
            <span
              className={`text-sm ${
                active ? "font-semibold" : "text-muted-foreground"
              }`}
            >
              {s.label}
            </span>
            {i < steps.length - 1 && (
              <div className="flex-1 h-px bg-border ml-2" />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 1 — Business Basics
// ---------------------------------------------------------------------------
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Step1Fields({ control, isEntity }: { control: any; isEntity: boolean }) {
  return (
    <>
      <FormField
        control={control}
        name="legalName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Legal Business Name *</FormLabel>
            <FormControl>
              <Input
                placeholder="As registered with GST / MCA"
                {...field}
              />
            </FormControl>
            <FormDescription className="text-xs">
              Must match the name on your PAN / GST certificate.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="displayName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Storefront / Display Name *</FormLabel>
            <FormControl>
              <Input placeholder="What customers will see" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="businessType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Type *</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {BUSINESS_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {BUSINESS_TYPE_LABELS[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="dateOfIncorporation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Incorporation</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="registrationNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Registration Number</FormLabel>
            <FormControl>
              <Input placeholder="CIN / LLPIN / Partnership #" {...field} />
            </FormControl>
            <FormDescription className="text-xs">
              Required for entities (LLP, Pvt Ltd, etc.)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {isEntity && (
        <>
          <Separator />
          <div className="text-sm font-semibold">Authorized Signatory</div>
          <p className="text-xs text-muted-foreground -mt-3">
            Required for non-individual entities. The person legally authorized
            to act on behalf of the business.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="signatoryName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Signatory Name *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="signatoryDesignation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Designation</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Director" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={control}
            name="signatoryPan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Signatory PAN *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="ABCDE1234F"
                    className="font-mono uppercase"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  Must differ from the entity PAN.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Step 2 — Tax Info
// ---------------------------------------------------------------------------
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Step2Fields({ form }: { form: any }) {
  const control = form.control;
  // Auto-derive state from GSTIN's first 2 characters when present. The
  // state field stays editable when no GSTIN is set (sellers can register
  // pre-GSTIN with just a PAN), but locks the moment a valid GSTIN is
  // entered to enforce the GSTIN ↔ state agreement rule.
  const gstinValue: string = form.watch("gstin") ?? "";
  const stateLockedToGstin = (() => {
    const derived = stateCodeFromGstin(gstinValue.toUpperCase());
    return derived;
  })();

  useEffect(() => {
    if (stateLockedToGstin) {
      const s = findStateByCode(stateLockedToGstin);
      if (s) {
        form.setValue("stateCode", s.code, { shouldValidate: true });
        form.setValue("stateName", s.name, { shouldValidate: true });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateLockedToGstin]);

  return (
    <>
      <FormField
        control={control}
        name="panNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>PAN Number *</FormLabel>
            <FormControl>
              <Input
                placeholder="ABCDE1234F"
                className="font-mono uppercase"
                maxLength={10}
                {...field}
              />
            </FormControl>
            <FormDescription className="text-xs">
              10-character India PAN. For entities use the entity PAN, not
              individual.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="gstin"
        render={({ field }) => (
          <FormItem>
            <FormLabel>GSTIN (optional for now)</FormLabel>
            <FormControl>
              <Input
                placeholder="22ABCDE1234F1Z5"
                className="font-mono uppercase"
                maxLength={15}
                {...field}
              />
            </FormControl>
            <FormDescription className="text-xs">
              Mandatory before going live. You can add it after onboarding.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="stateCode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>State of registration *</FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                const s = findStateByCode(value);
                form.setValue("stateName", s?.name ?? "", {
                  shouldValidate: true,
                });
              }}
              value={field.value}
              disabled={!!stateLockedToGstin}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select state…" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="max-h-80">
                {GST_STATES.map((s) => (
                  <SelectItem key={s.code} value={s.code}>
                    {s.name} ({s.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription className="text-xs">
              {stateLockedToGstin
                ? "Auto-detected from your GSTIN — locked."
                : "GST place-of-supply identity. Determines whether buyer purchases attract CGST + SGST or IGST."}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// Step 3 — Contact
// ---------------------------------------------------------------------------
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Step3Fields({ control }: { control: any }) {
  return (
    <>
      <FormField
        control={control}
        name="businessEmail"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Business Email *</FormLabel>
            <FormControl>
              <Input type="email" {...field} />
            </FormControl>
            <FormDescription className="text-xs">
              Used for all official platform communication.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="businessPhone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Business Phone *</FormLabel>
            <FormControl>
              <Input placeholder="9876543210 or +919876543210" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="supportEmail"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Customer Support Email</FormLabel>
            <FormControl>
              <Input type="email" {...field} />
            </FormControl>
            <FormDescription className="text-xs">
              Optional. Shown to customers on order/return queries.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// Step 4 — Review
// ---------------------------------------------------------------------------
function ReviewStep({
  values,
  isEntity,
}: {
  values: WizardValues;
  isEntity: boolean;
}) {
  const rows: { label: string; value: string }[] = [
    { label: "Legal Name", value: values.legalName },
    { label: "Display Name", value: values.displayName },
    {
      label: "Business Type",
      value: BUSINESS_TYPE_LABELS[values.businessType as BusinessType],
    },
    {
      label: "Date of Incorporation",
      value: values.dateOfIncorporation || "—",
    },
    { label: "Registration Number", value: values.registrationNumber || "—" },
    { label: "PAN", value: values.panNumber },
    { label: "GSTIN", value: values.gstin || "— (will add later)" },
    {
      label: "State (place of supply)",
      value: values.stateName
        ? `${values.stateName} (${values.stateCode})`
        : "—",
    },
    { label: "Business Email", value: values.businessEmail },
    { label: "Business Phone", value: values.businessPhone },
    { label: "Support Email", value: values.supportEmail || "—" },
  ];
  if (isEntity) {
    rows.push(
      { label: "Signatory Name", value: values.signatoryName || "—" },
      { label: "Signatory PAN", value: values.signatoryPan || "—" },
      {
        label: "Signatory Designation",
        value: values.signatoryDesignation || "—",
      },
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold">Review Your Details</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Once submitted, the platform team will review your KYC. You can edit
          again only if rejected.
        </p>
      </div>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        {rows.map((r) => (
          <div key={r.label}>
            <dt className="text-xs text-muted-foreground">{r.label}</dt>
            <dd className="text-sm truncate" title={r.value}>
              {r.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Status Card — shown when existing seller is past DRAFT/REJECTED
// ---------------------------------------------------------------------------
function StatusCard({ seller }: { seller: Seller }) {
  const STATUS_BADGE: Record<
    Seller["overallStatus"],
    "default" | "secondary" | "destructive" | "outline"
  > = useMemo(
    () => ({
      DRAFT: "outline",
      PENDING: "secondary",
      UNDER_REVIEW: "secondary",
      VERIFIED: "default",
      REJECTED: "destructive",
      SUSPENDED: "destructive",
    }),
    [],
  );
  const sectionStatus = (verifiedAt: string | null | undefined) =>
    verifiedAt ? "Verified" : "Pending";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" />
          Seller Status
          <Badge
            variant={STATUS_BADGE[seller.overallStatus]}
            className="capitalize text-xs"
          >
            {seller.overallStatus.replace(/_/g, " ").toLowerCase()}
          </Badge>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {seller.displayName} — {seller.legalName}
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6 space-y-3">
        <div className="text-sm font-semibold">KYC Sections</div>
        <ul className="space-y-2 text-sm">
          <li className="flex justify-between">
            <span>PAN</span>
            <span className="text-muted-foreground">
              {sectionStatus(seller.panVerifiedAt)}
            </span>
          </li>
          {seller.gstin && (
            <li className="flex justify-between">
              <span>GSTIN</span>
              <span className="text-muted-foreground">
                {sectionStatus(seller.gstinVerifiedAt)}
              </span>
            </li>
          )}
          <li className="flex justify-between">
            <span>Bank Account</span>
            <span className="text-muted-foreground">
              {sectionStatus(seller.bankVerifiedAt)}
            </span>
          </li>
          <li className="flex justify-between">
            <span>Documents</span>
            <span className="text-muted-foreground">
              {sectionStatus(seller.documentsVerifiedAt)}
            </span>
          </li>
        </ul>

        {seller.rejectionReason && (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm">
            <div className="font-semibold text-destructive">Reason</div>
            <div className="mt-1 text-muted-foreground">
              {seller.rejectionReason}
            </div>
          </div>
        )}
      </div>

      {seller.overallStatus === "VERIFIED" && (
        <div className="rounded-md border border-primary/50 bg-primary/10 p-4 text-sm">
          🎉 You&apos;re verified! Next: add a payout account and start listing
          products. (Coming soon.)
        </div>
      )}
    </div>
  );
}
