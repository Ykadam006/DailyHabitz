import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/nextauth/route";
import { redirect } from "next/navigation";
import HabitForm from "@/components/HabitForm";
import HabitList from "@/components/HabitList";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  return (
    <main className="min-h-screen bg-[#f1f7ed] px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-[#243E36]">
          👋 Welcome, {session.user?.name || session.user?.email}!
        </h1>

        <HabitForm userId={session.user.id} />
        <HabitList userId={session.user.id} />
      </div>
    </main>
  );
}
