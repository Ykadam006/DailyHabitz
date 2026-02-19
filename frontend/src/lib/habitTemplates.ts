export const HABIT_TEMPLATES = [
  { title: "Drink Water", frequency: "daily" as const, category: "Health" },
  { title: "Workout", frequency: "daily" as const, category: "Health" },
  { title: "Read", frequency: "daily" as const, category: "Mind" },
  { title: "Meditate", frequency: "daily" as const, category: "Mind" },
  { title: "Sleep", frequency: "daily" as const, category: "Health" },
  { title: "Study", frequency: "daily" as const, category: "Study" },
  { title: "Journal", frequency: "daily" as const, category: "Mind" },
] as const;

export const HABIT_CATEGORIES = [
  "Health",
  "Study",
  "Career",
  "Mind",
] as const;
