"use client";

/**
 * /seller/shipping/manage — connect + manage the Shiprocket courier account.
 *
 * Steps the seller follows:
 *   1. Connect with their Shiprocket API user (email + password).
 *   2. Select a pickup location (fetched live from their Shiprocket account).
 *   3. Copy our webhook URL into Shiprocket's panel, set a token there, and
 *      paste that same token here (so we can verify incoming tracking webhooks).
 */

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client/react";
import {
  Truck,
  Loader2,
  CheckCircle2,
  XCircle,
  Copy,
  ArrowLeft,
  Plug,
  MapPin,
  Webhook,
} from "lucide-react";
import { toast } from "sonner";

import {
  GET_MY_COURIER_ACCOUNTS,
  GET_COURIER_WEBHOOK_URL,
  CONNECT_COURIER_ACCOUNT,
  TEST_COURIER_CONNECTION,
  SET_COURIER_ACCOUNT_ENABLED,
  GET_COURIER_PICKUP_LOCATIONS,
  SET_COURIER_PICKUP_LOCATION,
  SET_COURIER_WEBHOOK_TOKEN,
} from "@/lib/graphql/courier";
import type {
  MyCourierAccountsData,
  CourierAccountSafe,
  CourierWebhookUrlData,
  CourierPickupLocationsData,
} from "@/types/courier.types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PROVIDER = "SHIPROCKET" as const;

