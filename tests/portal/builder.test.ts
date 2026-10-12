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
const GUEST = { id: "65f000000000000000000003", email: "guest@example.com", name: "Gil Guest", role: 888 as const };

const para = (text: string) => ({ type: "doc" as const, content: [{ type: "paragraph" as const, content: [{ type: "text" as const, text }] }] });
const withHeading = (h: string, text: string) => ({ type: "doc" as const, content: [{ type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: h }] }, ...para(text).content] });
const block = (type: string, props: Record<string, unknown>, id = `b${type.toLowerCase().padEnd(9, "0").slice(0, 9)}`): Block => ({ id, type, props });
const textBlock = (id: string, text: string): Block => ({ id, type: "Text", props: { content: para(text), width: "narrow" } });
const docOf = (...list: Block[]): BuilderDoc => ({ version: 3, settings: { spacing: "normal" }, blocks: list });

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

  it("a new block starts empty: it shows nothing, saves, and nothing in it has to be filled in", () => {
    for (const def of blocks.BLOCKS) {
      const fresh = blocks.createBlock(def.type)!;
      assert.equal(blocks.prepareBlock(fresh), null, def.type);
      assert.deepEqual(problemsOf(fresh), [], def.type);
      assert.ok(validate.parseBuilderDoc(docOf(fresh)).ok, `${def.type} saves as a draft`);
    }
  });

  it("offers the requested components: two columns, code, centred hero, both offer tickets, the split action band", () => {
    for (const type of ["Text", "TwoColumn", "CodeBlock", "CenteredHero", "OfferSplit", "OfferCentered", "ActionBand", "Faq"]) assert.ok(blocks.blockDef(type), type);
    for (const old of ["Hero", "OfferBanner"]) assert.equal(blocks.blockDef(old), undefined, `${old} is now converted on load`);
  });

  it("a hero may sit anywhere: on a page the first one is the H1, in a post the title is", () => {
    const hero = block("CenteredHero", { title: "Hosting that looks after itself" }, "bhero00001");
    const second = block("CenteredHero", { title: "Second hero" }, "bhero00002");
    const doc = docOf(textBlock("btext00001", "Intro"), hero, second);
    assert.ok(validate.parseBuilderDoc(doc).ok);
    assert.deepEqual(validate.publishProblems(doc), []);
    assert.deepEqual(docs.docHeadings(doc, "Page title", "page").map((h) => [h.level, h.text]), [[1, "Hosting that looks after itself"], [2, "Second hero"]]);
    assert.deepEqual(docs.docHeadings(doc, "Post title", "post").map((h) => [h.level, h.text]), [[1, "Post title"], [2, "Hosting that looks after itself"], [2, "Second hero"]]);
    const page = markup(render.renderBuilderDoc(doc, "page").body);
    assert.match(page, /<h1[^>]*>Hosting that looks after itself<\/h1>/);
    assert.doesNotMatch(markup(render.renderBuilderDoc(doc, "post").body), /<h1/, "the blog prints the post title as the H1");
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

  it("the page setting is the space between sections; there is no page width any more", () => {
    const roomy = docs.setSettings(doc, { spacing: "roomy" });
    assert.deepEqual(roomy.settings, { spacing: "roomy" });
    assert.deepEqual(docs.pageFrame(roomy.settings), { className: "builder-page", "data-spacing": "roomy" });
    assert.equal(validate.parseBuilderDoc({ ...doc, settings: { width: "7xl", spacing: "normal" } }).ok, false);
  });
});

describe("saving (structure)", () => {
  it("accepts a well-formed document, as an object or a JSON string", () => {
    const doc = docOf(textBlock("btext00001", "Hello"), block("CtaBand", validCta));
    assert.ok(validate.parseBuilderDoc(doc).ok);
    assert.ok(validate.parseBuilderDoc(JSON.stringify(doc)).ok);
  });

  it("refuses unknown blocks, unknown fields, repeated ids and unsafe rich text", () => {
    assert.equal(validate.parseBuilderDoc(docOf(block("Marquee", {}))).ok, false);
    assert.equal(validate.parseBuilderDoc(docOf(block("CtaBand", { ...validCta, script: "x" }))).ok, false);
    assert.equal(validate.parseBuilderDoc(docOf(textBlock("bsame00001", "A"), textBlock("bsame00001", "B"))).ok, false);
    const unsafe = { type: "doc", content: [{ type: "image", attrs: { src: "javascript:alert(1)" } }] };
    assert.equal(validate.parseBuilderDoc(docOf(block("Text", { content: unsafe }))).ok, false);
    assert.equal(validate.parseBuilderDoc("{not json").ok, false);
  });
});

