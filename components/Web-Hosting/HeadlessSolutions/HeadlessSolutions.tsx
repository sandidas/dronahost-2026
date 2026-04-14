import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";

type Tab = {
  title: string;
  description: string;
  active?: boolean;
};

type Props = {
  data: {
    tagline: string;
    title: string;
    tabs: Tab[];
    image: {
      src: string;
      alt: string;
    };
  };
};

export default function HeadlessSolutions({ data }: Props) {
  const { tagline, title, tabs, image } = data;

  return (
    <Section padding="lg" className="bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

        {/* LEFT SIDE */}
        <div className="space-y-8">

          {/* Tagline */}
          <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">
            {tagline}
          </p>

          {/* Title */}
          <HeadLineText
            as="h2"
            fontSize="fiveXl"
            fontWeight="bold"
            align="left"
            className="text-black dark:text-white"
          >
            {title}
          </HeadLineText>

          {/* Tabs */}
          <div className="space-y-4 pt-2">
            {tabs.map((tab, i) => (
              <div
                key={i}
                className={`
                  rounded-xl p-6 transition-all
                  ${
                    tab.active
                      ? "bg-orange-500 text-white shadow-lg"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  }
                `}
              >
                <HeadLineText
                  as="h3"
                  fontSize="md"
                  fontWeight="bold"
                  align="left"
                  className="text-black dark:text-white leading-snug mb-4"
                >
                  {tab.title}
                </HeadLineText>

                {/* Only show description for active tab */}
                {tab.active && (
                  <p className="text-sm text-white/90 leading-relaxed">
                    {tab.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="flex justify-center lg:justify-end">
          <img
            src={image.src}
            alt={image.alt}
            className="rounded-2xl shadow-xl max-w-lg"
          />
        </div>

      </div>
    </Section>
  );
}