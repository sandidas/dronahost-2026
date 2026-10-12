import mongoose, { Schema, type Model, type Types } from "mongoose";
import type { BuilderDoc, PostKind } from "@/lib/builder/model";
import type { PostSeo } from "@/lib/builder/seo";
import type { TiptapDoc } from "@/lib/editor/schema";

// ─── TypeScript interface ─────────────────────────────────────────────────────

export interface IPost {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  excerpt: string;
  /** "post" renders at /blog/<slug>; "page" is a standalone page at /<slug>. Older documents have no kind and are posts. */
  kind?: PostKind;
  /**
   * The page builder's block tree (lib/builder/model.ts). Posts saved before the builder hold Tiptap JSON or, older
   * still, an HTML string; all three render server-side, and the builder converts the older two on their next save.
   */
  content: BuilderDoc | TiptapDoc | string;
  coverImage: string;       // the featured image: absolute URL or /public path, "" when there is none
  /** What the featured image shows, for screen readers and as the share image's alt text. */
  coverImageAlt?: string;
  /** Search settings from the builder's SEO tab. Older documents have none; read them through normalizeSeo. */
  seo?: Partial<PostSeo>;
  category: string;
  tags: string[];
  author: {
    name: string;
    bio: string;
    avatar: string;
  };
  /** Portal user who created the post. Null for posts imported before the portal existed. */
  authorId: Types.ObjectId | null;
  status: "draft" | "published";
  /** "Not for editing": while true, only an admin can change the post. */
  locked: boolean;
  publishedAt: Date | null;
  publishedBy: { id: Types.ObjectId | null; name: string } | null;
  updatedAt: Date;
  createdAt: Date;
  deletedAt: Date | null;   // soft-delete (required for tax/audit in Western jurisdictions)
}

// ─── Mongoose schema ──────────────────────────────────────────────────────────

const PostSchema = new Schema<IPost>(
  {
    // Empty only on a new draft; publishing needs a title (lib/portal/posts.ts).
    title: { type: String, default: "", trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    excerpt: { type: String, default: "", trim: true, maxlength: 300 },
    kind: { type: String, enum: ["post", "page"], default: "post" },
    content: { type: Schema.Types.Mixed, required: true },
    coverImage: { type: String, default: "" },
    coverImageAlt: { type: String, default: "", maxlength: 200 },
    seo: {
      type: new Schema(
        {
          title: { type: String, default: "", maxlength: 70 },
          description: { type: String, default: "", maxlength: 170 },
          focusKeyword: { type: String, default: "", maxlength: 60 },
          canonical: { type: String, default: "", maxlength: 500 },
          noindex: { type: Boolean, default: false },
          ogTitle: { type: String, default: "", maxlength: 90 },
          ogDescription: { type: String, default: "", maxlength: 200 },
          ogImage: { type: String, default: "" },
          faqSchema: { type: Boolean, default: true },
        },
        { _id: false },
      ),
      default: () => ({}),
    },
    category: { type: String, default: "", trim: true },
    tags: { type: [String], default: [] },
    author: {
      name: { type: String, required: true, trim: true },
      bio: { type: String, default: "" },
      avatar: { type: String, default: "" },
    },
    authorId: { type: Schema.Types.ObjectId, default: null },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    locked: { type: Boolean, default: false },
    publishedAt: { type: Date, default: null },
    publishedBy: {
      type: new Schema({ id: { type: Schema.Types.ObjectId, default: null }, name: { type: String, default: "" } }, { _id: false }),
      default: null,
    },
    deletedAt: { type: Date, default: null },   // soft-delete — never hard-delete
  },
  {
    timestamps: true, // adds createdAt + updatedAt automatically
    minimize: false,  // keep empty Tiptap attrs objects as written
  }
);

// Indexes for common query patterns (the unique slug index comes from the field definition)
PostSchema.index({ status: 1, publishedAt: -1 });
PostSchema.index({ deletedAt: 1, status: 1, publishedAt: -1 });
PostSchema.index({ deletedAt: 1, updatedAt: -1 });
PostSchema.index({ category: 1, status: 1 });
PostSchema.index({ kind: 1, deletedAt: 1, status: 1 });

// ─── Model export (safe for Next.js hot-reload) ───────────────────────────────

// A running dev server keeps the model it compiled first; when this file gains a field, that cached model would
// silently drop it on save. Recompile when the cached schema is older than this one.
if (mongoose.models.Post && !mongoose.models.Post.schema.path("coverImageAlt")) mongoose.deleteModel("Post");

export const Post: Model<IPost> =
  (mongoose.models.Post as Model<IPost>) ??
  mongoose.model<IPost>("Post", PostSchema);
