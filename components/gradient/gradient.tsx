"use client";

import clsx from "clsx";
import { CSSProperties, ReactNode, useMemo } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type BlobConfig = {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: "purple" | "blue" | "cyan" | "green" | "red" | "orange" | "pink" | "white";
  effect?: "float" | "pulse" | "rotate" | "drift" | "breathe";
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center" | "random";
  opacity?: number; // 0–100
  blur?: "sm" | "md" | "lg" | "xl";
};

type GridVariant = "dots" | "lines" | "crosses" | "hexagons" | "circuit";
type NoiseLevel = "none" | "subtle" | "moderate" | "heavy";
type ScanLines = "none" | "light" | "dark";

export type GradientBackgroundProps = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;

  // ── Base gradient ──
  gradient?: "none" | "indigo-purple" | "blue-cyan" | "emerald-teal" | "rose-pink" | "amber-orange" | "violet-indigo" | "sky-blue" | "sunset" | "aurora" | "midnight" | "custom";
  gradientAngle?: number; // 0–360, default 135
  customGradient?: string; // raw Tailwind/CSS gradient string when gradient="custom"

  // ── Glass / surface variant ──
  variant?: "none" | "glass" | "glass-dark" | "glass-light" | "glass-frosted" | "solid-dark" | "solid-light" | "outlined" | "neon" | "cyberpunk";

  // ── Background image ──
  /** Path or URL to the background image. e.g. "/images/hero.jpg" or "https://..." */
  bgImage?: string;
  /**
   * Opacity of the background image layer.
   * @range 0–100  @default 100
   * @example bgImageOpacity={50}  // 50% transparent
   */
  bgImageOpacity?: number;
  /**
   * Position of the background image.
   * Pick from the dropdown — covers all standard CSS positions.
   * @default "center"
   */
  bgImagePosition?: "center" | "top" | "bottom" | "left" | "right" | "top left" | "top center" | "top right" | "center left" | "center right" | "bottom left" | "bottom center" | "bottom right";
  /**
   * Size/scale of the background image.
   * - `"cover"`     — scales to fill, may crop edges  ← **Default**
   * - `"contain"`   — scales to fit fully, may show empty space
   * - `"auto"`      — uses the image's natural pixel size
   * - `"100%"`      — stretches to full container width
   * - `"100% auto"` — full width, height scales proportionally
   * - `"auto 100%"` — full height, width scales proportionally
   * - `"50%"`       — half the container width
   * @default "cover"
   */
  bgImageSize?: "cover" | "contain" | "auto" | "50%" | "75%" | "100%" | "100% auto" | "auto 100%" | "50% 50%";
  /**
   * CSS `mix-blend-mode` applied to the image layer.
   * Useful for blending the image into the gradient underneath.
   * @default "normal"
   * @example bgImageBlend="multiply"
   * @example bgImageBlend="overlay"
   */
  bgImageBlend?: CSSProperties["mixBlendMode"];

  // ── Decorative shape in the centre ──
  shape?: "none" | "circle" | "box" | "ring" | "diamond" | "hexagon";

  // ── Blobs ──
  blobs?: BlobConfig[];

  // ── Grid / pattern overlay ──
  grid?: GridVariant | "none";
  gridOpacity?: number; // 0–100, default 8

  // ── Noise texture ──
  noise?: NoiseLevel;

  // ── Scan-line effect ──
  scanLines?: ScanLines;

  // ── Glow spots ──
  glowSpots?: Array<{
    color?: string; // CSS color / Tailwind arbitrary e.g. "#6366f1"
    position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
    size?: "sm" | "md" | "lg" | "xl";
    opacity?: number;
  }>;

  // ── Content wrapper ──
  contentClassName?: string;
  minHeight?: CSSProperties["minHeight"];
};

// ─── Lookup maps ─────────────────────────────────────────────────────────────

const GRADIENTS: Record<string, string> = {
  none: "",
  "indigo-purple": "from-indigo-500/25 via-purple-500/30 to-violet-600/20",
  "blue-cyan": "from-blue-500/25 via-sky-500/30 to-cyan-500/20",
  "emerald-teal": "from-emerald-500/25 via-teal-500/30 to-cyan-600/20",
  "rose-pink": "from-rose-500/25 via-pink-500/30 to-fuchsia-600/20",
  "amber-orange": "from-amber-400/25 via-orange-500/30 to-red-500/20",
  "violet-indigo": "from-violet-600/30 via-indigo-600/35 to-blue-700/25",
  "sky-blue": "from-sky-400/20 via-blue-500/25 to-indigo-600/20",
  sunset: "from-orange-400/30 via-rose-500/35 to-purple-600/30",
  aurora: "from-emerald-400/20 via-cyan-500/25 to-violet-600/25",
  midnight: "from-slate-900/80 via-indigo-950/60 to-slate-900/80",
  custom: "",
};

