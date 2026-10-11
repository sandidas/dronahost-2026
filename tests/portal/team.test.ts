import assert from "node:assert/strict";
import { after, before, beforeEach, describe, it } from "node:test";
import { startDb, stopDb } from "./setup";

type Team = typeof import("@/lib/portal/team");
type Models = typeof import("@/lib/models/user");
let team: Team;
let User: Models["User"];
let Session: Models["Session"];
let Invitation: typeof import("@/lib/models/invitation").Invitation;
let adapter: ReturnType<typeof import("@/lib/auth/adapter").mongooseAdapter>;
let syncEnvAdmin: typeof import("@/lib/auth/adapter").syncEnvAdmin;

const ROLE = { ADMIN: 1001, STAFF: 999, GUEST: 888 } as const;

type TestRole = 1001 | 999 | 888;

async function makeUser(email: string, role: TestRole) {
  const u = await User.create({ email, name: email.split("@")[0], role });
  return { id: String(u._id), email, name: u.name ?? "", role };
}

before(async () => {
  process.env.ADMIN_EMAILS = "Owner@Example.com, second-owner@example.com";
  await startDb();
  team = await import("@/lib/portal/team");
  ({ User, Session } = await import("@/lib/models/user"));
  Invitation = (await import("@/lib/models/invitation")).Invitation;
  const mod = await import("@/lib/auth/adapter");
  adapter = mod.mongooseAdapter();
  syncEnvAdmin = mod.syncEnvAdmin;
  await (await import("@/lib/portal/db")).portalDb();
});
after(stopDb);
beforeEach(async () => {
  await Promise.all([User.deleteMany({}), Session.deleteMany({}), Invitation.deleteMany({})]);
});

describe("first sign-in roles", () => {
  it("a new user is a guest", async () => {
    const u = await adapter.createUser!({ email: "new@example.com", name: "New", image: null, emailVerified: null });
    assert.equal(u.role, ROLE.GUEST);
  });

  it("an ADMIN_EMAILS user becomes admin (case-insensitive)", async () => {
    const u = await adapter.createUser!({ email: "owner@example.com", name: "Owner", image: null, emailVerified: null });
    assert.equal(u.role, ROLE.ADMIN);
  });

  it("an ADMIN_EMAILS user who signed up earlier is promoted at sign-in", async () => {
    await makeUser("second-owner@example.com", ROLE.GUEST);
    await syncEnvAdmin("second-owner@example.com");
    assert.equal((await User.findOne({ email: "second-owner@example.com" }).lean())?.role, ROLE.ADMIN);
  });

  it("an invited email gets the invited role at first sign-in, and the invitation is used up", async () => {
    const admin = await makeUser("a@example.com", ROLE.ADMIN);
    const res = await team.inviteMember(admin, "Writer@Example.com", ROLE.STAFF);
    assert.ok(res.ok && res.data === "invited");
    const u = await adapter.createUser!({ email: "writer@example.com", name: "Writer", image: null, emailVerified: null });
    assert.equal(u.role, ROLE.STAFF);
    assert.equal(await Invitation.countDocuments({}), 0);
  });

  it("the stored role comes back with every session lookup", async () => {
    const u = await adapter.createUser!({ email: "s@example.com", name: "S", image: null, emailVerified: null });
    await adapter.createSession!({ sessionToken: "tok", userId: u.id, expires: new Date(Date.now() + 60_000) });
    await User.updateOne({ email: "s@example.com" }, { $set: { role: ROLE.STAFF } });
    const found = await adapter.getSessionAndUser!("tok");
    assert.equal(found?.user.role, ROLE.STAFF);
  });
});

describe("team management", () => {
  it("only admins manage the team", async () => {
    const staff = await makeUser("staff@example.com", ROLE.STAFF);
    const guest = await makeUser("guest@example.com", ROLE.GUEST);
    assert.equal((await team.listTeam(staff)).ok, false);
    assert.equal((await team.changeRole(staff, guest.id, ROLE.ADMIN)).ok, false);
    assert.equal((await team.inviteMember(staff, "x@example.com", ROLE.ADMIN)).ok, false);
    assert.equal((await User.findById(guest.id).lean())?.role, ROLE.GUEST);
  });

  it("changes a role between admin, staff and guest", async () => {
    const admin = await makeUser("a@example.com", ROLE.ADMIN);
    const other = await makeUser("b@example.com", ROLE.GUEST);
    for (const role of [ROLE.STAFF, ROLE.ADMIN, ROLE.GUEST]) {
      assert.ok((await team.changeRole(admin, other.id, role)).ok);
      assert.equal((await User.findById(other.id).lean())?.role, role);
    }
    assert.equal((await team.changeRole(admin, other.id, 5)).ok, false);
  });

  it("the last admin cannot demote or remove themselves", async () => {
    const admin = await makeUser("a@example.com", ROLE.ADMIN);
    assert.equal((await team.changeRole(admin, admin.id, ROLE.STAFF)).ok, false);
    assert.equal((await team.removeMember(admin, admin.id)).ok, false);
    assert.equal((await User.findById(admin.id).lean())?.role, ROLE.ADMIN);
  });

  it("two admins demoting each other at the same moment still leave an admin", async () => {
    for (let round = 0; round < 10; round++) {
      await User.deleteMany({});
      const a = await makeUser("a@example.com", ROLE.ADMIN);
      const b = await makeUser("b@example.com", ROLE.ADMIN);
      await Promise.all([team.changeRole(a, b.id, ROLE.GUEST), team.changeRole(b, a.id, ROLE.GUEST), team.removeMember(a, a.id), team.removeMember(b, b.id)]);
      assert.ok((await User.countDocuments({ role: ROLE.ADMIN })) >= 1, `round ${round}`);
    }
  });

  it("ADMIN_EMAILS members cannot be demoted from the screen", async () => {
    const admin = await makeUser("a@example.com", ROLE.ADMIN);
    const owner = await makeUser("owner@example.com", ROLE.ADMIN);
    assert.equal((await team.changeRole(admin, owner.id, ROLE.STAFF)).ok, false);
    assert.equal((await team.removeMember(admin, owner.id)).ok, false);
    assert.equal((await User.findById(owner.id).lean())?.role, ROLE.ADMIN);
  });

  it("removing a member makes them a guest and ends their sessions; adding an existing user changes their role", async () => {
    const admin = await makeUser("a@example.com", ROLE.ADMIN);
    const staff = await makeUser("staff@example.com", ROLE.STAFF);
    await Session.create({ sessionToken: "s1", userId: staff.id, expires: new Date(Date.now() + 60_000) });
    assert.ok((await team.removeMember(admin, staff.id)).ok);
    assert.equal((await User.findById(staff.id).lean())?.role, ROLE.GUEST);
    assert.equal(await Session.countDocuments({ userId: staff.id }), 0);
    const res = await team.inviteMember(admin, "staff@example.com", ROLE.STAFF);
    assert.ok(res.ok && res.data === "updated");
    assert.equal((await User.findById(staff.id).lean())?.role, ROLE.STAFF);
  });

  it("refuses bad invite input", async () => {
    const admin = await makeUser("a@example.com", ROLE.ADMIN);
    assert.equal((await team.inviteMember(admin, "not-an-email", ROLE.STAFF)).ok, false);
    assert.equal((await team.inviteMember(admin, { $ne: "" }, ROLE.STAFF)).ok, false);
    assert.equal((await team.inviteMember(admin, "x@example.com", ROLE.GUEST)).ok, false);
  });
});
