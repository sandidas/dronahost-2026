import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { devBypassRole } from "@/lib/auth/dev-bypass";
import { isLive } from "@/lib/i18n/config";
import { routing } from "./i18n/routing";

const intl = createMiddleware(routing);

/** Team portal routes: not localized. The portals need a session cookie here; the role is checked on the server. */
const PORTAL = /^\/(dashboard|office)(\/|$)/;
const PORTAL_PUBLIC = /^\/(sign-in|no-access)(\/|$)/;
const SESSION_COOKIES = ["__Secure-next-auth.session-token", "next-auth.session-token"];

/** Portal pages are never indexed (the pages also set robots noindex). */
const noIndex = (res: NextResponse) => {
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
};

/**
 * A first segment that looks like a locale: language-region ("en-gb", "de-de") or a known bare language code. A plain
 * two-letter route such as /vs or /kb is a page, not a locale, so it must not match.
 */
const LOCALE_LIKE = /^(?:[a-z]{2}-[a-z]{2}|ar|de|en|es|fr|hi|it|ja|nl|pt|ru|zh)$/;

/**
 * Locale routing. A first segment that looks like a locale but is not live (e.g. /en-gb while the
 * variants are off, or /fr) is sent to the app-wide 404 page, which is server-rendered and branded.
 * The dev showcase (/v2), the team portals, API routes and files are not localized.
 */
export default function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  if (PORTAL.test(pathname)) {
    // Presence only: no database here. Pages, server actions and route handlers check the real role.
    if (SESSION_COOKIES.some((name) => req.cookies.has(name)) || devBypassRole() !== null) return noIndex(NextResponse.next());
    const signIn = new URL("/sign-in", req.url);
    signIn.searchParams.set("next", `${pathname}${search}`);
    return noIndex(NextResponse.redirect(signIn));
  }
  if (PORTAL_PUBLIC.test(pathname)) return noIndex(NextResponse.next());
  const first = pathname.split("/")[1] ?? "";
  if (LOCALE_LIKE.test(first) && !isLive(first)) return NextResponse.rewrite(new URL("/en-us/__locale-not-live", req.url));
  return intl(req);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|v2|.*\\..*).*)"],
};
