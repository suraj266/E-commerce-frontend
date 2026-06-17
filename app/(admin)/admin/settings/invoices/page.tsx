/**
 * Tax invoice template editor — /admin/settings/invoices
 *
 * Single-template editor for the DB-backed `tax_invoice` template that the
 * PDF generator renders. Layout:
 *   - Left:  name + description + HTML body editor + CSS editor
 *   - Right: variable picker chips (click to insert at cursor) + a LIVE
 *            server-rendered preview (sandboxed iframe).
 *
 * Unlike the email editor's client-side regex preview, this calls the
 * backend `previewInvoiceTemplate` query so the preview runs the real
 * Handlebars engine + helpers (money / formatDate / addOne) against a
 * sample invoice — what you see is what the PDF will contain.
 */

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@/lib/forms/zod-resolver";
import { toast } from "sonner";
import { FileBadge, Loader2, Lock, Sparkles } from "lucide-react";

import {
  GET_INVOICE_TEMPLATE,
  PREVIEW_INVOICE_TEMPLATE,
  UPDATE_INVOICE_TEMPLATE,
} from "@/lib/graphql/invoice-template";

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
import { useSetPageTitle } from "@/components/shell/page-title-context";

interface InvoiceTemplate {
  id: string;
  key: string;
  name: string;
  description: string;
  htmlBody: string;
  css: string;
  variables: string[];
  isEnabled: boolean;
  isSystem: boolean;
  updatedAt: string;
}
type GetInvoiceTemplateData = { invoiceTemplate: InvoiceTemplate | null };
type PreviewData = { previewInvoiceTemplate: string };
type UpdateData = { updateInvoiceTemplate: InvoiceTemplate };

const schema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().max(500),
  htmlBody: z.string().min(1, "HTML body cannot be empty"),
  css: z.string(),
});
type FormValues = z.infer<typeof schema>;

export default function InvoiceTemplatePage() {
  useSetPageTitle("Invoice Template");

  const { data, loading } = useQuery<GetInvoiceTemplateData>(
    GET_INVOICE_TEMPLATE,
    { fetchPolicy: "cache-and-network" },
  );
  const template = data?.invoiceTemplate ?? null;

  const [updateTemplate, { loading: saving }] = useMutation<UpdateData>(
    UPDATE_INVOICE_TEMPLATE,
    { refetchQueries: [{ query: GET_INVOICE_TEMPLATE }] },
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", description: "", htmlBody: "", css: "" },
  });

  useEffect(() => {
    if (!template) return;
    form.reset({
      name: template.name,
      description: template.description,
      htmlBody: template.htmlBody,
      css: template.css,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template?.id, template?.updatedAt]);

  // Insert a {{variable}} into the HTML body at the cursor.
  const htmlRef = useRef<HTMLTextAreaElement | null>(null);
  function insertVariable(variable: string) {
    const ta = htmlRef.current;
    const tag = `{{${variable}}}`;
    if (!ta) {
      form.setValue("htmlBody", form.getValues("htmlBody") + tag, {
        shouldDirty: true,
      });
      return;
    }
    const start = ta.selectionStart ?? ta.value.length;
    const end = ta.selectionEnd ?? ta.value.length;
    const next = ta.value.slice(0, start) + tag + ta.value.slice(end);
    form.setValue("htmlBody", next, { shouldDirty: true });
    requestAnimationFrame(() => {
      ta.focus();
      const pos = start + tag.length;
      ta.setSelectionRange(pos, pos);
    });
  }

  async function onSubmit(values: FormValues) {
    if (!template) return;
    try {
      await updateTemplate({
        variables: {
          input: {
            id: template.id,
            name: values.name,
            description: values.description,
            htmlBody: values.htmlBody,
            css: values.css,
          },
        },
      });
      toast.success("Invoice template saved.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed.");
    }
  }

  // ---- Live server-rendered preview (debounced) ----
  const watchedHtml = form.watch("htmlBody");
  const watchedCss = form.watch("css");
  const [debounced, setDebounced] = useState({ htmlBody: "", css: "" });
  useEffect(() => {
    const t = setTimeout(
      () => setDebounced({ htmlBody: watchedHtml, css: watchedCss }),
      500,
    );
    return () => clearTimeout(t);
  }, [watchedHtml, watchedCss]);

  const { data: previewData, loading: previewing } = useQuery<PreviewData>(
    PREVIEW_INVOICE_TEMPLATE,
    {
      variables: {
        input: { htmlBody: debounced.htmlBody, css: debounced.css },
      },
      skip: !debounced.htmlBody,
      fetchPolicy: "no-cache",
    },
  );
  const previewHtml = useMemo(
    () => previewData?.previewInvoiceTemplate ?? "",
    [previewData],
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
        Invoice template not found. Run{" "}
        <code className="font-mono">pnpm seed:invoices</code> to seed the
        default.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <FileBadge className="h-6 w-6 text-primary" />
            {template.name}
            {template.isSystem && (
              <Badge variant="default" className="text-[10px] gap-1">
                <Lock className="h-3 w-3" />
                System
              </Badge>
            )}
          </h1>
          <p className="text-xs text-muted-foreground font-mono mt-1">
            {template.key}
          </p>
        </div>
        <Button onClick={form.handleSubmit(onSubmit)} disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save template
        </Button>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_minmax(360px,40%)]"
        >
          {/* Left: editors */}
          <div className="space-y-5">
            <div className="rounded-lg border bg-card p-5 shadow-sm space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
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
            </div>

            <div className="rounded-lg border bg-card p-5 shadow-sm">
              <FormField
                control={form.control}
                name="htmlBody"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>HTML body (Handlebars)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        ref={(el) => {
                          field.ref(el);
                          htmlRef.current = el;
                        }}
                        spellCheck={false}
                        className="font-mono text-xs h-[360px] resize-y"
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Handlebars template. Helpers available:{" "}
                      <code className="font-mono">money</code>,{" "}
                      <code className="font-mono">formatDate</code>,{" "}
                      <code className="font-mono">addOne</code>.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="rounded-lg border bg-card p-5 shadow-sm">
              <FormField
                control={form.control}
                name="css"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CSS</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        spellCheck={false}
                        className="font-mono text-xs h-[240px] resize-y"
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Injected into the invoice head. Keep to flexbox + plain
                      margins (headless Chromium renders these most reliably
                      for A4 PDF).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Right: variables + preview */}
          <div className="space-y-5">
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
            </div>

            <div className="rounded-lg border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm">Live preview</h3>
                {previewing && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                )}
              </div>
              <div className="rounded-md border overflow-hidden bg-white">
                <iframe
                  title="Invoice preview"
                  sandbox=""
                  srcDoc={previewHtml}
                  className="w-full h-[560px] border-0 bg-white"
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">
                Rendered server-side with the real Handlebars engine against a
                sample intra-state (CGST+SGST) invoice. The generated PDF uses
                your live order data.
              </p>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
