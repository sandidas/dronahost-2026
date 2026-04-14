import GridCard from "@/components/Card/GridCard";
import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";

type ReviewItem = {
  rating: number;
  platform: string;
  text: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
};

type Props = {
  data: {
    tagline: string;
    title: string;
    tabs: string[];
    items: ReviewItem[];
  };
};

export default function ReviewFeedback({ data }: Props) {
  const { tagline, title, tabs, items } = data;

  return (
    <Section padding="lg" className="bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto space-y-16">

        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
        <HeadLineText
            as="p"
            fontSize="sm"
            fontWeight="medium"
            align="center"
            className="text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400"
          >
            {tagline}
          </HeadLineText>


          <HeadLineText
            as="h2"
            fontSize="fiveXl"
            fontWeight="bold"
            align="center"
            className="text-black dark:text-white"
          >
            {title}
          </HeadLineText>
        </div>

        {/* Tabs */}
        <div className="flex justify-end gap-6 text-sm font-medium">
          {tabs.map((tab, index) => (
            <span
              key={index}
              className={`cursor-pointer pb-1 ${
                index === 0
                  ? "text-orange-500 border-b-2 border-orange-500"
                  : "text-gray-400 hover:text-black dark:hover:text-white"
              }`}
            >
              {tab}
            </span>
          ))}
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <GridCard
              key={index}
              index={index}
              total={items.length}
              columns={3}
              size="lg"
              separatorTone="soft"
            >
              {/* Top Row */}
              <div className="flex items-center justify-between mb-4">
                
                {/* Stars */}
                <div className="text-orange-500 text-sm">
                  {"★".repeat(item.rating)}
                </div>

                {/* Platform */}
                <HeadLineText
                    as="span"
                    fontSize="sm"
                    align="right"
                    fontWeight="medium"
                    className=" text-gray-500 dark:text-gray-400"
                  >
                    {item.platform}
                  </HeadLineText>
              </div>

              {/* Text */}
              <HeadLineText
                as="p"
                fontSize="sm"
                fontWeight="medium"
                align="left"
                className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6"
              >
                “{item.text}”
              </HeadLineText>

              {/* Author */}
              <div className="flex items-center gap-3 mt-auto">
                <img
                  src={item.author.avatar}
                  alt={item.author.name}
                  className="w-10 h-10 rounded-full object-cover"
                />

                <div>
                    <HeadLineText
                    as="p"
                    fontSize="sm"
                    fontWeight="bold"
                    align="left"
                    className="text-black dark:text-white"
                  >
                    {item.author.name}
                  </HeadLineText>
                  <HeadLineText
                    as="p"
                    fontSize="sm"
                    fontWeight="medium"
                    align="left"
                    className="text-gray-500 dark:text-gray-400"
                  >
                    {item.author.role}
                  </HeadLineText>
                </div>
              </div>
            </GridCard>
          ))}
        </div>

      </div>
    </Section>
  );
}
