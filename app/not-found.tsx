import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-svh w-full flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          404
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Page not found
        </h1>
        <p className="max-w-md text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
      <Link
        href="/"
        className="inline-flex h-10 items-center justify-center rounded-md bg-foreground px-5 text-sm font-medium text-background transition hover:opacity-90"
      >
        Go home
      </Link>
    </main>
  );
}
