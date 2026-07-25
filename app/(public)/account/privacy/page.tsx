"use client";

/**
 * /account/privacy — DPDP Act 2023 data-subject rights (P3-07).
 *
 * Three self-serve controls for the signed-in customer:
 *   1. Marketing consent — an explicit, fail-closed opt-in toggle. Every change
 *      is recorded immutably server-side (append-only consent ledger).
 *   2. Data export — request a portable copy of your data; the backend emails a
 *      signed, time-limited download link when the bundle is ready.
 *   3. Account deletion (erasure) — request deletion. To comply with the 7-year
 *      GST retention mandate, "deletion" anonymizes your identity after a
 *      cooling-off window (order/invoice/tax records are retained by law). The
 *      request can be cancelled any time before it runs.
 *
 * Client component matching the other /account/* pages (Apollo hooks + sonner).
 * Auth-gated by the shared AccountShell via the account layout.
 */

import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { toast } from "sonner";
import {
  AlertTriangle,
  Clock,
  Download,
  Loader2,
  Mail,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import {
  CANCEL_MY_ACCOUNT_DELETION,
  MY_ACCOUNT_DELETION,
  MY_DATA_EXPORTS,
  MY_MARKETING_CONSENT,
  REQUEST_MY_ACCOUNT_DELETION,
  REQUEST_MY_DATA_EXPORT,
  UPDATE_MY_MARKETING_CONSENT,
} from "@/lib/graphql/privacy";

/* --------------------------------- types ---------------------------------- */

type DataExportStatus =
  | "PENDING"
  | "PROCESSING"
  | "READY"
  | "EXPIRED"
  | "FAILED";

interface DataExportRequest {
  id: string;
  status: DataExportStatus;
  fileUrl?: string | null;
  expiresAt?: string | null;
  requestedAt: string;
  completedAt?: string | null;
  createdAt: string;
}

type DeletionStatus = "PENDING" | "GRACE" | "ANONYMIZED" | "CANCELLED";

interface AccountDeletionRequest {
  id: string;
  status: DeletionStatus;
  requestedAt: string;
  executeAfter: string;
  anonymizedAt?: string | null;
  cancelledAt?: string | null;
}

interface MyMarketingConsentData {
  myMarketingConsent: { granted: boolean };
}
interface MyDataExportsData {
  myDataExports: DataExportRequest[];
}
interface MyAccountDeletionData {
  myAccountDeletion: AccountDeletionRequest | null;
}

/* --------------------------------- page ----------------------------------- */

export default function PrivacyPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Privacy &amp; data</h1>
        <p className="mt-1 text-sm text-foreground/60">
          Manage your marketing preferences, download a copy of your data, or
          request deletion of your account.
        </p>
      </header>

      <MarketingConsentCard />
      <DataExportCard />
      <AccountDeletionCard />
    </div>
  );
}

/* --------------------------- marketing consent ---------------------------- */

