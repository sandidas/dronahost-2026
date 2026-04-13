"use client";

import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";
import { useState } from "react";

type Slider = {
  id: string;
  label: string;
  min: number;
  max: number;
  value: number;
  unit: string;
};

type Props = {
  data: {
    title: string;
    tabs: string[];
    sliders: Slider[];
    summary: {
      title: string;
      price: string;
      duration: string;
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
    };
    navigation: {
      backToPlans: {
        label: string;
        link: string;
      };
    };
  };
};

export default function BuildCustomCloud({ data }: Props) {
  const [values, setValues] = useState(
    data.sliders.reduce((acc, s) => {
      acc[s.id] = s.value;
      return acc;
    }, {} as Record<string, number>)
  );

  const handleChange = (id: string, val: number) => {
    setValues((prev) => ({ ...prev, [id]: val }));
  };

  return (
    <Section padding="lg" className="bg-background dark:bg-gray-900">
      <div className="max-w-6xl mx-auto border border-border dark:border-white/20 rounded-2xl p-8">

        {/* Title */}
        <HeadLineText
          as="h2"
          fontSize="fourXl"
          fontWeight="bold"
          align="left"
          className="text-foreground dark:text-white"
        >
          {data.title}
        </HeadLineText>

        {/* FIXED GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10">

          <div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-10 text-sm font-medium text-orange-500 mb-8">
              {data.tabs.map((tab, i) => (
                <span key={i} className="uppercase tracking-wide">
                  {tab}
                </span>
              ))}
            </div>

            {/* Sliders */}
            <div className="space-y-8">
              {data.sliders.map((slider) => (
                <div key={slider.id}>
                  
                  {/* Label */}
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-foreground dark:text-white">
                      {slider.label}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {values[slider.id]} {slider.unit}
                    </span>
                  </div>

                  {/* Range */}
                  <input
                    type="range"
                    min={slider.min}
                    max={slider.max}
                    value={values[slider.id]}
                    onChange={(e) =>
                      handleChange(slider.id, Number(e.target.value))
                    }
                    className="w-full accent-orange-500 cursor-pointer"
                  />
                </div>
              ))}
            </div>

          </div>

          {/* RIGHT CARD */}
          <div className="border border-border dark:border-white/20 rounded-xl p-6 h-fit lg:sticky lg:top-24">

            <h3 className="text-green-600 font-semibold">
              {data.summary.title}
            </h3>

            <div className="flex items-end gap-1 mt-2">
              <span className="text-3xl font-bold text-foreground dark:text-white">
                {data.summary.price}
              </span>
              <span className="text-sm text-muted-foreground">
                {data.summary.duration}
              </span>
            </div>

            {/* CTA */}
            <a
              href={data.summary.cta.link}
              className="block bg-orange-500 hover:bg-orange-600 text-white text-center py-3 rounded-lg font-medium mt-5 transition"
            >
              {data.summary.cta.label.toUpperCase()}
            </a>

            {/* Features */}
            <div className="mt-6 space-y-2 text-sm text-muted-foreground">
              <p>
                <span className="font-medium text-foreground dark:text-white">
                  {values.cpu}
                </span>{" "}
                {data.summary.features.cpu}
              </p>
              <p>
                <span className="font-medium text-foreground dark:text-white">
                  {values.memory}
                </span>{" "}
                {data.summary.features.storage}
              </p>
              <p>
                <span className="font-medium text-foreground dark:text-white">
                  {values.storage}
                </span>{" "}
                {data.summary.features.memory}
              </p>
              <p>{data.summary.features.bandwidth}</p>
            </div>

          </div>

        </div>

      </div>

      {/* Bottom Nav */}
      <div className="text-center mt-6">
        <a
          href={data.navigation.backToPlans.link}
          className="text-orange-500 text-sm font-medium hover:underline"
        >
          ← {data.navigation.backToPlans.label.toUpperCase()}
        </a>
      </div>
    </Section>
  );
}