/**
 * Development only: creates (or reuses) a portal user and a database session for them, and prints the
 * session cookie to set in the browser, so the portals can be tried without Google credentials.
 * Usage: MONGODB_URI=... npx tsx scripts/portal-dev-session.ts <email> <admin|staff|guest> [name]
 * Refuses to run when NODE_ENV is production.
 */
import { randomBytes } from "node:crypto";

const ROLE_BY_NAME = { admin: 1001, staff: 999, guest: 888 } as const;

async function main() {
  if (process.env.NODE_ENV === "production") throw new Error("Not for production");
  const [email, roleName, name] = process.argv.slice(2);
  if (!email || !(roleName in ROLE_BY_NAME)) throw new Error("Usage: portal-dev-session.ts <email> <admin|staff|guest> [name]");
  const { portalDb } = await import("../lib/portal/db");
  const { User, Session } = await import("../lib/models/user");
  const { default: mongoose } = await import("mongoose");
  await portalDb();
  const role = ROLE_BY_NAME[roleName as keyof typeof ROLE_BY_NAME];
  const user = await User.findOneAndUpdate(
    { email: email.toLowerCase() },
    { $set: { role, name: name ?? email.split("@")[0] }, $setOnInsert: { email: email.toLowerCase(), createdAt: new Date() } },
    { upsert: true, returnDocument: "after" },
  );
  const sessionToken = randomBytes(32).toString("hex");
  await Session.create({ sessionToken, userId: user!._id, expires: new Date(Date.now() + 24 * 60 * 60 * 1000) });
  console.log(`next-auth.session-token=${sessionToken}`);
  await mongoose.disconnect();
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
