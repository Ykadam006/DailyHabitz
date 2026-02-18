const BASE = process.env.NEXT_PUBLIC_API_URL || "https://dailyhabitz.onrender.com";
export const API_BASE = `${BASE}/habits`;
export const HEALTH_URL = `${BASE}/health`;

/** Warm up backend (e.g. Render free tier) - call on landing page load */
export async function warmUpBackend(): Promise<void> {
  try {
    await fetch(HEALTH_URL);
  } catch {
    // Silently ignore - backend may be cold; user will wait when they navigate
  }
}

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
  const res = await fetch(`${API_BASE}/${habitId}/done`, {
    method: "POST",
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

export async function updateHabit(
  id: string,
  updatedData: { title?: string; frequency?: string; notes?: string }
) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData),
  });

  if (!res.ok) throw new Error("Failed to update habit");

  return res.json();
}
