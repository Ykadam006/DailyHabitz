"use client";

import { useState } from "react";
import { useHabits, type Habit } from "@/hooks/useHabits";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, Zap, TrendingUp, Target, Download, Share2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { isInThisWeek } from "@/lib/dateUtils";
import { exportAsJson, exportAsCsv } from "@/lib/export";
import { WeeklySummaryView } from "@/components/WeeklySummaryView";
import { MICROCOPY } from "@/lib/microcopy";

type Props = { token: string | undefined };

export function InsightsSection({ token }: Props) {
  const { habits } = useHabits(token);
  const [shareOpen, setShareOpen] = useState(false);

  const totalXP = habits.reduce((sum: number, h: Habit) => sum + (h.xp ?? 0), 0);
  const longestStreak = habits.reduce(
    (max: number, h: Habit) => Math.max(max, h.currentStreak ?? 0),
    0
  );

  const completedThisWeek = habits.filter((h: Habit) =>
    (h.completedDates ?? []).some(isInThisWeek)
  ).length;

  const validHabits = habits.filter((h: Habit) => !h._id.startsWith("temp-"));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Insights</h2>
          <p className="text-muted-foreground">
            {MICROCOPY.insightsSubtitle}
          </p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="size-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => exportAsJson(validHabits)}>
                Export as JSON
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportAsCsv(validHabits)}>
                Export as CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Dialog open={shareOpen} onOpenChange={setShareOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Share2 className="size-4 mr-2" />
                Weekly Summary
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-fit">
              <DialogHeader>
                <DialogTitle>Share your progress</DialogTitle>
                <p className="text-sm text-muted-foreground">
                  {MICROCOPY.weeklySummary}
                </p>
              </DialogHeader>
              <div className="flex justify-center py-4">
                <WeeklySummaryView token={token} />
              </div>
            </DialogContent>
          </Dialog>
        </div>
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
            You have {habits.filter((h: Habit) => !h._id.startsWith("temp-")).length} active habits. {MICROCOPY.motivation}
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
