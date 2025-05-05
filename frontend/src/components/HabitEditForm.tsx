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
    } catch  {
      alert("Failed to update habit.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2 space-y-2">
      <input
        className="w-full p-2 border rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <select
        className="w-full p-2 border rounded"
        value={frequency}
        onChange={(e) => setFrequency(e.target.value)}
      >
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
      </select>
      <textarea
        className="w-full p-2 border rounded"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {loading ? "Saving..." : "💾 Save"}
        </button>
        <button
          type="button"
          className="px-3 py-1 bg-gray-300 rounded"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
