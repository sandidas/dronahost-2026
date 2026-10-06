import { Check } from "lucide-react";
import { useId, type ReactNode } from "react";
import Button from "@/components/ui/Button";
import { reveal } from "@/lib/motion";
import { cn } from "@/utils/cn";

type CtaItem = { label: string; href: string; variant?: "primary" | "secondary" | "link" };

type TwoColumnProps = {
  eyebrow?: string;
  title: string;
  /** Answer-first summary under the title. */
  description?: string;
  features?: readonly string[];
  cta?: readonly CtaItem[];
  /** Visual (illustration, mockup or image). Decorative visuals should be aria-hidden. */
  visual: ReactNode;
  /** Which side the visual sits on at large widths. Default "right". */
  visualPosition?: "left" | "right";
  /** Heading level of the title. Default "h2". */
  headingLevel?: "h2" | "h3";
  /** Extra content between the feature list and the actions. */
  children?: ReactNode;
  className?: string;
};

/** Text, checklist and actions beside a designed visual. Stacks on phones with text first. */
export default function TwoColumn({
  eyebrow,
  title,
  description,
  features = [],
  cta = [],
  visual,
  visualPosition = "right",
  headingLevel = "h2",
  children,
  className,
}: TwoColumnProps) {
  const headingId = useId();
  const Heading = headingLevel;
  const visualFirst = visualPosition === "left";

  return (
    <section aria-labelledby={headingId} className={cn("section-y", className)}>
      <div className="container-site grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
        <div className={cn("min-w-0", visualFirst && "lg:order-2")} {...reveal(0)}>
          {eyebrow && <p className="t-eyebrow">{eyebrow}</p>}
          <Heading id={headingId} className={cn("t-h2 text-foreground", eyebrow && "mt-3")}>
            {title}
          </Heading>
          {description && <p className="t-lead mt-4">{description}</p>}

          {features.length > 0 && (
            <ul className="mt-6 space-y-3">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-foreground">
                  <span aria-hidden="true" className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-link">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  <span className="t-body">{feature}</span>
                </li>
              ))}
            </ul>
          )}

          {children}

          {cta.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {cta.map((btn, i) => (
                <Button key={btn.href + btn.label} href={btn.href} variant={btn.variant ?? (i === 0 ? "primary" : "secondary")}>
                  {btn.label}
                </Button>
              ))}
            </div>
          )}
        </div>

        <div className={cn("min-w-0", visualFirst && "lg:order-1")} {...reveal(1)}>
          {visual}
        </div>
      </div>
    </section>
  );
}
