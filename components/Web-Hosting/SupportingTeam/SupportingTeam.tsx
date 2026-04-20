import Card from "@/components/ui/Card";
import HeadLineText from "@/components/ui/HeadLineText";
import Section from "@/components/ui/Section";

import { BookOpen, Building2, Newspaper } from "lucide-react";

type Item = {
  title: string;
  description: string;
  icon: "news" | "company" | "magazine" | string;
};

type SupportingTeamProps = {
  data: {
    tagline: string;
    title: string;
    items: Item[];
  };
};

export default function SupportingTeam({ data }: SupportingTeamProps) {
  const { tagline, title, items } = data;

  const getIcon = (icon: Item["icon"]) => {
    const base = "w-6 h-6 text-primary";

    switch (icon) {
      case "news":
        return <Newspaper className={base} />;
      case "company":
        return <Building2 className={base} />;
      case "magazine":
        return <BookOpen className={base} />;
      default:
        return null;
    }
  };

  return (
    <Section padding="lg" className="text-slate-900 dark:text-slate-100">
      <div className="max-w-7xl mx-auto space-y-16">

        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
        <HeadLineText
            as="p"
            fontSize="sm"
            fontWeight="medium"
            align="center"
            className="text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400"
          >
            {tagline}
          </HeadLineText>

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
            <Card variant="grid"
              key={index}
              index={index}
              total={items.length}
              columns={3}
              size="lg"
              separatorTone="soft"
            >
              {/* Icon */}
              <div className="mb-4">
                {getIcon(item.icon)}
              </div>

              {/* Title */}
              <HeadLineText
                as="h3"
                fontSize="md"
                fontWeight="bold"
                align="left"
                className="text-black dark:text-white leading-snug mb-4"
              >
                {item.title}
              </HeadLineText>

              {/* Description */}
              <HeadLineText
                as="p"
                fontSize="sm"
                fontWeight="medium"
                align="left"
                className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6"
              >
                {item.description}
              </HeadLineText>
            </Card>
          ))}
        </div>

      </div>
    </Section>
  );
}
