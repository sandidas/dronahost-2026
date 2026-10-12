import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { cache } from "react";
import type { Actor } from "@/lib/portal/result";
import { DEV_BYPASS_EMAIL, devBypassRole } from "./dev-bypass";
import { can, homeFor, type Action } from "./permissions";
import { toRole, type Role } from "./roles";
import { authOptions } from "./options";

/** The signed-in person with the role currently in the database, or null. Read once per request. */
export const getActor = cache(async (): Promise<Actor | null> => {
  const bypassRole = devBypassRole();
  if (bypassRole !== null) return devBypassActor(bypassRole);
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!user?.id || !user.email) return null;
  return { id: user.id, email: user.email, name: user.name ?? "", role: toRole(user.role) };
});

/**
 * TEMPORARY (lib/auth/dev-bypass.ts): the test user, stored like any user so posts get a real author id.
 * Its role follows PORTAL_DEV_BYPASS on every request.
 */
async function devBypassActor(role: Role): Promise<Actor> {
  const [{ portalDb }, { User }] = await Promise.all([import("@/lib/portal/db"), import("@/lib/models/user")]);
  await portalDb();
  const user = await User.findOneAndUpdate(
    { email: DEV_BYPASS_EMAIL },
    { $set: { role }, $setOnInsert: { email: DEV_BYPASS_EMAIL, name: "Test user (sign-in off)", createdAt: new Date() } },
    { upsert: true, returnDocument: "after" },
  ).lean();
  return { id: String(user!._id), email: DEV_BYPASS_EMAIL, name: user?.name ?? "", role };
}

/** Paths a sign-in may return to. Anything else goes to the role's home. */
export function safeNext(next: unknown): string | null {
  if (typeof next !== "string" || next.length > 300) return null;
  return /^\/dashboard(\/[A-Za-z0-9/_-]*)?(\?[A-Za-z0-9=&_-]*)?$/.test(next) ? next : null;
}

/**
 * Page guard for the dashboard. Signed-out visitors go to sign-in; a signed-in person who may not use the page goes to
 * their home (staff on an admin-only page to /dashboard, guests to the no-access page).
 */
export async function requirePortal(action: Action, path: string): Promise<Actor> {
  const actor = await getActor();
  if (!actor) redirect(`/sign-in?next=${encodeURIComponent(path)}`);
  if (!can(actor.role, action)) redirect(homeFor(actor.role));
  return actor;
}
