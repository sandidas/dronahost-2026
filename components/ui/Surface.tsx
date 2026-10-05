import { cn } from "@/utils/cn";
import { type ElementType, type ReactNode } from "react";

const variantClass = {
  default: "surface",
  raised: "surface surface-raised",
  glass: "surface-glass",
} as const;

const paddingClass = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
} as const;

type SurfaceProps = {
  children: ReactNode;
  /** default = flat card · raised = elevated card · glass = translucent (use sparingly). */
  variant?: keyof typeof variantClass;
  padding?: keyof typeof paddingClass;
  /** Adds hover lift and border emphasis for clickable cards. */
  interactive?: boolean;
  /** Element to render, e.g. "article" or "li". Default "div". */
  as?: ElementType;
  className?: string;
};

/**
 * Layered card surface: hairline border, inner highlight, soft multi-layer shadow.
 * Radius is the 24px token by default via `rounded-2xl` on the class if needed.
 */
export default function Surface({
  children,
  variant = "default",
  padding = "md",
  interactive = false,
  as: Tag = "div",
  className,
}: SurfaceProps) {
  return (
    <Tag className={cn(variantClass[variant], paddingClass[padding], interactive && "surface-interactive", className)}>
      {children}
    </Tag>
  );
}
