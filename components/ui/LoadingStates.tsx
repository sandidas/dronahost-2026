import { Skeleton } from "@/components/ui/skeleton";

/** Placeholder for a block of text (heading plus lines). Announces itself politely to assistive tech. */
export function TextSkeleton({ lines = 3, label = "Loading" }: { lines?: number; label?: string }) {
  return (
    <div role="status" aria-live="polite" className="space-y-3">
      <span className="sr-only">{label}</span>
      <Skeleton className="h-7 w-2/3" />
      {Array.from({ length: Math.min(lines, 8) }, (_, i) => (
        <Skeleton key={i} className={i === lines - 1 ? "h-4 w-1/2" : "h-4 w-full"} />
      ))}
    </div>
  );
}

/** Placeholder for a grid of cards. Reserves the space so the layout does not shift when content arrives. */
export function CardGridSkeleton({ count = 3, label = "Loading" }: { count?: number; label?: string }) {
  return (
    <div role="status" aria-live="polite" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <span className="sr-only">{label}</span>
      {Array.from({ length: Math.min(count, 12) }, (_, i) => (
        <Skeleton key={i} className="h-56 rounded-2xl" />
      ))}
    </div>
  );
}
