"use client";

import { useEffect, useState } from "react";
import { getHabits, markHabitDone, deleteHabit } from "../lib/api";
import HabitEditForm from "./HabitEditForm";

type Habit = {
    _id: string;
    title: string;
    frequency: string;
    notes?: string;
    currentStreak?: number;
    xp?: number;
    completedDates?: string[];
  };

export default function HabitList() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "daily" | "weekly">("all");

  const fetchHabits = async () => {
    try {
      const data = await getHabits();
      setHabits(data);
    } catch (err) {
      console.error("Error fetching habits", err);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const handleMarkDone = async (id: string) => {
    try {
      setLoadingId(id);
      await markHabitDone(id);
      await fetchHabits();
    } catch (err) {
      alert("Error marking habit as done.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this habit?");
    if (!confirmDelete) return;

    try {
      setLoadingId(id);
      await deleteHabit(id);
      await fetchHabits();
    } catch (err) {
      alert("Error deleting habit.");
    } finally {
      setLoadingId(null);
    }
  };

  if (!habits.length) return <p className="mt-4">No habits yet.</p>;

  return (
    <div className="mt-6 space-y-4">
      <div className="flex justify-end mb-2">
        <select
          className="p-2 border rounded"
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value as "all" | "daily" | "weekly")
          }
        >
          <option value="all">All</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>
      </div>

      {habits
        .filter((habit) => filter === "all" || habit.frequency === filter)
        .map((habit) => (
          <div
            key={habit._id}
            className="border p-4 rounded shadow flex justify-between items-start"
          >
            <div className="w-full">
              {editingId === habit._id ? (
                <HabitEditForm
                  habit={habit}
                  onClose={() => setEditingId(null)}
                  onSave={fetchHabits}
                />
              ) : (
                <>
                  <h3 className="text-lg font-semibold">{habit.title}</h3>
                  <p className="text-sm text-gray-600">
                    🕒 {habit.frequency}
                  </p>
                  {habit.notes && (
                    <p className="text-sm text-gray-500">📝 {habit.notes}</p>
                  )}
                  <p className="text-sm mt-1">
                    🔁 Streak: <strong>{habit.currentStreak ?? 0}</strong>{" "}
                    &nbsp;|&nbsp; ⚡ XP: <strong>{habit.xp ?? 0}</strong>
                  </p>
                </>
              )}
            </div>

            {editingId !== habit._id && (
              <div className="space-x-2 mt-1 ml-2">
                <button
                  onClick={() => handleMarkDone(habit._id)}
                  className="px-2 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                  disabled={loadingId === habit._id}
                >
                  ✅
                </button>
                <button
                  onClick={() => setEditingId(habit._id)}
                  className="px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(habit._id)}
                  className="px-2 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                  disabled={loadingId === habit._id}
                >
                  🗑️
                </button>
              </div>
            )}
          </div>
        ))}
    </div>
  );
}
