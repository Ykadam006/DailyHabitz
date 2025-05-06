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
      window.location.reload(); // Quick refresh
    } catch (err) {
      alert("❌ Failed to create habit");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gradient-to-br from-[#edf6f9] via-[#83c5be] to-[#006d77] text-gray-800 p-6 rounded-2xl shadow-lg max-w-xl mx-auto"
    >
      <h2 className="text-2xl font-bold mb-4 text-[#243E36]">🌱 Create a New Habit</h2>

      <input
        type="text"
        placeholder="Enter habit title"
        className="w-full px-4 py-2 mb-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#006d77]"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <select
        value={frequency}
        onChange={(e) => setFrequency(e.target.value)}
        className="w-full px-4 py-2 mb-3 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#006d77]"
      >
        <option value="daily">🌞 Daily</option>
        <option value="weekly">📅 Weekly</option>
      </select>

      <textarea
        placeholder="Add notes (optional)"
        className="w-full px-4 py-2 mb-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#006d77]"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <button
        type="submit"
        className="w-full py-2 bg-[#243E36] hover:bg-[#1b2c28] text-white font-semibold rounded-lg transition"
      >
        ➕ Add Habit
      </button>
    </form>
  );
}
