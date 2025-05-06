"use client";

import { useState } from "react";

export default function HabitForm() {
  const [title, setTitle] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/habits/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });

    if (res.ok) {
      setTitle("");
      alert("Habit added!");
    } else {
      alert("Failed to add habit");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter a new habit"
        className="border p-2 rounded w-full"
        required
      />
      <button type="submit" className="bg-green-600 text-white px-4 rounded">
        Add
      </button>
    </form>
  );
}
