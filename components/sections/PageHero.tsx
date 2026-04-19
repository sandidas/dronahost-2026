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

type PageHeroProps = {
  tagline?: string;
  title: string;
  description?: string;
  cta?: CtaItem[];
  image?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  layout?: "centered" | "split";
  background?: "gradient" | "plain";
  children?: ReactNode;
};

export default function PageHero({
  tagline,
  title,
  description,
  cta = [],
  image,
  layout = "centered",
  background = "gradient",
  children,
}: PageHeroProps) {
  const isSplit = layout === "split";

  return (
    <Section
      size="lg"
      padding="hero"
      className={cn(
        "relative overflow-hidden",
        background === "plain" ? "bg-white dark:bg-gray-900" : "bg-white dark:bg-gray-900",
      )}
      aria-label={title}
    >
      {/* Gradient blobs — pure CSS, no JS */}
      {background === "gradient" && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-16 -left-16 h-[28rem] w-[28rem] rounded-full bg-orange-500 opacity-20 blur-xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-16 -right-16 h-[28rem] w-[28rem] rounded-full bg-orange-500 opacity-25 blur-xl"
          />
        </>
      )}

      {isSplit ? (
        /* Split layout: text left, image right */
        <div className="relative z-10 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            {tagline && <Badge variant="neutral">{tagline}</Badge>}

            <HeadLineText as="h1" fontSize="sixXl" fontWeight="bold" align="left">
              {title}
            </HeadLineText>

            {description && (
              <p className="max-w-xl text-gray-600 dark:text-gray-300">{description}</p>
            )}

            {cta.length > 0 && (
              <div className="flex flex-wrap gap-4">
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

            {children}
          </div>

          {image && (
            <div className="flex justify-center lg:justify-end">
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width ?? 600}
                height={image.height ?? 500}
                priority={true}
                skeleton={false}
                className="w-full max-w-lg object-contain"
              />
            </div>
          )}
        </div>
      ) : (
        /* Centered layout */
        <div className="relative z-10 mx-auto max-w-3xl space-y-6 text-center">
          {tagline && <Badge variant="neutral">{tagline}</Badge>}

          <HeadLineText as="h1" fontSize="sixXl" fontWeight="bold" align="center">
            {title}
          </HeadLineText>

          {description && (
            <p className="mx-auto max-w-xl text-gray-600 dark:text-gray-300">{description}</p>
          )}

          {cta.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4">
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

          {image && (
            <div className="mt-10 flex justify-center">
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width ?? 800}
                height={image.height ?? 500}
                priority={true}
                skeleton={false}
                className="w-full object-contain"
              />
            </div>
          )}

          {children}
        </div>
      )}
    </Section>
  );
}
