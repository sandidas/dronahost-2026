# Component Consolidation Plan A — UI Primitives

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move and consolidate six atomic primitive components into `components/ui/`, updating every import across the codebase.

**Architecture:** Five sequential tasks in dependency order. Section and HeadLineText are straight moves with import updates. Image consolidates three lazyLoadImage variants into one "use client" component. Card consolidates three card variants (GridCard, ResourceCard, ResourceBox) into a single multi-variant component. Badge is a new primitive. JsonLd moves from seo/ to sections/ (handled in Plan C — only the file creation happens here). Each task ends with a TypeScript compile check and commit.

**Tech Stack:** Next.js 16 App Router, TypeScript strict, Tailwind CSS, `cn()` from `utils/cn.tsx`, `next/image`, lucide-react (already installed)

---

## File Map

| File | Action |
|---|---|
| `components/ui/Section.tsx` | Move from `components/section/section.tsx` — no implementation change |
| `components/ui/HeadLineText.tsx` | Move from `components/HeadLineText/HeadLineText.tsx` — no implementation change |
| `components/ui/Image.tsx` | Create — consolidates LazyLoadImageComp, LazyLoadImageCompWithSEO, LazyLoadImageCompSkeleton |
| `components/ui/Card.tsx` | Create — consolidates GridCard, ResourceCard, ResourceBox |
| `components/ui/Badge.tsx` | Create — new pill/tag primitive |
| `components/section/section.tsx` | Keep for now — Plan C removes it after import updates |
| `components/HeadLineText/HeadLineText.tsx` | Keep for now — Plan C removes it after import updates |
| `components/lazyLoadImage/*.tsx` | Keep for now — Plan C removes after import updates |
| `components/Card/*.tsx` | Keep for now — Plan C removes after import updates |

> Note: Old files are NOT deleted in this plan. Deletion happens in Plan C after all imports are updated. This keeps the codebase compiling throughout.

---

### Task 1: Create `components/ui/Section.tsx`

**Files:**
- Create: `components/ui/Section.tsx`

The implementation is an exact copy of `components/section/section.tsx`. No logic changes — only the file location changes. The old file stays in place until Plan C.

- [ ] **Step 1: Create the file**

Create `components/ui/Section.tsx` with this exact content (copied from `components/section/section.tsx`):

