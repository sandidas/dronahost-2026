import { notFound } from "next/navigation";

import ShowcaseSection from "./_components/ShowcaseSection";
import ShowcaseSidebar from "./_components/ShowcaseSidebar";

import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Section from "@/components/section/section";
import GradientBackground from "@/components/gradient/gradient";
import HeadLineText from "@/components/HeadLineText/HeadLineText";
import GridCard from "@/components/Card/GridCard";
import HeroSection from "@/components/home/hero-section/HomeHeroSection";
import FeatureSection from "@/components/home/FeatureSection/FeatureSection";
import ServicesSection from "@/components/home/ServiceSection/ServiceSection";
import CaseStudySection from "@/components/home/CaseStudy/CaseStudy";
import CTASection from "@/components/home/CTA/CTA";
import PricingSection1 from "@/components/home/PricingSection1/PricingSection1";
import ManagedHostingIllustrationSection from "@/components/home/PricingSection2/PricingSection2";
import PricingSection3 from "@/components/home/PricingSection3/PricingSection3";
import PricingSection4 from "@/components/home/PricingSection4/PricingSection4";
import PricingJourney from "@/components/home/pricingjourney/pricingJourney";
import TestimonialsSection from "@/components/home/Testimonials/TestimonialsSection";
import FAQSection from "@/components/home/FAQ/FAQSection";
import TeamsSection from "@/components/home/Teams/TeamsSection";
import Header from "@/layouts/header/header";
import Footer from "@/layouts/footer/footer";
import JsonLd from "@/components/seo/JsonLd";
import TrustBadges from "@/components/trust/TrustBadges";
import StatsBar from "@/components/trust/StatsBar";

import {
  heroData,
  featureData,
  serviceData,
  caseStudyData,
  ctaData,
  pricingSection1Data,
  pricingSection2Data,
  pricingSection3Data,
  pricingSection4Data,
  pricingJourneyData,
  testimonialsData,
  faqData,
  teamsData,
} from "./_data/dummy";

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "DronaHost",
  url: "https://dronahost.com",
};

