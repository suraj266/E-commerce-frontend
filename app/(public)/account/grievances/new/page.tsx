"use client";

/**
 * File a complaint (P4-01, CP-EC). A logged-in customer picks a category, writes
 * a subject + description, and (optionally) references an order. The backend
 * derives the priority + SLA and opens the ticket. Order context can be
 * pre-filled via ?orderId= / ?sellerOrderId= query params (e.g. a "Report a
 * problem" link from an order), so the form is wrapped in a Suspense boundary
 * (useSearchParams requirement in Next 16).
 */

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";

import {
  FILE_GRIEVANCE,
  GRIEVANCE_CATEGORIES,
  GRIEVANCE_CATEGORY_LABEL,
  type FileGrievanceData,
  type GrievanceCategory,
} from "@/lib/graphql/grievances";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function NewGrievanceForm() {
  const router = useRouter();
  const params = useSearchParams();
  const orderId = params.get("orderId") ?? undefined;
  const sellerOrderId = params.get("sellerOrderId") ?? undefined;

  const [category, setCategory] = useState<GrievanceCategory>("ORDER_ISSUE");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const [fileGrievance, { loading }] = useMutation<FileGrievanceData>(
    FILE_GRIEVANCE,
    {
      onCompleted: (res) => {
        toast.success("Complaint filed");
        router.push(`/account/grievances/${res.fileGrievance.id}`);
      },
      onError: (e) => toast.error(e.message),
    },
  );

  const submit = () => {
    if (subject.trim().length < 3) {
      toast.error("Please add a short subject.");
      return;
    }
    if (description.trim().length < 10) {
      toast.error("Please describe the issue in a little more detail.");
      return;
    }
    fileGrievance({
      variables: {
        input: {
          category,
          subject: subject.trim(),
          description: description.trim(),
          orderId,
          sellerOrderId,
        },
      },
    });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href="/account/grievances"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-1 h-4 w-4" /> Back to complaints
      </Link>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">File a complaint</h1>
        <p className="text-sm text-muted-foreground">
          Tell us what went wrong. Our grievance team will acknowledge and work
          to resolve it within our published timelines.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="grievance-category">Category</Label>
          <Select
            value={category}
            onValueChange={(v) => setCategory(v as GrievanceCategory)}
          >
            <SelectTrigger id="grievance-category" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {GRIEVANCE_CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {GRIEVANCE_CATEGORY_LABEL[c]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="grievance-subject">Subject</Label>
          <Input
            id="grievance-subject"
            value={subject}
            maxLength={160}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Refund not received for cancelled order"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="grievance-description">Description</Label>
          <Textarea
            id="grievance-description"
            value={description}
            maxLength={4000}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue, including any order number, dates and amounts…"
            className="min-h-40"
          />
        </div>

        {(orderId || sellerOrderId) && (
          <p className="text-xs text-muted-foreground">
            This complaint will be linked to your selected order.
          </p>
        )}

        <Button onClick={submit} disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit complaint
        </Button>
      </div>
    </div>
  );
}

export default function NewGrievancePage() {
  return (
    <Suspense
      fallback={<p className="text-sm text-muted-foreground">Loading…</p>}
    >
      <NewGrievanceForm />
    </Suspense>
  );
}
