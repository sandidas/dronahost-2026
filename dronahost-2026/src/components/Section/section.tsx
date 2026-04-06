import clsx from "clsx";
import type { CSSProperties, ElementType, ReactNode } from "react";

// ─── Container Sizes ─────────────────────────────────────────────────────────
// Controls the max-width of the inner content container (centered with mx-auto).
// Use "full" to skip the inner container entirely and go edge-to-edge.
const sizeClass = {
  xs: "max-w-2xl", // ~672px  — narrow prose, modals, auth pages
  sm: "max-w-3xl", // ~768px  — blog posts
  md: "max-w-5xl", // ~1024px — standard content pages
  lg: "max-w-7xl", // ~1280px — DEFAULT, works for most sections
  xl: "max-w-[90rem]", // ~1440px — wide dashboards, marketing heroes
  "2xl": "max-w-screen-2xl", // ~1536px — ultra-wide layouts
  full: "w-full", // no inner container — children fill edge-to-edge
} as const;

// ─── Height Presets ───────────────────────────────────────────────────────────
// Sets a minimum height on the outer section element.
// When any height other than "auto" is set, the section becomes a flex column
// so vertical alignment (align prop) works automatically.
const heightClass = {
  auto: "", // DEFAULT — height driven by content only
  screen: "min-h-screen", // full viewport height — hero sections, landing pages
  "screen/2": "min-h-[50vh]", // half viewport — split layouts, medium heroes
  "screen/3": "min-h-[33vh]", // one-third viewport — compact feature banners
  "screen/4": "min-h-[25vh]", // one-quarter viewport — slim promo strips
  "2/3": "min-h-[66vh]", // two-thirds viewport — tall feature sections
  xs: "min-h-[200px]", // fixed small — banners, callouts
  sm: "min-h-[320px]", // fixed compact — cards, small panels
  md: "min-h-[480px]", // fixed medium — standard feature sections
  lg: "min-h-[640px]", // fixed large — prominent sections
  xl: "min-h-[800px]", // fixed extra-large — hero alternatives
} as const;

// ─── Vertical Alignment ───────────────────────────────────────────────────────
// Controls how the inner container is positioned vertically inside the section.
// Only meaningful when a height preset is set (anything other than "auto").
// When height="auto" these still apply if the outer flex is triggered.
const verticalAlignClass = {
  top: "justify-start", // content at the top
  center: "justify-center", // content dead-center — DEFAULT when height is set
  bottom: "justify-end", // content pinned to bottom
  between: "justify-between", // first + last child at opposite ends
} as const;

// ─── Horizontal Alignment ────────────────────────────────────────────────────
// Controls horizontal alignment of the inner container's children.
const horizontalAlignClass = {
  left: "", // DEFAULT — left-aligned, no text-center
  center: "items-center text-center", // centered children + centered text
  right: "items-end text-right", // right-aligned children + right text
} as const;
const bgImageBreakpointClass = {
  always: "",
  sm: "hidden sm:block",
  md: "hidden md:block",
  lg: "hidden lg:block",
  xl: "hidden xl:block",
  "2xl": "hidden 2xl:block",
} as const;

// ─── Padding Presets ─────────────────────────────────────────────────────────
// Responsive px (horizontal) + py (vertical) combos.
// Values scale across breakpoints automatically — pick by visual weight.
// NOTE: When height is set, padding still applies. For a truly centered hero
// with no padding fighting the centering, use padding="none" + height="screen".
const paddingClass = {
  none: "p-0",
  xs: "px-4 py-6 sm:px-6 sm:py-8", // tight — toolbars, banners, inline callouts
  sm: "px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12", // compact — cards, sidebar panels
  md: "px-6 py-10 sm:px-8 sm:py-12 md:px-10 md:py-16 lg:px-12 lg:py-20", // standard — generic content sections
  lg: "px-8 py-14 sm:px-10 sm:py-16 md:px-12 md:py-20 lg:px-16 lg:py-24", // spacious — features, testimonials, pricing
  xl: "px-10 py-16 sm:px-12 sm:py-20 md:px-16 md:py-24 lg:px-20 lg:py-28 xl:px-24 xl:py-32", // airy — large marketing sections
  responsive: "px-6 py-16 sm:px-8 sm:py-20 md:px-12 lg:px-16 xl:px-20 xl:py-28", // DEFAULT — balanced, scales across all breakpoints
  topZero: "px-6 pb-16 sm:px-8 sm:pb-20 md:px-12 lg:px-16 xl:px-20 xl:pb-28", // no top padding — directly under sticky nav / prev section
  bottomZero: "px-6 pt-16 sm:px-8 sm:pt-20 md:px-12 lg:px-16 xl:px-20 xl:pt-28", // no bottom padding — before a footer or next section
  hero: "px-6 pt-24 pb-20 sm:px-8 sm:pt-28 sm:pb-24 md:px-12 lg:px-16 xl:px-20 xl:pt-36 xl:pb-32", // extra-tall top — above-the-fold heroes clearing a fixed navbar
} as const;

