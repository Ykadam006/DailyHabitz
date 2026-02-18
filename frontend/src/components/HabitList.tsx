"use client";

import { useState } from "react";
import { useHabits, type Habit } from "@/hooks/useHabits";
import HabitEditForm from "./HabitEditForm";
import HabitCalendar from "./HabitCalendar";
import HabitCardSkeleton from "./HabitCardSkeleton";
import { toast } from "sonner";

type HabitListProps = { userId: string };

export default function HabitList({ userId }: HabitListProps) {
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

  const handleSaveEdit = (id: string, data: { title: string; frequency: string; notes: string }) => {
    updateMutation.mutate(
      { id, data },
      {
        onSuccess: () => {
          setEditingId(null);
        },
        onError: () => {
          toast.error("Failed to update habit");
        },
      }
    );
  };

  if (isLoading && habits.length === 0) {
    return (
      <div className="space-y-6 mt-8">
        <HabitCardSkeleton />
        <HabitCardSkeleton />
        <HabitCardSkeleton />
      </div>
    );
  }

  if (habits.length === 0) {
    return (
      <p className="mt-6 text-center text-gray-500">
        No habits yet. Start by adding one!
      </p>
    );
  }

  return (
    <div className="space-y-6 mt-8">
      {isFetching && habits.length > 0 && (
        <div className="text-xs text-gray-500 text-center" aria-live="polite">
          Syncing...
        </div>
      )}
      {habits.map((habit: Habit) => (
        <div
          key={habit._id}
          className={`border border-gray-200 bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all ${
            habit.isSaving ? "opacity-80" : ""
          }`}
        >
          {editingId === habit._id ? (
            <HabitEditForm
              habit={habit}
              onClose={() => setEditingId(null)}
              onSave={(data) => handleSaveEdit(habit._id, data)}
              isSaving={updateMutation.isPending}
            />
          ) : (
            <>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-[#243E36] mb-1 flex items-center gap-2">
                    {habit.title}
                    {habit.isSaving && (
                      <span className="text-xs text-amber-600 font-normal">
                        Saving...
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-[#7CA982] mb-1">{habit.frequency}</p>
                  {habit.notes && (
                    <p className="text-sm text-gray-600 italic mb-1">
                      {habit.notes}
                    </p>
                  )}
                  <p className="text-sm mt-2 text-[#006d77]">
                    Streak:{" "}
                    <span className="font-semibold">{habit.currentStreak ?? 0}</span>{" "}
                    | XP: <span className="font-semibold">{habit.xp ?? 0}</span>
                  </p>
                </div>
                <div className="flex flex-col space-y-2 items-end">
                  <button
                    onClick={() => handleMarkDone(habit._id)}
                    disabled={loadingId === habit._id || !!habit.isSaving}
                    className="text-green-600 hover:text-green-700 text-sm font-medium disabled:opacity-50"
                  >
                    Mark Done
                  </button>
                  <button
                    onClick={() => setEditingId(habit._id)}
                    disabled={!!habit.isSaving}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(habit._id)}
                    disabled={loadingId === habit._id || !!habit.isSaving}
                    className="text-red-500 hover:text-red-600 text-sm font-medium disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {Array.isArray(habit.completedDates) &&
                habit.completedDates.length > 0 && (
                  <div className="mt-4">
                    <HabitCalendar completedDates={habit.completedDates} />
                  </div>
                )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}
