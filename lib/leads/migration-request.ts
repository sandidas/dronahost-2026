/**
 * The free-migration request: the fields, their validation (Zod) and how a request is turned into an email.
 * The fields a page shows come from its JSON (`fields`); this file only says what each field accepts.
 */
import { z } from "zod";
import { UI } from "@/content/strings";

export const REQUEST_FIELDS = ["siteUrl", "currentHost", "email", "note"] as const;
export type RequestField = (typeof REQUEST_FIELDS)[number];

const E = UI.migrationRequest.errors;

/** "example.com" and "https://example.com/path" both pass. The value is stored as a full URL. */
const siteUrl = z
  .string()
  .trim()
  .min(1, E.siteUrl)
  .transform((v) => (/^https?:\/\//i.test(v) ? v : `https://${v}`))
  .refine((v) => {
    try {
      const u = new URL(v);
      return u.hostname.includes(".") && !/\s/.test(u.hostname);
    } catch {
      return false;
    }
  }, E.siteUrl);

export const MigrationRequestSchema = z.object({
  siteUrl,
  currentHost: z.string().trim().min(2, E.currentHost).max(80, E.currentHost),
  email: z.string().trim().min(1, E.email).email(E.email).max(120, E.email),
  note: z.string().trim().max(500, E.note).optional().default(""),
  /** The honeypot. People never see it, so a filled value means a bot. It is checked by the form, not shown as an error. */
  website: z.string().max(0).optional().default(""),
});

export type MigrationRequestData = z.infer<typeof MigrationRequestSchema>;
export type FieldErrors = Partial<Record<RequestField, string>>;

/** Validates the fields a page shows. A field the page does not show is not required. */
export function validateMigrationRequest(input: Record<string, string>, fields: readonly RequestField[]): { ok: true; data: MigrationRequestData } | { ok: false; errors: FieldErrors } {
  const shape = Object.fromEntries(fields.map((f) => [f, true])) as Record<RequestField, true>;
  // A field nobody typed in arrives as undefined; treat it as empty so the message is ours, not Zod's.
  const filled: Record<string, string> = { siteUrl: "", currentHost: "", email: "", note: "", ...input };
  const parsed = MigrationRequestSchema.pick(shape).safeParse(filled);
  if (parsed.success) return { ok: true, data: Object.assign({ siteUrl: "", currentHost: "", email: "", note: "", website: input.website ?? "" }, parsed.data as Partial<MigrationRequestData>) };
  const errors: FieldErrors = {};
  for (const issue of parsed.error.issues) {
    const key = issue.path[0] as RequestField;
    if (key && !errors[key]) errors[key] = issue.message;
  }
  return { ok: false, errors };
}

/** The email a request becomes: a subject and a plain-text body. */
export function requestToEmail(d: MigrationRequestData): { subject: string; body: string } {
  const L = UI.migrationRequest.labels;
  const lines = [`${L.siteUrl}: ${d.siteUrl}`, `${L.currentHost}: ${d.currentHost}`, `${L.email}: ${d.email}`];
  if (d.note) lines.push("", `${L.note}: ${d.note}`);
  return { subject: UI.migrationRequest.mailSubject, body: lines.join("\n") };
}