// ─── Section Variants ────────────────────────────────────────────────────────
// Visual surface treatment applied to the outer section element.
const variantClass = {
  default: "", // no background — inherits page bg. DEFAULT
  ghost: "bg-transparent", // explicitly transparent

  // Solid surfaces
  surface: "bg-card border-b border-border", // Shadcn card token + bottom divider — header bars / nav areas
  inset: "bg-muted/50 rounded-2xl border border-border/60", // muted fill + rounded corners — feature blocks nested inside a page

  // Glass / frosted — best on top of gradient or image backgrounds
  glass: "bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.12)]", // thin white-tint frosted glass — dark page panels
  "glass-dark": "bg-black/30 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]", // stronger dark fill + blur — dark mode glass cards
  "glass-light": "bg-white/60 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08)]", // heavy white fill — light page frosted overlays

  // Highlight / accent cards
  highlight: "bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl shadow-lg", // primary-tinted gradient — key CTAs or featured sections
  featured: "bg-gradient-to-br from-yellow-400/10 via-orange-400/5 to-transparent border border-yellow-400/20 rounded-2xl", // warm amber/orange — pricing, launch banners, limited-time offers

  // App / dashboard shells
  dashboard: "bg-card border border-border rounded-xl shadow-md", // card-token bg + border + shadow — dashboard widget containers
  panel: "bg-muted border border-border/80 rounded-lg", // muted bg — sidebar panels, secondary content areas
} as const;

// ─── Overlay tints ────────────────────────────────────────────────────────────
// Applied as a CSS `::before` pseudo-element between the background image and
// the content (z-[1]). Content is automatically promoted to z-[2].
const overlayClass = {
  none: "",
  dark: "before:absolute before:inset-0 before:bg-black/50 before:z-[1]", // 50% black — readable text over any photo
  light: "before:absolute before:inset-0 before:bg-white/30 before:z-[1]", // 30% white — soften a bright or busy image
  "brand-dark": "before:absolute before:inset-0 before:bg-primary/40 before:z-[1]", // 40% primary color wash — on-brand hero overlays
  noise: "before:absolute before:inset-0 before:bg-[url('/noise.png')] before:opacity-[0.035] before:z-[1]", // grain texture — requires /public/noise.png
} as const;

/**
 * Breakpoint below which the background image is hidden.
 * - `"sm"`  — hidden on xs only         (shows from 640px+)
 * - `"md"`  — hidden on xs–sm           (shows from 768px+)
 * - `"lg"`  — hidden on xs–md           (shows from 1024px+) ← most common for bg images
 * - `"xl"`  — hidden on xs–lg           (shows from 1280px+)
 * - `"2xl"` — hidden on xs–xl           (shows from 1536px+)
 * - `"always"` — shows on all screens   ← DEFAULT
 * @default "always"
 * @example bgImageBreakpoint="lg"  // bg image only on desktop
 */

// ─── Props ───────────────────────────────────────────────────────────────────
interface SectionProps {
  children: ReactNode;

  /**
   * The HTML element (or React component) rendered as the section root.
   * @default "section"
   * @example as="article"
   * @example as="main"
   * @example as="div"
   */
  as?: ElementType;

  // ── Layout ──────────────────────────────────────────────────────────────────

  /**
   * Max-width of the inner content container (centered with `mx-auto`).
   *
   * | Value   | ~Pixels | Best for                            |
   * |---------|---------|-------------------------------------|
   * | `"xs"`  | 672px   | Narrow prose, modals, auth pages    |
   * | `"sm"`  | 768px   | Blog posts                          |
   * | `"md"`  | 1024px  | Standard content pages              |
   * | `"lg"`  | 1280px  | **Default** — most sections         |
   * | `"xl"`  | 1440px  | Wide dashboards, marketing heroes   |
   * | `"2xl"` | 1536px  | Ultra-wide layouts                  |
   * | `"full"`| —       | No inner container, edge-to-edge    |
   *
   * @default "lg"
   */
  size?: keyof typeof sizeClass;

