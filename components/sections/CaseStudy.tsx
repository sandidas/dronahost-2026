import HeadLineText from "@/components/ui/HeadLineText";
import Image from "@/components/ui/Image";
import Section from "@/components/ui/Section";
import Link from "next/link";

type CaseStudyProps = {
  data: {
    caseStudySection: {
      tagline: string;
      title: string;
      description: string;
      ctaPrimary: {
        label: string;
        link: string;
      };
      ctaSecondary: {
        label: string;
        link: string;
      };
      stats: {
        value: string;
        label: string;
      }[];
      image: {
        src: string;
        alt: string;
      };
    };
  };
};

export default function CaseStudy({ data }: CaseStudyProps) {
  const section = data.caseStudySection;

  return (
    <Section padding="xl" className="bg-gray-50 dark:bg-gray-900">
      <div className="grid lg:grid-cols-2 gap-12 items-center">

        {/* LEFT CONTENT */}
        <div>

          {/* Tagline */}
          <p className="text-xs tracking-widest text-indigo-500 uppercase mb-4">
            {section.tagline}
          </p>

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
          <p className="mt-6 text-gray-600 dark:text-gray-300 max-w-lg leading-relaxed">
            {section.description}
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex items-center gap-6">
            <Link
              href={section.ctaPrimary.link}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-medium transition"
            >
              {section.ctaPrimary.label}
            </Link>

            <Link
              href={section.ctaSecondary.link}
              className="flex items-center gap-2 text-gray-800 dark:text-gray-200 font-medium"
            >
              {section.ctaSecondary.label}
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Divider */}
          <div className="mt-10 border-t border-gray-300 dark:border-gray-700" />

          {/* Stats */}
          <div className="mt-6 flex gap-12">
            {section.stats.map((stat, index) => (
              <div key={index}>
                <p className="text-2xl font-bold dark:text-white">{stat.value}</p>
                <p className="text-sm text-gray-500 dark:text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative">
          <Image
            src={section.image.src}
            alt={section.image.alt}
            width={600}
            height={400}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover w-full h-auto"
            skeleton={true}
          />
        </div>
      </div>

      {/* SLIDER CONTROLS */}
      <div className="mt-12 flex justify-center gap-4">
        <button
          aria-label="Previous case study"
          className="w-10 h-10 rounded-full border border-orange-400 text-orange-500 flex items-center justify-center hover:bg-orange-50 dark:hover:bg-white/10 transition"
        >
          <span aria-hidden="true">←</span>
        </button>
        <button
          aria-label="Next case study"
          className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition"
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </Section>
  );
}
