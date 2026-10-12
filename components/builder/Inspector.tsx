"use client";

import { CircleCheck, Loader2, Lock, LockOpen, Sparkles, Trash2, TriangleAlert } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import Dialog from "@/components/ui/Dialog";
import { errorClass, helpClass, inputClass, labelClass } from "@/components/portal/field-styles";
import { BUILDER_TEXT } from "@/content/portal-strings";
import { blockDef, blockName } from "@/lib/builder/blocks";
import { docHeadings, findBlock } from "@/lib/builder/doc";
import { PAGE_SPACINGS, PAGE_WIDTHS, type PageSettings } from "@/lib/builder/model";
import { faqEntries, seoChecks } from "@/lib/builder/seo";
import { suggestDescription, suggestKeyword, suggestSlug, suggestTitle } from "@/lib/builder/seo-generate";
import { isSafeImageSrc } from "@/lib/editor/urls";
import { cn } from "@/utils/cn";
import { FieldControl, ImagePicker } from "./FieldControl";
import { useBuilder, useBuilderApi, useProblems } from "./store";
import { seoSource } from "./use-slug-check";

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

function BlockTab() {
  const selectedId = useBuilder((s) => s.selectedId);
  const doc = useBuilder((s) => s.doc);
  const canEdit = useBuilder((s) => s.canEdit);
  const uploadEnabled = useBuilder((s) => s.uploadEnabled);
  const all = useProblems();
  const problems = selectedId ? all[selectedId] : undefined;
  const update = useBuilder((s) => s.update);
  const block = selectedId ? findBlock(doc, selectedId) : undefined;
  if (!block) return <p className="p-4 text-sm text-muted-foreground">{T.block.none}</p>;
  const def = blockDef(block.type);
  const name = blockName(block.type);
  return (
    <>
      <Section>
        <div>
          <p className="text-base font-semibold text-foreground">{name.label}</p>
          <p className={helpClass}>{name.hint}</p>
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
        {def?.fields.length === 0 && <p className="text-sm text-muted-foreground">{T.block.noSettings}</p>}
        {def?.fields.map((field) => (
          <FieldControl key={`${block.id}-${field.key}`} field={field} data={block.props} readOnly={!canEdit} uploadEnabled={uploadEnabled} onChange={(next) => update(block.id, () => next)} />
        ))}
      </Section>
    </>
  );
}

type TextInputProps = { label: string; help?: string; value: string; onChange: (v: string) => void; error?: string; max: number; readOnly: boolean; prefix?: string; onGenerate?: () => void; children?: ReactNode };

function TextInput({ label, help, value, onChange, error, max, readOnly, prefix, onGenerate, children }: TextInputProps) {
  const id = useId();
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className={labelClass}>
          {label}
        </label>
        {onGenerate && !readOnly && <GenerateButton onClick={onGenerate} label={label} />}
        <span className={cn("text-xs tabular-nums", value.length > max ? "text-danger" : "text-subtle-foreground")}>{`${value.length}/${max}`}</span>
      </div>
      <div className="flex items-center">
        {prefix && <span className="mt-2 me-1 text-sm text-muted-foreground">{prefix}</span>}
        <input id={id} value={value} readOnly={readOnly} maxLength={max} aria-invalid={error ? true : undefined} onChange={(e) => onChange(e.target.value)} className={fieldInput} />
      </div>
      {help && <p className={helpClass}>{help}</p>}
      {children}
      {error && (
        <p className={errorClass} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/** Fills one field from the page's own words (lib/builder/seo-generate.ts). */
function GenerateButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick} className="ms-auto inline-flex min-h-8 items-center gap-1 rounded-md px-2 text-xs font-semibold text-link hover:bg-muted" title={`${T.seo.generate}: ${label}`}>
      <Sparkles className="size-3.5" aria-hidden="true" />
      {T.seo.generate}
      <span className="sr-only">{`: ${label}`}</span>
    </button>
  );
}

