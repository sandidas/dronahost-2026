import { Skeleton } from "@/components/ui/skeleton";

export default function PostLoading() {
  return (
    <div className="container-site section-y" role="status" aria-label="Loading article">
      <Skeleton className="h-5 w-48" />
      <Skeleton className="mt-6 h-12 w-full max-w-3xl" />
      <Skeleton className="mt-4 h-5 w-full max-w-2xl" />
      <Skeleton className="mt-10 aspect-video w-full max-w-4xl rounded-2xl" />
    </div>
  );
}
