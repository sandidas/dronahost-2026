import { expect, test } from "@playwright/test";
import { type RequestField, requestToEmail, validateMigrationRequest } from "../../lib/leads/migration-request";
import { submitMigrationRequest } from "../../lib/leads/submit";

const ALL: RequestField[] = ["siteUrl", "currentHost", "email", "note"];
const good = { siteUrl: "example.com", currentHost: "Some Host", email: "me@example.com", note: "" };

test.describe("free-migration request: validation (Zod)", () => {
  test("a good request passes, and a bare domain becomes a full URL", () => {
    const r = validateMigrationRequest(good, ALL);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.siteUrl).toBe("https://example.com");
  });

  test("each required field fails with its own message", () => {
    const r = validateMigrationRequest({ siteUrl: "not a site", currentHost: "", email: "nope", note: "" }, ALL);
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(Object.keys(r.errors).sort()).toEqual(["currentHost", "email", "siteUrl"]);
      expect(r.errors.email).toMatch(/email address we can reply to/i);
    }
  });

  test("fields nobody typed in get our messages, not Zod's", () => {
    const r = validateMigrationRequest({}, ALL);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.siteUrl).toBe("Enter your website address, for example example.com.");
  });

  test("the note is optional and limited to 500 characters", () => {
    expect(validateMigrationRequest({ ...good, note: "" }, ALL).ok).toBe(true);
    const r = validateMigrationRequest({ ...good, note: "x".repeat(501) }, ALL);
    expect(r.ok).toBe(false);
  });

  test("a field the page does not show is not required", () => {
    expect(validateMigrationRequest({ siteUrl: "example.com", currentHost: "Some Host", email: "me@example.com" }, ["siteUrl", "currentHost", "email"]).ok).toBe(true);
  });

  test("the email a request becomes names every field", () => {
    const r = validateMigrationRequest({ ...good, note: "Please move it this week." }, ALL);
    if (!r.ok) throw new Error("expected a valid request");
    const { subject, body } = requestToEmail(r.data);
    expect(subject).toBe("Free migration request");
    for (const part of ["https://example.com", "Some Host", "me@example.com", "Please move it this week."]) expect(body).toContain(part);
  });
});

test.describe("free-migration request: the one submit function", () => {
  const data = (() => {
    const r = validateMigrationRequest(good, ALL);
    if (!r.ok) throw new Error("fixture");
    return r.data;
  })();

  test("mailto builds a mailto link with the subject and the body", async () => {
    const r = await submitMigrationRequest(data, { mode: "mailto", to: "help@example.com" });
    expect(r.ok && r.via === "mailto" ? r.href : "").toMatch(/^mailto:help@example\.com\?subject=Free%20migration%20request&body=/);
  });

  test("mailto with no address says not-configured instead of sending nowhere", async () => {
    expect(await submitMigrationRequest(data, { mode: "mailto", to: null })).toEqual({ ok: false, reason: "not-configured" });
  });

  test("a filled honeypot looks like success and sends nothing", async () => {
    let called = false;
    const original = globalThis.fetch;
    globalThis.fetch = (async () => { called = true; return new Response("{}"); }) as typeof fetch;
    try {
      const r = await submitMigrationRequest({ ...data, website: "http://spam.example" }, { mode: "route", routeUrl: "http://localhost/none" });
      expect(r.ok).toBe(true);
      expect(called).toBe(false);
    } finally { globalThis.fetch = original; }
  });

  test("route mode posts JSON without the honeypot; a failed response is rejected, a thrown one is a network error", async () => {
    const original = globalThis.fetch;
    let body = "";
    globalThis.fetch = (async (_u: unknown, init?: RequestInit) => { body = String(init?.body); return new Response("{}", { status: 200 }); }) as typeof fetch;
    try {
      expect((await submitMigrationRequest(data, { mode: "route", routeUrl: "http://localhost/lead" })).ok).toBe(true);
      expect(JSON.parse(body)).toMatchObject({ email: "me@example.com" });
      expect(body).not.toContain("website");
      globalThis.fetch = (async () => new Response("{}", { status: 500 })) as typeof fetch;
      expect(await submitMigrationRequest(data, { mode: "route", routeUrl: "http://localhost/lead" })).toEqual({ ok: false, reason: "rejected" });
      globalThis.fetch = (async () => { throw new Error("offline"); }) as typeof fetch;
      expect(await submitMigrationRequest(data, { mode: "route", routeUrl: "http://localhost/lead" })).toEqual({ ok: false, reason: "network" });
    } finally { globalThis.fetch = original; }
  });
});
