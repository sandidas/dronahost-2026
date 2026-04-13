import GradientBackground from "@/components/gradient/gradient";
import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";
type Props = {
  data: {
    tagline: string;
    title: string;
    description: string;
    cta: {
      label: string;
      link: string;
      variant: "primary" | "secondary" | string;
    }[];
    image: {
      src: string;
      alt: string;
    };
  };
};

export default function HeroSection({ data }: Props) {
  return (
    <GradientBackground
      gradient="custom"
      blobs={[
        {
          color: "orange",
          size: "lg",
          position: "top-left",
          opacity: 20,
          blur: "xl",
        },
        {
          color: "orange",
          size: "lg",
          position: "bottom-right",
          opacity: 25,
          blur: "xl",
        },
      ]}
      className="bg-white dark:bg-gray-900"
    >
    <Section
      size="lg"
      bgImage={data.image.src}
      bgImagePosition="bottom right"
      bgImageSize="50%"
      bgImageBreakpoint="lg"
    >
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 items-center">

        {/* LEFT CONTENT */}
        <div className="space-y-6 max-w-full lg:max-w-lg">

          {/* Tagline */}
          <HeadLineText
            as="p"
            fontSize="sm"
            fontWeight="medium"
            align="left"
            className="text-primary uppercase tracking-widest"
          >
            {data.tagline}
          </HeadLineText>

          {/* Title */}
          <HeadLineText
            as="h1"
            fontSize="sixXl"
            fontWeight="bold"
            align="left"
            className="text-foreground dark:text-white "
          >
            {data.title}
          </HeadLineText>

          {/* Description */}
          <HeadLineText
            as="p"
            fontSize="sm"
            fontWeight="medium"
            align="left"
            className="text-muted-foreground leading-relaxed"
          >
            {data.description}
          </HeadLineText>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 pt-2">
            {data.cta.map((btn, i) => (
              <a
                key={i}
                href={btn.link}
                className={`px-6 py-3 rounded-xl text-sm font-medium transition ${
                  btn.variant === "primary"
                    ? "bg-orange-500 hover:bg-orange-600 text-white shadow-md"
                    : "border border-border dark:border-white/20 text-foreground dark:text-white hover:bg-muted/50"
                }`}
              >
                {btn.label}
              </a>
            ))}
          </div>

        </div>

        {/* RIGHT SIDE EMPTY (image is background) */}
        <div />
      </div>
    </Section>
    </GradientBackground>
  );
}