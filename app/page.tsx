import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-zinc-50 dark:bg-zinc-950">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm flex flex-col gap-6 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Welcome to <span className="text-blue-600">MultiMart</span>
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 max-w-lg text-lg">
          The ultimate multi-seller platform. Please log in to access the seller, admin, or customer dashboards.
        </p>
        
        <div className="flex gap-4 mt-8 justify-center">
          <Link href="/login">
            <Button size="lg" className="px-8 cursor-pointer">
              Go to Login Panel
            </Button>
          </Link>
          <Button variant="outline" size="lg" disabled>
            Browse Products (Coming Soon)
          </Button>
        </div>
      </div>
    </main>
  );
}
