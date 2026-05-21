/**
 * Template editor — /admin/settings/email/templates/[id]
 *
 * Three columns at desktop (stacks on mobile):
 *   - Left: name + description + subject + HTML body textarea + textBody
 *   - Middle: variable picker chips (click to insert) + meta info
 *   - Right: live preview pane (sandboxed iframe — never run scripts)
 *
 * The preview renders the textarea contents through a tiny client-side
 * Handlebars-ish substitution (we keep it simple: `{{var}}` → sample value).
 * The actual server-side render uses Handlebars with the production values
 * at send time, so this preview is a "sketch" not a perfect rendering.
 */

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@/lib/forms/zod-resolver";
import { toast } from "sonner";
import {
  ArrowLeft,
  Loader2,
  Lock,
  Mail,
  Send,
  Sparkles,
} from "lucide-react";

import {
  GET_EMAIL_TEMPLATE,
  SEND_TEST_EMAIL,
  UPDATE_EMAIL_TEMPLATE,
} from "@/lib/graphql/email";
import {
  CATEGORY_LABEL,
  type GetEmailTemplateData,
  type SendTestEmailData,
  type UpdateEmailTemplateData,
} from "@/types/email.types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSetPageTitle } from "@/components/shell/page-title-context";

const schema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().max(500),
  subject: z.string().max(255),
  htmlBody: z.string().min(1, "HTML body cannot be empty"),
  textBody: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

/** Sample values used for the live preview render. */
const SAMPLE_CONTEXT: Record<string, string> = {
  customerName: "Aarav Sharma",
  sellerName: "Acme Crafts",
  shopName: "Trueway",
  orderNumber: "ORD-2026-05-AB12CD",
  totalAmount: "₹2,499",
  subtotal: "₹2,099",
  itemCount: "3",
  trackingNumber: "DEL1234567IN",
  trackingLink: "https://example.com/track/DEL1234567IN",
  resetLink: "https://example.com/reset?token=preview",
  verificationLink: "https://example.com/verify?token=preview",
  orderLink: "https://example.com/account/orders/ORD-2026-05-AB12CD",
  dashboardLink: "https://example.com/seller/dashboard",
  reviewLink: "https://example.com/admin/sellers/abc123",
  unsubscribeLink: "https://example.com/newsletter/unsubscribe",
  refundAmount: "₹2,499",
  payoutAmount: "₹14,250",
  periodLabel: "May 1 – May 7, 2026",
  cancellationReason: "Out of stock at the seller's warehouse.",
  rejectionReason: "PAN document was unreadable. Please re-upload.",
  sellerEmail: "seller@example.com",
  businessType: "Sole Proprietorship",
  senderName: "Jane Doe",
  messageSubject: "Question about your products",
  messageBody: "Hi, I love your store. Do you ship to Mumbai?",
};

/** Crude client-side Handlebars-ish renderer for the preview pane only. */
function previewRender(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_m, key) =>
    vars[key] !== undefined ? vars[key] : `[${key}]`,
  );
}

