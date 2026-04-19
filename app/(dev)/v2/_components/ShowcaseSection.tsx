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
      className="border-b border-slate-200 dark:border-slate-800 py-12 scroll-mt-14"
    >
      <div className="mb-6 flex items-start gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h2>
          <div className="mt-1.5 flex items-center gap-2">
            <StatusBadge status={status} />
            {notes && (
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {notes}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        {children}
      </div>
    </section>
  );
}
