export const API_BASE = "http://localhost:5050/habits";

// Create a new habit
export async function createHabit(habit: {
  title: string;
  frequency: string;
  notes?: string;
}) {
  try {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(habit),
    });

    if (!res.ok) {
      const error = await res.json();
      console.error("Server responded with:", error);
      throw new Error("Failed to create habit");
    }

    return res.json();
  } catch (err) {
    console.error("Fetch error:", err);
    throw err;
  }
}

// Fetch all habits
export async function getHabits() {
  try {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error("Failed to fetch habits");
    return res.json();
  } catch (err) {
    console.error("Fetch error:", err);
    throw err;
  }
}

// Mark a habit as done for today
export async function markHabitDone(id: string) {
  try {
    const res = await fetch(`${API_BASE}/${id}/done`, {
      method: "PUT",
    });

    if (!res.ok) throw new Error("Failed to mark habit as done");

    return res.json();
  } catch (err) {
    console.error("Mark done error:", err);
    throw err;
  }
}

// Delete a habit
export async function deleteHabit(id: string) {
  try {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete habit");
  } catch (err) {
    console.error("Delete habit error:", err);
    throw err;
  }
}

// Update a habit's info
export async function updateHabit(id: string, updates: Partial<{
  title: string;
  frequency: string;
  notes: string;
}>) {
  try {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!res.ok) throw new Error("Failed to update habit");

    return res.json();
  } catch (err) {
    console.error("Update error:", err);
    throw err;
  }
}
