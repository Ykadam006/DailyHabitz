"use client";

import { useEffect, useRef } from "react";
import { useSession, signIn } from "next-auth/react";

const REFRESH_INTERVAL_MS = 50 * 60 * 1000;

/**
 * Proactively refresh the backend token before it expires (60 min default).
 * Runs every 50 min when user is authenticated.
 */
export function TokenRefresh() {
  const { data: session, status } = useSession();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (status !== "authenticated" || !session) return;
    const token = (session as { backendToken?: string }).backendToken;
    if (!token) return;

    const refresh = () => {
      signIn("credentials", {
        email: "__refresh__",
        password: token,
        redirect: false,
      });
    };

    intervalRef.current = setInterval(refresh, REFRESH_INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [session, status]);

  return null;
}
