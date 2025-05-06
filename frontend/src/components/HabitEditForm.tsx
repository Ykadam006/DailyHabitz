"use client";

import { useState } from "react";
import { updateHabit } from "../lib/api";

type Habit = {
  _id: string;
  title: string;
  frequency: string;
  notes?: string;
};

type Props = {
  habit: Habit;
  onClose: () => void;
  onSave: () => void;
};

export default function HabitEditForm({ habit, onClose, onSave }: Props) {
  const [title, setTitle] = useState(habit.title);
  const [frequency, setFrequency] = useState(habit.frequency);
  const [notes, setNotes] = useState(habit.notes || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateHabit(habit._id, { title, frequency, notes });
      onSave();
      onClose();
    } catch {
      alert("❌ Failed to update habit.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-lg shadow-md border border-[#d1e8e2] mt-2 space-y-3"
    >
      <h3 className="text-xl font-semibold text-[#243E36]">✏️ Edit Habit</h3>

      <input
        className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#006d77]"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        placeholder="Habit title"
      />

      <select
        className="w-full px-4 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#006d77]"
        value={frequency}
        onChange={(e) => setFrequency(e.target.value)}
      >
        <option value="daily">🌞 Daily</option>
        <option value="weekly">📅 Weekly</option>
      </select>

      <textarea
        className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#006d77]"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Optional notes..."
      />

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
        >
          ❌ Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-[#243E36] text-white rounded-lg hover:bg-[#1b2c28] transition"
        >
          {loading ? "Saving..." : "💾 Save"}
        </button>
      </div>
    </form>
  );
}
