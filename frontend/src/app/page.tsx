"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E0F7FA] via-[#E1F5FE] to-[#E3F2FD] px-4">
      <div className="text-center bg-white shadow-xl rounded-2xl p-8 max-w-md w-full animate-fade-in">
        {session ? (
          <>
            <h1 className="text-2xl font-bold text-[#006d77] mb-3">
              Welcome, {session.user?.name || session.user?.email}
            </h1>
            <p className="text-gray-600 text-sm mb-6 italic">
              You're signed in to DailyHabitz
            </p>
            <button
              onClick={() => signOut()}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              🚪 Sign out
            </button>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-[#006d77] mb-3">
              👋 Welcome to <span className="text-[#7CA982]">DailyHabitz</span>
            </h1>
            <p className="text-gray-700 text-sm mb-6 italic">
              Build better habits, one day at a time.
            </p>
            <button
              onClick={() => signIn("github")}
              className="bg-[#243E36] text-white px-4 py-2 rounded-lg hover:bg-[#1b2c28] transition"
            >
              🔐 Sign in with GitHub
            </button>
          </>
        )}
      </div>
    </main>
  );
}
