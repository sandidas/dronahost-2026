import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";
import Link from "next/link";

type Item = {
  id: number;
  title: string;
  image: string;
  link: string;
  cta?: string;
};

type Props = {
  data: {
    tagline: string;
    title: string;
    items: Item[];
  };
};

export default function ResourceInsights({ data }: Props) {
  const { tagline, title, items } = data;

  return (
    <Section padding="lg" className="bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto space-y-4">
        <HeadLineText
          as="p"
          fontSize="sm"
          fontWeight="medium"
          align="left"
          className=" uppercase tracking-widest text-gray-500 dark:text-gray-400"
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

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <Link key={item.id} href={item.link} className="group">

                <div className="space-y-4">

                  {/* Image Card */}
                  <div className="relative rounded-2xl overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-[260px] object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 from-black/70 via-black/20 to-transparent flex items-end p-5">
                      <HeadLineText
                        as="h3"
                        fontSize="sm"
                        fontWeight="bold"
                        align="left"
                        className="text-white"
                      >
                        {item.title}
                      </HeadLineText>
                    </div>
                  </div>

                  {/* CTA only for last card */}
                  {isLast && item.cta && (
                    <span className="text-sm text-orange-500 font-medium">
                      {item.cta} →
                    </span>
                  )}

                </div>
              </Link>
            );
          })}

        </div>


    </Section>
  );
}