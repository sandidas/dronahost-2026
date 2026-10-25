/**
 * Approved case studies for the Evidence and ReviewsShowcase sections. A case study needs a named customer who agreed,
 * facts confirmed by the owner, and a link anyone can check (the customer's live site, or a published story). Never invent one.
 */
export type ApprovedCaseStudy = {
  title: string;
  description: string;
  metrics: readonly { value: string; label: string }[];
  /** The published page that tells the full story, when one exists. */
  sourceUrl?: string;
  /** The customer's site, named in the screenshot frame. */
  site?: { url: string; label: string };
  /** A real screenshot of the customer's site, captured by us. */
  image?: { src: string; alt: string; width: number; height: number; capturedOn: string };
  /** ISO date the owner confirmed the facts. */
  verifiedOn: string;
};

export const CASE_STUDIES: readonly ApprovedCaseStudy[] = [
  {
    // mjcbdd.com, Mary Jane's CBD Dispensary. Customer contact: Alex Abdul (site owner). Facts confirmed by the DronaHost
    // owner on 2026-10-11: frequent downtime and a broken site with the previous host; moved to DronaHost about two years
    // ago (copy says "years", owner's choice); no downtime or errors since. Use a measured figure once monitoring data exists.
    title: "Mary Jane's CBD Dispensary: years without an outage after the move",
    description:
      "Mary Jane's CBD Dispensary runs its online store at mjcbdd.com. On its previous host, the site went down often and pages broke. Since the move to DronaHost, the store has stayed online for years, and the owner reports no downtime and no site errors.",
    metrics: [
      { value: "0", label: "Outages since the move" },
      { value: "0", label: "Site errors since the move" },
    ],
    site: { url: "https://mjcbdd.com", label: "mjcbdd.com" },
    image: {
      src: "/images/case-studies/mjcbdd-home.webp",
      alt: "The home page of mjcbdd.com, hosted on DronaHost, captured on 11 October 2026",
      width: 1200,
      height: 498,
      capturedOn: "2026-10-11",
    },
    verifiedOn: "2026-10-11",
  },
];
