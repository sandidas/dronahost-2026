# Team portals: /dashboard (admin) and /office (staff)

Google sign-in (next-auth 4, database sessions in MongoDB), a Tiptap blog editor, team management and site-wide announcements.

## Roles

Defined once in `lib/auth/roles.ts`: `ROLES.ADMIN` (1001), `ROLES.STAFF` (999), `ROLES.GUEST` (888, every new sign-in).
Every rule is in `lib/auth/permissions.ts` (`can`, `assertCan`). Every service in `lib/portal/*.ts` checks it, so a direct
request to a server action gets the same refusal as the UI.

| Route | Who |
|---|---|
| `/sign-in`, `/sign-in/continue` | anyone; continue sends admins to /dashboard, staff to /office, guests to /no-access |
| `/no-access` | signed-in guests |
| `/office`, `/office/posts`, `/office/posts/new`, `/office/posts/[id]` | staff and admins |
| `/dashboard`, `/dashboard/posts...`, `/dashboard/team`, `/dashboard/announcements` | admins |
| `POST /api/portal/upload` | staff and admins, only when S3 storage is configured |

`proxy.ts` only checks that a session cookie exists (no database on that path); pages, actions and the upload route read the role
from the database on every request, so a role change or removal applies on the next request.

## Setup

1. Fill the "Team portals" block in `.env.example` into `.env` (`NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID`,
   `GOOGLE_CLIENT_SECRET`, `ADMIN_EMAILS`, optional `S3_*`).
2. Google Cloud Console: OAuth client of type "Web application", authorised redirect URI `<NEXTAUTH_URL>/api/auth/callback/google`
   (local: `http://localhost:3000/api/auth/callback/google`).
3. Sign in with an `ADMIN_EMAILS` address. Indexes are created on first use (`lib/portal/db.ts`).

## Blog data

Posts are the existing `posts` collection (`lib/models/post.ts`). Portal posts store Tiptap JSON in `content`; older posts keep
their HTML and still render. Public pages read published, undeleted posts only (`lib/blog/mongo.ts`), rendered on the server with
the editor's own extension set and sanitised (`lib/editor/render.ts`). If `WORDPRESS_API_URL` is set, the public blog reads
WordPress instead and portal posts are not shown.

## Tests and local tryout

- `npm run test:portal`: permission table, post, team, sign-in adapter and announcement tests against a throwaway MongoDB
  (mongodb-memory-server using a local `mongod` when installed, or `TEST_MONGODB_URI`).
- `scripts/portal-dev-session.ts` (development only) creates a user and a session cookie value for trying the portals without Google.
