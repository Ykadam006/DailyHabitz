const BASE = process.env.NEXT_PUBLIC_API_URL || "https://dailyhabitz.onrender.com";
export const API_BASE = `${BASE}/habits`;
export const AUTH_URL = `${BASE}/auth`;
export const HEALTH_URL = `${BASE}/health`;

export async function logoutBackend(token: string | undefined): Promise<void> {
  if (!token) return;
  try {
    await fetch(`${AUTH_URL}/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    // Ignore - user is logging out anyway
  }
}

export type RefreshResult = { token: string; user: { id: string; email: string; name: string } } | null;

export async function refreshBackendToken(token: string): Promise<RefreshResult> {
  const res = await fetch(`${AUTH_URL}/refresh`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data?.token && data?.user ? data : null;
}

/** Warm up backend (e.g. Render free tier) - call on landing page load */
export async function warmUpBackend(): Promise<void> {
  try {
    await fetch(HEALTH_URL);
  } catch {
    // Silently ignore - backend may be cold; user will wait when they navigate
  }
}

/** Create headers with auth token for authenticated requests */
export function authHeaders(token: string | undefined): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export type CreateHabitInput = {
  title: string;
  frequency: string;
  notes?: string;
  category?: string;
  goal?: number;
  reminderTime?: string;
};

export async function createHabit(
  habit: CreateHabitInput,
  token: string
) {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(habit),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string })?.error || "Failed to create habit");
  }
  return res.json().catch(() => {
    throw new Error("Invalid response from server");
  });
}

export async function getHabits(token: string) {
  const res = await fetch(API_BASE, {
    headers: authHeaders(token),
  });
  if (!res.ok) {
    if (res.status === 401) throw new Error("Authentication required");
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string })?.error || "Failed to fetch habits");
  }
  return res.json().catch(() => {
    throw new Error("Invalid response from server");
  });
}

export const markHabitDone = async (
  habitId: string,
  token: string,
  date?: string
) => {
  const url = date
    ? `${API_BASE}/${habitId}/done?date=${encodeURIComponent(date)}`
    : `${API_BASE}/${habitId}/done`;
  const res = await fetch(url, {
    method: "POST",
    headers: authHeaders(token),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string })?.error || "Failed to mark habit as done");
  }

  return res.json().catch(() => {
    throw new Error("Invalid response from server");
  });
};

export async function deleteHabit(id: string, token: string) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string })?.error || "Failed to delete habit");
  }
}

export type UpdateHabitInput = {
  title?: string;
  frequency?: string;
  notes?: string;
  category?: string;
  goal?: number;
  reminderTime?: string;
};

export async function updateHabit(
  id: string,
  updatedData: UpdateHabitInput,
  token: string
) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(updatedData),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string })?.error || "Failed to update habit");
  }

  return res.json().catch(() => {
    throw new Error("Invalid response from server");
  });
}

export async function registerUser(data: {
  email: string;
  password: string;
  name?: string;
}) {
  const url = "/api/proxy/register";
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const dataRes = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      res.status === 503
        ? dataRes.error || "Backend not reachable. Run: cd backend && npm run dev"
        : dataRes?.error || "Registration failed"
    );
  }
  return dataRes;
}
