"use client";

import { Lock, LockOpen, Trash2, TriangleAlert } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import Dialog from "@/components/ui/Dialog";
import { errorClass, helpClass, inputClass, labelClass } from "@/components/portal/field-styles";
import { BUILDER_TEXT } from "@/content/portal-strings";
import { entryFor } from "@/lib/builder/catalog";
import { columnCount, type AnyBlock, type BuilderDoc } from "@/lib/builder/model";
import { faqEntries, seoChecks } from "@/lib/builder/seo";
import { findBlock, flatten, resizeColumns } from "@/lib/builder/tree";
import { isSafeImageSrc } from "@/lib/editor/urls";
import type { TiptapNode } from "@/lib/editor/schema";
import { cn } from "@/utils/cn";
import { FieldControl, ImagePicker } from "./FieldControl";
import { useBuilder, useProblems } from "./store";

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

function BlockTab() {
  const selectedId = useBuilder((s) => s.selectedId);
  const doc = useBuilder((s) => s.doc);
  const canEdit = useBuilder((s) => s.canEdit);
  const uploadEnabled = useBuilder((s) => s.uploadEnabled);
  const all = useProblems();
  const problems = selectedId ? all[selectedId] : undefined;
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
  const problems = useProblems();
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
      </Section>
      <Section title={T.page.featured}>
        <ImagePicker
          label={T.page.featuredImage}
          help={kind === "post" ? T.page.featuredHelp.post : T.page.featuredHelp.page}
          value={meta.coverImage}
          onChange={(coverImage) => setMeta({ coverImage })}
          readOnly={!canEdit}
          uploadEnabled={uploadEnabled}
          preview
        />
        {errors.coverImage && <p className={errorClass}>{errors.coverImage}</p>}
        <TextInput label={T.page.featuredAlt} help={T.page.featuredAltHelp} value={meta.coverImageAlt} onChange={(coverImageAlt) => setMeta({ coverImageAlt })} error={errors.coverImageAlt} max={200} readOnly={!canEdit} />
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

/** The visible heading of a site section, whatever its content calls it. */
export function sectionHeading(content: unknown): string {
  const c = (content ?? {}) as Record<string, unknown>;
  const value = c.h2 ?? c.title ?? c.label ?? c.question;
  return typeof value === "string" ? value : "";
}

function tiptapHeadings(node: TiptapNode, out: Heading[]): void {
  if (node.type === "heading") out.push({ level: Number(node.attrs?.level ?? 2), text: (node.content ?? []).map((c) => c.text ?? "").join("") });
  for (const child of node.content ?? []) tiptapHeadings(child, out);
}

/** The page's heading outline as visitors' screen readers will hear it, so skipped levels are easy to spot. */
function outline(doc: BuilderDoc, title: string, kind: "post" | "page"): Heading[] {
  const out: Heading[] = [];
  const first = doc.blocks[0];
  const hero = kind === "page" && first?.type === "site" && first.section.type === "Hero" ? first : null;
  out.push({ level: 1, text: hero ? String(hero.section.content.title ?? "") : title });
  for (const { block } of flatten(doc)) {
    if (block.type === "heading") out.push({ level: block.props.level, text: block.props.text });
    if (block.type === "richtext" && typeof block.props.content !== "string") tiptapHeadings(block.props.content, out);
    if (block.type === "site" && block !== hero) {
      const h2 = sectionHeading(block.section.content);
      if (h2) out.push({ level: 2, text: h2 });
    }
  }
  return out;
}

function SeoTab() {
  const meta = useBuilder((s) => s.meta);
  const kind = useBuilder((s) => s.kind);
  const doc = useBuilder((s) => s.doc);
  const canEdit = useBuilder((s) => s.canEdit);
  const uploadEnabled = useBuilder((s) => s.uploadEnabled);
  const errors = useBuilder((s) => s.fieldErrors);
  const setMeta = useBuilder((s) => s.setMeta);
  const S = T.seo;
  const seo = meta.seo;
  const setSeo = (patch: Partial<typeof seo>) => setMeta({ seo: { ...seo, ...patch } });
  const headings = outline(doc, meta.title, kind);
  const path = kind === "page" ? `/${meta.slug}` : `/blog/${meta.slug}`;
  const searchTitle = seo.title || meta.title;
  const description = seo.description || meta.excerpt;
  const checks = seoChecks({ seo, title: meta.title, excerpt: meta.excerpt, slug: meta.slug, doc, kind });
  const passing = checks.filter((c) => c.ok).length;
  const faqCount = faqEntries(doc).length;
  const shareImage = seo.ogImage || meta.coverImage;
  return (
    <>
      <Section title={S.search}>
        <div className="rounded-xl border border-border bg-background p-3" aria-label={S.snippet}>
          <p className="truncate text-xs text-muted-foreground">{`dronahost.com${path}`}</p>
          <p className="mt-1 line-clamp-2 text-base font-semibold text-link">{searchTitle || T.untitled}</p>
          <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">{description}</p>
        </div>
        <TextInput label={S.focusKeyword} help={S.focusKeywordHelp} value={seo.focusKeyword} onChange={(v) => setSeo({ focusKeyword: v })} error={errors["seo.focusKeyword"]} max={60} readOnly={!canEdit} />
        <TextInput label={S.searchTitle} help={S.searchTitleHelp} value={seo.title} onChange={(v) => setSeo({ title: v })} error={errors["seo.title"]} max={70} readOnly={!canEdit} />
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <label htmlFor="builder-seo-description" className={labelClass}>
              {S.description}
            </label>
            <span className={cn("text-xs tabular-nums", seo.description.length > 160 ? "text-danger" : "text-subtle-foreground")}>{`${seo.description.length}/160`}</span>
          </div>
          <textarea id="builder-seo-description" value={seo.description} readOnly={!canEdit} maxLength={170} rows={3} onChange={(e) => setSeo({ description: e.target.value })} className={cn(inputClass, "min-h-20 px-3 py-2 text-sm")} />
          <p className={helpClass}>{S.descriptionHelp}</p>
          {errors["seo.description"] && <p className={errorClass}>{errors["seo.description"]}</p>}
        </div>
      </Section>

      <Section title={S.checklist}>
        <p className="text-sm font-semibold text-foreground">{S.score(passing, checks.length)}</p>
        <ul className="space-y-1.5 text-sm">
          {checks.map((c) => (
            <li key={c.id} className="flex gap-2">
              <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", c.ok ? "bg-success" : "bg-warning")} aria-hidden="true" />
              <span className={c.ok ? "text-muted-foreground" : "text-foreground"}>
                {S.checks[c.id as keyof typeof S.checks]}
                <span className="sr-only">{` ${c.ok ? S.pass : S.fail}`}</span>
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title={S.advanced}>
        <TextInput label={S.canonical} help={S.canonicalHelp} value={seo.canonical} onChange={(v) => setSeo({ canonical: v.trim() })} error={errors["seo.canonical"]} max={500} readOnly={!canEdit} />
        <div>
          <label className="flex min-h-10 cursor-pointer items-center gap-3 text-sm font-semibold text-foreground">
            <input type="checkbox" checked={seo.noindex} disabled={!canEdit} onChange={(e) => setSeo({ noindex: e.target.checked })} className="size-4 accent-[var(--accent)]" />
            {S.noindex}
          </label>
          <p className={helpClass}>{S.noindexHelp}</p>
        </div>
        <div>
          <label className="flex min-h-10 cursor-pointer items-center gap-3 text-sm font-semibold text-foreground">
            <input type="checkbox" checked={seo.faqSchema} disabled={!canEdit} onChange={(e) => setSeo({ faqSchema: e.target.checked })} className="size-4 accent-[var(--accent)]" />
            {S.faqSchema}
          </label>
          <p className={helpClass}>{S.faqSchemaHelp(faqCount)}</p>
        </div>
      </Section>

      <Section title={S.social}>
        {/* The share card as most networks draw it: image, title, then the description. */}
        <div className="overflow-hidden rounded-xl border border-border bg-background">
          {isSafeImageSrc(shareImage) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={shareImage} alt="" className="aspect-[1200/630] w-full object-cover" />
          ) : (
            <div className="aspect-[1200/630] w-full bg-muted" aria-hidden="true" />
          )}
          <div className="p-3">
            <p className="text-xs uppercase text-muted-foreground">dronahost.com</p>
            <p className="mt-1 line-clamp-2 text-sm font-semibold text-foreground">{seo.ogTitle || searchTitle || T.untitled}</p>
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{seo.ogDescription || description}</p>
          </div>
        </div>
        <TextInput label={S.ogTitle} value={seo.ogTitle} onChange={(v) => setSeo({ ogTitle: v })} error={errors["seo.ogTitle"]} max={90} readOnly={!canEdit} />
        <TextInput label={S.ogDescription} value={seo.ogDescription} onChange={(v) => setSeo({ ogDescription: v })} error={errors["seo.ogDescription"]} max={200} readOnly={!canEdit} />
        <FieldControl
          field={{ kind: "image", path: "ogImage", label: S.ogImage, help: S.ogImageHelp }}
          data={seo}
          onChange={(next) => setSeo({ ogImage: (next as typeof seo).ogImage ?? "" })}
          readOnly={!canEdit}
          uploadEnabled={uploadEnabled}
        />
      </Section>

      <Section title={S.outline}>
        {headings.length <= 1 && <p className="text-sm text-muted-foreground">{S.outlineEmpty}</p>}
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

export function Inspector({ publishing }: { publishing: Publishing }) {
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
        {tab === "block" ? <BlockTab /> : tab === "page" ? <PageTab publishing={publishing} /> : <SeoTab />}
      </div>
    </aside>
  );
}
