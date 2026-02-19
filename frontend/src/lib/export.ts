import type { Habit } from "@/hooks/useHabits";
import { format, startOfWeek, endOfWeek } from "date-fns";

const DAY_KEY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function toDayKey(d: string): string {
  return DAY_KEY_REGEX.test(d) ? d : format(new Date(d), "yyyy-MM-dd");
}

export function exportAsJson(habits: Habit[]): void {
  const data = {
    exportedAt: new Date().toISOString(),
    habits: habits
      .filter((h) => !h._id.startsWith("temp-"))
      .map((h) => ({
        title: h.title,
        frequency: h.frequency,
        category: h.category,
        goal: h.goal,
        reminderTime: h.reminderTime,
        currentStreak: h.currentStreak,
        xp: h.xp,
        completedDates: (h.completedDates ?? []).map(toDayKey),
      })),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `dailyhabitz-${format(new Date(), "yyyy-MM-dd")}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportAsCsv(habits: Habit[]): void {
  const rows: string[][] = [
    ["Title", "Frequency", "Category", "Goal", "Streak", "XP", "Completed Dates"],
  ];
  for (const h of habits.filter((h) => !h._id.startsWith("temp-"))) {
    const dates = (h.completedDates ?? []).map(toDayKey).join("; ");
    rows.push([
      `"${(h.title ?? "").replace(/"/g, '""')}"`,
      h.frequency ?? "",
      h.category ?? "",
      String(h.goal ?? ""),
      String(h.currentStreak ?? 0),
      String(h.xp ?? 0),
      `"${dates.replace(/"/g, '""')}"`,
    ]);
  }
  const csv = rows.map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `dailyhabitz-${format(new Date(), "yyyy-MM-dd")}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function getWeeklySummaryData(habits: Habit[]) {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = 7;
  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const startKey = format(weekStart, "yyyy-MM-dd");
  const endKey = format(weekEnd, "yyyy-MM-dd");
  const summary = habits
    .filter((h) => !h._id.startsWith("temp-"))
    .map((h) => {
      const completedInWeek = (h.completedDates ?? []).filter(
        (d) => toDayKey(d) >= startKey && toDayKey(d) <= endKey
      );
      const dateSet = new Set(completedInWeek.map(toDayKey));
      return {
        title: h.title,
        category: h.category,
        goal: h.goal,
        frequency: h.frequency,
        completedCount: completedInWeek.length,
        days: Array.from({ length: weekDays }, (_, i) => {
          const d = new Date(weekStart);
          d.setDate(d.getDate() + i);
          return dateSet.has(format(d, "yyyy-MM-dd"));
        }),
        dayLabels,
      };
    });
  return {
    weekLabel: `${format(weekStart, "MMM d")} – ${format(weekEnd, "MMM d, yyyy")}`,
    totalXP: habits.reduce((s, h) => s + (h.xp ?? 0), 0),
    longestStreak: Math.max(...habits.map((h) => h.currentStreak ?? 0), 0),
    habits: summary,
  };
}
