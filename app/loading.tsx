import { Loader2 } from "lucide-react";

export default function RootLoading() {
  return (
    <main className="flex min-h-svh w-full items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </main>
  );
}
