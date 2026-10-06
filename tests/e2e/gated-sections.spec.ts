import { expect, test } from "@playwright/test";
import { CLAIMS } from "../../content/claims";
import { SAMPLE_PATHS, SAMPLE_SPLIT_KEEP, SAMPLE_SPLIT_LOOK_AFTER } from "../../content/placeholders";
import { visibleItems } from "../../lib/sections/gated";

const items = [{ id: "plain" }, { id: "gated", claim: "backups" }, { id: "other", claim: "litespeed" }];

test.describe("claim-gated list items", () => {
  test("an item with no claim always stays; gated items follow the claim gate", () => {
    expect(visibleItems(items).map((i) => i.id)).toEqual(["plain"]);
    expect(visibleItems(items, { check: (id) => id === "backups" }).map((i) => i.id)).toEqual(["plain", "gated"]);
    expect(visibleItems(items, { check: () => true }).map((i) => i.id)).toEqual(["plain", "gated", "other"]);
  });

  test("showAll forces everything on, for the showcase only", () => {
    expect(visibleItems(items, { showAll: true }).map((i) => i.id)).toEqual(["plain", "gated", "other"]);
  });

  test("every claim id used by the draft home copy exists in the registry and is not rendering yet", () => {
    const ids = [...SAMPLE_PATHS, ...SAMPLE_SPLIT_LOOK_AFTER, ...SAMPLE_SPLIT_KEEP].map((i) => i.claim).filter((c): c is string => Boolean(c));
    expect(ids.length).toBeGreaterThan(0);
    for (const id of ids) {
      const claim = CLAIMS.find((c) => c.id === id);
      expect(claim, `claim "${id}" is missing from claims.ts`).toBeDefined();
      expect(claim?.status, `claim "${id}" must start unverified`).toBe("unverified");
      expect(claim?.verified).toBe(false);
    }
  });

  test("as shipped today the router has a single ungated path, so it would be omitted", () => {
    expect(visibleItems(SAMPLE_PATHS).length).toBeLessThan(2);
  });

  test("every section 7 capability is listed as an unverified feature claim", () => {
    const expected = ["backups", "backup-retention", "staging-plans", "litespeed", "ssh-wp-cli", "malware-scanning", "business-hosting-scope", "managed-vps-scope", "website-design-service", "migration-process", "free-ssl", "cloudflare-cdn"];
    for (const id of expected) {
      const claim = CLAIMS.find((c) => c.id === id);
      expect(claim, id).toBeDefined();
      expect(claim?.status, id).toBe("unverified");
    }
  });
});
