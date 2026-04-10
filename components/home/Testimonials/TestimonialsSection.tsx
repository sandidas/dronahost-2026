import GridCard from "@/components/Card/GridCard";
import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";
import Image from "next/image";

type Testimonial = {
  id: number;
  rating: number;
  source: {
    platform: string;
    label: string;
    icon: string;
  };
  content: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
};

type Props = {
  data: {
    testimonialsSection: {
      title: string;
      tabs: {
        label: string;
        active: boolean;
      }[];
      testimonials: Testimonial[];
      layout?: {
        columns?: number;
      };
    };
  };
};

export default function TestimonialsSection({ data }: Props) {
  const section = data.testimonialsSection;

  const columns = section.layout?.columns ?? 3;

  return (
    <Section padding="xl" className="bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">

          {/* TITLE */}
          <HeadLineText
            as="h2"
            fontSize="fourXl"
            fontWeight="bold"
            align="left"
            className="max-w-xl"
          >
            {section.title}
          </HeadLineText>

          {/* TABS (STATIC now, no state) */}
          <div className="flex gap-6 text-sm">
            {section.tabs.map((tab) => (
              <span
                key={tab.label}
                className={`pb-1 ${
                  tab.active
                    ? "text-orange-500 border-b-2 border-orange-500"
                    : "text-gray-400"
                }`}
              >
                {tab.label}
              </span>
            ))}
          </div>
        </div>

        {/* GRID */}
        <div
          className={`mt-12 grid ${
            columns === 3
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1 md:grid-cols-2"
          }`}
        >
          {section.testimonials.map((item, index) => (
            <GridCard
              key={item.id}
              index={index}
              total={section.testimonials.length}
              columns={columns}
              size="md"
              align="left"
              separatorTone="soft"
            >
              {/* TOP ROW */}
              <div className="flex items-center justify-between mb-4">

                {/* STARS */}
                <div className="flex gap-1 text-orange-500 text-sm">
                  {"★".repeat(item.rating)}
                </div>
                
              </div>

              {/* CONTENT */}
              <p className="text-sm text-gray-600 leading-relaxed">
                "{item.content}"
              </p>

              {/* AUTHOR */}
              <div className="mt-6 flex items-center gap-3">
                <Image
                  src={item.author.avatar}
                  alt={item.author.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />

                <div>
                  <p className="text-sm font-semibold">
                    {item.author.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {item.author.role}
                  </p>
                </div>
              </div>
            </GridCard>
          ))}
        </div>
      </div>
    </Section>
  );
}