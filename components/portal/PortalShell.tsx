import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Badge from "@/components/ui/Badge";
import Logo from "@/components/ui/Logo";
import { PORTAL_TEXT } from "@/content/portal-strings";
import { Link } from "@/i18n/link";
import { devBypassRole } from "@/lib/auth/dev-bypass";
import { can } from "@/lib/auth/permissions";
import type { Actor } from "@/lib/portal/result";
import { PortalNav, type NavItem } from "./PortalNav";
import { SignOutButton } from "./SignOutButton";

/** The one portal home. Admin-only screens (Team, Announcements) sit inside it and check their own action. */
export const PORTAL_HOME = "/dashboard";

function navFor(actor: Actor): NavItem[] {
  const items: NavItem[] = [
    { href: PORTAL_HOME, label: PORTAL_TEXT.nav.overview, exact: true },
    { href: `${PORTAL_HOME}/posts`, label: PORTAL_TEXT.nav.posts },
  ];
  if (can(actor.role, "team.manage")) items.push({ href: `${PORTAL_HOME}/team`, label: PORTAL_TEXT.nav.team });
  if (can(actor.role, "announcement.manage")) items.push({ href: `${PORTAL_HOME}/announcements`, label: PORTAL_TEXT.nav.announcements });
  items.push({ href: "/", label: PORTAL_TEXT.nav.viewSite, exact: true, secondary: true });
  return items;
}

/** Frame for the dashboard: announcements, top bar with navigation, who is signed in, and sign-out. */
export function PortalShell({ actor, children }: { actor: Actor; children: React.ReactNode }) {
  return (
    <>
      <AnnouncementBar />
      <PortalHeader actor={actor} />
      <main id="main-content" tabIndex={-1} className="container-site flex-1 py-8 sm:py-10">
        {children}
      </main>
    </>
  );
}

/** Top bar with navigation, who is signed in, and sign-out. */
export function PortalHeader({ actor }: { actor: Actor }) {
  return (
    <header className="border-b border-border bg-card">
      <div className="container-site flex flex-wrap items-center justify-between gap-4 py-3">
        <div className="flex items-center gap-3">
          <Link href={PORTAL_HOME} aria-label={`${PORTAL_TEXT.brand} ${PORTAL_TEXT.dashboardName}`}>
            <Logo size="sm" />
          </Link>
          <Badge variant="primary">{PORTAL_TEXT.dashboardName}</Badge>
          {devBypassRole() !== null && <Badge variant="warning">{PORTAL_TEXT.devBypass}</Badge>}
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="hidden text-muted-foreground sm:inline">
            {PORTAL_TEXT.signedInAs} <span className="font-semibold text-foreground">{actor.name || actor.email}</span> ({PORTAL_TEXT.roles[actor.role]})
          </span>
          <SignOutButton />
        </div>
      </div>
      <div className="container-site">
        <PortalNav items={navFor(actor)} label={PORTAL_TEXT.nav.label} />
      </div>
    </header>
  );
}
