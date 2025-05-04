const mongoose = require("mongoose");

const HabitSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly"],
      default: "daily",
    },
    completedDates: [
      {
        type: Date,
      },
    ],
    currentStreak: {
      type: Number,
      default: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
    xp: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      default: "",
    },
    userId: {
      type: String, // In the future you can relate this to a user system
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Habit", HabitSchema);
