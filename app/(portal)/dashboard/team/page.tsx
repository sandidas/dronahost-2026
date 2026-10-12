import type { Metadata } from "next";
import { PortalError } from "@/components/portal/PortalError";
import { PortalShell } from "@/components/portal/PortalShell";
import { TeamManager } from "@/components/portal/TeamManager";
import { TEAM_TEXT } from "@/content/portal-strings";
import { requirePortal } from "@/lib/auth/session";
import { listTeam } from "@/lib/portal/team";

export const metadata: Metadata = { title: TEAM_TEXT.title };

export default async function TeamPage() {
  const actor = await requirePortal("team.manage", "/dashboard/team");
  const res = await listTeam(actor);
  return (
    <PortalShell actor={actor}>
      <h1 className="t-h2 text-foreground">{TEAM_TEXT.title}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{TEAM_TEXT.intro}</p>
      {res.ok ? <TeamManager members={res.data.members} invites={res.data.invites} /> : <PortalError message={res.error} />}
    </PortalShell>
  );
}