export default function EmailTemplateEditorPage() {
  useSetPageTitle("Edit Template");
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { data, loading } = useQuery<GetEmailTemplateData>(GET_EMAIL_TEMPLATE, {
    variables: { id },
    fetchPolicy: "cache-and-network",
  });

  const template = data?.emailTemplate;

  const [updateTemplate, { loading: saving }] =
    useMutation<UpdateEmailTemplateData>(UPDATE_EMAIL_TEMPLATE, {
      refetchQueries: [{ query: GET_EMAIL_TEMPLATE, variables: { id } }],
      onCompleted: () => toast.success("Template saved."),
      onError: (err) => toast.error(`Save failed: ${err.message}`),
    });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      subject: "",
      htmlBody: "",
      textBody: "",
    },
  });

  // Re-seed when the data lands
  useEffect(() => {
    if (!template) return;
    form.reset({
      name: template.name,
      description: template.description,
      subject: template.subject,
      htmlBody: template.htmlBody,
      textBody: template.textBody ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template?.id, template?.updatedAt]);

  // ref to the textarea so we can insert variables at the cursor
  const htmlRef = useRef<HTMLTextAreaElement | null>(null);

  function insertVariable(variable: string) {
    const ta = htmlRef.current;
    const tag = `{{${variable}}}`;
    if (!ta) {
      // Fallback — append
      const current = form.getValues("htmlBody");
      form.setValue("htmlBody", current + tag, { shouldDirty: true });
      return;
    }
    const start = ta.selectionStart ?? ta.value.length;
    const end = ta.selectionEnd ?? ta.value.length;
    const next =
      ta.value.slice(0, start) + tag + ta.value.slice(end);
    form.setValue("htmlBody", next, { shouldDirty: true });
    // Restore caret after the inserted tag
    requestAnimationFrame(() => {
      ta.focus();
      const pos = start + tag.length;
      ta.setSelectionRange(pos, pos);
    });
  }

  async function onSubmit(values: FormValues) {
    if (!template) return;
    await updateTemplate({
      variables: {
        input: {
          id: template.id,
          name: values.name,
          description: values.description,
          subject: values.subject,
          htmlBody: values.htmlBody,
          textBody: values.textBody || undefined,
        },
      },
    });
  }

  // Live preview from current form values
  const watchedHtml = form.watch("htmlBody");
  const watchedSubject = form.watch("subject");
  const previewHtml = useMemo(
    () => previewRender(watchedHtml || "", SAMPLE_CONTEXT),
    [watchedHtml],
  );
  const previewSubject = useMemo(
    () => previewRender(watchedSubject || "", SAMPLE_CONTEXT),
    [watchedSubject],
  );

  if (loading && !template) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-12 w-full animate-pulse rounded-lg bg-muted"
          />
        ))}
      </div>
    );
  }
  if (!template) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
        Template not found.{" "}
        <Link
          href="/admin/settings/email/templates"
          className="underline hover:text-foreground"
        >
          Back to templates
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <Link
              href="/admin/settings/email/templates"
              className="hover:underline flex items-center"
            >
              <ArrowLeft className="mr-1 h-3 w-3" />
              All templates
            </Link>
          </div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Mail className="h-6 w-6 text-primary" />
            {template.name}
            {template.isSystem && (
              <Badge variant="default" className="text-[10px] gap-1">
                <Lock className="h-3 w-3" />
                System
              </Badge>
            )}
            <Badge variant="outline" className="text-[10px]">
              {CATEGORY_LABEL[template.category]}
            </Badge>
          </h1>
          <p className="text-xs text-muted-foreground font-mono mt-1">
            {template.key}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SendTestButton templateKey={template.key} />
          <Button onClick={form.handleSubmit(onSubmit)} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* ---- Left: Form fields ---- */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-lg border bg-card p-5 shadow-sm space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Internal label shown in the templates list.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Order #{{orderNumber}} confirmed"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Variables wrapped in <code>{`{{like_this}}`}</code> are
                      interpolated at send time.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="rounded-lg border bg-card p-5 shadow-sm space-y-4">
              <FormField
                control={form.control}
                name="htmlBody"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>HTML body</FormLabel>
                      <span className="text-[10px] text-muted-foreground">
                        Wrapped automatically with the global header + footer
                        partials.
                      </span>
                    </div>
                    <FormControl>
                      <Textarea
                        ref={(node) => {
                          htmlRef.current = node;
                          field.ref(node);
                        }}
                        rows={18}
                        spellCheck={false}
                        className="font-mono text-xs resize-y"
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="textBody"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plain-text fallback (optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={5}
                        spellCheck={false}
                        className="font-mono text-xs resize-y"
                        placeholder="Leave blank to auto-generate from HTML."
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Sent as a backup for clients that prefer plain text. Auto-stripped
                      from HTML if empty.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* ---- Right: Variables + Preview ---- */}
          <div className="space-y-4">
            <div className="rounded-lg border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Variables
                </h3>
                <span className="text-[10px] text-muted-foreground">
                  Click to insert
                </span>
              </div>
              {template.variables.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  This template doesn&apos;t declare variables.
                </p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {template.variables.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => insertVariable(v)}
                      className="rounded-md border bg-background px-2 py-1 text-[11px] font-mono hover:bg-muted/40 transition"
                      title={`Insert {{${v}}}`}
                    >
                      {`{{${v}}}`}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-lg border bg-card p-5 shadow-sm">
              <h3 className="font-semibold text-sm mb-3">Preview</h3>
              <div className="rounded-md border bg-muted/30 p-3 mb-3">
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  Subject
                </div>
                <div className="text-sm font-medium">
                  {previewSubject || (
                    <span className="italic text-muted-foreground">
                      (no subject)
                    </span>
                  )}
                </div>
              </div>
              <div className="rounded-md border overflow-hidden bg-white">
                <iframe
                  title="Email preview"
                  // sandbox prevents inline scripts from running in preview
                  sandbox=""
                  srcDoc={previewHtml}
                  className="w-full h-[420px] border-0 bg-white"
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">
                Sample variable values are used for preview. The real send
                applies your context via Handlebars on the server. Header +
                footer partials are NOT shown in this preview — only the body
                you&apos;re editing.
              </p>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

// ---------------------------------------------------------------------------
function SendTestButton({ templateKey }: { templateKey: string }) {
  const [open, setOpen] = useState(false);
  const [to, setTo] = useState("");
  const [sendTest, { loading }] = useMutation<SendTestEmailData>(
    SEND_TEST_EMAIL,
    {
      onCompleted: (res) => {
        if (res.sendTestEmail.success) {
          toast.success(res.sendTestEmail.message ?? "Test sent.");
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
        size="sm"
        onClick={() => setOpen(true)}
      >
        <Send className="mr-1 h-4 w-4" />
        Send test
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send test of this template</DialogTitle>
            <DialogDescription>
              Renders the saved version of this template (not your unsaved
              edits) with sample variables and sends it via SMTP.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Input
              type="email"
              placeholder="recipient@example.com"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
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
                sendTest({ variables: { input: { to, templateKey } } })
              }
              disabled={loading || !to}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
