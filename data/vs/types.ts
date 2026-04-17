export type ComparisonRow = {
  feature: string;
  dronahost: string;
  competitor: string;
  winner: "dronahost" | "competitor" | "tie";
};

export type CompetitorData = {
  slug: string;
  name: string;
  tagline: string;
  intro: string;
  table: ComparisonRow[];
  dronahostPros: string[];
  competitorPros: string[];
  verdict: string;
  datePublished: string;
};
