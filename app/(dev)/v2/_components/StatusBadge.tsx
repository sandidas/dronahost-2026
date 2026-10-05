import { cn } from "@/utils/cn";

export type Status = "built" | "needs-work" | "missing" | "pending-review";

const config: Record<Status, { label: string; classes: string }> = {
  built: { label: "Built", classes: "border-success/30 bg-success-surface text-success" },
  "needs-work": { label: "Needs work", classes: "border-warning/30 bg-warning-surface text-warning" },
  missing: { label: "Missing", classes: "border-danger/30 bg-danger-surface text-danger" },
  "pending-review": { label: "Pending review", classes: "border-accent/30 bg-accent/12 text-link" },
};

export default function StatusBadge({ status }: { status: Status }) {
  const { label, classes } = config[status];
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold", classes)}>{label}</span>
  );
}
