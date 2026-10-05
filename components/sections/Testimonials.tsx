import Card from "@/components/ui/Card";
import HeadLineText from "@/components/ui/HeadLineText";
import Section from "@/components/ui/Section";
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
    /** Company name. Required for a testimonial to render publicly. */
    company?: string;
    avatar: string;
    /** Verifiable source (LinkedIn, company site, review URL). Required for public rendering. */
    sourceUrl?: string;
  };
};

const isVerifiable = (t: Testimonial): boolean =>
  Boolean(t.author.name && t.author.role && t.author.company && t.author.sourceUrl);

type Props = {
  /** Heading level for the section title so pages keep one H1. Default "h2". */
  headingLevel?: "h2" | "h3";
  /** Showcase only: renders unverified sample entries with a visible "Sample data" label. */
  showSamples?: boolean;
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

export default function Testimonials({ data, headingLevel = "h2", showSamples = false }: Props) {
  const section = data.testimonialsSection;
  const entries = showSamples ? section.testimonials : section.testimonials.filter(isVerifiable);

  // Hide the whole section rather than show vague or unsourced testimonials.
  if (entries.length === 0) return null;

  const columns = section.layout?.columns ?? 3;

  return (
    <Section padding="xl" className="bg-gray-50 dark:bg-gray-900" aria-labelledby="testimonials-heading">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">

          {/* TITLE */}
          <HeadLineText
            id="testimonials-heading"
            as={headingLevel}
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
          {entries.map((item, index) => (
            <Card
              key={item.id}
              variant="grid"
              index={index}
              total={entries.length}
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
                &ldquo;{item.content}&rdquo;
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
                    {item.author.company ? `, ${item.author.company}` : ""}
                  </p>
                  {!isVerifiable(item) && (
                    <p className="text-xs font-semibold text-amber-600">Sample data (unverified)</p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  );
}
