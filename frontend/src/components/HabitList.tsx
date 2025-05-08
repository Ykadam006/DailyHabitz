"use client";

import { useEffect, useState } from "react";
import { getHabits, markHabitDone, deleteHabit } from "../lib/api";
import HabitEditForm from "./HabitEditForm";
import HabitCalendar from "./HabitCalendar";

type Habit = {
  _id: string;
  title: string;
  frequency: string;
  notes?: string;
  currentStreak?: number;
  xp?: number;
  completedDates?: string[];
};

export default function HabitList({ userId }: { userId: string }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchHabits = async () => {
    try {
      const data = await getHabits(userId);
      setHabits(data);
    } catch {
      console.error("Error fetching habits");
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const handleMarkDone = async (id: string) => {
    setLoadingId(id);
    try {
      await markHabitDone(id);
      await fetchHabits();
    } catch (err: any) {
      alert(err.message);
    }
    setLoadingId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this habit?")) return;
    setLoadingId(id);
    await deleteHabit(id);
    await fetchHabits();
    setLoadingId(null);
  };

  if (!habits.length)
    return (
      <p className="mt-6 text-center text-gray-500">
        No habits yet. Start by adding one!
      </p>
    );

  return (
    <div className="space-y-6 mt-8">
      {habits.map((habit) => (
        <div
          key={habit._id}
          className="border border-gray-200 bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all"
        >
          {editingId === habit._id ? (
            <HabitEditForm
              habit={habit}
              onClose={() => setEditingId(null)}
              onSave={fetchHabits}
            />
          ) : (
            <>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-[#243E36] mb-1">
                    {habit.title}
                  </h3>
                  <p className="text-sm text-[#7CA982] mb-1">{habit.frequency}</p>
                  {habit.notes && (
                    <p className="text-sm text-gray-600 italic mb-1">{habit.notes}</p>
                  )}
                  <p className="text-sm mt-2 text-[#006d77]">
                    Streak:{" "}
                    <span className="font-semibold">{habit.currentStreak || 0}</span>{" "}
                    | XP: <span className="font-semibold">{habit.xp || 0}</span>
                  </p>
                </div>
                <div className="flex flex-col space-y-2 items-end">
                  <button
                    onClick={() => handleMarkDone(habit._id)}
                    disabled={loadingId === habit._id}
                    className="text-green-600 hover:text-green-700 text-sm font-medium"
                  >
                    Mark Done
                  </button>
                  <button
                    onClick={() => setEditingId(habit._id)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(habit._id)}
                    disabled={loadingId === habit._id}
                    className="text-red-500 hover:text-red-600 text-sm font-medium"
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
