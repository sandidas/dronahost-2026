import GridCard from "@/components/Card/GridCard";
import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";
import Image from "next/image";
import Link from "next/link";

type Service = {
  id: number;
  title: string;
  description: string;
  icon: string;
  cta: {
    label: string;
    link: string;
  };
};

type ServicesSectionProps = {
  data: {
    servicesSection: {
      tagline: string;
      title: string;
      description: string;
      services: Service[];
      layout?: {
        columns?: number;
        showDividers?: boolean;
        alignment?: string;
      };
    };
  };
};

export default function ServicesSection({ data }: ServicesSectionProps) {
  const section = data.servicesSection;

  const columns = section.layout?.columns ?? 4;
  const services = section.services;

  return (
    <Section padding="xl" hAlign="center">
      <div className="w-full">

        {/* Tagline */}
        <p className="text-xs tracking-widest text-gray-400 uppercase mb-4 text-center">
          {section.tagline}
        </p>

        {/* Title */}
        <HeadLineText
          as="h2"
          fontSize="fourXl"
          fontWeight="bold"
          align="center"
          className="max-w-xl mx-auto"
        >
          {section.title}
        </HeadLineText>

        {/* Description */}
        <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-center">
          {section.description}
        </p>

        {/* Grid */}
        <div
          className={`mt-16 grid ${
            columns === 4
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {services.map((service, index) => (
            <GridCard
              key={service.id}
              index={index}
              total={services.length}
              columns={columns}
              align="left"
              size="md"
              variant="default"
            >
              {/* Icon */}
              <div className="mb-6">
                <Image
                  src="/icon/clickIcon.svg"
                  alt="service icon"
                  width={50}
                  height={50}
                  className="object-contain"
                />
              </div>

              {/* Title */}
              <HeadLineText
                as="h3"
                fontSize="md"
                fontWeight="bold"
                align="left"
                className="mb-2"
              >
                {service.title}
              </HeadLineText>

              {/* Description */}
              <HeadLineText
                as="p"
                fontSize="sm"
                fontWeight="light"
                align="left"
                className="mb-4 text-gray-500"
              >
                {service.description}
              </HeadLineText>

              {/* CTA */}
              <div className="mt-6">
                <Link
                  href={service.cta.link}
                  className="border border-orange-400 text-orange-500 px-6 py-2 rounded-md text-sm font-medium hover:bg-orange-50 transition"
                >
                  {service.cta.label}
                </Link>
              </div>
            </GridCard>
          ))}
        </div>
      </div>
    </Section>
  );
}