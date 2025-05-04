"use client";

import { useState } from "react";
import { createHabit } from "../lib/api";

export default function HabitForm({ userId }: { userId: string }) {
  const [title, setTitle] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createHabit({ title, frequency, notes, userId });
      setTitle("");
      setFrequency("daily");
      setNotes("");
      window.location.reload(); // Simple refresh for demo
    } catch (err) {
      alert("Failed to create habit");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md mb-4">
      <h2 className="text-lg font-semibold mb-2">Add New Habit</h2>
      <input
        type="text"
        placeholder="Habit title"
        className="w-full border p-2 mb-2 rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <select
        value={frequency}
        onChange={(e) => setFrequency(e.target.value)}
        className="w-full border p-2 mb-2 rounded"
      >
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
      </select>
      <textarea
        placeholder="Notes (optional)"
        className="w-full border p-2 mb-2 rounded"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <button type="submit" className="bg-[#243E36] text-white px-4 py-2 rounded w-full">
        ➕ Add Habit
      </button>
    </form>
  );
}
