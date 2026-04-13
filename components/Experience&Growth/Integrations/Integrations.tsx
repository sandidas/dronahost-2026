import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";
import Image from "next/image";

type Tool = {
  icon: string;
  name: string;
};

type Props = {
  data: {
    tagline: string;
    title: string;
    description: string;
    tools: Tool[];
  };
};

export default function Integration({ data }: Props) {
  return (
    <Section padding="lg" className="bg-background dark:bg-gray-900">
      <div className="max-w-5xl mx-auto text-center">

        {/* Tagline */}
        <HeadLineText
          as="p"
          fontSize="sm"
          fontWeight="medium"
          align="center"
          className="text-orange-500 uppercase tracking-[0.2em] mb-4"
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
          className="text-muted-foreground mt-4 max-w-2xl mx-auto leading-relaxed"
        >
          {data.description}
        </HeadLineText>

        {/*  Tools Grid */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">

          {data.tools.map((tool, i) => (
            <div
              key={i}
              className="
                flex items-center gap-3 px-5 py-3
                rounded-full
                bg-gray-100 dark:bg-gray-800
                border border-black/5 dark:border-white/10
                hover:shadow-md hover:scale-[1.03]
                transition-all duration-300
                justify-center
              "
            >
              {/* Icon */}
              <Image
                src={`/${tool.icon}`}
                alt={tool.name}
                width={28}
                height={28}
                className="object-contain"
              />

              {/* Name */}
              <span className="text-sm font-medium text-foreground dark:text-white">
                {tool.name}
              </span>
            </div>
          ))}
        </div>

      </div>
    </Section>
  );
}