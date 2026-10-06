import { cn } from "@/utils/cn";

/** Loading placeholder block. Decorative, so hidden from assistive tech. */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      aria-hidden="true"
      className={cn("skeleton rounded-lg bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };
