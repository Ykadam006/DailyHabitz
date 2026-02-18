"use client";

import HabitForm from "@/components/HabitForm";
import HabitList from "@/components/HabitList";

export default function DashboardPage() {
  const userId = "default-user";

  return (
    <main className="min-h-screen bg-[#f1f7ed] px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-[#243E36]">
          👋 Welcome to DailyHabitz!
        </h1>

        <HabitForm userId={userId} />
        <HabitList userId={userId} />
      </div>
    </main>
  );
}
