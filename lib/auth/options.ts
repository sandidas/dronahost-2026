import type { NextAuthOptions } from "next-auth";
import GoogleProvider, { type GoogleProfile } from "next-auth/providers/google";
import { mongooseAdapter, syncEnvAdmin } from "./adapter";
import { toRole } from "./roles";

const THIRTY_DAYS = 30 * 24 * 60 * 60;
const ONE_DAY = 24 * 60 * 60;

/**
 * Google is the only sign-in method. Sessions live in the database, so every request reads the user's
 * current role: a role change or removal applies on the next request, not at the next sign-in.
 */
export const authOptions: NextAuthOptions = {
  adapter: mongooseAdapter(),
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "database", maxAge: THIRTY_DAYS, updateAge: ONE_DAY },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  pages: { signIn: "/sign-in", error: "/sign-in" },
  callbacks: {
    /** Only Google accounts whose email Google has verified. */
    async signIn({ account, profile }) {
      if (account?.provider !== "google") return false;
      const google = profile as GoogleProfile | undefined;
      return google?.email_verified === true && typeof google.email === "string" && google.email.length > 0;
    },
    async session({ session, user }) {
      return {
        ...session,
        user: { id: user.id, name: user.name ?? null, email: user.email, image: user.image ?? null, role: toRole(user.role) },
      };
    },
    /** Only same-site redirects. */
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/") && !url.startsWith("//")) return `${baseUrl}${url}`;
      try {
        if (new URL(url).origin === baseUrl) return url;
      } catch {
        /* fall through to the default */
      }
      return `${baseUrl}/sign-in/continue`;
    },
  },
  events: {
    async signIn({ user }) {
      await syncEnvAdmin(user.email);
    },
  },
};
