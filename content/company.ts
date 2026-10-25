/**
 * Company details shown in the footer.
 *
 * TODO: replace with verified data. Every field is null until the owner confirms it,
 * and the footer renders only the fields that are set. Do not invent a US address
 * or registration number.
 */
export type SocialLink = { platform: "google" | "x" | "linkedin" | "github" | "youtube" | "instagram" | "facebook"; href: string };

export const COMPANY = {
  brandName: "DronaHost",
  /** Registered legal entity name. Unconfirmed. */
  legalName: null as string | null,
  registrationNumber: null as string | null,
  vatNumber: null as string | null,
  /** Physical business address, honest about where the team is based. Unconfirmed. */
  address: null as string | null,
  /** Owner confirmed 2026-10-10. */
  supportEmail: "support@dronahost.com" as string | null,
  /** The client area where customers sign in, manage services and pay invoices (an outside site, linked with rel="noopener"). */
  clientAreaUrl: "https://my.dronahost.com" as string | null,
  /** Only real, owned profile URLs. The old footer.json placeholders (twitter.com etc.) were removed. */
  /** Owner supplied 2026-10-13. */
  socials: [
    { platform: "google", href: "https://share.google/yrQro82locMs2Wf8q" },
    { platform: "facebook", href: "https://www.facebook.com/sandipandas.net" },
    { platform: "instagram", href: "https://www.instagram.com/sandipandas.dev" },
    { platform: "linkedin", href: "https://www.linkedin.com/in/sandipandasdev" },
  ] as SocialLink[],
  summary: "DronaHost is a managed WordPress hosting and web services company for businesses worldwide.",
} as const;
