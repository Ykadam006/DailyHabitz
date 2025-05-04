const Habit = require("../models/Habit");
const { isSameDay } = require("date-fns");

// Create a new habit
const createHabit = async (req, res) => {
  try {
    console.log("➡️ Create Habit Called:", req.body);
    const { title, frequency, notes, userId } = req.body;

    const newHabit = await Habit.create({
      title,
      frequency,
      notes,
      userId,
    });

    res.status(201).json(newHabit);
  } catch (error) {
    console.error("❌ Error creating habit:", error);
    res.status(500).json({ message: "Failed to create habit", error });
  }
};

// Get all habits
const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find().sort({ createdAt: -1 }); // newest first
    res.status(200).json(habits);
  } catch (error) {
    console.error("❌ Error fetching habits:", error);
    res.status(500).json({ message: "Failed to fetch habits", error });
  }
};

// Mark habit as done (only once per day)
const markHabitDone = async (req, res) => {
  try {
    const { id } = req.params;
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0); // normalize

    const habit = await Habit.findById(id);
    if (!habit) return res.status(404).json({ message: "Habit not found" });

    const alreadyCompleted = habit.completedDates.some((date) =>
      isSameDay(new Date(date), today)
    );

    if (!alreadyCompleted) {
      habit.completedDates.push(today);
      habit.xp += 10;
      habit.currentStreak += 1;
      if (habit.currentStreak > habit.longestStreak) {
        habit.longestStreak = habit.currentStreak;
      }
      await habit.save();
    }

    res.status(200).json(habit);
  } catch (error) {
    console.error("❌ Error marking habit as done:", error);
    res.status(500).json({ message: "Failed to mark habit done", error });
  }
};

// Update habit info
const updateHabit = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Habit.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    console.error("❌ Error updating habit:", error);
    res.status(500).json({ message: "Failed to update habit", error });
  }
};

// Delete habit
const deleteHabit = async (req, res) => {
  try {
    const { id } = req.params;
    await Habit.findByIdAndDelete(id);
    res.status(204).send(); // No content
  } catch (error) {
    console.error("❌ Error deleting habit:", error);
    res.status(500).json({ message: "Failed to delete habit", error });
  }
};

module.exports = {
  createHabit,
  getHabits,
  markHabitDone,
  updateHabit,
  deleteHabit,
};
