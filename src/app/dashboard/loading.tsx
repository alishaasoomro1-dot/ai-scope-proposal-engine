export default function Loading() {
  return (
    <div role="status" aria-label="Loading dashboard" className="mx-auto w-full max-w-7xl space-y-6">
      <span className="sr-only">Loading dashboard…</span>
      <div className="h-8 w-48 animate-pulse rounded-lg bg-[#E5E7EB]" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => <div key={index} className="h-32 animate-pulse rounded-2xl border border-[#E5E7EB] bg-white" />)}
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => <div key={index} className="h-44 animate-pulse rounded-2xl border border-[#E5E7EB] bg-white" />)}
      </div>
    </div>
  );
}
