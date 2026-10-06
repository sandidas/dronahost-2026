import { cn } from "@/utils/cn";
import { BarChart3, Code, Database, Globe, Layout, ShoppingCart } from "lucide-react";
import NextImage from "next/image";
import { Link } from "@/i18n/link";
import { type ReactNode } from "react";
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

const gridVariantMap: Record<GridCardVariant, string> = {
  default: "",
  ghost: "bg-[var(--muted)]",
};

const separatorMap: Record<SeparatorTone, string> = {
  soft: "[border-color:color-mix(in_oklch,var(--border)_60%,transparent)]",
  default: "[border-color:var(--border)]",
  strong: "[border-color:color-mix(in_oklch,var(--foreground)_80%,transparent)]",
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
  const borders = borderClasses(index, total, columns, separatorTone);

  if (variant === "grid") {
    return (
      <div
        className={cn(
          "relative w-full flex flex-col",
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
    if (!post) return null;
    return (
      <article className={cn("w-full", className)}>
        <div className={cn("relative aspect-video mb-6 overflow-hidden rounded-2xl bg-[var(--muted)]", imageClassName)}>
          {post.image && (
            <NextImage src={post.image} alt={post.title} fill sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw" className="object-cover" />
          )}
        </div>
        <div className={cn(contentClassName)}>
          {showCategory && post.category && (
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className="rounded-full bg-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-accent">
                {post.category}
              </span>
              {post.readTime && (
                <span className="text-xs font-medium text-accent/80">{post.readTime}</span>
              )}
            </div>
          )}
          <HeadLineText as="h3" fontSize="twoXl" fontWeight="bold" align="none" className="text-left">
            {post.title}
          </HeadLineText>
          {showDescription && post.description && (
            <p className="mt-3 text-sm text-[var(--muted-foreground)]">{post.description}</p>
          )}
          {showCTA && (
            <Link
              href={post.href ?? "#"}
              className="group inline-flex items-center gap-1 mt-4 text-sm font-semibold text-foreground"
            >
              {post.button ?? "Read more"}
              <span
                aria-hidden="true"
                className="transition-transform duration-150 motion-reduce:transition-none group-hover:translate-x-1"
              >
                →
              </span>
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
        "border border-border bg-card shadow-sm",
        "transition-[box-shadow,transform,border-color] duration-200 motion-reduce:transition-none",
        "motion-safe:hover:shadow-md motion-safe:hover:border-border-strong",
        "motion-safe:hover:-translate-y-0.5",
        bgColor,
        className,
      )}
    >
      {icon && <div className="text-link">{iconMap[icon] ?? null}</div>}
      {title && (
        <HeadLineText as="h3" fontSize="md" fontWeight="bold" align="left" className="text-foreground dark:text-white">
          {title}
        </HeadLineText>
      )}
      {description && (
        <HeadLineText as="p" fontSize="sm" fontWeight="light" align="left" className="text-[var(--muted-foreground)] leading-relaxed">
          {description}
        </HeadLineText>
      )}
      {tech.length > 0 && (
        <div className="flex gap-2 mt-2 flex-wrap">
          {tech.map((t, i) => (
            <div key={i} className="w-9 h-9 flex items-center justify-center bg-[var(--muted)] border rounded-md">
              <NextImage src={`/${t}`} alt={t} width={24} height={24} />
            </div>
          ))}
        </div>
      )}
      {children}
    </div>
  );
}
