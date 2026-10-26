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
 * Technology we run, each shown only while the claim that confirms it renders (content/claims.ts). Never a cloud provider
 * (we have no partnership, so their logos stay off; decision 80 allows their names in text only), LiteSpeed (not offered)
 * or a payment brand (payment brands appear only as accepted methods). Plesk and cPanel may show (decision 79).
 */
export type TechLogo = LogoEntry & { claim: string };

/** Brand symbols from Simple Icons (simpleicons.org, CC0), downloaded 2026-10-26: 24 by 24, one colour. Plesk and cPanel have
 * only a tiny wordmark there, so they show their name alone. */
const ICON = { width: 24, height: 24 };

export const TECH_LOGOS: readonly TechLogo[] = [
  { name: "WordPress", src: "/logos/wordpress.svg", size: ICON, claim: "managed-hosting-tasks", href: "https://wordpress.org" },
  { name: "NGINX", src: "/logos/nginx.svg", size: ICON, claim: "nginx-caching", href: "https://nginx.org" },
  { name: "Let's Encrypt", src: "/logos/letsencrypt.svg", size: ICON, claim: "free-ssl", href: "https://letsencrypt.org" },
  { name: "Imunify360", claim: "imunify360", href: "https://www.imunify360.com" },
  { name: "Plesk", claim: "plesk", href: "https://www.plesk.com" },
  { name: "cPanel", claim: "cpanel-in-use", href: "https://cpanel.net" },
  { name: "React", src: "/logos/react.svg", size: ICON, claim: "react-nextjs", href: "https://react.dev" },
  { name: "Next.js", src: "/logos/nextjs.svg", size: ICON, claim: "react-nextjs", href: "https://nextjs.org" },
  { name: "Cloudflare", src: "/logos/cloudflare.svg", size: ICON, claim: "cloudflare-cdn", href: "https://www.cloudflare.com" },
];
