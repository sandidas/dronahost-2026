import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";

type Props = {
  data: any;
};

export default function Performance({ data }: Props) {
  const { performanceSection } = data;
  const {
    tagline,
    title,
    description,
    ttfbComparison,
    speedImprovements,
    disclaimer,
  } = performanceSection;

  return (
    <Section
      padding="lg"
      hAlign="center"
      className="bg-background dark:bg-gray-900"
    >
      {/* Header */}
      <div className="text-center max-w-full mb-8">
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

        <HeadLineText
          as="p"
          fontSize="sm"
          fontWeight="medium"
          align="center"
          className="text-muted-foreground mt-4"
        >
          {description}
        </HeadLineText>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
        {/* LEFT: TTFB */}
        <div className="rounded-2xl border border-border p-6 bg-card">
          <HeadLineText as="h3" fontSize="md" fontWeight="bold" align="center">
            {ttfbComparison.title}
          </HeadLineText>

          <HeadLineText
            as="p"
            fontSize="sm"
            fontWeight="medium"
            align="center"
            className="text-muted-foreground mt-2"
          >
            {ttfbComparison.note}
          </HeadLineText>

          {/* Legend */}
          <div className="flex gap-6 text-xs mt-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              {ttfbComparison.legend.primary}
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gray-400" />
              {ttfbComparison.legend.secondary}
            </div>
          </div>

          {/* Bars */}
          <div className="mt-6 space-y-6">
            {ttfbComparison.comparisons.map((item: any, i: number) => (
              <div key={i}>
                {/* HostingPro */}
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs w-24">HostingPro</span>
                  <div className="flex-1 bg-muted h-3 rounded-full">
                    <div className="bg-orange-500 h-3 rounded-full w-[40%]" />
                  </div>
                  <span className="text-xs">{item.hostingPro}</span>
                </div>

                {/* Competitor */}
                <div className="flex items-center gap-3">
                  <span className="text-xs w-24">{item.competitor}</span>
                  <div className="flex-1 bg-muted h-3 rounded-full">
                    <div className="bg-gray-400 h-3 rounded-full w-[80%]" />
                  </div>
                  <span className="text-xs">{item.competitorValue}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: SPEED */}
        <div className="rounded-2xl border border-border p-6 bg-card">
          <HeadLineText as="p" fontSize="md" fontWeight="bold" align="center">
            {speedImprovements.title}
          </HeadLineText>

          <HeadLineText
            as="p"
            fontSize="sm"
            fontWeight="medium"
            align="center"
            className="text-muted-foreground mt-2"
          >
            {speedImprovements.description}
          </HeadLineText>

          {/* Grid */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            {speedImprovements.results.map((item: any, i: number) => (
              <div
                key={i}
                className="border border-border rounded-xl p-4 text-center"
              >
                <HeadLineText
                  as="p"
                  fontSize="sm"
                  fontWeight="medium"
                  align="center"
                  className="text-muted-foreground"
                >
                  {item.from} → {item.to}
                </HeadLineText>

                {/*  PERFECT DASHED CIRCLE */}
                <div className="relative w-24 h-24 mx-auto flex items-center justify-center mt-3">
                  <svg
                    className="absolute inset-0 w-full h-full "
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="6"
                      strokeDasharray="8 14"
                      strokeLinecap="round"
                      className="text-primary"
                    />
                  </svg>

                  <HeadLineText
                    as="span"
                    fontSize="md"
                    fontWeight="bold"
                    align="center"
                  >
                    {item.increase}
                  </HeadLineText>
                </div>

                <HeadLineText
                  as="p"
                  fontSize="sm"
                  fontWeight="medium"
                  align="center"
                  className="text-muted-foreground mt-3"
                >
                  {item.title}
                </HeadLineText>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <HeadLineText
        as="p"
        fontSize="sm"
        fontWeight="medium"
        align="center"
        className="text-muted-foreground mt-10"
      >
        {disclaimer}
      </HeadLineText>
    </Section>
  );
}