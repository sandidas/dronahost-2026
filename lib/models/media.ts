import mongoose, { Schema, type Model, type Types } from "mongoose";

/** An image uploaded from the page builder. The file is in S3; this record lets the media library list it for reuse. */
export interface IMedia {
  _id: Types.ObjectId;
  url: string;
  /** The object key in the bucket. */
  key: string;
  /** The file name as uploaded, shown in the library. */
  name: string;
  type: string;
  size: number;
  uploadedBy: Types.ObjectId | null;
  createdAt: Date;
}

const MediaSchema = new Schema<IMedia>(
  {
    url: { type: String, required: true },
    key: { type: String, required: true, unique: true },
    name: { type: String, default: "", maxlength: 200 },
    type: { type: String, required: true },
    size: { type: Number, required: true },
    uploadedBy: { type: Schema.Types.ObjectId, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false }, collection: "media" },
);

MediaSchema.index({ createdAt: -1 });

export const Media: Model<IMedia> = (mongoose.models.Media as Model<IMedia>) ?? mongoose.model<IMedia>("Media", MediaSchema);
