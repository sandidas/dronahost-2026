import mongoose, { Schema, type Model } from "mongoose";

export interface IFormSubmission {
  type: "migration" | "consultation";
  email: string;
  data: Record<string, unknown>;
  /** True once the SES notification was accepted. */
  emailed: boolean;
  createdAt: Date;
  /** TTL: the document is removed after the retention period (FORM_RETENTION_DAYS, default 730). */
  expiresAt: Date;
}

const FormSubmissionSchema = new Schema<IFormSubmission>(
  {
    type: { type: String, enum: ["migration", "consultation"], required: true, index: true },
    email: { type: String, required: true, lowercase: true, trim: true, maxlength: 254, index: true },
    data: { type: Schema.Types.Mixed, required: true },
    emailed: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const FormSubmission: Model<IFormSubmission> =
  (mongoose.models.FormSubmission as Model<IFormSubmission>) ?? mongoose.model<IFormSubmission>("FormSubmission", FormSubmissionSchema);
