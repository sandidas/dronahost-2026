import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";
import Image from "next/image";
import Link from "next/link";

type CTAProps = {
  data: {
    ctaSection: {
      tagline: string;
      title: string;
      buttons: {
        label: string;
        variant: string;
        link: string;
        icon?: string;
      }[];
      image: {
        src: string;
        alt: string;
      };
    };
  };
};

export default function CTASection({ data }: CTAProps) {
  const section = data.ctaSection;

  return (
    <Section height="screen" className="bg-gray-50 dark:bg-gray-900">
      <div className="grid lg:grid-cols-2 gap-12 items-center">

        {/* LEFT IMAGE */}
        <div className="flex justify-center lg:justify-center">
          <Image
            src="/images/home/CTA.svg"
            alt={section.image?.alt || "CTA illustration"}
            width={500}
            height={400}
            className="object-contain w-full max-w-md"
          />
        </div>

        {/* RIGHT CONTENT */}
        <div className="text-center lg:text-left">

          {/* Tagline */}
          <span className="inline-block text-xs tracking-widest text-blue-500 uppercase bg-blue-50 dark:bg-blue-900/30 px-4 py-1 rounded-full mb-4">
            {section.tagline}
          </span>

          {/* Title */}
          <HeadLineText
            as="h2"
            fontSize="fourXl"
            fontWeight="bold"
            align="left"
            className="mb-6"
          >
            {section.title}
          </HeadLineText>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4">

            {section.buttons.map((btn, index) => (
              <Link
                key={index}
                href={btn.link}
                className={
                  btn.variant === "primary"
                    ? "flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-medium transition"
                    : "flex items-center gap-2 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-full font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                }
              >
                {btn.label}

                {/* Icon (optional) */}
                {btn.icon === "arrow-right" && <span>→</span>}
              </Link>
            ))}

          </div>
        </div>
      </div>
    </Section>
  );
}