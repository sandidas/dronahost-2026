import GridCard from "@/components/Card/GridCard";
import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";
import Image from "next/image";

type CountryExtensionsProps = {
  data: {
    title: string;
    description: string;
    extensions: {
      country: string;
      flag: string;
      tld: string;
      price: string;
    }[];
  };
};

export default function CountryExtension({
  data,
}: CountryExtensionsProps) {
  return (
    <Section
      padding="lg"
      className="bg-background dark:bg-gray-900"
      hAlign="center"
    >
      <div className="max-w-5xl mx-auto text-center">

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
          fontWeight="medium"
          align="center"
          className="text-muted-foreground mt-4 max-w-2xl mx-auto"
        >
          {data.description}
        </HeadLineText>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 mt-10 border border-border rounded-2xl overflow-hidden">
          
          {data.extensions.map((item, i) => (
            <GridCard
              key={i}
              index={i}
              total={data.extensions.length}
              columns={6}
              align="center"
              size="sm"
            >
              {/* Flag */}
              <div className="w-10 h-10 relative mb-2">
                <Image
                  src={`/${item.flag}`}
                  alt={item.country}
                  fill
                  className="object-contain"
                />
              </div>

              {/* TLD */}
              <HeadLineText
                as="p"
                fontSize="md"
                fontWeight="medium"
                align="center"
                className="text-foreground dark:text-white"
              >
                {item.tld}
              </HeadLineText>

              {/* Price */}
              <HeadLineText
                as="p"
                fontSize="sm"
                fontWeight="medium"
                align="center"
                className="text-muted-foreground/90"
              >
                {item.price}
              </HeadLineText>
            </GridCard>
          ))}

        </div>

      </div>
    </Section>
  );
}