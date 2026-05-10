"use client";

/**
 * /register — customer signup page (design 2).
 *
 * Posts to /auth/customer/register, which creates a User row + 1:1 Customer
 * extension and issues an email verification token. Success redirects to
 * /verify-email with the dev token preserved as a query param so the user
 * can click through without an SMTP setup.
 */

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { authApi } from "@/lib/api/auth.api";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";

const registerSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Please enter your full name." })
    .max(100, { message: "Name is too long." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
  agreeTerms: z.literal(true, {
    message: "Please accept the Terms and Privacy Policy.",
  }),
});

type RegisterValues = z.infer<typeof registerSchema>;

const VISUAL_IMAGE = "/auth/register-visual.jpg";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<RegisterValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(registerSchema as any) as any,
    defaultValues: {
      name: "",
      email: "",
      password: "",
      agreeTerms: false as unknown as true,
    },
  });

  async function onSubmit(values: RegisterValues) {
    setServerError(null);
    try {
      const res = await authApi.registerCustomer({
        name: values.name,
        email: values.email,
        password: values.password,
      });

      // Dev convenience: pass the verification token through so the next
      // page can show a clickable link until SMTP is wired up.
      const params = new URLSearchParams({ email: values.email });
      if (res.verificationToken) params.set("token", res.verificationToken);
      router.push(`/verify-email?${params.toString()}`);
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Failed to create account.",
      );
    }
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <AuthSplitLayout
      visualTitle="Join the premium experience."
      visualSubtext="Create an account to access exclusive collections, track your orders, and manage your wishlist with ease."
      imageUrl={VISUAL_IMAGE}
      showBackLink
      brand="LUXE"
    >
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-brand">
          Create an account
        </h1>
        <p className="text-sm text-foreground/60">
          Enter your details below to get started.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            Full Name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="John Doe"
            className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-brand"
            {...form.register("name")}
          />
          {form.formState.errors.name && (
            <p className="mt-1 text-xs text-destructive">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

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
            placeholder="name@example.com"
            className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-brand"
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <p className="mt-1 text-xs text-destructive">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              className="w-full rounded-md border border-input bg-background px-4 py-3 pr-11 text-sm outline-none transition focus:border-brand"
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

        <label className="flex items-start gap-2 text-sm text-foreground/70 select-none cursor-pointer">
          <input
            type="checkbox"
            className="h-4 w-4 mt-0.5 rounded border-input"
            {...form.register("agreeTerms")}
          />
          <span>
            I agree to the{" "}
            <Link
              href="/terms"
              target="_blank"
              className="font-semibold text-brand hover:underline"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              target="_blank"
              className="font-semibold text-brand hover:underline"
            >
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        {form.formState.errors.agreeTerms && (
          <p className="-mt-3 text-xs text-destructive">
            {form.formState.errors.agreeTerms.message}
          </p>
        )}

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
          {isSubmitting ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-foreground/60">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-brand hover:underline"
        >
          Log in
        </Link>
      </p>
    </AuthSplitLayout>
  );
}
