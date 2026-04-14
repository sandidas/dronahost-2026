import GridCard from "@/components/Card/GridCard";
import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";

type Category = {
  title: string;
  items: string[];
};

type ServicesProps = {
  data: {
    title: string;
    description: string;
    categories: Category[];
  };
};

export default function ServicesDetails({ data }: ServicesProps) {
  const { title, description, categories } = data;

  return (
    <Section padding="lg" className="bg-background dark:bg-gray-900">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* Heading */}
        <div className="max-w-3xl space-y-4">
          <HeadLineText
            as="h2"
            fontSize="fourXl"
            fontWeight="bold"
            align="left"
            className="text-black dark:text-white"
          >
            {title}
          </HeadLineText>

          <HeadLineText
            as="p"
            fontSize="md"
            fontWeight="medium"
            align="left"
            className="text-gray-600 dark:text-gray-300"
          >
            {description}
          </HeadLineText>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-stretch gap-10">
          {categories.map((category, index) => (
            <GridCard
              key={index}
              index={index}
              total={categories.length}
              columns={3}
              size="md"
              separatorTone="soft"
            >
              {/* Category Title */}
              <h3 className="text-lg font-semibold text-black dark:text-white mb-6">
                {category.title}
              </h3>

              {/* Items */}
              <div className="flex flex-col divide-y divide-gray-300 dark:divide-gray-700">
                {category.items.map((item, i) => (
                  <div
                    key={i}
                    className="py-3 text-sm text-gray-700 dark:text-gray-300"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </GridCard>
          ))}
        </div>

      </div>
    </Section>
  );
}