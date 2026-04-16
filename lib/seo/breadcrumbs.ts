const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dronahost.com";

const LABEL_MAP: Record<string, string> = {
  "wordpress-hosting": "WordPress Hosting",
  "vps-hosting": "VPS Hosting",
  "cloud-hosting": "Cloud Hosting",
  "business-hosting": "Business Hosting",
  "pricing": "Pricing",
  "domains": "Domains",
  "blog": "Blog",
  "about": "About",
  "contact": "Contact",
  "web-design": "Web Design",
  "seo-services": "SEO Services",
  "growth-services": "Growth Services",
  "hosting": "Hosting",
  "us": "United States",
  "uk": "United Kingdom",
  "eu": "Europe",
  "uae": "UAE",
  "vs": "Compare",
  "experience-growth": "Experience & Growth",
};

export function buildBreadcrumbs(path: string): Array<{ name: string; url: string }> {
  const segments = path.split("/").filter(Boolean);
  const items = [{ name: "Home", url: SITE_URL }];
  let current = "";
  for (const segment of segments) {
    current += `/${segment}`;
    items.push({
      name: LABEL_MAP[segment] ?? segment.replace(/-/g, " "),
      url: `${SITE_URL}${current}`,
    });
  }
  return items;
}
