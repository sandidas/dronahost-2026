import assert from "node:assert/strict";
import { after, before, beforeEach, describe, it } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { startDb, stopDb } from "./setup";

/** Service-level tests: the same calls the server actions make, so a staff request sent straight to the server is covered. */
type Posts = typeof import("@/lib/portal/posts");
type Blog = typeof import("@/lib/blog/mongo");
let posts: Posts;
let blog: Blog;
let PostModel: typeof import("@/lib/models/post").Post;

const ADMIN = { id: "65f000000000000000000001", email: "admin@example.com", name: "Ada Admin", role: 1001 as const };
const STAFF = { id: "65f000000000000000000002", email: "staff@example.com", name: "Sam Staff", role: 999 as const };
const GUEST = { id: "65f000000000000000000003", email: "guest@example.com", name: "Gil Guest", role: 888 as const };

const doc = (text: string) => ({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text }] }] });
/** A builder document with one section holding one Rich text block. */
const builderOf = (tiptap: unknown) => ({ version: 1, blocks: [{ id: "bsection01", type: "section", props: { width: "text" }, children: [{ id: "brichtext1", type: "richtext", props: { content: tiptap } }] }] });
const input = (over: Record<string, unknown> = {}) => ({ title: "Hello world", slug: "", excerpt: "Short.", coverImage: "", content: builderOf(doc("Body")), ...over });

async function createAs(actor: typeof ADMIN | typeof STAFF, over: Record<string, unknown> = {}) {
  const res = await posts.createPost(actor, input(over));
  assert.ok(res.ok, res.ok ? "" : res.error);
  return res.data;
}

before(async () => {
  await startDb();
  posts = await import("@/lib/portal/posts");
  blog = await import("@/lib/blog/mongo");
  PostModel = (await import("@/lib/models/post")).Post;
  await (await import("@/lib/portal/db")).portalDb();
});
after(stopDb);
beforeEach(async () => {
  await PostModel.deleteMany({});
});

describe("staff writes", () => {
  it("a staff post is always a draft, unlocked, by the staff member, whatever the request says", async () => {
    const res = await posts.createPost(STAFF, input({ status: "published", locked: true, authorId: ADMIN.id, author: { name: "Someone" }, publishedAt: new Date() }));
    assert.ok(res.ok);
    const saved = await PostModel.findById(res.data.id).lean();
    assert.equal(saved?.status, "draft");
    assert.equal(saved?.locked, false);
    assert.equal(String(saved?.authorId), STAFF.id);
    assert.equal(saved?.author.name, STAFF.name);
    assert.equal(saved?.publishedAt, null);
  });

  it("a staff save that sends status=published leaves the post a draft", async () => {
    const created = await createAs(STAFF);
    const res = await posts.updatePost(STAFF, created.id, input({ title: "Changed", status: "published", locked: false }));
    assert.ok(res.ok);
    const saved = await PostModel.findById(created.id).lean();
    assert.equal(saved?.status, "draft");
    assert.equal(saved?.title, "Changed");
  });

  it("staff cannot publish (direct call refused, post unchanged)", async () => {
    const created = await createAs(STAFF);
    const res = await posts.setPublished(STAFF, created.id, true);
    assert.equal(res.ok, false);
    assert.equal((await PostModel.findById(created.id).lean())?.status, "draft");
  });

  it("staff cannot delete", async () => {
    const created = await createAs(STAFF);
    const res = await posts.deletePost(STAFF, created.id);
    assert.equal(res.ok, false);
    assert.equal((await PostModel.findById(created.id).lean())?.deletedAt, null);
  });

  it("staff cannot lock or unlock", async () => {
    const created = await createAs(STAFF);
    assert.equal((await posts.setLocked(STAFF, created.id, true)).ok, false);
  });

  it("staff cannot edit a locked post; content stays as it was", async () => {
    const created = await createAs(STAFF);
    assert.ok((await posts.setLocked(ADMIN, created.id, true)).ok);
    const res = await posts.updatePost(STAFF, created.id, input({ title: "Sneaky change" }));
    assert.equal(res.ok, false);
    assert.equal((await PostModel.findById(created.id).lean())?.title, "Hello world");
  });

  it("guests can do nothing", async () => {
    const created = await createAs(ADMIN);
    assert.equal((await posts.listPortalPosts(GUEST)).ok, false);
    assert.equal((await posts.getPortalPost(GUEST, created.id)).ok, false);
    assert.equal((await posts.createPost(GUEST, input({ slug: "guest-post" }))).ok, false);
    assert.equal((await posts.updatePost(GUEST, created.id, input())).ok, false);
    assert.equal((await posts.setPublished(GUEST, created.id, true)).ok, false);
  });
});

