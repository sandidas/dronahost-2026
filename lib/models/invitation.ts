import mongoose, { Schema, type Model, type Types } from "mongoose";
import { ROLES, type Role } from "@/lib/auth/roles";

/** A team member added by email before they have signed in. Used up on their first Google sign-in. */
export interface IInvitation {
  _id: Types.ObjectId;
  email: string;
  role: Role;
  invitedBy: Types.ObjectId | null;
  createdAt: Date;
}

const InvitationSchema = new Schema<IInvitation>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    role: { type: Number, enum: [ROLES.ADMIN, ROLES.STAFF], required: true },
    invitedBy: { type: Schema.Types.ObjectId, default: null },
    createdAt: { type: Date, default: () => new Date() },
  },
  { collection: "team_invitations", versionKey: false },
);

export const Invitation: Model<IInvitation> =
  (mongoose.models.Invitation as Model<IInvitation>) ?? mongoose.model<IInvitation>("Invitation", InvitationSchema);