```tsx
import clsx from "clsx";
import { CSSProperties, ElementType, ReactNode } from "react";

const sizeClass = {
  xs: "max-w-2xl",
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-7xl",
  xl: "max-w-[90rem]",
  "2xl": "max-w-screen-2xl",
  full: "w-full",
} as const;

const heightClass = {
  auto: "",
  screen: "min-h-screen",
  "screen/2": "min-h-[50vh]",
  "screen/3": "min-h-[33vh]",
  "screen/4": "min-h-[25vh]",
  "2/3": "min-h-[66vh]",
  xs: "min-h-[200px]",
  sm: "min-h-[320px]",
  md: "min-h-[480px]",
  lg: "min-h-[640px]",
  xl: "min-h-[800px]",
} as const;

const verticalAlignClass = {
  top: "justify-start",
  center: "justify-center",
  bottom: "justify-end",
  between: "justify-between",
} as const;

const horizontalAlignClass = {
  left: "",
  center: "items-center text-center",
  right: "items-end text-right",
} as const;

const bgImageBreakpointClass = {
  always: "",
  sm: "hidden sm:block",
  md: "hidden md:block",
  lg: "hidden lg:block",
  xl: "hidden xl:block",
  "2xl": "hidden 2xl:block",
} as const;

const paddingClass = {
  none: "p-0",
  xs: "px-4 py-6 sm:px-6 sm:py-8",
  sm: "px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12",
  md: "px-6 py-10 sm:px-8 sm:py-12 md:px-10 md:py-16 lg:px-12 lg:py-20",
  lg: "px-8 py-14 sm:px-10 sm:py-16 md:px-12 md:py-20 lg:px-16 lg:py-24",
  xl: "px-10 py-16 sm:px-12 sm:py-20 md:px-16 md:py-24 lg:px-20 lg:py-28 xl:px-24 xl:py-32",
  responsive: "px-6 py-16 sm:px-8 sm:py-20 md:px-12 lg:px-16 xl:px-20 xl:py-28",
  topZero: "px-6 pb-16 sm:px-8 sm:pb-20 md:px-12 lg:px-16 xl:px-20 xl:pb-28",
  bottomZero: "px-6 pt-16 sm:px-8 sm:pt-20 md:px-12 lg:px-16 xl:px-20 xl:pt-28",
  hero: "px-6 pt-24 pb-20 sm:px-8 sm:pt-28 sm:pb-24 md:px-12 lg:px-16 xl:px-20 xl:pt-36 xl:pb-32",
} as const;

const variantClass = {
  default: "",
  ghost: "bg-transparent",
  surface: "bg-card border-b border-border",
  inset: "bg-muted/50 rounded-2xl border border-border/60",
  glass: "bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.12)]",
  "glass-dark": "bg-black/30 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
  "glass-light": "bg-white/60 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08)]",
  highlight: "bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl shadow-lg",
  featured: "bg-gradient-to-br from-yellow-400/10 via-orange-400/5 to-transparent border border-yellow-400/20 rounded-2xl",
  dashboard: "bg-card border border-border rounded-xl shadow-md",
  panel: "bg-muted border border-border/80 rounded-lg",
} as const;

const overlayClass = {
  none: "",
  dark: "before:absolute before:inset-0 before:bg-black/50 before:z-[1]",
  light: "before:absolute before:inset-0 before:bg-white/30 before:z-[1]",
  "brand-dark": "before:absolute before:inset-0 before:bg-primary/40 before:z-[1]",
  noise: "before:absolute before:inset-0 before:bg-[url('/noise.png')] before:opacity-[0.035] before:z-[1]",
} as const;

interface SectionProps {
  children: ReactNode;
  as?: ElementType;
  size?: keyof typeof sizeClass;
  height?: keyof typeof heightClass;
  align?: keyof typeof verticalAlignClass;
  hAlign?: keyof typeof horizontalAlignClass;
  padding?: keyof typeof paddingClass;
  variant?: keyof typeof variantClass;
  overlay?: keyof typeof overlayClass;
  bgImage?: string;
  bgImagePosition?: "center" | "top" | "bottom" | "left" | "right" | "top left" | "top center" | "top right" | "center left" | "center right" | "bottom left" | "bottom center" | "bottom right";
  bgImageSize?: "cover" | "contain" | "auto" | "50%" | "75%" | "100%" | "100% auto" | "auto 100%" | "50% 50%";
  bgImageBreakpoint?: "always" | "sm" | "md" | "lg" | "xl" | "2xl";
  bgPosition?: "bg-fixed" | "bg-scroll";
  style?: CSSProperties;
  containerClassName?: string;
  className?: string;
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

const Section = ({
  as: Tag = "section",
  size = "2xl",
  height = "auto",
  align = "center",
  hAlign = "left",
  padding = "responsive",
  variant = "default",
  overlay = "none",
  bgImage,
  bgImagePosition = "center",
  bgImageSize = "cover",
  bgPosition = "bg-fixed",
  style,
  className = "",
  containerClassName = "",
  children,
  id,
  bgImageBreakpoint = "always",
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
}: SectionProps) => {
  const hasBgImage = Boolean(bgImage);
  const hasOverlay = overlay !== "none";
  const hasHeight = height !== "auto";

  const outerClasses = clsx(
    "relative w-full",
    hasBgImage && "overflow-hidden",
    heightClass[height],
    hasHeight && ["flex flex-col", verticalAlignClass[align]],
    paddingClass[padding],
    variantClass[variant],
    hasOverlay && overlayClass[overlay],
    className,
  );

  const bgStyle: CSSProperties =
    bgImage && bgImageBreakpoint === "always"
      ? {
          backgroundImage: `url('${bgImage}')`,
          backgroundPosition: bgImagePosition,
          backgroundSize: bgImageSize,
          backgroundRepeat: "no-repeat",
          ...style,
        }
      : { ...style };

  const containerClasses = clsx(
    size !== "full" && [sizeClass[size], "mx-auto"],
    hasHeight && "w-full",
    horizontalAlignClass[hAlign],
    hAlign !== "left" && "flex flex-col",
    (hasBgImage || hasOverlay) && "relative z-[2]",
    containerClassName,
  );

  const fullWidthClasses = clsx(
    "w-full",
    horizontalAlignClass[hAlign],
    hAlign !== "left" && "flex flex-col",
    (hasBgImage || hasOverlay) && "relative z-[2]",
    containerClassName,
  );

  return (
    <Tag id={id} className={outerClasses} style={bgStyle} aria-label={ariaLabel} aria-labelledby={ariaLabelledBy}>
      {bgImage && bgImageBreakpoint !== "always" && (
        <div
          aria-hidden="true"
          className={clsx("absolute inset-0 z-0", bgImageBreakpointClass[bgImageBreakpoint])}
          style={{
            backgroundImage: `url('${bgImage}')`,
            backgroundPosition: bgImagePosition,
            backgroundSize: bgImageSize,
            backgroundRepeat: "no-repeat",
            backgroundAttachment: bgPosition === "bg-fixed" ? "fixed" : "scroll",
          }}
        />
      )}
      {size === "full" ? (
        <div className={fullWidthClasses}>{children}</div>
      ) : (
        <div className={containerClasses}>
          <div className="w-full">{children}</div>
        </div>
      )}
    </Tag>
  );
};

export default Section;

export { heightClass, horizontalAlignClass, overlayClass, paddingClass, sizeClass, variantClass, verticalAlignClass };
export type { SectionProps };
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: No errors. If you see `Cannot find module 'clsx'`, check `package.json` — it should already be present.

- [ ] **Step 3: Commit**

```bash
git add components/ui/Section.tsx
git commit -m "feat: add ui/Section.tsx (copy of section/section.tsx, old file stays for now)"
```

---

### Task 2: Create `components/ui/HeadLineText.tsx`

**Files:**
- Create: `components/ui/HeadLineText.tsx`

Exact copy of `components/HeadLineText/HeadLineText.tsx`. No logic changes.

- [ ] **Step 1: Create the file**

Create `components/ui/HeadLineText.tsx` with this exact content:

```tsx
import { cn } from "@/utils/cn";
import React from "react";

