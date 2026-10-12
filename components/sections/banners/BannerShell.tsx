import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import Button from "@/components/ui/Button";
import { Link } from "@/i18n/link";
import { cn } from "@/utils/cn";

/**
 * Colour scope for a banner or a part of one. `ink` and `paper` force the dark or light tokens, so a navy band or a paper
 * ticket looks the same in both site themes and every colour pair stays covered by `npm run check:contrast`.
 * `page` follows the site theme.
 */
export type BannerScope = "page" | "ink" | "paper";
export const SCOPE: Record<BannerScope, string> = { page: "", ink: "dark", paper: "light" };

type BannerShellProps = {
  /** The heading that names the band. Leave it out when the banner shows no heading. */
  headingId?: string;
  /** Background and scope classes for the band. Each banner brings its own art. */
  className?: string;
  /** hero (large), section or none (the banner sets its own padding). */
  size?: "hero" | "section" | "none";
  /** Decorative layers drawn behind the content (aria-hidden by the caller). */
  art?: ReactNode;
  /** Skip the site container, for full-bleed compositions. */
  bleed?: boolean;
  children: ReactNode;
};

const SIZE = { hero: "py-20 sm:py-28 lg:py-32", section: "py-16 sm:py-20 lg:py-24", none: "" } as const;

/** One landmark wrapper for every intent banner: labelled by its heading, isolated so art layers stay behind. */
export default function BannerShell({ headingId, className, size = "hero", art, bleed = false, children }: BannerShellProps) {
  return (
    <section aria-labelledby={headingId} className={cn("relative isolate overflow-hidden text-foreground", SIZE[size], className)}>
      {art}
      {bleed ? children : <div className="container-site">{children}</div>}
    </section>
  );
}

/** Small label above a heading: a short teal rule, then mono capitals. */
export function Kicker({ children, className, center = false }: { children: ReactNode; className?: string; center?: boolean }) {
  return (
    <p className={cn("t-meta flex items-center gap-3 text-muted-foreground", center && "justify-center", className)}>
      <span aria-hidden="true" className="h-px w-8 shrink-0 bg-accent" />
      {children}
    </p>
  );
}

/** "01", "02": index numbers. */
export const indexNo = (i: number) => String(i + 1).padStart(2, "0");

/** Symbols Intl does not shorten, from the project currency list (CLAUDE.md, "Currencies to support"). */
const SYMBOL_OVERRIDES: Record<string, string> = { AED: "د.إ" };

/** The symbol for an ISO currency code ("GBP" → "£"), from Intl. Formatting only: never a price. */
export function currencySymbol(code: string): string {
  if (SYMBOL_OVERRIDES[code]) return SYMBOL_OVERRIDES[code];
  try {
    return new Intl.NumberFormat("en", { style: "currency", currency: code, currencyDisplay: "narrowSymbol" }).formatToParts(0).find((p) => p.type === "currency")?.value ?? code;
  } catch {
    return code;
  }
}

/** A text link with a hairline underline and an arrow. Every action that is not the purchase. */
export function QuietLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={cn("group link-quiet inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-semibold text-foreground", className)}>
      {children}
      <ArrowRight className="size-4 text-link transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" aria-hidden="true" />
    </Link>
  );
}

/** The single orange action: a flat rectangle with a small radius, no glow. */
export function PrimaryAction({ href, children, size = "lg", className }: { href: string; children: ReactNode; size?: "md" | "lg"; className?: string }) {
  return (
    <Button href={href} size={size} className={cn("rounded-md px-7 shadow-none hover:shadow-none", className)}>
      {children}
    </Button>
  );
}
