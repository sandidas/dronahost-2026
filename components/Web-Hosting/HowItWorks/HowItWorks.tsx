import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";

type Step = {
  step: number;
  title: string;
  description: string;
  image: string;
};

type Props = {
  data: {
    tagline: string;
    title: string;
    steps: Step[];
  };
};

export default function HowItWorks({ data }: Props) {
  const { tagline, title, steps } = data;

  return (
    <Section padding="lg" className="bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto space-y-20 relative">

        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
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

        {/* Center Vertical Line */}
        <div className="hidden lg:block absolute left-1/2 top-32 bottom-0 border-l-2 border-dashed border-orange-300 dark:border-primary" />

        {/* Steps */}
        <div className="space-y-24">
          {steps.map((item, index) => {
            const isLeft = index % 2 === 0;

            return (
              <div
                key={index}
                className="grid lg:grid-cols-2 gap-10 items-center relative"
              >
                {/* LEFT */}
                {isLeft ? (
                  <>
                    {/* Text */}
                    <div className="text-center lg:text-right space-y-4 pr-10">
                        <HeadLineText
                            as="h3"
                            fontSize="xl"
                            fontWeight="bold"
                            align="right"
                            className="text-black dark:text-white"
                        >
                            {item.title}
                        </HeadLineText>
                    <HeadLineText
                        as="p"
                        fontSize="sm"
                        fontWeight="medium"
                        align="right"
                        className="text-gray-600 dark:text-gray-400 max-w-md ml-auto"
                    >
                        {item.description}
                    </HeadLineText>
                    </div>

                    {/* Image */}
                    <div className="flex justify-start mx-10">
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-md w-full max-w-sm overflow-hidden">
                        <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover opacity-80"
                        />
                        </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Image */}
                    <div className="flex justify-end order-2 lg:order-1 mx-10">
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-md w-full max-w-sm overflow-hidden">
                        <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover opacity-80"
                        />
                        </div>
                    </div>

                    {/* Text */}
                    <div className="text-center lg:text-left space-y-4 pl-10 order-1 lg:order-2">
                      <HeadLineText
                          as="h3"
                          fontSize="xl"
                          fontWeight="bold"
                          align="left"
                          className="text-black dark:text-white"
                      >
                        {item.title}
                      </HeadLineText>
                      <HeadLineText
                          as="p"
                          fontSize="sm"
                          fontWeight="medium"
                          align="left"
                          className="text-gray-600 dark:text-gray-400 max-w-md"
                      >
                        {item.description}
                      </HeadLineText>

                    </div>
                  </>
                )}

                {/* Step Circle */}
                <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center font-semibold shadow-lg border-4 border-white dark:border-gray-900">
                    {item.step}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </Section>
  );
}