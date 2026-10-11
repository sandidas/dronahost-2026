import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { cache } from "react";
import type { Actor } from "@/lib/portal/result";
import { can, homeFor } from "./permissions";
import { toRole } from "./roles";
import { authOptions } from "./options";

/** The signed-in person with the role currently in the database, or null. Read once per request. */
export const getActor = cache(async (): Promise<Actor | null> => {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!user?.id || !user.email) return null;
  return { id: user.id, email: user.email, name: user.name ?? "", role: toRole(user.role) };
});

/** Paths a sign-in may return to. Anything else goes to the role's home. */
export function safeNext(next: unknown): string | null {
  if (typeof next !== "string" || next.length > 300) return null;
  return /^\/(dashboard|office)(\/[A-Za-z0-9/_-]*)?(\?[A-Za-z0-9=&_-]*)?$/.test(next) ? next : null;
}

/**
 * Page guard for the portals. Signed-out visitors go to sign-in; a signed-in person without the role goes
 * to their own home (staff to /office, guests to the no-access page).
 */
export async function requirePortal(portal: "portal.dashboard" | "portal.office", path: string): Promise<Actor> {
  const actor = await getActor();
  if (!actor) redirect(`/sign-in?next=${encodeURIComponent(path)}`);
  if (!can(actor.role, portal)) redirect(homeFor(actor.role));
  return actor;
}
