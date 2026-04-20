"use client";

import { cn } from "@/utils/cn";
import { BarChart3, Code, Database, Globe, Layout, ShoppingCart } from "lucide-react";
import NextImage from "next/image";
import Link from "next/link";
import { useMemo, type ReactNode } from "react";
import HeadLineText from "@/components/ui/HeadLineText";

/* ── Shared types ── */

export type CardVariant = "grid" | "resource" | "box";

/* ── Grid variant types (from GridCard) ── */

type GridSize = "sm" | "md" | "lg";
type GridAlign = "left" | "center" | "right";
type GridCardVariant = "default" | "ghost";
type SeparatorTone = "soft" | "default" | "strong";

const gridSizeMap: Record<GridSize, string> = {
  sm: "px-6 py-7",
  md: "px-8 py-10",
  lg: "px-10 py-14",
};

const gridAlignMap: Record<GridAlign, string> = {
  left: "items-start text-left",
  center: "items-center text-center",
  right: "items-end text-right",
};

const gridVariantMap: Record<Card variant="grid"Variant, string> = {
  default: "",
  ghost: "bg-neutral-50/80 dark:bg-white/[0.02]",
};

const separatorMap: Record<SeparatorTone, string> = {
  soft: "[border-color:rgba(15,23,42,0.12)] dark:[border-color:rgba(148,163,184,0.2)]",
  default: "[border-color:rgba(15,23,42,0.18)] dark:[border-color:rgba(148,163,184,0.26)]",
  strong: "[border-color:rgba(0,0,0,0.99)] dark:[border-color:rgba(255,255,255,0.06)]",
};

function notLastCol(i: number, cols: number) {
  return (i + 1) % cols !== 0;
}
function notLastRow(i: number, total: number, cols: number) {
  return i < total - (total % cols || cols);
}
function borderClasses(index: number, total: number, columns: number, separatorTone: SeparatorTone) {
  const p: string[] = [separatorMap[separatorTone]];
  if (notLastRow(index, total, 1)) p.push("border-b");
  p.push(notLastCol(index, 2) ? "sm:border-r" : "sm:border-r-0");
  p.push(notLastRow(index, total, 2) ? "sm:border-b" : "sm:border-b-0");
  p.push(notLastCol(index, columns) ? "lg:border-r" : "lg:border-r-0");
  p.push(notLastRow(index, total, columns) ? "lg:border-b" : "lg:border-b-0");
  return p.join(" ");
}

/* ── ResourceBox icon map ── */

const iconMap: Record<string, ReactNode> = {
  "web-design": <Globe className="w-6 h-6" />,
  "full-stack": <Code className="w-6 h-6" />,
  "UI/UX": <Layout className="w-6 h-6" />,
  dashboard: <BarChart3 className="w-6 h-6" />,
  database: <Database className="w-6 h-6" />,
  ecommerce: <ShoppingCart className="w-6 h-6" />,
};

/* ── Unified props ── */

export type CardProps = {
  variant?: CardVariant;
  className?: string;
  children?: ReactNode;

  // grid variant
  index?: number;
  total?: number;
  columns?: number;
  size?: GridSize;
  align?: GridAlign;
  gridVariant?: GridCardVariant;
  separatorTone?: SeparatorTone;

  // resource variant
  post?: {
    category?: string;
    title: string;
    description?: string;
    readTime?: string;
    button?: string;
    image?: string;
    href?: string;
  };
  showCategory?: boolean;
  showDescription?: boolean;
  showCTA?: boolean;
  imageClassName?: string;
  contentClassName?: string;

  // box variant
  icon?: string;
  title?: string;
  description?: string;
  tech?: string[];
  bgColor?: string;
};

/* ── Component ── */

export default function Card({
  variant = "resource",
  className,
  children,
  // grid
  index = 0,
  total = 1,
  columns = 3,
  size = "md",
  align = "left",
  gridVariant = "default",
  separatorTone = "default",
  // resource
  post,
  showCategory = false,
  showDescription = true,
  showCTA = true,
  imageClassName,
  contentClassName,
  // box
  icon,
  title,
  description,
  tech = [],
  bgColor,
}: CardProps) {
  const borders = useMemo(
    () => borderClasses(index, total, columns, separatorTone),
    [index, total, columns, separatorTone],
  );

  if (variant === "grid") {
    return (
      <div
        className={cn(
          "relative w-full flex flex-col",
          "transition-colors duration-150",
          "hover:bg-neutral-100 dark:hover:bg-white/1.5",
          gridSizeMap[size],
          gridAlignMap[align],
          gridVariantMap[gridVariant],
          borders,
          className,
        )}
      >
        {children}
      </div>
    );
  }

  if (variant === "resource") {
    const p = post!;
    return (
      <article className={cn("w-full", className)}>
        <div className={cn("relative h-50 mb-6 overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800", imageClassName)}>
          {p.image && (
            <img src={p.image} alt={p.title} className="h-full w-full object-cover" />
          )}
        </div>
        <div className={cn(contentClassName)}>
          {showCategory && p.category && (
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className="rounded-full bg-orange-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-orange-600 dark:bg-orange-900/30 dark:text-orange-300">
                {p.category}
              </span>
              {p.readTime && (
                <span className="text-xs font-medium text-orange-500 dark:text-orange-300">{p.readTime}</span>
              )}
            </div>
          )}
          <HeadLineText as="h3" fontSize="twoXl" fontWeight="bold" align="none" className="text-left">
            {p.title}
          </HeadLineText>
          {showDescription && p.description && (
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{p.description}</p>
          )}
          {showCTA && (
            <Link
              href={p.href ?? "#"}
              className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-gray-800 dark:text-gray-200 hover:gap-2 transition-all"
            >
              {p.button ?? "Read more"}
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          )}
        </div>
      </article>
    );
  }

  // variant === "box"
  return (
    <div
      className={cn(
        "rounded-2xl p-6 flex flex-col gap-4",
        "border border-black/5 dark:border-white/10",
        "shadow-sm transition-all duration-300",
        "hover:shadow-xl hover:-translate-y-1",
        bgColor,
        className,
      )}
    >
      {icon && <div className="text-primary">{iconMap[icon] ?? null}</div>}
      {title && (
        <HeadLineText as="h3" fontSize="md" fontWeight="bold" align="left" className="text-foreground dark:text-white">
          {title}
        </HeadLineText>
      )}
      {description && (
        <HeadLineText as="p" fontSize="sm" fontWeight="light" align="left" className="text-muted-foreground leading-relaxed">
          {description}
        </HeadLineText>
      )}
      {tech.length > 0 && (
        <div className="flex gap-2 mt-2 flex-wrap">
          {tech.map((t, i) => (
            <div key={i} className="w-9 h-9 flex items-center justify-center bg-white dark:bg-gray-800 border border-black/5 dark:border-white/10 rounded-md">
              <NextImage src={`/${t}`} alt="tech" width={24} height={24} />
            </div>
          ))}
        </div>
      )}
      {children}
    </div>
  );
}
