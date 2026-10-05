import { useId } from "react";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import HeadLineText from "@/components/ui/HeadLineText";
import Section from "@/components/ui/Section";
import { cn } from "@/utils/cn";
import { type ReactNode } from "react";

type FeatureGridItem = {
  icon?: ReactNode;
  iconKey?: string;
  title: string;
  description: string;
  cta?: { label: string; href: string };
  tech?: string[];
};

type FeatureGridProps = {
  /** Heading level of the section title so each page keeps exactly one H1. Default "h2". */
  headingLevel?: "h2" | "h3";
  tagline?: string;
  title?: string;
  description?: string;
  columns?: 2 | 3 | 4;
  items: FeatureGridItem[];
  divided?: boolean;
  className?: string;
};

const colClass: Record<2 | 3 | 4, string> = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

export default function FeatureGrid({
  tagline,
  title,
  description,
  columns = 3,
  items,
  divided = false,
  className,
  headingLevel = "h2",
}: FeatureGridProps) {
  const headingId = useId();
  const childLevel = headingLevel === "h2" ? "h3" : "h4";
  const ItemHeading = childLevel;
  const total = items.length;

  return (
    <Section aria-labelledby={headingId} size="lg" padding="lg" className={cn("bg-white dark:bg-gray-900", className)}>
      {/* Header */}
      {(tagline || title || description) && (
        <div className="mb-12 space-y-4 text-center">
          {tagline && <Badge variant="neutral">{tagline}</Badge>}
          {title && (
            <HeadLineText as={headingLevel}
            id={headingId} fontSize="fiveXl" fontWeight="bold" align="center">
              {title}
            </HeadLineText>
          )}
          {description && (
            <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-300">{description}</p>
          )}
        </div>
      )}

      {/* Grid */}
      <div className={cn("grid", colClass[columns])}>
        {items.map((item, index) =>
          divided ? (
            <Card
              key={index}
              variant="grid"
              index={index}
              total={total}
              columns={columns}
              align="left"
            >
              {item.icon && <div className="mb-4 text-primary">{item.icon}</div>}
              <ItemHeading className="mb-2 font-bold text-gray-900 dark:text-white">{item.title}</ItemHeading>
              <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
              {item.cta && (
                <a
                  href={item.cta.href}
                  className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all"
                >
                  {item.cta.label} →
                </a>
              )}
            </Card>
          ) : (
            <Card
              key={index}
              variant="box"
              icon={item.iconKey}
              title={item.title}
              description={item.description}
              tech={item.tech}
              className="m-3"
            />
          ),
        )}
      </div>
    </Section>
  );
}