function MarketingConsentCard() {
  const { data, loading } = useQuery<MyMarketingConsentData>(
    MY_MARKETING_CONSENT,
    { fetchPolicy: "cache-and-network", errorPolicy: "all" },
  );
  const [update, { loading: saving }] = useMutation(
    UPDATE_MY_MARKETING_CONSENT,
    {
      refetchQueries: [{ query: MY_MARKETING_CONSENT }],
      onError: (err) => toast.error(`Could not update: ${err.message}`),
    },
  );

  const granted = data?.myMarketingConsent?.granted ?? false;

  async function toggle(next: boolean) {
    try {
      await update({ variables: { input: { granted: next } } });
      toast.success(
        next
          ? "You're opted in to marketing emails."
          : "You've opted out of marketing emails.",
      );
    } catch {
      /* onError already surfaced a toast */
    }
  }

  return (
    <Card
      icon={Mail}
      title="Marketing emails"
      description="Promotions, new arrivals, and offers. We only send these with your explicit consent, and you can withdraw it any time."
    >
      <label className="flex items-start gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={granted}
          disabled={loading || saving}
          onChange={(e) => toggle(e.target.checked)}
          className="h-4 w-4 mt-0.5 rounded border-input"
        />
        <span className="text-sm">
          <span className="font-medium">
            Send me marketing emails
          </span>
          <span className="block text-foreground/60 text-xs mt-0.5">
            {granted
              ? "Consent granted. Uncheck to withdraw."
              : "Consent not granted. We will not send you marketing emails."}
          </span>
        </span>
        {(loading || saving) && (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </label>
    </Card>
  );
}

/* ------------------------------ data export ------------------------------- */

function DataExportCard() {
  const { data, loading } = useQuery<MyDataExportsData>(MY_DATA_EXPORTS, {
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
  });
  const [request, { loading: requesting }] = useMutation(
    REQUEST_MY_DATA_EXPORT,
    {
      refetchQueries: [{ query: MY_DATA_EXPORTS }],
      onCompleted: () =>
        toast.success(
          "Export requested. We'll email you a download link when it's ready.",
        ),
      onError: (err) => toast.error(`Request failed: ${err.message}`),
    },
  );

  const exports = data?.myDataExports ?? [];

  return (
    <Card
      icon={Download}
      title="Download your data"
      description="Request a portable copy of your personal data. We'll email a secure, time-limited download link once it's prepared."
    >
      <button
        type="button"
        onClick={() => request()}
        disabled={requesting}
        className="inline-flex items-center justify-center rounded-md bg-brand text-white px-5 py-2.5 text-sm font-semibold shadow hover:bg-brand/90 transition disabled:opacity-60"
      >
        {requesting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Request data export
      </button>

      {loading && !data ? (
        <p className="mt-4 text-sm text-foreground/50">Loading…</p>
      ) : exports.length > 0 ? (
        <ul className="mt-4 divide-y rounded-md border">
          {exports.map((e) => (
            <li
              key={e.id}
              className="flex items-center justify-between gap-3 px-4 py-3 text-sm"
            >
              <div>
                <div className="flex items-center gap-2">
                  <ExportStatusBadge status={e.status} />
                  <span className="text-foreground/60 text-xs">
                    {new Date(e.requestedAt).toLocaleString()}
                  </span>
                </div>
                {e.status === "READY" && e.expiresAt && (
                  <p className="text-xs text-foreground/50 mt-1">
                    Link expires {new Date(e.expiresAt).toLocaleString()}
                  </p>
                )}
              </div>
              {e.status === "READY" && e.fileUrl ? (
                <a
                  href={e.fileUrl}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="h-4 w-4" />
                  Download
                </a>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-foreground/50">
          You have no export requests yet.
        </p>
      )}
    </Card>
  );
}

/* ---------------------------- account deletion ---------------------------- */

function AccountDeletionCard() {
  const { data, loading } = useQuery<MyAccountDeletionData>(
    MY_ACCOUNT_DELETION,
    { fetchPolicy: "cache-and-network", errorPolicy: "all" },
  );
  const [confirming, setConfirming] = useState(false);

  const [request, { loading: requesting }] = useMutation(
    REQUEST_MY_ACCOUNT_DELETION,
    {
      refetchQueries: [{ query: MY_ACCOUNT_DELETION }],
      onCompleted: () => {
        setConfirming(false);
        toast.success("Account deletion scheduled.");
      },
      onError: (err) => toast.error(`Request failed: ${err.message}`),
    },
  );

  const [cancel, { loading: cancelling }] = useMutation(
    CANCEL_MY_ACCOUNT_DELETION,
    {
      refetchQueries: [{ query: MY_ACCOUNT_DELETION }],
      onCompleted: () => toast.success("Deletion cancelled."),
      onError: (err) => toast.error(`Cancel failed: ${err.message}`),
    },
  );

  const deletion = data?.myAccountDeletion ?? null;
  const isScheduled = deletion?.status === "GRACE";
  const isAnonymized = deletion?.status === "ANONYMIZED";

  return (
    <Card
      icon={Trash2}
      title="Delete your account"
      description="Request permanent deletion of your account."
      tone="danger"
    >
      <div className="rounded-md border border-amber-300/60 bg-amber-50/60 p-3 text-xs text-feature/90 flex gap-2">
        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
        <p>
          To meet legal tax-record retention requirements, deletion{" "}
          <strong>anonymizes</strong> your identity after a cooling-off period.
          Your order, invoice, and tax records are retained by law but are no
          longer linked to your personal details. This cannot be undone once it
          runs.
        </p>
      </div>

      {loading && !data ? (
        <p className="mt-4 text-sm text-foreground/50">Loading…</p>
      ) : isAnonymized ? (
        <p className="mt-4 text-sm text-foreground/70">
          This account was anonymized on{" "}
          {deletion?.anonymizedAt
            ? new Date(deletion.anonymizedAt).toLocaleDateString()
            : "—"}
          .
        </p>
      ) : isScheduled ? (
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-2 text-sm text-foreground/80">
            <Clock className="h-4 w-4 text-amber-500" />
            <span>
              Scheduled to run on{" "}
              <strong>
                {new Date(deletion!.executeAfter).toLocaleDateString()}
              </strong>
              . You can cancel until then.
            </span>
          </div>
          <button
            type="button"
            onClick={() => cancel()}
            disabled={cancelling}
            className="inline-flex items-center justify-center rounded-md border px-5 py-2.5 text-sm font-semibold text-foreground/80 hover:border-foreground/40 transition disabled:opacity-60"
          >
            {cancelling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Cancel deletion request
          </button>
        </div>
      ) : confirming ? (
        <div className="mt-4 space-y-3">
          <p className="text-sm font-medium text-foreground">
            Are you sure? This will schedule your account for anonymization.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => request()}
              disabled={requesting}
              className="inline-flex items-center justify-center rounded-md bg-destructive text-white px-5 py-2.5 text-sm font-semibold shadow hover:bg-destructive/90 transition disabled:opacity-60"
            >
              {requesting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Yes, delete my account
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              disabled={requesting}
              className="inline-flex items-center justify-center rounded-md border px-5 py-2.5 text-sm font-semibold text-foreground/80 hover:border-foreground/40 transition"
            >
              Keep my account
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="inline-flex items-center justify-center rounded-md border border-destructive/40 text-destructive px-5 py-2.5 text-sm font-semibold hover:bg-destructive/5 transition"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Request account deletion
          </button>
        </div>
      )}
    </Card>
  );
}

/* -------------------------------- helpers --------------------------------- */

function Card({
  icon: Icon,
  title,
  description,
  tone = "default",
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  tone?: "default" | "danger";
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border bg-card p-6">
      <div className="flex items-start gap-3">
        <div
          className={`rounded-md p-2 ${
            tone === "danger"
              ? "bg-destructive/10 text-destructive"
              : "bg-brand/10 text-brand"
          }`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h2 className="text-base font-semibold">{title}</h2>
          <p className="text-sm text-foreground/60 mt-0.5">{description}</p>
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function ExportStatusBadge({ status }: { status: DataExportStatus }) {
  const map: Record<DataExportStatus, { label: string; cls: string }> = {
    PENDING: { label: "Pending", cls: "bg-muted text-foreground/60" },
    PROCESSING: { label: "Processing", cls: "bg-amber-100 text-feature/90" },
    READY: { label: "Ready", cls: "bg-emerald-100 text-cta" },
    EXPIRED: { label: "Expired", cls: "bg-muted text-foreground/50" },
    FAILED: { label: "Failed", cls: "bg-red-100 text-destructive" },
  };
  const { label, cls } = map[status];
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wide font-semibold px-1.5 py-0.5 rounded ${cls}`}
    >
      {status === "READY" && <ShieldCheck className="h-3 w-3" />}
      {label}
    </span>
  );
}
