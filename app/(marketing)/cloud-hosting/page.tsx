import ServicePage, { serviceMetadata } from "@/components/templates/ServicePage";
import { SERVICES } from "@/content/services";

const content = SERVICES["cloud-hosting"];

export const metadata = serviceMetadata(content);

export default function Page() {
  return <ServicePage content={content} heroVariant="split" />;
}