const gridItems = [
  { title: "Performance Hosting", description: "LiteSpeed + NVMe storage, sub-200ms TTFB globally." },
  { title: "Managed WordPress", description: "Daily backups, staging, and one-click rollbacks." },
  { title: "Global CDN", description: "Cloudflare in front of every site — 300+ PoPs." },
  { title: "Developer Tools", description: "SSH, WP-CLI, Git deploy hooks, PHP version selector." },
  { title: "Security", description: "Let's Encrypt SSL, WAF, and automated malware scans." },
  { title: "Transparent SLA", description: "99.95% uptime SLA with automatic service credits." },
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
      <div className="flex pt-14">
        {/* Sidebar */}
        <aside className="w-52 shrink-0 border-r border-slate-200 dark:border-slate-800">
          <ShowcaseSidebar />
        </aside>

        {/* Main content */}
        <main className="flex-1 px-8 py-6 min-w-0">
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

          {/* ── GradientBackground ── */}
          <ShowcaseSection
            id="gradient-background"
            title="GradientBackground"
            status="needs-work"
            notes="Too many undocumented variants. Hard to pick the right one."
          >
            <div className="relative h-48 overflow-hidden rounded-lg">
              <GradientBackground gradient="blue-cyan" className="absolute inset-0" />
              <p className="relative z-10 flex h-full items-center justify-center text-sm font-medium text-slate-700 dark:text-slate-200">
                blue-cyan gradient
              </p>
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
                <GridCard key={i} index={i} total={6} columns={3} size="md">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
                </GridCard>
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
              <a href="/blog" className="text-orange-600 underline hover:text-orange-700 dark:text-orange-400">
                /blog
              </a>{" "}
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
              <a href="/blog" className="text-orange-600 underline hover:text-orange-700 dark:text-orange-400">
                /blog
              </a>{" "}
              to see it in use.
            </p>
          </ShowcaseSection>

          {/* ── Buttons ── */}
          <ShowcaseSection
            id="buttons"
            title="Buttons"
            status="built"
            notes="Primary and secondary variants. Disabled state and loading/spinner state implemented."
          >
            <div className="space-y-6">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Default</p>
                <div className="flex flex-wrap items-center gap-4">
                  <Button variant="primary">Primary button</Button>
                  <Button variant="secondary">Secondary button</Button>
                </div>
              </div>
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Disabled</p>
                <div className="flex flex-wrap items-center gap-4">
                  <Button variant="primary" disabled>Primary disabled</Button>
                  <Button variant="secondary" disabled>Secondary disabled</Button>
                </div>
              </div>
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Loading</p>
                <div className="flex flex-wrap items-center gap-4">
                  <Button variant="primary" loading>Primary loading</Button>
                  <Button variant="secondary" loading>Secondary loading</Button>
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

          {/* ── Header ── */}
          <ShowcaseSection
            id="header"
            title="Header"
            status="needs-work"
            notes="Mobile hamburger ✅ fixed. Mega menu keyboard nav ✅ fixed. Footer: partner logos placeholder, social links unset."
          >
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
              <Header />
            </div>
          </ShowcaseSection>

          {/* ── Footer ── */}
          <ShowcaseSection
            id="footer"
            title="Footer"
            status="needs-work"
            notes="Partner logos placeholder. Social links unset."
          >
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
              <Footer />
            </div>
          </ShowcaseSection>

          {/* ── Hero Section ── */}
          <ShowcaseSection
            id="hero"
            title="Hero Section"
            status="needs-work"
            notes="Floating card icons placeholder. Copy lorem ipsum in JSON."
          >
            <div className="overflow-hidden rounded-lg">
              <div className="transform scale-75 origin-top-left w-[133%]">
                <HeroSection data={heroData} />
              </div>
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
            notes="Icons generic. Descriptions placeholder copy."
          >
            <ServicesSection data={serviceData} />
          </ShowcaseSection>

          {/* ── Case Study ── */}
          <ShowcaseSection
            id="case-study"
            title="Case Study"
            status="needs-work"
            notes="No real case study. Metrics hardcoded."
          >
            <CaseStudySection data={caseStudyData} />
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

          {/* ── Pricing Section 1 ── */}
          <ShowcaseSection
            id="pricing-1"
            title="Pricing Section 1"
            status="needs-work"
            notes="Prices not from real data source."
          >
            <PricingSection1 data={pricingSection1Data} />
          </ShowcaseSection>

          {/* ── Pricing Section 2 ── */}
          <ShowcaseSection
            id="pricing-2"
            title="Pricing Section 2"
            status="needs-work"
            notes="Illustration placeholder. Feature copy generic."
          >
            <ManagedHostingIllustrationSection data={pricingSection2Data} />
          </ShowcaseSection>

          {/* ── Pricing Section 3 ── */}
          <ShowcaseSection
            id="pricing-3"
            title="Pricing Section 3"
            status="needs-work"
            notes="Same issues as Pricing 1."
          >
            <PricingSection3 data={pricingSection3Data} />
          </ShowcaseSection>

          {/* ── Pricing Section 4 ── */}
          <ShowcaseSection
            id="pricing-4"
            title="Pricing Section 4"
            status="needs-work"
            notes="Missing CTA button."
          >
            <PricingSection4 data={pricingSection4Data} />
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
            <TestimonialsSection data={testimonialsData} />
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
            <TeamsSection data={teamsData} />
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
            notes="Stripe, PayPal, Let's Encrypt, Cloudflare, Trustpilot, 30-Day Guarantee. Inline SVG icons, dark mode, WCAG accessible."
          >
            <TrustBadges />
          </ShowcaseSection>

          {/* ── Uptime / Stats Bar ── */}
          <ShowcaseSection
            id="uptime-bar"
            title="Uptime / Stats Bar"
            status="built"
            notes="4 stats: 99.95% uptime SLA, <200ms TTFB, 18 min support reply, Founded 2019. Static/hardcoded, dark strip, responsive grid."
          >
            <StatsBar />
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

        </main>
      </div>
    </div>
  );
}
