/**
 * Logos for LogoStrip, the technology we run. Each entry has a name and an optional one-colour symbol in public/logos with
 * its width and height. The strip tints the symbol with the text colour and sets the name beside it.
 */
export type LogoEntry = {
  name: string;
  /** One-colour symbol in public/logos, shown before the name. */
  src?: string;
  /** The SVG's viewBox width and height. Required with `src`. */
  size?: { width: number; height: number };
  href?: string;
};

/**
 * Technology we run, each shown once the owner has confirmed its claim (claimConfirmed, decision 81). Never a cloud provider
 * (we have no partnership, so their logos stay off; decision 80 allows their names in text only), LiteSpeed (not offered)
 * or a payment brand (payment brands appear only as accepted methods). Plesk may show (decision 79); cPanel and
 * CloudPanel stay off the hosting strip because most hosting runs Plesk (decision 81).
 */
/**
 * The strip a logo belongs to. "hosting" shows under the banner of every hosting page, which all sell the same plans
 * (decision 73); "development" is for the custom development page; null keeps it in the registry but off every strip.
 */
export type LogoSet = "hosting" | "development";

export type TechLogo = LogoEntry & { claim: string; set: LogoSet | null };

/** Brand symbols from Simple Icons (simpleicons.org, CC0), downloaded 2026-10-26: 24 by 24, one colour. Plesk and cPanel have
 * only a tiny wordmark there, so they show their name alone. */
const ICON = { width: 24, height: 24 };

export const TECH_LOGOS: readonly TechLogo[] = [
  { name: "WordPress", src: "/logos/wordpress.svg", size: ICON, claim: "managed-hosting-tasks", href: "https://wordpress.org", set: "hosting" },
  { name: "NGINX", src: "/logos/nginx.svg", size: ICON, claim: "nginx-caching", href: "https://nginx.org", set: "hosting" },
  { name: "Let's Encrypt", src: "/logos/letsencrypt.svg", size: ICON, claim: "free-ssl", href: "https://letsencrypt.org", set: "hosting" },
  { name: "Imunify360", claim: "imunify360", href: "https://www.imunify360.com", set: "hosting" },
  { name: "Plesk", claim: "plesk", href: "https://www.plesk.com", set: "hosting" },
  { name: "cPanel", claim: "cpanel-in-use", href: "https://cpanel.net", set: null },
  { name: "CloudPanel", claim: "cloudpanel-in-use", href: "https://www.cloudpanel.io", set: null },
  { name: "React", src: "/logos/react.svg", size: ICON, claim: "react-nextjs", href: "https://react.dev", set: "development" },
  { name: "Next.js", src: "/logos/nextjs.svg", size: ICON, claim: "react-nextjs", href: "https://nextjs.org", set: "development" },
  { name: "Cloudflare", src: "/logos/cloudflare.svg", size: ICON, claim: "cloudflare-cdn", href: "https://www.cloudflare.com", set: "hosting" },
];