/** The slug field: the address prefix, a Generate button and whether the address is free (checked against the database). */
function SlugInput({ readOnly, error }: { readOnly: boolean; error?: string }) {
  const api = useBuilderApi();
  const kind = useBuilder((s) => s.kind);
  const slug = useBuilder((s) => s.meta.slug);
  const check = useBuilder((s) => s.slugCheck);
  const setMeta = useBuilder((s) => s.setMeta);
  const S = T.seo;
  const status = check && check.slug === slug ? check : null;
  return (
    <TextInput
      label={T.page.slug}
      help={T.page.slugHelp}
      value={slug}
      onChange={(v) => setMeta({ slug: v.toLowerCase() })}
      error={error}
      max={120}
      readOnly={readOnly}
      prefix={kind === "page" ? "/" : "/blog/"}
      onGenerate={() => setMeta({ slug: suggestSlug(seoSource(api.getState())) })}
    >
      {status && (
        <p className={cn("mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm", status.state === "free" ? "text-success" : status.state === "checking" ? "text-muted-foreground" : "text-danger")} role="status">
          {status.state === "checking" && <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />}
          {status.state === "free" && <CircleCheck className="size-3.5" aria-hidden="true" />}
          <span>{status.state === "checking" ? S.slugChecking : status.state === "free" ? S.slugFree : status.state === "taken" ? S.slugTaken(status.suggestion ?? "") : S.slugReserved(status.suggestion ?? "")}</span>
          {(status.state === "taken" || status.state === "reserved") && status.suggestion && !readOnly && (
            <button type="button" onClick={() => setMeta({ slug: status.suggestion })} className="font-semibold text-link underline underline-offset-2">
              {S.useSuggestion}
            </button>
          )}
        </p>
      )}
    </TextInput>
  );
}

function Choice<V extends string>({ label, help, value, values, labels, onChange, readOnly }: { label: string; help?: string; value: V; values: readonly V[]; labels: Record<V, string>; onChange: (v: V) => void; readOnly: boolean }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <select id={id} value={value} disabled={readOnly} onChange={(e) => onChange(e.target.value as V)} className={fieldInput}>
        {values.map((v) => (
          <option key={v} value={v}>
            {labels[v]}
          </option>
        ))}
      </select>
      {help && <p className={helpClass}>{help}</p>}
    </div>
  );
}

