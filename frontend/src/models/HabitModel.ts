/**
 * Type-only model matching backend Habit schema.
 * Used for type references; API calls use lib/api.ts.
 */
export interface HabitDocument {
  _id: string;
  title: string;
  frequency: string;
  notes?: string;
  currentStreak: number;
  xp: number;
  completedDates: string[];
  userId: string;
}
