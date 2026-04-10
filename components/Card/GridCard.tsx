import { cn } from "@/utils/cn";
import { useMemo, type ReactNode } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────────

type Size = "sm" | "md" | "lg";
type Align = "left" | "center" | "right";
type CardVariant = "default" | "ghost";
type SeparatorTone = "soft" | "default" | "strong";

export interface GridCardProps {
  children: ReactNode;
  /** Zero-based card index in the grid. */
  index: number;
  /** Total cards in the grid. */
  total: number;
  /** Columns at the lg (desktop) breakpoint. */
  columns: number;
  /** Padding density. @default "md" */
  size?: Size;
  /** Content alignment — passed down via className for the inner flex column. @default "left" */
  align?: Align;
  /** Ghost adds a very subtle tinted surface. @default "default" */
  variant?: CardVariant;
  /** Divider tone between cards. @default "default" */
  separatorTone?: SeparatorTone;
  /** Extra classes for one-off overrides. */
  className?: string;
}


// ─── Tokens ────────────────────────────────────────────────────────────────────

const sizeMap: Record<Size, string> = {
  sm: "px-6 py-7",
  md: "px-8 py-10",
  lg: "px-10 py-14",
};

const alignMap: Record<Align, string> = {
  left: "items-start text-left",
  center: "items-center text-center",
  right: "items-end text-right",
};

const variantMap: Record<CardVariant, string> = {
  default: "",
  ghost: "bg-neutral-50/80 dark:bg-white/[0.02]",
};

// Border color tones for different section styles.
const separatorMap: Record<SeparatorTone, string> = {
  soft: "[border-color:rgba(15,23,42,0.12)] dark:[border-color:rgba(148,163,184,0.2)]",
  default: "[border-color:rgba(15,23,42,0.18)] dark:[border-color:rgba(148,163,184,0.26)]",
  strong: "[border-color:rgba(0,0,0,0.99)] dark:[border-color:rgba(255,255,255,0.06)]",
};

// ─── Border math ───────────────────────────────────────────────────────────────

function notLastCol(i: number, cols: number) {
  return (i + 1) % cols !== 0;
}
function notLastRow(i: number, total: number, cols: number) {
  return i < total - (total % cols || cols);
}

function borderClasses(index: number, total: number, columns: number, separatorTone: SeparatorTone) {
  const p: string[] = [separatorMap[separatorTone]];

  // 1-col mobile
  if (notLastRow(index, total, 1)) p.push("border-b");

  // 2-col tablet
  p.push(notLastCol(index, 2) ? "sm:border-r" : "sm:border-r-0");
  p.push(notLastRow(index, total, 2) ? "sm:border-b" : "sm:border-b-0");

  // N-col desktop
  p.push(notLastCol(index, columns) ? "lg:border-r" : "lg:border-r-0");
  p.push(notLastRow(index, total, columns) ? "lg:border-b" : "lg:border-b-0");

  return p.join(" ");
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function GridCard({ children, index, total, columns, size = "md", align = "left", variant = "default", separatorTone = "default", className }: GridCardProps) {

  const borders = useMemo(() => borderClasses(index, total, columns, separatorTone), [index, total, columns, separatorTone]);

  return <div className={cn("relative w-full flex flex-col", "transition-colors duration-150", "hover:bg-neutral-100 dark:hover:bg-white/1.5", sizeMap[size], alignMap[align], variantMap[variant], borders, className)}>{children}</div>;
}