export default function ShippingManagePage() {
  const { data: accData, loading: accLoading, refetch } =
    useQuery<MyCourierAccountsData>(GET_MY_COURIER_ACCOUNTS, { fetchPolicy: "cache-and-network" });
  const account: CourierAccountSafe | undefined = (accData?.myCourierAccounts ?? []).find(
    (a) => a.provider === PROVIDER,
  );
  const connected = account?.status === "CONNECTED";

  const { data: urlData } = useQuery<CourierWebhookUrlData>(GET_COURIER_WEBHOOK_URL);
  const webhookUrl = urlData?.courierWebhookUrl ?? "";

  return (
    <div className="space-y-6 max-w-3xl">
      <Link
        href="/seller/shipping"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition"
      >
        <ArrowLeft className="mr-1.5 h-4 w-4" />
        Shipping methods
      </Link>

      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Truck className="h-6 w-6 text-primary" />
          Shiprocket
          {account && (
            <Badge variant={connected && account.isEnabled ? "default" : "secondary"} className="text-xs ml-1">
              {account.isEnabled ? account.status : "DISABLED"}
            </Badge>
          )}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Live rates at checkout + AWB, labels and tracking.
        </p>
      </div>

      {accLoading && !account ? (
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      ) : (
        <>
          <ConnectSection account={account} onChanged={refetch} />
          {connected && (
            <>
              <PickupSection onChanged={refetch} pickupNickname={account?.pickupLocationNickname ?? null} />
              <WebhookSection
                webhookUrl={webhookUrl}
                configured={account?.webhookConfigured ?? false}
                onChanged={refetch}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}

function ConnectSection({
  account,
  onChanged,
}: {
  account?: CourierAccountSafe;
  onChanged: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [connect, { loading: connecting }] = useMutation(CONNECT_COURIER_ACCOUNT);
  const [test, { loading: testing }] = useMutation(TEST_COURIER_CONNECTION);
  const [setEnabled] = useMutation(SET_COURIER_ACCOUNT_ENABLED);

  const handleConnect = async () => {
    if (!email.trim() || !password.trim()) {
      toast.error("Enter your Shiprocket API email and password");
      return;
    }
    try {
      await connect({ variables: { input: { provider: PROVIDER, email: email.trim(), password: password.trim() } } });
      setPassword("");
      onChanged();
      toast.success("Shiprocket connected");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to connect");
    }
  };

  return (
    <section className="rounded-lg border bg-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold flex items-center gap-2">
          <Plug className="h-4 w-4 text-primary" />
          Account
        </h2>
        {account && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {account.isEnabled ? "Enabled" : "Disabled"}
            <Switch
              checked={account.isEnabled}
              onCheckedChange={async (v) => {
                try {
                  await setEnabled({ variables: { provider: PROVIDER, enabled: v } });
                  onChanged();
                } catch (e: unknown) {
                  toast.error(e instanceof Error ? e.message : "Failed");
                }
              }}
            />
          </div>
        )}
      </div>

      {account?.lastError && <p className="text-xs text-destructive">{account.lastError}</p>}

      <p className="text-xs text-muted-foreground">
        Create an API user in Shiprocket → Settings → API → Configure, then enter
        those credentials here.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>API email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={account?.hasCredentials ? "•••••• (re-enter to update)" : "api-user@yourbiz.com"}
          />
        </div>
        <div className="space-y-1.5">
          <Label>API password</Label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={handleConnect} disabled={connecting}>
          {connecting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {account ? "Reconnect" : "Connect & verify"}
        </Button>
        {account && (
          <Button
            variant="outline"
            disabled={testing}
            onClick={async () => {
              try {
                const res = await test({ variables: { provider: PROVIDER } });
                onChanged();
                const st = (res.data as { testCourierConnection?: CourierAccountSafe })?.testCourierConnection?.status;
                toast[st === "CONNECTED" ? "success" : "error"](st === "CONNECTED" ? "Connection OK" : "Connection failed");
              } catch (e: unknown) {
                toast.error(e instanceof Error ? e.message : "Test failed");
              }
            }}
          >
            {testing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
            Test connection
          </Button>
        )}
      </div>
    </section>
  );
}

function PickupSection({
  pickupNickname,
  onChanged,
}: {
  pickupNickname: string | null;
  onChanged: () => void;
}) {
  const [fetch, { data, loading }] = useLazyQuery<CourierPickupLocationsData>(GET_COURIER_PICKUP_LOCATIONS, {
    fetchPolicy: "network-only",
  });
  const [save, { loading: saving }] = useMutation(SET_COURIER_PICKUP_LOCATION);
  const [selected, setSelected] = useState(pickupNickname ?? "");
  const locations = data?.courierPickupLocations ?? [];

  return (
    <section className="rounded-lg border bg-card p-5 space-y-3">
      <h2 className="font-semibold flex items-center gap-2">
        <MapPin className="h-4 w-4 text-primary" />
        Pickup location
      </h2>
      <p className="text-xs text-muted-foreground">
        Orders ship from this Shiprocket pickup address.{" "}
        {pickupNickname ? (
          <>Current: <span className="font-medium text-foreground">{pickupNickname}</span></>
        ) : (
          "None selected yet."
        )}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => fetch({ variables: { provider: PROVIDER } })} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <MapPin className="h-4 w-4 mr-2" />}
          Fetch from Shiprocket
        </Button>
        {locations.length > 0 && (
          <>
            <Select value={selected} onValueChange={setSelected}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select pickup location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((l) => (
                  <SelectItem key={l.id} value={l.nickname}>
                    {l.nickname} · {l.city} {l.pincode}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              size="sm"
              disabled={!selected || saving}
              onClick={async () => {
                try {
                  await save({ variables: { provider: PROVIDER, nickname: selected } });
                  onChanged();
                  toast.success("Pickup location saved");
                } catch (e: unknown) {
                  toast.error(e instanceof Error ? e.message : "Failed");
                }
              }}
            >
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save
            </Button>
          </>
        )}
      </div>
    </section>
  );
}

function WebhookSection({
  webhookUrl,
  configured,
  onChanged,
}: {
  webhookUrl: string;
  configured: boolean;
  onChanged: () => void;
}) {
  const [token, setToken] = useState("");
  const [save, { loading }] = useMutation(SET_COURIER_WEBHOOK_TOKEN);

  return (
    <section className="rounded-lg border bg-card p-5 space-y-3">
      <h2 className="font-semibold flex items-center gap-2">
        <Webhook className="h-4 w-4 text-primary" />
        Tracking webhook
        {configured ? (
          <Badge variant="default" className="text-xs ml-1">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Token set
          </Badge>
        ) : (
          <Badge variant="secondary" className="text-xs ml-1">
            <XCircle className="h-3 w-3 mr-1" />
            Not set
          </Badge>
        )}
      </h2>
      <ol className="text-xs text-muted-foreground list-decimal ml-4 space-y-1">
        <li>In Shiprocket → Settings → API → Webhooks, paste the URL below.</li>
        <li>Set Auth Token Type = <span className="font-mono">x-api-key</span> and enter any token you choose.</li>
        <li>Paste that same token here so we can verify Shiprocket&apos;s updates.</li>
      </ol>

      <div className="space-y-1.5">
        <Label>Webhook URL</Label>
        <div className="flex gap-2">
          <Input readOnly value={webhookUrl || "(set PUBLIC_API_URL on the server)"} className="font-mono text-xs" />
          <Button
            variant="outline"
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(webhookUrl);
              toast.success("Copied");
            }}
            disabled={!webhookUrl}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        {webhookUrl.startsWith("http://localhost") && (
          <p className="text-[11px] text-amber-600">
            Shiprocket can&apos;t reach localhost — use a public URL (deploy or a tunnel) for live tracking.
          </p>
        )}
      </div>

      <div className="space-y-1.5 max-w-md">
        <Label>x-api-key token</Label>
        <div className="flex gap-2">
          <Input value={token} onChange={(e) => setToken(e.target.value)} placeholder="The token you set in Shiprocket" />
          <Button
            disabled={!token.trim() || loading}
            onClick={async () => {
              try {
                await save({ variables: { provider: PROVIDER, token: token.trim() } });
                setToken("");
                onChanged();
                toast.success("Webhook token saved");
              } catch (e: unknown) {
                toast.error(e instanceof Error ? e.message : "Failed");
              }
            }}
          >
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save token
          </Button>
        </div>
      </div>
    </section>
  );
}
