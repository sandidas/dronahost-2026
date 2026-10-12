import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { after, before, beforeEach, describe, it } from "node:test";
import { NextIntlClientProvider } from "next-intl";
import { createElement, type ComponentProps } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { Block, BuilderDoc } from "@/lib/builder/model";
import { startDb, stopDb } from "./setup";

let blocks: typeof import("@/lib/builder/blocks");
let docs: typeof import("@/lib/builder/doc");
let fields: typeof import("@/lib/builder/fields");
let validate: typeof import("@/lib/builder/validate");
let render: typeof import("@/lib/builder/render");
let legacy: typeof import("@/lib/builder/legacy");
let gen: typeof import("@/lib/builder/seo-generate");
let reserved: typeof import("@/lib/builder/reserved");
let posts: typeof import("@/lib/portal/posts");
let pages: typeof import("@/lib/builder/pages");
let blog: typeof import("@/lib/blog/mongo");
let PostModel: typeof import("@/lib/models/post").Post;

const ADMIN = { id: "65f000000000000000000001", email: "admin@example.com", name: "Ada Admin", role: 1001 as const };
const STAFF = { id: "65f000000000000000000002", email: "staff@example.com", name: "Sam Staff", role: 999 as const };

const para = (text: string) => ({ type: "doc" as const, content: [{ type: "paragraph" as const, content: [{ type: "text" as const, text }] }] });
const withHeading = (h: string, text: string) => ({ type: "doc" as const, content: [{ type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: h }] }, ...para(text).content] });
const block = (type: string, props: Record<string, unknown>, id = `b${type.toLowerCase().padEnd(9, "0").slice(0, 9)}`): Block => ({ id, type, props });
const textBlock = (id: string, text: string): Block => ({ id, type: "Text", props: { content: para(text), width: "text" } });
const docOf = (...list: Block[]): BuilderDoc => ({ version: 2, settings: { width: "default", spacing: "normal" }, blocks: list });

const validCta = { title: "Ready to move your site?", primaryCta: { label: "See the plans", href: "/pricing" } };
const validFaq = {
  title: "Questions about moving",
  items: [
    { question: "How long does a move take?", answer: "Most moves finish within a day." },
    { question: "Will my site go offline?", answer: "No. The old copy stays live until the new one is ready." },
    { question: "Do I need to change my email?", answer: "No. Email stays where it is unless you ask us to move it." },
  ],
};
/** Block markup, with the locale provider the site layout normally supplies (the site's links use next-intl). */
const markup = (node: unknown) => renderToStaticMarkup(createElement(NextIntlClientProvider, { locale: "en-us", messages: {} } as ComponentProps<typeof NextIntlClientProvider>, node as never));
/** The feature library's own title for the staging feature (first-version sections took their words from the library). */
const stagingTitle = async () => (await import("@/lib/content/features")).FEATURE_LIBRARY.find((f) => f.id === "staging")!.tile.title;
const problemsOf = (b: Block) => fields.fieldProblems(blocks.blockDef(b.type)!.fields, b.props);

