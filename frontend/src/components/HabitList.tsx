"use client";

import { useState } from "react";
import { useHabits, type Habit } from "@/hooks/useHabits";
import HabitEditForm from "./HabitEditForm";
import HabitCalendar from "./HabitCalendar";
import HabitCardSkeleton from "./HabitCardSkeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { CheckCircle2, Pencil, Trash2 } from "lucide-react";

type HabitListProps = {
  userId: string;
  search?: string;
  sortBy?: "title" | "streak" | "xp";
};

export default function HabitList({
  userId,
  search = "",
  sortBy = "title",
}: HabitListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const {
    habits,
    isLoading,
    isFetching,
    updateMutation,
    deleteMutation,
    markDoneMutation,
  } = useHabits(userId);

  const filteredHabits = habits
    .filter((h: Habit) => {
      if (h._id.startsWith("temp-")) return true;
      const match = search
        ? h.title.toLowerCase().includes(search.toLowerCase())
        : true;
      return match;
    })
    .sort((a: Habit, b: Habit) => {
      if (a._id.startsWith("temp-")) return -1;
      if (b._id.startsWith("temp-")) return 1;
      switch (sortBy) {
        case "streak":
          return (b.currentStreak ?? 0) - (a.currentStreak ?? 0);
        case "xp":
          return (b.xp ?? 0) - (a.xp ?? 0);
        default:
          return a.title.localeCompare(b.title);
      }
    });

  const handleMarkDone = (id: string) => {
    if (id.startsWith("temp-")) return;
    setLoadingId(id);
    markDoneMutation.mutate(id, {
      onSettled: () => setLoadingId(null),
      onError: (err) => {
        toast.error(err instanceof Error ? err.message : "Failed to mark done");
      },
    });
  };

  const handleDelete = (id: string) => {
    if (id.startsWith("temp-")) return;
    if (!confirm("Are you sure you want to delete this habit?")) return;
    setLoadingId(id);
    deleteMutation.mutate(id, {
      onSettled: () => setLoadingId(null),
      onError: () => toast.error("Failed to delete habit"),
    });
  };

  const handleSaveEdit = (
    id: string,
    data: { title: string; frequency: string; notes: string }
  ) => {
    updateMutation.mutate(
      { id, data },
      {
        onSuccess: () => setEditingId(null),
        onError: () => toast.error("Failed to update habit"),
      }
    );
  };

  if (isLoading && habits.length === 0) {
    return (
      <div className="space-y-6">
        <HabitCardSkeleton />
        <HabitCardSkeleton />
        <HabitCardSkeleton />
      </div>
    );
  }

  if (filteredHabits.length === 0) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        {search ? "No habits match your search." : "No habits yet. Start by adding one!"}
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {isFetching && habits.length > 0 && (
        <div className="text-xs text-muted-foreground text-center" aria-live="polite">
          Syncing...
        </div>
      )}
      {filteredHabits.map((habit: Habit) => (
        <Card
          key={habit._id}
          className={habit.isSaving ? "opacity-80" : ""}
        >
          <CardContent className="pt-6">
            {editingId === habit._id ? (
              <div className="space-y-4">
                <HabitEditForm
                  habit={habit}
                  onClose={() => setEditingId(null)}
                  onSave={(data) => handleSaveEdit(habit._id, data)}
                  isSaving={updateMutation.isPending}
                />
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      {habit.title}
                      {habit.isSaving && (
                        <Badge variant="secondary" className="text-xs">
                          Saving...
                        </Badge>
                      )}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {habit.frequency}
                    </p>
                    {habit.notes && (
                      <p className="text-sm text-muted-foreground italic mt-0.5">
                        {habit.notes}
                      </p>
                    )}
                    <div className="flex gap-3 mt-2">
                      <Badge variant="outline">
                        Streak: {habit.currentStreak ?? 0}
                      </Badge>
                      <Badge variant="outline">XP: {habit.xp ?? 0}</Badge>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleMarkDone(habit._id)}
                      disabled={loadingId === habit._id || !!habit.isSaving}
                    >
                      <CheckCircle2 className="size-4 mr-1" />
                      Mark Done
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingId(habit._id)}
                      disabled={!!habit.isSaving}
                    >
                      <Pencil className="size-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(habit._id)}
                      disabled={loadingId === habit._id || !!habit.isSaving}
                    >
                      <Trash2 className="size-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>

                {Array.isArray(habit.completedDates) &&
                  habit.completedDates.length > 0 && (
                    <>
                      <Separator className="my-4" />
                      <HabitCalendar completedDates={habit.completedDates} />
                    </>
                  )}
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
