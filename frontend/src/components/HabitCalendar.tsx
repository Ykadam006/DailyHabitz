import { format, subDays, isSameDay, startOfToday } from "date-fns";

type Props = {
  completedDates: string[];
};

const daysToShow = 30;

export default function HabitCalendar({ completedDates }: Props) {
  const today = startOfToday();
  const days = Array.from({ length: daysToShow }, (_, i) =>
    subDays(today, daysToShow - i - 1)
  );

  const weekdays = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div className="mt-2">
      <div className="grid grid-cols-7 text-xs font-medium text-center text-gray-600 mb-1">
        {weekdays.map((d, i) => (
          <div key={i}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 text-[10px] text-center">
        {days.map((day, idx) => {
          const completed = completedDates.some((dateStr) =>
            isSameDay(new Date(dateStr), day)
          );
          return (
            <div
              key={idx}
              title={format(day, "PP")}
              className={`flex flex-col items-center justify-center rounded-sm h-10 ${
                completed ? "bg-green-600 text-white" : "bg-gray-300"
              }`}
            >
              <span className="font-semibold">{format(day, "d")}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
