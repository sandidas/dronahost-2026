export type BlogAuthor = { name: string; bio: string | null; avatar: string | null };
export type BlogImage = { url: string; alt: string; width: number; height: number };
export type TocItem = { id: string; text: string; level: 2 | 3 };

export type BlogPost = {
  slug: string;
  title: string;
  /** Plain-text summary, no HTML. */
  excerpt: string;
  /** Sanitized HTML with ids on h2 and h3. Safe for dangerouslySetInnerHTML. */
  html: string;
  /** Posts made in the page builder: the rendered blocks, shown instead of `html`. Server-rendered only. */
  body?: React.ReactNode;
  /** Builder posts: the SEO tab's settings and FAQPage structured data (null when off or without questions). */
  seo?: import("@/lib/builder/seo").PostSeo;
  faqSchema?: Record<string, unknown> | null;
  toc: TocItem[];
  /** ISO timestamps. */
  published: string;
  modified: string;
  category: { name: string; slug: string } | null;
  author: BlogAuthor;
  image: BlogImage | null;
  readingMinutes: number;
};

export type BlogListItem = Omit<BlogPost, "html" | "toc" | "body" | "seo" | "faqSchema">;

export type BlogCategory = { name: string; slug: string; count: number };

export type BlogPage = { posts: BlogListItem[]; page: number; totalPages: number };

/** Thrown when the content source cannot be reached. Pages show a friendly message, never a stack. */
export class BlogUnavailableError extends Error {
  constructor() {
    super("Blog content source unavailable");
  }
}