describe("publishing rules", () => {
  it("nothing is required: a partly filled block publishes and shows what is filled in", () => {
    const partial = [
      block("CtaBand", { title: "Go" }),
      block("CtaBand", { description: "Only a line of text." }, "bcta000002"),
      block("OfferSplit", { primaryCta: { label: "See the plans", href: "/pricing" } }),
      block("ActionBand", { label: "Growth" }),
      block("Image", { image: { src: "/images/a.png", alt: "" } }),
      block("Video", { url: "https://youtu.be/dQw4w9WgXcQ" }),
      block("Faq", { ...validFaq, items: [...validFaq.items, { question: "Half written?" }] }),
    ];
    assert.deepEqual(validate.publishProblems(docOf(...partial)), []);
    const html = markup(render.renderBuilderDoc(docOf(...partial), "page").body);
    for (const words of ["Go", "Only a line of text.", "See the plans", "Growth", "Half written?"]) assert.ok(html.includes(words), words);
    assert.match(html, /<img[^>]*src="\/images\/a.png"[^>]*alt=""|alt=""[^>]*src="\/images\/a.png"/, "an image without a description shows as decorative");
    assert.doesNotMatch(html, /<h2[^>]*><\/h2>/, "an empty heading is left out, not drawn empty");
  });

  it("reports only what cannot work: a broken link, an unsafe image and a wrong video address", () => {
    assert.ok(problemsOf(block("CtaBand", { title: "Go", primaryCta: { label: "Go", href: "javascript:alert(1)" } })).some((m) => /link must start/.test(m)));
    assert.ok(problemsOf(block("CtaBand", { primaryCta: { label: "", href: "/pricing" } })).some((m) => /needs text/.test(m)));
    assert.ok(problemsOf(block("Image", { image: { src: "javascript:alert(1)", alt: "x" } })).some((m) => /image address/.test(m)));
    assert.ok(problemsOf(block("Video", { url: "https://vimeo.com/1", title: "Demo" })).some((m) => /youtube/.test(m)));
  });

  it("an empty page cannot be published; an empty block is simply left out", () => {
    assert.ok(validate.publishProblems(docOf()).some((p) => p.blockId === ""));
    assert.deepEqual(validate.publishProblems(docOf(block("Text", { content: { type: "doc", content: [{ type: "paragraph" }] } }))), []);
  });

  it("a complete document has no problems", () => {
    const doc = docOf(block("CenteredHero", { title: "Hosting that looks after itself" }), textBlock("btext00001", "Body"), block("Faq", validFaq), block("CtaBand", validCta));
    assert.deepEqual(validate.publishProblems(doc), []);
  });
});