  /**
   * Minimum height of the section.
   *
   * When set to anything other than `"auto"`, the section automatically becomes
   * a flex column — meaning the `align` (vertical) and `centered` (horizontal)
   * props will correctly center content within the full height.
   *
   * | Value       | CSS                | Best for                              |
   * |-------------|-------------------|---------------------------------------|
   * | `"auto"`    | —                 | **Default** — height by content only  |
   * | `"screen"`  | `min-h-screen`    | Full-viewport heroes, landing pages   |
   * | `"screen/2"`| `min-h-[50vh]`   | Half-viewport split layouts           |
   * | `"screen/3"`| `min-h-[33vh]`   | One-third viewport feature banners    |
   * | `"screen/4"`| `min-h-[25vh]`   | Slim promo strips                     |
   * | `"2/3"`     | `min-h-[66vh]`   | Tall feature sections                 |
   * | `"xs"`      | `min-h-[200px]`  | Fixed small — banners, callouts       |
   * | `"sm"`      | `min-h-[320px]`  | Fixed compact — cards, panels         |
   * | `"md"`      | `min-h-[480px]`  | Fixed medium — standard features      |
   * | `"lg"`      | `min-h-[640px]`  | Fixed large — prominent sections      |
   * | `"xl"`      | `min-h-[800px]`  | Fixed extra-large — hero alternatives |
   *
   * @default "auto"
   * @example
   * // Full-screen hero, content perfectly centered top-to-bottom
   * <Section height="screen" align="center" centered>
   *   <HeroContent />
   * </Section>
   */
  height?: keyof typeof heightClass;

  /**
   * Vertical alignment of the inner container within the section.
   * Only meaningful when `height` is set (anything other than `"auto"`).
   * Automatically activates the flex column layout needed for this to work.
   *
   * | Value      | Effect                                  |
   * |------------|-----------------------------------------|
   * | `"top"`    | Content at the top                      |
   * | `"center"` | Content dead-center — **Default**       |
   * | `"bottom"` | Content pinned to the bottom            |
   * | `"between"`| First + last child at opposite ends     |
   *
   * @default "center"
   * @example align="top"    // useful when height="screen" + padding="hero"
   * @example align="bottom" // pin content to the bottom of the section
   */
  align?: keyof typeof verticalAlignClass;

  /**
   * Horizontal alignment + text alignment of children inside the inner container.
   *
   * | Value      | Effect                                        |
   * |------------|-----------------------------------------------|
   * | `"left"`   | Left-aligned children, left text — **Default**|
   * | `"center"` | Centered children + `text-center`             |
   * | `"right"`  | Right-aligned children + `text-right`         |
   *
   * @default "left"
   * @example
   * // Perfectly centered hero — both axes
   * <Section height="screen" align="center" hAlign="center">
   *   <HeroContent />
   * </Section>
   */
  hAlign?: keyof typeof horizontalAlignClass;

  /**
   * Responsive padding preset.
   *
   * | Value          | Visual weight | Best for                                    |
   * |----------------|---------------|---------------------------------------------|
   * | `"none"`       | none          | Custom padding via `className`              |
   * | `"xs"`         | tight         | Toolbars, banners, inline callouts          |
   * | `"sm"`         | compact       | Cards, sidebar panels, small feature blocks |
   * | `"md"`         | standard      | Generic content sections                    |
   * | `"lg"`         | spacious      | Feature highlights, testimonials, pricing   |
   * | `"xl"`         | airy          | Large marketing sections, full-page splits  |
   * | `"responsive"` | balanced      | **Default** — scales across all breakpoints |
   * | `"topZero"`    | no top gap    | Directly under a sticky nav / prev section  |
   * | `"bottomZero"` | no bottom gap | Before a footer or next section             |
   * | `"hero"`       | tall top      | Above-the-fold heroes (clears fixed navbar) |
   *
   * @default "responsive"
   */
  padding?: keyof typeof paddingClass;

  // ── Appearance ──────────────────────────────────────────────────────────────

