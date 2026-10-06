import { z } from "zod";

/** Shared by the contact form (client) and /api/contact (server). Hard caps stop oversized input. */
export const contactSchema = z.object({
  name: z.string().trim().min(1, "Enter your name.").max(120, "Keep your name under 120 characters."),
  email: z.string().trim().email("Enter a valid email address, for example name@company.com.").max(254),
  subject: z.string().trim().min(1, "Enter a subject.").max(200, "Keep the subject under 200 characters."),
  message: z.string().trim().min(10, "Write at least 10 characters so we can help.").max(5000, "Keep your message under 5,000 characters."),
  plan: z.string().trim().max(40).optional(),
  /** Honeypot: real visitors never fill this in. */
  website: z.string().max(200).optional(),
  startedAt: z.coerce.number().int().positive().optional(),
  turnstileToken: z.string().max(4096).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
