import type { BlogAuthor } from "@/lib/blog/types";

/** Shown only when the author has a real bio in the CMS. No bio, no box: nothing is invented. */
export default function AuthorBox({ author }: { author: BlogAuthor }) {
  if (!author.bio) return null;
  return (
    <aside aria-label="About the author" className="surface mt-14 flex gap-4 p-6">
      {author.avatar && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={author.avatar} alt="" width={56} height={56} loading="lazy" className="size-14 shrink-0 rounded-full object-cover" />
      )}
      <div>
        <p className="font-semibold text-foreground">{author.name}</p>
        <p className="t-small mt-1 text-muted-foreground">{author.bio}</p>
      </div>
    </aside>
  );
}
