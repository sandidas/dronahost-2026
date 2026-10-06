import ServicePage, { serviceMetadata } from "@/components/templates/ServicePage";
import { SERVICES } from "@/content/services";

const content = SERVICES["web-design"];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return serviceMetadata(content, locale);
}

export default function Page() {
  return <ServicePage content={content} heroVariant="centered" />;
}
