import { FileText, Lock, Megaphone, Send, Users, type LucideIcon } from "lucide-react";
import { PORTAL_TEXT } from "@/content/portal-strings";
import { Link } from "@/i18n/link";
import { can } from "@/lib/auth/permissions";
import { countActiveAnnouncements } from "@/lib/portal/announcements";
import { countPosts, type PostCounts } from "@/lib/portal/posts";
import type { Actor, Result } from "@/lib/portal/result";
import { countMembers } from "@/lib/portal/team";
import { PortalError } from "./PortalError";
import type { PortalBase } from "./PortalShell";

type Card = { label: string; value: number; href: string; icon: LucideIcon };

/** Portal home: counts that link to the matching list. Admins also see team and announcement counts. */
export async function OverviewView({ base, actor }: { base: PortalBase; actor: Actor }) {
  const admin = base === "/dashboard" && can(actor.role, "team.manage");
  const [posts, members, announcements] = await Promise.all([
    countPosts(actor),
    admin ? countMembers(actor) : Promise.resolve(null),
    admin ? countActiveAnnouncements(actor) : Promise.resolve(null),
  ]);
  return <OverviewCards base={base} counts={{ posts, members, announcements }} />;
}

export type OverviewCounts = { posts: Result<PostCounts>; members: Result<number> | null; announcements: Result<number> | null };

/** The overview itself, given the loaded counts (also rendered with sample counts on /v2). */
export function OverviewCards({ base, counts }: { base: PortalBase; counts: OverviewCounts }) {
  const T = PORTAL_TEXT.overview;
  const { posts, members, announcements } = counts;

  const cards: Card[] = posts.ok
    ? [
        { label: T.drafts, value: posts.data.draft, href: `${base}/posts?status=draft`, icon: FileText },
        { label: T.published, value: posts.data.published, href: `${base}/posts?status=published`, icon: Send },
        { label: T.locked, value: posts.data.locked, href: `${base}/posts`, icon: Lock },
      ]
    : [];
  if (members?.ok) cards.push({ label: T.members, value: members.data, href: "/dashboard/team", icon: Users });
  if (announcements?.ok) cards.push({ label: T.activeAnnouncements, value: announcements.data, href: "/dashboard/announcements", icon: Megaphone });

  return (
    <>
      <h1 className="t-h2 text-foreground">{base === "/dashboard" ? T.adminTitle : T.officeTitle}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{T.intro}</p>
      {!posts.ok && <PortalError message={posts.error} />}
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ label, value, href, icon: Icon }) => (
          <li key={label}>
            <Link href={href} className="surface flex items-center gap-4 p-5 transition-colors hover:border-border-strong">
              <span className="flex size-11 items-center justify-center rounded-xl border border-border bg-muted text-link">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-2xl font-semibold text-foreground">{value}</span>
                <span className="block text-sm text-muted-foreground">{label}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
