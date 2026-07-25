"use client";

/**
 * Seller Return detail (P3-02) — the action surface. Buttons are gated to the
 * transitions valid from the return's current status; each mutation refetches
 * the detail so the state machine + timeline stay accurate.
 */

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";

import {
  GET_SELLER_RETURN,
  APPROVE_RETURN,
  REJECT_RETURN,
  SCHEDULE_RETURN_PICKUP,
  MARK_RETURN_RECEIVED,
  QC_RETURN,
  MARK_REPLACEMENT_SHIPPED,
  type SellerReturnData,
} from "@/lib/graphql/returns";
import { ReturnStatusBadge } from "@/components/orders/return-status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SellerReturnDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [note, setNote] = useState("");
  const [replacementRef, setReplacementRef] = useState("");

  const { data, loading, error, refetch } = useQuery<SellerReturnData>(
    GET_SELLER_RETURN,
    { variables: { id }, fetchPolicy: "cache-and-network" },
  );

  const mutOpts = {
    onCompleted: () => {
      toast.success("Return updated");
      setNote("");
      setReplacementRef("");
      void refetch();
    },
    onError: (e: { message: string }) => toast.error(e.message),
  };

  const [approve, { loading: a }] = useMutation(APPROVE_RETURN, mutOpts);
  const [reject, { loading: rj }] = useMutation(REJECT_RETURN, mutOpts);
  const [schedule, { loading: s }] = useMutation(SCHEDULE_RETURN_PICKUP, mutOpts);
  const [received, { loading: rc }] = useMutation(MARK_RETURN_RECEIVED, mutOpts);
  const [qc, { loading: q }] = useMutation(QC_RETURN, mutOpts);
  const [shipReplacement, { loading: sr }] = useMutation(
    MARK_REPLACEMENT_SHIPPED,
    mutOpts,
  );
  const busy = a || rj || s || rc || q || sr;

  const r = data?.sellerReturn;
  const isReplacement = r?.resolutionType === "REPLACEMENT";

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link href="/seller/returns">
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to returns
        </Link>
      </Button>

      {loading && !r ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : error || !r ? (
        <p className="text-sm text-destructive">
          {error?.message ?? "Return not found."}
        </p>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-mono text-lg font-semibold">
                {r.returnNumber}
              </h1>
              <p className="text-sm text-muted-foreground">{r.reason}</p>
            </div>
            <ReturnStatusBadge status={r.status} />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {r.status === "REQUESTED" && (
                <div className="flex flex-wrap gap-2">
                  <Button
                    disabled={busy}
                    onClick={() => approve({ variables: { id } })}
                  >
                    {a && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    disabled={busy}
                    onClick={() =>
                      reject({ variables: { id, reason: note.trim() || null } })
                    }
                  >
                    Reject
                  </Button>
                </div>
              )}

              {r.status === "APPROVED" && (
                <Button
                  disabled={busy}
                  onClick={() => schedule({ variables: { id } })}
                >
                  {s && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Schedule reverse pickup
                </Button>
              )}

              {(r.status === "PICKUP_SCHEDULED" ||
                r.status === "IN_TRANSIT") && (
                <Button
                  disabled={busy}
                  onClick={() => received({ variables: { id } })}
                >
                  {rc && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Mark received
                </Button>
              )}

              {r.status === "RECEIVED" && (
                <div className="flex flex-wrap gap-2">
                  <Button
                    disabled={busy}
                    onClick={() =>
                      qc({ variables: { id, pass: true, note: note.trim() || null } })
                    }
                  >
                    {q && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isReplacement ? "Pass QC & approve replacement" : "Pass QC & refund"}
                  </Button>
                  <Button
                    variant="destructive"
                    disabled={busy}
                    onClick={() =>
                      qc({ variables: { id, pass: false, note: note.trim() || null } })
                    }
                  >
                    Fail QC
                  </Button>
                </div>
              )}

              {r.status === "REPLACEMENT_APPROVED" && (
                <div className="space-y-2">
                  <Input
                    value={replacementRef}
                    onChange={(e) => setReplacementRef(e.target.value)}
                    placeholder="Replacement tracking / AWB (optional)"
                  />
                  <Button
                    disabled={busy}
                    onClick={() =>
                      shipReplacement({
                        variables: {
                          id,
                          reference: replacementRef.trim() || null,
                          note: note.trim() || null,
                        },
                      })
                    }
                  >
                    {sr && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Mark replacement shipped
                  </Button>
                </div>
              )}

              {(r.status === "REQUESTED" || r.status === "RECEIVED") && (
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Optional note (reason / QC condition)…"
                  className="min-h-20"
                />
              )}

              {r.reverseAwb && (
                <p className="text-xs text-muted-foreground">
                  Reverse AWB: <span className="font-mono">{r.reverseAwb}</span>
                  {r.reverseLabelUrl && (
                    <>
                      {" · "}
                      <a
                        href={r.reverseLabelUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="underline"
                      >
                        Label
                      </a>
                    </>
                  )}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2">
                {(r.events ?? []).map((e) => (
                  <li
                    key={e.id}
                    className="flex items-center justify-between gap-2 text-sm"
                  >
                    <span>
                      {e.fromStatus ? `${e.fromStatus} → ` : ""}
                      <strong>{e.toStatus}</strong>
                      {e.note ? ` — ${e.note}` : ""}
                    </span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(e.createdAt).toLocaleString("en-IN")}
                    </span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
