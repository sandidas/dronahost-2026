import { expect, test } from "@playwright/test";
import { spawnSync } from "node:child_process";

const scan = (file: string) => spawnSync("npx", ["tsx", "scripts/check-copy-source.ts", file], { encoding: "utf8" });

test.describe("check-copy-source (blueprint rule: page copy is not in a component)", () => {
  test("a component that reads its text from props and content/strings.ts passes", () => {
    const r = scan("tests/fixtures/copy-source/clean.tsx.txt");
    expect(r.status, r.stdout).toBe(0);
  });

  test("JSX text, a text attribute, a default value, an object property and a conditional string each fail", () => {
    const r = scan("tests/fixtures/copy-source/dirty.tsx.txt");
    expect(r.status).toBe(1);
    for (const needle of ["Why customers choose us", "Close the dialog", "Click here to continue", "Our friendly team", "Ready to ship"]) expect(r.stdout, needle).toContain(needle);
  });

  test("every section component the home page renders passes today", () => {
    const r = spawnSync("npx", ["tsx", "scripts/check-copy-source.ts"], { encoding: "utf8" });
    expect(r.status, r.stdout).toBe(0);
  });
});
