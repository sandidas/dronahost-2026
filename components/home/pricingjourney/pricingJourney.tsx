"use client";

import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";
import Link from "next/link";
import { useState } from "react";

type Plan = {
  id: string;
  name: string;
  badge?: string | null;
  description: string;
  price: {
    amount?: number;
    currency?: string;
    duration?: string;
    custom?: boolean;
    label?: string;
    note?: string;
  };
  cta: {
    label: string;
    variant: string;
    link: string;
  };
  featuresTitle: string;
  features: string[];
  extensions?: {
    title: string;
    items: string[];
  };
  footer: {
    cta: string;
    secondaryLink: string;
  };
};

type Props = {
  data: {
    pricingSection: {
      tagline: string;
      title: string;
      billingToggle?: {
        label: string;
        options: string[];
        default: string;
      };
      plans: Plan[];
      layout?: {
        highlightedPlan?: string;
      };
    };
  };
};

export default function PricingJourney({ data }: Props) {
  const section = data.pricingSection;

  const [billing, setBilling] = useState(
    section.billingToggle?.default || "monthly"
  );
  const [currency, setCurrency] = useState("USD");

  return (
    <Section padding="xl" className="bg-gray-50 dark:bg-[#041635]">
      <div className="max-w-7xl mx-auto">

        {/* TAGLINE */}
        <p className="mb-4 text-center text-xs tracking-widest text-orange-500 uppercase dark:text-orange-400">
          {section.tagline}
        </p>

        {/* TITLE */}
        <HeadLineText
          as="h2"
          fontSize="fiveXl"
          fontWeight="bold"
          align="center"
          className="mx-auto max-w-xl text-slate-900 dark:text-slate-100"
        >
          {section.title}
        </HeadLineText>

        {/* BILLING + CURRENCY */}
        <div className="mt-6 flex justify-center items-center gap-3 flex-wrap">
          <span className="text-sm text-gray-500 dark:text-slate-300">
            {section.billingToggle?.label || "Subscription plans are listed"}
          </span>

          <select
            value={billing}
            onChange={(e) => setBilling(e.target.value)}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
          >
            {(section.billingToggle?.options || ["monthly", "annually"]).map(
              (opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              )
            )}
          </select>

          <span className="text-sm text-gray-500 dark:text-slate-300">in</span>

          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
          >
            {["USD", "GBP", "EUR", "CAD", "AUD"].map((cur) => (
              <option key={cur}>{cur}</option>
            ))}
          </select>
        </div>

        {/* PLANS */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {section.plans.map((plan) => {
            const isHighlighted =
              section.layout?.highlightedPlan === plan.id;

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-8 ${
                  isHighlighted
                    ? "scale-[1.03] border-2 border-blue-200 bg-white shadow-xl dark:border-blue-500/70 dark:bg-slate-900"
                    : "border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
                }`}
              >
                {/* BADGE */}
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs px-3 py-1 rounded-full">
                    {plan.badge}
                  </span>
                )}

                {/* NAME */}
                <h3 className="text-center text-xl font-semibold text-slate-900 dark:text-slate-100">
                  {plan.name}
                </h3>

                {/* DESC */}
                <p className="mt-3 text-center text-sm text-gray-500 dark:text-slate-300">
                  {plan.description}
                </p>

                {/* PRICE */}
                <div className="mt-6 text-center">
                  {plan.price.custom ? (
                    <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                      {plan.price.label}
                    </p>
                  ) : (
                    <>
                      <p className="text-4xl font-bold text-slate-900 dark:text-slate-100">
                        ${plan.price.amount}
                      </p>
                      <p className="text-sm text-gray-400 dark:text-slate-400">
                        {currency}/{plan.price.duration}
                      </p>
                    </>
                  )}
                </div>

                {/* CTA */}
                <div className="mt-6 flex justify-center">
                  <Link
                    href={plan.cta.link}
                    className={`px-6 py-2 rounded-full text-sm font-medium ${
                      plan.cta.variant === "primary"
                        ? "bg-orange-500 text-white hover:bg-orange-600"
                        : plan.cta.variant === "outline"
                        ? "border border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10"
                        : "border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                    }`}
                  >
                    {plan.cta.label}
                  </Link>
                </div>

                {/* ESSENTIAL BUILDER */}
                {plan.id === "essential" && <EssentialBuilder />}

                {/* FEATURES */}
                <p className="mt-8 text-xs font-semibold text-gray-400 dark:text-slate-400">
                  {plan.featuresTitle}
                </p>

                <ul className="mt-4 space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-600 dark:text-slate-300">
                      <span className="text-blue-500">✔</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* EXTENSIONS */}
                {plan.extensions && (
                  <div className="mt-6 rounded-lg bg-gray-100 p-4 dark:bg-slate-800/80">
                    <p className="mb-2 text-xs font-semibold text-gray-500 dark:text-slate-300">
                      {plan.extensions.title}
                    </p>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-slate-300">
                      {plan.extensions.items.map((item, i) => (
                        <li key={i}>+ {item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* FOOTER */}
                <div className="mt-6 text-center">
                  <button className="w-full rounded-md bg-gray-100 py-2 text-sm text-gray-700 hover:bg-gray-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
                    {plan.footer.cta}
                  </button>

                  <p className="mt-3 text-xs text-gray-400 hover:underline dark:text-slate-400">
                    {plan.footer.secondaryLink} →
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

/* =========================
 ESSENTIAL BUILDER
========================= */

function EssentialBuilder() {
  const [step, setStep] = useState(0);
  const [sites, setSites] = useState(0);

  const [addons, setAddons] = useState({
    plugin: false,
    security: false,
    nitro: false,
  });

  const plans = [
    { name: "Startup", price: 30 },
    { name: "Professional", price: 55 },
    { name: "Growth", price: 109 },
    { name: "Scale", price: 276 },
  ];

  const current = plans[step];

  /*  ADDON PRICES */
  const addonPrices = {
    plugin: 3,
    security: 19,
    nitro: 20,
  };

  /*  CALCULATE TOTAL */
  const totalPrice =
    current.price +
    sites * 20 +
    (addons.plugin ? addonPrices.plugin : 0) +
    (addons.security ? addonPrices.security : 0) +
    (addons.nitro ? addonPrices.nitro : 0);

  return (
    <div className="mt-8">

      {/* SLIDER */}
      <input
        type="range"
        min={0}
        max={plans.length - 1}
        value={step}
        onChange={(e) => setStep(Number(e.target.value))}
        className="w-full accent-blue-500"
      />

      {/*  PRICE CARD (UPDATED LIVE) */}
      <div className="mt-4 rounded-xl border bg-white p-4 dark:border-slate-600 dark:bg-slate-900">
        <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{current.name}</h4>

        <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-slate-100">
          ${totalPrice} <span className="text-xs">USD/mo</span>
        </p>
      </div>

      {/* ADDITIONAL SITES */}
      <div className="mt-4 flex items-center justify-between rounded-xl border p-4 dark:border-slate-600">
        <div>
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Additional Site(s)</p>
          <p className="text-xs text-gray-400 dark:text-slate-400">+$20/mo</p>
        </div>

        <div className="flex items-center gap-3 rounded-full border px-3 py-1 dark:border-slate-600 dark:text-slate-200">
          <button onClick={() => setSites(Math.max(0, sites - 1))}>-</button>
          <span>{sites}</span>
          <button onClick={() => setSites(sites + 1)}>+</button>
        </div>
      </div>

      {/* ADDONS */}
      <div className="mt-4 space-y-4 text-sm text-gray-600 dark:text-slate-300">

        <label className="flex gap-2 items-start">
          <input
            type="checkbox"
            checked={addons.plugin}
            onChange={() =>
              setAddons((prev) => ({ ...prev, plugin: !prev.plugin }))
            }
          />
          <div>
            Automated Plugin Updates <span>+$3</span>
          </div>
        </label>

        <label className="flex gap-2 items-start">
          <input
            type="checkbox"
            checked={addons.security}
            onChange={() =>
              setAddons((prev) => ({ ...prev, security: !prev.security }))
            }
          />
          <div>
            Extra Layer of Security <span>+$19</span>
          </div>
        </label>

        <label className="flex gap-2 items-start">
          <input
            type="checkbox"
            checked={addons.nitro}
            onChange={() =>
              setAddons((prev) => ({ ...prev, nitro: !prev.nitro }))
            }
          />
          <div>
            NitroPack <span>+$20</span>
          </div>
        </label>
      </div>
    </div>
  );
}