  /**
   * Visual surface treatment of the section.
   *
   * | Value          | Description                                              |
   * |----------------|----------------------------------------------------------|
   * | `"default"`    | No background — inherits page bg. **Default**            |
   * | `"ghost"`      | Explicitly transparent                                   |
   * | `"surface"`    | Shadcn `card` token + bottom border (header bars)        |
   * | `"inset"`      | Muted rounded block (nested feature boxes)               |
   * | `"glass"`      | Thin white-tint frosted glass — dark backgrounds         |
   * | `"glass-dark"` | Stronger dark-fill glass — dark mode cards               |
   * | `"glass-light"`| Heavy white frosted glass — light backgrounds            |
   * | `"highlight"`  | Primary-tinted gradient card — CTAs, key features        |
   * | `"featured"`   | Warm amber gradient — pricing, banners, limited offers   |
   * | `"dashboard"`  | Card-token bg + border + shadow — widget containers      |
   * | `"panel"`      | Muted bg — sidebars, secondary content areas             |
   *
   * @default "default"
   */
  variant?: keyof typeof variantClass;

  /**
   * `::before` pseudo-element overlay between `bgImage` and content.
   *
   * | Value          | Effect                                                   |
   * |----------------|----------------------------------------------------------|
   * | `"none"`       | No overlay — **Default**                                 |
   * | `"dark"`       | 50% black — text legible over any photo                  |
   * | `"light"`      | 30% white — soften a bright or busy image                |
   * | `"brand-dark"` | 40% primary color wash — on-brand hero overlays          |
   * | `"noise"`      | Grain texture (requires `/public/noise.png`)             |
   *
   * Content is automatically promoted to `z-[2]` when an overlay is active.
   * @default "none"
   */
  overlay?: keyof typeof overlayClass;

  // ── Background image ────────────────────────────────────────────────────────

  /**
   * URL or path to a background image for the section.
   * Pair with `overlay` to keep text legible over photos.
   * @example bgImage="/images/hero.jpg"
   * @example bgImage="https://example.com/photo.webp"
   */
  bgImage?: string;

  /**
   * Position of the background image.
   * @default "center"
   */
  bgImagePosition?: "center" | "top" | "bottom" | "left" | "right" | "top left" | "top center" | "top right" | "center left" | "center right" | "bottom left" | "bottom center" | "bottom right";

  /**
   * Size / scale of the background image.
   * - `"cover"`     — scales to fill the section, may crop edges  ← **Default**
   * - `"contain"`   — scales to fit fully inside, may show empty space
   * - `"auto"`      — uses the image's natural pixel size
   * - `"100%"`      — stretches to full container width
   * - `"100% auto"` — full width, height scales proportionally
   * - `"auto 100%"` — full height, width scales proportionally
   * - `"50%"`       — half the container width
   * @default "cover"
   */
  bgImageSize?: "cover" | "contain" | "auto" | "50%" | "75%" | "100%" | "100% auto" | "auto 100%" | "50% 50%";

  bgImageBreakpoint?: "always" | "sm" | "md" | "lg" | "xl" | "2xl";

  // ── Overrides ───────────────────────────────────────────────────────────────

  /**
   * Inline styles on the outer section element.
   * Merged after `bgImage` styles — use for one-off values not expressible in Tailwind.
   */
  style?: CSSProperties;

  /**
   * Extra Tailwind classes for the inner max-width container div.
   * Use for one-off layout tweaks without touching the outer element.
   * @example containerClassName="grid grid-cols-2 gap-12"
   */
  containerClassName?: string;

  /**
   * Extra Tailwind classes on the outer section element.
   * @example className="border-t border-border"
   */
  className?: string;

  // ── Accessibility ────────────────────────────────────────────────────────────

  /**
   * HTML `id` — useful as a scroll-target anchor or for `aria-labelledby`.
   * @example id="services"  // → <a href="#services">
   */
  id?: string;

  /**
   * Accessible label when there is no visible heading inside this section.
   * Use either `aria-label` or `aria-labelledby`, not both.
   */
  "aria-label"?: string;

  /**
   * ID of the visible heading element that labels this section.
   * Use either `aria-label` or `aria-labelledby`, not both.
   * @example aria-labelledby="services-heading"
   */
  "aria-labelledby"?: string;
  bgPosition?: "bg-fixed" | "bg-scroll";
}