/** Page settings that apply to every block: the content width (Tailwind sizes) and the space between sections. */
function LayoutSettings() {
  const kind = useBuilder((s) => s.kind);
  const settings = useBuilder((s) => s.doc.settings);
  const canEdit = useBuilder((s) => s.canEdit);
  const setSettings = useBuilder((s) => s.setSettings);
  const P = T.page;
  if (kind !== "page") return <p className="text-sm text-muted-foreground">{P.postLayout}</p>;
  return (
    <>
      <Choice<PageSettings["width"]> label={P.width} help={P.layoutHelp} value={settings.width} values={PAGE_WIDTHS} labels={P.widths} onChange={(width) => setSettings({ width })} readOnly={!canEdit} />
      <Choice<PageSettings["spacing"]> label={P.spacing} value={settings.spacing} values={PAGE_SPACINGS} labels={P.spacings} onChange={(spacing) => setSettings({ spacing })} readOnly={!canEdit} />
    </>
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
            const block = findBlock(doc, blockId);
            return (
              <li key={blockId}>
                {block ? (
                  <button type="button" onClick={() => select(blockId)} className="text-start font-semibold text-link underline underline-offset-2">
                    {blockName(block.type).label}
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
  return (
    <>
      <ProblemList />
      <Section>
        <p className="text-sm text-muted-foreground">
          {T.page.kind}: <span className="font-semibold text-foreground">{BUILDER_TEXT.kinds[kind]}</span>
        </p>
        <TextInput label={T.page.title} help={T.page.titleHelp[kind]} value={meta.title} onChange={(title) => setMeta({ title })} error={errors.title} max={200} readOnly={!canEdit} />
        <SlugInput error={errors.slug} readOnly={!canEdit} />
        <div>
          <label htmlFor="builder-excerpt" className={labelClass}>
            {T.page.excerpt}
          </label>
          <textarea id="builder-excerpt" value={meta.excerpt} readOnly={!canEdit} maxLength={300} rows={4} onChange={(e) => setMeta({ excerpt: e.target.value })} className={cn(inputClass, "min-h-24 px-3 py-2 text-sm")} />
          <p className={helpClass}>{`${T.page.excerptHelp} ${meta.excerpt.length}/300`}</p>
          {errors.excerpt && <p className={errorClass}>{errors.excerpt}</p>}
        </div>
      </Section>
      <Section title={T.page.layout}>
        <LayoutSettings />
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

function SeoTab() {
  const api = useBuilderApi();
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
  const headings = docHeadings(doc, meta.title, kind);
  const [note, setNote] = useState<string | null>(null);
  /** Fills the keyword (when empty), search title, description and slug from the page. One undo step brings them all back. */
  const generateAll = () => {
    const source = seoSource(api.getState());
    const keyword = source.keyword.trim() || suggestKeyword(source);
    const withKeyword = { ...source, keyword };
    const title = suggestTitle(withKeyword);
    if (!title && !keyword) return setNote(S.generateEmpty);
    // An empty page title takes the headline too: a page cannot be saved without one.
    setMeta({ ...(!meta.title.trim() && { title: suggestTitle({ ...source, keyword: "" }) }), slug: suggestSlug(withKeyword), seo: { ...seo, focusKeyword: keyword, title, description: suggestDescription(withKeyword) } });
    setNote(S.generated);
  };
  const path = kind === "page" ? `/${meta.slug}` : `/blog/${meta.slug}`;
  const searchTitle = seo.title || meta.title;
  const description = seo.description || meta.excerpt;
  const checks = seoChecks({ seo, title: meta.title, excerpt: meta.excerpt, slug: meta.slug, doc, kind });
  const passing = checks.filter((c) => c.ok).length;
  const faqCount = faqEntries(doc).length;
  const shareImage = seo.ogImage || meta.coverImage;
  return (
    <>
      <Section>
        <button type="button" onClick={generateAll} disabled={!canEdit} className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-accent px-3 text-sm font-semibold text-accent-foreground hover:bg-accent-hover disabled:opacity-50">
          <Sparkles className="size-4" aria-hidden="true" />
          {S.generateAll}
        </button>
        <p className={helpClass}>{S.generateHelp}</p>
        {note && (
          <p className="text-sm text-foreground" role="status">
            {note}
          </p>
        )}
      </Section>
      <Section title={S.search}>
        <div className="rounded-xl border border-border bg-background p-3" aria-label={S.snippet}>
          <p className="truncate text-xs text-muted-foreground">{`dronahost.com${path}`}</p>
          <p className="mt-1 line-clamp-2 text-base font-semibold text-link">{searchTitle || T.untitled}</p>
          <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">{description}</p>
        </div>
        <TextInput label={S.focusKeyword} help={S.focusKeywordHelp} value={seo.focusKeyword} onChange={(v) => setSeo({ focusKeyword: v })} error={errors["seo.focusKeyword"]} max={60} readOnly={!canEdit} onGenerate={() => setSeo({ focusKeyword: suggestKeyword(seoSource(api.getState())) })} />
        <TextInput label={S.searchTitle} help={S.searchTitleHelp} value={seo.title} onChange={(v) => setSeo({ title: v })} error={errors["seo.title"]} max={70} readOnly={!canEdit} onGenerate={() => setSeo({ title: suggestTitle(seoSource(api.getState())) })} />
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <label htmlFor="builder-seo-description" className={labelClass}>
              {S.description}
            </label>
            {canEdit && <GenerateButton label={S.description} onClick={() => setSeo({ description: suggestDescription(seoSource(api.getState())) })} />}
            <span className={cn("text-xs tabular-nums", seo.description.length > 160 ? "text-danger" : "text-subtle-foreground")}>{`${seo.description.length}/160`}</span>
          </div>
          <textarea id="builder-seo-description" value={seo.description} readOnly={!canEdit} maxLength={170} rows={3} onChange={(e) => setSeo({ description: e.target.value })} className={cn(inputClass, "min-h-20 px-3 py-2 text-sm")} />
          <p className={helpClass}>{S.descriptionHelp}</p>
          {errors["seo.description"] && <p className={errorClass}>{errors["seo.description"]}</p>}
        </div>
        <SlugInput error={errors.slug} readOnly={!canEdit} />
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
        <ImagePicker label={S.ogImage} help={S.ogImageHelp} value={seo.ogImage} onChange={(ogImage) => setSeo({ ogImage })} readOnly={!canEdit} uploadEnabled={uploadEnabled} />
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
