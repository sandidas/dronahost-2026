import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ConsentEvent } from "@/lib/models/consent-event";
import { connectToDatabase } from "@/lib/mongodb";
import { UI } from "@/content/strings";

const schema = z.object({
  id: z.string().uuid(),
  preferences: z.boolean(),
  analytics: z.boolean(),
  marketing: z.boolean(),
  v: z.literal(1),
});

/** Stores a consent decision. The banner works without this; a failed log never blocks the visitor. */
export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: UI.errors.consentUnreadable }, { status: 400 });
  try {
    await connectToDatabase();
    const { id, preferences, analytics, marketing, v } = parsed.data;
    await ConsentEvent.create({ consentId: id, preferences, analytics, marketing, policyVersion: v });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: UI.errors.consentNotStored }, { status: 503 });
  }
}
