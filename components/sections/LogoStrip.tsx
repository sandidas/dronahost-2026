import { Cloud } from "lucide-react";
import { useId, type CSSProperties } from "react";
import { reveal } from "@/lib/motion";
import { cn } from "@/utils/cn";
import type { LogoEntry } from "@/content/logos";

type LogoStripProps = {
  eyebrow?: string;
  title?: string;
  /** One plain line in its own band under the logos, for example where the servers come from (decision 80). */
  note?: string;
  /** Already gated by the caller on each logo's claim. */
  logos: readonly LogoEntry[];
  /** marquee = one row that scrolls slowly (pauses on hover and focus, still with reduced motion) · static = a centred row. */
  variant?: "marquee" | "static";
  headingLevel?: "h2" | "h3";
  className?: string;
};

/** Symbol height in rem; the width follows the SVG's proportions. */
const HEIGHT = 1.75;

/** A one-colour symbol tinted with the text colour through a CSS mask, then the name. Without a symbol the name stands alone. */
function Mark({ logo }: { logo: LogoEntry }) {
  const symbol = logo.src && logo.size && ({ "--logo": `url(${logo.src})`, width: `${(HEIGHT * logo.size.width) / logo.size.height}rem`, height: `${HEIGHT}rem` } as CSSProperties);
  return (
    <span className="inline-flex items-center gap-3 whitespace-nowrap">
      {symbol && <span aria-hidden="true" className="logo-mask block shrink-0 bg-current" style={symbol} />}
      <span className="font-heading text-2xl font-semibold tracking-tight">{logo.name}</span>
    </span>
  );
}

function Item({ logo, hidden }: { logo: LogoEntry; hidden?: boolean }) {
  const mark = <Mark logo={logo} />;
  return (
    <li className="flex shrink-0 items-center text-foreground/70 transition-colors hover:text-foreground">
      {logo.href && !hidden ? (
        <a href={logo.href} rel="noopener noreferrer" target="_blank" className="inline-flex min-h-11 items-center">
          {mark}
        </a>
      ) : (
        mark
      )}
    </li>
  );
}

/**
 * One row of monochrome logos for the technology we run. The caller passes only logos that may show; with none the section
 * is left out. The marquee needs at least five logos to fill a row, so fewer fall back to the static row.
 */
export default function LogoStrip({ eyebrow, title, note, logos, variant = "marquee", headingLevel = "h2", className }: LogoStripProps) {
  const headingId = useId();
  if (logos.length === 0) return null;
  const Heading = headingLevel;
  const marquee = variant === "marquee" && logos.length >= 5;

  return (
    <section aria-labelledby={title ? headingId : undefined} className={className}>
      <div className="py-12 sm:py-16">
        <div className="container-site text-center">
          {eyebrow && <p className="t-eyebrow">{eyebrow}</p>}
          {title && (
            <Heading id={headingId} className={cn("t-h4 text-muted-foreground", eyebrow && "mt-2")}>
              {title}
            </Heading>
          )}
        </div>
        {marquee ? (
          <div className={cn("logo-marquee container-site", (title || eyebrow) && "mt-10")} {...reveal()}>
            <div className="logo-marquee-track">
              <ul className="flex items-center gap-x-16 pe-16 sm:gap-x-24 sm:pe-24">
                {logos.map((logo) => (
                  <Item key={logo.name} logo={logo} />
                ))}
              </ul>
              {/* The second copy makes the loop seamless; screen readers and the keyboard skip it. */}
              <ul aria-hidden="true" className="flex items-center gap-x-16 pe-16 sm:gap-x-24 sm:pe-24">
                {logos.map((logo) => (
                  <Item key={logo.name} logo={logo} hidden />
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <ul className={cn("container-site flex flex-wrap items-center justify-center gap-x-16 gap-y-8 sm:gap-x-24", (title || eyebrow) && "mt-10")} {...reveal()}>
            {logos.map((logo) => (
              <Item key={logo.name} logo={logo} />
            ))}
          </ul>
        )}
      </div>
      {note && (
        <div className="border-t border-border bg-card">
          <p className="container-site flex items-center justify-center gap-3 py-5 text-center text-sm text-foreground sm:text-base">
            <Cloud aria-hidden="true" className="size-5 shrink-0 text-link" />
            {note}
          </p>
        </div>
      )}
    </section>
  );
}
