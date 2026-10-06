import mongoose, { Schema, type Model } from "mongoose";

export interface IConsentEvent {
  consentId: string;
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
  policyVersion: number;
  createdAt: Date;
}

/** Append-only consent log (GDPR Art. 7(1)). No IP address or user agent is stored. */
const ConsentEventSchema = new Schema<IConsentEvent>(
  {
    consentId: { type: String, required: true, index: true, maxlength: 64 },
    preferences: { type: Boolean, required: true },
    analytics: { type: Boolean, required: true },
    marketing: { type: Boolean, required: true },
    policyVersion: { type: Number, default: 1 },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const ConsentEvent: Model<IConsentEvent> =
  (mongoose.models.ConsentEvent as Model<IConsentEvent>) ?? mongoose.model<IConsentEvent>("ConsentEvent", ConsentEventSchema);
