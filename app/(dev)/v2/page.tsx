import { notFound } from "next/navigation";
import { Link } from "@/i18n/link";

import ShowcaseSection from "./_components/ShowcaseSection";
import ShowcaseSidebar from "./_components/ShowcaseSidebar";
import ShowcaseLayout from "./_components/ShowcaseLayout";

import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Section from "@/components/ui/Section";
import HeadLineText from "@/components/ui/HeadLineText";
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
import ArticleToc from "@/components/blog/ArticleToc";
import AuthorBox from "@/components/blog/AuthorBox";
import CategoryFilter from "@/components/blog/CategoryFilter";
import Pagination from "@/components/blog/Pagination";
import MigrationForm from "@/components/forms/MigrationForm";
import DomainSearch from "@/components/sections/DomainSearch";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import EmptyState from "@/components/ui/EmptyState";
import DialogDemo from "./_components/DialogDemo";
import { TabsDemo, ToastDemo, TooltipDemo } from "./_components/OverlayDemos";
import { CardGridSkeleton, TextSkeleton } from "@/components/ui/LoadingStates";
import { Newspaper } from "lucide-react";

import CenteredHero from "@/components/sections/CenteredHero";
import { HOME_HERO, WORDPRESS_HERO, ABOUT_HERO } from "@/content/heroes";
import CaseStudy from "@/components/sections/CaseStudy";
import CTABand from "@/components/sections/CTABand";
import FAQSection from "@/components/sections/FAQSection";
import LogoWall from "@/components/sections/LogoWall";
import NewsletterSignup from "@/components/sections/NewsletterSignup";
import ProcessTimeline from "@/components/sections/ProcessTimeline";
import ResourceGrid from "@/components/sections/ResourceGrid";
import AssuranceStrip, { SAMPLE_ASSURANCES } from "@/components/sections/AssuranceStrip";
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
                  Default lg size with border-dashed. The inner container is the site width (1536px), centered.
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
            notes="Highlights one short phrase in a heading, teal only (orange is reserved for actions). The four preset names are kept for compatibility and all resolve to teal."
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
            status="built"
            notes="Fluid clamp() sizing between breakpoints, so tablet no longer jumps. Takes the heading level via `as` and an `id`."
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

          {/* ── Buttons ── */}
          <ShowcaseSection
            id="buttons"
            title="Buttons"
            status="built"
            notes="Four variants (primary, secondary, ghost, link), three sizes (sm 40px, md 48px, lg 56px), a loading state and a real <button> mode. Renders a crawlable <a> when href is set, otherwise a native <button> (type button, submit or reset). Bright #FE5504 fill with navy label in both themes. One primary per section. Full states are on /v2/design-system."
          >
            <div className="space-y-6">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Variants (links, render an &lt;a&gt;)</p>
                <div className="flex flex-wrap items-center gap-4">
                  <Button href="#buttons" variant="primary">Primary</Button>
                  <Button href="#buttons" variant="secondary">Secondary</Button>
                  <Button href="#buttons" variant="ghost">Ghost</Button>
                  <Button href="#buttons" variant="link">Link</Button>
                </div>
              </div>
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Sizes</p>
                <div className="flex flex-wrap items-end gap-4">
                  <Button href="#buttons" size="sm">Small</Button>
                  <Button href="#buttons" size="md">Medium</Button>
                  <Button href="#buttons" size="lg">Large</Button>
                  <Button href="#buttons" variant="secondary" size="sm">Small</Button>
                  <Button href="#buttons" variant="secondary" size="md">Medium</Button>
                  <Button href="#buttons" variant="secondary" size="lg">Large</Button>
                </div>
              </div>
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Real button mode (renders a &lt;button&gt;)</p>
                <div className="flex flex-wrap items-center gap-4">
                  <Button type="submit">Submit</Button>
                  <Button type="button" variant="secondary">Button</Button>
                  <Button type="reset" variant="ghost">Reset</Button>
                </div>
              </div>
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Loading and disabled</p>
                <div className="flex flex-wrap items-center gap-4">
                  <Button type="submit" loading>Sending</Button>
                  <Button type="submit" variant="secondary" loading>Sending</Button>
                  <Button type="button" disabled>Disabled</Button>
                  <Button type="button" variant="secondary" disabled>Disabled</Button>
                </div>
              </div>
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Full width and external</p>
                <div className="max-w-sm space-y-3">
                  <Button href="#buttons" fullWidth>Primary full width</Button>
                  <Button href="#buttons" variant="secondary" fullWidth>Secondary full width</Button>
                  <Button href="https://dronahost.com" variant="ghost" external fullWidth>Opens in a new tab</Button>
                </div>
              </div>
            </div>
          </ShowcaseSection>

          {/* ── Contact Form ── */}
          <ShowcaseSection
            id="contact-form"
            title="Contact Form"
            status="needs-verification"
            notes="Used on /contact only. Zod-validated, honeypot, rate-limited, stored in MongoDB, honest failure message. Sends a team notification through Amazon SES and keeps submissions for FORM_RETENTION_DAYS (default 730); both need the .env values and a retention decision."
            verify={["Retention period for stored form submissions", "SES sender and team recipient configured"]}
          >
            <p className="text-sm text-muted-foreground">
              The contact form is embedded directly in the{" "}
              <Link href="/contact" className="text-link underline">
                /contact
              </Link>{" "}
              page and is not a standalone reusable component yet.
            </p>
          </ShowcaseSection>

          {/* ── Announcement bar ── */}
          <ShowcaseSection
            id="announcement-bar"
            title="Announcement Bar"
            status="built"
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
            status="built"
            notes="Theme toggle switches dark (default) and light. The currency selector is built but behind FEATURES.currencySelector (off, USD only) and forced on here for review."
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
            status="built"
            notes="Sticky, tokens only, crawlable hosting mega menu (always in the HTML), keyboard and Escape support, mobile drawer with focus trap. The Log in link renders only when FEATURES.accountArea is on."
          >
            <div className="border border-border rounded-lg overflow-hidden">
              <Header />
            </div>
          </ShowcaseSection>

          {/* ── Footer ── */}
          <ShowcaseSection
            id="footer"
            title="Footer"
            status="needs-verification"
            notes="Four unique columns, real routes only. Legal entity, address, email, socials and payment methods stay hidden until set in content/company.ts and content/claims.ts."
            verify={["Legal entity, address and company number (hidden until set)", "Support email and social profile URLs (hidden until set)"]}
          >
            <div className="border border-border rounded-lg overflow-hidden">
              <Footer />
            </div>
          </ShowcaseSection>

          {/* ── Heroes (Batch B) ── */}
          <ShowcaseSection
            id="product-hero"
            title="ProductHero"
            status="needs-verification"
            notes="Hero 1 of 3. Display headline, one primary action, verified highlights, dashboard mockup. Used on the homepage. Replaces HomeHero, HomeHeroSection, HomeHeroBanner and its video variant."
            verify={["LiteSpeed servers with server-level caching", "Free migration from your current host", "Support from the team that runs your server"]}
          >
            <div className="overflow-hidden rounded-lg border border-border">
              <ProductHero {...HOME_HERO} headingLevel="h2" />
            </div>
          </ShowcaseSection>

          <ShowcaseSection
            id="split-hero"
            title="SplitHero"
            status="needs-verification"
            notes="Hero 2 of 3. Text beside a UI mockup (staging workflow). Used on /wordpress-hosting. Replaces InnerPageHeroBanner and the per-page split heroes."
            verify={["Staging area for testing updates", "LiteSpeed servers with built-in caching", "Team moves your existing site across"]}
          >
            <div className="overflow-hidden rounded-lg border border-border">
              <SplitHero {...WORDPRESS_HERO} headingLevel="h2" />
            </div>
          </ShowcaseSection>

          <ShowcaseSection
            id="centered-hero"
            title="CenteredHero"
            status="needs-verification"
            notes="Hero 3 of 3. Minimal, text only. Used on /about and /seo-services. Replaces PageHero and ExperienceHeroSection."
            verify={["About page: team based in India serving US, UK, UAE and Europe", "SEO page: monthly retainer with readable reports"]}
          >
            <div className="overflow-hidden rounded-lg border border-border">
              <CenteredHero {...ABOUT_HERO} headingLevel="h2" />
            </div>
          </ShowcaseSection>

          {/* ── Content sections (Batch C) ── */}
          <ShowcaseSection
            id="feature-grid"
            title="FeatureGrid"
            status="needs-verification"
            notes="Cards, divided or plain variants; 2/3/4 columns; 1 to 12 items. Used for 'What we offer'. Replaces ServiceSection, FeatureSection and the old divided Card grid."
            verify={["Per-page feature copy: LiteSpeed, staging, free migration, SSL, backups, malware scanning, firewall rules, network-level DDoS protection"]}
          >
            <div className="space-y-10">
              <FeatureGrid {...HOME_OFFER} columns={4} headingLevel="h3" className="!py-0" />
              <FeatureGrid variant="divided" columns={3} items={[...HOME_OFFER.items, ...HOME_OFFER.items].slice(0, 6).map((it, i) => ({ ...it, title: `${it.title}${i > 3 ? " (long text test)" : ""}` }))} className="!py-0" />
            </div>
          </ShowcaseSection>

          <ShowcaseSection
            id="bento-grid"
            title="BentoGrid"
            status="needs-verification"
            notes="Asymmetric tiles that pair a short claim with a small CSS visual. Used for 'Why DronaHost' on the homepage."
            verify={["Staging copies and restore points", "LiteSpeed page caching", "Tickets answered by the team that runs your server"]}
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
            status="needs-verification"
            notes="Text, checklist and actions beside a designed visual (no placeholder images). Four visuals shown: settings, migration, protection, support."
            verify={["Staging environments", "Free migration, review before DNS switch", "Automatic backups with restore points", "Malware scanning, firewall rules, SSL auto-renew"]}
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
            status="needs-verification"
            notes="Real <table> with caption, row/column headers, sticky first column and a keyboard-scrollable wrapper. Top: hosting types (homepage). Bottom: plans, built from data/pricing.json."
            verify={["Every plan row comes from data/pricing.json: limits, “Unlimited” resources, backup retention, DDoS protection, staging, priority support, dedicated account manager"]}
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
            status="needs-verification"
            notes="Billing toggle (only because pricing.json offers monthly and annual), highlighted plan, renewal line under the price, 'Price on request' when prices are hidden, add-ons, and a native <details> full feature table. Prices are draft and hidden in production until FEATURES.pricesConfirmed."
            verify={["Prices and the annual total (12 x the per-month annual price)", "“Same price, no increase” renewal line", "“Unlimited” sites and storage on higher plans", "Staging, free migration, priority support, performance tuning per plan", "Plan names and badges (“Pop”, “Most Popular”, “High Power”)", "30-day guarantee note (hidden until verified)"]}
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
            status="built"
            notes="Renders only with name, role, company and a source link; hidden otherwise. Samples are forced on here and labelled. Photo optional (initials fallback). Replaces the star-rated cards."
          >
            <Testimonials title="What customers say" headingLevel="h3" items={SAMPLE_TESTIMONIALS} showSamples className="!py-0" />
          </ShowcaseSection>

          <ShowcaseSection
            id="logo-wall"
            title="LogoWall"
            status="built"
            notes="Verified logos only (written permission). Hidden when none. Third-party rating only with a source link. Text wordmark when an image is missing."
          >
            <LogoWall title="Businesses that host with DronaHost" headingLevel="h3" logos={SAMPLE_LOGOS} showSamples className="!py-0" />
          </ShowcaseSection>

          <ShowcaseSection
            id="case-study"
            title="CaseStudy"
            status="built"
            notes="Hidden unless it links to a customer-approved published source. Sample forced on here."
          >
            <CaseStudy {...SAMPLE_CASE_STUDY} headingLevel="h3" showSamples className="!py-0" />
          </ShowcaseSection>

          <ShowcaseSection
            id="stats-bar"
            title="StatsBar"
            status="built"
            notes="Measured numbers only (claims of kind stat). Renders nothing until a claim is verified and its terms page is published; count-up applies here only. Dividers only between stats, no end caps. Sample forced on here."
          >
            <StatsBar claims={CLAIMS.filter((c) => c.kind === "stat").slice(0, 4)} className="!py-0" />
          </ShowcaseSection>

          <ShowcaseSection
            id="assurance-strip"
            title="AssuranceStrip"
            status="needs-verification"
            notes="Static strip for policy and feature claims: icon, a short line and a link to the page that publishes the terms. No animation, no count-up. A claim shows only when it is verified AND its termsPage is published; samples are forced on here with a label."
            verify={["Money-back guarantee: refund-policy page reviewed and published", "24/7 support: a page that publishes the hours and channels", "Free migration: a page that says what is covered", "Renewal price equals signup: a page that states it"]}
          >
            <AssuranceStrip claims={SAMPLE_ASSURANCES} className="!py-0" />
          </ShowcaseSection>

          <ShowcaseSection
            id="trust-signals"
            title="TrustSignals"
            status="built"
            notes="Guarantee, SLA, security, data-center locations, DPA and support. Each item shows only when verified in content/trust.ts. Samples forced on here."
          >
            <TrustSignals title="Why you can trust us" headingLevel="h3" items={TRUST_ITEMS} showSamples note="Renewal prices are shown next to the signup price on every plan." className="!py-0" />
          </ShowcaseSection>

          <ShowcaseSection
            id="trust-badges"
            title="TrustBadges"
            status="built"
            notes="Accepted payment methods only (never trust marks). Hidden until verified."
          >
            <TrustBadges showSamples />
          </ShowcaseSection>

          {/* ── Content blocks (Batch F) ── */}
          <ShowcaseSection
            id="faq"
            title="FAQSection"
            status="needs-verification"
            notes="Native <details> accordion: answers are in the initial HTML, work without JavaScript and are keyboard accessible. Single outline when open, divider between question and answer, optional help card with a button. Pair with FAQPage JSON-LD for the same visible items."
            verify={["Homepage answers: managed stack, migration, “same price at renewal”, staging, backups"]}
          >
            <FAQSection {...HOME_FAQ} headingLevel="h3" openFirst className="!py-0" />
          </ShowcaseSection>

          <ShowcaseSection
            id="cta-band"
            title="CTABand"
            status="built"
            notes="One primary action, one quieter action. Replaces HomeCTA and CTASection."
          >
            <CTABand {...HOME_CTA} headingLevel="h3" className="!py-0" />
          </ShowcaseSection>

          <ShowcaseSection
            id="process-timeline"
            title="ProcessTimeline"
            status="built"
            notes="Semantic ordered list. Horizontal from lg, vertical rail on phones. Replaces ProcessSteps / HowItWorks / OurProcess."
          >
            <ProcessTimeline title="How moving your site works" headingLevel="h3" steps={MIGRATION_STEPS} className="!py-0" />
          </ShowcaseSection>

          <ShowcaseSection
            id="resource-grid"
            title="ResourceGrid"
            status="built"
            notes="Blog/resource cards with crawlable title links and no required image. Dates formatted unambiguously."
          >
            <ResourceGrid title="From the blog" headingLevel="h3" posts={SAMPLE_POSTS} className="!py-0" />
          </ShowcaseSection>

          <ShowcaseSection
            id="code-block"
            title="CodeBlock"
            status="built"
            notes="Real <pre><code> in the initial HTML, keyboard-scrollable, with a copy button as the only client JS."
          >
            <div className="max-w-2xl"><CodeBlock title="wp-config.php" language="php" code={SAMPLE_CODE} /></div>
          </ShowcaseSection>

          <ShowcaseSection
            id="newsletter"
            title="NewsletterSignup"
            status="needs-work"
            notes="Off by default (FEATURES.newsletter) because no endpoint stores addresses yet. UI is built, Zod-validated, labelled and aria-live. Needs a subscribe endpoint and a double opt-in flow before it is switched on."
          >
            <NewsletterSignup forceEnabled className="!py-0" />
          </ShowcaseSection>

          <ShowcaseSection
            id="support-channels"
            title="SupportChannels"
            status="needs-verification"
            notes="WhatsApp / live chat / ticket. A channel shows only when it exists (number set, widget installed); ticket is always real. Samples forced on here."
            verify={["WhatsApp number (hidden until set)", "Live chat: is a widget installed and staffed?", "Ticket system exists"]}
          >
            <SupportChannels title="Reach the team" headingLevel="h3" showSamples className="!py-0" />
          </ShowcaseSection>

          {/* ── Batch G ── */}
          <ShowcaseSection id="breadcrumbs" title="Breadcrumbs" status="built" notes="Visible trail built from the same source as the BreadcrumbList JSON-LD. Current page is plain text with aria-current. Used on service, legal, blog, form and region pages.">
            <Breadcrumbs path="/hosting/uk" />
          </ShowcaseSection>

          <ShowcaseSection id="empty-state" title="EmptyState" status="built" notes="What is missing, why, and one next step. Replaces the inline empty messages on the blog.">
            <EmptyState icon={Newspaper} title="Articles are on the way" body="We are preparing our first guides. In the meantime, ask us anything about your site." action={{ label: "Talk to our team", href: "/contact" }} />
          </ShowcaseSection>

          <ShowcaseSection id="dialog" title="Dialog" status="built" notes="Modal on the native dialog element: focus trap, Escape, inert background and focus return come from the browser. CSS-only fade, disabled under prefers-reduced-motion.">
            <DialogDemo />
          </ShowcaseSection>

          <ShowcaseSection id="tabs" title="Tabs" status="built" notes="WAI-ARIA tabs: roving tabindex, arrow keys, Home and End, RTL-aware. All panels stay in the HTML, hidden, so content remains crawlable.">
            <TabsDemo />
          </ShowcaseSection>

          <ShowcaseSection id="tooltip" title="Tooltip" status="built" notes="Hover and keyboard focus, stays open under the pointer, Escape dismisses (WCAG 1.4.13). Supplementary hints only; never essential information.">
            <TooltipDemo />
          </ShowcaseSection>

          <ShowcaseSection id="toast" title="Toast" status="built" notes="Polite live region (assertive for errors), auto-dismiss after 6s, at most three at once. Not mounted site-wide yet: wrap a page or layout in ToastProvider when a feature needs it.">
            <ToastDemo />
          </ShowcaseSection>

          <ShowcaseSection id="loading-states" title="Loading states" status="built" notes="TextSkeleton and CardGridSkeleton reserve space to avoid layout shift. Use them as in-page Suspense fallbacks; route-level loading.tsx is avoided because it turns 404s into 200s.">
            <div className="space-y-8">
              <TextSkeleton lines={3} />
              <CardGridSkeleton count={3} />
            </div>
          </ShowcaseSection>

          <ShowcaseSection id="cookie-consent" title="Cookie consent" status="needs-verification" notes="Live on every page: Reject all and Accept all are the same size and style, a preferences dialog (loaded on demand), and a footer Cookie settings link. Decisions are stored in a first-party cookie and logged server-side without IP or user agent. Clear the dh_consent cookie to see the banner again." verify={["Privacy policy and a cookie policy must list dh_consent, the theme setting and Cloudflare Turnstile","Consent log retention period (the log is append-only today)"]}>
            <p className="text-sm text-muted-foreground">Clear the <code>dh_consent</code> cookie and reload to see the banner. Optional scripts (GA4) load only after analytics consent; Plausible is cookieless.</p>
          </ShowcaseSection>

          <ShowcaseSection id="sticky-cta" title="Sticky mobile CTA" status="built" notes="Phones only. Appears after the first screen, hides near the footer and on form pages. CSS transform transition, none under reduced motion. Resize the window below 768px and scroll to see it.">
            <p className="text-sm text-muted-foreground">Rendered by the marketing layout.</p>
          </ShowcaseSection>

          <ShowcaseSection id="legal-page" title="LegalPage" status="needs-verification" notes="Shared layout for policy pages: breadcrumbs, one H1, spelled-out last-updated date, sticky on-this-page list and the .article body. Applied to all six legal pages. Their text was not changed." verify={["Legal pages still carry unverified commitments (SLA percentages, refund period, mailboxes, DPO) and 2025 dates"]}>
            <p className="text-sm text-muted-foreground">
              See <Link href="/terms" className="text-link underline">/terms</Link>.
            </p>
          </ShowcaseSection>

          <ShowcaseSection id="blog-set" title="Blog set" status="needs-verification" notes="Article layout with sticky table of contents, author box (only with a real bio), related posts, category filter and pagination, all server-rendered links. Content comes from headless WordPress (WORDPRESS_API_URL), sanitized with an allow-list. Falls back to the legacy MongoDB posts while WordPress is not configured." verify={["WordPress site URL, author bios and categories (none exist yet)"]}>
            <div className="space-y-8">
              <CategoryFilter categories={[{ name: "Performance", slug: "performance", count: 8 }, { name: "Security", slug: "security", count: 4 }]} active="performance" />
              <div className="max-w-xs">
                <ArticleToc items={[{ id: "a", text: "First section", level: 2 }, { id: "b", text: "A subsection", level: 3 }, { id: "c", text: "Second section", level: 2 }]} />
              </div>
              <AuthorBox author={{ name: "Sample Author", bio: "Sample bio. Shown only when the CMS has a real one.", avatar: null }} />
              <Pagination page={2} totalPages={5} basePath="/blog" />
            </div>
          </ShowcaseSection>

          <ShowcaseSection id="form-wizard" title="Multi-step forms" status="needs-verification" notes="Migration and consultation forms: per-step Zod validation shared with the server, focus moves to the step heading, answers survive a reload (this tab only), honeypot, timing check and Cloudflare Turnstile when keys are set. Stored in MongoDB with a retention date and emailed through Amazon SES when configured." verify={["Retention period for stored requests (default 730 days)","SES sender identity and recipient addresses","Turnstile site and secret keys"]}>
            <MigrationForm />
          </ShowcaseSection>

          <ShowcaseSection id="domain-search" title="Domain search" status="needs-work" notes="UI and /api/domains/search are built on the WHMCS DomainWhois action. Off until FEATURES.domainSearch is true and WHMCS credentials are set. Shows availability only; registering goes through the contact form until checkout exists.">
            <DomainSearch />
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
                {"<script type=“application/ld+json”>"}
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
            notes="Six variants: primary (orange tint), secondary (teal tint), success, warning, danger, neutral. Used for plan labels and status tags."
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
