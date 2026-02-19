"use client";

import { useHabits } from "@/hooks/useHabits";
import { getWeeklySummaryData } from "@/lib/export";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Flame, Zap } from "lucide-react";

type Props = { token: string | undefined };

/** Shareable weekly summary — designed for screenshot export */
export function WeeklySummaryView({ token }: Props) {
  const { habits } = useHabits(token);
  const data = getWeeklySummaryData(habits);

  return (
    <div
      className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm"
      style={{ minWidth: 320, maxWidth: 480 }}
    >
      <div className="flex items-center justify-between border-b pb-3 mb-4">
        <h2 className="text-lg font-bold">DailyHabitz</h2>
        <span className="text-sm text-muted-foreground">{data.weekLabel}</span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="rounded-lg bg-muted/50 p-3 text-center">
          <Flame className="size-5 mx-auto mb-1 text-orange-500" />
          <p className="text-xl font-bold">{data.longestStreak}</p>
          <p className="text-xs text-muted-foreground">Best streak</p>
        </div>
        <div className="rounded-lg bg-muted/50 p-3 text-center">
          <Zap className="size-5 mx-auto mb-1 text-amber-500" />
          <p className="text-xl font-bold">{data.totalXP}</p>
          <p className="text-xs text-muted-foreground">Total XP</p>
        </div>
        <div className="rounded-lg bg-muted/50 p-3 text-center">
          <p className="text-xl font-bold">{data.habits.length}</p>
          <p className="text-xs text-muted-foreground">Habits</p>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground">
          This week&apos;s progress
        </p>
        {data.habits.map((h) => (
          <div
            key={h.title}
            className="flex items-center gap-3 text-sm"
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{h.title}</p>
              {h.category && (
                <p className="text-xs text-muted-foreground">{h.category}</p>
              )}
            </div>
            <div className="flex gap-1 shrink-0">
              {h.days.map((done, i) => (
                <div
                  key={i}
                  className={`size-6 rounded flex items-center justify-center text-xs ${
                    done
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                  title={h.dayLabels[i]}
                >
                  {done ? <Check className="size-3" /> : "—"}
                </div>
              ))}
            </div>
            <span className="text-xs text-muted-foreground w-10 text-right">
              {h.completedCount}
              {h.goal ? `/${h.goal}` : ""}
            </span>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-4 pt-3 border-t text-center">
        dailyhabitz.app
      </p>
    </div>
  );
}
