"use client";

/**
 * /login — customer login page (design 1).
 *
 * Split layout: left visual panel + right form. Email/password is wired
 * to the existing `/auth/login` endpoint; OAuth buttons render but are
 * disabled until the backend grows Google/Apple support.
 *
 * "Keep me signed in" is currently UI-only — the backend always issues a
 * standard refresh-token cookie. When we wire long-lived sessions, pass
 * this flag to the login API and let the backend decide cookie maxAge.
 */

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { authApi } from "@/lib/api/auth.api";
import { useAuthStore } from "@/store/auth.store";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
  rememberMe: z.boolean().default(false),
});

type LoginValues = z.infer<typeof loginSchema>;

const VISUAL_IMAGE = "/auth/login-visual.jpg";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageInner />
    </Suspense>
  );
}

function LoginPageInner() {
  const router = useRouter();
  const params = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<LoginValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(loginSchema as any) as any,
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  async function onSubmit(values: LoginValues) {
    setServerError(null);
    try {
      // Customer-only login surface — backend rejects admin/seller
      // credentials with a generic "Invalid credentials" error so role
      // can't be enumerated. Admins and sellers have their own pages
      // at /admin/login and /seller/login respectively.
      const res = await authApi.login({
        email: values.email,
        password: values.password,
        accountType: "customer",
      });
      setAuth(res.accessToken, res.user);

      const next = params.get("next");
      router.push(next ?? "/account");
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Failed to sign in.",
      );
    }
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <AuthSplitLayout
      visualTitle="Elevate your commerce experience."
      visualSubtext="Secure, seamless, and designed for professionals. Access your dashboard to manage operations effortlessly."
      imageUrl={VISUAL_IMAGE}
      brand=""
    >
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-brand">
          Welcome back
        </h1>
        <p className="text-sm text-foreground/60">
          Please enter your credentials to access your account.
        </p>
      </div>

      {/* ---------- OAuth row ---------- */}
      <div className="grid grid-cols-2 gap-3">
        <OAuthButton provider="google" />
        <OAuthButton provider="apple" />
      </div>

      <div className="my-6 flex items-center gap-3 text-xs text-foreground/50">
        <span className="h-px flex-1 bg-border" />
        or sign in with email
        <span className="h-px flex-1 bg-border" />
      </div>

      {/* ---------- Email + password ---------- */}
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
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-foreground"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-brand hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
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

        <label className="flex items-center gap-2 text-sm text-foreground/70 select-none cursor-pointer">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-input"
            {...form.register("rememberMe")}
          />
          Keep me signed in
        </label>

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
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-brand/90 disabled:opacity-60"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? "Signing in..." : "Sign In to Account"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-foreground/60">
        Don&apos;t have an account yet?{" "}
        <Link
          href="/register"
          className="font-semibold text-brand hover:underline"
        >
          Request Access
        </Link>
      </p>
    </AuthSplitLayout>
  );
}

/* ---------------------------------------------------------------------------
 * OAuthButton — purely cosmetic for now. Disabled with a "coming soon"
 * tooltip until backend Google/Apple sign-in lands.
 * --------------------------------------------------------------------------*/
function OAuthButton({ provider }: { provider: "google" | "apple" }) {
  const label = provider === "google" ? "Continue with Google" : "Continue with Apple";
  return (
    <button
      type="button"
      disabled
      title="Coming soon"
      className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-3 text-sm font-medium text-foreground/80 transition hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {provider === "google" ? <GoogleIcon /> : <AppleIcon />}
      <span className="hidden sm:inline">{label}</span>
      <span className="sm:hidden">
        {provider === "google" ? "Google" : "Apple"}
      </span>
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.365 1.43c0 1.14-.488 2.27-1.282 3.073-.853.864-2.244 1.534-3.36 1.448-.13-1.116.42-2.27 1.21-3.022.853-.798 2.331-1.405 3.432-1.499zM21 17.27c-.585 1.32-.86 1.91-1.61 3.07-1.05 1.62-2.53 3.64-4.36 3.66-1.62.02-2.04-1.05-4.24-1.04-2.2.01-2.66 1.06-4.28 1.04-1.83-.02-3.23-1.84-4.28-3.46C-.79 16.91-.34 9.46 3.6 7.84c1.5-.62 2.92-.97 4.16-.97 1.46 0 2.74.94 4.05.94 1.27 0 2.05-.94 3.95-.94 1.13 0 2.34.34 3.36 1.04.42.29 1.51 1.05 2.04 2.42-1.74 1.05-2.95 2.83-2.95 4.95 0 2.13 1.21 3.91 2.95 4.96-.13.39-.27.78-.42 1.13z" />
    </svg>
  );
}
