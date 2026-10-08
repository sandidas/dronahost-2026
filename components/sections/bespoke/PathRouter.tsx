import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/link";
import { useId } from "react";
import FeatureIcon, { type FeatureIconName } from "@/components/ui/FeatureIcon";
import { visibleItems, type Gated } from "@/lib/sections/gated";
import { reveal } from "@/lib/motion";
import { UI } from "@/content/strings";
import { cn } from "@/utils/cn";
import SectionHeader from "../SectionHeader";

export type RouterPath = Gated & {
  /** The visitor's situation, in their words, e.g. "I already have a WordPress site". */
  title: string;
  /** One plain sentence on what happens next. */
  line: string;
  href: string;
  /** Link text for the destination, e.g. "See WordPress hosting". */
  cta: string;
  icon?: FeatureIconName;
};

type PathRouterProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  paths: readonly RouterPath[];
  /** Smaller cards with the icon beside the text. Use when each path has one short line and the full-size cards would look empty. */
  compact?: boolean;
  /** Showcase only: show gated paths too, with a visible label. */
  showSamples?: boolean;
  /** Heading level of the section title; path titles sit one level below. Default "h2". */
  headingLevel?: "h2" | "h3";
  className?: string;
};

/**
 * "Where are you starting from?" Routes a visitor to a product by their situation, not our product names.
 * Bespoke to the home page: a 2 by 2 grid of large situation cards, each one a single link target (a stretched link,
 * so the destination text stays descriptive and crawlable). A path whose `claim` is not rendering is left out, and with
 * fewer than two paths left the whole section is omitted, because a router with one choice is not a router.
 */
export default function PathRouter({ eyebrow, title, description, paths, compact = false, showSamples = false, headingLevel = "h2", className }: PathRouterProps) {
  const headingId = useId();
  const Item = headingLevel === "h2" ? "h3" : "h4";
  const shown = visibleItems(paths, { showAll: showSamples });
  if (shown.length < 2) return null;

  return (
    <section aria-labelledby={headingId} className={cn("section-y", className)}>
      <div className="container-site">
        <SectionHeader id={headingId} eyebrow={eyebrow} title={title} description={description} headingLevel={headingLevel} />
        <ul className="mt-12 grid gap-4 sm:mt-14 sm:gap-5 md:grid-cols-2">
          {shown.map((path, i) => (
            <li key={path.href + path.title} className="flex" {...reveal(i)}>
              <div className={cn("surface surface-interactive relative flex w-full has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-solid has-[a:focus-visible]:outline-(--ring)", compact ? "items-start gap-4 p-5 sm:gap-5 sm:p-6" : "flex-col p-6 sm:p-8")}>
                {path.icon && <FeatureIcon name={path.icon} size={compact ? "md" : "lg"} className={cn(compact ? "shrink-0" : "mb-6")} />}
                <div className={cn("flex min-w-0 flex-1 flex-col", !compact && "w-full")}>
                  <Item className={cn("text-balance text-foreground", compact ? "t-h4" : "t-h3")}>{path.title}</Item>
                  <p className={cn("t-body flex-1 text-muted-foreground", compact ? "mt-1.5" : "mt-3")}>{path.line}</p>
                  <Link
                    href={path.href}
                    className={cn("inline-flex min-h-11 items-center gap-2 self-start text-base font-semibold text-link after:absolute after:inset-0 after:content-[''] focus-visible:!outline-none", compact ? "mt-3" : "mt-6")}
                  >
                    {path.cta}
                    <ArrowRight className="arrow-nudge size-5 rtl:rotate-180" aria-hidden="true" strokeWidth={2} />
                  </Link>
                </div>
                {showSamples && path.claim && <p className="mt-3 text-xs font-semibold text-warning">{UI.sample.hiddenUntil(path.claim)}</p>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
