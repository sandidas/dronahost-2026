import { expect, test } from "@playwright/test";
import home from "../../content/pages/home.json";
import { computeLayoutSignature, findSignatureCollisions } from "../../lib/content/layout-signature";
import { parsePage, visibleSections } from "../../lib/content/page";
import { fillTemplate, passes, resolveClaimRef, resolveFeatureRef, resolveRequires, type ResolveContext } from "../../lib/content/refs";
import { isValidRequires } from "../../lib/content/requires-grammar";
import { plansWithFeature } from "../../lib/content/features";
import { PageSpec } from "../../lib/content/schemas/page";
import { SECTION_TYPES } from "../../lib/content/schemas/sections";

/** A resolve context where the test decides what is true. */
const ctx = (over: Partial<{ claims: string[]; flags: string[]; predicates: string[]; plans: Record<string, string[]> }> = {}): ResolveContext => ({
  claimRenders: (id) => (over.claims ?? []).includes(id),
  flag: (name) => (over.flags ?? []).includes(name),
  predicate: (name) => (over.predicates ?? []).includes(name),
  plansWithFeature: (id) => over.plans?.[id] ?? [],
});

const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v));

test.describe("page schema", () => {
  test("the home page spec from the design doc is valid", () => {
    expect(() => parsePage(home)).not.toThrow();
  });

  test("every section type used by the home page has a schema (the registry type-checks that each has a renderer)", () => {
    for (const s of home.sections) expect(SECTION_TYPES, s.type).toContain(s.type);
  });

  test("rejects an unknown section type, a missing hero, a duplicate id and bad refs", () => {
    const unknown = clone(home);
    (unknown.sections[2] as { type: string }).type = "Banner";
    expect(PageSpec.safeParse(unknown).success).toBe(false);

    const noHero = clone(home);
    noHero.sections = noHero.sections.slice(1);
    expect(PageSpec.safeParse(noHero).success).toBe(false);

    const dup = clone(home);
    (dup.sections[1] as { id: string }).id = "hero";
    expect(PageSpec.safeParse(dup).success).toBe(false);

    const badRef = clone(home);
    (badRef.sections[0] as { content: { assurances: string[] } }).content.assurances = ["money-back"];
    expect(PageSpec.safeParse(badRef).success).toBe(false);

    const badCond = clone(home);
    (badCond.sections[7] as { requires: string }).requires = "FEATURES.noSuchFlag";
    expect(PageSpec.safeParse(badCond).success).toBe(false);
  });

  test("enforces copy limits: h1 length, answer length, FAQ answer length, unknown template token", () => {
    const longH1 = clone(home);
    (longH1.sections[0] as { content: { h1: string } }).content.h1 = "x".repeat(80);
    expect(PageSpec.safeParse(longH1).success).toBe(false);

    const shortAnswer = clone(home);
    shortAnswer.sections.push({ id: "answer-test", type: "AnswerBlock", content: { h2: "What is a test answer?", answer: "Too short to be a real answer." } } as never);
    expect(PageSpec.safeParse(shortAnswer).success).toBe(false);

    const longFaq = clone(home);
    const faq = longFaq.sections.find((s) => s.type === "FAQSection") as { content: { items: { a: string }[] } };
    faq.content.items[0].a = "word ".repeat(90).trim();
    expect(PageSpec.safeParse(longFaq).success).toBe(false);

    const badToken = clone(home);
    const faq2 = badToken.sections.find((s) => s.type === "FAQSection") as { content: { items: { a: string }[] } };
    faq2.content.items[0].a = "Plans start at {{pricing.nonsense}} a month, billed annually, for everyone.";
    expect(PageSpec.safeParse(badToken).success).toBe(false);
  });

  test("page rules: forbidden words, required sections and must-link are checked", () => {
    const forbidden = clone(home);
    (forbidden.sections[0] as { content: { lead: string } }).content.lead = "We run the best servers and move your site across for you.";
    expect(PageSpec.safeParse(forbidden).success).toBe(false);

    const missing = clone(home);
    missing.rules.requiredSections = [...missing.rules.requiredSections, "gallery"];
    expect(PageSpec.safeParse(missing).success).toBe(false);

    const noLink = clone(home);
    noLink.rules.mustLinkTo = ["/never-linked"];
    expect(PageSpec.safeParse(noLink).success).toBe(false);
  });
});

