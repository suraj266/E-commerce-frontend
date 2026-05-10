"use client";

/**
 * /account/profile — customer self-serve profile editor.
 *
 * Editable: name, phone, marketing opt-in, preferred currency.
 * Read-only: email (changing email needs a separate verify-ownership
 * flow), account creation date, verification status.
 *
 * Email/password change UIs are scoped out of this sprint.
 */

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { GET_MY_PROFILE, UPDATE_MY_PROFILE } from "@/lib/graphql/account";
import {
  MyProfileData,
  UpdateMyProfileData,
} from "@/types/account.types";

const profileSchema = z.object({
  name: z.string().min(2, "Min 2 characters").max(100),
  phone: z.string().max(20).optional().or(z.literal("")),
  preferredCurrency: z
    .string()
    .length(3, "3-letter ISO code")
    .regex(/^[A-Za-z]{3}$/, "Letters only, e.g. INR / USD"),
  marketingOptIn: z.boolean(),
});
type ProfileValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { data } = useQuery<MyProfileData>(GET_MY_PROFILE, {
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
  });

  const [updateProfile] = useMutation<UpdateMyProfileData>(
    UPDATE_MY_PROFILE,
    {
      refetchQueries: [{ query: GET_MY_PROFILE }],
      onCompleted: () => toast.success("Profile updated"),
      onError: (err) => toast.error(`Update failed: ${err.message}`),
    },
  );

  const form = useForm<ProfileValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(profileSchema as any) as any,
    defaultValues: {
      name: "",
      phone: "",
      preferredCurrency: "INR",
      marketingOptIn: false,
    },
  });

  // Re-seed the form when the profile data lands. We do it explicitly via
  // useEffect rather than form `values` prop so the user's in-progress
  // edits aren't blown away by a refetch.
  const profile = data?.myProfile;
  const [seeded, setSeeded] = useState(false);
  useEffect(() => {
    if (profile && !seeded) {
      form.reset({
        name: profile.name ?? "",
        phone: profile.phone ?? "",
        preferredCurrency: profile.preferredCurrency ?? "INR",
        marketingOptIn: profile.marketingOptIn ?? false,
      });
      setSeeded(true);
    }
  }, [profile, seeded, form]);

  async function onSubmit(values: ProfileValues) {
    await updateProfile({
      variables: {
        input: {
          name: values.name,
          phone: values.phone || null,
          preferredCurrency: values.preferredCurrency.toUpperCase(),
          marketingOptIn: values.marketingOptIn,
        },
      },
    });
  }

  if (!profile) {
    return (
      <div className="rounded-lg border bg-card p-8">
        <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="mt-1 text-sm text-foreground/60">
          Update your personal information and preferences.
        </p>
      </header>

      <div className="rounded-lg border bg-card divide-y">
        {/* Read-only identity */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <ReadOnlyRow
            label="Email"
            value={profile.email}
            badge={
              profile.emailVerifiedAt
                ? { text: "Verified", tone: "ok" }
                : { text: "Unverified", tone: "warn" }
            }
          />
          <ReadOnlyRow
            label="Member since"
            value={new Date(profile.userCreatedAt).toLocaleDateString()}
          />
        </div>

        {/* Edit form */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField
              label="Full name"
              error={form.formState.errors.name?.message}
            >
              <input
                {...form.register("name")}
                className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-brand transition"
              />
            </TextField>
            <TextField
              label="Phone"
              hint="Optional. Used by sellers for delivery coordination."
              error={form.formState.errors.phone?.message}
            >
              <input
                {...form.register("phone")}
                placeholder="9XXXXXXXXX"
                className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-brand transition"
              />
            </TextField>
          </div>

          <TextField
            label="Preferred currency"
            hint="ISO 4217 code (INR, USD, EUR...). Storefront price displays use this."
            error={form.formState.errors.preferredCurrency?.message}
          >
            <input
              {...form.register("preferredCurrency")}
              maxLength={3}
              onChange={(e) =>
                form.setValue("preferredCurrency", e.target.value.toUpperCase(), {
                  shouldValidate: true,
                })
              }
              className="w-full sm:max-w-32 rounded-md border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-brand transition uppercase"
            />
          </TextField>

          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              {...form.register("marketingOptIn")}
              className="h-4 w-4 mt-0.5 rounded border-input"
            />
            <span className="text-sm">
              <span className="font-medium">Marketing emails</span>
              <span className="block text-foreground/60 text-xs mt-0.5">
                Send me promotions, new arrivals, and exclusive offers. You
                can unsubscribe any time.
              </span>
            </span>
          </label>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !form.formState.isDirty}
              className="inline-flex items-center justify-center rounded-md bg-brand text-white px-6 py-2.5 text-sm font-semibold shadow hover:bg-brand/90 transition disabled:opacity-60"
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function ReadOnlyRow({
  label,
  value,
  badge,
}: {
  label: string;
  value: string;
  badge?: { text: string; tone: "ok" | "warn" };
}) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-foreground/50 font-semibold">
        {label}
      </div>
      <div className="mt-1 flex items-center gap-2">
        <span className="text-sm text-foreground">{value}</span>
        {badge && (
          <span
            className={`text-[10px] uppercase tracking-wide font-semibold px-1.5 py-0.5 rounded ${
              badge.tone === "ok"
                ? "bg-emerald-100 text-cta"
                : "bg-amber-100 text-feature/90"
            }`}
          >
            {badge.text}
          </span>
        )}
      </div>
    </div>
  );
}

function TextField({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      {children}
      {hint && !error && (
        <p className="text-xs text-foreground/60 mt-1">{hint}</p>
      )}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}
