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

type Props = {
  data: {
    managedHostingIllustrationSection: {
      tagline: string;
      title: string;
      description: string;
      features: Feature[];
      buttons: Button[];
      illustration: {
        src: string;
        alt: string;
      };
    };
  };
};

export default function ManagedHostingIllustrationSection({ data }: Props) {
  const section = data.managedHostingIllustrationSection;

  return (
    <Section height="screen" className="bg-gray-50 dark:bg-gray-900">
      <div className="grid lg:grid-cols-2 gap-12 items-center">

        {/* LEFT CONTENT */}
        <div>

          {/* Tagline */}
          <HeadLineText
            as="p"
            fontSize="sm"
            fontWeight="medium"
            align="left"
            className="text-gray-400 uppercase mb-4"
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
          

          {/* Features */}
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

        {/* RIGHT ILLUSTRATION */}
        <div className="relative flex justify-center lg:justify-end">

          {/* Main Illustration */}
          <Image
            src={section.illustration?.src || "/images/home/pricingSection2.svg"}
            alt={section.illustration?.alt}
            width={500}
            height={400}
            className="relative object-contain w-full "
          />
        </div>
      </div>
    </Section>
  );
}