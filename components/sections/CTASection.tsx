import HeadLineText from "@/components/ui/HeadLineText";
import Section from "@/components/ui/Section";
import { cn } from "@/utils/cn";
import NextImage from "next/image";
import Link from "next/link";
import { type ReactNode } from "react";

type CtaItem = {
  label: string;
  href?: string;
  variant?: "primary" | "secondary";
};

type CTASectionProps = {
  title: string;
  description?: string;
  tagline?: string;
  cta: CtaItem[];
  image?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  variant?: "default" | "gradient";
  children?: ReactNode;
  className?: string;
};

export default function CTASection({
  title,
  description,
  tagline,
  cta,
  image,
  variant = "default",
  children,
  className,
}: CTASectionProps) {
  return (
    <Section
      size="lg"
      padding="lg"
      className={cn(
        variant === "gradient"
          ? "bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-orange-950/20 dark:via-gray-900 dark:to-orange-950/20"
          : "bg-gray-50 dark:bg-gray-900",
        className,
      )}
    >
      <div className={cn("grid gap-12 lg:items-center", image ? "lg:grid-cols-2" : "lg:grid-cols-1")}>

        {/* Image — always left when present */}
        {image && (
          <div className="flex justify-center lg:justify-center">
            <NextImage
              src={image.src}
              alt={image.alt}
              width={image.width ?? 500}
              height={image.height ?? 400}
              className="w-full max-w-md object-contain"
              loading="lazy"
            />
          </div>
        )}

        {/* Content */}
        <div className={cn("space-y-6", image ? "text-center lg:text-left" : "mx-auto max-w-2xl text-center")}>
          {tagline && (
            <span className="inline-block rounded-full bg-blue-50 px-4 py-1 text-xs uppercase tracking-widest text-blue-500 dark:bg-blue-900/30">
              {tagline}
            </span>
          )}

          <HeadLineText
            as="h2"
            fontSize="fourXl"
            fontWeight="bold"
            align={image ? "left" : "center"}
          >
            {title}
          </HeadLineText>

          {description && (
            <p className="text-gray-600 dark:text-gray-300">{description}</p>
          )}

          {children}

          <div className={cn("flex flex-wrap gap-4", image ? "items-center lg:items-start" : "justify-center")}>
            {cta.map((btn, i) =>
              btn.href ? (
                <Link
                  key={i}
                  href={btn.href}
                  className={btn.variant === "secondary" ? "secondary-btn" : "primary-btn"}
                >
                  {btn.label}
                </Link>
              ) : (
                <button
                  key={i}
                  type="button"
                  className={btn.variant === "secondary" ? "secondary-btn" : "primary-btn"}
                >
                  {btn.label}
                </button>
              ),
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
