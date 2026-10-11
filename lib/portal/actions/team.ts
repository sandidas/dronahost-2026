"use server";

import { revalidatePath } from "next/cache";
import { PORTAL_ERRORS } from "@/content/portal-strings";
import { getActor } from "@/lib/auth/session";
import { fail, type Actor, type Result } from "../result";
import { changeRole, inviteMember, removeMember, revokeInvitation } from "../team";

const TEAM_PATH = "/dashboard/team";

async function run<T>(op: (actor: Actor) => Promise<Result<T>>): Promise<Result<T>> {
  const actor = await getActor();
  if (!actor) return fail(PORTAL_ERRORS.signedOut);
  const res = await op(actor);
  if (res.ok) revalidatePath(TEAM_PATH);
  return res;
}

export async function changeRoleAction(userId: string, role: number): Promise<Result<undefined>> {
  return run((actor) => changeRole(actor, userId, role));
}

export async function removeMemberAction(userId: string): Promise<Result<undefined>> {
  return run((actor) => removeMember(actor, userId));
}

export async function inviteMemberAction(email: string, role: number): Promise<Result<"updated" | "invited">> {
  return run((actor) => inviteMember(actor, email, role));
}

export async function revokeInvitationAction(id: string): Promise<Result<undefined>> {
  return run((actor) => revokeInvitation(actor, id));
}
