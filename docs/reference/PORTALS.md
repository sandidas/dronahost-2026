# Team dashboard (/dashboard) and page builder

Google sign-in (next-auth 4, database sessions in MongoDB), a page builder for blog posts and pages, team management and
site-wide announcements. Admins and staff share one dashboard; Team and Announcements are admin only.

## Roles

Defined once in `lib/auth/roles.ts`: `ROLES.ADMIN` (1001), `ROLES.STAFF` (999), `ROLES.GUEST` (888, every new sign-in).
Every rule is in `lib/auth/permissions.ts` (`can`, `assertCan`). Every service in `lib/portal/*.ts` checks it, so a direct
request to a server action gets the same refusal as the UI.

| Route | Who |
|---|---|
| `/sign-in`, `/sign-in/continue` | anyone; continue sends admins and staff to /dashboard, guests to /no-access |
| `/no-access` | signed-in guests |
| `/dashboard`, `/dashboard/posts` (list of posts and pages) | staff and admins |
| `/dashboard/posts/new` (`?kind=page` for a page), `/dashboard/posts/<slug>` | the editor: staff and admins (staff cannot publish, lock or delete, or edit a locked one) |
| `/dashboard/posts/<slug>/preview` | the saved version rendered with the public layout, staff and admins |
| `/dashboard/team`, `/dashboard/announcements` | admins (`team.manage`, `announcement.manage`) |
| `/office/...` | redirects to the matching dashboard list (the old staff portal) |
| `POST /api/portal/upload` | staff and admins, only when S3 storage is configured |

`proxy.ts` only checks that a session cookie exists (no database on that path); pages, actions and the upload route read the role
from the database on every request, so a role change or removal applies on the next request.

## Setup

1. Fill the "Team portals" block in `.env.example` into `.env` (`NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID`,
   `GOOGLE_CLIENT_SECRET`, `ADMIN_EMAILS`, optional `S3_*`).
2. Google Cloud Console: OAuth client of type "Web application", authorised redirect URI `<NEXTAUTH_URL>/api/auth/callback/google`
   (local: `http://localhost:3000/api/auth/callback/google`, or the port the dev server runs on).
3. Sign in with an `ADMIN_EMAILS` address. Indexes are created on first use (`lib/portal/db.ts`).
4. Development only: `PORTAL_DEV_BYPASS=admin` (or `staff`, `guest`) skips sign-in (`lib/auth/dev-bypass.ts`).

## Page builder

The editor (`components/builder/`) has Add and Layers on the left, the page in the middle, and Block, Page and SEO settings on the right.

- **Blocks** (`lib/builder/catalog.ts`). Every word is written in the builder; no block pulls predefined site data.
  - Layout: Section, Columns. Content: Heading, Rich text (Tiptap, edited in place), Image, YouTube video.
  - Page sections: Hero (pages only, first block), Split section, Feature cards, Steps, FAQ, Link tiles, Call to action.
    Banners: Offer banner, Guide banner, Action band, Answer banner. Defined once in `lib/builder/sections.ts` (stored shape,
    `prepareSection` for display, `sectionProblems` for publishing) and drawn by `components/builder/SectionView.tsx` with the
    site's own components.
  - **The editor canvas and the public page use the same renderer** (`SectionView.tsx` and `components/builder/layout.tsx`),
    so a page looks the same while it is edited. A section shows what was typed (no minimum lengths); unsafe links and images
    are dropped, and a section with nothing to show yet appears on the canvas as a dashed placeholder naming what to fill in.
  - Documents saved by the first builder version (registry sections such as ProductHero, BentoGrid, CTABand) are converted
    when read (`lib/builder/legacy.ts`).
  - To add a section: its type in `SECTION_TYPES`, schema and `PREPARE` entry in `sections.ts`, a renderer in `SectionView.tsx`
    and a catalog entry with its fields.
- **Images**: every image field and the Featured image can upload from the computer to S3 (`POST /api/portal/upload`) or
  choose an earlier upload from the media library (`GET /api/portal/media`, `media` collection). Storage settings are in
  `.env.example`; without them the buttons say uploading is off and pasting an address still works.
- **Featured image** (Page tab): shown at the top of a post, on its blog card and as the share image of posts and pages,
  with a description for screen readers (`coverImage`, `coverImageAlt`).
- **Templates** (`lib/builder/templates.ts`): a new page offers Landing page, Service page, Guide or Blank; a new post offers
  Article, How-to or Blank. Template blocks start empty, so nothing goes live until each is filled in.
- **SEO tab** (stored as `seo` on the post, `lib/builder/seo.ts`): search title, meta description, focus keyword with an
  11-point checklist, canonical (a site path or an https address on this site), noindex (keeps "follow" and leaves the sitemap),
  share title, description and image, and FAQPage structured data from FAQ blocks. Empty fields fall back to the title,
  summary, own address and cover image (`lib/builder/seo-metadata.ts`). Published builder pages are in the sitemap.
- **Stored shape** (`lib/builder/model.ts`): the post's `content` is `{ version: 1, blocks }`. Root blocks are Sections or site
  sections; a Section holds content blocks and Columns; a column holds content blocks. `kind` is `"post"` (at `/blog/<slug>`)
  or `"page"` (at `/<slug>`) and never changes after creation. Posts saved before the builder (Tiptap JSON or HTML) open as one
  Rich text block and are stored in the new shape on their next save.
- **Saving**: every save, drafts included, passes `parseBuilderDoc` (tree shape, ids, sizes, safe image and video addresses).
  Drafts save on their own three seconds after the last change; a published post or page changes only with "Update live page".
- **Publishing** (admins): `publishProblems` lists what would be missing or left out (a section's heading, a button
  without a safe link, an unfinished list item, image descriptions, video titles, empty blocks). Saving a published page
  runs the same check, so nothing disappears from a live page silently. After a refused publish the editor marks unfinished
  blocks live as they change. Publishing locks the post, as before.
- **Addresses**: a page cannot take a slug the site already uses (`lib/builder/reserved.ts`; a test fails when a new folder under
  `app/[locale]/(marketing)` is missing there). `new` is reserved for the editor.
- **Canvas and preview**: site sections on the canvas are rendered on the server by `previewSiteBlockAction` with the real
  component. Preview shows the last saved version in a frame at desktop, tablet or phone width, so the site's breakpoints apply.
- **Not checked yet for builder pages**: the content engine's page checks (provenance, honest limits, intent) run on
  `content/pages/*.json`, not on builder pages.

## Blog data

Posts and pages are the `posts` collection (`lib/models/post.ts`). Public pages read published, undeleted documents only
(`lib/blog/mongo.ts` for posts, `lib/builder/pages.ts` for pages), rendered on the server and sanitised (`lib/builder/render.tsx`).
If `WORDPRESS_API_URL` is set, the public blog reads WordPress instead and portal posts are not shown; builder pages still show.

## Tests and local tryout

- `npm run test:portal`: permission table, post, team, sign-in adapter, announcement and builder tests against a throwaway MongoDB
  (mongodb-memory-server using a local `mongod` when installed, or `TEST_MONGODB_URI`).
- `/v2` (development only) shows the dashboard components and the builder with sample records, under "Team portals".
- `scripts/portal-dev-session.ts` (development only) creates a user and a session cookie value for trying the portals without Google.
