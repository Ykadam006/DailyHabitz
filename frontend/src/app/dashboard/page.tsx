"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { InsightsPanel } from "@/components/dashboard/InsightsPanel";
import { TodaySection } from "@/components/dashboard/TodaySection";
import { HabitsSection } from "@/components/dashboard/HabitsSection";
import { CalendarSection } from "@/components/dashboard/CalendarSection";
import { InsightsSection } from "@/components/dashboard/InsightsSection";

function DashboardContent() {
  const searchParams = useSearchParams();
  const section = searchParams.get("section") ?? "today";

  const userId = "default-user";

  return (
    <div className="flex flex-1 gap-6 p-4 md:p-6">
      <main className="min-w-0 flex-1">
        {section === "today" && <TodaySection userId={userId} />}
        {section === "habits" && <HabitsSection userId={userId} />}
        {section === "calendar" && <CalendarSection userId={userId} />}
        {section === "insights" && <InsightsSection userId={userId} />}
      </main>
      <InsightsPanel />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6 p-4 md:p-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
