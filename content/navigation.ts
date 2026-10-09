/**
 * Site navigation: single source for the header, mega menu, mobile drawer and footer.
 * Every href here must be a real route. Links render as crawlable <a href> in the
 * initial HTML (menus are hidden with the `hidden` attribute, never unmounted).
 *
 * TODO: replace with verified data. Descriptions are draft copy and avoid unverified claims.
 */
export type NavIcon =
  | "server"
  | "cloud"
  | "layers"
  | "mail"
  | "globe"
  | "palette"
  | "search"
  | "trending-up";

export type NavLink = {
  label: string;
  href: string;
  description?: string;
  icon?: NavIcon;
};

export const HOSTING_LINKS: readonly NavLink[] = [
  {
    label: "WordPress hosting",
    href: "/wordpress-hosting",
    description: "Managed hosting tuned for WordPress sites and stores.",
    icon: "layers",
  },
  {
    label: "Cloud hosting",
    href: "/cloud-hosting",
    description: "Flexible cloud plans for sites that outgrow shared resources.",
    icon: "cloud",
  },
  {
    label: "VPS hosting",
    href: "/vps-hosting",
    description: "Root access and dedicated resources for applications and teams.",
    icon: "server",
  },
  {
    label: "Business hosting",
    href: "/business-hosting",
    description: "A website and business email set up together.",
    icon: "mail",
  },
  {
    label: "Domains",
    href: "/domains",
    description: "Search for and register a domain name.",
    icon: "globe",
  },
];

export const SERVICE_LINKS: readonly NavLink[] = [
  {
    label: "Web design",
    href: "/web-design",
    description: "WordPress and custom builds scoped around your goals.",
    icon: "palette",
  },
  {
    label: "SEO services",
    href: "/seo-services",
    description: "Retainer-based search work with plain reporting.",
    icon: "search",
  },
  {
    label: "Growth services",
    href: "/growth-services",
    description: "Support for sites that are ready to scale up.",
    icon: "trending-up",
  },
];

export const PRIMARY_LINKS: readonly NavLink[] = [
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
];

export const HELP_PANEL = {
  title: "Not sure which plan fits?",
  body: "Tell us about your site and traffic. We will recommend a plan, or say so if hosting is not the right answer.",
  primary: { label: "Talk to our team", href: "/contact" },
  secondary: { label: "Compare plans", href: "/pricing" },
} as const;

/** Header actions. Sign-in route is not built yet. TODO: confirm the account URL. */
export const ACCOUNT_LINK: NavLink = { label: "Log in", href: "/login" };
export const HEADER_CTA: NavLink = { label: "View plans", href: "/pricing" };

/**
 * The footer lists only what is sold and what is ready: the WordPress hosting plans, and the pages marked Ready in
 * docs/content-planner/project/page-map.md (Contact), plus the policy and legal pages. Add a product or page here when its row in
 * the page map turns Ready, not before. Cloud, VPS, business hosting, domains and the services stay out of the footer until then.
 */
export const FOOTER_COLUMNS: readonly { title: string; links: readonly NavLink[] }[] = [
  { title: "Hosting", links: [{ label: "WordPress hosting", href: "/wordpress-hosting" }] },
  { title: "Company", links: [{ label: "Contact", href: "/contact" }] },
  {
    title: "Trust and legal",
    links: [
      { label: "Security", href: "/security" },
      { label: "Service level agreement", href: "/sla" },
      { label: "Refund policy", href: "/refund-policy" },
      { label: "Support policy", href: "/support-policy" },
      { label: "Pricing and renewal", href: "/pricing-policy" },
      { label: "Backup policy", href: "/backup-policy" },
      { label: "Free migration terms", href: "/migration-terms" },
      { label: "Data processing", href: "/data-processing" },
      { label: "Privacy policy", href: "/privacy" },
      { label: "Cookie policy", href: "/cookie-policy" },
      { label: "Terms of service", href: "/terms" },
    ],
  },
];
