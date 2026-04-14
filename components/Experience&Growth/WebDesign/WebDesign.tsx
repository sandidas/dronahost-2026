import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";
import Link from "next/link";

type SidebarItem = {
  label: string;
  link: string;
  active?: boolean;
};

type Feature = {
  id: number;
  title: string;
  description: string;
};

type WebDesignProps = {
  data: {
    sidebar: {
      title: string;
      items: SidebarItem[];
    };
    content: {
      title: string;
      description: string;
      featuresTitle: string;
      features: Feature[];
      cta: {
        label: string;
        link: string;
      };
    };
  };
};

export default function WebDesign({ data }: WebDesignProps) {
  const { sidebar, content } = data;

  return (
    <Section padding="lg" className="bg-background dark:bg-gray-900">
      <div className="max-w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* 🔹 LEFT SIDEBAR */}
        <div className="space-y-6 border-r border-border pr-6">

          <HeadLineText
            as="h2"
            fontSize="fiveXl"
            fontWeight="bold"
            align="left"
            className="leading-tight "
          >
            {sidebar.title}
          </HeadLineText>

          <div className="flex flex-col gap-3 mt-6">
            {sidebar.items.map((item, i) => (
              <Link key={i} href={item.link}>
                <span
                  className={`inline-flex w-fit items-center text-sm font-medium px-4 py-2 rounded-lg transition ${
                    item.active
                      ? "bg-primary text-white shadow"
                      : "text-muted-foreground hover:text-black dark:hover:text-white"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* 🔹 RIGHT CONTENT */}
        <div className="space-y-8">

          {/* Title */}
          <div className="space-y-3">
            <HeadLineText
              as="h3"
              fontSize="threeXl"
              fontWeight="bold"
              align="left"
            >
              {content.title}
            </HeadLineText>

            <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
              {content.description}
            </p>
          </div>

          {/* Divider */}
          <div className="border-b border-border" />

          {/* Features */}
          <div className="space-y-6">
            <HeadLineText
              as="h4"
              fontSize="md"
              fontWeight="bold"
              align="left"
            >
              {content.featuresTitle}
            </HeadLineText>

            <div className="space-y-6">
              {content.features.map((feature) => (
                <div key={feature.id} className="flex gap-4">

                  {/* Number */}
                  <div className="text-sm font-semibold text-muted-foreground ">
                    {feature.id}.
                  </div>

                  {/* Content */}
                  <div>
                    <h5 className="text-sm font-semibold text-foreground">
                      {feature.title}
                    </h5>
                    <p className="text-sm text-muted-foreground mt-1 max-w-xl leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="pt-2">
            <Link href={content.cta.link}>
              <button className="bg-primary hover:opacity-90 transition text-white font-semibold px-6 py-3 rounded-lg shadow">
                {content.cta.label}
              </button>
            </Link>
          </div>

        </div>
      </div>
    </Section>
  );
}