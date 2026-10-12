import type { Metadata } from "next";
import { OverviewView } from "@/components/portal/OverviewView";
import { PortalShell } from "@/components/portal/PortalShell";
import { PORTAL_TEXT } from "@/content/portal-strings";
import { requirePortal } from "@/lib/auth/session";

export const metadata: Metadata = { title: PORTAL_TEXT.dashboardName };

export default async function AdminHomePage() {
  const actor = await requirePortal("portal.dashboard", "/dashboard");
  return (
    <PortalShell actor={actor}>
      <OverviewView actor={actor} />
    </PortalShell>
  );
}
