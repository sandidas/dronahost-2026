import { cn } from "@/utils/cn";
import { type ReactNode } from "react";

type BadgeVariant = "primary" | "secondary" | "success" | "neutral";

type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
};

const variantClass: Record<BadgeVariant, string> = {
  primary: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300",
  secondary: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  success: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  neutral: "bg-neutral-100 text-neutral-600 dark:bg-white/10 dark:text-neutral-300",
};

export default function Badge({ children, variant = "primary", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-block rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide",
        variantClass[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
