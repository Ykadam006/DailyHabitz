"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useHabits, type Habit } from "@/hooks/useHabits";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { isCompletedToday } from "@/lib/dateUtils";
import { MICROCOPY, MICROCOPY_ROTATING } from "@/lib/microcopy";
import { transition, xpBurstVariants } from "@/lib/animation";

type Props = { token: string | undefined };

export function TodaySection({ token }: Props) {
  const { habits, markDoneMutation } = useHabits(token);
  const [quoteIndex] = useState(() =>
    Math.floor(Math.random() * MICROCOPY_ROTATING.length)
  );
  const [xpBurstId, setXpBurstId] = useState<string | null>(null);

  const habitsDueToday = habits.filter((h: Habit) => !h._id.startsWith("temp-"));
  const completedToday = habitsDueToday.filter((h: Habit) =>
    (h.completedDates ?? []).some(isCompletedToday)
  );
  const pendingHabits = habitsDueToday.filter(
    (h: Habit) => !(h.completedDates ?? []).some(isCompletedToday)
  );

  const handleMarkDone = (habit: Habit) => {
    setXpBurstId(habit._id);
    setTimeout(() => setXpBurstId(null), 500);
    markDoneMutation.mutate(habit._id, {
      onError: (err) => {
        setXpBurstId(null);
        toast.error(err instanceof Error ? err.message : "Failed to mark done");
      },
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
        <p className="text-sm text-muted-foreground/80 mt-1 italic">
          {MICROCOPY_ROTATING[quoteIndex]}
        </p>
      </div>

      {pendingHabits.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Mark as done</CardTitle>
            <CardDescription>
              {MICROCOPY.markDoneCta}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <AnimatePresence mode="popLayout">
            {pendingHabits.map((habit: Habit) => (
              <motion.div
                key={habit._id}
                className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={transition.normal}
                whileHover={{ y: -1 }}
              >
                <div>
                  <h3 className="font-medium">{habit.title}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    {MICROCOPY.streakLabel}: {habit.currentStreak ?? 0} · {MICROCOPY.xpLabel}: {habit.xp ?? 0}
                    <span className="relative inline-flex">
                      <AnimatePresence>
                        {xpBurstId === habit._id && (
                          <motion.span
                            key="xp-burst"
                            className="absolute -top-0.5 left-full ml-0.5 text-xs font-semibold text-green-600 dark:text-green-400 whitespace-nowrap"
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            variants={xpBurstVariants}
                            transition={transition.fast}
                          >
                            +10
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </span>
                  </p>
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={transition.fast}>
                  <Button
                    size="lg"
                    onClick={() => handleMarkDone(habit)}
                    disabled={markDoneMutation.isPending}
                  >
                    <motion.span
                      className="inline-flex items-center"
                      whileTap={{ scale: 1.2 }}
                      transition={transition.fast}
                    >
                      <CheckCircle2 className="mr-2 size-4" />
                    </motion.span>
                    Mark Done
                  </Button>
                </motion.div>
              </motion.div>
            ))}
            </AnimatePresence>
          </CardContent>
        </Card>
      )}

      {completedToday.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600 dark:text-green-400">
              {MICROCOPY.completedToday}
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
              {MICROCOPY.emptyToday}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
