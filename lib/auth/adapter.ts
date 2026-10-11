import type { Adapter, AdapterAccount, AdapterSession, AdapterUser } from "next-auth/adapters";
import { Invitation, type IInvitation } from "@/lib/models/invitation";
import { Account, Session, User, type IUser } from "@/lib/models/user";
import { portalDb } from "@/lib/portal/db";
import { toObjectId } from "@/lib/portal/result";
import { isEnvAdmin } from "./admin-emails";
import { ROLES, toRole, type Role } from "./roles";

/**
 * next-auth adapter on the project's Mongoose connection (users, accounts, sessions collections).
 * Written here because the official MongoDB adapter needs mongodb 6 and Mongoose 9 uses mongodb 7.
 * OAuth tokens are not stored: the portals only need to know who signed in.
 */
const toAdapterUser = (u: IUser): AdapterUser => ({
  id: String(u._id),
  name: u.name ?? null,
  email: u.email,
  image: u.image ?? null,
  emailVerified: u.emailVerified ?? null,
  role: toRole(u.role),
});

function requireId(id: string) {
  const oid = toObjectId(id);
  if (!oid) throw new Error("Invalid user id");
  return oid;
}

const normalEmail = (email: string) => email.trim().toLowerCase();

/** ADMIN_EMAILS wins, then a pending invitation, then guest. */
async function initialRole(email: string): Promise<{ role: Role; invite: IInvitation | null }> {
  if (isEnvAdmin(email)) return { role: ROLES.ADMIN, invite: null };
  const invite = (await Invitation.findOne({ email }).lean()) as IInvitation | null;
  return { role: invite ? toRole(invite.role) : ROLES.GUEST, invite };
}

export function mongooseAdapter(): Adapter {
  return {
    async createUser(user: Omit<AdapterUser, "id">) {
      await portalDb();
      const email = normalEmail(user.email);
      const { role, invite } = await initialRole(email);
      const created = await User.create({ name: user.name ?? null, email, image: user.image ?? null, emailVerified: user.emailVerified ?? null, role, createdAt: new Date() });
      if (invite) await Invitation.deleteOne({ _id: invite._id });
      return toAdapterUser(created.toObject() as IUser);
    },
    async getUser(id) {
      await portalDb();
      const oid = toObjectId(id);
      const u = oid ? ((await User.findById(oid).lean()) as IUser | null) : null;
      return u ? toAdapterUser(u) : null;
    },
    async getUserByEmail(email) {
      await portalDb();
      const u = (await User.findOne({ email: normalEmail(String(email)) }).lean()) as IUser | null;
      return u ? toAdapterUser(u) : null;
    },
    async getUserByAccount({ provider, providerAccountId }) {
      await portalDb();
      const account = await Account.findOne({ provider: String(provider), providerAccountId: String(providerAccountId) }).lean();
      if (!account) return null;
      const u = (await User.findById(account.userId).lean()) as IUser | null;
      return u ? toAdapterUser(u) : null;
    },
    async updateUser(user) {
      await portalDb();
      const oid = toObjectId(user.id);
      // Profile fields only: the role is never taken from the sign-in provider.
      const set: Partial<Pick<IUser, "name" | "image" | "emailVerified">> = {};
      if (user.name !== undefined) set.name = user.name;
      if (user.image !== undefined) set.image = user.image;
      if (user.emailVerified !== undefined) set.emailVerified = user.emailVerified;
      const u = oid ? ((await User.findByIdAndUpdate(oid, { $set: set }, { returnDocument: "after" }).lean()) as IUser | null) : null;
      if (!u) throw new Error("User not found");
      return toAdapterUser(u);
    },
    async linkAccount(account: AdapterAccount) {
      await portalDb();
      await Account.create({ userId: requireId(account.userId), type: account.type, provider: account.provider, providerAccountId: account.providerAccountId });
      return account;
    },
    async createSession({ sessionToken, userId, expires }) {
      await portalDb();
      await Session.create({ sessionToken, userId: requireId(userId), expires });
      return { sessionToken, userId, expires };
    },
    async getSessionAndUser(sessionToken) {
      await portalDb();
      const s = await Session.findOne({ sessionToken: String(sessionToken) }).lean();
      if (!s) return null;
      if (s.expires.getTime() < Date.now()) {
        await Session.deleteOne({ _id: s._id });
        return null;
      }
      const u = (await User.findById(s.userId).lean()) as IUser | null;
      if (!u) return null;
      const session: AdapterSession = { sessionToken: s.sessionToken, userId: String(s.userId), expires: s.expires };
      return { session, user: toAdapterUser(u) };
    },
    async updateSession({ sessionToken, expires }) {
      await portalDb();
      if (!expires) return null;
      const s = await Session.findOneAndUpdate({ sessionToken: String(sessionToken) }, { $set: { expires } }, { returnDocument: "after" }).lean();
      return s ? { sessionToken: s.sessionToken, userId: String(s.userId), expires: s.expires } : null;
    },
    async deleteSession(sessionToken) {
      await portalDb();
      await Session.deleteOne({ sessionToken: String(sessionToken) });
    },
  };
}

/** Promotes an ADMIN_EMAILS user who signed up before their email was added to the list. */
export async function syncEnvAdmin(email: string | null | undefined): Promise<void> {
  if (!email || !isEnvAdmin(email)) return;
  await portalDb();
  await User.updateOne({ email: normalEmail(email), role: { $ne: ROLES.ADMIN } }, { $set: { role: ROLES.ADMIN } });
}
