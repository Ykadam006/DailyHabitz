import { NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL || "https://dailyhabitz.onrender.com";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);
    const res = await fetch(`${BACKEND}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[proxy/register] Backend unreachable:", err instanceof Error ? err.message : err);
    const message =
      err instanceof Error && err.name === "AbortError"
        ? "Backend is starting up. Please try again in 30 seconds."
        : "Cannot reach backend. Is it running? (cd backend && npm run dev)";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
