import Section from "@/components/section/section";
import HeadLineText from "@/components/HeadLineText/HeadLineText";
import JsonLd from "@/components/seo/JsonLd";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, localBusinessSchema } from "@/lib/seo/jsonld";
import { buildBreadcrumbs } from "@/lib/seo/breadcrumbs";
import ContactForm from "./_components/ContactForm";

export const metadata = buildMetadata({
  title: "Contact DronaHost — Get Support & Sales Help",
  description: "Reach DronaHost support or sales. Available 24/7 for technical issues, billing, and pre-sales questions for US, UK, and UAE customers.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <JsonLd schema={[
        breadcrumbSchema(buildBreadcrumbs("/contact")),
        localBusinessSchema({
          name: "DronaHost",
          description: "Managed hosting company serving US, UK, UAE, and EU markets.",
          url: "https://dronahost.com",
        }),
      ]} />

      {/* Hero */}
      <Section padding="hero" hAlign="center">
        <HeadLineText as="h1" fontSize="fiveXl" fontWeight="bold" align="center">
          Get in Touch
        </HeadLineText>
        <p className="mt-6 max-w-xl text-lg text-slate-600 dark:text-slate-300 text-center mx-auto">
          Our team is available 24/7 for technical support, billing, and pre-sales questions. Average first response: under 1 hour.
        </p>
      </Section>

      {/* Contact grid */}
      <Section padding="lg">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact details */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Contact Information</h2>
            <ul className="mt-6 space-y-5">
              <li>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Email</p>
                <p className="mt-1 text-slate-900 dark:text-slate-100">support@dronahost.com</p>
              </li>
              <li>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Response Time</p>
                <p className="mt-1 text-slate-900 dark:text-slate-100">Under 1 hour for priority plans, under 24 hours for all others</p>
              </li>
              <li>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Availability</p>
                <p className="mt-1 text-slate-900 dark:text-slate-100">24 hours a day, 7 days a week — including holidays</p>
              </li>
              <li>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Markets Served</p>
                <p className="mt-1 text-slate-900 dark:text-slate-100">United States · United Kingdom · United Arab Emirates · Europe</p>
              </li>
            </ul>
            <div className="mt-8 space-y-2 text-sm text-slate-500">
              <p>Looking for something else?</p>
              <p>
                <Link href="/pricing" className="text-primary hover:underline">View hosting plans</Link>
                {" · "}
                <Link href="/wordpress-hosting" className="text-primary hover:underline">WordPress hosting</Link>
                {" · "}
                <Link href="/blog" className="text-primary hover:underline">Read our blog</Link>
              </p>
            </div>
          </div>

          {/* Form */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Send a Message</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">We will reply to your email within 24 hours.</p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
