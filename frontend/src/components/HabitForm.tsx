"use client";

import { useState } from "react";
import { createHabit } from "../lib/api";

export default function HabitForm() {
  const [title, setTitle] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createHabit({ title, frequency, notes });
      alert("Habit created!");
      setTitle("");
      setFrequency("daily");
      setNotes("");
    } catch (err) {
      console.error("Failed to create habit", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Habit title"
        required
        className="w-full p-2 border rounded"
      />
      <select
        value={frequency}
        onChange={(e) => setFrequency(e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
      </select>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes (optional)"
        className="w-full p-2 border rounded"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Add Habit
      </button>
    </form>
  );
}
