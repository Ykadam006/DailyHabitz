import { format, subDays, isSameDay } from "date-fns";

type Props = {
  completedDates: string[];
};

const daysToShow = 30; // past 30 days

export default function HabitCalendar({ completedDates }: Props) {
  const today = new Date();
  const days = Array.from({ length: daysToShow }, (_, i) =>
    subDays(today, daysToShow - i - 1)
  );

  return (
    <div className="mt-2 grid grid-cols-7 gap-1 text-xs">
      {days.map((day, idx) => {
        const completed = completedDates.some((dateStr) =>
          isSameDay(new Date(dateStr), day)
        );
        return (
          <div
            key={idx}
            title={format(day, "MMM d")}
            className={`h-4 w-4 rounded-sm ${
              completed ? "bg-green-600" : "bg-gray-300"
            }`}
          />
        );
      })}
    </div>
  );
}
