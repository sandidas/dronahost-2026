/**
 * Step and field definitions for the multi-step forms. Copy follows
 * docs/rules/content-writing-rules.md: plain, specific, no urgency.
 */
export type FieldDef = {
  name: string;
  label: string;
  type: "text" | "email" | "url" | "select" | "textarea";
  required?: boolean;
  hint?: string;
  placeholder?: string;
  autoComplete?: string;
  options?: readonly { value: string; label: string }[];
};

export type StepDef = { title: string; description: string; fields: readonly FieldDef[] };

const ABOUT_YOU: StepDef = {
  title: "About you",
  description: "So we know who to reply to.",
  fields: [
    { name: "name", label: "Full name", type: "text", required: true, autoComplete: "name" },
    { name: "email", label: "Work email", type: "email", required: true, autoComplete: "email", placeholder: "name@company.com" },
    { name: "company", label: "Company (optional)", type: "text", autoComplete: "organization" },
  ],
};

export const MIGRATION_STEPS: readonly StepDef[] = [
  ABOUT_YOU,
  {
    title: "Your current site",
    description: "We copy it across and you review it before anything changes.",
    fields: [
      { name: "siteUrl", label: "Site address", type: "url", required: true, placeholder: "https://example.com" },
      { name: "currentHost", label: "Current host (optional)", type: "text", hint: "For example the company you pay for hosting today." },
      {
        name: "platform",
        label: "What does it run on?",
        type: "select",
        required: true,
        options: [
          { value: "wordpress", label: "WordPress" },
          { value: "other-cms", label: "Another CMS or store platform" },
          { value: "custom", label: "Custom or static site" },
          { value: "unsure", label: "Not sure" },
        ],
      },
      {
        name: "siteSize",
        label: "Approximate size (files and database)",
        type: "select",
        required: true,
        options: [
          { value: "lt1", label: "Under 1 GB" },
          { value: "1-10", label: "1 to 10 GB" },
          { value: "10-50", label: "10 to 50 GB" },
          { value: "gt50", label: "Over 50 GB" },
          { value: "unsure", label: "Not sure" },
        ],
      },
    ],
  },
  {
    title: "Where to host it",
    description: "Pick the region closest to your visitors, or tell us you have no preference.",
    fields: [
      {
        name: "region",
        label: "Preferred region",
        type: "select",
        required: true,
        options: [
          { value: "us", label: "United States" },
          { value: "uk", label: "United Kingdom" },
          { value: "eu", label: "Europe" },
          { value: "uae", label: "United Arab Emirates" },
          { value: "none", label: "No preference" },
        ],
      },
      { name: "notes", label: "Anything we should know? (optional)", type: "textarea", hint: "Deadlines, plugins that are critical, email on the same domain." },
    ],
  },
];

export const CONSULTATION_STEPS: readonly StepDef[] = [
  ABOUT_YOU,
  {
    title: "Your project",
    description: "A few lines are enough. We read it before we reply.",
    fields: [
      {
        name: "interest",
        label: "What would you like to talk about?",
        type: "select",
        required: true,
        options: [
          { value: "wordpress-hosting", label: "Managed WordPress hosting" },
          { value: "vps-cloud", label: "VPS or cloud hosting" },
          { value: "web-design", label: "Web design or development" },
          { value: "seo", label: "SEO services" },
          { value: "unsure", label: "Not sure yet" },
        ],
      },
      {
        name: "timeframe",
        label: "When do you want to start?",
        type: "select",
        required: true,
        options: [
          { value: "now", label: "As soon as possible" },
          { value: "1-3-months", label: "In the next 1 to 3 months" },
          { value: "exploring", label: "Just exploring" },
        ],
      },
      { name: "message", label: "About the project", type: "textarea", required: true, hint: "What the site does, what you want to change, any constraints." },
    ],
  },
  {
    title: "When to talk",
    description: "We reply by email to agree a time. No call is booked until you confirm.",
    fields: [
      { name: "timezone", label: "Your time zone", type: "text", required: true, placeholder: "Europe/London" },
      {
        name: "preferredTime",
        label: "Best time of day",
        type: "select",
        required: true,
        options: [
          { value: "morning", label: "Morning" },
          { value: "afternoon", label: "Afternoon" },
          { value: "evening", label: "Evening" },
        ],
      },
    ],
  },
];
