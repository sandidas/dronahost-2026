import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";
import {
    Code,
    FileText,
    ListChecks,
    PenTool,
    Truck,
} from "lucide-react";

type Step = {
  title: string;
  icon: string;
  active?: boolean;
};

type Props = {
  data: {
    tagline: string;
    title: string;
    description: string;
    steps: Step[];
  };
};

export default function OurProcess({ data }: Props) {
  //  Icon mapping
  const iconMap: Record<string, React.ReactNode> = {
    file: <FileText className="w-6 h-6" />,
    list: <ListChecks className="w-6 h-6" />,
    design: <PenTool className="w-6 h-6" />,
    code: <Code className="w-6 h-6" />,
    truck: <Truck className="w-6 h-6" />,
  };

  return (
    <Section padding="lg" className="bg-background dark:bg-gray-900">
      <div className="max-w-6xl mx-auto text-center">

        {/* Tagline */}
        <HeadLineText
          as="p"
          fontSize="sm"
          fontWeight="medium"
          align="center"
          className="text-orange-500 uppercase tracking-widest mb-4"
        >
          {data.tagline}
        </HeadLineText>

        {/* Title */}
        <HeadLineText
          as="h2"
          fontSize="fourXl"
          fontWeight="bold"
          align="center"
          className="text-foreground dark:text-white"
        >
          {data.title}
        </HeadLineText>

        {/* Description */}
        <HeadLineText
          as="p"
          fontSize="md"
          fontWeight="medium"
          align="center"
          className="text-muted-foreground mt-4 max-w-2xl mx-auto"
        >
          {data.description}
        </HeadLineText>

        {/* Steps */}
        <div className="relative mt-14">

          {/* Connector Line */}
          <div className="hidden lg:block absolute top-6 left-0 right-0 bg-border dark:bg-white/10" />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 relative mt-12">

            {data.steps.map((step, i) => {
              const isActive = step.active;

              return (
                <div key={i} className="flex flex-col items-center text-center relative">

                  {/* Arrow connector (between items) */}
                  {i !== 0 && (
                    <span className="hidden lg:block absolute -left-6 mt-6 text-muted-foreground">
                      →
                    </span>
                  )}

                  {/* Icon Box */}
                  <div
                    className={`
                      w-16 h-16 flex items-center justify-center rounded-xl border
                      transition-all duration-300
                      ${
                        isActive
                          ? "border-primary text-primary bg-orange-50 dark:bg-orange-500/10"
                          : "border-border text-muted-foreground bg-background dark:bg-gray-800"
                      }
                    `}
                  >
                    {iconMap[step.icon]}
                  </div>

                  {/* Title */}
                  <p
                    className={`
                      mt-4 text-sm font-medium
                      ${
                        isActive
                          ? "text-foreground dark:text-white"
                          : "text-muted-foreground"
                      }
                    `}
                  >
                    {step.title}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </Section>
  );
}