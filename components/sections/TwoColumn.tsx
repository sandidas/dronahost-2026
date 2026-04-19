import Badge from "@/components/ui/Badge";
import HeadLineText from "@/components/ui/HeadLineText";
import Image from "@/components/ui/Image";
import Section from "@/components/ui/Section";
import { cn } from "@/utils/cn";
import Link from "next/link";
import { type ReactNode } from "react";

type CtaItem = {
  label: string;
  href: string;
  variant?: "primary" | "secondary";
};

type TwoColumnProps = {
  tagline?: string;
  title: string;
  description?: string;
  features?: string[];
  cta?: CtaItem[];
  image: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  imagePosition?: "left" | "right";
  children?: ReactNode;
  className?: string;
};

export default function TwoColumn({
  tagline,
  title,
  description,
  features = [],
  cta = [],
  image,
  imagePosition = "right",
  children,
  className,
}: TwoColumnProps) {
  const imageFirst = imagePosition === "left";

  return (
    <Section size="lg" padding="lg" className={cn("bg-white dark:bg-gray-900", className)}>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">

        {/* Text column */}
        <div className={cn("space-y-6", imageFirst ? "lg:order-last" : "lg:order-first")}>
          {tagline && <Badge variant="neutral">{tagline}</Badge>}

          <HeadLineText as="h2" fontSize="fiveXl" fontWeight="bold" align="left">
            {title}
          </HeadLineText>

          {description && (
            <p className="text-gray-600 dark:text-gray-300 max-w-lg">{description}</p>
          )}

          {features.length > 0 && (
            <ul className="space-y-3">
              {features.map((feat, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30"
                    aria-hidden="true"
                  >
                    <svg
                      className="h-3 w-3 text-orange-600 dark:text-orange-400"
                      fill="none"
                      viewBox="0 0 12 12"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
                    </svg>
                  </span>
                  <span className="text-gray-700 dark:text-gray-300 text-sm">{feat}</span>
                </li>
              ))}
            </ul>
          )}

          {children}

          {cta.length > 0 && (
            <div className="flex flex-wrap gap-4 pt-2">
              {cta.map((btn) => (
                <Link
                  key={btn.label}
                  href={btn.href}
                  className={btn.variant === "secondary" ? "secondary-btn" : "primary-btn"}
                >
                  {btn.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Image column */}
        <div className={cn("flex justify-center", imageFirst ? "lg:order-first" : "lg:order-last")}>
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width ?? 560}
            height={image.height ?? 480}
            priority={false}
            skeleton={true}
            className="w-full max-w-lg object-contain"
          />
        </div>
      </div>
    </Section>
  );
}