describe("admin publishing and locking", () => {
  it("publishing locks the post and records who published it", async () => {
    const created = await createAs(STAFF);
    const res = await posts.setPublished(ADMIN, created.id, true);
    assert.ok(res.ok);
    const saved = await PostModel.findById(created.id).lean();
    assert.equal(saved?.status, "published");
    assert.equal(saved?.locked, true);
    assert.equal(saved?.publishedBy?.name, ADMIN.name);
    assert.ok(saved?.publishedAt instanceof Date);
  });

  it("after the admin unlocks, staff can edit again", async () => {
    const created = await createAs(STAFF);
    await posts.setPublished(ADMIN, created.id, true);
    assert.equal((await posts.updatePost(STAFF, created.id, input({ title: "Blocked" }))).ok, false);
    assert.ok((await posts.setLocked(ADMIN, created.id, false)).ok);
    assert.ok((await posts.updatePost(STAFF, created.id, input({ title: "Allowed" }))).ok);
  });

  it("an admin can edit a locked post", async () => {
    const created = await createAs(ADMIN);
    await posts.setPublished(ADMIN, created.id, true);
    assert.ok((await posts.updatePost(ADMIN, created.id, input({ title: "Admin edit" }))).ok);
  });

  it("unpublishing hides the post from visitors", async () => {
    const created = await createAs(ADMIN, { slug: "visible-post" });
    await posts.setPublished(ADMIN, created.id, true);
    assert.ok(await blog.getPost("visible-post"));
    await posts.setPublished(ADMIN, created.id, false);
    assert.equal(await blog.getPost("visible-post"), null);
  });

  it("delete is soft, removes the post from lists and frees the slug", async () => {
    const created = await createAs(ADMIN, { slug: "to-delete" });
    assert.ok((await posts.deletePost(ADMIN, created.id)).ok);
    const list = await posts.listPortalPosts(ADMIN);
    assert.ok(list.ok && list.data.length === 0);
    assert.ok(await PostModel.findById(created.id).lean());
    assert.ok((await posts.createPost(ADMIN, input({ slug: "to-delete" }))).ok);
  });
});

describe("validation and public visibility", () => {
  it("drafts are never public, even with the exact slug", async () => {
    await createAs(STAFF, { slug: "secret-draft" });
    assert.equal(await blog.getPost("secret-draft"), null);
    const page = await blog.listPosts();
    assert.equal(page.posts.length, 0);
  });

  it("a duplicate slug returns a clear message instead of throwing", async () => {
    await createAs(STAFF, { slug: "same-slug" });
    const res = await posts.createPost(STAFF, input({ slug: "same-slug" }));
    assert.equal(res.ok, false);
    assert.match(res.ok ? "" : res.error, /slug/i);
  });

  it("generates the slug from the title when empty", async () => {
    const created = await createAs(STAFF, { title: "Ünïcode & Friends: 2026!" });
    assert.equal(created.slug, "unicode-and-friends-2026");
  });

  it("refuses query operators in ids and fields", async () => {
    assert.equal((await posts.getPortalPost(ADMIN, { $ne: null })).ok, false);
    assert.equal((await posts.updatePost(ADMIN, { $gt: "" }, input())).ok, false);
    assert.equal((await posts.createPost(ADMIN, input({ title: { $gt: "" } }))).ok, false);
    assert.equal((await posts.listPortalPosts(ADMIN, { status: { $ne: "x" } })).ok, true);
  });

  it("refuses unsafe links, images and embeds in content", async () => {
    const link = { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "x", marks: [{ type: "link", attrs: { href: "javascript:alert(1)" } }] }] }] };
    const img = { type: "doc", content: [{ type: "image", attrs: { src: "data:image/png;base64,AAAA" } }] };
    const video = { type: "doc", content: [{ type: "youtube", attrs: { src: "https://evil.example/embed/x" } }] };
    const unknownNode = { type: "doc", content: [{ type: "script", content: [] }] };
    for (const content of [link, img, video, unknownNode]) {
      assert.equal((await posts.createPost(ADMIN, input({ content: builderOf(content), slug: "" }))).ok, false);
    }
  });

  it("renders published Tiptap content as sanitised HTML with YouTube embeds and highlighted code", async () => {
    const content = {
      type: "doc",
      content: [
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Intro" }] },
        { type: "paragraph", content: [{ type: "text", text: "<script>alert(1)</script>" }] },
        { type: "youtube", attrs: { src: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" } },
        { type: "codeBlock", attrs: { language: "javascript" }, content: [{ type: "text", text: "const a = 1;" }] },
      ],
    };
    const created = await createAs(ADMIN, { slug: "rendered", content: builderOf(content) });
    await posts.setPublished(ADMIN, created.id, true);
    const post = await blog.getPost("rendered");
    assert.ok(post?.body);
    const html = renderToStaticMarkup(post.body);
    assert.match(html, /<h2 id="intro">Intro<\/h2>/);
    assert.doesNotMatch(html, /<script/);
    assert.match(html, /&lt;script&gt;/);
    assert.match(html, /<iframe[^>]+src="https:\/\/www\.youtube-nocookie\.com\/embed\/dQw4w9WgXcQ/);
    assert.match(html, /<span class="hljs-keyword">const<\/span>/);
    assert.equal(post.toc[0]?.text, "Intro");
  });

  it("still renders older posts stored as HTML", async () => {
    await PostModel.collection.insertOne({
      title: "Legacy",
      slug: "legacy-post",
      excerpt: "Old",
      content: "<h2>Old heading</h2><p>Old body</p><script>x</script>",
      coverImage: "",
      category: "News",
      tags: [],
      author: { name: "Old author", bio: "", avatar: "" },
      status: "published",
      publishedAt: new Date(),
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const post = await blog.getPost("legacy-post");
    assert.ok(post);
    assert.match(post.html, /Old body/);
    assert.doesNotMatch(post.html, /<script/);
  });
});
