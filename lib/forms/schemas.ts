import { z } from "zod";

/** Shared by the wizard (client) and the API routes (server). Hard caps stop oversized input. */
const text = (label: string, max = 200) => z.string().trim().min(1, `Enter ${label}.`).max(max, `Keep this under ${max} characters.`);
const optional = (max = 200) => z.string().trim().max(max, `Keep this under ${max} characters.`).optional().or(z.literal(""));

const base = {
  name: text("your name", 120),
  email: z.string().trim().email("Enter a valid email address, for example name@company.com.").max(254),
  company: optional(160),
  consent: z.literal("on", { message: "Tick the box so we can contact you about this request." }),
  /** Honeypot: real visitors never fill this in. */
  website: z.string().max(0).optional(),
  /** Epoch ms when the form was first shown. A submit under ~3 seconds is treated as a bot. */
  startedAt: z.coerce.number().int().positive(),
  turnstileToken: z.string().max(4096).optional(),
};

export const migrationSchema = z.object({
  ...base,
  siteUrl: z.string().trim().url("Enter the full address, for example https://example.com.").max(300),
  currentHost: optional(160),
  platform: z.enum(["wordpress", "other-cms", "custom", "unsure"], { message: "Choose what the site runs on." }),
  siteSize: z.enum(["lt1", "1-10", "10-50", "gt50", "unsure"], { message: "Choose an approximate size." }),
  region: z.enum(["us", "uk", "eu", "uae", "none"], { message: "Choose a region." }),
  notes: optional(3000),
});

export const consultationSchema = z.object({
  ...base,
  interest: z.enum(["wordpress-hosting", "vps-cloud", "web-design", "seo", "unsure"], { message: "Choose what you want to talk about." }),
  timeframe: z.enum(["now", "1-3-months", "exploring"], { message: "Choose a timeframe." }),
  message: text("a short description of your project", 3000).refine((v) => v.length >= 20, "Write at least 20 characters so we can prepare."),
  timezone: text("your time zone", 80),
  preferredTime: z.enum(["morning", "afternoon", "evening"], { message: "Choose a time of day." }),
});

export type MigrationInput = z.infer<typeof migrationSchema>;
export type ConsultationInput = z.infer<typeof consultationSchema>;
