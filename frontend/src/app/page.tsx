import HabitForm from "../components/HabitForm";
import HabitList from "../components/HabitList";

export default function HomePage() {
  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📋 Habit Tracker</h1>
      <HabitForm />
      <HabitList />
    </main>
  );
}