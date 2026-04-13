"use client";

import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";
import Image from "next/image";
import { useState } from "react";

type Feature = {
  id: number;
  title: string;
  type: "collapsed" | "expanded" | string;
  description: string;
};

type Props = {
  data: {
    title: string;
    description: string;
    features: Feature[];
    illustration: {
      src: string;
      alt: string;
    };
  };
};

export default function GrowManage({ data }: Props) {
  // Find default expanded item from JSON
  const defaultOpen =
    data.features.find((f) => f.type === "expanded")?.id || null;

  const [activeId, setActiveId] = useState<number | null>(defaultOpen);

  //  Toggle function
  const handleToggle = (id: number) => {
    setActiveId((prev) => (prev === id ? null : id));
  };

  return (
    <Section padding="lg" className="bg-background dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">

        {/* Top Heading */}
        <div className="text-center max-w-2xl mx-auto">
          <HeadLineText
            as="h2"
            fontSize="fourXl"
            fontWeight="bold"
            align="center"
            className="text-foreground dark:text-white"
          >
            {data.title}
          </HeadLineText>

          <HeadLineText
            as="p"
            fontSize="md"
            fontWeight="medium"
            align="center"
            className="text-muted-foreground mt-4"
          >
            {data.description}
          </HeadLineText>
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-2 gap-10 items-center mt-12">

          {/* LEFT - Features */}
          <div className="space-y-4">
            {data.features.map((item) => {
              const isOpen = activeId === item.id;

              return (
               <div
                key={item.id}
                className={`border border-gray-300 dark:border-gray-600 rounded-xl transition-all duration-300 cursor-pointer ${
                    isOpen
                    ? "bg-card shadow-sm p-5"
                    : "px-5 py-4 hover:bg-muted/30"
                }`}
                onClick={() => handleToggle(item.id)}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground dark:text-white">
                      {item.title}
                    </span>

                    <span className="text-xl text-muted-foreground transition-transform duration-300">
                      {isOpen ? "−" : "+"}
                    </span>
                  </div>

                  {/* Description */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isOpen ? "max-h-40 mt-3" : "max-h-0"
                    }`}
                  >
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT - Illustration */}
          <div className="relative flex justify-end">
            <Image
              src={data.illustration.src}
              alt={data.illustration.alt}
              width={450}
              height={450}
              className="object-contain"
            />
          </div>

        </div>

      </div>
    </Section>
  );
}