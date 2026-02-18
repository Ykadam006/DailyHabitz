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
    <div className="mt-4 rounded-lg border border-border bg-muted/30 p-4">
      <div className="mb-2 grid grid-cols-7 text-center text-sm font-medium text-muted-foreground">
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
              className={`flex h-8 items-center justify-center rounded-md transition-colors duration-150 hover:ring-2 hover:ring-offset-1 hover:ring-green-500/50 ${
                completed
                  ? "bg-green-500 text-white dark:bg-green-600"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {format(day, "d")}
            </div>
          );
        })}
      </div>
    </div>
  );
}
