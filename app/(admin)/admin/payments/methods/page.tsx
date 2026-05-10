/**
 * =============================================================================
 * Admin Payment Methods — /admin/payments/methods
 * =============================================================================
 *
 * Accordion-style gateway configuration page. Each gateway (COD, Razorpay,
 * Stripe, etc.) is a card that expands to show its settings form.
 *
 * Features:
 *   - Add new gateways from available enum values
 *   - Inline-expand to edit: display name, description, credentials,
 *     processing fees, sandbox mode, payment type, instructions
 *   - Toggle enabled/disabled
 *   - Set default payment gateway
 *   - Masked credential hints (never shows secrets)
 *   - Auto-generated webhook URL (read-only, copy-to-clipboard)
 * =============================================================================
 */

"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import {
  CreditCard,
  Plus,
  Loader2,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Shield,
  ShieldOff,
  Star,
  Settings,
  ExternalLink,
} from "lucide-react";

import {
  GET_ADMIN_PAYMENT_GATEWAYS,
  CREATE_PAYMENT_GATEWAY_CONFIG,
  UPDATE_PAYMENT_GATEWAY_CONFIG,
  TOGGLE_PAYMENT_GATEWAY,
  SET_DEFAULT_PAYMENT_GATEWAY,
} from "@/lib/graphql/payments";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useSetPageTitle } from "@/components/shell/page-title-context";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface GatewayConfig {
  id: string;
  gateway: string;
  displayName: string;
  description: string | null;
  logoUrl: string | null;
  isEnabled: boolean;
  isDefault: boolean;
  displayOrder: number;
  supportedMethods: string[];
  sandboxMode: boolean;
  processingFee: number;
  processingFeeType: string;
  paymentType: string;
  instructions: string | null;
  webhookUrl: string | null;
  credentialHints: string | null;
  hasCredentials: boolean;
  createdAt: string;
  updatedAt: string;
}

const ALL_GATEWAYS = ["COD", "RAZORPAY", "STRIPE", "PHONEPE"];
const GATEWAY_LABELS: Record<string, string> = {
  COD: "Cash on Delivery",
  RAZORPAY: "Razorpay",
  STRIPE: "Stripe",
  PHONEPE: "PhonePe",
};

// Credential field definitions per gateway
const CREDENTIAL_FIELDS: Record<string, { key: string; label: string; type?: string }[]> = {
  COD: [],
  RAZORPAY: [
    { key: "keyId", label: "Key ID" },
    { key: "keySecret", label: "Key Secret", type: "password" },
    { key: "webhookSecret", label: "Webhook Secret", type: "password" },
  ],
  STRIPE: [
    { key: "publishableKey", label: "Publishable Key" },
    { key: "secretKey", label: "Secret Key", type: "password" },
    { key: "webhookSecret", label: "Webhook Secret", type: "password" },
  ],
  PHONEPE: [
    { key: "merchantId", label: "Merchant ID" },
    { key: "saltKey", label: "Salt Key", type: "password" },
    { key: "saltIndex", label: "Salt Index" },
  ],
};

