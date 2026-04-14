import ResourceCard, { ResourcePost } from "@/components/Card/ResourceCard";
import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";

type FeatureItem = {
  id: number;
  title: string;
  description: string;
  image: string;
  badge?: string;
  cta: {
    label: string;
    link: string;
  };
};

type Props = {
  data: {
    features: {
      tagline: string;
      title: string;
      items: FeatureItem[];
    };
  };
};

export default function FeatureComparisonSection({ data }: Props) {
  const { tagline, title, items } = data.features;

  return (
    <Section size="lg" padding="lg" hAlign="center" className="bg-background dark:bg-gray-900">
      {/* Heading */}
      <div className="mb-12 ">
        <HeadLineText
          as="p"
          fontSize="sm"
          fontWeight="medium"
          align="center"
          className="tracking-[0.2em] text-muted-foreground"
        >
          {tagline}
        </HeadLineText>

        <HeadLineText
          as="h2"
          fontSize="fourXl"
          fontWeight="bold"
          align="center"
          className="mt-3"
        >
          {title}
        </HeadLineText>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        {items.map((item) => {
          const post: ResourcePost = {
            category: item.badge ?? "",
            title: item.title,
            description: item.description,
            readTime: "",
            button: item.cta.label,
            image: item.image,
            href: item.cta.link,
          };

          return (
            <div key={item.id} className="relative group">
              {/* Badge (NEW) */}
              {item.badge && (
                <span className="absolute top-3 left-3 z-10 bg-black text-white text-xs px-3 py-1 rounded-md">
                  {item.badge}
                </span>
              )}

              <ResourceCard
                post={post}
                showCategory={false}
                className="transition-all duration-300"
              />
            </div>
          );
        })}
      </div>
    </Section>
  );
}