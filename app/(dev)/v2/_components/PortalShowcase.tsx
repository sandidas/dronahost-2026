import { AnnouncementsManager } from "@/components/portal/AnnouncementsManager";
import { GoogleSignInButton } from "@/components/portal/GoogleSignInButton";
import { OverviewCards } from "@/components/portal/OverviewView";
import { PortalError } from "@/components/portal/PortalError";
import { PortalHeader, type PortalBase } from "@/components/portal/PortalShell";
import { PostAdminControls } from "@/components/portal/PostAdminControls";
import { PostForm } from "@/components/portal/PostForm";
import { PostsList } from "@/components/portal/PostsView";
import { SignOutButton } from "@/components/portal/SignOutButton";
import { TeamManager } from "@/components/portal/TeamManager";
import {
  SAMPLE_PORTAL_ADMIN,
  SAMPLE_PORTAL_ANNOUNCEMENTS,
  SAMPLE_PORTAL_DOC,
  SAMPLE_PORTAL_INVITES,
  SAMPLE_PORTAL_POSTS,
  SAMPLE_PORTAL_STAFF,
  SAMPLE_PORTAL_TEAM,
} from "@/content/placeholders";
import { PORTAL_ERRORS } from "@/content/portal-strings";
import type { Actor } from "@/lib/portal/result";
import ShowcaseSection from "./ShowcaseSection";

const variantLabel = "mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground";
const frame = "overflow-hidden rounded-lg border border-border";
const pane = `${frame} p-4 sm:p-6`;

/** Fixed clock for the announcements list, so the start and end badges render the same on every visit. */
const SAMPLE_NOW = "2026-06-01T00:00:00.000Z";

const [published] = SAMPLE_PORTAL_POSTS;

const HEADERS: { label: string; base: PortalBase; actor: Actor }[] = [
  { label: "Dashboard, admin", base: "/dashboard", actor: SAMPLE_PORTAL_ADMIN },
  { label: "Office, staff", base: "/office", actor: SAMPLE_PORTAL_STAFF },
];

/**
 * The /dashboard and /office components with sample records from content/placeholders.ts. Nothing here reads the
 * database. Buttons call the real server actions: without a portal session they are refused; with one, sample ids
 * match no record, but adding a member or saving a new announcement creates a real one.
 */
export default function PortalShowcase() {
  return (
    <>
      <ShowcaseSection id="portal-header" title="PortalHeader" status="built" notes="Top bar of both portals: logo, portal badge, who is signed in with their role, sign-out and the section navigation. Admins also get a link to the office; staff never see dashboard links. PortalShell adds the announcement banner and the main landmark around it.">
        <div className="space-y-6">
          {HEADERS.map(({ label, base, actor }) => (
            <div key={label}>
              <p className={variantLabel}>{label}</p>
              <div className={frame}>
                <PortalHeader base={base} actor={actor} />
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
              <OverviewCards base="/dashboard" counts={{ posts: { ok: true, data: { draft: 2, published: 5, locked: 4 } }, members: { ok: true, data: 3 }, announcements: { ok: true, data: 1 } }} />
            </div>
          </div>
          <div>
            <p className={variantLabel}>Office, with a load error</p>
            <div className={pane}>
              <OverviewCards base="/office" counts={{ posts: { ok: false, error: PORTAL_ERRORS.database }, members: null, announcements: null }} />
            </div>
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection id="portal-posts" title="PostsList" status="built" notes="Post list for both portals (PostsView loads the rows). Status filter as links (all, drafts, published), lock column, author and last update. Staff see the same list; editing a locked post opens it read-only.">
        <div className="space-y-6">
          <div>
            <p className={variantLabel}>Admin, all posts</p>
            <div className={pane}>
              <PostsList base="/dashboard" actor={SAMPLE_PORTAL_ADMIN} filter="all" res={{ ok: true, data: SAMPLE_PORTAL_POSTS }} />
            </div>
          </div>
          <div>
            <p className={variantLabel}>Staff, empty filter</p>
            <div className={pane}>
              <PostsList base="/office" actor={SAMPLE_PORTAL_STAFF} filter="draft" res={{ ok: true, data: [] }} />
            </div>
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection id="portal-post-editor" title="PostForm and PostAdminControls" status="built" notes="Title, slug (filled from the title until edited), excerpt, cover image and the Tiptap editor (headings 2 to 4, lists, quote, code with highlighting, link, image, YouTube). Admins get the side panel: publish (which locks), unpublish, lock or unlock, view and delete with confirmation. Image upload shows only when S3 storage is configured; it is off here.">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <PostForm
            base="/dashboard"
            post={{ id: published.id, title: published.title, slug: published.slug, excerpt: "Sample excerpt.", coverImage: "", content: SAMPLE_PORTAL_DOC, status: published.status, locked: published.locked }}
            canEdit
            isAdmin
            uploadEnabled={false}
          />
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <PostAdminControls id={published.id} slug={published.slug} status={published.status} locked={published.locked} publishedLine="Published by Sample Admin on 2 January 2026, 09:30 UTC" />
          </aside>
        </div>
      </ShowcaseSection>

      <ShowcaseSection id="portal-post-locked" title="PostForm: locked for staff" status="built" notes="What staff see on a post an admin has published or locked: a notice and read-only fields. The server refuses staff edits to locked posts whatever the form sends.">
        <div className="max-w-4xl">
          <PostForm
            base="/office"
            post={{ id: published.id, title: published.title, slug: published.slug, excerpt: "Sample excerpt.", coverImage: "", content: SAMPLE_PORTAL_DOC, status: "published", locked: true }}
            canEdit={false}
            isAdmin={false}
            uploadEnabled={false}
          />
        </div>
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
