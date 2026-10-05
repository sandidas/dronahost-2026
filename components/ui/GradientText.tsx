import { cn } from "@/utils/cn";

/**
 * GradientText
 * ────────────
 * Highlights a phrase inside a heading. Brand rule: at most ONE highlighted
 * phrase per heading, in teal. Gradients stay inside the teal family so
 * contrast holds on both themes; there is no pink, purple or indigo.
 *
 * Preset names are kept for backwards compatibility.
 *
 * @example
 * <h2>Hosting built for <GradientText>speed you can measure</GradientText></h2>
 */

type GradientPreset = "brand" | "warm" | "cool" | "aurora";

const gradients: Record<GradientPreset, string> = {
  brand: "linear-gradient(90deg, var(--link), var(--accent-hover))",
  cool: "linear-gradient(90deg, var(--link), var(--accent-hover))",
  // Orange is reserved for actions; "warm" now resolves to the same teal treatment.
  warm: "linear-gradient(90deg, var(--link), var(--accent-hover))",
  aurora: "linear-gradient(90deg, var(--accent), var(--link), var(--accent-hover))",
};

interface GradientTextProps {
  children: React.ReactNode;
  /** Gradient preset. All presets are teal. Default: "brand" */
  gradient?: GradientPreset;
  className?: string;
}

export default function GradientText({ children, gradient = "brand", className }: GradientTextProps) {
  return (
    <span
      className={cn("bg-clip-text text-transparent", className)}
      style={{ backgroundImage: gradients[gradient], WebkitBoxDecorationBreak: "clone", boxDecorationBreak: "clone" }}
    >
      {children}
    </span>
  );
}

export type { GradientPreset };
