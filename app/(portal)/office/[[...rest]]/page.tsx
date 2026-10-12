import { redirect } from "next/navigation";

/** The staff portal merged into /dashboard. Old links and bookmarks land on the matching dashboard list. */
export default async function OfficeRedirect({ params }: { params: Promise<{ rest?: string[] }> }) {
  const { rest } = await params;
  redirect(rest?.[0] === "posts" ? "/dashboard/posts" : "/dashboard");
}
