/** Date helpers shared by every tool. A date is real only when it round-trips: "2026-02-30" is not a date. */
export const isIsoDate = (v: string | undefined | null): v is string => {
  if (!v || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const t = Date.parse(`${v}T00:00:00Z`);
  return !Number.isNaN(t) && new Date(t).toISOString().slice(0, 10) === v;
};
