import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";

type TeamsSectionProps = {
  data: {
    trustSection?: {
      rating?: {
        label?: string;
        reviews?: string;
      };
      title?: {
        text?: string;
      };
    };
  };
};

export default function TeamsSection({ data }: TeamsSectionProps) {
  const section = data.trustSection;

  return (
    <Section padding="lg" className="dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HeadLineText
          as="h2"
          fontSize="md"
          align="center"
          fontWeight="medium"
          fontColor="muted"
        >
          {section?.rating?.label ?? "Excellent Teams"}
        </HeadLineText>

        <div className="mt-10 space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-4">
                👥
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Team Excellence
                </p>
                <h3 className="font-semibold text-lg mt-1">
                  {section?.rating?.reviews ?? "50K+ Members"}
                </h3>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-300">
              {section?.title?.text ?? "Join our growing community of developers, designers, and entrepreneurs who trust dronahost for their web hosting needs."}
            </p>

            <div className="mt-6 flex flex-wrap gap-4 justify-center">
              <button className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-400 text-white px-4 py-2 rounded-md font-medium transition-colors">
                Join Community
              </button>
              <button className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 px-4 py-2 rounded-md font-medium transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}