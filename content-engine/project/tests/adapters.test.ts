/** The claims and pricing adapters read the host's real files: claims through claimRenders(), prices from the pricing file. */
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { before, test } from "node:test";
import { type Ctx, checkDoc, loadContext, loadDoc } from "../../tools/check-content";
import { collectPriceNumbers, numbersFromPrices } from "../../tools/content/context";

let ctx: Ctx;
before(async () => { ctx = await loadContext(); });

test("every claim's rendering state is what the host's claimRenders() says", async () => {
  const mod = await import("../../../content/claims");
  assert.ok(ctx.claims.length > 0, "the claims registry was read");
  for (const c of ctx.claims) {
    const record = (mod.CLAIMS as readonly { id: string }[]).find((x) => x.id === c.id);
    assert.equal(c.verified, mod.claimRenders(record as never), `claim ${c.id}`);
  }
  assert.equal(ctx.claims.filter((c) => c.verified).length, mod.CLAIMS.filter((c: { verified: boolean }) => c.verified).length);
});

test("prices come from the app's typed loader, in every currency, as the numbers the site shows", async () => {
  const { prices } = await import("../adapters/pricing");
  const { buildPlanCards } = await import("../../../lib/pricing/plans");
  const shown = prices();
  assert.ok(shown.length > 0, "the loader returned prices");
  assert.ok(shown.includes(buildPlanCards("USD")[0].monthly ?? ""), "the first USD plan's monthly price is among them");
  assert.deepEqual([...numbersFromPrices(["$24.99", "₹1,299", "AED 25", "free"])].sort((a, b) => a - b), [25, 24.99, 1299].sort((a, b) => a - b));
  assert.equal(ctx.config.adapters.pricing, "module");
  assert.ok(ctx.priceNumbers.size > 0);
});

test("the json pricing adapter collects the pricing and renewal blocks only, for projects without a loader", () => {
  const set = collectPriceNumbers(JSON.stringify({ limits: { sites: 3 }, plans: [{ pricing: { monthly: { USD: 5.99 } }, renewal: { USD: 7.5 } }] }));
  assert.deepEqual([...set].sort(), [5.99, 7.5]);
  assert.equal(collectPriceNumbers("not json").size, 0);
});

test("a price typed into copy is named as a price from the loader", () => {
  const price = [...ctx.priceNumbers][0];
  const dir = mkdtempSync(join(tmpdir(), "adp-"));
  const file = join(dir, "page.json");
  writeFileSync(file, JSON.stringify({ id: "x", path: "/x", primaryKeyword: "x page", seo: { title: "X", description: "Y" }, rules: { reviewedOn: "2026-10-09" }, sections: [{ id: "a", type: "AnswerBlock", content: { answer: `It costs ${String.fromCharCode(36)}${price} a month.` } }] }));
  const f1 = checkDoc(ctx, loadDoc(ctx, file), { overlap: false }).find((r) => r.id === "F1")!;
  assert.equal(f1.ok, false);
  assert.match(f1.failures[0].message, /pricing file/);
});
