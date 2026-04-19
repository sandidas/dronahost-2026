"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type SidebarItem = {
  id: string;
  label: string;
};

type Category = {
  label: string;
  items: SidebarItem[];
};

const categories: Category[] = [
  {
    label: "Layout",
    items: [
      { id: "section", label: "Section" },
      { id: "gradient-background", label: "GradientBackground" },
    ],
  },
  {
    label: "Typography",
    items: [{ id: "headline-text", label: "HeadLineText" }],
  },
  {
    label: "Cards",
    items: [
      { id: "grid-card", label: "GridCard" },
      { id: "resource-card", label: "ResourceCard" },
      { id: "resource-box", label: "ResourceBox" },
    ],
  },
  {
    label: "Buttons & Forms",
    items: [
      { id: "buttons", label: "Buttons" },
      { id: "contact-form", label: "Contact Form" },
    ],
  },
  {
    label: "Navigation",
    items: [
      { id: "header", label: "Header" },
      { id: "footer", label: "Footer" },
    ],
  },
  {
    label: "Home Sections",
    items: [
      { id: "hero", label: "Hero" },
      { id: "features", label: "Features" },
      { id: "services", label: "Services" },
      { id: "case-study", label: "Case Study" },
      { id: "cta", label: "CTA" },
      { id: "pricing-1", label: "Pricing (Split Image)" },
      { id: "pricing-2", label: "Pricing (Illustration)" },
      { id: "pricing-3", label: "Pricing (Alt Split)" },
      { id: "pricing-4", label: "Pricing (Feature List)" },
      { id: "pricing-journey", label: "Pricing Journey" },
      { id: "testimonials", label: "Testimonials" },
      { id: "faq", label: "FAQ" },
      { id: "teams", label: "Teams" },
    ],
  },
  {
    label: "SEO",
    items: [
      { id: "json-ld", label: "JsonLd" },
    ],
  },
  {
    label: "Trust & Conversion",
    items: [
      { id: "trust-badges", label: "Trust Badges" },
      { id: "uptime-bar", label: "Uptime / Stats Bar" },
    ],
  },
];

export default function ShowcaseSidebar() {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const allIds = categories.flatMap((c) => c.items.map((i) => i.id));
    const elements = allIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-10% 0px -80% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto py-6 pr-4">
      {categories.map((cat) => (
        <div key={cat.label} className="mb-4">
          <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {cat.label}
          </p>
          <ul>
            {cat.items.map((item) => (
              <li key={item.id}>
                <Link
                  href={`#${item.id}`}
                  className={`block rounded-md px-3 py-1.5 text-sm transition-colors ${
                    activeId === item.id
                      ? "bg-orange-50 font-medium text-orange-600 dark:bg-orange-900/20 dark:text-orange-400"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
