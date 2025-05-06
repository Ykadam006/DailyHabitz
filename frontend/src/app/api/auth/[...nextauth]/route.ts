import NextAuth, { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

// ✅ Define and export authOptions in one go
export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/", // optional
  },
};

// ✅ Create NextAuth handler
const handler = NextAuth(authOptions);

// ✅ Export handler functions for Next.js route
export { handler as GET, handler as POST };
