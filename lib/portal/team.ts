import { z } from "zod";
import { TEAM_TEXT, PORTAL_ERRORS } from "@/content/portal-strings";
import { isEnvAdmin } from "@/lib/auth/admin-emails";
import { assertCan } from "@/lib/auth/permissions";
import { ROLES, isRole, toRole, type Role } from "@/lib/auth/roles";
import { Invitation, type IInvitation } from "@/lib/models/invitation";
import { Session, User, type IUser } from "@/lib/models/user";
import { portalDb } from "./db";
import { fail, guarded, ok, toObjectId, type Actor, type Result } from "./result";

export type TeamMember = { id: string; name: string | null; email: string; role: Role; joinedAt: string; envAdmin: boolean; isSelf: boolean };
export type PendingInvite = { id: string; email: string; role: Role; createdAt: string };

const Email = z.string().trim().toLowerCase().max(254).pipe(z.email());

export async function listTeam(actor: Actor): Promise<Result<{ members: TeamMember[]; invites: PendingInvite[] }>> {
  return guarded("portal.team.list", async () => {
    assertCan(actor.role, "team.manage");
    await portalDb();
    const [users, invites] = await Promise.all([
      User.find({}, { name: 1, email: 1, role: 1, createdAt: 1 }).sort({ role: -1, createdAt: 1 }).limit(1000).lean() as Promise<IUser[]>,
      Invitation.find({}).sort({ createdAt: -1 }).limit(500).lean() as Promise<IInvitation[]>,
    ]);
    return ok({
      members: users.map((u) => ({
        id: String(u._id),
        name: u.name ?? null,
        email: u.email,
        role: toRole(u.role),
        joinedAt: new Date(u.createdAt ?? u._id.getTimestamp()).toISOString(),
        envAdmin: isEnvAdmin(u.email),
        isSelf: String(u._id) === actor.id,
      })),
      invites: invites.map((i) => ({ id: String(i._id), email: i.email, role: toRole(i.role), createdAt: new Date(i.createdAt).toISOString() })),
    });
  });
}

/**
 * Sets a user's role. Demoting an admin is a conditional update followed by a check: if no admin is left
 * (two admins demoted at the same moment, for example), the change is undone, so the site always keeps
 * at least one admin.
 */
async function applyRole(target: IUser, role: Role): Promise<Result<undefined>> {
  if (target.role === role) return ok(undefined);
  if (isEnvAdmin(target.email) && role !== ROLES.ADMIN) return fail(TEAM_TEXT.errors.envAdmin);
  if (target.role !== ROLES.ADMIN) {
    const res = await User.updateOne({ _id: target._id, role: target.role }, { $set: { role } });
    return res.matchedCount === 1 ? ok(undefined) : fail(TEAM_TEXT.errors.notFound);
  }
  if ((await User.countDocuments({ role: ROLES.ADMIN })) <= 1) return fail(TEAM_TEXT.errors.lastAdmin);
  const res = await User.updateOne({ _id: target._id, role: ROLES.ADMIN }, { $set: { role } });
  if (res.matchedCount !== 1) return fail(TEAM_TEXT.errors.notFound);
  if ((await User.countDocuments({ role: ROLES.ADMIN })) === 0) {
    await User.updateOne({ _id: target._id, role }, { $set: { role: ROLES.ADMIN } });
    return fail(TEAM_TEXT.errors.lastAdmin);
  }
  return ok(undefined);
}

async function findUser(rawId: unknown): Promise<IUser | null> {
  const id = toObjectId(rawId);
  return id ? ((await User.findById(id).lean()) as IUser | null) : null;
}

export async function changeRole(actor: Actor, rawUserId: unknown, rawRole: unknown): Promise<Result<undefined>> {
  return guarded("portal.team.role", async () => {
    assertCan(actor.role, "team.manage");
    const role = typeof rawRole === "string" ? Number(rawRole) : rawRole;
    if (!isRole(role)) return fail(TEAM_TEXT.errors.role);
    await portalDb();
    const target = await findUser(rawUserId);
    if (!target) return fail(TEAM_TEXT.errors.notFound);
    return applyRole({ ...target, role: toRole(target.role) }, role);
  });
}

/** Sets the member back to guest and ends every session they have. Their posts stay. */
export async function removeMember(actor: Actor, rawUserId: unknown): Promise<Result<undefined>> {
  return guarded("portal.team.remove", async () => {
    assertCan(actor.role, "team.manage");
    await portalDb();
    const target = await findUser(rawUserId);
    if (!target) return fail(TEAM_TEXT.errors.notFound);
    const res = await applyRole({ ...target, role: toRole(target.role) }, ROLES.GUEST);
    if (!res.ok) return res;
    await Promise.all([Session.deleteMany({ userId: target._id }), Invitation.deleteMany({ email: target.email })]);
    return ok(undefined);
  });
}

/** Adds a member by email. Someone who has already signed in gets the role now; anyone else gets it at first sign-in. */
export async function inviteMember(actor: Actor, rawEmail: unknown, rawRole: unknown): Promise<Result<"updated" | "invited">> {
  return guarded("portal.team.invite", async () => {
    assertCan(actor.role, "team.manage");
    const email = Email.safeParse(rawEmail);
    if (!email.success) return fail(TEAM_TEXT.errors.email, { email: TEAM_TEXT.errors.email });
    const role = typeof rawRole === "string" ? Number(rawRole) : rawRole;
    if (role !== ROLES.ADMIN && role !== ROLES.STAFF) return fail(TEAM_TEXT.errors.role, { role: TEAM_TEXT.errors.role });
    await portalDb();
    const existing = (await User.findOne({ email: email.data }).lean()) as IUser | null;
    if (existing) {
      const res = await applyRole({ ...existing, role: toRole(existing.role) }, role);
      return res.ok ? ok("updated" as const) : res;
    }
    await Invitation.updateOne(
      { email: email.data },
      { $set: { role, invitedBy: toObjectId(actor.id) }, $setOnInsert: { email: email.data, createdAt: new Date() } },
      { upsert: true },
    );
    return ok("invited" as const);
  });
}

export async function revokeInvitation(actor: Actor, rawId: unknown): Promise<Result<undefined>> {
  return guarded("portal.team.revoke", async () => {
    assertCan(actor.role, "team.manage");
    const id = toObjectId(rawId);
    if (!id) return fail(PORTAL_ERRORS.generic);
    await portalDb();
    await Invitation.deleteOne({ _id: id });
    return ok(undefined);
  });
}

export async function countMembers(actor: Actor): Promise<Result<number>> {
  return guarded("portal.team.count", async () => {
    assertCan(actor.role, "team.manage");
    await portalDb();
    return ok(await User.countDocuments({ role: { $in: [ROLES.ADMIN, ROLES.STAFF] } }));
  });
}
