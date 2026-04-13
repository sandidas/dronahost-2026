import GridCard from "@/components/Card/GridCard";
import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";

type MostPopularItem = {
  Heading?: string;
  tld?: string;
  price?: string;
  originalPrice?: string;
  discount?: string;
  highlight?: boolean;
};

type CountryDomainItem = {
  Heading?: string;
  tld?: string;
  price?: string;
};

type DomainExtensionProps = {
  data: {
    title: string;
    mostPopular: MostPopularItem[];
    countryDomains: CountryDomainItem[];
    cta: {
      label: string;
      action: string;
    };
    note: string;
  };
};

export default function DomainExtension({ data }: DomainExtensionProps) {
  // Extract headings safely
  const  mostPopularHeading =
    data.mostPopular.find((item) => item.Heading)?.Heading ||
    "Most Popular";

  const countryHeading =
    data.countryDomains.find((item) => item.Heading)?.Heading ||
    "Country Domains";

  //  Filter valid items
  const mostPopularItems = data.mostPopular.filter((item) => item.tld);
  const countryItems = data.countryDomains.filter((item) => item.tld);

  return (
    <Section padding="lg" className="bg-background dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">

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

        {/* ---------------- MOST POPULAR ---------------- */}
        <div className="mt-10">
        <HeadLineText
          as="h3"
          fontSize="md"
          fontWeight="bold"
          align="left"
          className="text-foreground mb-2 dark:text-white"
        >
        {mostPopularHeading}
        </HeadLineText>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 border border-border dark:border-white/20 rounded-2xl overflow-hidden">
            {mostPopularItems.map((item, i) => (
              <GridCard
                key={i}
                index={i}
                total={mostPopularItems.length}
                columns={3}
                size="sm"
                separatorTone="soft"
              >
                <div className="flex flex-col gap-2">

                  {/* Top Row */}
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground dark:text-white">
                      {item.tld}
                    </span>

                    {item.discount && (
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded">
                        {item.discount}
                      </span>
                    )}
                  </div>

                  {/* Pricing */}
                  <div className="flex items-center gap-2 text-sm">
                    {item.originalPrice && (
                      <span className="line-through text-muted-foreground">
                        {item.originalPrice}
                      </span>
                    )}
                    <span className="font-medium text-foreground dark:text-white">
                      {item.price}
                    </span>
                  </div>

                </div>
              </GridCard>
            ))}
          </div>
        </div>

        {/* ---------------- COUNTRY DOMAINS ---------------- */}
        <div className="mt-10">
            <HeadLineText
              as="h3"
              fontSize="md"
              fontWeight="bold"
              align="left"
              className="text-foreground dark:text-white mb-2"
            >
              {countryHeading}
            </HeadLineText>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border border-border rounded-2xl overflow-hidden dark:border-gray-700">
            {countryItems.map((item, i) => (
              <GridCard
                key={i}
                index={i}
                total={countryItems.length}
                columns={3}
                size="sm"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-foreground font-medium dark:text-white">
                    {item.tld}
                  </span>
                  <span className="text-sm text-muted-foreground dark:text-gray-400">
                    {item.price}
                  </span>
                </div>
              </GridCard>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-6">
          <button className="text-orange-500 text-sm font-medium hover:underline">
            {data.cta.label} ↓
          </button>
        </div>

        {/* Note */}
        <HeadLineText
          as="p"
          fontSize="sm"
          fontWeight="medium"
          align="center"
          className="text-muted-foreground mt-6 max-w-3xl"
        >
          {data.note}
        </HeadLineText>

      </div>
    </Section>
  );
}
