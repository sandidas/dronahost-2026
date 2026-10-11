import "next-auth";

declare module "next-auth" {
  /** Portal role (lib/auth/roles), read from the users collection on every request. */
  interface User {
    role?: number;
  }

  interface Session {
    user: {
      id: string;
      name: string | null;
      email: string;
      image: string | null;
      role: number;
    };
  }
}
