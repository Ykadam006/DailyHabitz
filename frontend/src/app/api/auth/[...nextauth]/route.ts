import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { Session } from "next-auth";

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }: { session: Session; token: any }) {
      return { ...session, userId: token.sub };
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
