/**
 * Admin → Settings → Email — SMTP credentials + send-test.
 *
 * Password field is special: blank means "leave existing alone" (the backend
 * preserves it on empty input). `hasPassword` from the read query drives
 * placeholder + helper text so admin knows whether one is on file.
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery } from "@apollo/client/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  CheckCircle2,
  ExternalLink,
  Loader2,
  Mail,
  Send,
  ShieldAlert,
} from "lucide-react";

import {
  GET_EMAIL_SETTING,
  SEND_TEST_EMAIL,
  UPDATE_EMAIL_SETTING,
} from "@/lib/graphql/email";
import {
  EMAIL_ENCRYPTIONS,
  EMAIL_MAILERS,
  type GetEmailSettingData,
  type SendTestEmailData,
  type UpdateEmailSettingData,
} from "@/types/email.types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSetPageTitle } from "@/components/shell/page-title-context";

const schema = z.object({
  mailer: z.enum(EMAIL_MAILERS),
  host: z.string().min(1, "Host is required"),
  port: z.coerce.number().int().min(1).max(65535),
  username: z.string().min(1, "Username is required"),
  password: z.string().optional(),
  encryption: z.enum(EMAIL_ENCRYPTIONS),
  senderName: z.string().min(1, "Sender name is required"),
  senderEmail: z.string().email("Must be a valid email"),
  localDomain: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

export default function EmailSettingsPage() {
  useSetPageTitle("Email");

  const { data, loading, refetch } = useQuery<GetEmailSettingData>(
    GET_EMAIL_SETTING,
    { fetchPolicy: "cache-and-network" },
  );

  const setting = data?.emailSetting;

  const [updateSetting, { loading: saving }] =
    useMutation<UpdateEmailSettingData>(UPDATE_EMAIL_SETTING, {
      refetchQueries: [{ query: GET_EMAIL_SETTING }],
      onCompleted: () => toast.success("Email settings saved."),
      onError: (err) => toast.error(`Save failed: ${err.message}`),
    });

  const form = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any) as any,
    defaultValues: {
      mailer: "SMTP",
      host: "",
      port: 587,
      username: "",
      password: "",
      encryption: "TLS",
      senderName: "",
      senderEmail: "",
      localDomain: "",
    },
  });

  // Re-seed form when server data lands
  useEffect(() => {
    if (!setting) return;
    form.reset({
      mailer: setting.mailer,
      host: setting.host,
      port: setting.port,
      username: setting.username,
      password: "",
      encryption: setting.encryption,
      senderName: setting.senderName,
      senderEmail: setting.senderEmail,
      localDomain: setting.localDomain ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setting?.id, setting?.updatedAt]);

  async function onSubmit(values: FormValues) {
    await updateSetting({
      variables: {
        input: {
          mailer: values.mailer,
          host: values.host,
          port: values.port,
          username: values.username,
          // empty string = preserve existing
          password: values.password && values.password.length > 0
            ? values.password
            : undefined,
          encryption: values.encryption,
          senderName: values.senderName,
          senderEmail: values.senderEmail,
          localDomain: values.localDomain || undefined,
        },
      },
    });
    // Clear the password field after save so it stays empty (preserve mode)
    form.setValue("password", "");
    refetch();
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Mail className="h-6 w-6 text-primary" />
            Email
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            SMTP credentials and per-event templates. Configure once;
            transactional email flows pick this up automatically.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/settings/email/templates">
            Manage templates
            <ExternalLink className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Status banner */}
      {!loading && setting && (
        <div
          className={`flex items-center gap-3 rounded-lg border p-3 text-sm ${
            setting.isConfigured
              ? "border-emerald-300 bg-emerald-50 text-emerald-900"
              : "border-amber-300 bg-amber-50 text-amber-900"
          }`}
        >
          {setting.isConfigured ? (
            <CheckCircle2 className="h-5 w-5 shrink-0" />
          ) : (
            <ShieldAlert className="h-5 w-5 shrink-0" />
          )}
          <div className="flex-1">
            {setting.isConfigured ? (
              <>
                <span className="font-medium">SMTP configured.</span> Emails
                will be sent via {setting.host}:{setting.port}.
              </>
            ) : (
              <>
                <span className="font-medium">SMTP not yet configured.</span>{" "}
                Fill in host, username, password, and sender to start sending
                transactional email.
              </>
            )}
          </div>
        </div>
      )}

      {loading && !setting && (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-12 w-full animate-pulse rounded-lg bg-muted"
            />
          ))}
        </div>
      )}

      {setting && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 rounded-lg border bg-card p-6 shadow-sm"
          >
            <FormField
              control={form.control}
              name="mailer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mailer</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {EMAIL_MAILERS.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="host"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Host</FormLabel>
                    <FormControl>
                      <Input placeholder="smtp.example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="port"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Port</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={65535}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="encryption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Encryption</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="TLS">TLS / STARTTLS (port 587)</SelectItem>
                      <SelectItem value="SSL">SSL (port 465)</SelectItem>
                      <SelectItem value="NONE">None (insecure, port 25)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="no-reply@yourdomain.com"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={
                        setting.hasPassword
                          ? "•••••••• (leave blank to keep existing)"
                          : "Enter SMTP password"
                      }
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Stored AES-256-GCM encrypted. Plain text never returned.
                    Leave blank when saving other fields to preserve the existing password.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="localDomain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Local domain (optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="mail.yourdomain.com"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    EHLO/HELO hostname presented to the SMTP server. Most
                    providers don&apos;t need this.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="senderName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sender name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Store" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="senderEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sender email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="no-reply@yourdomain.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center justify-between gap-3 pt-3 border-t">
              <SendTestButton disabled={!setting.isConfigured} />
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save settings
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Send-test dialog
// ---------------------------------------------------------------------------
function SendTestButton({ disabled }: { disabled: boolean }) {
  const [open, setOpen] = useState(false);
  const [to, setTo] = useState("");
  const [sendTest, { loading }] = useMutation<SendTestEmailData>(
    SEND_TEST_EMAIL,
    {
      onCompleted: (res) => {
        if (res.sendTestEmail.success) {
          toast.success(res.sendTestEmail.message ?? "Test email sent.");
          setOpen(false);
          setTo("");
        } else {
          toast.error(res.sendTestEmail.message ?? "Failed to send.");
        }
      },
      onError: (err) => toast.error(err.message),
    },
  );

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => setOpen(true)}
        disabled={disabled}
      >
        <Send className="mr-2 h-4 w-4" />
        Send test email
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send test email</DialogTitle>
            <DialogDescription>
              We&apos;ll send a plain message using the saved SMTP credentials.
              Save your settings first if you just changed them.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Input
              type="email"
              placeholder="recipient@example.com"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Tip: send to your own email first, and check the spam folder if
              it doesn&apos;t arrive.
            </p>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() =>
                sendTest({ variables: { input: { to } } })
              }
              disabled={loading || !to}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Badge
                variant="secondary"
                className="mr-2 text-[10px] hidden sm:inline-flex"
              >
                SMTP
              </Badge>
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