// ===========================================================================
export default function PaymentMethodsPage() {
  useSetPageTitle("Payment Methods");

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Form state for expanded card
  const [editForm, setEditForm] = useState<Record<string, string | number | boolean>>({});
  const [credForm, setCredForm] = useState<Record<string, string>>({});

  // ---- Data ----
  const { data, loading, refetch } = useQuery<{ adminPaymentGateways: GatewayConfig[] }>(GET_ADMIN_PAYMENT_GATEWAYS, {
    fetchPolicy: "cache-and-network",
  });

  const gateways: GatewayConfig[] = data?.adminPaymentGateways ?? [];
  const existingGatewayNames = gateways.map((g) => g.gateway);
  const availableToAdd = ALL_GATEWAYS.filter(
    (g) => !existingGatewayNames.includes(g)
  );

  // ---- Mutations ----
  const [createConfig, { loading: creating }] = useMutation(
    CREATE_PAYMENT_GATEWAY_CONFIG,
    {
      onCompleted: () => {
        toast.success("Gateway created");
        setIsAddOpen(false);
        refetch();
      },
      onError: (err) => toast.error(err.message),
    }
  );

  const [updateConfig, { loading: updating }] = useMutation(
    UPDATE_PAYMENT_GATEWAY_CONFIG,
    {
      onCompleted: () => {
        toast.success("Gateway updated");
        refetch();
      },
      onError: (err) => toast.error(err.message),
    }
  );

  const [toggleGateway] = useMutation(TOGGLE_PAYMENT_GATEWAY, {
    onCompleted: () => {
      toast.success("Gateway toggled");
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const [setDefault] = useMutation(SET_DEFAULT_PAYMENT_GATEWAY, {
    onCompleted: () => {
      toast.success("Default gateway set");
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  // ---- Handlers ----
  function expandCard(gw: GatewayConfig) {
    if (expandedId === gw.id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(gw.id);
    setEditForm({
      displayName: gw.displayName,
      description: gw.description ?? "",
      logoUrl: gw.logoUrl ?? "",
      processingFee: gw.processingFee,
      processingFeeType: gw.processingFeeType,
      paymentType: gw.paymentType,
      sandboxMode: gw.sandboxMode,
      instructions: gw.instructions ?? "",
      displayOrder: gw.displayOrder,
    });
    setCredForm({});
  }

  async function handleAddGateway(gateway: string) {
    await createConfig({
      variables: {
        input: {
          gateway,
          displayName: GATEWAY_LABELS[gateway] ?? gateway,
          isEnabled: false,
          isDefault: false,
          displayOrder: gateways.length,
          supportedMethods: gateway === "COD" ? ["COD"] : ["CARD", "UPI", "NET_BANKING", "WALLET"],
          sandboxMode: true,
          processingFee: 0,
          processingFeeType: "FIXED",
          paymentType: gateway === "COD" ? "WEBSITE_EMBEDDED" : "WEBSITE_EMBEDDED",
        },
      },
    });
  }

  async function handleSave(gw: GatewayConfig) {
    // Build credentials JSON if any cred fields were filled
    const credFields = CREDENTIAL_FIELDS[gw.gateway] ?? [];
    let credentialsJson: string | undefined;
    if (credFields.length > 0) {
      const hasAnyCred = credFields.some((f) => credForm[f.key]?.trim());
      if (hasAnyCred) {
        const credObj: Record<string, string> = {};
        credFields.forEach((f) => {
          if (credForm[f.key]?.trim()) {
            credObj[f.key] = credForm[f.key];
          }
        });
        credentialsJson = JSON.stringify(credObj);
      }
    }

    await updateConfig({
      variables: {
        input: {
          id: gw.id,
          displayName: editForm.displayName as string,
          description: (editForm.description as string) || null,
          logoUrl: (editForm.logoUrl as string) || null,
          processingFee: Number(editForm.processingFee),
          processingFeeType: editForm.processingFeeType as string,
          paymentType: editForm.paymentType as string,
          sandboxMode: editForm.sandboxMode as boolean,
          instructions: (editForm.instructions as string) || null,
          displayOrder: Number(editForm.displayOrder),
          ...(credentialsJson ? { credentialsJson } : {}),
        },
      },
    });
  }

  async function copyToClipboard(text: string) {
    await navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    setTimeout(() => setCopiedUrl(null), 2000);
  }

  // ---- Render ----
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-primary" />
            Payment Methods
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure payment gateways for customer checkout.
          </p>
        </div>
        {availableToAdd.length > 0 && (
          <Button onClick={() => setIsAddOpen(true)} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Gateway
          </Button>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 w-full animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && gateways.length === 0 && (
        <div className="flex h-40 items-center justify-center text-muted-foreground rounded-lg border bg-card">
          No payment gateways configured. Click &quot;Add Gateway&quot; to get started.
        </div>
      )}

      {/* Gateway Cards */}
      {!loading && gateways.length > 0 && (
        <div className="space-y-3">
          {gateways.map((gw) => {
            const isExpanded = expandedId === gw.id;
            const credFields = CREDENTIAL_FIELDS[gw.gateway] ?? [];
            const hints = gw.credentialHints ? JSON.parse(gw.credentialHints) : null;

            return (
              <div
                key={gw.id}
                className="rounded-lg border bg-card shadow-sm overflow-hidden transition-all"
              >
                {/* Card Header */}
                <div className="flex items-center gap-4 px-5 py-4">
                  {/* Logo / Gateway Icon */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    {gw.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={gw.logoUrl}
                        alt={gw.displayName}
                        className="w-8 h-8 object-contain rounded"
                      />
                    ) : (
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>

                  {/* Title + subtitle */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm">{gw.displayName}</h3>
                      <Badge variant="outline" className="text-[10px]">
                        {gw.gateway}
                      </Badge>
                      {gw.isDefault && (
                        <Badge className="text-[10px] bg-amber-100 text-amber-800 hover:bg-amber-100">
                          <Star className="h-3 w-3 mr-0.5" />
                          Default
                        </Badge>
                      )}
                    </div>
                    {gw.description && (
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {gw.description}
                      </p>
                    )}
                  </div>

                  {/* Status + Toggle */}
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={gw.isEnabled ? "default" : "secondary"}
                      className="text-[10px]"
                    >
                      {gw.isEnabled ? "Active" : "Inactive"}
                    </Badge>
                    <Switch
                      checked={gw.isEnabled}
                      onCheckedChange={(val: boolean) =>
                        toggleGateway({
                          variables: { id: gw.id, enabled: val },
                        })
                      }
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => expandCard(gw)}
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <Settings className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Expanded Settings */}
                {isExpanded && (
                  <div className="border-t px-5 py-5 space-y-6 bg-muted/30">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Left Column — General */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                          General Settings
                        </h4>

                        <div className="space-y-2">
                          <Label htmlFor="displayName">Display Name</Label>
                          <Input
                            id="displayName"
                            value={editForm.displayName as string}
                            onChange={(e) =>
                              setEditForm((f) => ({
                                ...f,
                                displayName: e.target.value,
                              }))
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Input
                            id="description"
                            value={editForm.description as string}
                            onChange={(e) =>
                              setEditForm((f) => ({
                                ...f,
                                description: e.target.value,
                              }))
                            }
                            placeholder="Shown to customers on checkout"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="logoUrl">Logo URL</Label>
                          <Input
                            id="logoUrl"
                            value={editForm.logoUrl as string}
                            onChange={(e) =>
                              setEditForm((f) => ({
                                ...f,
                                logoUrl: e.target.value,
                              }))
                            }
                            placeholder="https://..."
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Processing Fee</Label>
                            <Input
                              type="number"
                              min={0}
                              step={0.01}
                              value={editForm.processingFee as number}
                              onChange={(e) =>
                                setEditForm((f) => ({
                                  ...f,
                                  processingFee: parseFloat(e.target.value) || 0,
                                }))
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Fee Type</Label>
                            <Select
                              value={editForm.processingFeeType as string}
                              onValueChange={(v) =>
                                setEditForm((f) => ({
                                  ...f,
                                  processingFeeType: v,
                                }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="FIXED">Fixed (₹)</SelectItem>
                                <SelectItem value="PERCENTAGE">
                                  Percentage (%)
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Payment Type</Label>
                            <Select
                              value={editForm.paymentType as string}
                              onValueChange={(v) =>
                                setEditForm((f) => ({ ...f, paymentType: v }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="WEBSITE_EMBEDDED">
                                  Embedded (popup)
                                </SelectItem>
                                <SelectItem value="REDIRECT">
                                  Redirect
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Display Order</Label>
                            <Input
                              type="number"
                              min={0}
                              value={editForm.displayOrder as number}
                              onChange={(e) =>
                                setEditForm((f) => ({
                                  ...f,
                                  displayOrder: parseInt(e.target.value) || 0,
                                }))
                              }
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between rounded-lg border p-3">
                          <div>
                            <p className="text-sm font-medium">Sandbox Mode</p>
                            <p className="text-xs text-muted-foreground">
                              Use test/sandbox environment
                            </p>
                          </div>
                          <Switch
                            checked={editForm.sandboxMode as boolean}
                            onCheckedChange={(val: boolean) =>
                              setEditForm((f) => ({ ...f, sandboxMode: val }))
                            }
                          />
                        </div>
                      </div>

                      {/* Right Column — Credentials + Webhook */}
                      <div className="space-y-4">
                        {credFields.length > 0 && (
                          <>
                            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                              <Shield className="h-3.5 w-3.5" />
                              API Credentials
                            </h4>

                            {/* Existing credential hints */}
                            {hints && (
                              <div className="rounded-lg border p-3 bg-muted/50 space-y-1.5">
                                <p className="text-xs font-medium text-muted-foreground">
                                  Current credentials (masked):
                                </p>
                                {Object.entries(hints).map(([key, val]) => (
                                  <div
                                    key={key}
                                    className="flex items-center gap-2 text-xs"
                                  >
                                    <span className="font-mono text-muted-foreground">
                                      {key}:
                                    </span>
                                    <span className="font-mono">
                                      {val as string}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Credential input fields */}
                            <p className="text-xs text-muted-foreground">
                              {gw.hasCredentials
                                ? "Enter new values to overwrite. Leave blank to keep existing."
                                : "Enter your API credentials below."}
                            </p>
                            {credFields.map((field) => (
                              <div key={field.key} className="space-y-2">
                                <Label htmlFor={field.key}>{field.label}</Label>
                                <Input
                                  id={field.key}
                                  type={field.type ?? "text"}
                                  value={credForm[field.key] ?? ""}
                                  onChange={(e) =>
                                    setCredForm((f) => ({
                                      ...f,
                                      [field.key]: e.target.value,
                                    }))
                                  }
                                  placeholder={
                                    gw.hasCredentials
                                      ? "Leave blank to keep current"
                                      : `Enter ${field.label}`
                                  }
                                />
                              </div>
                            ))}
                          </>
                        )}

                        {/* Webhook URL */}
                        {gw.webhookUrl && (
                          <div className="space-y-2">
                            <Label className="flex items-center gap-1.5">
                              <ExternalLink className="h-3.5 w-3.5" />
                              Webhook URL
                            </Label>
                            <div className="flex gap-2">
                              <Input
                                readOnly
                                value={gw.webhookUrl}
                                className="font-mono text-xs bg-muted"
                              />
                              <Button
                                variant="outline"
                                size="icon"
                                className="flex-shrink-0"
                                onClick={() => copyToClipboard(gw.webhookUrl!)}
                              >
                                {copiedUrl === gw.webhookUrl ? (
                                  <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Paste this URL in your {gw.gateway} dashboard → Webhooks.
                            </p>
                          </div>
                        )}

                        {/* Instructions */}
                        <div className="space-y-2">
                          <Label htmlFor="instructions">
                            Setup Instructions (admin notes)
                          </Label>
                          <Textarea
                            id="instructions"
                            rows={4}
                            value={editForm.instructions as string}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                              setEditForm((f) => ({
                                ...f,
                                instructions: e.target.value,
                              }))
                            }
                            placeholder="Internal notes about this gateway setup..."
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between border-t pt-4">
                      <div className="flex gap-2">
                        {!gw.isDefault && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setDefault({ variables: { id: gw.id } })
                            }
                          >
                            <Star className="h-3.5 w-3.5 mr-1" />
                            Set as Default
                          </Button>
                        )}
                        <Button
                          variant={gw.isEnabled ? "destructive" : "outline"}
                          size="sm"
                          onClick={() =>
                            toggleGateway({
                              variables: {
                                id: gw.id,
                                enabled: !gw.isEnabled,
                              },
                            })
                          }
                        >
                          {gw.isEnabled ? (
                            <>
                              <ShieldOff className="h-3.5 w-3.5 mr-1" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <Shield className="h-3.5 w-3.5 mr-1" />
                              Activate
                            </>
                          )}
                        </Button>
                      </div>

                      <Button
                        size="sm"
                        onClick={() => handleSave(gw)}
                        disabled={updating}
                      >
                        {updating && (
                          <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                        )}
                        Update Gateway
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Gateway Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Payment Gateway</DialogTitle>
            <DialogDescription>
              Select a gateway to add. You can configure credentials after
              creation.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 pt-2">
            {availableToAdd.map((gw) => (
              <Button
                key={gw}
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleAddGateway(gw)}
                disabled={creating}
              >
                {creating && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                <CreditCard className="mr-2 h-4 w-4" />
                {GATEWAY_LABELS[gw] ?? gw}
              </Button>
            ))}
            {availableToAdd.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                All available gateways have been added.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
