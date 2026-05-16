import Link from "next/link";
import Section from "@/components/ui/Section";
import HeadLineText from "@/components/ui/HeadLineText";
import Badge from "@/components/ui/Badge";

export type CTAItem = {
  label: string;
  href: string;
  variant?: "primary" | "secondary";
};

export type TechItem = {
  name: string;
  detail: string;
  /** Two-character abbreviation for the icon. Defaults to first two chars of name. */
  abbr?: string;
};

export interface InnerPageHeroBannerProps {
  /** Eyebrow badge label — e.g. "WordPress Hosting" */
  tagline: string;
  /** Primary H1 text */
  title: string;
  /** Optional phrase appended to title in accent color */
  titleAccent?: string;
  /** Body paragraph beneath the headline */
  description: string;
  /** CTA buttons — first item is primary by default */
  cta: [CTAItem, ...CTAItem[]];
  /** Short feature chips below the CTAs */
  features?: string[];
  /** Items shown in the right-side tech panel. Defaults to hosting stack. */
  techStack?: TechItem[];
}

const defaultTechStack: TechItem[] = [
  { name: "LiteSpeed", detail: "Web server", abbr: "LS" },
  { name: "NVMe SSD", detail: "Storage layer", abbr: "NV" },
  { name: "Cloudflare", detail: "CDN & DDoS protection", abbr: "CF" },
  { name: "Let's Encrypt", detail: "Free SSL / TLS", abbr: "LE" },
  { name: "WordPress", detail: "Pre-configured", abbr: "WP" },
  { name: "WP-CLI", detail: "Command-line tools", abbr: "CLI" },
];

export default function InnerPageHeroBanner({
  tagline,
  title,
  titleAccent,
  description,
  cta,
  features,
  techStack = defaultTechStack,
}: InnerPageHeroBannerProps) {
  return (
    <section
      className="relative overflow-hidden bg-[var(--background)]"
      aria-label={tagline}
    >
      {/* Decorative blobs — aria-hidden, no images */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full opacity-[0.08] blur-3xl"
        style={{ background: "var(--accent)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 -left-28 h-[420px] w-[420px] rounded-full opacity-[0.07] blur-3xl"
        style={{ background: "var(--primary)" }}
      />

      <Section padding="hero" size="xl" className="relative z-10">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* ── Left: headline + CTAs ── */}
          <div className="flex flex-col items-start gap-5">
            <Badge variant="secondary">{tagline}</Badge>

            <HeadLineText as="h1" fontSize="fiveXl" align="left">
              {titleAccent ? (
                <>
                  {title}{" "}
                  <span style={{ color: "var(--accent)" }}>{titleAccent}</span>
                </>
              ) : (
                title
              )}
            </HeadLineText>

            <p className="max-w-[50ch] text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
              {description}
            </p>

            <div className="flex flex-wrap gap-3.5">
              {cta.map((item) => (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  className={
                    item.variant === "secondary" ? "secondary-btn" : "primary-btn"
                  }
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {features && features.length > 0 && (
              <ul
                className="mt-1 flex flex-wrap gap-2"
                aria-label="Included features"
              >
                {features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/60 px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300"
                  >
                    <span
                      className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
                      style={{ background: "var(--accent)" }}
                      aria-hidden="true"
                    />
                    {f}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* ── Right: browser-chrome tech card (desktop only) ── */}
          <div className="hidden lg:block">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
              {/* Browser chrome bar */}
              <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/50">
                <span
                  className="h-2.5 w-2.5 rounded-full bg-red-400"
                  aria-hidden="true"
                />
                <span
                  className="h-2.5 w-2.5 rounded-full bg-amber-400"
                  aria-hidden="true"
                />
                <span
                  className="h-2.5 w-2.5 rounded-full bg-emerald-400"
                  aria-hidden="true"
                />
                <span className="ml-2 font-mono text-[11px] text-slate-400 dark:text-slate-500">
                  dashboard.dronahost.com
                </span>
              </div>

              {/* Panel content */}
              <div className="p-5">
                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  Included with every plan
                </p>

                <div className="grid grid-cols-2 gap-2.5">
                  {techStack.map((tech) => {
                    const abbr =
                      tech.abbr ?? tech.name.slice(0, 2).toUpperCase();
                    return (
                      <div
                        key={tech.name}
                        className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/50"
                      >
                        <span
                          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-[10px] font-extrabold leading-none text-white"
                          style={{
                            background:
                              "linear-gradient(135deg, var(--primary), var(--primary-light))",
                          }}
                          aria-hidden="true"
                        >
                          {abbr}
                        </span>
                        <div>
                          <p className="text-xs font-semibold leading-tight text-slate-900 dark:text-slate-100">
                            {tech.name}
                          </p>
                          <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                            {tech.detail}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Status footer */}
                <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2.5 dark:border-emerald-900/40 dark:bg-emerald-950/30">
                  <span
                    className="h-2 w-2 flex-shrink-0 animate-pulse rounded-full bg-emerald-500"
                    aria-hidden="true"
                  />
                  <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                    Free migration · live in under 10 minutes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </section>
  );
}
