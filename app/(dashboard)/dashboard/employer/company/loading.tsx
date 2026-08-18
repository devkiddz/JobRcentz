export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-8">
      <div className="mb-8 space-y-2">
        <div className="h-7 w-32 animate-pulse rounded bg-muted" />
        <div className="h-4 w-72 animate-pulse rounded bg-muted" />
      </div>

      <div className="space-y-8">
        <div className="h-48 animate-pulse rounded-lg bg-muted" />
        <div className="h-40 animate-pulse rounded-lg bg-muted" />
        <div className="h-40 animate-pulse rounded-lg bg-muted" />
      </div>
    </main>
  );
}
