"use client";

import { Lock, LockOpen, Trash2, TriangleAlert } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import Dialog from "@/components/ui/Dialog";
import { errorClass, helpClass, inputClass, labelClass } from "@/components/portal/field-styles";
import { BUILDER_TEXT } from "@/content/portal-strings";
import { entryFor } from "@/lib/builder/catalog";
import { columnCount, type AnyBlock, type BuilderDoc } from "@/lib/builder/model";
import { findBlock, flatten, resizeColumns } from "@/lib/builder/tree";
import type { TiptapNode } from "@/lib/editor/schema";
import { cn } from "@/utils/cn";
import { FieldControl, type FeatureOption } from "./FieldControl";
import { useBuilder } from "./store";

const T = BUILDER_TEXT.ui;
const fieldInput = cn(inputClass, "min-h-10 px-3 text-sm");

function Section({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="space-y-4 border-b border-border p-4 last:border-b-0">
      {title && <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</h2>}
      {children}
    </section>
  );
}

/** Applies a Block panel change: site sections keep their data in `section`, other blocks in `props`. */
function withData(block: AnyBlock, next: unknown): AnyBlock {
  if (block.type === "site") return { ...block, section: next as typeof block.section };
  if (block.type === "columns") {
    const props = next as typeof block.props;
    return { ...block, props, columns: resizeColumns(block, columnCount(props.layout)) };
  }
  return { ...block, props: next } as AnyBlock;
}

