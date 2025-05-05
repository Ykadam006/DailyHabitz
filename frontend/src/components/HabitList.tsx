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
    } catch  {
      console.error("Error fetching habits");
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const handleMarkDone = async (id: string) => {
    setLoadingId(id);
    await markHabitDone(id);
    await fetchHabits();
    setLoadingId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this habit?")) return;
    setLoadingId(id);
    await deleteHabit(id);
    await fetchHabits();
    setLoadingId(null);
  };

  if (!habits.length) return <p className="mt-4">No habits yet.</p>;

  return (
    <div className="space-y-4">
      {habits.map((habit) => (
        <div key={habit._id} className="border p-4 rounded shadow flex flex-col">
          {editingId === habit._id ? (
            <HabitEditForm habit={habit} onClose={() => setEditingId(null)} onSave={fetchHabits} />
          ) : (
            <>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{habit.title}</h3>
                  <p className="text-sm text-gray-500">🕒 {habit.frequency}</p>
                  {habit.notes && <p className="text-sm">{habit.notes}</p>}
                  <p className="text-sm mt-1">
                    🔁 Streak: {habit.currentStreak || 0} | ⚡ XP: {habit.xp || 0}
                  </p>
                </div>
                <div className="space-x-2 mt-1">
                  <button onClick={() => handleMarkDone(habit._id)} disabled={loadingId === habit._id}>✅</button>
                  <button onClick={() => setEditingId(habit._id)}>✏️</button>
                  <button onClick={() => handleDelete(habit._id)} disabled={loadingId === habit._id}>🗑️</button>
                </div>
              </div>

              {Array.isArray(habit.completedDates) && habit.completedDates.length > 0 && (
                <div className="mt-3">
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
