import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";
import Image from "next/image";

type Feature = {
  title: string;
  description: string;
  cta?: {
    label: string;
  };
};

type FeatureSectionProps = {
  data: {
    featuresSection?: {
      tagline?: string;
      title?: string;
      features?: Feature[];
    };
  };
};

const featureImages = [
  "/images/home/BoxyLayout1.svg",
  "/images/home/BoxyLayout2.svg",
  "/images/home/BoxyLayout3.svg",
];

export default function FeatureSection2({ data }: FeatureSectionProps) {
  const section = data.featuresSection;
  const features = section?.features?.slice(0, 3) ?? [];

  return (
    <Section padding="lg" className="bg-white dark:bg-[#071a3a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <HeadLineText
          as="h2"
          fontSize="threeXl"
          align="center"
          fontWeight="bold"
          fontColor="muted"
          className="text-slate-900 dark:text-slate-100"
        >
          {section?.title ?? "Features Overview"}
          <span className="block mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">
            {section?.tagline}
          </span>
        </HeadLineText>

        {/* Grid */}
        <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div key={`${feature.title}-${index}`}>
              
              {/*  Layered Image UI */}
              <div className="relative mb-6 flex items-left justify-left">
                

                {/* Main card */}
                <div className="relative w-[90%] rounded-2xl border border-slate-200 bg-white shadow-md p-4 transition-transform duration-300 hover:-translate-y-2 dark:border-slate-700 dark:bg-slate-900">
                  
                  <Image
                    src={featureImages[index] ?? featureImages[0]}
                    alt={feature.title}
                    width={400}
                    height={120}
                    className="object-contain w-full h-auto"
                  />

                </div>
              </div>

              {/* Content */}
              <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                {feature.title}
              </h3>

              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>

              {/* CTA */}
              <button className="mt-4 flex items-center gap-1 text-sm font-semibold text-gray-800 hover:underline dark:text-gray-200">
                {(feature.cta?.label ?? "Learn More") + " →"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}