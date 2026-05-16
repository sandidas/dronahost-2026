import Link from "next/link";
import Section from "@/components/ui/Section";
import HeadLineText from "@/components/ui/HeadLineText";
import Badge from "@/components/ui/Badge";
import HomeHeroBannerVideo from "@/components/sections/HomeHeroBannerVideo";
import GradientText from "@/components/ui/GradientText";
import HeroServicesCard from "@/components/sections/HeroServicesCard";

export interface HomeHeroBannerProps {
  /**
   * YouTube video ID for the background (part after watch?v=).
   * When omitted the hero shows the .hero gradient fallback.
   */
  youtubeVideoId?: string;
}

const metrics = [
  { label: "Page Speed",   value: "200ms",  sub: "London → NYC"    },
  { label: "Always Online", value: "99.95%", sub: "guaranteed"      },
  { label: "Expert Help",  value: "18 min", sub: "response, 24/7"  },
] as const;

export default function HomeHeroBanner({ youtubeVideoId }: HomeHeroBannerProps) {
  return (
    <section className="hero" aria-label="DronaHost — managed web hosting">
      {/* Background video — client-only, lazy YouTube embed */}
      {youtubeVideoId && (
        <HomeHeroBannerVideo videoId={youtubeVideoId} />
      )}

      {/* Content — above video and overlay */}
      <Section as="div" padding="hero" size="xl" className="relative z-10">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">

          {/* ── Left: headline + CTAs ── */}
          <div className="flex flex-col items-start gap-5">
            <Badge variant="success">Your website never goes offline · verified</Badge>

            {/* H1 leads with primary keyword "cloud web hosting" for SEO */}
            <HeadLineText
              as="h1"
              fontSize="custom"
              className="text-5xl lg:text-6xl xl:text-8xl xl:leading-[0.95] tracking-[-0.03em]"
              align="left"
            >
              Cloud web hosting{" "}
              <GradientText gradient="warm">
                built for speed
              </GradientText>
            </HeadLineText>

            <p className="max-w-[50ch] text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
              Stop losing customers to slow pages and unexpected downtime.{" "}
              <strong className="text-slate-900 dark:text-white">
                We handle everything
              </strong>{" "}
              — so your website is always fast, always online, and always
              working as hard as you do.
            </p>

            <div className="flex flex-wrap gap-3.5">
              <Link href="/hosting/wordpress" className="primary-btn">
                Launch Your Website Today
              </Link>
              <Link href="/contact" className="secondary-btn">
                Talk to an expert
              </Link>
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              30-day money-back guarantee · We migrate for free · Cancel anytime
            </p>
          </div>

          {/* ── Right: performance card + floating metrics (desktop only) ── */}
          <div className="hidden flex-col items-center gap-4 lg:flex">
            {/* Animated services cycling card */}
            <HeroServicesCard />

            {/* Floating metric cards */}
            <div className="flex w-full max-w-[360px] gap-3">
              {metrics.map((m, i) => (
                <div
                  key={m.label}
                  className="animate-card-loop flex-1 rounded-xl border border-slate-200/60 bg-white/85 p-3.5 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
                  style={{ animationDelay: `${i * 1.4}s` }}
                >
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {m.label}
                  </p>
                  <p className="mt-0.5 font-[family-name:var(--font-heading)] text-xl font-bold text-slate-900 dark:text-white">
                    {m.value}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {m.sub}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Mobile metric strip (hidden lg+) ── */}
        <div className="mt-10 grid grid-cols-3 gap-3 lg:hidden">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="rounded-xl border border-slate-200/60 bg-white/85 p-3 text-center backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
            >
              <p className="font-[family-name:var(--font-heading)] text-lg font-bold text-slate-900 dark:text-white">
                {m.value}
              </p>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {m.label}
              </p>
            </div>
          ))}
        </div>
      </Section>
    </section>
  );
}
