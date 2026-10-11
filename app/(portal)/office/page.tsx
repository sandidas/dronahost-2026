import type { Metadata } from "next";
import { OverviewView } from "@/components/portal/OverviewView";
import { PortalShell } from "@/components/portal/PortalShell";
import { PORTAL_TEXT } from "@/content/portal-strings";
import { requirePortal } from "@/lib/auth/session";

export const metadata: Metadata = { title: PORTAL_TEXT.officeName };

export default async function OfficeHomePage() {
  const actor = await requirePortal("portal.office", "/office");
  return (
    <PortalShell base="/office" actor={actor}>
      <OverviewView base="/office" actor={actor} />
    </PortalShell>
  );
}
