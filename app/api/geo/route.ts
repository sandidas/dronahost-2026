import { NextRequest, NextResponse } from "next/server";
import { currencyForCountry } from "@/lib/pricing/detect";

// Per visitor: never cached by Next, Nginx or Cloudflare.
export const dynamic = "force-dynamic";

/** Country headers set by the edge in front of the app. Cloudflare (CF-IPCountry) is ours; the others cover a move. */
const COUNTRY_HEADERS = ["cf-ipcountry", "cloudfront-viewer-country", "x-vercel-ip-country", "x-country-code"];

/**
 * The visitor's country as the edge sees it, and the offered currency for it, so the currency selector can start on the
 * right one. Reads a request header only: no IP is stored, logged or sent anywhere, and no cookie is set. `country` is null
 * when no edge header is present (local development, direct access), and the browser then uses its own signals.
 */
export function GET(req: NextRequest) {
  const raw = COUNTRY_HEADERS.map((h) => req.headers.get(h)).find(Boolean) ?? null;
  const currency = currencyForCountry(raw);
  const country = currency ? (raw as string).trim().toUpperCase() : null;
  return NextResponse.json({ country, currency }, { headers: { "Cache-Control": "private, no-store", Vary: "CF-IPCountry" } });
}
