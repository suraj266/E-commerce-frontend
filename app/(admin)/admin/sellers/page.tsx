/**
 * =============================================================================
 * Admin Seller Management Page
 * =============================================================================
 * Route: /admin/sellers
 *
 * Shows ALL seller-role users — including those who registered but haven't
 * started onboarding yet. Funnel status drives what actions are available:
 *
 *   REGISTERED_UNVERIFIED → "Verify Email" button (admin override)
 *   REGISTERED            → user has not started KYC; nothing to verify yet
 *   DRAFT                 → user is filling onboarding; nothing to verify yet
 *   PENDING / UNDER_REVIEW / VERIFIED / REJECTED / SUSPENDED → KYC review Sheet
 * =============================================================================
 */

"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Trash2,
  Loader2,
  Store as StoreIcon,
  Search,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Eye,
  MailCheck,
} from "lucide-react";

import {
  GET_SELLER_USERS,
  VERIFY_SELLER_SECTION,
  SET_SELLER_STATUS,
  REMOVE_SELLER,
} from "@/lib/graphql/sellers";
import { authApi } from "@/lib/api/auth.api";
import { useAuthStore } from "@/store/auth.store";
import {
  Seller,
  SellerListItem,
  SellerListStatus,
  SELLER_LIST_STATUSES,
  SELLER_LIST_STATUS_LABEL,
  SELLER_STATUSES,
  SellerStatus,
  VerificationSection,
  VERIFICATION_SECTIONS,
  BUSINESS_TYPE_LABELS,
  GetSellerUsersData,
  VerifySellerSectionData,
  SetSellerStatusData,
  RemoveSellerData,
} from "@/types/seller.types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const STATUS_VARIANT: Record<
  SellerListStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  REGISTERED_UNVERIFIED: "outline",
  REGISTERED: "outline",
  DRAFT: "outline",
  PENDING: "secondary",
  UNDER_REVIEW: "secondary",
  VERIFIED: "default",
  REJECTED: "destructive",
  SUSPENDED: "destructive",
};

const KYC_STATES: SellerListStatus[] = [
  "PENDING",
  "UNDER_REVIEW",
  "VERIFIED",
  "REJECTED",
  "SUSPENDED",
];

const setStatusSchema = z.object({
  status: z.enum(SELLER_STATUSES),
  reason: z.string().optional(),
});
type SetStatusValues = z.infer<typeof setStatusSchema>;

