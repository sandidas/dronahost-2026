/** Inline error for a portal section that could not load. */
export function PortalError({ message }: { message: string }) {
  return (
    <p role="alert" className="mt-6 rounded-lg border border-danger/30 bg-danger-surface px-4 py-3 text-sm font-medium text-danger">
      {message}
    </p>
  );
}
