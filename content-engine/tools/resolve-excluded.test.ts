import assert from "node:assert/strict";
import { test } from "node:test";
import { parseRegister } from "./register";
import { resolveInput } from "./resolve";

const decide = (kw: string, register: ReturnType<typeof parseRegister>) =>
  resolveInput(kw, { config: { name: "Example" } as never, rules: { planRouting: [], intentByPlan: {} } as never, register, governor: null }).decision;

const REGISTER = `## Plan 01 Money

| Keyword | Locale | Secondary | Intent check | Volume / KD | Target URL | Owner | Status | Next review | AI cited |
|---|---|---|---|---|---|---|---|---|---|
| web hosting for multiple websites | en-US | | | | \`/business-hosting\` | | validated | | |

## Excluded keywords (do not target)

| Keyword | Reason |
|---|---|
| best web hosting, web hosting (exact) | Head terms |
`;

test("an (exact) exclusion blocks only that search, a plain one blocks every keyword containing it", () => {
  const register = parseRegister(REGISTER);
  assert.deepEqual(register.excluded[0]?.exact, ["web hosting"]);
  assert.equal(decide("web hosting", register), "reject");
  assert.equal(decide("best web hosting for agencies", register), "reject");
  assert.notEqual(decide("web hosting for multiple websites", register), "reject");
});
