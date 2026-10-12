import { ArrowRight, CornerDownLeft, Search } from "lucide-react";
import { Link } from "@/i18n/link";
import { useId } from "react";
import {
  FEATURE_ICONS,
  type FeatureIconName,
} from "@/components/ui/FeatureIcon";
import { UI } from "@/content/strings";
import { cn } from "@/utils/cn";
import BannerShell, { Kicker } from "./BannerShell";

export type Destination = {
  title: string;
  line: string;
  href: string;
  icon?: FeatureIconName;
  /** The keycap shown on the row. Defaults to the first letter of the title. */
  key?: string;
};

export type DestinationBannerProps = {
  eyebrow?: string;
  /** "Looking for something?" style heading. Optional for the page builder, where nothing is required. */
  title?: string;
  intro?: string;
  /** Two to six destinations, each a single link target. */
  items: readonly Destination[];
  /** palette = a quick-jump panel under the heading · split = heading beside the panel · tiles = large drawn tiles. */
  layout?: "palette" | "split" | "tiles";
  /** Tiles per row in the `tiles` layout. */
  columns?: 2 | 3 | 4;
  headingLevel?: "h1" | "h2" | "h3";
  className?: string;
};

function Keycap({ children }: { children: string }) {
  return (
    <kbd className="inline-grid h-7 min-w-7 place-items-center rounded-[5px] border border-border-strong bg-background px-1.5 tabular-nums text-xs font-semibold text-muted-foreground shadow-[inset_0_-2px_0_var(--border)]">
      {children}
    </kbd>
  );
}

const COLS = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
} as const;

/**
 * Navigational intent, banner 2, "command palette": the destinations a returning reader wants, set in a glass quick-jump
 * panel with keycaps, over a soft teal and orange light. The search row is drawn, not a field: every row is a real link.
 * The `tiles` layout draws each destination as a large line icon with its keycap.
 */
export default function DestinationBanner({
  eyebrow,
  title,
  intro,
  items,
  layout = "palette",
  columns = 4,
  headingLevel = "h2",
  className,
}: DestinationBannerProps) {
  const headingId = useId();
  const Heading = headingLevel;
  const Item =
    headingLevel === "h1" ? "h2" : headingLevel === "h2" ? "h3" : "h4";
  const split = layout === "split";
  const keyOf = (d: Destination) => (d.key ?? d.title.charAt(0)).toUpperCase();

  const palette = (
    <nav
      aria-label={title}
      className="surface-glass overflow-hidden !rounded-xl shadow-2xl"
    >
      <div
        aria-hidden="true"
        className="flex items-center gap-3 border-b border-border px-5 py-4"
      >
        <Search className="size-4 text-muted-foreground" />
        <span className="flex-1 text-[0.9375rem] text-muted-foreground">
          {UI.banners.jumpTo}
        </span>
        <Keycap>/</Keycap>
      </div>
      <ul className="p-2">
        {items.map((d, i) => {
          const Icon = d.icon ? FEATURE_ICONS[d.icon] : null;
          return (
            <li key={d.title}>
              <Link
                href={d.href}
                className={cn(
                  "group flex min-h-14 items-center gap-4 rounded-lg px-3 py-3 transition-colors hover:bg-accent/10 focus-visible:bg-accent/10",
                  i === 0 && "bg-foreground/[0.04]",
                )}
              >
                <span
                  aria-hidden="true"
                  className="grid size-9 shrink-0 place-items-center rounded-lg border border-border bg-background text-link"
                >
                  {Icon ? (
                    <Icon className="size-4" strokeWidth={1.75} />
                  ) : (
                    <ArrowRight className="size-4 rtl:rotate-180" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <Item className="block text-[0.9375rem] font-semibold text-foreground">
                    {d.title}
                  </Item>
                  <span className="t-small block truncate text-muted-foreground">
                    {d.line}
                  </span>
                </div>
                <span
                  aria-hidden="true"
                  className="hidden items-center gap-2 sm:flex"
                >
                  <CornerDownLeft className="size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  <Keycap>{keyOf(d)}</Keycap>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );

  const tiles = (
    <ul className={cn("grid gap-4", COLS[columns])}>
      {items.map((d) => {
        const Icon = d.icon ? FEATURE_ICONS[d.icon] : ArrowRight;
        return (
          <li key={d.title}>
            <Link
              href={d.href}
              className="group relative flex h-full min-h-60 flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-6 transition-colors duration-300 hover:border-accent/50"
            >
              <Icon
                aria-hidden="true"
                className="absolute -end-6 -top-6 size-40 text-accent opacity-[0.12] transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-105"
                strokeWidth={0.75}
              />
              <span aria-hidden="true" className="relative">
                <Keycap>{keyOf(d)}</Keycap>
              </span>
              <div className="relative">
                <Item className="block font-heading text-2xl tracking-[-0.02em] text-foreground">
                  {d.title}
                </Item>
                <span className="t-small mt-2 block text-muted-foreground">
                  {d.line}
                </span>
                <ArrowRight
                  aria-hidden="true"
                  className="mt-5 size-5 text-link transition-transform duration-300 group-hover:translate-x-1.5 rtl:rotate-180"
                />
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );

  const art = (
    <div aria-hidden="true" className="absolute inset-0 -z-10">
      <div className="absolute -top-32 start-[8%] size-[34rem] rounded-full bg-[var(--glow-teal)] blur-3xl" />
      <div className="absolute -bottom-40 end-[6%] size-[30rem] rounded-full bg-[var(--glow-orange)] blur-3xl" />
    </div>
  );

  return (
    <BannerShell
      headingId={title ? headingId : undefined}
      size="section"
      className={cn("bg-background", className)}
      art={art}
    >
      {layout === "tiles" ? (
        <>
          <div className="max-w-3xl">
            {eyebrow && <Kicker className="mb-6">{eyebrow}</Kicker>}
            {title && (
              <Heading id={headingId} className="t-statement-sm text-foreground">
                {title}
              </Heading>
            )}
            {intro && <p className="t-lead mt-5">{intro}</p>}
          </div>
          <div className="mt-12">{tiles}</div>
        </>
      ) : (
        <div
          className={cn(
            "grid gap-12",
            split
              ? "lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-center lg:gap-20"
              : "justify-items-center text-center",
          )}
        >
          <div className={cn("min-w-0", !split && "max-w-2xl")}>
            {eyebrow && (
              <Kicker center={!split} className="mb-6">
                {eyebrow}
              </Kicker>
            )}
            {title && (
              <Heading id={headingId} className="t-statement-sm text-foreground">
                {title}
              </Heading>
            )}
            {intro && (
              <p className={cn("t-lead mt-5", !split && "mx-auto")}>{intro}</p>
            )}
          </div>
          <div className={cn("w-full text-start", !split && "max-w-2xl")}>
            {palette}
          </div>
        </div>
      )}
    </BannerShell>
  );
}
