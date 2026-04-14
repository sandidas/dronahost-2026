import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";
import { Check } from "lucide-react";
import Link from "next/link";

type Value = {
  type: "text" | "check" | "none" | string;
  value?: string;
};

type Row = {
  label: string;
  values: Value[];
};

type SectionType = {
  title: string;
  collapsed: boolean;
  rows: Row[];
};

type Tier = {
  name: string;
  subtitle: string;
  highlight?: boolean;
  color: string;
};

type Props = {
  data: {
    tagline: string;
    title: string;
    tiers: Tier[];
    benefits: {
      sections: SectionType[];
    };
    note: string;
    cta: {
      label: string;
      link: string;
    };
  };
};

export default function PartnerProgram({ data }: Props) {
  const { tagline, title, tiers, benefits, note, cta } = data;

  return (
    <Section padding="lg" className="bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* Header */}
        <div className="space-y-4 max-w-2xl">
          <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">
            {tagline}
          </p>

          <HeadLineText
            as="h2"
            fontSize="fiveXl"
            fontWeight="bold"
            align="left"
            className="text-black dark:text-white"
          >
            {title}
          </HeadLineText>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <div className="min-w-225">

            {/* Tier Header */}
            <div className="grid grid-cols-5 border-b border-gray-200 dark:border-gray-800">
              <div />

              {tiers.map((tier, i) => (
                <div
                  key={i}
                  className="text-center py-6 border-l border-gray-200 dark:border-gray-800 relative"
                >
                  {/* Top Color Line */}
                  <div
                    className="absolute top-0 left-0 right-0 h-0.5"
                    style={{ backgroundColor: tier.color }}
                  />
                <HeadLineText
                    as="p"
                    fontSize="sm"
                    fontWeight="bold"
                    align="center"
                    className="text-black dark:text-white"
                  >
                    {tier.name}
                  </HeadLineText>
                  <HeadLineText
                    as="p"
                    fontSize="sm"
                    fontWeight="medium"
                    align="center"
                    className="text-gray-500 mt-1"
                  >
                    {tier.subtitle}
                  </HeadLineText>
                </div>
              ))}
            </div>

            {/* Sections */}
            {benefits.sections.map((section, sIndex) => (
              <div key={sIndex} className="mt-6">

                {/* Section Header */}
                <div className="bg-gray-100 dark:bg-gray-800 rounded-md px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  {section.collapsed ? "+" : "-"} {section.title}
                </div>

                {/* Rows */}
                {!section.collapsed && (
                  <div className="divide-y divide-gray-200 dark:divide-gray-800">
                    {section.rows.map((row, rIndex) => (
                      <div
                        key={rIndex}
                        className="grid grid-cols-5 py-5"
                      >
                        {/* Label */}
                        <div className="text-sm text-gray-600 dark:text-gray-400 pr-6">
                          {row.label}
                        </div>

                        {/* Values */}
                        {row.values.map((val, vIndex) => (
                          <div
                            key={vIndex}
                            className="text-center text-sm text-gray-700 dark:text-gray-300 border-l border-gray-200 dark:border-gray-800 flex items-center justify-center px-2"
                          >
                            {val.type === "check" && (
                              <Check className="w-4 h-4 text-green-500" />
                            )}

                            {val.type === "text" && val.value}

                            {val.type === "none" && (
                              <span className="text-gray-300">—</span>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

          </div>
        </div>

        {/* Note */}
        <p className="text-xs text-gray-400 text-center">
          {note}
        </p>

        {/* CTA */}
        <div className="flex justify-center">
          <Link href={cta.link}>
            <button className="bg-primary hover:bg-primary text-white px-6 py-3 rounded-full font-semibold shadow-md transition">
              {cta.label}
            </button>
          </Link>
        </div>

      </div>
    </Section>
  );
}