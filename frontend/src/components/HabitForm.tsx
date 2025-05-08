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
      window.location.reload();
    } catch (err) {
      alert("Failed to create habit");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 p-6 rounded-xl shadow-xl max-w-xl mx-auto"
    >
      <h2 className="text-2xl font-semibold mb-4 text-[#006d77]">Create a New Habit</h2>

      <input
        type="text"
        placeholder="Habit title"
        className="w-full px-4 py-2 mb-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#006d77] transition"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <select
        value={frequency}
        onChange={(e) => setFrequency(e.target.value)}
        className="w-full px-4 py-2 mb-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#006d77] transition"
      >
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
      </select>

      <textarea
        placeholder="Notes (optional)"
        className="w-full px-4 py-2 mb-4 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#006d77] transition"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <button
        type="submit"
        className="w-full py-2 bg-[#006d77] hover:bg-[#005258] text-white font-medium rounded-lg transition"
      >
        Add Habit
      </button>
    </form>
  );
}
