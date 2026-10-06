// Minimal WordPress REST mock for tests and CI. Serves /wp-json/wp/v2/{posts,categories}.
import { createServer } from "node:http";

const PORT = Number(process.env.WP_MOCK_PORT ?? 3900);
const cats = [
  { id: 2, name: "Performance", slug: "performance", count: 8 },
  { id: 3, name: "Security", slug: "security", count: 4 },
];
const body = `<p>Intro paragraph with an <a href="https://example.org/x" onclick="alert(1)">external link</a>.</p>
<h2>First section</h2><p>Text.</p><script>window.__pwned = true</script>
<h2>Second section</h2><p>More <img src="x" onerror="window.__pwned=true" alt="x"> text.</p>
<h3>A subsection</h3><p>Even more.</p><h2>Third section</h2><p>Done.</p><iframe src="https://evil.example"></iframe>`;
const posts = Array.from({ length: 12 }, (_, i) => {
  const cat = i % 3 === 0 ? cats[1] : cats[0];
  return {
    slug: `test-post-${i + 1}`,
    date_gmt: `2026-09-${String(28 - i).padStart(2, "0")}T09:00:00`,
    modified_gmt: `2026-09-${String(28 - i).padStart(2, "0")}T09:00:00`,
    title: { rendered: `Test post ${i + 1}` },
    excerpt: { rendered: `<p>Summary of test post ${i + 1}.</p>` },
    content: { rendered: body },
    _embedded: { author: [{ name: "Test Author", description: i === 0 ? "Writes about hosting." : "" }], "wp:term": [[{ id: cat.id, name: cat.name, slug: cat.slug, taxonomy: "category" }]] },
  };
});

createServer((req, res) => {
  const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);
  const json = (data, headers = {}) => {
    res.writeHead(200, { "Content-Type": "application/json", ...headers });
    res.end(JSON.stringify(data));
  };
  if (url.pathname.endsWith("/categories")) {
    const slug = url.searchParams.get("slug");
    return json(slug ? cats.filter((c) => c.slug === slug) : cats);
  }
  if (url.pathname.endsWith("/posts")) {
    const slug = url.searchParams.get("slug");
    if (slug) return json(posts.filter((p) => p.slug === slug));
    const catId = Number(url.searchParams.get("categories") ?? 0);
    const catSlug = catId ? cats.find((c) => c.id === catId)?.slug : undefined;
    const filtered = catSlug ? posts.filter((p) => p._embedded["wp:term"][0][0].slug === catSlug) : posts;
    const per = Number(url.searchParams.get("per_page") ?? 10);
    const page = Number(url.searchParams.get("page") ?? 1);
    return json(filtered.slice((page - 1) * per, page * per), { "x-wp-totalpages": String(Math.ceil(filtered.length / per)) });
  }
  res.writeHead(404).end();
}).listen(PORT, () => console.log(`WP mock on ${PORT}`));
