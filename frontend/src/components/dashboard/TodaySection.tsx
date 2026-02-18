"use client";

import { useHabits, type Habit } from "@/hooks/useHabits";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

type Props = { userId: string };

export function TodaySection({ userId }: Props) {
  const { habits, markDoneMutation } = useHabits(userId);
  const today = new Date().toDateString();

  const habitsDueToday = habits.filter((h: Habit) => !h._id.startsWith("temp-"));
  const completedToday = habitsDueToday.filter((h: Habit) =>
    (h.completedDates ?? []).some((d) => new Date(d).toDateString() === today)
  );
  const pendingHabits = habitsDueToday.filter(
    (h: Habit) =>
      !(h.completedDates ?? []).some(
        (d) => new Date(d).toDateString() === today
      )
  );

  const handleMarkDone = (habit: Habit) => {
    markDoneMutation.mutate(habit._id, {
      onError: (err) =>
        toast.error(err instanceof Error ? err.message : "Failed to mark done"),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Habits due today
        </h2>
        <p className="text-muted-foreground">
          {format(new Date(), "EEEE, MMMM d")}
        </p>
      </div>

      {pendingHabits.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Mark as done</CardTitle>
            <CardDescription>
              Complete your habits for today to build your streak
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingHabits.map((habit: Habit) => (
              <div
                key={habit._id}
                className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4"
              >
                <div>
                  <h3 className="font-medium">{habit.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Streak: {habit.currentStreak ?? 0} · XP: {habit.xp ?? 0}
                  </p>
                </div>
                <Button
                  size="lg"
                  onClick={() => handleMarkDone(habit)}
                  disabled={markDoneMutation.isPending}
                >
                  <CheckCircle2 className="mr-2 size-4" />
                  Mark Done
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {completedToday.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600 dark:text-green-400">
              Completed today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {completedToday.map((habit: Habit) => (
                <li
                  key={habit._id}
                  className="flex items-center gap-2 text-muted-foreground"
                >
                  <CheckCircle2 className="size-4 text-green-500" />
                  {habit.title}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {habitsDueToday.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground text-center">
              No habits yet. Add one to get started!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
