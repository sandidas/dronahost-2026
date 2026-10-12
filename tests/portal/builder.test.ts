import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { after, before, beforeEach, describe, it } from "node:test";
import { NextIntlClientProvider } from "next-intl";
import { createElement, type ComponentProps } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { BuilderDoc, LeafBlock, RootBlock } from "@/lib/builder/model";
import { startDb, stopDb } from "./setup";

type Tree = typeof import("@/lib/builder/tree");
type Validate = typeof import("@/lib/builder/validate");
type Render = typeof import("@/lib/builder/render");
let tree: Tree;
let validate: Validate;
let render: Render;
let catalog: typeof import("@/lib/builder/catalog");
let model: typeof import("@/lib/builder/model");
let reserved: typeof import("@/lib/builder/reserved");
let posts: typeof import("@/lib/portal/posts");
let pages: typeof import("@/lib/builder/pages");
let blog: typeof import("@/lib/blog/mongo");
let PostModel: typeof import("@/lib/models/post").Post;

const ADMIN = { id: "65f000000000000000000001", email: "admin@example.com", name: "Ada Admin", role: 1001 as const };
const STAFF = { id: "65f000000000000000000002", email: "staff@example.com", name: "Sam Staff", role: 999 as const };

const para = (text: string) => ({ type: "doc" as const, content: [{ type: "paragraph" as const, content: [{ type: "text" as const, text }] }] });
const heading = (id: string, text: string, level: 2 | 3 | 4 = 2): LeafBlock => ({ id, type: "heading", props: { text, level } });
const rich = (id: string, text: string): LeafBlock => ({ id, type: "richtext", props: { content: para(text) } });
const section = (id: string, children: (LeafBlock | Extract<RootBlock, { type: "section" }>["children"][number])[]): RootBlock => ({ id, type: "section", props: { width: "text" }, children });
const docOf = (...blocks: RootBlock[]): BuilderDoc => ({ version: 1, blocks });

const validCta = { type: "CTABand", content: { h2: "Ready to move your site?", ctaPrimary: { label: "See the plans", href: "/pricing" } } };
const validFaq = {
  type: "FAQSection",
  content: {
    h2: "Questions about moving",
    items: [
      { q: "How long does a move take?", a: "Most moves finish within a day." },
      { q: "Will my site go offline?", a: "No. The old copy stays live until the new one is ready." },
      { q: "Do I need to change my email?", a: "No. Email stays where it is unless you ask us to move it." },
    ],
  },
};

before(async () => {
  await startDb();
  tree = await import("@/lib/builder/tree");
  validate = await import("@/lib/builder/validate");
  render = await import("@/lib/builder/render");
  catalog = await import("@/lib/builder/catalog");
  model = await import("@/lib/builder/model");
  reserved = await import("@/lib/builder/reserved");
  posts = await import("@/lib/portal/posts");
  pages = await import("@/lib/builder/pages");
  blog = await import("@/lib/blog/mongo");
  PostModel = (await import("@/lib/models/post")).Post;
  await (await import("@/lib/portal/db")).portalDb();
});
after(stopDb);
beforeEach(async () => {
  await PostModel.deleteMany({});
});

