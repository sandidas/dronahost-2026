import GridCard from "@/components/Card/GridCard";
import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";

import {
    Activity,
    Code,
    Database,
    Layers,
    LayoutTemplate,
    Search,
    ShieldCheck,
    Wrench,
} from "lucide-react";

type Feature = {
  title: string;
  description: string;
  icon: string;
  cta: string;
  badge?: string;
};

type Props = {
  data: {
    tagline: string;
    title: string;
    items: Feature[];
  };
};

export default function TechStack({ data }: Props) {
  const { tagline, title, items } = data;

  const getIcon = (icon: string) => {
    const base = "w-6 h-6 text-orange-500";

    switch (icon) {
      case "stack":
        return <Layers className={base} />;
      case "code":
        return <Code className={base} />;
      case "pulse":
        return <Activity className={base} />;
      case "database":
        return <Database className={base} />;
      case "layout":
        return <LayoutTemplate className={base} />;
      case "search":
        return <Search className={base} />;
      case "shield":
        return <ShieldCheck className={base} />;
      case "dev":
        return <Wrench className={base} />;
      case "search-advanced":
        return <Search className={base} />;
      default:
        return null;
    }
  };

  return (
    <Section padding="lg" className="bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto space-y-16">

        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">
            {tagline}
          </p>

          <HeadLineText
            as="h2"
            fontSize="fiveXl"
            fontWeight="bold"
            align="center"
            className="text-black dark:text-white"
          >
            {title}
          </HeadLineText>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <GridCard
              key={index}
              index={index}
              total={items.length}
              columns={3}
              size="lg"
              align="center"
              separatorTone="default"
            >
              {/* Badge */}
              {item.badge && (
                <span className="absolute top-4 right-4 text-[10px] px-2 py-1 rounded-full bg-blue-500 text-white">
                  {item.badge}
                </span>
              )}

              {/* Icon */}
              <div className="mb-3">
                {getIcon(item.icon)}
              </div>

              {/* Title */}
              <HeadLineText
                as="h3"
                fontSize="md"
                fontWeight="bold"
                align="center"
                className="text-black dark:text-white mb-2"
              >
                {item.title}
              </HeadLineText>
              {/* Description */}
              <HeadLineText
                as="p"
                fontSize="sm"
                fontWeight="medium"
                align="center"
                className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4"
              >
                {item.description}
              </HeadLineText>


              {/* CTA */}
              <HeadLineText
                as="span"
                fontSize="sm"
                fontWeight="medium"
                align="center"
                className="text-orange-500 font-medium"
              >
                {item.cta}
              </HeadLineText>
            </GridCard>
          ))}
        </div>

      </div>
    </Section>
  );
}
