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

- **Blocks** (`lib/builder/catalog.ts`):
  - Layout: Section, Columns. Content: Heading, Rich text (Tiptap, edited in place), Image, YouTube video.
  - Page sections from the page-spec registry (`lib/content/registry.tsx`): Hero (pages only, first block), Feature grid
    (feature library), Steps, FAQ, Call to action.
  - Free-content sections and banners, written entirely in the builder (`lib/builder/free-sections.ts`, each wrapping an
    existing site component): Split section, Feature cards, Link tiles, Offer banner, Guide banner, Action band, Answer banner.
  - To offer another section, add its type to `REGISTRY_SECTION_TYPES` or `FREE_SECTION_TYPES` (`lib/builder/model.ts`), give
    it a catalog entry with its fields, a schema (`SITE_SCHEMAS` or `FREE_SCHEMAS`) and, for a free section, a renderer in
    `FREE_RENDER` (`lib/builder/render.tsx`).
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
- **Publishing** (admins): `publishProblems` runs every site section through its page-spec schema (the same rules as
  `content/pages/*.json`) and checks alt text, video titles and empty blocks. Problems come back per block and are marked on the
  canvas. Publishing locks the post, as before.
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
