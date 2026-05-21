"use client";

/**
 * /reset-password — apply a new password using the token from email.
 *
 * Reads `?token=` from the URL. Posts to /auth/reset-password which
 * validates token freshness (single-use, 1h TTL) and writes the new
 * argon2 hash. All active refresh tokens are revoked server-side so
 * other devices are forced to re-login.
 *
 * On success: redirect to /login with a one-time success toast via
 * the URL flash param so the layout can surface it.
 */

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@/lib/forms/zod-resolver";
import { CheckCircle2, Eye, EyeOff, Loader2, XCircle } from "lucide-react";

import { authApi } from "@/lib/api/auth.api";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";

const schema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." }),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords don't match.",
    path: ["confirm"],
  });
type Values = z.infer<typeof schema>;

const VISUAL_IMAGE = "/auth/forgot-visual.jpg";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordPageInner />
    </Suspense>
  );
}

function ResetPasswordPageInner() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirm: "" },
  });

  // Auto-redirect on success after a short delay so the user can read
  // the confirmation. Cancel on unmount in case of fast back-nav.
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => router.push("/login"), 2500);
    return () => clearTimeout(t);
  }, [done, router]);

  async function onSubmit(values: Values) {
    if (!token) return;
    setServerError(null);
    try {
      await authApi.resetPassword(token, values.password);
      setDone(true);
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Could not reset password.",
      );
    }
  }

  if (!token) {
    return (
      <AuthSplitLayout
        visualTitle="Reset link missing."
        imageUrl={VISUAL_IMAGE}
        brand="LUXE"
        showBackLink
      >
        <div className="space-y-6 text-center">
          <XCircle className="mx-auto h-12 w-12 text-destructive" />
          <h1 className="text-2xl font-semibold text-brand">
            No reset token in URL
          </h1>
          <p className="text-sm text-foreground/60">
            The link you followed didn&apos;t include a token. Request a new
            password reset to continue.
          </p>
          <Link
            href="/forgot-password"
            className="inline-flex items-center justify-center rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white shadow hover:bg-brand/90 transition"
          >
            Request a new link
          </Link>
        </div>
      </AuthSplitLayout>
    );
  }

  if (done) {
    return (
      <AuthSplitLayout
        visualTitle="Password updated."
        imageUrl={VISUAL_IMAGE}
        brand="LUXE"
      >
        <div className="space-y-6 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
          <h1 className="text-2xl font-semibold text-brand">
            Password updated
          </h1>
          <p className="text-sm text-foreground/60">
            You can now sign in with your new password. Redirecting...
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white shadow hover:bg-brand/90 transition"
          >
            Continue to sign in
          </Link>
        </div>
      </AuthSplitLayout>
    );
  }

  const submitting = form.formState.isSubmitting;

  return (
    <AuthSplitLayout
      visualTitle="Choose a new password."
      visualSubtext="Make it strong — at least 8 characters. We'll sign you out everywhere else once it's saved."
      imageUrl={VISUAL_IMAGE}
      brand="LUXE"
      showBackLink
    >
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-brand">
          New password
        </h1>
        <p className="text-sm text-foreground/60">
          Enter your new password twice to confirm.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            New password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              className="w-full rounded-md border border-input bg-muted/40 px-4 py-3 pr-11 text-sm outline-none transition focus:border-brand focus:bg-background"
              {...form.register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-foreground/50 hover:text-foreground transition"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {form.formState.errors.password && (
            <p className="mt-1 text-xs text-destructive">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="confirm"
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            Confirm password
          </label>
          <input
            id="confirm"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••"
            className="w-full rounded-md border border-input bg-muted/40 px-4 py-3 text-sm outline-none transition focus:border-brand focus:bg-background"
            {...form.register("confirm")}
          />
          {form.formState.errors.confirm && (
            <p className="mt-1 text-xs text-destructive">
              {form.formState.errors.confirm.message}
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
          {submitting ? "Updating..." : "Update password"}
        </button>
      </form>
    </AuthSplitLayout>
  );
}
