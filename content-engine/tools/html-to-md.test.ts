/** html-to-md: the tags a post body uses, entities, and the content that must be dropped. */
import assert from "node:assert/strict";
import { test } from "node:test";
import { htmlToMarkdown } from "./html-to-md";

test("headings, paragraphs and inline marks", () => {
  const md = htmlToMarkdown("<h2>Section</h2><p>One <strong>bold</strong> and <em>soft</em> text.</p><h6>Deep</h6>");
  assert.equal(md, "## Section\n\nOne **bold** and *soft* text.\n\n###### Deep");
});

test("links keep their href and a link without one keeps only the text", () => {
  assert.equal(htmlToMarkdown('<p>See <a href="/kb/x" class="y">the guide</a> or <a name="t">anchor</a>.</p>'), "See [the guide](/kb/x) or anchor.");
});

test("unordered, ordered and nested lists", () => {
  assert.equal(htmlToMarkdown("<ul><li>A</li><li>B<ul><li>B1</li></ul></li></ul>"), "- A\n- B\n  - B1");
  assert.equal(htmlToMarkdown("<ol><li>First</li><li>Second</li></ol><p>After</p>"), "1. First\n2. Second\n\nAfter");
});

test("br, blockquote, pre and code", () => {
  assert.equal(htmlToMarkdown("<p>Line one<br>Line two</p>"), "Line one\nLine two");
  assert.equal(htmlToMarkdown("<blockquote><p>Quoted</p><p>More</p></blockquote>"), "> Quoted\n>\n> More");
  assert.equal(htmlToMarkdown("<p>Run <code>wp core version</code> now.</p>"), "Run `wp core version` now.");
  assert.equal(htmlToMarkdown("<pre><code>a &lt; b\n  c</code></pre>"), "```\na < b\n  c\n```");
});

test("script, style, iframe and comments are removed with their content; other tags are stripped", () => {
  const md = htmlToMarkdown('<p>Keep</p><script>alert(1)</script><style>p{}</style><iframe src="x">frame</iframe><!-- note --><div><span>Span text</span></div>');
  assert.equal(md, "Keep\n\nSpan text");
});

test("entities are decoded and whitespace is collapsed", () => {
  assert.equal(htmlToMarkdown("<p>Tom &amp; Jerry &#8217;s   &#x2014;\n  &nbsp;done &unknown;</p>"), "Tom & Jerry ’s — done &unknown;");
});

test("tables become Markdown rows with a header separator; cells never run together", () => {
  assert.equal(
    htmlToMarkdown("<p>Before</p><table><thead><tr><th>Plan</th><th>Storage</th></tr></thead><tbody><tr><td>Basic</td><td> 5 GB </td></tr><tr><td><strong>Pro</strong></td><td>a | b</td></tr></tbody></table><p>After</p>"),
    "Before\n\n| Plan | Storage |\n| --- | --- |\n| Basic | 5 GB |\n| **Pro** | a \\| b |\n\nAfter",
  );
  assert.equal(htmlToMarkdown("<table><tr><td>A</td><td>B</td></tr></table>"), "| A | B |");
});
