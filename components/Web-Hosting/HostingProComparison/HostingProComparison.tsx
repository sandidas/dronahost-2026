import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";
import Link from "next/link";

type Row = {
  feature: string;
  selfHosting: string;
  hostingPro: string;
};

type Props = {
  data: {
    comparison: {
      tagline: string;
      title: string;
      columns: string[];
      rows: Row[];
      total: {
        label: string;
        selfHosting: string;
        selfHostingNote: string;
        hostingPro: string;
        hostingProNote: string;
      };
      footnote: string;
    };
    cta: {
      label: string;
      link: string;
    };
  };
};

export default function HostingProComparison({ data }: Props) {
  const { comparison, cta } = data;
  const { tagline, title, columns, rows, total, footnote } = comparison;

  return (
    <Section size="lg" padding="lg" hAlign="center" className="bg-background dark:bg-gray-900">
      {/* Heading */}
      <div className="mb-12">
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

      {/* Table */}
      <div className="w-full max-w-full overflow-hidden rounded-2xl border border-border bg-card">
        {/* Header */}
        <div className="grid grid-cols-3 bg-muted text-sm font-semibold text-foreground">
          {columns.map((col, i) => (
            <div
              key={i}
              className={`px-6 py-4 ${
                i === 2 ? "border-l border-orange-300 text-center dark:border-orange-900/50" : ""
              }`}
            >
              {col}
            </div>
          ))}
        </div>

        {/* Rows */}
        {rows.map((row, idx) => (
          <div
            key={idx}
            className="grid grid-cols-3 border-t border-border text-sm"
          >
            <div className="px-6 py-4 text-muted-foreground">
              {row.feature}
            </div>

            <div className="px-6 py-4 text-muted-foreground">
              {row.selfHosting}
            </div>

            <div className="px-6 py-4 text-center border-l border-orange-200 font-medium text-foreground dark:border-orange-900/50">
              {row.hostingPro === "Included" ? (
                <span className="font-semibold">Included</span>
              ) : (
                row.hostingPro
              )}
            </div>
          </div>
        ))}

        {/* Total Row */}
        <div className="grid grid-cols-3 border-t border-border text-sm font-medium">
          <div className="px-6 py-5 bg-muted text-foreground">
            {total.label}
          </div>

          <div className="px-6 py-5 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/45 dark:text-emerald-300">
            <div className="font-semibold">{total.selfHosting}</div>
            <div className="text-xs mt-1">{total.selfHostingNote}</div>
          </div>

          <div className="px-6 py-5 bg-orange-50 text-orange-800 border-l border-orange-200 dark:border-orange-900/50 dark:bg-orange-950/45 dark:text-orange-300">
            <div className="font-semibold">{total.hostingPro}</div>
            <div className="text-xs mt-1">{total.hostingProNote}</div>
          </div>
        </div>
      </div>

      {/* Footnote */}
      <HeadLineText
        as="p"
        fontSize="sm"
        fontWeight="medium"
        align="center"
        className="mt-6 text-muted-foreground"
      >
        {footnote}
      </HeadLineText>

      {/* CTA */}
      <div className="mt-8 flex justify-center">
        <Link
          href={cta.link}
          className="rounded-full bg-primary px-8 py-3 font-medium text-primary-foreground shadow-md transition hover:bg-primary/90"
        >
          {cta.label}
        </Link>
      </div>
    </Section>
  );
}