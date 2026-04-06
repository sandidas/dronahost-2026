import React from "react";
import { cn } from "../../../utils/cn";

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
}: IProps) => {
  const Component = as;

  // 🔹 Base Font
  const baseFont = "font-[family-name:var(--font-mulish)]";

  // 🔹 Font Weight
  const fontWeightClass = {
    default: "font-black",
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
  const sizeClass = {
    default: "text-4xl lg:text-5xl xl:text-7xl xl:leading-relaxed",
    sm: "text-xs lg:text-sm xl:text-sm",
    md: "text-lg lg:text-xl xl:text-xl",
    xl: "text-xl lg:text-xl xl:text-2xl",
    twoXl: "text-xl lg:text-2xl xl:text-2xl",
    threeXl: "text-xl lg:text-2xl xl:text-3xl",
    fourXl: "text-3xl lg:text-3xl xl:text-4xl xl:leading-tight",
    fiveXl: "text-3xl lg:text-4xl xl:text-5xl xl:leading-relaxed",
    sixXl: "text-3xl lg:text-4xl xl:text-6xl xl:leading-[1]",
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
      <Component className={commonClasses}>{children}</Component>
    </div>
  );
};

export default HeadLineText;