import mongoose, { Schema, type Document, type Model } from "mongoose";

// ─── TypeScript interface ─────────────────────────────────────────────────────

export interface IPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;          // HTML or Markdown — rendered server-side
  coverImage: string;       // absolute URL or /public path
  category: string;
  tags: string[];
  authorName: string;
  authorImage: string;
  status: "draft" | "published";
  publishedAt: Date | null;
  updatedAt: Date;
  createdAt: Date;
  deletedAt: Date | null;   // soft-delete (required for tax/audit in Western jurisdictions)
}

// ─── Mongoose schema ──────────────────────────────────────────────────────────

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    excerpt: { type: String, required: true, trim: true, maxlength: 300 },
    content: { type: String, required: true },
    coverImage: { type: String, required: true },
    category: { type: String, required: true, trim: true },
    tags: { type: [String], default: [] },
    authorName: { type: String, required: true, trim: true },
    authorImage: { type: String, default: "" },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    publishedAt: { type: Date, default: null },
    deletedAt: { type: Date, default: null },   // soft-delete — never hard-delete
  },
  {
    timestamps: true, // adds createdAt + updatedAt automatically
  }
);

// Indexes for common query patterns
PostSchema.index({ slug: 1 });
PostSchema.index({ status: 1, publishedAt: -1 });
PostSchema.index({ category: 1, status: 1 });
PostSchema.index({ deletedAt: 1 });

// ─── Model export (safe for Next.js hot-reload) ───────────────────────────────

export const Post: Model<IPost> =
  (mongoose.models.Post as Model<IPost>) ??
  mongoose.model<IPost>("Post", PostSchema);
