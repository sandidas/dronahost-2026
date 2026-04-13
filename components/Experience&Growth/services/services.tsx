import ResourceBox from "@/components/Card/ResourceBox";
import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";

type Item = {
  icon?: string;
  title: string;
  description: string;
  tech: string[];
  bgColor?: string;
};

type Props = {
  data: {
    tagline: string;
    title: string;
    items: Item[];
  };
};

export default function Services({ data }: Props) {
  return (
    <Section padding="lg" className="bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">

        {/* Tagline */}
        <HeadLineText
          as="p"
          fontSize="sm"
          fontWeight="medium"
          align="left"
          className="text-primary uppercase tracking-widest mb-5"
        >
          {data.tagline}
        </HeadLineText>

        {/* Title */}
        <HeadLineText
          as="h2"
          fontSize="fourXl"
          fontWeight="bold"
          align="left"
          className="text-foreground dark:text-white mb-10 max-w-2xl"
        >
          {data.title}
        </HeadLineText>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.items.map((item, i) => (
          <ResourceBox
          key={i}
          icon={item.icon}
          title={item.title}
          description={item.description}
          tech={item.tech}
          bgColor={item.bgColor}
        />
      ))}
        </div>
      </div>
    </Section>
  );
}