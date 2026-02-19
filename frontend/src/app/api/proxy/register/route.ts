import { NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const res = await fetch(`${BACKEND}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json(
      { error: "Cannot reach backend. Is it running? (cd backend && npm run dev)" },
      { status: 503 }
    );
  }
}
