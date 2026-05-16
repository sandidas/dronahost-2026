import { cn } from "@/utils/cn";

/**
 * GradientText
 * ────────────
 * Inline gradient fill on any text. Renders as <span> so it can sit inside
 * any heading or paragraph without breaking semantics.
 *
 * All gradients reference CSS custom properties so they adapt to dark mode
 * automatically (--primary, --accent, and --secondary shift in .dark).
 *
 * | Preset   | Stops                            | Use                         |
 * |----------|----------------------------------|-----------------------------|
 * | brand    | secondary → primary → accent     | Hero headlines, key phrases |
 * | warm     | primary → accent                 | CTAs, urgency               |
 * | cool     | secondary → primary              | Trust, tech, features       |
 * | aurora   | secondary → primary → accent-light | Wide text, display titles |
 *
 * @example
 * <h1>
 *   Hosting built for{" "}
 *   <GradientText gradient="brand">speed you can measure</GradientText>
 * </h1>
 */

type GradientPreset = "brand" | "warm" | "cool" | "aurora";

const gradients: Record<GradientPreset, string> = {
  // Sky-blue → indigo → orange — full brand palette sweep
  brand: "linear-gradient(90deg, var(--secondary), var(--primary-light), var(--accent))",
  // Indigo → vivid orange — bold CTA energy, works across wrapped lines
  warm: "linear-gradient(105deg, var(--primary) 0%, var(--primary-light) 40%, var(--accent) 100%)",
  // Sky-blue → indigo — cool, technical trust
  cool: "linear-gradient(90deg, var(--secondary), var(--primary))",
  // Wide sweeping brand gradient — great for long display text
  aurora: "linear-gradient(90deg, var(--secondary), var(--primary), var(--primary-light), var(--accent-light))",
};

interface GradientTextProps {
  children: React.ReactNode;
  /** Gradient preset. Default: "brand" */
  gradient?: GradientPreset;
  /** Extra Tailwind classes e.g. for display or font tweaks */
  className?: string;
}

export default function GradientText({
  children,
  gradient = "brand",
  className,
}: GradientTextProps) {
  return (
    <span
      className={cn("inline-block bg-clip-text text-transparent", className)}
      style={{ backgroundImage: gradients[gradient] }}
    >
      {children}
    </span>
  );
}

export type { GradientPreset };
