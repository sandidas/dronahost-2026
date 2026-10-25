import band from "@/content/sections/support-band.json";
import { defaultContext, passes } from "@/lib/content/refs";
import { SECTION_REGISTRY } from "@/lib/content/registry";
import * as S from "@/lib/content/schemas/sections";

// Validated once at build time, like a page spec: an invalid band fails the build.
const spec = S.SupportTeam.parse(band);

/**
 * "Real support from real people, 24/7" before the footer on every marketing page (owner, 2026-10-11). The copy lives in
 * content/sections/support-band.json; it renders through the same registry entry as a page section, so its claim gate
 * (support-24-7) applies here too.
 */
export default function GlobalSupport() {
  if (!passes(spec)) return null;
  return SECTION_REGISTRY.SupportTeam.render(spec, defaultContext);
}
