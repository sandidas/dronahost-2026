"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Dialog from "@/components/ui/Dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PORTAL_TEXT, TEAM_TEXT } from "@/content/portal-strings";
import { ROLES, ROLE_VALUES } from "@/lib/auth/roles";
import { changeRoleAction, removeMemberAction, revokeInvitationAction } from "@/lib/portal/actions/team";
import { formatDate } from "@/lib/portal/format";
import type { Result } from "@/lib/portal/result";
import type { PendingInvite, TeamMember } from "@/lib/portal/team";
import { errorClass } from "./field-styles";
import { InviteForm } from "./InviteForm";

type Status = { kind: "ok" | "error"; text: string } | null;

/** Team table for /dashboard/team: change roles, remove members (with confirmation), add and cancel invitations. */
export function TeamManager({ members, invites }: { members: TeamMember[]; invites: PendingInvite[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<Status>(null);
  const [removing, setRemoving] = useState<TeamMember | null>(null);

  function run(op: () => Promise<Result<unknown>>, okText: string) {
    setStatus(null);
    startTransition(async () => {
      const res = await op();
      setStatus(res.ok ? { kind: "ok", text: okText } : { kind: "error", text: res.error });
      setRemoving(null);
      router.refresh();
    });
  }

  return (
    <>
      <p role="status" aria-live="polite" className={status ? (status.kind === "ok" ? "mt-4 text-sm font-medium text-success" : errorClass) : "sr-only"}>
        {status?.text ?? ""}
      </p>
      <Table className="mt-4">
        <TableHeader>
          <TableRow className="border-border text-muted-foreground">
            <TableHead>{TEAM_TEXT.columns.name}</TableHead>
            <TableHead>{TEAM_TEXT.columns.email}</TableHead>
            <TableHead>{TEAM_TEXT.columns.role}</TableHead>
            <TableHead>{TEAM_TEXT.columns.joined}</TableHead>
            <TableHead>{TEAM_TEXT.columns.actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((m) => (
            <TableRow key={m.id} className="border-border">
              <TableCell className="font-semibold text-foreground">
                {m.name || TEAM_TEXT.noName}
                {m.isSelf && <span className="ms-2 text-xs font-normal text-muted-foreground">({TEAM_TEXT.you})</span>}
              </TableCell>
              <TableCell className="text-muted-foreground">{m.email}</TableCell>
              <TableCell>
                <label className="sr-only" htmlFor={`role-${m.id}`}>
                  {TEAM_TEXT.roleFor} {m.email}
                </label>
                <select
                  id={`role-${m.id}`}
                  value={m.role}
                  disabled={pending || m.envAdmin}
                  onChange={(e) => run(() => changeRoleAction(m.id, Number(e.target.value)), TEAM_TEXT.invite.updated)}
                  className="h-11 rounded-lg border border-border-strong bg-card px-2 text-sm text-foreground disabled:opacity-70"
                >
                  {ROLE_VALUES.map((r) => (
                    <option key={r} value={r}>
                      {PORTAL_TEXT.roles[r]}
                    </option>
                  ))}
                </select>
                {m.envAdmin && <span className="mt-1 block text-xs text-muted-foreground">{TEAM_TEXT.envAdmin}</span>}
              </TableCell>
              <TableCell className="whitespace-nowrap text-muted-foreground">{formatDate(m.joinedAt)}</TableCell>
              <TableCell>
                {m.role !== ROLES.GUEST && !m.envAdmin && (
                  <button type="button" className="btn btn-ghost btn-sm text-danger" disabled={pending} onClick={() => setRemoving(m)}>
                    {TEAM_TEXT.remove}
                  </button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <InviteForm onDone={(text, ok) => setStatus({ kind: ok ? "ok" : "error", text })} />
        {invites.length > 0 && (
          <section aria-labelledby="pending-heading">
            <h2 id="pending-heading" className="t-h4 text-foreground">
              {TEAM_TEXT.invite.pendingHeading}
            </h2>
            <ul className="mt-4 grid gap-2">
              {invites.map((i) => (
                <li key={i.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border p-3 text-sm">
                  <span>
                    <span className="font-semibold text-foreground">{i.email}</span> <span className="text-muted-foreground">({PORTAL_TEXT.roles[i.role]})</span>
                  </span>
                  <button type="button" className="btn btn-ghost btn-sm" disabled={pending} onClick={() => run(() => revokeInvitationAction(i.id), TEAM_TEXT.invite.removed)}>
                    {TEAM_TEXT.invite.revoke}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <Dialog open={removing !== null} onClose={() => setRemoving(null)} title={TEAM_TEXT.removeTitle} description={TEAM_TEXT.removeBody}>
        <p className="text-sm font-semibold text-foreground">{removing?.email}</p>
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setRemoving(null)}>
            {TEAM_TEXT.cancel}
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            disabled={pending}
            aria-busy={pending}
            onClick={() => removing && run(() => removeMemberAction(removing.id), TEAM_TEXT.invite.removed)}
          >
            {TEAM_TEXT.remove}
          </button>
        </div>
      </Dialog>
    </>
  );
}
