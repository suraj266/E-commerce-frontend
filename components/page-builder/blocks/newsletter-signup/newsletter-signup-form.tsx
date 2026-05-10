"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { Loader2 } from "lucide-react";
import { SUBSCRIBE_TO_NEWSLETTER } from "@/lib/graphql/newsletter";
import type { SubscribeNewsletterData } from "@/types/newsletter.types";

export interface NewsletterSubscribeFormProps {
  buttonLabel: string;
  placeholder: string;
  source: string;
  /** "centered" stacks the field; "inline" sits the email + button side-by-side. */
  layout: "centered" | "inline";
  variant: "light" | "dark";
}

/**
 * Shared form used by both newsletter signup variants. Calls the public
 * `subscribeToNewsletter` mutation and surfaces a friendly status message.
 * The mutation is intentionally idempotent server-side, so we don't need to
 * reveal whether the address was already on file.
 */
export function NewsletterSubscribeForm(props: NewsletterSubscribeFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    | { kind: "idle" }
    | { kind: "success"; text: string }
    | { kind: "error"; text: string }
  >({ kind: "idle" });

  const [subscribe, { loading }] = useMutation<SubscribeNewsletterData>(
    SUBSCRIBE_TO_NEWSLETTER,
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/.+@.+\..+/.test(trimmed)) {
      setStatus({ kind: "error", text: "Please enter a valid email address." });
      return;
    }
    try {
      const res = await subscribe({
        variables: { input: { email: trimmed, source: props.source } },
      });
      const message = res.data?.subscribeToNewsletter.message;
      const text =
        message === "already-subscribed"
          ? "You're already subscribed — thanks!"
          : message === "resubscribed"
            ? "Welcome back — you're subscribed again."
            : "Thanks! Check your inbox to confirm.";
      setStatus({ kind: "success", text });
      setEmail("");
    } catch {
      setStatus({
        kind: "error",
        text: "Something went wrong. Please try again.",
      });
    }
  }

  const fieldClass =
    props.variant === "dark"
      ? "bg-white/10 text-white placeholder:text-white/60 border-white/30 focus:border-white"
      : "bg-background text-foreground border-input focus:border-primary";

  const buttonClass =
    props.variant === "dark"
      ? "bg-white text-black hover:bg-white/90"
      : "bg-primary text-primary-foreground hover:bg-primary/90";

  const messageClass =
    status.kind === "error"
      ? props.variant === "dark"
        ? "text-amber-200"
        : "text-destructive"
      : props.variant === "dark"
        ? "text-emerald-200"
        : "text-emerald-600";

  return (
    <form
      onSubmit={onSubmit}
      className={`w-full ${
        props.layout === "inline"
          ? "flex flex-col sm:flex-row gap-2"
          : "flex flex-col gap-2 max-w-md mx-auto"
      }`}
    >
      <input
        type="email"
        required
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={props.placeholder}
        className={`flex-1 rounded-md border px-4 py-3 text-sm outline-none transition focus:ring-1 ${fieldClass}`}
      />
      <button
        type="submit"
        disabled={loading}
        className={`inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-semibold shadow transition disabled:opacity-60 ${buttonClass}`}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {props.buttonLabel}
      </button>

      {status.kind !== "idle" && (
        <p
          className={`${
            props.layout === "inline" ? "sm:basis-full" : ""
          } text-sm ${messageClass}`}
          role={status.kind === "error" ? "alert" : "status"}
        >
          {status.text}
        </p>
      )}
    </form>
  );
}
