import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { isLive } from "@/lib/i18n/config";
import { routing } from "./i18n/routing";

const intl = createMiddleware(routing);
const LOCALE_LIKE = /^[a-z]{2}(-[a-z]{2})?$/;

/**
 * Locale routing. A first segment that looks like a locale but is not live (e.g. /en-gb while the
 * variants are off, or /fr) is sent to the app-wide 404 page, which is server-rendered and branded.
 * The dev showcase (/v2), API routes and files are not localized.
 */
export default function proxy(req: NextRequest) {
  const first = req.nextUrl.pathname.split("/")[1] ?? "";
  if (LOCALE_LIKE.test(first) && !isLive(first)) return NextResponse.rewrite(new URL("/en-us/__locale-not-live", req.url));
  return intl(req);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|v2|.*\\..*).*)"],
};
