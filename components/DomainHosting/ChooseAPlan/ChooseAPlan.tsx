import GridCard from "@/components/Card/GridCard";
import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";

type Plan = {
  id: number;
  name: string;
  tagline: string;
  price: string;
  duration: string;
  note: string;
  cta: {
    label: string;
    link: string;
  };
  features: {
    cpu: string;
    memory: string;
    storage: string;
    bandwidth: string;
  };
  highlight: boolean;
};

type Props = {
  data: {
    title: string;
    CTAButton: {
      label: string;
      link: string;
    };
    plans: Plan[];
  };
};

export default function ChooseAPlan({ data }: Props) {
  return (
    <Section padding="lg" className="bg-background dark:bg-gray-900">
      <div className="max-w-6xl mx-auto text-center">

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

        {/* Grid Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-12 dark:border-white/20 overflow-hidden">

          {data.plans.map((plan, i) => (
            <GridCard
              key={plan.id}
              index={i}
              total={data.plans.length}
              columns={4}
              size="md"
              align="left"
              separatorTone="soft"
              className="text-left"
            >
              {/* Plan Name */}
              <h3
                className={`text-lg font-semibold ${
                  plan.highlight
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-foreground dark:text-white"
                }`}
              >
                {plan.name}
              </h3>

              {/* Tagline */}
              <p className="text-sm text-muted-foreground">
                {plan.tagline}
              </p>

              {/* Price */}
              <div className="flex items-end gap-1 mt-2">
                <span className="text-3xl font-bold text-foreground dark:text-white">
                  {plan.price}
                </span>
                <span className="text-sm text-muted-foreground">
                  {plan.duration}
                </span>
              </div>

              {/* Note */}
              <p className="text-xs text-muted-foreground uppercase">
                {plan.note}
              </p>

              {/* Button */}
              <a
                href={plan.cta.link}
                className="bg-primary hover:bg-primary text-white px-5 py-2 rounded-lg text-sm font-medium mt-2 transition w-fit"
              >
                {plan.cta.label.toUpperCase()}
              </a>

              {/* Features */}
              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground dark:text-white">
                    {plan.features.cpu.split(" ")[0]}
                  </span>{" "}
                  {plan.features.cpu.split(" ").slice(1).join(" ")}
                </p>
                <p>
                  <span className="font-medium text-foreground dark:text-white">
                    {plan.features.memory.split(" ")[0]}
                  </span>{" "}
                  {plan.features.memory.split(" ").slice(1).join(" ")}
                </p>
                <p>
                  <span className="font-medium text-foreground dark:text-white">
                    {plan.features.storage.split(" ")[0]}
                  </span>{" "}
                  {plan.features.storage.split(" ").slice(1).join(" ")}
                </p>
                <p>
                  <span className="font-medium text-foreground dark:text-white">
                    {plan.features.bandwidth.split(" ")[0]}
                  </span>{" "}
                  {plan.features.bandwidth.split(" ").slice(1).join(" ")}
                </p>
              </div>
            </GridCard>
          ))}

        </div>

        {/* Bottom CTA */}
        <div className="mt-10">
          <a
            href={data.CTAButton.link}
            className="text-orange-500 font-medium text-sm hover:underline"
          >
            {data.CTAButton.label} →
          </a>
        </div>

      </div>
    </Section>
  );
}