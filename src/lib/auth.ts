// ==============================================================================
// DESLA AUTH — NextAuth v5 Configuration
// Google OAuth for Creator, Distributor, and Admin portals
// ==============================================================================

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

// Emails allowed to access the Admin portal via Google OAuth
const ADMIN_GOOGLE_EMAILS = [
  process.env.ADMIN_GOOGLE_EMAIL || "elanwadebrook@gmail.com",
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.email = profile.email;
        token.name = profile.name;
        token.picture = (profile as Record<string,unknown>).picture as string;

        // Assign admin role for whitelisted emails
        const email = profile.email || "";
        if (ADMIN_GOOGLE_EMAILS.includes(email)) {
          token.role = "admin";
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        const u = session.user as unknown as Record<string, unknown>;
        u.role = token.role;
        u.id = token.sub || "";
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },

  trustHost: true,
});
