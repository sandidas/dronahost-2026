import { notFound } from "next/navigation";

// Render per request so production returns a real HTTP 404 (a static prerender would
// answer 200 with the not-found UI).
export const dynamic = "force-dynamic";

/** Dev-only route group (/v2 showcase and design system). Not available in production. */
export default function DevLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV !== "development") notFound();
  return <>{children}</>;
}
