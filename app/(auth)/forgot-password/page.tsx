"use client";

/**
 * /forgot-password — request a password reset link.
 *
 * Posts to /auth/request-password-reset, which always returns a generic
 * "if the email exists, we sent a link" message regardless of whether
 * the email matched a real account (avoids account enumeration).
 *
 * In dev the response includes `resetToken` + `resetUrl` so we can
 * render a click-through link until SMTP is wired up.
 */

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, KeyRound, Loader2, MailCheck } from "lucide-react";

import { authApi } from "@/lib/api/auth.api";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";

const schema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
});
type Values = z.infer<typeof schema>;

const VISUAL_IMAGE = "/auth/forgot-visual.jpg";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState<{
    email: string;
    resetUrl?: string;
  } | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<Values>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any) as any,
    defaultValues: { email: "" },
  });

  async function onSubmit(values: Values) {
    setServerError(null);
    try {
      const res = await authApi.requestPasswordReset(values.email);
      setSent({ email: values.email, resetUrl: res.resetUrl });
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Could not send reset link.",
      );
    }
  }

  return (
    <AuthSplitLayout
      visualTitle="Reset your password."
      visualSubtext="We'll email you a secure link. The link expires in an hour for safety."
      imageUrl={VISUAL_IMAGE}
      showBackLink
      brand="LUXE"
    >
      {sent ? (
        <SentView email={sent.email} resetUrl={sent.resetUrl} />
      ) : (
        <FormView
          form={form}
          onSubmit={onSubmit}
          serverError={serverError}
        />
      )}
    </AuthSplitLayout>
  );
}

function FormView({
  form,
  onSubmit,
  serverError,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  onSubmit: (v: Values) => Promise<void>;
  serverError: string | null;
}) {
  const submitting = form.formState.isSubmitting;
  return (
    <>
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-brand">
          Forgot password?
        </h1>
        <p className="text-sm text-foreground/60">
          Enter the email tied to your account. We&apos;ll send a link to set
          a new password.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="name@company.com"
            className="w-full rounded-md border border-input bg-muted/40 px-4 py-3 text-sm outline-none transition focus:border-brand focus:bg-background"
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <p className="mt-1 text-xs text-destructive">
              {form.formState.errors.email.message as string}
            </p>
          )}
        </div>

        {serverError && (
          <div
            role="alert"
            className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {serverError}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full inline-flex items-center justify-center rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-brand/90 disabled:opacity-60"
        >
          {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitting ? "Sending..." : "Send reset link"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-foreground/60">
        <Link
          href="/login"
          className="inline-flex items-center font-semibold text-brand hover:underline"
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back to sign in
        </Link>
      </p>
    </>
  );
}

function SentView({
  email,
  resetUrl,
}: {
  email: string;
  resetUrl?: string;
}) {
  return (
    <div className="space-y-6">
      <MailCheck className="h-12 w-12 text-brand" />
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-brand">
          Check your inbox
        </h1>
        <p className="mt-2 text-sm text-foreground/60">
          If <span className="font-medium text-foreground">{email}</span> is
          tied to an account, we&apos;ve sent a password reset link there.
          The link expires in one hour.
        </p>
      </div>

      {resetUrl && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-3 text-xs text-amber-900">
          <p className="font-semibold mb-1">Dev shortcut</p>
          <p>SMTP isn&apos;t wired up yet. Use this link to continue:</p>
          <Link
            href={resetUrl.replace(/^https?:\/\/[^/]+/, "")}
            className="mt-2 inline-flex items-center justify-center gap-1 rounded-md bg-feature px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-feature/90 transition"
          >
            <KeyRound className="h-3 w-3" />
            Open reset link
          </Link>
        </div>
      )}

      <p className="text-sm text-foreground/60">
        <Link
          href="/login"
          className="inline-flex items-center font-semibold text-brand hover:underline"
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
