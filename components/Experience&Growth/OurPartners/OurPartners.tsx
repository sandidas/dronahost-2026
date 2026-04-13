import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";
import Image from "next/image";

type Props = {
  data: {
    title: string;
    description: string;
    logos: string[];
    tagline: string;
  };
};

export default function OurPartners({ data }: Props) {
  return (
    <Section padding="lg" className="bg-white dark:bg-gray-900">
      <div className="max-w-5xl mx-auto text-center">

        {/* Tagline */}
        <HeadLineText
          as="p"
          fontSize="sm"
          fontWeight="medium"
          align="center"
          className="uppercase tracking-widest mb-4"
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
          fontSize="md"
          fontWeight="medium"
          align="center"
          className="text-muted-foreground mt-4 max-w-2xl mx-auto"
        >
          {data.description}
        </HeadLineText>

        {/* Logos */}
        <div className="flex flex-wrap items-center justify-center gap-12 mt-12">
          {data.logos.map((logo, i) => (
            <div
              key={i}
              className="relative h-8 w-auto opacity-80 hover:opacity-100 transition"
            >
              <Image
                src={`/${logo}`}
                alt="partner logo"
                width={50}
                height={50}
                style={{ width: "auto", height: "32px" }}
                className="object-contain hover:grayscale-0 transition"
              />
            </div>
          ))}
        </div>

      </div>
    </Section>
  );
}