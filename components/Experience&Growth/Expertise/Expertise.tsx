import GridCard from "@/components/Card/GridCard";
import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";

import {
  Activity,
  Code,
  Database,
  Layers,
  Layout,
  Search,
  Shield,
  Sparkles,
  Wrench,
} from "lucide-react";

type Item = {
  title: string;
  description: string;
  icon: string;
  badge?: string;
};

type Props = {
  data: {
  title: string;
  items: Item[];
  cta: {
    label: string;
    link: string;
  };
};
};

export default function Expertise({ data }: Props) {
  // Icon mapping
  const iconMap: Record<string, React.ReactNode> = {
    stack: <Layers className="w-6 h-6" />,
    code: <Code className="w-6 h-6" />,
    pulse: <Activity className="w-6 h-6" />,
    database: <Database className="w-6 h-6" />,
    layout: <Layout className="w-6 h-6" />,
    search: <Search className="w-6 h-6" />,
    shield: <Shield className="w-6 h-6" />,
    dev: <Wrench className="w-6 h-6" />,
    "search-advanced": <Sparkles className="w-6 h-6" />,
  };

  return (
    <Section padding="lg" className="bg-background dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">

        {/* Title */}
        <HeadLineText
          as="h2"
          fontSize="fourXl"
          fontWeight="bold"
          align="left"
          className="text-foreground dark:text-white mb-10"
        >
          {data.title}
        </HeadLineText>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 dark:border-white/20 overflow-hidden">

          {data.items.map((item, i) => (
            <GridCard
              key={i}
              index={i}
              total={data.items.length}
              columns={3}
              size="md"
              align="center"
              separatorTone="soft"
              className="gap-4"
            >
              {/* Icon */}
              <div className="text-orange-500">
                {iconMap[item.icon]}
              </div>

              {/* Title */}
              <div className="flex items-center gap-2">
                <HeadLineText
                  as="h3"
                  fontSize="md"
                  fontWeight="bold"
                  align="center"
                  className="text-foreground dark:text-white"
                >
                  {item.title}
                </HeadLineText>

                {/* Badge */}
                {item.badge && (
                  <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Description */}
              <HeadLineText
                as="p"
                fontSize="sm"
                fontWeight="light"
                align="center"
                className="text-muted-foreground leading-relaxed"
              >
                {item.description}
              </HeadLineText>

              {/* CTA */}
              <span className="text-orange-500 text-sm font-medium mt-2 hover:underline cursor-pointer">
                {data.cta.label}
              </span>
            </GridCard>
          ))}

        </div>

      </div>
    </Section>
  );
}