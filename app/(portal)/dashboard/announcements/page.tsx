import type { Metadata } from "next";
import { AnnouncementsManager } from "@/components/portal/AnnouncementsManager";
import { PortalError } from "@/components/portal/PortalError";
import { PortalShell } from "@/components/portal/PortalShell";
import { ANNOUNCEMENTS_TEXT } from "@/content/portal-strings";
import { requirePortal } from "@/lib/auth/session";
import { listAnnouncements } from "@/lib/portal/announcements";

export const metadata: Metadata = { title: ANNOUNCEMENTS_TEXT.title };

export default async function AnnouncementsPage() {
  const actor = await requirePortal("portal.dashboard", "/dashboard/announcements");
  const res = await listAnnouncements(actor);
  return (
    <PortalShell base="/dashboard" actor={actor}>
      <h1 className="t-h2 text-foreground">{ANNOUNCEMENTS_TEXT.title}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{ANNOUNCEMENTS_TEXT.intro}</p>
      {res.ok ? <AnnouncementsManager items={res.data} now={new Date().toISOString()} /> : <PortalError message={res.error} />}
    </PortalShell>
  );
}
