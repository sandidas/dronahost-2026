import { notFound } from "next/navigation";
import Link from "next/link";

import ShowcaseSection from "./_components/ShowcaseSection";
import ShowcaseSidebar from "./_components/ShowcaseSidebar";
import ShowcaseLayout from "./_components/ShowcaseLayout";

import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Section from "@/components/ui/Section";
import HeadLineText from "@/components/ui/HeadLineText";
import Card from "@/components/ui/Card";
import TwoColumn from "@/components/sections/TwoColumn";
import FeatureGrid from "@/components/sections/FeatureGrid";
import BentoGrid from "@/components/sections/BentoGrid";
import PricingPlans from "@/components/sections/PricingPlans";
import PricingExtras from "@/components/sections/PricingExtras";
import { buildPlanCards, VAT_DISPLAY } from "@/lib/pricing/plans";
import ComparisonTable from "@/components/sections/ComparisonTable";
import { buildPlanComparison } from "@/lib/pricing/compare";
import { HOME_BENTO, HOME_COMPARE, HOME_OFFER, HOME_SPLITS } from "@/content/home";
import { CacheVisual, ChannelsVisual, GrowthVisual, RestoreVisual } from "@/components/sections/visuals/bento";
import { MigrationVisual, ProtectionVisual, SupportChannelsVisual, WordPressSettingsVisual } from "@/components/sections/visuals/split";
import ProductHero from "@/components/sections/ProductHero";
import SplitHero from "@/components/sections/SplitHero";
import CenteredHero from "@/components/sections/CenteredHero";
import { HOME_HERO, WORDPRESS_HERO, ABOUT_HERO } from "@/content/heroes";
import CaseStudy from "@/components/sections/CaseStudy";
import CTABand from "@/components/sections/CTABand";
import FAQSection from "@/components/sections/FAQSection";
import LogoWall from "@/components/sections/LogoWall";
import NewsletterSignup from "@/components/sections/NewsletterSignup";
import ProcessTimeline from "@/components/sections/ProcessTimeline";
import ResourceGrid from "@/components/sections/ResourceGrid";
import StatsBar from "@/components/sections/StatsBar";
import SupportChannels from "@/components/sections/SupportChannels";
import Testimonials from "@/components/sections/Testimonials";
import TrustBadges from "@/components/sections/TrustBadges";
import TrustSignals from "@/components/sections/TrustSignals";
import CodeBlock from "@/components/ui/CodeBlock";
import { CLAIMS } from "@/content/claims";
import { HOME_CTA, HOME_FAQ } from "@/content/home";
import { MIGRATION_STEPS } from "@/content/faqs";
import { SAMPLE_CASE_STUDY, SAMPLE_CODE, SAMPLE_LOGOS, SAMPLE_POSTS, SAMPLE_TESTIMONIALS } from "@/content/placeholders";
import { TRUST_ITEMS } from "@/content/trust";
import Header from "@/layouts/header/header";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import CurrencySelector from "@/components/layout/CurrencySelector";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Footer from "@/layouts/footer/footer";
import JsonLd from "@/components/sections/JsonLd";
import GradientText from "@/components/ui/GradientText";


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
    <div className="min-h-screen bg-background">
      {/* ── Fixed top bar ── */}
      <div className="fixed top-0 inset-x-0 z-50 h-14 border-b border-border bg-background/90 backdrop-blur flex items-center justify-between px-6">
        {/* Left: title + env badge */}
        <div className="flex items-center gap-3">
          <span className="font-semibold text-foreground text-sm">
            DronaHost Component Library
          </span>
          <span className="inline-flex items-center rounded-full bg-warning-surface px-2.5 py-0.5 text-xs font-medium text-warning">
            NODE_ENV: development
          </span>
        </div>
        {/* Right: status legend */}
        <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground">
          <span>Built</span>
          <span>Needs work</span>
          <span>Missing</span>
        </div>
      </div>

      {/* ── Body: sidebar + main ── */}
      <ShowcaseLayout sidebar={<ShowcaseSidebar />}>
          <h1 className="mb-8 text-2xl font-bold text-foreground">
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
              <Section size="lg" padding="sm" className="border-2 border-dashed border-border-strong rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Default lg size with border-dashed. The inner container is max-w-7xl, centered.
                </p>
              </Section>
              <Section size="md" padding="sm" variant="surface" className="rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Surface variant — uses the card token background with a bottom border divider.
                </p>
              </Section>
              <Section size="md" padding="sm" variant="featured" className="rounded-lg">
                <p className="text-sm text-muted-foreground">
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
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
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
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
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
                <p className="mb-1 text-xs text-muted-foreground uppercase tracking-wide">sixXl</p>
                <HeadLineText fontSize="sixXl">Managed Hosting</HeadLineText>
              </div>
              <div>
                <p className="mb-1 text-xs text-muted-foreground uppercase tracking-wide">fourXl</p>
                <HeadLineText fontSize="fourXl">Managed Hosting</HeadLineText>
              </div>
              <div>
                <p className="mb-1 text-xs text-muted-foreground uppercase tracking-wide">twoXl</p>
                <HeadLineText fontSize="twoXl">Managed Hosting</HeadLineText>
              </div>
              <div>
                <p className="mb-1 text-xs text-muted-foreground uppercase tracking-wide">md</p>
                <HeadLineText fontSize="md">Managed Hosting</HeadLineText>
              </div>
              <div>
                <p className="mb-1 text-xs text-muted-foreground uppercase tracking-wide">sm</p>
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
                  <h3 className="font-semibold text-foreground mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
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
            <p className="text-sm text-muted-foreground">
              ResourceCard renders inside the blog and knowledge base listing pages. Visit{" "}
              <Link href="/blog" className="text-link underline">
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
            <p className="text-sm text-muted-foreground">
              ResourceBox renders inside the blog and knowledge base listing pages. Visit{" "}
              <Link href="/blog" className="text-link underline">
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
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Variants</p>
                <div className="flex flex-wrap items-center gap-4">
                  <Button href="#" variant="primary">Primary</Button>
                  <Button href="#" variant="secondary">Secondary</Button>
                </div>
              </div>
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Sizes — primary (resize window to see responsive scaling)</p>
                <div className="flex flex-wrap items-end gap-4">
                  <Button href="#" size="sm">Small</Button>
                  <Button href="#" size="md">Medium</Button>
                  <Button href="#" size="lg">Large</Button>
                  <Button href="#" size="xl">Extra Large</Button>
                </div>
              </div>
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Sizes — secondary</p>
                <div className="flex flex-wrap items-end gap-4">
                  <Button href="#" variant="secondary" size="sm">Small</Button>
                  <Button href="#" variant="secondary" size="md">Medium</Button>
                  <Button href="#" variant="secondary" size="lg">Large</Button>
                  <Button href="#" variant="secondary" size="xl">Extra Large</Button>
                </div>
              </div>
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Full width</p>
                <div className="max-w-sm space-y-3">
                  <Button href="#" fullWidth>Primary full width</Button>
                  <Button href="#" variant="secondary" fullWidth>Secondary full width</Button>
                </div>
              </div>
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">External link</p>
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
            <p className="text-sm text-muted-foreground">
              The contact form is embedded directly in the{" "}
              <a href="/contact" className="text-link underline">
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
            <div className="border border-border rounded-lg overflow-hidden">
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
            <div className="border border-border rounded-lg overflow-hidden">
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

          {/* ── Content sections (Batch C) ── */}
          <ShowcaseSection
            id="feature-grid"
            title="FeatureGrid"
            status="pending-review"
            notes="Cards, divided or plain variants; 2/3/4 columns; 1 to 12 items. Used for 'What we offer'. Replaces ServiceSection, FeatureSection and the old divided Card grid."
          >
            <div className="space-y-10">
              <FeatureGrid {...HOME_OFFER} columns={4} headingLevel="h3" className="!py-0" />
              <FeatureGrid variant="divided" columns={3} items={[...HOME_OFFER.items, ...HOME_OFFER.items].slice(0, 6).map((it, i) => ({ ...it, title: `${it.title}${i > 3 ? " (long text test)" : ""}` }))} className="!py-0" />
            </div>
          </ShowcaseSection>

          <ShowcaseSection
            id="bento-grid"
            title="BentoGrid"
            status="pending-review"
            notes="Asymmetric tiles that pair a short claim with a small CSS visual. Used for 'Why DronaHost' on the homepage."
          >
            <BentoGrid
              eyebrow={HOME_BENTO.eyebrow}
              title={HOME_BENTO.title}
              description={HOME_BENTO.description}
              headingLevel="h3"
              className="!py-0"
              items={HOME_BENTO.items.map((it) => ({
                title: it.title,
                description: it.description,
                span: it.span,
                href: it.href,
                linkLabel: it.linkLabel,
                visual: { cache: <CacheVisual />, growth: <GrowthVisual />, restore: <RestoreVisual />, channels: <ChannelsVisual /> }[it.visual],
              }))}
            />
          </ShowcaseSection>

          <ShowcaseSection
            id="two-column"
            title="TwoColumn"
            status="pending-review"
            notes="Text, checklist and actions beside a designed visual (no placeholder images). Four visuals shown: settings, migration, protection, support."
          >
            <div className="space-y-4">
              {HOME_SPLITS.map((split, i) => (
                <TwoColumn
                  key={split.title}
                  eyebrow={split.eyebrow}
                  title={split.title}
                  description={split.description}
                  features={split.features}
                  cta={split.cta}
                  headingLevel="h3"
                  className="!py-8"
                  visualPosition={i % 2 === 0 ? "right" : "left"}
                  visual={[<WordPressSettingsVisual key="a" />, <MigrationVisual key="b" />, <ProtectionVisual key="c" />, <SupportChannelsVisual key="d" />][i]}
                />
              ))}
            </div>
          </ShowcaseSection>

          <ShowcaseSection
            id="comparison-table"
            title="ComparisonTable"
            status="pending-review"
            notes="Real <table> with caption, row/column headers, sticky first column and a keyboard-scrollable wrapper. Top: hosting types (homepage). Bottom: plans, built from data/pricing.json."
          >
            <div className="space-y-6">
              <ComparisonTable {...HOME_COMPARE} headingLevel="h3" rowHeader="Hosting type" className="!py-0" />
              <ComparisonTable
                title="Compare plans"
                caption="Comparison of DronaHost hosting plans"
                {...buildPlanComparison()}
                rowHeader="Plan"
                headingLevel="h3"
                className="!py-0"
              />
            </div>
          </ShowcaseSection>

          <ShowcaseSection
            id="pricing-plans"
            title="PricingPlans"
            status="pending-review"
            notes="Billing toggle (only because pricing.json offers monthly and annual), highlighted plan, renewal line under the price, 'Price on request' when prices are hidden, add-ons, and a native <details> full feature table. Prices are draft and hidden in production until FEATURES.pricesConfirmed."
          >
            <PricingPlans
              title="Choose your plan"
              headingLevel="h3"
              plans={buildPlanCards()}
              showPrices
              vatDisplay={VAT_DISPLAY}
              guaranteeNote="30-day money-back guarantee. (sample: shown only when verified)"
              className="!py-0"
            >
              <PricingExtras showPrices />
            </PricingPlans>
          </ShowcaseSection>


          {/* ── Social proof (Batch E) ── */}
          <ShowcaseSection
            id="testimonials"
            title="Testimonials"
            status="pending-review"
            notes="Renders only with name, role, company and a source link; hidden otherwise. Samples are forced on here and labelled. Photo optional (initials fallback). Replaces the star-rated cards."
          >
            <Testimonials title="What customers say" headingLevel="h3" items={SAMPLE_TESTIMONIALS} showSamples className="!py-0" />
          </ShowcaseSection>

          <ShowcaseSection
            id="logo-wall"
            title="LogoWall"
            status="pending-review"
            notes="Verified logos only (written permission). Hidden when none. Third-party rating only with a source link. Text wordmark when an image is missing."
          >
            <LogoWall title="Businesses that host with DronaHost" headingLevel="h3" logos={SAMPLE_LOGOS} showSamples className="!py-0" />
          </ShowcaseSection>

          <ShowcaseSection
            id="case-study"
            title="CaseStudy"
            status="pending-review"
            notes="Hidden unless it links to a customer-approved published source. Sample forced on here."
          >
            <CaseStudy {...SAMPLE_CASE_STUDY} headingLevel="h3" showSamples className="!py-0" />
          </ShowcaseSection>

          <ShowcaseSection
            id="stats-bar"
            title="StatsBar"
            status="pending-review"
            notes="Driven by content/claims.ts. Renders nothing until a claim is verified; each stat can link to its proof page. Sample forced on here."
          >
            <StatsBar claims={CLAIMS.slice(0, 4)} className="!py-0" />
          </ShowcaseSection>

          <ShowcaseSection
            id="trust-signals"
            title="TrustSignals"
            status="pending-review"
            notes="Guarantee, SLA, security, data-center locations, DPA and support. Each item shows only when verified in content/trust.ts. Samples forced on here."
          >
            <TrustSignals title="Why you can trust us" headingLevel="h3" items={TRUST_ITEMS} showSamples note="Renewal prices are shown next to the signup price on every plan." className="!py-0" />
          </ShowcaseSection>

          <ShowcaseSection
            id="trust-badges"
            title="TrustBadges"
            status="pending-review"
            notes="Accepted payment methods only (never trust marks). Hidden until verified."
          >
            <TrustBadges showSamples />
          </ShowcaseSection>

          {/* ── Content blocks (Batch F) ── */}
          <ShowcaseSection
            id="faq"
            title="FAQSection"
            status="pending-review"
            notes="Native <details> accordion: answers are in the initial HTML, work without JavaScript and are keyboard accessible. Pair with FAQPage JSON-LD for the same visible items."
          >
            <FAQSection {...HOME_FAQ} headingLevel="h3" openFirst className="!py-0" />
          </ShowcaseSection>

          <ShowcaseSection
            id="cta-band"
            title="CTABand"
            status="pending-review"
            notes="One primary action, one quieter action. Replaces HomeCTA and CTASection."
          >
            <CTABand {...HOME_CTA} headingLevel="h3" className="!py-0" />
          </ShowcaseSection>

          <ShowcaseSection
            id="process-timeline"
            title="ProcessTimeline"
            status="pending-review"
            notes="Semantic ordered list. Horizontal from lg, vertical rail on phones. Replaces ProcessSteps / HowItWorks / OurProcess."
          >
            <ProcessTimeline title="How moving your site works" headingLevel="h3" steps={MIGRATION_STEPS} className="!py-0" />
          </ShowcaseSection>

          <ShowcaseSection
            id="resource-grid"
            title="ResourceGrid"
            status="pending-review"
            notes="Blog/resource cards with crawlable title links and no required image. Dates formatted unambiguously."
          >
            <ResourceGrid title="From the blog" headingLevel="h3" posts={SAMPLE_POSTS} className="!py-0" />
          </ShowcaseSection>

          <ShowcaseSection
            id="code-block"
            title="CodeBlock"
            status="pending-review"
            notes="Real <pre><code> in the initial HTML, keyboard-scrollable, with a copy button as the only client JS."
          >
            <div className="max-w-2xl"><CodeBlock title="wp-config.php" language="php" code={SAMPLE_CODE} /></div>
          </ShowcaseSection>

          <ShowcaseSection
            id="newsletter"
            title="NewsletterSignup"
            status="pending-review"
            notes="Off by default (FEATURES.newsletter) because no endpoint stores addresses yet. Zod-validated, labelled, aria-live status, privacy line. Forced on here."
          >
            <NewsletterSignup forceEnabled className="!py-0" />
          </ShowcaseSection>

          <ShowcaseSection
            id="support-channels"
            title="SupportChannels"
            status="pending-review"
            notes="WhatsApp / live chat / ticket. A channel shows only when it exists (number set, widget installed); ticket is always real. Samples forced on here."
          >
            <SupportChannels title="Reach the team" headingLevel="h3" showSamples className="!py-0" />
          </ShowcaseSection>

          {/* ── JsonLd ── */}
          <ShowcaseSection
            id="json-ld"
            title="JsonLd"
            status="built"
            notes="Outputs script tag. Verify with Rich Results Test."
          >
            <p className="text-sm text-muted-foreground mb-4">
              JsonLd injects a{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">
                {"<script type=\"application/ld+json\">"}
              </code>{" "}
              tag with no visual output. Preview of the schema passed below:
            </p>
            <pre className="mb-4 overflow-x-auto rounded-lg bg-muted p-4 text-xs text-muted-foreground">
              {JSON.stringify(orgSchema, null, 2)}
            </pre>
            <JsonLd schema={orgSchema} />
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

      </ShowcaseLayout>
    </div>
  );
}
