"use client";

import { useSession } from "next-auth/react";

export function useAuthToken() {
  const { data: session, status } = useSession();
  const token = (session as { backendToken?: string } | null)?.backendToken;
  return { token, status, isAuthenticated: !!token };
}
