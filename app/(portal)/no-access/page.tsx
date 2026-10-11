import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { panelClass } from "@/components/portal/field-styles";
import { SignOutButton } from "@/components/portal/SignOutButton";
import Logo from "@/components/ui/Logo";
import { NO_ACCESS_TEXT } from "@/content/portal-strings";
import { homeFor } from "@/lib/auth/permissions";
import { getActor } from "@/lib/auth/session";

export const metadata: Metadata = { title: NO_ACCESS_TEXT.metaTitle };

/** Where a signed-in guest lands. Someone with a role is sent to their portal instead. */
export default async function NoAccessPage() {
  const actor = await getActor();
  if (!actor) redirect("/sign-in");
  const home = homeFor(actor.role);
  if (home !== "/no-access") redirect(home);

  return (
    <main id="main-content" tabIndex={-1} className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className={`${panelClass} w-full max-w-md`}>
        <Logo />
        <h1 className="t-h3 mt-8 text-foreground">{NO_ACCESS_TEXT.title}</h1>
        <p className="mt-3 text-muted-foreground">{NO_ACCESS_TEXT.body}</p>
        <p className="mt-6 text-sm text-muted-foreground">
          {NO_ACCESS_TEXT.signedInAs} <span className="font-semibold text-foreground">{actor.email}</span>
        </p>
        <div className="mt-6">
          <SignOutButton />
        </div>
      </div>
    </main>
  );
}
