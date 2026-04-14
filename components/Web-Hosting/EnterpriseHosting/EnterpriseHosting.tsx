import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";
import Link from "next/link";

type CTA = {
  label: string;
  link: string;
  variant: "primary" | "secondary" | string;
};

type EnterpriseProps = {
  data: {
    tagline: string;
    title: string;
    description: string;
    cta: CTA[];
    image: {
      src: string;
      alt: string;
    };
  };
};

export default function EnterpriseSection({ data }: EnterpriseProps) {
  const { tagline, title, description, cta, image } = data;

  return (
    <Section padding="hero" className="text-slate-900 dark:text-slate-100">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

        {/* LEFT CONTENT */}
        <div className="space-y-6">

          {/* Tagline */}
          <HeadLineText
            as="p"
            fontSize="sm"
            fontWeight="medium"
            align="left"
            className="text-sm tracking-widest text-gray-500 dark:text-gray-400 uppercase"
          >
            {tagline}
          </HeadLineText>

          {/* Title */}
          <HeadLineText
            as="h2"
            fontSize="sixXl"
            fontWeight="bold"
            align="left"
            className="text-black dark:text-white"
          >
            {title}
          </HeadLineText>

          {/* Description */}
          <HeadLineText
            as="p"
            fontSize="md"
            fontWeight="medium"
            align="left"
            className="text-gray-600 dark:text-gray-300"
          >
            {description}
          </HeadLineText>

          {/* CTA */}
          <div className="flex items-center gap-4 pt-2">
            {cta.map((btn, i) => {
              const isPrimary = btn.variant === "primary";

              return (
                <Link key={i} href={btn.link}>
                  <span
                    className={`inline-flex items-center px-6 py-3 rounded-full font-semibold transition ${
                      isPrimary
                        ? "bg-orange-500 hover:bg-orange-600 text-white shadow-md"
                        : "border border-gray-300 dark:border-gray-700 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    {btn.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="flex justify-center lg:justify-center">
          <img
            src={image.src}
            alt={image.alt}
            className="max-w-md w-full"
          />
        </div>

      </div>
    </Section>
  );
}