const VARIANT_CLASSES: Record<string, string> = {
  none: "",
  glass: "bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.2)]",
  "glass-dark": "bg-black/30 backdrop-blur-2xl border border-white/8 shadow-[0_12px_48px_rgba(0,0,0,0.5)]",
  "glass-light": "bg-white/50 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.08)]",
  "glass-frosted": "bg-white/10 backdrop-blur-3xl border border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_16px_64px_rgba(0,0,0,0.3)]",
  "solid-dark": "bg-gray-900/95 border border-gray-700",
  "solid-light": "bg-white/95 border border-gray-200 shadow-md",
  outlined: "border border-white/20 bg-transparent backdrop-blur-sm",
  neon: "bg-black/60 border border-cyan-400/40 shadow-[0_0_32px_rgba(34,211,238,0.15),inset_0_0_32px_rgba(34,211,238,0.05)] backdrop-blur-xl",
  cyberpunk: "bg-black/70 border-l-2 border-t border-b border-r border-l-cyan-400 border-t-purple-500/40 border-b-purple-500/40 border-r-white/10 shadow-[0_0_24px_rgba(99,102,241,0.2)] backdrop-blur-xl",
};

const BLOB_SIZES: Record<string, string> = {
  xs: "w-32  h-32",
  sm: "w-48  h-48",
  md: "w-72  h-72",
  lg: "w-[28rem] h-[28rem]",
  xl: "w-[40rem] h-[40rem]",
};

const BLOB_COLORS: Record<string, string> = {
  purple: "bg-purple-500",
  blue: "bg-blue-500",
  cyan: "bg-cyan-400",
  green: "bg-emerald-500",
  red: "bg-red-500",
  orange: "bg-orange-500",
  pink: "bg-pink-500",
  white: "bg-white",
};

const BLOB_BLUR: Record<string, string> = {
  sm: "blur-xl",
  md: "blur-2xl",
  lg: "blur-3xl",
  xl: "blur-[80px]",
};

const BLOB_POSITIONS: Record<string, string> = {
  "top-left": "-top-16 -left-16",
  "top-right": "-top-16 -right-16",
  "bottom-left": "-bottom-16 -left-16",
  "bottom-right": "-bottom-16 -right-16",
  center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
};

const BLOB_EFFECTS: Record<string, string> = {
  float: "animate-[float_8s_ease-in-out_infinite]",
  pulse: "animate-[pulse_4s_ease-in-out_infinite]",
  rotate: "animate-[spin_20s_linear_infinite]",
  drift: "animate-[drift_12s_ease-in-out_infinite_alternate]",
  breathe: "animate-[breathe_6s_ease-in-out_infinite]",
};

const GLOW_SIZES: Record<string, string> = {
  sm: "w-32  h-32",
  md: "w-64  h-64",
  lg: "w-96  h-96",
  xl: "w-[32rem] h-[32rem]",
};

const GLOW_POSITIONS: Record<string, string> = {
  "top-left": "top-0 left-0",
  "top-right": "top-0 right-0",
  "bottom-left": "bottom-0 left-0",
  "bottom-right": "bottom-0 right-0",
  center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
};

// ─── Grid / pattern SVG data URIs ────────────────────────────────────────────

