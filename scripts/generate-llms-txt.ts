#!/usr/bin/env tsx
/**
 * generate-llms-txt.ts
 * Generates /public/llms.txt and /public/llms-full.txt for AI crawler discoverability.
 * Run via: npm run generate:llms
 * At build time: runs automatically via the build script in package.json.
 */

import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dronahost.com";
const PUBLIC_DIR = join(process.cwd(), "public");

// ─── Static content sections ──────────────────────────────────────────────────

const HEADER = `# DronaHost — Managed WordPress & Cloud Hosting
> Managed hosting for businesses in the US, UK, UAE, and Europe.
> Fast NVMe SSD servers, 99.9% uptime SLA, free SSL, and 24/7 expert support.

`;

const PRODUCTS = `## Hosting Products

- **WordPress Hosting** — Managed WordPress on LiteSpeed + NVMe SSD. From $0.99/mo. ${SITE_URL}/wordpress-hosting
- **Cloud Hosting** — Auto-scaling cloud with 99.99% SLA and global CDN. From $9.99/mo. ${SITE_URL}/cloud-hosting
- **VPS Hosting** — Full root access, NVMe SSD, scalable resources. From $9.99/mo. ${SITE_URL}/vps-hosting
- **Business Hosting** — Professional email, unlimited databases, priority support. From $3.99/mo. ${SITE_URL}/business-hosting
- **Domain Registration** — .com from $17.99/yr, AI-powered domain search. ${SITE_URL}/domains
- **Pricing Overview** — Compare all plans side by side. ${SITE_URL}/pricing

`;

const SERVICES = `## Services

- **Web Design** — Custom mobile-first websites for US, UK, UAE markets. ${SITE_URL}/web-design
- **SEO Services** — Technical SEO, content strategy, link building. ${SITE_URL}/seo-services
- **Growth Services** — CRM integrations, marketing automation, conversion optimisation. ${SITE_URL}/growth-services

`;

const REGIONS = `## Regional Hosting

- **USA Hosting** — Servers in New York & Los Angeles, CCPA compliant. ${SITE_URL}/hosting/us
- **UK Hosting** — London data centre, ICO registered, UK GDPR compliant. ${SITE_URL}/hosting/uk
- **EU Hosting** — Frankfurt & Amsterdam, full GDPR compliance, DPA included. ${SITE_URL}/hosting/eu
- **UAE Hosting** — Dubai data centre, sub-15ms latency for GCC. ${SITE_URL}/hosting/uae

`;

const COMPANY = `## Company

- **About DronaHost** — ${SITE_URL}/about
- **Contact** — 24/7 support, sales@dronahost.com. ${SITE_URL}/contact
- **Blog** — Hosting guides, web design tips, SEO tutorials. ${SITE_URL}/blog

`;

const LEGAL = `## Legal & Compliance

- Privacy Policy: ${SITE_URL}/privacy
- Terms of Service: ${SITE_URL}/terms
- Refund Policy (30-day money-back): ${SITE_URL}/refund-policy
- Service Level Agreement: ${SITE_URL}/sla
- Security & Data Protection: ${SITE_URL}/security
- GDPR Data Processing Agreement: ${SITE_URL}/data-processing

`;

const COMPARISONS = `## Competitor Comparisons

- DronaHost vs SiteGround: ${SITE_URL}/vs/siteground
- DronaHost vs Kinsta: ${SITE_URL}/vs/kinsta
- DronaHost vs WP Engine: ${SITE_URL}/vs/wp-engine
- DronaHost vs Bluehost: ${SITE_URL}/vs/bluehost
- DronaHost vs Hostinger: ${SITE_URL}/vs/hostinger
- DronaHost vs A2 Hosting: ${SITE_URL}/vs/a2-hosting
- DronaHost vs Cloudways: ${SITE_URL}/vs/cloudways

`;

// ─── Dynamic blog posts ───────────────────────────────────────────────────────

async function fetchBlogPosts(): Promise<string> {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) return "";

    const { default: mongoose } = await import("mongoose");

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_URI, { bufferCommands: false });
    }

    // Import model AFTER connection
    const { Post } = await import("../lib/models/post");

    const posts = await Post.find(
      { status: "published", deletedAt: null },
      { title: 1, slug: 1, excerpt: 1, _id: 0 }
    )
      .sort({ publishedAt: -1 })
      .limit(50)
      .lean();

    if (posts.length === 0) return "";

    const lines = posts.map(
      (p) =>
        `- **${p.title as string}** — ${p.excerpt as string} ${SITE_URL}/blog/${p.slug as string}`
    );

    return `## Recent Blog Posts\n\n${lines.join("\n")}\n\n`;
  } catch {
    return "";
  } finally {
    try {
      const { default: mongoose } = await import("mongoose");
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }
    } catch {
      // ignore disconnect errors
    }
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  mkdirSync(PUBLIC_DIR, { recursive: true });

  const blogSection = await fetchBlogPosts();

  // llms.txt — concise version (no blog posts — just structure)
  const llmsTxt = [HEADER, PRODUCTS, SERVICES, REGIONS, COMPANY, LEGAL].join("");
  writeFileSync(join(PUBLIC_DIR, "llms.txt"), llmsTxt, "utf-8");
  console.log("Written public/llms.txt");

  // llms-full.txt — full version with blog posts and comparisons
  const llmsFullTxt = [HEADER, PRODUCTS, SERVICES, REGIONS, COMPANY, LEGAL, COMPARISONS, blogSection].join("");
  writeFileSync(join(PUBLIC_DIR, "llms-full.txt"), llmsFullTxt, "utf-8");
  console.log("Written public/llms-full.txt");
}

main().catch((err: unknown) => {
  console.warn("[generate-llms-txt] Warning:", err instanceof Error ? err.message : err);
  // Exit 0 so the build never fails due to llms generation
  process.exit(0);
});
