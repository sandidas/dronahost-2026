import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/contact-schema";
import { notifyTeam } from "@/lib/email/ses";
import { clientIp, rateLimited, tooFast } from "@/lib/forms/guard";
import { verifyTurnstile } from "@/lib/forms/turnstile";
import { ContactMessage } from "@/lib/models/contact-message";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  if (rateLimited(`contact:${ip}`)) {
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

  // Honeypot filled in or submitted implausibly fast: pretend success, store nothing.
  if (parsed.data.website || (parsed.data.startedAt && tooFast(parsed.data.startedAt))) return NextResponse.json({ success: true }, { status: 200 });
  if (!(await verifyTurnstile(parsed.data.turnstileToken, ip))) {
    return NextResponse.json({ error: "We could not verify that you are human. Please reload the page and try again." }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const { name, email, subject, message, plan } = parsed.data;
    await ContactMessage.create({ name, email, subject, message, plan: plan ?? null });
    await notifyTeam({ subject: `Contact: ${subject}`, body: `From: ${name} <${email}>\nPlan: ${plan ?? "none"}\n\n${message}`, replyTo: email });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    // Never claim success when the message was not stored, and never log the visitor's details.
    return NextResponse.json({ error: "We could not send your message right now. Please try again shortly." }, { status: 503 });
  }
}
