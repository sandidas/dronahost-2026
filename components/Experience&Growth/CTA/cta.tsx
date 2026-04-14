"use client";

import HeadLineText from "@/components/HeadLineText/HeadLineText";
import GradientBackground from "@/components/gradient/gradient";
import Section from "@/components/section/section";
import Link from "next/link";

type CTAProps = {
  data: {
    title: string;
    cta: {
      label: string;
      link: string;
    };
  };
};

export default function CTA({ data }: CTAProps) {
  const { title, cta } = data;

  return (
    <Section
      padding="hero"
      className="relative overflow-hidden"
    >
      {/* ✅ SECTION GRADIENT (background layer) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <GradientBackground
          gradient="custom"
          customGradient="
            from-muted via-background to-muted
            dark:from-background dark:via-muted dark:to-background
          "
          blobs={[
            {
              color: "blue",
              size: "lg",
              effect: "float",
              position: "top-left",
              opacity: 30,
              blur: "xl",
            },
            {
              color: "orange",
              size: "lg",
              effect: "drift",
              position: "top-right",
              opacity: 25,
              blur: "xl",
            },
          ]}
          glowSpots={[
            {
              color: "#1d4ed8",
              position: "top-left",
              size: "xl",
              opacity: 8,
            },
            {
              color: "#312e81",
              position: "bottom-right",
              size: "lg",
              opacity: 10,
            },
          ]}
          variant="none"
          className="h-full w-full"
        />
      </div>

      {/* ✅ CTA CARD (foreground) */}
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="bg-[#e9e7f2] dark:bg-gray-800 rounded-3xl px-6 md:px-12 py-10 md:py-14 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Title */}
          <div className="max-w-2xl">
            <HeadLineText
              as="h2"
              fontSize="fourXl"
              fontWeight="bold"
              align="left"
              className="text-black dark:text-white"
            >
              {title}
            </HeadLineText>
          </div>

          {/* CTA Button */}
          <Link href={cta.link}>
            <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 transition text-white font-semibold px-6 py-3 rounded-full shadow-md">
              {cta.label}
              <span className="text-lg">→</span>
            </button>
          </Link>
        </div>
      </div>
    </Section>
  );
}