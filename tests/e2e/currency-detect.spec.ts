import { expect, test } from "@playwright/test";
import { currencyForCountry, currencyForLanguage, currencyForPageLocale, currencyForTimeZone, detectCurrency } from "../../lib/pricing/detect";

test.describe("currency detection (lib/pricing/detect.ts)", () => {
  test("countries map to the offered currency", () => {
    expect(currencyForCountry("GB")).toBe("GBP");
    expect(currencyForCountry("je")).toBe("GBP");
    expect(currencyForCountry("AE")).toBe("AED");
    expect(currencyForCountry("IN")).toBe("INR");
    for (const cc of ["DE", "IE", "NL", "FR"]) expect(currencyForCountry(cc), cc).toBe("EUR");
    // European countries outside the euro get the nearest priced currency.
    expect(currencyForCountry("PL")).toBe("EUR");
    expect(currencyForCountry("US")).toBe("USD");
    expect(currencyForCountry("CA")).toBe("USD");
    // Unknown, Tor and missing give no answer, so the next signal decides.
    for (const cc of ["XX", "T1", "", null, undefined, "GBR"]) expect(currencyForCountry(cc)).toBeNull();
  });

  test("time zones and languages", () => {
    expect(currencyForTimeZone("Europe/London")).toBe("GBP");
    expect(currencyForTimeZone("Asia/Calcutta")).toBe("INR");
    expect(currencyForTimeZone("Asia/Dubai")).toBe("AED");
    expect(currencyForTimeZone("Europe/Berlin")).toBe("EUR");
    expect(currencyForTimeZone("America/New_York")).toBe("USD");
    expect(currencyForTimeZone("Europe/Moscow")).toBeNull();
    expect(currencyForLanguage("en-GB")).toBe("GBP");
    expect(currencyForLanguage("hi-IN")).toBe("INR");
    expect(currencyForLanguage("ar-AE")).toBe("AED");
    expect(currencyForLanguage("de")).toBe("EUR");
    expect(currencyForLanguage("en")).toBeNull();
    expect(currencyForPageLocale("en-US")).toBeNull();
    expect(currencyForPageLocale("en-GB")).toBe("GBP");
  });

  test("the strongest signal wins: regional page, then IP, then time zone, then language", () => {
    expect(detectCurrency({ pageLocale: "en-GB", ipCountry: "IN" })).toEqual({ currency: "GBP", source: "page" });
    expect(detectCurrency({ pageLocale: "en-US", ipCountry: "AE", timeZone: "Europe/London" })).toEqual({ currency: "AED", source: "ip" });
    expect(detectCurrency({ ipCountry: "XX", timeZone: "Asia/Kolkata", languages: ["en-GB"] })).toEqual({ currency: "INR", source: "timezone" });
    expect(detectCurrency({ timeZone: "Europe/Moscow", languages: ["en", "de-AT"] })).toEqual({ currency: "EUR", source: "language" });
    expect(detectCurrency({})).toEqual({ currency: "USD", source: "default" });
  });
});

test.describe("/api/geo", () => {
  test("reads the Cloudflare country header and is never cached", async ({ request }) => {
    const gb = await request.get("/api/geo", { headers: { "CF-IPCountry": "GB" } });
    expect(gb.ok()).toBe(true);
    expect(await gb.json()).toEqual({ country: "GB", currency: "GBP" });
    expect(gb.headers()["cache-control"]).toContain("no-store");
    expect(gb.headers()["set-cookie"]).toBeUndefined();
    const none = await request.get("/api/geo");
    expect(await none.json()).toEqual({ country: null, currency: null });
  });
});
