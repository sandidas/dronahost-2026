import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";
import Image from "next/image";
import Link from "next/link";

type Feature = {
  text: string;
  icon: string;
};

type Button = {
  label: string;
  variant: string;
  link: string;
};

type PricingProps = {
  data: {
    managedHostingSection: {
      tagline: string;
      title: string;
      description: string;
      features: Feature[];
      buttons: Button[];
      image: {
        src: string;
        alt: string;
      };
    };
  };
};

export default function PricingSection({ data }: PricingProps) {
  const section = data.managedHostingSection;

  return (
    <Section height="screen" className="bg-gray-50 dark:bg-gray-900">
      <div className="grid lg:grid-cols-2 gap-12 items-center">

        {/* LEFT IMAGE */}
        <div className="relative flex justify-center lg:justify-center">
          <Image
            src={section.image?.src || "/images/home/pricingSection1.png"}
            alt={section.image?.alt}
            width={500}
            height={400}
            className="object-contain w-full max-w-md"
          />

          {/* Optional overlay decoration */}
          <div className="absolute top-4 right-10 w-6 h-6 bg-orange-400 rounded-full blur-xl opacity-60" />
        </div>

        {/* RIGHT CONTENT */}
        <div>

          {/* Tagline */}
          <HeadLineText
            as="p"
            fontSize="sm"
            fontWeight="medium"
            align="left"
          >
            {section.tagline}
          </HeadLineText>

          {/* Title */}
          <HeadLineText
            as="h2"
            fontSize="fourXl"
            fontWeight="bold"
            align="left"
            className="max-w-xl"
          >
            {section.title}
          </HeadLineText>

          {/* Description */}
          <HeadLineText
            as="p"
            fontSize="sm"
            fontWeight="medium"
            align="left"
            className="mt-6 text-gray-600 dark:text-gray-300 max-w-lg leading-relaxed"
          >
            {section.description}
          </HeadLineText>
          

          {/* Features List */}
          <ul className="mt-6 space-y-4">
            {section.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                
                {/* Check Icon */}
                <span className="mt-1 w-5 h-5 flex items-center justify-center rounded-full bg-green-100 text-green-600 text-xs">
                  ✓
                </span>

                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  {feature.text}
                </p>
              </li>
            ))}
          </ul>

          {/* Buttons */}
          <div className="mt-8 flex flex-wrap gap-4">
            {section.buttons.map((btn, index) => (
              <Link
                key={index}
                href={btn.link}
                className={
                  btn.variant === "primary"
                    ? "bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-medium transition"
                    : "border border-gray-400 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-full font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                }
              >
                {btn.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}