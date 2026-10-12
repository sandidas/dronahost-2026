import { Announcement } from "@/lib/models/announcement";
import { Media } from "@/lib/models/media";
import { Invitation } from "@/lib/models/invitation";
import { Post } from "@/lib/models/post";
import { Account, Session, User } from "@/lib/models/user";
import { connectToDatabase } from "@/lib/mongodb";

declare global {
  var _portalIndexes: Promise<void> | undefined;
}

/**
 * Connects through the shared cached connection (lib/mongodb.ts) and, once per process, creates the
 * portal's indexes, so a fresh database gets the unique email and slug indexes before the first write.
 */
export async function portalDb(): Promise<void> {
  await connectToDatabase();
  global._portalIndexes ??= ensurePortalIndexes().catch((err: unknown) => {
    global._portalIndexes = undefined;
    throw err;
  });
  await global._portalIndexes;
}

export async function ensurePortalIndexes(): Promise<void> {
  await Promise.all([User, Account, Session, Post, Invitation, Announcement, Media].map((m) => m.createIndexes()));
}
