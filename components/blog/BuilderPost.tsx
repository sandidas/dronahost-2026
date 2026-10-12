import type { ReactNode } from "react";
// Builder typography and bands (the editor canvas and builder pages load the same file).
import "@/app/styles/rich-content.css";

type BuilderPostProps = {
  title: string;
  /** The page builder canvas: an editable title in place of the H1's text. */
  titleSlot?: ReactNode;
  /** The post's blocks (lib/builder/render.tsx), drawn exactly as on a page. */
  children: ReactNode;
};

/**
 * A blog post made in the page builder. The blog prints the post title as the H1 and nothing else of its own: dates,
 * summary, picture and every section come from the blocks the author placed. The editor canvas draws the same frame.
 */
export default function BuilderPost({ title, titleSlot, children }: BuilderPostProps) {
  return (
    <article>
      <header className="container-site pt-16 sm:pt-20 lg:pt-24">
        <h1 className="t-h1 max-w-4xl text-balance text-foreground">{titleSlot ?? title}</h1>
      </header>
      {children}
    </article>
  );
}
