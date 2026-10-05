import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IContactMessage extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  /** Optional plan the visitor asked about, e.g. "growth". */
  plan: string | null;
  createdAt: Date;
  /** Soft-delete: audit trail is kept; never hard-delete (see CLAUDE.md MongoDB conventions). */
  deletedAt: Date | null;
}

const ContactMessageSchema = new Schema<IContactMessage>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254, index: true },
    subject: { type: String, required: true, trim: true, maxlength: 200 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    plan: { type: String, default: null, maxlength: 40 },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const ContactMessage: Model<IContactMessage> =
  (mongoose.models.ContactMessage as Model<IContactMessage>) ?? mongoose.model<IContactMessage>("ContactMessage", ContactMessageSchema);
