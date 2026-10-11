import mongoose, { Schema, type Model, type Types } from "mongoose";

/** Site-wide notice shown on the public site and in both portals. The message is plain text, never HTML. */
export interface IAnnouncement {
  _id: Types.ObjectId;
  message: string;
  linkUrl: string | null;
  startsAt: Date | null;
  endsAt: Date | null;
  active: boolean;
  createdBy: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const AnnouncementSchema = new Schema<IAnnouncement>(
  {
    message: { type: String, required: true, trim: true, maxlength: 280 },
    linkUrl: { type: String, default: null },
    startsAt: { type: Date, default: null },
    endsAt: { type: Date, default: null },
    active: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, default: null },
  },
  { collection: "announcements", timestamps: true, versionKey: false },
);
AnnouncementSchema.index({ active: 1, startsAt: 1, endsAt: 1 });

export const Announcement: Model<IAnnouncement> =
  (mongoose.models.Announcement as Model<IAnnouncement>) ?? mongoose.model<IAnnouncement>("Announcement", AnnouncementSchema);
