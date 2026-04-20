import Section from "@/components/ui/Section";
import HeadLineText from "@/components/ui/HeadLineText";
import JsonLd from "@/components/sections/JsonLd";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, productWithOfferSchema, faqPageSchema } from "@/lib/seo/jsonld";
import { buildBreadcrumbs } from "@/lib/seo/breadcrumbs";

export const metadata = buildMetadata({
  title: "VPS Hosting — Scalable Virtual Servers | DronaHost",
  description: "High-performance VPS hosting with full root access, NVMe SSD, and 99.9% uptime SLA. Scalable resources, DDoS protection, and 24/7 support. From $9.99/mo.",
  path: "/vps-hosting",
});

const faqs = [
  { question: "What is VPS hosting?", answer: "VPS (Virtual Private Server) hosting gives you a dedicated portion of a physical server with guaranteed resources, full root access, and isolation from other users — more power than shared hosting at a lower cost than a dedicated server." },
  { question: "Do I get root access with DronaHost VPS?", answer: "Yes, all DronaHost VPS plans include full root access so you can install any software, configure your server environment, and run custom applications." },
  { question: "Can I upgrade my VPS plan later?", answer: "Yes, you can upgrade your RAM, CPU, and storage at any time from your control panel with zero downtime. Resources are scaled instantly." },
  { question: "What operating systems are available?", answer: "We support Ubuntu 22.04/20.04, Debian 12/11, CentOS Stream 9, AlmaLinux 9, and Rocky Linux 9. You can reinstall your OS at any time." },
];

export default function VpsHostingPage() {
  return (
    <>
      <JsonLd schema={[
        breadcrumbSchema(buildBreadcrumbs("/vps-hosting")),
        productWithOfferSchema({
          name: "VPS Hosting",
          description: "High-performance VPS with full root access, NVMe SSD storage, and 99.9% uptime SLA.",
          url: "https://dronahost.com/vps-hosting",
          price: "9.99",
          priceCurrency: "USD",
        }),
        faqPageSchema(faqs),
      ]} />

      {/* Hero */}
      <Section padding="hero" hAlign="center">
        <HeadLineText as="h1" fontSize="fiveXl" fontWeight="bold" align="center">
          VPS Hosting — Full Control, Maximum Speed
        </HeadLineText>
        <p className="mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300 text-center mx-auto">
          Root access, NVMe SSD storage, and guaranteed resources. Deploy any application on a fully managed virtual server starting at $9.99/mo.
        </p>
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Link href="/pricing" className="rounded-lg bg-primary px-6 py-3 text-white font-semibold hover:bg-primary/90 transition-colors">
            View Pricing
          </Link>
          <Link href="/contact" className="rounded-lg border border-slate-300 px-6 py-3 font-semibold hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800 transition-colors">
            Talk to Sales
          </Link>
        </div>
      </Section>

      {/* Features */}
      <Section padding="lg">
        <HeadLineText as="h2" fontSize="fourXl" fontWeight="bold" align="center">
          Everything You Need to Scale
        </HeadLineText>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Full Root Access", desc: "Complete control over your server. Install any software, configure services, and manage users." },
            { title: "NVMe SSD Storage", desc: "Up to 10× faster than traditional SSD. Blazing-fast I/O for databases and high-traffic sites." },
            { title: "DDoS Protection", desc: "Enterprise-grade DDoS mitigation included on all plans — your server stays online under attack." },
            { title: "99.9% Uptime SLA", desc: "Backed by a financially guaranteed SLA. We credit your account if we miss our uptime commitment." },
            { title: "Scalable Resources", desc: "Upgrade RAM, CPU, and storage instantly from your dashboard — no migration, no downtime." },
            { title: "24/7 Expert Support", desc: "Our Linux experts are available around the clock via live chat and ticketing." },
          ].map((f) => (
            <div key={f.title} className="rounded-xl border border-slate-200 p-6 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Pricing */}
      <Section padding="lg" variant="inset">
        <HeadLineText as="h2" fontSize="fourXl" fontWeight="bold" align="center">
          Simple, Transparent Pricing
        </HeadLineText>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {[
            { name: "Basic VPS", price: "$9.99", period: "/mo", ram: "2 GB RAM", cpu: "2 vCPU", storage: "50 GB NVMe", bandwidth: "2 TB bandwidth" },
            { name: "Pro VPS", price: "$19.99", period: "/mo", ram: "4 GB RAM", cpu: "4 vCPU", storage: "100 GB NVMe", bandwidth: "4 TB bandwidth", featured: true },
            { name: "Elite VPS", price: "$39.99", period: "/mo", ram: "8 GB RAM", cpu: "6 vCPU", storage: "200 GB NVMe", bandwidth: "8 TB bandwidth" },
          ].map((plan) => (
            <div key={plan.name} className={`rounded-xl border p-6 ${plan.featured ? "border-primary bg-primary/5" : "border-slate-200 dark:border-slate-700"}`}>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{plan.name}</h3>
              <p className="mt-2 text-3xl font-black text-primary">{plan.price}<span className="text-sm font-normal text-slate-500">{plan.period}</span></p>
              <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>{plan.ram}</li>
                <li>{plan.cpu}</li>
                <li>{plan.storage}</li>
                <li>{plan.bandwidth}</li>
              </ul>
              <Link href="/pricing" className="mt-6 block rounded-lg bg-primary px-4 py-2 text-center text-white font-semibold hover:bg-primary/90 transition-colors">
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section padding="lg">
        <HeadLineText as="h2" fontSize="fourXl" fontWeight="bold" align="center">
          Frequently Asked Questions
        </HeadLineText>
        <div className="mt-10 max-w-3xl mx-auto space-y-6">
          {faqs.map((faq) => (
            <div key={faq.question} className="rounded-xl border border-slate-200 p-6 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">{faq.question}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{faq.answer}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section padding="lg" variant="highlight" hAlign="center">
        <HeadLineText as="h2" fontSize="fourXl" fontWeight="bold" align="center">
          Ready to Get More Power?
        </HeadLineText>
        <p className="mt-4 text-slate-600 dark:text-slate-300 text-center">
          Compare our VPS plans with{" "}
          <Link href="/wordpress-hosting" className="text-primary hover:underline">WordPress Hosting</Link>
          {" "}or{" "}
          <Link href="/cloud-hosting" className="text-primary hover:underline">Cloud Hosting</Link>.
        </p>
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Link href="/pricing" className="rounded-lg bg-primary px-6 py-3 text-white font-semibold hover:bg-primary/90 transition-colors">
            See All Plans
          </Link>
          <Link href="/contact" className="rounded-lg border border-primary px-6 py-3 font-semibold text-primary hover:bg-primary/5 transition-colors">
            Contact Sales
          </Link>
        </div>
      </Section>
    </>
  );
}
