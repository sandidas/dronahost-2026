import Breadcrumbs from "@/components/ui/Breadcrumbs";
import JsonLd from "@/components/sections/JsonLd";
import ConsultationForm from "@/components/forms/ConsultationForm";
import { buildBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { breadcrumbSchema } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Book a Consultation | DronaHost",
  description: "Talk to the DronaHost team about hosting, web design or SEO. Send a short brief and we will reply by email to agree a time.",
  path: "/consultation",
});

export default function Page() {
  return (
    <>
      <JsonLd schema={[breadcrumbSchema(buildBreadcrumbs("/consultation"))]} />
      <div className="container-site section-y">
        <Breadcrumbs path="/consultation" />
        <div className="mx-auto mt-8 max-w-2xl">
          <p className="t-eyebrow">Consultation</p>
          <h1 className="t-h1 mt-3 text-foreground">Talk to the team about your project</h1>
          <p className="t-lead mt-4">Send a short brief. We read it first, then reply by email to agree a time that suits your time zone.</p>
          <div className="mt-10">
            <ConsultationForm />
          </div>
        </div>
      </div>
    </>
  );
}
