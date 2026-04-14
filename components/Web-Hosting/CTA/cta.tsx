import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";

type CTAProps = {
  data: {
    quote: string;
    author: {
      name: string;
      role: string;
      company: string;
      avatar: string;
    };
  };
};

export default function CTA({ data }: CTAProps) {
  const { quote, author } = data;

  return (
    <Section padding="lg" className="bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto text-center space-y-10">

        {/* Quote */}
        <HeadLineText
          as="h2"
          fontSize="twoXl"
          fontWeight="medium"
          align="center"
          className="text-gray-600 dark:text-gray-300 leading-relaxed"
        >
          “
          <span className="text-gray-500 dark:text-gray-400">
            {quote.split(".")[0]}.
          </span>{" "}
          <span className="text-black dark:text-white font-semibold">
            {quote.split(".")[1]}.
          </span>{" "}
          <span className="text-gray-500 dark:text-gray-400">
            {quote.split(".").slice(2).join(".")}
          </span>
          ”
        </HeadLineText>

        {/* Author */}
        <div className="flex flex-col items-center gap-3">
          <img
            src={author.avatar}
            alt={author.name}
            className="w-10 h-10 rounded-full object-cover"
          />

          <div className="text-center">
            <HeadLineText
              as="p"
              fontSize="sm"
              fontWeight="bold"
              className="text-black dark:text-white"
            >
              {author.name}
            </HeadLineText>
            <HeadLineText
              as="p"
              fontSize="sm"
              className="text-gray-500 dark:text-gray-400"
            >
              {author.role}, {author.company}
            </HeadLineText>
          </div>
        </div>

      </div>
    </Section>
  );
}