import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";
import Image from "next/image";

type Client = {
  name: string;
  image: string;
};

type Props = {
  data: {
    tagline: string;
    title: string;
    description: string;
    logos: Client[];
  };
};

export default function HappyClients({ data }: Props) {
  return (
    <Section padding="lg" className="bg-background dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">

        {/* Tagline */}
        <HeadLineText
          as="p"
          fontSize="sm"
          fontWeight="medium"
          align="left"
          className="text-orange-500 uppercase tracking-[0.2em] mb-4"
        >
          {data.tagline}
        </HeadLineText>

        {/* Title */}
        <HeadLineText
          as="h2"
          fontSize="fourXl"
          fontWeight="bold"
          align="left"
          className="text-foreground dark:text-white"
        >
          {data.title}
        </HeadLineText>

        {/* Description */}
        <HeadLineText
          as="p"
          fontSize="md"
          fontWeight="medium"
          align="left"
          className="text-muted-foreground mt-4 max-w-3xl leading-relaxed"
        >
          {data.description}
        </HeadLineText>

        {/*  Logo Grid */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 border border-border dark:border-white/10">

          {data.logos.map((client, i) => (
            <div
              key={i}
              className="
                flex items-center justify-center
                p-10
                border-r border-b border-border dark:border-white/10
                last:border-r-0
                
              "
            >
              <Image
                src={client.image}
                alt={client.name}
                width={120}
                height={60}
                className="object-contain opacity-80 hover:opacity-100 transition"
              />
            </div>
          ))}

        </div>

      </div>
    </Section>
  );
}