function gridPattern(type: GridVariant, opacity: number): string {
  const o = opacity / 100;

  const svgs: Record<GridVariant, string> = {
    dots: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20'><circle cx='1' cy='1' r='1' fill='rgba(255,255,255,${o})'/></svg>`,
    lines: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20'><line x1='0' y1='0' x2='0' y2='20' stroke='rgba(255,255,255,${o})' stroke-width='0.5'/></svg>`,
    crosses: `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'><line x1='12' y1='0' x2='12' y2='24' stroke='rgba(255,255,255,${o})' stroke-width='0.5'/><line x1='0' y1='12' x2='24' y2='12' stroke='rgba(255,255,255,${o})' stroke-width='0.5'/></svg>`,
    hexagons: `<svg xmlns='http://www.w3.org/2000/svg' width='28' height='32'><polygon points='14,1 27,8 27,22 14,29 1,22 1,8' fill='none' stroke='rgba(255,255,255,${o})' stroke-width='0.5'/></svg>`,
    circuit: `<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'><path d='M0 16 H10 M22 16 H32 M16 0 V10 M16 22 V32' stroke='rgba(255,255,255,${o})' stroke-width='0.5' fill='none'/><circle cx='16' cy='16' r='3' fill='none' stroke='rgba(255,255,255,${o})' stroke-width='0.5'/></svg>`,
  };

  return `url("data:image/svg+xml,${encodeURIComponent(svgs[type])}")`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function BlobEl({ blob, index }: { blob: BlobConfig; index: number }) {
  const { size = "md", color = "purple", effect = "float", position = "random", opacity = 30, blur = "lg" } = blob;

  const posClass = position === "random" ? (index % 2 === 0 ? BLOB_POSITIONS["top-left"] : BLOB_POSITIONS["bottom-right"]) : BLOB_POSITIONS[position];

  return <div className={clsx("absolute rounded-full pointer-events-none", BLOB_SIZES[size], BLOB_COLORS[color], BLOB_BLUR[blur], BLOB_EFFECTS[effect], posClass)} style={{ opacity: opacity / 100 }} aria-hidden="true" />;
}

function ShapeEl({ shape }: { shape: Exclude<GradientBackgroundProps["shape"], "none"> }) {
  if (shape === "circle") {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
        <div className="w-[420px] h-[420px] rounded-full border border-white/[0.06] bg-white/[0.03]" />
        <div className="absolute w-[280px] h-[280px] rounded-full border border-white/[0.08]" />
      </div>
    );
  }
  if (shape === "ring") {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
        <div className="w-[500px] h-[500px] rounded-full border-2 border-white/[0.05]" />
        <div className="absolute w-[360px] h-[360px] rounded-full border border-white/[0.07]" />
        <div className="absolute w-[200px] h-[200px] rounded-full border border-white/[0.1]" />
      </div>
    );
  }
  if (shape === "box") {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
        <div className="w-[500px] h-[300px] rounded-xl border border-white/[0.07] bg-white/[0.02]" />
      </div>
    );
  }
  if (shape === "diamond") {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
        <div className="w-64 h-64 border border-white/[0.08] bg-white/[0.02]" style={{ transform: "rotate(45deg)" }} />
      </div>
    );
  }
  if (shape === "hexagon") {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
        <svg width="320" height="370" viewBox="0 0 320 370" className="opacity-10">
          <polygon points="160,10 310,90 310,270 160,350 10,270 10,90" fill="none" stroke="white" strokeWidth="1" />
          <polygon points="160,50 270,110 270,250 160,310 50,250 50,110" fill="none" stroke="white" strokeWidth="0.5" />
        </svg>
      </div>
    );
  }
  return null;
}

// ─── Main Component ───────────────────────────────────────────────────────────

/**
 * GradientBackground
 * ------------------
 * A zero-dependency (beyond clsx + React) wrapper that layers:
 *   1. Optional background image (with opacity + blend mode)
 *   2. Gradient overlay
 *   3. Decorative blobs
 *   4. Grid / pattern overlay
 *   5. Noise texture
 *   6. Scan-line effect
 *   7. Central geometric shape
 *   8. Glow spots
 *   9. Glass/surface content wrapper
 *
 * All layers are `aria-hidden` decorative elements so they're invisible to
 * screen readers. The content slot is the only focusable child.
 *
 * @example
 * <GradientBackground
 *   gradient="aurora"
 *   variant="glass-dark"
 *   shape="hexagon"
 *   grid="circuit"
 *   noise="subtle"
    blobs={[
      { color: "cyan", size: "lg", effect: "float", position: "top-right" },
      { color: "purple", size: "md", effect: "drift", position: "bottom-left" },
    ]}
    glowSpots={[
      { color: "#6366f1", position: "top-left", size: "lg", opacity: 30 },
    ]}
 * >
 *   <h1 className="text-white text-5xl font-bold">Hello, Future</h1>
 * </GradientBackground>
 */
