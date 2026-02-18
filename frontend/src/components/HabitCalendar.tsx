import { format, subDays, isSameDay, startOfToday } from "date-fns";

type Props = {
  completedDates: string[];
};

const daysToShow = 35; // 5 weeks for a clean grid

export default function HabitCalendar({ completedDates }: Props) {
  const today = startOfToday();
  const days = Array.from({ length: daysToShow }, (_, i) =>
    subDays(today, daysToShow - i - 1)
  );

  const weekdays = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div className="mt-4 bg-white p-4 rounded-lg shadow-md border border-gray-200">
      <div className="grid grid-cols-7 text-sm font-medium text-center text-gray-600 mb-2">
        {weekdays.map((d, i) => (
          <div key={i} className="uppercase">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {days.map((day, idx) => {
          const completed = completedDates.some((dateStr) =>
            isSameDay(new Date(dateStr), day)
          );
          return (
            <div
              key={idx}
              title={format(day, "PPP")}
              className={`flex items-center justify-center h-8 rounded-md transition-colors duration-150 ${
                completed
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-500"
              } hover:ring-2 hover:ring-offset-1 hover:ring-green-400`}
            >
              {format(day, "d")}
            </div>
          );
        })}
      </div>
    </div>
  );
}
