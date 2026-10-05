import { cn } from "@/utils/cn";
import React from "react";

/* ────────────────────────────────────────────────────────────────
   ALIGN CONFIG (TYPE-SAFE)
---------------------------------------------------------------- */
const alignClass = {
  default: "text-center flex flex-col items-center justify-center",
  center: "text-center flex flex-col items-center justify-center",
  left: "text-left flex flex-col items-start justify-center",
  right: "text-right flex flex-col items-end justify-center",
  none: "",
} as const;

type AlignType = keyof typeof alignClass;

/* ────────────────────────────────────────────────────────────────
COMPONENT TYPES
---------------------------------------------------------------- */
interface IProps {
  children?: React.ReactNode;
  className?: string;
  borderStyle?: "default" | "dashed" | "solid" | "none";
  fontWeight?: "default" | "bold" | "medium" | "light" | "thin";
  variant?: "default" | "highlight" | "outline" | "dashboard";
  align?: AlignType;
  fontSize?:
    | "default"
    | "sm"
    | "md"
    | "xl"
    | "twoXl"
    | "threeXl"
    | "fourXl"
    | "fiveXl"
    | "sixXl"
    | "custom";
  fontColor?: "default" | "primary" | "secondary" | "muted" | "destructive";
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
  /** DOM id, e.g. for aria-labelledby on the parent section. */
  id?: string;
}

/* ────────────────────────────────────────────────────────────────
COMPONENT
---------------------------------------------------------------- */
const HeadLineText = ({
  children,
  className,
  borderStyle = "default",
  fontWeight = "default",
  variant = "default",
  align = "default",
  fontSize = "default",
  fontColor = "default",
  as = "h2",
  id,
}: IProps) => {
  const Component = as;

  // 🔹 Base Font — Sora (loaded via next/font, var set in layout.tsx)
  const baseFont = "font-[family-name:var(--font-heading)]";

  // 🔹 Font Weight
  const fontWeightClass = {
    default: "font-semibold",
    bold: "font-bold",
    medium: "font-medium",
    light: "font-light",
    thin: "font-thin",
  };

  // 🔹 Variant Styles
  const variantClass = {
    default: "",
    highlight:
      "bg-gradient-to-r from-primary via-primary/70 to-primary inline-block text-transparent bg-clip-text",
    outline: "",
    dashboard: "",
  };

  // 🔹 Font Sizes
  // Fluid scale (clamp) with tight tracking and balanced wrapping.
  const sizeClass = {
    default: "t-display",
    sm: "text-sm leading-snug",
    md: "text-[clamp(1.0625rem,1rem+0.3vw,1.25rem)] leading-snug",
    xl: "text-[clamp(1.125rem,1.05rem+0.4vw,1.375rem)] leading-snug tracking-[-0.01em]",
    twoXl: "text-[clamp(1.25rem,1.1rem+0.6vw,1.625rem)] leading-tight tracking-[-0.015em] text-balance",
    threeXl: "t-h3",
    fourXl: "text-[clamp(1.5rem,1.2rem+1.2vw,2.25rem)] leading-[1.15] tracking-[-0.02em] text-balance",
    fiveXl: "t-h2",
    sixXl: "t-h1",
    custom: "",
  };

  // 🔹 Border Styles
  const borderClass = {
    default: "",
    dashed: "border-2 border-dashed border-border",
    solid: "border-2 border-solid border-border",
    none: "border-none",
  };

  // 🔹 Colors
  const colorClass = {
    default: "",
    primary: "text-primary",
    secondary: "text-secondary-foreground",
    muted: "text-muted-foreground",
    destructive: "text-destructive",
  };

  // 🔹 Combined Classes
  const commonClasses = cn(
    baseFont,
    fontWeightClass[fontWeight],
    variantClass[variant],
    borderClass[borderStyle],
    sizeClass[fontSize],
    variant !== "highlight" && colorClass[fontColor],
    className
  );

  return (
    <div className={cn(alignClass[align])}>
      <Component id={id} className={commonClasses}>{children}</Component>
    </div>
  );
};

export default HeadLineText;