describe("rendering", () => {
  it("renders text with heading anchors and a table of contents, and media safely", () => {
    const doc = docOf(
      block("Text", { content: withHeading("Getting started", "Hello there."), width: "narrow" }, "btext00001"),
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
    const canvas = noIds(markup(def.render(blocks.prepareBlock(b), { editing: true })));
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

  it("a post and a page draw the same blocks the same way", () => {
    const doc = docOf(textBlock("btext00001", "Body"), block("Faq", validFaq), block("CtaBand", validCta));
    const noIds = (html: string) => html.replace(/ (?:id|aria-labelledby)="[^"]*"/g, "");
    assert.equal(noIds(markup(render.renderBuilderDoc(doc, "post").body)), noIds(markup(render.renderBuilderDoc(doc, "page").body)));
  });

  it("text chooses its width, spacing and background; the site width and the page background by default", () => {
    const plain = markup(render.renderBuilderDoc(docOf(block("Text", { content: para("Hello.") })), "page").body);
    assert.match(plain, /<section class="section-y"><div class="container-site"><div class="article max-w-none/);
    const styled = markup(render.renderBuilderDoc(docOf(block("Text", { content: para("Hello."), width: "narrow", padding: "large", background: "dark" })), "page").body);
    assert.match(styled, /<section class="py-20 sm:py-28 lg:py-32 dark bg-background text-foreground"><div class="container-site max-w-3xl">/);
    assert.equal(validate.parseBuilderDoc(docOf(block("Text", { content: para("x"), width: "9xl" }))).ok, false);
  });

  it("two columns: each column's text fills its column, and the sizes are a choice", () => {
    const cols = block("TwoColumn", { left: withHeading("Before", "Your old host."), right: para("After the move."), split: "wideLeft" });
    const out = render.renderBuilderDoc(docOf(cols), "page");
    const html = markup(out.body);
    assert.match(html, /lg:grid-cols-\[2fr_1fr\]/);
    assert.match(html, /<h2 id="before">Before<\/h2>[^]*After the move\./);
    assert.equal((html.match(/class="article min-w-0 max-w-none/g) ?? []).length, 2);
    assert.deepEqual(out.toc.map((t) => t.id), ["before"]);
    assert.ok(blocks.prepareBlock(block("TwoColumn", { right: para("Only the right.") })), "one column is enough to show");
    assert.match(html, /<div class="px-\[var\(--gutter\)\]">/, "full width by default");
    assert.doesNotMatch(html, /container-site/);
  });

  it("a code block keeps the code as written, escaped, with its title", () => {
    const code = block("CodeBlock", { code: "\n  wp plugin list\n<script>\n\n", title: "Terminal", language: "bash" });
    const html = markup(render.renderBuilderDoc(docOf(code), "page").body);
    assert.match(html, /<code>  wp plugin list\n&lt;script&gt;<\/code>/);
    assert.match(html, /Terminal/);
  });

  it("the offer tickets show no price, split beside the text or centred under it", () => {
    const words = { title: "Move your site this week", description: "We copy it for you.", primaryCta: { label: "Start the move", href: "/migration" }, ticketLabel: "Migration" };
    const split = markup(render.renderBuilderDoc(docOf(block("OfferSplit", words)), "page").body);
    const centred = markup(render.renderBuilderDoc(docOf(block("OfferCentered", words)), "page").body);
    for (const html of [split, centred]) {
      assert.match(html, /Start the move/);
      assert.doesNotMatch(html, /\$|£|€/, "no price");
    }
    assert.match(split, /lg:rotate-2/, "the upright ticket beside the text");
    assert.match(centred, /mx-auto mt-14 max-w-4xl/, "the long ticket under the text");
  });

  it("the action band is the split one: the plan on navy, the action on the orange block", () => {
    const html = markup(render.renderBuilderDoc(docOf(block("ActionBand", { label: "Growth plan", line: "For busy shops.", cta: { label: "Choose Growth", href: "/pricing" } })), "page").body);
    assert.match(html, /band-ink/);
    assert.match(html, /bg-primary/);
    assert.match(html, /Choose Growth/);
    assert.doesNotMatch(html, /\$/, "no plan picked, no price");
  });

  it("the action band shows a picked plan's price from the price list, with its renewal and the tax line", async () => {
    const { buildPlanCards } = await import("@/lib/pricing/plans");
    const growth = buildPlanCards().find((p) => p.id === "growth")!;
    const doc = docOf(block("ActionBand", { label: "Growth plan", plan: "growth", cta: { label: "Choose Growth", href: "/pricing" } }));
    assert.ok(validate.parseBuilderDoc(doc).ok, "only the plan id is stored");
    const html = markup(render.renderBuilderDoc(doc, "page").body);
    const { showPrices } = await import("@/lib/flags");
    if (showPrices()) {
      assert.ok(growth.annual && html.includes(growth.annual), "the price from data/pricing.json");
      assert.ok(growth.renewal && html.includes(growth.renewal), "the renewal price");
      assert.match(html, /Customers in India pay GST/);
    } else {
      assert.doesNotMatch(html, /\$/, "hidden while prices are not confirmed");
    }
    assert.equal(validate.parseBuilderDoc(docOf(block("ActionBand", { label: "x", plan: "29.99" }))).ok, false, "a typed price is refused");
  });

  it("a gallery shows every picture it has, with their captions", () => {
    const g = block("Gallery", { title: "Our office", images: [{ image: { src: "/images/a.png", alt: "Front desk" }, caption: "Reception" }, { image: { src: "/images/b.png", alt: "" } }, {}], layout: "masonry", columns: 4 });
    const html = markup(render.renderBuilderDoc(docOf(g), "page").body);
    assert.match(html, /alt="Front desk"/);
    assert.match(html, /Reception/);
    assert.match(html, /b\.png/, "a picture without a description shows too");
    assert.deepEqual(problemsOf(g), []);
  });
});

describe("older content", () => {
  it("opens pre-builder posts as one Text block", () => {
    const doc = legacy.toBuilderDoc("<p>Old post</p>");
    assert.equal(doc.version, 3);
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
    assert.equal(doc.blocks[0]?.props.width, "site");
    assert.match(JSON.stringify(doc.blocks[0]?.props.content), /Intro.*First words/);
    assert.ok(validate.parseBuilderDoc(v1).ok, "an editor tab still holding version 1 can save");
    assert.ok(markup(render.renderBuilderDoc(doc, "page").body).includes(await stagingTitle()));
  });

  it("turns version 2 documents into version 3: no page width, the new hero, offer and band blocks", () => {
    const v2 = {
      version: 2,
      settings: { width: "7xl", spacing: "roomy" },
      blocks: [
        { id: "bhero00001", type: "Hero", props: { title: "Hello", image: { src: "/a.png", alt: "A" } } },
        { id: "btext00001", type: "Text", props: { content: para("Body"), width: "wide" } },
        { id: "bimg000001", type: "Image", props: { image: { src: "/a.png", alt: "A" }, width: "text" } },
        { id: "boffer0001", type: "OfferBanner", props: { title: "Offer", layout: "centered", scope: "page" } },
        { id: "boffer0002", type: "OfferBanner", props: { title: "Offer", layout: "compact" } },
        { id: "bband00001", type: "ActionBand", props: { label: "Growth", variant: "pill" } },
      ],
    };
    const doc = legacy.toBuilderDoc(v2);
    assert.deepEqual(doc.settings, { spacing: "roomy" });
    assert.deepEqual(doc.blocks.map((b) => b.type), ["CenteredHero", "Text", "Image", "OfferCentered", "OfferSplit", "ActionBand"]);
    assert.deepEqual(doc.blocks[0]?.props, { title: "Hello" });
    assert.equal(doc.blocks[1]?.props.width, "site");
    assert.equal(doc.blocks[2]?.props.width, "narrow");
    assert.deepEqual(doc.blocks[3]?.props, { title: "Offer", scope: "page" });
    assert.deepEqual(doc.blocks[5]?.props, { label: "Growth" });
    assert.ok(validate.parseBuilderDoc(v2).ok, "an editor tab still holding version 2 can save");
  });
});

describe("SEO generator", () => {
  const source = (over: Partial<import("@/lib/builder/seo-generate").SeoSource> = {}) => ({
    doc: docOf(
      block("Text", { content: withHeading("Moving a WordPress site", "Moving a WordPress site takes about a day. We copy the files and the database first. Your site stays online while we work. Then we switch the address when you agree."), width: "narrow" }),
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

  it("staff create pages as drafts; a save without a kind keeps the stored one", async () => {
    const res = await posts.createPost(STAFF, { ...save(), kind: "page", status: "published" });
    assert.ok(res.ok, res.ok ? "" : res.error);
    assert.equal(res.data.kind, "page");
    const saved = await PostModel.findById(res.data.id).lean();
    assert.equal(saved?.status, "draft");
    const updated = await posts.updatePost(STAFF, res.data.id, save());
    assert.ok(updated.ok);
    assert.equal((await PostModel.findById(res.data.id).lean())?.kind, "page");
  });

  it("New post saves an empty draft that the editor opens by slug, and it needs a title to publish", async () => {
    const draft = await posts.createDraft(STAFF);
    assert.ok(draft.ok, draft.ok ? "" : draft.error);
    assert.match(draft.data.slug, /^draft-[a-f0-9]{8}$/);
    assert.deepEqual([draft.data.kind, draft.data.status], ["post", "draft"]);
    const opened = await posts.getPortalPostBySlug(STAFF, draft.data.slug);
    assert.ok(opened.ok && opened.data.title === "" && opened.data.content.blocks.length === 0);
    assert.equal((await posts.createDraft(GUEST)).ok, false, "guests cannot create");
    const untitled = await posts.setPublished(ADMIN, draft.data.id, true);
    assert.equal(untitled.ok, false);
    assert.ok(!untitled.ok && untitled.fieldErrors?.title);
  });

  it("a new draft's first title gives it a free slug", async () => {
    assert.ok((await posts.createPost(ADMIN, save({ slug: "spring-offer" }))).ok);
    const draft = await posts.createDraft(ADMIN);
    assert.ok(draft.ok);
    const named = await posts.updatePost(ADMIN, draft.data.id, { ...save({ slug: "spring-offer" }), autoSlug: true, slugWords: ["hosting"] });
    assert.ok(named.ok, named.ok ? "" : named.error);
    assert.equal(named.data.slug, "hosting-spring-offer");
    assert.ok((await posts.setPublished(ADMIN, draft.data.id, true)).ok);
  });

  it("the switcher moves the same blocks between the blog and the pages", async () => {
    const created = await posts.createPost(ADMIN, save({ slug: "moving-day" }));
    assert.ok(created.ok);
    assert.ok((await posts.setPublished(ADMIN, created.data.id, true)).ok);
    assert.ok(await blog.getPost("moving-day"), "starts as a blog post");
    const moved = await posts.updatePost(ADMIN, created.data.id, { ...save({ slug: "moving-day" }), kind: "page" });
    assert.ok(moved.ok, moved.ok ? "" : moved.error);
    assert.deepEqual([moved.data.previousKind, moved.data.kind], ["post", "page"]);
    assert.equal(await blog.getPost("moving-day"), null, "gone from the blog");
    assert.ok(await pages.getPublishedPage("moving-day"), "prints at /moving-day");
    const back = await posts.updatePost(ADMIN, created.data.id, { ...save({ slug: "moving-day" }), kind: "post" });
    assert.ok(back.ok);
    assert.ok(await blog.getPost("moving-day"));
    assert.equal(await pages.getPublishedPage("moving-day"), null);
  });

  it("a post cannot switch to a page on an address the site already uses", async () => {
    const created = await posts.createPost(ADMIN, save({ slug: "pricing" }));
    assert.ok(created.ok, "a blog post may use it: it prints at /blog/pricing");
    const moved = await posts.updatePost(ADMIN, created.data.id, { ...save({ slug: "pricing" }), kind: "page" });
    assert.equal(moved.ok, false);
    assert.equal((await PostModel.findById(created.data.id).lean())?.kind ?? "post", "post");
  });

  it("refuses page slugs the site already uses, and the slug 'new'", async () => {
    const page = await posts.createPost(ADMIN, { ...save({ slug: "pricing" }), kind: "page" });
    assert.equal(page.ok, false);
    const post = await posts.createPost(ADMIN, save({ slug: "new" }));
    assert.equal(post.ok, false);
  });

  it("publishing is refused only for a link or address that cannot work, with the reasons per block", async () => {
    const empty = blocks.createBlock("CtaBand")!;
    const half = await posts.createPost(ADMIN, { ...save({ slug: "offer", content: docOf(textBlock("btext00001", "Hello"), empty) }), kind: "page" });
    assert.ok(half.ok);
    assert.ok((await posts.setPublished(ADMIN, half.data.id, true)).ok, "empty blocks never stop publishing");
    const broken = block("CtaBand", { title: "Go", primaryCta: { label: "Go", href: "javascript:alert(1)" } }, "bcta000008");
    const created = await posts.createPost(ADMIN, { ...save({ slug: "offer-two", content: docOf(broken) }), kind: "page" });
    assert.ok(created.ok);
    const res = await posts.setPublished(ADMIN, created.data.id, true);
    assert.equal(res.ok, false);
    assert.ok(!res.ok && res.fieldErrors?.[broken.id]);
    assert.equal((await PostModel.findById(created.data.id).lean())?.status, "draft");
  });

  it("a live page cannot be saved with a broken link, so nothing disappears from it silently", async () => {
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
    assert.ok(opened.ok && opened.data.content.version === 3);
    assert.equal((await posts.getPortalPostBySlug(STAFF, { $ne: "" })).ok, false);
    const listed = await posts.listPortalPosts(STAFF, { kind: "page" });
    assert.ok(listed.ok && listed.data.length === 0);
  });
});

describe("templates", () => {
  it("every template is a valid draft", async () => {
    const { TEMPLATES } = await import("@/lib/builder/templates");
    for (const t of TEMPLATES) {
      const doc = docOf(...t.blocks());
      assert.ok(validate.parseBuilderDoc(doc).ok, t.id);
      assert.ok(doc.blocks.length > 0, t.id);
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
