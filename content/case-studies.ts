/**
 * Approved case studies for the Evidence section. Empty until the owner approves one: a case study needs a named customer who
 * agreed in writing, real numbers with a source, and a published page that tells the full story. Never invent one.
 */
export type ApprovedCaseStudy = {
  title: string;
  description: string;
  metrics: readonly { value: string; label: string }[];
  /** The published, customer-approved page. */
  sourceUrl: string;
};

export const CASE_STUDIES: readonly ApprovedCaseStudy[] = [];
