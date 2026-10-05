import Image from "next/image";

const SIZES = {
  sm: { width: 120, height: 28, className: "h-7" },
  md: { width: 150, height: 35, className: "h-9" },
  lg: { width: 200, height: 47, className: "h-12" },
} as const;

type LogoProps = {
  /** Rendered size. Aspect ratio is fixed by the artwork. */
  size?: keyof typeof SIZES;
  /** Set on the single above-the-fold logo (LCP candidate). */
  priority?: boolean;
  className?: string;
};

/**
 * The official DronaHost wordmark (docs/reference/brand/dronaHost-logo.svg).
 * Brand rules: never recolour, add effects or filters, stretch, rotate, outline,
 * reverse, or place on an orange or teal fill. Leave clear space around it. This
 * component intentionally accepts no colour or filter props.
 */
export default function Logo({ size = "md", priority = false, className }: LogoProps) {
  const { width, height, className: sizeClass } = SIZES[size];
  return (
    <Image
      src="/logo/dronaHost-logo.svg"
      alt="DronaHost"
      width={width}
      height={height}
      priority={priority}
      className={`${sizeClass} w-auto ${className ?? ""}`.trim()}
    />
  );
}
