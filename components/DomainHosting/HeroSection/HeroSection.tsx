import GradientBackground from "@/components/gradient/gradient";
import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";

type HeroProps = {
  data: {
    tagline: string;
    title: string;
    features: string[];
    pricing: {
      price: string;
      duration: string;
      note: string;
    };
    cta: {
      label: string;
      link: string;
    };
    guarantee: string;
    reviews: {
      rating: string;
      stars: number;
      count: string;
      platform: string;
      recommendedBy: string;
    };
    image: {
      src: string;
      alt: string;
    };
  };
};

export default function HeroSection({ data }: HeroProps) {
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
        height="screen"
        bgImage={data.image.src}
        bgImagePosition="bottom right"
        bgImageSize="50%"
        bgImageBreakpoint="lg"
      >
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          
          {/* LEFT CONTENT */}
          <div className="space-y-6 max-w-xl">
            
            {/* Tagline */}
            <p className="text-primary font-medium text-sm">
              {data.tagline}
            </p>

            {/* Title */}
            <HeadLineText
              as="h1"
              fontSize="sixXl"
              fontWeight="bold"
              align="left"
              className="text-gray-900 leading-tight dark:text-gray-100"
            >
              {data.title}
            </HeadLineText>

            {/* Features */}
            <div className="space-y-3">
              {data.features.map((feature, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400"
                >
                  <span className="text-green-500">✔</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* Pricing */}
            <div>
              <p className="text-gray-500 text-sm">From</p>

              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {data.pricing.price}
                </span>
                <span className="text-gray-500">
                  {data.pricing.duration}
                </span>
              </div>

              <p className="text-gray-500 text-sm">
                {data.pricing.note}
              </p>
            </div>

            {/* CTA + Guarantee */}
            <div className="flex flex-wrap items-center gap-6">
              <a
                href={data.cta.link}
                className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-medium shadow-md transition"
              >
                {data.cta.label}
              </a>

              <div className="flex items-center gap-2 text-gray-500 text-sm dark:text-gray-400">
                <span>🛡️</span>
                <span>{data.guarantee}</span>
              </div>
            </div>

            {/*  Reviews Section */}
            <div className="flex flex-wrap items-center gap-4 pt-4 text-sm text-gray-600 dark:text-gray-400">
              
              {/* Rating + Stars */}
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {data.reviews.rating}
                </span>

                <div className="flex items-center gap-1 text-green-500">
                  {Array.from({ length: data.reviews.stars }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>

                <span>
                  {data.reviews.count} reviews on{" "}
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {data.reviews.platform}
                  </span>
                </span>
              </div>

              {/* Divider */}
              <div className="hidden sm:block w-px h-5 bg-gray-300 dark:bg-gray-700" />

              {/* Recommendation */}
              <div className="flex items-center gap-2">
                <span>🌐</span>
                <span>{data.reviews.recommendedBy}</span>
              </div>

            </div>

          </div>
        </div>
      </Section>
    </GradientBackground>
  );
}