test.describe("resolvers", () => {
  test("claim: renders only when the claim gate says so; unknown claims never render", () => {
    expect(resolveClaimRef("claim:money-back", ctx({ claims: ["money-back"] }))).toBe(true);
    expect(resolveClaimRef("claim:money-back", ctx())).toBe(false);
    expect(resolveClaimRef("claim:does-not-exist")).toBe(false);
  });

  test("the real registry renders the four owner-approved assurances and no unverified claim", () => {
    for (const ref of ["claim:money-back", "claim:support-24-7", "claim:free-migration", "claim:renewal-price-same", "claim:uptime-sla"]) expect(resolveClaimRef(ref)).toBe(true);
    for (const ref of ["claim:managed-hosting-tasks", "claim:migration-process"]) expect(resolveClaimRef(ref)).toBe(false);
  });

  test("feature: needs its claim AND, when plan-specific, a plan that includes it", () => {
    const planData = { staging: ["growth"] };
    expect(resolveFeatureRef("feature:staging", ctx({ claims: ["staging-plans"], plans: planData }))).toBe(true);
    expect(resolveFeatureRef("feature:staging", ctx({ plans: planData }))).toBe(false);
    expect(resolveFeatureRef("feature:staging", ctx({ claims: ["staging-plans"], plans: { staging: [] } }))).toBe(false);
    // Not plan-specific: the claim alone decides.
    expect(resolveFeatureRef("feature:performance", ctx({ claims: ["litespeed"] }))).toBe(true);
    expect(resolveFeatureRef("feature:unknown", ctx({ claims: ["litespeed"] }))).toBe(false);
  });

  test("feature plan availability is read from pricing.json", () => {
    expect(plansWithFeature("staging").length).toBeGreaterThan(0);
    expect(plansWithFeature("performance").length).toBeGreaterThan(0);
    expect(plansWithFeature("nope")).toEqual([]);
  });

  test("requires: flags, claims, features, predicates and && joins", () => {
    expect(resolveRequires(undefined, ctx())).toBe(true);
    expect(resolveRequires("FEATURES.pricesConfirmed", ctx({ flags: ["pricesConfirmed"] }))).toBe(true);
    expect(resolveRequires("FEATURES.pricesConfirmed", ctx())).toBe(false);
    expect(resolveRequires("verifiedReviews", ctx({ predicates: ["verifiedReviews"] }))).toBe(true);
    expect(resolveRequires("FEATURES.pricesConfirmed && claim:money-back", ctx({ flags: ["pricesConfirmed"] }))).toBe(false);
    expect(resolveRequires("FEATURES.pricesConfirmed && claim:money-back", ctx({ flags: ["pricesConfirmed"], claims: ["money-back"] }))).toBe(true);
    expect(isValidRequires("FEATURES.pricesConfirmed")).toBe(true);
    expect(isValidRequires("FEATURES.nope")).toBe(false);
    expect(isValidRequires("somethingElse")).toBe(false);
  });

  test("passes combines requires and requiresClaim", () => {
    expect(passes({ requiresClaim: "claim:a" }, ctx({ claims: ["a"] }))).toBe(true);
    expect(passes({ requires: "FEATURES.pricesConfirmed", requiresClaim: "claim:a" }, ctx({ claims: ["a"] }))).toBe(false);
  });

  test("{{pricing.summary}} is filled from pricing.json and never invented", () => {
    const text = fillTemplate("{{pricing.summary}}");
    expect(text).toMatch(/^Plans start at \$[\d.]+\/month billed annually/);
    expect(text).not.toMatch(/same price|no increase/i);
  });
});

test.describe("section gating on the home page", () => {
  const spec = parsePage(home);
  const ids = (c: ResolveContext) => visibleSections(spec, c).map((s) => s.id);

  test("today (nothing verified, prices unconfirmed) the gated sections drop out and no gap is left", () => {
    expect(ids(ctx())).toEqual(["hero", "products", "ratings", "advantages", "solutions", "ecosystem", "reviews", "faq", "provenance", "cta"]);
  });

  test("section-level requires and requiresClaim each remove a section", () => {
    const all = ctx({ claims: ["free-migration"], predicates: ["leadFormReady"] });
    expect(ids(all)).toEqual(["hero", "products", "ratings", "advantages", "solutions", "ecosystem", "reviews", "process", "plan", "faq", "provenance", "cta"]);
  });
});

test.describe("home conversion links", () => {
  test("the hero's one-field form targets the request form's id, and shows only with it", () => {
    const hero = (home.sections[0] as unknown as { content: { ctaPrimary: { href: string }; form: { targetId: string }; formRequires: string } }).content;
    const form = home.sections.find((s) => s.type === "MigrationRequest") as { id: string; requires: string };
    expect(hero.form.targetId).toBe(form.id);
    expect(hero.ctaPrimary.href).toBe(`/#${form.id}`);
    expect(hero.formRequires).toBe(form.requires);
  });
});

test.describe("layout signature", () => {
  const spec = parsePage(home);

  test("the declared signature matches the sections", () => {
    expect(computeLayoutSignature(spec.sections as never)).toEqual(spec.layoutSignature);
  });

  test("two pages with the same hero variant and first four section types collide", () => {
    const a = { id: "home", sections: spec.sections as never };
    const same = { id: "copycat", sections: spec.sections as never };
    expect(findSignatureCollisions([a, same])).toEqual([{ signature: spec.layoutSignature.join(" > "), pages: ["home", "copycat"] }]);
  });

  test("a different hero variant or different opening sections does not collide", () => {
    const reordered = clone(spec.sections);
    [reordered[2], reordered[3]] = [reordered[3] as never, reordered[2] as never];
    expect(findSignatureCollisions([{ id: "home", sections: spec.sections as never }, { id: "other", sections: reordered as never }])).toEqual([]);
  });

  test("a declared signature that does not match the sections is rejected", () => {
    const wrong = clone(home);
    wrong.layoutSignature = ["ProductHero:dashboard", "PathRouter"];
    expect(PageSpec.safeParse(wrong).success).toBe(false);
  });
});
