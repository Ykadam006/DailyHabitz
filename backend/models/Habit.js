const mongoose = require("mongoose");

const DAY_KEY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function toDayKey(d) {
  if (typeof d === "string" && DAY_KEY_REGEX.test(d)) return d;
  try {
    return new Date(d).toISOString().slice(0, 10);
  } catch {
    return null;
  }
}

const habitSchema = new mongoose.Schema(
  {
    title: String,
    frequency: String,
    notes: String,
    category: { type: String, default: null },
    goal: { type: Number, default: null },
    reminderTime: { type: String, default: null },
    currentStreak: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    completedDates: {
      type: [String],
      set: (arr) =>
        (arr || [])
          .map(toDayKey)
          .filter(Boolean)
          .reduce((acc, k) => (acc.includes(k) ? acc : [...acc, k]), [])
          .sort(),
    },
    userId: String,
  },
  { timestamps: true }
);

habitSchema.index({ userId: 1 });
habitSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Habit", habitSchema);
