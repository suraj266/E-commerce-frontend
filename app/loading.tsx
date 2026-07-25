import { Loader2 } from "lucide-react";

// Root (app-level) loading fallback. Kept as a minimal centered spinner — it
// covers the brief window before a route group's own loading.tsx takes over.
export default function RootLoading() {
  return (
    <main className="flex min-h-svh w-full items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </main>
  );
}
