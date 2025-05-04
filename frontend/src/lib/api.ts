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

export async function markHabitDone(id: string) {
  const res = await fetch(`${API_BASE}/${id}/done`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to mark done");
  return res.json();
}

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