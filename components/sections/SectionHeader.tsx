import Reveal from "@/components/ui/Reveal";
import { cn } from "@/utils/cn";

type SectionHeaderProps = {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  /** Heading level so the page keeps one H1 and a logical outline. Default "h2". */
  headingLevel?: "h2" | "h3";
  align?: "start" | "center";
  className?: string;
};

/** Eyebrow, heading and answer-first summary shared by the content sections. */
export default function SectionHeader({
  id,
  eyebrow,
  title,
  description,
  headingLevel = "h2",
  align = "center",
  className,
}: SectionHeaderProps) {
  const Heading = headingLevel;
  return (
    <Reveal className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <p className="t-eyebrow">{eyebrow}</p>}
      <Heading id={id} className={cn("t-h2 text-foreground", eyebrow && "mt-3")}>
        {title}
      </Heading>
      {description && <p className={cn("t-lead mt-4", align === "center" && "mx-auto")}>{description}</p>}
    </Reveal>
  );
}
