import { cn } from "@/utils/cn";
import { type ReactNode } from "react";

type BadgeVariant = "primary" | "secondary" | "success" | "warning" | "danger" | "neutral";

type BadgeProps = {
  children: ReactNode;
  /** primary = action tint, secondary = teal tint. Default "primary". */
  variant?: BadgeVariant;
  className?: string;
};

const variantClass: Record<BadgeVariant, string> = {
  primary: "bg-action/12 text-action border-action/25",
  secondary: "bg-accent/12 text-link border-accent/25",
  success: "bg-success-surface text-success border-success/25",
  warning: "bg-warning-surface text-warning border-warning/25",
  danger: "bg-danger-surface text-danger border-danger/25",
  neutral: "bg-muted text-muted-foreground border-border",
};

/** Small status or category label. 12px minimum, uppercase with tracking. */
export default function Badge({ children, variant = "primary", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em]",
        variantClass[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
