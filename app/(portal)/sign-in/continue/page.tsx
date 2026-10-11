import { redirect } from "next/navigation";
import { can, homeFor } from "@/lib/auth/permissions";
import { getActor, safeNext } from "@/lib/auth/session";

/** After Google sign-in: admins to /dashboard, staff to /office, guests to the no-access page (or back to the page they asked for). */
export default async function ContinuePage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const actor = await getActor();
  if (!actor) redirect("/sign-in");
  const next = safeNext((await searchParams).next);
  if (next?.startsWith("/dashboard") && can(actor.role, "portal.dashboard")) redirect(next);
  if (next?.startsWith("/office") && can(actor.role, "portal.office")) redirect(next);
  redirect(homeFor(actor.role));
}
