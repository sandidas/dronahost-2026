import { NextRequest, NextResponse } from "next/server";
import type { z } from "zod";
import { notifyTeam } from "@/lib/email/ses";
import { FormSubmission } from "@/lib/models/form-submission";
import { connectToDatabase } from "@/lib/mongodb";
import { clientIp, rateLimited, tooFast } from "./guard";
import { verifyTurnstile } from "./turnstile";
import { UI } from "@/content/strings";

type FormBase = { email: string; startedAt: number; website?: string; turnstileToken?: string } & Record<string, unknown>;

type Options = {
  type: "migration" | "consultation";
  schema: z.ZodType<FormBase>;
  subject: (d: Record<string, unknown>) => string;
};

const retentionDays = () => {
  const n = Number(process.env.FORM_RETENTION_DAYS);
  return Number.isFinite(n) && n > 0 ? n : 730;
};

/**
 * Shared POST handler for the multi-step forms: rate limit, Zod validation, honeypot, timing
 * check, Turnstile, store with a retention date, then email the team through SES. Replies
 * success only when the submission was stored.
 */
export function createFormHandler({ type, schema, subject }: Options) {
  return async function POST(req: NextRequest) {
    const ip = clientIp(req);
    if (rateLimited(`${type}:${ip}`)) return NextResponse.json({ error: "Too many requests. Please try again in a few minutes." }, { status: 429 });

    const body = await req.json().catch(() => null);
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: UI.errors.fixFields, details: parsed.error.flatten().fieldErrors }, { status: 400 });

    const { website, startedAt, turnstileToken, ...data } = parsed.data;
    // Bots learn nothing: pretend success, store nothing.
    if (website || tooFast(startedAt)) return NextResponse.json({ success: true });
    if (!(await verifyTurnstile(turnstileToken, ip))) {
      return NextResponse.json({ error: "We could not verify that you are human. Please reload the page and try again." }, { status: 400 });
    }

    try {
      await connectToDatabase();
      const doc = await FormSubmission.create({
        type,
        email: data.email,
        data,
        expiresAt: new Date(Date.now() + retentionDays() * 24 * 60 * 60 * 1000),
      });
      const lines = Object.entries(data).map(([k, v]) => `${k}: ${String(v ?? "")}`);
      const emailed = await notifyTeam({ subject: subject(parsed.data), body: lines.join("\n"), replyTo: data.email });
      if (emailed) await FormSubmission.updateOne({ _id: doc._id }, { emailed: true });
      return NextResponse.json({ success: true });
    } catch {
      return NextResponse.json({ error: "We could not send your request right now. Please try again shortly." }, { status: 503 });
    }
  };
}
