#!/usr/bin/env tsx
/**
 * generate-llms-txt.ts
 * Generates /public/llms.txt and /public/llms-full.txt for AI crawler discoverability.
 * Run via: npm run generate:llms (also runs at build time).
 *
 * Everything stated here is derived from the same sources as the site, so AI tools cannot
 * be told something the site does not say:
 *   - descriptions come from content/services.ts and content/heroes.ts (draft, claim-free)
 *   - prices come from data/pricing.json and appear ONLY when FEATURES.pricesConfirmed is on
 *   - guarantees, SLAs, certifications and contact details appear only when verified in
 *     content/claims.ts, content/trust.ts or content/company.ts
 *   - competitor comparison pages are listed only when FEATURES.comparisonPages is on
 */
import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { verifiedClaims } from "../content/claims";
import { COMPANY } from "../content/company";
import { WORDPRESS_HERO } from "../content/heroes";
import { SERVICES } from "../content/services";
import { TRUST_ITEMS } from "../content/trust";
import { FEATURES } from "../lib/flags";
import { startingPrice, formatPrice } from "../lib/pricing";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dronahost.com";
const PUBLIC_DIR = join(process.cwd(), "public");
const url = (path: string) => `${SITE_URL}${path}`;

const verified = verifiedClaims();
const verifiedTrust = TRUST_ITEMS.filter((t) => t.verified);

const header = () => {
  const lines = [
    "# DronaHost",
    "> Managed WordPress, cloud and VPS hosting, plus web design and SEO, for businesses in the United States, United Kingdom, United Arab Emirates and Europe.",
  ];
  if (verified.length) lines.push(`> ${verified.map((c) => `${c.label}: ${c.value}`).join(". ")}.`);
  return `${lines.join("\n")}\n\n`;
};

const planPrice = () => {
  // Prices are published only once confirmed (FEATURES.pricesConfirmed), never from drafts.
  if (!FEATURES.pricesConfirmed) return "";
  const amount = startingPrice("annual");
  return amount == null ? "" : ` Plans from ${formatPrice(amount)}/month, billed annually.`;
};

const products = () =>
  [
    "## Hosting products",
    "",
    `- **Managed WordPress hosting**: ${WORDPRESS_HERO.description}${planPrice()} ${url("/wordpress-hosting")}`,
    ...["cloud-hosting", "vps-hosting", "business-hosting", "domains"].map((slug) => {
      const s = SERVICES[slug];
      return `- **${s.schemaName[0].toUpperCase()}${s.schemaName.slice(1)}**: ${s.metaDescription} ${url(`/${slug}`)}`;
    }),
    `- **Pricing**: Plan comparison with the renewal price shown beside the signup price. ${url("/pricing")}`,
    "",
    "",
  ].join("\n");

const services = () =>
  [
    "## Services",
    "",
    ...["web-design", "growth-services"].map((slug) => `- **${SERVICES[slug].schemaName}**: ${SERVICES[slug].metaDescription} ${url(`/${slug}`)}`),
    `- **SEO services**: Technical SEO, content strategy and link building on a monthly retainer. ${url("/seo-services")}`,
    "",
    "",
  ].join("\n");

const regions = () =>
  [
    "## Regional hosting",
    "",
    ...[
      ["us", "United States"],
      ["uk", "United Kingdom"],
      ["eu", "European Union"],
      ["uae", "United Arab Emirates"],
    ].map(([slug, label]) => `- **Hosting for ${label} audiences**: ${url(`/hosting/${slug}`)}`),
    "",
    "",
  ].join("\n");

const company = () =>
  [
    "## Company",
    "",
    `- **About DronaHost**: ${url("/about")}`,
    `- **Contact**: ${url("/contact")}${COMPANY.supportEmail ? ` (${COMPANY.supportEmail})` : ""}`,
    `- **Blog**: Hosting, performance and web design guides. ${url("/blog")}`,
    "",
    "",
  ].join("\n");

const legal = () =>
  [
    "## Legal and compliance",
    "",
    `- Privacy policy: ${url("/privacy")}`,
    `- Terms of service: ${url("/terms")}`,
    `- Refund policy: ${url("/refund-policy")}`,
    `- Service level agreement: ${url("/sla")}`,
    `- Security: ${url("/security")}`,
    `- Data processing: ${url("/data-processing")}`,
    ...verifiedTrust.map((t) => `- ${t.title}: ${t.description}`),
    "",
    "",
  ].join("\n");

const comparisons = () =>
  FEATURES.comparisonPages
    ? `## Competitor comparisons\n\n${["siteground", "kinsta", "wp-engine", "bluehost", "hostinger", "a2-hosting", "cloudways"]
        .map((s) => `- ${url(`/vs/${s}`)}`)
        .join("\n")}\n\n`
    : "";

async function fetchBlogPosts(): Promise<string> {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) return "";
    const { default: mongoose } = await import("mongoose");
    if (mongoose.connection.readyState === 0) await mongoose.connect(MONGODB_URI, { bufferCommands: false, serverSelectionTimeoutMS: 4000 });
    const { Post } = await import("../lib/models/post");
    const posts = await Post.find({ status: "published", deletedAt: null }, { title: 1, slug: 1, excerpt: 1, _id: 0 }).sort({ publishedAt: -1 }).limit(50).lean();
    if (posts.length === 0) return "";
    return `## Recent blog posts\n\n${posts.map((p) => `- **${p.title as string}**: ${p.excerpt as string} ${url(`/blog/${p.slug as string}`)}`).join("\n")}\n\n`;
  } catch {
    return "";
  } finally {
    try {
      const { default: mongoose } = await import("mongoose");
      if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
    } catch {
      /* ignore disconnect errors */
    }
  }
}

async function main() {
  mkdirSync(PUBLIC_DIR, { recursive: true });
  const blog = await fetchBlogPosts();
  const core = [header(), products(), services(), regions(), company(), legal()].join("");
  writeFileSync(join(PUBLIC_DIR, "llms.txt"), core, "utf-8");
  console.log("Written public/llms.txt");
  writeFileSync(join(PUBLIC_DIR, "llms-full.txt"), core + comparisons() + blog, "utf-8");
  console.log("Written public/llms-full.txt");
}

main().catch((err: unknown) => {
  console.warn("[generate-llms-txt] Warning:", err instanceof Error ? err.message : err);
  process.exit(0); // never fail the build because of llms generation
});
