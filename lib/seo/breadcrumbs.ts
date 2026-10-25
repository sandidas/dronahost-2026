import { SITE_URL } from "./config";

const LABEL_MAP: Record<string, string> = {
  "wordpress-hosting": "WordPress Hosting",
  "managed-vps-hosting": "VPS Hosting",
  "cloud-web-hosting": "Cloud Hosting",
  "business-hosting": "Business Hosting",
  "pricing": "Pricing",
  "domains": "Domains",
  "blog": "Blog",
  "about": "About",
  "contact": "Contact",
  "wordpress-website-design": "Web Design",
  "seo-services": "SEO Services",
  "growth-services": "Growth Services",
  "hosting": "Hosting",
  "us": "United States",
  "uk": "United Kingdom",
  "eu": "Europe",
  "uae": "UAE",
  "vs": "Compare",
  "privacy": "Privacy policy",
  "cookie-policy": "Cookie policy",
  "terms": "Terms of service",
  "refund-policy": "Refund policy",
  "support-policy": "Support policy",
  "pricing-policy": "Pricing and renewal policy",
  "backup-policy": "Backup policy",
  "migration-terms": "Free migration terms",
  "sla": "Service level agreement",
  "security": "Security",
  "data-processing": "Data processing",
  "migration": "Website migration",
  "consultation": "Book a consultation",
  "experience-growth": "Experience & Growth",
};

export function buildBreadcrumbs(
  path: string,
  overrides?: Record<string, string>
): Array<{ name: string; url: string }> {
  const segments = path.split("/").filter(Boolean);
  const items = [{ name: "Home", url: SITE_URL }];
  let current = "";
  for (const segment of segments) {
    current += `/${segment}`;
    const name =
      (overrides && overrides[segment]) ??
      LABEL_MAP[segment] ??
      segment.replace(/-/g, " ");
    items.push({
      name,
      url: `${SITE_URL}${current}`,
    });
  }
  return items;
}
