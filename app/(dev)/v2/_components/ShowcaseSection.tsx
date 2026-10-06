import StatusBadge, { type Status } from "./StatusBadge";

type ShowcaseSectionProps = {
  id: string;
  title: string;
  status: Status;
  notes?: string;
  /** Claims this component renders that the owner must confirm before launch. */
  verify?: readonly string[];
  children: React.ReactNode;
};

export default function ShowcaseSection({
  id,
  title,
  status,
  notes,
  verify,
  children,
}: ShowcaseSectionProps) {
  return (
    <section
      id={id}
      className="border-b border-border py-12 scroll-mt-14"
    >
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground">
          {title}
        </h2>
        <div className="mt-1.5 flex items-center gap-2">
          <StatusBadge status={status} />
          {notes && (
            <span className="text-sm text-muted-foreground">
              {notes}
            </span>
          )}
        </div>
        {verify && verify.length > 0 && (
          <div className="mt-3 rounded-lg border border-accent/30 bg-accent/10 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-link">Claims to verify</p>
            <ul className="mt-1.5 list-disc space-y-0.5 ps-5 text-sm text-foreground">
              {verify.map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="rounded-lg border border-border bg-card p-6">
        {children}
      </div>
    </section>
  );
}
