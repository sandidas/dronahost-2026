import GradientBackground from "@/components/gradient/gradient";
import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";
import Link from "next/link";
type CTA = {
  label: string;
  link: string;
  variant: "primary" | "secondary" | string;
};

type FloatingCard = {
  title: string;
  description: string;
  position: "top-right" | "middle-left" | "bottom-left" | string;
};

type HeroProps = {
  data: {
    title: string;
    description: string;
    background: {
      src: string;
      alt: string;
    };
    cta: CTA[];
    socialProof: {
      members: string;
      avatars: string[];
    };
    floatingCards: FloatingCard[];
    image: {
      src: string;
      alt: string;
    };
  };
};

export default function HeroSection({ data }: HeroProps) {
  const {
    title,
    description,
    cta,
    socialProof,
  } = data;

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
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        
        {/* LEFT CONTENT */}
        <div className="space-y-6">
          <HeadLineText
            as="h1"
            fontSize="sixXl"
            fontWeight="bold"
            align="left"
            className="text-black dark:text-white"
          >
            {title}
          </HeadLineText>
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
          <div className="flex items-center gap-4">
            {cta.map((btn, i) => (
              <Link key={i} href={btn.link}>
                <button
                  className={`px-6 py-3 rounded-full font-semibold transition ${
                    btn.variant === "primary"
                      ? "bg-orange-500 hover:bg-orange-600 text-white shadow-md"
                      : "bg-gray-200 dark:bg-gray-800 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  {btn.label}
                </button>
              </Link>
            ))}
          </div>

          {/* Social Proof */}
          <div className="flex items-center gap-4 pt-4">
            <div className="flex -space-x-2">
              {socialProof.avatars.map((avatar, i) => (
                <img
                  key={i}
                  src={avatar}
                  alt="avatar"
                  className="w-10 h-10 rounded-full border-2 border-white dark:border-black"
                />
              ))}
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {socialProof.members}
            </span>
          </div>
        </div>
      </div>
    </Section>
    </GradientBackground>
  );
}