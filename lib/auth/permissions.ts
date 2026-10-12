import { ROLES, type Role } from "./roles";

/**
 * The one place that decides who may do what in the portals. Every server action, route handler and
 * page that reads or changes portal data calls `can` (or `assertCan`); hiding a button is never enough.
 */
export type Action =
  | "post.list"
  | "post.view"
  | "post.create"
  | "post.edit"
  | "post.publish"
  | "post.lock"
  | "post.delete"
  | "team.manage"
  | "announcement.manage"
  | "media.upload"
  | "portal.dashboard";

/** The part of a post a permission depends on. */
export type PostGuard = { locked: boolean };

const ADMIN_ONLY: ReadonlySet<Action> = new Set<Action>([
  "post.publish",
  "post.lock",
  "post.delete",
  "team.manage",
  "announcement.manage",
]);

const STAFF_AND_ADMIN: ReadonlySet<Action> = new Set<Action>(["post.list", "post.view", "post.create", "media.upload", "portal.dashboard"]);

export function can(role: Role | null | undefined, action: Action, post?: PostGuard): boolean {
  if (role !== ROLES.ADMIN && role !== ROLES.STAFF) return false;
  if (role === ROLES.ADMIN) return true;
  if (ADMIN_ONLY.has(action)) return false;
  if (STAFF_AND_ADMIN.has(action)) return true;
  // post.edit: staff may change a post only while it is unlocked. Without the post there is nothing to allow.
  if (action === "post.edit") return post !== undefined && !post.locked;
  return false;
}

export class PermissionError extends Error {
  constructor(public readonly action: Action) {
    super(`Not allowed: ${action}`);
    this.name = "PermissionError";
  }
}

export function assertCan(role: Role | null | undefined, action: Action, post?: PostGuard): void {
  if (!can(role, action, post)) throw new PermissionError(action);
}

/** Where a role lands after sign-in: admins and staff share one dashboard; admin-only screens check their own action. */
export function homeFor(role: Role | null | undefined): "/dashboard" | "/no-access" {
  return can(role, "portal.dashboard") ? "/dashboard" : "/no-access";
}
