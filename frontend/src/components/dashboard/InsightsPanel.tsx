"use client";

import { useHabits, type Habit } from "@/hooks/useHabits";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Zap, TrendingUp } from "lucide-react";

export function InsightsPanel() {
  const userId = "default-user";
  const { habits } = useHabits(userId);

  const totalXP = habits.reduce((sum: number, h: Habit) => sum + (h.xp ?? 0), 0);
  const longestStreak = habits.reduce(
    (max: number, h: Habit) => Math.max(max, h.currentStreak ?? 0),
    0
  );

  const today = new Date().toDateString();
  const completedToday = habits.filter((h: Habit) =>
    (h.completedDates ?? []).some((d) => new Date(d).toDateString() === today)
  );
  const weeklyCompletion =
    habits.length > 0
      ? Math.round((completedToday.length / habits.length) * 100)
      : 0;

  return (
    <aside className="hidden w-64 shrink-0 lg:block">
      <div className="sticky top-20 space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Flame className="size-4 text-orange-500" />
              Longest Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{longestStreak}</p>
            <p className="text-xs text-muted-foreground">consecutive days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="size-4 text-green-500" />
              Today&apos;s Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{weeklyCompletion}%</p>
            <p className="text-xs text-muted-foreground">
              {completedToday.length} of {habits.length} completed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="size-4 text-amber-500" />
              Total XP
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalXP}</p>
            <p className="text-xs text-muted-foreground">experience points</p>
          </CardContent>
        </Card>
      </div>
    </aside>
  );
}
