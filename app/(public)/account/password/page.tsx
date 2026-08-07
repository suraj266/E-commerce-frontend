"use client";

/**
 * /account/password — in-account password change for a logged-in customer.
 *
 * Auth is REST (not GraphQL) across this codebase — login, refresh and the
 * forgot-password reset all go through the `apiClient`, so this mirrors them
 * and posts to `POST /auth/change-password`. The backend proves ownership via
 * the CURRENT password, rotates the refresh-token cookie + returns a fresh
 * access token (this device stays signed in), and revokes every OTHER session.
 * We swap the new token into the auth store so subsequent requests keep working.
 */

import { useState } from "react";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@/lib/forms/zod-resolver";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";

import { apiClient } from "@/lib/api/client";
import { refreshAccessToken } from "@/lib/auth/refresh-manager";
import { useAuthStore } from "@/store/auth.store";

const schema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    newPassword: z.string().min(8, "At least 8 characters"),
    confirmPassword: z.string().min(1, "Re-enter your new password"),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match",
  })
  .refine((v) => v.newPassword !== v.currentPassword, {
    path: ["newPassword"],
    message: "New password must differ from the current one",
  });

type Values = z.infer<typeof schema>;

interface ChangePasswordResponse {
  accessToken: string;
  message: string;
}

export default function ChangePasswordPage() {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const setAuth = useAuthStore((s) => s.setAuth);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: Values) {
    // accessToken is memory-only; on a fresh tab it can be null until the
    // refresh cookie rehydrates it. Pull one first so the request carries a
    // valid bearer (mirrors the logout flow in AccountShell).
    const token = accessToken ?? (await refreshAccessToken());
    if (!token) {
      toast.error("Your session expired. Please sign in again.");
      return;
    }
    try {
      const res = await apiClient<ChangePasswordResponse>(
        "/auth/change-password",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
          }),
        },
      );
      // Backend rotated the cookie + minted a fresh access token for this
      // device; keep the session alive by swapping it into the store.
      if (user) setAuth(res.accessToken, user);
      toast.success(res.message || "Password updated");
      form.reset();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Couldn't update password",
      );
    }
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Password</h1>
        <p className="mt-1 text-sm text-foreground/60">
          Change your password. For your security, this signs you out of all
          other devices.
        </p>
      </header>

      <div className="rounded-lg border bg-card p-6">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 max-w-md"
        >
          <PasswordField
            label="Current password"
            autoComplete="current-password"
            register={form.register("currentPassword")}
            error={form.formState.errors.currentPassword?.message}
          />
          <PasswordField
            label="New password"
            autoComplete="new-password"
            hint="At least 8 characters."
            register={form.register("newPassword")}
            error={form.formState.errors.newPassword?.message}
          />
          <PasswordField
            label="Confirm new password"
            autoComplete="new-password"
            register={form.register("confirmPassword")}
            error={form.formState.errors.confirmPassword?.message}
          />

          <div className="pt-1">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-md bg-brand text-white px-6 py-2.5 text-sm font-semibold shadow hover:bg-brand/90 transition disabled:opacity-60"
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ShieldCheck className="mr-2 h-4 w-4" />
              )}
              Update password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function PasswordField({
  label,
  hint,
  error,
  autoComplete,
  register,
}: {
  label: string;
  hint?: string;
  error?: string;
  autoComplete?: string;
  register: UseFormRegisterReturn;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          autoComplete={autoComplete}
          {...register}
          className="w-full rounded-md border border-input bg-background px-4 py-2.5 pr-11 text-sm outline-none focus:border-brand transition"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-foreground/50 hover:text-foreground/80 transition"
          aria-label={show ? "Hide password" : "Show password"}
          tabIndex={-1}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {hint && !error && (
        <p className="text-xs text-foreground/60 mt-1">{hint}</p>
      )}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}
