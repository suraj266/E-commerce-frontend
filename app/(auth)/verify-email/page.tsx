"use client";

/**
 * /verify-email — generic email confirmation page.
 *
 * Two modes:
 *   1. With ?token= → POSTs the token to /auth/verify-email and shows the
 *      result. Triggered by clicking the link in the verification email.
 *   2. Without token → "Check your inbox" view shown right after register.
 *      In dev, the previous page may pass ?token= in the URL so the user
 *      can click "Verify now" before SMTP is wired up.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, MailCheck, XCircle } from "lucide-react";

import { authApi } from "@/lib/api/auth.api";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";

type Status =
  | { kind: "idle" }
  | { kind: "verifying" }
  | { kind: "success"; email: string }
  | { kind: "error"; message: string };

const VISUAL_IMAGE = "/auth/verify-visual.jpg";

export default function VerifyEmailPage() {
  const params = useSearchParams();
  const tokenInUrl = params.get("token");
  const emailHint = params.get("email");

  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState<string | null>(null);

  // Auto-verify when a token is present in the URL (clicked from email).
  // We do NOT auto-verify if the user just landed here from /register —
  // they should click the dev link explicitly so the success state isn't
  // confused with normal navigation.
  useEffect(() => {
    const auto = params.get("auto");
    if (tokenInUrl && auto === "1") {
      void verify(tokenInUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function verify(token: string) {
    setStatus({ kind: "verifying" });
    try {
      const res = await authApi.verifyEmail(token);
      setStatus({ kind: "success", email: res.email });
    } catch (err) {
      setStatus({
        kind: "error",
        message:
          err instanceof Error ? err.message : "Verification failed.",
      });
    }
  }

  async function handleResend() {
    if (!emailHint) return;
    setResending(true);
    setResendMsg(null);
    try {
      const res = await authApi.resendVerification(emailHint);
      setResendMsg(res.message);
    } catch (err) {
      setResendMsg(
        err instanceof Error ? err.message : "Could not resend the link.",
      );
    } finally {
      setResending(false);
    }
  }

  return (
    <AuthSplitLayout
      visualTitle="Almost there."
      visualSubtext="Confirm your email so we can keep your account secure and your orders synced across devices."
      imageUrl={VISUAL_IMAGE}
      showBackLink
      brand="LUXE"
    >
      {status.kind === "success" ? (
        <SuccessView email={status.email} />
      ) : status.kind === "error" ? (
        <ErrorView message={status.message} />
      ) : (
        <PendingView
          tokenInUrl={tokenInUrl}
          emailHint={emailHint}
          verifying={status.kind === "verifying"}
          resending={resending}
          resendMsg={resendMsg}
          onVerify={() => tokenInUrl && verify(tokenInUrl)}
          onResend={handleResend}
        />
      )}
    </AuthSplitLayout>
  );
}

/* -------------------------------------------------------------------------- */

function SuccessView({ email }: { email: string }) {
  return (
    <div className="space-y-6 text-center">
      <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-brand">
          Email verified
        </h1>
        <p className="mt-2 text-sm text-foreground/60">
          {email} is confirmed. You can sign in to continue.
        </p>
      </div>
      <Link
        href="/login"
        className="inline-flex w-full items-center justify-center rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-brand/90"
      >
        Continue to sign in
      </Link>
    </div>
  );
}

function ErrorView({ message }: { message: string }) {
  return (
    <div className="space-y-6 text-center">
      <XCircle className="mx-auto h-12 w-12 text-destructive" />
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-brand">
          Couldn&apos;t verify your email
        </h1>
        <p className="mt-2 text-sm text-foreground/60">{message}</p>
      </div>
      <p className="text-sm text-foreground/60">
        Need a fresh link?{" "}
        <Link
          href="/login"
          className="font-semibold text-brand hover:underline"
        >
          Sign in
        </Link>{" "}
        and request a new verification email.
      </p>
    </div>
  );
}

function PendingView({
  tokenInUrl,
  emailHint,
  verifying,
  resending,
  resendMsg,
  onVerify,
  onResend,
}: {
  tokenInUrl: string | null;
  emailHint: string | null;
  verifying: boolean;
  resending: boolean;
  resendMsg: string | null;
  onVerify: () => void;
  onResend: () => void;
}) {
  return (
    <div className="space-y-6">
      <MailCheck className="h-12 w-12 text-brand" />
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-brand">
          Check your inbox
        </h1>
        <p className="mt-2 text-sm text-foreground/60">
          {emailHint ? (
            <>
              We sent a confirmation link to{" "}
              <span className="font-medium text-foreground">{emailHint}</span>.
              Click it to activate your account.
            </>
          ) : (
            <>Click the link in your verification email to activate your account.</>
          )}
        </p>
      </div>

      {/* Dev convenience — visible only when register passed the token through. */}
      {tokenInUrl && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-3 text-xs text-amber-900">
          <p className="font-semibold mb-1">Dev shortcut</p>
          <p>
            SMTP isn&apos;t wired up yet. Click below to verify with the token
            we just issued.
          </p>
          <button
            type="button"
            onClick={onVerify}
            disabled={verifying}
            className="mt-2 inline-flex items-center justify-center rounded-md bg-feature px-3 py-1.5 text-xs font-semibold text-white shadow transition hover:bg-feature/90 disabled:opacity-60"
          >
            {verifying && <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />}
            {verifying ? "Verifying..." : "Verify now"}
          </button>
        </div>
      )}

      {emailHint && (
        <div className="rounded-md border bg-muted/30 px-4 py-3">
          <p className="text-sm text-foreground/70">
            Didn&apos;t get an email?
          </p>
          <button
            type="button"
            onClick={onResend}
            disabled={resending}
            className="mt-1 text-sm font-semibold text-brand hover:underline disabled:opacity-60"
          >
            {resending ? "Resending..." : "Resend verification link"}
          </button>
          {resendMsg && (
            <p className="mt-1 text-xs text-foreground/60">{resendMsg}</p>
          )}
        </div>
      )}

      <p className="text-sm text-foreground/60">
        Already verified?{" "}
        <Link
          href="/login"
          className="font-semibold text-brand hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
