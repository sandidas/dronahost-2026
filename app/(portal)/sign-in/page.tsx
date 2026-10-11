import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { GoogleSignInButton } from "@/components/portal/GoogleSignInButton";
import { panelClass } from "@/components/portal/field-styles";
import Logo from "@/components/ui/Logo";
import { SIGN_IN_TEXT } from "@/content/portal-strings";
import { getActor, safeNext } from "@/lib/auth/session";

export const metadata: Metadata = { title: SIGN_IN_TEXT.metaTitle, description: SIGN_IN_TEXT.metaDescription };

type SearchParams = Promise<{ next?: string; error?: string }>;

/** Google sign-in for the team portals. */
export default async function SignInPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const next = safeNext(sp.next);
  const continueUrl = `/sign-in/continue${next ? `?next=${encodeURIComponent(next)}` : ""}`;
  if (await getActor()) redirect(continueUrl);

  const configured = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
  const errorKey = !configured ? "Configuration" : typeof sp.error === "string" ? sp.error : null;
  const error = errorKey ? (SIGN_IN_TEXT.errors[errorKey] ?? SIGN_IN_TEXT.errors.default) : null;

  return (
    <main id="main-content" tabIndex={-1} className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className={`${panelClass} w-full max-w-md`}>
        <Logo />
        <h1 className="t-h3 mt-8 text-foreground">{SIGN_IN_TEXT.title}</h1>
        <p className="mt-3 text-muted-foreground">{SIGN_IN_TEXT.intro}</p>
        {error && (
          <p role="alert" className="mt-6 rounded-lg border border-danger/30 bg-danger-surface px-4 py-3 text-sm font-medium text-danger">
            {error}
          </p>
        )}
        {configured && (
          <div className="mt-8">
            <GoogleSignInButton callbackUrl={continueUrl} />
          </div>
        )}
      </div>
    </main>
  );
}
