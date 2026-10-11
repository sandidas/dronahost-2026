import mongoose, { Schema, type Model, type Types } from "mongoose";
import { ROLES, ROLE_VALUES, type Role } from "@/lib/auth/roles";

/**
 * Portal user (the `users` collection the auth adapter writes). `role` is a number from lib/auth/roles.
 * Sign-in is Google only, so there is no password field.
 */
export interface IUser {
  _id: Types.ObjectId;
  name: string | null;
  email: string;
  image: string | null;
  emailVerified: Date | null;
  role: Role;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, default: null, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    image: { type: String, default: null },
    emailVerified: { type: Date, default: null },
    role: { type: Number, enum: ROLE_VALUES as Role[], default: ROLES.GUEST, index: true },
    createdAt: { type: Date, default: () => new Date() },
  },
  { collection: "users", versionKey: false },
);

export const User: Model<IUser> = (mongoose.models.User as Model<IUser>) ?? mongoose.model<IUser>("User", UserSchema);

/** OAuth account links (next-auth). One row per provider account. */
export interface IAccount {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  type: string;
  provider: string;
  providerAccountId: string;
  [key: string]: unknown;
}

const AccountSchema = new Schema<IAccount>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, index: true },
    type: { type: String, required: true },
    provider: { type: String, required: true },
    providerAccountId: { type: String, required: true },
  },
  { collection: "accounts", versionKey: false, strict: false },
);
AccountSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true });

export const Account: Model<IAccount> = (mongoose.models.Account as Model<IAccount>) ?? mongoose.model<IAccount>("Account", AccountSchema);

/** Database sessions: the role is read from `users` on every request, so a role change applies at once. */
export interface ISession {
  _id: Types.ObjectId;
  sessionToken: string;
  userId: Types.ObjectId;
  expires: Date;
}

const SessionSchema = new Schema<ISession>(
  {
    sessionToken: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, required: true, index: true },
    expires: { type: Date, required: true },
  },
  { collection: "sessions", versionKey: false },
);
// MongoDB removes a session document once it has expired.
SessionSchema.index({ expires: 1 }, { expireAfterSeconds: 0 });

export const Session: Model<ISession> = (mongoose.models.Session as Model<ISession>) ?? mongoose.model<ISession>("Session", SessionSchema);
