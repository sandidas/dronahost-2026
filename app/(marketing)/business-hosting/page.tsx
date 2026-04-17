import Section from "@/components/section/section";
import HeadLineText from "@/components/HeadLineText/HeadLineText";
import JsonLd from "@/components/seo/JsonLd";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, productWithOfferSchema, faqPageSchema } from "@/lib/seo/jsonld";
import { buildBreadcrumbs } from "@/lib/seo/breadcrumbs";

export const metadata = buildMetadata({
  title: "Business Hosting with Email — From $3.99/mo | DronaHost",
  description: "Business hosting with professional email, unlimited databases, free SSL, and priority support. Perfect for growing businesses. From $3.99/mo.",
  path: "/business-hosting",
});

const faqs = [
  { question: "Does business hosting include professional email?", answer: "Yes, all DronaHost business hosting plans include professional email hosting with your domain (e.g., you@yourbusiness.com), spam filtering, and webmail access." },
  { question: "How many websites can I host on a business plan?", answer: "The Professional and Enterprise business hosting plans support unlimited websites. The Starter plan supports up to 5 websites." },
  { question: "Is there a staging environment included?", answer: "Yes, our Professional and Enterprise plans include a one-click staging environment so you can test updates before pushing them live." },
  { question: "What kind of support is included?", answer: "Business hosting includes priority support with a 1-hour response SLA, a dedicated account manager on Enterprise plans, and 24/7 live chat for all tiers." },
];

export default function BusinessHostingPage() {
  return (
    <>
      <JsonLd schema={[
        breadcrumbSchema(buildBreadcrumbs("/business-hosting")),
        productWithOfferSchema({
          name: "Business Hosting",
          description: "Business hosting with professional email, unlimited databases, and priority support.",
          url: "https://dronahost.com/business-hosting",
          price: "3.99",
          priceCurrency: "USD",
        }),
        faqPageSchema(faqs),
      ]} />

      {/* Hero */}
      <Section padding="hero" hAlign="center">
        <HeadLineText as="h1" fontSize="fiveXl" fontWeight="bold" align="center">
          Business Hosting — Everything Your Business Needs
        </HeadLineText>
        <p className="mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300 text-center mx-auto">
          Professional email, unlimited databases, priority support, and a staging environment — all in one business hosting plan. From $3.99/mo.
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
          Built for Growing Businesses
        </HeadLineText>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Professional Email", desc: "Branded email addresses (@yourdomain.com) with spam filtering, webmail, and mobile sync." },
            { title: "Unlimited Databases", desc: "Create as many MySQL and PostgreSQL databases as your applications need — no arbitrary limits." },
            { title: "Priority Support", desc: "Skip the queue. Business plan customers get priority ticketing with a 1-hour response SLA." },
            { title: "Free SSL Certificates", desc: "Wildcard SSL for all your domains, auto-renewed every 90 days at no extra cost." },
            { title: "Daily Backups", desc: "Automated daily backups retained for 30 days. Restore your site with one click at any time." },
            { title: "Staging Environment", desc: "Test changes safely before going live with a one-click staging environment on Pro and Enterprise plans." },
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
          Business Plans for Every Stage
        </HeadLineText>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {[
            { name: "Starter", price: "$3.99", period: "/mo", sites: "5 websites", email: "10 email accounts", storage: "30 GB NVMe", support: "Standard support" },
            { name: "Professional", price: "$7.99", period: "/mo", sites: "Unlimited websites", email: "Unlimited email", storage: "100 GB NVMe", support: "Priority support", featured: true },
            { name: "Enterprise", price: "$14.99", period: "/mo", sites: "Unlimited websites", email: "Unlimited email", storage: "300 GB NVMe", support: "Dedicated manager" },
          ].map((plan) => (
            <div key={plan.name} className={`rounded-xl border p-6 ${plan.featured ? "border-primary bg-primary/5" : "border-slate-200 dark:border-slate-700"}`}>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{plan.name}</h3>
              <p className="mt-2 text-3xl font-black text-primary">{plan.price}<span className="text-sm font-normal text-slate-500">{plan.period}</span></p>
              <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>{plan.sites}</li>
                <li>{plan.email}</li>
                <li>{plan.storage}</li>
                <li>{plan.support}</li>
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
          Ready to Grow Your Business Online?
        </HeadLineText>
        <p className="mt-4 text-slate-600 dark:text-slate-300 text-center">
          Compare with{" "}
          <Link href="/wordpress-hosting" className="text-primary hover:underline">WordPress Hosting</Link>
          {" "}or{" "}
          <Link href="/vps-hosting" className="text-primary hover:underline">VPS Hosting</Link>.
        </p>
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Link href="/pricing" className="rounded-lg bg-primary px-6 py-3 text-white font-semibold hover:bg-primary/90 transition-colors">
            See All Plans
          </Link>
          <Link href="/contact" className="rounded-lg border border-primary px-6 py-3 font-semibold text-primary hover:bg-primary/5 transition-colors">
            Get a Custom Quote
          </Link>
        </div>
      </Section>
    </>
  );
}
