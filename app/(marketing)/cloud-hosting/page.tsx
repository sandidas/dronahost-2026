import Section from "@/components/ui/Section";
import HeadLineText from "@/components/ui/HeadLineText";
import JsonLd from "@/components/sections/JsonLd";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, serviceSchema, faqPageSchema } from "@/lib/seo/jsonld";
import { buildBreadcrumbs } from "@/lib/seo/breadcrumbs";

export const metadata = buildMetadata({
  title: "Cloud Hosting Plans — High Availability | DronaHost",
  description: "Auto-scaling cloud hosting with 99.99% uptime SLA, global CDN, and instant provisioning. Built for growing businesses. Plans from $9.99/mo.",
  path: "/cloud-hosting",
});

const faqs = [
  { question: "How is cloud hosting different from shared hosting?", answer: "Cloud hosting uses a distributed network of servers — if one node fails, your site automatically migrates to another. Shared hosting sits on a single server, making it vulnerable to a single point of failure." },
  { question: "Does DronaHost cloud hosting auto-scale?", answer: "Yes. Our cloud infrastructure automatically scales resources up during traffic spikes and scales down during low traffic, so you only pay for what you use." },
  { question: "What is the uptime SLA for cloud hosting?", answer: "We guarantee 99.99% uptime for all cloud hosting plans, backed by financial credits if we fail to meet the SLA." },
  { question: "Is a CDN included with cloud hosting?", answer: "Yes, all cloud hosting plans include a global CDN with 30+ PoPs worldwide, reducing latency for visitors in the US, UK, UAE, and Europe." },
];

export default function CloudHostingPage() {
  return (
    <>
      <JsonLd schema={[
        breadcrumbSchema(buildBreadcrumbs("/cloud-hosting")),
        serviceSchema({
          name: "Cloud Hosting",
          description: "Auto-scaling cloud hosting with 99.99% uptime SLA and global CDN.",
          url: "https://dronahost.com/cloud-hosting",
        }),
        faqPageSchema(faqs),
      ]} />

      {/* Hero */}
      <Section padding="hero" hAlign="center">
        <HeadLineText as="h1" fontSize="fiveXl" fontWeight="bold" align="center">
          Cloud Hosting — Scale Without Limits
        </HeadLineText>
        <p className="mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300 text-center mx-auto">
          Auto-scaling infrastructure backed by a 99.99% uptime SLA. Deploy globally, handle any traffic spike, and pay only for what you use.
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
          Built for High-Traffic Businesses
        </HeadLineText>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Auto-Scaling", desc: "Resources scale automatically with traffic. Handle Black Friday spikes without manual intervention." },
            { title: "99.99% Uptime SLA", desc: "Financially backed SLA with credits if we miss our commitment. Your business never stops." },
            { title: "Global CDN", desc: "30+ Points of Presence worldwide. Fast load times for visitors in the US, UK, UAE, and Europe." },
            { title: "Instant Provisioning", desc: "New cloud instances are ready in under 60 seconds. Deploy globally in minutes." },
            { title: "Daily Snapshots", desc: "Automatic daily snapshots with 30-day retention. Restore any version with one click." },
            { title: "Managed Security", desc: "Automated patching, intrusion detection, and DDoS protection included on all plans." },
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
          Cloud Plans for Every Scale
        </HeadLineText>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {[
            { name: "Starter Cloud", price: "$9.99", period: "/mo", ram: "2 GB RAM", cpu: "2 vCPU", storage: "50 GB SSD", bandwidth: "Unmetered" },
            { name: "Business Cloud", price: "$19.99", period: "/mo", ram: "4 GB RAM", cpu: "4 vCPU", storage: "100 GB SSD", bandwidth: "Unmetered", featured: true },
            { name: "Enterprise Cloud", price: "$49.99", period: "/mo", ram: "16 GB RAM", cpu: "8 vCPU", storage: "300 GB SSD", bandwidth: "Unmetered" },
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
          Start Scaling Today
        </HeadLineText>
        <p className="mt-4 text-slate-600 dark:text-slate-300 text-center">
          Also compare with{" "}
          <Link href="/vps-hosting" className="text-primary hover:underline">VPS Hosting</Link>
          {" "}or{" "}
          <Link href="/wordpress-hosting" className="text-primary hover:underline">WordPress Hosting</Link>.
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
