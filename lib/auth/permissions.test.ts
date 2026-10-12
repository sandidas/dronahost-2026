import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { devBypassRole } from "./dev-bypass";
import { assertCan, can, homeFor, PermissionError, type Action } from "./permissions";
import { ROLES, toRole } from "./roles";

const { ADMIN, STAFF, GUEST } = ROLES;
const unlocked = { locked: false };
const locked = { locked: true };

/** One row per line of the permissions table: [action, post, admin, staff, guest]. */
const TABLE: [string, Action, { locked: boolean } | undefined, boolean, boolean, boolean][] = [
  ["list and view all posts (list)", "post.list", undefined, true, true, false],
  ["list and view all posts (view)", "post.view", undefined, true, true, false],
  ["create a post", "post.create", undefined, true, true, false],
  ["edit an unlocked post", "post.edit", unlocked, true, true, false],
  ["edit a locked post", "post.edit", locked, true, false, false],
  ["publish or unpublish", "post.publish", unlocked, true, false, false],
  ["lock or unlock a post", "post.lock", unlocked, true, false, false],
  ["delete a post", "post.delete", unlocked, true, false, false],
  ["manage team and roles", "team.manage", undefined, true, false, false],
  ["manage announcements", "announcement.manage", undefined, true, false, false],
];

describe("permissions table", () => {
  for (const [label, action, post, admin, staff, guest] of TABLE) {
    it(`${label}: admin ${admin}, staff ${staff}, guest ${guest}`, () => {
      assert.equal(can(ADMIN, action, post), admin);
      assert.equal(can(STAFF, action, post), staff);
      assert.equal(can(GUEST, action, post), guest);
    });
  }
});

describe("staff attempts that must be refused", () => {
  it("staff cannot publish, even an unlocked draft", () => {
    assert.throws(() => assertCan(STAFF, "post.publish", unlocked), PermissionError);
  });
  it("staff cannot delete", () => {
    assert.throws(() => assertCan(STAFF, "post.delete", unlocked), PermissionError);
  });
  it("staff cannot edit a locked post", () => {
    assert.throws(() => assertCan(STAFF, "post.edit", locked), PermissionError);
  });
  it("staff cannot lock or unlock", () => {
    assert.throws(() => assertCan(STAFF, "post.lock", locked), PermissionError);
  });
  it("staff edit without a post to check is refused", () => {
    assert.equal(can(STAFF, "post.edit"), false);
  });
});

describe("signed-out and unknown roles", () => {
  const actions: Action[] = ["post.list", "post.view", "post.create", "post.edit", "post.publish", "post.lock", "post.delete", "team.manage", "announcement.manage", "media.upload", "portal.dashboard", "portal.office"];
  it("a signed-out visitor can do nothing", () => {
    for (const a of actions) assert.equal(can(null, a, unlocked), false, a);
    for (const a of actions) assert.equal(can(undefined, a, unlocked), false, a);
  });
  it("an unknown stored role is treated as a guest", () => {
    assert.equal(toRole(1), GUEST);
    assert.equal(toRole("1001"), GUEST);
    assert.equal(toRole(1001), ADMIN);
  });
});

describe("portal access", () => {
  it("only admins open the dashboard", () => {
    assert.equal(can(ADMIN, "portal.dashboard"), true);
    assert.equal(can(STAFF, "portal.dashboard"), false);
    assert.equal(can(GUEST, "portal.dashboard"), false);
  });
  it("admins and staff open the office", () => {
    assert.equal(can(ADMIN, "portal.office"), true);
    assert.equal(can(STAFF, "portal.office"), true);
    assert.equal(can(GUEST, "portal.office"), false);
  });
  it("sends each role to its home after sign-in", () => {
    assert.equal(homeFor(ADMIN), "/dashboard");
    assert.equal(homeFor(STAFF), "/office");
    assert.equal(homeFor(GUEST), "/no-access");
    assert.equal(homeFor(null), "/no-access");
  });
  it("uploads are for staff and admins", () => {
    assert.equal(can(STAFF, "media.upload"), true);
    assert.equal(can(GUEST, "media.upload"), false);
  });
});

describe("development sign-in bypass (PORTAL_DEV_BYPASS)", () => {
  const env = process.env as Record<string, string | undefined>;
  const run = (nodeEnv: string, value: string | undefined) => {
    const saved = { NODE_ENV: env.NODE_ENV, PORTAL_DEV_BYPASS: env.PORTAL_DEV_BYPASS };
    env.NODE_ENV = nodeEnv;
    env.PORTAL_DEV_BYPASS = value;
    try {
      return devBypassRole();
    } finally {
      Object.assign(env, saved);
    }
  };

  it("is off outside development, whatever the variable says", () => {
    for (const nodeEnv of ["production", "test", ""]) assert.equal(run(nodeEnv, "admin"), null);
  });

  it("is off in development when the variable is empty or unknown", () => {
    for (const value of [undefined, "", "root", "1001"]) assert.equal(run("development", value), null);
  });

  it("maps admin, staff and guest to their roles in development", () => {
    assert.equal(run("development", "admin"), ADMIN);
    assert.equal(run("development", " Staff "), STAFF);
    assert.equal(run("development", "guest"), GUEST);
  });
});
