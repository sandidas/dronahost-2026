import CenteredHero from "@/components/sections/CenteredHero";
import JsonLd from "@/components/sections/JsonLd";
import SupportChannels from "@/components/sections/SupportChannels";
import { COMPANY } from "@/content/company";
import { buildBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { breadcrumbSchema } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import ContactForm from "./_components/ContactForm";

export const metadata = buildMetadata({
  title: "Contact DronaHost",
  description: "Ask the DronaHost team about hosting, migrations, web design or SEO. Send a message and we will reply by email.",
  path: "/contact",
});

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ plan?: string }> }) {
  const { plan } = await searchParams;
  return (
    <>
      <JsonLd schema={[breadcrumbSchema(buildBreadcrumbs("/contact"))]} />
      <CenteredHero
        eyebrow="Contact"
        title="Tell us about"
        titleAccent="your site"
        description="Ask about hosting, a migration, a web project or SEO. Send a message and we will reply by email."
        primaryCta={{ label: "Write to us", href: "#contact-form" }}
      />
      <section aria-labelledby="contact-form-heading" className="section-y">
        <div className="container-site grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div>
            <h2 className="t-h3 text-foreground">Other ways to reach us</h2>
            <dl className="mt-6 space-y-5 text-sm">
              {COMPANY.supportEmail && (
                <div>
                  <dt className="font-semibold text-muted-foreground">Email</dt>
                  <dd className="mt-1">
                    <a href={`mailto:${COMPANY.supportEmail}`} className="text-link underline underline-offset-4">
                      {COMPANY.supportEmail}
                    </a>
                  </dd>
                </div>
              )}
              <div>
                <dt className="font-semibold text-muted-foreground">Markets we serve</dt>
                <dd className="mt-1 text-foreground">United States, United Kingdom, United Arab Emirates and Europe</dd>
              </div>
              {COMPANY.address && (
                <div>
                  <dt className="font-semibold text-muted-foreground">Address</dt>
                  <dd className="mt-1 text-foreground">{COMPANY.address}</dd>
                </div>
              )}
            </dl>
          </div>
          <div id="contact-form" className="scroll-mt-24">
            <h2 id="contact-form-heading" className="t-h3 text-foreground">
              Send a message
            </h2>
            <div className="mt-6">
              <ContactForm defaultPlan={plan} />
            </div>
          </div>
        </div>
      </section>
      <SupportChannels className="!pt-0" />
    </>
  );
}
