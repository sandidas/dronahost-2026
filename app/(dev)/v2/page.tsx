import { notFound } from "next/navigation";
import { startingPriceLabel } from "@/lib/pricing";
import Link from "next/link";

import ShowcaseSection from "./_components/ShowcaseSection";
import ShowcaseSidebar from "./_components/ShowcaseSidebar";
import ShowcaseLayout from "./_components/ShowcaseLayout";

import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Section from "@/components/ui/Section";
import HeadLineText from "@/components/ui/HeadLineText";
import Card from "@/components/ui/Card";
import FeatureSection from "@/components/sections/HomeFeatureSection";
import CaseStudySection from "@/components/sections/CaseStudy";
import CTASection from "@/components/sections/HomeCTA";
import TwoColumn from "@/components/sections/TwoColumn";
import FeatureGrid from "@/components/sections/FeatureGrid";
import ProcessSteps from "@/components/sections/ProcessSteps";
import NewCTASection from "@/components/sections/CTASection";
import ResourceGrid from "@/components/sections/ResourceGrid";
import PricingJourney from "@/components/sections/PricingJourney";
import TestimonialsSection from "@/components/sections/Testimonials";
import FAQSection from "@/components/sections/FAQSection";
import LogoWall from "@/components/sections/LogoWall";
import ProductHero from "@/components/sections/ProductHero";
import SplitHero from "@/components/sections/SplitHero";
import CenteredHero from "@/components/sections/CenteredHero";
import { HOME_HERO, WORDPRESS_HERO, ABOUT_HERO } from "@/content/heroes";
import Header from "@/layouts/header/header";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import CurrencySelector from "@/components/layout/CurrencySelector";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Footer from "@/layouts/footer/footer";
import JsonLd from "@/components/sections/JsonLd";
import TrustBadges from "@/components/sections/TrustBadges";
import GradientText from "@/components/ui/GradientText";
import StatsBar from "@/components/sections/StatsBar";
import { CLAIMS } from "@/content/claims";

import {
  featureData,
  caseStudyData,
  ctaData,
  pricingJourneyData,
  testimonialsData,
  faqData,
  teamsData,
} from "@/content/placeholders";

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "DronaHost",
  url: "https://dronahost.com",
};

const gridItems = [
  { title: "Performance Hosting", description: "LiteSpeed + NVMe storage, NVMe storage on every plan." },
  { title: "Managed WordPress", description: "Daily backups, staging, and one-click rollbacks." },
  { title: "Global CDN", description: "Content delivered from a global edge network." },
  { title: "Developer Tools", description: "SSH, WP-CLI, Git deploy hooks, PHP version selector." },
  { title: "Security", description: "Let's Encrypt SSL, WAF, and automated malware scans." },
  { title: "Transparent SLA", description: "Published SLA with service-credit terms." },
];

