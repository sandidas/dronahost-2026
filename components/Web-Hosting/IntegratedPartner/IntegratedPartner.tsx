import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";
import Link from "next/link";

type Props = {
  data: {
    partners: {
      tagline: string;
      title: string;
      description: string;
      logos: string[];
    };
    ctaBanner: {
      title: string;
      cta: {
        label: string;
        link: string;
      };
    };
  };
};

export default function IntegratedPartner({ data }: Props) {
  const { partners, ctaBanner } = data;

  return (
    <Section padding="lg" hAlign="center" className="bg-background dark:bg-gray-900" >
      {/* Header */}
      <div className="max-w-full ">
        <HeadLineText
          as="p"
          fontSize="sm"
          fontWeight="medium"
          align="center"
          className="tracking-[0.2em] text-muted-foreground"
        >
          {partners.tagline}
        </HeadLineText>

        <HeadLineText
          as="h2"
          fontSize="fourXl"
          fontWeight="bold"
          align="center"
          className="mt-3"
        >
          {partners.title}
        </HeadLineText>

        <HeadLineText
          as="p"
          fontSize="md"
          fontWeight="medium"
          align="center"
          className="max-w-3xl mx-auto mt-4 text-muted-foreground"
        >
          {partners.description}
        </HeadLineText>
      </div>

      {/* Logos */}
      <div className="flex flex-wrap justify-center items-center gap-20 mt-10 mb-10">
        {partners.logos.map((logo, i) => (
          <img
            key={i}
            src={logo}
            alt={`partner-${i}`}
            className="h-8 md:h-10 object-contain opacity-80 hover:opacity-100 transition"
          />
        ))}
      </div>

      {/* CTA Banner */}
      <div className="w-full max-w-full rounded-2xl border border-orange-200 bg-orange-50 px-6 py-8 md:px-10 md:py-10 flex flex-col md:flex-row items-center justify-between gap-6 dark:border-orange-900/40 dark:bg-slate-800/80">
        <h3 className="text-xl md:text-2xl font-semibold text-center text-slate-900 md:text-left dark:text-slate-100">
          {ctaBanner.title}
        </h3>

        <Link
          href={ctaBanner.cta.link}
          className="rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground shadow-md transition hover:bg-primary/90"
        >
          {ctaBanner.cta.label}
        </Link>
      </div>
    </Section>
  );
}