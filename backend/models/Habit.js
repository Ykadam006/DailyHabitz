const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema({
  title: String,
  frequency: String,
  notes: String,
  currentStreak: { type: Number, default: 0 },
  xp: { type: Number, default: 0 },
  completedDates: [Date],
  userId: String, // 👈 New field
});

module.exports = mongoose.model("Habit", habitSchema);
