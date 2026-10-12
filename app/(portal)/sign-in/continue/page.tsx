import { redirect } from "next/navigation";
import { can, homeFor } from "@/lib/auth/permissions";
import { getActor, safeNext } from "@/lib/auth/session";

/** After Google sign-in: admins and staff to /dashboard (or the dashboard page they asked for), guests to the no-access page. */
export default async function ContinuePage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const actor = await getActor();
  if (!actor) redirect("/sign-in");
  const next = safeNext((await searchParams).next);
  if (next && can(actor.role, "portal.dashboard")) redirect(next);
  redirect(homeFor(actor.role));
}