describe("tree operations", () => {
  const base = () => docOf(section("bsecaaaa01", [heading("bhead00001", "One"), rich("brich00001", "Two")]), section("bsecaaaa02", []));

  it("finds blocks and the slot they sit in", () => {
    const found = tree.findBlock(base(), "brich00001");
    assert.deepEqual(found?.slot, { kind: "section", id: "bsecaaaa01" });
    assert.equal(found?.index, 1);
    assert.equal(tree.findBlock(base(), "missing"), null);
  });

  it("only puts blocks where they belong", () => {
    const d = base();
    assert.equal(tree.insertBlock(d, tree.ROOT, 0, heading("bhead00002", "x")), d, "content blocks need a section");
    assert.equal(tree.insertBlock(d, { kind: "section", id: "bsecaaaa01" }, 0, section("bsecaaaa03", [])), d, "no section inside a section");
    const added = tree.insertBlock(d, { kind: "section", id: "bsecaaaa02" }, 0, heading("bhead00002", "x"));
    assert.equal(tree.findBlock(added, "bhead00002")?.slot.kind, "section");
  });

  it("moves, nudges, duplicates and removes without changing the input", () => {
    const d = base();
    const moved = tree.moveBlock(d, "bhead00001", { kind: "section", id: "bsecaaaa02" }, 0);
    assert.deepEqual(tree.findBlock(moved, "bhead00001")?.slot, { kind: "section", id: "bsecaaaa02" });
    assert.deepEqual(tree.findBlock(d, "bhead00001")?.slot, { kind: "section", id: "bsecaaaa01" }, "input untouched");
    const nudged = tree.nudgeBlock(d, "bhead00001", 1);
    assert.equal(tree.findBlock(nudged, "bhead00001")?.index, 1);
    const { doc: dup, id } = tree.duplicateBlock(d, "bsecaaaa01");
    assert.ok(id && id !== "bsecaaaa01");
    const ids = tree.flatten(dup).map((x) => x.block.id);
    assert.equal(new Set(ids).size, ids.length, "a duplicate gets fresh ids all the way down");
    assert.equal(tree.findBlock(tree.removeBlock(d, "bsecaaaa01"), "bhead00001"), null);
  });

  it("never moves a block into itself", () => {
    const cols = catalog.entryByType("columns")!.create();
    const d = docOf(section("bsecaaaa01", [cols as never]));
    assert.equal(tree.moveBlock(d, "bsecaaaa01", { kind: "column", id: cols.id, index: 0 }, 0), d);
  });

  it("keeps blocks when columns go from three to two", () => {
    const cols = { id: "bcols00001", type: "columns" as const, props: { layout: "1-1-1" as const }, columns: [0, 1, 2].map((i) => ({ id: `bcolumn00${i}`, children: [heading(`bhead0000${i}`, `H${i}`)] })) };
    const two = tree.resizeColumns(cols, 2);
    assert.equal(two.length, 2);
    assert.deepEqual(two[1]?.children.map((c) => c.id), ["bhead00001", "bhead00002"]);
  });
});

describe("saving (structure)", () => {
  it("accepts a well-formed document, as an object or a JSON string", () => {
    const d = docOf(section("bsecaaaa01", [heading("bhead00001", "Hi")]));
    assert.ok(validate.parseBuilderDoc(d, "post").ok);
    assert.ok(validate.parseBuilderDoc(JSON.stringify(d), "post").ok);
  });

  it("refuses unsafe or malformed documents", () => {
    const bad: unknown[] = [
      { version: 2, blocks: [] },
      docOf({ id: "BAD ID!", type: "section", props: { width: "text" }, children: [] } as never),
      docOf(section("bsecaaaa01", [{ id: "bscript001", type: "script", props: {} } as never])),
      docOf(section("bsecaaaa01", [{ id: "bimage0001", type: "image", props: { src: "javascript:alert(1)", alt: "x", caption: "" } }])),
      docOf(section("bsecaaaa01", [{ id: "bvideo0001", type: "video", props: { url: "https://evil.example/watch?v=x", title: "x" } }])),
      docOf(section("bsecaaaa01", [{ id: "brich00001", type: "richtext", props: { content: { type: "doc", content: [{ type: "script" }] } } } as never])),
      docOf(section("bsecaaaa01", [heading("bsame00001", "a"), heading("bsame00001", "b")])),
      docOf({ id: "bsite00001", type: "site", section: { type: "Unknown" } } as never),
      "{not json",
      "x".repeat(1024 * 1024 + 1),
    ];
    for (const input of bad) assert.equal(validate.parseBuilderDoc(input, "page").ok, false, JSON.stringify(input).slice(0, 80));
  });

  it("refuses the hero in a blog post", () => {
    const d = docOf({ id: "bhero00001", type: "site", section: { type: "ProductHero", variant: "dashboard", content: { h1: "", lead: "", ctaPrimary: { label: "", href: "" } } } });
    assert.equal(validate.parseBuilderDoc(d, "post").ok, false);
    assert.ok(validate.parseBuilderDoc(d, "page").ok);
  });

  it("saves an unfinished site section as a draft", () => {
    const fresh = catalog.entryByType("FAQSection")!.create() as RootBlock;
    assert.ok(validate.parseBuilderDoc(docOf(fresh), "post").ok);
  });
});

