
import HeadLineText from "@/components/ui/HeadLineText";
import Section from "@/components/ui/Section";

type HeroSectionProps = {
  insightsSection: {
    tagline: string;
    title: {
      main: string;
      highlight: string;
      main2: string;
    };
    description: string;
  };
};

export default function HeroSection({ insightsSection }: HeroSectionProps) {

  return (
    <>
            <Section
        id="blog-hero"
        height="lg"
        hAlign="center"
        align="center"
        className="w-full"
      >
      <div className="mx-auto max-w-5xl text-center relative">

        {/* TAGLINE */}
        <div className="mx-auto mb-8 flex items-center justify-center gap-4 sm:gap-6">
          <span className="h-px w-10 bg-orange-400 sm:w-14" />
          <HeadLineText
            as="p"
            fontSize="sm"
            fontWeight="bold"
            align="center"
            className="tracking-[0.32em] text-primary uppercase sm:text-sm"
          >
            {insightsSection.tagline}
          </HeadLineText>
          <span className="h-px w-10 bg-orange-400 sm:w-14" />
        </div>


        {/* TITLE */}
        <HeadLineText
          as="h1"
          fontSize="sixXl"
          fontWeight="bold"
          align="center"
          className="mx-auto max-w-4xl leading-[1.1] text-black dark:text-white"
        >
          {insightsSection.title.main}
          <span className="text-primary">
            {" "}
            {insightsSection.title.highlight}
          </span>
          {insightsSection.title.main2}
        </HeadLineText>

        {/* DESCRIPTION */}
        <p className="mx-auto mt-6 max-w-3xl text-lg sm:text-xl leading-relaxed text-slate-600 dark:text-slate-300">
          {insightsSection.description}
        </p>

        {/* DECORATIVE STARS */}
        <span className="absolute -left-6 top-10 text-5xl text-orange-400/70">
          ✦
        </span>
        <span className="absolute right-0 top-14 text-4xl text-orange-400/60">
          ✦
        </span>
        <span className="absolute left-4 top-52 text-3xl text-orange-400/60">
          ✦
        </span>
        <span className="absolute right-10 top-64 text-5xl text-orange-400/70">
          ✦
        </span>
      </div>
      </Section>
    </>
  );
}