const alignClass = {
  default: "text-center flex flex-col items-center justify-center",
  center: "text-center flex flex-col items-center justify-center",
  left: "text-left flex flex-col items-start justify-center",
  right: "text-right flex flex-col items-end justify-center",
  none: "",
} as const;

type AlignType = keyof typeof alignClass;

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

  const baseFont = "font-[family-name:var(--font-mulish)]";

  const fontWeightClass = {
    default: "font-black",
    bold: "font-bold",
    medium: "font-medium",
    light: "font-light",
    thin: "font-thin",
  };

  const variantClass = {
    default: "",
    highlight: "bg-gradient-to-r from-primary via-primary/70 to-primary inline-block text-transparent bg-clip-text",
    outline: "",
    dashboard: "",
  };

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

  const borderClass = {
    default: "",
    dashed: "border-2 border-dashed border-border",
    solid: "border-2 border-solid border-border",
    none: "border-none",
  };

  const colorClass = {
    default: "",
    primary: "text-primary",
    secondary: "text-secondary-foreground",
    muted: "text-muted-foreground",
    destructive: "text-destructive",
  };

  const commonClasses = cn(
    baseFont,
    fontWeightClass[fontWeight],
    variantClass[variant],
    borderClass[borderStyle],
    sizeClass[fontSize],
    variant !== "highlight" && colorClass[fontColor],
    className,
  );

  return (
    <div className={cn(alignClass[align])}>
      <Component className={commonClasses}>{children}</Component>
    </div>
  );
};

export default HeadLineText;
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add components/ui/HeadLineText.tsx
git commit -m "feat: add ui/HeadLineText.tsx (copy of HeadLineText/HeadLineText.tsx)"
```

---

### Task 3: Create `components/ui/Image.tsx`

**Files:**
- Create: `components/ui/Image.tsx`

Consolidates `LazyLoadImageComp`, `LazyLoadImageCompWithSEO`, and `LazyLoadImageCompSkeleton` into one component. Requires `"use client"` because of `useState` for the shimmer/error state.

Key design decisions:
- `skeleton` prop (default `true`) controls whether to show shimmer while loading
- `priority={true}` images skip the skeleton (no shimmer on LCP images)
- `noscript` fallback preserved for SEO crawlers
- Error fallback (broken image icon) preserved
- The `fill` prop enables `next/image` fill mode (for background-style images)

- [ ] **Step 1: Create the file**

Create `components/ui/Image.tsx`:

```tsx
"use client";

