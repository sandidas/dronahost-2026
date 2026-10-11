import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth/options";

/** next-auth (Google sign-in, database sessions). Node.js runtime: the MongoDB driver does not run on the edge. */
export const runtime = "nodejs";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
