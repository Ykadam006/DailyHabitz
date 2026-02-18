"use client";

import { useHabits, type Habit } from "@/hooks/useHabits";
import HabitCalendar from "@/components/HabitCalendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Props = { userId: string };

export function CalendarSection({ userId }: Props) {
  const { habits } = useHabits(userId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Calendar</h2>
        <p className="text-muted-foreground">
          5-week view of your habit completions
        </p>
      </div>

      <div className="space-y-4">
        {habits.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground text-center">
                No habits to display. Add a habit to see your calendar.
              </p>
            </CardContent>
          </Card>
        ) : (
          habits
            .filter((h: Habit) => !h._id.startsWith("temp-"))
            .map((habit: Habit) => (
              <Card key={habit._id}>
                <CardHeader>
                  <CardTitle>{habit.title}</CardTitle>
                  <CardDescription>{habit.frequency}</CardDescription>
                </CardHeader>
                <CardContent>
                  {Array.isArray(habit.completedDates) &&
                  habit.completedDates.length > 0 ? (
                    <HabitCalendar completedDates={habit.completedDates} />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No completions yet
                    </p>
                  )}
                </CardContent>
              </Card>
            ))
        )}
      </div>
    </div>
  );
}