import NextImage from "next/image";
import { useState } from "react";

const BLUR_PLACEHOLDER =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRjBGMEYwIi8+PC9zdmc+";

type ImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  skeleton?: boolean;
  fill?: boolean;
  sizes?: string;
  className?: string;
};

export default function Image({
  src,
  alt,
  width = 600,
  height = 400,
  priority = false,
  skeleton = true,
  fill = false,
  sizes,
  className,
}: ImageProps) {
  const [isLoaded, setIsLoaded] = useState(priority);
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className="relative overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center"
        style={fill ? { width: "100%", height: "100%" } : { width: "100%", aspectRatio: `${width} / ${height}` }}
        role="img"
        aria-label={alt}
      >
        <div className="flex flex-col items-center gap-2 text-neutral-400 dark:text-neutral-500">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          {alt && <span className="text-xs text-center px-4 line-clamp-2">{alt}</span>}
        </div>
      </div>
    );
  }

  const showSkeleton = skeleton && !priority && !isLoaded;

  return (
    <>
      <div className={fill ? "relative w-full h-full" : "relative overflow-hidden rounded-lg"}>
        {showSkeleton && (
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 dark:from-neutral-800 dark:via-neutral-700 dark:to-neutral-800 animate-pulse rounded-lg" />
        )}
        <NextImage
          src={src}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          fill={fill}
          sizes={sizes}
          className={`${className ?? (fill ? "object-cover" : "w-full h-auto")} transition-opacity duration-500 ease-out ${isLoaded ? "opacity-100" : "opacity-0"}`}
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          placeholder="blur"
          blurDataURL={BLUR_PLACEHOLDER}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
        />
      </div>
      <noscript>
        <NextImage
          className={className ?? "h-full w-full"}
          src={src}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          fill={fill}
          alt={alt}
        />
      </noscript>
    </>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add components/ui/Image.tsx
git commit -m "feat: add ui/Image.tsx (consolidates lazyLoadImage variants)"
```

---

### Task 4: Create `components/ui/Card.tsx`

**Files:**
- Create: `components/ui/Card.tsx`

Consolidates `GridCard`, `ResourceCard`, and `ResourceBox` into a single multi-variant component. Three clearly separated render paths based on `variant` prop.

- `variant="grid"` — renders GridCard: border-separated grid cell with children slot
- `variant="resource"` — renders ResourceCard: blog/article card with image, category, title, CTA
- `variant="box"` — renders ResourceBox: icon + title + description + tech badge list

- [ ] **Step 1: Create the file**

Create `components/ui/Card.tsx`:

```tsx
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

const gridVariantMap: Record<GridCardVariant, string> = {
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
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: No errors. `lucide-react` is already in `package.json`.

- [ ] **Step 3: Commit**

```bash
git add components/ui/Card.tsx
git commit -m "feat: add ui/Card.tsx (consolidates GridCard, ResourceCard, ResourceBox)"
```

---

### Task 5: Create `components/ui/Badge.tsx`

**Files:**
- Create: `components/ui/Badge.tsx`

New primitive for pill-shaped labels — plan badges, status tags, taglines ("WordPress Hosting", "Built", "GDPR Compliant").

- [ ] **Step 1: Create the file**

Create `components/ui/Badge.tsx`:

```tsx
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
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: No errors.

- [ ] **Step 3: Update `/v2` showcase to show Badge component**

In `app/(dev)/v2/page.tsx`, add the Badge import and a new ShowcaseSection entry. Find the existing imports block and add:

```tsx
import Badge from "@/components/ui/Badge";
```

Then find the closing `</main>` tag and before it add a new showcase section:

```tsx
{/* ── Badge ── */}
<ShowcaseSection
  id="badge"
  title="Badge"
  status="built"
  notes="Four variants: primary (orange), secondary (blue), success (green), neutral (gray). Used for plan labels, status tags, taglines."
>
  <div className="flex flex-wrap gap-3">
    <Badge variant="primary">WordPress Hosting</Badge>
    <Badge variant="secondary">VPS</Badge>
    <Badge variant="success">GDPR Compliant</Badge>
    <Badge variant="neutral">Beta</Badge>
  </div>
</ShowcaseSection>
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add components/ui/Badge.tsx "app/(dev)/v2/page.tsx"
git commit -m "feat: add ui/Badge.tsx primitive and wire into /v2 showcase"
```
