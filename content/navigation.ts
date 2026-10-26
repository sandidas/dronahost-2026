/**
 * Site navigation: single source for the header, mega menu, mobile drawer and footer.
 * Every href here must be a real route. Links render as crawlable <a href> in the
 * initial HTML (menus are hidden with the `hidden` attribute, never unmounted).
 *
 * TODO: replace with verified data. Descriptions are draft copy and avoid unverified claims.
 */
import { UI } from "./strings";

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
    href: "/cloud-web-hosting",
    description: "Flexible cloud plans for sites that outgrow shared resources.",
    icon: "cloud",
  },
  {
    label: "VPS hosting",
    href: "/managed-vps-hosting",
    description: "Managed virtual private servers for applications and teams.",
    icon: "server",
  },
  {
    label: "Business hosting",
    href: "/business-hosting",
    description: "Web hosting with a control panel for any kind of site. Email is not included.",
    icon: "server",
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
    href: "/wordpress-website-design",
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
/** The header action: the migration plan form on Home (decision 58). The label lives in content/strings.ts. */
export const HEADER_CTA: NavLink = { label: UI.header.cta, href: UI.header.ctaHref };

/** Policy links in the footer's bottom strip, on the right (the plan cards carry no policy link). */
export const FOOTER_BOTTOM_LINKS: readonly NavLink[] = [{ label: "Refund policy", href: "/refund-policy" }];

/**
 * The footer lists only what is sold and what is ready: the WordPress hosting plans, and the pages marked Ready in
 * content-engine/project/page-map.md (Contact), plus the policy and legal pages. Add a product or page here when its row in
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
