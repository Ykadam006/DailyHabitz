"use client";

import { useState } from "react";
import { useHabits } from "@/hooks/useHabits";
import { toast } from "sonner";

type Props = { userId: string };

export default function HabitForm({ userId }: Props) {
  const [title, setTitle] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [notes, setNotes] = useState("");
  const { createMutation } = useHabits(userId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      { title, frequency, notes, userId },
      {
        onSuccess: () => {
          setTitle("");
          setFrequency("daily");
          setNotes("");
        },
        onError: () => {
          toast.error("Failed to create habit");
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 p-6 rounded-xl shadow-xl max-w-xl mx-auto"
    >
      <h2 className="text-2xl font-semibold mb-4 text-[#006d77]">
        Create a New Habit
      </h2>

      <input
        type="text"
        placeholder="Habit title"
        className="w-full px-4 py-2 mb-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#006d77] transition"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        disabled={createMutation.isPending}
      />

      <select
        value={frequency}
        onChange={(e) => setFrequency(e.target.value)}
        className="w-full px-4 py-2 mb-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#006d77] transition"
        disabled={createMutation.isPending}
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
        disabled={createMutation.isPending}
        className="w-full py-2 bg-[#006d77] hover:bg-[#005258] text-white font-medium rounded-lg transition disabled:opacity-70"
      >
        {createMutation.isPending ? "Adding..." : "Add Habit"}
      </button>
    </form>
  );
}
