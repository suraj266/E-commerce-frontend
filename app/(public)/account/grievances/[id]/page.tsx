"use client";

/**
 * Customer grievance tracking (P4-01, CP-EC) — lifecycle + conversation thread
 * for one of the customer's own complaints, with a reply box. A reply on a
 * resolved complaint re-opens it; a closed complaint is read-only.
 */

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Send } from "lucide-react";

import {
  GET_MY_GRIEVANCE,
  REPLY_TO_GRIEVANCE,
  GRIEVANCE_STATUS_LABEL,
  GRIEVANCE_STATUS_BADGE,
  GRIEVANCE_CATEGORY_LABEL,
  type MyGrievanceData,
  type ReplyToGrievanceData,
} from "@/lib/graphql/grievances";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function MyGrievanceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useQuery<MyGrievanceData>(GET_MY_GRIEVANCE, {
    variables: { id },
    fetchPolicy: "cache-and-network",
  });
  const [reply, setReply] = useState("");

  const [sendReply, { loading: replying }] = useMutation<ReplyToGrievanceData>(
    REPLY_TO_GRIEVANCE,
    {
      onCompleted: () => {
        toast.success("Reply sent");
        setReply("");
      },
      onError: (e) => toast.error(e.message),
    },
  );

  const g = data?.myGrievance;
  const closed = g?.status === "CLOSED";

  const submit = () => {
    if (!reply.trim()) {
      toast.error("Please write a reply.");
      return;
    }
    sendReply({ variables: { id, body: reply.trim() } });
  };

  return (
    <div className="space-y-6">
      <Link
        href="/account/grievances"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-1 h-4 w-4" /> Back to complaints
      </Link>

      {loading && !g ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : error || !g ? (
        <p className="text-sm text-destructive">
          {error?.message ?? "Complaint not found."}
        </p>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-mono text-lg font-semibold">
                {g.ticketNumber}
              </h1>
              <p className="text-sm font-medium">{g.subject}</p>
              <p className="text-xs text-muted-foreground">
                {GRIEVANCE_CATEGORY_LABEL[g.category]}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge
                variant="outline"
                className={`border ${GRIEVANCE_STATUS_BADGE[g.status]}`}
              >
                {GRIEVANCE_STATUS_LABEL[g.status]}
              </Badge>
              {g.slaBreached && (
                <span className="text-[10px] font-medium text-rose-600">
                  Past our target response time
                </span>
              )}
            </div>
          </div>

          {g.resolutionNote && (
            <div className="rounded-lg border border-emerald-300 bg-emerald-50 p-4 text-sm dark:border-emerald-500/40 dark:bg-emerald-500/10">
              <div className="font-medium text-emerald-900 dark:text-emerald-200">
                Resolution
              </div>
              <p className="mt-1 text-emerald-900/90 dark:text-emerald-100/90">
                {g.resolutionNote}
              </p>
            </div>
          )}

          <div className="rounded-lg border bg-card p-4">
            <h2 className="mb-3 text-sm font-semibold">Conversation</h2>
            <ol className="space-y-3">
              {(g.messages ?? []).map((m) => {
                const mine = m.authorRole === "CUSTOMER";
                return (
                  <li
                    key={m.id}
                    className={`rounded-md border p-3 text-sm ${
                      mine ? "bg-muted/40" : "bg-background"
                    }`}
                  >
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-muted-foreground">
                        {m.authorRole === "CUSTOMER"
                          ? "You"
                          : m.authorRole === "OFFICER"
                            ? "Grievance team"
                            : "System"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(m.createdAt).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap">{m.body}</p>
                  </li>
                );
              })}
            </ol>

            {closed ? (
              <p className="mt-4 text-xs text-muted-foreground">
                This complaint is closed. If the issue persists, please file a new
                complaint.
              </p>
            ) : (
              <div className="mt-4 space-y-2">
                <Textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Add a reply…"
                  className="min-h-24"
                />
                <Button size="sm" onClick={submit} disabled={replying}>
                  {replying ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  Send reply
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
