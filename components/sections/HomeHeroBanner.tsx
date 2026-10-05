import Section from "@/components/ui/Section";
import HeadLineText from "@/components/ui/HeadLineText";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import HomeHeroBannerVideo from "@/components/sections/HomeHeroBannerVideo";
import GradientText from "@/components/ui/GradientText";
import HeroTrustCards from "@/components/sections/HeroTrustCards";

export interface HomeHeroBannerProps {
  /**
   * YouTube video ID for the background (part after watch?v=).
   * When omitted the hero shows the .hero gradient fallback.
   */
  youtubeVideoId?: string;
}

const metrics = [
  { label: "Page Speed",    value: "200ms",  sub: "London → NYC"  },
  { label: "Always Online", value: "99.95%", sub: "guaranteed"    },
  { label: "Expert Help",   value: "~5 min", sub: "avg · 24/7"    },
] as const;

export default function HomeHeroBanner({ youtubeVideoId }: HomeHeroBannerProps) {
  return (
    <section className="hero" aria-label="DronaHost — managed web hosting">
      {/* Background video — client-only, lazy YouTube embed */}
      {youtubeVideoId && (
        <HomeHeroBannerVideo videoId={youtubeVideoId} />
      )}

      {/* Content — above video and overlay */}
      <Section as="div" padding="hero" size="lg" className="relative z-10">
        <div className="grid grid-cols-1 items-center gap-10 md:gap-12 lg:gap-16 xl:grid-cols-2">

          {/* ── Left: headline + CTAs ── */}
          <div className="flex flex-col items-start gap-5">
            <Badge variant="success">Your website never goes offline · verified</Badge>

            {/* H1 leads with primary keyword "cloud web hosting" for SEO */}
            <HeadLineText
              as="h1"
              fontSize="custom"
              className="text-4xl tracking-[-0.03em] sm:text-5xl lg:text-6xl xl:text-8xl xl:leading-[0.95]"
              align="left"
            >
              Cloud web hosting{" "}
              <GradientText gradient="warm">
                built for speed
              </GradientText>
            </HeadLineText>

            <p className="max-w-[50ch] text-base leading-relaxed text-[var(--muted-foreground)] sm:text-lg">
              Stop losing customers to slow pages and unexpected downtime.{" "}
              <strong className="text-foreground">
                We handle everything
              </strong>{" "}
              — so your website is always fast, always online, and always
              working as hard as you do.
            </p>

            <Button href="/hosting/wordpress" size="lg" fullWidth>
              Get Started
            </Button>

            <p className="text-sm text-[var(--muted-foreground)]">
              30-day money-back guarantee · We migrate for free · Cancel anytime
            </p>

            {/* Metric strip — visible below xl (right column is hidden below xl) */}
            <div className="grid w-full grid-cols-3 gap-2.5 xl:hidden">
              {metrics.map((m) => (
                <div
                  key={m.label}
                  className="rounded-xl border bg-[var(--card)]/85 p-3 text-center backdrop-blur-xl"
                >
                  <p className="font-[family-name:var(--font-heading)] text-base font-bold text-foreground sm:text-lg">
                    {m.value}
                  </p>
                  <p className="mt-0.5 text-[11px] text-[var(--muted-foreground)]">
                    {m.label}
                  </p>
                  <p className="mt-0.5 hidden text-[10px] text-[var(--muted-foreground)] sm:block">
                    {m.sub}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: trust cards + metric row (xl+) ── */}
          <div className="hidden flex-col items-center gap-4 xl:flex">
            <HeroTrustCards />

            {/* Floating metric cards */}
            <div className="flex w-full max-w-[360px] gap-2.5">
              {metrics.map((m, i) => (
                <div
                  key={m.label}
                  className="animate-card-loop flex-1 rounded-xl border bg-[var(--card)]/85 p-3 shadow-lg backdrop-blur-xl lg:p-3.5"
                  style={{ animationDelay: `${i * 1.4}s` }}
                >
                  <p className="text-[11px] text-[var(--muted-foreground)]">
                    {m.label}
                  </p>
                  <p className="mt-0.5 font-[family-name:var(--font-heading)] text-lg font-bold text-foreground lg:text-xl">
                    {m.value}
                  </p>
                  <p className="mt-0.5 text-[11px] text-[var(--muted-foreground)]">
                    {m.sub}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </section>
  );
}
