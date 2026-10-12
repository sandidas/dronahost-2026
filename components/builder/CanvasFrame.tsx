"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { BUILDER_TEXT } from "@/content/portal-strings";

/**
 * The editor canvas lives in an iframe that is exactly as wide as the chosen device (desktop, tablet, phone). The site's
 * components switch layout on the window width (`md:`, `lg:`), so inside a frame of that width they lay out exactly as
 * visitors see them; the frame is then scaled down to fit the space between the panels.
 *
 * The canvas is rendered into the frame through a React portal, so the editor's state, context and events keep working.
 * The page's stylesheets, theme classes and font variables are copied into the frame and kept in sync.
 */

type Props = {
  /** Page width in CSS pixels. */
  width: number;
  /** The canvas, rendered into the frame. Omitted when `src` loads a real page instead (Preview). */
  children?: ReactNode;
  /** Load this address instead of rendering children (Preview shows the saved page this way, at the same widths). */
  src?: string;
  /** Keyboard shortcuts: key presses inside the frame do not reach the editor window, so they are passed on here. */
  onKeyDown?: (e: KeyboardEvent) => void;
};

const STYLE_NODES = 'link[rel="stylesheet"], style';
const FRAME_DOC = "<!doctype html><html><head><meta charset='utf-8'></head><body></body></html>";

/** Copies the editor window's styles and root classes into the frame, then follows later changes (theme toggle, new CSS). */
function mirrorStyles(target: Document): () => void {
  const copies = new Map<Node, Node>();
  const add = (node: Node) => {
    if (copies.has(node)) return;
    const copy = target.importNode(node, true);
    copies.set(node, copy);
    target.head.appendChild(copy);
  };
  const syncRoot = () => {
    for (const [from, to] of [
      [document.documentElement, target.documentElement],
      [document.body, target.body],
    ] as const) {
      to.className = from.className;
      for (const attr of ["data-theme", "style", "lang", "dir"]) {
        const value = from.getAttribute(attr);
        if (value === null) to.removeAttribute(attr);
        else to.setAttribute(attr, value);
      }
    }
  };
  document.head.querySelectorAll(STYLE_NODES).forEach(add);
  syncRoot();
  const headObserver = new MutationObserver((records) => {
    for (const r of records) {
      r.addedNodes.forEach((n) => n instanceof Element && n.matches(STYLE_NODES) && add(n));
      r.removedNodes.forEach((n) => {
        const copy = copies.get(n);
        copy?.parentNode?.removeChild(copy);
        copies.delete(n);
      });
    }
    // Inline styles change in place during development hot reload: copy their text again.
    for (const [from, to] of copies) if (from instanceof HTMLStyleElement && to.textContent !== from.textContent) to.textContent = from.textContent;
  });
  headObserver.observe(document.head, { childList: true, subtree: true, characterData: true });
  const rootObserver = new MutationObserver(syncRoot);
  rootObserver.observe(document.documentElement, { attributes: true });
  rootObserver.observe(document.body, { attributes: true });
  return () => {
    headObserver.disconnect();
    rootObserver.disconnect();
  };
}

export function CanvasFrame({ width, children, src, onKeyDown }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [doc, setDoc] = useState<Document | null>(null);
  const [box, setBox] = useState({ width: 0, height: 0 });

  // The frame's document: styles mirrored from the editor window.
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || src) return;
    let stop: (() => void) | undefined;
    const ready = () => {
      const d = frame.contentDocument;
      if (!d?.body) return;
      d.body.style.margin = "0";
      stop?.();
      stop = mirrorStyles(d);
      setDoc(d);
    };
    frame.addEventListener("load", ready);
    if (frame.contentDocument?.readyState === "complete" && frame.contentDocument.body) ready();
    return () => {
      frame.removeEventListener("load", ready);
      stop?.();
    };
  }, [src]);

  // Keyboard shortcuts typed inside the frame.
  useEffect(() => {
    const win = doc?.defaultView;
    if (!win || !onKeyDown) return;
    win.addEventListener("keydown", onKeyDown);
    return () => win.removeEventListener("keydown", onKeyDown);
  }, [doc, onKeyDown]);

  // The space available, for the scale.
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const measure = () => setBox({ width: host.clientWidth, height: host.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  const gutter = 24;
  const scale = box.width ? Math.min(1, (box.width - gutter * 2) / width) : 1;
  const frameHeight = box.height ? (box.height - gutter * 2) / scale : 0;

  return (
    <div ref={hostRef} className="relative min-h-0 min-w-0 flex-1 overflow-hidden bg-muted/50">
      <div className="absolute start-1/2 top-6 -translate-x-1/2" style={{ width: width * scale, height: frameHeight * scale }}>
        <iframe
          ref={frameRef}
          key={src ?? "canvas"}
          {...(src ? { src } : { srcDoc: FRAME_DOC })}
          title={BUILDER_TEXT.ui.canvas.label}
          className="rounded-xl border border-border bg-background shadow-sm"
          style={{ width, height: frameHeight || "100%", transform: `scale(${scale})`, transformOrigin: "top left" }}
        />
      </div>
      {doc &&
        !src &&
        createPortal(
          // --canvas-zoom undoes the scale for the editing controls (`.builder-ui`), so they stay readable at any width.
          <div style={{ "--canvas-zoom": String(1 / scale) } as React.CSSProperties}>{children}</div>,
          doc.body,
        )}
    </div>
  );
}
