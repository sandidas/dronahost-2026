"use client";

import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";
import { useState } from "react";

type Field = {
  name: string;
  label: string;
  type: string;
  required: boolean;
  placeholder: string;
};

type Props = {
  data: {
    title: string;
    description: string;
    fields: Field[];
    cta: {
      label: string;
      action: string;
    };
  };
};

export default function PartnerMatchForm({ data }: Props) {
  const { title, description, fields, cta } = data;

  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
  };

  return (
    <Section
        padding="lg"
        height="screen"
        className="bg-background dark:bg-gray-900"
        >
      <div className="w-full max-w-full rounded-2xl border border-border bg-card/95 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.12)] md:p-10 dark:bg-card/90 dark:shadow-[0_20px_48px_rgba(2,6,23,0.45)]">
        {/* Heading */}
        <div className="mb-8">
          <HeadLineText
            as="h2"
            fontSize="fourXl"
            align="center"
            fontWeight="bold"
            className="text-foreground dark:text-white"
          >
            {title}
          </HeadLineText>

          <HeadLineText
            as="p"
            fontSize="md"
            fontWeight="medium"
            align="center"
            className="mt-3 max-w-3xl text-muted-foreground dark:text-gray-400"
          >
            {description}
          </HeadLineText>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {fields.map((field) => {
              if (field.type === "textarea") {
                return (
                  <div key={field.name} className="md:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-foreground dark:text-white">
                      {field.label}
                      {field.required && <span className="text-primary"> *</span>}
                    </label>
                    <textarea
                      name={field.name}
                      placeholder={field.placeholder}
                      required={field.required}
                      onChange={handleChange}
                      rows={5}
                      className="w-full rounded-lg border border-border bg-background dark:bg-gray-800 px-3 py-2 text-sm text-foreground dark:text-white outline-none transition placeholder:text-muted-foreground/70 "
                    />
                  </div>
                );
              }

              return (
                <div key={field.name}>
                  <label className="mb-1 block text-sm font-medium text-foreground dark:text-white">
                    {field.label}
                    {field.required && <span className="text-primary"> *</span>}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    required={field.required}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-border bg-background dark:bg-gray-800 px-3 py-2 text-sm text-foreground dark:text-white outline-none transition placeholder:text-muted-foreground/70 focus:border-primary/50 focus:ring-2 focus:ring-primary/25"
                  />
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              className="rounded-full bg-primary px-8 py-3 font-medium text-primary-foreground shadow-md transition hover:bg-primary/90"
            >
              {cta.label}
            </button>
          </div>
        </form>
      </div>
    </Section>
  );
}