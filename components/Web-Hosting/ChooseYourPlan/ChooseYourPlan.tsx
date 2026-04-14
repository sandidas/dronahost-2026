import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";
import Link from "next/link";

type Plan = {
  id: number;
  category: string;
  name: string;
  price: string;
  currency: string;
  duration: string;
  billingNote?: string;
  features: string[];
  highlight?: boolean;
  cta: {
    label: string;
    link: string;
  };
  footer: string;
};

type Props = {
  data: any;
};

export default function ChooseYourPlan({ data }: Props) {
  const pricingData = data?.pricingPlansSection ?? data;

  if (!pricingData) return null;

  const { header, plans, starterNote, trustIndicators } = pricingData;

  return (
    <Section size="xl" padding="lg" hAlign="center" className="bg-background dark:bg-gray-900">
      {/* Header */}
      <div className="mb-10">
        <HeadLineText
          as="p"
          fontSize="sm"
          fontWeight="medium"
          align="center"
          className="tracking-[0.2em] text-muted-foreground"
        >
          {header.tagline}
        </HeadLineText>

        <HeadLineText
          as="h2"
          fontSize="fourXl"
          fontWeight="bold"
          align="center"
          className="mt-3"
        >
          {header.title}
        </HeadLineText>

        {/* Static Toggle UI (NO INTERACTION) */}
        <div className="flex justify-center items-center gap-3 mt-6">
          <span className="text-sm font-medium text-primary">
            {header.billingToggle.default}
          </span>
          <div className="w-10 h-5 bg-muted rounded-full relative">
            <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-primary rounded-full" />
          </div>
          <span className="text-sm text-muted-foreground">
            {
              header.billingToggle.options.find(
                (opt: string) => opt !== header.billingToggle.default
              )
            }
          </span>
        </div>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
        {plans.map((plan: Plan) => (
          <div
            key={plan.id}
            className={`rounded-2xl border p-6 flex flex-col justify-between ${
              plan.highlight
                ? "bg-linear-to-b from-[#0b1220] to-[#0f172a] text-white border-none shadow-lg"
                : "bg-card border-border"
            }`}
          >
            <div>
              {/* Category */}
              <span className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground inline-block mb-4">
                {plan.category}
              </span>

              {/* Name */}
              <h3 className="text-xl font-semibold">{plan.name}</h3>

              {/* Price */}
              <div className="mt-4 flex items-end gap-1">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-sm opacity-70">{plan.duration}</span>
              </div>

              {plan.billingNote && (
                <p className="text-sm mt-1 text-muted-foreground">
                  {plan.billingNote}
                </p>
              )}

              {/* Features */}
              <ul className="mt-6 space-y-3 text-sm">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex gap-2 items-start">
                    <span className="text-green-500">✔</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="mt-6">
              <Link
                href={plan.cta.link}
                className={`block text-center py-3 rounded-full font-medium ${
                  plan.highlight
                    ? "border border-white text-white hover:bg-white hover:text-black"
                    : "bg-primary text-white hover:opacity-90"
                }`}
              >
                {plan.cta.label}
              </Link>

              <p className="text-xs text-center mt-3 opacity-70">
                {plan.footer}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Starter Note */}
      <div className="mt-10 w-full max-w-full bg-muted rounded-2xl border border-border p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
        <HeadLineText
            as="p"
            fontSize="sm"
            fontWeight="medium"
            align="left"
            className="mt-2 tracking-widest text-gray-500 dark:text-gray-400 uppercase"
          >
            {starterNote.Heading}
          </HeadLineText>

        <HeadLineText
          as="h3"
          fontSize="xl"
          fontWeight="bold"
          align="left"
        >
          {starterNote.title}
        </HeadLineText>
        <HeadLineText
            as="p"
            fontSize="sm"
            fontWeight="medium"
            align="left"
            className="mt-2 text-muted-foreground dark:text-gray-400 max-w-4xl"
          >
            {starterNote.description}
          </HeadLineText>
        </div>

        <Link
          href={starterNote.cta.link}
          className="bg-primary text-white px-6 py-3 rounded-full font-medium"
        >
          {starterNote.cta.label}
        </Link>
      </div>

      {/* Trust Indicators */}
      <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
        {trustIndicators.map((item: any, i: number) => (
          <div key={i} className="flex items-center gap-2">
            {item.label}
          </div>
        ))}
      </div>
    </Section>
  );
}