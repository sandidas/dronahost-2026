import Badge from "@/components/ui/Badge";
import HeadLineText from "@/components/ui/HeadLineText";
import Section from "@/components/ui/Section";
import { cn } from "@/utils/cn";

type ProcessStep = {
  step: number;
  title: string;
  description: string;
  image?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
};

type ProcessStepsProps = {
  tagline?: string;
  title?: string;
  steps: ProcessStep[];
  layout?: "alternating" | "numbered";
  className?: string;
};

export default function ProcessSteps({
  tagline,
  title,
  steps,
  layout = "alternating",
  className,
}: ProcessStepsProps) {
  return (
    <Section size="lg" padding="lg" className={cn("bg-white dark:bg-gray-900", className)}>
      {/* Header */}
      {(tagline || title) && (
        <div className="mb-16 space-y-4 text-center">
          {tagline && <Badge variant="neutral">{tagline}</Badge>}
          {title && (
            <HeadLineText as="h2" fontSize="fiveXl" fontWeight="bold" align="center">
              {title}
            </HeadLineText>
          )}
        </div>
      )}

      {layout === "alternating" ? (
        <div className="relative space-y-24">
          {/* Center dashed vertical line */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-0 bottom-0 hidden border-l-2 border-dashed border-orange-300 dark:border-primary lg:block"
          />

          {steps.map((item, index) => {
            const isEven = index % 2 === 0;
            return (
              <div key={index} className="relative grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
                {isEven ? (
                  <>
                    {/* Text — right side */}
                    <div className="space-y-4 text-center lg:pr-10 lg:text-right">
                      <HeadLineText as="h3" fontSize="xl" fontWeight="bold" align="right" className="text-black dark:text-white">
                        {item.title}
                      </HeadLineText>
                      <p className="ml-auto max-w-md text-sm text-gray-600 dark:text-gray-400">
                        {item.description}
                      </p>
                    </div>
                    {/* Image — left side */}
                    {item.image && (
                      <div className="mx-10 flex justify-start">
                        <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-gray-100 shadow-md dark:bg-gray-800">
                          <img
                            src={item.image.src}
                            alt={item.image.alt}
                            className="h-full w-full object-cover opacity-80"
                          />
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {/* Image — left side */}
                    {item.image && (
                      <div className="order-2 mx-10 flex justify-end lg:order-1">
                        <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-gray-100 shadow-md dark:bg-gray-800">
                          <img
                            src={item.image.src}
                            alt={item.image.alt}
                            className="h-full w-full object-cover opacity-80"
                          />
                        </div>
                      </div>
                    )}
                    {/* Text — right side */}
                    <div className={cn("order-1 space-y-4 text-center lg:order-2 lg:pl-10 lg:text-left", !item.image && "lg:col-start-2")}>
                      <HeadLineText as="h3" fontSize="xl" fontWeight="bold" align="left" className="text-black dark:text-white">
                        {item.title}
                      </HeadLineText>
                      <p className="max-w-md text-sm text-gray-600 dark:text-gray-400">
                        {item.description}
                      </p>
                    </div>
                  </>
                )}

                {/* Step circle */}
                <div
                  aria-hidden="true"
                  className="absolute left-1/2 hidden h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border-4 border-white bg-orange-500 font-semibold text-white shadow-lg dark:border-gray-900 lg:flex"
                >
                  {item.step}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Numbered layout */
        <ol className="space-y-8">
          {steps.map((item, index) => (
            <li key={index} className="flex gap-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500 font-semibold text-white shadow">
                {item.step}
              </div>
              <div className="space-y-1 pt-1">
                <h3 className="font-bold text-gray-900 dark:text-white">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </Section>
  );
}