before(async () => {
  await startDb();
  blocks = await import("@/lib/builder/blocks");
  docs = await import("@/lib/builder/doc");
  fields = await import("@/lib/builder/fields");
  validate = await import("@/lib/builder/validate");
  render = await import("@/lib/builder/render");
  legacy = await import("@/lib/builder/legacy");
  gen = await import("@/lib/builder/seo-generate");
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

describe("block registry", () => {
  it("every block has a name, an icon, fields with unique keys and a renderer", () => {
    const types = blocks.BLOCKS.map((b) => b.type);
    assert.equal(new Set(types).size, types.length);
    for (const def of blocks.BLOCKS) {
      assert.ok(blocks.blockName(def.type).hint, `${def.type} needs a name and hint in BUILDER_TEXT.blocks`);
      assert.ok(blocks.GROUPS.includes(def.group), def.type);
      const keys = def.fields.map((f) => f.key);
      assert.equal(new Set(keys).size, keys.length, def.type);
    }
  });

  it("a new block starts empty: it shows nothing, saves as a draft and says what to fill in", () => {
    for (const def of blocks.BLOCKS) {
      const fresh = blocks.createBlock(def.type)!;
      assert.equal(blocks.prepareBlock(fresh), null, def.type);
      assert.ok(problemsOf(fresh).length > 0, def.type);
      assert.ok(validate.parseBuilderDoc(docOf(fresh), "page").ok, `${def.type} saves as a draft`);
    }
  });

  it("the hero is for pages only, and only first", () => {
    assert.ok(!blocks.blocksFor("post").some((d) => d.type === "Hero"));
    const hero = block("Hero", { title: "Hosting that looks after itself" });
    assert.equal(validate.parseBuilderDoc(docOf(hero), "post").ok, false);
    assert.ok(validate.publishProblems(docOf(textBlock("btext00001", "Intro"), hero), "page").some((p) => p.blockId === hero.id));
  });
});

describe("document operations", () => {
  const a = textBlock("baaaaaaaa1", "A");
  const b = textBlock("bbbbbbbbb1", "B");
  const c = textBlock("bccccccccc", "C");
  const doc = docOf(a, b, c);

  it("move, nudge, duplicate and remove without changing the input", () => {
    assert.deepEqual(docs.moveBlock(doc, a.id, 2).blocks.map((x) => x.id), [b.id, c.id, a.id]);
    assert.deepEqual(docs.nudgeBlock(doc, c.id, -1).blocks.map((x) => x.id), [a.id, c.id, b.id]);
    assert.equal(docs.nudgeBlock(doc, a.id, -1), doc);
    const dup = docs.duplicateBlock(doc, b.id);
    assert.equal(dup.doc.blocks.length, 4);
    assert.notEqual(dup.id, b.id);
    assert.deepEqual(docs.removeBlock(doc, b.id).blocks.map((x) => x.id), [a.id, c.id]);
    assert.deepEqual(doc.blocks.map((x) => x.id), [a.id, b.id, c.id]);
  });

  it("page settings change width and spacing, and the page wrapper carries them", () => {
    const wide = docs.setSettings(doc, { width: "7xl", spacing: "roomy" });
    assert.deepEqual(wide.settings, { width: "7xl", spacing: "roomy" });
    const frame = docs.pageFrame(wide.settings);
    assert.equal((frame.style as Record<string, string>)["--container-max"], "80rem");
    assert.equal(frame["data-spacing"], "roomy");
    assert.deepEqual(docs.pageFrame({ width: "default", spacing: "normal" }).style, {});
    assert.equal(validate.parseBuilderDoc({ ...doc, settings: { width: "9xl", spacing: "normal" } }, "page").ok, false);
  });
});

describe("saving (structure)", () => {
  it("accepts a well-formed document, as an object or a JSON string", () => {
    const doc = docOf(textBlock("btext00001", "Hello"), block("CtaBand", validCta));
    assert.ok(validate.parseBuilderDoc(doc, "page").ok);
    assert.ok(validate.parseBuilderDoc(JSON.stringify(doc), "page").ok);
  });

  it("refuses unknown blocks, unknown fields, repeated ids and unsafe rich text", () => {
    assert.equal(validate.parseBuilderDoc(docOf(block("Marquee", {})), "page").ok, false);
    assert.equal(validate.parseBuilderDoc(docOf(block("CtaBand", { ...validCta, script: "x" })), "page").ok, false);
    assert.equal(validate.parseBuilderDoc(docOf(textBlock("bsame00001", "A"), textBlock("bsame00001", "B")), "page").ok, false);
    const unsafe = { type: "doc", content: [{ type: "image", attrs: { src: "javascript:alert(1)" } }] };
    assert.equal(validate.parseBuilderDoc(docOf(block("Text", { content: unsafe })), "post").ok, false);
    assert.equal(validate.parseBuilderDoc("{not json", "post").ok, false);
  });
});

describe("publishing rules", () => {
  it("names what is missing in the words of the Block panel", () => {
    const messages = problemsOf(block("CtaBand", { title: "Go" }));
    assert.ok(messages.some((m) => m.startsWith("Main action")), messages.join(" | "));
  });

  it("reports a broken link, an unsafe image, a missing description and a wrong video address", () => {
    assert.ok(problemsOf(block("CtaBand", { title: "Go", primaryCta: { label: "Go", href: "javascript:alert(1)" } })).some((m) => /link must start/.test(m)));
    assert.ok(problemsOf(block("Image", { image: { src: "javascript:alert(1)", alt: "x" } })).some((m) => /image address/.test(m)));
    assert.ok(problemsOf(block("Image", { image: { src: "/images/a.png", alt: "" } })).some((m) => /describe the image/.test(m)));
    assert.ok(problemsOf(block("Video", { url: "https://vimeo.com/1", title: "Demo" })).some((m) => /youtube/.test(m)));
  });

  it("an empty page, an empty text block and a half-finished list item are reported", () => {
    assert.ok(validate.publishProblems(docOf(), "post").some((p) => p.blockId === ""));
    assert.ok(validate.publishProblems(docOf(block("Text", { content: { type: "doc", content: [{ type: "paragraph" }] } })), "post").length > 0);
    const faq = block("Faq", { ...validFaq, items: [...validFaq.items, { question: "Half written?" }] });
    assert.ok(problemsOf(faq).some((m) => /Question 4/.test(m)));
  });

  it("a complete document has no problems", () => {
    const doc = docOf(block("Hero", { title: "Hosting that looks after itself" }), textBlock("btext00001", "Body"), block("Faq", validFaq), block("CtaBand", validCta));
    assert.deepEqual(validate.publishProblems(doc, "page"), []);
  });
});

describe("rendering", () => {
  it("renders text with heading anchors and a table of contents, and media safely", () => {
    const doc = docOf(
      block("Text", { content: withHeading("Getting started", "Hello there."), width: "text" }, "btext00001"),
      block("Image", { image: { src: "/images/a.png", alt: "The dashboard" }, caption: "Your dashboard" }, "bimage0001"),
      block("Video", { url: "https://youtu.be/dQw4w9WgXcQ", title: "Demo" }, "bvideo0001"),
    );
    const out = render.renderBuilderDoc(doc, "post");
    const html = markup(out.body);
    assert.match(html, /<h2 id="getting-started">/);
    assert.deepEqual(out.toc.map((t) => t.id), ["getting-started"]);
    assert.match(html, /alt="The dashboard"/);
    assert.match(html, /youtube-nocookie\.com\/embed\/dQw4w9WgXcQ/);
    assert.match(out.text, /Hello there/);
  });

  it("the canvas and the public page draw a block with the same definition", () => {
    const b = block("CtaBand", validCta);
    const def = blocks.blockDef("CtaBand")!;
    // Element ids (useId) differ between two separate renders; everything else must match.
    const noIds = (html: string) => html.replace(/ (?:id|aria-labelledby)="[^"]*"/g, "");
    const canvas = noIds(markup(def.render(blocks.prepareBlock(b), { kind: "page", editing: true })));
    const page = noIds(markup(render.renderBuilderDoc(docOf(b), "page").body));
    assert.ok(page.includes(canvas), "the public page holds exactly the canvas markup");
  });

  it("shows nothing for a block with nothing to show, and drops unsafe links", () => {
    assert.equal(markup(render.renderBuilderDoc(docOf(blocks.createBlock("Faq")!), "page").body), '<div class="builder-page" data-spacing="normal"></div>');
    const tiles = block("LinkTiles", { title: "Go", items: [{ title: "Good", href: "/pricing" }, { title: "Bad", href: "javascript:alert(1)" }] });
    const html = markup(render.renderBuilderDoc(docOf(tiles), "page").body);
    assert.match(html, /Good/);
    assert.doesNotMatch(html, /javascript:/);
  });

  it("the page wrapper applies the content width from the page settings", () => {
    const doc = { ...docOf(block("CtaBand", validCta)), settings: { width: "5xl" as const, spacing: "compact" as const } };
    assert.match(markup(render.renderBuilderDoc(doc, "page").body), /style="--container-max:64rem" data-spacing="compact"/);
  });

  it("a gallery shows complete pictures only, with their captions", () => {
    const g = block("Gallery", { title: "Our office", images: [{ image: { src: "/images/a.png", alt: "Front desk" }, caption: "Reception" }, { image: { src: "/images/b.png", alt: "" } }, {}], layout: "masonry", columns: 4 });
    const html = markup(render.renderBuilderDoc(docOf(g), "page").body);
    assert.match(html, /alt="Front desk"/);
    assert.match(html, /Reception/);
    assert.doesNotMatch(html, /b\.png/, "a picture without a description is left out");
    assert.ok(problemsOf(g).some((m) => /Picture 2/.test(m)));
  });
});

describe("older content", () => {
  it("opens pre-builder posts as one Text block", () => {
    const doc = legacy.toBuilderDoc("<p>Old post</p>");
    assert.equal(doc.version, 2);
    assert.equal(doc.blocks[0]?.type, "Text");
  });

  it("turns version 1 sections into Text, Image and Video blocks in the same order", async () => {
    const v1 = {
      version: 1,
      blocks: [
        {
          id: "bsec000001",
          type: "section",
          props: { width: "wide" },
          children: [
            { id: "bhead00001", type: "heading", props: { text: "Intro", level: 2 } },
            { id: "brich00001", type: "richtext", props: { content: para("First words.") } },
            { id: "bimg000001", type: "image", props: { src: "/images/a.png", alt: "A", caption: "" } },
            { id: "bcols00001", type: "columns", props: { layout: "1-1" }, columns: [{ id: "bcol000001", children: [{ id: "brich00002", type: "richtext", props: { content: para("Left") } }] }, { id: "bcol000002", children: [] }] },
          ],
        },
        { id: "bsite00001", type: "site", section: { type: "CtaBand", content: validCta } },
        { id: "bsite00002", type: "site", section: { type: "BentoGrid", content: { h2: "Features", tiles: ["feature:staging"] } } },
      ],
    };
    const doc = legacy.toBuilderDoc(v1);
    assert.deepEqual(doc.blocks.map((b) => b.type), ["Text", "Image", "Text", "CtaBand", "FeatureCards"]);
    assert.equal(doc.blocks[0]?.props.width, "wide");
    assert.match(JSON.stringify(doc.blocks[0]?.props.content), /Intro.*First words/);
    assert.ok(validate.parseBuilderDoc(v1, "page").ok, "an editor tab still holding version 1 can save");
    assert.ok(markup(render.renderBuilderDoc(doc, "page").body).includes(await stagingTitle()));
  });
});

describe("SEO generator", () => {
  const source = (over: Partial<import("@/lib/builder/seo-generate").SeoSource> = {}) => ({
    doc: docOf(
      block("Text", { content: withHeading("Moving a WordPress site", "Moving a WordPress site takes about a day. We copy the files and the database first. Your site stays online while we work. Then we switch the address when you agree."), width: "text" }),
    ),
    kind: "post" as const,
    title: "How we move a WordPress site",
    excerpt: "",
    keyword: "",
    ...over,
  });

  it("suggests a keyword the page repeats, and a keyword-first title within 60 characters", () => {
    assert.equal(gen.suggestKeyword(source()), "wordpress site");
    assert.equal(gen.suggestTitle(source({ keyword: "site migration" })), "Site migration: How we move a WordPress site");
    assert.equal(gen.suggestTitle(source({ keyword: "wordpress site" })), "How we move a WordPress site");
    assert.ok(gen.suggestTitle(source({ title: "x ".repeat(80) })).length <= 60);
  });

  it("builds the description from whole sentences of the page, never the title", () => {
    const d = gen.suggestDescription(source());
    assert.ok(d.length >= 70 && d.length <= 160, d);
    assert.match(d, /^Moving a WordPress site takes about a day\./);
  });

  it("suggests a short slug from the keyword or the title", () => {
    assert.equal(gen.suggestSlug(source({ keyword: "Site Migration" })), "site-migration");
    assert.equal(gen.suggestSlug(source()), "move-wordpress-site");
    assert.ok(gen.slugPrefixWords(source(), "move-wordpress-site").every((w) => !["move", "wordpress", "site"].includes(w)));
  });

  it("finds a free slug: a word from the page in front when the slug is taken", async () => {
    const first = await posts.createPost(ADMIN, { title: "Pricing tips", slug: "pricing-tips", content: docOf(textBlock("btext00001", "Body")) });
    assert.ok(first.ok);
    const taken = await posts.checkSlug(STAFF, { slug: "pricing-tips", kind: "post", postId: null, words: ["hosting", "budget"] });
    assert.ok(taken.ok);
    assert.deepEqual(taken.data, { state: "taken", suggestion: "hosting-pricing-tips" });
    const own = await posts.checkSlug(STAFF, { slug: "pricing-tips", kind: "post", postId: first.data.id, words: [] });
    assert.ok(own.ok && own.data.state === "free", "a post's own slug is free for it");
    const reservedPage = await posts.checkSlug(STAFF, { slug: "pricing", kind: "page", postId: null, words: [] });
    assert.ok(reservedPage.ok && reservedPage.data.state === "reserved" && reservedPage.data.suggestion === "page-pricing");
  });

  it("a first save with a slug filled in from the title moves aside instead of failing", async () => {
    const save = { title: "Pricing tips", slug: "pricing-tips", content: docOf(textBlock("btext00001", "Body")) };
    assert.ok((await posts.createPost(ADMIN, save)).ok);
    assert.equal((await posts.createPost(ADMIN, save)).ok, false, "a typed slug is never changed");
    const auto = await posts.createPost(ADMIN, { ...save, autoSlug: true, slugWords: ["budget"] });
    assert.ok(auto.ok && auto.data.slug === "budget-pricing-tips");
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
  const save = (over: Record<string, unknown> = {}) => ({ title: "Spring offer", slug: "", excerpt: "Short.", coverImage: "", content: docOf(textBlock("btext00001", "Hello")), ...over });

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
    const unfinished = blocks.createBlock("CtaBand")!;
    const created = await posts.createPost(ADMIN, { ...save({ slug: "offer", content: docOf(unfinished) }), kind: "page" });
    assert.ok(created.ok);
    const res = await posts.setPublished(ADMIN, created.data.id, true);
    assert.equal(res.ok, false);
    assert.ok(!res.ok && res.fieldErrors?.[unfinished.id]);
    assert.equal((await PostModel.findById(created.data.id).lean())?.status, "draft");
  });

  it("a live page cannot be saved with an unfinished block, so nothing disappears from it silently", async () => {
    const created = await posts.createPost(ADMIN, { ...save({ slug: "live-page" }), kind: "page" });
    assert.ok(created.ok);
    assert.ok((await posts.setPublished(ADMIN, created.data.id, true)).ok);
    const unfinished = block("CtaBand", { title: "Half done", primaryCta: { label: "Go", href: "" } }, "bcta000009");
    const res = await posts.updatePost(ADMIN, created.data.id, { ...save({ slug: "live-page" }), content: docOf(textBlock("btext00001", "Hello"), unfinished) });
    assert.equal(res.ok, false);
    assert.ok(!res.ok && res.fieldErrors?.bcta000009);
    const draft = await posts.createPost(ADMIN, { ...save({ slug: "draft-page", content: docOf(unfinished) }), kind: "page" });
    assert.ok(draft.ok, "a draft saves whatever state it is in");
  });

  it("a published post saved by the first builder version still renders on the blog", async () => {
    await PostModel.collection.insertOne({
      title: "Old builder post",
      slug: "old-builder-post",
      excerpt: "",
      kind: "post",
      content: { version: 1, blocks: [{ id: "bold000001", type: "site", section: { type: "BentoGrid", content: { h2: "Features", tiles: ["feature:staging"] } } }] },
      coverImage: "",
      category: "",
      tags: [],
      author: { name: "Someone", bio: "", avatar: "" },
      status: "published",
      publishedAt: new Date(),
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const post = await blog.getPost("old-builder-post");
    assert.ok(post?.body);
    assert.ok(markup(post.body).includes(await stagingTitle()));
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
    assert.ok(opened.ok && opened.data.content.version === 2);
    assert.equal((await posts.getPortalPostBySlug(STAFF, { $ne: "" })).ok, false);
    const listed = await posts.listPortalPosts(STAFF, { kind: "page" });
    assert.ok(listed.ok && listed.data.length === 0);
  });
});

describe("templates", () => {
  it("every template is a valid draft for its kind, and post templates have no hero", async () => {
    const { TEMPLATES } = await import("@/lib/builder/templates");
    for (const t of TEMPLATES) {
      const doc = docOf(...t.blocks());
      assert.ok(validate.parseBuilderDoc(doc, t.kind).ok, t.id);
      assert.ok(doc.blocks.length > 0, t.id);
      if (t.kind === "post") assert.ok(!doc.blocks.some((b) => b.type === "Hero"), t.id);
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
  const save = (seo: Record<string, unknown>, over: Record<string, unknown> = {}) => ({ title: "Spring offer for small sites", slug: "", excerpt: "Short.", coverImage: "", content: docOf(textBlock("btext00001", "Body")), seo, ...over });

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
    const d = docOf(block("Faq", validFaq));
    const schema = meta.builderFaqSchema(d, seoLib.DEFAULT_SEO) as { mainEntity?: unknown[] } | null;
    assert.equal(schema?.mainEntity?.length, 3);
    assert.equal(meta.builderFaqSchema(d, { ...seoLib.DEFAULT_SEO, faqSchema: false }), null);
    assert.equal(meta.builderFaqSchema(docOf(), seoLib.DEFAULT_SEO), null);
  });

  it("the checklist follows the focus keyword through title, description, headline, address and opening text", () => {
    const doc = docOf(textBlock("btext00001", "Our spring offer covers the first year."));
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

describe("image storage settings", () => {
  const KEYS = ["S3_BUCKET", "S3_REGION", "S3_ACCESS_KEY_ID", "S3_SECRET_ACCESS_KEY", "S3_PUBLIC_URL", "S3_ENDPOINT", "AWS_REGION", "AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY"] as const;
  const withEnv = async (vars: Partial<Record<(typeof KEYS)[number], string>>, check: (configured: boolean) => void) => {
    const saved = Object.fromEntries(KEYS.map((k) => [k, process.env[k]]));
    for (const k of KEYS) delete process.env[k];
    Object.assign(process.env, vars);
    try {
      check((await import("@/lib/storage/s3")).storageConfigured());
    } finally {
      for (const k of KEYS) {
        if (saved[k] === undefined) delete process.env[k];
        else process.env[k] = saved[k];
      }
    }
  };

  it("works with a bucket and the standard AWS keys", async () => {
    await withEnv({ S3_BUCKET: "b", AWS_REGION: "eu-west-2", AWS_ACCESS_KEY_ID: "k", AWS_SECRET_ACCESS_KEY: "s" }, (on) => assert.equal(on, true));
  });

  it("is off without a bucket, and another S3 service needs its public address", async () => {
    await withEnv({ AWS_REGION: "eu-west-2", AWS_ACCESS_KEY_ID: "k", AWS_SECRET_ACCESS_KEY: "s" }, (on) => assert.equal(on, false));
    await withEnv({ S3_BUCKET: "b", S3_ENDPOINT: "https://r2.example", S3_REGION: "auto", S3_ACCESS_KEY_ID: "k", S3_SECRET_ACCESS_KEY: "s" }, (on) => assert.equal(on, false));
  });
});
