import GridCard from "@/components/Card/GridCard";
import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";

type Testimonial = {
  id: number;
  title: string;
  description: string;
  author: string;
  role: string;
  company: string;
};

type Review = {
  rating: number;
  platform: string;
  title: string;
  description: string;
  author: {
    name: string;
    role: string;
    company: string;
  };
};

type TestimonialsProps = {
  data: {
    tagline: string;
    title: string;
    testimonials?: Testimonial[];
    reviews?: Review[];
  };
};

export default function Testimonials({ data }: TestimonialsProps) {
  const { tagline, title } = data;

  const testimonials: Testimonial[] = data.testimonials
    ? data.testimonials
    : (data.reviews ?? []).map((review, index) => ({
        id: index + 1,
        title: review.title,
        description: review.description,
        author: review.author.name,
        role: review.author.role,
        company: review.author.company,
      }));

  return (
    <Section padding="lg" className="text-slate-900 dark:text-slate-100">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* Header */}
        <div className="space-y-4 max-w-2xl">
          <HeadLineText
            as="p"
            fontSize="sm"
            fontWeight="medium"
            align="left"
            className="text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400"
          >
            {tagline}
          </HeadLineText>

          <HeadLineText
            as="h2"
            fontSize="fiveXl"
            fontWeight="bold"
            align="left"
            className="text-black dark:text-white"
          >
            {title}
          </HeadLineText>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item, index) => (
            <GridCard
              key={item.id}
              index={index}
              total={testimonials.length}
              columns={3}
              separatorTone="soft"
              size="lg"
            >
              {/* Stars + Badge */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex text-orange-500 text-sm">
                  {"★★★★★"}
                </div>

                <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md text-gray-700 dark:text-gray-300">
                  reviewed by G2
                </span>
              </div>

              {/* Title */}
              <HeadLineText
                as="h3"
                fontSize="md"
                fontWeight="bold"
                align="left"
                className="text-black dark:text-white leading-snug mb-4"
              >
                {item.title}
              </HeadLineText>

              {/* Description */}
              <HeadLineText
                as="p"
                fontSize="sm"
                fontWeight="medium"
                align="left"
                className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6"
              >
                {item.description}
              </HeadLineText>

              {/* Author */}
              <div className="mt-auto">
                <HeadLineText
                  as="p"
                  fontSize="sm"
                  fontWeight="bold"
                  align="left"
                  className="text-black dark:text-white"
                >
                  {item.author}
                </HeadLineText>
                <HeadLineText
                  as="p"
                  fontSize="sm"
                  fontWeight="medium"
                  align="left"
                  className="text-gray-500 dark:text-gray-400"
                >
                  {item.role}
                </HeadLineText>
                <HeadLineText
                  as="p"
                  fontSize="sm"
                  fontWeight="medium"
                  align="left"
                  className="text-gray-500 dark:text-gray-400"
                >

                  {item.company}
                </HeadLineText>
              </div>
            </GridCard>
          ))}
        </div>

      </div>
    </Section>
  );
}