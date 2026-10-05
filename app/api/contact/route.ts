import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/contact-schema";
import { ContactMessage } from "@/lib/models/contact-message";
import { connectToDatabase } from "@/lib/mongodb";

// Small in-memory limiter: 5 submissions per IP per 10 minutes. Cloudflare rules should
// sit in front of this; this only stops trivial abuse if the app is reached directly.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function limited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (limited(ip)) {
    return NextResponse.json({ error: "Too many messages. Please try again in a few minutes." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  // Honeypot filled in: pretend success so bots learn nothing, store nothing.
  if (parsed.data.website) return NextResponse.json({ success: true }, { status: 200 });

  try {
    await connectToDatabase();
    const { name, email, subject, message, plan } = parsed.data;
    await ContactMessage.create({ name, email, subject, message, plan: plan ?? null });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    // Never claim success when the message was not stored, and never log the visitor's details.
    return NextResponse.json({ error: "We could not send your message right now. Please try again shortly." }, { status: 503 });
  }
}
