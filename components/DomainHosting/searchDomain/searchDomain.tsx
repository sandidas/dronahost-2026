import GradientBackground from "@/components/gradient/gradient";
import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";

type DomainSearchProps = {
  data: {
    tagline: string;
    title: string;
    description: string;
    searchBox: {
      placeholder: string;
      button: {
        label: string;
        action: string;
      };
      tldSelector: {
        default: string;
        options: string[];
      };
    };
    pricing: {
      tld: string;
      price: string;
      originalPrice?: string;
      highlight?: boolean;
    }[];
  };
};

export default function SearchDomain({ data }: DomainSearchProps) {
  return (
    <Section padding="lg" className="bg-background dark:bg-gray-900">
      
      {/*  CENTER CONTAINER (makes it thinner from sides) */}
      <div className="max-w-6xl mx-auto">
        
        <GradientBackground
          gradient="custom"
          customGradient="
            from-orange-100/70 via-background to-sky-100/70
            dark:from-slate-900 dark:via-slate-900 dark:to-slate-800
          "
          blobs={[
            {
              color: "orange",
              size: "lg",
              effect: "float",
              position: "top-left",
              opacity: 35,
              blur: "xl",
            },
            {
              color: "blue",
              size: "lg",
              effect: "drift",
              position: "bottom-right",
              opacity: 35,
              blur: "xl",
            },
          ]}
          variant="none"
          className="rounded-[40px] border border-border/70 bg-card/85 shadow-[0_12px_40px_rgba(15,23,42,0.12)] dark:bg-card/75 dark:shadow-[0_18px_48px_rgba(2,6,23,0.45)]"
          contentClassName="px-6 sm:px-10 md:px-16 py-16 sm:py-20 text-center"
        >
          <div className="flex flex-col items-center gap-6 max-w-3xl mx-auto">

            {/* Tagline */}
            <HeadLineText
              as="p"
              fontSize="sm"
              fontWeight="medium"
              align="center"
              className="tracking-[0.24em] text-muted-foreground/90 uppercase"
            >
              {data.tagline}
            </HeadLineText>

            {/* Title */}
            <HeadLineText
              as="h2"
              fontSize="fourXl"
              fontWeight="bold"
              align="center"
              className="text-foreground dark:text-white"
            >
              {data.title}
            </HeadLineText>

            {/* Description */}
            <HeadLineText
              as="p"
              fontSize="sm"
              fontWeight="light"
              align="center"
              className="text-muted-foreground max-w-2xl leading-relaxed"
            >
              {data.description}
            </HeadLineText>

            {/* Search Box */}
            <div className="w-full flex flex-col sm:flex-row items-center gap-3 mt-4">

              <div className="flex w-full bg-background/95 dark:bg-background/70 border border-border rounded-xl overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-primary/30">
                
                {/* Input */}
                <input
                  type="text"
                  placeholder={data.searchBox.placeholder}
                  className="flex-1 px-4 py-3 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                />

                {/* TLD Selector */}
                <select className="px-3 border-l border-border bg-transparent text-foreground outline-none dark:bg-background/70">
                  {data.searchBox.tldSelector.options.map((opt, i) => (
                    <option key={i} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Button */}
              <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl font-medium shadow-md whitespace-nowrap transition">
                {data.searchBox.button.label}
              </button>
            </div>

            {/* Pricing Row */}
            <div className="flex flex-wrap justify-center gap-6 mt-6">
              {data.pricing.map((item, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 ${
                    item.highlight
                      ? "text-primary font-semibold"
                      : "text-muted-foreground"
                  }`}
                >
                  <span className="text-lg">{item.tld}</span>

                  {item.originalPrice && (
                    <span className="line-through text-xs opacity-60">
                      {item.originalPrice}
                    </span>
                  )}

                  <span className="text-sm font-medium">
                    {item.price}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </GradientBackground>
      </div>
    </Section>
  );
}