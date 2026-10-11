import "@/app/styles/rich-content.css";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import type { BlogPost } from "@/lib/blog/types";
import ArticleToc from "./ArticleToc";
import AuthorBox from "./AuthorBox";

const longDate = (iso: string) => new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(iso));

/** Article template: breadcrumbs, meta line, cover image, sticky TOC beside the body, author box. */
export default function ArticleLayout({ post, children }: { post: BlogPost; children?: React.ReactNode }) {
  const updated = post.modified.slice(0, 10) !== post.published.slice(0, 10);
  return (
    <article className="container-site section-y">
      <Breadcrumbs path={`/blog/${post.slug}`} overrides={{ [post.slug]: post.title }} />
      <header className="mx-auto mt-8 max-w-3xl">
        {post.category && <p className="t-eyebrow">{post.category.name}</p>}
        <h1 className="t-h1 mt-3 text-foreground">{post.title}</h1>
        {post.excerpt && <p className="t-lead mt-4">{post.excerpt}</p>}
        <p className="t-small mt-5 text-muted-foreground">
          {post.author.name} · <time dateTime={post.published}>{longDate(post.published)}</time>
          {updated && (
            <>
              {" "}
              · Updated <time dateTime={post.modified}>{longDate(post.modified)}</time>
            </>
          )}{" "}
          · {post.readingMinutes} min read
        </p>
      </header>

      {post.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.image.url} alt={post.image.alt} width={post.image.width} height={post.image.height} fetchPriority="high" className="mx-auto mt-10 aspect-[1200/630] w-full max-w-4xl rounded-2xl border border-border object-cover" />
      )}

      <div className="mx-auto mt-12 grid max-w-5xl gap-10 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-14">
        <div className="order-2 lg:order-1">
          <div className="article" dangerouslySetInnerHTML={{ __html: post.html }} />
          <AuthorBox author={post.author} />
        </div>
        <aside className="order-1 lg:order-2 lg:sticky lg:top-24 lg:self-start">
          <ArticleToc items={post.toc} />
        </aside>
      </div>
      {children}
    </article>
  );
}
