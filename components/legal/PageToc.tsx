"use client";

import { useEffect, useState } from "react";

type Heading = { id: string; text: string };

/**
 * "On this page" list for long-form pages. The article itself is server-rendered; this only
 * reads its h2 headings after mount, gives each an id and links to it. No JS: no TOC, content intact.
 */
export default function PageToc({ containerSelector = ".article" }: { containerSelector?: string }) {
  const [items, setItems] = useState<Heading[]>([]);

  useEffect(() => {
    const root = document.querySelector(containerSelector);
    if (!root) return;
    const found = Array.from(root.querySelectorAll("h2")).map((h, i) => {
      const text = h.textContent ?? "";
      if (!h.id) h.id = `${text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section"}-${i}`;
      return { id: h.id, text };
    });
    setItems(found); // eslint-disable-line react-hooks/set-state-in-effect -- reading the DOM after mount
  }, [containerSelector]);

  if (items.length < 3) return null;
  return (
    <nav aria-label="On this page" className="surface p-5">
      <p className="t-eyebrow">On this page</p>
      <ol className="mt-3 space-y-1.5 text-sm">
        {items.map((h) => (
          <li key={h.id}>
            <a href={`#${h.id}`} className="block rounded py-1 text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
