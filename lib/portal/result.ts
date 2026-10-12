import { isValidObjectId, Types } from "mongoose";
import { PermissionError } from "@/lib/auth/permissions";
import type { Role } from "@/lib/auth/roles";
import { PORTAL_ERRORS } from "@/content/portal-strings";

/** The signed-in person making a portal request. The role is read from the database on every request. */
export type Actor = { id: string; email: string; name: string; role: Role };

export type Result<T = undefined> = { ok: true; data: T } | { ok: false; error: string; fieldErrors?: Record<string, string> };

export const ok = <T>(data: T): Result<T> => ({ ok: true, data });
export const fail = (error: string, fieldErrors?: Record<string, string>): { ok: false; error: string; fieldErrors?: Record<string, string> } => ({
  ok: false,
  error,
  ...(fieldErrors && { fieldErrors }),
});

/** Casts a request value to an ObjectId, or null. Never passes an object through, so no query operator can be injected. */
export function toObjectId(value: unknown): Types.ObjectId | null {
  if (typeof value !== "string" || value.length !== 24 || !isValidObjectId(value)) return null;
  return new Types.ObjectId(value);
}

export const isDuplicateKey = (err: unknown, field?: string): boolean => {
  if (typeof err !== "object" || err === null || (err as { code?: unknown }).code !== 11000) return false;
  if (!field) return true;
  const pattern = (err as { keyPattern?: Record<string, unknown> }).keyPattern;
  return pattern ? field in pattern : String((err as Error).message).includes(field);
};

/** Logs an event name and the error message only: never request bodies, tokens or personal data. */
export function logError(event: string, err: unknown): void {
  console.error(JSON.stringify({ level: "error", event, message: err instanceof Error ? err.message : String(err) }));
}

/** Runs a service call and turns permission and database failures into a plain message. */
export async function guarded<T>(event: string, run: () => Promise<Result<T>>): Promise<Result<T>> {
  try {
    return await run();
  } catch (err) {
    if (err instanceof PermissionError) return fail(PORTAL_ERRORS.forbidden);
    logError(event, err);
    return fail(PORTAL_ERRORS.database);
  }
}

/** First zod issue per field, keyed by the top-level field name. */
export function fieldErrorsFrom(issues: readonly { path: PropertyKey[]; message: string }[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of issues) {
    // Nested fields keep their full path ("seo.title"), so the form can show the message next to the right input.
    const key = issue.path.map(String).join(".") || "form";
    out[key] ??= issue.message;
  }
  return out;
}
