import { NextRequest, NextResponse } from "next/server";
import { FEATURES } from "@/lib/flags";
import { clientIp, rateLimited } from "@/lib/forms/guard";
import { checkDomain, whmcsConfigured } from "@/lib/whmcs/client";
import { normalizeDomain } from "@/lib/whmcs/domain";

/** GET /api/domains/search?q=example.com. Off until FEATURES.domainSearch is on and WHMCS is configured. */
export async function GET(req: NextRequest) {
  if (!FEATURES.domainSearch || !whmcsConfigured()) return NextResponse.json({ error: "Domain search is not available yet." }, { status: 404 });
  if (rateLimited(`domains:${clientIp(req)}`, 30, 60_000)) return NextResponse.json({ error: "Too many searches. Please wait a minute." }, { status: 429 });

  const domain = normalizeDomain(req.nextUrl.searchParams.get("q") ?? "");
  if (!domain) return NextResponse.json({ error: "Enter a full domain name, for example example.com." }, { status: 400 });

  try {
    return NextResponse.json({ domain, status: await checkDomain(domain) }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "We could not check that name right now. Please try again shortly." }, { status: 503 });
  }
}
