import StatusBadge, { type Status } from "./StatusBadge";

type ShowcaseSectionProps = {
  id: string;
  title: string;
  status: Status;
  notes?: string;
  children: React.ReactNode;
};

export default function ShowcaseSection({
  id,
  title,
  status,
  notes,
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
      </div>
      <div className="rounded-lg border border-border bg-card p-6">
        {children}
      </div>
    </section>
  );
}
