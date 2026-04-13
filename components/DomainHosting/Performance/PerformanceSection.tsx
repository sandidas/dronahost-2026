import GridCard from "@/components/Card/GridCard"; // ✅ use GridCard
import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";
import { Database, Layers, Rocket, Share2 } from "lucide-react";

type Feature = {
  id: number;
  icon: string;
  title: string;
  description: string;
};

type Props = {
  data: {
    title: string;
    description: string;
    features: Feature[];
  };
};

export default function PerformanceSection({ data }: Props) {
  // 🔹 Icon map
  const iconMap: Record<string, React.ReactNode> = {
    cdn: <Share2 className="w-6 h-6" />,
    database: <Database className="w-6 h-6" />,
    infrastructure: <Layers className="w-6 h-6" />,
    wordpress: <Rocket className="w-6 h-6" />,
  };

  return (
    <Section padding="lg" className="bg-background dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <div className="max-w-2xl">
          <HeadLineText
            as="h2"
            fontSize="fourXl"
            fontWeight="bold"
            align="left"
            className="text-foreground dark:text-white"
          >
            {data.title}
          </HeadLineText>

          <HeadLineText
            as="p"
            fontSize="md"
            fontWeight="medium"
            align="left"
            className="text-muted-foreground mt-3 dark:text-gray-400"
          >
            {data.description}
          </HeadLineText>
        </div>

        {/* Divider */}
        <div className="mt-5 w-full h-px bg-border my-10 dark:bg-white/20" />

        {/* Grid with GridCard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 dark:border-white/20 overflow-hidden">
          
          {data.features.map((item, i) => (
            <GridCard
              key={item.id}
              index={i}
              total={data.features.length}
              columns={4}
              size="md"
              align="left"
              separatorTone="soft"
            >
              {/* Icon */}
              <div className="text-foreground dark:text-white mb-2">
                {iconMap[item.icon]}
              </div>

              {/* Title */}
              <HeadLineText
                as="h4"
                fontSize="md"
                fontWeight="bold"
                align="left"
                className="text-foreground dark:text-white"
              >
                {item.title}
              </HeadLineText>

              {/* Description */}
              <HeadLineText
                as="p"
                fontSize="sm"
                fontWeight="light"
                align="left"
                className="text-muted-foreground mt-1 dark:text-gray-400"
              >
                {item.description}
              </HeadLineText>
            </GridCard>
          ))}

        </div>
      </div>
    </Section>
  );
}