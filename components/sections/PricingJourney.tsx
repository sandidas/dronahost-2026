"use client";

import HeadLineText from "@/components/ui/HeadLineText";
import Section from "@/components/ui/Section";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

/* ── CustomTierSlider (inlined from home/pricingjourney/CustomTierSlider) ── */

interface CustomTierSliderProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  tierNames?: string[];
}

/* Half the thumb width — rail & everything is inset by this amount */
const INSET = 18; // px  (thumb is 36px wide)

function CustomTierSlider({
  value,
  min,
  max,
  onChange,
  tierNames,
}: CustomTierSliderProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const [dragging, setDragging] = useState(false);
  const [hovered, setHovered] = useState(false);

  const steps = Array.from({ length: max - min + 1 }, (_, i) => i + min);
  const pct = max === min ? 0 : ((value - min) / (max - min)) * 100;

  /* ── map clientX → step, within the inset rail ── */
  const resolveStep = useCallback(
    (clientX: number) => {
      if (!wrapRef.current) return;
      const rect = wrapRef.current.getBoundingClientRect();
      const railW = rect.width; // wrapRef IS the inset rail
      const x = Math.min(Math.max(clientX - rect.left, 0), railW);
      onChange(Math.round((x / railW) * (max - min)) + min);
    },
    [min, max, onChange]
  );

  /* ── mouse ── */
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    setDragging(true);
    resolveStep(e.clientX);
  };
  useEffect(() => {
    const mv = (e: MouseEvent) => { if (isDragging.current) resolveStep(e.clientX); };
    const up = () => { if (isDragging.current) { isDragging.current = false; setDragging(false); } };
    window.addEventListener("mousemove", mv);
    window.addEventListener("mouseup", up);
    return () => { window.removeEventListener("mousemove", mv); window.removeEventListener("mouseup", up); };
  }, [resolveStep]);

  /* ── touch ── */
  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    setDragging(true);
    resolveStep(e.touches[0].clientX);
  };
  useEffect(() => {
    const mv = (e: TouchEvent) => { if (isDragging.current) resolveStep(e.touches[0].clientX); };
    const up = () => { isDragging.current = false; setDragging(false); };
    window.addEventListener("touchmove", mv, { passive: true });
    window.addEventListener("touchend", up);
    return () => { window.removeEventListener("touchmove", mv); window.removeEventListener("touchend", up); };
  }, [resolveStep]);

  /* ── keyboard ── */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft"  && value > min) onChange(value - 1);
    if (e.key === "ArrowRight" && value < max) onChange(value + 1);
    if (e.key === "Home") onChange(min);
    if (e.key === "End")  onChange(max);
  };

  const tooltipLabel = tierNames?.[value - min] ?? `Tier ${value - min + 1}`;

  return (
    <div className="tsl-root">

      {/*
        OUTER WRAPPER — provides the vertical hit area and positions the thumb.
        Horizontally it matches the inset rail exactly (margin: 0 INSET px).
      */}
      <div className="tsl-hit" onMouseDown={handleMouseDown} onTouchStart={handleTouchStart}>

        {/* THE RAIL — starts at first dot, ends at last dot */}
        <div ref={wrapRef} className="tsl-rail">

          {/* FILL */}
          <div className="tsl-fill" style={{ width: `${pct}%` }} />

          {/* DOTS */}
          {steps.map((step) => {
            const dotPct = max === min ? 0 : ((step - min) / (max - min)) * 100;
            return (
              <span
                key={step}
                className={[
                  "tsl-dot",
                  step <  value ? "tsl-dot--filled" : "",
                  step === value ? "tsl-dot--active" : "",
                ].filter(Boolean).join(" ")}
                style={{ left: `${dotPct}%` }}
              />
            );
          })}

          {/* THUMB — left:0% sits at first dot, left:100% at last dot */}
          <div
            className={`tsl-thumb${dragging ? " tsl-thumb--drag" : ""}`}
            style={{ left: `${pct}%` }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="slider"
            aria-valuenow={value}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-label="Select tier"
          >
            {/* TOOLTIP */}
            <div className={`tsl-tooltip${dragging || hovered ? " tsl-tooltip--visible" : ""}`}>
              {tooltipLabel}
              <span className="tsl-tooltip-arrow" />
            </div>

            {/* CHEVRONS */}
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden>
              <path d="M5.5 1.5L2.5 4.5L5.5 7.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden>
              <path d="M3.5 1.5L6.5 4.5L3.5 7.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

        </div>{/* /tsl-rail */}
      </div>{/* /tsl-hit */}

      {/* LABELS — aligned to same inset */}
      {tierNames && (
        <div className="tsl-labels">
          {tierNames.map((name, i) => {
            const lPct = max === min ? 0 : (i / (max - min)) * 100;
            return (
              <span
                key={name}
                className={`tsl-label${i === value - min ? " tsl-label--active" : ""}`}
                style={{ left: `${lPct}%` }}
              >
                {name}
              </span>
            );
          })}
        </div>
      )}

      <style jsx>{`
        .tsl-root {
          width: 100%;
          margin-top: 14px;
          user-select: none;
          -webkit-user-select: none;
        }

        /* Full-width hit area — vertical padding makes it easy to grab */
        .tsl-hit {
          width: 100%;
          padding: 14px 0;
          cursor: pointer;
          /* Shrink horizontally so the rail is inset */
          box-sizing: border-box;
          padding-left: ${INSET}px;
          padding-right: ${INSET}px;
        }

        /* THE RAIL — no extra caps, starts/ends at first/last dot */
        .tsl-rail {
          position: relative;
          width: 100%;
          height: 8px;
          background: #dbeafe;
          border-radius: 999px;
          overflow: visible;
        }

        /* FILL */
        .tsl-fill {
          position: absolute;
          left: 0; top: 0;
          height: 100%;
          background: #0d2137;
          border-radius: 999px;
          transition: width 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
          pointer-events: none;
        }

        /* DOTS */
        .tsl-dot {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 11px;
          height: 11px;
          border-radius: 50%;
          background: #bfdbfe;
          pointer-events: none;
          transition: background 0.18s ease;
          z-index: 1;
        }
        .tsl-dot--filled { background: #1e3a5f; }
        .tsl-dot--active { opacity: 0; }

        /* THUMB */
        .tsl-thumb {
          position: absolute;
          top: 50%;
          /* translate(-50%) centres thumb on the left% point */
          transform: translate(-50%, -50%);
          z-index: 10;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #0d2137;
          border: 3px solid #ffffff;
          box-shadow: 0 0 0 1.5px #0d2137, 0 4px 12px rgba(13,33,55,.35);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1px;
          cursor: grab;
          transition:
            left 0.18s cubic-bezier(0.34, 1.56, 0.64, 1),
            box-shadow 0.15s ease,
            transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
          outline: none;
          padding: 0;
        }
        .tsl-thumb:hover {
          box-shadow: 0 0 0 1.5px #0d2137, 0 6px 20px rgba(13,33,55,.45);
          transform: translate(-50%, -50%) scale(1.1);
        }
        .tsl-thumb--drag {
          cursor: grabbing;
          transition: box-shadow 0.1s ease, transform 0.1s ease;
          transform: translate(-50%, -50%) scale(1.16);
          box-shadow: 0 0 0 5px rgba(13,33,55,.1), 0 0 0 1.5px #0d2137, 0 8px 24px rgba(13,33,55,.5);
        }
        .tsl-thumb:focus-visible {
          box-shadow: 0 0 0 3px #fff, 0 0 0 5px #0d2137;
        }

        /* TOOLTIP */
        .tsl-tooltip {
          position: absolute;
          bottom: calc(100% + 10px);
          left: 50%;
          transform: translateX(-50%) translateY(4px);
          background: #0d2137;
          color: #fff;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.03em;
          padding: 4px 10px;
          border-radius: 6px;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.15s ease, transform 0.2s cubic-bezier(0.34,1.56,0.64,1);
        }
        .tsl-tooltip--visible {
          opacity: 1;
          transform: translateX(-50%) translateY(0px);
        }
        .tsl-tooltip-arrow {
          position: absolute;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
          width: 8px; height: 4px;
          background: #0d2137;
          clip-path: polygon(0 0, 100% 0, 50% 100%);
        }

        /* LABELS */
        .tsl-labels {
          position: relative;
          height: 22px;
          margin-top: 8px;
          padding-left: ${INSET}px;
          padding-right: ${INSET}px;
          box-sizing: border-box;
        }
        .tsl-label {
          position: absolute;
          transform: translateX(-50%);
          font-size: 11px;
          color: #94a3b8;
          font-weight: 500;
          transition: color 0.18s ease, font-weight 0.18s ease;
          pointer-events: none;
          white-space: nowrap;
        }
        .tsl-label--active {
          color: #0d2137;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
}

/* ── PricingJourney (from home/pricingjourney/pricingJourney) ── */

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

/* CustomTierSlider is available as a named export for use in other sections */
export { CustomTierSlider };
