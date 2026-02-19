import { format, startOfWeek, endOfWeek } from "date-fns";

const DAY_KEY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/** Get today's day key (YYYY-MM-DD) in local timezone */
export function getTodayKey(): string {
  return format(new Date(), "yyyy-MM-dd");
}

/** Check if a day key matches today */
export function isCompletedToday(dayKey: string): boolean {
  return dayKey === getTodayKey();
}

/** Check if a day key falls within the current week (Mon–Sun) */
export function isInThisWeek(dayKey: string): boolean {
  if (!DAY_KEY_REGEX.test(dayKey)) return false;
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
  const startKey = format(weekStart, "yyyy-MM-dd");
  const endKey = format(weekEnd, "yyyy-MM-dd");
  return dayKey >= startKey && dayKey <= endKey;
}

/** Check if a day key matches a given Date (for calendar) */
export function isSameDayKey(dayKey: string, date: Date): boolean {
  return dayKey === format(date, "yyyy-MM-dd");
}
