export const API_BASE = "http://localhost:5050/habits";

export async function createHabit(habit: {
  title: string;
  frequency: string;
  notes?: string;
  userId: string;
}) {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(habit),
  });
  if (!res.ok) throw new Error("Failed to create habit");
  return res.json();
}

export async function getHabits(userId: string) {
  const res = await fetch(`${API_BASE}?userId=${userId}`);
  if (!res.ok) throw new Error("Failed to fetch habits");
  return res.json();
}

export const markHabitDone = async (habitId: string) => {
  const res = await fetch(`http://localhost:5050/habits/${habitId}/done`, {
    method: "POST", // Make sure it's POST
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error || "Failed to mark habit as done");
  }

  return res.json();
};

export async function deleteHabit(id: string) {
  const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete habit");
}

export async function updateHabit(id: string, updatedData: any) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData),
  });

  if (!res.ok) throw new Error("Failed to update habit");

  return res.json();
}

export const addHabit = async (title: string, userId: string) => {
  const response = await fetch("/api/habits", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, userId }),
  });

  if (!response.ok) {
    throw new Error("Failed to add habit");
  }

  return response.json();
};
