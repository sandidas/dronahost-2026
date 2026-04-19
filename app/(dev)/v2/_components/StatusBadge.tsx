import { cn } from "@/lib/utils";

export type Status = "built" | "needs-work" | "missing";

const config: Record<Status, { label: string; classes: string }> = {
  built: {
    label: "✅ Built",
    classes: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
  "needs-work": {
    label: "⚠️ Needs work",
    classes: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  },
  missing: {
    label: "❌ Missing",
    classes: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  },
};

export default function StatusBadge({ status }: { status: Status }) {
  const { label, classes } = config[status];
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", classes)}>
      {label}
    </span>
  );
}