describe("publishing rules", () => {
  it("names each missing field in the words of the Block panel", () => {
    const faq = catalog.entryByType("FAQSection")!.create() as RootBlock;
    const problems = validate.publishProblems(docOf(faq), "post").map((p) => p.message);
    assert.ok(problems.includes("Heading: use at least 8 characters"), problems.join(" | "));
    assert.ok(problems.some((m) => m.startsWith("Question 1: Question:")), problems.join(" | "));
  });

  it("requires alt text, a video title, content and a first-place hero", () => {
    const d = docOf(
      section("bsecaaaa01", [
        { id: "bimage0001", type: "image", props: { src: "https://example.com/a.png", alt: "", caption: "" } },
        { id: "bvideo0001", type: "video", props: { url: "https://youtu.be/dQw4w9WgXcQ", title: "" } },
        heading("bhead00001", "  "),
      ]),
      { id: "bhero00001", type: "site", section: { type: "ProductHero", variant: "dashboard", content: { h1: "", lead: "", ctaPrimary: { label: "", href: "" } } } },
    );
    const byBlock = new Map<string, string[]>();
    for (const p of validate.publishProblems(d, "page")) byBlock.set(p.blockId, [...(byBlock.get(p.blockId) ?? []), p.message]);
    assert.ok(byBlock.get("bimage0001")?.length);
    assert.ok(byBlock.get("bvideo0001")?.length);
    assert.ok(byBlock.get("bhead00001")?.length);
    assert.ok(byBlock.get("bhero00001")?.some((m) => /first block/.test(m)));
    assert.equal(validate.publishProblems(docOf(), "post")[0]?.blockId, "");
  });

  it("a complete document has no problems", () => {
    const d = docOf(section("bsecaaaa01", [heading("bhead00001", "Hi"), rich("brich00001", "Body")]), { id: "bcta000001", type: "site", section: validCta } as RootBlock);
    assert.deepEqual(validate.publishProblems(d, "post"), []);
  });
});

