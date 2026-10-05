import { Check } from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import type { HeroBaseProps } from "./types";

type HeroContentProps = Pick<
  HeroBaseProps,
  "eyebrow" | "title" | "titleAccent" | "description" | "primaryCta" | "secondaryCta" | "highlights" | "note" | "headingLevel"
> & {
  /** Heading id, so the parent section can use aria-labelledby. */
  headingId: string;
  /** Typographic scale: display for the product hero, h1 elsewhere. */
  scale?: "display" | "h1";
  align?: "start" | "center";
};

/** Eyebrow, headline, summary, actions and highlights shared by all three hero variants. */
export default function HeroContent({
  eyebrow,
  title,
  titleAccent,
  description,
  primaryCta,
  secondaryCta,
  highlights,
  note,
  headingLevel = "h1",
  headingId,
  scale = "h1",
  align = "start",
}: HeroContentProps) {
  const Heading = headingLevel;
  const centered = align === "center";

  return (
    <div className={cn("min-w-0", centered && "mx-auto flex max-w-3xl flex-col items-center text-center")}>
      {eyebrow && <p className="t-eyebrow">{eyebrow}</p>}
      <Heading id={headingId} className={cn(scale === "display" ? "t-display" : "t-h1", "text-foreground", eyebrow && "mt-4")}>
        {title}
        {titleAccent && (
          <>
            {" "}
            <span className="text-link">{titleAccent}</span>
          </>
        )}
      </Heading>
      <p className={cn("t-lead mt-5", centered && "mx-auto")}>{description}</p>

      <div className={cn("mt-8 flex flex-wrap items-center gap-3", centered && "justify-center")}>
        <Button href={primaryCta.href} size="lg">
          {primaryCta.label}
        </Button>
        {secondaryCta && (
          <Button href={secondaryCta.href} variant="secondary" size="lg">
            {secondaryCta.label}
          </Button>
        )}
      </div>

      {note && <p className="t-small mt-4 text-muted-foreground">{note}</p>}

      {highlights && highlights.length > 0 && (
        <ul className={cn("mt-8 space-y-2.5", centered && "mx-auto")}>
          {highlights.map((item) => (
            <li key={item} className={cn("flex items-start gap-3 text-sm text-foreground", centered && "justify-center text-start")}>
              <Check className="mt-0.5 size-4 shrink-0 text-link" aria-hidden="true" strokeWidth={2.5} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