function BlockTab({ features }: { features: readonly FeatureOption[] }) {
  const selectedId = useBuilder((s) => s.selectedId);
  const doc = useBuilder((s) => s.doc);
  const canEdit = useBuilder((s) => s.canEdit);
  const uploadEnabled = useBuilder((s) => s.uploadEnabled);
  const problems = useBuilder((s) => (s.selectedId ? s.problems[s.selectedId] : undefined));
  const update = useBuilder((s) => s.update);
  const block = selectedId ? findBlock(doc, selectedId)?.block : undefined;
  if (!block) return <p className="p-4 text-sm text-muted-foreground">{T.block.none}</p>;
  const entry = entryFor(block);
  const data = block.type === "site" ? block.section : block.props;
  return (
    <>
      <Section>
        <div>
          <p className="text-base font-semibold text-foreground">{entry?.label}</p>
          <p className={helpClass}>{entry?.hint}</p>
        </div>
        {problems && (
          <ul className="list-disc rounded-lg border border-danger/40 bg-danger-surface py-2 pe-3 ps-7 text-sm text-danger" role="alert">
            {problems.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        )}
      </Section>
      <Section>
        {block.type === "richtext" && <p className="text-sm text-muted-foreground">{T.block.richtextHint}</p>}
        {entry?.fields.length === 0 && block.type !== "richtext" && <p className="text-sm text-muted-foreground">{T.block.noSettings}</p>}
        {entry?.fields.map((field) => (
          <FieldControl
            key={`${block.id}-${field.path}`}
            field={field}
            data={data}
            readOnly={!canEdit}
            uploadEnabled={uploadEnabled}
            features={features}
            onChange={(next) => update(block.id, (b) => withData(b, next))}
          />
        ))}
      </Section>
    </>
  );
}

function TextInput({ label, help, value, onChange, error, max, readOnly, prefix }: { label: string; help?: string; value: string; onChange: (v: string) => void; error?: string; max: number; readOnly: boolean; prefix?: string }) {
  const id = useId();
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className={labelClass}>
          {label}
        </label>
        <span className={cn("text-xs tabular-nums", value.length > max ? "text-danger" : "text-subtle-foreground")}>{`${value.length}/${max}`}</span>
      </div>
      <div className="flex items-center">
        {prefix && <span className="mt-2 me-1 text-sm text-muted-foreground">{prefix}</span>}
        <input id={id} value={value} readOnly={readOnly} maxLength={max} aria-invalid={error ? true : undefined} onChange={(e) => onChange(e.target.value)} className={fieldInput} />
      </div>
      {help && <p className={helpClass}>{help}</p>}
      {error && (
        <p className={errorClass} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function ProblemList() {
  const problems = useBuilder((s) => s.problems);
  const doc = useBuilder((s) => s.doc);
  const select = useBuilder((s) => s.select);
  const entries = Object.entries(problems);
  if (entries.length === 0) return null;
  return (
    <Section>
      <div className="rounded-xl border border-danger/40 bg-danger-surface p-3" role="alert">
        <p className="flex items-center gap-2 text-sm font-semibold text-danger">
          <TriangleAlert className="size-4" aria-hidden="true" />
          {T.problems.title}
        </p>
        <ul className="mt-2 space-y-1 text-sm">
          {entries.map(([blockId, messages]) => {
            const block = findBlock(doc, blockId)?.block;
            return (
              <li key={blockId}>
                {block ? (
                  <button type="button" onClick={() => select(blockId)} className="text-start font-semibold text-link underline underline-offset-2">
                    {entryFor(block)?.label}
                  </button>
                ) : (
                  <span className="font-semibold text-foreground">{T.problems.page}</span>
                )}
                <span className="text-foreground">{`: ${messages.join(" ")}`}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}

type Publishing = { setPublished: (publish: boolean) => void; setLocked: (locked: boolean) => void; remove: () => void };

function PageTab({ publishing }: { publishing: Publishing }) {
  const meta = useBuilder((s) => s.meta);
  const kind = useBuilder((s) => s.kind);
  const canEdit = useBuilder((s) => s.canEdit);
  const isAdmin = useBuilder((s) => s.isAdmin);
  const postId = useBuilder((s) => s.postId);
  const status = useBuilder((s) => s.status);
  const locked = useBuilder((s) => s.locked);
  const publishedLine = useBuilder((s) => s.publishedLine);
  const errors = useBuilder((s) => s.fieldErrors);
  const uploadEnabled = useBuilder((s) => s.uploadEnabled);
  const setMeta = useBuilder((s) => s.setMeta);
  const [confirm, setConfirm] = useState(false);
  const base = kind === "page" ? "/" : "/blog/";
  return (
    <>
      <ProblemList />
      <Section>
        <p className="text-sm text-muted-foreground">
          {T.page.kind}: <span className="font-semibold text-foreground">{BUILDER_TEXT.kinds[kind]}</span>
        </p>
        <TextInput label={T.page.title} help={T.page.titleHelp[kind]} value={meta.title} onChange={(title) => setMeta({ title })} error={errors.title} max={200} readOnly={!canEdit} />
        <TextInput label={T.page.slug} help={T.page.slugHelp} value={meta.slug} onChange={(slug) => setMeta({ slug: slug.toLowerCase() })} error={errors.slug} max={120} readOnly={!canEdit} prefix={base} />
        <div>
          <label htmlFor="builder-excerpt" className={labelClass}>
            {T.page.excerpt}
          </label>
          <textarea id="builder-excerpt" value={meta.excerpt} readOnly={!canEdit} maxLength={300} rows={4} onChange={(e) => setMeta({ excerpt: e.target.value })} className={cn(inputClass, "min-h-24 px-3 py-2 text-sm")} />
          <p className={helpClass}>{`${T.page.excerptHelp} ${meta.excerpt.length}/300`}</p>
          {errors.excerpt && <p className={errorClass}>{errors.excerpt}</p>}
        </div>
        <FieldControl
          field={{ kind: "image", path: "coverImage", label: T.page.coverImage, help: T.page.coverImageHelp }}
          data={meta}
          onChange={(next) => setMeta({ coverImage: (next as typeof meta).coverImage ?? "" })}
          readOnly={!canEdit}
          uploadEnabled={uploadEnabled}
          features={[]}
        />
        {errors.coverImage && <p className={errorClass}>{errors.coverImage}</p>}
      </Section>
      <Section title={T.page.publishing}>
        {publishedLine && status === "published" && <p className="text-sm text-muted-foreground">{publishedLine}</p>}
        {locked && <p className="text-sm text-muted-foreground">{T.page.lockedNote}</p>}
        {!isAdmin && <p className="text-sm text-muted-foreground">{T.page.staffNote}</p>}
        {isAdmin && postId && (
          <div className="flex flex-col gap-2">
            {status === "published" && (
              <button type="button" onClick={() => publishing.setPublished(false)} className="min-h-10 rounded-lg border border-border-strong text-sm font-semibold text-foreground hover:bg-muted">
                {T.actions.unpublish}
              </button>
            )}
            <button type="button" onClick={() => publishing.setLocked(!locked)} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-border-strong text-sm font-semibold text-foreground hover:bg-muted">
              {locked ? <LockOpen className="size-4" aria-hidden="true" /> : <Lock className="size-4" aria-hidden="true" />}
              {locked ? T.actions.unlock : T.actions.lock}
            </button>
            <button type="button" onClick={() => setConfirm(true)} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg text-sm font-semibold text-danger hover:bg-danger-surface">
              <Trash2 className="size-4" aria-hidden="true" />
              {T.actions.delete}
            </button>
            <Dialog open={confirm} onClose={() => setConfirm(false)} title={T.deleteConfirm.title} description={T.deleteConfirm.body}>
              <div className="flex flex-wrap justify-end gap-2">
                <button type="button" onClick={() => setConfirm(false)} className="btn btn-ghost btn-sm">
                  {T.deleteConfirm.cancel}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setConfirm(false);
                    publishing.remove();
                  }}
                  className="btn btn-primary btn-sm"
                >
                  {T.deleteConfirm.confirm}
                </button>
              </div>
            </Dialog>
          </div>
        )}
      </Section>
    </>
  );
}

type Heading = { level: number; text: string };

function tiptapHeadings(node: TiptapNode, out: Heading[]): void {
  if (node.type === "heading") out.push({ level: Number(node.attrs?.level ?? 2), text: (node.content ?? []).map((c) => c.text ?? "").join("") });
  for (const child of node.content ?? []) tiptapHeadings(child, out);
}

/** The page's heading outline as visitors' screen readers will hear it, so skipped levels are easy to spot. */
function outline(doc: BuilderDoc, title: string, kind: "post" | "page"): Heading[] {
  const out: Heading[] = [];
  const hero = doc.blocks[0]?.type === "site" && doc.blocks[0].section.type === "ProductHero" ? doc.blocks[0] : null;
  out.push({ level: 1, text: hero && kind === "page" ? String((hero.section.content as { h1?: string })?.h1 ?? "") : title });
  for (const { block } of flatten(doc)) {
    if (block.type === "heading") out.push({ level: block.props.level, text: block.props.text });
    if (block.type === "richtext" && typeof block.props.content !== "string") tiptapHeadings(block.props.content, out);
    if (block.type === "site" && block !== hero) {
      const h2 = (block.section.content as { h2?: string } | undefined)?.h2;
      if (h2) out.push({ level: 2, text: h2 });
    }
  }
  return out;
}

function SeoTab() {
  const meta = useBuilder((s) => s.meta);
  const kind = useBuilder((s) => s.kind);
  const doc = useBuilder((s) => s.doc);
  const headings = outline(doc, meta.title, kind);
  const path = kind === "page" ? `/${meta.slug}` : `/blog/${meta.slug}`;
  const meter = (n: number, max: number) => <span className={cn("tabular-nums", n > max ? "text-danger" : "text-foreground")}>{`${n}/${max}`}</span>;
  return (
    <>
      <Section title={T.seo.snippet}>
        <div className="rounded-xl border border-border bg-background p-3">
          <p className="truncate text-xs text-muted-foreground">{`dronahost.com${path}`}</p>
          <p className="mt-1 line-clamp-2 text-base font-semibold text-link">{meta.title || T.untitled}</p>
          <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">{meta.excerpt}</p>
        </div>
        <p className="text-sm text-muted-foreground">
          {T.seo.titleLength}: {meter(meta.title.length, 60)}. {T.seo.titleAdvice}
        </p>
        <p className="text-sm text-muted-foreground">
          {T.seo.descriptionLength}: {meter(meta.excerpt.length, 155)}. {T.seo.descriptionAdvice}
        </p>
      </Section>
      <Section title={T.seo.outline}>
        {headings.length <= 1 && <p className="text-sm text-muted-foreground">{T.seo.outlineEmpty}</p>}
        <ol className="space-y-1 text-sm">
          {headings.map((h, i) => (
            <li key={i} className="flex gap-2" style={{ paddingInlineStart: `${(h.level - 1) * 0.75}rem` }}>
              <span className="shrink-0 font-semibold text-muted-foreground">{`H${h.level}`}</span>
              <span className="truncate text-foreground">{h.text || T.untitled}</span>
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
}

export function Inspector({ features, publishing }: { features: readonly FeatureOption[]; publishing: Publishing }) {
  const tab = useBuilder((s) => s.rightTab);
  const set = useBuilder((s) => s.set);
  return (
    <aside aria-label={T.right.label} className="flex w-80 shrink-0 flex-col border-s border-border bg-card">
      <div role="tablist" aria-label={T.right.label} className="grid grid-cols-3 gap-1 border-b border-border p-2">
        {(["block", "page", "seo"] as const).map((id) => (
          <button key={id} role="tab" type="button" aria-selected={tab === id} onClick={() => set({ rightTab: id })} className="min-h-9 rounded-lg text-sm font-semibold text-muted-foreground aria-selected:bg-muted aria-selected:text-foreground">
            {T.right[id]}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="min-h-0 flex-1 overflow-y-auto">
        {tab === "block" ? <BlockTab features={features} /> : tab === "page" ? <PageTab publishing={publishing} /> : <SeoTab />}
      </div>
    </aside>
  );
}
