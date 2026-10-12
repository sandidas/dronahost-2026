import { BuilderApp } from "@/components/builder/BuilderApp";
import { AnnouncementsManager } from "@/components/portal/AnnouncementsManager";
import { GoogleSignInButton } from "@/components/portal/GoogleSignInButton";
import { OverviewCards } from "@/components/portal/OverviewView";
import { PortalError } from "@/components/portal/PortalError";
import { PortalHeader } from "@/components/portal/PortalShell";
import { PostsList } from "@/components/portal/PostsView";
import { SignOutButton } from "@/components/portal/SignOutButton";
import { TeamManager } from "@/components/portal/TeamManager";
import {
  SAMPLE_PORTAL_ADMIN,
  SAMPLE_PORTAL_ANNOUNCEMENTS,
  SAMPLE_PORTAL_BUILDER_DOC,
  SAMPLE_PORTAL_INVITES,
  SAMPLE_PORTAL_POSTS,
  SAMPLE_PORTAL_STAFF,
  SAMPLE_PORTAL_TEAM,
} from "@/content/placeholders";
import { PORTAL_ERRORS } from "@/content/portal-strings";
import { DEFAULT_SEO } from "@/lib/builder/seo";
import { FEATURE_LIBRARY } from "@/lib/content/features";
import type { Actor } from "@/lib/portal/result";
import ShowcaseSection from "./ShowcaseSection";

const variantLabel = "mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground";
const frame = "overflow-hidden rounded-lg border border-border";
const pane = `${frame} p-4 sm:p-6`;

/** Fixed clock for the announcements list, so the start and end badges render the same on every visit. */
const SAMPLE_NOW = "2026-06-01T00:00:00.000Z";

const HEADERS: { label: string; actor: Actor }[] = [
  { label: "Admin", actor: SAMPLE_PORTAL_ADMIN },
  { label: "Staff (no Team or Announcements)", actor: SAMPLE_PORTAL_STAFF },
];

/**
 * The /dashboard components with sample records from content/placeholders.ts. Nothing here reads the
 * database. Buttons call the real server actions: without a portal session they are refused; with one, sample ids
 * match no record, but adding a member or saving a new announcement creates a real one.
 */
export default function PortalShowcase() {
  return (
    <>
      <ShowcaseSection id="portal-header" title="PortalHeader" status="built" notes="Top bar of the dashboard: logo, badge, who is signed in with their role, sign-out and the section navigation. Team and Announcements show only for admins. PortalShell adds the announcement banner and the main landmark around it.">
        <div className="space-y-6">
          {HEADERS.map(({ label, actor }) => (
            <div key={label}>
              <p className={variantLabel}>{label}</p>
              <div className={frame}>
                <PortalHeader actor={actor} />
              </div>
            </div>
          ))}
        </div>
      </ShowcaseSection>

      <ShowcaseSection id="portal-overview" title="OverviewCards" status="built" notes="Portal home (OverviewView loads the counts). Each count links to the matching list. Admins also see team members and active announcements.">
        <div className="space-y-6">
          <div>
            <p className={variantLabel}>Dashboard</p>
            <div className={pane}>
              <OverviewCards counts={{ posts: { ok: true, data: { draft: 2, published: 5, locked: 4 } }, members: { ok: true, data: 3 }, announcements: { ok: true, data: 1 } }} />
            </div>
          </div>
          <div>
            <p className={variantLabel}>Staff, with a load error</p>
            <div className={pane}>
              <OverviewCards counts={{ posts: { ok: false, error: PORTAL_ERRORS.database }, members: null, announcements: null }} />
            </div>
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection id="portal-posts" title="PostsList" status="built" notes="Posts and pages in one list (PostsView loads the rows). Type and status filters as links, lock column, author and last update. Staff see the same list; a locked post opens read-only.">
        <div className="space-y-6">
          <div>
            <p className={variantLabel}>Admin, all posts</p>
            <div className={pane}>
              <PostsList actor={SAMPLE_PORTAL_ADMIN} filter={{ status: "all", kind: "all" }} res={{ ok: true, data: SAMPLE_PORTAL_POSTS }} />
            </div>
          </div>
          <div>
            <p className={variantLabel}>Staff, empty filter</p>
            <div className={pane}>
              <PostsList actor={SAMPLE_PORTAL_STAFF} filter={{ status: "draft", kind: "all" }} res={{ ok: true, data: [] }} />
            </div>
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection id="portal-builder" title="Page builder (BuilderApp)" status="built" notes="The editor at /dashboard/posts/new and /dashboard/posts/<slug>, here in a box with a sample page. Left: Add (search, Layout, Content, Site sections) and Layers. Middle: the page, with drag and drop, a toolbar on the selected block and drop lines that show only where the dragged block fits. Right: Block, Page and SEO settings. Site sections render on the server with the real component; signed out, they show a sign-in message instead. Saving needs a session.">
        <BuilderApp
          embedded
          actorName={SAMPLE_PORTAL_ADMIN.name}
          features={FEATURE_LIBRARY.map((f) => ({ id: f.id, title: f.tile.title }))}
          init={{
            postId: null,
            kind: "page",
            status: "draft",
            locked: false,
            canEdit: true,
            isAdmin: true,
            uploadEnabled: false,
            meta: { title: "Sample page", slug: "sample-page", excerpt: "Sample summary for lists and search results.", coverImage: "", seo: { ...DEFAULT_SEO, focusKeyword: "sample" } },
            doc: SAMPLE_PORTAL_BUILDER_DOC,
            publishedLine: null,
          }}
        />
      </ShowcaseSection>

      <ShowcaseSection id="portal-team" title="TeamManager" status="built" notes="Admins only. Add a member by email (an existing account changes role at once; anyone else is invited and gets the role at first sign-in), change roles, remove with confirmation (the person becomes a guest and is signed out). ADMIN_EMAILS members and the last admin cannot be demoted or removed. Signed in as an admin, adding a member here is real.">
        <div className={pane}>
          <TeamManager members={SAMPLE_PORTAL_TEAM} invites={SAMPLE_PORTAL_INVITES} />
        </div>
      </ShowcaseSection>

      <ShowcaseSection id="portal-announcements" title="AnnouncementsManager" status="built" notes="Admins only. Plain-text message, optional link, optional start and end (entered in local time, stored in UTC), active switch, edit and delete with confirmation. The live banner is the Announcement Bar above. Signed in as an admin, saving here creates a real announcement.">
        <div className={pane}>
          <AnnouncementsManager items={SAMPLE_PORTAL_ANNOUNCEMENTS} now={SAMPLE_NOW} />
        </div>
      </ShowcaseSection>

      <ShowcaseSection id="portal-sign-in" title="Sign-in, sign-out and errors" status="built" notes="Google is the only sign-in (verified emails only). The sign-in and no-access pages place these buttons in a centred panel. PortalError shows a refusal or load failure as an alert.">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="w-full max-w-sm">
              <GoogleSignInButton callbackUrl="/sign-in/continue" />
            </div>
            <SignOutButton />
          </div>
          <PortalError message={PORTAL_ERRORS.forbidden} />
        </div>
      </ShowcaseSection>
    </>
  );
}
