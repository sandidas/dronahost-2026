import { ROLES, type Role } from "./roles";

/**
 * TEMPORARY, development only: lets the portals be tried without signing in. Set PORTAL_DEV_BYPASS=admin
 * (or staff, or guest) in .env and every request acts as a test user with that role. Remove the line to turn
 * normal sign-in back on. It does nothing unless NODE_ENV is "development" (next dev), so a production
 * build or `next start` always requires a real sign-in, whatever .env says.
 */
const ROLE_BY_NAME: Record<string, Role> = { admin: ROLES.ADMIN, staff: ROLES.STAFF, guest: ROLES.GUEST };

/** The test user's address. `.test` is a reserved domain, so it can never be a real person's Google account. */
export const DEV_BYPASS_EMAIL = "portal-test-user@dronahost.test";

/** The role to act as, or null when the bypass is off (always off outside development). */
export function devBypassRole(): Role | null {
  if (process.env.NODE_ENV !== "development") return null;
  return ROLE_BY_NAME[process.env.PORTAL_DEV_BYPASS?.trim().toLowerCase() ?? ""] ?? null;
}
