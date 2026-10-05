/**
 * Company details shown in the footer.
 *
 * TODO: replace with verified data. Every field is null until the owner confirms it,
 * and the footer renders only the fields that are set. Do not invent a US address
 * or registration number.
 */
export type SocialLink = { platform: "x" | "linkedin" | "github" | "youtube" | "instagram" | "facebook"; href: string };

export const COMPANY = {
  brandName: "DronaHost",
  /** Registered legal entity name. Unconfirmed. */
  legalName: null as string | null,
  registrationNumber: null as string | null,
  vatNumber: null as string | null,
  /** Physical business address, honest about where the team is based. Unconfirmed. */
  address: null as string | null,
  supportEmail: null as string | null,
  /** WhatsApp number in international format, e.g. "+1 555 0100". Unconfirmed; region-specific numbers can be added later. */
  whatsappNumber: null as string | null,
  /** True once a live-chat widget is installed. */
  liveChatEnabled: false,
  /** Only real, owned profile URLs. The old footer.json placeholders (twitter.com etc.) were removed. */
  socials: [] as SocialLink[],
  summary: "Managed WordPress, cloud and VPS hosting, plus web design and SEO.",
} as const;