describe("rendering", () => {
  it("renders content blocks with heading anchors, a table of contents and safe embeds", () => {
    const d = docOf(
      section("bsecaaaa01", [
        heading("bhead00001", "Plans"),
        rich("brich00001", "<script>alert(1)</script>"),
        { id: "bvideo0001", type: "video", props: { url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", title: "Demo" } },
        heading("bhead00002", "Plans", 3),
      ]),
    );
    const out = render.renderBuilderDoc(d, "page");
    const html = renderToStaticMarkup(out.body);
    assert.match(html, /<h2 id="plans">Plans<\/h2>/);
    assert.match(html, /<h3 id="plans-1">Plans<\/h3>/, "anchors are unique across blocks");
    assert.doesNotMatch(html, /<script/);
    assert.match(html, /src="https:\/\/www\.youtube-nocookie\.com\/embed\/dQw4w9WgXcQ"/);
    assert.deepEqual(out.toc.map((t) => t.id), ["plans", "plans-1"]);
    assert.equal(out.hasHero, false);
  });

  it("renders a complete site section with the real component and hides an unfinished one", () => {
    const ok = render.renderSiteSection({ id: "bfaq000001", type: "site", section: validFaq as never });
    assert.ok(ok.node);
    assert.match(renderToStaticMarkup(ok.node as never), /How long does a move take\?/);
    const unfinished = render.renderSiteSection(catalog.entryByType("CTABand")!.create() as never);
    assert.equal(unfinished.node, null);
    assert.ok(unfinished.problems.length > 0);
  });

  it("opens older posts as one Rich text block", () => {
    const fromTiptap = model.toBuilderDoc(para("Old"));
    assert.equal(fromTiptap.blocks[0]?.type, "section");
    assert.equal(model.toBuilderDoc("<p>Old</p>").blocks.length, 1);
    assert.equal(model.toBuilderDoc("").blocks.length, 0);
  });
});

describe("page addresses", () => {
  it("reserves every hand-built top-level route", () => {
    const dir = join(process.cwd(), "app", "[locale]", "(marketing)");
    const routes = readdirSync(dir, { withFileTypes: true })
      .filter((e) => e.isDirectory() && !e.name.startsWith("(") && !e.name.startsWith("[") && !e.name.startsWith("_"))
      .map((e) => e.name);
    for (const route of routes) assert.ok(reserved.isReservedPageSlug(route), `add "${route}" to lib/builder/reserved.ts`);
    assert.ok(reserved.isReservedPageSlug("en-gb"));
    assert.equal(reserved.isReservedPageSlug("spring-offer"), false);
  });
});

describe("posts and pages (database)", () => {
  const save = (over: Record<string, unknown> = {}) => ({ title: "Spring offer", slug: "", excerpt: "Short.", coverImage: "", content: docOf(section("bsecaaaa01", [heading("bhead00001", "Hello"), rich("brich00001", "Body")])), ...over });

  it("staff create pages as drafts; the kind cannot change afterwards", async () => {
    const res = await posts.createPost(STAFF, { ...save(), kind: "page", status: "published" });
    assert.ok(res.ok, res.ok ? "" : res.error);
    assert.equal(res.data.kind, "page");
    const saved = await PostModel.findById(res.data.id).lean();
    assert.equal(saved?.status, "draft");
    const updated = await posts.updatePost(STAFF, res.data.id, { ...save(), kind: "post" });
    assert.ok(updated.ok);
    assert.equal((await PostModel.findById(res.data.id).lean())?.kind, "page");
  });

  it("refuses page slugs the site already uses, and the slug 'new'", async () => {
    const page = await posts.createPost(ADMIN, { ...save({ slug: "pricing" }), kind: "page" });
    assert.equal(page.ok, false);
    const post = await posts.createPost(ADMIN, save({ slug: "new" }));
    assert.equal(post.ok, false);
  });

  it("publishing is refused until every block is complete, with the reasons per block", async () => {
    const unfinished = catalog.entryByType("CTABand")!.create() as RootBlock;
    const created = await posts.createPost(ADMIN, { ...save({ slug: "offer", content: docOf(unfinished) }), kind: "page" });
    assert.ok(created.ok);
    const res = await posts.setPublished(ADMIN, created.data.id, true);
    assert.equal(res.ok, false);
    assert.ok(!res.ok && res.fieldErrors?.[unfinished.id]);
    assert.equal((await PostModel.findById(created.data.id).lean())?.status, "draft");
  });

  it("only published pages are public, and pages never appear in the blog", async () => {
    const created = await posts.createPost(ADMIN, { ...save({ slug: "spring-offer" }), kind: "page" });
    assert.ok(created.ok);
    assert.equal(await pages.getPublishedPage("spring-offer"), null, "a draft page is not public");
    assert.ok((await posts.setPublished(ADMIN, created.data.id, true)).ok);
    const page = await pages.getPublishedPage("spring-offer");
    assert.equal(page?.title, "Spring offer");
    assert.equal((await blog.listPosts()).posts.length, 0);
    assert.equal(await blog.getPost("spring-offer"), null);
    assert.deepEqual((await pages.listPublishedPageSlugs()).map((p) => p.slug), ["spring-offer"]);
  });

  it("opens posts by slug for the editor and lists by kind", async () => {
    const created = await posts.createPost(STAFF, save({ slug: "hello-post" }));
    assert.ok(created.ok);
    const opened = await posts.getPortalPostBySlug(STAFF, "hello-post");
    assert.ok(opened.ok && opened.data.content.version === 1);
    assert.equal((await posts.getPortalPostBySlug(STAFF, { $ne: "" })).ok, false);
    const listed = await posts.listPortalPosts(STAFF, { kind: "page" });
    assert.ok(listed.ok && listed.data.length === 0);
  });
});

describe("free-content sections", () => {
  const site = (section: Record<string, unknown>, id = "bfree00001") => ({ id, type: "site" as const, section: section as never });
  const VALID: Record<string, Record<string, unknown>> = {
    OfferBanner: { type: "OfferBanner", content: { title: "Move your site this week", description: "We copy the site, check it privately and switch when you agree.", primaryCta: { label: "Plan my move", href: "/migration" }, ticketLabel: "Site move", layout: "split", scope: "ink" } },
    GuideBanner: { type: "GuideBanner", content: { title: "How a site move works", summary: "A short guide for owners moving to a new host, step by step.", learn: ["Make a copy", "Check it privately", "Switch the domain"], layout: "line", numbered: true, scope: "ink" } },
    ActionBand: { type: "ActionBand", content: { label: "Need a hand?", line: "Write to the support desk any time.", cta: { label: "Contact us", href: "/contact" }, variant: "split" } },
    AnswerBanner: { type: "AnswerBanner", content: { question: "Do I need to change my email?", answer: "No. Email stays where it is unless you ask us to move it as well.", layout: "entry" } },
    SplitSection: { type: "SplitSection", content: { title: "Backups you can restore yourself", features: ["Two copies a day"], image: { src: "/images/sample.png", alt: "The backup screen" }, imagePosition: "right" } },
    FeatureCards: { type: "FeatureCards", content: { title: "What every plan includes", items: [{ icon: "shield-check", title: "Firewall", description: "Blocks known attacks before they reach the site." }, { title: "Backups", description: "Two copies a day, kept for a week." }], columns: 3, variant: "cards" } },
    LinkTiles: { type: "LinkTiles", content: { title: "Where would you like to go?", items: [{ title: "Pricing", line: "Plans and prices", href: "/pricing" }, { title: "Support", line: "Ask the team", href: "/contact" }], layout: "tiles", columns: 2 } },
  };

  it("a complete section of each kind publishes and renders its heading", () => {
    for (const [type, section] of Object.entries(VALID)) {
      const block = site(section);
      assert.deepEqual(validate.siteSectionProblems(block), [], type);
      const { node } = render.renderSiteSection(block);
      assert.ok(node, type);
      // The site's links (next-intl) need the locale provider the layout normally supplies.
      const html = renderToStaticMarkup(createElement(NextIntlClientProvider, { locale: "en-us", messages: {} } as ComponentProps<typeof NextIntlClientProvider>, node as never));
      const heading = (section.content as Record<string, string>).title ?? (section.content as Record<string, string>).label ?? (section.content as Record<string, string>).question;
      assert.ok(html.includes(heading.replace(/'/g, "&#x27;")), `${type} shows its heading`);
      assert.match(html, /<h2[\s>]/, `${type} uses an H2`);
    }
  });

  it("starts empty and names what is missing", () => {
    for (const type of Object.keys(VALID)) {
      const fresh = catalog.entryByType(type)!.create() as never;
      assert.ok(validate.siteSectionProblems(fresh).length > 0, type);
      assert.ok(validate.parseBuilderDoc(docOf(fresh), "post").ok, `${type} saves as a draft`);
    }
  });

  it("refuses unsafe images and links to other sites", () => {
    const badImage = site({ ...VALID.SplitSection, content: { ...(VALID.SplitSection.content as object), image: { src: "javascript:alert(1)", alt: "An image" } } });
    assert.ok(validate.siteSectionProblems(badImage).length > 0);
    const external = site({ ...VALID.LinkTiles, content: { ...(VALID.LinkTiles.content as object), items: [{ title: "Elsewhere", line: "Another site", href: "https://evil.example" }, { title: "Pricing", line: "Plans", href: "/pricing" }] } });
    assert.ok(validate.siteSectionProblems(external).length > 0);
  });
});

describe("templates", () => {
  it("every template is a valid draft for its kind, and post templates have no hero", async () => {
    const { TEMPLATES } = await import("@/lib/builder/templates");
    for (const t of TEMPLATES) {
      const doc = docOf(...t.blocks());
      assert.ok(validate.parseBuilderDoc(doc, t.kind).ok, t.id);
      assert.ok(doc.blocks.length > 0, t.id);
      if (t.kind === "post") assert.ok(!doc.blocks.some((b) => b.type === "site" && b.section.type === "ProductHero"), t.id);
    }
  });
});

describe("SEO settings", () => {
  type SeoModule = typeof import("@/lib/builder/seo");
  let seoLib: SeoModule;
  let meta: typeof import("@/lib/builder/seo-metadata");
  before(async () => {
    seoLib = await import("@/lib/builder/seo");
    meta = await import("@/lib/builder/seo-metadata");
  });
  const save = (seo: Record<string, unknown>, over: Record<string, unknown> = {}) => ({ title: "Spring offer for small sites", slug: "", excerpt: "Short.", coverImage: "", content: docOf(section("bsecaaaa01", [rich("brich00001", "Body")])), seo, ...over });

  it("stores the settings and refuses a canonical on another site", async () => {
    const ok = await posts.createPost(ADMIN, save({ title: "Spring offer", focusKeyword: "spring offer", canonical: "/pricing", noindex: true }));
    assert.ok(ok.ok, ok.ok ? "" : ok.error);
    const saved = await posts.getPortalPost(ADMIN, ok.data.id);
    assert.ok(saved.ok);
    assert.equal(saved.data.seo.focusKeyword, "spring offer");
    assert.equal(saved.data.seo.noindex, true);
    assert.equal(saved.data.seo.faqSchema, true, "defaults fill the rest");
    const bad = await posts.createPost(ADMIN, save({ canonical: "https://evil.example/page" }, { slug: "other" }));
    assert.equal(bad.ok, false);
    assert.ok(!bad.ok && bad.fieldErrors?.["seo.canonical"]);
  });

  it("older documents read as the defaults", () => {
    assert.deepEqual(seoLib.normalizeSeo(undefined), seoLib.DEFAULT_SEO);
    assert.equal(seoLib.normalizeSeo({ noindex: "yes", title: 5 }).noindex, false);
  });

  it("metadata uses the SEO tab, falls back to the title and summary, and honours noindex and canonical", () => {
    const m = meta.builderMetadata({ seo: { ...seoLib.DEFAULT_SEO, title: "Search title", noindex: true, canonical: "/pricing", ogTitle: "Share me" }, title: "Page", excerpt: "Summary", coverImage: "", path: "/page", locale: "en-us", type: "website" });
    assert.equal(m.title, "Search title");
    assert.equal(m.description, "Summary");
    assert.deepEqual(m.robots, { index: false, follow: true });
    assert.match(String(m.alternates?.canonical), /\/pricing$/);
    assert.equal((m.openGraph as { title?: string }).title, "Share me");
    const plain = meta.builderMetadata({ seo: seoLib.DEFAULT_SEO, title: "Page", excerpt: "", coverImage: "", path: "/page", locale: "en-us", type: "website" });
    assert.equal(plain.title, "Page");
    assert.match(String(plain.alternates?.canonical), /\/page$/);
  });

  it("builds FAQ structured data from FAQ blocks unless it is switched off", () => {
    const d = docOf({ id: "bfaq000001", type: "site", section: validFaq } as RootBlock);
    const schema = meta.builderFaqSchema(d, seoLib.DEFAULT_SEO) as { mainEntity?: unknown[] } | null;
    assert.equal(schema?.mainEntity?.length, 3);
    assert.equal(meta.builderFaqSchema(d, { ...seoLib.DEFAULT_SEO, faqSchema: false }), null);
    assert.equal(meta.builderFaqSchema(docOf(), seoLib.DEFAULT_SEO), null);
  });

  it("the checklist follows the focus keyword through title, description, headline, address and opening text", () => {
    const doc = docOf(section("bsecaaaa01", [rich("brich00001", "Our spring offer covers the first year.")]));
    const all = (seo: Partial<import("@/lib/builder/seo").PostSeo>, slug = "spring-offer") =>
      Object.fromEntries(seoLib.seoChecks({ seo: { ...seoLib.DEFAULT_SEO, ...seo }, title: "The spring offer for new sites", excerpt: "x", slug, doc, kind: "post" }).map((c) => [c.id, c.ok]));
    const good = all({ focusKeyword: "spring offer", description: "The spring offer gives new sites a first year at one price, with backups and support included." });
    for (const id of ["keywordSet", "keywordInTitle", "keywordInDescription", "keywordInH1", "keywordInSlug", "keywordInOpening", "titleLength", "descriptionLength", "indexable"]) assert.equal(good[id], true, id);
    const none = all({}, "other");
    assert.equal(none.keywordSet, false);
    assert.equal(none.keywordInSlug, false);
    assert.equal(all({ noindex: true }).indexable, false);
  });

  it("noindex pages and posts stay out of the sitemap lists", async () => {
    const page = await posts.createPost(ADMIN, { ...save({ noindex: true }, { slug: "hidden-page" }), kind: "page" });
    const shown = await posts.createPost(ADMIN, { ...save({}, { slug: "shown-page" }), kind: "page" });
    const post = await posts.createPost(ADMIN, save({ noindex: true }, { slug: "hidden-post" }));
    assert.ok(page.ok && shown.ok && post.ok);
    for (const id of [page.data.id, shown.data.id, post.data.id]) assert.ok((await posts.setPublished(ADMIN, id, true)).ok);
    assert.deepEqual((await pages.listPublishedPageSlugs({ indexable: true })).map((p) => p.slug), ["shown-page"]);
    assert.equal((await pages.listPublishedPageSlugs()).length, 2, "prerendering still lists every published page");
    assert.deepEqual(await blog.listSlugs(), []);
  });
});
