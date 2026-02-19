"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { TokenRefresh } from "./TokenRefresh";

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextAuthSessionProvider>
      <TokenRefresh />
      {children}
    </NextAuthSessionProvider>
  );
}
