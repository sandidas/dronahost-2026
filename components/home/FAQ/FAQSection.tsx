import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";

type FAQSectionProps = {
  data: {
    faqSection?: {
      title?: string;
      categories?: Array<{ label: string; active: boolean }>;
      content?: {
        description?: string;
      };
      faqs?: Array<{
        id: number;
        question: string;
        answer: string;
      }>;
    };
  };
};

export default function FAQSection({ data }: FAQSectionProps) {
  const section = data.faqSection;

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
          {section?.title ?? "Frequently Asked Questions"}
        </HeadLineText>

        <div className="mt-10 space-y-6">
          {/* Categories */}
          <div className="flex flex-wrap gap-4 mb-6">
            {(section?.categories ?? []).map((category, index) => (
              <button
                key={`${category.label}-${index}`}
                className={category.active
                  ? "px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md font-medium transition-colors"
                  : "px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 rounded-md font-medium transition-colors"}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* FAQ Content */}
          <div className="space-y-4">
            {(section?.faqs ?? []).map((faq, index) => (
              <div key={faq.id} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg">{faq.question}</h3>
                  <button className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                <p className="mt-3 text-gray-600 dark:text-gray-300">
                  {faq.answer || (index === 0 ? section?.content?.description : "Detailed guidance is available in this section.")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}