export default function V2ShowcasePage() {
  if (process.env.NODE_ENV !== "development") notFound();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* ── Fixed top bar ── */}
      <div className="fixed top-0 inset-x-0 z-50 h-14 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 flex items-center justify-between px-6">
        {/* Left: title + env badge */}
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
            DronaHost Component Library
          </span>
          <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
            NODE_ENV: development
          </span>
        </div>
        {/* Right: status legend */}
        <div className="hidden sm:flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <span>✅ Built</span>
          <span>⚠️ Needs work</span>
          <span>❌ Missing</span>
        </div>
      </div>

      {/* ── Body: sidebar + main ── */}
      <ShowcaseLayout sidebar={<ShowcaseSidebar />}>
          <h1 className="mb-8 text-2xl font-bold text-slate-900 dark:text-slate-100">
            Component Showcase
          </h1>

          {/* ── Section ── */}
          <ShowcaseSection
            id="section"
            title="Section"
            status="built"
            notes="Layout primitive used on every page."
          >
            <div className="space-y-4">
              <Section size="lg" padding="sm" className="border-2 border-dashed border-slate-300 rounded-lg">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Default lg size with border-dashed. The inner container is max-w-7xl, centered.
                </p>
              </Section>
              <Section size="md" padding="sm" variant="surface" className="rounded-lg">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Surface variant — uses the card token background with a bottom border divider.
                </p>
              </Section>
              <Section size="md" padding="sm" variant="featured" className="rounded-lg">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Featured variant — warm amber/orange gradient card, ideal for pricing banners.
                </p>
              </Section>
            </div>
          </ShowcaseSection>

          {/* ── GradientText ── */}
          <ShowcaseSection
            id="gradient-text"
            title="GradientText"
            status="built"
            notes="Inline gradient fill via bg-clip-text. 4 presets: brand (sky→indigo→orange), warm (indigo→orange), cool (sky→indigo), aurora (wide sweep). Use inside any HeadLineText or paragraph."
          >
            <div className="space-y-6">
              {(["brand", "warm", "cool", "aurora"] as const).map((g) => (
                <div key={g}>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {g}
                  </p>
                  <p className="font-[family-name:var(--font-heading)] text-4xl font-black">
                    <GradientText gradient={g}>
                      Speed you can measure
                    </GradientText>
                  </p>
                </div>
              ))}
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  brand — inside HeadLineText (hero usage)
                </p>
                <HeadLineText as="h2" fontSize="fourXl" align="left">
                  Hosting built for{" "}
                  <GradientText gradient="brand">speed you can measure</GradientText>
                </HeadLineText>
              </div>
            </div>
          </ShowcaseSection>

          {/* ── HeadLineText ── */}
          <ShowcaseSection
            id="headline-text"
            title="HeadLineText"
            status="needs-work"
            notes="No fluid clamp sizing between breakpoints — jumps on tablet."
          >
            <div className="space-y-4">
              <div>
                <p className="mb-1 text-xs text-slate-400 uppercase tracking-wide">sixXl</p>
                <HeadLineText fontSize="sixXl">Managed Hosting</HeadLineText>
              </div>
              <div>
                <p className="mb-1 text-xs text-slate-400 uppercase tracking-wide">fourXl</p>
                <HeadLineText fontSize="fourXl">Managed Hosting</HeadLineText>
              </div>
              <div>
                <p className="mb-1 text-xs text-slate-400 uppercase tracking-wide">twoXl</p>
                <HeadLineText fontSize="twoXl">Managed Hosting</HeadLineText>
              </div>
              <div>
                <p className="mb-1 text-xs text-slate-400 uppercase tracking-wide">md</p>
                <HeadLineText fontSize="md">Managed Hosting</HeadLineText>
              </div>
              <div>
                <p className="mb-1 text-xs text-slate-400 uppercase tracking-wide">sm</p>
                <HeadLineText fontSize="sm">Managed Hosting</HeadLineText>
              </div>
            </div>
          </ShowcaseSection>

          {/* ── GridCard ── */}
          <ShowcaseSection
            id="grid-card"
            title="GridCard"
            status="needs-work"
            notes="Missing mobile hover/focus states. Border logic desktop-only."
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {gridItems.map((item, i) => (
                <Card key={i} variant="grid" index={i} total={6} columns={3} size="md">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
                </Card>
              ))}
            </div>
          </ShowcaseSection>

          {/* ── ResourceCard ── */}
          <ShowcaseSection
            id="resource-card"
            title="ResourceCard"
            status="built"
            notes="Used in blog/KB context. Renders correctly."
          >
            <p className="text-sm text-slate-600 dark:text-slate-400">
              ResourceCard renders inside the blog and knowledge base listing pages. Visit{" "}
              <Link href="/blog" className="text-orange-600 underline hover:text-orange-700 dark:text-orange-400">
                /blog
              </Link>{" "}
              to see it in use.
            </p>
          </ShowcaseSection>

          {/* ── ResourceBox ── */}
          <ShowcaseSection
            id="resource-box"
            title="ResourceBox"
            status="built"
            notes="Used in blog/KB context. Renders correctly."
          >
            <p className="text-sm text-slate-600 dark:text-slate-400">
              ResourceBox renders inside the blog and knowledge base listing pages. Visit{" "}
              <Link href="/blog" className="text-orange-600 underline hover:text-orange-700 dark:text-orange-400">
                /blog
              </Link>{" "}
              to see it in use.
            </p>
          </ShowcaseSection>

          {/* ── Buttons ── */}
          <ShowcaseSection
            id="buttons"
            title="Buttons"
            status="built"
            notes="Link-based SSR component (renders <a>). Variants: primary, secondary. Sizes: sm, md (default), lg. fullWidth stretches to container. external adds target=_blank + rel. Hover: lift + shadow (primary), border accent (secondary)."
          >
            <div className="space-y-6">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Variants</p>
                <div className="flex flex-wrap items-center gap-4">
                  <Button href="#" variant="primary">Primary</Button>
                  <Button href="#" variant="secondary">Secondary</Button>
                </div>
              </div>
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Sizes — primary (resize window to see responsive scaling)</p>
                <div className="flex flex-wrap items-end gap-4">
                  <Button href="#" size="sm">Small</Button>
                  <Button href="#" size="md">Medium</Button>
                  <Button href="#" size="lg">Large</Button>
                  <Button href="#" size="xl">Extra Large</Button>
                </div>
              </div>
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Sizes — secondary</p>
                <div className="flex flex-wrap items-end gap-4">
                  <Button href="#" variant="secondary" size="sm">Small</Button>
                  <Button href="#" variant="secondary" size="md">Medium</Button>
                  <Button href="#" variant="secondary" size="lg">Large</Button>
                  <Button href="#" variant="secondary" size="xl">Extra Large</Button>
                </div>
              </div>
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Full width</p>
                <div className="max-w-sm space-y-3">
                  <Button href="#" fullWidth>Primary full width</Button>
                  <Button href="#" variant="secondary" fullWidth>Secondary full width</Button>
                </div>
              </div>
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">External link</p>
                <div className="flex flex-wrap gap-4">
                  <Button href="https://dronahost.com" external>Opens new tab ↗</Button>
                </div>
              </div>
            </div>
          </ShowcaseSection>

          {/* ── Contact Form ── */}
          <ShowcaseSection
            id="contact-form"
            title="Contact Form"
            status="needs-work"
            notes="Embedded in /contact only — not a reusable component."
          >
            <p className="text-sm text-slate-600 dark:text-slate-400">
              The contact form is embedded directly in the{" "}
              <a href="/contact" className="text-orange-600 underline hover:text-orange-700 dark:text-orange-400">
                /contact
              </a>{" "}
              page and has not yet been extracted into a standalone reusable component. Needs extraction and Zod validation wiring.
            </p>
          </ShowcaseSection>

          {/* ── Announcement bar ── */}
          <ShowcaseSection
            id="announcement-bar"
            title="Announcement Bar"
            status="pending-review"
            notes="Reads content/announcement.ts and renders nothing while disabled. The sample below is forced on for review only. Dismissal is remembered per message id."
          >
            <div className="overflow-hidden rounded-lg border border-border">
              <AnnouncementBar
                forceEnabled
                id="showcase"
                message="Sample notice: scheduled maintenance details would appear here."
                link={{ label: "Read the status update", href: "#announcement-bar" }}
              />
            </div>
          </ShowcaseSection>

          {/* ── Theme toggle + currency selector ── */}
          <ShowcaseSection
            id="theme-currency"
            title="Theme Toggle and Currency Selector"
            status="pending-review"
            notes="Theme toggle switches dark (default) and light. The currency selector is behind FEATURES.currencySelector (off, USD only) and is forced on here for review."
          >
            <div className="flex flex-wrap items-center gap-4">
              <ThemeToggle />
              <ThemeToggle showLabel className="max-w-48" />
              <CurrencySelector forceEnabled />
            </div>
          </ShowcaseSection>

          {/* ── Header ── */}
          <ShowcaseSection
            id="header"
            title="Header"
            status="pending-review"
            notes="Batch A rebuild: sticky, tokens only, crawlable hosting mega menu (always in the HTML), keyboard and Escape support, mobile drawer with focus trap. Log in points to /login, which is not built yet."
          >
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
              <Header />
            </div>
          </ShowcaseSection>

          {/* ── Footer ── */}
          <ShowcaseSection
            id="footer"
            title="Footer"
            status="pending-review"
            notes="Batch A rebuild: four unique columns, real routes only. Legal entity, address, email, socials and payment methods stay hidden until set in content/company.ts and content/claims.ts."
          >
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
              <Footer />
            </div>
          </ShowcaseSection>

          {/* ── Heroes (Batch B) ── */}
          <ShowcaseSection
            id="product-hero"
            title="ProductHero"
            status="pending-review"
            notes="Hero 1 of 3. Display headline, one primary action, verified highlights, dashboard mockup. Used on the homepage. Replaces HomeHero, HomeHeroSection, HomeHeroBanner and its video variant."
          >
            <div className="overflow-hidden rounded-lg border border-border">
              <ProductHero {...HOME_HERO} headingLevel="h2" />
            </div>
          </ShowcaseSection>

          <ShowcaseSection
            id="split-hero"
            title="SplitHero"
            status="pending-review"
            notes="Hero 2 of 3. Text beside a UI mockup (staging workflow). Used on /wordpress-hosting. Replaces InnerPageHeroBanner and the per-page split heroes."
          >
            <div className="overflow-hidden rounded-lg border border-border">
              <SplitHero {...WORDPRESS_HERO} headingLevel="h2" />
            </div>
          </ShowcaseSection>

          <ShowcaseSection
            id="centered-hero"
            title="CenteredHero"
            status="pending-review"
            notes="Hero 3 of 3. Minimal, text only. Used on /about and /seo-services. Replaces PageHero and ExperienceHeroSection."
          >
            <div className="overflow-hidden rounded-lg border border-border">
              <CenteredHero {...ABOUT_HERO} headingLevel="h2" />
            </div>
          </ShowcaseSection>

          {/* ── Feature Section ── */}
          <ShowcaseSection
            id="features"
            title="Feature Section"
            status="needs-work"
            notes="Feature images placeholder SVGs. No real benchmark data."
          >
            <FeatureSection data={featureData} />
          </ShowcaseSection>

          {/* ── Services Section ── */}
          <ShowcaseSection
            id="services"
            title="Services Section"
            status="needs-work"
            notes="Replaces ServicesSection (home/ServiceSection). Use FeatureGrid for service grids."
          >
            <FeatureGrid
              tagline="Our Services"
              title="What We Offer"
              columns={3}
              divided={true}
              items={[
                { title: "Web Hosting", description: "Managed LiteSpeed hosting with NVMe storage." },
                { title: "VPS Hosting", description: "Full root access, scalable on demand." },
                { title: "SEO Services", description: "Retainer-based SEO for Western markets." },
              ]}
            />
          </ShowcaseSection>

          {/* ── Case Study ── */}
          <ShowcaseSection
            id="case-study"
            title="Case Study"
            status="needs-work"
            notes="No real case study. Metrics hardcoded."
          >
            <CaseStudySection data={caseStudyData} showSamples />
          </ShowcaseSection>

          {/* ── CTA Section ── */}
          <ShowcaseSection
            id="cta"
            title="CTA Section"
            status="built"
            notes="Structure solid. Needs real copy + final CTA URLs."
          >
            <CTASection data={ctaData} />
          </ShowcaseSection>

          {/* ── Pricing Journey ── */}
          <ShowcaseSection
            id="pricing-journey"
            title="Pricing Journey"
            status="needs-work"
            notes="Slider not keyboard accessible. No ARIA labels."
          >
            <PricingJourney data={pricingJourneyData} />
          </ShowcaseSection>

          {/* ── Testimonials ── */}
          <ShowcaseSection
            id="testimonials"
            title="Testimonials"
            status="needs-work"
            notes="All placeholder. No LinkedIn links. Critical trust gap."
          >
            <TestimonialsSection data={testimonialsData} showSamples />
          </ShowcaseSection>

          {/* ── FAQ Section ── */}
          <ShowcaseSection
            id="faq"
            title="FAQ Section"
            status="needs-work"
            notes="Content placeholder. FAQPage JSON-LD not wired."
          >
            <FAQSection data={faqData} />
          </ShowcaseSection>

          {/* ── Teams Section ── */}
          <ShowcaseSection
            id="teams"
            title="Teams Section"
            status="needs-work"
            notes="No real photos. LinkedIn links missing."
          >
            <LogoWall data={teamsData} showSamples />
          </ShowcaseSection>

          {/* ── JsonLd ── */}
          <ShowcaseSection
            id="json-ld"
            title="JsonLd"
            status="built"
            notes="Outputs script tag. Verify with Rich Results Test."
          >
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              JsonLd injects a{" "}
              <code className="rounded bg-slate-100 px-1 py-0.5 text-xs dark:bg-slate-800">
                {"<script type=\"application/ld+json\">"}
              </code>{" "}
              tag with no visual output. Preview of the schema passed below:
            </p>
            <pre className="mb-4 overflow-x-auto rounded-lg bg-slate-100 p-4 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {JSON.stringify(orgSchema, null, 2)}
            </pre>
            <JsonLd schema={orgSchema} />
          </ShowcaseSection>

          {/* ── Trust Badges ── */}
          <ShowcaseSection
            id="trust-badges"
            title="Trust Badges"
            status="built"
            notes="Accepted payment methods only (no endorsement marks). Hidden until methods are verified in content/claims.ts."
          >
            <TrustBadges showSamples />
          </ShowcaseSection>

          {/* ── Uptime / Stats Bar ── */}
          <ShowcaseSection
            id="uptime-bar"
            title="Uptime / Stats Bar"
            status="built"
            notes="Driven by content/claims.ts. Renders nothing until a claim is verified. Showcase previews the unverified list with a label."
          >
            <StatsBar claims={CLAIMS} />
          </ShowcaseSection>

          {/* ── Badge ── */}
          <ShowcaseSection
            id="badge"
            title="Badge"
            status="built"
            notes="Four variants: primary (orange), secondary (blue), success (green), neutral (gray). Used for plan labels, status tags, taglines."
          >
            <div className="flex flex-wrap gap-3">
              <Badge variant="primary">WordPress Hosting</Badge>
              <Badge variant="secondary">VPS</Badge>
              <Badge variant="success">GDPR Compliant</Badge>
              <Badge variant="neutral">Beta</Badge>
            </div>
          </ShowcaseSection>

          {/* ── TwoColumn ── */}
          <ShowcaseSection
            id="two-column"
            title="TwoColumn"
            status="built"
            notes="Image left or right. Optional feature checklist. Replaces PricingSection1–4."
          >
            <TwoColumn
              tagline="Managed WordPress"
              title="Everything you need, nothing you don't"
              description="Pre-configured caching, automatic updates, and daily backups — so you focus on your site."
              features={["LiteSpeed cache pre-installed", "Daily off-site backups", "One-click staging", "Free SSL forever"]}
              cta={[{ label: "Get started", href: "#" }]}
              image={{ src: "/images/placeholder.png", alt: "Feature illustration", width: 560, height: 480 }}
              imagePosition="right"
            />
          </ShowcaseSection>

          {/* ── FeatureGrid ── */}
          <ShowcaseSection
            id="feature-grid"
            title="FeatureGrid"
            status="built"
            notes="divided and undivided modes. 2/3/4 columns. Replaces ServiceSection and 4 others."
          >
            <FeatureGrid
              tagline="Why DronaHost"
              title="Built for speed, reliability, and growth"
              columns={3}
              divided={true}
              items={[
                { title: "LiteSpeed + NVMe", description: "Server-level caching and fast storage on managed WordPress plans." },
                { title: "Published SLA", description: "Uptime commitment and service-credit terms set out in writing." },
                { title: "Human support", description: "Open a ticket, start a live chat, or message us on WhatsApp." },
              ]}
            />
          </ShowcaseSection>

          {/* ── ProcessSteps ── */}
          <ShowcaseSection
            id="process-steps"
            title="ProcessSteps"
            status="built"
            notes="alternating and numbered layouts. Replaces HowItWorks + OurProcess."
          >
            <ProcessSteps
              tagline="How it works"
              title="Up and running in under 10 minutes"
              layout="numbered"
              steps={[
                { step: 1, title: "Choose your plan", description: "Pick the hosting plan that fits your site size and traffic." },
                { step: 2, title: "Point your domain", description: "Update your nameservers or transfer your domain to us." },
                { step: 3, title: "Go live", description: "We migrate your site for free and you go live with zero downtime." },
              ]}
            />
          </ShowcaseSection>

          {/* ── CTASection ── */}
          <ShowcaseSection
            id="cta-section"
            title="CTASection"
            status="built"
            notes="default and gradient variants. Image left + content right. Replaces 4 CTA components."
          >
            <NewCTASection
              title="Ready to move your WordPress site?"
              description="We migrate for free. Your site stays live the entire time."
              tagline="Free migration"
              cta={[{ label: "Get started", href: "#" }, { label: "Talk to an expert", href: "#", variant: "secondary" }]}
            />
          </ShowcaseSection>

          {/* ── ResourceGrid ── */}
          <ShowcaseSection
            id="resource-grid"
            title="ResourceGrid"
            status="built"
            notes="2 or 3 column post grid. Optional featured first post. Replaces blog/AllBlogs, FeatureInsight, developmentHub."
          >
            <ResourceGrid
              tagline="From the blog"
              title="Resources for developers"
              columns={3}
              posts={[
                { title: "Why LiteSpeed beats Apache for WordPress", description: "Benchmark results from 10 production sites.", href: "#", category: "Performance" },
                { title: "GDPR compliance checklist for SaaS founders", description: "The 12 things you need before you ship in the EU.", href: "#", category: "Compliance" },
                { title: "Free migration: what actually happens", description: "A behind-the-scenes look at our zero-downtime migration process.", href: "#", category: "Hosting" },
              ]}
            />
          </ShowcaseSection>

      </ShowcaseLayout>
    </div>
  );
}
