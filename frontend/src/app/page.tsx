"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard");
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E0F7FA] via-[#E1F5FE] to-[#E3F2FD] px-4">
      <div className="text-center bg-white shadow-xl rounded-2xl p-8 max-w-md w-full animate-fade-in">
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
      </div>
    </main>
  );
}