// ===========================================================================
// Page
// ===========================================================================
export default function SellersPage() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | SellerListStatus>(
    "all",
  );
  const [openItem, setOpenItem] = useState<SellerListItem | null>(null);
  const [statusDialogSeller, setStatusDialogSeller] = useState<Seller | null>(
    null,
  );
  const [deletingSeller, setDeletingSeller] = useState<Seller | null>(null);
  const [verifyingEmailFor, setVerifyingEmailFor] = useState<string | null>(
    null,
  );

  const { data, loading: queryLoading, error: queryError, refetch } =
    useQuery<GetSellerUsersData>(GET_SELLER_USERS, {
      variables: { status: statusFilter === "all" ? null : statusFilter },
      fetchPolicy: "cache-and-network",
    });

  useEffect(() => {
    if (queryError) toast.error(`Failed to load: ${queryError.message}`);
  }, [queryError]);

  const refetchVars = { status: statusFilter === "all" ? null : statusFilter };

  const [verifySection] = useMutation<VerifySellerSectionData>(
    VERIFY_SELLER_SECTION,
    {
      refetchQueries: [{ query: GET_SELLER_USERS, variables: refetchVars }],
      onCompleted: (res) => {
        toast.success("Verification updated");
        if (openItem?.seller && openItem.seller.id === res.verifySellerSection.id) {
          setOpenItem({ ...openItem, seller: res.verifySellerSection });
        }
      },
      onError: (err) => toast.error(`Failed: ${err.message}`),
    },
  );

  const [setStatus, { loading: settingStatus }] = useMutation<SetSellerStatusData>(
    SET_SELLER_STATUS,
    {
      refetchQueries: [{ query: GET_SELLER_USERS, variables: refetchVars }],
      onCompleted: (res) => {
        toast.success(`Status set to ${res.setSellerStatus.overallStatus}`);
        setStatusDialogSeller(null);
        if (openItem?.seller && openItem.seller.id === res.setSellerStatus.id) {
          setOpenItem({ ...openItem, seller: res.setSellerStatus });
        }
      },
      onError: (err) => toast.error(`Failed: ${err.message}`),
    },
  );

  const [removeSeller, { loading: deleting }] = useMutation<RemoveSellerData>(
    REMOVE_SELLER,
    {
      refetchQueries: [{ query: GET_SELLER_USERS, variables: refetchVars }],
      onCompleted: (res) => {
        toast.success(`"${res.removeSeller.legalName}" deleted.`);
        setDeletingSeller(null);
        setOpenItem(null);
      },
      onError: (err) => toast.error(`Delete failed: ${err.message}`),
    },
  );

  const statusForm = useForm<SetStatusValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(setStatusSchema as any) as any,
    defaultValues: { status: "VERIFIED", reason: "" },
  });

  function openStatusDialog(seller: Seller) {
    setStatusDialogSeller(seller);
    statusForm.reset({
      status: seller.overallStatus === "VERIFIED" ? "SUSPENDED" : "VERIFIED",
      reason: "",
    });
  }

  async function handleSectionToggle(
    seller: Seller,
    section: VerificationSection,
    verified: boolean,
  ) {
    await verifySection({
      variables: {
        verifySectionInput: { id: seller.id, section, verified },
      },
    });
  }

  async function onStatusSubmit(values: SetStatusValues) {
    if (!statusDialogSeller) return;
    await setStatus({
      variables: {
        setStatusInput: {
          id: statusDialogSeller.id,
          status: values.status as SellerStatus,
          reason: values.reason || undefined,
        },
      },
    });
  }

  async function confirmDelete() {
    if (!deletingSeller) return;
    await removeSeller({ variables: { id: deletingSeller.id } });
  }

  async function handleAdminVerifyEmail(userId: string) {
    if (!accessToken) {
      toast.error("Session expired. Please log in again.");
      return;
    }
    try {
      setVerifyingEmailFor(userId);
      await authApi.adminVerifyEmail(userId, accessToken);
      toast.success("Email verified");
      await refetch();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed";
      toast.error(msg);
    } finally {
      setVerifyingEmailFor(null);
    }
  }

  // -------------------------------------------------------------------------
  // Derived
  // -------------------------------------------------------------------------
  const allItems = data?.sellerUsers ?? [];
  const filtered = allItems.filter((it) => {
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    return (
      it.name.toLowerCase().includes(q) ||
      it.email.toLowerCase().includes(q) ||
      it.phone.toLowerCase().includes(q) ||
      it.seller?.legalName.toLowerCase().includes(q) ||
      it.seller?.displayName.toLowerCase().includes(q) ||
      it.seller?.panNumber.toLowerCase().includes(q) ||
      it.seller?.gstin?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <StoreIcon className="h-6 w-6 text-primary" />
          Sellers
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Full pipeline — registrations, KYC submissions, and verifications.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search name, email, phone, PAN, GSTIN..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(val) =>
            setStatusFilter(val as "all" | SellerListStatus)
          }
        >
          <SelectTrigger className="w-full sm:w-60">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {SELLER_LIST_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {SELLER_LIST_STATUS_LABEL[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border bg-card p-2 shadow-sm min-h-[400px]">
        {queryLoading && (
          <div className="space-y-3 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-14 w-full animate-pulse rounded-lg bg-muted"
              />
            ))}
          </div>
        )}

        {!queryLoading && filtered.length === 0 && (
          <div className="flex h-32 items-center justify-center text-muted-foreground">
            {searchQuery
              ? `No sellers found for "${searchQuery}"`
              : "No sellers yet."}
          </div>
        )}

        {!queryLoading && filtered.length > 0 && (
          <>
            <div className="flex items-center gap-4 px-3 py-2 mb-2 text-sm font-medium text-muted-foreground border-b uppercase pb-3">
              <div className="w-12 text-center">S.No</div>
              <div className="flex-1">Name</div>
              <div className="hidden md:block flex-1">Email</div>
              <div className="hidden md:block w-32">Type</div>
              <div className="w-36 text-center">Status</div>
              <div className="w-28 text-right">Actions</div>
            </div>

            <div className="flex flex-col gap-1 p-1">
              {filtered.map((it, idx) => {
                const hasSeller = !!it.seller;
                return (
                  <div
                    key={it.userId}
                    className="flex items-center gap-4 p-3 mb-2 bg-card border rounded-lg shadow-sm hover:bg-muted/30 transition-colors"
                  >
                    <div className="w-12 text-center text-sm text-muted-foreground font-mono">
                      {idx + 1}
                    </div>
                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => hasSeller && setOpenItem(it)}
                    >
                      <div className="font-semibold truncate">
                        {it.seller?.displayName ?? it.name}
                      </div>
                    </div>

                    <div className="hidden md:block flex-1 min-w-0 text-sm text-muted-foreground truncate">
                      {it.email}
                    </div>

                    <div className="hidden md:block w-32 text-sm text-muted-foreground capitalize">
                      {it.seller
                        ? BUSINESS_TYPE_LABELS[it.seller.businessType]
                        : "—"}
                    </div>

                    <div className="w-36 flex justify-center">
                      <Badge
                        variant={STATUS_VARIANT[it.status]}
                        className="capitalize w-full flex justify-center text-xs"
                      >
                        {SELLER_LIST_STATUS_LABEL[it.status]}
                      </Badge>
                    </div>

                    <div className="w-28 flex items-center justify-end gap-1">
                      {it.status === "REGISTERED_UNVERIFIED" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Verify email manually"
                          onClick={() => handleAdminVerifyEmail(it.userId)}
                          disabled={verifyingEmailFor === it.userId}
                        >
                          {verifyingEmailFor === it.userId ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <MailCheck className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                      {hasSeller && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="View / verify"
                            onClick={() => setOpenItem(it)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Delete"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeletingSeller(it.seller!)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t px-4 py-3 text-sm text-muted-foreground">
              Showing {filtered.length} of {allItems.length} sellers
            </div>
          </>
        )}
      </div>

      {/* ===================================================================
          DETAIL SHEET — only opens for items with a Seller record
      =================================================================== */}
      <Sheet
        open={!!openItem?.seller}
        onOpenChange={(open) => !open && setOpenItem(null)}
      >
        <SheetContent className="sm:max-w-xl w-full overflow-y-auto">
          {openItem?.seller && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  {openItem.seller.displayName}
                  <Badge
                    variant={STATUS_VARIANT[openItem.status]}
                    className="capitalize text-xs"
                  >
                    {SELLER_LIST_STATUS_LABEL[openItem.status]}
                  </Badge>
                </SheetTitle>
                <SheetDescription>
                  {openItem.seller.legalName} —{" "}
                  {BUSINESS_TYPE_LABELS[openItem.seller.businessType]}
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6 mt-6 px-6">
                {openItem.seller.rejectionReason && (
                  <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm">
                    <div className="font-semibold text-destructive">
                      Rejection / suspension reason
                    </div>
                    <div className="mt-1 text-muted-foreground">
                      {openItem.seller.rejectionReason}
                    </div>
                  </div>
                )}

                <DetailGrid seller={openItem.seller} userInfo={openItem} />

                {KYC_STATES.includes(openItem.status) && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4" />
                        KYC Verification
                      </h3>
                      <div className="space-y-2">
                        {VERIFICATION_SECTIONS.map((section) => {
                          const verifiedAt = sectionVerifiedAt(
                            openItem.seller!,
                            section,
                          );
                          const skipped =
                            section === "GSTIN" && !openItem.seller!.gstin;
                          return (
                            <div
                              key={section}
                              className="flex items-center justify-between rounded-md border bg-card p-3"
                            >
                              <div>
                                <div className="font-medium text-sm">
                                  {sectionLabel(section)}
                                  {skipped && (
                                    <span className="ml-2 text-xs text-muted-foreground">
                                      (not provided — skip)
                                    </span>
                                  )}
                                </div>
                                {verifiedAt && (
                                  <div className="text-xs text-muted-foreground mt-0.5">
                                    Verified{" "}
                                    {new Date(verifiedAt).toLocaleString()}
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant={verifiedAt ? "default" : "outline"}
                                  disabled={skipped}
                                  onClick={() =>
                                    handleSectionToggle(
                                      openItem.seller!,
                                      section,
                                      true,
                                    )
                                  }
                                >
                                  <CheckCircle2 className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant={!verifiedAt ? "default" : "outline"}
                                  disabled={skipped}
                                  onClick={() =>
                                    handleSectionToggle(
                                      openItem.seller!,
                                      section,
                                      false,
                                    )
                                  }
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reset
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-semibold mb-3">Status Override</h3>
                      <p className="text-xs text-muted-foreground mb-3">
                        Use this to mark REJECTED with a reason or SUSPEND a
                        verified seller.
                      </p>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => openStatusDialog(openItem.seller!)}
                      >
                        Override status
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* ===================================================================
          STATUS OVERRIDE DIALOG
      =================================================================== */}
      <Dialog
        open={!!statusDialogSeller}
        onOpenChange={(open) => !open && setStatusDialogSeller(null)}
      >
        <DialogContent className="sm:max-w-md focus:ring-0">
          <DialogHeader>
            <DialogTitle>Override Seller Status</DialogTitle>
            <DialogDescription>
              {statusDialogSeller && (
                <>
                  Force the status for{" "}
                  <span className="font-semibold text-foreground">
                    {statusDialogSeller.displayName}
                  </span>
                  .
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <Form {...statusForm}>
            <form
              onSubmit={statusForm.handleSubmit(onStatusSubmit)}
              className="space-y-4 pt-2"
            >
              <FormField
                control={statusForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Status</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SELLER_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s.replace(/_/g, " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={statusForm.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason (recommended)</FormLabel>
                    <FormControl>
                      <Input placeholder="Reason..." {...field} />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Required for REJECTED / SUSPENDED so the seller knows why.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStatusDialogSeller(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={settingStatus}>
                  {settingStatus && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Apply
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* ===================================================================
          DELETE DIALOG
      =================================================================== */}
      <AlertDialog
        open={!!deletingSeller}
        onOpenChange={(open) => !open && setDeletingSeller(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Seller?</AlertDialogTitle>
            <AlertDialogDescription>
              Soft-delete{" "}
              <span className="font-semibold text-foreground">
                &ldquo;{deletingSeller?.displayName}&rdquo;
              </span>
              . The record stays in the database with a deletion timestamp.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmDelete}
              disabled={deleting}
            >
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
function SectionDot({
  label,
  verified,
  disabled,
}: {
  label: string;
  verified: boolean;
  disabled?: boolean;
}) {
  const cls = disabled
    ? "bg-muted text-muted-foreground"
    : verified
      ? "bg-primary text-primary-foreground"
      : "bg-muted text-muted-foreground border border-border";
  return (
    <span
      title={`${label} ${disabled ? "skipped" : verified ? "verified" : "pending"}`}
      className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold ${cls}`}
    >
      {label}
    </span>
  );
}

function DetailGrid({
  seller,
  userInfo,
}: {
  seller: Seller;
  userInfo: SellerListItem;
}) {
  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
      <Field label="Display name" value={seller.displayName} />
      <Field label="Legal name" value={seller.legalName} />
      <Field label="PAN" value={seller.panNumber} mono />
      <Field label="GSTIN" value={seller.gstin ?? "—"} mono />
      <Field label="Business email" value={seller.businessEmail} />
      <Field label="Business phone" value={seller.businessPhone} />
      <Field label="Support email" value={seller.supportEmail ?? "—"} />
      <Field
        label="Date of incorporation"
        value={
          seller.dateOfIncorporation
            ? new Date(seller.dateOfIncorporation).toLocaleDateString()
            : "—"
        }
      />
      <Field label="Registration #" value={seller.registrationNumber ?? "—"} />
      <Field
        label="Commission %"
        value={Number(seller.commissionRate).toFixed(2)}
      />
      <Field label="Account email" value={userInfo.email} />
      <Field
        label="Email verified"
        value={
          userInfo.emailVerifiedAt
            ? new Date(userInfo.emailVerifiedAt).toLocaleDateString()
            : "Not verified"
        }
      />
      {seller.signatoryName && (
        <>
          <Field label="Signatory name" value={seller.signatoryName} />
          <Field
            label="Signatory PAN"
            value={seller.signatoryPan ?? "—"}
            mono
          />
          <Field
            label="Signatory designation"
            value={seller.signatoryDesignation ?? "—"}
          />
        </>
      )}
    </dl>
  );
}

function Field({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd
        className={`text-sm ${mono ? "font-mono" : ""} truncate`}
        title={value}
      >
        {value}
      </dd>
    </div>
  );
}

function sectionVerifiedAt(seller: Seller, section: VerificationSection) {
  switch (section) {
    case "PAN":
      return seller.panVerifiedAt;
    case "GSTIN":
      return seller.gstinVerifiedAt;
    case "BANK":
      return seller.bankVerifiedAt;
    case "DOCUMENTS":
      return seller.documentsVerifiedAt;
  }
}

function sectionLabel(section: VerificationSection) {
  switch (section) {
    case "PAN":
      return "PAN Card";
    case "GSTIN":
      return "GSTIN";
    case "BANK":
      return "Bank Account";
    case "DOCUMENTS":
      return "Other Documents";
  }
}
