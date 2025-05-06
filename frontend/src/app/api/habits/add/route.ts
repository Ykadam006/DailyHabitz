import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userEmail = session.user?.email;
  try {
    const client = await clientPromise;
    const db = client.db("dailyhabitz");

    const habits = await db
      .collection("habits")
      .find({ userEmail })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ habits });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch habits" }, { status: 500 });
  }
}
