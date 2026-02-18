"use client";

import { useHabits, type Habit } from "@/hooks/useHabits";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Zap, TrendingUp, Target } from "lucide-react";
import { startOfWeek, endOfWeek, isWithinInterval } from "date-fns";

type Props = { userId: string };

export function InsightsSection({ userId }: Props) {
  const { habits } = useHabits(userId);

  const totalXP = habits.reduce((sum: number, h: Habit) => sum + (h.xp ?? 0), 0);
  const longestStreak = habits.reduce(
    (max: number, h: Habit) => Math.max(max, h.currentStreak ?? 0),
    0
  );

  const thisWeek = { start: startOfWeek(new Date()), end: endOfWeek(new Date()) };
  const completedThisWeek = habits.filter((h: Habit) =>
    (h.completedDates ?? []).some((d) =>
      isWithinInterval(new Date(d), thisWeek)
    )
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Insights</h2>
        <p className="text-muted-foreground">
          Your habit stats and progress
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Longest Streak</CardTitle>
            <Flame className="size-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{longestStreak}</p>
            <p className="text-xs text-muted-foreground">consecutive days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total XP</CardTitle>
            <Zap className="size-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalXP}</p>
            <p className="text-xs text-muted-foreground">experience points</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Activity</CardTitle>
            <TrendingUp className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{completedThisWeek}</p>
            <p className="text-xs text-muted-foreground">
              completions this week
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="size-4" />
            Summary
          </CardTitle>
          <CardDescription>
            You have {habits.filter((h: Habit) => !h._id.startsWith("temp-")).length} active habits.
            Keep going to build lasting habits!
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
