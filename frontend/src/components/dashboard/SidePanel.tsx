"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "motion/react";
import { useHabits, type Habit } from "@/hooks/useHabits";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Zap, TrendingUp, Calendar } from "lucide-react";
import { isCompletedToday } from "@/lib/dateUtils";
import { useAuthToken } from "@/hooks/useAuthToken";
import HabitCalendar from "@/components/HabitCalendar";
import { MICROCOPY } from "@/lib/microcopy";
import { transition } from "@/lib/animation";

type SidePanelProps = { defaultTab?: "insights" | "calendar" };

export function SidePanel({ defaultTab = "insights" }: SidePanelProps) {
  const { token } = useAuthToken();
  const { habits } = useHabits(token);

  const totalXP = habits.reduce((sum: number, h: Habit) => sum + (h.xp ?? 0), 0);
  const longestStreak = habits.reduce(
    (max: number, h: Habit) => Math.max(max, h.currentStreak ?? 0),
    0
  );
  const completedToday = habits.filter((h: Habit) =>
    (h.completedDates ?? []).some(isCompletedToday)
  );
  const todayProgress =
    habits.length > 0
      ? Math.round((completedToday.length / habits.length) * 100)
      : 0;

  const validHabits = habits.filter((h: Habit) => !h._id.startsWith("temp-"));

  return (
    <aside className="hidden w-72 shrink-0 lg:block">
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="insights" className="gap-1.5">
            <TrendingUp className="size-3.5" />
            {MICROCOPY.insights}
          </TabsTrigger>
          <TabsTrigger value="calendar" className="gap-1.5">
            <Calendar className="size-3.5" />
            Calendar
          </TabsTrigger>
        </TabsList>
        <TabsContent value="insights" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Flame className="size-4 text-orange-500" />
                Longest Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <motion.p
                key={longestStreak}
                className="text-2xl font-bold"
                initial={{ scale: 1.15 }}
                animate={{ scale: 1 }}
                transition={transition.normal}
              >
                {longestStreak}
              </motion.p>
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
              <motion.p
                key={todayProgress}
                className="text-2xl font-bold"
                initial={{ scale: 1.15 }}
                animate={{ scale: 1 }}
                transition={transition.normal}
              >
                {todayProgress}%
              </motion.p>
              <p className="text-xs text-muted-foreground">
                {completedToday.length} of {habits.length} done
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
              <motion.p
                key={totalXP}
                className="text-2xl font-bold"
                initial={{ scale: 1.15 }}
                animate={{ scale: 1 }}
                transition={transition.normal}
              >
                {totalXP}
              </motion.p>
              <p className="text-xs text-muted-foreground">experience points</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="calendar" className="mt-4">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {MICROCOPY.calendarSubtitle}
            </p>
            {validHabits.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-sm text-muted-foreground">
                  No habits yet. Add one to see your calendar.
                </CardContent>
              </Card>
            ) : (
              validHabits.map((habit: Habit) => (
                <Card key={habit._id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{habit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {Array.isArray(habit.completedDates) &&
                    habit.completedDates.length > 0 ? (
                      <HabitCalendar completedDates={habit.completedDates} />
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        No completions yet
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </aside>
  );
}