const GradientBackground = ({
  children,
  className,
  style,
  gradient = "indigo-purple",
  gradientAngle = 135,
  customGradient,
  variant = "glass",
  bgImage,
  bgImageOpacity = 100, // 0–100 → maps to CSS opacity (100 = fully visible)
  bgImagePosition = "center", // union — "center" | "top" | "bottom" | "top left" | "top center" … etc.
  bgImageSize = "cover", // union — "cover" | "contain" | "auto" | "100%" | "100% auto" … etc.
  bgImageBlend = "normal", // CSS mix-blend-mode for the image layer
  shape = "none",
  blobs = [],
  grid = "none",
  gridOpacity = 8,
  noise = "none",
  scanLines = "none",
  glowSpots = [],
  contentClassName,
  minHeight,
}: GradientBackgroundProps) => {
  // Gradient class
  const gradientStr = gradient === "custom" ? (customGradient ?? "") : (GRADIENTS[gradient] ?? "");

  const gradientClass = gradientStr
    ? `bg-gradient-to-br ${gradientStr}` // Tailwind direction utility
    : "";

  // Grid background style
  const gridStyle = useMemo<CSSProperties>(() => {
    if (grid === "none") return {};
    return {
      backgroundImage: gridPattern(grid as GridVariant, gridOpacity),
      backgroundRepeat: "repeat",
    };
  }, [grid, gridOpacity]);

  // Noise
  const noiseOpacity: Record<NoiseLevel, number> = {
    none: 0,
    subtle: 0.03,
    moderate: 0.055,
    heavy: 0.09,
  };

  // Scan-line opacity
  const scanOpacity: Record<ScanLines, number> = {
    none: 0,
    light: 0.03,
    dark: 0.07,
  };

  return (
    <div className={clsx("relative flex w-full items-center justify-center overflow-hidden", className)} style={{ minHeight, ...style }}>
      {/* ── 1. Background image ── */}
      {bgImage && (
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('${bgImage}')`,
            backgroundPosition: bgImagePosition,
            backgroundSize: bgImageSize,
            backgroundRepeat: "no-repeat",
            opacity: bgImageOpacity / 100,
            mixBlendMode: bgImageBlend,
          }}
        />
      )}

      {/* ── 2. Gradient layer ── */}
      {gradientClass && <div aria-hidden="true" className={clsx("absolute inset-0 z-[1] blur-3xl opacity-80", gradientClass)} style={{ transform: `rotate(${gradientAngle}deg) scale(1.5)` }} />}

      {/* ── 3. Blobs ── */}
      {blobs.map((blob, i) => (
        <div key={i} className="absolute inset-0 z-[2] overflow-hidden pointer-events-none" aria-hidden="true">
          <BlobEl blob={blob} index={i} />
        </div>
      ))}

      {/* ── 4. Grid / pattern ── */}
      {grid !== "none" && <div aria-hidden="true" className="absolute inset-0 z-[3] pointer-events-none" style={gridStyle} />}

      {/* ── 5. Noise texture ── */}
      {noise !== "none" && (
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[4] pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
            backgroundRepeat: "repeat",
            backgroundSize: "128px 128px",
            opacity: noiseOpacity[noise],
          }}
        />
      )}

      {/* ── 6. Scan lines ── */}
      {scanLines !== "none" && (
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[5] pointer-events-none"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,1) 2px, rgba(0,0,0,1) 4px)",
            opacity: scanOpacity[scanLines],
          }}
        />
      )}

      {/* ── 7. Central shape ── */}
      {shape !== "none" && (
        <div className="absolute inset-0 z-[6] pointer-events-none" aria-hidden="true">
          <ShapeEl shape={shape} />
        </div>
      )}

      {/* ── 8. Glow spots ── */}
      {glowSpots.map((spot, i) => (
        <div
          key={i}
          aria-hidden="true"
          className={clsx("absolute z-[7] rounded-full blur-3xl pointer-events-none", GLOW_SIZES[spot.size ?? "md"], GLOW_POSITIONS[spot.position ?? "center"])}
          style={{
            backgroundColor: spot.color ?? "#6366f1",
            opacity: (spot.opacity ?? 25) / 100,
          }}
        />
      ))}

      {/* ── 9. Content ── */}
      <div className={clsx("relative z-10 w-full flex justify-center items-center rounded-xl", VARIANT_CLASSES[variant ?? "none"], contentClassName)}>{children}</div>
    </div>
  );
};

export default GradientBackground;
export type { BlobConfig };

// ─── Keyframe definitions (add to global CSS or tailwind.config.js) ──────────
//
//  @keyframes float   { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-24px) } }
//  @keyframes drift   { from { transform: translate(0,0) } to { transform: translate(24px,-18px) } }
//  @keyframes breathe { 0%,100% { transform: scale(1) } 50% { transform: scale(1.12) } }
//
//  Add to tailwind.config.js:
//  theme: { extend: { animation: {
//    float:   'float 8s ease-in-out infinite',
//    drift:   'drift 12s ease-in-out infinite alternate',
//    breathe: 'breathe 6s ease-in-out infinite',
//  }}}
