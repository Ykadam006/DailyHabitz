import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          if (credentials.email === "__refresh__") {
            const res = await fetch(`${API_URL}/auth/refresh`, {
              method: "POST",
              headers: { Authorization: `Bearer ${credentials.password}` },
            });
            if (!res.ok) return null;
            const data = await res.json().catch(() => null);
            if (!data?.user?.id || !data?.token) return null;
            return {
              id: data.user.id,
              email: data.user.email,
              name: data.user.name,
              backendToken: data.token,
            };
          }
          const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });
          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data?.error || "Invalid email or password");
          }
          const data = await res.json().catch(() => null);
          if (!data?.user?.id || !data?.token) {
            throw new Error("Invalid response from server");
          }
          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            backendToken: data.token,
          };
        } catch (err) {
          if (err instanceof Error) throw err;
          throw new Error("Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.backendToken = (user as { backendToken?: string }).backendToken;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string;
        session.user.name = (token.name as string) ?? null;
        session.user.email = (token.email as string) ?? null;
        (session as { backendToken?: string }).backendToken = token.backendToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};
