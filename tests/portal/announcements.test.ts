import assert from "node:assert/strict";
import { after, before, beforeEach, describe, it } from "node:test";
import { startDb, stopDb } from "./setup";

type Ann = typeof import("@/lib/portal/announcements");
let ann: Ann;
let Announcement: typeof import("@/lib/models/announcement").Announcement;

const ADMIN = { id: "65f000000000000000000001", email: "admin@example.com", name: "Ada", role: 1001 as const };
const STAFF = { id: "65f000000000000000000002", email: "staff@example.com", name: "Sam", role: 999 as const };
const base = { message: "Maintenance on Sunday", linkUrl: "", startsAt: "", endsAt: "", active: true };
const HOUR = 3_600_000;

before(async () => {
  await startDb();
  ann = await import("@/lib/portal/announcements");
  Announcement = (await import("@/lib/models/announcement")).Announcement;
  await (await import("@/lib/portal/db")).portalDb();
});
after(stopDb);
beforeEach(async () => {
  await Announcement.deleteMany({});
});

describe("announcements", () => {
  it("only admins manage announcements", async () => {
    assert.equal((await ann.saveAnnouncement(STAFF, null, base)).ok, false);
    assert.equal((await ann.listAnnouncements(STAFF)).ok, false);
  });

  it("shows active announcements inside their time window only", async () => {
    const now = Date.now();
    await ann.saveAnnouncement(ADMIN, null, base);
    await ann.saveAnnouncement(ADMIN, null, { ...base, message: "Future", startsAt: new Date(now + HOUR).toISOString() });
    await ann.saveAnnouncement(ADMIN, null, { ...base, message: "Past", endsAt: new Date(now - HOUR).toISOString(), startsAt: new Date(now - 2 * HOUR).toISOString() });
    await ann.saveAnnouncement(ADMIN, null, { ...base, message: "Off", active: false });
    const live = await ann.findActiveAnnouncements(new Date(now));
    assert.deepEqual(live.map((a) => a.message), ["Maintenance on Sunday"]);
  });

  it("validates message, link and window", async () => {
    assert.equal((await ann.saveAnnouncement(ADMIN, null, { ...base, message: "" })).ok, false);
    assert.equal((await ann.saveAnnouncement(ADMIN, null, { ...base, message: "x".repeat(281) })).ok, false);
    assert.equal((await ann.saveAnnouncement(ADMIN, null, { ...base, linkUrl: "javascript:alert(1)" })).ok, false);
    assert.equal((await ann.saveAnnouncement(ADMIN, null, { ...base, startsAt: "2026-02-01T00:00:00Z", endsAt: "2026-01-01T00:00:00Z" })).ok, false);
    assert.ok((await ann.saveAnnouncement(ADMIN, null, { ...base, linkUrl: "/status" })).ok);
  });

  it("stores HTML in a message as plain text", async () => {
    const res = await ann.saveAnnouncement(ADMIN, null, { ...base, message: "<b>bold</b>" });
    assert.ok(res.ok);
    assert.equal(res.data.message, "<b>bold</b>");
  });
});

describe("indexes on a fresh database", () => {
  it("creates the unique email and slug indexes and the published-by-date index", async () => {
    const { default: mongoose } = await import("mongoose");
    const db = mongoose.connection.db!;
    const users = await db.collection("users").indexes();
    const posts = await db.collection("posts").indexes();
    assert.ok(users.some((i) => i.key.email === 1 && i.unique));
    assert.ok(posts.some((i) => i.key.slug === 1 && i.unique));
    assert.ok(posts.some((i) => i.key.status === 1 && i.key.publishedAt === -1));
    const sessions = await db.collection("sessions").indexes();
    assert.ok(sessions.some((i) => i.key.sessionToken === 1 && i.unique));
  });
});
