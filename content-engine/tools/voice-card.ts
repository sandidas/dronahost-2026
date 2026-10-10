/**
 * Prints the project's brand and voice as one Markdown card, from project/settings.json and project/voice.json (through
 * the config). A writer or an agent reads it before drafting, so every draft starts from the same settings.
 * Usage: npx tsx content-engine/tools/voice-card.ts [--json] [--help]. Exit 1 when the config names no settings or voice.
 */
import { loadConfig, type Loaded } from "./load-config";
import type { Settings } from "../schemas/settings";
import type { Voice } from "../schemas/voice";
import { isMain } from "./is-main";

const list = (xs: string[]): string => (xs.length ? xs.join(", ") : "none");

export function voiceCard(settings: Settings, voice: Voice, loaded: Pick<Loaded, "config" | "rules">): string {
  const { config, rules } = loaded;
  const b = settings.brand;
  const r = voice.readability;
  const out: string[] = [];
  out.push(`# Brand and voice card: ${b.name}`, "");
  out.push("Generated from `project/settings.json` and `project/voice.json`. Change those files, not this output.", "");
  out.push("## Who we are", "");
  out.push(`- Brand: **${b.name}**${b.wordmark ? ` (logo wordmark \`${b.wordmark}\`, never in prose)` : ""}. Domain: ${b.domain}. Never write: ${list(b.neverWrite)}.`);
  out.push(`- Business: ${settings.business.type} (${settings.business.category}).${settings.business.oneLine ? ` One line (draft until PROJECT.md confirms): ${settings.business.oneLine}.` : ""}`);
  const offered = settings.business.offerings.filter((o) => o.status === "offered").map((o) => o.name);
  const planned = settings.business.offerings.filter((o) => o.status === "planned").map((o) => o.name);
  out.push(`- Offered: ${list(offered)}. Planned (write nothing that sells them): ${list(planned)}.`);
  if (settings.business.basedIn) out.push(`- Based in ${settings.business.basedIn.country}; say so only on ${settings.business.basedIn.mentionOnlyOn.join(", ")}.`);
  out.push(`- Audience: ${settings.audience.summary}${settings.audience.priorityMarkets.length ? ` Priority markets: ${list(settings.audience.priorityMarkets)}.` : ""}`);
  out.push(`- Language: ${settings.language.locale}${settings.language.otherLocales.length ? ` (also ${list(settings.language.otherLocales)} when enabled)` : ""}, ${voice.spelling.variant} spelling. Dates like "${settings.language.dateExample}", times like "${settings.language.timeExample}".`);
  if (settings.pricing) out.push(`- Prices: default ${settings.pricing.defaultCurrency}; offered ${list(settings.pricing.currencies)}. Tax line near prices: ${settings.pricing.taxLine ? `"${settings.pricing.taxLine}"` : "none"} Prices come only from the pricing file, never typed into copy.`);
  out.push(`- Support channels: ${list(settings.support.channels)}. Never mention: ${list(settings.support.notOffered)}.`);
  out.push(`- People: ${settings.people.drafter} drafts; ${settings.people.approver} approves and publishes; legal (Tier B) reviewer: ${settings.people.legalReviewer ?? "none appointed, so Tier B pages stay drafts"}.`);
  out.push("", "## How we sound", "", `**${voice.summary}**`, "");
  for (const a of voice.attributes) out.push(`- **${a.name}**: ${a.means}`);
  if (voice.spectrum) out.push("", `Too formal: "${voice.spectrum.tooFormal}" / Too casual: "${voice.spectrum.tooCasual}" / **Us: "${voice.spectrum.target}"**`);
  if (voice.person) out.push("", `"We" means ${voice.person.we}. "You" means ${voice.person.you}.`);
  if (voice.writeLike.length) out.push("", `Write like: ${list(voice.writeLike)}. Never like: ${list(voice.neverWriteLike)}.`);
  out.push("", "## Limits the checks enforce", "");
  out.push(`- Reading grade ${r.gradeTarget[0]} to ${r.gradeTarget[1]} (warn above ${r.gradeWarnAbove}, fail above ${r.gradeFailAbove}).`);
  out.push(`- Sentences: average ${r.averageSentenceMax} words or fewer, none over ${r.sentenceMax}.`);
  out.push(`- Exclamation marks: ${voice.exclamationMarks ? "allowed" : "never"}.`);
  out.push(`- Titles: the helper adds "${config.limits.titleSuffix}"; warn above ${config.limits.titleWarnAbove} characters with it, fail above ${config.limits.titleFailAbove}. Never type the brand into a title.`);
  out.push(`- Answer block under the H1: ${config.limits.answerBlockWords[0]} to ${config.limits.answerBlockWords[1]} words. FAQ answers: ${config.limits.faqAnswerWarnBelow} to ${config.limits.faqAnswerFailAbove} words. Internal links: ${config.limits.internalLinksMin} or more.`);
  out.push("", "## Words", "");
  out.push("| Avoid | Use |", "|---|---|");
  for (const s of voice.wordSwaps) out.push(`| ${s.avoid.join(", ")} | ${s.use} |`);
  out.push("", `Spelling (${voice.spelling.variant}): ${Object.entries(voice.spelling.avoid).slice(0, 12).map(([a, u]) => `${a} -> ${u}`).join(", ")}${Object.keys(voice.spelling.avoid).length > 12 ? ", ..." : ""}.`);
  out.push("", `Banned phrases (${voice.bannedPhrases.length}): ${voice.bannedPhrases.join("; ")}.`);
  out.push("", `Banned CTA labels: ${voice.bannedCtaLabels.join("; ")}. Card CTA: "${config.cta.cardLabelTemplate}".`);
  out.push("", `Idioms that do not translate (${voice.idioms.length}): ${voice.idioms.join("; ")}.`);
  if (rules.forbiddenClaims.length) out.push("", `Claims we never make: ${rules.forbiddenClaims.join("; ")}.`);
  out.push("", `AI disclosure on articles: "${voice.disclosureLine} [name]."`, "");
  out.push("Worked examples by page type: `project/brand.md`. The rules behind this card: `rules/voice.md` and `rules/content-writing-rules.md`.");
  return out.join("\n");
}

if (isMain(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.includes("--help")) {
    console.log("voice-card [--json]: print the brand and voice card from project/settings.json and project/voice.json. Read it before drafting.");
    process.exit(0);
  }
  const loaded = loadConfig();
  if (!loaded.settings || !loaded.voice) {
    console.log("  FAIL VC1 config:1 the config names no settings or voice file. Fix: add paths.settings and paths.voice (run init-project for a skeleton).");
    process.exit(1);
  }
  console.log(args.includes("--json") ? JSON.stringify({ settings: loaded.settings, voice: loaded.voice }, null, 2) : voiceCard(loaded.settings, loaded.voice, loaded));
}
