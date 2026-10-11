import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Badge from "@/components/ui/Badge";
import Logo from "@/components/ui/Logo";
import { PORTAL_TEXT } from "@/content/portal-strings";
import { Link } from "@/i18n/link";
import { can } from "@/lib/auth/permissions";
import type { Actor } from "@/lib/portal/result";
import { PortalNav, type NavItem } from "./PortalNav";
import { SignOutButton } from "./SignOutButton";

export type PortalBase = "/dashboard" | "/office";

function navFor(base: PortalBase, actor: Actor): NavItem[] {
  const items: NavItem[] = [
    { href: base, label: PORTAL_TEXT.nav.overview, exact: true },
    { href: `${base}/posts`, label: PORTAL_TEXT.nav.posts },
  ];
  if (base === "/dashboard") {
    items.push({ href: "/dashboard/team", label: PORTAL_TEXT.nav.team }, { href: "/dashboard/announcements", label: PORTAL_TEXT.nav.announcements });
  }
  if (base === "/dashboard" && can(actor.role, "portal.office")) items.push({ href: "/office", label: PORTAL_TEXT.nav.office, exact: true, secondary: true });
  if (base === "/office" && can(actor.role, "portal.dashboard")) items.push({ href: "/dashboard", label: PORTAL_TEXT.nav.dashboard, exact: true, secondary: true });
  return items;
}

/** Frame for both portals: announcements, top bar with navigation, who is signed in, and sign-out. */
export function PortalShell({ base, actor, children }: { base: PortalBase; actor: Actor; children: React.ReactNode }) {
  return (
    <>
      <AnnouncementBar />
      <header className="border-b border-border bg-card">
        <div className="container-site flex flex-wrap items-center justify-between gap-4 py-3">
          <div className="flex items-center gap-3">
            <Link href={base} aria-label={`${PORTAL_TEXT.brand} ${base === "/dashboard" ? PORTAL_TEXT.dashboardName : PORTAL_TEXT.officeName}`}>
              <Logo size="sm" />
            </Link>
            <Badge variant={base === "/dashboard" ? "primary" : "secondary"}>{base === "/dashboard" ? PORTAL_TEXT.dashboardName : PORTAL_TEXT.officeName}</Badge>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-muted-foreground sm:inline">
              {PORTAL_TEXT.signedInAs} <span className="font-semibold text-foreground">{actor.name || actor.email}</span> ({PORTAL_TEXT.roles[actor.role]})
            </span>
            <SignOutButton />
          </div>
        </div>
        <div className="container-site">
          <PortalNav items={navFor(base, actor)} label={PORTAL_TEXT.nav.label} />
        </div>
      </header>
      <main id="main-content" tabIndex={-1} className="container-site flex-1 py-8 sm:py-10">
        {children}
      </main>
    </>
  );
}