/**
 * Section
 * ───────
 * SaaS-grade full-width layout primitive for every page section.
 *
 * Features:
 *  - Responsive padding presets (`padding`)
 *  - Container max-width presets (`size`)
 *  - Minimum height presets — viewport-relative or fixed (`height`)
 *  - Automatic flex layout when height is set — no manual class needed
 *  - Vertical alignment within the section (`align`)
 *  - Horizontal alignment + text alignment (`hAlign`)
 *  - Surface variants: transparent, glass, solid, gradient, dashboard (`variant`)
 *  - Background images with CSS `::before` overlay tints (`bgImage` + `overlay`)
 *  - Polymorphic root element (`as`)
 *  - Full accessibility support (`id`, `aria-label`, `aria-labelledby`)
 *
 * ─── Common patterns ────────────────────────────────────────────────────────
 *
 * @example Full-screen hero — content perfectly centered both axes
 * ```tsx
 * <Section
 *   height="screen"
 *   align="center"
 *   hAlign="center"
 *   bgImage="/images/hero.jpg"
 *   bgImagePosition="top center"
 *   overlay="dark"
 *   padding="none"
 * >
 *   <HeroContent />
 * </Section>
 * ```
 *
 * @example Half-screen feature banner — content at top
 * ```tsx
 * <Section height="screen/2" align="top" padding="hero">
 *   <FeatureBanner />
 * </Section>
 * ```
 *
 * @example Standard content section (defaults)
 * ```tsx
 * <Section>
 *   <h2>About Us</h2>
 * </Section>
 * ```
 *
 * @example Glass card on a gradient background
 * ```tsx
 * <Section variant="glass-dark" size="md" padding="xl" hAlign="center">
 *   <ContactForm />
 * </Section>
 * ```
 *
 * @example Narrow article body
 * ```tsx
 * <Section as="article" size="sm" padding="lg">
 *   <BlogContent />
 * </Section>
 * ```
 *
 * @example Adjacent sections — eliminate the double vertical gap
 * ```tsx
 * <Section padding="bottomZero"><HeroContent /></Section>
 * <Section padding="topZero"><FeatureGrid /></Section>
 * ```
 *
 * @example Fixed-height dashboard widget
 * ```tsx
 * <Section as="aside" height="md" align="top" variant="dashboard" size="xs" padding="sm">
 *   <ActivityFeed />
 * </Section>
 * ```
 */

const Section = ({
  as: Tag = "section",
  size = "lg", // max-w-7xl inner container
  height = "auto", // no forced height — driven by content
  align = "center", // vertical centering when height is set
  hAlign = "left", // horizontal: left-aligned by default
  padding = "responsive", // balanced px + py, scales across breakpoints
  variant = "default", // no background — inherits page bg
  overlay = "none", // no ::before overlay tint
  bgImage,
  bgImagePosition = "center", // "center" | "top" | "bottom" | "top left" …
  bgImageSize = "cover", // "cover" | "contain" | "auto" | "100%" …
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

  // When a height is set, the outer section becomes a flex column so that
  // `justify-*` (vertical) and inner `items-*` (horizontal) work correctly.
  const outerClasses = clsx("relative w-full", hasBgImage && "overflow-hidden", heightClass[height], hasHeight && ["flex flex-col", verticalAlignClass[align]], paddingClass[padding], variantClass[variant], hasOverlay && overlayClass[overlay], className);

  // Only inject the background-image CSS when breakpoint is "always".
  // For responsive breakpoints we use a pseudo-element div instead (see below),
  // so the inline style must stay empty to avoid overriding it on mobile.
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

  // Inner container — max-width + horizontal + vertical z-index promotion
  const containerClasses = clsx(
    size !== "full" && [sizeClass[size], "mx-auto"],
    // w-full ensures the container fills the flex column and respects max-width
    hasHeight && "w-full",
    horizontalAlignClass[hAlign],
    // When hAlign="center" we need flex col on the container too
    hAlign !== "left" && "flex flex-col",
    (hasBgImage || hasOverlay) && "relative z-[2]",
    containerClassName,
  );

  const fullWidthClasses = clsx("w-full", horizontalAlignClass[hAlign], hAlign !== "left" && "flex flex-col", (hasBgImage || hasOverlay) && "relative z-[2]", containerClassName);

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

// ─── Named re-exports ────────────────────────────────────────────────────────
// Import these maps in other components for consistent token usage:
//   import { sizeClass, heightClass, paddingClass } from "@/components/global/Section";
export { heightClass, horizontalAlignClass, overlayClass, paddingClass, sizeClass, variantClass, verticalAlignClass };
export type { SectionProps };

